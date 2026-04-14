type ProductCandidate = {
  keyword: string;
  source?: string;
  cost?: number | null;
  sell_price?: number | null;
  estimated_weight_kg?: number | null;
  competition_level?: number | null;
  problem_solving_score?: number | null;
  wow_score?: number | null;
  notes?: string;
};

type ProductAnalysis = {
  keyword: string;
  source: string;
  trend_score: number;
  trend_current: number;
  trend_peak: number;
  trend_growth_pct: number;
  margin_score: number;
  estimated_margin_pct: number;
  shipping_score: number;
  problem_solving_score: number;
  wow_score: number;
  competition_score: number;
  policy_score: number;
  final_score: number;
  recommended_action: string;
  reasons: string[];
  notes: string;
};

const WEIGHTS = {
  trend_score: 0.28,
  margin_score: 0.22,
  shipping_score: 0.12,
  problem_solving_score: 0.12,
  wow_score: 0.10,
  competition_score: 0.08,
  policy_score: 0.08,
};

const HIGH_RISK_KEYWORDS: Record<string, number> = {
  "supplement": 30, "medical": 35, "pain relief": 30, "fat burner": 35, "weight loss": 35,
  "cbd": 40, "thc": 40, "laser": 25, "pregnancy": 25, "posture corrector": 20,
  "hearing aid": 25, "teeth whitening": 20, "skincare treatment": 20, "skin tag": 35,
  "wart remover": 35, "blood sugar": 40, "detox": 35, "anti-aging": 18,
};
const MEDIUM_RISK_KEYWORDS: Record<string, number> = {
  "beauty": 10, "cosmetic": 10, "shapewear": 12, "fitness": 10, "pet calming": 12,
};
const HEAVY_KEYWORDS = new Set(["chair","table","desk","sofa","bed","mattress","bike","treadmill","stroller","cabinet","furniture","vacuum","mirror","lamp","suitcase"]);
const FRAGILE_KEYWORDS = new Set(["glass","ceramic","mirror","bottle","mug","vase","jar"]);
const GOOD_PROBLEM_SOLVING_HINTS = new Set(["clean","cleaner","remove","organizer","storage","holder","protector","repair","fix","pain","pet hair","hair remover","lint","odor","smell","stain","leak","mess","dust","wrinkle","clog","scratch","mosquito"]);
const WOW_HINTS = new Set(["before after","led","smart","portable","mini","foldable","magnetic","automatic","instant","rapid","turbo","360","self","wireless"]);

const SAMPLE_CANDIDATES: ProductCandidate[] = [
  { keyword: "pet hair remover roller", source: "seed", cost: 4.2, sell_price: 19.99, estimated_weight_kg: 0.18, competition_level: 5, problem_solving_score: 9, wow_score: 7, notes: "Before/after creative possible" },
  { keyword: "portable electric cleaning brush", source: "seed", cost: 8.5, sell_price: 29.99, estimated_weight_kg: 0.42, competition_level: 6, problem_solving_score: 8, wow_score: 8, notes: "Visual demo strong" },
  { keyword: "under seat car organizer", source: "seed", cost: 6.0, sell_price: 24.99, estimated_weight_kg: 0.35, competition_level: 5, problem_solving_score: 8, wow_score: 6, notes: "Useful problem-solving product" },
  { keyword: "teeth whitening pen", source: "seed", cost: 2.5, sell_price: 18.99, estimated_weight_kg: 0.05, competition_level: 8, problem_solving_score: 7, wow_score: 8, notes: "High policy risk example" },
  { keyword: "foldable laptop stand", source: "seed", cost: 7.0, sell_price: 27.99, estimated_weight_kg: 0.45, competition_level: 7, problem_solving_score: 8, wow_score: 5, notes: "Common but useful" },
  { keyword: "odor remover gel for car", source: "seed", cost: 3.0, sell_price: 16.99, estimated_weight_kg: 0.22, competition_level: 4, problem_solving_score: 8, wow_score: 6, notes: "Problem-solution angle" },
];

function normalize(value: number, min: number, max: number): number {
  if (max <= min) return 0;
  const v = Math.max(min, Math.min(max, value));
  return ((v - min) / (max - min)) * 100;
}
function low(text: string): string { return (text || "").trim().toLowerCase(); }
function detectPolicyRisk(keyword: string): number {
  const k = low(keyword);
  let risk = 0;
  for (const [p, s] of Object.entries(HIGH_RISK_KEYWORDS)) if (k.includes(p)) risk += s;
  for (const [p, s] of Object.entries(MEDIUM_RISK_KEYWORDS)) if (k.includes(p)) risk += s;
  return Math.min(100, risk);
}
function estimateShippingScore(keyword: string, weight?: number | null): number {
  const k = low(keyword); let penalty = 0;
  if (typeof weight === 'number') { if (weight <= 0.25) penalty += 0; else if (weight <= 0.75) penalty += 15; else if (weight <= 1.5) penalty += 35; else penalty += 60; }
  for (const x of HEAVY_KEYWORDS) if (k.includes(x)) penalty += 35;
  for (const x of FRAGILE_KEYWORDS) if (k.includes(x)) penalty += 20;
  return Math.max(0, 100 - Math.min(100, penalty));
}
function estimateProblemScore(keyword: string, provided?: number | null): number {
  if (typeof provided === 'number') return Math.max(0, Math.min(100, provided * 10));
  const k = low(keyword); let score = 35;
  for (const x of GOOD_PROBLEM_SOLVING_HINTS) if (k.includes(x)) score += 12;
  if (k.includes('for')) score += 6;
  return Math.min(100, score);
}
function estimateWowScore(keyword: string, provided?: number | null): number {
  if (typeof provided === 'number') return Math.max(0, Math.min(100, provided * 10));
  const k = low(keyword); let score = 25;
  for (const x of WOW_HINTS) if (k.includes(x)) score += 12;
  if (/\bmini\b|\bsmart\b|\bportable\b|\bwireless\b/.test(k)) score += 10;
  return Math.min(100, score);
}
function estimateCompetitionScore(level?: number | null, trendCurrent = 0): number {
  if (typeof level === 'number') { const l = Math.max(1, Math.min(10, level)); return Math.max(0, 100 - (l - 1) * 11); }
  if (trendCurrent >= 85) return 30; if (trendCurrent >= 65) return 45; if (trendCurrent >= 45) return 60; return 72;
}
function estimateMarginScore(cost?: number | null, sell?: number | null): { score: number; margin: number } {
  if (typeof cost !== 'number' || typeof sell !== 'number' || cost <= 0 || sell <= cost) return { score: 35, margin: 0 };
  const margin = ((sell - cost) / sell) * 100;
  return { score: normalize(margin, 20, 80), margin };
}
function estimateTrendFromKeyword(keyword: string): { current: number; peak: number; growth: number } {
  const k = low(keyword);
  let current = 28, peak = 42, growth = 8;
  if (/portable|wireless|smart|led|magnetic|pet|car|organizer|clean|remover|brush|holder|foldable/.test(k)) { current += 22; peak += 25; growth += 24; }
  if (/mini|instant|automatic|odor|hair|laptop|roller|seat/.test(k)) { current += 10; peak += 12; growth += 14; }
  if (/teeth whitening|anti-aging|medical|detox|cbd|thc/.test(k)) { current += 6; peak += 8; growth -= 6; }
  return { current: Math.min(100, current), peak: Math.min(100, peak), growth: Math.min(100, growth) };
}
function estimateTrendScore(current: number, peak: number, growthPct: number): number {
  const currentPart = normalize(current, 10, 100);
  const peakPart = normalize(peak, 20, 100);
  const growthPart = normalize(growthPct, -20, 100);
  return Math.min(100, currentPart * 0.45 + peakPart * 0.2 + growthPart * 0.35);
}
function recommend(finalScore: number, policyScore: number, trendScore: number): string {
  if (policyScore < 40) return 'REJECT';
  if (finalScore >= 75 && trendScore >= 55) return 'TEST NOW';
  if (finalScore >= 60) return 'WATCHLIST';
  return 'REJECT';
}
function buildReasons(keyword: string, trendScore: number, growth: number, marginPct: number, shippingScore: number, problem: number, wow: number, competition: number, policy: number): string[] {
  const reasons: string[] = [];
  if (trendScore >= 70) reasons.push('Strong trend signal'); else if (trendScore >= 55) reasons.push('Decent trend momentum');
  if (growth >= 20) reasons.push('Search interest is rising');
  if (marginPct >= 45) reasons.push('Healthy margin potential'); else if (marginPct >= 30) reasons.push('Acceptable margin');
  if (shippingScore >= 75) reasons.push('Easy shipping profile');
  if (problem >= 70) reasons.push('Solves a clear problem');
  if (wow >= 65) reasons.push('Good visual marketing potential');
  if (competition >= 65) reasons.push('Competition looks manageable');
  if (policy < 50) reasons.push('Policy risk is too high');
  if (!reasons.length) reasons.push('Needs manual validation');
  return reasons;
}
function analyze(candidate: ProductCandidate): ProductAnalysis {
  const t = estimateTrendFromKeyword(candidate.keyword);
  const trend_score = estimateTrendScore(t.current, t.peak, t.growth);
  const margin = estimateMarginScore(candidate.cost ?? null, candidate.sell_price ?? null);
  const shipping_score = estimateShippingScore(candidate.keyword, candidate.estimated_weight_kg ?? null);
  const problem_solving_score = estimateProblemScore(candidate.keyword, candidate.problem_solving_score ?? null);
  const wow_score = estimateWowScore(candidate.keyword, candidate.wow_score ?? null);
  const competition_score = estimateCompetitionScore(candidate.competition_level ?? null, t.current);
  const policy_score = Math.max(0, 100 - detectPolicyRisk(candidate.keyword));
  const final_score = trend_score * WEIGHTS.trend_score + margin.score * WEIGHTS.margin_score + shipping_score * WEIGHTS.shipping_score + problem_solving_score * WEIGHTS.problem_solving_score + wow_score * WEIGHTS.wow_score + competition_score * WEIGHTS.competition_score + policy_score * WEIGHTS.policy_score;
  return {
    keyword: candidate.keyword,
    source: candidate.source || 'manual',
    trend_score: Number(trend_score.toFixed(2)),
    trend_current: Number(t.current.toFixed(2)),
    trend_peak: Number(t.peak.toFixed(2)),
    trend_growth_pct: Number(t.growth.toFixed(2)),
    margin_score: Number(margin.score.toFixed(2)),
    estimated_margin_pct: Number(margin.margin.toFixed(2)),
    shipping_score: Number(shipping_score.toFixed(2)),
    problem_solving_score: Number(problem_solving_score.toFixed(2)),
    wow_score: Number(wow_score.toFixed(2)),
    competition_score: Number(competition_score.toFixed(2)),
    policy_score: Number(policy_score.toFixed(2)),
    final_score: Number(final_score.toFixed(2)),
    recommended_action: recommend(final_score, policy_score, trend_score),
    reasons: buildReasons(candidate.keyword, trend_score, t.growth, margin.margin, shipping_score, problem_solving_score, wow_score, competition_score, policy_score),
    notes: candidate.notes || '',
  };
}
function parseCsvLike(text: string): ProductCandidate[] {
  const lines = text.split(/\r?\n/).map(x => x.trim()).filter(Boolean);
  if (!lines.length) return [];
  const header = lines[0].toLowerCase();
  const hasHeader = header.includes('keyword');
  const rows = hasHeader ? lines.slice(1) : lines;
  const out: ProductCandidate[] = [];
  for (const row of rows) {
    const parts = row.split(',').map(x => x.trim());
    if (!parts[0]) continue;
    out.push({
      keyword: parts[0],
      source: parts[1] || 'manual',
      cost: parts[2] ? Number(parts[2]) : null,
      sell_price: parts[3] ? Number(parts[3]) : null,
      estimated_weight_kg: parts[4] ? Number(parts[4]) : null,
      competition_level: parts[5] ? Number(parts[5]) : null,
      problem_solving_score: parts[6] ? Number(parts[6]) : null,
      wow_score: parts[7] ? Number(parts[7]) : null,
      notes: parts.slice(8).join(', ') || '',
    });
  }
  return out;
}
function runRanking(candidates: ProductCandidate[]): ProductAnalysis[] {
  return candidates.map(analyze).sort((a,b) => b.final_score - a.final_score);
}
export const onRequestGet: PagesFunction = async () => Response.json({ success: true, country: 'US', candidates: SAMPLE_CANDIDATES, analyses: runRanking(SAMPLE_CANDIDATES) }, { headers: { 'cache-control': 'no-store' } });
export const onRequestPost: PagesFunction = async ({ request }) => {
  const body = await request.json().catch(() => ({}));
  let candidates: ProductCandidate[] = [];
  if (Array.isArray(body?.candidates)) candidates = body.candidates;
  else if (typeof body?.csv === 'string') candidates = parseCsvLike(body.csv);
  if (!candidates.length) candidates = SAMPLE_CANDIDATES;
  const analyses = runRanking(candidates);
  const summary = {
    test_now: analyses.filter(x => x.recommended_action === 'TEST NOW').length,
    watchlist: analyses.filter(x => x.recommended_action === 'WATCHLIST').length,
    reject: analyses.filter(x => x.recommended_action === 'REJECT').length,
  };
  return Response.json({ success: true, country: 'US', candidate_count: candidates.length, summary, analyses }, { headers: { 'cache-control': 'no-store' } });
};