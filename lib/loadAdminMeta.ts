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
    const [itemsRes, settingsRes] = await Promise.all([
      sb.from("items").select("category").not("category", "is", null),
      sb.from("site_settings").select("*").eq("id", 1).maybeSingle(),
    ]);

    const categories: string[] = [];
    for (const row of (itemsRes.data ?? []) as { category: string | null }[]) {
      const c = row.category?.trim();
      if (c && !categories.includes(c)) categories.push(c);
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
