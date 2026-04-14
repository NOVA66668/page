import { json, type Env } from "./_utils";

type ViralSignal = {
  source: string;
  metric: string;
  value: number;
  growth_rate: number;
  confidence: number;
};

type ViralProduct = {
  id: string;
  name: string;
  category: string;
  price: number;
  cost: number;
  profit_margin: number;
  sales_3days: { day1: number; day2: number; day3: number; total: number };
  viral_score: number;
  growth_velocity: number;
  momentum_score: number;
  competitor_count: number;
  supplier_links: Record<string, string>;
  forecast: {
    days_to_peak: number;
    peak_daily_sales: number;
    saturated_in_days: number;
    recommendation: string;
  };
  hot_until: string;
};

const PRODUCT_DETAILS: Record<string, {category: string; price: number; cost: number; margin: number; suppliers: Record<string, string>}> = {
  "Magnetic Gym Water Bottle Holder": {
    category: "Fitness", price: 24.99, cost: 4.5, margin: 82.0,
    suppliers: {
      aliexpress: "https://www.aliexpress.com/wholesale?SearchText=magnetic+gym+bottle+holder",
      alibaba: "https://www.alibaba.com/trade/search?SearchText=magnetic+water+bottle+bag"
    }
  },
  "Sleepy Girl Mocktail Kit": {
    category: "Health & Wellness", price: 34.99, cost: 7.2, margin: 79.4,
    suppliers: {
      alibaba: "https://www.alibaba.com/trade/search?SearchText=mocktail+glass+set",
      aliexpress: "https://www.aliexpress.com/wholesale?SearchText=herbal+tea+sleep+blend"
    }
  },
  "Smart Plant Watering Sensor": {
    category: "Smart Home", price: 22.99, cost: 4.2, margin: 81.7,
    suppliers: {
      aliexpress: "https://www.aliexpress.com/wholesale?SearchText=smart+plant+watering+sensor",
      alibaba: "https://www.alibaba.com/trade/search?SearchText=wifi+plant+moisture+sensor"
    }
  },
  "Facial Ice Bath Bowl": {
    category: "Beauty", price: 29.99, cost: 5.8, margin: 80.7,
    suppliers: {
      aliexpress: "https://www.aliexpress.com/wholesale?SearchText=face+ice+bath+bowl",
      alibaba: "https://www.alibaba.com/trade/search?SearchText=facial+ice+bowl"
    }
  },
  "3D Printed Desk Organizer": {
    category: "Office", price: 19.99, cost: 3.8, margin: 81.0,
    suppliers: {
      thingiverse: "https://www.thingiverse.com/search?q=desk+organizer",
      cults3d: "https://cults3d.com/en/search?q=desk+organizer"
    }
  },
  "Silicone Makeup Brush Cleaner": {
    category: "Beauty Tools", price: 16.99, cost: 2.8, margin: 83.5,
    suppliers: {
      aliexpress: "https://www.aliexpress.com/wholesale?SearchText=silicone+makeup+brush+cleaner",
      alibaba: "https://www.alibaba.com/trade/search?SearchText=silicone+brush+cleaning+mat"
    }
  },
  "Portable Cold Brew Maker": {
    category: "Kitchen", price: 39.99, cost: 9.5, margin: 76.2,
    suppliers: {
      aliexpress: "https://www.aliexpress.com/wholesale?SearchText=portable+cold+brew+coffee",
      alibaba: "https://www.alibaba.com/trade/search?SearchText=portable+coffee+brewer"
    }
  }
};

function baseSignals(): Record<string, ViralSignal[]> {
  return {
    "Magnetic Gym Water Bottle Holder": [
      { source: "tiktok", metric: "views", value: 1800000, growth_rate: 890, confidence: 0.85 },
      { source: "aliexpress", metric: "orders_3d", value: 3450, growth_rate: 234, confidence: 0.86 },
      { source: "instagram", metric: "saves", value: 450000, growth_rate: 567, confidence: 0.8 }
    ],
    "Sleepy Girl Mocktail Kit": [
      { source: "tiktok", metric: "views", value: 3400000, growth_rate: 2340, confidence: 0.85 },
      { source: "google", metric: "search_volume", value: 15600, growth_rate: 890, confidence: 0.75 }
    ],
    "Smart Plant Watering Sensor": [
      { source: "google", metric: "search_volume", value: 8900, growth_rate: 234, confidence: 0.75 },
      { source: "aliexpress", metric: "orders_3d", value: 2890, growth_rate: 189, confidence: 0.85 }
    ],
    "Facial Ice Bath Bowl": [
      { source: "tiktok", metric: "views", value: 1560000, growth_rate: 789, confidence: 0.85 },
      { source: "google", metric: "search_volume", value: 23400, growth_rate: 1567, confidence: 0.75 },
      { source: "aliexpress", metric: "orders_3d", value: 5670, growth_rate: 890, confidence: 0.86 }
    ],
    "3D Printed Desk Organizer": [
      { source: "google", metric: "search_volume", value: 6700, growth_rate: 123, confidence: 0.75 },
      { source: "tiktok", metric: "views", value: 1200000, growth_rate: 567, confidence: 0.85 }
    ],
    "Silicone Makeup Brush Cleaner": [
      { source: "google", metric: "search_volume", value: 9800, growth_rate: 445, confidence: 0.75 },
      { source: "aliexpress", metric: "orders_3d", value: 4120, growth_rate: 445, confidence: 0.88 }
    ],
    "Portable Cold Brew Maker": [
      { source: "google", metric: "search_volume", value: 11200, growth_rate: 678, confidence: 0.75 },
      { source: "tiktok", metric: "views", value: 2100000, growth_rate: 1234, confidence: 0.85 }
    ]
  };
}

function computeProducts(): ViralProduct[] {
  const out: ViralProduct[] = [];
  const now = Date.now();

  for (const [name, signals] of Object.entries(baseSignals())) {
    const avgGrowth = signals.reduce((sum, s) => sum + s.growth_rate, 0) / signals.length;
    const growthScore = Math.min(avgGrowth / 10, 40);
    const maxValue = Math.max(...signals.map((s) => s.value));
    const volumeScore = Math.min((maxValue / 5000000) * 30, 30);
    const diversityScore = new Set(signals.map((s) => s.source)).size * 10;
    const avgConfidence = signals.reduce((sum, s) => sum + s.confidence, 0) / signals.length;
    const confidenceScore = avgConfidence * 20;
    const viralScore = Math.min(growthScore + volumeScore + diversityScore + confidenceScore, 100);

    const details = PRODUCT_DETAILS[name] || {
      category: "General", price: 29.99, cost: 5, margin: 83.3, suppliers: { aliexpress: "https://www.aliexpress.com" }
    };

    const baseSales = Math.round(signals.reduce((sum, s) => sum + s.value, 0) / signals.length / 100);
    const day1 = Math.round(baseSales * 0.2);
    const day2 = Math.round(baseSales * 0.35);
    const day3 = Math.round(baseSales * 0.45);
    const total = day1 + day2 + day3;
    const growthVelocity = day1 > 0 ? ((day3 - day1) / day1) * 100 : 0;
    const momentumScore = total * (viralScore / 100);
    const daysToPeak = Math.max(2, Math.round((100 / Math.max(viralScore, 1)) * 7));
    const peakDailySales = day3 * 3;

    out.push({
      id: name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""),
      name,
      category: details.category,
      price: details.price,
      cost: details.cost,
      profit_margin: details.margin,
      sales_3days: { day1, day2, day3, total },
      viral_score: Number(viralScore.toFixed(1)),
      growth_velocity: Number(growthVelocity.toFixed(1)),
      momentum_score: Number(momentumScore.toFixed(1)),
      competitor_count: 8 + (name.length % 19),
      supplier_links: details.suppliers,
      forecast: {
        days_to_peak: daysToPeak,
        peak_daily_sales: peakDailySales,
        saturated_in_days: daysToPeak + 14,
        recommendation: viralScore > 85 ? "BUY NOW" : "WATCH"
      },
      hot_until: new Date(now + 14 * 86400000).toISOString()
    });
  }

  return out.sort((a, b) => b.viral_score - a.viral_score).slice(0, 20);
}

export function getViralPayload() {
  const products = computeProducts();
  return {
    success: true,
    count: products.length,
    generated_at: new Date().toISOString(),
    products
  };
}

export const onRequestGet: PagesFunction<Env> = async () => json(getViralPayload());