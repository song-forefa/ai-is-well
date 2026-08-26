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
};
