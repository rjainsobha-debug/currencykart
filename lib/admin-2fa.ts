import { createHmac, timingSafeEqual } from "node:crypto";

const COOKIE_NAME = "ncr_admin_2fa";

export function createAdminTwoFactorToken(userId: string, ttlSeconds = 8 * 60 * 60) {
  const expires = Math.floor(Date.now() / 1000) + ttlSeconds;
  const payload = `${userId}.${expires}`;
  const signature = createHmac("sha256", process.env.NEXTAUTH_SECRET ?? "development-secret").update(payload).digest("hex");
  return { name: COOKIE_NAME, value: `${payload}.${signature}`, expires: new Date(expires * 1000) };
}

export function verifyAdminTwoFactorToken(token: string | undefined, userId: string) {
  if (!token) return false;
  const [tokenUserId, expiresText, signature] = token.split(".");
  if (!tokenUserId || !expiresText || !signature || tokenUserId !== userId || Number(expiresText) <= Math.floor(Date.now() / 1000)) return false;
  const expected = createHmac("sha256", process.env.NEXTAUTH_SECRET ?? "development-secret").update(`${tokenUserId}.${expiresText}`).digest("hex");
  return signature.length === expected.length && timingSafeEqual(Buffer.from(signature), Buffer.from(expected));
}

export const adminTwoFactorCookieName = COOKIE_NAME;
