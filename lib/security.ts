import bcrypt from "bcryptjs";

export const allowedDocumentMimeTypes = ["image/jpeg", "image/png", "application/pdf"];
export const maxDocumentSizeBytes = 8 * 1024 * 1024;

export async function hashPassword(password: string) {
  return bcrypt.hash(password, 12);
}

export async function verifyPassword(password: string, hash: string) {
  return bcrypt.compare(password, hash);
}

export function requireRole(userRole: string | undefined, allowed: string[]) {
  if (!userRole || !allowed.includes(userRole)) {
    throw new Error("Insufficient permissions");
  }
}

export function rateLimitPlaceholder(identifier: string) {
  return {
    identifier,
    allowed: true,
    note: "Replace with Redis-backed sliding window rate limiting in production."
  };
}
