export interface SmsOtpProvider {
  requestOtp(input: { phone: string; code: string; expiresInSeconds: number }): Promise<{ requestId: string; status: "sent" }>;
  verifyOtp(input: { phone: string; code: string; requestId: string; codeHash?: string | null }): Promise<{ verified: boolean }>;
}

export interface EmailProvider {
  send(input: { to: string; template: string; data: Record<string, unknown> }): Promise<{ messageId: string; status: "queued" }>;
}

export interface WhatsAppProvider {
  send(input: { phone: string; template: string; data?: Record<string, unknown> }): Promise<{ messageId: string; status: "queued" }>;
}

export interface PaymentProvider {
  createIntent(input: { amount: number; orderNumber: string }): Promise<{ paymentId: string; checkoutUrl: string; status: "created" }>;
  verifyWebhook(payload: string, signature: string): Promise<{ valid: boolean; paymentId?: string }>;
}

export interface PrivateStorageProvider {
  createUploadUrl(input: { objectKey: string; mimeType: string; expiresInSeconds: number }): Promise<{ uploadUrl: string; objectKey: string; expiresAt: string }>;
  createDownloadUrl(input: { objectKey: string; expiresInSeconds: number }): Promise<{ downloadUrl: string; expiresAt: string }>;
}
