import { NextRequest, NextResponse } from "next/server";
import { requireAdmin, getClientMeta } from "@/lib/middleware";
import { adminApplicationUpdateSchema } from "@/lib/validations";
import { updateApplicationDecision } from "@/lib/services/application-onboarding.service";
import { recordAuditLog } from "@/lib/audit";

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const adminAuth = await requireAdmin(req);
  if (!adminAuth.valid) return adminAuth.response;

  try {
    const { id } = await params;
    const json = await req.json();
    const parsed = adminApplicationUpdateSchema.safeParse(json);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || "بيانات غير صالحة" },
        { status: 400 },
      );
    }

    if (parsed.data.action === "reject" && !parsed.data.rejectionReason) {
      return NextResponse.json(
        { error: "سبب الرفض مطلوب" },
        { status: 400 },
      );
    }

    const updated = await updateApplicationDecision({
      id,
      action: parsed.data.action,
      rejectionReason: parsed.data.rejectionReason,
    });

    const meta = getClientMeta(req);
    await recordAuditLog({
      adminId: adminAuth.admin.id,
      action: "UPDATE",
      resourceType: "AffiliateApplication",
      resourceId: id,
      changes: parsed.data,
      ipAddress: meta.ipAddress,
      userAgent: meta.userAgent,
    });

    return NextResponse.json({
      success: true,
      data: updated,
      message:
        parsed.data.action === "approve"
          ? "تمت الموافقة على الطلب"
          : "تم رفض الطلب",
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "حدث خطأ في الخادم";
    const status = message.includes("غير موجود") ? 404 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}

