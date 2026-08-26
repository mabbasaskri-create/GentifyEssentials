/* ==========================================================================
   GENTIFY ESSENTIALS — Admin Panel Logic
   ========================================================================== */

var ADMIN_EMAIL = "m.abbas.askri@gmail.com";
var editedProductId = null;

function loadProducts() {
  var saved = localStorage.getItem("gentify_products");
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch (e) {}
  }
  return PRODUCTS.slice();
}

function saveProducts(list) {
  localStorage.setItem("gentify_products", JSON.stringify(list));
}

function getProducts() {
  var local = localStorage.getItem("gentify_products");
  if (local) {
    try {
      return JSON.parse(local);
    } catch (e) {}
  }
  return PRODUCTS.slice();
}

function renderAdminStats(products) {
  document.getElementById("statProducts").textContent = products.length;

  var cats = {};
  products.forEach(function (p) { cats[p.category] = true; });
  document.getElementById("statCategories").textContent = Object.keys(cats).length;

  var total = products.reduce(function (sum, p) { return sum + p.price; }, 0);
  document.getElementById("statValue").textContent = formatPKR(total);

  var orders = JSON.parse(localStorage.getItem("gentify_admin_orders") || "[]");
  document.getElementById("statOrders").textContent = orders.length;
}

function renderAdminTable(filter) {
  var products = getProducts();
  if (filter && filter !== "all") {
    products = products.filter(function (p) { return p.category === filter; });
  }

  var tbody = document.getElementById("adminProductBody");
  tbody.innerHTML = products.map(function (p) {
    var oldP = p.oldPrice ? formatPKR(p.oldPrice) : "—";
    var badge = p.badge || "—";
    return '<tr>' +
      '<td><img src="' + p.image + '" alt="" style="width:48px;height:48px;object-fit:cover;"></td>' +
      '<td><strong>' + p.name + '</strong></td>' +
      '<td>' + (CATEGORY_META[p.category] ? CATEGORY_META[p.category].label : p.category) + '</td>' +
      '<td>' + formatPKR(p.price) + '</td>' +
      '<td>' + oldP + '</td>' +
      '<td>' + badge + '</td>' +
      '<td>' + p.rating + ' ★</td>' +
      '<td>' +
        '<button class="admin-action-btn" onclick="editProduct(\'' + p.id + '\')">Edit</button> ' +
        '<button class="admin-action-btn admin-action-delete" onclick="deleteProduct(\'' + p.id + '\')">Delete</button>' +
      '</td>' +
    '</tr>';
  }).join("");
}

function renderAdminOrders() {
  var orders = JSON.parse(localStorage.getItem("gentify_admin_orders") || "[]");
  var tbody = document.getElementById("adminOrdersBody");
  var empty = document.getElementById("ordersEmpty");

  if (orders.length === 0) {
    tbody.innerHTML = "";
    empty.style.display = "block";
    return;
  }

  empty.style.display = "none";
  tbody.innerHTML = orders.slice().reverse().map(function (o) {
    var items = o.items.map(function (i) { return i.name + " x" + i.qty; }).join(", ");
    return '<tr>' +
      '<td>' + o.date + '</td>' +
      '<td>' + items + '</td>' +
      '<td>' + formatPKR(o.total) + '</td>' +
      '<td><span class="admin-badge">' + o.status + '</span></td>' +
    '</tr>';
  }).join("");
}

function editProduct(id) {
  var products = getProducts();
  var p = products.find(function (x) { return x.id === id; });
  if (!p) return;

  editedProductId = id;
  document.getElementById("productModalTitle").textContent = "Edit Product";
  document.getElementById("pfName").value = p.name;
  document.getElementById("pfCategory").value = p.category;
  document.getElementById("pfPrice").value = p.price;
  document.getElementById("pfOldPrice").value = p.oldPrice || "";
  document.getElementById("pfBadge").value = p.badge || "";
  document.getElementById("pfRating").value = p.rating;
  document.getElementById("pfImage").value = p.image;
  document.getElementById("pfDesc").value = p.desc || "";
  document.getElementById("pfTags").value = (p.tags || []).join(", ");
  document.getElementById("productModal").classList.add("show");
}

function deleteProduct(id) {
  if (!confirm("Delete this product?")) return;
  var products = getProducts().filter(function (p) { return p.id !== id; });
  saveProducts(products);
  renderAdminTable(document.getElementById("adminCategoryFilter").value);
  renderAdminStats(products);
  showToast("Product deleted");
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
  var products = getProducts();
  var data = {
    name: document.getElementById("pfName").value.trim(),
    category: document.getElementById("pfCategory").value,
    price: parseInt(document.getElementById("pfPrice").value) || 0,
    oldPrice: parseInt(document.getElementById("pfOldPrice").value) || undefined,
    badge: document.getElementById("pfBadge").value || undefined,
    rating: parseFloat(document.getElementById("pfRating").value) || 4.5,
    image: document.getElementById("pfImage").value.trim() || "https://placehold.co/600x600/0B1F3A/D8BD84?font=playfair-display&text=Product",
    desc: document.getElementById("pfDesc").value.trim(),
    tags: document.getElementById("pfTags").value.split(",").map(function (t) { return t.trim(); }).filter(Boolean),
    reviews: 0
  };

  if (editedProductId) {
    var idx = products.findIndex(function (p) { return p.id === editedProductId; });
    if (idx > -1) {
      data.id = editedProductId;
      data.reviews = products[idx].reviews || 0;
      products[idx] = data;
    }
  } else {
    data.id = "prod-" + Date.now();
    products.push(data);
  }

  saveProducts(products);
  closeModal();
  renderAdminTable(document.getElementById("adminCategoryFilter").value);
  renderAdminStats(products);
  showToast(editedProductId ? "Product updated" : "Product added");
}

function showToast(text) {
  var t = document.getElementById("toast");
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
