import Link from "next/link";
import type { Item } from "@/lib/types";
import { glyphFor, itemHref, placeholderStyle } from "@/lib/itemView";

// 카드. 썸네일이 있으면 16:9 이미지, 없으면 같은 자리에 그라디언트 + 이모지.
export default function Card({ item }: { item: Item }) {
  const external = item.kind === "link";

  const inner = (
    <>
      <div className="card-media">
        {item.thumbnail_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={item.thumbnail_url} alt="" loading="lazy" />
        ) : (
          <span className="card-media-ph" style={placeholderStyle(item.id)}>
            {glyphFor(item)}
          </span>
        )}
        <span className={`kind-chip ${item.kind}`}>{external ? "링크" : "글"}</span>
      </div>

      <div className="card-text">
        {item.category ? (
          <div className="card-tags">
            <span className="card-cat">{item.category}</span>
          </div>
        ) : null}
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
      <a className="card" href={itemHref(item)} target="_blank" rel="noopener noreferrer">
        {inner}
      </a>
    );
  }
  return (
    <Link className="card" href={itemHref(item)}>
      {inner}
    </Link>
  );
}
