import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

// Marketing pages — always public (no auth required)
const PUBLIC_ROUTES = new Set(["/", "/pricing", "/features", "/about"]);

// Auth pages — redirect to /dashboard if already logged in
const AUTH_ROUTES = ["/login", "/register", "/forgot-password", "/reset-password"];

const SUPPORTED_LOCALES = ["en", "pt", "fr"];
const DEFAULT_LOCALE = "en";

function getLocaleFromHeader(acceptLang: string | null): string {
  if (!acceptLang) return DEFAULT_LOCALE;
  const tags = acceptLang.split(",").map((s) => s.split(";")[0].trim().toLowerCase());
  for (const tag of tags) {
    if (tag.startsWith("pt")) return "pt";
    if (tag.startsWith("fr")) return "fr";
    if (tag.startsWith("en")) return "en";
  }
  return DEFAULT_LOCALE;
}

// Rate limiting state (In-memory for demo; use Redis/Upstash in production)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const limit = 100; // 100 requests
  const window = 60 * 1000; // per minute

  const record = rateLimitMap.get(ip);
  if (!record || now > record.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + window });
    return false;
  }

  record.count++;
  return record.count > limit;
}

export default auth((req) => {
  const { pathname } = req.nextUrl;
  const isLoggedIn = !!req.auth;
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0] || "127.0.0.1";

  // 0. Rate Limiting
  if (isRateLimited(ip)) {
    return new NextResponse("Too Many Requests", { status: 429 });
  }

  // 1. Locale Detection & Persistence
  let locale = req.cookies.get("NEXT_LOCALE")?.value;
  let response = NextResponse.next();

  // Add Security Headers
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set("Permissions-Policy", "camera=(), microphone=(), geolocation=()");
  response.headers.set("Content-Security-Policy", "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob:; connect-src 'self' *.truelayer.com *.saltedge.com;");

  if (!locale) {
    locale = getLocaleFromHeader(req.headers.get("accept-language"));
    response.cookies.set("NEXT_LOCALE", locale, {
      path: "/",
      maxAge: 60 * 60 * 24 * 365, // 1 year
      sameSite: "lax",
    });
  }

  // 2. Routing Logic
  if (!isLoggedIn && !PUBLIC_ROUTES.has(pathname) && !AUTH_ROUTES.some(r => pathname.startsWith(r))) {
    return NextResponse.redirect(new URL("/login", req.nextUrl));
  }

  // Auth pages: send logged-in users straight to the app
  if (AUTH_ROUTES.some((r) => pathname.startsWith(r))) {
    if (isLoggedIn) {
      return NextResponse.redirect(new URL("/dashboard", req.nextUrl));
    }
    return response;
  }

  // Plan-based route protection
  if (isLoggedIn) {
    const userPlan = (req.auth as any)?.user?.plan;
    
    // Restricted routes for FREE plan
    const restrictedForFree = ["/analytics", "/tax", "/reports"];
    if (userPlan === "FREE" && restrictedForFree.some(r => pathname.startsWith(r))) {
      return NextResponse.redirect(new URL("/dashboard", req.nextUrl));
    }

    if (pathname === "/") {
      return NextResponse.redirect(new URL("/dashboard", req.nextUrl));
    }
  }

  if (PUBLIC_ROUTES.has(pathname)) {
    return response;
  }

  // Set pathname header for layout usage
  response.headers.set("x-pathname", pathname);
  return response;
});


export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
