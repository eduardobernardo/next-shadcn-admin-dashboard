import { type NextRequest, NextResponse } from "next/server";

const PUBLIC_PATHS = ["/auth/v2/login"];

function redirectLegacyDashboard(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  if (!pathname.startsWith("/dashboard/")) {
    return null;
  }

  const url = new URL("/dashboard", request.url);
  url.search = search;
  return NextResponse.redirect(url);
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("token")?.value;

  const legacyDashboardRedirect = redirectLegacyDashboard(request);
  if (legacyDashboardRedirect) {
    return legacyDashboardRedirect;
  }

  const isPublic = PUBLIC_PATHS.some((path) => pathname === path || pathname.startsWith(`${path}/`));

  if (!token && !isPublic) {
    const loginUrl = new URL("/auth/v2/login", request.url);
    return NextResponse.redirect(loginUrl);
  }

  if (token && pathname === "/auth/v2/login") {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
};
