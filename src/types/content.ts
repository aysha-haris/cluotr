import { z } from "zod";

export const contentTypeSchema = z.enum([
  "blog",
  "guides",
  "roundups",
  "pinterest",
]);

export type ContentType = z.infer<typeof contentTypeSchema>;

export const contentFrontmatterSchema = z.object({
  title: z.string().min(1),
  slug: z.string().min(1).optional(),
  description: z.string().optional(),
  excerpt: z.string().optional(),
  featuredImage: z.string().optional(),
  seoTitle: z.string().optional(),
  seoDescription: z.string().optional(),
  publishedAt: z.string().datetime().optional(),
  draft: z.boolean().default(false),
  tags: z.array(z.string()).default([]),
  pinterestImage: z.string().optional(),
  affiliateDisclosure: z.boolean().default(true),
});

export type ContentFrontmatter = z.infer<typeof contentFrontmatterSchema>;

export interface ContentEntry {
  slug: string;
  type: ContentType;
  frontmatter: ContentFrontmatter;
  content: string;
  readingTime: string;
}

export interface ContentListItem {
  slug: string;
  type: ContentType;
  title: string;
  description?: string;
  excerpt?: string;
  featuredImage?: string;
  publishedAt?: string;
  readingTime: string;
}
