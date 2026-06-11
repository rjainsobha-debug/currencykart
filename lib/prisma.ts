import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export function getPrismaClient(): PrismaClient {
  if (globalForPrisma.prisma) return globalForPrisma.prisma;

  const client = new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"]
  });

  globalForPrisma.prisma = client;
  return client;
}

/**
 * Defers Prisma initialization until a runtime request performs its first
 * database operation. Importing API and auth modules during a build stays inert.
 */
export const prisma = new Proxy({} as PrismaClient, {
  get(_target, property) {
    const client = getPrismaClient();
    const value = Reflect.get(client, property, client);
    return typeof value === "function" ? value.bind(client) : value;
  }
});
