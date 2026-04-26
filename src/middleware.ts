import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

// Marketing pages — always public (no auth required)
const PUBLIC_ROUTES = new Set(["/", "/pricing", "/features", "/about"]);

// Auth pages — redirect to /dashboard if already logged in
const AUTH_ROUTES = ["/login", "/register", "/forgot-password", "/reset-password"];

export default auth((req) => {
  const { pathname } = req.nextUrl;
  const isLoggedIn = !!req.auth;

  // Auth pages: send logged-in users straight to the app
  if (AUTH_ROUTES.some((r) => pathname.startsWith(r))) {
    if (isLoggedIn) {
      return NextResponse.redirect(new URL("/dashboard", req.nextUrl));
    }
    return NextResponse.next();
  }

  // Public marketing routes — always accessible
  if (PUBLIC_ROUTES.has(pathname)) {
    // Authenticated user visiting root → send to app
    if (isLoggedIn && pathname === "/") {
      return NextResponse.redirect(new URL("/dashboard", req.nextUrl));
    }
    return NextResponse.next();
  }

  // Everything else requires authentication
  if (!isLoggedIn) {
    const from = pathname + (req.nextUrl.search ?? "");
    return NextResponse.redirect(
      new URL(`/login?from=${encodeURIComponent(from)}`, req.nextUrl)
    );
  }

  const response = NextResponse.next();
  response.headers.set("x-pathname", pathname);
  return response;
});

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
