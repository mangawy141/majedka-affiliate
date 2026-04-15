import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { trackClickSchema } from "@/lib/validations";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Validate input
    const validatedData = trackClickSchema.parse(body);
    const { code, ip, userAgent } = validatedData;

    // Find approved affiliate with this code
    const affiliate = await prisma.affiliate.findFirst({
      where: {
        affiliateCode: code,
        status: "APPROVED",
      },
    });

    if (!affiliate) {
      // Still track it but return 404 so consumer knows it's invalid
      return NextResponse.json(
        { error: "كود المسوّق غير صحيح أو غير مفعّل" },
        { status: 404 },
      );
    }

    // Create click record
    // Get IP from headers if not provided
    let clickIp: string | null | undefined = ip;
    if (!clickIp) {
      clickIp =
        req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
        req.headers.get("x-real-ip") ||
        undefined;
    }

    await prisma.click.create({
      data: {
        affiliateId: affiliate.id,
        ip: clickIp,
        userAgent: userAgent || req.headers.get("user-agent") || null,
      },
    });

    // Increment click counter
    await prisma.affiliate.update({
      where: { id: affiliate.id },
      data: {
        totalClicks: { increment: 1 },
      },
    });

    return NextResponse.json(
      {
        success: true,
        affiliateId: affiliate.id,
        discount: 0.1, // 10% discount
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Track click error:", error);
    return NextResponse.json({ error: "فشل تسجيل الكليك" }, { status: 500 });
  }
}
