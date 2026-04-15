import { PrismaClient } from "@prisma/client";
import { hashPassword } from "../src/lib/auth";

const prisma = new PrismaClient();

async function main() {
  const username = process.env.ADMIN_BOOTSTRAP_USERNAME;
  const password = process.env.ADMIN_BOOTSTRAP_PASSWORD;

  if (!username || !password) {
    console.log(
      "Skipping admin bootstrap seed: ADMIN_BOOTSTRAP_USERNAME/PASSWORD not set",
    );
    return;
  }

  const adminCount = await prisma.admin.count();
  if (adminCount > 0) {
    console.log("Admin already exists; bootstrap seed disabled.");
    return;
  }

  if (password.length < 12) {
    throw new Error("ADMIN_BOOTSTRAP_PASSWORD must be at least 12 chars");
  }

  const passwordHash = await hashPassword(password);

  await prisma.admin.create({
    data: {
      username,
      passwordHash,
      password: passwordHash, // legacy field for compatibility
      role: "SUPER_ADMIN",
    },
  });

  console.log("Bootstrap admin created.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

