import { json, type Env } from "./_utils";

export const onRequestPost: PagesFunction<Env> = async (context) => {
  const { DB } = context.env;

  await DB.prepare("DELETE FROM products").run();
  await DB.prepare("DELETE FROM stores").run();
  await DB.prepare("DELETE FROM scans").run();

  return json({ ok: true, cleared: true });
};
