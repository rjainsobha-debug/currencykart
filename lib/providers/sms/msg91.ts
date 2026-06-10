import type { SmsOtpProvider } from "../contracts";

export class Msg91OtpProvider implements SmsOtpProvider {
  constructor(private authKey: string, private templateId: string) {}

  async requestOtp(input: { phone: string; code: string; expiresInSeconds: number }) {
    const response = await fetch("https://control.msg91.com/api/v5/otp", {
      method: "POST",
      headers: { "Content-Type": "application/json", authkey: this.authKey },
      body: JSON.stringify({ template_id: this.templateId, mobile: input.phone, otp: input.code, otp_expiry: Math.ceil(input.expiresInSeconds / 60) })
    });
    if (!response.ok) throw new Error(`MSG91 OTP request failed with ${response.status}`);
    const payload = await response.json() as { request_id?: string; requestId?: string };
    return { requestId: payload.request_id ?? payload.requestId ?? `msg91_${Date.now()}`, status: "sent" as const };
  }

  async verifyOtp(input: { phone: string; code: string; requestId: string }) {
    const url = new URL("https://control.msg91.com/api/v5/otp/verify");
    url.searchParams.set("mobile", input.phone);
    url.searchParams.set("otp", input.code);
    const response = await fetch(url, { headers: { authkey: this.authKey } });
    return { verified: response.ok };
  }
}
