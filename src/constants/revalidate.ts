/** ISR revalidate windows (seconds). Use literal values in route files — Next.js requires static exports. */
export const REVALIDATE = {
  content: 3600,
  catalog: 1800,
  sitemap: 86400,
} as const;
