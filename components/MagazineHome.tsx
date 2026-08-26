import type { Item, SiteSettings } from "@/lib/types";
import { categoriesInOrder, type Variant } from "@/lib/itemView";
import Card from "@/components/Card";
import Hero from "@/components/Hero";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";

const UNCATEGORIZED = "그 외";

// B안(매거진형) / C안(썸네일형) 공용 레이아웃.
//  magazine(B): 이미지 없이 색 블록 카드. 히어로는 상단 2개를 칸반으로.
//  thumbs(C)  : 모든 카드에 썸네일. 히어로는 1개를 크게.
export default function MagazineHome({
  items,
  settings,
  variant = "magazine",
  heroCount,
}: {
  items: Item[];
  settings: SiteSettings;
  variant?: Variant;
  heroCount?: number;
}) {
  const n = heroCount ?? (variant === "magazine" ? 2 : 1);
  const featured = items.slice(0, n);
  const rest = items.slice(n);

  const categories = categoriesInOrder(rest);
  const sections = [
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
        <Hero items={featured} settings={settings} variant={variant} />

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
                <Card key={item.id} item={item} variant={variant} />
              ))}
            </div>
          </section>
        ))}
      </main>

      <SiteFooter settings={settings} />
    </>
  );
}
