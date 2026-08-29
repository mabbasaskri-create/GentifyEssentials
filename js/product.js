/* ==========================================================================
   GENTIFY ESSENTIALS — product detail page
   Renders a single product from the URL (?id=...) with gallery, info,
   tabs and related products. Mirrors the askri-fragrances detail layout.
   ========================================================================== */

var productPageQty = 1;

function getUrlParam(k) {
  var m = location.search.match(new RegExp("[?&]" + k + "=([^&]+)"));
  return m ? decodeURIComponent(m[1].replace(/\+/g, " ")) : null;
}

function productImages(p) {
  return (p && p.images && p.images.length)
    ? p.images
    : (p && p.image ? [p.image] : []);
}

function changeProductQty(delta) {
  productPageQty = Math.max(1, productPageQty + delta);
  var el = document.getElementById("pdQty");
  if (el) el.textContent = productPageQty;
}

function openProductImage(src, thumb) {
  var main = document.getElementById("pdMainImg");
  if (main) main.src = src;
  if (thumb) {
    Array.prototype.forEach.call(document.querySelectorAll(".pd-thumb"), function (t) {
      t.classList.remove("active");
    });
    thumb.classList.add("active");
  }
}

function renderProductTabs(p) {
  var heads = document.getElementById("tabHeads");
  var bodies = document.getElementById("tabBodies");
  if (!heads || !bodies) return;

  var catLabel = (CATEGORY_META[p.category] && CATEGORY_META[p.category].label) || p.category;

  var details = [];
  if (p.tags && p.tags.length) {
    details.push('<p><strong>Highlights:</strong> ' + p.tags.join(", ") + '</p>');
  }
  details.push('<p><strong>Category:</strong> ' + catLabel + '</p>');
  if (p.sizes && p.sizes.length) {
    details.push('<p><strong>Sizes:</strong> ' + p.sizes.join(", ") + '</p>');
  }
  details.push('<p><strong>Price:</strong> ' + formatPKR(p.price) + '</p>');
  details.push('<p><strong>Shipping:</strong> Free on all orders across Pakistan.</p>');
  details.push('<p><strong>Returns:</strong> 30-day returns, no questions asked.</p>');

  var reviewsHtml =
    '<div class="review-summary"><span class="score">' + p.rating + '</span>' +
    '<span class="label">' + starString(p.rating) + '<br>Based on ' + productReviewCount(p) + ' verified reviews</span></div>' +
    productReviews(p).map(function (r) {
      return '<div class="review-item">' +
        '<div class="head"><strong>' + r.name + '</strong>' +
        '<span class="rating">' + starString(r.rating) + '</span></div>' +
        '<p>' + r.text + '</p>' +
      '</div>';
    }).join("");

  heads.innerHTML =
    '<button class="tab-head active" data-tab="tab-desc" type="button">Description</button>' +
    '<button class="tab-head" data-tab="tab-details" type="button">Details</button>' +
    '<button class="tab-head" data-tab="tab-reviews" type="button">Reviews</button>';

  bodies.innerHTML =
    '<div class="tab-body active" id="tab-desc"><p>' + p.desc + '</p></div>' +
    '<div class="tab-body" id="tab-details">' + details.join("") + '</div>' +
    '<div class="tab-body" id="tab-reviews">' + reviewsHtml + '</div>';

  Array.prototype.forEach.call(document.querySelectorAll(".tab-head"), function (h) {
    h.addEventListener("click", function () {
      Array.prototype.forEach.call(document.querySelectorAll(".tab-head"), function (x) {
        x.classList.remove("active");
      });
      Array.prototype.forEach.call(document.querySelectorAll(".tab-body"), function (x) {
        x.classList.remove("active");
      });
      h.classList.add("active");
      var body = document.getElementById(h.dataset.tab);
      if (body) body.classList.add("active");
    });
  });
}

function renderProductPage() {
  var id = getUrlParam("id");
  var detail = document.getElementById("productDetail");
  if (!detail) return;

  var p = id ? findProduct(id) : null;

  if (!p) {
    var tabsSec = document.getElementById("pdTabsSection");
    var relSec = document.getElementById("relatedSection");
    if (tabsSec) tabsSec.style.display = "none";
    if (relSec) relSec.style.display = "none";
    document.title = "Product Not Found — Gentify Essentials";
    detail.innerHTML =
      '<div class="no-results" style="padding:90px 20px;">' +
        '<h2 style="font-family:var(--ff-display);font-size:26px;color:var(--navy);margin-bottom:14px;">Product not found</h2>' +
        '<p>This product may have been removed. <a href="index.html" style="color:var(--gold);font-weight:600;">Continue shopping →</a></p>' +
      '</div>';
    return;
  }

  document.title = p.name + " — Gentify Essentials";
  if (typeof setWhatsAppProduct === "function") setWhatsAppProduct(p.name);

  var catLabel = (CATEGORY_META[p.category] && CATEGORY_META[p.category].label) || p.category;
  var crumb = document.getElementById("productBreadcrumb");
  if (crumb) {
    crumb.innerHTML =
      '<a href="index.html">Home</a><span class="sep">/</span>' +
      '<a href="' + p.category + '.html">' + catLabel + '</a><span class="sep">/</span>' +
      '<span class="current">' + p.name + '</span>';
  }

  var nav = document.querySelector('.nav-links a[href="' + p.category + '.html"]');
  if (nav) nav.classList.add("active");

  var badge = p.badge ? '<span class="card-badge' + (p.badge === "Sale" ? " sale" : "") + '">' + p.badge + '</span>' : "";
  var oldPrice = p.oldPrice ? '<span class="old">' + formatPKR(p.oldPrice) + '</span>' : "";
  var save = p.oldPrice
    ? '<span class="save">Save ' + Math.round((1 - p.price / p.oldPrice) * 100) + '%</span>'
    : "";
  var sizes = (p.sizes && p.sizes.length)
    ? '<div class="pd-sizes"><h4>Select Size</h4>' +
      p.sizes.map(function (s) { return '<span class="size-badge">' + s + '</span>'; }).join("") +
      '</div>'
    : "";
  var tags = (p.tags && p.tags.length)
    ? '<div class="pd-tags">' + p.tags.map(function (t) { return '<span class="pd-tag">' + t + '</span>'; }).join("") + '</div>'
    : "";

  var imgs = productImages(p);
  var imageSrc = imgs[0] || "";
  var thumbs = imgs.length > 1
    ? '<div class="pd-thumbs">' + imgs.map(function (src, i) {
        return '<img class="pd-thumb' + (i === 0 ? " active" : "") + '" src="' + src +
          '" alt="' + p.name + ' ' + (i + 1) + '" data-src="' + src + '" loading="lazy">';
      }).join("") + '</div>'
    : "";

  detail.innerHTML =
    '<div class="pd-gallery">' + badge +
      '<div class="pd-main"><img id="pdMainImg" src="' + imageSrc + '" alt="' + p.name + '"></div>' +
      thumbs +
    '</div>' +
    '<div class="pd-info">' +
      '<div class="card-cat">' + catLabel + '</div>' +
      '<h1>' + p.name + '</h1>' +
      '<div class="pd-rating">' + starString(p.rating) + ' <span>(' + productReviewCount(p) + ' reviews)</span></div>' +
      '<div class="pd-price"><span class="now">' + formatPKR(p.price) + '</span>' + oldPrice + save + '</div>' +
      '<p class="pd-desc">' + p.desc + '</p>' +
      tags +
      sizes +
      '<div class="pd-buy">' +
        '<div class="qty">' +
          '<button type="button" onclick="changeProductQty(-1)" aria-label="Decrease quantity">−</button>' +
          '<span class="qty-val" id="pdQty">1</span>' +
          '<button type="button" onclick="changeProductQty(1)" aria-label="Increase quantity">+</button>' +
        '</div>' +
        '<button class="btn btn-outline" type="button" onclick="addToCart(\'' + p.id + '\', productPageQty)">Add to Cart</button>' +
        '<button class="btn btn-primary" type="button" onclick="buyNow(\'' + p.id + '\', productPageQty)">Buy Now</button>' +
      '</div>' +
      '<div class="pd-meta">' +
        '<p><strong>SKU:</strong> ' + p.id.toUpperCase() + '</p>' +
        '<p><strong>Category:</strong> ' + catLabel + '</p>' +
        '<p><strong>Availability:</strong> In stock · Ships in 3–5 days</p>' +
        '<p><strong>Delivery:</strong> Free on all orders</p>' +
      '</div>' +
    '</div>';

  Array.prototype.forEach.call(document.querySelectorAll(".pd-thumb"), function (t) {
    t.addEventListener("click", function () {
      openProductImage(t.dataset.src, t);
    });
  });

  var tabsSec = document.getElementById("pdTabsSection");
  if (tabsSec) tabsSec.style.display = "";
  renderProductTabs(p);

  var relSec = document.getElementById("relatedSection");
  var relGrid = document.getElementById("relatedGrid");
  if (relGrid) {
    var rel = PRODUCTS.filter(function (x) {
      return x.category === p.category && x.id !== p.id;
    }).slice(0, 4);
    renderGrid("relatedGrid", rel);
    if (relSec) relSec.style.display = rel.length ? "" : "none";
  }

  window.scrollTo(0, 0);
  if (typeof prefetchProductImages === "function") prefetchProductImages([p]);
}

function initProductPage() {
  if (typeof cacheGet === "function") {
    var cachedProducts = cacheGet("products");
    if (cachedProducts && cachedProducts.length) mergeProductCatalog(cachedProducts);
  }
  renderProductPage();
  if (typeof fsLoadProducts === "function") {
    fsLoadProducts(function (list) {
      if (list && list.length) mergeProductCatalog(list);
      renderProductPage();
    }, function (list) {
      if (list && list.length) mergeProductCatalog(list);
      renderProductPage();
    });
  }
}

initProductPage();