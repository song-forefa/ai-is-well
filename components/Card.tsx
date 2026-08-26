import Link from "next/link";
import type { Item } from "@/lib/types";
import { glyphFor, itemHref, placeholderStyle, thumbFor, type Variant } from "@/lib/itemView";

// 매거진 그리드의 카드.
//  magazine(B) : 이미지 없이 얇은 그라디언트 띠 + 이모지
//  thumbs(C)   : 항상 16:9 썸네일 (없는 항목은 대체 이미지)
export default function Card({
  item,
  variant = "magazine",
}: {
  item: Item;
  variant?: Variant;
}) {
  const external = item.kind === "link";
  const thumb = thumbFor(item, variant);
  const cls = `card${thumb ? "" : " no-thumb"}`;

  const inner = (
    <>
      <div className="card-media">
        {thumb ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={thumb} alt="" loading="lazy" />
        ) : (
          <span className="card-media-ph" style={placeholderStyle(item.id)}>
            {glyphFor(item)}
          </span>
        )}
        <span className={`kind-chip ${item.kind}`}>{external ? "링크" : "글"}</span>
      </div>

      <div className="card-text">
        <div className="card-tags">
          {item.category ? <span className="card-cat">{item.category}</span> : null}
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
