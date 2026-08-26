import type { PostgrestError } from "@supabase/supabase-js";

// 마이그레이션 전(컬럼 없음)에도 저장이 깨지지 않게, "그 컬럼이 없다" 는 에러면
// 해당 키를 뺀 payload 로 한 번 더 시도한다.
const OPTIONAL_COLUMNS = ["categories", "bio_version"] as const;

export function missingColumn(error: PostgrestError | null): string | null {
  if (!error || error.code !== "42703") return null;
  const found = OPTIONAL_COLUMNS.find((c) => error.message.includes(c));
  return found ?? null;
}

export function withoutColumn<T extends Record<string, unknown>>(
  payload: T,
  column: string
): T {
  const next = { ...payload };
  delete next[column];
  return next;
}
