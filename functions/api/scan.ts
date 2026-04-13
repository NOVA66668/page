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

async function discoverCandidates(): Promise<string[]> {
  const seeds = [
    "allbirds.com",
    "gymshark.com",
    "colourpop.com",
    "khadijabeauty.ma",
    "myprotein.com",
    "fashionnova.com",
    "morphe.com",
    "uk.tentree.com"
  ];
  return seeds;
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
    const priceMatch = phtml.match(/(?:\$|€|£|MAD|AED|SAR|USD|EUR|GBP)\s?[0-9]+(?:[.,][0-9]{1,2})?/i);
    products.push({
      title: ptitle,
      url: link,
      price: priceMatch?.[0] ?? null,
      currency: currency_guess,
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

  const authHeader = context.request.headers.get("x-demo-key");
  const body = await context.request.json().catch(() => ({} as any));
  const domains = Array.isArray(body?.domains) ? body.domains.map((d: string) => normalizeDomain(d)).filter(Boolean) : [];
  const candidates = domains.length ? domains.slice(0, 15) : await discoverCandidates();

  const scanResult = await DB.prepare(
    "INSERT INTO scans (started_at, status, note) VALUES (?, 'running', ?)"
  ).bind(startedAt, domains.length ? "manual domains" : "seed scan").run();
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
    candidates,
    stores_found: storesFound,
    products_found: productsFound
  });
};
