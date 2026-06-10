import { getServerSession } from "next-auth";
import { UserRole } from "@prisma/client";
import { authOptions } from "./auth";
import { ApiError } from "./api-error";
import { prisma } from "./prisma";
import { logger } from "./logger";
import { cookies } from "next/headers";
import { adminTwoFactorCookieName, verifyAdminTwoFactorToken } from "./admin-2fa";

export type AuthenticatedUser = { id: string; role: UserRole; email?: string | null; phone?: string | null; adminTwoFactorEnabled: boolean };

export async function requireUser(): Promise<AuthenticatedUser> {
  const session = await getServerSession(authOptions);
  const id = session?.user?.id;
  if (!id) throw new ApiError(401, "Authentication required.", "UNAUTHENTICATED");
  const currentUser = await prisma.user.findUnique({ where: { id }, select: { role: true, status: true, email: true, phone: true, adminTwoFactorEnabled: true } });
  if (!currentUser || currentUser.status !== "ACTIVE") {
    throw new ApiError(401, "Your session is no longer active.", "SESSION_INACTIVE");
  }
  return { id, role: currentUser.role, email: currentUser.email, phone: currentUser.phone, adminTwoFactorEnabled: currentUser.adminTwoFactorEnabled };
}

export async function logFailedAdminAttempt(input: {
  actorId?: string;
  action: string;
  entityType: string;
  entityId: string;
  reason: string;
  ipAddress?: string;
}) {
  logger.warn("Denied admin action", input);
  try {
    await prisma.auditLog.create({
      data: {
        actorId: input.actorId,
        action: `DENIED_${input.action}`,
        entityType: input.entityType,
        entityId: input.entityId,
        newValue: { reason: input.reason },
        ipAddress: input.ipAddress
      }
    });
  } catch (error) {
    logger.error("Failed to persist denied admin attempt", error, input);
  }
}

export async function requireAdminRole(
  allowed: UserRole[],
  context: { action: string; entityType?: string; entityId?: string; ipAddress?: string }
) {
  let user: AuthenticatedUser;
  try {
    user = await requireUser();
  } catch (error) {
    await logFailedAdminAttempt({
      action: context.action,
      entityType: context.entityType ?? "AdminRoute",
      entityId: context.entityId ?? "unknown",
      reason: "Unauthenticated request",
      ipAddress: context.ipAddress
    });
    throw error;
  }
  if (!allowed.includes(user.role)) {
    await logFailedAdminAttempt({
      actorId: user.id,
      action: context.action,
      entityType: context.entityType ?? "AdminRoute",
      entityId: context.entityId ?? "unknown",
      reason: `Role ${user.role} is not allowed`,
      ipAddress: context.ipAddress
    });
    throw new ApiError(403, "You do not have permission for this action.", "FORBIDDEN");
  }
  if ((process.env.ADMIN_2FA_REQUIRED === "true" || user.adminTwoFactorEnabled) && context.action !== "ADMIN_2FA_REQUEST" && context.action !== "ADMIN_2FA_VERIFY") {
    const cookieStore = await cookies();
    if (!verifyAdminTwoFactorToken(cookieStore.get(adminTwoFactorCookieName)?.value, user.id)) {
      await logFailedAdminAttempt({
        actorId: user.id,
        action: context.action,
        entityType: context.entityType ?? "AdminRoute",
        entityId: context.entityId ?? "unknown",
        reason: "Admin 2FA verification required",
        ipAddress: context.ipAddress
      });
      throw new ApiError(403, "Administrator two-factor verification is required.", "ADMIN_2FA_REQUIRED");
    }
  }
  return user;
}

export async function requireOrderOwner(orderId: string) {
  const user = await requireUser();
  const order = await prisma.order.findUnique({ where: { id: orderId }, select: { userId: true } });
  if (!order) throw new ApiError(404, "Order not found.", "NOT_FOUND");
  const staffRoles: UserRole[] = [UserRole.ADMIN, UserRole.KYC_REVIEWER, UserRole.RATE_MANAGER, UserRole.DELIVERY_MANAGER, UserRole.SUPPORT_AGENT];
  if (order.userId !== user.id && !staffRoles.includes(user.role)) {
    throw new ApiError(403, "You cannot access this order.", "ORDER_OWNERSHIP_REQUIRED");
  }
  return user;
}
