import { NextResponse } from "next/server";
import { OtpPurpose, UserRole } from "@prisma/client";
import { z } from "zod";
import { requireAdminRole } from "@/lib/authz";
import { verifyOtpChallenge } from "@/lib/otp-service";
import { adminTwoFactorCookieName, createAdminTwoFactorToken } from "@/lib/admin-2fa";
import { ApiError, handleApiError, validationError } from "@/lib/api-error";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const staffRoles = [UserRole.ADMIN, UserRole.KYC_REVIEWER, UserRole.RATE_MANAGER, UserRole.DELIVERY_MANAGER, UserRole.SUPPORT_AGENT];
const schema = z.object({ challengeId: z.string().min(1), code: z.string().length(6) });

export async function POST(request: Request) {
  try {
    const user = await requireAdminRole(staffRoles, { action: "ADMIN_2FA_VERIFY", ipAddress: request.headers.get("x-forwarded-for") ?? undefined });
    if (!user.phone) throw new ApiError(409, "A verified staff phone number is required for 2FA.", "ADMIN_PHONE_REQUIRED");
    const parsed = schema.safeParse(await request.json());
    if (!parsed.success) return validationError(parsed.error.flatten());
    await verifyOtpChallenge({ challengeId: parsed.data.challengeId, identifier: user.phone, code: parsed.data.code, purpose: OtpPurpose.ADMIN_2FA });
    const token = createAdminTwoFactorToken(user.id);
    const response = NextResponse.json({ verified: true, expiresAt: token.expires });
    response.cookies.set(adminTwoFactorCookieName, token.value, { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax", path: "/", expires: token.expires });
    return response;
  } catch (error) {
    return handleApiError(error, { route: "POST /api/admin/2fa/verify" });
  }
}
