import { PrismaClient, UserRole, UserStatus } from "@prisma/client";
import { hashPassword } from "../lib/security";

const prisma = new PrismaClient();

async function main() {
  const email = process.env.ADMIN_BOOTSTRAP_EMAIL;
  const password = process.env.ADMIN_BOOTSTRAP_PASSWORD;

  if (!email || !password) {
    throw new Error("Set ADMIN_BOOTSTRAP_EMAIL and ADMIN_BOOTSTRAP_PASSWORD before creating an admin.");
  }

  await prisma.user.upsert({
    where: { email },
    update: { role: UserRole.ADMIN, status: UserStatus.ACTIVE },
    create: {
      email,
      name: "Platform Admin",
      passwordHash: await hashPassword(password),
      emailVerified: new Date(),
      role: UserRole.ADMIN,
      status: UserStatus.ACTIVE
    }
  });

  console.log(`Admin ready: ${email}`);
}

main()
  .then(async () => prisma.$disconnect())
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
