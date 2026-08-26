"use client";

import { useMemo, useState } from "react";

// 기존 카테고리는 뱃지로 골라 쓰고, 없으면 직접 추가한다.
export default function CategoryField({
  value,
  onChange,
  options,
}: {
  value: string;
  onChange: (v: string) => void;
  options: string[];
}) {
  const [adding, setAdding] = useState(false);
  const [draft, setDraft] = useState("");

  // 이 글에만 있는 새 카테고리도 목록에 함께 보여 준다.
  const all = useMemo(() => {
    const set = options.filter(Boolean);
    const v = value.trim();
    return v && !set.includes(v) ? [...set, v] : set;
  }, [options, value]);

  function commitDraft() {
    const v = draft.trim();
    if (v) onChange(v);
    setDraft("");
    setAdding(false);
  }

  return (
    <div className="field">
      <label>카테고리 (선택)</label>

      <div className="cat-picker">
        {all.map((c) => (
          <button
            key={c}
            type="button"
            className={`cat-chip${c === value.trim() ? " on" : ""}`}
            onClick={() => onChange(c === value.trim() ? "" : c)}
          >
            {c}
          </button>
        ))}

        {adding ? (
          <span className="cat-add">
            <input
              type="text"
              value={draft}
              autoFocus
              placeholder="새 카테고리"
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  commitDraft();
                } else if (e.key === "Escape") {
                  setDraft("");
                  setAdding(false);
                }
              }}
              onBlur={commitDraft}
            />
          </span>
        ) : (
          <button type="button" className="cat-chip add" onClick={() => setAdding(true)}>
            + 추가
          </button>
        )}
      </div>

      <div className="hint">
        같은 카테고리끼리 홈에서 한 섹션으로 묶이고, 상단 메뉴에도 표시됩니다.
        {value.trim() ? null : " 비워 두면 '그 외' 섹션으로 들어갑니다."}
      </div>
    </div>
  );
}
