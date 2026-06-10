import type { SmsOtpProvider } from "../contracts";

export class TwilioVerifyOtpProvider implements SmsOtpProvider {
  private authorization: string;

  constructor(private accountSid: string, authToken: string, private serviceSid: string) {
    this.authorization = `Basic ${Buffer.from(`${accountSid}:${authToken}`).toString("base64")}`;
  }

  async requestOtp(input: { phone: string }) {
    const body = new URLSearchParams({ To: input.phone, Channel: "sms" });
    const response = await fetch(`https://verify.twilio.com/v2/Services/${this.serviceSid}/Verifications`, {
      method: "POST",
      headers: { Authorization: this.authorization, "Content-Type": "application/x-www-form-urlencoded" },
      body
    });
    if (!response.ok) throw new Error(`Twilio Verify request failed with ${response.status}`);
    const payload = await response.json() as { sid: string };
    return { requestId: payload.sid, status: "sent" as const };
  }

  async verifyOtp(input: { phone: string; code: string }) {
    const body = new URLSearchParams({ To: input.phone, Code: input.code });
    const response = await fetch(`https://verify.twilio.com/v2/Services/${this.serviceSid}/VerificationCheck`, {
      method: "POST",
      headers: { Authorization: this.authorization, "Content-Type": "application/x-www-form-urlencoded" },
      body
    });
    if (!response.ok) return { verified: false };
    const payload = await response.json() as { status?: string };
    return { verified: payload.status === "approved" };
  }
}
