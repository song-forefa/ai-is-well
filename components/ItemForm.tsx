"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import type { Item } from "@/lib/types";
import { slugify } from "@/lib/slug";
import ImageField from "@/components/ImageField";
import CategoryField from "@/components/CategoryField";
import type { AdminMeta } from "@/lib/loadAdminMeta";

const Editor = dynamic(() => import("@/components/Editor"), {
  ssr: false,
  loading: () => <div className="editor"><div className="editor-area">에디터 불러오는 중…</div></div>,
});

type Props = { item?: Item; meta: AdminMeta };

export default function ItemForm({ item, meta }: Props) {
  const router = useRouter();
  const editing = Boolean(item);

  const [kind, setKind] = useState<"link" | "post">(item?.kind ?? "link");
  const [title, setTitle] = useState(item?.title ?? "");
  const [summary, setSummary] = useState(item?.summary ?? "");
  const [category, setCategory] = useState(item?.category ?? "");
  const [thumb, setThumb] = useState(item?.thumbnail_url ?? "");
  const [url, setUrl] = useState(item?.url ?? "");
  const [slug, setSlug] = useState(item?.slug ?? "");
  const [html, setHtml] = useState(item?.content_html ?? "");
  const [published, setPublished] = useState(item?.published ?? true);
  // null = 사이트 기본 버전 사용
  const [bioVersion, setBioVersion] = useState<number | null>(item?.bio_version ?? null);

  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const previewSlug = useMemo(() => slugify(slug || title), [slug, title]);

  async function save() {
    setSaving(true);
    setErr(null);
    try {
      const body = {
        kind,
        title,
        summary,
        category,
        thumbnail_url: thumb,
        url,
        slug,
        content_html: html,
        published,
        bio_version: bioVersion,
      };
      const res = await fetch(editing ? `/api/admin/items/${item!.id}` : "/api/admin/items", {
        method: editing ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "저장에 실패했습니다.");
      router.push("/admin");
      router.refresh();
    } catch (e) {
      setErr((e as Error).message);
      setSaving(false);
    }
  }

  async function remove() {
    if (!item) return;
    if (!window.confirm(`"${item.title}" 항목을 삭제할까요? 되돌릴 수 없습니다.`)) return;
    setSaving(true);
    const res = await fetch(`/api/admin/items/${item.id}`, { method: "DELETE" });
    if (res.ok) {
      router.push("/admin");
      router.refresh();
    } else {
      setErr("삭제에 실패했습니다.");
      setSaving(false);
    }
  }

  return (
    <div className="admin">
      <div className="admin-top">
        <h1>{editing ? "항목 수정" : "새 항목 추가"}</h1>
        <div className="actions">
          <button className="btn" onClick={() => router.push("/admin")} disabled={saving}>
            취소
          </button>
          {editing ? (
            <button className="btn danger" onClick={remove} disabled={saving}>
              삭제
            </button>
          ) : null}
          <button className="btn primary" onClick={save} disabled={saving}>
            {saving ? "저장 중…" : "저장"}
          </button>
        </div>
      </div>

      <div className="panel">
        <h2>유형</h2>
        <div style={{ display: "flex", gap: 8, marginBottom: 4 }}>
          <button
            type="button"
            className={`btn${kind === "link" ? " primary" : ""}`}
            onClick={() => setKind("link")}
          >
            🔗 링크형
          </button>
          <button
            type="button"
            className={`btn${kind === "post" ? " primary" : ""}`}
            onClick={() => setKind("post")}
          >
            📝 글형
          </button>
        </div>
        <div className="hint">
          링크형은 카드를 누르면 외부 주소로 바로 이동합니다. 글형은 이 사이트 안의 상세 페이지로
          이동합니다.
        </div>
      </div>

      <div className="panel">
        <h2>카드에 보이는 내용</h2>
        <div className="field">
          <label>제목 *</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="예) 공짜로 👉클로드 AI 공식강의👈 들으러가기"
          />
        </div>
        <CategoryField value={category} onChange={setCategory} options={meta.categories} />
        <div className="field">
          <label>한 줄 설명 (선택)</label>
          <textarea
            value={summary}
            onChange={(e) => setSummary(e.target.value)}
            placeholder="카드 아래에 작게 표시됩니다."
          />
        </div>
        <ImageField
          label="썸네일 (선택)"
          value={thumb}
          onChange={setThumb}
          hint="권장 규격 1200 × 675px (16:9), 1MB 이하. 비워 두면 색 블록 + 이모지가 대신 들어갑니다."
        />
      </div>

      {kind === "link" ? (
        <div className="panel">
          <h2>이동할 주소</h2>
          <div className="field">
            <label>URL *</label>
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://…"
            />
            <div className="hint">클릭 수가 자동으로 집계됩니다.</div>
          </div>
        </div>
      ) : (
        <>
          <div className="panel">
            <h2>글 주소</h2>
            <div className="field">
              <label>슬러그 (선택)</label>
              <input
                type="text"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="비우면 제목에서 자동 생성"
              />
              <div className="hint">
                이 글의 주소: <code>/p/{previewSlug}</code>
              </div>
            </div>
          </div>

          <div className="panel">
            <h2>글 하단 에디터 소개</h2>
            <div className="cat-picker">
              <button
                type="button"
                className={`cat-chip${bioVersion === null ? " on" : ""}`}
                onClick={() => setBioVersion(null)}
              >
사이트 기본값
              </button>
              {meta.bios.map((b, i) => (
                <button
                  key={i}
                  type="button"
                  className={`cat-chip${bioVersion === i ? " on" : ""}`}
                  onClick={() => setBioVersion(i)}
                >
                  {b.label || `버전 ${i + 1}`}
                </button>
              ))}
            </div>
            <div className="hint">
              이 글 아래에 붙일 소개를 고릅니다. <b>사이트 기본값</b>(현재{" "}
              {meta.bios[meta.bioDefault]?.label || `버전 ${meta.bioDefault + 1}`})을 두면
              관리자 → 프로필에서 기본을 바꿀 때 이 글도 함께 바뀝니다. 특정 버전을 고르면
              이 글만 그 버전으로 고정됩니다.
            </div>
          </div>

          <div className="panel">
            <h2>본문</h2>
            <Editor value={html} onChange={setHtml} />
            <div className="hint" style={{ marginTop: 8 }}>
              굵게 · 밑줄 · 링크 · 이미지 업로드 · 토글을 지원합니다. 이미지는 드래그 대신
              상단 🖼 버튼으로 올려 주세요.
              <br />
              <b>Enter</b> 는 문단을 새로 시작해 위아래 간격이 생기고,{" "}
              <b>Shift + Enter</b> 는 같은 문단 안에서 줄만 바꿔 간격 없이 붙습니다.
            </div>
          </div>
        </>
      )}

      <div className="panel">
        <h2>공개 여부</h2>
        <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 14, fontWeight: 600 }}>
          <input
            type="checkbox"
            checked={published}
            onChange={(e) => setPublished(e.target.checked)}
            style={{ width: 16, height: 16 }}
          />
          공개 페이지에 노출
        </label>
      </div>

      {err ? <div className="err">{err}</div> : null}

      <div style={{ display: "flex", gap: 8, justifyContent: "flex-end", marginTop: 4 }}>
        <button className="btn primary" onClick={save} disabled={saving}>
          {saving ? "저장 중…" : "저장"}
        </button>
      </div>
    </div>
  );
}
