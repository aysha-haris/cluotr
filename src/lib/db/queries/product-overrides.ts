import { query } from "@/lib/db";
import type { ProductOverride } from "@/types/catalog";

interface ProductOverrideRow {
  product_id: number;
  title: string | null;
  category: string | null;
  image_url: string | null;
}

function toProductOverride(row: ProductOverrideRow): ProductOverride {
  return {
    productId: row.product_id,
    title: row.title,
    category: row.category,
    imageUrl: row.image_url,
  };
}

export async function getProductOverrides(): Promise<ProductOverride[]> {
  try {
    const result = await query<ProductOverrideRow>(
      `SELECT product_id, title, category, image_url FROM products ORDER BY product_id ASC`,
    );
    return result.rows.map(toProductOverride);
  } catch {
    return [];
  }
}

export async function upsertProductOverride(
  productId: number,
  data: { title: string | null; category: string | null; imageUrl: string | null },
): Promise<ProductOverride> {
  const result = await query<ProductOverrideRow>(
    `INSERT INTO products (product_id, title, category, image_url, updated_at)
     VALUES ($1, $2, $3, $4, NOW())
     ON CONFLICT (product_id) DO UPDATE
       SET title = EXCLUDED.title,
           category = EXCLUDED.category,
           image_url = EXCLUDED.image_url,
           updated_at = NOW()
     RETURNING product_id, title, category, image_url`,
    [productId, data.title, data.category, data.imageUrl],
  );
  return toProductOverride(result.rows[0]!);
}

export async function deleteProductOverride(productId: number): Promise<boolean> {
  const result = await query(
    `DELETE FROM products WHERE product_id = $1`,
    [productId],
  );
  return (result.rowCount ?? 0) > 0;
}
