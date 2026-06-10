import type { EmailProvider } from "../contracts";

export class SendGridEmailProvider implements EmailProvider {
  constructor(private apiKey: string, private fromEmail: string) {}

  async send(input: { to: string; template: string; data: Record<string, unknown> }) {
    const response = await fetch("https://api.sendgrid.com/v3/mail/send", {
      method: "POST",
      headers: { Authorization: `Bearer ${this.apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        personalizations: [{ to: [{ email: input.to }], dynamic_template_data: input.data }],
        from: { email: this.fromEmail },
        template_id: input.template
      })
    });
    if (!response.ok) throw new Error(`SendGrid request failed with ${response.status}`);
    return { messageId: response.headers.get("x-message-id") ?? `sendgrid_${Date.now()}`, status: "queued" as const };
  }
}
