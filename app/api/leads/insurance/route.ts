import { NextResponse } from "next/server";
import { insuranceLeadSchema } from "@/lib/validations";
import { sendEmailVerification, sendWhatsAppNotification } from "@/lib/integrations";
import { handleApiError, validationError } from "@/lib/api-error";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = insuranceLeadSchema.safeParse(body);
    if (!parsed.success) return validationError(parsed.error.flatten());

    const email = await sendEmailVerification(parsed.data.email);
    const whatsApp = await sendWhatsAppNotification(parsed.data.phone, "INSURANCE_LEAD_RECEIVED");

    return NextResponse.json({
      lead: { ...parsed.data, status: "NEW" },
      notifications: { email, whatsApp },
      audit: { action: "INSURANCE_LEAD_CREATED_PLACEHOLDER", entityType: "InsuranceLead" }
    });
  } catch (error) {
    return handleApiError(error, { route: "POST /api/leads/insurance" });
  }
}
