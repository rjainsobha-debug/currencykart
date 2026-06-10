import { createHash } from "node:crypto";
import type { EmailProvider, PaymentProvider, PrivateStorageProvider, SmsOtpProvider, WhatsAppProvider } from "./contracts";

export const placeholderSmsOtpProvider: SmsOtpProvider = {
  async requestOtp(input) {
    return { requestId: `otp_${Date.now()}_${input.phone.slice(-4)}`, status: "sent" };
  },
  async verifyOtp(input) {
    const expected = input.codeHash ? createHash("sha256").update(input.code).digest("hex") === input.codeHash : input.code === "123456";
    return { verified: expected };
  }
};

export const placeholderEmailProvider: EmailProvider = {
  async send(input) {
    return { messageId: `email_${Date.now()}_${input.template}`, status: "queued" };
  }
};

export const placeholderWhatsAppProvider: WhatsAppProvider = {
  async send(input) {
    return { messageId: `wa_${Date.now()}_${input.phone.slice(-4)}`, status: "queued" };
  }
};

export const placeholderPaymentProvider: PaymentProvider = {
  async createIntent(input) {
    return {
      paymentId: `pay_${Date.now()}`,
      checkoutUrl: `/payments/placeholder?order=${encodeURIComponent(input.orderNumber)}`,
      status: "created"
    };
  },
  async verifyWebhook(_payload, signature) {
    return { valid: signature === "placeholder-valid-signature" };
  }
};

export const placeholderStorageProvider: PrivateStorageProvider = {
  async createUploadUrl(input) {
    const expiresAt = new Date(Date.now() + input.expiresInSeconds * 1000).toISOString();
    return {
      uploadUrl: `/api/storage/placeholder-upload?key=${encodeURIComponent(input.objectKey)}&expires=${encodeURIComponent(expiresAt)}`,
      objectKey: input.objectKey,
      expiresAt
    };
  },
  async createDownloadUrl(input) {
    const expiresAt = new Date(Date.now() + input.expiresInSeconds * 1000).toISOString();
    return {
      downloadUrl: `/api/storage/placeholder-download?key=${encodeURIComponent(input.objectKey)}&expires=${encodeURIComponent(expiresAt)}`,
      expiresAt
    };
  }
};
