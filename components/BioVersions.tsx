"use client";

import { useState } from "react";
import type { BioVersion } from "@/lib/authorBio";
import { BIO_SLOTS } from "@/lib/authorBio";

// 글 하단 소개를 버전 3개까지 저장해 두고, 그중 하나를 골라 쓰는 편집기.
export default function BioVersions({
  versions,
  active,
  onChange,
  onActiveChange,
}: {
  versions: BioVersion[];
  active: number;
  onChange: (next: BioVersion[]) => void;
  onActiveChange: (i: number) => void;
}) {
  const [tab, setTab] = useState(active);

  function patch(i: number, key: keyof BioVersion, value: string) {
    const next = versions.map((v, idx) => (idx === i ? { ...v, [key]: value } : v));
    onChange(next);
  }

  const v = versions[tab];

  return (
    <div>
      <div className="bio-tabs">
        {Array.from({ length: BIO_SLOTS }, (_, i) => (
          <button
            key={i}
            type="button"
            className={`bio-tab${i === tab ? " on" : ""}`}
            onClick={() => setTab(i)}
          >
            {versions[i].label || `버전 ${i + 1}`}
            {i === active ? <span className="bio-tab-dot" title="사용 중" /> : null}
          </button>
        ))}
      </div>

      <div className="bio-editor">
        <div className="two-col">
          <div className="field">
            <label>버전 이름 (관리용)</label>
            <input
              type="text"
              value={v.label}
              onChange={(e) => patch(tab, "label", e.target.value)}
              placeholder={`버전 ${tab + 1}`}
            />
          </div>
          <div className="field">
            <label>표시 이름</label>
            <input
              type="text"
              value={v.name}
              onChange={(e) => patch(tab, "name", e.target.value)}
              placeholder="애즈웰"
            />
          </div>
        </div>

        <div className="field">
          <label>소개 문구</label>
          <textarea
            value={v.text}
            onChange={(e) => patch(tab, "text", e.target.value)}
            rows={7}
            placeholder={"현대인을 위한 AI 트렌드 소식부터,\n취업에 활용할 수 있는 AI 꿀팁과…"}
          />
          <div className="hint">줄바꿈은 그대로 반영됩니다.</div>
        </div>

        <div className="two-col">
          <div className="field">
            <label>링크 주소</label>
            <input
              type="text"
              value={v.linkUrl}
              onChange={(e) => patch(tab, "linkUrl", e.target.value)}
              placeholder="https://www.instagram.com/ai.is.well/"
            />
            <div className="hint">비우면 링크 버튼이 표시되지 않습니다.</div>
          </div>
          <div className="field">
            <label>링크에 보일 문구</label>
            <input
              type="text"
              value={v.linkLabel}
              onChange={(e) => patch(tab, "linkLabel", e.target.value)}
              placeholder="애즈웰 | AI로 잘 먹고 잘 살기 (@ai.is.well)"
            />
          </div>
        </div>

        {tab === active ? (
          <div className="bio-active-note">이 버전이 지금 모든 글 하단에 노출되고 있습니다.</div>
        ) : (
          <button type="button" className="btn" onClick={() => onActiveChange(tab)}>
            이 버전을 사용하기
          </button>
        )}
      </div>
    </div>
  );
}
