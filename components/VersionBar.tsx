import Link from "next/link";

// 디자인 비교/투표용 하단 고정 바. /1 /2 /3 에서만 노출된다.
const VERSIONS = [
  { path: "/1", label: "A", name: "링크트리형" },
  { path: "/2", label: "B", name: "매거진형" },
  { path: "/3", label: "C", name: "절충형" },
];

export default function VersionBar({ current }: { current: "/1" | "/2" | "/3" }) {
  const now = VERSIONS.find((v) => v.path === current);
  return (
    <div className="vbar" role="navigation" aria-label="디자인 버전 선택">
      <div className="vbar-inner">
        <span className="vbar-label">
          디자인 <b>{now?.label}</b> · {now?.name}
        </span>
        <div className="vbar-links">
          {VERSIONS.map((v) => (
            <Link
              key={v.path}
              href={v.path}
              className={v.path === current ? "on" : ""}
              title={v.name}
            >
              {v.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
