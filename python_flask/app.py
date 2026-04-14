from flask import Flask, jsonify, render_template_string
from flask_cors import CORS
import json
import sqlite3
import hashlib
from datetime import datetime, timedelta
from dataclasses import dataclass
from typing import List, Dict
import random
import statistics

app = Flask(__name__)
CORS(app)

# NOTE:
# This Flask app is a standalone Python demo app.
# It is not deployable on Cloudflare Pages Functions as-is.
# The signal sources below are simulated demo data, not live platform APIs.

@dataclass
class ViralSignal:
    source: str
    metric: str
    value: int
    growth_rate: float
    timestamp: datetime
    confidence: float

@dataclass
class ViralProduct:
    id: str
    name: str
    category: str
    price: float
    cost: float
    profit_margin: float
    sales_day1: int
    sales_day2: int
    sales_day3: int
    viral_signals: List[ViralSignal]
    viral_score: float
    growth_velocity: float
    momentum_score: float
    supplier_links: Dict[str, str]
    competitor_count: int
    discovered_at: datetime
    hot_until: datetime

class PatternRecognizer:
    def __init__(self):
        self.patterns = []

    def learn(self, product: ViralProduct):
        self.patterns.append({
            'category': product.category,
            'price_range': (product.price * 0.8, product.price * 1.2),
            'margin_threshold': product.profit_margin,
            'viral_score': product.viral_score,
        })

class TrendForecaster:
    def forecast(self, product: ViralProduct) -> Dict:
        days_to_peak = int(100 / max(product.viral_score, 1) * 7)
        peak_sales = product.sales_day3 * 3
        return {
            'days_to_peak': days_to_peak,
            'peak_daily_sales': int(peak_sales),
            'saturated_in_days': days_to_peak + 14,
            'recommendation': 'BUY NOW' if product.viral_score > 85 else 'WATCH',
        }

class ViralPredictorAI:
    def __init__(self):
        self.pattern_recognizer = PatternRecognizer()
        self.trend_forecaster = TrendForecaster()

    def predict_viral_products(self) -> List[ViralProduct]:
        signals = self._collect_all_signals()
        product_signals = self._group_signals_by_product(signals)
        products: List[ViralProduct] = []

        for product_name, sigs in product_signals.items():
            viral_score = self._calculate_viral_score(sigs)
            if viral_score >= 75:
                product = self._create_viral_product(product_name, sigs, viral_score)
                products.append(product)
                self.pattern_recognizer.learn(product)

        products.sort(key=lambda x: x.viral_score, reverse=True)
        return products[:20]

    def _collect_all_signals(self) -> List[ViralSignal]:
        signals: List[ViralSignal] = []
        signals.extend(self._get_tiktok_signals())
        signals.extend(self._get_google_signals())
        signals.extend(self._get_aliexpress_signals())
        signals.extend(self._get_instagram_signals())
        return signals

    def _get_tiktok_signals(self) -> List[ViralSignal]:
        product_signals = [
            ('LED Mask', 2300000, 1200),
            ('Magnetic Gym Water Bottle Holder', 1800000, 890),
            ('Sleepy Girl Mocktail Kit', 3400000, 2340),
            ('3D Printed Desk Organizer', 1200000, 567),
            ('Facial Ice Bath Bowl', 1560000, 789),
            ('Portable Cold Brew Maker', 2100000, 1234),
        ]
        return [
            ViralSignal('tiktok', 'views', views, growth, datetime.now(), 0.85)
            for name, views, growth in product_signals
        ]

    def _get_google_signals(self) -> List[ViralSignal]:
        trending_searches = [
            ('magnetic gym accessories', 12500, 450),
            ('smart plant sensor wifi', 8900, 234),
            ('sleepy girl mocktail recipe', 15600, 890),
            ('3d printed desk organizer', 6700, 123),
            ('face ice bath bowl', 23400, 1567),
            ('portable cold brew maker', 11200, 678),
            ('silicone makeup brush cleaner', 9800, 445),
        ]
        return [
            ViralSignal('google', 'search_volume', volume, growth, datetime.now(), 0.75)
            for _, volume, growth in trending_searches
        ]

    def _get_aliexpress_signals(self) -> List[ViralSignal]:
        hot_products = [
            ('Magnetic Gym Water Bottle Holder', 3450, 234, 4.8),
            ('Smart Plant Watering Sensor', 2890, 189, 4.7),
            ('Sleepy Girl Mocktail Kit', 4560, 567, 4.9),
            ('Facial Ice Bath Bowl', 5670, 890, 4.8),
            ('Silicone Makeup Brush Cleaner', 4120, 445, 4.9),
            ('Portable Cold Brew Maker', 1890, 234, 4.5),
        ]
        out: List[ViralSignal] = []
        for _, orders, growth, rating in hot_products:
            out.append(ViralSignal('aliexpress', 'orders_3d', orders, growth, datetime.now(), (rating / 5.0) * 0.9))
        return out

    def _get_instagram_signals(self) -> List[ViralSignal]:
        return [
            ViralSignal('instagram', 'saves', 450000, 567, datetime.now(), 0.80),
            ViralSignal('instagram', 'shares', 230000, 445, datetime.now(), 0.75),
        ]

    def _group_signals_by_product(self, signals: List[ViralSignal]) -> Dict[str, List[ViralSignal]]:
        return {
            'Magnetic Gym Water Bottle Holder': [s for s in signals if s.source in ['tiktok', 'aliexpress']],
            'Sleepy Girl Mocktail Kit': [s for s in signals if s.source in ['tiktok', 'google']],
            'Smart Plant Watering Sensor': [s for s in signals if s.source in ['google', 'aliexpress']],
            'Facial Ice Bath Bowl': [s for s in signals if s.source in ['tiktok', 'google', 'aliexpress']],
            '3D Printed Desk Organizer': [s for s in signals if s.source in ['google', 'aliexpress']],
            'Silicone Makeup Brush Cleaner': [s for s in signals if s.source in ['aliexpress']],
            'Portable Cold Brew Maker': [s for s in signals if s.source in ['google']],
        }

    def _calculate_viral_score(self, signals: List[ViralSignal]) -> float:
        if not signals:
            return 0.0
        avg_growth = statistics.mean([s.growth_rate for s in signals])
        growth_score = min(avg_growth / 10, 40)
        max_value = max([s.value for s in signals])
        volume_score = min((max_value / 5000000) * 30, 30)
        diversity_score = len(set([s.source for s in signals])) * 10
        avg_confidence = statistics.mean([s.confidence for s in signals])
        confidence_score = avg_confidence * 20
        return min(growth_score + volume_score + diversity_score + confidence_score, 100)

    def _create_viral_product(self, name: str, signals: List[ViralSignal], score: float) -> ViralProduct:
        product_data = self._get_product_details(name)
        base_sales = int(statistics.mean([s.value for s in signals]) / 100)
        sales_d1 = int(base_sales * 0.2)
        sales_d2 = int(base_sales * 0.35)
        sales_d3 = int(base_sales * 0.45)
        growth_velocity = ((sales_d3 - sales_d1) / sales_d1 * 100) if sales_d1 > 0 else 0
        momentum = (sales_d1 + sales_d2 + sales_d3) * (score / 100)
        return ViralProduct(
            id=hashlib.md5(name.encode()).hexdigest()[:8],
            name=name,
            category=product_data['category'],
            price=product_data['price'],
            cost=product_data['cost'],
            profit_margin=product_data['margin'],
            sales_day1=sales_d1,
            sales_day2=sales_d2,
            sales_day3=sales_d3,
            viral_signals=signals,
            viral_score=score,
            growth_velocity=growth_velocity,
            momentum_score=momentum,
            supplier_links=product_data['suppliers'],
            competitor_count=random.randint(5, 45),
            discovered_at=datetime.now(),
            hot_until=datetime.now() + timedelta(days=14),
        )

    def _get_product_details(self, name: str) -> Dict:
        database = {
            'Magnetic Gym Water Bottle Holder': {
                'category': 'Fitness', 'price': 24.99, 'cost': 4.50, 'margin': 82.0,
                'suppliers': {
                    'aliexpress': 'https://www.aliexpress.com/wholesale?SearchText=magnetic+gym+bottle+holder',
                    'alibaba': 'https://www.alibaba.com/trade/search?SearchText=magnetic+water+bottle+bag'
                }
            },
            'Sleepy Girl Mocktail Kit': {
                'category': 'Health & Wellness', 'price': 34.99, 'cost': 7.20, 'margin': 79.4,
                'suppliers': {
                    'alibaba': 'https://www.alibaba.com/trade/search?SearchText=mocktail+glass+set',
                    'aliexpress': 'https://www.aliexpress.com/wholesale?SearchText=herbal+tea+sleep+blend'
                }
            },
            'Smart Plant Watering Sensor': {
                'category': 'Smart Home', 'price': 22.99, 'cost': 4.20, 'margin': 81.7,
                'suppliers': {
                    'aliexpress': 'https://www.aliexpress.com/wholesale?SearchText=smart+plant+watering+sensor',
                    'alibaba': 'https://www.alibaba.com/trade/search?SearchText=wifi+plant+moisture+sensor'
                }
            },
            'Facial Ice Bath Bowl': {
                'category': 'Beauty', 'price': 29.99, 'cost': 5.80, 'margin': 80.7,
                'suppliers': {
                    'aliexpress': 'https://www.aliexpress.com/wholesale?SearchText=face+ice+bath+bowl',
                    'alibaba': 'https://www.alibaba.com/trade/search?SearchText=facial+ice+bowl'
                }
            },
            '3D Printed Desk Organizer': {
                'category': 'Office', 'price': 19.99, 'cost': 3.80, 'margin': 81.0,
                'suppliers': {
                    'thingiverse': 'https://www.thingiverse.com/search?q=desk+organizer',
                    'cults3d': 'https://cults3d.com/en/search?q=desk+organizer'
                }
            },
            'Silicone Makeup Brush Cleaner': {
                'category': 'Beauty Tools', 'price': 16.99, 'cost': 2.80, 'margin': 83.5,
                'suppliers': {
                    'aliexpress': 'https://www.aliexpress.com/wholesale?SearchText=silicone+makeup+brush+cleaner',
                    'alibaba': 'https://www.alibaba.com/trade/search?SearchText=silicone+brush+cleaning+mat'
                }
            },
            'Portable Cold Brew Maker': {
                'category': 'Kitchen', 'price': 39.99, 'cost': 9.50, 'margin': 76.2,
                'suppliers': {
                    'aliexpress': 'https://www.aliexpress.com/wholesale?SearchText=portable+cold+brew+coffee',
                    'alibaba': 'https://www.alibaba.com/trade/search?SearchText=portable+coffee+brewer'
                }
            },
        }
        return database.get(name, {
            'category': 'General', 'price': 29.99, 'cost': 5.00, 'margin': 83.3,
            'suppliers': {'aliexpress': 'https://www.aliexpress.com'}
        })

class ViralDatabase:
    def __init__(self):
        self.conn = sqlite3.connect('viral_products.db', check_same_thread=False)
        self._init_db()

    def _init_db(self):
        cursor = self.conn.cursor()
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS viral_products (
                id TEXT PRIMARY KEY,
                name TEXT,
                category TEXT,
                price REAL,
                cost REAL,
                profit_margin REAL,
                sales_day1 INTEGER,
                sales_day2 INTEGER,
                sales_day3 INTEGER,
                total_sales_3d INTEGER,
                viral_score REAL,
                growth_velocity REAL,
                momentum_score REAL,
                competitor_count INTEGER,
                discovered_at TEXT,
                hot_until TEXT,
                supplier_links TEXT
            )
        ''')
        self.conn.commit()

    def save_product(self, product: ViralProduct):
        cursor = self.conn.cursor()
        cursor.execute('''
            INSERT OR REPLACE INTO viral_products VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)
        ''', (
            product.id, product.name, product.category, product.price, product.cost,
            product.profit_margin, product.sales_day1, product.sales_day2, product.sales_day3,
            product.sales_day1 + product.sales_day2 + product.sales_day3,
            product.viral_score, product.growth_velocity, product.momentum_score,
            product.competitor_count, product.discovered_at.isoformat(),
            product.hot_until.isoformat(), json.dumps(product.supplier_links)
        ))
        self.conn.commit()

    def get_hot_products(self, limit=20):
        cursor = self.conn.cursor()
        cursor.execute('''
            SELECT * FROM viral_products
            WHERE hot_until > ?
            ORDER BY viral_score DESC, total_sales_3d DESC
            LIMIT ?
        ''', (datetime.now().isoformat(), limit))
        columns = [desc[0] for desc in cursor.description]
        return [dict(zip(columns, row)) for row in cursor.fetchall()]

ai_engine = ViralPredictorAI()
database = ViralDatabase()

@app.route('/')
def dashboard():
    return render_template_string(DASHBOARD_HTML)

@app.route('/api/viral-products')
def get_viral_products():
    products = ai_engine.predict_viral_products()
    result = []
    for p in products:
        database.save_product(p)
        forecast = ai_engine.trend_forecaster.forecast(p)
        result.append({
            'id': p.id,
            'name': p.name,
            'category': p.category,
            'price': p.price,
            'cost': p.cost,
            'profit_margin': p.profit_margin,
            'sales_3days': {
                'day1': p.sales_day1,
                'day2': p.sales_day2,
                'day3': p.sales_day3,
                'total': p.sales_day1 + p.sales_day2 + p.sales_day3,
            },
            'viral_score': round(p.viral_score, 1),
            'growth_velocity': round(p.growth_velocity, 1),
            'momentum_score': round(p.momentum_score, 1),
            'competitor_count': p.competitor_count,
            'supplier_links': p.supplier_links,
            'forecast': forecast,
            'hot_until': p.hot_until.isoformat(),
        })
    return jsonify({
        'success': True,
        'count': len(result),
        'generated_at': datetime.now().isoformat(),
        'products': result,
    })

@app.route('/api/hot-now')
def get_hot_now():
    return jsonify({'success': True, 'products': database.get_hot_products(limit=10)})

@app.route('/api/refresh', methods=['POST'])
def refresh_data():
    products = ai_engine.predict_viral_products()
    for p in products:
        database.save_product(p)
    return jsonify({
        'success': True,
        'message': f'Updated {len(products)} products',
        'timestamp': datetime.now().isoformat(),
    })

DASHBOARD_HTML = """
<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Viral Product Predictor AI</title>
<style>
*{margin:0;padding:0;box-sizing:border-box}body{font-family:Segoe UI,Tahoma,Geneva,Verdana,sans-serif;background:linear-gradient(135deg,#1e3c72 0%,#2a5298 100%);min-height:100vh;color:white;padding:20px}.container{max-width:1400px;margin:0 auto}header{text-align:center;padding:40px 0}header h1{font-size:3em;margin-bottom:10px;text-shadow:2px 2px 4px rgba(0,0,0,.3)}header p{font-size:1.2em;opacity:.9}.stats-bar{display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:20px;margin:30px 0}.stat-card{background:rgba(255,255,255,.1);backdrop-filter:blur(10px);padding:25px;border-radius:15px;text-align:center;border:1px solid rgba(255,255,255,.2)}.stat-number{font-size:2.5em;font-weight:bold;color:#ffd700}.controls{display:flex;gap:15px;justify-content:center;margin:30px 0;flex-wrap:wrap}.btn{padding:15px 30px;border:none;border-radius:30px;font-size:1.1em;font-weight:bold;cursor:pointer;transition:all .3s;display:flex;align-items:center;gap:10px}.btn-primary{background:linear-gradient(135deg,#ffd700,#ffaa00);color:#1e3c72}.btn:hover{transform:translateY(-3px);box-shadow:0 10px 30px rgba(0,0,0,.3)}.products-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(350px,1fr));gap:25px;margin-top:30px}.product-card{background:rgba(255,255,255,.1);backdrop-filter:blur(10px);border-radius:20px;padding:25px;border:1px solid rgba(255,255,255,.2);transition:all .3s;position:relative;overflow:hidden}.product-card:hover{transform:translateY(-5px);box-shadow:0 20px 40px rgba(0,0,0,.3)}.product-card::before{content:'';position:absolute;top:0;left:0;right:0;height:4px;background:linear-gradient(90deg,#ffd700,#ff6b6b)}.viral-badge{position:absolute;top:15px;left:15px;background:linear-gradient(135deg,#ff6b6b,#ff4757);padding:5px 15px;border-radius:20px;font-size:.85em;font-weight:bold}.product-name{font-size:1.3em;font-weight:bold;margin-bottom:10px;padding-left:80px}.product-category{color:#ffd700;font-size:.9em;margin-bottom:15px}.sales-chart{display:flex;gap:10px;margin:15px 0;align-items:flex-end;height:80px}.bar{flex:1;background:linear-gradient(to top,#ffd700,#ffaa00);border-radius:5px 5px 0 0;position:relative;min-height:20px}.bar-label{position:absolute;bottom:-20px;left:50%;transform:translateX(-50%);font-size:.75em;white-space:nowrap}.metrics{display:grid;grid-template-columns:repeat(3,1fr);gap:15px;margin:20px 0}.metric{text-align:center;padding:10px;background:rgba(0,0,0,.2);border-radius:10px}.metric-value{font-size:1.5em;font-weight:bold;color:#ffd700}.metric-label{font-size:.8em;opacity:.8}.profit-box{background:linear-gradient(135deg,#00b894,#00a085);padding:15px;border-radius:10px;margin:15px 0;text-align:center}.supplier-links{display:flex;gap:10px;flex-wrap:wrap;margin-top:15px}.supplier-link{background:rgba(255,255,255,.2);padding:8px 15px;border-radius:20px;text-decoration:none;color:white;font-size:.85em;transition:all .3s}.supplier-link:hover{background:#ffd700;color:#1e3c72}.forecast-box{background:rgba(0,0,0,.2);padding:15px;border-radius:10px;margin-top:15px}.forecast-title{font-weight:bold;margin-bottom:10px;color:#ffd700}.loading{text-align:center;padding:50px;font-size:1.5em}.spinner{display:inline-block;width:50px;height:50px;border:5px solid rgba(255,255,255,.3);border-radius:50%;border-top-color:#ffd700;animation:spin 1s ease-in-out infinite;margin-bottom:20px}@keyframes spin{to{transform:rotate(360deg)}}.alert{background:linear-gradient(135deg,#ff6b6b,#ff4757);padding:20px;border-radius:15px;margin-bottom:20px;display:none}.alert.show{display:block;animation:pulse 2s infinite}@keyframes pulse{0%,100%{opacity:1}50%{opacity:.8}}
</style>
</head>
<body>
<div class="container">
<header>
<h1>🚀 Viral Product Predictor AI</h1>
<p>اكتشف المنتجات الفيروسية قبل أن تصبح مشهورة</p>
<p style="font-size:.9em;opacity:.7;margin-top:10px;">بيانات تجريبية متعددة الإشارات داخل تطبيق Flask مستقل</p>
</header>
<div class="alert" id="hot-alert">🔥 تم اكتشاف منتجات فيروسية جديدة! تحقق من القائمة أدناه</div>
<div class="stats-bar">
<div class="stat-card"><div class="stat-number" id="total-products">0</div><div>منتجات محللة</div></div>
<div class="stat-card"><div class="stat-number" id="avg-score">0</div><div>متوسط الفيروسية</div></div>
<div class="stat-card"><div class="stat-number" id="hot-products">0</div><div>منتجات ساخنة (&gt;85)</div></div>
<div class="stat-card"><div class="stat-number" id="last-update">--:--</div><div>آخر تحديث</div></div>
</div>
<div class="controls">
<button class="btn btn-primary" onclick="loadProducts()">🔄 تحديث البيانات</button>
<button class="btn btn-primary" onclick="autoRefresh()">⏰ تحديث تلقائي (30 ثانية)</button>
</div>
<div id="products-container"><div class="loading"><div class="spinner"></div><div>جاري تحليل البيانات...</div></div></div>
</div>
<script>
let autoRefreshInterval=null;
async function loadProducts(){const container=document.getElementById('products-container');container.innerHTML=`<div class="loading"><div class="spinner"></div><div>جاري تحليل البيانات بالذكاء الاصطناعي...</div></div>`;try{const response=await fetch('/api/viral-products');const data=await response.json();if(data.success){displayProducts(data.products);updateStats(data.products);const hotCount=data.products.filter(p=>p.viral_score>85).length;if(hotCount>0){document.getElementById('hot-alert').classList.add('show');setTimeout(()=>{document.getElementById('hot-alert').classList.remove('show')},5000)}}}catch(error){container.innerHTML=`<div class="loading">❌ خطأ: ${error.message}</div>`}}
function displayProducts(products){const container=document.getElementById('products-container');if(products.length===0){container.innerHTML='<div class="loading">لا توجد منتجات فيروسية حالياً</div>';return}container.innerHTML=`<div class="products-grid">${products.map(p=>`<div class="product-card"><div class="viral-badge">🔥 ${p.viral_score}</div><div class="product-name">${p.name}</div><div class="product-category">📂 ${p.category}</div><div class="sales-chart"><div class="bar" style="height:${(p.sales_3days.day1/p.sales_3days.total*100)||20}%"><div class="bar-label">اليوم 1<br>${p.sales_3days.day1}</div></div><div class="bar" style="height:${(p.sales_3days.day2/p.sales_3days.total*100)||35}%"><div class="bar-label">اليوم 2<br>${p.sales_3days.day2}</div></div><div class="bar" style="height:${(p.sales_3days.day3/p.sales_3days.total*100)||45}%"><div class="bar-label">اليوم 3<br>${p.sales_3days.day3}</div></div></div><div style="text-align:center;margin:10px 0;"><strong>📊 إجمالي 3 أيام: ${p.sales_3days.total} مبيعة</strong></div><div class="metrics"><div class="metric"><div class="metric-value">${p.growth_velocity}%</div><div class="metric-label">سرعة النمو</div></div><div class="metric"><div class="metric-value">${Math.round(p.momentum_score)}</div><div class="metric-label">الزخم</div></div><div class="metric"><div class="metric-value">${p.competitor_count}</div><div class="metric-label">المنافسين</div></div></div><div class="profit-box">💰 الربح: $${p.price} - $${p.cost} = <strong>$${(p.price-p.cost).toFixed(2)} (${p.profit_margin}%)</strong></div><div class="forecast-box"><div class="forecast-title">🔮 التنبؤ AI:</div><div>📈 الذروة خلال: ${p.forecast.days_to_peak} يوم</div><div>🎯 مبيعات الذروة: ${p.forecast.peak_daily_sales}/يوم</div><div>⏰ التشبع بعد: ${p.forecast.saturated_in_days} يوم</div><div style="margin-top:10px;padding:10px;background:${p.forecast.recommendation==='BUY NOW'?'#00b894':'#fdcb6e'};border-radius:5px;text-align:center;font-weight:bold;">${p.forecast.recommendation==='BUY NOW'?'🚀 اشترِ الآن!':'👀 راقب'}</div></div><div class="supplier-links">${Object.entries(p.supplier_links).map(([name,url])=>`<a href="${url}" target="_blank" class="supplier-link">${name.toUpperCase()}</a>`).join('')}</div></div>`).join('')}</div>`}
function updateStats(products){document.getElementById('total-products').textContent=products.length;document.getElementById('avg-score').textContent=Math.round(products.reduce((a,b)=>a+b.viral_score,0)/products.length)||0;document.getElementById('hot-products').textContent=products.filter(p=>p.viral_score>85).length;document.getElementById('last-update').textContent=new Date().toLocaleTimeString('ar')}
function autoRefresh(){if(autoRefreshInterval){clearInterval(autoRefreshInterval);autoRefreshInterval=null;alert('⏹️ تم إيقاف التحديث التلقائي')}else{loadProducts();autoRefreshInterval=setInterval(loadProducts,30000);alert('▶️ تم تفعيل التحديث كل 30 ثانية')}}
loadProducts();
</script>
</body>
</html>
"""

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True, threaded=True)
