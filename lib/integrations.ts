import { getEmailProvider, getPaymentProvider, getPrivateStorageProvider, getSmsOtpProvider, getWhatsAppProvider } from "./providers";

export async function requestOtpDelivery(phone: string, code: string, expiresInSeconds: number) {
  return getSmsOtpProvider().requestOtp({ phone, code, expiresInSeconds });
}

export async function verifyOtpDelivery(input: { phone: string; code: string; requestId: string; codeHash?: string | null }) {
  return getSmsOtpProvider().verifyOtp(input);
}

export async function sendEmailVerification(email: string) {
  return getEmailProvider().send({ to: email, template: process.env.EMAIL_TEMPLATE_VERIFICATION ?? "EMAIL_VERIFICATION", data: {} });
}

export type OrderEmailTemplate = "ORDER_SUBMITTED" | "KYC_APPROVED" | "KYC_REJECTED" | "PAYMENT_VERIFIED" | "ORDER_COMPLETED";

export async function sendOrderEmail(email: string, template: OrderEmailTemplate, data: { orderNumber: string; notes?: string }) {
  const configuredTemplate = process.env[`EMAIL_TEMPLATE_${template}`] ?? template;
  return getEmailProvider().send({ to: email, template: configuredTemplate, data });
}

export async function createPaymentIntent(amount: number, orderNumber: string) {
  return getPaymentProvider().createIntent({ amount, orderNumber });
}

export async function verifyPaymentWebhook(payload: string, signature: string) {
  return getPaymentProvider().verifyWebhook(payload, signature);
}

export async function sendWhatsAppNotification(phone: string, template: string) {
  return getWhatsAppProvider().send({ phone, template });
}

export async function createStorageUploadUrl(fileName: string, mimeType = "application/octet-stream") {
  const objectKey = `documents/${Date.now()}-${fileName.replace(/[^a-zA-Z0-9._-]/g, "_")}`;
  return getPrivateStorageProvider().createUploadUrl({ objectKey, mimeType, expiresInSeconds: 600 });
}

export async function createStorageDownloadUrl(objectKey: string) {
  return getPrivateStorageProvider().createDownloadUrl({ objectKey, expiresInSeconds: 300 });
}

export async function generateInvoicePdfPlaceholder(orderNumber: string, invoiceNumber: string) {
  return {
    invoiceNumber,
    objectKey: `invoices/${orderNumber}-${invoiceNumber}.pdf`,
    provider: "pdf-placeholder",
    status: "PDF_QUEUED",
    note: "Replace with server-side PDF rendering to private storage."
  };
}
