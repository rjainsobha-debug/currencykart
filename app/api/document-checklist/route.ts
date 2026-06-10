import { NextResponse } from "next/server";
import { z } from "zod";
import { getDocumentChecklist } from "@/lib/document-checklist";
import { handleApiError, validationError } from "@/lib/api-error";

const schema = z.object({
  orderType: z.enum(["BUY_FOREX", "SELL_FOREX", "FOREX_CARD", "CARD_RELOAD"]).default("BUY_FOREX"),
  purpose: z.string().min(2).default("Holiday travel")
});

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const parsed = schema.safeParse({
      orderType: url.searchParams.get("orderType") ?? undefined,
      purpose: url.searchParams.get("purpose") ?? undefined
    });
    if (!parsed.success) return validationError(parsed.error.flatten());

    return NextResponse.json({
      orderType: parsed.data.orderType,
      purpose: parsed.data.purpose,
      checklist: getDocumentChecklist(parsed.data.orderType, parsed.data.purpose),
      complianceNote: "Final document requirements may change after KYC review and applicable regulatory checks."
    });
  } catch (error) {
    return handleApiError(error, { route: "GET /api/document-checklist" });
  }
}
