import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { trackSaleSchema } from "@/lib/validations";

// Commission percentage
const COMMISSION_RATE = 0.1; // 10%

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Validate input
    const validatedData = trackSaleSchema.parse(body);
    const { code, orderId, amount } = validatedData;

    // Validate order ID uniqueness (prevent double counting)
    const existingSale = await prisma.sale.findUnique({
      where: { orderId },
    });

    if (existingSale) {
      return NextResponse.json(
        { error: "هذا الطلب مسجل بالفعل" },
        { status: 409 },
      );
    }

    // Find approved affiliate with this code
    const affiliate = await prisma.affiliate.findFirst({
      where: {
        affiliateCode: code,
        status: "APPROVED",
      },
    });

    if (!affiliate) {
      return NextResponse.json(
        { error: "كود المسوّق غير صحيح أو غير مفعّل" },
        { status: 404 },
      );
    }

    // Calculate commission
    const commission = amount * COMMISSION_RATE;

    // Create sale record
    const sale = await prisma.sale.create({
      data: {
        affiliateId: affiliate.id,
        orderId,
        amount,
        commission,
      },
    });

    // Update affiliate stats
    await prisma.affiliate.update({
      where: { id: affiliate.id },
      data: {
        totalSales: { increment: 1 },
        totalEarnings: { increment: commission },
      },
    });

    return NextResponse.json(
      {
        success: true,
        sale: {
          id: sale.id,
          orderId: sale.orderId,
          amount: sale.amount,
          commission: sale.commission,
        },
        affiliateEarnings: {
          totalSales: affiliate.totalSales + 1,
          totalEarnings: affiliate.totalEarnings + commission,
        },
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Track sale error:", error);
    return NextResponse.json({ error: "فشل تسجيل البيع" }, { status: 500 });
  }
}
