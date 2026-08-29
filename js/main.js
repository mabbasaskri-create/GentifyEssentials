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
  const url = "product.html?id=" + encodeURIComponent(p.id);
  return `
  <article class="card" data-id="${p.id}">
    <div class="card-media">
      ${badge}
      <a href="${url}" title="View ${p.name}"><img src="${p.image}" alt="${p.name}" loading="lazy"></a>
      <button class="card-quick" type="button" onclick="addToCart('${p.id}', 1)">Add to Cart</button>
    </div>
    <div class="card-body">
      <div class="card-cat">${CATEGORY_META[p.category].label}</div>
      <a class="card-name" href="${url}">${p.name}</a>
      <div class="card-rating">${starString(p.rating)} <span>(${productReviewCount(p)})</span></div>
      <div class="price-row">
        <span class="price">${formatPKR(p.price)}</span>
        ${oldPrice}
      </div>
      <div class="card-actions">
        <a class="btn btn-primary" href="${url}">Buy Now</a>
        <button class="btn btn-outline" onclick="addToCart('${p.id}', 1)">Add to Cart</button>
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

/* ===================== Mobile Drawer ===================== */
function injectMobileDrawer(){
  if(document.getElementById("mobileDrawer")) return;
  var navLinks = document.getElementById("navLinks");
  if(!navLinks) return;

  /* Build drawer HTML */
  var links = [];
  navLinks.querySelectorAll("a").forEach(function(a){
    var cls = a.classList.contains("active") ? " active" : "";
    links.push('<a href="' + a.getAttribute("href") + '" class="' + cls + '">' + a.textContent.trim() + '</a>');
  });

  var drawer = document.createElement("div");
  drawer.className = "mobile-drawer";
  drawer.id = "mobileDrawer";
  drawer.innerHTML =
    '<button class="mobile-drawer-close" id="mobileDrawerClose" aria-label="Close menu">&times;</button>' +
    '<div class="mobile-drawer-logo">GENTIFY<span class="dot">.</span></div>' +
    '<nav>' + links.join("") + '</nav>' +
    '<div class="mobile-drawer-auth" id="mobileDrawerAuth"></div>';

  var overlay = document.createElement("div");
  overlay.className = "mobile-overlay";
  overlay.id = "mobileOverlay";

  document.body.appendChild(drawer);
  document.body.appendChild(overlay);

  if (typeof window.updateMobileAuth === "function") window.updateMobileAuth();

  /* Wire events */
  document.getElementById("mobileDrawerClose").addEventListener("click", closeMobileDrawer);
  overlay.addEventListener("click", closeMobileDrawer);

  drawer.querySelectorAll("nav a").forEach(function(link){
    link.addEventListener("click", closeMobileDrawer);
  });
}

function openMobileDrawer(){
  injectMobileDrawer();
  if (typeof window.updateMobileAuth === "function") window.updateMobileAuth();
  document.getElementById("mobileDrawer").classList.add("open");
  document.getElementById("mobileOverlay").classList.add("show");
  document.body.style.overflow = "hidden";
}

function closeMobileDrawer(){
  var drawer = document.getElementById("mobileDrawer");
  var overlay = document.getElementById("mobileOverlay");
  if(drawer) drawer.classList.remove("open");
  if(overlay) overlay.classList.remove("show");
  document.body.style.overflow = "";
}

function toggleMobileDrawer(){
  var drawer = document.getElementById("mobileDrawer");
  if(drawer && drawer.classList.contains("open")){
    closeMobileDrawer();
  } else {
    openMobileDrawer();
  }
}

/* ===================== Global nav / drawer / modal wiring ===================== */
document.addEventListener("DOMContentLoaded", () => {
  const menuToggle = document.getElementById("menuToggle");
  if(menuToggle){
    menuToggle.addEventListener("click", toggleMobileDrawer);
  }

  const cartBtn = document.getElementById("cartBtn");
  if(cartBtn) cartBtn.addEventListener("click", openCartDrawer);
  const drawerClose = document.getElementById("drawerClose");
  if(drawerClose) drawerClose.addEventListener("click", closeCartDrawer);
  const cartOverlay = document.getElementById("cartOverlay");
  if(cartOverlay) cartOverlay.addEventListener("click", closeCartDrawer);

  document.addEventListener("keydown", (e) => {
    if(e.key === "Escape"){ closeCartDrawer(); closeMobileDrawer(); }
  });

  initAccordion();
  if (typeof fsLoadSiteBundle === "function") {
    fsLoadSiteBundle(applySiteBundle, applySiteBundle);
  } else {
    loadCollectionImages();
    loadHeroImage();
    loadCategoryHero();
  }
});

function prefetchImages(urls) {
  if (!urls || !urls.length) return;
  urls.forEach(function (url) {
    if (!url) return;
    var img = new Image();
    img.decoding = "async";
    img.src = url;
  });
}

function prefetchProductImages(products, limit) {
  limit = limit || 16;
  var urls = [];
  products.slice(0, limit).forEach(function (p) {
    if (p.image) urls.push(p.image);
    if (p.images) {
      p.images.forEach(function (u) { if (u) urls.push(u); });
    }
  });
  prefetchImages(urls);
}
window.prefetchProductImages = prefetchProductImages;

function applyCollectionImages(cols) {
  var ids = ["caps", "watches", "perfumes", "tshirts", "wallets"];
  var map = {};
  cols.forEach(function (c) { map[c.id] = c.image; });
  var urls = [];
  ids.forEach(function (id) {
    var el = document.getElementById("colImg" + id.charAt(0).toUpperCase() + id.slice(1));
    if (el && map[id]) {
      el.src = map[id];
      urls.push(map[id]);
    }
  });
  prefetchImages(urls);
}

function applyCategoryHeroFromCollections(cols) {
  var heroEl = document.getElementById("pageHero");
  var bgEl = document.getElementById("pageHeroBg");
  var fgEl = document.getElementById("pageHeroFg");
  if (!heroEl) return;
  var cat = heroEl.getAttribute("data-category");
  if (!cat) return;
  var match = cols.find(function (c) { return c.id === cat; });
  if (match && match.image) {
    if (bgEl) bgEl.style.backgroundImage = "url(" + match.image + ")";
    if (fgEl) fgEl.style.backgroundImage = "url(" + match.image + ")";
    heroEl.classList.add("has-bg");
    prefetchImages([match.image]);
  }
}

function applyCollectionCountsFromProducts(products) {
  var ids = ["caps", "watches", "perfumes", "tshirts", "wallets"];
  var counts = {};
  products.forEach(function (p) {
    if (p.category) counts[p.category] = (counts[p.category] || 0) + 1;
  });
  ids.forEach(function (id) {
    var el = document.getElementById("colCount" + id.charAt(0).toUpperCase() + id.slice(1));
    if (el) {
      var n = counts[id] || 0;
      el.textContent = n + (n === 1 ? " Style" : (id === "perfumes" ? " Scents" : " Styles"));
    }
  });
}

function applySiteBundle(bundle) {
  if (!bundle) return;
  if (bundle.products && bundle.products.length && typeof mergeProductCatalog === "function") {
    mergeProductCatalog(bundle.products);
  }
  if (bundle.settings && bundle.settings.heroImage) {
    var heroBg = document.getElementById("heroBg");
    var heroSection = document.getElementById("heroSection");
    if (heroBg && heroSection) {
      heroBg.style.backgroundImage = "url(" + bundle.settings.heroImage + ")";
      heroSection.classList.add("has-bg");
      prefetchImages([bundle.settings.heroImage]);
    }
  }
  if (bundle.collections && bundle.collections.length) {
    applyCollectionImages(bundle.collections);
    applyCategoryHeroFromCollections(bundle.collections);
  }
  applyCollectionCountsFromProducts(bundle.products || PRODUCTS);
  prefetchProductImages(bundle.products || PRODUCTS);
}

function loadCategoryHero() {
  if (typeof fsLoadCollections === "undefined") return;
  fsLoadCollections(function (cols) {
    applyCategoryHeroFromCollections(cols);
  });
}

function loadHeroImage() {
  if (typeof fsLoadSettings === "undefined") return;
  fsLoadSettings(function (s) {
    if (s.heroImage) {
      var heroBg = document.getElementById("heroBg");
      var heroSection = document.getElementById("heroSection");
      if (heroBg && heroSection) {
        heroBg.style.backgroundImage = "url(" + s.heroImage + ")";
        heroSection.classList.add("has-bg");
        prefetchImages([s.heroImage]);
      }
    }
  });
}

function loadCollectionImages() {
  if (typeof fsLoadCollections === "undefined") return;
  fsLoadCollections(function (cols) {
    applyCollectionImages(cols);
  });
  applyCollectionCountsFromProducts(PRODUCTS);
}
