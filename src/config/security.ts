const isDev = process.env.NODE_ENV === "development";

export const contentSecurityPolicy = {
  directives: {
    defaultSrc: ["'self'"],
    scriptSrc: [
      "'self'",
      // Next.js injects inline scripts for RSC hydration — required in all environments
      "'unsafe-inline'",
      ...(isDev ? ["'unsafe-eval'"] : []),
      "https://www.googletagmanager.com",
      "https://www.google-analytics.com",
      "https://s.pinimg.com",
    ],
    styleSrc: ["'self'", "'unsafe-inline'"],
    imgSrc: [
      "'self'",
      "data:",
      "blob:",
      "https:",
      "https://*.supabase.co",
      "https://*.pinimg.com",
    ],
    fontSrc: ["'self'", "data:"],
    connectSrc: [
      "'self'",
      "https://*.supabase.co",
      "https://www.google-analytics.com",
      "https://ct.pinterest.com",
    ],
    frameSrc: ["'self'"],
    objectSrc: ["'none'"],
    baseUri: ["'self'"],
    formAction: ["'self'"],
    frameAncestors: ["'self'"],
    upgradeInsecureRequests: isDev ? [] : [""],
  },
} as const;

export function buildCspHeader(): string {
  const { directives } = contentSecurityPolicy;

  return Object.entries(directives)
    .map(([key, values]) => {
      const directive = key.replace(/[A-Z]/g, (char) => `-${char.toLowerCase()}`);
      const filtered = values.filter((value) => value !== "");
      if (filtered.length === 0) return null;
      return `${directive} ${filtered.join(" ")}`;
    })
    .filter(Boolean)
    .join("; ");
}

export const securityHeaders = [
  { key: "Content-Security-Policy", value: buildCspHeader() },
  { key: "X-DNS-Prefetch-Control", value: "on" },
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
] as const;
