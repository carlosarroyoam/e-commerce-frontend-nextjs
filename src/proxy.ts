import { NextResponse, type NextRequest } from "next/server";

const authRoutes = ["/auth/login", "/auth/forgot-password"];

export function proxy(request: NextRequest) {
  const isAuth = request.cookies.has("refresh_token");

  if (isAuth && authRoutes.includes(request.nextUrl.pathname)) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  if (!isAuth && !authRoutes.includes(request.nextUrl.pathname)) {
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt (metadata files)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
};
