import { Pool, type PoolClient, type QueryResult, type QueryResultRow } from "pg";

import { env } from "@/lib/env";

declare global {
  var pgPool: Pool | undefined;
}

function createPool(): Pool {
  return new Pool({
    connectionString: env.DATABASE_URL,
    max: 10,
    idleTimeoutMillis: 30_000,
    connectionTimeoutMillis: 5_000,
  });
}

export const pool: Pool = globalThis.pgPool ?? createPool();

if (env.NODE_ENV !== "production") {
  globalThis.pgPool = pool;
}

export async function getClient(): Promise<PoolClient> {
  return pool.connect();
}

export async function query<T extends QueryResultRow = QueryResultRow>(
  text: string,
  params?: unknown[],
): Promise<QueryResult<T>> {
  return pool.query<T>(text, params);
}

export async function queryOne<T extends QueryResultRow = QueryResultRow>(
  text: string,
  params?: unknown[],
): Promise<T | null> {
  const result = await query<T>(text, params);
  return result.rows[0] ?? null;
}

export async function withTransaction<T>(
  fn: (client: PoolClient) => Promise<T>,
): Promise<T> {
  const client = await getClient();

  try {
    await client.query("BEGIN");
    const result = await fn(client);
    await client.query("COMMIT");
    return result;
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}
