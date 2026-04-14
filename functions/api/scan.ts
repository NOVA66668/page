import {
  json,
  normalizeDomain,
  guessCountryFromDomain,
  detectCurrency,
  detectPlatform,
  extractTitle,
  fetchText,
  uniqueBy,
  scoreStore,
  type Env
} from "./_utils";

type CrtShRow = {
  common_name?: string;
  name_value?: string;
  entry_timestamp?: string;
  not_before?: string;
};

type ShopifyProduct = {
  title?: string;
  handle?: string;
  created_at?: string;
  published_at?: string | null;
  updated_at?: string;
  variants?: Array<{
    price?: string | number | null;
    available?: boolean;
  }>;
};

type ProductRow = {
  title: string;
  url: string;
  price: string | null;
  currency: string | null;
  availability: string;
  created_at: string | null;
  published_at: string | null;
  updated_at: string | null;
};

const FALLBACK_SEEDS = [
  "colourpop.com",
  "allbirds.com",
  "fashionnova.com",
  "morphe.com",
  "gymshark.com",
  "khadijabeauty.ma",
  "myprotein.com",
  "uk.tentree.com",
  "blendjet.com",
  "ridge.com",
  "alo-yoga.com",
  "bombas.com"
];

function toTimestamp(value?: string | null): number {
  if (!value) return 0;
  const ts = Date.parse(value);
  return Number.isFinite(ts) ? ts : 0;
}

function normalizeCrtDomain(value: string): string {
  return normalizeDomain(value.replace(/^\*\./, ""));
}

async function fetchRecentCertificateDomains(): Promise<string[]> {
  const queries = ["%.myshopify.com", "%.shop", "%.store", "%.boutique"];
  const cutoff = Date.now() - 45 * 24 * 60 * 60 * 1000;
  const found: Array<{ domain: string; ts: number }> = [];

  for (const query of queries) {
    const url = `https://crt.sh/?q=${encodeURIComponent(query)}&output=json`;
    const text = await fetchText(url);
    if (!text) continue;

    let rows: CrtShRow[] = [];
    try {
      rows = JSON.parse(text);
    } catch {
      continue;
    }

    for (const row of rows) {
      const ts = Math.max(toTimestamp(row.entry_timestamp), toTimestamp(row.not_before));
      if (!ts || ts < cutoff) continue;
      for (const source of [row.common_name, row.name_value]) {
        if (!source) continue;
        for (const raw of source.split(/\r?\n/)) {
          const domain = normalizeCrtDomain(raw);
          if (!domain || domain.includes("*")) continue;
          if (domain.endsWith(".local") || domain.endsWith(".invalid")) continue;
          found.push({ domain, ts });
        }
      }
    }
  }

  return uniqueBy(
    found.sort((a, b) => b.ts - a.ts).slice(0, 150),
    (item) => item.domain
  ).map((item) => item.domain);
}

async function fetchShopifyProducts(domain: string): Promise<ShopifyProduct[]> {
  const endpoints = [
    `https://${domain}/products.json?limit=250`,
    `https://${domain}/collections/all/products.json?limit=250`
  ];

  for (const endpoint of endpoints) {
    try {
      const response = await fetch(endpoint, {
        headers: {
          "accept": "application/json,text/plain;q=0.9,*/*;q=0.8",
          "user-agent": "Mozilla/5.0 (compatible; StoreHunterDemo/1.0)"
        },
        cache: "no-store"
      });
      if (!response.ok) continue;
      const data = await response.json();
      if (Array.isArray(data?.products)) return data.products;
    } catch {
      continue;
    }
  }

  return [];
}

function ensureIso(value?: string | null): string | null {
  if (!value) return null;
  const ts = Date.parse(value);
  if (!Number.isFinite(ts)) return null;
  return new Date(ts).toISOString();
}

function isRecent(value: string | null, days: number): boolean {
  if (!value) return false;
  const ts = Date.parse(value);
  if (!Number.isFinite(ts)) return false;
  return ts >= Date.now() - days * 24 * 60 * 60 * 1000;
}

function mapProducts(domain: string, rawProducts: ShopifyProduct[], currencyGuess: string | null): ProductRow[] {
  const out: ProductRow[] = [];
  for (const product of rawProducts) {
    const title = String(product.title || "Untitled product");
    const handle = String(product.handle || "").trim();
    if (!handle) continue;
    const variants = Array.isArray(product.variants) ? product.variants : [];
    const firstVariant = variants.find(Boolean);
    const anyAvailable = variants.some((v) => Boolean(v?.available));
    out.push({
      title,
      url: `https://${domain}/products/${handle}`,
      price: firstVariant?.price != null ? String(firstVariant.price) : null,
      currency: currencyGuess,
      availability: anyAvailable ? "in_stock" : "unknown",
      created_at: ensureIso(product.created_at),
      published_at: ensureIso(product.published_at || null),
      updated_at: ensureIso(product.updated_at)
    });
  }
  return out;
}

function classifyRecentProducts(products: ProductRow[], days: number) {
  const recentProducts = products.filter((p) =>
    isRecent(p.created_at, days) || isRecent(p.published_at, days) || isRecent(p.updated_at, days)
  );

  const firstRecentProductAt = recentProducts
    .flatMap((p) => [p.created_at, p.published_at, p.updated_at].filter(Boolean) as string[])
    .sort()[0] || null;

  const lastProductUpdatedAt = recentProducts
    .map((p) => p.updated_at)
    .filter(Boolean)
    .sort()
    .reverse()[0] || null;

  const approximateFirstProductAt = products
    .flatMap((p) => [p.created_at, p.published_at].filter(Boolean) as string[])
    .sort()[0] || null;

  return {
    recentProducts,
    firstRecentProductAt,
    lastProductUpdatedAt,
    approximateFirstProductAt
  };
}

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

async function runCandidateBatch(params: {
  DB: D1Database;
  candidates: string[];
  days: number;
  startedAt: string;
  discoveryMethod: string;
  diagnostics: Record<string, number>;
}) {
  const { DB, candidates, days, startedAt, discoveryMethod, diagnostics } = params;
  let storesFound = 0;
  let productsFound = 0;

  for (const domain of candidates.slice(0, 50)) {
    diagnostics.inspected += 1;
    const homepage = await fetchText(`https://${domain}/`);
    if (!homepage) {
      diagnostics.homepage_failed += 1;
      continue;
    }

    const platform = detectPlatform(homepage);
    if (platform !== "shopify") {
      diagnostics.not_shopify += 1;
      continue;
    }
    diagnostics.shopify_detected += 1;

    const title = extractTitle(homepage, domain);
    const countryGuess = guessCountryFromDomain(domain);
    const currencyGuess = detectCurrency(homepage);
    const rawProducts = await fetchShopifyProducts(domain);
    if (!rawProducts.length) {
      diagnostics.feed_missing += 1;
      continue;
    }
    diagnostics.feed_ok += 1;

    const allProducts = mapProducts(domain, rawProducts, currencyGuess);
    const { recentProducts, firstRecentProductAt, lastProductUpdatedAt, approximateFirstProductAt } = classifyRecentProducts(allProducts, days);
    if (!recentProducts.length) {
      diagnostics.no_recent_products += 1;
      continue;
    }
    diagnostics.recent_matches += 1;

    const score = scoreStore({
      platform,
      country_guess: countryGuess,
      currency_guess: currencyGuess,
      products_count: recentProducts.length,
      sold_out_count: 0
    });

    storesFound += 1;
    productsFound += recentProducts.length;

    await DB.prepare(`
      INSERT INTO stores (
        domain, platform, country_guess, currency_guess, title, score, products_count, sold_out_count,
        last_scan_at, recent_product_count, first_recent_product_at, last_product_updated_at,
        approximate_first_product_at, discovery_method
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      ON CONFLICT(domain) DO UPDATE SET
        platform=excluded.platform,
        country_guess=excluded.country_guess,
        currency_guess=excluded.currency_guess,
        title=excluded.title,
        score=excluded.score,
        products_count=excluded.products_count,
        sold_out_count=excluded.sold_out_count,
        last_scan_at=excluded.last_scan_at,
        recent_product_count=excluded.recent_product_count,
        first_recent_product_at=excluded.first_recent_product_at,
        last_product_updated_at=excluded.last_product_updated_at,
        approximate_first_product_at=excluded.approximate_first_product_at,
        discovery_method=excluded.discovery_method
    `).bind(
      domain,
      platform,
      countryGuess,
      currencyGuess,
      title,
      score,
      allProducts.length,
      0,
      startedAt,
      recentProducts.length,
      firstRecentProductAt,
      lastProductUpdatedAt,
      approximateFirstProductAt,
      discoveryMethod
    ).run();

    await DB.prepare("DELETE FROM products WHERE store_domain = ?").bind(domain).run();
    for (const p of recentProducts.slice(0, 60)) {
      await DB.prepare(`
        INSERT INTO products (
          store_domain, title, url, price, currency, availability,
          remote_created_at, remote_published_at, remote_updated_at
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).bind(
        domain,
        p.title,
        p.url,
        p.price,
        p.currency,
        p.availability,
        p.created_at,
        p.published_at,
        p.updated_at
      ).run();
    }
  }

  return { storesFound, productsFound };
}

export const onRequestPost: PagesFunction<Env> = async (context) => {
  const startedAt = new Date().toISOString();
  const { DB } = context.env;
  await ensureColumns(DB);

  const body = await context.request.json().catch(() => ({} as any));
  const days = [7, 15, 30, 365].includes(Number(body?.days)) ? Number(body.days) : 30;
  const manualDomains = Array.isArray(body?.domains)
    ? body.domains.map((d: string) => normalizeDomain(d)).filter(Boolean)
    : [];

  const primaryCandidates = manualDomains.length ? manualDomains.slice(0, 50) : await fetchRecentCertificateDomains();

  const scanResult = await DB.prepare(
    "INSERT INTO scans (started_at, status, note) VALUES (?, 'running', ?)"
  ).bind(startedAt, manualDomains.length ? `manual domains (${manualDomains.length})` : `shopify recent products <= ${days} days`).run();
  const scanId = scanResult.meta.last_row_id;

  const diagnostics: Record<string, number> = {
    inspected: 0,
    homepage_failed: 0,
    not_shopify: 0,
    shopify_detected: 0,
    feed_missing: 0,
    feed_ok: 0,
    no_recent_products: 0,
    recent_matches: 0,
    fallback_used: 0
  };

  let totalStoresFound = 0;
  let totalProductsFound = 0;

  const primary = await runCandidateBatch({
    DB,
    candidates: primaryCandidates,
    days,
    startedAt,
    discoveryMethod: manualDomains.length ? "manual" : "crt.sh -> shopify products.json",
    diagnostics
  });

  totalStoresFound += primary.storesFound;
  totalProductsFound += primary.productsFound;

  if (!manualDomains.length && totalStoresFound === 0) {
    diagnostics.fallback_used = 1;
    const fallback = await runCandidateBatch({
      DB,
      candidates: FALLBACK_SEEDS,
      days,
      startedAt,
      discoveryMethod: "fallback seeds -> shopify products.json",
      diagnostics
    });
    totalStoresFound += fallback.storesFound;
    totalProductsFound += fallback.productsFound;
  }

  await DB.prepare(
    "UPDATE scans SET finished_at = ?, stores_found = ?, products_found = ?, status = 'completed' WHERE id = ?"
  ).bind(new Date().toISOString(), totalStoresFound, totalProductsFound, scanId).run();

  return json({
    ok: true,
    scan_id: scanId,
    scan_mode: manualDomains.length ? "manual_domains" : "shopify_recent_products",
    days,
    primary_candidates: primaryCandidates,
    stores_found: totalStoresFound,
    products_found: totalProductsFound,
    diagnostics,
    hint: totalStoresFound === 0
      ? "No matching Shopify stores were found in this window. Check diagnostics: not_shopify, feed_missing, and no_recent_products."
      : "Scan completed with matching stores."
  });
};
