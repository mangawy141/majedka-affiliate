import { NextRequest, NextResponse } from "next/server";
import { getClientMeta, requireAdmin } from "@/lib/middleware";
import { recordAuditLog } from "@/lib/audit";
import { getSiteContent, updateSiteContent } from "@/lib/site-content";
import { siteContentUpdateSchema } from "@/lib/validations";

export async function GET(req: NextRequest) {
  const adminAuth = await requireAdmin(req);
  if (!adminAuth.valid) return adminAuth.response;

  try {
    const data = await getSiteContent();
    return NextResponse.json({ success: true, data }, { status: 200 });
  } catch (error) {
    console.error("GET /api/admin/content error:", error);
    return NextResponse.json({ error: "حدث خطأ في الخادم" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  const adminAuth = await requireAdmin(req);
  if (!adminAuth.valid) return adminAuth.response;

  try {
    const payload = await req.json();
    const parsed = siteContentUpdateSchema.safeParse(payload);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? "بيانات غير صالحة" },
        { status: 400 },
      );
    }

    const data = await updateSiteContent(parsed.data);
    const meta = getClientMeta(req);

    await recordAuditLog({
      adminId: adminAuth.admin.id,
      action: "UPDATE",
      resourceType: "SiteContent",
      changes: parsed.data,
      ipAddress: meta.ipAddress,
      userAgent: meta.userAgent,
    });

    return NextResponse.json(
      { success: true, message: "تم تحديث المحتوى", data },
      { status: 200 },
    );
  } catch (error) {
    console.error("PUT /api/admin/content error:", error);
    return NextResponse.json({ error: "حدث خطأ في الخادم" }, { status: 500 });
  }
}
