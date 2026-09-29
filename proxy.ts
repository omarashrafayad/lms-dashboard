import { NextRequest, NextResponse } from "next/server";

export function proxy(request: NextRequest) {
  const token = request.cookies.get("token")?.value;
  const hasToken = !!token && token !== "undefined" && token !== "null";
  const { pathname } = request.nextUrl;

  const isLoginPage = pathname === "/login" || pathname.startsWith("/login");

  // If user is accessing the login page
  if (isLoginPage) {
    if (hasToken) {
      return NextResponse.redirect(new URL("/", request.url));
    }
    return NextResponse.next();
  }

  // If user is accessing any protected page without a token
  if (!hasToken) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, images, etc.
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};