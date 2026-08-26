import type { Item, SiteSettings } from "@/lib/types";
import { categoriesInOrder, type Variant } from "@/lib/itemView";
import Card from "@/components/Card";
import Hero from "@/components/Hero";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";

const UNCATEGORIZED = "그 외";

// B안(매거진형) / C안(절충형) 공용 레이아웃. 차이는 variant 뿐.
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

  return (
    <>
      <SiteHeader settings={settings} categories={sections.map((s) => s.name)} />

      <main className="site">
        <Hero item={featured ?? null} settings={settings} variant={variant} />

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
