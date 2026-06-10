import { z } from "zod";

const optionalString = z.preprocess((value) => value === "" ? undefined : value, z.string().optional());
const optionalUrl = z.preprocess((value) => value === "" ? undefined : value, z.string().url().optional());

export const envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  DATABASE_URL: z.string().url().or(z.string().startsWith("postgresql://")),
  NEXTAUTH_URL: z.string().url(),
  NEXTAUTH_SECRET: z.string().min(32),
  GOOGLE_CLIENT_ID: optionalString,
  GOOGLE_CLIENT_SECRET: optionalString,
  OTP_PROVIDER: z.enum(["placeholder", "msg91", "twilio"]).default("placeholder"),
  EMAIL_PROVIDER: z.enum(["placeholder", "sendgrid", "ses"]).default("placeholder"),
  PAYMENT_PROVIDER: z.enum(["placeholder", "razorpay"]).default("placeholder"),
  STORAGE_DRIVER: z.enum(["local", "s3", "placeholder"]).default("placeholder"),
  WHATSAPP_PROVIDER: z.enum(["placeholder", "cloud-api"]).default("placeholder"),
  S3_BUCKET: optionalString,
  S3_REGION: optionalString,
  RAZORPAY_KEY_ID: optionalString,
  RAZORPAY_KEY_SECRET: optionalString,
  RAZORPAY_WEBHOOK_SECRET: optionalString,
  MSG91_AUTH_KEY: optionalString,
  MSG91_OTP_TEMPLATE_ID: optionalString,
  TWILIO_ACCOUNT_SID: optionalString,
  TWILIO_AUTH_TOKEN: optionalString,
  TWILIO_VERIFY_SERVICE_SID: optionalString,
  SENDGRID_API_KEY: optionalString,
  EMAIL_FROM: z.preprocess((value) => value === "" ? undefined : value, z.string().email().optional()),
  AWS_REGION: optionalString,
  WHATSAPP_ACCESS_TOKEN: optionalString,
  WHATSAPP_PHONE_NUMBER_ID: optionalString,
  WHATSAPP_API_VERSION: z.string().default("v22.0"),
  S3_ENDPOINT: optionalUrl,
  S3_FORCE_PATH_STYLE: z.enum(["true", "false"]).default("false"),
  ADMIN_2FA_REQUIRED: z.enum(["true", "false"]).default("false"),
  ADMIN_BOOTSTRAP_EMAIL: z.preprocess((value) => value === "" ? undefined : value, z.string().email().optional()),
  ADMIN_BOOTSTRAP_PASSWORD: z.preprocess((value) => value === "" ? undefined : value, z.string().min(12).optional()),
  RATE_LIMIT_STORE: z.enum(["memory", "redis"]).default("memory"),
  REDIS_URL: optionalUrl,
  APP_LOG_LEVEL: z.enum(["debug", "info", "warn", "error"]).default("info"),
  NEXT_PUBLIC_BRAND_NAME: z.string().min(2).default("CurrencyKart"),
  NEXT_PUBLIC_LEGAL_NAME: z.string().min(2).default("Your Legal Entity Name"),
  NEXT_PUBLIC_SITE_URL: z.string().url().default("https://currencykart.in"),
  NEXT_PUBLIC_SUPPORT_PHONE: z.string().min(10).default("+91 98765 43210"),
  NEXT_PUBLIC_SUPPORT_EMAIL: z.string().email().default("support@currencykart.in"),
  NEXT_PUBLIC_WHATSAPP_URL: z.string().url().default("https://wa.me/919876543210"),
  NEXT_PUBLIC_REGISTERED_ADDRESS: z.string().min(5).default("Registered office address to be added before launch"),
  NEXT_PUBLIC_DOMAIN: z.string().min(3).default("currencykart.in"),
  NEXT_PUBLIC_ORDERS_EMAIL: z.preprocess((value) => value === "" ? undefined : value, z.string().email().optional()),
  NEXT_PUBLIC_KYC_EMAIL: z.preprocess((value) => value === "" ? undefined : value, z.string().email().optional()),
  NEXT_PUBLIC_LICENCE_DETAILS: optionalString,
  NEXT_PUBLIC_AUTHORISED_PARTNER_DETAILS: optionalString
}).superRefine((value, context) => {
  if (value.STORAGE_DRIVER === "s3" && (!value.S3_BUCKET || !value.S3_REGION)) {
    context.addIssue({ code: "custom", message: "S3_BUCKET and S3_REGION are required when STORAGE_DRIVER=s3" });
  }
  if (value.RATE_LIMIT_STORE === "redis" && !value.REDIS_URL) {
    context.addIssue({ code: "custom", message: "REDIS_URL is required when RATE_LIMIT_STORE=redis" });
  }
  if (value.OTP_PROVIDER === "msg91" && (!value.MSG91_AUTH_KEY || !value.MSG91_OTP_TEMPLATE_ID)) {
    context.addIssue({ code: "custom", message: "MSG91_AUTH_KEY and MSG91_OTP_TEMPLATE_ID are required when OTP_PROVIDER=msg91" });
  }
  if (value.OTP_PROVIDER === "twilio" && (!value.TWILIO_ACCOUNT_SID || !value.TWILIO_AUTH_TOKEN || !value.TWILIO_VERIFY_SERVICE_SID)) {
    context.addIssue({ code: "custom", message: "Twilio Verify credentials are required when OTP_PROVIDER=twilio" });
  }
  if (value.EMAIL_PROVIDER === "sendgrid" && (!value.SENDGRID_API_KEY || !value.EMAIL_FROM)) {
    context.addIssue({ code: "custom", message: "SENDGRID_API_KEY and EMAIL_FROM are required when EMAIL_PROVIDER=sendgrid" });
  }
  if (value.EMAIL_PROVIDER === "ses" && (!value.AWS_REGION || !value.EMAIL_FROM)) {
    context.addIssue({ code: "custom", message: "AWS_REGION and EMAIL_FROM are required when EMAIL_PROVIDER=ses" });
  }
  if (value.PAYMENT_PROVIDER === "razorpay" && (!value.RAZORPAY_KEY_ID || !value.RAZORPAY_KEY_SECRET || !value.RAZORPAY_WEBHOOK_SECRET)) {
    context.addIssue({ code: "custom", message: "Razorpay keys and webhook secret are required when PAYMENT_PROVIDER=razorpay" });
  }
  if (value.WHATSAPP_PROVIDER === "cloud-api" && (!value.WHATSAPP_ACCESS_TOKEN || !value.WHATSAPP_PHONE_NUMBER_ID)) {
    context.addIssue({ code: "custom", message: "WhatsApp Cloud API credentials are required when WHATSAPP_PROVIDER=cloud-api" });
  }
});

export function validateEnv(input: NodeJS.ProcessEnv = process.env) {
  return envSchema.parse(input);
}
