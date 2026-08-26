import { NextResponse } from "next/server";

// 임시 진단용. 값은 반환하지 않고 "이름이 존재하는지"와 길이만 확인한다.
// 확인 후 즉시 삭제할 것.
export const dynamic = "force-dynamic";

export async function GET() {
  const expected = [
    "NEXT_PUBLIC_SUPABASE_URL",
    "NEXT_PUBLIC_SUPABASE_ANON_KEY",
    "SUPABASE_SERVICE_ROLE_KEY",
    "ADMIN_PASSWORD",
  ];
  return NextResponse.json({
    expected: Object.fromEntries(
      expected.map((k) => [k, process.env[k] ? `set (${process.env[k]!.length}자)` : "MISSING"])
    ),
    // 실제로 주입된 키 중 관련 있어 보이는 이름들 (오타 확인용, 값 없음)
    similarKeys: Object.keys(process.env).filter((k) =>
      /SUPA|ADMIN|PASS|ANON|SERVICE/i.test(k)
    ),
    vercelEnv: process.env.VERCEL_ENV ?? "none",
  });
}
