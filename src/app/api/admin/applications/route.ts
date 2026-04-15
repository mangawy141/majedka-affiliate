import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/middleware";
import { prisma } from "@/lib/db";
import { getAdminContactLinks } from "@/lib/notifications";

export async function GET(req: NextRequest) {
  const adminAuth = await requireAdmin(req);
  if (!adminAuth.valid) return adminAuth.response;

  try {
    const url = new URL(req.url);
    const status = (url.searchParams.get("status") || "PENDING").toUpperCase();
    const page = Math.max(1, parseInt(url.searchParams.get("page") || "1", 10));
    const limit = Math.min(
      100,
      Math.max(1, parseInt(url.searchParams.get("limit") || "10", 10)),
    );
    const skip = (page - 1) * limit;

    const where =
      status === "ALL"
        ? {}
        : { status: status as "PENDING" | "APPROVED" | "REJECTED" };

    const [total, rows, pendingCount] = await Promise.all([
      prisma.affiliateApplication.count({ where }),
      prisma.affiliateApplication.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
        include: {
          affiliateCode: { select: { code: true } },
          affiliate: {
            select: {
              id: true,
              status: true,
              approvedAt: true,
              rejectionReason: true,
            },
          },
        },
      }),
      prisma.affiliateApplication.count({ where: { status: "PENDING" } }),
    ]);

    const data = rows.map((row) => ({
      ...row,
      ...getAdminContactLinks(row.phone, row.email),
    }));

    return NextResponse.json({
      success: true,
      data,
      pendingCount,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit) || 1,
      },
    });
  } catch (error) {
    console.error("GET /api/admin/applications error:", error);
    return NextResponse.json({ error: "حدث خطأ في الخادم" }, { status: 500 });
  }
}

