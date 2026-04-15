import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { sanitizeAffiliateCode } from "@/lib/affiliate-codes";
import { requireAdmin } from "@/lib/middleware";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const adminAuth = await requireAdmin(req);
  if (!adminAuth.valid) return adminAuth.response;

  try {
    const { id } = await params;

    const affiliate = await prisma.affiliate.findUnique({
      where: { id },
      include: {
        clicks: {
          take: 5,
          orderBy: { createdAt: "desc" },
        },
        sales: {
          take: 5,
          orderBy: { createdAt: "desc" },
        },
      },
    });

    if (!affiliate) {
      return NextResponse.json(
        { error: "لم يتم العثور على المسوّق" },
        { status: 404 },
      );
    }

    return NextResponse.json({
      success: true,
      data: affiliate,
    });
  } catch (error) {
    console.error("Get affiliate error:", error);
    return NextResponse.json({ error: "حدث خطأ في الخادم" }, { status: 500 });
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const adminAuth = await requireAdmin(req);
  if (!adminAuth.valid) return adminAuth.response;

  try {
    const { id } = await params;
    const body = await req.json();
    const { action, customCode, rejectionReason } = body;

    if (!action || !["approve", "reject"].includes(action)) {
      return NextResponse.json({ error: "إجراء غير صالح" }, { status: 400 });
    }

    // Get the affiliate
    const affiliate = await prisma.affiliate.findUnique({
      where: { id },
    });

    if (!affiliate) {
      return NextResponse.json(
        { error: "لم يتم العثور على المسوّق" },
        { status: 404 },
      );
    }

    // Process approve
    if (action === "approve") {
      let finalCode = affiliate.affiliateCode;

      // Allow custom code if provided
      if (customCode) {
        const sanitized = sanitizeAffiliateCode(customCode);

        // Check if custom code is unique
        const codeExists = await prisma.affiliate.findFirst({
          where: {
            affiliateCode: sanitized,
            id: { not: id },
          },
        });

        if (codeExists) {
          return NextResponse.json(
            { error: "هذا الكود مستخدم بالفعل" },
            { status: 409 },
          );
        }

        finalCode = sanitized;
      }

      const updated = await prisma.affiliate.update({
        where: { id },
        data: {
          status: "APPROVED",
          affiliateCode: finalCode,
          approvedAt: new Date(),
        },
      });

      return NextResponse.json({
        success: true,
        message: "تم الموافقة على المسوّق",
        data: updated,
      });
    }

    // Process reject
    if (action === "reject") {
      if (!rejectionReason) {
        return NextResponse.json(
          { error: "يجب تقديم سبب الرفض" },
          { status: 400 },
        );
      }

      const updated = await prisma.affiliate.update({
        where: { id },
        data: {
          status: "REJECTED",
          rejectionReason,
        },
      });

      return NextResponse.json({
        success: true,
        message: "تم رفض المسوّق",
        data: updated,
      });
    }
  } catch (error) {
    console.error("Update affiliate error:", error);
    return NextResponse.json({ error: "حدث خطأ في الخادم" }, { status: 500 });
  }
}
