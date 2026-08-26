"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { SiteSettings } from "@/lib/types";
import ImageField from "@/components/ImageField";

export default function SettingsForm({ initial }: { initial: SiteSettings }) {
  const router = useRouter();
  const [handle, setHandle] = useState(initial.handle ?? "");
  const [tagline, setTagline] = useState(initial.tagline ?? "");
  const [avatar, setAvatar] = useState(initial.avatar_url ?? "");
  const [footer, setFooter] = useState(initial.footer_text ?? "");
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  async function save() {
    setSaving(true);
    setMsg(null);
    const res = await fetch("/api/admin/settings", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        handle,
        tagline,
        avatar_url: avatar,
        footer_text: footer,
      }),
    });
    setSaving(false);
    setMsg(res.ok ? "저장했습니다." : "저장에 실패했습니다.");
    if (res.ok) router.refresh();
  }

  return (
    <div className="panel">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h2 style={{ margin: 0 }}>프로필 (페이지 맨 위 영역)</h2>
        <button className="btn sm" onClick={() => setOpen((v) => !v)}>
          {open ? "접기" : "펼치기"}
        </button>
      </div>

      {open ? (
        <div style={{ marginTop: 16 }}>
          <ImageField label="프로필 이미지" value={avatar} onChange={setAvatar} />
          <div className="field">
            <label>핸들 / 이름</label>
            <input type="text" value={handle} onChange={(e) => setHandle(e.target.value)} />
          </div>
          <div className="field">
            <label>소개 한 줄</label>
            <input type="text" value={tagline} onChange={(e) => setTagline(e.target.value)} />
          </div>
          <div className="field">
            <label>하단 문구 (선택)</label>
            <input type="text" value={footer} onChange={(e) => setFooter(e.target.value)} />
          </div>
          <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
            <button className="btn primary" onClick={save} disabled={saving}>
              {saving ? "저장 중…" : "프로필 저장"}
            </button>
          </div>
          {msg ? <div className="ok">{msg}</div> : null}
        </div>
      ) : null}
    </div>
  );
}
