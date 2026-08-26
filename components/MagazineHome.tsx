import type { Item, SiteSettings } from "@/lib/types";
import { categoriesInOrder, type Variant } from "@/lib/itemView";
import Card from "@/components/Card";
import Hero from "@/components/Hero";
import PlainRow from "@/components/PlainRow";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";

const UNCATEGORIZED = "그 외";

// B안(매거진형) / C안(절충형) 공용 레이아웃.
//  magazine: 모든 항목을 카드로.
//  slim:     썸네일이 있는 항목만 카드로 살리고, 없는 항목은 목록 줄로 죽인다.
export default function MagazineHome({
  items,
  settings,
  variant = "magazine",
}: {
  items: Item[];
  settings: SiteSettings;
  variant?: Variant;
}) {
  const [featured, ...rest] = items;
  const categories = categoriesInOrder(rest);
  const sections = [
    ...categories.map((name) => ({
      name,
      items: rest.filter((i) => i.category?.trim() === name),
    })),
    { name: UNCATEGORIZED, items: rest.filter((i) => !i.category?.trim()) },
  ].filter((s) => s.items.length > 0);

  const slim = variant === "slim";

  return (
    <>
      <SiteHeader settings={settings} categories={sections.map((s) => s.name)} />

      <main className="site">
        <Hero item={featured ?? null} settings={settings} variant={variant} />

        {sections.map((section) => {
          const carded = slim ? section.items.filter((i) => i.thumbnail_url) : section.items;
          const plain = slim ? section.items.filter((i) => !i.thumbnail_url) : [];

          return (
            <section
              className="cat-section"
              key={section.name}
              id={`cat-${encodeURIComponent(section.name)}`}
            >
              <div className="cat-head">
                <h2>{section.name}</h2>
                <span className="cat-count">{section.items.length}</span>
              </div>

              {carded.length > 0 ? (
                <div className="grid">
                  {carded.map((item) => (
                    <Card key={item.id} item={item} variant={variant} />
                  ))}
                </div>
              ) : null}

              {plain.length > 0 ? (
                <div className={`plain-list${carded.length > 0 ? " after-grid" : ""}`}>
                  {plain.map((item) => (
                    <PlainRow key={item.id} item={item} />
                  ))}
                </div>
              ) : null}
            </section>
          );
        })}
      </main>

      <SiteFooter settings={settings} />
    </>
  );
}
