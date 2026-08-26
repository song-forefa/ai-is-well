import { NextResponse, type NextRequest } from "next/server";
import { ADMIN_COOKIE, expectedToken } from "@/lib/auth";

// /admin 과 /api/admin 만 비밀번호로 보호한다. 나머지는 전부 공개.
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isLoginPath =
    pathname === "/admin/login" || pathname === "/api/admin/login";
  if (isLoginPath) return NextResponse.next();

  const expected = await expectedToken();
  const cookie = request.cookies.get(ADMIN_COOKIE)?.value;
  if (expected && cookie === expected) return NextResponse.next();

  if (pathname.startsWith("/api/")) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const url = request.nextUrl.clone();
  url.pathname = "/admin/login";
  url.search = pathname === "/admin" ? "" : `?next=${encodeURIComponent(pathname)}`;
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
