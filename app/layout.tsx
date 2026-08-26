import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ai.is.well — AI 꿀팁 아카이브",
  description: "AI로 대기업 취뽀한 현직자의 꿀팁 아카이브",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
