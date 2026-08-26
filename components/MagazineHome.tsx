import type { Item, SiteSettings } from "@/lib/types";
import { catsOf, categoriesInOrder } from "@/lib/itemView";
import Card from "@/components/Card";
import Hero from "@/components/Hero";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";

const UNCATEGORIZED = "그 외";

// 홈 레이아웃 — 히어로 + 카테고리 섹션 + 카드 그리드.
export default function MagazineHome({
  items,
  settings,
  heroCount = 1,
}: {
  items: Item[];
  settings: SiteSettings;
  heroCount?: number;
}) {
  const n = heroCount;
  const featured = items.slice(0, n);
  const rest = items.slice(n);

  const categories = categoriesInOrder(rest);
  const sections = [
    ...categories.map((name) => ({
      name,
      items: rest.filter((i) => catsOf(i)[0] === name),
    })),
    { name: UNCATEGORIZED, items: rest.filter((i) => catsOf(i).length === 0) },
  ].filter((s) => s.items.length > 0);

  return (
    <>
      <SiteHeader settings={settings} categories={sections.map((s) => s.name)} />

      <main className="site">
        <Hero items={featured} settings={settings} />

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
      </main>

      <SiteFooter settings={settings} />
    </>
  );
}
