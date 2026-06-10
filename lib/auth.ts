import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "./prisma";
import { verifyPassword } from "./security";
import { enforceRateLimit } from "./rate-limit";
import { logger } from "./logger";
import { OtpPurpose } from "@prisma/client";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  pages: { signIn: "/login" },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? ""
    }),
    CredentialsProvider({
      name: "Email and password",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials.password) return null;
        enforceRateLimit("login", credentials.email.toLowerCase());
        const user = await prisma.user.findUnique({ where: { email: credentials.email } });
        if (!user?.passwordHash || user.status !== "ACTIVE") {
          logger.warn("Credential login rejected", { email: credentials.email, reason: "missing-user-or-inactive" });
          return null;
        }
        const ok = await verifyPassword(credentials.password, user.passwordHash);
        if (!ok) {
          logger.warn("Credential login rejected", { email: credentials.email, reason: "bad-password" });
          return null;
        }
        return { id: user.id, email: user.email, name: user.name, role: user.role };
      }
    }),
    CredentialsProvider({
      id: "mobile-otp",
      name: "Mobile OTP",
      credentials: {
        phone: { label: "Phone", type: "tel" },
        challengeId: { label: "Challenge", type: "text" }
      },
      async authorize(credentials) {
        if (!credentials?.phone || !credentials.challengeId) return null;
        const challenge = await prisma.otpChallenge.findFirst({
          where: {
            id: credentials.challengeId,
            identifier: credentials.phone,
            purpose: OtpPurpose.PHONE_LOGIN,
            verifiedAt: { not: null },
            consumedAt: null,
            expiresAt: { gt: new Date() }
          }
        });
        if (!challenge?.userId) return null;
        const user = await prisma.user.findUnique({ where: { id: challenge.userId } });
        if (!user || user.status !== "ACTIVE") return null;
        await prisma.otpChallenge.update({ where: { id: challenge.id }, data: { consumedAt: new Date() } });
        await prisma.auditLog.create({ data: { actorId: user.id, action: "PHONE_OTP_SESSION_CREATED", entityType: "OtpChallenge", entityId: challenge.id } });
        return { id: user.id, email: user.email, name: user.name, role: user.role };
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) token.role = user.role ?? "CUSTOMER";
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub;
        session.user.role = token.role;
      }
      return session;
    }
  }
};
