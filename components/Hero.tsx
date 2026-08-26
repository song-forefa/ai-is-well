import Link from "next/link";
import type { Item, SiteSettings } from "@/lib/types";
import { catsOf, glyphFor, itemHref, placeholderStyle } from "@/lib/itemView";

// 히어로 카드 한 장. compact 는 2개 나란히 놓는 칸반용(작게).
function HeroCard({ item, compact }: { item: Item; compact: boolean }) {
  const external = item.kind === "link";
  const thumb = item.thumbnail_url;
  const cls = [
    "hero-feature",
    thumb ? "" : "no-thumb",
    compact ? "compact" : "",
  ]
    .filter(Boolean)
    .join(" ");

  const inner = (
    <>
      <div className="hero-media">
        {thumb ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={thumb} alt="" />
        ) : (
          <span className="hero-media-ph" style={placeholderStyle(item.id)}>
            {glyphFor(item)}
          </span>
        )}
      </div>

      <div className="hero-feature-text">
        <span className="hero-eyebrow">
          {catsOf(item)[0] ?? (external ? "추천 링크" : "새 글")}
        </span>
        <h2>
          {item.emoji ? `${item.emoji} ` : ""}
          {item.title}
        </h2>
        {item.summary ? <p>{item.summary}</p> : null}
        <span className="hero-cta">
          {external ? "바로가기" : "읽어보기"} <span aria-hidden>→</span>
        </span>
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

// 홈 최상단. 소개 문구 + 상단 항목 1~2개를 크게 노출한다.
export default function Hero({
  items,
  settings,
}: {
  items: Item[];
  settings: SiteSettings;
}) {
  const pair = items.length > 1;

  return (
    <section className="hero">
      <div className="hero-intro">
        <h1>{settings.tagline}</h1>
      </div>

      <div className={pair ? "hero-pair" : ""}>
        {items.map((item) => (
          <HeroCard key={item.id} item={item} compact={pair} />
        ))}
      </div>
    </section>
  );
}
