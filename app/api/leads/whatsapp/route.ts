import { NextResponse } from "next/server";
import { z } from "zod";
import { sendWhatsAppNotification } from "@/lib/integrations";
import { brand } from "@/config/brand";
import { handleApiError, validationError } from "@/lib/api-error";

const schema = z.object({
  name: z.string().min(2),
  phone: z.string().min(10),
  service: z.enum(["BUY_FOREX", "SELL_FOREX", "FOREX_CARD", "CARD_RELOAD", "INSURANCE", "SUPPORT"]),
  message: z.string().max(1000).optional()
});

export async function POST(request: Request) {
  try {
    const parsed = schema.safeParse(await request.json());
    if (!parsed.success) return validationError(parsed.error.flatten());

    const notification = await sendWhatsAppNotification(parsed.data.phone, `LEAD_${parsed.data.service}`);
    return NextResponse.json({
      lead: { ...parsed.data, status: "NEW", source: "WHATSAPP_CTA" },
      notification,
      whatsappUrl: brand.whatsappUrl,
      complianceNote: "Service fulfilment remains subject to KYC, availability and applicable regulatory requirements."
    });
  } catch (error) {
    return handleApiError(error, { route: "POST /api/leads/whatsapp" });
  }
}
