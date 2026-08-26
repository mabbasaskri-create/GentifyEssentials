/* ==========================================================================
   GENTIFY ESSENTIALS — Admin Panel (Firestore)
   ========================================================================== */

var editedProductId = null;
var allProducts = [];

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
    return '<tr>' +
      '<td><img src="' + (p.image || "") + '" alt="" style="width:48px;height:48px;object-fit:cover;"></td>' +
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
  document.getElementById("pfImage").value = p.image || "";
  document.getElementById("pfDesc").value = p.desc || "";
  document.getElementById("pfTags").value = (p.tags || []).join(", ");
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
  document.getElementById("productModal").classList.add("show");
}

function closeModal() {
  document.getElementById("productModal").classList.remove("show");
}

function handleProductSubmit(e) {
  e.preventDefault();
  var data = {
    name: document.getElementById("pfName").value.trim(),
    category: document.getElementById("pfCategory").value,
    price: parseInt(document.getElementById("pfPrice").value) || 0,
    oldPrice: parseInt(document.getElementById("pfOldPrice").value) || null,
    badge: document.getElementById("pfBadge").value || null,
    rating: parseFloat(document.getElementById("pfRating").value) || 4.5,
    image: document.getElementById("pfImage").value.trim() || "https://placehold.co/600x600/0B1F3A/D8BD84?font=playfair-display&text=Product",
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
});
