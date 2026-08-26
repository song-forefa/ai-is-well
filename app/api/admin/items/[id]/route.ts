import { NextResponse } from "next/server";
import { adminClient } from "@/utils/supabase/admin";
import { buildItemPayload } from "@/lib/itemPayload";

export const dynamic = "force-dynamic";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const sb = adminClient();
    const { data, error } = await sb.from("items").select("*").eq("id", id).maybeSingle();
    if (error) throw new Error(error.message);
    if (!data) return NextResponse.json({ error: "not found" }, { status: 404 });
    return NextResponse.json({ item: data });
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const sb = adminClient();

    // published 만 토글하는 부분 업데이트 지원
    if (Object.keys(body).length === 1 && typeof body.published === "boolean") {
      const { error } = await sb.from("items").update({ published: body.published }).eq("id", id);
      if (error) throw new Error(error.message);
      return NextResponse.json({ ok: true });
    }

    const payload = buildItemPayload(body);
    const { data, error } = await sb
      .from("items")
      .update(payload)
      .eq("id", id)
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

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const sb = adminClient();
    const { error } = await sb.from("items").delete().eq("id", id);
    if (error) throw new Error(error.message);
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }
}
