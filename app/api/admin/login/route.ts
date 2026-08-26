import { NextResponse } from "next/server";
import { ADMIN_COOKIE, ADMIN_MAX_AGE, adminToken } from "@/lib/auth";

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const password = String(body?.password ?? "");
  const expected = process.env.ADMIN_PASSWORD || "";

  if (!expected) {
    return NextResponse.json(
      { error: "서버에 ADMIN_PASSWORD 환경변수가 설정되지 않았습니다." },
      { status: 500 }
    );
  }
  if (password !== expected) {
    return NextResponse.json({ error: "비밀번호가 올바르지 않습니다." }, { status: 401 });
  }

  const res = NextResponse.json({ ok: true });
  res.cookies.set(ADMIN_COOKIE, await adminToken(password), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: ADMIN_MAX_AGE,
  });
  return res;
}
