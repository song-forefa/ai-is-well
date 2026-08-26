import { publicClient } from "@/utils/supabase/public";
import type { Item, SiteSettings } from "@/lib/types";

export const DEFAULT_SETTINGS: SiteSettings = {
  id: 1,
  handle: "@ai.is.well",
  tagline: "📓 AI로 대기업 취뽀한 현직자의 꿀팁 아카이브!",
  avatar_url: null,
  footer_text: null,
};

export type SiteData = {
  items: Item[];
  settings: SiteSettings;
  envMissing: boolean;
};

// 공개 페이지들이 공유하는 데이터 로딩 (published 만, sort_order 순)
export async function loadSite(): Promise<SiteData> {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return { items: [], settings: DEFAULT_SETTINGS, envMissing: true };
  }
  const sb = publicClient();
  const [itemsRes, settingsRes] = await Promise.all([
    sb
      .from("items")
      .select("*")
      .eq("published", true)
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: false }),
    sb.from("site_settings").select("*").eq("id", 1).maybeSingle(),
  ]);

  return {
    items: (itemsRes.data as Item[] | null) ?? [],
    settings: (settingsRes.data as SiteSettings | null) ?? DEFAULT_SETTINGS,
    envMissing: false,
  };
}
