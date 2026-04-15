import { NextRequest, NextResponse } from "next/server";
import { affiliateApplicationCreateSchema } from "@/lib/validations";
import { createApplicationWithAutoCode } from "@/lib/services/application-onboarding.service";

export async function POST(req: NextRequest) {
  try {
    const json = await req.json();
    const parsed = affiliateApplicationCreateSchema.safeParse(json);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || "بيانات غير صالحة" },
        { status: 400 },
      );
    }

    const result = await createApplicationWithAutoCode(parsed.data);

    return NextResponse.json(
      {
        success: true,
        message: "تم استلام طلبك وإنشاء كودك المبدئي بنجاح",
        data: {
          applicationId: result.application.id,
          affiliateId: result.affiliate.id,
          affiliateCode: result.affiliateCode.code,
          status: result.application.status,
        },
      },
      { status: 201 },
    );
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "حدث خطأ في الخادم";
    const status = message.includes("لديه طلب بالفعل") ? 409 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}

