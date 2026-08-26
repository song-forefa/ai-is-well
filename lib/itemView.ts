import type { Item } from "@/lib/types";

// 디자인 비교용 변형
//  magazine : 썸네일을 쓰지 않고 이모지 + 색 블록으로만 (A/B안)
//  thumbs   : 모든 카드에 썸네일 (없으면 대체 이미지) (C안)
export type Variant = "magazine" | "thumbs";

// C안에서 썸네일이 없는 항목에 채워 넣을 대체 이미지
export const FALLBACK_THUMB =
  "https://tlzdriqtxcfyokqaonba.supabase.co/storage/v1/object/public/media/2026-08/d8196627-1b58-40ed-95a2-3e40b19179cf.png";

// 링크형 → /l/{id} (클릭 집계 후 외부로 리다이렉트), 글형 → /p/{slug}
export function itemHref(item: Item): string {
  return item.kind === "link" ? `/l/${item.id}` : `/p/${item.slug ?? item.id}`;
}

// 썸네일이 없는 항목도 비어 보이지 않도록, id 로부터 항상 같은 색이 나오는 그라디언트.
export function placeholderStyle(id: string): React.CSSProperties {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) % 360;
  return {
    background: `linear-gradient(135deg, hsl(${h} 62% 88%), hsl(${(h + 48) % 360} 66% 78%))`,
  };
}

// 이모지 필드 > 제목 안의 이모지 > 유형 기본 아이콘.
export function glyphFor(item: Item): string {
  if (item.emoji?.trim()) return item.emoji.trim();
  const inTitle = item.title.match(/\p{Extended_Pictographic}/u);
  if (inTitle) return inTitle[0];
  return item.kind === "post" ? "📝" : "🔗";
}

// 이 변형에서 실제로 보여줄 이미지 주소. magazine 은 이미지를 쓰지 않는다.
export function thumbFor(item: Item, variant: Variant): string | null {
  if (variant === "magazine") return null;
  return item.thumbnail_url || FALLBACK_THUMB;
}

// 카테고리 목록을 정렬 순서(sort_order) 등장 순으로 뽑는다.
export function categoriesInOrder(items: Item[]): string[] {
  const seen: string[] = [];
  for (const it of items) {
    const c = it.category?.trim();
    if (c && !seen.includes(c)) seen.push(c);
  }
  return seen;
}
