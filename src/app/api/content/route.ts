import { NextResponse } from "next/server";
import { getSiteContent } from "@/lib/site-content";

export async function GET() {
  try {
    const content = await getSiteContent();
    return NextResponse.json({ success: true, data: content }, { status: 200 });
  } catch (error) {
    console.error("GET /api/content error:", error);
    return NextResponse.json({ error: "حدث خطأ في الخادم" }, { status: 500 });
  }
}
