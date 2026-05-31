import { env } from "@/lib/env";

export const siteConfig = {
  name: "CLOUTR",
  description:
    "Discover curated product collections, buying guides, and affiliate picks optimized for Pinterest.",
  url: env.NEXT_PUBLIC_SITE_URL,
  locale: "en_US",
  twitterHandle: "@cloutr",
} as const;
