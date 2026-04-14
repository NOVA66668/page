export const onRequestGet: PagesFunction = async () => {
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Viral Product Predictor AI | Discover Winning Products Early</title>
  <meta name="description" content="Modern product research platform for finding fast-moving opportunities early. Explore viral score, growth velocity, momentum, supplier links, and launch-ready insights." />
  <style>
    :root{
      --bg:#060b16;
      --panel:rgba(15,24,46,.72);
      --soft:rgba(255,255,255,.06);
      --line:rgba(255,255,255,.08);
      --text:#eef4ff;
      --muted:#9fb0d1;
      --gold:#ffd36f;
      --blue:#7ca0ff;
      --mint:#67efc0;
      --danger:#ff7e92;
    }
    *{box-sizing:border-box} html,body{margin:0;padding:0}
    body{font-family:Inter,Segoe UI,Roboto,Arial,sans-serif;background:
      radial-gradient(circle at 10% 0%, rgba(124,160,255,.18), transparent 26%),
      radial-gradient(circle at 100% 10%, rgba(103,239,192,.14), transparent 24%),
      linear-gradient(180deg,#0a1223 0%, #050912 100%); color:var(--text)}
    a{text-decoration:none;color:inherit}
    .container{max-width:1240px;margin:0 auto;padding:0 18px}
    .nav{display:flex;justify-content:space-between;align-items:center;padding:22px 0;gap:18px;position:sticky;top:0;z-index:20;background:rgba(6,11,22,.55);backdrop-filter:blur(14px);border-bottom:1px solid rgba(255,255,255,.04)}
    .brand{display:flex;align-items:center;gap:12px;font-weight:800;letter-spacing:.02em}
    .brand-badge{width:42px;height:42px;border-radius:14px;background:linear-gradient(135deg,var(--blue),var(--mint));display:grid;place-items:center;color:#04111f;font-weight:900}
    .nav-links{display:flex;gap:14px;align-items:center;flex-wrap:wrap}
    .nav-link{font-size:14px;color:var(--muted)}
    .btn{display:inline-flex;align-items:center;justify-content:center;gap:10px;border:0;border-radius:16px;padding:14px 20px;font-weight:700;cursor:pointer;transition:.24s ease}
    .btn:hover{transform:translateY(-2px)}
    .btn-primary{background:linear-gradient(135deg,var(--gold),#ffae45);color:#091423;box-shadow:0 14px 36px rgba(255,190,77,.22)}
    .btn-secondary{background:rgba(255,255,255,.05);border:1px solid var(--line);color:var(--text)}
    .hero{padding:48px 0 30px}
    .hero-grid{display:grid;grid-template-columns:1.18fr .92fr;gap:24px;align-items:center}
    .pill{display:inline-flex;align-items:center;gap:8px;border-radius:999px;padding:8px 14px;background:rgba(255,255,255,.05);border:1px solid var(--line);font-size:13px;color:#d8e5ff}
    h1{font-size:clamp(42px,6vw,76px);line-height:1.02;margin:18px 0 16px;max-width:760px}
    .lead{font-size:18px;line-height:1.75;color:var(--muted);max-width:740px}
    .hero-actions{display:flex;gap:14px;flex-wrap:wrap;margin-top:24px}
    .panel,.metric,.opportunity,.feature,.step,.faq,.preview-shell{background:var(--panel);border:1px solid var(--line);backdrop-filter:blur(10px);border-radius:28px}
    .panel{padding:20px}
    .metric-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px}
    .metric{padding:16px}
    .metric strong{display:block;font-size:30px;color:var(--gold)}
    .metric span{display:block;color:var(--muted);font-size:13px;margin-top:5px}
    .section{padding:32px 0}
    .section-head{max-width:760px;margin-bottom:18px}
    .section-head h2{font-size:34px;margin:0 0 8px}
    .section-head p{margin:0;color:var(--muted);line-height:1.7}
    .search-shell{padding:22px}
    .search-head{display:flex;justify-content:space-between;gap:16px;align-items:flex-end;flex-wrap:wrap;margin-bottom:16px}
    .search-box{display:flex;gap:12px;flex-wrap:wrap}
    .search-box input{flex:1;min-width:240px;padding:16px 18px;border-radius:16px;border:1px solid var(--line);background:#091324;color:var(--text);font-size:16px}
    .preview-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:16px;margin-top:18px}
    .opportunity{padding:18px;position:relative;overflow:hidden}
    .opportunity::before{content:'';position:absolute;top:0;left:0;right:0;height:4px;background:linear-gradient(90deg,var(--gold),var(--danger))}
    .score{display:inline-flex;padding:6px 12px;border-radius:999px;background:rgba(255,211,111,.12);border:1px solid rgba(255,211,111,.24);color:#ffe5aa;font-size:12px;font-weight:800}
    .opportunity h3{margin:12px 0 8px;font-size:20px}
    .sub{color:var(--muted)}
    .mini-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:10px;margin:16px 0}
    .mini{padding:10px;border-radius:14px;background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.05);text-align:center}
    .mini strong{display:block;color:var(--gold);font-size:18px}
    .mini span{font-size:12px;color:var(--muted)}
    .links{display:flex;gap:8px;flex-wrap:wrap;margin-top:14px}
    .chip{padding:8px 12px;border-radius:999px;background:rgba(255,255,255,.05);border:1px solid var(--line);font-size:12px;color:#dbe7ff}
    .features,.steps,.faq-grid{display:grid;gap:16px}
    .features{grid-template-columns:repeat(3,minmax(0,1fr))}
    .steps{grid-template-columns:repeat(3,minmax(0,1fr))}
    .faq-grid{grid-template-columns:repeat(2,minmax(0,1fr))}
    .feature,.step,.faq{padding:20px}
    .icon{width:48px;height:48px;border-radius:16px;display:grid;place-items:center;background:linear-gradient(135deg,rgba(124,160,255,.22),rgba(103,239,192,.18));font-size:22px;margin-bottom:14px}
    .feature h3,.step h3,.faq h3{margin:0 0 10px;font-size:21px}
    .feature p,.step p,.faq p{margin:0;color:var(--muted);line-height:1.7}
    .step-num{display:inline-flex;width:34px;height:34px;border-radius:50%;align-items:center;justify-content:center;background:rgba(255,211,111,.14);color:var(--gold);font-weight:800;margin-bottom:12px}
    .cta{display:flex;justify-content:space-between;gap:18px;align-items:center;flex-wrap:wrap;padding:24px;margin:10px 0 60px;background:linear-gradient(135deg,rgba(124,160,255,.15),rgba(103,239,192,.12));border:1px solid rgba(255,255,255,.1);border-radius:28px}
    .cta h3{margin:0 0 10px;font-size:30px}.cta p{margin:0;max-width:720px;color:var(--muted);line-height:1.7}
    .note{padding:18px;border-radius:18px;background:rgba(255,255,255,.03);border:1px dashed rgba(255,255,255,.12);text-align:center;color:var(--muted)}
    .footer{padding:0 0 30px;color:var(--muted);font-size:14px}
    @media (max-width:1000px){.hero-grid,.features,.steps,.faq-grid{grid-template-columns:1fr}.nav{position:static}}
    @media (max-width:640px){h1{font-size:42px}.search-head h2,.section-head h2{font-size:28px}.nav{flex-direction:column;align-items:flex-start}}
  </style>
</head>
<body>
  <div class="container">
    <nav class="nav">
      <div class="brand"><div class="brand-badge">V</div><div>Viral Product Predictor AI</div></div>
      <div class="nav-links">
        <a class="nav-link" href="#search">Search</a>
        <a class="nav-link" href="#features">Features</a>
        <a class="nav-link" href="#how">How it works</a>
        <a class="nav-link" href="/viral.html">Dashboard</a>
        <a class="btn btn-primary" href="/viral.html">Open Dashboard</a>
      </div>
    </nav>

    <section class="hero">
      <div class="hero-grid">
        <div>
          <div class="pill">Modern product intelligence • High-conviction research workflow</div>
          <h1>Discover strong product opportunities before the market gets saturated.</h1>
          <p class="lead">A modern research experience built to surface fast-moving ideas with clear decision signals: viral score, growth velocity, projected timing, margin visibility, sourcing links, and quick product filtering — all in one sharp interface.</p>
          <div class="hero-actions">
            <a class="btn btn-primary" href="#search">Start Research</a>
            <a class="btn btn-secondary" href="/viral.html">View Analysis Dashboard</a>
          </div>
        </div>
        <div class="panel">
          <div class="metric-grid">
            <div class="metric"><strong id="metricProducts">0</strong><span>Live product opportunities</span></div>
            <div class="metric"><strong id="metricAvg">0</strong><span>Average viral score</span></div>
            <div class="metric"><strong id="metricHot">0</strong><span>High-intensity products</span></div>
            <div class="metric"><strong>AI</strong><span>Research-focused scoring model</span></div>
          </div>
          <div class="note" style="margin-top:14px">This homepage loads current opportunities directly from your site engine and gives visitors an instant preview.</div>
        </div>
      </div>
    </section>

    <section class="section" id="search">
      <div class="preview-shell search-shell">
        <div class="search-head">
          <div class="section-head" style="margin:0">
            <h2>Search opportunities instantly</h2>
            <p>Filter current products by keyword, product type, or category — then jump into the full dashboard for deeper analysis.</p>
          </div>
          <a class="btn btn-secondary" href="/viral.html">Open Full Tool</a>
        </div>
        <div class="search-box">
          <input id="searchInput" type="text" placeholder="Search by product name or category..." />
          <button class="btn btn-primary" id="refreshBtn">Refresh Opportunities</button>
        </div>
        <div id="previewGrid" class="preview-grid"></div>
      </div>
    </section>

    <section class="section" id="features">
      <div class="section-head">
        <h2>Why this interface feels different</h2>
        <p>Designed to help you move from random product hunting to structured, faster, more confident product research.</p>
      </div>
      <div class="features">
        <article class="feature"><div class="icon">📈</div><h3>Momentum-first signals</h3><p>Focus on products through viral score, growth velocity, and momentum instead of relying on a single unreliable signal.</p></article>
        <article class="feature"><div class="icon">💰</div><h3>Margin-aware discovery</h3><p>See price, cost, and margin together so the attractive products are also commercially realistic for launching.</p></article>
        <article class="feature"><div class="icon">🔗</div><h3>Supplier-ready workflow</h3><p>Move faster from product idea to sourcing decision with direct supplier search links already attached to each opportunity.</p></article>
      </div>
    </section>

    <section class="section" id="how">
      <div class="section-head">
        <h2>How the workflow works</h2>
        <p>A cleaner path for evaluating, validating, and sourcing stronger product ideas.</p>
      </div>
      <div class="steps">
        <article class="step"><div class="step-num">1</div><h3>Load opportunities</h3><p>Review currently ranked product ideas with a fast visual preview and a research-friendly search section.</p></article>
        <article class="step"><div class="step-num">2</div><h3>Validate product strength</h3><p>Compare score, growth, momentum, competitors, and projected peak timing before committing to the idea.</p></article>
        <article class="step"><div class="step-num">3</div><h3>Source and launch faster</h3><p>Use built-in supplier links and the deeper dashboard to move from product interest to operational action faster.</p></article>
      </div>
    </section>

    <section class="section">
      <div class="section-head">
        <h2>Frequently asked questions</h2>
        <p>Clear answers for people landing on the platform for the first time.</p>
      </div>
      <div class="faq-grid">
        <article class="faq"><h3>Who is this made for?</h3><p>It is built for ecommerce founders, dropshippers, product researchers, and anyone who wants a clearer way to evaluate launch candidates.</p></article>
        <article class="faq"><h3>What can I do on the homepage?</h3><p>You can search live opportunities, preview their metrics, and jump into the full analysis dashboard when you want deeper review.</p></article>
        <article class="faq"><h3>What is inside the dashboard?</h3><p>The dashboard provides a richer operational view for deeper product analysis and research workflows.</p></article>
        <article class="faq"><h3>Is the design responsive?</h3><p>Yes. The homepage is optimized for mobile and desktop so the experience stays clean and modern across devices.</p></article>
      </div>
    </section>

    <section class="cta">
      <div>
        <h3>Turn raw product ideas into sharper launch decisions.</h3>
        <p>Use the modern homepage for discovery and the dashboard for deeper review. Everything is built to feel clear, fast, and premium.</p>
      </div>
      <div class="hero-actions">
        <a class="btn btn-primary" href="/viral.html">Open Dashboard</a>
        <a class="btn btn-secondary" href="#search">Search Here</a>
      </div>
    </section>

    <div class="footer">© Viral Product Predictor AI — Modern homepage for product opportunity discovery.</div>
  </div>

  <script>
    let allProducts = [];
    function updateMetrics(products){
      const avg = products.length ? Math.round(products.reduce((a,b)=>a+b.viral_score,0)/products.length) : 0;
      const hot = products.filter(p => p.viral_score > 85).length;
      document.getElementById('metricProducts').textContent = products.length;
      document.getElementById('metricAvg').textContent = avg;
      document.getElementById('metricHot').textContent = hot;
    }
    function renderProducts(items){
      const grid = document.getElementById('previewGrid');
      if(!items.length){grid.innerHTML = '<div class="note">No matching products found for this search.</div>';return;}
      grid.innerHTML = items.map(p => `
        <article class="opportunity">
          <span class="score">Viral score: ${p.viral_score}</span>
          <h3>${p.name}</h3>
          <div class="sub">${p.category}</div>
          <div class="mini-grid">
            <div class="mini"><strong>${p.growth_velocity}%</strong><span>Growth</span></div>
            <div class="mini"><strong>${Math.round(p.momentum_score)}</strong><span>Momentum</span></div>
            <div class="mini"><strong>${p.competitor_count}</strong><span>Competitors</span></div>
          </div>
          <div class="sub">Profit margin: <strong style="color:#ffe2a0">${p.profit_margin}%</strong> • Price: <strong style="color:#ffe2a0">$${p.price}</strong> • Cost: <strong style="color:#ffe2a0">$${p.cost}</strong></div>
          <div class="links">${Object.entries(p.supplier_links).map(([name,url]) => `<a class="chip" href="${url}" target="_blank" rel="noreferrer">${name.toUpperCase()}</a>`).join('')}</div>
        </article>
      `).join('');
    }
    function applySearch(){
      const q = document.getElementById('searchInput').value.trim().toLowerCase();
      if(!q){renderProducts(allProducts.slice(0,6));return;}
      const filtered = allProducts.filter(p => p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q));
      renderProducts(filtered.slice(0,6));
    }
    async function loadOpportunities(){
      const grid = document.getElementById('previewGrid');
      grid.innerHTML = '<div class="note">Loading opportunities...</div>';
      try{
        const response = await fetch('/api/viral-products');
        const data = await response.json();
        allProducts = Array.isArray(data.products) ? data.products : [];
        updateMetrics(allProducts);
        renderProducts(allProducts.slice(0,6));
      }catch(error){
        grid.innerHTML = '<div class="note">Could not load opportunities.</div>';
      }
    }
    document.getElementById('searchInput').addEventListener('input', applySearch);
    document.getElementById('refreshBtn').addEventListener('click', loadOpportunities);
    loadOpportunities();
  </script>
</body>
</html>`;

  return new Response(html, {
    headers: {
      "content-type": "text/html; charset=UTF-8",
      "cache-control": "no-store"
    }
  });
};