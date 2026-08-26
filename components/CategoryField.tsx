"use client";

import { useMemo, useState } from "react";

// 기존 카테고리는 뱃지로 골라 쓰고, 없으면 직접 추가한다. 여러 개 선택 가능.
export default function CategoryField({
  value,
  onChange,
  options,
  max = 5,
}: {
  value: string[];
  onChange: (v: string[]) => void;
  options: string[];
  max?: number;
}) {
  const [adding, setAdding] = useState(false);
  const [draft, setDraft] = useState("");

  // 이 글에만 있는 새 카테고리도 목록에 함께 보여 준다.
  const all = useMemo(() => {
    const set = options.filter(Boolean);
    for (const v of value) if (v && !set.includes(v)) set.push(v);
    return set;
  }, [options, value]);

  const atMax = value.length >= max;

  function toggle(c: string) {
    if (value.includes(c)) onChange(value.filter((v) => v !== c));
    else if (!atMax) onChange([...value, c]);
  }

  function commitDraft() {
    const v = draft.trim();
    if (v && !value.includes(v) && !atMax) onChange([...value, v]);
    setDraft("");
    setAdding(false);
  }

  return (
    <div className="field">
      <label>
        카테고리 (선택) <span className="label-sub">여러 개 고를 수 있어요</span>
      </label>

      <div className="cat-picker">
        {all.map((c) => {
          const on = value.includes(c);
          return (
            <button
              key={c}
              type="button"
              className={`cat-chip${on ? " on" : ""}`}
              onClick={() => toggle(c)}
              disabled={!on && atMax}
              title={!on && atMax ? `최대 ${max}개까지 선택할 수 있어요` : undefined}
            >
              {on ? "✓ " : ""}
              {c}
            </button>
          );
        })}

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
          <button
            type="button"
            className="cat-chip add"
            onClick={() => setAdding(true)}
            disabled={atMax}
          >
            + 추가
          </button>
        )}
      </div>

      <div className="hint">
        고른 카테고리마다 홈의 해당 섹션에 함께 노출되고, 상단 메뉴에도 표시됩니다.
        {value.length === 0 ? " 비워 두면 '그 외' 섹션으로 들어갑니다." : null}
        {atMax ? ` 최대 ${max}개까지 선택할 수 있어요.` : null}
      </div>
    </div>
  );
}
