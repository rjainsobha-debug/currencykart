import { SESv2Client, SendEmailCommand } from "@aws-sdk/client-sesv2";
import type { EmailProvider } from "../contracts";

export class SesEmailProvider implements EmailProvider {
  private client: SESv2Client;

  constructor(region: string, private fromEmail: string) {
    this.client = new SESv2Client({ region });
  }

  async send(input: { to: string; template: string; data: Record<string, unknown> }) {
    const result = await this.client.send(new SendEmailCommand({
      FromEmailAddress: this.fromEmail,
      Destination: { ToAddresses: [input.to] },
      Content: {
        Simple: {
          Subject: { Data: input.template.replaceAll("_", " ") },
          Body: { Text: { Data: JSON.stringify(input.data) } }
        }
      }
    }));
    return { messageId: result.MessageId ?? `ses_${Date.now()}`, status: "queued" as const };
  }
}
