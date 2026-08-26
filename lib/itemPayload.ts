import { cleanHtml } from "@/lib/sanitize";
import { slugify } from "@/lib/slug";

const str = (v: unknown) => {
  const s = typeof v === "string" ? v.trim() : "";
  return s.length ? s : null;
};

export type ItemPayload = {
  kind: "link" | "post";
  title: string;
  emoji: string | null;
  summary: string | null;
  thumbnail_url: string | null;
  category: string | null;
  url: string | null;
  slug: string | null;
  content_html: string | null;
  published: boolean;
  bio_version: number | null;
};

// 폼에서 온 값을 DB 컬럼 형태로 정규화한다. 문제가 있으면 문자열 에러를 던진다.
export function buildItemPayload(body: Record<string, unknown>): ItemPayload {
  const kind = body.kind === "post" ? "post" : "link";
  const title = str(body.title);
  if (!title) throw new Error("제목을 입력해 주세요.");

  let url: string | null = null;
  let slug: string | null = null;
  let content_html: string | null = null;

  if (kind === "link") {
    url = str(body.url);
    if (!url) throw new Error("링크형 항목은 이동할 주소(URL)가 필요합니다.");
    if (!/^https?:\/\//i.test(url)) url = `https://${url}`;
  } else {
    slug = slugify(str(body.slug) ?? title);
    content_html = cleanHtml(typeof body.content_html === "string" ? body.content_html : "");
  }

  // 글 하단 소개 버전: 0~2 만 허용, 그 외/빈값이면 null(사이트 기본값)
  const bvRaw = Number(body.bio_version);
  const bio_version =
    kind === "post" && Number.isInteger(bvRaw) && bvRaw >= 0 && bvRaw < 3 ? bvRaw : null;

  return {
    kind,
    title,
    emoji: str(body.emoji),
    summary: str(body.summary),
    thumbnail_url: str(body.thumbnail_url),
    category: str(body.category),
    url,
    slug,
    content_html,
    published: body.published !== false,
    bio_version,
  };
}
