import type { MetadataRoute } from "next";

import { siteConfig } from "@/config/site";
import {
  blogPath,
  collectionPath,
  guidePath,
  pinPath,
  roundupPath,
  ROUTES,
} from "@/constants/routes";
import { getAllContentSlugs } from "@/lib/content";
import { getAllCollections } from "@/lib/db/queries/collections";

export const revalidate = 86400;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: siteConfig.url, lastModified: new Date(), changeFrequency: "daily", priority: 1 },
    {
      url: `${siteConfig.url}${ROUTES.blog}`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${siteConfig.url}${ROUTES.guides}`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${siteConfig.url}${ROUTES.roundups}`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
  ];

  const contentSlugs = await getAllContentSlugs();
  const contentRoutes: MetadataRoute.Sitemap = contentSlugs.map(({ type, slug }) => {
    const pathMap = {
      blog: blogPath(slug),
      guides: guidePath(slug),
      roundups: roundupPath(slug),
      pinterest: pinPath(slug),
    } as const;

    return {
      url: `${siteConfig.url}${pathMap[type]}`,
      lastModified: new Date(),
      changeFrequency: type === "blog" ? "weekly" : "monthly",
      priority: type === "pinterest" ? 0.9 : 0.7,
    };
  });

  let collectionRoutes: MetadataRoute.Sitemap = [];

  try {
    const collections = await getAllCollections();
    collectionRoutes = collections.map((collection) => ({
      url: `${siteConfig.url}${collectionPath(collection.slug)}`,
      lastModified: collection.created_at,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    }));
  } catch {
    collectionRoutes = [];
  }

  return [...staticRoutes, ...contentRoutes, ...collectionRoutes];
}
