import { siteConfig } from "@/config/site";

export function buildCanonicalUrl(path = "/"): string {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${siteConfig.url}${normalized === "/" ? "" : normalized}`;
}
