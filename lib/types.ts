export type ItemKind = "link" | "post";

export type Item = {
  id: string;
  kind: ItemKind;
  title: string;
  emoji: string | null;
  summary: string | null;
  thumbnail_url: string | null;
  category: string | null;
  url: string | null;
  slug: string | null;
  content_html: string | null;
  published: boolean;
  sort_order: number;
  click_count: number;
  created_at: string;
  updated_at: string;
};

export type SiteSettings = {
  id: number;
  handle: string;
  tagline: string;
  avatar_url: string | null;
  footer_text: string | null;
  // 글 하단 에디터 소개 (supabase/migration_author_bio.sql 로 컬럼 추가)
  author_bios?: unknown[] | null;   // 최대 3개 버전
  author_bio_active?: number | null; // 지금 쓰는 버전 인덱스 (0~2)
};
