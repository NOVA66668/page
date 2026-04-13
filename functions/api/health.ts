import { json, type Env } from "./_utils";

export const onRequestGet: PagesFunction<Env> = async (context) => {
  const { DB } = context.env;
  const latest = await DB.prepare(`
    SELECT id, started_at, finished_at, stores_found, products_found, status, note
    FROM scans ORDER BY id DESC LIMIT 5
  `).all();
  return json({ ok: true, scans: latest.results ?? [] });
};
