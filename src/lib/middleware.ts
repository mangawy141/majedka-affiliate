/**
 * API route protection and auth helpers for admin routes.
 */

import { NextRequest, NextResponse } from "next/server";
import { verifyAdminToken } from "@/lib/auth";
import { prisma } from "@/lib/db";

const COOKIE_NAME = "admin-token";

export function getBearerToken(req: NextRequest): string | null {
  const authHeader = req.headers.get("authorization");
  if (authHeader?.startsWith("Bearer ")) {
    return authHeader.slice(7).trim() || null;
  }
  return null;
}

export function getAdminTokenFromRequest(req: NextRequest): string | null {
  return getBearerToken(req) ?? req.cookies.get(COOKIE_NAME)?.value ?? null;
}

/**
 * Verifies JWT from Authorization: Bearer or admin-token cookie, loads admin.
 */
export async function requireAdmin(req: NextRequest) {
  try {
    const token = getAdminTokenFromRequest(req);
    const adminId = await verifyAdminToken(token);

    if (!adminId) {
      return {
        valid: false as const,
        response: NextResponse.json(
          { error: "غير مصرح - يجب تسجيل الدخول أولاً" },
          { status: 401 },
        ),
      };
    }

    const admin = await prisma.admin.findUnique({
      where: { id: adminId },
    });

    if (!admin) {
      return {
        valid: false as const,
        response: NextResponse.json(
          { error: "المستخدم غير موجود" },
          { status: 401 },
        ),
      };
    }

    return {
      valid: true as const,
      admin,
    };
  } catch (error) {
    console.error("Auth middleware error:", error);
    return {
      valid: false as const,
      response: NextResponse.json(
        { error: "خطأ في المصادقة" },
        { status: 500 },
      ),
    };
  }
}

export function createAuthResponse(
  data: Record<string, unknown>,
  authToken: string,
) {
  const response = NextResponse.json(
    { ...data },
    { status: 200 },
  );

  response.cookies.set({
    name: COOKIE_NAME,
    value: authToken,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 86400,
    path: "/",
  });

  return response;
}

export function createLogoutResponse() {
  const response = NextResponse.json(
    { message: "تم تسجيل الخروج بنجاح" },
    { status: 200 },
  );

  response.cookies.delete(COOKIE_NAME);

  return response;
}

export function validateRequestBody(
  body: unknown,
  requiredFields: string[],
): { valid: boolean; errors?: Record<string, string> } {
  if (!body || typeof body !== "object") {
    return { valid: false, errors: { body: "طلب غير صحيح" } };
  }

  const errors: Record<string, string> = {};

  for (const field of requiredFields) {
    const value = (body as Record<string, unknown>)[field];
    if (value === undefined || value === null || value === "") {
      errors[field] = `${field} مطلوب`;
    }
  }

  return Object.keys(errors).length === 0
    ? { valid: true }
    : { valid: false, errors };
}

export function getClientMeta(req: NextRequest) {
  const forwarded = req.headers.get("x-forwarded-for");
  const ip = forwarded?.split(",")[0]?.trim() || null;
  return {
    ipAddress: ip,
    userAgent: req.headers.get("user-agent"),
  };
}
