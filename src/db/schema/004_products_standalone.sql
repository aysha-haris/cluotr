-- Replace override-keyed products table with standalone product management

DROP TABLE IF EXISTS affiliate_links;
DROP TABLE IF EXISTS products;

CREATE TABLE products (
  id           SERIAL PRIMARY KEY,
  title        TEXT NOT NULL,
  category     TEXT NOT NULL,
  image_url    TEXT,
  price        NUMERIC(10,2) NOT NULL,
  affiliate_url TEXT,
  rating       NUMERIC(3,1),
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
