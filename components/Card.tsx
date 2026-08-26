import Link from "next/link";
import type { Item } from "@/lib/types";
import { glyphFor, itemHref, placeholderStyle, type Variant } from "@/lib/itemView";

// 매거진 그리드의 카드.
//  - 썸네일 있음        → 16:9 이미지
//  - 썸네일 없고 이모지  → 얇은 그라디언트 띠 + 이모지
//  - 둘 다 없음          → 이미지 영역 없이 상단 색 띠만
export default function Card({
  item,
  variant = "magazine",
}: {
  item: Item;
  variant?: Variant;
}) {
  const external = item.kind === "link";
  const glyph = glyphFor(item, variant);
  const hasMedia = Boolean(item.thumbnail_url) || Boolean(glyph);
  const cls = [
    "card",
    item.thumbnail_url ? "" : "no-thumb",
    hasMedia ? "" : "bare",
  ]
    .filter(Boolean)
    .join(" ");

  const chip = (
    <span className={`kind-chip ${item.kind}`}>{external ? "링크" : "글"}</span>
  );

  const inner = (
    <>
      {hasMedia ? (
        <div className="card-media">
          {item.thumbnail_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={item.thumbnail_url} alt="" loading="lazy" />
          ) : (
            <span className="card-media-ph" style={placeholderStyle(item.id)}>
              {glyph}
            </span>
          )}
          {chip}
        </div>
      ) : (
        <span className="card-strip" style={placeholderStyle(item.id)} />
      )}

      <div className="card-text">
        <div className="card-tags">
          {item.category ? <span className="card-cat">{item.category}</span> : null}
          {hasMedia ? null : chip}
        </div>
        <h3 className="card-title">
          {item.emoji ? `${item.emoji} ` : ""}
          {item.title}
        </h3>
        {item.summary ? <p className="card-summary">{item.summary}</p> : null}
      </div>
    </>
  );

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
