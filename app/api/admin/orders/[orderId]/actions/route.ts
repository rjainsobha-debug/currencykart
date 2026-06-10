import { NextResponse } from "next/server";
import { UserRole } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { applyAdminOrderAction } from "@/lib/order-workflow";
import { adminOrderActionSchema } from "@/lib/validations";
import { requireAdminRole } from "@/lib/authz";
import { enforceRateLimit, requestIdentifier } from "@/lib/rate-limit";
import { handleApiError, validationError } from "@/lib/api-error";

const actionRoles: Record<string, UserRole[]> = {
  APPROVE_ORDER: [UserRole.ADMIN, UserRole.SUPPORT_AGENT],
  REJECT_ORDER: [UserRole.ADMIN, UserRole.SUPPORT_AGENT],
  APPROVE_KYC: [UserRole.ADMIN, UserRole.KYC_REVIEWER],
  REJECT_KYC: [UserRole.ADMIN, UserRole.KYC_REVIEWER],
  LOCK_RATE: [UserRole.ADMIN, UserRole.RATE_MANAGER],
  VERIFY_PAYMENT: [UserRole.ADMIN],
  REJECT_PAYMENT: [UserRole.ADMIN],
  START_PROCESSING: [UserRole.ADMIN, UserRole.DELIVERY_MANAGER],
  MARK_OUT_FOR_DELIVERY: [UserRole.ADMIN, UserRole.DELIVERY_MANAGER],
  COMPLETE_ORDER: [UserRole.ADMIN, UserRole.DELIVERY_MANAGER],
  CANCEL_ORDER: [UserRole.ADMIN],
  GENERATE_INVOICE: [UserRole.ADMIN]
};

export async function POST(request: Request, context: { params: Promise<{ orderId: string }> }) {
  const { orderId } = await context.params;
  try {
    const parsed = adminOrderActionSchema.safeParse(await request.json());
    if (!parsed.success) return validationError(parsed.error.flatten());
    const user = await requireAdminRole(actionRoles[parsed.data.action] ?? [UserRole.ADMIN], {
      action: parsed.data.action,
      entityType: "Order",
      entityId: orderId,
      ipAddress: request.headers.get("x-forwarded-for") ?? undefined
    });
    enforceRateLimit("admin", requestIdentifier(request, user.id));
    const result = await applyAdminOrderAction(prisma, orderId, {
      ...parsed.data,
      actorId: user.id,
      ipAddress: request.headers.get("x-forwarded-for") ?? undefined
    });
    return NextResponse.json(result);
  } catch (error) {
    return handleApiError(error, { route: "POST /api/admin/orders/[orderId]/actions", orderId });
  }
}
