-- 글마다 하단에 띄울 "에디터 소개" 버전을 고를 수 있게 하는 컬럼.
-- Supabase 대시보드 → SQL Editor 에 붙여넣고 Run 하세요. (여러 번 실행해도 안전)
--
-- 값의 의미
--   null  → 사이트 기본 버전 사용 (관리자 → 프로필 → 글 하단 에디터 소개에서 지정한 것)
--   0/1/2 → 해당 버전을 이 글에서만 사용

alter table public.items
  add column if not exists bio_version integer;
