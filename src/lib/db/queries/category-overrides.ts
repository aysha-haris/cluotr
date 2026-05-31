import { query } from "@/lib/db";
import type { CategoryOverride } from "@/types/catalog";

interface CategoryOverrideRow {
  id: string;
  name: string;
  description: string | null;
  image_url: string | null;
  sort_order: number;
}

function toCategoryOverride(row: CategoryOverrideRow): CategoryOverride {
  return {
    id: row.id,
    name: row.name,
    description: row.description,
    imageUrl: row.image_url,
    sortOrder: row.sort_order,
  };
}

export async function getCategoryOverrides(): Promise<CategoryOverride[]> {
  try {
    const result = await query<CategoryOverrideRow>(
      `SELECT id, name, description, image_url, sort_order
       FROM categories ORDER BY sort_order ASC, name ASC`,
    );
    return result.rows.map(toCategoryOverride);
  } catch {
    return [];
  }
}

export async function upsertCategoryOverride(
  id: string,
  data: { name: string; description: string | null; imageUrl: string | null; sortOrder: number },
): Promise<CategoryOverride> {
  const result = await query<CategoryOverrideRow>(
    `INSERT INTO categories (id, name, description, image_url, sort_order, updated_at)
     VALUES ($1, $2, $3, $4, $5, NOW())
     ON CONFLICT (id) DO UPDATE
       SET name = EXCLUDED.name,
           description = EXCLUDED.description,
           image_url = EXCLUDED.image_url,
           sort_order = EXCLUDED.sort_order,
           updated_at = NOW()
     RETURNING id, name, description, image_url, sort_order`,
    [id, data.name, data.description, data.imageUrl, data.sortOrder],
  );
  return toCategoryOverride(result.rows[0]!);
}

export async function deleteCategoryOverride(id: string): Promise<boolean> {
  const result = await query(
    `DELETE FROM categories WHERE id = $1`,
    [id],
  );
  return (result.rowCount ?? 0) > 0;
}
