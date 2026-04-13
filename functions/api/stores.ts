import { json, type Env } from "./_utils";

async function ensureColumns(DB: D1Database): Promise<void> {
  const statements = [
    "ALTER TABLE stores ADD COLUMN recent_product_count INTEGER DEFAULT 0",
    "ALTER TABLE stores ADD COLUMN first_recent_product_at TEXT",
    "ALTER TABLE stores ADD COLUMN last_product_updated_at TEXT",
    "ALTER TABLE stores ADD COLUMN approximate_first_product_at TEXT",
    "ALTER TABLE stores ADD COLUMN discovery_method TEXT",
    "ALTER TABLE products ADD COLUMN remote_created_at TEXT",
    "ALTER TABLE products ADD COLUMN remote_published_at TEXT",
    "ALTER TABLE products ADD COLUMN remote_updated_at TEXT"
  ];
  for (const sql of statements) {
    try {
      await DB.prepare(sql).run();
    } catch {}
  }
}

export const onRequestGet: PagesFunction<Env> = async (context) => {
  const { DB } = context.env;
  await ensureColumns(DB);

  const stores = await DB.prepare(`
    SELECT domain, platform, country_guess, currency_guess, title, score, products_count, sold_out_count,
           last_scan_at, recent_product_count, first_recent_product_at, last_product_updated_at,
           approximate_first_product_at, discovery_method
    FROM stores
    ORDER BY
      CASE WHEN first_recent_product_at IS NULL THEN 1 ELSE 0 END,
      first_recent_product_at ASC,
      recent_product_count DESC,
      score DESC,
      last_scan_at DESC
    LIMIT 30
  `).all();

  const products = await DB.prepare(`
    SELECT store_domain, title, url, price, currency, availability,
           remote_created_at, remote_published_at, remote_updated_at
    FROM products
    ORDER BY store_domain ASC, remote_created_at ASC, remote_published_at ASC, remote_updated_at DESC
    LIMIT 300
  `).all();

  return json({
    stores: stores.results ?? [],
    products: products.results ?? []
  });
};
