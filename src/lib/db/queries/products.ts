import { query, queryOne } from "@/lib/db";
import type { Product } from "@/types/product";

const PRODUCT_COLUMNS = `
  id, title, slug, description, image, affiliate_url, price, rating, featured, created_at
`;

export async function getProductBySlug(slug: string): Promise<Product | null> {
  return queryOne<Product>(
    `SELECT ${PRODUCT_COLUMNS} FROM products WHERE slug = $1 LIMIT 1`,
    [slug],
  );
}

export async function getFeaturedProducts(limit = 12): Promise<Product[]> {
  const result = await query<Product>(
    `SELECT ${PRODUCT_COLUMNS}
     FROM products
     WHERE featured = TRUE
     ORDER BY created_at DESC
     LIMIT $1`,
    [limit],
  );

  return result.rows;
}

export async function getProductsBySlugs(slugs: string[]): Promise<Product[]> {
  if (slugs.length === 0) return [];

  const result = await query<Product>(
    `SELECT ${PRODUCT_COLUMNS}
     FROM products
     WHERE slug = ANY($1::text[])
     ORDER BY array_position($1::text[], slug)`,
    [slugs],
  );

  return result.rows;
}
