import type { SiteSettings } from "@/lib/types";

// 모든 글 하단에 자동으로 붙는 에디터 소개.
// site_settings 에 값이 있으면 그걸 쓰고, 없으면 아래 기본값을 쓴다.
// (site_settings 컬럼은 supabase/migration_author_bio.sql 로 추가 — 선택 사항)
export const DEFAULT_BIO = {
  name: "애즈웰",
  handle: "@ai.is.well",
  text: `현대인을 위한 AI 트렌드 소식부터,
취업에 활용할 수 있는 AI 꿀팁과 트렌디한 소식
빠르게 전달드릴게요.

많은 관심과 팔로우 부탁드려요🫰`,
  linkUrl: "https://www.instagram.com/ai.is.well/",
  linkLabel: "애즈웰 | AI로 잘 먹고 잘 살기 (@ai.is.well)",
};

export type Bio = typeof DEFAULT_BIO;

export function bioFrom(settings: SiteSettings): Bio {
  return {
    name: settings.author_name?.trim() || DEFAULT_BIO.name,
    handle: settings.handle?.trim() || DEFAULT_BIO.handle,
    text: settings.author_bio?.trim() || DEFAULT_BIO.text,
    linkUrl: settings.author_link_url?.trim() || DEFAULT_BIO.linkUrl,
    linkLabel: settings.author_link_label?.trim() || DEFAULT_BIO.linkLabel,
  };
}
