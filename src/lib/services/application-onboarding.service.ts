import { prisma } from "@/lib/db";
import { generateCodeSlug } from "@/lib/codes";
import { notifyApplicant } from "@/lib/notifications";
import type { AffiliateApplicationCreateInput } from "@/lib/validations";

function buildUniqueCodeCandidate(name: string, attempt = 0) {
  const base = generateCodeSlug(name) || "affiliate";
  const rand = Math.floor(1000 + Math.random() * 9000);
  const suffix = attempt > 0 ? `${rand}-${attempt}` : `${rand}`;
  return `${base}-${suffix}`.slice(0, 80);
}

async function generateUniqueAffiliateCode(name: string) {
  for (let attempt = 0; attempt < 25; attempt++) {
    const candidate = buildUniqueCodeCandidate(name, attempt);
    const [existsInAffiliate, existsInCodes] = await Promise.all([
      prisma.affiliate.findUnique({ where: { affiliateCode: candidate } }),
      prisma.affiliateCode.findUnique({ where: { code: candidate } }),
    ]);
    if (!existsInAffiliate && !existsInCodes) return candidate;
  }
  throw new Error("Unable to generate unique affiliate code");
}

async function getCodeOwnerAdminId() {
  const admin = await prisma.admin.findFirst({
    orderBy: { createdAt: "asc" },
    select: { id: true },
  });
  if (!admin) {
    throw new Error("No admin found. Bootstrap admin first.");
  }
  return admin.id;
}

export async function createApplicationWithAutoCode(
  input: AffiliateApplicationCreateInput,
) {
  const email = input.email.toLowerCase().trim();

  const existing = await prisma.affiliateApplication.findUnique({
    where: { email },
    select: { id: true, status: true, affiliate: { select: { affiliateCode: true } } },
  });
  if (existing) {
    throw new Error("هذا البريد الإلكتروني لديه طلب بالفعل");
  }

  const code = await generateUniqueAffiliateCode(input.name);
  const adminId = await getCodeOwnerAdminId();

  const { affiliate, application, affiliateCode } = await prisma.$transaction(
    async (tx) => {
      const affiliate = await tx.affiliate.create({
        data: {
          name: input.name.trim(),
          email,
          phone: input.phone || null,
          country: input.country || null,
          socialLinks: input.socialLinks
            ? input.socialLinks
            : { platform: input.platform || null, followers: input.followers || null },
          contentType: input.contentType || null,
          experience:
            input.followers === "1000+" ||
            input.followers === "10000+" ||
            input.followers === "100000+" ||
            input.followers === "1000000+"
              ? "intermediate"
              : "beginner",
          motivation: input.motivation || null,
          affiliateCode: code,
          status: "PENDING",
        },
      });

      const application = await tx.affiliateApplication.create({
        data: {
          name: affiliate.name,
          email: affiliate.email,
          phone: affiliate.phone,
          country: affiliate.country,
          socialLinks: affiliate.socialLinks ?? undefined,
          contentType: affiliate.contentType,
          experience: affiliate.experience,
          motivation: affiliate.motivation,
          status: "PENDING",
          affiliateId: affiliate.id,
        },
      });

      const affiliateCode = await tx.affiliateCode.create({
        data: {
          code,
          name: affiliate.name,
          owner: affiliate.name,
          clicks: 0,
          adminId,
          applicationId: application.id,
        },
      });

      return { affiliate, application, affiliateCode };
    },
  );

  await notifyApplicant({
    toEmail: affiliate.email,
    toPhone: affiliate.phone,
    name: affiliate.name,
    code: affiliateCode.code,
    status: "PENDING",
  });

  return { affiliate, application, affiliateCode };
}

export async function updateApplicationDecision(input: {
  id: string;
  action: "approve" | "reject";
  rejectionReason?: string;
}) {
  const application = await prisma.affiliateApplication.findUnique({
    where: { id: input.id },
    include: {
      affiliate: true,
      affiliateCode: true,
    },
  });

  if (!application || !application.affiliate || !application.affiliateCode) {
    throw new Error("الطلب غير موجود");
  }

  const approved = input.action === "approve";
  const now = new Date();

  const updated = await prisma.$transaction(async (tx) => {
    const app = await tx.affiliateApplication.update({
      where: { id: input.id },
      data: {
        status: approved ? "APPROVED" : "REJECTED",
        rejectionReason: approved ? null : (input.rejectionReason ?? "تم الرفض"),
        reviewedAt: now,
      },
    });

    const affiliate = await tx.affiliate.update({
      where: { id: application.affiliateId! },
      data: {
        status: approved ? "APPROVED" : "REJECTED",
        rejectionReason: approved ? null : (input.rejectionReason ?? "تم الرفض"),
        approvedAt: approved ? now : null,
      },
    });

    return { app, affiliate };
  });

  await notifyApplicant({
    toEmail: application.email,
    toPhone: application.phone,
    name: application.name,
    code: application.affiliateCode.code,
    status: approved ? "APPROVED" : "REJECTED",
    rejectionReason: approved ? null : (input.rejectionReason ?? "تم الرفض"),
  });

  return updated;
}

