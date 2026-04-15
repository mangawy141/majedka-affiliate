import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/middleware";

export async function GET(req: NextRequest) {
  const adminAuth = await requireAdmin(req);
  if (!adminAuth.valid) return adminAuth.response;

  return NextResponse.json(
    {
      success: true,
      admin: {
        id: adminAuth.admin.id,
        username: adminAuth.admin.username,
        role: (adminAuth.admin as unknown as { role?: string }).role,
      },
    },
    { status: 200 },
  );
}
