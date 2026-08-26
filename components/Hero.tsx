import Link from "next/link";
import type { Item, SiteSettings } from "@/lib/types";
import { glyphFor, itemHref, placeholderStyle, type Variant } from "@/lib/itemView";

// 홈 최상단. 소개 문구 + 맨 위 항목을 크게 노출한다.
export default function Hero({
  item,
  settings,
  variant = "magazine",
}: {
  item: Item | null;
  settings: SiteSettings;
  variant?: Variant;
}) {
  const external = item?.kind === "link";
  const glyph = item ? glyphFor(item, variant) : null;
  const hasMedia = Boolean(item?.thumbnail_url) || Boolean(glyph);
  const cls = [
    "hero-feature",
    item?.thumbnail_url ? "" : "no-thumb",
    hasMedia ? "" : "bare",
  ]
    .filter(Boolean)
    .join(" ");

  const feature = item ? (
    <>
      {hasMedia ? (
        <div className="hero-media">
          {item.thumbnail_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={item.thumbnail_url} alt="" />
          ) : (
            <span className="hero-media-ph" style={placeholderStyle(item.id)}>
              {glyph}
            </span>
          )}
        </div>
      ) : (
        <span className="hero-strip" style={placeholderStyle(item.id)} />
      )}

      <div className="hero-feature-text">
        <span className="hero-eyebrow">
          {item.category ?? (external ? "추천 링크" : "새 글")}
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
  ) : null;

  return (
    <section className="hero">
      <div className="hero-intro">
        <h1>{settings.tagline}</h1>
        <p>
          AI 툴, 프롬프트, 취업 준비까지 — 직접 써보고 도움이 된 것만 모아 둡니다.
        </p>
      </div>

      {item ? (
        external ? (
          <a className={cls} href={itemHref(item)} target="_blank" rel="noopener noreferrer">
            {feature}
          </a>
        ) : (
          <Link className={cls} href={itemHref(item)}>
            {feature}
          </Link>
        )
      ) : null}
    </section>
  );
}
