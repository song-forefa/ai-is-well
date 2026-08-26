import { NextResponse } from "next/server";
import { adminClient } from "@/utils/supabase/admin";

export const dynamic = "force-dynamic";

const MAX_BYTES = 8 * 1024 * 1024; // 8MB

// 이미지 파일 업로드 → Supabase Storage('media' 버킷) → 공개 URL 반환
export async function POST(request: Request) {
  try {
    const form = await request.formData();
    const file = form.get("file");
    if (!(file instanceof File)) throw new Error("파일이 없습니다.");
    if (!file.type.startsWith("image/")) throw new Error("이미지 파일만 업로드할 수 있습니다.");
    if (file.size > MAX_BYTES) throw new Error("이미지 용량은 8MB 이하로 올려 주세요.");

    const ext = (file.name.split(".").pop() || "png").toLowerCase().replace(/[^a-z0-9]/g, "");
    const key = `${new Date().toISOString().slice(0, 7)}/${crypto.randomUUID()}.${ext || "png"}`;

    const sb = adminClient();
    const { error } = await sb.storage
      .from("media")
      .upload(key, await file.arrayBuffer(), { contentType: file.type, upsert: false });
    if (error) throw new Error(`업로드 실패: ${error.message}`);

    const { data } = sb.storage.from("media").getPublicUrl(key);
    return NextResponse.json({ url: data.publicUrl });
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 400 });
  }
}
