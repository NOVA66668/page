const statusBox = document.getElementById("statusBox");
const statusPill = document.getElementById("statusPill");
const storesBody = document.getElementById("storesBody");
const productsGrid = document.getElementById("productsGrid");
const storeCount = document.getElementById("storeCount");
const productCount = document.getElementById("productCount");
const scanCount = document.getElementById("scanCount");
const scanHistory = document.getElementById("scanHistory");
const scanBtn = document.getElementById("scanBtn");
const refreshBtn = document.getElementById("refreshBtn");
const clearBtn = document.getElementById("clearBtn");
const domainsBox = document.getElementById("domains");
const daysFilter = document.getElementById("daysFilter");
const storesMetric = document.getElementById("storesMetric");
const productsMetric = document.getElementById("productsMetric");
const scansMetric = document.getElementById("scansMetric");
const topMetric = document.getElementById("topMetric");
const detailPill = document.getElementById("detailPill");
const storeDetails = document.getElementById("storeDetails");

const state = {
  stores: [],
  products: [],
  scans: [],
  selectedDomain: null,
};

function setStatus(label, detail) {
  statusPill.textContent = label;
  statusBox.textContent = typeof detail === "string" ? detail : JSON.stringify(detail, null, 2);
}

function productTag(av) {
  if (av === "sold_out") return `<span class="tag sold_out">Sold out signal</span>`;
  if (av === "in_stock") return `<span class="tag in_stock">In stock signal</span>`;
  return `<span class="tag">Unknown availability</span>`;
}

function fmtDate(value) {
  if (!value) return "unknown";
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? String(value) : d.toISOString().slice(0, 10);
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function selectStore(domain) {
  state.selectedDomain = domain;
  renderStoreDetails();
  renderStores();
}

function renderMetrics() {
  storesMetric.textContent = String(state.stores.length);
  productsMetric.textContent = String(state.products.length);
  scansMetric.textContent = String(state.scans.length);
  topMetric.textContent = state.stores[0]?.domain || "—";
}

function renderStores() {
  storeCount.textContent = `${state.stores.length} stores`;
  storesBody.innerHTML = state.stores.map((s) => {
    const isActive = state.selectedDomain === s.domain;
    return `
      <tr class="store-row ${isActive ? "active" : ""}" data-domain="${escapeHtml(s.domain)}">
        <td>
          <button class="row-link" data-domain="${escapeHtml(s.domain)}">${escapeHtml(s.domain)}</button>
          <br><small>${escapeHtml(s.title || "")}</small>
        </td>
        <td>${escapeHtml(s.recent_product_count ?? 0)}</td>
        <td>${escapeHtml(fmtDate(s.first_recent_product_at))}</td>
        <td>${escapeHtml(fmtDate(s.approximate_first_product_at))}</td>
        <td>${escapeHtml(s.country_guess || "unknown")}</td>
        <td>${escapeHtml(s.score ?? 0)}</td>
      </tr>
    `;
  }).join("");

  document.querySelectorAll(".row-link").forEach((button) => {
    button.addEventListener("click", () => selectStore(button.dataset.domain));
  });
}

function renderProducts() {
  const filtered = state.selectedDomain
    ? state.products.filter((p) => p.store_domain === state.selectedDomain)
    : state.products;

  productCount.textContent = `${filtered.length} products`;
  productsGrid.innerHTML = filtered.slice(0, 80).map((p) => `
    <article class="product-card">
      <h3>${escapeHtml(p.title || "Untitled product")}</h3>
      <div class="meta">${escapeHtml(p.store_domain || "")}</div>
      <div class="meta">Price: ${escapeHtml(p.price || "not found")} ${escapeHtml(p.currency || "")}</div>
      <div class="meta">Created: ${escapeHtml(fmtDate(p.remote_created_at))}</div>
      <div class="meta">Published: ${escapeHtml(fmtDate(p.remote_published_at))}</div>
      <div class="meta">Updated: ${escapeHtml(fmtDate(p.remote_updated_at))}</div>
      <div class="meta"><a href="${escapeHtml(p.url || "#")}" target="_blank" rel="noreferrer">Open product</a></div>
      ${productTag(p.availability)}
    </article>
  `).join("");
}

function renderScans() {
  scanCount.textContent = `${state.scans.length} scans`;
  scanHistory.innerHTML = state.scans.map((scan) => `
    <article class="scan-item">
      <strong>#${escapeHtml(scan.id)}</strong>
      <div class="meta">Started: ${escapeHtml(fmtDate(scan.started_at))}</div>
      <div class="meta">Status: ${escapeHtml(scan.status || "unknown")}</div>
      <div class="meta">Stores: ${escapeHtml(scan.stores_found ?? 0)} | Products: ${escapeHtml(scan.products_found ?? 0)}</div>
      <div class="meta">Note: ${escapeHtml(scan.note || "")}</div>
    </article>
  `).join("") || '<div class="details-empty">No scan history yet.</div>';
}

function renderStoreDetails() {
  if (!state.selectedDomain) {
    detailPill.textContent = "No selection";
    storeDetails.innerHTML = 'Select a store row to inspect its products and metadata.';
    return;
  }

  const store = state.stores.find((s) => s.domain === state.selectedDomain);
  if (!store) {
    detailPill.textContent = "Missing";
    storeDetails.innerHTML = 'The selected store is no longer in the current result set.';
    return;
  }

  const products = state.products.filter((p) => p.store_domain === store.domain);
  detailPill.textContent = store.domain;
  storeDetails.innerHTML = `
    <div class="detail-block">
      <h3>${escapeHtml(store.title || store.domain)}</h3>
      <div class="detail-grid">
        <div><span class="detail-label">Domain</span><strong>${escapeHtml(store.domain)}</strong></div>
        <div><span class="detail-label">Platform</span><strong>${escapeHtml(store.platform || "unknown")}</strong></div>
        <div><span class="detail-label">Country</span><strong>${escapeHtml(store.country_guess || "unknown")}</strong></div>
        <div><span class="detail-label">Currency</span><strong>${escapeHtml(store.currency_guess || "unknown")}</strong></div>
        <div><span class="detail-label">Recent products</span><strong>${escapeHtml(store.recent_product_count ?? 0)}</strong></div>
        <div><span class="detail-label">Total products</span><strong>${escapeHtml(store.products_count ?? 0)}</strong></div>
        <div><span class="detail-label">First recent</span><strong>${escapeHtml(fmtDate(store.first_recent_product_at))}</strong></div>
        <div><span class="detail-label">Last updated</span><strong>${escapeHtml(fmtDate(store.last_product_updated_at))}</strong></div>
        <div><span class="detail-label">Approx first product</span><strong>${escapeHtml(fmtDate(store.approximate_first_product_at))}</strong></div>
        <div><span class="detail-label">Score</span><strong>${escapeHtml(store.score ?? 0)}</strong></div>
      </div>
      <div class="detail-meta">Discovery: ${escapeHtml(store.discovery_method || "unknown")}</div>
      <div class="detail-meta"><a href="https://${escapeHtml(store.domain)}" target="_blank" rel="noreferrer">Open store</a></div>
    </div>
    <div class="detail-block">
      <h3>Store products (${products.length})</h3>
      <div class="detail-products">
        ${products.slice(0, 20).map((p) => `
          <div class="detail-product-item">
            <strong>${escapeHtml(p.title)}</strong>
            <span>${escapeHtml(fmtDate(p.remote_created_at))}</span>
          </div>
        `).join("") || '<div class="details-empty">No products linked to this store.</div>'}
      </div>
    </div>
  `;
}

async function loadStores() {
  const res = await fetch("/api/stores");
  const data = await res.json();
  state.stores = data.stores || [];
  state.products = data.products || [];

  if (state.selectedDomain && !state.stores.some((s) => s.domain === state.selectedDomain)) {
    state.selectedDomain = state.stores[0]?.domain || null;
  }
  if (!state.selectedDomain && state.stores.length) {
    state.selectedDomain = state.stores[0].domain;
  }

  renderMetrics();
  renderStores();
  renderProducts();
  renderStoreDetails();
}

async function loadScans() {
  const res = await fetch("/api/scans");
  const data = await res.json();
  state.scans = data.scans || [];
  renderMetrics();
  renderScans();
}

async function loadAll() {
  try {
    await Promise.all([loadStores(), loadScans()]);
    setStatus("Ready", "Dashboard data loaded successfully.");
  } catch (err) {
    setStatus("Error", `Could not load dashboard data.\n${err}`);
  }
}

async function runScan() {
  scanBtn.disabled = true;
  setStatus("Running", "Scanning stores and refreshing dashboard data…");
  try {
    const domains = domainsBox.value.split("\n").map((x) => x.trim()).filter(Boolean);
    const res = await fetch("/api/scan", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ domains, days: Number(daysFilter.value || 30) })
    });
    const data = await res.json();
    setStatus("Completed", data);
    await loadAll();
  } catch (err) {
    setStatus("Error", `Scan failed.\n${err}`);
  } finally {
    scanBtn.disabled = false;
  }
}

async function clearAllData() {
  const confirmed = window.confirm("Delete all saved stores, products, and scan history?");
  if (!confirmed) return;
  clearBtn.disabled = true;
  setStatus("Clearing", "Deleting all saved data…");
  try {
    const res = await fetch("/api/clear", { method: "POST" });
    const data = await res.json();
    state.selectedDomain = null;
    setStatus("Cleared", data);
    await loadAll();
  } catch (err) {
    setStatus("Error", `Clear failed.\n${err}`);
  } finally {
    clearBtn.disabled = false;
  }
}

scanBtn.addEventListener("click", runScan);
refreshBtn.addEventListener("click", loadAll);
clearBtn.addEventListener("click", clearAllData);
loadAll();
