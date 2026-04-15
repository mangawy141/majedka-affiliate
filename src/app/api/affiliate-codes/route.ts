import { NextRequest, NextResponse } from "next/server";
import { requireAdmin, getClientMeta } from "@/lib/middleware";
import { listAffiliateCodes, createAffiliateCode } from "@/lib/services/affiliate-code.service";
import { affiliateCodeCreateSchema } from "@/lib/validations";

/**
 * GET /api/affiliate-codes — list codes for the authenticated admin (paginated, searchable).
 */
export async function GET(req: NextRequest) {
  try {
    const adminAuth = await requireAdmin(req);
    if (!adminAuth.valid) return adminAuth.response;

    const url = new URL(req.url);
    const page = Math.max(1, parseInt(url.searchParams.get("page") || "1", 10));
    const limit = Math.min(
      100,
      Math.max(1, parseInt(url.searchParams.get("limit") || "10", 10)),
    );
    const search = url.searchParams.get("search") || "";
    const sortBy = url.searchParams.get("sortBy") || "createdAt";
    const order = url.searchParams.get("order") || "desc";

    const result = await listAffiliateCodes(adminAuth.admin.id, {
      page,
      limit,
      search,
      sortBy,
      order,
    });

    return NextResponse.json(
      {
        success: true,
        data: result.codes,
        pagination: result.pagination,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("GET affiliate-codes error:", error);
    return NextResponse.json({ error: "حدث خطأ في الخادم" }, { status: 500 });
  }
}

/**
 * POST /api/affiliate-codes — create a code (admin).
 */
export async function POST(req: NextRequest) {
  try {
    const adminAuth = await requireAdmin(req);
    if (!adminAuth.valid) return adminAuth.response;

    const json = await req.json();
    const parsed = affiliateCodeCreateSchema.safeParse(json);

    if (!parsed.success) {
      const msg =
        parsed.error.issues[0]?.message || "بيانات غير صالحة";
      return NextResponse.json({ error: msg }, { status: 400 });
    }

    const meta = getClientMeta(req);
    const result = await createAffiliateCode(
      adminAuth.admin.id,
      parsed.data,
      meta,
    );

    if (result.error === "VALIDATION") {
      return NextResponse.json({ error: result.message }, { status: 400 });
    }
    if (result.error === "DUPLICATE") {
      return NextResponse.json({ error: result.message }, { status: 409 });
    }

    return NextResponse.json(
      {
        success: true,
        message: "تم إنشاء كود جديد بنجاح",
        data: result.data,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("POST affiliate-codes error:", error);
    return NextResponse.json({ error: "حدث خطأ في الخادم" }, { status: 500 });
  }
}
