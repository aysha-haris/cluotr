import { query, queryOne } from "@/lib/db";
import type { Collection } from "@/types/collection";

const COLLECTION_COLUMNS = `
  id, title, slug, description, cover_image, created_at
`;

export async function getCollectionBySlug(slug: string): Promise<Collection | null> {
  return queryOne<Collection>(
    `SELECT ${COLLECTION_COLUMNS} FROM collections WHERE slug = $1 LIMIT 1`,
    [slug],
  );
}

export async function getAllCollections(): Promise<Collection[]> {
  const result = await query<Collection>(
    `SELECT ${COLLECTION_COLUMNS}
     FROM collections
     ORDER BY created_at DESC`,
  );

  return result.rows;
}
