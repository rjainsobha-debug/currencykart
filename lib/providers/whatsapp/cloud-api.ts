import type { WhatsAppProvider } from "../contracts";

export class WhatsAppCloudProvider implements WhatsAppProvider {
  constructor(private accessToken: string, private phoneNumberId: string, private apiVersion = "v22.0") {}

  async send(input: { phone: string; template: string; data?: Record<string, unknown> }) {
    const response = await fetch(`https://graph.facebook.com/${this.apiVersion}/${this.phoneNumberId}/messages`, {
      method: "POST",
      headers: { Authorization: `Bearer ${this.accessToken}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        messaging_product: "whatsapp",
        to: input.phone,
        type: "template",
        template: { name: input.template.toLowerCase(), language: { code: "en" } }
      })
    });
    if (!response.ok) throw new Error(`WhatsApp Cloud API request failed with ${response.status}`);
    const payload = await response.json() as { messages?: Array<{ id: string }> };
    return { messageId: payload.messages?.[0]?.id ?? `whatsapp_${Date.now()}`, status: "queued" as const };
  }
}
