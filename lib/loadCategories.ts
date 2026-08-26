import { adminClient } from "@/utils/supabase/admin";

// 관리자 폼에서 뱃지로 고를 수 있게, 이미 쓰이고 있는 카테고리를 모아 온다.
export async function loadCategories(): Promise<string[]> {
  try {
    const sb = adminClient();
    const { data } = await sb
      .from("items")
      .select("category")
      .not("category", "is", null)
      .order("sort_order", { ascending: true });

    const seen: string[] = [];
    for (const row of (data ?? []) as { category: string | null }[]) {
      const c = row.category?.trim();
      if (c && !seen.includes(c)) seen.push(c);
    }
    return seen;
  } catch {
    return [];
  }
}
