# Deploying to Vercel Hobby/Free

Use Vercel Hobby/Free for the first staging deployment.

1. Push the repository to GitHub Free.
2. Import the repository into Vercel and select the Next.js preset.
3. Use Neon Free for `DATABASE_URL`.
4. Add every required staging variable from `.env.staging.example`.
5. Keep OTP, email, payment, WhatsApp and storage providers as `placeholder` for the first deploy.
6. Use a build command of `npm run prisma:generate && npm run build`.
7. Run `npm run prisma:migrate:deploy` manually after deployment when the Neon database is ready.
8. Add `staging.currencykart.in` as the Vercel project domain.
9. Point Cloudflare DNS to Vercel with a DNS-only CNAME.
10. Run the staging smoke-test subset from `docs/QA_CHECKLIST.md`.

Do not run demo seeding automatically in production.

## Staging with Cloudflare DNS

Use placeholder/test provider mode for the first staging deploy:

```text
DATABASE_URL=<Neon Free pooled PostgreSQL URL>
NEXTAUTH_URL=https://staging.currencykart.in
NEXT_PUBLIC_SITE_URL=https://staging.currencykart.in
NEXT_PUBLIC_DOMAIN=staging.currencykart.in
OTP_PROVIDER=placeholder
EMAIL_PROVIDER=placeholder
PAYMENT_PROVIDER=placeholder
STORAGE_DRIVER=placeholder
WHATSAPP_PROVIDER=placeholder
RATE_LIMIT_STORE=memory
ADMIN_2FA_REQUIRED=false
```

Optional payment testing can use Razorpay test mode later. Keep `PAYMENT_PROVIDER=placeholder` until test keys and webhook handling are configured.

In Cloudflare, add:

```text
Type: CNAME
Name: staging
Target: cname.vercel-dns.com
Proxy status: DNS only
```

Keep the Cloudflare proxy disabled until Vercel verifies the domain and HTTPS is working. After smoke testing, decide whether to enable the proxy based on Vercel and Cloudflare settings.
