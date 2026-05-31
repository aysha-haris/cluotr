import { query, queryOne } from "@/lib/db";
import type { Category } from "@/types/category";

const CATEGORY_COLUMNS = `id, name, slug, created_at`;

export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  return queryOne<Category>(
    `SELECT ${CATEGORY_COLUMNS} FROM categories WHERE slug = $1 LIMIT 1`,
    [slug],
  );
}

export async function getAllCategories(): Promise<Category[]> {
  const result = await query<Category>(
    `SELECT ${CATEGORY_COLUMNS} FROM categories ORDER BY name ASC`,
  );

  return result.rows;
}
