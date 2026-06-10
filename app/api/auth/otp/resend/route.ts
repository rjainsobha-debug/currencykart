import { NextResponse } from "next/server";
import { OtpPurpose } from "@prisma/client";
import { z } from "zod";
import { requestOtpChallenge } from "@/lib/otp-service";
import { handleApiError, validationError } from "@/lib/api-error";
import { prisma } from "@/lib/prisma";
import { enforceRateLimit, requestIdentifier } from "@/lib/rate-limit";

const schema = z.object({ phone: z.string().min(10).max(15) });

export async function POST(request: Request) {
  try {
    enforceRateLimit("otp", requestIdentifier(request));
    const parsed = schema.safeParse(await request.json());
    if (!parsed.success) return validationError(parsed.error.flatten());
    const user = await prisma.user.findUnique({ where: { phone: parsed.data.phone }, select: { id: true } });
    return NextResponse.json(await requestOtpChallenge({ identifier: parsed.data.phone, purpose: OtpPurpose.PHONE_LOGIN, userId: user?.id }));
  } catch (error) {
    return handleApiError(error, { route: "POST /api/auth/otp/resend" });
  }
}
