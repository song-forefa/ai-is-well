import { publicClient } from "@/utils/supabase/public";
import type { Item, SiteSettings } from "@/lib/types";
import { categoriesInOrder } from "@/lib/itemView";
import Card from "@/components/Card";
import Hero from "@/components/Hero";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";

export const dynamic = "force-dynamic";

const DEFAULTS: SiteSettings = {
  id: 1,
  handle: "@ai.is.well",
  tagline: "📓 AI로 대기업 취뽀한 현직자의 꿀팁 아카이브!",
  avatar_url: null,
  footer_text: null,
};

const UNCATEGORIZED = "그 외";

async function load(): Promise<{ items: Item[]; settings: SiteSettings; envMissing: boolean }> {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return { items: [], settings: DEFAULTS, envMissing: true };
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
    settings: (settingsRes.data as SiteSettings | null) ?? DEFAULTS,
    envMissing: false,
  };
}

export default async function HomePage() {
  const { items, settings, envMissing } = await load();

  // 맨 위 항목은 히어로로, 나머지는 카테고리 섹션으로.
  const [featured, ...rest] = items;
  const categories = categoriesInOrder(rest);
  const sections: { name: string; items: Item[] }[] = [
    ...categories.map((name) => ({
      name,
      items: rest.filter((i) => i.category?.trim() === name),
    })),
    { name: UNCATEGORIZED, items: rest.filter((i) => !i.category?.trim()) },
  ].filter((s) => s.items.length > 0);

  return (
    <>
      <SiteHeader settings={settings} categories={sections.map((s) => s.name)} />

      <main className="site">
        {items.length === 0 ? (
          <div className="empty">
            {envMissing ? (
              <>
                Supabase 환경변수가 아직 설정되지 않았어요.
                <br />
                <code>.env.local</code> 에 값을 채운 뒤 새로고침해 주세요.
              </>
            ) : (
              <>
                아직 등록된 항목이 없어요.
                <br />
                <a href="/admin">관리자 페이지</a>에서 첫 항목을 추가해 보세요.
              </>
            )}
          </div>
        ) : (
          <>
            <Hero item={featured ?? null} settings={settings} />

            {sections.map((section) => (
              <section
                className="cat-section"
                key={section.name}
                id={`cat-${encodeURIComponent(section.name)}`}
              >
                <div className="cat-head">
                  <h2>{section.name}</h2>
                  <span className="cat-count">{section.items.length}</span>
                </div>
                <div className="grid">
                  {section.items.map((item) => (
                    <Card key={item.id} item={item} />
                  ))}
                </div>
              </section>
            ))}
          </>
        )}
      </main>

      <SiteFooter settings={settings} />
    </>
  );
}
