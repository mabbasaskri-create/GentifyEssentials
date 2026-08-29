/* ==========================================================================
   GENTIFY ESSENTIALS — cart module (Firestore orders)
   Cart persists in localStorage. Checkout saves order to Firestore
   and opens WhatsApp.
   ========================================================================== */

var WHATSAPP_NUMBER = "923256646684";
var CART_KEY = "gentify_cart_v1";

function getCart(){
  try{ return JSON.parse(localStorage.getItem(CART_KEY)) || []; }
  catch(e){ return []; }
}
function saveCart(cart){
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
  updateCartCount();
}
function findProduct(id){
  return PRODUCTS.find(function(p){ return p.id === id; });
}
function addToCart(id, qty){
  qty = qty || 1;
  var cart = getCart();
  var line = cart.find(function(l){ return l.id === id; });
  if(line){ line.qty += qty; } else { cart.push({ id: id, qty: qty }); }
  saveCart(cart);
  renderCartDrawer();
  var p = findProduct(id);
  showToast(p ? p.name + " added to cart" : "Added to cart");
  if (p && typeof setWhatsAppProduct === "function") setWhatsAppProduct(p.name);
}
function removeFromCart(id){
  saveCart(getCart().filter(function(l){ return l.id !== id; }));
  renderCartDrawer();
}
function updateCartQty(id, qty){
  var cart = getCart();
  var line = cart.find(function(l){ return l.id === id; });
  if(!line) return;
  line.qty = Math.max(1, qty);
  saveCart(cart);
  renderCartDrawer();
}
function cartLines(){
  return getCart().map(function(l){ return { id: l.id, qty: l.qty, product: findProduct(l.id) }; }).filter(function(l){ return l.product; });
}
function cartCount(){
  return getCart().reduce(function(sum, l){ return sum + l.qty; }, 0);
}
function cartTotal(){
  return cartLines().reduce(function(sum, l){ return sum + l.product.price * l.qty; }, 0);
}
function updateCartCount(){
  document.querySelectorAll(".cart-count").forEach(function(el){ el.textContent = cartCount(); });
}

function renderCartDrawer(){
  var body = document.getElementById("drawerBody");
  var foot = document.getElementById("drawerFoot");
  if(!body) return;
  var lines = cartLines();

  if(lines.length === 0){
    body.innerHTML =
      '<div class="drawer-empty">' +
        '<div class="ic">🛍</div>' +
        '<p>Your cart is empty.<br>Start adding some essentials.</p>' +
      '</div>';
    if(foot) foot.innerHTML =
      '<div class="drawer-total"><span>Total</span><span>' + formatPKR(0) + '</span></div>' +
      '<button class="btn btn-primary btn-block" disabled>Proceed to Checkout →</button>';
    return;
  }

  body.innerHTML = lines.map(function(l){
    return '<div class="cart-line" data-id="' + l.id + '">' +
      '<img src="' + l.product.image + '" alt="' + l.product.name + '">' +
      '<div class="cart-line-info">' +
        '<div class="name">' + l.product.name + '</div>' +
        '<div class="meta">' + CATEGORY_META[l.product.category].label + '</div>' +
        '<div class="cart-line-qty">' +
          '<button class="qty-btn" onclick="updateCartQty(\'' + l.id + '\', ' + (l.qty - 1) + ')">−</button>' +
          '<span>' + l.qty + '</span>' +
          '<button class="qty-btn" onclick="updateCartQty(\'' + l.id + '\', ' + (l.qty + 1) + ')">+</button>' +
        '</div>' +
        '<button class="cart-line-remove" onclick="removeFromCart(\'' + l.id + '\')">Remove</button>' +
      '</div>' +
      '<div class="cart-line-price">' + formatPKR(l.product.price * l.qty) + '</div>' +
    '</div>';
  }).join("");

  if(foot) foot.innerHTML =
    '<div class="drawer-total"><span>Total</span><span>' + formatPKR(cartTotal()) + '</span></div>' +
    '<a class="btn btn-primary btn-block" href="checkout.html">Proceed to Checkout →</a>';
}

function openCartDrawer(){
  renderCartDrawer();
  document.getElementById("cartDrawer").classList.add("show");
  document.getElementById("cartOverlay").classList.add("show");
}
function closeCartDrawer(){
  document.getElementById("cartDrawer").classList.remove("show");
  document.getElementById("cartOverlay").classList.remove("show");
}

var toastTimer;
function showToast(text){
  var toast = document.getElementById("toast");
  if(!toast) return;
  toast.innerHTML = '<span class="gold">✓</span> ' + text;
  toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(function(){ toast.classList.remove("show"); }, 2600);
}

document.addEventListener("DOMContentLoaded", updateCartCount);
