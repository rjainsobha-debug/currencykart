import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireOrderOwner } from "@/lib/authz";
import { createStorageDownloadUrl } from "@/lib/integrations";
import { ApiError, handleApiError } from "@/lib/api-error";

export async function GET(_request: Request, context: { params: Promise<{ orderId: string }> }) {
  const { orderId } = await context.params;
  try {
    await requireOrderOwner(orderId);
    const order = await prisma.order.findUnique({ where: { id: orderId }, select: { invoiceUrl: true, invoiceNumber: true } });
    if (!order?.invoiceUrl) throw new ApiError(404, "Invoice is not available yet.", "INVOICE_NOT_READY");
    const signed = await createStorageDownloadUrl(order.invoiceUrl);
    return NextResponse.json({ invoiceNumber: order.invoiceNumber, ...signed });
  } catch (error) {
    return handleApiError(error, { route: "GET /api/orders/[orderId]/invoice", orderId });
  }
}
