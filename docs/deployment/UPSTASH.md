# Upstash Free Redis for Staging

CurrencyKart currently builds and runs staging with `RATE_LIMIT_STORE=memory`, which is the cheapest option and requires no Redis credentials. Upstash Free is optional for staging if you want to test a shared Redis-backed limiter later.

## Cheapest staging default

```text
RATE_LIMIT_STORE=memory
REDIS_URL=
```

This avoids any Redis dependency during the first Vercel deployment.

## Optional Upstash setup

1. Create an Upstash account.
2. Create a free Redis database near the Vercel region.
3. Copy the Redis URL.
4. Add to Vercel staging:

   ```text
   RATE_LIMIT_STORE=redis
   REDIS_URL=rediss://...
   ```

5. Replace the in-memory limiter in `lib/rate-limit.ts` with an atomic Redis sliding-window or token-bucket adapter before relying on Redis for enforcement.

## Production note

Production should use shared Redis-backed rate limiting, not per-instance memory limits.
