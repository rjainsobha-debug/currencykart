import { ApiError } from "./api-error";

type Bucket = { count: number; resetAt: number };
const buckets = new Map<string, Bucket>();

const policies = {
  login: { limit: 8, windowMs: 15 * 60_000 },
  otp: { limit: 5, windowMs: 10 * 60_000 },
  upload: { limit: 20, windowMs: 10 * 60_000 },
  order: { limit: 10, windowMs: 10 * 60_000 },
  admin: { limit: 60, windowMs: 60_000 }
} as const;

export type RateLimitScope = keyof typeof policies;

export function enforceRateLimit(scope: RateLimitScope, identifier: string) {
  const policy = policies[scope];
  const key = `${scope}:${identifier}`;
  const now = Date.now();
  const current = buckets.get(key);
  if (!current || current.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + policy.windowMs });
    return { remaining: policy.limit - 1, resetAt: now + policy.windowMs };
  }
  if (current.count >= policy.limit) throw new ApiError(429, "Too many requests. Please try again later.", "RATE_LIMITED");
  current.count += 1;
  return { remaining: policy.limit - current.count, resetAt: current.resetAt };
}

export function requestIdentifier(request: Request, userId?: string) {
  return userId ?? request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "anonymous";
}
