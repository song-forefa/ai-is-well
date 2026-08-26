import type { SiteSettings } from "@/lib/types";
import { activeBio } from "@/lib/authorBio";

// 모든 글 하단에 자동으로 붙는 에디터 소개 블록.
export default function AuthorBio({
  settings,
  version,
}: {
  settings: SiteSettings;
  version?: number | null;
}) {
  const bio = activeBio(settings, version);

  return (
    <aside className="bio">
      <div className="bio-head">
        {settings.avatar_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img className="bio-avatar" src={settings.avatar_url} alt="" />
        ) : (
          <span className="bio-avatar bio-avatar-fallback">🤖</span>
        )}
        <div className="bio-name">
          {bio.name} <span className="bio-handle">({settings.handle})</span>
        </div>
      </div>

      <p className="bio-text">{bio.text}</p>

      {bio.linkUrl ? (
        <a className="bio-link" href={bio.linkUrl} target="_blank" rel="noopener noreferrer">
          <span className="bio-ig" aria-hidden>📷</span>
          <span>
            Instagram <b>{bio.linkLabel || bio.linkUrl}</b>
          </span>
          <span className="bio-link-arrow" aria-hidden>↗</span>
        </a>
      ) : null}
    </aside>
  );
}
