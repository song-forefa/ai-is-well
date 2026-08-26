"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { Item } from "@/lib/types";

export default function AdminList({ initial }: { initial: Item[] }) {
  const router = useRouter();
  const [items, setItems] = useState<Item[]>(initial);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  async function persistOrder(next: Item[]) {
    setBusy(true);
    setMsg(null);
    const res = await fetch("/api/admin/reorder", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ids: next.map((i) => i.id) }),
    });
    setBusy(false);
    if (!res.ok) {
      setMsg("순서 저장에 실패했습니다.");
      return;
    }
    setMsg("순서를 저장했습니다.");
    router.refresh();
  }

  function move(index: number, dir: -1 | 1) {
    const target = index + dir;
    if (target < 0 || target >= items.length) return;
    const next = [...items];
    [next[index], next[target]] = [next[target], next[index]];
    setItems(next);
    void persistOrder(next);
  }

  async function togglePublished(item: Item) {
    setBusy(true);
    const res = await fetch(`/api/admin/items/${item.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ published: !item.published }),
    });
    setBusy(false);
    if (!res.ok) {
      setMsg("변경에 실패했습니다.");
      return;
    }
    setItems((prev) =>
      prev.map((i) => (i.id === item.id ? { ...i, published: !i.published } : i))
    );
    router.refresh();
  }

  async function remove(item: Item) {
    if (!window.confirm(`"${item.title}" 을(를) 삭제할까요? 되돌릴 수 없습니다.`)) return;
    setBusy(true);
    const res = await fetch(`/api/admin/items/${item.id}`, { method: "DELETE" });
    setBusy(false);
    if (!res.ok) {
      setMsg("삭제에 실패했습니다.");
      return;
    }
    setItems((prev) => prev.filter((i) => i.id !== item.id));
    router.refresh();
  }

  if (items.length === 0) {
    return (
      <div className="panel" style={{ textAlign: "center", color: "var(--ink-2)", fontSize: 14 }}>
        아직 항목이 없습니다. 오른쪽 위 <b>새 항목</b> 버튼으로 첫 카드를 만들어 보세요.
      </div>
    );
  }

  return (
    <div className="panel">
      <h2>항목 {items.length}개 · 위에 있을수록 페이지 상단에 노출</h2>
      {items.map((item, i) => (
        <div className={`row${item.published ? "" : " off"}`} key={item.id}>
          <div className="grip">
            <button className="btn sm" onClick={() => move(i, -1)} disabled={busy || i === 0} title="위로">
              ↑
            </button>
            <button
              className="btn sm"
              onClick={() => move(i, 1)}
              disabled={busy || i === items.length - 1}
              title="아래로"
            >
              ↓
            </button>
          </div>

          <div className="rspacer">
            <div className="rtitle">
              {item.emoji ? `${item.emoji} ` : ""}
              {item.title}
            </div>
            <div className="rmeta">
              {item.kind === "link" ? (
                <>
                  {item.url} · 클릭 {item.click_count}회
                </>
              ) : (
                <>/p/{item.slug}</>
              )}
              {item.category ? ` · ${item.category}` : ""}
            </div>
          </div>

          <span className={`badge ${item.kind}`}>{item.kind === "link" ? "링크" : "글"}</span>
          {!item.published ? <span className="badge draft">비공개</span> : null}

          <button className="btn sm" onClick={() => togglePublished(item)} disabled={busy}>
            {item.published ? "숨기기" : "공개"}
          </button>
          <Link className="btn sm" href={`/admin/${item.id}`}>
            수정
          </Link>
          <button className="btn sm danger" onClick={() => remove(item)} disabled={busy}>
            삭제
          </button>
        </div>
      ))}
      {msg ? <div className="ok">{msg}</div> : null}
    </div>
  );
}
