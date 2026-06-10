# Neon Free PostgreSQL for Staging

Use Neon Free for the first CurrencyKart staging database. It is enough for smoke tests, seeded demo data and early QA.

## Setup

1. Create a Neon account.
2. Create a project named `currencykart-staging`.
3. Create or use the default database, for example `currencykart_staging`.
4. Copy the pooled PostgreSQL connection string.
5. In Vercel, add it as:

   ```text
   DATABASE_URL=postgresql://USER:PASSWORD@HOST.neon.tech/currencykart_staging?sslmode=require
   ```

6. Run migrations after the first Vercel deployment or from a trusted local terminal:

   ```bash
   npm run prisma:generate
   npm run prisma:migrate:deploy
   ```

7. Seed only if staging QA needs demo data:

   ```bash
   npm run db:seed
   ```

## Notes

- Do not use production data in Neon Free staging.
- Keep the connection string only in Vercel environment variables or a local `.env.staging` file that is ignored by Git.
- For production, move to a paid database plan with backups, restore testing and capacity sized for real traffic.
