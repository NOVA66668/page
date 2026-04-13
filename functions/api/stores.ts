import { json, type Env } from "./_utils";

export const onRequestGet: PagesFunction<Env> = async (context) => {
  const { DB } = context.env;
  const stores = await DB.prepare(`
    SELECT domain, platform, country_guess, currency_guess, title, score, products_count, sold_out_count, last_scan_at
    FROM stores
    ORDER BY score DESC, last_scan_at DESC
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
