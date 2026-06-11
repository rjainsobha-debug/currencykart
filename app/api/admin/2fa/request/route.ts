import { NextResponse } from "next/server";
import { OtpPurpose, UserRole } from "@prisma/client";
import { requireAdminRole } from "@/lib/authz";
import { requestOtpChallenge } from "@/lib/otp-service";
import { ApiError, handleApiError } from "@/lib/api-error";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const staffRoles = [UserRole.ADMIN, UserRole.KYC_REVIEWER, UserRole.RATE_MANAGER, UserRole.DELIVERY_MANAGER, UserRole.SUPPORT_AGENT];

export async function POST(request: Request) {
  try {
    const user = await requireAdminRole(staffRoles, { action: "ADMIN_2FA_REQUEST", ipAddress: request.headers.get("x-forwarded-for") ?? undefined });
    if (!user.phone) throw new ApiError(409, "A verified staff phone number is required for 2FA.", "ADMIN_PHONE_REQUIRED");
    return NextResponse.json(await requestOtpChallenge({ identifier: user.phone, purpose: OtpPurpose.ADMIN_2FA, userId: user.id }));
  } catch (error) {
    return handleApiError(error, { route: "POST /api/admin/2fa/request" });
  }
}
