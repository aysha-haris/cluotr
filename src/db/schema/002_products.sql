-- Product metadata overrides keyed by static catalog product_id

CREATE TABLE IF NOT EXISTS products (
  product_id INTEGER PRIMARY KEY,
  title TEXT,
  category TEXT,
  image_url TEXT,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
