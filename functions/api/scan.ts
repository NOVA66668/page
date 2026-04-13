import {
  json,
  normalizeDomain,
  guessCountryFromDomain,
  detectCurrency,
  detectPlatform,
  guessAvailability,
  extractTitle,
  fetchText,
  stripHtml,
  extractProductLinks,
  scoreStore,
  uniqueBy,
  type Env
} from "./_utils";

type Product = {
  title: string;
  url: string;
  price: string | null;
  currency: string | null;
  availability: string;
};

type CrtShRow = {
  common_name?: string;
  name_value?: string;
  entry_timestamp?: string;
  not_before?: string;
};

const FALLBACK_SEEDS = [
  "allbirds.com",
  "gymshark.com",
  "colourpop.com",
  "khadijabeauty.ma",
  "myprotein.com",
  "fashionnova.com",
  "morphe.com",
  "uk.tentree.com"
];

function normalizeCrtDomain(value: string): string {
  return normalizeDomain(value.replace(/^\*\./, ""));
}

function toTimestamp(value?: string): number {
  if (!value) return 0;
  const ts = Date.parse(value);
  return Number.isFinite(ts) ? ts : 0;
}

async function fetchRecentCertificateDomains(days: number, query: string): Promise<Array<{ domain: string; ts: number }>> {
  const url = `https://crt.sh/?q=${encodeURIComponent(query)}&output=json`;
  const text = await fetchText(url);
  if (!text) return [];

  let rows: CrtShRow[] = [];
  try {
    rows = JSON.parse(text);
  } catch {
    return [];
  }

  const cutoff = Date.now() - days * 24 * 60 * 60 * 1000;
  const out: Array<{ domain: string; ts: number }> = [];

  for (const row of rows) {
    const ts = Math.max(toTimestamp(row.entry_timestamp), toTimestamp(row.not_before));
    if (!ts || ts < cutoff) continue;

    for (const source of [row.common_name, row.name_value]) {
      if (!source) continue;
      for (const raw of source.split(/\r?\n/)) {
        const domain = normalizeCrtDomain(raw);
        if (!domain || domain.includes("*")) continue;
        if (domain.endsWith(".local") || domain.endsWith(".invalid")) continue;
        out.push({ domain, ts });
      }
    }
  }

  return out;
}

async function discoverCandidates(days: number): Promise<string[]> {
  const queries = [
    "%.myshopify.com",
    "%.shop",
    "%.store",
    "%.boutique"
  ];

  const recent = (await Promise.all(queries.map((query) => fetchRecentCertificateDomains(days, query))))
    .flat()
    .sort((a, b) => b.ts - a.ts);

  const unique = uniqueBy(recent, (item) => item.domain)
    .map((item) => item.domain)
    .filter(Boolean)
    .slice(0, 30);

  return unique.length ? unique : FALLBACK_SEEDS;
}

async function scanStore(domain: string): Promise<{
  domain: string;
  platform: string;
  title: string;
  country_guess: string | null;
  currency_guess: string | null;
  products: Product[];
  sold_out_count: number;
  score: number;
} | null> {
  const url = `https://${normalizeDomain(domain)}/`;
  const html = await fetchText(url);
  if (!html) return null;

  const platform = detectPlatform(html);
  const title = extractTitle(html, domain);
  const text = stripHtml(html).slice(0, 100000);
  const country_guess = guessCountryFromDomain(domain);
  const currency_guess = detectCurrency(text);

  const productLinks = extractProductLinks(url, html);
  const products: Product[] = [];

  for (const link of productLinks.slice(0, 12)) {
    const phtml = await fetchText(link);
    if (!phtml) continue;
    const ptitle = extractTitle(phtml, link.split("/").pop() || "Product");
    const availability = guessAvailability(phtml);
    const productText = stripHtml(phtml).slice(0, 30000);
    const productCurrency = detectCurrency(productText) || currency_guess;
    const priceMatch = phtml.match(/(?:\$|€|£|MAD|AED|SAR|USD|EUR|GBP)\s?[0-9]+(?:[.,][0-9]{1,2})?/i);
    products.push({
      title: ptitle,
      url: link,
      price: priceMatch?.[0] ?? null,
      currency: productCurrency,
      availability
    });
  }

  const uniqueProducts = uniqueBy(products, p => `${p.title}|${p.url}`);
  const sold_out_count = uniqueProducts.filter(p => p.availability === "sold_out").length;
  const score = scoreStore({
    platform,
    country_guess,
    currency_guess,
    products_count: uniqueProducts.length,
    sold_out_count
  });

  return {
    domain: normalizeDomain(domain),
    platform,
    title,
    country_guess,
    currency_guess,
    products: uniqueProducts,
    sold_out_count,
    score
  };
}

export const onRequestPost: PagesFunction<Env> = async (context) => {
  const startedAt = new Date().toISOString();
  const { DB } = context.env;

  const body = await context.request.json().catch(() => ({} as any));
  const days = [7, 15, 30, 365].includes(Number(body?.days)) ? Number(body.days) : 30;
  const domains = Array.isArray(body?.domains) ? body.domains.map((d: string) => normalizeDomain(d)).filter(Boolean) : [];
  const candidates = domains.length ? domains.slice(0, 15) : await discoverCandidates(days);

  const scanResult = await DB.prepare(
    "INSERT INTO scans (started_at, status, note) VALUES (?, 'running', ?)"
  ).bind(startedAt, domains.length ? `manual domains (${domains.length})` : `certificate window ${days} days`).run();
  const scanId = scanResult.meta.last_row_id;

  let storesFound = 0;
  let productsFound = 0;

  for (const domain of candidates) {
    const result = await scanStore(domain);
    if (!result) continue;

    storesFound += 1;
    productsFound += result.products.length;

    await DB.prepare(`
      INSERT INTO stores (domain, platform, country_guess, currency_guess, title, score, products_count, sold_out_count, last_scan_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      ON CONFLICT(domain) DO UPDATE SET
        platform=excluded.platform,
        country_guess=excluded.country_guess,
        currency_guess=excluded.currency_guess,
        title=excluded.title,
        score=excluded.score,
        products_count=excluded.products_count,
        sold_out_count=excluded.sold_out_count,
        last_scan_at=excluded.last_scan_at
    `).bind(
      result.domain,
      result.platform,
      result.country_guess,
      result.currency_guess,
      result.title,
      result.score,
      result.products.length,
      result.sold_out_count,
      startedAt
    ).run();

    await DB.prepare("DELETE FROM products WHERE store_domain = ?").bind(result.domain).run();
    for (const p of result.products) {
      await DB.prepare(`
        INSERT INTO products (store_domain, title, url, price, currency, availability)
        VALUES (?, ?, ?, ?, ?, ?)
      `).bind(result.domain, p.title, p.url, p.price, p.currency, p.availability).run();
    }
  }

  await DB.prepare(
    "UPDATE scans SET finished_at = ?, stores_found = ?, products_found = ?, status = 'completed' WHERE id = ?"
  ).bind(new Date().toISOString(), storesFound, productsFound, scanId).run();

  return json({
    ok: true,
    scan_id: scanId,
    scan_mode: domains.length ? "manual_domains" : "certificate_window",
    days,
    candidates,
    stores_found: storesFound,
    products_found: productsFound
  });
};
