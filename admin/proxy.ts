import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  // Admin login
  if (pathname === "/admin/login") {
    if (token?.role === "admin") {
      return NextResponse.redirect(
        new URL("/admin/dashboard", request.url)
      );
    }

    return NextResponse.next();
  }

  // Protected admin pages
  if (pathname.startsWith("/admin")) {
    if (!token || token.role !== "admin") {
      return NextResponse.redirect(
        new URL("/admin/login", request.url)
      );
    }

    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};