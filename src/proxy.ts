import { NextRequest, NextResponse } from "next/server";

/**
 * Next.js proxy that forwards /api/* requests to the Django backend.
 *
 * Why proxy instead of next.config.ts rewrites?
 * - Next.js rewrite `:path*` wildcards strip trailing slashes.
 * - Django requires trailing slashes on API endpoints.
 * - This proxy guarantees the trailing slash is preserved.
 */
export function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  if (pathname === "/api/demo-credentials") {
    return NextResponse.next();
  }

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
