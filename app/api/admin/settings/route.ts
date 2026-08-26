import { NextResponse } from "next/server";
import { adminClient } from "@/utils/supabase/admin";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const sb = adminClient();
    const { data, error } = await sb.from("site_settings").select("*").eq("id", 1).maybeSingle();
    if (error) throw new Error(error.message);
    return NextResponse.json({ settings: data });
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const sb = adminClient();
    const patch = {
      handle: String(body.handle ?? "").trim() || "@ai.is.well",
      tagline: String(body.tagline ?? "").trim(),
      avatar_url: String(body.avatar_url ?? "").trim() || null,
      footer_text: String(body.footer_text ?? "").trim() || null,
    };
    const { error } = await sb
      .from("site_settings")
      .upsert({ id: 1, ...patch }, { onConflict: "id" });
    if (error) throw new Error(error.message);
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 400 });
  }
}
