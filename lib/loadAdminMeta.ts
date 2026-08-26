import { adminClient } from "@/utils/supabase/admin";
import { activeIndex, bioVersions, type BioVersion } from "@/lib/authorBio";
import { DEFAULT_SETTINGS } from "@/lib/loadSite";
import type { SiteSettings } from "@/lib/types";

export type AdminMeta = {
  categories: string[];
  bios: BioVersion[];
  bioDefault: number;
};

// 항목 편집 폼에 필요한 보조 데이터 (카테고리 목록, 소개 버전 목록).
export async function loadAdminMeta(): Promise<AdminMeta> {
  try {
    const sb = adminClient();
    // categories 컬럼이 아직 없을 수 있으므로(마이그레이션 전) 실패하면 category 만 읽는다.
    let itemsRes = await sb.from("items").select("category, categories");
    if (itemsRes.error) itemsRes = await sb.from("items").select("category");
    const settingsRes = await sb.from("site_settings").select("*").eq("id", 1).maybeSingle();

    const categories: string[] = [];
    type Row = { category: string | null; categories?: string[] | null };
    for (const row of (itemsRes.data ?? []) as Row[]) {
      const list = row.categories?.length ? row.categories : row.category ? [row.category] : [];
      for (const raw of list) {
        const c = raw?.trim();
        if (c && !categories.includes(c)) categories.push(c);
      }
    }
    categories.sort((a, b) => a.localeCompare(b, "ko"));

    const settings = (settingsRes.data as SiteSettings | null) ?? DEFAULT_SETTINGS;
    return {
      categories,
      bios: bioVersions(settings),
      bioDefault: activeIndex(settings),
    };
  } catch {
    return { categories: [], bios: bioVersions(DEFAULT_SETTINGS), bioDefault: 0 };
  }
}
