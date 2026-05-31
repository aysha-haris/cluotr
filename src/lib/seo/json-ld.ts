import { siteConfig } from "@/config/site";
import { buildCanonicalUrl } from "@/lib/seo/canonical";

export interface ArticleJsonLdInput {
  title: string;
  description: string;
  path: string;
  image?: string;
  publishedAt?: string;
  modifiedAt?: string;
}

export interface ProductJsonLdInput {
  name: string;
  description?: string;
  image?: string;
  url: string;
  price?: string;
  rating?: string;
}

export interface BreadcrumbItem {
  name: string;
  path: string;
}

export function buildWebsiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteConfig.name,
    description: siteConfig.description,
    url: siteConfig.url,
  };
}

export function buildOrganizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: siteConfig.name,
    url: siteConfig.url,
    description: siteConfig.description,
  };
}

export function buildArticleJsonLd(input: ArticleJsonLdInput) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: input.title,
    description: input.description,
    url: buildCanonicalUrl(input.path),
    image: input.image,
    datePublished: input.publishedAt,
    dateModified: input.modifiedAt ?? input.publishedAt,
    publisher: {
      "@type": "Organization",
      name: siteConfig.name,
      url: siteConfig.url,
    },
  };
}

export function buildProductJsonLd(input: ProductJsonLdInput) {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: input.name,
    description: input.description,
    image: input.image,
    url: input.url,
    ...(input.price
      ? {
          offers: {
            "@type": "Offer",
            price: input.price,
            priceCurrency: "USD",
            availability: "https://schema.org/InStock",
            url: input.url,
          },
        }
      : {}),
    ...(input.rating
      ? {
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: input.rating,
            bestRating: "5",
            worstRating: "1",
          },
        }
      : {}),
  };
}

export function buildBreadcrumbJsonLd(items: BreadcrumbItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: buildCanonicalUrl(item.path),
    })),
  };
}

export type JsonLd = Record<string, unknown>;
