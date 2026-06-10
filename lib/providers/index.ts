import type { EmailProvider, PaymentProvider, PrivateStorageProvider, SmsOtpProvider, WhatsAppProvider } from "./contracts";
import {
  placeholderEmailProvider,
  placeholderPaymentProvider,
  placeholderSmsOtpProvider,
  placeholderStorageProvider,
  placeholderWhatsAppProvider
} from "./placeholder";
import { Msg91OtpProvider } from "./sms/msg91";
import { TwilioVerifyOtpProvider } from "./sms/twilio";
import { SendGridEmailProvider } from "./email/sendgrid";
import { SesEmailProvider } from "./email/ses";
import { WhatsAppCloudProvider } from "./whatsapp/cloud-api";
import { RazorpayPaymentProvider } from "./payment/razorpay";
import { S3PrivateStorageProvider } from "./storage/s3";

function required(name: string) {
  const value = process.env[name];
  if (!value) throw new Error(`${name} is required for the selected provider`);
  return value;
}

export function getSmsOtpProvider(): SmsOtpProvider {
  if (process.env.OTP_PROVIDER === "msg91") return new Msg91OtpProvider(required("MSG91_AUTH_KEY"), required("MSG91_OTP_TEMPLATE_ID"));
  if (process.env.OTP_PROVIDER === "twilio") return new TwilioVerifyOtpProvider(required("TWILIO_ACCOUNT_SID"), required("TWILIO_AUTH_TOKEN"), required("TWILIO_VERIFY_SERVICE_SID"));
  return placeholderSmsOtpProvider;
}

export function getEmailProvider(): EmailProvider {
  if (process.env.EMAIL_PROVIDER === "sendgrid") return new SendGridEmailProvider(required("SENDGRID_API_KEY"), required("EMAIL_FROM"));
  if (process.env.EMAIL_PROVIDER === "ses") return new SesEmailProvider(required("AWS_REGION"), required("EMAIL_FROM"));
  return placeholderEmailProvider;
}

export function getWhatsAppProvider(): WhatsAppProvider {
  if (process.env.WHATSAPP_PROVIDER === "cloud-api") {
    return new WhatsAppCloudProvider(required("WHATSAPP_ACCESS_TOKEN"), required("WHATSAPP_PHONE_NUMBER_ID"), process.env.WHATSAPP_API_VERSION);
  }
  return placeholderWhatsAppProvider;
}

export function getPaymentProvider(): PaymentProvider {
  if (process.env.PAYMENT_PROVIDER === "razorpay") {
    return new RazorpayPaymentProvider(required("RAZORPAY_KEY_ID"), required("RAZORPAY_KEY_SECRET"), required("RAZORPAY_WEBHOOK_SECRET"));
  }
  return placeholderPaymentProvider;
}

export function getPrivateStorageProvider(): PrivateStorageProvider {
  if (process.env.STORAGE_DRIVER === "s3") {
    return new S3PrivateStorageProvider(
      required("S3_BUCKET"),
      required("S3_REGION"),
      process.env.S3_ENDPOINT,
      process.env.S3_FORCE_PATH_STYLE === "true"
    );
  }
  return placeholderStorageProvider;
}
