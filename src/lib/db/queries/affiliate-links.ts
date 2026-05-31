import { query } from "@/lib/db";
import type { AffiliateLink } from "@/types/catalog";

interface AffiliateLinkRow {
  product_id: number;
  url: string;
  price: number | null;
}

function toAffiliateLink(row: AffiliateLinkRow): AffiliateLink {
  return { productId: row.product_id, url: row.url, price: row.price };
}

export async function getAffiliateLinks(): Promise<AffiliateLink[]> {
  try {
    const result = await query<AffiliateLinkRow>(
      `SELECT product_id, url, price FROM affiliate_links ORDER BY product_id ASC`,
    );
    return result.rows.map(toAffiliateLink);
  } catch {
    return [];
  }
}

export async function getAffiliateLinkByProductId(
  productId: number,
): Promise<AffiliateLink | null> {
  try {
    const result = await query<AffiliateLinkRow>(
      `SELECT product_id, url, price FROM affiliate_links WHERE product_id = $1 LIMIT 1`,
      [productId],
    );
    const row = result.rows[0];
    return row ? toAffiliateLink(row) : null;
  } catch {
    return null;
  }
}

export async function upsertAffiliateLink(
  productId: number,
  data: { url: string; price: number | null },
): Promise<AffiliateLink> {
  const result = await query<AffiliateLinkRow>(
    `INSERT INTO affiliate_links (product_id, url, price, updated_at)
     VALUES ($1, $2, $3, NOW())
     ON CONFLICT (product_id) DO UPDATE
       SET url = EXCLUDED.url, price = EXCLUDED.price, updated_at = NOW()
     RETURNING product_id, url, price`,
    [productId, data.url, data.price],
  );
  return toAffiliateLink(result.rows[0]!);
}

export async function deleteAffiliateLink(productId: number): Promise<boolean> {
  const result = await query(
    `DELETE FROM affiliate_links WHERE product_id = $1`,
    [productId],
  );
  return (result.rowCount ?? 0) > 0;
}
