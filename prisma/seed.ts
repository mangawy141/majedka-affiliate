import { PrismaClient } from "@prisma/client";
import { hashPassword } from "../src/lib/auth";

const prisma = new PrismaClient();

async function main() {
  // Bootstrap admin if needed
  const username = process.env.ADMIN_BOOTSTRAP_USERNAME;
  const password = process.env.ADMIN_BOOTSTRAP_PASSWORD;

  if (username && password) {
    const adminCount = await prisma.admin.count();
    if (adminCount === 0) {
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
    } else {
      console.log("Admin already exists; bootstrap seed disabled.");
    }
  }

  // Seed default questions
  const questionsCount = await prisma.applicationQuestion.count();
  if (questionsCount === 0) {
    await prisma.applicationQuestion.createMany({
      data: [
        {
          label: "اسمك",
          type: "text",
          placeholder: "أدخل اسمك الكامل",
          required: true,
          order: 0,
          isActive: true,
        },
        {
          label: "بريدك الإلكتروني",
          type: "text",
          placeholder: "example@email.com",
          required: true,
          order: 1,
          isActive: true,
        },
        {
          label: "رقم الهاتف",
          type: "text",
          placeholder: "+966 50 0000000",
          required: true,
          order: 2,
          isActive: true,
        },
        {
          label: "كيف ستسوق للكود؟",
          type: "textarea",
          placeholder: "اشرح كيفية تسويقك للكود (على TikTok, Instagram، إلخ)",
          required: true,
          order: 3,
          isActive: true,
        },
      ],
    });
    console.log("Default questions seeded.");
  } else {
    console.log("Questions already exist; skipping seed.");
  }

  // Seed default social media links
  const socialLinksCount = await prisma.socialMediaLink.count();
  if (socialLinksCount === 0) {
    await prisma.socialMediaLink.createMany({
      data: [
        {
          platform: "whatsapp",
          label: "اتصل بنا على واتس",
          url: "https://wa.me/966",
          icon: "📱",
          order: 0,
          isActive: true,
        },
        {
          platform: "instagram",
          label: "تابعنا على Instagram",
          url: "https://instagram.com",
          icon: "📸",
          order: 1,
          isActive: true,
        },
        {
          platform: "tiktok",
          label: "تابعنا على TikTok",
          url: "https://tiktok.com",
          icon: "🎵",
          order: 2,
          isActive: true,
        },
      ],
    });
    console.log("Default social media links seeded.");
  } else {
    console.log("Social media links already exist; skipping seed.");
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
