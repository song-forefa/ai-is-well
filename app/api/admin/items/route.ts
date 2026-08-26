import { NextResponse } from "next/server";
import { adminClient } from "@/utils/supabase/admin";
import { buildItemPayload } from "@/lib/itemPayload";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const sb = adminClient();
    const { data, error } = await sb
      .from("items")
      .select("*")
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: false });
    if (error) throw new Error(error.message);
    return NextResponse.json({ items: data ?? [] });
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const payload = buildItemPayload(body);
    const sb = adminClient();

    // 새 항목은 맨 위로
    const { data: top } = await sb
      .from("items")
      .select("sort_order")
      .order("sort_order", { ascending: true })
      .limit(1)
      .maybeSingle();
    const sort_order = (top?.sort_order ?? 0) - 1;

    const { data, error } = await sb
      .from("items")
      .insert({ ...payload, sort_order })
      .select()
      .single();
    if (error) {
      if (error.code === "23505") throw new Error("같은 주소(slug)의 글이 이미 있습니다. 주소를 바꿔 주세요.");
      throw new Error(error.message);
    }
    return NextResponse.json({ item: data });
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 400 });
  }
}
