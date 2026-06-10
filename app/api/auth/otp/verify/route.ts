import { NextResponse } from "next/server";
import { OtpPurpose, UserStatus } from "@prisma/client";
import { z } from "zod";
import { verifyOtpChallenge } from "@/lib/otp-service";
import { handleApiError, validationError } from "@/lib/api-error";
import { prisma } from "@/lib/prisma";

const schema = z.object({ challengeId: z.string().min(1), phone: z.string().min(10), code: z.string().length(6) });

export async function POST(request: Request) {
  try {
    const parsed = schema.safeParse(await request.json());
    if (!parsed.success) return validationError(parsed.error.flatten());
    const challenge = await verifyOtpChallenge({ challengeId: parsed.data.challengeId, identifier: parsed.data.phone, code: parsed.data.code, purpose: OtpPurpose.PHONE_LOGIN });
    if (challenge.userId) {
      await prisma.user.update({ where: { id: challenge.userId }, data: { phoneVerified: new Date(), status: UserStatus.ACTIVE } });
    }
    return NextResponse.json({ verified: true, challengeId: challenge.id, note: "Use the mobile-otp NextAuth credentials provider to establish a session." });
  } catch (error) {
    return handleApiError(error, { route: "POST /api/auth/otp/verify" });
  }
}
