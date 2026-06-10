import { z } from "zod";

export const orderSchema = z.object({
  type: z.enum(["BUY_FOREX", "SELL_FOREX", "FOREX_CARD", "CARD_RELOAD"]),
  currencyCode: z.string().min(3).max(3),
  amount: z.coerce.number().positive(),
  purpose: z.string().min(2),
  destinationCountry: z.string().optional(),
  travelDate: z.string().optional(),
  deliveryAddress: z.string().min(8).optional()
});

export const adminOrderActionSchema = z.object({
  action: z.enum([
    "APPROVE_ORDER",
    "REJECT_ORDER",
    "APPROVE_KYC",
    "REJECT_KYC",
    "LOCK_RATE",
    "VERIFY_PAYMENT",
    "REJECT_PAYMENT",
    "START_PROCESSING",
    "MARK_OUT_FOR_DELIVERY",
    "COMPLETE_ORDER",
    "CANCEL_ORDER",
    "GENERATE_INVOICE"
  ]),
  notes: z.string().max(2000).optional(),
  rate: z.coerce.number().positive().optional(),
  lockMinutes: z.coerce.number().int().min(5).max(240).optional(),
  providerPaymentId: z.string().optional(),
  ipAddress: z.string().optional()
});

export const adminOrderFilterSchema = z.object({
  status: z.string().optional(),
  currency: z.string().length(3).optional(),
  customer: z.string().optional(),
  paymentStatus: z.string().optional(),
  dateFrom: z.string().optional(),
  dateTo: z.string().optional()
});

export const insuranceLeadSchema = z.object({
  name: z.string().min(2),
  phone: z.string().min(10),
  email: z.string().email(),
  destination: z.string().min(2),
  startDate: z.string(),
  endDate: z.string(),
  age: z.coerce.number().int().min(1).max(100),
  purpose: z.string().min(2)
});

export const uploadSchema = z.object({
  type: z.enum(["PAN", "PASSPORT", "VISA", "TICKET", "ADDRESS_PROOF", "OTHER"]),
  orderId: z.string().optional(),
  fileName: z.string().min(3),
  mimeType: z.string(),
  size: z.coerce.number().positive()
});
