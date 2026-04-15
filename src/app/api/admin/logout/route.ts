import { NextResponse } from "next/server";
import { createLogoutResponse } from "@/lib/middleware";

export async function POST() {
  return createLogoutResponse();
}
