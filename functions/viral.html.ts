export const onRequestGet: PagesFunction = async () => {
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Viral Product Predictor AI Dashboard</title>
  <meta name="description" content="Modern dashboard for reviewing product opportunities with viral score, growth velocity, margins, forecasts, and supplier links." />
  <style>
    :root{--bg:#060b16;--panel:rgba(15,24,46,.76);--line:rgba(255,255,255,.08);--soft:rgba(255,255,255,.05);--text:#eef4ff;--muted:#9fb0d1;--gold:#ffd36f;--blue:#7ca0ff;--mint:#67efc0;--danger:#ff7e92;--success:#37d39f}
    *{box-sizing:border-box} html,body{margin:0;padding:0}
    body{font-family:Inter,Segoe UI,Roboto,Arial,sans-serif;background:radial-gradient(circle at 5% 0%,rgba(124,160,255,.18),transparent 26%),radial-gradient(circle at 100% 8%,rgba(103,239,192,.14),transparent 24%),linear-gradient(180deg,#0a1223 0%,#050912 100%);color:var(--text)}
    a{text-decoration:none;color:inherit}.container{max-width:1320px;margin:0 auto;padding:0 18px}.nav{display:flex;justify-content:space-between;align-items:center;padding:20px 0;gap:18px;position:sticky;top:0;z-index:20;background:rgba(6,11,22,.58);backdrop-filter:blur(14px);border-bottom:1px solid rgba(255,255,255,.04)}.brand{display:flex;align-items:center;gap:12px;font-weight:800;letter-spacing:.02em}.brand-badge{width:42px;height:42px;border-radius:14px;background:linear-gradient(135deg,var(--blue),var(--mint));display:grid;place-items:center;color:#04111f;font-weight:900}.nav-links{display:flex;gap:14px;align-items:center;flex-wrap:wrap}.nav-link{font-size:14px;color:var(--muted)}
    .btn{display:inline-flex;align-items:center;justify-content:center;gap:10px;border:0;border-radius:16px;padding:13px 18px;font-weight:700;cursor:pointer;transition:.24s ease}.btn:hover{transform:translateY(-2px)}.btn-primary{background:linear-gradient(135deg,var(--gold),#ffae45);color:#091423;box-shadow:0 14px 36px rgba(255,190,77,.22)}.btn-secondary{background:rgba(255,255,255,.05);border:1px solid var(--line);color:var(--text)}
    .hero{padding:36px 0 22px}.hero-grid{display:grid;grid-template-columns:1.08fr .92fr;gap:22px;align-items:end}.pill{display:inline-flex;align-items:center;gap:8px;padding:8px 14px;border-radius:999px;background:rgba(255,255,255,.05);border:1px solid var(--line);font-size:13px;color:#d8e5ff}h1{font-size:clamp(38px,5vw,64px);line-height:1.03;margin:16px 0 12px}.lead{font-size:17px;line-height:1.75;color:var(--muted);max-width:760px}.hero-actions{display:flex;gap:12px;flex-wrap:wrap;margin-top:20px}
    .panel,.metric-card,.product-card,.filter-card,.insight-card{background:var(--panel);border:1px solid var(--line);backdrop-filter:blur(10px);border-radius:26px}.panel{padding:18px}.metric-grid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:12px}.metric-card{padding:16px}.metric-card strong{display:block;font-size:30px;color:var(--gold)}.metric-card span{display:block;color:var(--muted);font-size:13px;margin-top:5px}
    .section{padding:18px 0 26px}.section-head{display:flex;justify-content:space-between;gap:14px;align-items:end;flex-wrap:wrap;margin-bottom:16px}.section-head h2{margin:0;font-size:30px}.section-head p{margin:8px 0 0;color:var(--muted);line-height:1.7}.layout{display:grid;grid-template-columns:320px 1fr;gap:18px;align-items:start}
    .filter-card{padding:18px;position:sticky;top:90px}.field{display:grid;gap:8px;margin-bottom:14px}.field label{font-size:13px;color:#d8e5ff}.field input,.field select{width:100%;padding:14px 16px;border-radius:16px;border:1px solid var(--line);background:#091324;color:var(--text);font-size:15px}.helper{color:var(--muted);font-size:13px;line-height:1.6}.quick-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px;margin-top:14px}.insight-card{padding:14px}.insight-card strong{display:block;color:var(--gold);font-size:18px}.insight-card span{display:block;color:var(--muted);font-size:12px;margin-top:4px}.toolbar{display:flex;gap:10px;flex-wrap:wrap}
    .products-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(300px,1fr));gap:16px}.product-card{padding:18px;position:relative;overflow:hidden}.product-card::before{content:'';position:absolute;top:0;left:0;right:0;height:4px;background:linear-gradient(90deg,var(--gold),var(--danger))}.top-row{display:flex;justify-content:space-between;gap:10px;align-items:flex-start;margin-bottom:10px}.score{display:inline-flex;padding:7px 12px;border-radius:999px;background:rgba(255,211,111,.12);border:1px solid rgba(255,211,111,.24);color:#ffe5aa;font-size:12px;font-weight:800}.rec{display:inline-flex;padding:7px 12px;border-radius:999px;font-size:12px;font-weight:800}.rec.buy{background:rgba(55,211,159,.14);border:1px solid rgba(55,211,159,.24);color:#bdf6e1}.rec.watch{background:rgba(124,160,255,.14);border:1px solid rgba(124,160,255,.24);color:#d3e0ff}.product-card h3{margin:0 0 6px;font-size:22px}.category{color:var(--muted);font-size:14px}
    .sales{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:10px;margin:16px 0}.sale-box{padding:12px;border-radius:16px;background:var(--soft);border:1px solid rgba(255,255,255,.05);text-align:center}.sale-box strong{display:block;color:var(--gold);font-size:18px}.sale-box span{display:block;color:var(--muted);font-size:12px;margin-top:4px}.bars{display:flex;gap:10px;align-items:end;height:82px;margin:6px 0 16px}.bar{flex:1;min-height:18px;border-radius:10px 10px 4px 4px;background:linear-gradient(to top,var(--gold),#ffb347);position:relative}.bar small{position:absolute;bottom:-20px;left:50%;transform:translateX(-50%);font-size:11px;color:var(--muted);white-space:nowrap}
    .meta-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:10px;margin:16px 0}.meta-box{padding:10px;border-radius:14px;background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.05);text-align:center}.meta-box strong{display:block;color:var(--gold);font-size:17px}.meta-box span{display:block;font-size:12px;color:var(--muted);margin-top:4px}.profit{padding:14px;border-radius:18px;background:linear-gradient(135deg,rgba(55,211,159,.2),rgba(24,156,116,.18));border:1px solid rgba(55,211,159,.2);margin:14px 0}.profit strong{color:#d7fff2}.forecast{padding:14px;border-radius:18px;background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.06);display:grid;gap:8px;margin-top:14px}.forecast-title{font-weight:800;color:var(--gold)}.suppliers{display:flex;gap:8px;flex-wrap:wrap;margin-top:14px}.chip{padding:8px 12px;border-radius:999px;background:rgba(255,255,255,.05);border:1px solid var(--line);font-size:12px;color:#dbe7ff}
    .status{padding:14px 16px;border-radius:18px;background:rgba(255,255,255,.04);border:1px solid var(--line);color:var(--muted);margin-bottom:16px}.empty{padding:28px;border-radius:22px;background:rgba(255,255,255,.03);border:1px dashed rgba(255,255,255,.12);text-align:center;color:var(--muted)}
    @media (max-width:1100px){.hero-grid,.layout{grid-template-columns:1fr}.filter-card{position:static}.metric-grid{grid-template-columns:repeat(2,minmax(0,1fr))}} @media (max-width:640px){h1{font-size:40px}.metric-grid,.meta-grid,.sales{grid-template-columns:1fr 1fr}.nav{position:static;flex-direction:column;align-items:flex-start}}
  </style>
</head>
<body>
  <div class="container">
    <nav class="nav">
      <div class="brand"><div class="brand-badge">V</div><div>Viral Product Predictor AI</div></div>
      <div class="nav-links">
        <a class="nav-link" href="/">Home</a>
        <a class="nav-link" href="#filters">Filters</a>
        <a class="nav-link" href="#products">Products</a>
        <a class="btn btn-primary" href="/">Back to Homepage</a>
      </div>
    </nav>
    <section class="hero">
      <div class="hero-grid">
        <div>
          <div class="pill">Live dashboard experience • Product analysis workspace</div>
          <h1>Research, compare, and filter product opportunities in one modern dashboard.</h1>
          <p class="lead">This workspace is designed for fast review: search products, filter by score and recommendation, compare momentum, inspect margin visibility, and move from product curiosity to sourcing action faster.</p>
          <div class="hero-actions">
            <button class="btn btn-primary" id="refreshTopBtn">Refresh Analysis</button>
            <a class="btn btn-secondary" href="#products">Jump to Products</a>
          </div>
        </div>
        <div class="panel">
          <div class="metric-grid">
            <div class="metric-card"><strong id="metricTotal">0</strong><span>Total products</span></div>
            <div class="metric-card"><strong id="metricAvg">0</strong><span>Average score</span></div>
            <div class="metric-card"><strong id="metricHot">0</strong><span>Hot opportunities</span></div>
            <div class="metric-card"><strong id="metricUpdated">--:--</strong><span>Last refresh</span></div>
          </div>
        </div>
      </div>
    </section>
    <section class="section" id="filters">
      <div class="section-head">
        <div><h2>Filter and explore</h2><p>Use the controls to narrow products by keyword, category, recommendation, and score level.</p></div>
      </div>
      <div class="layout">
        <aside class="filter-card">
          <div class="field"><label for="searchInput">Search</label><input id="searchInput" type="text" placeholder="Product name or category" /></div>
          <div class="field"><label for="categoryFilter">Category</label><select id="categoryFilter"><option value="all">All categories</option></select></div>
          <div class="field"><label for="recommendationFilter">Recommendation</label><select id="recommendationFilter"><option value="all">All recommendations</option><option value="BUY NOW">BUY NOW</option><option value="WATCH">WATCH</option></select></div>
          <div class="field"><label for="scoreFilter">Minimum viral score</label><select id="scoreFilter"><option value="0">Any score</option><option value="70">70+</option><option value="80">80+</option><option value="85">85+</option><option value="90">90+</option></select></div>
          <div class="toolbar"><button class="btn btn-primary" id="applyBtn">Apply Filters</button><button class="btn btn-secondary" id="resetBtn">Reset</button></div>
          <p class="helper" style="margin-top:14px">Use this panel to move faster through product opportunities and isolate stronger candidates before opening sourcing links.</p>
          <div class="quick-grid"><div class="insight-card"><strong id="sideCount">0</strong><span>Visible products</span></div><div class="insight-card"><strong id="sideBest">—</strong><span>Best score</span></div><div class="insight-card"><strong id="sideBuy">0</strong><span>BUY NOW</span></div><div class="insight-card"><strong id="sideWatch">0</strong><span>WATCH</span></div></div>
        </aside>
        <div>
          <div id="statusBox" class="status">Loading product opportunities...</div>
          <div id="productsGrid" class="products-grid"></div>
        </div>
      </div>
    </section>
  </div>
  <script>
    let allProducts = []; let visibleProducts = [];
    function fmtTime(){ return new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }); }
    function updateTopMetrics(products){ const avg = products.length ? Math.round(products.reduce((a,b)=>a+b.viral_score,0)/products.length) : 0; const hot = products.filter(p => p.viral_score >= 85).length; document.getElementById('metricTotal').textContent = products.length; document.getElementById('metricAvg').textContent = avg; document.getElementById('metricHot').textContent = hot; document.getElementById('metricUpdated').textContent = fmtTime(); }
    function updateSideMetrics(products){ document.getElementById('sideCount').textContent = products.length; document.getElementById('sideBest').textContent = products.length ? Math.max(...products.map(p => p.viral_score)) : '—'; document.getElementById('sideBuy').textContent = products.filter(p => p.forecast.recommendation === 'BUY NOW').length; document.getElementById('sideWatch').textContent = products.filter(p => p.forecast.recommendation === 'WATCH').length; }
    function fillCategories(products){ const select = document.getElementById('categoryFilter'); const current = select.value; const categories = [...new Set(products.map(p => p.category))].sort(); select.innerHTML = '<option value="all">All categories</option>' + categories.map(c => `<option value="${c}">${c}</option>`).join(''); if (categories.includes(current)) select.value = current; }
    function renderProducts(products){ const grid = document.getElementById('productsGrid'); if(!products.length){ grid.innerHTML = '<div class="empty">No products match the current filters.</div>'; return; } grid.innerHTML = products.map(p => { const total = Math.max(p.sales_3days.total, 1); const recClass = p.forecast.recommendation === 'BUY NOW' ? 'buy' : 'watch'; return `<article class="product-card"><div class="top-row"><div><span class="score">Viral score: ${p.viral_score}</span></div><span class="rec ${recClass}">${p.forecast.recommendation}</span></div><h3>${p.name}</h3><div class="category">${p.category}</div><div class="bars"><div class="bar" style="height:${Math.max((p.sales_3days.day1/total)*100,18)}%"><small>Day 1 • ${p.sales_3days.day1}</small></div><div class="bar" style="height:${Math.max((p.sales_3days.day2/total)*100,26)}%"><small>Day 2 • ${p.sales_3days.day2}</small></div><div class="bar" style="height:${Math.max((p.sales_3days.day3/total)*100,34)}%"><small>Day 3 • ${p.sales_3days.day3}</small></div></div><div class="sales"><div class="sale-box"><strong>${p.sales_3days.total}</strong><span>3-day total</span></div><div class="sale-box"><strong>${p.forecast.peak_daily_sales}</strong><span>Peak daily sales</span></div><div class="sale-box"><strong>${p.forecast.days_to_peak}</strong><span>Days to peak</span></div></div><div class="meta-grid"><div class="meta-box"><strong>${p.growth_velocity}%</strong><span>Growth velocity</span></div><div class="meta-box"><strong>${Math.round(p.momentum_score)}</strong><span>Momentum</span></div><div class="meta-box"><strong>${p.competitor_count}</strong><span>Competitors</span></div></div><div class="profit">Price <strong>$${p.price}</strong> • Cost <strong>$${p.cost}</strong> • Margin <strong>${p.profit_margin}%</strong></div><div class="forecast"><div class="forecast-title">Forecast</div><div>Peak expected in <strong>${p.forecast.days_to_peak} days</strong></div><div>Potential saturation in <strong>${p.forecast.saturated_in_days} days</strong></div></div><div class="suppliers">${Object.entries(p.supplier_links).map(([name,url]) => `<a class="chip" href="${url}" target="_blank" rel="noreferrer">${name.toUpperCase()}</a>`).join('')}</div></article>`; }).join(''); }
    function applyFilters(){ const q = document.getElementById('searchInput').value.trim().toLowerCase(); const category = document.getElementById('categoryFilter').value; const recommendation = document.getElementById('recommendationFilter').value; const minScore = Number(document.getElementById('scoreFilter').value || 0); visibleProducts = allProducts.filter(p => { const okQ = !q || p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q); const okCategory = category === 'all' || p.category === category; const okRec = recommendation === 'all' || p.forecast.recommendation === recommendation; const okScore = p.viral_score >= minScore; return okQ && okCategory && okRec && okScore; }); updateSideMetrics(visibleProducts); renderProducts(visibleProducts); document.getElementById('statusBox').textContent = `Showing ${visibleProducts.length} products from ${allProducts.length} total opportunities.`; }
    function resetFilters(){ document.getElementById('searchInput').value = ''; document.getElementById('categoryFilter').value = 'all'; document.getElementById('recommendationFilter').value = 'all'; document.getElementById('scoreFilter').value = '0'; applyFilters(); }
    async function loadProducts(){ const status = document.getElementById('statusBox'); status.textContent = 'Refreshing product opportunities...'; try { const response = await fetch('/api/viral-products'); const data = await response.json(); allProducts = Array.isArray(data.products) ? data.products : []; fillCategories(allProducts); updateTopMetrics(allProducts); applyFilters(); status.textContent = `Analysis refreshed successfully. ${allProducts.length} products loaded.`; } catch (error) { status.textContent = 'Could not load product opportunities from the site engine.'; document.getElementById('productsGrid').innerHTML = '<div class="empty">The dashboard could not fetch data right now.</div>'; } }
    document.getElementById('applyBtn').addEventListener('click', applyFilters); document.getElementById('resetBtn').addEventListener('click', resetFilters); document.getElementById('refreshTopBtn').addEventListener('click', loadProducts); document.getElementById('searchInput').addEventListener('input', applyFilters); document.getElementById('categoryFilter').addEventListener('change', applyFilters); document.getElementById('recommendationFilter').addEventListener('change', applyFilters); document.getElementById('scoreFilter').addEventListener('change', applyFilters); loadProducts();
  </script>
</body>
</html>`;
  return new Response(html, { headers: { "content-type": "text/html; charset=UTF-8", "cache-control": "no-store" } });
};