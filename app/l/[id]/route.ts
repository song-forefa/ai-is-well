import { NextResponse, type NextRequest } from "next/server";
import { adminClient } from "@/utils/supabase/admin";

// 링크형 항목 클릭 → 조회수 +1 후 외부 주소로 리다이렉트
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const sb = adminClient();
    const { data } = await sb
      .from("items")
      .select("url, click_count, published")
      .eq("id", id)
      .maybeSingle();

    if (!data?.url || !data.published) {
      return NextResponse.redirect(new URL("/", _req.url));
    }

    await sb
      .from("items")
      .update({ click_count: (data.click_count ?? 0) + 1 })
      .eq("id", id);

    return NextResponse.redirect(data.url);
  } catch {
    return NextResponse.redirect(new URL("/", _req.url));
  }
}
