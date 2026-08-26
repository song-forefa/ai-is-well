import Link from "next/link";
import type { Item } from "@/lib/types";
import { itemHref, placeholderGlyph, placeholderStyle } from "@/lib/itemView";

// 매거진 그리드의 기본 카드. 썸네일이 없으면 그라디언트 + 이모지로 채운다.
export default function Card({ item }: { item: Item }) {
  const external = item.kind === "link";
  // 썸네일이 없으면 이미지 영역을 얇은 띠로 줄여 목록이 길어지지 않게 한다.
  const cls = `card${item.thumbnail_url ? "" : " no-thumb"}`;
  const inner = (
    <>
      <div className="card-media">
        {item.thumbnail_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={item.thumbnail_url} alt="" loading="lazy" />
        ) : (
          <span className="card-media-ph" style={placeholderStyle(item.id)}>
            {placeholderGlyph(item)}
          </span>
        )}
        <span className={`kind-chip ${item.kind}`}>
          {external ? "링크" : "글"}
        </span>
      </div>

      <div className="card-text">
        {item.category ? <span className="card-cat">{item.category}</span> : null}
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
