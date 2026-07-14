import { auth } from "@/lib/auth/authConfig";

/**
 * Next.js Middleware powered by Auth.js v5.
 * Handles route protection and redirect guards reactively on the edge.
 *
 * Rules:
 * 1. Authenticated users attempting to visit /login are redirected to /dashboard.
 * 2. Unauthenticated users attempting to access /dashboard, /profile/edit, or /settings
 *    are redirected to /login (appending the original path as a return parameter).
 */
export default auth((req) => {
  const isAuthenticated = !!req.auth;
  const isAuthPage = req.nextUrl.pathname.startsWith("/login");
  const isProtectedPage =
    req.nextUrl.pathname.startsWith("/dashboard") ||
    req.nextUrl.pathname.startsWith("/profile/edit") ||
    req.nextUrl.pathname.startsWith("/settings");

  if (isAuthPage) {
    if (isAuthenticated) {
      return Response.redirect(new URL("/dashboard", req.nextUrl));
    }
    return undefined;
  }

  if (isProtectedPage) {
    if (!isAuthenticated) {
      let from = req.nextUrl.pathname;
      if (req.nextUrl.search) {
        from += req.nextUrl.search;
      }
      return Response.redirect(new URL(`/login?from=${encodeURIComponent(from)}`, req.nextUrl));
    }
  }

  return undefined;
});

export const config = {
  /*
   * Matchers for edge execution.
   * Explicitly matches only the auth pages and protected dashboard pages.
   */
  matcher: ["/login", "/dashboard/:path*", "/profile/edit", "/settings/:path*"],
};
