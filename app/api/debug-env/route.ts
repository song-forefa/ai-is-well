import { NextResponse } from "next/server";

// 임시 진단용. 값은 반환하지 않고 길이와 SHA-256 앞 12자(지문)만 반환한다.
// 확인 후 즉시 제거할 것.
export const dynamic = "force-dynamic";

async function fingerprint(v: string): Promise<string> {
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(v));
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("")
    .slice(0, 12);
}

export async function GET() {
  const names = [
    "NEXT_PUBLIC_SUPABASE_URL",
    "NEXT_PUBLIC_SUPABASE_ANON_KEY",
    "SUPABASE_SERVICE_ROLE_KEY",
    "ADMIN_PASSWORD",
  ];
  const out: Record<string, unknown> = {};
  for (const n of names) {
    const raw = process.env[n];
    if (!raw) {
      out[n] = "MISSING";
      continue;
    }
    out[n] = {
      length: raw.length,
      fingerprint: await fingerprint(raw),
      // 앞뒤 공백·개행이 섞였는지
      hasSurroundingWhitespace: raw !== raw.trim(),
      // JWT 형태(점 2개)인지 — 잘림 감지용
      dots: (raw.match(/\./g) || []).length,
    };
  }
  return NextResponse.json(out);
}
