import { NextResponse } from "next/server";
import { OrderEventType, OrderStatus } from "@prisma/client";
import { orderSchema } from "@/lib/validations";
import { generateOrderNumber } from "@/lib/utils";
import { sendOrderEmail } from "@/lib/integrations";
import { getDocumentChecklist } from "@/lib/document-checklist";
import { requireUser } from "@/lib/authz";
import { prisma } from "@/lib/prisma";
import { enforceRateLimit, requestIdentifier } from "@/lib/rate-limit";
import { ApiError, handleApiError, validationError } from "@/lib/api-error";

export async function POST(request: Request) {
  try {
    const user = await requireUser();
    enforceRateLimit("order", requestIdentifier(request, user.id));
    const parsed = orderSchema.safeParse(await request.json());
    if (!parsed.success) return validationError(parsed.error.flatten());

    const currency = await prisma.currency.findUnique({
      where: { code: parsed.data.currencyCode.toUpperCase() },
      include: { rates: { orderBy: { createdAt: "desc" }, take: 1 } }
    });
    const currentRate = currency?.rates[0];
    if (!currency || !currentRate) throw new ApiError(409, "A current rate is not available for this currency.", "RATE_UNAVAILABLE");
    const rate =
      parsed.data.type === "SELL_FOREX" ? Number(currentRate.sellRate) :
      parsed.data.type === "FOREX_CARD" || parsed.data.type === "CARD_RELOAD" ? Number(currentRate.cardRate) :
      Number(currentRate.buyRate);
    const orderNumber = generateOrderNumber();

    const order = await prisma.$transaction(async (tx) => {
      const created = await tx.order.create({
        data: {
          orderNumber,
          userId: user.id,
          type: parsed.data.type,
          currencyCode: parsed.data.currencyCode.toUpperCase(),
          amount: parsed.data.amount,
          rate,
          totalInINR: parsed.data.amount * rate,
          purpose: parsed.data.purpose,
          destinationCountry: parsed.data.destinationCountry,
          travelDate: parsed.data.travelDate ? new Date(parsed.data.travelDate) : undefined,
          deliveryAddress: parsed.data.deliveryAddress,
          status: OrderStatus.SUBMITTED
        }
      });
      await tx.orderEvent.createMany({
        data: [
          { orderId: created.id, actorId: user.id, type: OrderEventType.ORDER_CREATED, title: "Order created" },
          { orderId: created.id, actorId: user.id, type: OrderEventType.ORDER_SUBMITTED, title: "Order submitted", message: "Awaiting operations and KYC review." }
        ]
      });
      await tx.auditLog.create({
        data: {
          actorId: user.id,
          action: "ORDER_SUBMITTED",
          entityType: "Order",
          entityId: created.id,
          newValue: { orderNumber, type: created.type, status: created.status }
        }
      });
      return created;
    });

    const notification = user.email ? await sendOrderEmail(user.email, "ORDER_SUBMITTED", { orderNumber }) : null;
    return NextResponse.json({
      order,
      checklist: getDocumentChecklist(order.type, order.purpose ?? "Travel"),
      notification,
      complianceNote: "Rates remain indicative until KYC approval and an administrator issues a time-limited rate lock."
    }, { status: 201 });
  } catch (error) {
    return handleApiError(error, { route: "POST /api/orders" });
  }
}

export async function GET() {
  try {
    const user = await requireUser();
    const orders = await prisma.order.findMany({
      where: { userId: user.id },
      include: {
        payment: true,
        events: { orderBy: { createdAt: "asc" } },
        documents: { select: { id: true, type: true, status: true, uploadedAt: true } }
      },
      orderBy: { createdAt: "desc" }
    });
    return NextResponse.json({ orders });
  } catch (error) {
    return handleApiError(error, { route: "GET /api/orders" });
  }
}
