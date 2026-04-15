import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/admin/login")) {
    const token = request.cookies.get("admin-token")?.value;
    if (token) {
      const url = request.nextUrl.clone();
      url.pathname = "/admin/dashboard";
      url.searchParams.delete("next");
      return NextResponse.redirect(url);
    }
    return NextResponse.next();
  }

  if (
    pathname === "/admin" ||
    pathname.startsWith("/admin/dashboard") ||
    pathname.startsWith("/admin/codes") ||
    pathname.startsWith("/admin/content") ||
    pathname.startsWith("/admin/settings") ||
    pathname.startsWith("/admin/create-user")
  ) {
    const token = request.cookies.get("admin-token")?.value;
    if (!token) {
      const url = request.nextUrl.clone();
      url.pathname = "/admin/login";
      url.searchParams.set("next", pathname);
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/admin",
    "/admin/dashboard",
    "/admin/dashboard/:path*",
    "/admin/codes",
    "/admin/codes/:path*",
    "/admin/content",
    "/admin/content/:path*",
    "/admin/settings",
    "/admin/settings/:path*",
    "/admin/create-user",
    "/admin/create-user/:path*",
    "/admin/login",
  ],
};
