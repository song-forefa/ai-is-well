import Link from "next/link";
import type { Item, SiteSettings } from "@/lib/types";
import { itemHref } from "@/lib/itemView";

// A안 — 링크트리형. 프로필 + 카드 한 줄 나열. 클래스는 lt- 로 분리한다.
function LtCard({ item }: { item: Item }) {
  const external = item.kind === "link";
  const bare = !item.summary && !item.category;

  const inner = (
    <div className="lt-row">
      {item.thumbnail_url ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img className="lt-thumb" src={item.thumbnail_url} alt="" loading="lazy" />
      ) : null}
      <div className="lt-body">
        <div className="lt-title">
          {item.emoji ? `${item.emoji} ` : ""}
          {item.title}
        </div>
        {item.summary ? <div className="lt-summary">{item.summary}</div> : null}
        {item.category ? <span className="lt-tag">{item.category}</span> : null}
      </div>
      {!bare ? <span className="lt-arrow">›</span> : null}
    </div>
  );

  const cls = `lt-card${bare ? " centered" : ""}`;
  if (external) {
    return (
      <a className={cls} href={itemHref(item)} target="_blank" rel="noopener noreferrer">
        {inner}
      </a>
    );
  }
  return (
    <Link className={cls} href={itemHref(item)}>
      {inner}
    </Link>
  );
}

export default function LinkTreeHome({
  items,
  settings,
}: {
  items: Item[];
  settings: SiteSettings;
}) {
  return (
    <main className="lt">
      <header className="lt-profile">
        {settings.avatar_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img className="lt-avatar" src={settings.avatar_url} alt={settings.handle} />
        ) : (
          <div className="lt-avatar lt-avatar-fallback">🤖</div>
        )}
        <h1>{settings.handle}</h1>
        <p>{settings.tagline}</p>
      </header>

      <div className="lt-cards">
        {items.map((item) => (
          <LtCard key={item.id} item={item} />
        ))}
      </div>

      {settings.footer_text ? <div className="lt-footer">{settings.footer_text}</div> : null}
    </main>
  );
}
