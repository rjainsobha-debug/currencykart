import { createHmac, timingSafeEqual } from "node:crypto";
import type { PaymentProvider } from "../contracts";

export class RazorpayPaymentProvider implements PaymentProvider {
  private authorization: string;

  constructor(private keyId: string, private keySecret: string, private webhookSecret: string) {
    this.authorization = `Basic ${Buffer.from(`${keyId}:${keySecret}`).toString("base64")}`;
  }

  async createIntent(input: { amount: number; orderNumber: string }) {
    const response = await fetch("https://api.razorpay.com/v1/orders", {
      method: "POST",
      headers: { Authorization: this.authorization, "Content-Type": "application/json" },
      body: JSON.stringify({ amount: Math.round(input.amount * 100), currency: "INR", receipt: input.orderNumber, notes: { orderNumber: input.orderNumber } })
    });
    if (!response.ok) throw new Error(`Razorpay order creation failed with ${response.status}`);
    const payload = await response.json() as { id: string };
    return { paymentId: payload.id, checkoutUrl: `https://checkout.razorpay.com/v1/checkout.js?order_id=${payload.id}`, status: "created" as const };
  }

  async verifyWebhook(payload: string, signature: string) {
    const expected = createHmac("sha256", this.webhookSecret).update(payload).digest("hex");
    const valid = signature.length === expected.length && timingSafeEqual(Buffer.from(signature), Buffer.from(expected));
    return { valid };
  }
}
