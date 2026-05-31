-- Affiliate link and price overrides per product

CREATE TABLE IF NOT EXISTS affiliate_links (
  product_id INTEGER PRIMARY KEY,
  url TEXT NOT NULL DEFAULT '',
  price REAL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_affiliate_links_product_id ON affiliate_links (product_id);
