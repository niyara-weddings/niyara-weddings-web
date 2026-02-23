import { NextRequest, NextResponse } from "next/server";

/**
 * Next.js middleware that proxies /api/* requests to the Django backend.
 *
 * Why middleware instead of next.config.ts rewrites?
 * - Next.js rewrite `:path*` wildcards strip trailing slashes.
 * - Django requires trailing slashes on all endpoints (especially POST).
 * - This middleware guarantees the trailing slash is preserved.
 */
export function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  // Only handle API routes
  if (!pathname.startsWith("/api")) {
    return NextResponse.next();
  }

  const apiUrl = (
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"
  ).replace(/\/$/, "");

  // Ensure trailing slash — Django requires it
  const cleanPath = pathname.endsWith("/") ? pathname : pathname + "/";

  return NextResponse.rewrite(new URL(`${apiUrl}${cleanPath}${search}`));
}
