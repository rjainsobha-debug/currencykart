import { loadEnvConfig } from "@next/env";
import { validateEnv } from "../lib/env";

loadEnvConfig(process.cwd());
const env = validateEnv();
const errors: string[] = [];

function reject(condition: boolean, message: string) {
  if (condition) errors.push(message);
}

const siteUrl = new URL(env.NEXT_PUBLIC_SITE_URL);
const authUrl = new URL(env.NEXTAUTH_URL);
const unsafeText = /(placeholder|example|localhost|local\.|\.local|demo|dummy|staging|test)/i;

function unsafe(value: string | undefined) {
  return Boolean(value && unsafeText.test(value));
}

reject(env.NODE_ENV !== "production", "NODE_ENV must be production.");
reject(siteUrl.protocol !== "https:", "NEXT_PUBLIC_SITE_URL must use HTTPS.");
reject(authUrl.protocol !== "https:", "NEXTAUTH_URL must use HTTPS.");
reject(["localhost", "127.0.0.1", "example.com", "example.invalid"].includes(siteUrl.hostname) || unsafe(siteUrl.hostname), "NEXT_PUBLIC_SITE_URL must use the real production domain.");
reject(siteUrl.origin !== "https://currencykart.in", "NEXT_PUBLIC_SITE_URL must be https://currencykart.in for launch.");
reject(siteUrl.origin !== authUrl.origin, "NEXTAUTH_URL and NEXT_PUBLIC_SITE_URL must use the same production origin.");
reject(env.NEXT_PUBLIC_BRAND_NAME !== "CurrencyKart", "Set NEXT_PUBLIC_BRAND_NAME=CurrencyKart.");
reject(process.env.NEXT_PUBLIC_DOMAIN !== "currencykart.in", "Set NEXT_PUBLIC_DOMAIN=currencykart.in.");
reject(env.NEXT_PUBLIC_LEGAL_NAME === "Your Legal Entity Name", "Set the verified legal entity name.");
reject(env.NEXT_PUBLIC_REGISTERED_ADDRESS.includes("before launch"), "Set the verified registered address.");
reject(env.NEXT_PUBLIC_SUPPORT_EMAIL.endsWith("@example.com") || unsafe(env.NEXT_PUBLIC_SUPPORT_EMAIL), "Set the production support email.");
reject(env.NEXT_PUBLIC_SUPPORT_PHONE.includes("98765 43210"), "Set the production support phone.");
reject(env.OTP_PROVIDER === "placeholder", "Select MSG91 or Twilio for production OTP.");
reject(env.EMAIL_PROVIDER === "placeholder", "Select SES or SendGrid for production email.");
reject(env.PAYMENT_PROVIDER !== "razorpay", "Set PAYMENT_PROVIDER=razorpay.");
reject(env.WHATSAPP_PROVIDER !== "cloud-api", "Set WHATSAPP_PROVIDER=cloud-api.");
reject(env.STORAGE_DRIVER !== "s3", "Set STORAGE_DRIVER=s3.");
reject(env.RATE_LIMIT_STORE !== "redis", "Set RATE_LIMIT_STORE=redis.");
reject(env.ADMIN_2FA_REQUIRED !== "true", "Set ADMIN_2FA_REQUIRED=true.");
reject(!env.GOOGLE_CLIENT_ID || !env.GOOGLE_CLIENT_SECRET, "Configure production Google OAuth credentials.");
reject([env.GOOGLE_CLIENT_ID, env.GOOGLE_CLIENT_SECRET, env.RAZORPAY_KEY_ID, env.RAZORPAY_KEY_SECRET, env.RAZORPAY_WEBHOOK_SECRET, env.REDIS_URL].some(unsafe), "Production secrets and URLs must not contain demo, test, staging, local or placeholder values.");
reject(process.env.PRODUCTION_DOMAIN_APPROVED !== "true", "Set PRODUCTION_DOMAIN_APPROVED=true after verifying the final live domain and canonical URLs.");
reject(process.env.LEGAL_REVIEW_APPROVED !== "true", "Set LEGAL_REVIEW_APPROVED=true after signed legal review.");
reject(process.env.PARTNER_DETAILS_VERIFIED !== "true", "Set PARTNER_DETAILS_VERIFIED=true after verifying licence/partner details.");
reject(process.env.DEMO_DATA_ENABLED !== "false", "Set DEMO_DATA_ENABLED=false.");

if (errors.length) {
  console.error("Production environment check failed:\n" + errors.map((item) => `- ${item}`).join("\n"));
  process.exit(1);
}

console.log("Production environment check passed.");
