import type { Item } from "@/lib/types";

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

// 썸네일이 없을 때 자리에 넣을 이모지. 이모지 필드 > 제목 안의 이모지 > 유형 기본 아이콘.
export function glyphFor(item: Item): string {
  if (item.emoji?.trim()) return item.emoji.trim();
  const inTitle = item.title.match(/\p{Extended_Pictographic}/u);
  if (inTitle) return inTitle[0];
  return item.kind === "post" ? "📝" : "🔗";
}

// 한 항목의 카테고리들. 배열 컬럼이 없으면 예전 단일 컬럼으로 대체한다.
export function catsOf(item: Item): string[] {
  const arr = item.categories?.map((c) => c?.trim()).filter(Boolean) as string[] | undefined;
  if (arr?.length) return arr;
  const one = item.category?.trim();
  return one ? [one] : [];
}

// 카테고리 목록을 정렬 순서(sort_order) 등장 순으로 뽑는다.
export function categoriesInOrder(items: Item[]): string[] {
  const seen: string[] = [];
  for (const it of items) {
    for (const c of catsOf(it)) if (!seen.includes(c)) seen.push(c);
  }
  return seen;
}
