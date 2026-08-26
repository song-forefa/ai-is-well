import Link from "next/link";
import type { Item } from "@/lib/types";

// 링크형 → /l/{id} (클릭 집계 후 외부로 리다이렉트)
// 글형   → /p/{slug}
export default function Card({ item }: { item: Item }) {
  const href =
    item.kind === "link" ? `/l/${item.id}` : `/p/${item.slug ?? item.id}`;
  const external = item.kind === "link";
  const bare = !item.thumbnail_url && !item.summary && !item.category;

  const inner = (
    <div className="card-row">
      {item.thumbnail_url ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img className="card-thumb" src={item.thumbnail_url} alt="" />
      ) : null}
      <div className="card-body">
        <div className="card-title">
          {item.emoji ? `${item.emoji} ` : ""}
          {item.title}
        </div>
        {item.summary ? <div className="card-summary">{item.summary}</div> : null}
        {item.category ? (
          <div className="card-meta">
            <span className="card-tag">{item.category}</span>
          </div>
        ) : null}
      </div>
      {!bare ? <span className="card-arrow">›</span> : null}
    </div>
  );

  const className = `card${bare ? " centered" : ""}`;

  if (external) {
    return (
      <a className={className} href={href} target="_blank" rel="noopener noreferrer">
        {inner}
      </a>
    );
  }
  return (
    <Link className={className} href={href}>
      {inner}
    </Link>
  );
}
