# Production Deployment and Rollback Runbook

Production deployment requires approved QA evidence, legal review, verified partner/licence wording, tested backups and named go/no-go approvers.

## Pre-deployment gates

```bash
git checkout <approved-release-tag>
git status --short
npm ci
npm run env:validate
npm run env:production
npm run prisma:generate
npm run workflow:validate
npm run seo:validate
npm run prelaunch:check
npm run build
npm audit --omit=dev
```

Confirm:

- The release tag matches the staging-tested commit.
- Production secrets are loaded from the platform secret manager.
- `NEXT_PUBLIC_SITE_URL` and `NEXTAUTH_URL` use `https://currencykart.in`.
- Provider selections are not `placeholder`.
- Redis rate limiting and administrator 2FA are enabled.
- Database and object-storage backups are current.

## Database migration

1. Place the application in a maintenance or controlled-deploy window.
2. Create and verify a fresh database backup.
3. Record the current migration:

   ```bash
   npm exec prisma migrate status
   ```

4. Deploy committed migrations:

   ```bash
   npm run prisma:migrate:deploy
   ```

5. Re-run:

   ```bash
   npm exec prisma migrate status
   ```

Never run demo seeding in production.

## Application deployment

Deploy the approved immutable build using the relevant platform guide. After traffic switches:

```bash
Invoke-WebRequest https://currencykart.in
Invoke-WebRequest https://currencykart.in/robots.txt
Invoke-WebRequest https://currencykart.in/sitemap.xml
```

Run production smoke tests for authentication, one low-value sandbox-approved order path, admin 2FA, private document access and notification delivery.

## Rollback plan

### Application-only rollback

If the schema remains backward compatible:

1. Stop traffic to the failing release.
2. Redeploy the previous known-good image or platform deployment.
3. Verify health, login and order reads.
4. Preserve logs and webhook payload hashes for incident review.

### Database rollback

Prisma does not automatically reverse production migrations.

1. Do not use `prisma migrate reset`.
2. If a tested compensating migration exists, deploy it with:

   ```bash
   npm run prisma:migrate:deploy
   ```

3. For destructive or unrecoverable schema/data changes, restore the pre-deployment backup to a new database.
4. Point the previous application release to the restored database.
5. Reconcile payment webhooks and orders created after the backup before resuming normal processing.

### Provider rollback

- Disable failing webhook endpoints or rotate the webhook secret.
- Switch provider selection back to a previously tested adapter.
- Pause automated payment-state transitions if signature verification is uncertain.
- Keep manual audit records for any orders handled during the incident.

## Incident closeout

Record timeline, affected orders, payment reconciliation, customer communications, root cause, corrective action and approval before redeploying.
