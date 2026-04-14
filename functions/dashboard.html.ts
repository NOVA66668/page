export const onRequestGet: PagesFunction = async () => {
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Unified Product Intelligence Dashboard</title>
  <meta name="description" content="Unified dashboard for viral product discovery and product ranking in one workspace." />
  <style>
    :root{--bg:#060b16;--panel:rgba(15,24,46,.78);--line:rgba(255,255,255,.08);--text:#eef4ff;--muted:#9fb0d1;--gold:#ffd36f;--blue:#7ca0ff;--mint:#67efc0}
    *{box-sizing:border-box} html,body{margin:0;padding:0}
    body{font-family:Inter,Segoe UI,Roboto,Arial,sans-serif;background:radial-gradient(circle at 5% 0%,rgba(124,160,255,.18),transparent 26%),radial-gradient(circle at 100% 8%,rgba(103,239,192,.14),transparent 24%),linear-gradient(180deg,#0a1223 0%,#050912 100%);color:var(--text)}
    a{text-decoration:none;color:inherit}.container{max-width:1380px;margin:0 auto;padding:0 18px}.nav{display:flex;justify-content:space-between;align-items:center;padding:20px 0;gap:18px;position:sticky;top:0;z-index:20;background:rgba(6,11,22,.58);backdrop-filter:blur(14px);border-bottom:1px solid rgba(255,255,255,.04)}.brand{display:flex;align-items:center;gap:12px;font-weight:800}.brand-badge{width:42px;height:42px;border-radius:14px;background:linear-gradient(135deg,var(--blue),var(--mint));display:grid;place-items:center;color:#04111f;font-weight:900}.nav-links{display:flex;gap:14px;align-items:center;flex-wrap:wrap}.nav-link{font-size:14px;color:var(--muted)}
    .btn{display:inline-flex;align-items:center;justify-content:center;gap:10px;border:0;border-radius:16px;padding:13px 18px;font-weight:700;cursor:pointer;background:linear-gradient(135deg,var(--gold),#ffae45);color:#091423}
    .hero{padding:34px 0 18px}.hero-grid{display:grid;grid-template-columns:1.15fr .85fr;gap:22px;align-items:end}.pill{display:inline-flex;align-items:center;gap:8px;padding:8px 14px;border-radius:999px;background:rgba(255,255,255,.05);border:1px solid var(--line);font-size:13px;color:#d8e5ff}h1{font-size:clamp(38px,5vw,64px);line-height:1.03;margin:16px 0 12px}.lead{font-size:17px;line-height:1.75;color:var(--muted)}
    .panel,.metric,.tab-btn{background:var(--panel);border:1px solid var(--line);backdrop-filter:blur(10px);border-radius:24px}.panel{padding:18px}.metric-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:12px}.metric{padding:16px}.metric strong{display:block;font-size:28px;color:var(--gold)}.metric span{display:block;color:var(--muted);font-size:13px;margin-top:5px}
    .tabs{display:flex;gap:12px;flex-wrap:wrap;margin:18px 0}.tab-btn{padding:14px 18px;color:var(--text);cursor:pointer}.tab-btn.active{outline:2px solid rgba(255,211,111,.32);background:linear-gradient(135deg,rgba(255,211,111,.14),rgba(124,160,255,.10))}
    .workspace{padding:10px 0 36px}.frame-wrap{display:none}.frame-wrap.active{display:block}.frame-card{background:var(--panel);border:1px solid var(--line);border-radius:28px;overflow:hidden}.frame-head{display:flex;justify-content:space-between;align-items:center;gap:14px;padding:16px 18px;border-bottom:1px solid rgba(255,255,255,.06)}.frame-head h2{margin:0;font-size:26px}.frame-head p{margin:6px 0 0;color:var(--muted);font-size:14px}.open-link{font-size:14px;color:#dbe7ff}.frame{width:100%;height:1600px;border:0;background:#091324}
    @media (max-width:980px){.hero-grid,.metric-grid{grid-template-columns:1fr}.frame{height:1800px}} @media (max-width:640px){h1{font-size:40px}.nav{position:static;flex-direction:column;align-items:flex-start}}
  </style>
</head>
<body>
  <div class="container">
    <nav class="nav">
      <div class="brand"><div class="brand-badge">U</div><div>Unified Product Intelligence Dashboard</div></div>
      <div class="nav-links"><a class="nav-link" href="/">Home</a><a class="nav-link" href="/viral.html">Viral</a><a class="nav-link" href="/ranker.html">Ranker</a><a class="btn" href="/">Back to Homepage</a></div>
    </nav>
    <section class="hero">
      <div class="hero-grid">
        <div><div class="pill">One workspace • Two engines • Same modern UI shell</div><h1>Use one dashboard for viral discovery and product ranking.</h1><p class="lead">This unified workspace brings your two analysis modes together: browse current viral opportunities, then switch instantly to the product ranker to score your own candidates without leaving the dashboard.</p></div>
        <div class="panel"><div class="metric-grid"><div class="metric"><strong>2</strong><span>Integrated analysis modes</span></div><div class="metric"><strong>1</strong><span>Single dashboard workspace</span></div><div class="metric"><strong>AI</strong><span>Research-driven product workflow</span></div></div></div>
      </div>
    </section>
    <section class="workspace">
      <div class="tabs">
        <button class="tab-btn active" data-tab="viral">Viral Opportunity Explorer</button>
        <button class="tab-btn" data-tab="ranker">Product Ranker AI</button>
      </div>
      <div id="viralTab" class="frame-wrap active">
        <div class="frame-card">
          <div class="frame-head"><div><h2>Viral Opportunity Explorer</h2><p>Filter, compare, and explore current product opportunities.</p></div><a class="open-link" href="/viral.html" target="_blank" rel="noreferrer">Open this view alone ↗</a></div>
          <iframe class="frame" src="/viral.html" loading="eager"></iframe>
        </div>
      </div>
      <div id="rankerTab" class="frame-wrap">
        <div class="frame-card">
          <div class="frame-head"><div><h2>Product Ranker AI</h2><p>Paste product candidates and rank them with the translated Python scoring logic.</p></div><a class="open-link" href="/ranker.html" target="_blank" rel="noreferrer">Open this view alone ↗</a></div>
          <iframe class="frame" src="/ranker.html" loading="lazy"></iframe>
        </div>
      </div>
    </section>
  </div>
  <script>
    const buttons = Array.from(document.querySelectorAll('.tab-btn'));
    const viralTab = document.getElementById('viralTab');
    const rankerTab = document.getElementById('rankerTab');
    buttons.forEach(btn => btn.addEventListener('click', () => {
      buttons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const tab = btn.dataset.tab;
      viralTab.classList.toggle('active', tab === 'viral');
      rankerTab.classList.toggle('active', tab === 'ranker');
    }));
  </script>
</body>
</html>`;
  return new Response(html, { headers: { 'content-type': 'text/html; charset=UTF-8', 'cache-control': 'no-store' } });
};