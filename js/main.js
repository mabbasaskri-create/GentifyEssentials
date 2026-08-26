/* ==========================================================================
   GENTIFY ESSENTIALS — shared UI behavior
   ========================================================================== */

function starString(rating){
  const full = Math.round(rating);
  return "★".repeat(full) + "☆".repeat(5 - full);
}

function productCard(p){
  const badge = p.badge ? `<span class="card-badge ${p.badge === 'Sale' ? 'sale' : ''}">${p.badge}</span>` : "";
  const oldPrice = p.oldPrice ? `<span class="price-old">${formatPKR(p.oldPrice)}</span>` : "";
  return `
  <article class="card" data-id="${p.id}">
    <div class="card-media" onclick="openQuickView('${p.id}')">
      ${badge}
      <img src="${p.image}" alt="${p.name}" loading="lazy">
      <div class="card-quick">Quick View</div>
    </div>
    <div class="card-body">
      <div class="card-cat">${CATEGORY_META[p.category].label}</div>
      <div class="card-name">${p.name}</div>
      <div class="card-rating">${starString(p.rating)} <span>(${p.reviews || 0})</span></div>
      <div class="price-row">
        <span class="price">${formatPKR(p.price)}</span>
        ${oldPrice}
      </div>
      <div class="card-actions">
        <button class="btn btn-outline" onclick="openQuickView('${p.id}')">Quick View</button>
        <button class="btn btn-primary" onclick="addToCart('${p.id}', 1)">Add to Cart</button>
      </div>
    </div>
  </article>`;
}

function renderGrid(containerId, list){
  const el = document.getElementById(containerId);
  if(!el) return;
  el.innerHTML = list.length
    ? list.map(productCard).join("")
    : `<div class="no-results">No products match these filters just yet — try a different combination.</div>`;
}

/* ---------------- Quick view modal ---------------- */
let quickViewQty = 1;
let quickViewId = null;

function openQuickView(id){
  const p = findProduct(id);
  if(!p) return;
  quickViewId = id;
  quickViewQty = 1;
  const oldPrice = p.oldPrice ? `<span class="price-old">${formatPKR(p.oldPrice)}</span>` : "";
  const sizes = p.sizes ? `<div class="badge-row">${p.sizes.map(s => `<span class="mini-badge">${s}</span>`).join("")}</div>` : "";
  document.getElementById("modalBody").innerHTML = `
    <div class="modal-media"><img src="${p.image}" alt="${p.name}"></div>
    <div class="modal-info">
      <div class="card-cat">${CATEGORY_META[p.category].label}</div>
      <h2>${p.name}</h2>
      <div class="card-rating">${starString(p.rating)} <span>(${p.reviews || 0} reviews)</span></div>
      <div class="price-row"><span class="price">${formatPKR(p.price)}</span>${oldPrice}</div>
      <p class="modal-desc">${p.desc}</p>
      ${sizes}
      <div class="modal-qty">
        <button class="qty-btn" onclick="changeQuickViewQty(-1)">−</button>
        <span class="qty-val" id="qvQty">1</span>
        <button class="qty-btn" onclick="changeQuickViewQty(1)">+</button>
      </div>
      <div class="modal-actions">
        <button class="btn btn-outline btn-block" onclick="addToCart('${p.id}', quickViewQty); closeQuickView();">Add to Cart</button>
        <button class="btn btn-primary btn-block" onclick="addToCart('${p.id}', quickViewQty); closeQuickView(); openCartDrawer();">Buy Now</button>
      </div>
      <div class="modal-meta">
        <span>🚚 Free shipping over Rs. 5,000</span>
        <span>🔁 30-day returns</span>
      </div>
    </div>`;
  document.getElementById("quickViewModal").classList.add("show");
}
function changeQuickViewQty(delta){
  quickViewQty = Math.max(1, quickViewQty + delta);
  document.getElementById("qvQty").textContent = quickViewQty;
}
function closeQuickView(){
  document.getElementById("quickViewModal").classList.remove("show");
}

/* ---------------- Category page filter/sort ---------------- */
function initCategoryPage(category){
  let activeFilter = "all";
  let activeSort = "featured";
  const all = PRODUCTS.filter(p => p.category === category);

  function apply(){
    let list = [...all];
    if(activeFilter === "sale") list = list.filter(p => p.oldPrice);
    if(activeFilter === "new") list = list.filter(p => p.badge === "New");
    if(activeFilter === "bestseller") list = list.filter(p => p.badge === "Bestseller");

    if(activeSort === "price-asc") list.sort((a,b) => a.price - b.price);
    if(activeSort === "price-desc") list.sort((a,b) => b.price - a.price);
    if(activeSort === "rating") list.sort((a,b) => b.rating - a.rating);

    renderGrid("productGrid", list);
    const countEl = document.getElementById("resultCount");
    if(countEl) countEl.textContent = `${list.length} ${list.length === 1 ? "item" : "items"}`;
  }

  document.querySelectorAll(".chip[data-filter]").forEach(chip => {
    chip.addEventListener("click", () => {
      document.querySelectorAll(".chip[data-filter]").forEach(c => c.classList.remove("active"));
      chip.classList.add("active");
      activeFilter = chip.dataset.filter;
      apply();
    });
  });
  const sortSelect = document.getElementById("sortSelect");
  if(sortSelect){
    sortSelect.addEventListener("change", () => { activeSort = sortSelect.value; apply(); });
  }
  apply();
}

/* ---------------- Newsletter (demo, no backend) ---------------- */
function handleNewsletter(e){
  e.preventDefault();
  const input = e.target.querySelector("input");
  const note = document.getElementById("newsletterNote");
  if(input.value.trim()){
    note.textContent = "Thanks — you're on the list.";
    input.value = "";
  } else {
    note.textContent = "Enter a valid email to subscribe.";
  }
}

/* ---------------- Accordion (Returns / FAQ) ---------------- */
function initAccordion(){
  document.querySelectorAll(".accordion-item").forEach(item => {
    const head = item.querySelector(".accordion-head");
    const body = item.querySelector(".accordion-body");
    head.addEventListener("click", () => {
      const isOpen = item.classList.contains("open");
      document.querySelectorAll(".accordion-item").forEach(i => {
        i.classList.remove("open");
        i.querySelector(".accordion-body").style.maxHeight = null;
      });
      if(!isOpen){
        item.classList.add("open");
        body.style.maxHeight = body.scrollHeight + "px";
      }
    });
  });
}

/* ---------------- Global nav / drawer / modal wiring ---------------- */
document.addEventListener("DOMContentLoaded", () => {
  const menuToggle = document.getElementById("menuToggle");
  const navLinks = document.getElementById("navLinks");
  if(menuToggle){
    menuToggle.addEventListener("click", () => navLinks.classList.toggle("open"));
  }

  const cartBtn = document.getElementById("cartBtn");
  if(cartBtn) cartBtn.addEventListener("click", openCartDrawer);
  const drawerClose = document.getElementById("drawerClose");
  if(drawerClose) drawerClose.addEventListener("click", closeCartDrawer);
  const cartOverlay = document.getElementById("cartOverlay");
  if(cartOverlay) cartOverlay.addEventListener("click", closeCartDrawer);

  const modalClose = document.getElementById("modalClose");
  if(modalClose) modalClose.addEventListener("click", closeQuickView);
  const quickViewModal = document.getElementById("quickViewModal");
  if(quickViewModal){
    quickViewModal.addEventListener("click", (e) => {
      if(e.target === quickViewModal) closeQuickView();
    });
  }

  document.addEventListener("keydown", (e) => {
    if(e.key === "Escape"){ closeCartDrawer(); closeQuickView(); }
  });

  initAccordion();
  loadCollectionImages();
  loadHeroImage();
  loadCategoryHero();
});

function loadCategoryHero() {
  if (typeof fsLoadCollections === "undefined") return;
  var heroEl = document.getElementById("pageHero");
  var bgEl = document.getElementById("pageHeroBg");
  var fgEl = document.getElementById("pageHeroFg");
  if (!heroEl) return;
  var cat = heroEl.getAttribute("data-category");
  if (!cat) return;
  fsLoadCollections(function (cols) {
    var match = cols.find(function (c) { return c.id === cat; });
    if (match && match.image) {
      if (bgEl) bgEl.style.backgroundImage = "url(" + match.image + ")";
      if (fgEl) fgEl.style.backgroundImage = "url(" + match.image + ")";
      heroEl.classList.add("has-bg");
    }
  });
}

function loadHeroImage() {
  if (typeof fsLoadSettings === "undefined") return;
  var heroBg = document.getElementById("heroBg");
  var heroSection = document.getElementById("heroSection");
  if (!heroBg || !heroSection) return;
  fsLoadSettings(function (s) {
    if (s.heroImage) {
      heroBg.style.backgroundImage = "url(" + s.heroImage + ")";
      heroSection.classList.add("has-bg");
    }
  });
}

function loadCollectionImages() {
  if (typeof fsLoadCollections === "undefined") return;
  var ids = ["caps", "watches", "perfumes", "tshirts", "wallets"];
  fsLoadCollections(function (cols) {
    var map = {};
    cols.forEach(function (c) { map[c.id] = c.image; });
    ids.forEach(function (id) {
      var el = document.getElementById("colImg" + id.charAt(0).toUpperCase() + id.slice(1));
      if (el && map[id]) el.src = map[id];
    });
  });

  if (typeof db === "undefined") return;
  db.collection("products").get().then(function (snap) {
    var counts = {};
    snap.forEach(function (doc) {
      var cat = doc.data().category;
      if (cat) counts[cat] = (counts[cat] || 0) + 1;
    });
    ids.forEach(function (id) {
      var el = document.getElementById("colCount" + id.charAt(0).toUpperCase() + id.slice(1));
      if (el) {
        var n = counts[id] || 0;
        el.textContent = n + (n === 1 ? " Style" : (id === "perfumes" ? " Scents" : " Styles"));
      }
    });
  }).catch(function () {
    var counts = {};
    PRODUCTS.forEach(function (p) {
      counts[p.category] = (counts[p.category] || 0) + 1;
    });
    ids.forEach(function (id) {
      var el = document.getElementById("colCount" + id.charAt(0).toUpperCase() + id.slice(1));
      if (el) {
        var n = counts[id] || 0;
        el.textContent = n + (n === 1 ? " Style" : (id === "perfumes" ? " Scents" : " Styles"));
      }
    });
  });
}
