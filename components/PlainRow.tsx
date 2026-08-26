import Link from "next/link";
import type { Item } from "@/lib/types";
import { itemHref } from "@/lib/itemView";

// C안 전용 — 썸네일이 없는 항목. 카드 장식 없이 목록 한 줄로만 보여준다.
export default function PlainRow({ item }: { item: Item }) {
  const external = item.kind === "link";

  const inner = (
    <>
      <span className="prow-main">
        <span className="prow-title">
          {item.emoji ? `${item.emoji} ` : ""}
          {item.title}
        </span>
        {item.summary ? <span className="prow-summary">{item.summary}</span> : null}
      </span>
      <span className="prow-right">
        {item.category ? <span className="prow-cat">{item.category}</span> : null}
        <span className="prow-arrow" aria-hidden>
          {external ? "↗" : "→"}
        </span>
      </span>
    </>
  );

  if (external) {
    return (
      <a className="prow" href={itemHref(item)} target="_blank" rel="noopener noreferrer">
        {inner}
      </a>
    );
  }
  return (
    <Link className="prow" href={itemHref(item)}>
      {inner}
    </Link>
  );
}
