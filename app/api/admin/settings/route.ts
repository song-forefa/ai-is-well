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
    // 소개 버전은 최대 3개, 문자열 필드만 받아들인다.
    const str = (v: unknown) => (typeof v === "string" ? v : "");
    const bios = Array.isArray(body.author_bios)
      ? body.author_bios.slice(0, 3).map((b: Record<string, unknown>) => ({
          label: str(b?.label).slice(0, 40),
          name: str(b?.name).slice(0, 60),
          text: str(b?.text).slice(0, 2000),
          linkUrl: str(b?.linkUrl).slice(0, 500),
          linkLabel: str(b?.linkLabel).slice(0, 200),
        }))
      : [];
    const activeRaw = Number(body.author_bio_active ?? 0);
    const active = Number.isInteger(activeRaw) && activeRaw >= 0 && activeRaw < 3 ? activeRaw : 0;

    const patch = {
      handle: String(body.handle ?? "").trim() || "@ai.is.well",
      tagline: String(body.tagline ?? "").trim(),
      avatar_url: String(body.avatar_url ?? "").trim() || null,
      footer_text: String(body.footer_text ?? "").trim() || null,
      author_bios: bios,
      author_bio_active: active,
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
