/**
 * Next.js Middleware.
 * Phase 1: Stub only — no routes are protected yet.
 * Phase 2 will add Auth.js session validation and redirect logic.
 *
 * Route protection plan (implemented in Phase 2):
 * - /dashboard/* → requires authenticated session
 * - /profile/edit → requires authenticated session
 * - /settings/* → requires authenticated session
 * - /login → redirect to dashboard if already authenticated
 * - /p/* → public, no auth required
 */
import { NextResponse } from "next/server";

export function middleware() {
  // Phase 2: Auth.js session check will be added here
  return NextResponse.next();
}

export const config = {
  /*
   * Match all routes except:
   * - api routes (handled by Route Handlers)
   * - Next.js internals (_next/static, _next/image)
   * - favicon.ico
   */
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
