/**
 * Affiliate code CRUD — used by /api/affiliate-codes and /api/admin/codes.
 */

import { prisma } from "@/lib/db";
import { recordAuditLog } from "@/lib/audit";
import {
  generateAutoCode,
  normalizeStoredCode,
  validateCodeFormat,
} from "@/lib/codes";
import type { Prisma } from "@prisma/client";

export type ListAffiliateCodesParams = {
  page: number;
  limit: number;
  search: string;
  sortBy: string;
  order: string;
};

export async function listAffiliateCodes(
  adminId: string,
  params: ListAffiliateCodesParams,
) {
  const { page, limit, search, sortBy, order } = params;
  const skip = (page - 1) * limit;

  const where: Prisma.AffiliateCodeWhereInput = {
    adminId,
  };

  if (search.trim()) {
    where.OR = [
      { code: { contains: search, mode: "insensitive" } },
      { name: { contains: search, mode: "insensitive" } },
      { owner: { contains: search, mode: "insensitive" } },
    ];
  }

  const orderBy: Prisma.AffiliateCodeOrderByWithRelationInput = {};
  if (sortBy === "clicks" || sortBy === "createdAt" || sortBy === "name") {
    orderBy[sortBy] = order === "asc" ? "asc" : "desc";
  } else {
    orderBy.createdAt = "desc";
  }

  const total = await prisma.affiliateCode.count({ where });

  const codes = await prisma.affiliateCode.findMany({
    where,
    orderBy,
    skip,
    take: limit,
    select: {
      id: true,
      code: true,
      name: true,
      owner: true,
      clicks: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  return {
    codes,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit) || 1,
    },
  };
}

export async function getAffiliateCodeForAdmin(adminId: string, id: string) {
  const code = await prisma.affiliateCode.findUnique({
    where: { id },
  });

  if (!code) return { error: "NOT_FOUND" as const };
  if (code.adminId !== adminId) return { error: "FORBIDDEN" as const };

  return { data: code };
}

export async function createAffiliateCode(
  adminId: string,
  input: { code?: string; name: string; owner: string },
  meta?: { ipAddress?: string | null; userAgent?: string | null },
) {
  let codeValue = input.code?.trim();

  if (!codeValue) {
    codeValue = generateAutoCode(input.name);
  } else {
    const codeValidation = validateCodeFormat(codeValue);
    if (!codeValidation.valid) {
      return { error: "VALIDATION" as const, message: codeValidation.message! };
    }
    codeValue = normalizeStoredCode(codeValue);
  }

  const existingCode = await prisma.affiliateCode.findUnique({
    where: { code: codeValue },
  });

  if (existingCode) {
    return {
      error: "DUPLICATE" as const,
      message: "هذا الكود موجود بالفعل",
    };
  }

  const affiliateCode = await prisma.affiliateCode.create({
    data: {
      code: codeValue,
      name: input.name.trim(),
      owner: input.owner.trim(),
      adminId,
      clicks: 0,
    },
  });

  await recordAuditLog({
    adminId,
    action: "CREATE",
    resourceType: "AffiliateCode",
    resourceId: affiliateCode.id,
    changes: { code: affiliateCode.code, name: affiliateCode.name },
    ipAddress: meta?.ipAddress,
    userAgent: meta?.userAgent,
  });

  return { data: affiliateCode };
}

export async function updateAffiliateCode(
  adminId: string,
  id: string,
  body: {
    code?: string;
    name?: string;
    owner?: string;
    clicks?: number;
  },
  meta?: { ipAddress?: string | null; userAgent?: string | null },
) {
  const currentCode = await prisma.affiliateCode.findUnique({
    where: { id },
  });

  if (!currentCode) return { error: "NOT_FOUND" as const };
  if (currentCode.adminId !== adminId) return { error: "FORBIDDEN" as const };

  const updateData: Prisma.AffiliateCodeUpdateInput = {};

  if (body.code !== undefined && body.code !== currentCode.code) {
    const codeValidation = validateCodeFormat(body.code);
    if (!codeValidation.valid) {
      return { error: "VALIDATION" as const, message: codeValidation.message! };
    }

    const normalizedCode = normalizeStoredCode(body.code);

    const existingCode = await prisma.affiliateCode.findUnique({
      where: { code: normalizedCode },
    });

    if (existingCode && existingCode.id !== id) {
      return {
        error: "DUPLICATE" as const,
        message: "هذا الكود موجود بالفعل",
      };
    }

    updateData.code = normalizedCode;
  }

  if (body.name !== undefined && body.name.trim()) {
    updateData.name = body.name.trim();
  }

  if (body.owner !== undefined && body.owner.trim()) {
    updateData.owner = body.owner.trim();
  }

  if (body.clicks !== undefined && typeof body.clicks === "number") {
    updateData.clicks = Math.max(0, Math.floor(body.clicks));
  }

  if (Object.keys(updateData).length === 0) {
    return { error: "EMPTY" as const };
  }

  const updatedCode = await prisma.affiliateCode.update({
    where: { id },
    data: updateData,
  });

  await recordAuditLog({
    adminId,
    action: "UPDATE",
    resourceType: "AffiliateCode",
    resourceId: id,
    changes: updateData,
    ipAddress: meta?.ipAddress,
    userAgent: meta?.userAgent,
  });

  return { data: updatedCode };
}

export async function deleteAffiliateCode(
  adminId: string,
  id: string,
  meta?: { ipAddress?: string | null; userAgent?: string | null },
) {
  const code = await prisma.affiliateCode.findUnique({
    where: { id },
  });

  if (!code) return { error: "NOT_FOUND" as const };
  if (code.adminId !== adminId) return { error: "FORBIDDEN" as const };

  await prisma.affiliateCode.delete({
    where: { id },
  });

  await recordAuditLog({
    adminId,
    action: "DELETE",
    resourceType: "AffiliateCode",
    resourceId: id,
    changes: { code: code.code },
    ipAddress: meta?.ipAddress,
    userAgent: meta?.userAgent,
  });

  return { success: true as const };
}
