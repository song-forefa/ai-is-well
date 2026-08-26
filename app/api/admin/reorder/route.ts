import { NextResponse } from "next/server";
import { adminClient } from "@/utils/supabase/admin";

// { ids: [...] } 순서대로 sort_order 를 0,1,2... 로 다시 매긴다.
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const ids: string[] = Array.isArray(body?.ids) ? body.ids : [];
    if (!ids.length) throw new Error("순서 정보가 비어 있습니다.");

    const sb = adminClient();
    await Promise.all(
      ids.map((id, i) => sb.from("items").update({ sort_order: i }).eq("id", id))
    );
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 400 });
  }
}
