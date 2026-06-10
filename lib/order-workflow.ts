import {
  KycStatus,
  OrderEventType,
  OrderStatus,
  PaymentStatus,
  Prisma,
  PrismaClient
} from "@prisma/client";
import { generateInvoicePdfPlaceholder, sendOrderEmail } from "./integrations";

type DbClient = PrismaClient | Prisma.TransactionClient;

const allowedTransitions: Partial<Record<OrderStatus, OrderStatus[]>> = {
  DRAFT: [OrderStatus.SUBMITTED, OrderStatus.CANCELLED],
  SUBMITTED: [OrderStatus.KYC_PENDING, OrderStatus.REJECTED, OrderStatus.CANCELLED],
  KYC_PENDING: [OrderStatus.KYC_APPROVED, OrderStatus.REJECTED, OrderStatus.CANCELLED],
  KYC_APPROVED: [OrderStatus.RATE_LOCKED, OrderStatus.REJECTED, OrderStatus.CANCELLED],
  RATE_LOCKED: [OrderStatus.PAYMENT_PENDING, OrderStatus.PAYMENT_VERIFIED, OrderStatus.CANCELLED],
  PAYMENT_PENDING: [OrderStatus.PAYMENT_VERIFIED, OrderStatus.REJECTED, OrderStatus.CANCELLED],
  PAYMENT_VERIFIED: [OrderStatus.PROCESSING, OrderStatus.REJECTED],
  PROCESSING: [OrderStatus.OUT_FOR_DELIVERY, OrderStatus.COMPLETED, OrderStatus.CANCELLED],
  OUT_FOR_DELIVERY: [OrderStatus.COMPLETED, OrderStatus.CANCELLED]
};

export function assertOrderTransition(current: OrderStatus, next: OrderStatus) {
  if (!allowedTransitions[current]?.includes(next)) {
    throw new Error(`Order cannot move from ${current} to ${next}`);
  }
}

export function isRateLockActive(expiresAt: Date | null | undefined) {
  return Boolean(expiresAt && expiresAt.getTime() > Date.now());
}

export function createInvoiceNumber(orderNumber: string) {
  return `INV-${new Date().getFullYear()}-${orderNumber.slice(-6)}`;
}

async function recordAdminAction(
  db: DbClient,
  input: {
    orderId: string;
    actorId: string;
    action: string;
    eventType: OrderEventType;
    title: string;
    message?: string;
    oldValue?: Prisma.InputJsonValue;
    newValue?: Prisma.InputJsonValue;
    ipAddress?: string;
  }
) {
  await db.orderEvent.create({
    data: {
      orderId: input.orderId,
      actorId: input.actorId,
      type: input.eventType,
      title: input.title,
      message: input.message,
      metadata: input.newValue
    }
  });
  await db.auditLog.create({
    data: {
      actorId: input.actorId,
      action: input.action,
      entityType: "Order",
      entityId: input.orderId,
      oldValue: input.oldValue,
      newValue: input.newValue,
      ipAddress: input.ipAddress
    }
  });
}

export async function applyAdminOrderAction(
  prisma: PrismaClient,
  orderId: string,
  input: {
    action: string;
    actorId: string;
    notes?: string;
    rate?: number;
    lockMinutes?: number;
    providerPaymentId?: string;
    ipAddress?: string;
  }
) {
  const result = await prisma.$transaction(async (tx) => {
    const order = await tx.order.findUniqueOrThrow({ where: { id: orderId }, include: { user: true, payment: true } });
    const oldValue = { status: order.status, kycStatus: order.kycStatus, paymentStatus: order.paymentStatus };
    let updated: Prisma.OrderGetPayload<Record<string, never>> = order;

    if (input.action === "APPROVE_ORDER") {
      if (order.status === OrderStatus.SUBMITTED) assertOrderTransition(order.status, OrderStatus.KYC_PENDING);
      updated = await tx.order.update({ where: { id: orderId }, data: { status: OrderStatus.KYC_PENDING, approvedBy: input.actorId, approvedAt: new Date(), adminNotes: input.notes } });
      await recordAdminAction(tx, { orderId, actorId: input.actorId, action: input.action, eventType: OrderEventType.ORDER_APPROVED, title: "Order accepted for review", message: input.notes, oldValue, newValue: { status: updated.status }, ipAddress: input.ipAddress });
    } else if (input.action === "REJECT_ORDER") {
      updated = await tx.order.update({ where: { id: orderId }, data: { status: OrderStatus.REJECTED, rejectionReason: input.notes } });
      await recordAdminAction(tx, { orderId, actorId: input.actorId, action: input.action, eventType: OrderEventType.ORDER_REJECTED, title: "Order rejected", message: input.notes, oldValue, newValue: { status: updated.status }, ipAddress: input.ipAddress });
    } else if (input.action === "APPROVE_KYC") {
      assertOrderTransition(order.status, OrderStatus.KYC_APPROVED);
      updated = await tx.order.update({ where: { id: orderId }, data: { status: OrderStatus.KYC_APPROVED, kycStatus: KycStatus.APPROVED, adminNotes: input.notes } });
      await tx.kycProfile.update({ where: { userId: order.userId }, data: { status: KycStatus.APPROVED, reviewedBy: input.actorId, reviewNotes: input.notes } });
      await recordAdminAction(tx, { orderId, actorId: input.actorId, action: input.action, eventType: OrderEventType.KYC_APPROVED, title: "KYC approved", message: input.notes, oldValue, newValue: { status: updated.status, kycStatus: updated.kycStatus }, ipAddress: input.ipAddress });
    } else if (input.action === "REJECT_KYC") {
      updated = await tx.order.update({ where: { id: orderId }, data: { status: OrderStatus.REJECTED, kycStatus: KycStatus.REJECTED, rejectionReason: input.notes } });
      await tx.kycProfile.update({ where: { userId: order.userId }, data: { status: KycStatus.REJECTED, reviewedBy: input.actorId, reviewNotes: input.notes } });
      await recordAdminAction(tx, { orderId, actorId: input.actorId, action: input.action, eventType: OrderEventType.KYC_REJECTED, title: "KYC rejected", message: input.notes, oldValue, newValue: { status: updated.status, kycStatus: updated.kycStatus }, ipAddress: input.ipAddress });
    } else if (input.action === "LOCK_RATE") {
      assertOrderTransition(order.status, OrderStatus.RATE_LOCKED);
      const lockMinutes = input.lockMinutes ?? 30;
      const expiresAt = new Date(Date.now() + lockMinutes * 60_000);
      const rate = input.rate ?? Number(order.rate);
      updated = await tx.order.update({ where: { id: orderId }, data: { status: OrderStatus.RATE_LOCKED, rate, totalInINR: Number(order.amount) * rate, rateLockedAt: new Date(), rateLockExpiresAt: expiresAt, paymentStatus: PaymentStatus.PENDING } });
      await recordAdminAction(tx, { orderId, actorId: input.actorId, action: input.action, eventType: OrderEventType.RATE_LOCKED, title: `Rate locked for ${lockMinutes} minutes`, oldValue, newValue: { status: updated.status, rate, expiresAt: expiresAt.toISOString() }, ipAddress: input.ipAddress });
    } else if (input.action === "VERIFY_PAYMENT") {
      const payableStatuses: OrderStatus[] = [OrderStatus.RATE_LOCKED, OrderStatus.PAYMENT_PENDING];
      if (!payableStatuses.includes(order.status)) {
        throw new Error(`Payment cannot be verified while order is ${order.status}`);
      }
      if (!isRateLockActive(order.rateLockExpiresAt)) throw new Error("Rate lock has expired. Re-lock the rate before verifying payment.");
      updated = await tx.order.update({ where: { id: orderId }, data: { status: OrderStatus.PAYMENT_VERIFIED, paymentStatus: PaymentStatus.VERIFIED } });
      await tx.payment.upsert({ where: { orderId }, update: { status: PaymentStatus.VERIFIED, providerPaymentId: input.providerPaymentId, verifiedBy: input.actorId, verifiedAt: new Date(), verificationNotes: input.notes }, create: { orderId, provider: "manual-verification", providerPaymentId: input.providerPaymentId, amount: order.totalInINR, status: PaymentStatus.VERIFIED, verifiedBy: input.actorId, verifiedAt: new Date(), verificationNotes: input.notes } });
      await recordAdminAction(tx, { orderId, actorId: input.actorId, action: input.action, eventType: OrderEventType.PAYMENT_VERIFIED, title: "Payment verified", message: input.notes, oldValue, newValue: { status: updated.status, paymentStatus: updated.paymentStatus }, ipAddress: input.ipAddress });
    } else if (input.action === "REJECT_PAYMENT") {
      updated = await tx.order.update({ where: { id: orderId }, data: { status: OrderStatus.PAYMENT_PENDING, paymentStatus: PaymentStatus.FAILED, adminNotes: input.notes } });
      await tx.payment.updateMany({ where: { orderId }, data: { status: PaymentStatus.FAILED, verifiedBy: input.actorId, verifiedAt: new Date(), verificationNotes: input.notes } });
      await recordAdminAction(tx, { orderId, actorId: input.actorId, action: input.action, eventType: OrderEventType.PAYMENT_REJECTED, title: "Payment evidence rejected", message: input.notes, oldValue, newValue: { status: updated.status, paymentStatus: updated.paymentStatus }, ipAddress: input.ipAddress });
    } else if (input.action === "START_PROCESSING") {
      assertOrderTransition(order.status, OrderStatus.PROCESSING);
      updated = await tx.order.update({ where: { id: orderId }, data: { status: OrderStatus.PROCESSING, assignedTo: input.actorId } });
      await recordAdminAction(tx, { orderId, actorId: input.actorId, action: input.action, eventType: OrderEventType.PROCESSING_STARTED, title: "Processing started", message: input.notes, oldValue, newValue: { status: updated.status }, ipAddress: input.ipAddress });
    } else if (input.action === "MARK_OUT_FOR_DELIVERY") {
      assertOrderTransition(order.status, OrderStatus.OUT_FOR_DELIVERY);
      updated = await tx.order.update({ where: { id: orderId }, data: { status: OrderStatus.OUT_FOR_DELIVERY, assignedTo: input.actorId } });
      await recordAdminAction(tx, { orderId, actorId: input.actorId, action: input.action, eventType: OrderEventType.OUT_FOR_DELIVERY, title: "Out for delivery or pickup", message: input.notes, oldValue, newValue: { status: updated.status }, ipAddress: input.ipAddress });
    } else if (input.action === "COMPLETE_ORDER") {
      assertOrderTransition(order.status, OrderStatus.COMPLETED);
      updated = await tx.order.update({ where: { id: orderId }, data: { status: OrderStatus.COMPLETED, completedAt: new Date() } });
      await recordAdminAction(tx, { orderId, actorId: input.actorId, action: input.action, eventType: OrderEventType.ORDER_COMPLETED, title: "Order completed", message: input.notes, oldValue, newValue: { status: updated.status }, ipAddress: input.ipAddress });
    } else if (input.action === "CANCEL_ORDER") {
      updated = await tx.order.update({ where: { id: orderId }, data: { status: OrderStatus.CANCELLED, rejectionReason: input.notes } });
      await recordAdminAction(tx, { orderId, actorId: input.actorId, action: input.action, eventType: OrderEventType.ORDER_CANCELLED, title: "Order cancelled", message: input.notes, oldValue, newValue: { status: updated.status }, ipAddress: input.ipAddress });
    } else if (input.action === "GENERATE_INVOICE") {
      const invoiceNumber = order.invoiceNumber ?? createInvoiceNumber(order.orderNumber);
      const pdf = await generateInvoicePdfPlaceholder(order.orderNumber, invoiceNumber);
      updated = await tx.order.update({ where: { id: orderId }, data: { invoiceNumber, invoiceUrl: pdf.objectKey } });
      await recordAdminAction(tx, { orderId, actorId: input.actorId, action: input.action, eventType: OrderEventType.INVOICE_GENERATED, title: "Invoice generated", oldValue, newValue: { invoiceNumber, objectKey: pdf.objectKey }, ipAddress: input.ipAddress });
    } else {
      throw new Error("Unsupported admin order action");
    }

    return { updated, email: order.user.email, orderNumber: order.orderNumber };
  });

  const emailTemplate =
    input.action === "APPROVE_KYC" ? "KYC_APPROVED" :
    input.action === "REJECT_KYC" ? "KYC_REJECTED" :
    input.action === "VERIFY_PAYMENT" ? "PAYMENT_VERIFIED" :
    input.action === "COMPLETE_ORDER" ? "ORDER_COMPLETED" : null;

  const notification = result.email && emailTemplate
    ? await sendOrderEmail(result.email, emailTemplate, { orderNumber: result.orderNumber, notes: input.notes })
    : null;

  return { order: result.updated, notification };
}
