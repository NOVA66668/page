const statusBox = document.getElementById("statusBox");
const statusPill = document.getElementById("statusPill");
const storesBody = document.getElementById("storesBody");
const productsGrid = document.getElementById("productsGrid");
const storeCount = document.getElementById("storeCount");
const productCount = document.getElementById("productCount");
const scanBtn = document.getElementById("scanBtn");
const refreshBtn = document.getElementById("refreshBtn");
const clearBtn = document.getElementById("clearBtn");
const domainsBox = document.getElementById("domains");
const daysFilter = document.getElementById("daysFilter");

function setStatus(label, detail) {
  statusPill.textContent = label;
  statusBox.textContent = detail;
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

async function loadStores() {
  try {
    const res = await fetch("/api/stores");
    const data = await res.json();

    const stores = data.stores || [];
    const products = data.products || [];

    storeCount.textContent = `${stores.length} stores`;
    productCount.textContent = `${products.length} products`;

    storesBody.innerHTML = stores.map(s => `
      <tr>
        <td><a href="https://${s.domain}" target="_blank" rel="noreferrer">${s.domain}</a><br><small>${s.title || ""}</small></td>
        <td>${s.platform || "unknown"}</td>
        <td>${s.domain_age_days ?? "unknown"}</td>
        <td>${fmtDate(s.domain_registered_at)}</td>
        <td>${fmtDate(s.first_product_seen_at)}</td>
        <td>${s.age_confidence ?? 0}</td>
        <td>${s.products_count ?? 0}</td>
        <td>${s.sold_out_count ?? 0}</td>
        <td>${s.score ?? 0}</td>
      </tr>
    `).join("");

    productsGrid.innerHTML = products.slice(0, 60).map(p => `
      <article class="product-card">
        <h3>${p.title || "Untitled product"}</h3>
        <div class="meta">${p.store_domain || ""}</div>
        <div class="meta">${p.price || "Price not found"} ${p.currency || ""}</div>
        <div class="meta"><a href="${p.url || "#"}" target="_blank" rel="noreferrer">${p.url || "No URL"}</a></div>
        ${productTag(p.availability)}
      </article>
    `).join("");

    setStatus("Ready", "Results loaded successfully.");
  } catch (err) {
    setStatus("Error", `Could not load results.\n${err}`);
  }
}

async function runScan() {
  scanBtn.disabled = true;
  setStatus("Running", "Starting scan…");
  try {
    const domains = domainsBox.value
      .split("\n")
      .map(x => x.trim())
      .filter(Boolean);

    const res = await fetch("/api/scan", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        domains,
        days: Number(daysFilter.value || 30)
      })
    });
    const data = await res.json();
    setStatus("Completed", JSON.stringify(data, null, 2));
    await loadStores();
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
    setStatus("Cleared", JSON.stringify(data, null, 2));
    await loadStores();
  } catch (err) {
    setStatus("Error", `Clear failed.\n${err}`);
  } finally {
    clearBtn.disabled = false;
  }
}

scanBtn.addEventListener("click", runScan);
refreshBtn.addEventListener("click", loadStores);
clearBtn.addEventListener("click", clearAllData);
loadStores();
