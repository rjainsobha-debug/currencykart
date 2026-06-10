# Prisma migrations

Create the first PostgreSQL migration against a disposable development database:

```bash
npm run prisma:migrate -- --name production_baseline
```

Commit the generated timestamped migration directory. Production environments must only run:

```bash
npm run prisma:migrate:deploy
```

Never run `prisma migrate dev` or `prisma db push` against production.
