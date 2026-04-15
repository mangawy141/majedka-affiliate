import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/middleware";

export async function GET(req: NextRequest) {
  const adminAuth = await requireAdmin(req);
  if (!adminAuth.valid) return adminAuth.response;

  try {
    // Get query parameters for filtering
    const searchParams = req.nextUrl.searchParams;
    const status = searchParams.get("status");
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "20", 10);

    const skip = (page - 1) * limit;

    // Build where clause
    const where =
      status &&
      ["PENDING", "APPROVED", "REJECTED"].includes(status.toUpperCase())
        ? { status: status.toUpperCase() as any }
        : {};

    // Get total count
    const total = await prisma.affiliate.count({ where });

    // Get affiliates
    const affiliates = await prisma.affiliate.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
      select: {
        id: true,
        name: true,
        email: true,
        country: true,
        contentType: true,
        affiliateCode: true,
        status: true,
        totalClicks: true,
        totalSales: true,
        totalEarnings: true,
        createdAt: true,
        approvedAt: true,
      },
    });

    return NextResponse.json({
      success: true,
      data: affiliates,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Get affiliates error:", error);
    return NextResponse.json({ error: "حدث خطأ في الخادم" }, { status: 500 });
  }
}
