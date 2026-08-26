-- ai-is-well 최신 마이그레이션 (2026-08-27)
-- Supabase 대시보드 → SQL Editor 에 통째로 붙여넣고 Run 하세요.
-- 전부 "없으면 추가" 방식이라 여러 번 실행해도 안전하고, 기존 글 내용은 지워지지 않습니다.

-- ============================================================
-- 1) 글마다 하단 "에디터 소개" 버전 지정
--    null → 사이트 기본 버전 / 0·1·2 → 해당 버전 고정
-- ============================================================
alter table public.items
  add column if not exists bio_version integer;

-- ============================================================
-- 2) 카테고리 여러 개 선택
--    기존 category(단일 텍스트)는 그대로 두고, categories(배열)를 새로 쓴다.
--    아래 update 는 기존 값을 배열로 옮겨 담기만 하며 삭제하지 않는다.
-- ============================================================
alter table public.items
  add column if not exists categories text[] not null default '{}';

update public.items
   set categories = array[category]
 where category is not null
   and btrim(category) <> ''
   and cardinality(categories) = 0;

create index if not exists items_categories_idx on public.items using gin (categories);
