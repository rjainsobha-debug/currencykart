import { createHash } from "node:crypto";
import { NextResponse } from "next/server";
import { OrderEventType, OrderStatus, PaymentStatus, WebhookStatus } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { verifyPaymentWebhook } from "@/lib/integrations";
import { ApiError, handleApiError } from "@/lib/api-error";
import { logger } from "@/lib/logger";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

type RazorpayPayload = {
  event?: string;
  payload?: {
    payment?: { entity?: { id?: string; order_id?: string; notes?: { orderNumber?: string }; amount?: number } };
    order?: { entity?: { id?: string; receipt?: string } };
  };
};

export async function POST(request: Request) {
  const rawPayload = await request.text();
  const payloadHash = createHash("sha256").update(rawPayload).digest("hex");
  const signature = request.headers.get("x-razorpay-signature") ?? "";
  const providerEventId = request.headers.get("x-razorpay-event-id") ?? payloadHash;

  try {
    const verification = await verifyPaymentWebhook(rawPayload, signature);
    if (!verification.valid) {
      await prisma.webhookEvent.upsert({
        where: { provider_eventId: { provider: "razorpay", eventId: providerEventId } },
        update: { status: WebhookStatus.REJECTED, error: "Invalid signature" },
        create: { provider: "razorpay", eventId: providerEventId, eventType: "unknown", payloadHash, status: WebhookStatus.REJECTED, error: "Invalid signature" }
      });
      throw new ApiError(401, "Webhook signature is invalid.", "INVALID_WEBHOOK_SIGNATURE");
    }

    const body = JSON.parse(rawPayload) as RazorpayPayload;
    const existing = await prisma.webhookEvent.findUnique({ where: { provider_eventId: { provider: "razorpay", eventId: providerEventId } } });
    if (existing?.status === WebhookStatus.PROCESSED) return NextResponse.json({ received: true, duplicate: true });

    await prisma.webhookEvent.upsert({
      where: { provider_eventId: { provider: "razorpay", eventId: providerEventId } },
      update: { eventType: body.event ?? "unknown", payloadHash, status: WebhookStatus.RECEIVED, error: null },
      create: { provider: "razorpay", eventId: providerEventId, eventType: body.event ?? "unknown", payloadHash }
    });

    if (body.event === "payment.captured") {
      const paymentEntity = body.payload?.payment?.entity;
      const orderNumber = paymentEntity?.notes?.orderNumber ?? body.payload?.order?.entity?.receipt;
      if (!orderNumber) throw new ApiError(422, "Order reference is missing from webhook.", "WEBHOOK_ORDER_REFERENCE_MISSING");
      const order = await prisma.order.findUnique({ where: { orderNumber } });
      if (!order) throw new ApiError(404, "Referenced order was not found.", "WEBHOOK_ORDER_NOT_FOUND");

      await prisma.$transaction(async (tx) => {
        await tx.payment.upsert({
          where: { orderId: order.id },
          update: { providerPaymentId: paymentEntity?.id, status: PaymentStatus.VERIFIED, verifiedAt: new Date(), verificationNotes: "Verified by signed Razorpay webhook." },
          create: { orderId: order.id, provider: "razorpay", providerPaymentId: paymentEntity?.id, amount: order.totalInINR, status: PaymentStatus.VERIFIED, verifiedAt: new Date(), verificationNotes: "Verified by signed Razorpay webhook." }
        });
        const payableStatuses: OrderStatus[] = [OrderStatus.RATE_LOCKED, OrderStatus.PAYMENT_PENDING];
        if (payableStatuses.includes(order.status)) {
          await tx.order.update({ where: { id: order.id }, data: { status: OrderStatus.PAYMENT_VERIFIED, paymentStatus: PaymentStatus.VERIFIED } });
        }
        await tx.orderEvent.create({ data: { orderId: order.id, type: OrderEventType.PAYMENT_VERIFIED, title: "Payment verified", message: "Confirmed by signed Razorpay webhook." } });
        await tx.auditLog.create({ data: { action: "RAZORPAY_PAYMENT_WEBHOOK_VERIFIED", entityType: "Order", entityId: order.id, newValue: { providerPaymentId: paymentEntity?.id, eventId: providerEventId } } });
        await tx.webhookEvent.update({ where: { provider_eventId: { provider: "razorpay", eventId: providerEventId } }, data: { status: WebhookStatus.PROCESSED, processedAt: new Date() } });
      });
    } else {
      await prisma.webhookEvent.update({ where: { provider_eventId: { provider: "razorpay", eventId: providerEventId } }, data: { status: WebhookStatus.PROCESSED, processedAt: new Date() } });
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    logger.error("Razorpay webhook processing failed", error, { providerEventId, payloadHash });
    try {
      await prisma.webhookEvent.updateMany({ where: { provider: "razorpay", eventId: providerEventId }, data: { status: WebhookStatus.FAILED, error: error instanceof Error ? error.message : "Unknown error" } });
    } catch {}
    return handleApiError(error, { route: "POST /api/payments/razorpay/webhook", providerEventId });
  }
}
