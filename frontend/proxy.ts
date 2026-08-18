// middleware.ts  (or proxy.ts if you renamed it)
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function proxy(request: NextRequest) {
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET, // make sure this exists
  });

  const { pathname } = request.nextUrl;

  // Routes that require login
  const protectedRoutes = ["/checkout"];

  // Routes that should redirect away if already logged in
  const authRoutes = ["/login", "/register"];

  // Not logged in → trying to access protected route
  if (!token && protectedRoutes.some((route) => pathname.startsWith(route))) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("callbackUrl", pathname); // so they return after login
    return NextResponse.redirect(loginUrl);
  }

  // Already logged in → trying to access login/register
  if (token && authRoutes.some((route) => pathname.startsWith(route))) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/checkout/:path*", "/login", "/register"],
};