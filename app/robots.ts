import type { MetadataRoute } from "next";
import { SITE } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        // 관리자와 클릭 리다이렉트는 색인하지 않는다
        disallow: ["/admin", "/admin/", "/api/", "/l/"],
      },
    ],
    sitemap: `${SITE.url}/sitemap.xml`,
  };
}
