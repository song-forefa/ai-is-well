"use client";

import { useRef, useState } from "react";

// 이미지 URL 직접 입력 + 파일 업로드를 함께 지원하는 입력 필드
export default function ImageField({
  value,
  onChange,
  label,
  hint,
}: {
  value: string;
  onChange: (url: string) => void;
  label: string;
  hint?: string;
}) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function upload(file: File) {
    setBusy(true);
    setErr(null);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "업로드 실패");
      onChange(json.url);
    } catch (e) {
      setErr((e as Error).message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="field">
      <label>{label}</label>
      <div className="imgfield">
        <button
          type="button"
          className="btn sm"
          disabled={busy}
          onClick={() => fileRef.current?.click()}
        >
          {busy ? "업로드 중…" : "⬆ 업로드"}
        </button>
        {value ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img className="imgfield-preview" src={value} alt="" />
        ) : null}
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="업로드하거나 이미지 주소를 붙여넣으세요"
        />
        {value ? (
          <button type="button" className="btn sm" onClick={() => onChange("")}>
            지우기
          </button>
        ) : null}
      </div>
      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        hidden
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) void upload(f);
          e.target.value = "";
        }}
      />
      {hint ? <div className="hint">{hint}</div> : null}
      {err ? <div className="err">{err}</div> : null}
    </div>
  );
}
