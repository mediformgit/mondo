import type { MetadataRoute } from "next";
import { site } from "@/lib/site";

// 静的書き出し（output: export / Cloudflare）でも生成できるよう固定化。Vercel 経路でも無害（元から静的）。
export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  const base = site.url.replace(/\/$/, "");
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: `${base}/sitemap.xml`,
  };
}
