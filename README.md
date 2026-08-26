# ai-is-well

`@ai.is.well` AI 꿀팁 아카이브 — 링크트리형 공개 페이지 + 관리자 페이지.

- **공개 페이지** `/` — 등록한 항목이 카드 리스트로 보입니다.
  - **링크형** 카드: 누르면 외부 주소로 이동 (클릭 수 자동 집계)
  - **글형** 카드: 누르면 사이트 안 상세 페이지 `/p/{slug}` 로 이동
- **관리자 페이지** `/admin` — 비밀번호 1개로 보호. 항목 추가/수정/삭제/순서 변경/공개 토글, 프로필 편집.
- **에디터** — 굵게 · 기울임 · 밑줄 · 취소선 · 제목 · 목록 · 인용 · 코드 · 구분선 · **하이퍼링크** · **이미지 업로드**

## 기술 스택

Next.js 15 (App Router) · React 19 · TypeScript · Supabase (Postgres + Storage) · Tiptap

---

## 1. Supabase 세팅

1. [supabase.com](https://supabase.com) 에서 새 프로젝트 생성 (이름: `ai-is-well`)
2. 좌측 **SQL Editor** → `supabase/schema.sql` 내용을 통째로 붙여넣고 **Run**
   - `items` / `site_settings` 테이블, RLS 정책, `media` 스토리지 버킷이 한 번에 생성됩니다.
3. **Project Settings → API** 에서 아래 3개 값을 복사
   - Project URL
   - `anon` `public` 키
   - `service_role` `secret` 키 ← **절대 외부에 공개하지 마세요**

## 2. 로컬 실행

```bash
cp .env.example .env.local   # 값을 채워 넣기
npm install
npm run dev
```

- 공개 페이지: http://localhost:3000
- 관리자: http://localhost:3000/admin (`.env.local` 의 `ADMIN_PASSWORD` 로 로그인)

## 3. 환경변수

| 이름 | 설명 | 노출 |
| --- | --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase 프로젝트 URL | 공개 |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | anon 키 (공개 읽기 전용, RLS 적용) | 공개 |
| `SUPABASE_SERVICE_ROLE_KEY` | service_role 키 (서버 전용 쓰기) | **비공개** |
| `ADMIN_PASSWORD` | `/admin` 로그인 비밀번호 | **비공개** |

## 4. Vercel 배포

1. Vercel 에서 이 GitHub 저장소를 Import (Framework: Next.js, 나머지 기본값)
2. **Settings → Environment Variables** 에 위 4개 변수를 Production / Preview / Development 모두에 추가
3. Deploy

이후 `main` 에 푸시하면 자동 배포됩니다.

## 데이터 구조 메모

`items` 한 테이블에 링크형·글형을 함께 담습니다.

- `kind = 'link'` → `url` 사용, `/l/{id}` 를 거쳐 리다이렉트하며 `click_count` 증가
- `kind = 'post'` → `slug` + `content_html` 사용, `/p/{slug}` 에서 렌더
- `sort_order` 오름차순으로 정렬 (관리자에서 ↑↓ 로 변경)
- 본문 HTML 은 저장 시 `sanitize-html` 허용 목록으로 한 번 정리됩니다.
