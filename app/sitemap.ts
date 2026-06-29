import type { MetadataRoute } from "next";
import { site } from "@/lib/site";
import { lessons } from "@/lib/lessons";

// 静的書き出し（output: export / Cloudflare）でも生成できるよう固定化。Vercel 経路でも無害（元から静的）。
export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = site.url.replace(/\/$/, "");
  const staticRoutes = ["", "/learn", "/patterns", "/playground", "/about", "/made"].map((p) => ({
    url: `${base}${p}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: p === "" ? 1 : 0.8,
  }));
  const lessonRoutes = lessons.map((l) => ({
    url: `${base}/learn/${l.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));
  return [...staticRoutes, ...lessonRoutes];
}
