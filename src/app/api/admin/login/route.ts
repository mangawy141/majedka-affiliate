import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { hashPassword, verifyPassword, signAdminToken } from "@/lib/auth";
import { validateRequestBody, createAuthResponse, getClientMeta } from "@/lib/middleware";
import { recordAuditLog } from "@/lib/audit";

/**
 * POST /api/admin/login
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const validation = validateRequestBody(body, ["username", "password"]);
    if (!validation.valid) {
      return NextResponse.json(
        { error: "اسم المستخدم وكلمة السر مطلوبان" },
        { status: 400 },
      );
    }

    const { username, password } = body as {
      username: string;
      password: string;
    };

    const admin = await prisma.admin.findUnique({
      where: { username },
      select: {
        id: true,
        username: true,
        password: true,
        passwordHash: true,
        role: true,
      },
    });

    if (!admin) {
      return NextResponse.json(
        { error: "بيانات تسجيل الدخول غير صحيحة" },
        { status: 401 },
      );
    }

    const storedHash = admin.passwordHash ?? admin.password;
    if (!storedHash) {
      return NextResponse.json(
        { error: "بيانات تسجيل الدخول غير صحيحة" },
        { status: 401 },
      );
    }

    const passwordValid = await verifyPassword(password, storedHash);

    if (!passwordValid) {
      return NextResponse.json(
        { error: "بيانات تسجيل الدخول غير صحيحة" },
        { status: 401 },
      );
    }

    const token = await signAdminToken(admin.id);
    const meta = getClientMeta(req);

    await recordAuditLog({
      adminId: admin.id,
      action: "LOGIN",
      resourceType: "Admin",
      resourceId: admin.id,
      ipAddress: meta.ipAddress,
      userAgent: meta.userAgent,
    });

    return createAuthResponse(
      {
        success: true,
        message: "تم تسجيل الدخول بنجاح",
        admin: {
          id: admin.id,
          username: admin.username,
          role: admin.role,
        },
      },
      token,
    );
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json({ error: "حدث خطأ في الخادم" }, { status: 500 });
  }
}

/**
 * PUT /api/admin/login — bootstrap first admin (or with ADMIN_SETUP_TOKEN).
 */
export async function PUT(req: NextRequest) {
  try {
    const adminCount = await prisma.admin.count();

    // Hard-disable bootstrap after the first admin exists.
    if (adminCount > 0) {
      return NextResponse.json(
        { error: "تم إغلاق مسار التهيئة بعد إنشاء أول مسؤول" },
        { status: 410 },
      );
    }

    // Require an env secret for first-time setup (one-time use).
    const setupToken = req.headers.get("x-setup-token");
    const expectedToken = process.env.ADMIN_SETUP_TOKEN;
    if (!setupToken || !expectedToken || setupToken !== expectedToken) {
      return NextResponse.json({ error: "غير مصرح لمسار التهيئة" }, { status: 403 });
    }

    const body = await req.json();
    const validation = validateRequestBody(body, ["username", "password"]);

    if (!validation.valid) {
      return NextResponse.json({ error: "بيانات غير صحيحة" }, { status: 400 });
    }

    const { username, password } = body as {
      username: string;
      password: string;
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

    if (password.length < 8) {
      return NextResponse.json(
        { error: "كلمة السر يجب أن تكون 8 أحرف على الأقل" },
        { status: 400 },
      );
    }

    const existingAdmin = await prisma.admin.findUnique({
      where: { username },
    });

    if (existingAdmin) {
      return NextResponse.json(
        { error: "اسم المستخدم موجود بالفعل" },
        { status: 409 },
      );
    }

    const hashedPassword = await hashPassword(password);

    const admin = await prisma.admin.create({
      data: {
        username,
        passwordHash: hashedPassword,
        password: hashedPassword,
        role: "SUPER_ADMIN",
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "تم إنشاء مسؤول جديد بنجاح",
        admin: {
          id: admin.id,
          username: admin.username,
        },
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Register error:", error);
    return NextResponse.json({ error: "حدث خطأ في الخادم" }, { status: 500 });
  }
}
