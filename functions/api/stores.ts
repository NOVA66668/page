import { json, type Env } from "./_utils";

async function ensureAgeColumns(DB: D1Database): Promise<void> {
  const statements = [
    "ALTER TABLE stores ADD COLUMN domain_registered_at TEXT",
    "ALTER TABLE stores ADD COLUMN domain_age_days INTEGER",
    "ALTER TABLE stores ADD COLUMN first_store_seen_at TEXT",
    "ALTER TABLE stores ADD COLUMN first_product_seen_at TEXT",
    "ALTER TABLE stores ADD COLUMN age_confidence REAL DEFAULT 0"
  ];
  for (const sql of statements) {
    try {
      await DB.prepare(sql).run();
    } catch {}
  }
}

export const onRequestGet: PagesFunction<Env> = async (context) => {
  const { DB } = context.env;
  await ensureAgeColumns(DB);

  const stores = await DB.prepare(`
    SELECT domain, platform, country_guess, currency_guess, title, score, products_count, sold_out_count,
           last_scan_at, domain_registered_at, domain_age_days, first_store_seen_at, first_product_seen_at, age_confidence
    FROM stores
    ORDER BY
      CASE WHEN first_product_seen_at IS NULL THEN 1 ELSE 0 END,
      first_product_seen_at ASC,
      score DESC,
      last_scan_at DESC
    LIMIT 30
  `).all();

  const products = await DB.prepare(`
    SELECT store_domain, title, url, price, currency, availability
    FROM products
    ORDER BY id DESC
    LIMIT 300
  `).all();

  return json({
    stores: stores.results ?? [],
    products: products.results ?? []
  });
};
