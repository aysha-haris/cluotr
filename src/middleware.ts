import { type NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const authed = request.cookies.get("admin_authed")?.value === "1";

  // Allow the admin page itself and the login API through always
  if (pathname === "/admin" || pathname.startsWith("/api/admin")) {
    return NextResponse.next();
  }

  // Protect any future /admin/* sub-routes
  if (pathname.startsWith("/admin/") && !authed) {
    return NextResponse.redirect(new URL("/admin", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path+", "/api/admin/:path*"],
};
