import type { Metadata } from "next";
import { Shippori_Mincho, Zen_Kaku_Gothic_New, JetBrains_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";
import { site } from "@/lib/site";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

const mincho = Shippori_Mincho({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-mincho",
  display: "swap",
});

const gothic = Zen_Kaku_Gothic_New({
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
  variable: "--font-gothic",
  display: "swap",
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-mono-jb",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} MONDŌ — ${site.tagline}`,
    template: `%s — ${site.name} MONDŌ`,
  },
  description: site.description,
  keywords: ["生成AI", "Claude", "プロンプト", "AI教育", "プロンプトエンジニアリング", "無料", "学習"],
  openGraph: {
    title: `${site.name} MONDŌ — ${site.tagline}`,
    description: site.description,
    type: "website",
    locale: "ja_JP",
  },
  twitter: { card: "summary_large_image" },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ja" className={`${mincho.variable} ${gothic.variable} ${mono.variable}`}>
      <body>
        <SiteHeader />
        <main>{children}</main>
        <SiteFooter />
        {/* Vercel Web Analytics は Vercel 上でのみ機能する。静的書き出し（Cloudflare 等）では描画しない。 */}
        {process.env.STATIC_EXPORT !== "1" && <Analytics />}
      </body>
    </html>
  );
}
