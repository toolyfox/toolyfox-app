import { type NextRequest, NextResponse } from "next/server";
import { createSupabaseMiddlewareClient } from "./server";

const protectedPaths = ["/dashboard", "/websites", "/scan", "/reports", "/team", "/settings", "/billing", "/api"];
const authPaths = ["/sign-in", "/sign-up", "/forgot-password"];

export async function supabaseMiddleware(request: NextRequest) {
  const response = NextResponse.next();
  const supabase = createSupabaseMiddlewareClient(request, response);

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const path = request.nextUrl.pathname;

  const needsAuth = protectedPaths.some((p) => path.startsWith(p));
  const isAuthPage = authPaths.some((p) => path.startsWith(p));

  if (needsAuth && !user) {
    const redirectUrl = new URL("/sign-in", request.url);
    redirectUrl.searchParams.set("redirect", path);
    return NextResponse.redirect(redirectUrl);
  }

  if (isAuthPage && user) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return response;
}
