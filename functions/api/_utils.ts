export interface Env {
  DB: D1Database;
}

export interface StoreRow {
  domain: string;
  platform: string | null;
  country_guess: string | null;
  currency_guess: string | null;
  title: string | null;
  score: number;
  products_count: number;
  sold_out_count: number;
  last_scan_at: string | null;
}

const SHOPIFY_HINTS = [
  "cdn.shopify.com",
  "shopify-payment-button",
  "myshopify.com",
  "shopify-section",
  "shopify.theme"
];

const WOOCOMMERCE_HINTS = [
  "woocommerce",
  "wc-cart-fragments",
  "wp-content/plugins/woocommerce"
];

const PLATFORM_OTHER_HINTS: Record<string, string[]> = {
  bigcommerce: ["cdn11.bigcommerce.com", "bigcommerce"],
  wix: ["wixstatic.com", "wix.com"],
  squarespace: ["static1.squarespace.com", "squarespace"],
  magento: ["Magento_Ui", "content=\"Magento"]
};

const COUNTRY_BY_TLD: Record<string, string> = {
  ".ma": "Morocco",
  ".fr": "France",
  ".de": "Germany",
  ".es": "Spain",
  ".it": "Italy",
  ".co.uk": "United Kingdom",
  ".uk": "United Kingdom",
  ".us": "United States",
  ".ca": "Canada",
  ".au": "Australia",
  ".ae": "United Arab Emirates",
  ".sa": "Saudi Arabia"
};

const CURRENCY_SIGNS: Record<string, string[]> = {
  USD: ["$", "usd", "us$"],
  EUR: ["€", "eur"],
  GBP: ["£", "gbp"],
  CAD: ["cad", "c$"],
  AUD: ["aud", "a$"],
  MAD: ["mad", "dh", "dhs", "dirham"],
  AED: ["aed"],
  SAR: ["sar"]
};

export function json(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data, null, 2), {
    status,
    headers: {
      "content-type": "application/json; charset=utf-8",
      "cache-control": "no-store"
    }
  });
}

export function normalizeDomain(value: string): string {
  return value.trim().toLowerCase()
    .replace(/^https?:\/\//, "")
    .split("/")[0]
    .split(":")[0]
    .replace(/^\*\./, "");
}

export function guessCountryFromDomain(domain: string): string | null {
  const d = domain.toLowerCase();
  const entries = Object.entries(COUNTRY_BY_TLD).sort((a, b) => b[0].length - a[0].length);
  for (const [suffix, country] of entries) {
    if (d.endsWith(suffix)) return country;
  }
  return null;
}

export function detectCurrency(text: string): string | null {
  const low = text.toLowerCase();
  let best: {code: string, count: number} | null = null;
  for (const [code, markers] of Object.entries(CURRENCY_SIGNS)) {
    let count = 0;
    for (const m of markers) {
      if (low.includes(m.toLowerCase())) count++;
    }
    if (count > 0 && (!best || count > best.count)) best = {code, count};
  }
  return best?.code ?? null;
}

export function detectPlatform(html: string): string {
  const low = html.toLowerCase();
  if (SHOPIFY_HINTS.some(h => low.includes(h.toLowerCase()))) return "shopify";
  if (WOOCOMMERCE_HINTS.some(h => low.includes(h.toLowerCase()))) return "woocommerce";
  for (const [platform, hints] of Object.entries(PLATFORM_OTHER_HINTS)) {
    if (hints.some(h => low.includes(h.toLowerCase()))) return platform;
  }
  return "unknown";
}

export function guessAvailability(html: string): "in_stock" | "sold_out" | "unknown" {
  const low = html.toLowerCase();
  const soldOutMarkers = ["sold out", "out of stock", "unavailable", "rupture de stock", "نفذ المخزون"];
  const inStockMarkers = ["in stock", "add to cart", "buy now", "ajouter au panier", "أضف إلى السلة"];
  if (soldOutMarkers.some(m => low.includes(m))) return "sold_out";
  if (inStockMarkers.some(m => low.includes(m))) return "in_stock";
  return "unknown";
}

export function extractTitle(html: string, fallback = "Untitled"): string {
  const m = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
  return m?.[1]?.replace(/\s+/g, " ").trim() || fallback;
}

export function scoreStore(input: {
  platform: string;
  country_guess: string | null;
  currency_guess: string | null;
  products_count: number;
  sold_out_count: number;
}): number {
  let score = 0;
  if (input.platform === "shopify") score += 20;
  else if (input.platform !== "unknown") score += 10;
  if (input.country_guess) score += 6;
  if (input.currency_guess) score += 4;
  score += Math.min(input.products_count, 30);
  score += Math.min(input.sold_out_count * 2, 20);
  score += Math.min(Math.floor(input.products_count / 2), 15);
  return score;
}

export async function fetchText(url: string): Promise<string | null> {
  try {
    const res = await fetch(url, {
      headers: {
        "user-agent": "Mozilla/5.0 (compatible; StoreHunterDemo/1.0)",
        "accept": "text/html,application/json;q=0.9,*/*;q=0.8"
      }
    });
    const ctype = res.headers.get("content-type") || "";
    if (!res.ok) return null;
    if (!ctype.includes("text/html") && !ctype.includes("application/json") && !ctype.includes("text/plain")) return null;
    return await res.text();
  } catch {
    return null;
  }
}

export function stripHtml(input: string): string {
  return input
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function extractProductLinks(baseUrl: string, html: string): string[] {
  const matches = [...html.matchAll(/href=["']([^"'#]+)["']/gi)];
  const out = new Set<string>();
  for (const m of matches) {
    const href = m[1];
    if (href.includes("/products/")) {
      try {
        out.add(new URL(href, baseUrl).toString());
      } catch {}
    }
    if (out.size >= 20) break;
  }
  return [...out];
}

export function uniqueBy<T>(items: T[], keyFn: (item: T) => string): T[] {
  const seen = new Set<string>();
  const out: T[] = [];
  for (const item of items) {
    const key = keyFn(item);
    if (!seen.has(key)) {
      seen.add(key);
      out.push(item);
    }
  }
  return out;
}
