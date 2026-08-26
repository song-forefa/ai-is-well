import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { publicClient } from "@/utils/supabase/public";
import type { Item, SiteSettings } from "@/lib/types";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import Card from "@/components/Card";
import { catsOf } from "@/lib/itemView";
import { SITE } from "@/lib/site";
import AuthorBio from "@/components/AuthorBio";

export const dynamic = "force-dynamic";

const DEFAULTS: SiteSettings = {
  id: 1,
  handle: "@ai.is.well",
  tagline: "📓 AI로 대기업 취뽀한 현직자의 꿀팁 아카이브!",
  avatar_url: null,
  footer_text: null,
};

async function load(slug: string) {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
    return { post: null, settings: DEFAULTS, more: [] as Item[] };
  }
  const sb = publicClient();
  const { data: post } = await sb
    .from("items")
    .select("*")
    .eq("kind", "post")
    .eq("published", true)
    .eq("slug", decodeURIComponent(slug))
    .maybeSingle();

  const [{ data: settings }, { data: more }] = await Promise.all([
    sb.from("site_settings").select("*").eq("id", 1).maybeSingle(),
    sb
      .from("items")
      .select("*")
      .eq("published", true)
      .order("sort_order", { ascending: true })
      .limit(7),
  ]);

  return {
    post: (post as Item | null) ?? null,
    settings: (settings as SiteSettings | null) ?? DEFAULTS,
    more: ((more as Item[] | null) ?? []).filter((i) => i.id !== (post as Item | null)?.id).slice(0, 3),
  };
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const { post } = await load(slug);
  if (!post) return { title: "찾을 수 없는 글", robots: { index: false } };

  const url = `/p/${encodeURIComponent(post.slug ?? slug)}`;
  const desc =
    post.summary ??
    `${SITE.name}(${SITE.handle})이 정리한 ${post.title}. ${SITE.description}`;

  return {
    title: post.title,
    description: desc,
    keywords: [...catsOf(post), ...SITE.keywords],
    alternates: { canonical: url },
    openGraph: {
      type: "article",
      siteName: SITE.name,
      title: post.title,
      description: desc,
      url,
      locale: "ko_KR",
      publishedTime: post.created_at,
      modifiedTime: post.updated_at,
      authors: [SITE.name],
      tags: catsOf(post),
      images: post.thumbnail_url ? [post.thumbnail_url] : undefined,
    },
    twitter: {
      card: post.thumbnail_url ? "summary_large_image" : "summary",
      title: post.title,
      description: desc,
      images: post.thumbnail_url ? [post.thumbnail_url] : undefined,
    },
  };
}

export default async function PostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const { post, settings, more } = await load(slug);
  if (!post) notFound();

  const date = new Date(post.created_at).toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const articleLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.summary ?? undefined,
    image: post.thumbnail_url ? [post.thumbnail_url] : undefined,
    datePublished: post.created_at,
    dateModified: post.updated_at,
    author: { "@type": "Person", name: SITE.name, url: SITE.instagram },
    publisher: { "@type": "Person", name: SITE.name, url: SITE.url },
    mainEntityOfPage: `${SITE.url}/p/${encodeURIComponent(post.slug ?? slug)}`,
    keywords: catsOf(post).join(", "),
    inLanguage: "ko-KR",
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleLd) }}
      />
      <SiteHeader settings={settings} />

      <main className="site">
        <article className="article">
          <div className="article-head">
            <Link className="article-back" href="/">
              ← 목록으로
            </Link>
            {catsOf(post).map((c, i) => (
              <span className={i === 0 ? "card-cat" : "card-tag"} key={c}>
                {i === 0 ? c : `#${c}`}
              </span>
            ))}
            <h1>{post.title}</h1>
            {post.summary ? <p className="article-lead">{post.summary}</p> : null}
            <div className="article-meta">{date}</div>
          </div>

          {post.thumbnail_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img className="article-hero" src={post.thumbnail_url} alt="" />
          ) : null}

          <div
            className="prose"
            dangerouslySetInnerHTML={{ __html: post.content_html ?? "" }}
          />

          <AuthorBio settings={settings} version={post.bio_version} />
        </article>

        {more.length > 0 ? (
          <section className="cat-section">
            <div className="cat-head">
              <h2>다른 글도 보기</h2>
            </div>
            <div className="grid">
              {more.map((item) => (
                <Card key={item.id} item={item} />
              ))}
            </div>
          </section>
        ) : null}
      </main>

      <SiteFooter settings={settings} />
    </>
  );
}
