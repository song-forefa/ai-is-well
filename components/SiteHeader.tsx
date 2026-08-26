import Link from "next/link";
import type { SiteSettings } from "@/lib/types";

// 상단 고정 내비게이션. 카테고리는 홈의 각 섹션으로 앵커 이동한다.
export default function SiteHeader({
  settings,
  categories = [],
}: {
  settings: SiteSettings;
  categories?: string[];
}) {
  return (
    <header className="nav">
      <div className="nav-inner">
        <Link className="nav-brand" href="/">
          {settings.avatar_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img className="nav-avatar" src={settings.avatar_url} alt="" />
          ) : (
            <span className="nav-avatar nav-avatar-fallback">🤖</span>
          )}
          <span className="nav-handle">{settings.handle}</span>
        </Link>

        {categories.length > 0 ? (
          <nav className="nav-links" aria-label="카테고리">
            {categories.map((c) => (
              <a key={c} href={`#cat-${encodeURIComponent(c)}`}>
                {c}
              </a>
            ))}
          </nav>
        ) : null}
      </div>
    </header>
  );
}
