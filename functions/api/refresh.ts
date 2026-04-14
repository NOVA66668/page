import { json, type Env } from "./_utils";
import { getViralPayload } from "./viral-products";

export const onRequestPost: PagesFunction<Env> = async () => {
  const payload = getViralPayload();
  return json({
    success: true,
    message: `Updated ${payload.products.length} products`,
    timestamp: new Date().toISOString(),
    count: payload.products.length
  });
};