import { json, type Env } from "./_utils";

export const onRequestGet: PagesFunction<Env> = async (context) => {
  const { DB } = context.env;

  const scans = await DB.prepare(`
    SELECT id, started_at, finished_at, stores_found, products_found, status, note
    FROM scans
    ORDER BY id DESC
    LIMIT 20
  `).all();

  return json({
    scans: scans.results ?? []
  });
};
