import type { Metadata } from "next";
import { SITE } from "@/lib/site";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: `${SITE.name} | AI로 잘 먹고 잘 살기 (${SITE.handle})`,
    template: `%s | ${SITE.name}`,
  },
  description: SITE.description,
  keywords: SITE.keywords,
  applicationName: SITE.name,
  authors: [{ name: SITE.name, url: SITE.instagram }],
  creator: SITE.name,
  publisher: SITE.name,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: SITE.name,
    title: `${SITE.name} | AI로 잘 먹고 잘 살기`,
    description: SITE.description,
    url: SITE.url,
    locale: "ko_KR",
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE.name} | AI로 잘 먹고 잘 살기`,
    description: SITE.description,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
  formatDetection: { telephone: false },
  verification: { google: SITE.googleVerification },
};

// 검색엔진이 사이트와 운영자를 이해하도록 구조화 데이터를 넣는다.
const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": `${SITE.url}/#website`,
      url: SITE.url,
      name: SITE.name,
      alternateName: ["ai.is.well", "애즈웰 AI", `${SITE.name} ${SITE.handle}`],
      description: SITE.description,
      inLanguage: "ko-KR",
      publisher: { "@id": `${SITE.url}/#person` },
    },
    {
      "@type": "Person",
      "@id": `${SITE.url}/#person`,
      name: SITE.name,
      alternateName: SITE.handle,
      url: SITE.url,
      sameAs: [SITE.instagram],
      description:
        "AI 트렌드와 취업에 활용하는 AI 꿀팁을 전하는 콘텐츠 크리에이터.",
    },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body>
        {children}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </body>
    </html>
  );
}
