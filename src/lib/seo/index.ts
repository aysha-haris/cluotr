import { analyticsConfig } from "@/lib/analytics/config";

export { buildCanonicalUrl } from "./canonical";
export {
  buildArticleJsonLd,
  buildBreadcrumbJsonLd,
  buildOrganizationJsonLd,
  buildProductJsonLd,
  buildWebsiteJsonLd,
  type ArticleJsonLdInput,
  type BreadcrumbItem,
  type JsonLd,
  type ProductJsonLdInput,
} from "./json-ld";
export { buildMetadata as buildBaseMetadata, type PageSeoInput } from "./metadata";

import type { Metadata } from "next";

import { buildMetadata as buildBaseMetadata, type PageSeoInput } from "./metadata";

export function buildMetadata(input: PageSeoInput = {}): Metadata {
  const base = buildBaseMetadata(input);

  if (analyticsConfig.gscVerification) {
    return {
      ...base,
      verification: {
        google: analyticsConfig.gscVerification,
      },
    };
  }

  return base;
}
