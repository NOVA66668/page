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

type DomainAgeInfo = {
  registeredAt: string | null;
  ageDays: number | null;
};

type FirstSeenInfo = {
  timestamp: string | null;
  source: "commoncrawl" | null;
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

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function parseRegisteredAt(rdap: any): string | null {
  const events = Array.isArray(rdap?.events) ? rdap.events : [];
  const preferred = events.find((event: any) => {
    const action = String(event?.eventAction || "").toLowerCase();
    return action === "registration" || action === "registered";
  });
  if (preferred?.eventDate && Number.isFinite(Date.parse(preferred.eventDate))) {
    return new Date(preferred.eventDate).toISOString();
  }

  const fallback = events.find((event: any) => {
    const action = String(event?.eventAction || "").toLowerCase();
    return action.includes("registration") || action.includes("create");
  });
  if (fallback?.eventDate && Number.isFinite(Date.parse(fallback.eventDate))) {
    return new Date(fallback.eventDate).toISOString();
  }
  return null;
}

async function fetchDomainAgeInfo(domain: string): Promise<DomainAgeInfo> {
  const url = `https://rdap.org/domain/${encodeURIComponent(domain)}`;
  try {
    const response = await fetch(url, {
      headers: {
        "accept": "application/rdap+json, application/json;q=0.9, */*;q=0.8",
        "user-agent": "Mozilla/5.0 (compatible; StoreHunterDemo/1.0)"
      },
      cache: "no-store"
    });
    if (!response.ok) return { registeredAt: null, ageDays: null };
    const rdap = await response.json();
    const registeredAt = parseRegisteredAt(rdap);
    if (!registeredAt) return { registeredAt: null, ageDays: null };
    const ageDays = Math.floor((Date.now() - Date.parse(registeredAt)) / 86400000);
    return {
      registeredAt,
      ageDays: Number.isFinite(ageDays) && ageDays >= 0 ? ageDays : null
    };
  } catch {
    return { registeredAt: null, ageDays: null };
  }
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

async function fetchCommonCrawlCollections(): Promise<string[]> {
  try {
    const response = await fetch("https://index.commoncrawl.org/collinfo.json", {
      headers: { "accept": "application/json", "user-agent": "Mozilla/5.0 (compatible; StoreHunterDemo/1.0)" }
    });
    if (!response.ok) return [];
    const items = await response.json();
    if (!Array.isArray(items)) return [];
    return items
      .map((item: any) => String(item?.id || ""))
      .filter(Boolean)
      .sort();
  } catch {
    return [];
  }
}

function ccTimestampToIso(value: string): string | null {
  if (!/^\d{14}$/.test(value)) return null;
  const iso = `${value.slice(0,4)}-${value.slice(4,6)}-${value.slice(6,8)}T${value.slice(8,10)}:${value.slice(10,12)}:${value.slice(12,14)}Z`;
  return Number.isFinite(Date.parse(iso)) ? iso : null;
}

async function fetchFirstSeenInCommonCrawl(urls: string[]): Promise<FirstSeenInfo> {
  const collections = await fetchCommonCrawlCollections();
  if (!collections.length || !urls.length) return { timestamp: null, source: null };

  let best: string | null = null;
  const uniqueUrls = Array.from(new Set(urls.filter(Boolean)));

  for (const coll of collections) {
    for (const url of uniqueUrls.slice(0, 8)) {
      const endpoint = `https://index.commoncrawl.org/${coll}-index?url=${encodeURIComponent(url)}&output=json&fl=timestamp,url&filter=status:200&pageSize=1`;
      try {
        const response = await fetch(endpoint, {
          headers: { "accept": "application/json,text/plain;q=0.9,*/*;q=0.8", "user-agent": "Mozilla/5.0 (compatible; StoreHunterDemo/1.0)" },
          cache: "no-store"
        });
        if (!response.ok) continue;
        const text = await response.text();
        const firstLine = text.trim().split(/\r?\n/).find(Boolean);
        if (!firstLine) continue;
        const row = JSON.parse(firstLine);
        const iso = ccTimestampToIso(String(row?.timestamp || ""));
        if (iso && (!best || iso < best)) {
          best = iso;
        }
      } catch {
        continue;
      }
      await sleep(120);
    }
    if (best) break;
  }

  return { timestamp: best, source: best ? "commoncrawl" : null };
}

async function discoverCandidates(maxAgeDays: number): Promise<string[]> {
  const queries = [
    "%.myshopify.com",
    "%.shop",
    "%.store",
    "%.boutique"
  ];

  const recent = (await Promise.all(queries.map((query) => fetchRecentCertificateDomains(Math.max(maxAgeDays, 30), query))))
    .flat()
    .sort((a, b) => b.ts - a.ts);

  const uniqueRecent = uniqueBy(recent, (item) => item.domain).slice(0, 60);
  const accepted: string[] = [];

  for (const item of uniqueRecent) {
    const age = await fetchDomainAgeInfo(item.domain);
    if (age.ageDays !== null && age.ageDays <= maxAgeDays) {
      accepted.push(item.domain);
    }
    if (accepted.length >= 20) break;
    await sleep(180);
  }

  return accepted.length ? accepted : FALLBACK_SEEDS;
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
  domain_registered_at: string | null;
  domain_age_days: number | null;
  first_store_seen_at: string | null;
  first_product_seen_at: string | null;
  age_confidence: number;
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

  const domainAge = await fetchDomainAgeInfo(domain);
  const firstStoreSeen = await fetchFirstSeenInCommonCrawl([url]);
  const firstProductSeen = await fetchFirstSeenInCommonCrawl(uniqueProducts.map((p) => p.url));

  let ageConfidence = 0;
  if (firstProductSeen.timestamp) ageConfidence += 0.6;
  if (firstStoreSeen.timestamp) ageConfidence += 0.25;
  if (domainAge.registeredAt) ageConfidence += 0.15;

  return {
    domain: normalizeDomain(domain),
    platform,
    title,
    country_guess,
    currency_guess,
    products: uniqueProducts,
    sold_out_count,
    score,
    domain_registered_at: domainAge.registeredAt,
    domain_age_days: domainAge.ageDays,
    first_store_seen_at: firstStoreSeen.timestamp,
    first_product_seen_at: firstProductSeen.timestamp,
    age_confidence: Number(ageConfidence.toFixed(2))
  };
}

async function ensureAgeColumns(DB: D1Database): Promise<void> {
  const statements = [
    "ALTER TABLE stores ADD COLUMN domain_registered_at TEXT",
    "ALTER TABLE stores ADD COLUMN domain_age_days INTEGER",
    "ALTER TABLE stores ADD COLUMN first_store_seen_at TEXT",
    "ALTER TABLE stores ADD COLUMN first_product_seen_at TEXT",
    "ALTER TABLE stores ADD COLUMN age_confidence REAL DEFAULT 0"
  ];
  for (const sql of statements) {
    try {
      await DB.prepare(sql).run();
    } catch {}
  }
}

export const onRequestPost: PagesFunction<Env> = async (context) => {
  const startedAt = new Date().toISOString();
  const { DB } = context.env;
  await ensureAgeColumns(DB);

  const body = await context.request.json().catch(() => ({} as any));
  const days = [7, 15, 30, 365].includes(Number(body?.days)) ? Number(body.days) : 30;
  const domains = Array.isArray(body?.domains) ? body.domains.map((d: string) => normalizeDomain(d)).filter(Boolean) : [];
  const candidates = domains.length ? domains.slice(0, 15) : await discoverCandidates(days);

  const scanResult = await DB.prepare(
    "INSERT INTO scans (started_at, status, note) VALUES (?, 'running', ?)"
  ).bind(startedAt, domains.length ? `manual domains (${domains.length})` : `domain age <= ${days} days + first product seen`).run();
  const scanId = scanResult.meta.last_row_id;

  let storesFound = 0;
  let productsFound = 0;

  for (const domain of candidates) {
    const result = await scanStore(domain);
    if (!result) continue;

    storesFound += 1;
    productsFound += result.products.length;

    await DB.prepare(`
      INSERT INTO stores (
        domain, platform, country_guess, currency_guess, title, score, products_count, sold_out_count,
        last_scan_at, domain_registered_at, domain_age_days, first_store_seen_at, first_product_seen_at, age_confidence
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
        domain_registered_at=excluded.domain_registered_at,
        domain_age_days=excluded.domain_age_days,
        first_store_seen_at=excluded.first_store_seen_at,
        first_product_seen_at=excluded.first_product_seen_at,
        age_confidence=excluded.age_confidence
    `).bind(
      result.domain,
      result.platform,
      result.country_guess,
      result.currency_guess,
      result.title,
      result.score,
      result.products.length,
      result.sold_out_count,
      startedAt,
      result.domain_registered_at,
      result.domain_age_days,
      result.first_store_seen_at,
      result.first_product_seen_at,
      result.age_confidence
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
    scan_mode: domains.length ? "manual_domains" : "domain_age_plus_first_product_seen",
    days,
    candidates,
    stores_found: storesFound,
    products_found: productsFound
  });
};
