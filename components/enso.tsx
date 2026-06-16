"use client";

import { motion } from "framer-motion";

/**
 * 円相 (ensō) — the brush circle of Zen. Drawn, not perfect.
 * It stands for the whole, the void, and the moment of asking.
 */
export function Enso({
  className = "",
  stroke = "var(--shu)",
  glyph = "問",
}: {
  className?: string;
  stroke?: string;
  glyph?: string;
}) {
  // a near-closed brush circle with a deliberate opening
  const d =
    "M158 36 C 96 36 40 92 40 158 C 40 224 96 280 162 280 C 228 280 282 226 282 160 C 282 104 244 58 196 44";

  return (
    <div className={`relative ${className}`}>
      <svg viewBox="0 0 320 320" fill="none" className="h-full w-full">
        <defs>
          <linearGradient id="ensoG" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="var(--shu-bright)" />
            <stop offset="55%" stopColor="var(--shu)" />
            <stop offset="100%" stopColor="var(--shu-deep)" />
          </linearGradient>
          <filter id="ensoBlur">
            <feGaussianBlur stdDeviation="6" />
          </filter>
        </defs>

        {/* soft glow ghost */}
        <motion.path
          d={d}
          stroke="url(#ensoG)"
          strokeWidth={26}
          strokeLinecap="round"
          filter="url(#ensoBlur)"
          opacity={0.28}
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 2.4, ease: [0.4, 0, 0.2, 1] }}
        />
        {/* main brush stroke — tapers via dash + linecap */}
        <motion.path
          d={d}
          stroke={stroke}
          strokeWidth={17}
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 2.4, ease: [0.4, 0, 0.2, 1] }}
        />
        {/* dry-brush highlight */}
        <motion.path
          d={d}
          stroke="var(--shu-bright)"
          strokeWidth={4}
          strokeLinecap="round"
          opacity={0.5}
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 2.4, ease: [0.4, 0, 0.2, 1] }}
        />
      </svg>
      <span
        className="pointer-events-none absolute inset-0 grid place-items-center font-display text-paper"
        style={{ fontSize: "33%" }}
      >
        {glyph}
      </span>
    </div>
  );
}
