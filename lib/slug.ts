// 제목 → URL slug. 한글은 그대로 두고 공백/특수문자만 정리한다.
export function slugify(input: string): string {
  const base = (input || "")
    .trim()
    .toLowerCase()
    .replace(/[\s_]+/g, "-")
    .replace(/[^a-z0-9가-힣ㄱ-ㅎㅏ-ㅣ-]/g, "")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
  return base || `post-${Date.now().toString(36)}`;
}
