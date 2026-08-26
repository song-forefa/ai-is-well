import Link from "next/link";

export default function NotFound() {
  return (
    <main className="post">
      <div className="post-card" style={{ textAlign: "center" }}>
        <h1 style={{ fontSize: 20 }}>페이지를 찾을 수 없어요</h1>
        <p style={{ color: "var(--ink-2)", fontSize: 14 }}>
          주소가 바뀌었거나 비공개로 전환된 글일 수 있어요.
        </p>
        <Link className="btn" href="/" style={{ marginTop: 8 }}>
          홈으로
        </Link>
      </div>
    </main>
  );
}
