import { NextResponse } from "next/server";

// 임시 진단용. 값은 반환하지 않고 "키 이름의 코드포인트"만 확인한다.
export const dynamic = "force-dynamic";

export async function GET() {
  const keys = Object.keys(process.env).filter((k) =>
    /SUPA|ADMIN|PASS|ANON|SERVICE/i.test(k)
  );
  return NextResponse.json({
    keys: keys.map((k) => ({
      length: k.length,
      // 정상 문자(A-Z 0-9 _)는 그대로, 그 외는 U+XXXX 로 표시
      codepoints: Array.from(k)
        .map((ch) =>
          /[A-Z0-9_]/.test(ch)
            ? ch
            : `<U+${ch.codePointAt(0)!.toString(16).toUpperCase().padStart(4, "0")}>`
        )
        .join(""),
      valueLength: (process.env[k] ?? "").length,
    })),
  });
}
