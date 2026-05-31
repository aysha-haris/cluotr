import { siteConfig } from "@/config/site";

export const defaultSeo = {
  title: siteConfig.name,
  titleTemplate: `%s | ${siteConfig.name}`,
  description: siteConfig.description,
  openGraph: {
    type: "website" as const,
    locale: siteConfig.locale,
    siteName: siteConfig.name,
  },
  twitter: {
    card: "summary_large_image" as const,
    site: siteConfig.twitterHandle,
  },
} as const;
