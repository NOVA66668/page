import { json, type Env } from "./_utils";
import { getViralPayload } from "./viral-products";

export const onRequestGet: PagesFunction<Env> = async () => {
  const payload = getViralPayload();
  return json({
    success: true,
    products: payload.products.slice(0, 10)
  });
};