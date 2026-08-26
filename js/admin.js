/* ==========================================================================
   GENTIFY ESSENTIALS — Admin Panel (Firestore)
   ========================================================================== */

var editedProductId = null;
var allProducts = [];
var selectedImages = [null, null, null, null];

function renderAdminStats(products, orders) {
  document.getElementById("statProducts").textContent = products.length;

  var cats = {};
  products.forEach(function (p) { cats[p.category] = true; });
  document.getElementById("statCategories").textContent = Object.keys(cats).length;

  var total = products.reduce(function (sum, p) { return sum + (p.price || 0); }, 0);
  document.getElementById("statValue").textContent = formatPKR(total);

  document.getElementById("statOrders").textContent = orders.length;
}

function renderAdminTable(filter) {
  var products = allProducts.slice();
  if (filter && filter !== "all") {
    products = products.filter(function (p) { return p.category === filter; });
  }

  var tbody = document.getElementById("adminProductBody");
  tbody.innerHTML = products.map(function (p) {
    var oldP = p.oldPrice ? formatPKR(p.oldPrice) : "—";
    var badge = p.badge || "—";
    var catLabel = (typeof CATEGORY_META !== "undefined" && CATEGORY_META[p.category]) ? CATEGORY_META[p.category].label : p.category;
    var imgs = p.images || (p.image ? [p.image] : []);
    var thumb = imgs.length > 0 ? imgs[0] : "";
    return '<tr>' +
      '<td><img src="' + thumb + '" alt="" style="width:48px;height:48px;object-fit:cover;"></td>' +
      '<td><strong>' + (p.name || "") + '</strong></td>' +
      '<td>' + catLabel + '</td>' +
      '<td>' + formatPKR(p.price || 0) + '</td>' +
      '<td>' + oldP + '</td>' +
      '<td>' + badge + '</td>' +
      '<td>' + (p.rating || 0) + ' ★</td>' +
      '<td>' +
        '<button class="admin-action-btn" onclick="editProduct(\'' + p.id + '\')">Edit</button> ' +
        '<button class="admin-action-btn admin-action-delete" onclick="deleteProduct(\'' + p.id + '\')">Delete</button>' +
      '</td>' +
    '</tr>';
  }).join("");

  if (products.length === 0) {
    tbody.innerHTML = '<tr><td colspan="8" style="text-align:center;color:#7c8797;padding:40px;">No products found.</td></tr>';
  }
}

function renderAdminOrders(orders) {
  var tbody = document.getElementById("adminOrdersBody");
  var empty = document.getElementById("ordersEmpty");

  if (orders.length === 0) {
    tbody.innerHTML = "";
    empty.style.display = "block";
    return;
  }

  empty.style.display = "none";
  tbody.innerHTML = orders.map(function (o) {
    var items = (o.items || []).map(function (i) { return (i.name || i.id) + " x" + i.qty; }).join(", ");
    var date = o.createdAt ? new Date(o.createdAt.seconds * 1000).toLocaleDateString() : "—";
    return '<tr>' +
      '<td>' + date + '</td>' +
      '<td>' + items + '</td>' +
      '<td>' + formatPKR(o.total || 0) + '</td>' +
      '<td><span class="admin-badge">' + (o.status || "pending") + '</span></td>' +
    '</tr>';
  }).join("");
}

function resetImageSlots() {
  selectedImages = [null, null, null, null];
  for (var i = 0; i < 4; i++) {
    var slot = document.getElementById("pfSlot" + i);
    slot.classList.remove("has-image");
    document.getElementById("pfImagePreview" + i).innerHTML = '<span>' + (i + 1) + '</span>';
  }
}

function setImageSlot(slotIndex, src) {
  if (slotIndex < 0 || slotIndex > 3) return;
  selectedImages[slotIndex] = src;
  var slot = document.getElementById("pfSlot" + slotIndex);
  slot.classList.add("has-image");
  document.getElementById("pfImagePreview" + slotIndex).innerHTML = '<img src="' + src + '">';
}

function removeImageSlot(slotIndex) {
  selectedImages[slotIndex] = null;
  var slot = document.getElementById("pfSlot" + slotIndex);
  slot.classList.remove("has-image");
  document.getElementById("pfImagePreview" + slotIndex).innerHTML = '<span>' + (slotIndex + 1) + '</span>';
}

function getNextEmptySlot() {
  for (var i = 0; i < 4; i++) {
    if (!selectedImages[i]) return i;
  }
  return -1;
}

function editProduct(id) {
  var p = allProducts.find(function (x) { return x.id === id; });
  if (!p) return;

  editedProductId = id;
  document.getElementById("productModalTitle").textContent = "Edit Product";
  document.getElementById("pfName").value = p.name || "";
  document.getElementById("pfCategory").value = p.category || "caps";
  document.getElementById("pfPrice").value = p.price || 0;
  document.getElementById("pfOldPrice").value = p.oldPrice || "";
  document.getElementById("pfBadge").value = p.badge || "";
  document.getElementById("pfRating").value = p.rating || 4.5;
  document.getElementById("pfDesc").value = p.desc || "";
  document.getElementById("pfTags").value = (p.tags || []).join(", ");

  resetImageSlots();
  var imgs = p.images || (p.image ? [p.image] : []);
  for (var i = 0; i < imgs.length && i < 4; i++) {
    setImageSlot(i, imgs[i]);
  }

  document.getElementById("pfImageUrl").value = "";
  document.getElementById("productModal").classList.add("show");
}

function deleteProduct(id) {
  if (!confirm("Delete this product from Firebase?")) return;
  fsDeleteProduct(id).then(function () {
    showToast("Product deleted");
    loadAllData();
  }).catch(function (e) {
    showToast("Error: " + e.message);
  });
}

function openAddProduct() {
  editedProductId = null;
  document.getElementById("productModalTitle").textContent = "Add Product";
  document.getElementById("productForm").reset();
  resetImageSlots();
  document.getElementById("productModal").classList.add("show");
}

function closeModal() {
  document.getElementById("productModal").classList.remove("show");
}

function handleProductSubmit(e) {
  e.preventDefault();

  var images = selectedImages.filter(function (img) { return img !== null; });

  var data = {
    name: document.getElementById("pfName").value.trim(),
    category: document.getElementById("pfCategory").value,
    price: parseInt(document.getElementById("pfPrice").value) || 0,
    oldPrice: parseInt(document.getElementById("pfOldPrice").value) || null,
    badge: document.getElementById("pfBadge").value || null,
    rating: parseFloat(document.getElementById("pfRating").value) || 4.5,
    image: images.length > 0 ? images[0] : "https://placehold.co/600x600/0B1F3A/D8BD84?font=playfair-display&text=Product",
    images: images,
    desc: document.getElementById("pfDesc").value.trim(),
    tags: document.getElementById("pfTags").value.split(",").map(function (t) { return t.trim(); }).filter(Boolean),
    reviews: 0
  };

  if (editedProductId) {
    data.id = editedProductId;
  } else {
    data.id = "prod-" + Date.now();
  }

  fsSaveProduct(data).then(function () {
    closeModal();
    showToast(editedProductId ? "Product updated in Firebase" : "Product added to Firebase");
    loadAllData();
  }).catch(function (e) {
    showToast("Error: " + e.message);
  });
}

function loadAllData() {
  fsLoadProducts(function (products) {
    allProducts = products;
    renderAdminTable(document.getElementById("adminCategoryFilter").value);
    renderAdminStats(products, []);

    fsLoadOrders(function (orders) {
      renderAdminOrders(orders);
      renderAdminStats(products, orders);
    });
  });
}

function syncToFirebase() {
  var btn = document.getElementById("syncFirebaseBtn");
  if (!btn) return;
  btn.disabled = true;
  btn.textContent = "⟳ Syncing...";

  var batch = db.batch();
  var productsRef = db.collection("products");

  PRODUCTS.forEach(function (p) {
    var docData = {
      name: p.name,
      category: p.category,
      price: p.price,
      oldPrice: p.oldPrice || null,
      badge: p.badge || null,
      rating: p.rating || 0,
      reviews: p.reviews || 0,
      image: p.image || "",
      images: p.images || (p.image ? [p.image] : []),
      desc: p.desc || "",
      tags: p.tags || [],
      sizes: p.sizes || null
    };
    batch.set(productsRef.doc(p.id), docData);
  });

  batch.commit().then(function () {
    btn.textContent = "✓ SYNCED";
    showToast("All " + PRODUCTS.length + " products synced to Firebase");
    loadAllData();
    setTimeout(function () {
      btn.textContent = "⟳ SYNC TO FIREBASE";
      btn.disabled = false;
    }, 3000);
  }).catch(function (e) {
    btn.textContent = "⟳ SYNC TO FIREBASE";
    btn.disabled = false;
    showToast("Sync error: " + e.message);
  });
}

function showToast(text) {
  var t = document.getElementById("toast");
  if (!t) return;
  t.innerHTML = text;
  t.classList.add("show");
  setTimeout(function () { t.classList.remove("show"); }, 2500);
}

document.addEventListener("DOMContentLoaded", function () {
  document.getElementById("addProductBtn").addEventListener("click", openAddProduct);
  document.getElementById("productForm").addEventListener("submit", handleProductSubmit);
  document.getElementById("productModalClose").addEventListener("click", closeModal);
  document.getElementById("productFormCancel").addEventListener("click", closeModal);
  document.getElementById("productModal").addEventListener("click", function (e) {
    if (e.target.id === "productModal") closeModal();
  });
  document.getElementById("adminCategoryFilter").addEventListener("change", function () {
    renderAdminTable(this.value);
  });
  document.getElementById("syncFirebaseBtn").addEventListener("click", syncToFirebase);

  document.querySelectorAll(".pf-img-remove").forEach(function (btn) {
    btn.addEventListener("click", function (e) {
      e.stopPropagation();
      var slot = parseInt(this.getAttribute("data-slot"));
      removeImageSlot(slot);
    });
  });

  document.getElementById("pfImageFile").addEventListener("change", function (e) {
    var file = e.target.files[0];
    if (!file) return;
    var slot = getNextEmptySlot();
    if (slot === -1) {
      showToast("Max 4 images allowed. Remove one first.");
      return;
    }
    var reader = new FileReader();
    reader.onload = function (ev) {
      setImageSlot(slot, ev.target.result);
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  });

  document.getElementById("pfAddUrlBtn").addEventListener("click", function () {
    var url = document.getElementById("pfImageUrl").value.trim();
    if (!url) { showToast("Paste an image URL first"); return; }
    var slot = getNextEmptySlot();
    if (slot === -1) {
      showToast("Max 4 images allowed. Remove one first.");
      return;
    }
    setImageSlot(slot, url);
    document.getElementById("pfImageUrl").value = "";
  });
});
