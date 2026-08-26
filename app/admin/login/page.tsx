"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const next = params.get("next") || "/admin";
  const [password, setPassword] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setErr(null);
    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    const json = await res.json().catch(() => ({}));
    setBusy(false);
    if (!res.ok) {
      setErr(json.error ?? "로그인에 실패했습니다.");
      return;
    }
    router.push(next);
    router.refresh();
  }

  return (
    <form className="login-box" onSubmit={submit}>
      <h1>관리자 로그인</h1>
      <p>ai.is.well 콘텐츠 관리</p>
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="비밀번호"
        autoFocus
      />
      <button className="btn primary" type="submit" disabled={busy} style={{ width: "100%", marginTop: 12 }}>
        {busy ? "확인 중…" : "로그인"}
      </button>
      {err ? <div className="err">{err}</div> : null}
    </form>
  );
}

export default function LoginPage() {
  return (
    <main className="login-wrap">
      <Suspense fallback={<div className="login-box">불러오는 중…</div>}>
        <LoginForm />
      </Suspense>
    </main>
  );
}
