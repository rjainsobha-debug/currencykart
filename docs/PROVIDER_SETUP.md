# Provider Setup Guide

Use separate staging and production accounts, keys, templates, callback URLs and sender identities.

## Ultra-low-cost staging default

For the first staging deployment, do not provision paid AWS services or live provider accounts. Use:

```text
OTP_PROVIDER=placeholder
EMAIL_PROVIDER=placeholder
PAYMENT_PROVIDER=placeholder
WHATSAPP_PROVIDER=placeholder
STORAGE_DRIVER=placeholder
RATE_LIMIT_STORE=memory
```

Use Neon Free for PostgreSQL and Vercel Hobby/Free for hosting. Upstash Free Redis and Razorpay test mode are optional later-stage QA additions, not required for the first staging build.

Production should later move to private document storage, real OTP/email/WhatsApp providers, live payment credentials, Redis-backed rate limiting and verified legal/partner details.

## Razorpay

1. Complete merchant onboarding and obtain test/live key pairs.
2. Set:

   ```text
   PAYMENT_PROVIDER=razorpay
   RAZORPAY_KEY_ID=...
   RAZORPAY_KEY_SECRET=...
   RAZORPAY_WEBHOOK_SECRET=...
   ```

3. Configure webhook URL:

   ```text
   https://currencykart.in/api/payments/razorpay/webhook
   ```

4. Subscribe initially to `payment.captured`; add other events only with explicit handlers.
5. Test valid, invalid and duplicate signatures.
6. Reconcile Razorpay order ID, payment ID, receipt/order number and INR paise amounts.

## MSG91

1. Complete DLT/sender/template approvals where applicable.
2. Create an OTP template and obtain the auth key/template ID.
3. Set:

   ```text
   OTP_PROVIDER=msg91
   MSG91_AUTH_KEY=...
   MSG91_OTP_TEMPLATE_ID=...
   ```

4. Verify E.164/mobile formatting and delivery in India.
5. Confirm provider expiry matches the application's five-minute challenge.

## Twilio Verify

1. Create a Verify Service and enable SMS.
2. Set:

   ```text
   OTP_PROVIDER=twilio
   TWILIO_ACCOUNT_SID=...
   TWILIO_AUTH_TOKEN=...
   TWILIO_VERIFY_SERVICE_SID=...
   ```

3. Configure India geo-permissions and approved sender requirements.
4. Test request, verification, expiry, resend and fraud controls.

## Amazon SES

1. Verify the sending domain and configure DKIM, SPF and DMARC.
2. Move the SES account out of sandbox for production.
3. Grant the runtime IAM role only `ses:SendEmail` permissions.
4. Set:

   ```text
   EMAIL_PROVIDER=ses
   AWS_REGION=ap-south-1
   EMAIL_FROM=notifications@currencykart.in
   ```

5. Configure provider template IDs where applicable and test bounce/complaint handling.

## SendGrid

1. Authenticate the sending domain and configure DKIM/SPF.
2. Create dynamic templates for every notification.
3. Set:

   ```text
   EMAIL_PROVIDER=sendgrid
   SENDGRID_API_KEY=...
   EMAIL_FROM=notifications@currencykart.in
   EMAIL_TEMPLATE_ORDER_SUBMITTED=...
   ```

4. Restrict the API key to mail-send scope.
5. Configure event webhooks for bounce/complaint monitoring in a future integration.

## WhatsApp Cloud API

1. Complete Meta Business verification.
2. Add and verify the WhatsApp phone number.
3. Create and approve transactional templates.
4. Set:

   ```text
   WHATSAPP_PROVIDER=cloud-api
   WHATSAPP_ACCESS_TOKEN=...
   WHATSAPP_PHONE_NUMBER_ID=...
   WHATSAPP_API_VERSION=v22.0
   ```

5. Use a long-lived system-user token stored in the secret manager.
6. Test opt-in, template variables, delivery status and customer support escalation.

## S3-compatible private storage

1. Create separate private staging and production buckets.
2. Block public access and enable default encryption, versioning, lifecycle rules and access logging.
3. Grant the runtime role narrowly scoped `GetObject`/`PutObject` permissions.
4. Set:

   ```text
   STORAGE_DRIVER=s3
   S3_BUCKET=...
   S3_REGION=...
   S3_ENDPOINT=          # optional for compatible services
   S3_FORCE_PATH_STYLE=false
   ```

5. Configure bucket CORS only for required signed upload origins/methods.
6. Test signed URL expiry and cross-customer access denial.

## Redis

1. Provision TLS-enabled managed Redis.
2. Set:

   ```text
   RATE_LIMIT_STORE=redis
   REDIS_URL=rediss://...
   ```

3. Replace the current in-memory implementation in `lib/rate-limit.ts` with an atomic Redis sliding-window or token-bucket adapter.
4. Namespace keys by environment and scope.
5. Configure eviction, monitoring and fail-closed/fail-open behaviour per endpoint risk.
