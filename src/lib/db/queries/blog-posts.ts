import { query, queryOne } from "@/lib/db";
import type { BlogPost } from "@/types/blog";

const BLOG_POST_COLUMNS = `
  id, title, slug, excerpt, content, featured_image, seo_title, seo_description, published_at, created_at
`;

export async function getPublishedBlogPostBySlug(slug: string): Promise<BlogPost | null> {
  return queryOne<BlogPost>(
    `SELECT ${BLOG_POST_COLUMNS}
     FROM blog_posts
     WHERE slug = $1 AND published_at IS NOT NULL AND published_at <= NOW()
     LIMIT 1`,
    [slug],
  );
}

export async function getPublishedBlogPosts(limit = 20): Promise<BlogPost[]> {
  const result = await query<BlogPost>(
    `SELECT ${BLOG_POST_COLUMNS}
     FROM blog_posts
     WHERE published_at IS NOT NULL AND published_at <= NOW()
     ORDER BY published_at DESC
     LIMIT $1`,
    [limit],
  );

  return result.rows;
}
