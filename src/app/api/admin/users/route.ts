import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAdmin, validateRequestBody, getClientMeta } from "@/lib/middleware";
import { hashPassword } from "@/lib/auth";
import { recordAuditLog } from "@/lib/audit";

export async function POST(req: NextRequest) {
  const adminAuth = await requireAdmin(req);
  if (!adminAuth.valid) return adminAuth.response;

  try {
    const body = await req.json();
    const validation = validateRequestBody(body, ["username", "password"]);
    if (!validation.valid) {
      return NextResponse.json({ error: "بيانات غير صحيحة" }, { status: 400 });
    }

    const { username, password, role } = body as {
      username: string;
      password: string;
      role?: "SUPER_ADMIN" | "ADMIN";
    };

    if (username.length < 3 || username.length > 20) {
      return NextResponse.json(
        { error: "اسم المستخدم يجب أن يكون بين 3 و 20 أحرف" },
        { status: 400 },
      );
    }
    if (!/^[a-zA-Z0-9_]+$/.test(username)) {
      return NextResponse.json(
        { error: "اسم المستخدم يجب أن يحتوي على أحرف وأرقام وشرطات سفلية فقط" },
        { status: 400 },
      );
    }
    if (password.length < 12) {
      return NextResponse.json(
        { error: "كلمة السر يجب أن تكون 12 حرفاً على الأقل" },
        { status: 400 },
      );
    }

    const exists = await prisma.admin.findUnique({ where: { username } });
    if (exists) {
      return NextResponse.json({ error: "اسم المستخدم موجود بالفعل" }, { status: 409 });
    }

    const passwordHash = await hashPassword(password);
    const created = await prisma.admin.create({
      data: {
        username,
        passwordHash,
        password: passwordHash,
        role: role ?? "ADMIN",
      },
      select: { id: true, username: true, role: true, createdAt: true },
    });

    const meta = getClientMeta(req);
    await recordAuditLog({
      adminId: adminAuth.admin.id,
      action: "CREATE",
      resourceType: "Admin",
      resourceId: created.id,
      changes: { username: created.username, role: created.role },
      ipAddress: meta.ipAddress,
      userAgent: meta.userAgent,
    });

    return NextResponse.json({ success: true, data: created }, { status: 201 });
  } catch (error) {
    console.error("POST /api/admin/users error:", error);
    return NextResponse.json({ error: "حدث خطأ في الخادم" }, { status: 500 });
  }
}

