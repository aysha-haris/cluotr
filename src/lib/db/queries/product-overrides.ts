import { query } from "@/lib/db";

export interface DbProduct {
  id: number;
  title: string;
  category: string;
  imageUrl: string | null;
  price: number;
  affiliateUrl: string | null;
  rating: number | null;
  createdAt: string;
}

interface DbProductRow {
  id: number;
  title: string;
  category: string;
  image_url: string | null;
  price: string;
  affiliate_url: string | null;
  rating: string | null;
  created_at: string;
}

function toDbProduct(row: DbProductRow): DbProduct {
  return {
    id: row.id,
    title: row.title,
    category: row.category,
    imageUrl: row.image_url,
    price: parseFloat(row.price),
    affiliateUrl: row.affiliate_url,
    rating: row.rating != null ? parseFloat(row.rating) : null,
    createdAt: row.created_at,
  };
}

export async function getAllProducts(): Promise<DbProduct[]> {
  try {
    const result = await query<DbProductRow>(
      `SELECT id, title, category, image_url, price, affiliate_url, rating, created_at
       FROM products ORDER BY created_at DESC`,
    );
    return result.rows.map(toDbProduct);
  } catch {
    return [];
  }
}

export async function createProduct(data: {
  title: string;
  category: string;
  imageUrl: string | null;
  price: number;
  affiliateUrl: string | null;
  rating: number | null;
}): Promise<DbProduct> {
  const result = await query<DbProductRow>(
    `INSERT INTO products (title, category, image_url, price, affiliate_url, rating)
     VALUES ($1, $2, $3, $4, $5, $6)
     RETURNING id, title, category, image_url, price, affiliate_url, rating, created_at`,
    [data.title, data.category, data.imageUrl, data.price, data.affiliateUrl, data.rating],
  );
  return toDbProduct(result.rows[0]!);
}

export async function updateProduct(
  id: number,
  data: {
    title: string;
    category: string;
    imageUrl: string | null;
    price: number;
    affiliateUrl: string | null;
    rating: number | null;
  },
): Promise<DbProduct | null> {
  const result = await query<DbProductRow>(
    `UPDATE products
     SET title=$1, category=$2, image_url=$3, price=$4, affiliate_url=$5, rating=$6
     WHERE id=$7
     RETURNING id, title, category, image_url, price, affiliate_url, rating, created_at`,
    [data.title, data.category, data.imageUrl, data.price, data.affiliateUrl, data.rating, id],
  );
  const row = result.rows[0];
  return row ? toDbProduct(row) : null;
}

export async function deleteProduct(id: number): Promise<boolean> {
  const result = await query(`DELETE FROM products WHERE id = $1`, [id]);
  return (result.rowCount ?? 0) > 0;
}
