import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        ink: {
          900: "var(--ink-900)",
          850: "var(--ink-850)",
          800: "var(--ink-800)",
          700: "var(--ink-700)",
          600: "var(--ink-600)",
          500: "var(--ink-500)",
        },
        paper: {
          DEFAULT: "var(--paper)",
          dim: "var(--paper-dim)",
          mute: "var(--paper-mute)",
          faint: "var(--paper-faint)",
        },
        shu: {
          DEFAULT: "var(--shu)",
          bright: "var(--shu-bright)",
          deep: "var(--shu-deep)",
        },
        kin: "var(--kin)",
        ai: "var(--ai)",
        line: "var(--line)",
      },
      fontFamily: {
        display: "var(--font-display)",
        sans: "var(--font-sans)",
        mono: "var(--font-mono)",
      },
      maxWidth: {
        wrap: "var(--maxw)",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(18px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "draw-enso": {
          "0%": { strokeDashoffset: "1000" },
          "100%": { strokeDashoffset: "60" },
        },
        "pulse-soft": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.45" },
        },
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.8s cubic-bezier(0.2,0.7,0.2,1) both",
        "draw-enso": "draw-enso 2.4s cubic-bezier(0.4,0,0.2,1) forwards",
        "pulse-soft": "pulse-soft 1.4s ease-in-out infinite",
        marquee: "marquee 32s linear infinite",
      },
    },
  },
  plugins: [],
};
export default config;
