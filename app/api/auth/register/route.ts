import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/lib/security";
import { sendEmailVerification } from "@/lib/integrations";
import { enforceRateLimit, requestIdentifier } from "@/lib/rate-limit";
import { ApiError, handleApiError, validationError } from "@/lib/api-error";

const registrationSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  phone: z.string().min(10).max(15),
  password: z.string().min(12).max(128)
});

export async function POST(request: Request) {
  try {
    enforceRateLimit("login", requestIdentifier(request));
    const parsed = registrationSchema.safeParse(await request.json());
    if (!parsed.success) return validationError(parsed.error.flatten());
    const existing = await prisma.user.findFirst({
      where: { OR: [{ email: parsed.data.email.toLowerCase() }, { phone: parsed.data.phone }] }
    });
    if (existing) throw new ApiError(409, "An account already exists for this email or phone.", "ACCOUNT_EXISTS");
    const user = await prisma.user.create({
      data: {
        name: parsed.data.name,
        email: parsed.data.email.toLowerCase(),
        phone: parsed.data.phone,
        passwordHash: await hashPassword(parsed.data.password)
      },
      select: { id: true, name: true, email: true, phone: true, status: true }
    });
    const notification = await sendEmailVerification(parsed.data.email);
    await prisma.auditLog.create({
      data: { actorId: user.id, action: "CUSTOMER_REGISTERED", entityType: "User", entityId: user.id }
    });
    return NextResponse.json({ user, notification }, { status: 201 });
  } catch (error) {
    return handleApiError(error, { route: "POST /api/auth/register" });
  }
}
