"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import type { Item } from "@/lib/types";
import { slugify } from "@/lib/slug";
import ImageField from "@/components/ImageField";

const Editor = dynamic(() => import("@/components/Editor"), {
  ssr: false,
  loading: () => <div className="editor"><div className="editor-area">에디터 불러오는 중…</div></div>,
});

type Props = { item?: Item };

export default function ItemForm({ item }: Props) {
  const router = useRouter();
  const editing = Boolean(item);

  const [kind, setKind] = useState<"link" | "post">(item?.kind ?? "link");
  const [title, setTitle] = useState(item?.title ?? "");
  const [emoji, setEmoji] = useState(item?.emoji ?? "");
  const [summary, setSummary] = useState(item?.summary ?? "");
  const [category, setCategory] = useState(item?.category ?? "");
  const [thumb, setThumb] = useState(item?.thumbnail_url ?? "");
  const [url, setUrl] = useState(item?.url ?? "");
  const [slug, setSlug] = useState(item?.slug ?? "");
  const [html, setHtml] = useState(item?.content_html ?? "");
  const [published, setPublished] = useState(item?.published ?? true);

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
        emoji,
        summary,
        category,
        thumbnail_url: thumb,
        url,
        slug,
        content_html: html,
        published,
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
        <div className="two-col">
          <div className="field">
            <label>이모지 (선택)</label>
            <input
              type="text"
              value={emoji}
              onChange={(e) => setEmoji(e.target.value)}
              placeholder="🗣"
            />
            <div className="hint">제목 앞에 붙습니다. 제목에 직접 넣어도 됩니다.</div>
          </div>
          <div className="field">
            <label>카테고리 (선택)</label>
            <input
              type="text"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              placeholder="면접 / 자소서 / 툴 추천"
            />
          </div>
        </div>
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
          hint="비워 두면 스크린샷처럼 제목만 가운데 정렬된 심플 카드로 보입니다."
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
