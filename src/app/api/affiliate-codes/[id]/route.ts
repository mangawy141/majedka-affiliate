import { NextRequest, NextResponse } from "next/server";
import { requireAdmin, getClientMeta } from "@/lib/middleware";
import {
  getAffiliateCodeForAdmin,
  updateAffiliateCode,
  deleteAffiliateCode,
} from "@/lib/services/affiliate-code.service";
import { affiliateCodeUpdateSchema } from "@/lib/validations";

type RouteCtx = { params: Promise<{ id: string }> };

/**
 * GET /api/affiliate-codes/:id
 */
export async function GET(req: NextRequest, ctx: RouteCtx) {
  try {
    const adminAuth = await requireAdmin(req);
    if (!adminAuth.valid) return adminAuth.response;

    const { id } = await ctx.params;
    const result = await getAffiliateCodeForAdmin(adminAuth.admin.id, id);

    if (result.error === "NOT_FOUND") {
      return NextResponse.json({ error: "الكود غير موجود" }, { status: 404 });
    }
    if (result.error === "FORBIDDEN") {
      return NextResponse.json(
        { error: "غير مصرح للوصول لهذا الكود" },
        { status: 403 },
      );
    }

    return NextResponse.json({ success: true, data: result.data }, { status: 200 });
  } catch (error) {
    console.error("GET affiliate-codes/[id] error:", error);
    return NextResponse.json({ error: "حدث خطأ في الخادم" }, { status: 500 });
  }
}

/**
 * PUT /api/affiliate-codes/:id
 */
export async function PUT(req: NextRequest, ctx: RouteCtx) {
  try {
    const adminAuth = await requireAdmin(req);
    if (!adminAuth.valid) return adminAuth.response;

    const { id } = await ctx.params;
    const json = await req.json();
    const parsed = affiliateCodeUpdateSchema.safeParse(json);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || "بيانات غير صالحة" },
        { status: 400 },
      );
    }

    const meta = getClientMeta(req);
    const result = await updateAffiliateCode(
      adminAuth.admin.id,
      id,
      parsed.data,
      meta,
    );

    if (result.error === "NOT_FOUND") {
      return NextResponse.json({ error: "الكود غير موجود" }, { status: 404 });
    }
    if (result.error === "FORBIDDEN") {
      return NextResponse.json(
        { error: "غير مصرح لتعديل هذا الكود" },
        { status: 403 },
      );
    }
    if (result.error === "VALIDATION") {
      return NextResponse.json({ error: result.message }, { status: 400 });
    }
    if (result.error === "DUPLICATE") {
      return NextResponse.json({ error: result.message }, { status: 409 });
    }
    if (result.error === "EMPTY") {
      return NextResponse.json(
        { error: "لا توجد بيانات للتحديث" },
        { status: 400 },
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "تم تحديث الكود بنجاح",
        data: result.data,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("PUT affiliate-codes/[id] error:", error);
    return NextResponse.json({ error: "حدث خطأ في الخادم" }, { status: 500 });
  }
}

/**
 * DELETE /api/affiliate-codes/:id
 */
export async function DELETE(req: NextRequest, ctx: RouteCtx) {
  try {
    const adminAuth = await requireAdmin(req);
    if (!adminAuth.valid) return adminAuth.response;

    const { id } = await ctx.params;
    const meta = getClientMeta(req);
    const result = await deleteAffiliateCode(adminAuth.admin.id, id, meta);

    if (result.error === "NOT_FOUND") {
      return NextResponse.json({ error: "الكود غير موجود" }, { status: 404 });
    }
    if (result.error === "FORBIDDEN") {
      return NextResponse.json(
        { error: "غير مصرح لحذف هذا الكود" },
        { status: 403 },
      );
    }

    return NextResponse.json(
      { success: true, message: "تم حذف الكود بنجاح" },
      { status: 200 },
    );
  } catch (error) {
    console.error("DELETE affiliate-codes/[id] error:", error);
    return NextResponse.json({ error: "حدث خطأ في الخادم" }, { status: 500 });
  }
}
