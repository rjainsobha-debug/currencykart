import { createHmac, randomInt } from "node:crypto";
import { OtpPurpose } from "@prisma/client";
import { prisma } from "./prisma";
import { ApiError } from "./api-error";
import { requestOtpDelivery, verifyOtpDelivery } from "./integrations";

const OTP_EXPIRY_SECONDS = 5 * 60;
const RESEND_COOLDOWN_SECONDS = 60;
const MAX_ATTEMPTS = 5;

function hashCode(challengeId: string, code: string) {
  return createHmac("sha256", process.env.NEXTAUTH_SECRET ?? "development-secret").update(`${challengeId}:${code}`).digest("hex");
}

function generateCode() {
  return randomInt(100000, 1000000).toString();
}

export async function requestOtpChallenge(input: { identifier: string; purpose: OtpPurpose; userId?: string }) {
  const latest = await prisma.otpChallenge.findFirst({
    where: { identifier: input.identifier, purpose: input.purpose },
    orderBy: { createdAt: "desc" }
  });
  if (latest && latest.resendAvailableAt.getTime() > Date.now()) {
    throw new ApiError(429, "Please wait before requesting another OTP.", "OTP_RESEND_COOLDOWN");
  }

  const challenge = await prisma.otpChallenge.create({
    data: {
      identifier: input.identifier,
      purpose: input.purpose,
      userId: input.userId,
      provider: process.env.OTP_PROVIDER ?? "placeholder",
      providerRequestId: "pending",
      expiresAt: new Date(Date.now() + OTP_EXPIRY_SECONDS * 1000),
      resendAvailableAt: new Date(Date.now() + RESEND_COOLDOWN_SECONDS * 1000),
      maxAttempts: MAX_ATTEMPTS
    }
  });
  const code = (process.env.OTP_PROVIDER ?? "placeholder") === "placeholder" ? "123456" : generateCode();
  const delivery = await requestOtpDelivery(input.identifier, code, OTP_EXPIRY_SECONDS);
  const updated = await prisma.otpChallenge.update({
    where: { id: challenge.id },
    data: { providerRequestId: delivery.requestId, codeHash: hashCode(challenge.id, code) }
  });
  await prisma.auditLog.create({
    data: {
      actorId: input.userId,
      action: input.purpose === OtpPurpose.ADMIN_2FA ? "ADMIN_2FA_OTP_REQUESTED" : "PHONE_OTP_REQUESTED",
      entityType: "OtpChallenge",
      entityId: updated.id,
      newValue: { purpose: input.purpose, expiresAt: updated.expiresAt.toISOString() }
    }
  });
  return {
    challengeId: updated.id,
    expiresAt: updated.expiresAt,
    resendAvailableAt: updated.resendAvailableAt,
    maxAttempts: updated.maxAttempts
  };
}

export async function verifyOtpChallenge(input: { challengeId: string; identifier: string; code: string; purpose: OtpPurpose }) {
  const challenge = await prisma.otpChallenge.findUnique({ where: { id: input.challengeId } });
  if (!challenge || challenge.identifier !== input.identifier || challenge.purpose !== input.purpose) {
    throw new ApiError(404, "OTP challenge was not found.", "OTP_NOT_FOUND");
  }
  if (challenge.verifiedAt) return challenge;
  if (challenge.expiresAt.getTime() <= Date.now()) {
    await prisma.auditLog.create({ data: { actorId: challenge.userId, action: "OTP_VERIFICATION_EXPIRED", entityType: "OtpChallenge", entityId: challenge.id } });
    throw new ApiError(410, "OTP has expired.", "OTP_EXPIRED");
  }
  if (challenge.attempts >= challenge.maxAttempts) {
    await prisma.auditLog.create({ data: { actorId: challenge.userId, action: "OTP_ATTEMPTS_EXCEEDED", entityType: "OtpChallenge", entityId: challenge.id } });
    throw new ApiError(429, "Maximum OTP attempts reached.", "OTP_ATTEMPTS_EXCEEDED");
  }

  const attempt = challenge.attempts + 1;
  const result = challenge.provider === "placeholder"
    ? { verified: challenge.codeHash === hashCode(challenge.id, input.code) }
    : await verifyOtpDelivery({
        phone: input.identifier,
        code: input.code,
        requestId: challenge.providerRequestId,
        codeHash: challenge.codeHash
      });
  if (!result.verified) {
    await prisma.otpChallenge.update({ where: { id: challenge.id }, data: { attempts: attempt } });
    await prisma.auditLog.create({
      data: {
        actorId: challenge.userId,
        action: "OTP_VERIFICATION_FAILED",
        entityType: "OtpChallenge",
        entityId: challenge.id,
        newValue: { purpose: challenge.purpose, attempt }
      }
    });
    throw new ApiError(401, "OTP is invalid.", "OTP_INVALID");
  }

  const verified = await prisma.otpChallenge.update({
    where: { id: challenge.id },
    data: { attempts: attempt, verifiedAt: new Date() }
  });
  await prisma.auditLog.create({
    data: {
      actorId: challenge.userId,
      action: challenge.purpose === OtpPurpose.ADMIN_2FA ? "ADMIN_2FA_VERIFIED" : "PHONE_OTP_VERIFIED",
      entityType: "OtpChallenge",
      entityId: challenge.id
    }
  });
  return verified;
}
