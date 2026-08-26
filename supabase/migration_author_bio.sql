-- 글 하단 "에디터 소개" 를 관리자에서 수정하고, 버전 3개를 저장해 두기 위한 컬럼.
-- Supabase 대시보드 → SQL Editor 에 붙여넣고 Run 하세요. (여러 번 실행해도 안전)

alter table public.site_settings
  add column if not exists author_bios jsonb not null default '[]'::jsonb;

alter table public.site_settings
  add column if not exists author_bio_active integer not null default 0;

-- author_bios 는 최대 3개짜리 배열이며 각 원소는 아래 형태입니다.
--   { "label": "버전 이름", "name": "애즈웰",
--     "text": "소개 문구", "linkUrl": "https://...", "linkLabel": "링크에 보일 문구" }
-- author_bio_active 는 지금 노출할 버전의 인덱스(0~2)입니다.
