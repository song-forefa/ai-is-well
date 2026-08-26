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

  // 고른 것을 선택한 순서대로 앞에 두고, 나머지 후보를 뒤에 붙인다.
  const all = useMemo(() => {
    const rest = options.filter((c) => c && !value.includes(c));
    return [...value.filter(Boolean), ...rest];
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
        카테고리 (선택){" "}
        <span className="label-sub">여러 개 가능 · 먼저 고른 것이 대표</span>
      </label>

      <div className="cat-picker">
        {all.map((c) => {
          const on = value.includes(c);
          return (
            <button
              key={c}
              type="button"
              className={`cat-chip${on ? " on" : ""}${on && value[0] === c ? " lead" : ""}`}
              onClick={() => toggle(c)}
              disabled={!on && atMax}
              title={!on && atMax ? `최대 ${max}개까지 선택할 수 있어요` : undefined}
            >
              {on && value[0] === c ? "★ " : on ? "✓ " : ""}
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
        <b>★ 대표 카테고리</b>({value[0] || "미지정"})가 홈에서 이 글이 들어갈 섹션을 정하고,
        나머지는 카드에 <b>#해시태그</b>로만 붙습니다. 대표를 바꾸려면 지금 선택을 모두 해제하고
        원하는 것부터 다시 고르세요.
        {value.length === 0 ? " 비워 두면 '그 외' 섹션으로 들어갑니다." : null}
        {atMax ? ` 최대 ${max}개까지 선택할 수 있어요.` : null}
      </div>
    </div>
  );
}
