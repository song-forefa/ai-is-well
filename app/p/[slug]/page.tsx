import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { publicClient } from "@/utils/supabase/public";
import type { Item } from "@/lib/types";

export const dynamic = "force-dynamic";

async function getPost(slug: string): Promise<Item | null> {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) return null;
  const sb = publicClient();
  const { data } = await sb
    .from("items")
    .select("*")
    .eq("kind", "post")
    .eq("published", true)
    .eq("slug", decodeURIComponent(slug))
    .maybeSingle();
  return (data as Item | null) ?? null;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) return { title: "찾을 수 없는 글" };
  return {
    title: post.title,
    description: post.summary ?? undefined,
    openGraph: {
      title: post.title,
      description: post.summary ?? undefined,
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
  const post = await getPost(slug);
  if (!post) notFound();

  const date = new Date(post.created_at).toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <main className="post">
      <Link className="post-back" href="/">
        ← 목록으로
      </Link>
      <article className="post-card">
        <h1>{post.title}</h1>
        <div className="post-meta">
          {post.category ? `${post.category} · ` : ""}
          {date}
        </div>
        {post.thumbnail_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img className="post-hero" src={post.thumbnail_url} alt="" />
        ) : null}
        <div
          className="prose"
          dangerouslySetInnerHTML={{ __html: post.content_html ?? "" }}
        />
      </article>
    </main>
  );
}
