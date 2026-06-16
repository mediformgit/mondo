export const site = {
  name: "問道",
  romaji: "MONDŌ",
  tagline: "問いを、力に。",
  taglineEn: "Turn questions into power.",
  description:
    "生成AIを“使われる側”で終わらせない。Claudeを題材に、文系も理系も、初心者から本質まで。問いを立てる力を鍛える、無料の生成AI教育。",
  // Vercel: set NEXT_PUBLIC_SITE_URL to your production domain.
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://mondo.vercel.app",
};

export type NavLink = { href: string; label: string; sub: string };

export const nav: NavLink[] = [
  { href: "/learn", label: "学ぶ", sub: "Learn" },
  { href: "/patterns", label: "型", sub: "Patterns" },
  { href: "/playground", label: "道場", sub: "Playground" },
  { href: "/about", label: "思想", sub: "Manifesto" },
];
