import type { Metadata } from "next";

import { defaultSeo } from "@/config/seo";
import { siteConfig } from "@/config/site";

export interface PageSeoInput {
  title?: string;
  description?: string;
  path?: string;
  image?: string;
  noIndex?: boolean;
  publishedTime?: string;
  modifiedTime?: string;
  type?: "website" | "article";
}

function resolveTitle(title?: string): string {
  if (!title) return defaultSeo.title;
  return defaultSeo.titleTemplate.replace("%s", title);
}

function resolveCanonical(path = "/"): string {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${siteConfig.url}${normalized === "/" ? "" : normalized}`;
}

export function buildMetadata(input: PageSeoInput = {}): Metadata {
  const title = resolveTitle(input.title);
  const description = input.description ?? defaultSeo.description;
  const canonical = resolveCanonical(input.path);
  const image = input.image ?? `${siteConfig.url}/og-default.png`;

  return {
    title,
    description,
    metadataBase: new URL(siteConfig.url),
    alternates: {
      canonical,
    },
    robots: input.noIndex
      ? { index: false, follow: false }
      : { index: true, follow: true },
    openGraph: {
      title,
      description,
      url: canonical,
      siteName: defaultSeo.openGraph.siteName,
      locale: defaultSeo.openGraph.locale,
      type: input.type ?? defaultSeo.openGraph.type,
      images: [{ url: image, width: 1200, height: 630, alt: title }],
      ...(input.publishedTime ? { publishedTime: input.publishedTime } : {}),
      ...(input.modifiedTime ? { modifiedTime: input.modifiedTime } : {}),
    },
    twitter: {
      card: defaultSeo.twitter.card,
      site: defaultSeo.twitter.site,
      title,
      description,
      images: [image],
    },
  };
}
