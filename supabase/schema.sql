-- ai-is-well 스키마
-- Supabase 대시보드 → SQL Editor 에 통째로 붙여넣고 Run 하세요. (여러 번 실행해도 안전)

-- ============================================================
-- 1) 항목 테이블 (링크형 / 글형 통합)
-- ============================================================
create table if not exists public.items (
  id            uuid primary key default gen_random_uuid(),
  kind          text not null default 'link' check (kind in ('link', 'post')),
  title         text not null,
  emoji         text,                 -- 카드 앞에 붙는 이모지 (선택)
  summary       text,                 -- 카드에 보이는 한 줄 설명 (선택)
  thumbnail_url text,                 -- 카드 썸네일 (선택)
  category      text,                 -- 카테고리/태그 (선택)
  url           text,                 -- kind='link' 일 때 이동할 외부 주소
  slug          text unique,          -- kind='post' 일 때 /p/{slug}
  content_html  text,                 -- kind='post' 본문 (에디터 HTML)
  published     boolean not null default true,
  sort_order    integer not null default 0,
  click_count   integer not null default 0,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

create index if not exists items_sort_idx on public.items (published, sort_order, created_at desc);
create index if not exists items_slug_idx on public.items (slug);

-- ============================================================
-- 2) 사이트 설정 (프로필 영역: 핸들 / 소개 / 아바타)
-- ============================================================
create table if not exists public.site_settings (
  id          integer primary key default 1 check (id = 1),
  handle      text not null default '@ai.is.well',
  tagline     text not null default '📓 AI로 대기업 취뽀한 현직자의 꿀팁 아카이브!',
  avatar_url  text,
  footer_text text,
  updated_at  timestamptz not null default now()
);

insert into public.site_settings (id) values (1) on conflict (id) do nothing;

-- ============================================================
-- 3) updated_at 자동 갱신
-- ============================================================
create or replace function public.touch_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists items_touch on public.items;
create trigger items_touch before update on public.items
  for each row execute function public.touch_updated_at();

drop trigger if exists site_settings_touch on public.site_settings;
create trigger site_settings_touch before update on public.site_settings
  for each row execute function public.touch_updated_at();

-- ============================================================
-- 4) RLS — 공개 읽기만 허용. 쓰기는 서버(service_role)에서만.
-- ============================================================
alter table public.items enable row level security;
alter table public.site_settings enable row level security;

drop policy if exists "items public read" on public.items;
create policy "items public read" on public.items
  for select using (published = true);

drop policy if exists "settings public read" on public.site_settings;
create policy "settings public read" on public.site_settings
  for select using (true);

-- ============================================================
-- 5) 이미지 업로드용 스토리지 버킷 (public)
-- ============================================================
insert into storage.buckets (id, name, public)
values ('media', 'media', true)
on conflict (id) do update set public = true;

drop policy if exists "media public read" on storage.objects;
create policy "media public read" on storage.objects
  for select using (bucket_id = 'media');
