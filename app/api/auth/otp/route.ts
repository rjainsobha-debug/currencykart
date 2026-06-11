import { NextResponse } from "next/server";
import { OtpPurpose } from "@prisma/client";
import { z } from "zod";
import { enforceRateLimit, requestIdentifier } from "@/lib/rate-limit";
import { handleApiError, validationError } from "@/lib/api-error";
import { requestOtpChallenge } from "@/lib/otp-service";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const otpSchema = z.object({ phone: z.string().min(10).max(15) });

export async function POST(request: Request) {
  try {
    enforceRateLimit("otp", requestIdentifier(request));
    const parsed = otpSchema.safeParse(await request.json());
    if (!parsed.success) return validationError(parsed.error.flatten());
    const user = await prisma.user.findUnique({ where: { phone: parsed.data.phone }, select: { id: true } });
    const challenge = await requestOtpChallenge({ identifier: parsed.data.phone, purpose: OtpPurpose.PHONE_LOGIN, userId: user?.id });
    return NextResponse.json(challenge);
  } catch (error) {
    return handleApiError(error, { route: "POST /api/auth/otp" });
  }
}
