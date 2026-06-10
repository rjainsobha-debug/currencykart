import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getDocumentChecklist } from "@/lib/document-checklist";
import { isRateLockActive } from "@/lib/order-workflow";
import { requireOrderOwner } from "@/lib/authz";
import { ApiError, handleApiError } from "@/lib/api-error";

export async function GET(_request: Request, context: { params: Promise<{ orderId: string }> }) {
  const { orderId } = await context.params;
  try {
    await requireOrderOwner(orderId);
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        user: { select: { id: true, name: true, email: true, phone: true } },
        documents: { select: { id: true, type: true, status: true, uploadedAt: true } },
        payment: true,
        events: { orderBy: { createdAt: "asc" } }
      }
    });
    if (!order) throw new ApiError(404, "Order not found.", "NOT_FOUND");
    return NextResponse.json({
      order,
      checklist: getDocumentChecklist(order.type, order.purpose ?? "Travel"),
      rateLock: { active: isRateLockActive(order.rateLockExpiresAt), expiresAt: order.rateLockExpiresAt }
    });
  } catch (error) {
    return handleApiError(error, { route: "GET /api/orders/[orderId]", orderId });
  }
}
