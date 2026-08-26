import { createClient } from "@supabase/supabase-js";

// 환경변수에 섞여 들어갈 수 있는 비-ASCII/공백/제어문자 제거.
const clean = (s?: string) => (s ?? "").replace(/[^\x21-\x7E]/g, "");

// 공개 읽기용 (anon key + RLS). 서버 컴포넌트에서 사용.
export function publicClient() {
  return createClient(
    clean(process.env.NEXT_PUBLIC_SUPABASE_URL),
    clean(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY),
    { auth: { persistSession: false } }
  );
}
