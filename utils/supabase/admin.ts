import { createClient } from "@supabase/supabase-js";

const clean = (s?: string) => (s ?? "").replace(/[^\x21-\x7E]/g, "");

// 쓰기 전용 (service_role). 반드시 서버(라우트 핸들러)에서만 import 할 것.
export function adminClient() {
  const url = clean(process.env.NEXT_PUBLIC_SUPABASE_URL);
  const key = clean(process.env.SUPABASE_SERVICE_ROLE_KEY);
  if (!url || !key) {
    throw new Error("Supabase 환경변수(NEXT_PUBLIC_SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY)가 설정되지 않았습니다.");
  }
  return createClient(url, key, { auth: { persistSession: false } });
}
