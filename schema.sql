CREATE TABLE IF NOT EXISTS stores (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  domain TEXT NOT NULL UNIQUE,
  platform TEXT,
  country_guess TEXT,
  currency_guess TEXT,
  title TEXT,
  score REAL DEFAULT 0,
  products_count INTEGER DEFAULT 0,
  sold_out_count INTEGER DEFAULT 0,
  last_scan_at TEXT,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS products (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  store_domain TEXT NOT NULL,
  title TEXT NOT NULL,
  url TEXT,
  price TEXT,
  currency TEXT,
  availability TEXT,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS scans (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  started_at TEXT DEFAULT CURRENT_TIMESTAMP,
  finished_at TEXT,
  stores_found INTEGER DEFAULT 0,
  products_found INTEGER DEFAULT 0,
  status TEXT DEFAULT 'running',
  note TEXT
);

CREATE INDEX IF NOT EXISTS idx_products_store_domain ON products(store_domain);
CREATE INDEX IF NOT EXISTS idx_stores_score ON stores(score DESC);
