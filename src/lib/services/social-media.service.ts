import { prisma } from "@/lib/db";
import { SocialMediaLink } from "@prisma/client";

export async function getAllSocialMediaLinks(): Promise<SocialMediaLink[]> {
  return prisma.socialMediaLink.findMany({
    where: { isActive: true },
    orderBy: { order: "asc" },
  });
}

export async function createSocialMediaLink(
  data: Omit<SocialMediaLink, "id" | "createdAt" | "updatedAt">
) {
  return prisma.socialMediaLink.create({
    data,
  });
}

export async function updateSocialMediaLink(
  id: string,
  data: Partial<Omit<SocialMediaLink, "id" | "createdAt" | "updatedAt">>
) {
  return prisma.socialMediaLink.update({
    where: { id },
    data,
  });
}

export async function deleteSocialMediaLink(id: string) {
  return prisma.socialMediaLink.update({
    where: { id },
    data: { isActive: false },
  });
}

export async function updateSocialMediaLinkByPlatform(
  platform: string,
  data: Partial<Omit<SocialMediaLink, "id" | "createdAt" | "updatedAt" | "platform">>
) {
  return prisma.socialMediaLink.update({
    where: { platform },
    data,
  });
}
