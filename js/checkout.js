/* ==========================================================================
   GENTIFY ESSENTIALS — checkout page
   Billing form + order summary. Payment is Cash on Delivery only.
   Order is saved to Firestore and confirmed over WhatsApp.
   ========================================================================== */

function checkoutShipping() {
  return 0;
}

var CHECKOUT_KEY = "gentify_checkout_pending";

function checkoutLines() {
  var cart = cartLines();
  if (cart.length) {
    localStorage.setItem(CHECKOUT_KEY, JSON.stringify(getCart()));
    localStorage.removeItem(CART_KEY);
    updateCartCount();
    renderCartDrawer();
    return cart;
  }
  var pending = [];
  try { pending = JSON.parse(localStorage.getItem(CHECKOUT_KEY)) || []; } catch (e) { pending = []; }
  return pending.map(function (l) {
    return { id: l.id, qty: l.qty, product: findProduct(l.id) };
  }).filter(function (l) { return l.product; });
}

function renderCheckout() {
  var box = document.getElementById("checkoutContent");
  if (!box) return;

  var lines = checkoutLines();
  if (!lines.length) {
    box.innerHTML =
      '<div class="checkout-empty">' +
        '<div class="ic">🛍</div>' +
        '<h2>Your cart is empty</h2>' +
        '<p>Add a few essentials to your cart before checking out.</p>' +
        '<a class="btn btn-primary" style="margin-top:18px;display:inline-flex;" href="index.html">Continue Shopping →</a>' +
      '</div>';
    return;
  }

  var subtotal = cartTotal();
  var shipping = checkoutShipping(subtotal);
  var total = subtotal + shipping;

  var items = lines.map(function (l) {
    var cat = (CATEGORY_META[l.product.category] && CATEGORY_META[l.product.category].label) || l.product.category;
    return '<div class="cs-item">' +
      '<img src="' + l.product.image + '" alt="' + l.product.name + '">' +
      '<div class="cs-info">' +
        '<div class="cs-name">' + l.product.name + '</div>' +
        '<div class="cs-meta">' + cat + ' · Qty ' + l.qty + '</div>' +
      '</div>' +
      '<div class="cs-price">' + formatPKR(l.product.price * l.qty) + '</div>' +
    '</div>';
  }).join("");

  box.innerHTML =
    '<div class="checkout-grid">' +
      '<div class="checkout-form">' +
        '<h2>Billing Details</h2>' +
        '<p class="checkout-note">Complete the details below and confirm your order — no advance payment needed.</p>' +
        '<form id="checkoutForm" novalidate>' +
          '<div class="form-row">' +
            '<div class="form-group">' +
              '<label for="coName">Full Name <span class="req">*</span></label>' +
              '<input type="text" id="coName" placeholder="Your full name" autocomplete="name" required>' +
              '<span class="form-error">Please enter your name</span>' +
            '</div>' +
            '<div class="form-group">' +
              '<label for="coPhone">Phone Number <span class="req">*</span></label>' +
              '<input type="tel" id="coPhone" placeholder="03XXXXXXXXX" autocomplete="tel" required>' +
              '<span class="form-error">Enter a valid phone number (03XXXXXXXXX)</span>' +
            '</div>' +
          '</div>' +
          '<div class="form-row">' +
            '<div class="form-group">' +
              '<label for="coEmail">Email Address</label>' +
              '<input type="email" id="coEmail" placeholder="your@email.com" autocomplete="email">' +
              '<span class="form-error">Enter a valid email address</span>' +
            '</div>' +
            '<div class="form-group">' +
              '<label for="coCity">City <span class="req">*</span></label>' +
              '<input type="text" id="coCity" placeholder="e.g. Lahore" required>' +
              '<span class="form-error">Please enter your city</span>' +
            '</div>' +
          '</div>' +
          '<div class="form-group" style="margin-bottom:16px;">' +
            '<label for="coAddress">Full Address <span class="req">*</span></label>' +
            '<input type="text" id="coAddress" placeholder="House #, Street, Area, Landmark" required>' +
            '<span class="form-error">Please enter your full address</span>' +
          '</div>' +
          '<div class="form-group" style="margin-bottom:16px;">' +
            '<label for="coProvince">Province <span class="req">*</span></label>' +
            '<select id="coProvince" required>' +
              '<option value="">Select Province</option>' +
              '<option>Punjab</option>' +
              '<option>Sindh</option>' +
              '<option>KPK</option>' +
              '<option>Balochistan</option>' +
              '<option>Islamabad</option>' +
              '<option>Azad Kashmir</option>' +
              '<option>Gilgit Baltistan</option>' +
            '</select>' +
            '<span class="form-error">Please select your province</span>' +
          '</div>' +
          '<div class="form-group" style="margin-bottom:22px;">' +
            '<label for="coNotes">Order Notes (Optional)</label>' +
            '<textarea id="coNotes" placeholder="Any special instructions for your order..."></textarea>' +
          '</div>' +
          '<div class="pay-methods">' +
            '<div class="pay-ic">💵</div>' +
            '<div>' +
              '<h4>Cash on Delivery</h4>' +
              '<p>Pay in cash when your order is delivered — only available payment method.</p>' +
            '</div>' +
            '<span class="pay-badge">Selected</span>' +
          '</div>' +
          '<button type="submit" class="checkout-btn" id="checkoutBtn">Confirm Order — ' + formatPKR(total) + '</button>' +
        '</form>' +
      '</div>' +
      '<aside class="checkout-summary">' +
        '<h3>Order Summary</h3>' +
        '<div class="cs-items">' + items + '</div>' +
        '<div class="cs-totals">' +
          '<div class="cs-line"><span>Subtotal</span><span class="amount">' + formatPKR(subtotal) + '</span></div>' +
          '<div class="cs-line"><span>Shipping</span><span class="amount">' + (shipping ? formatPKR(shipping) : 'Free') + '</span></div>' +
          '<div class="cs-line grand"><span>Total</span><span>' + formatPKR(total) + '</span></div>' +
        '</div>' +
        '<p class="cs-note">🚚 Free shipping on all orders · 🔁 30-day returns</p>' +
      '</aside>' +
    '</div>';

  document.getElementById("checkoutForm").addEventListener("submit", function (e) {
    e.preventDefault();
    placeOrderNow();
  });
}

function checkoutField(id) {
  var el = document.getElementById(id);
  return el ? el.value.trim() : "";
}

function validateCheckoutForm() {
  var rules = [
    { id: "coName",    test: function (v) { return v.length >= 2; } },
    { id: "coPhone",   test: function (v) { return /^03\d{9}$/.test(v.replace(/\s/g, "")); } },
    { id: "coAddress", test: function (v) { return v.length >= 5; } },
    { id: "coCity",    test: function (v) { return v.length >= 2; } },
    { id: "coProvince",test: function (v) { return v.length >= 1; } }
  ];
  var ok = true;
  rules.forEach(function (r) {
    var el = document.getElementById(r.id);
    if (!el) return;
    var valid = r.test(el.value.trim());
    el.closest(".form-group").classList.toggle("error", !valid);
    if (!valid) ok = false;
  });
  var email = document.getElementById("coEmail");
  if (email && email.value.trim()) {
    var validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim());
    email.closest(".form-group").classList.toggle("error", !validEmail);
    if (!validEmail) ok = false;
  }
  return ok;
}

function placeOrderNow() {
  if (!validateCheckoutForm()) {
    showToast("Please complete the highlighted fields");
    return;
  }
  var lines = checkoutLines();
  if (!lines.length) return;

  var name = checkoutField("coName");
  var phone = checkoutField("coPhone");
  var email = checkoutField("coEmail");
  var address = checkoutField("coAddress");
  var city = checkoutField("coCity");
  var province = checkoutField("coProvince");
  var notes = checkoutField("coNotes");

  var subtotal = cartTotal();
  var shipping = checkoutShipping(subtotal);
  var total = subtotal + shipping;

  var items = lines.map(function (l) {
    return { id: l.product.id, name: l.product.name, qty: l.qty, price: l.product.price, category: l.product.category };
  });

  var orderData = {
    userName: name,
    userPhone: phone,
    userEmail: email || "",
    address: address,
    city: city,
    province: province,
    notes: notes || "",
    payment: "Cash on Delivery",
    items: items,
    subtotal: subtotal,
    shipping: shipping,
    total: total,
    status: "pending",
    createdAt: firebase.firestore.FieldValue.serverTimestamp()
  };

  if (typeof fsSaveOrder === "function") {
    fsSaveOrder(orderData).then(function () {
      console.log("Order saved to Firestore");
    }).catch(function (e) {
      console.error("Order save error:", e);
    });
  }

  var itemsList = lines.map(function (l) {
    return "• " + l.product.name + " x" + l.qty + " — " + formatPKR(l.product.price * l.qty);
  }).join("\n");

  var msg =
    "Hello Gentify Essentials, I'd like to place an order:\n\n" +
    "👤 Name: " + name + "\n" +
    "📞 Phone: " + phone + "\n" +
    (email ? "📧 Email: " + email + "\n" : "") +
    "📍 Address: " + address + ", " + city + ", " + province + "\n" +
    "💵 Payment: Cash on Delivery\n" +
    "\nItems:\n" + itemsList + "\n" +
    "\n🚚 Shipping: " + (shipping ? formatPKR(shipping) : "Free") + "\n" +
    "💰 Total: " + formatPKR(total) +
    (notes ? "\n\n📝 Notes: " + notes : "");

  window.open("https://wa.me/" + WHATSAPP_NUMBER + "?text=" + encodeURIComponent(msg), "_blank");

  localStorage.removeItem(CART_KEY);
  localStorage.removeItem(CHECKOUT_KEY);
  updateCartCount();
  renderCartDrawer();
  closeCartDrawer();

  var box = document.getElementById("checkoutContent");
  if (box) {
    box.innerHTML =
      '<div class="order-success">' +
        '<div class="ic">✔</div>' +
        '<h2>Order received — thank you, ' + name.split(" ")[0] + '!</h2>' +
        '<p>We have sent you a confirmation on WhatsApp and will call to verify your order shortly. Pay in cash when it arrives.</p>' +
        '<a class="btn btn-primary" href="index.html">Continue Shopping →</a>' +
      '</div>';
  }
}

renderCheckout();