import { NextResponse } from "next/server";
import { Prisma, UserRole } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { adminOrderFilterSchema } from "@/lib/validations";
import { requireAdminRole } from "@/lib/authz";
import { enforceRateLimit, requestIdentifier } from "@/lib/rate-limit";
import { handleApiError, validationError } from "@/lib/api-error";

const adminQueueRoles = [UserRole.ADMIN, UserRole.KYC_REVIEWER, UserRole.RATE_MANAGER, UserRole.DELIVERY_MANAGER, UserRole.SUPPORT_AGENT];

export async function GET(request: Request) {
  try {
    const user = await requireAdminRole(adminQueueRoles, { action: "LIST_ORDERS", ipAddress: request.headers.get("x-forwarded-for") ?? undefined });
    enforceRateLimit("admin", requestIdentifier(request, user.id));
    const url = new URL(request.url);
    const parsed = adminOrderFilterSchema.safeParse(Object.fromEntries(url.searchParams));
    if (!parsed.success) return validationError(parsed.error.flatten());
    const filters = parsed.data;
    const where: Prisma.OrderWhereInput = {
      status: filters.status ? (filters.status as Prisma.EnumOrderStatusFilter["equals"]) : undefined,
      currencyCode: filters.currency?.toUpperCase(),
      paymentStatus: filters.paymentStatus ? (filters.paymentStatus as Prisma.EnumPaymentStatusFilter["equals"]) : undefined,
      createdAt: filters.dateFrom || filters.dateTo ? {
        gte: filters.dateFrom ? new Date(filters.dateFrom) : undefined,
        lte: filters.dateTo ? new Date(filters.dateTo) : undefined
      } : undefined,
      user: filters.customer ? {
        OR: [
          { name: { contains: filters.customer, mode: "insensitive" } },
          { email: { contains: filters.customer, mode: "insensitive" } },
          { phone: { contains: filters.customer } }
        ]
      } : undefined
    };
    const orders = await prisma.order.findMany({
      where,
      include: { user: { select: { id: true, name: true, email: true, phone: true } }, payment: true },
      orderBy: { createdAt: "desc" },
      take: 100
    });
    return NextResponse.json({ orders, filters });
  } catch (error) {
    return handleApiError(error, { route: "GET /api/admin/orders" });
  }
}
