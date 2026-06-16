/** @type {import('next').NextConfig} */

// Content-Security-Policy.
// The load-bearing directive for BYOK trust is `connect-src`: the browser is
// only ever allowed to send network requests to the same origin and to the
// Anthropic API. Even if malicious code were somehow served, it physically
// cannot exfiltrate the user's API key to any other destination.
const csp = [
  "default-src 'self'",
  "base-uri 'self'",
  "object-src 'none'",
  "frame-ancestors 'none'",
  "form-action 'self'",
  "img-src 'self' data:",
  "font-src 'self'",
  // Tailwind output + framer-motion inline style attributes
  "style-src 'self' 'unsafe-inline'",
  // Next.js injects inline bootstrap/hydration scripts (no nonce on a static site)
  "script-src 'self' 'unsafe-inline'",
  // ← the guarantee: the key can only ever travel to Anthropic.
  "connect-src 'self' https://api.anthropic.com",
  "upgrade-insecure-requests",
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: csp },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
];

const nextConfig = {
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
};

export default nextConfig;
