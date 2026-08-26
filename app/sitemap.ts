import type { MetadataRoute } from "next";
import { SITE } from "@/lib/site";
import { loadSite } from "@/lib/loadSite";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base: MetadataRoute.Sitemap = [
    { url: SITE.url, changeFrequency: "daily", priority: 1 },
  ];

  try {
    const { items } = await loadSite();
    const posts = items
      .filter((i) => i.kind === "post" && i.slug)
      .map((i) => ({
        url: `${SITE.url}/p/${encodeURIComponent(i.slug as string)}`,
        lastModified: new Date(i.updated_at),
        changeFrequency: "weekly" as const,
        priority: 0.8,
      }));
    return [...base, ...posts];
  } catch {
    return base;
  }
}
