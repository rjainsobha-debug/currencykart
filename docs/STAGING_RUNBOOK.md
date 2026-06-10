# Staging Deployment Runbook

Use the lowest-cost staging stack first: GitHub Free, Vercel Hobby/Free, Cloudflare Free DNS, Neon Free PostgreSQL, optional Upstash Free Redis, Razorpay test mode only when needed, and placeholder/local providers for OTP, email, WhatsApp and storage. Never point staging at production data or live payment keys.

## 1. Prepare the release

```bash
git checkout main
git pull --ff-only
git status --short
npm ci
```

Confirm the working tree is clean and record the commit:

```bash
git rev-parse HEAD
```

## 2. Configure staging environment

Create secrets in the hosting platform. Do not commit `.env.staging`.

Required baseline:

```text
NODE_ENV=production
DATABASE_URL=postgresql://...
NEXTAUTH_URL=https://staging.currencykart.in
NEXTAUTH_SECRET=<32+ random characters>
NEXT_PUBLIC_SITE_URL=https://staging.currencykart.in
NEXT_PUBLIC_DOMAIN=staging.currencykart.in
NEXT_PUBLIC_BRAND_NAME=CurrencyKart
NEXT_PUBLIC_LEGAL_NAME=<legal entity>
NEXT_PUBLIC_SUPPORT_PHONE=<staging support number>
NEXT_PUBLIC_SUPPORT_EMAIL=support@currencykart.in
NEXT_PUBLIC_ORDERS_EMAIL=orders@currencykart.in
NEXT_PUBLIC_KYC_EMAIL=kyc@currencykart.in
NEXT_PUBLIC_WHATSAPP_URL=https://wa.me/<number>
NEXT_PUBLIC_REGISTERED_ADDRESS=<verified address>
OTP_PROVIDER=placeholder
EMAIL_PROVIDER=placeholder
PAYMENT_PROVIDER=placeholder
STORAGE_DRIVER=placeholder
WHATSAPP_PROVIDER=placeholder
RATE_LIMIT_STORE=memory
REDIS_URL=
ADMIN_2FA_REQUIRED=false
```

This placeholder/test-mode staging configuration lets Vercel build without live provider credentials. If you switch any provider from `placeholder`, add the matching test credentials from `.env.example`.

Recommended free services:

- Source: GitHub Free
- Hosting: Vercel Hobby/Free
- DNS: Cloudflare Free
- Database: Neon Free PostgreSQL
- Redis: Upstash Free, optional for staging
- Payments: Razorpay test mode, optional for payment QA
- Email, OTP, WhatsApp and storage: `placeholder` for first staging

## 3. Validate locally or in CI

Run with the staging environment loaded:

```bash
npm run env:validate
npm run prisma:generate
npm run workflow:validate
npm run build
npm audit
```

`npm run env:production`, `npm run seo:validate` and `npm run prelaunch:check` are final production-domain gates. Run them only with `NEXT_PUBLIC_SITE_URL=https://currencykart.in` and the approved production configuration.

Do not use `npm audit fix --force`.

## 4. Prepare PostgreSQL

Confirm that a committed migration exists:

```bash
Get-ChildItem prisma/migrations
```

Back up the staging database, then deploy migrations:

```bash
npm run prisma:migrate:deploy
```

Do not run `prisma db push` or `prisma migrate dev` in staging.

## 5. Bootstrap staging

Create the first staging administrator:

```bash
npm run admin:create
```

Seed demo/reference data only if the QA plan requires it:

```bash
npm run db:seed
```

Clearly label seeded data and remove it before production.

## 6. Deploy

Use the low-cost platform guides:

- Vercel: `docs/deployment/VERCEL.md`
- Neon: `docs/deployment/NEON.md`
- Upstash: `docs/deployment/UPSTASH.md`
- Render: `docs/deployment/RENDER.md`
- AWS: `docs/deployment/AWS.md`

For Vercel with Cloudflare DNS:

1. Push the repository to GitHub.
2. Import the GitHub repository into Vercel.
3. Add the staging environment variables above.
4. Deploy the Vercel project.
5. In Vercel, add `staging.currencykart.in` as a project domain.
6. In Cloudflare DNS, add a CNAME record:

   ```text
   Type: CNAME
   Name: staging
   Target: cname.vercel-dns.com
   Proxy status: DNS only
   ```

7. Wait for Vercel domain verification.
8. Test `https://staging.currencykart.in`.

## 7. Post-deploy smoke test

```bash
Invoke-WebRequest https://staging.currencykart.in
Invoke-WebRequest https://staging.currencykart.in/robots.txt
Invoke-WebRequest https://staging.currencykart.in/sitemap.xml
```

Then execute `docs/QA_CHECKLIST.md` and record evidence in `docs/TEST_EVIDENCE_TEMPLATE.md`.

Minimum approval gates:

- Customer registration, password login and OTP login pass.
- Admin 2FA and role checks pass.
- Private KYC upload/download passes.
- All four order types complete the expected lifecycle.
- Razorpay test webhook verifies and duplicate delivery is idempotent.
- Email and WhatsApp test notifications are received.
- Legal, SEO, mobile and compliance checks pass.

## 8. Staging sign-off

Record:

- Commit SHA
- Migration version
- Environment owner
- QA report link
- Legal-review status
- Known defects and accepted risks
- Go/no-go approvers
