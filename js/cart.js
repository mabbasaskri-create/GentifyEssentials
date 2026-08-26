/* ==========================================================================
   GENTIFY ESSENTIALS — cart module
   Cart persists in localStorage as [{id, qty}]. Checkout hands the order
   summary off to WhatsApp (no payment gateway wired up in this demo build).
   ========================================================================== */

const WHATSAPP_NUMBER = "923256646684";
const CART_KEY = "gentify_cart_v1";

function getCart(){
  try{ return JSON.parse(localStorage.getItem(CART_KEY)) || []; }
  catch(e){ return []; }
}
function saveCart(cart){
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
  updateCartCount();
}
function findProduct(id){
  return PRODUCTS.find(p => p.id === id);
}
function addToCart(id, qty=1){
  const cart = getCart();
  const line = cart.find(l => l.id === id);
  if(line){ line.qty += qty; } else { cart.push({ id, qty }); }
  saveCart(cart);
  renderCartDrawer();
  showToast(findProduct(id) ? findProduct(id).name + " added to cart" : "Added to cart");
}
function removeFromCart(id){
  saveCart(getCart().filter(l => l.id !== id));
  renderCartDrawer();
}
function updateCartQty(id, qty){
  const cart = getCart();
  const line = cart.find(l => l.id === id);
  if(!line) return;
  line.qty = Math.max(1, qty);
  saveCart(cart);
  renderCartDrawer();
}
function cartLines(){
  return getCart().map(l => ({ ...l, product: findProduct(l.id) })).filter(l => l.product);
}
function cartCount(){
  return getCart().reduce((sum, l) => sum + l.qty, 0);
}
function cartTotal(){
  return cartLines().reduce((sum, l) => sum + l.product.price * l.qty, 0);
}
function updateCartCount(){
  document.querySelectorAll(".cart-count").forEach(el => { el.textContent = cartCount(); });
}

function renderCartDrawer(){
  const body = document.getElementById("drawerBody");
  const foot = document.getElementById("drawerFoot");
  if(!body) return;
  const lines = cartLines();

  if(lines.length === 0){
    body.innerHTML = `
      <div class="drawer-empty">
        <div class="ic">🛍</div>
        <p>Your cart is empty.<br>Start adding some essentials.</p>
      </div>`;
    if(foot) foot.innerHTML = `
      <div class="drawer-total"><span>Total</span><span>${formatPKR(0)}</span></div>
      <button class="btn btn-primary btn-block" disabled>Proceed to Checkout →</button>`;
    return;
  }

  body.innerHTML = lines.map(l => `
    <div class="cart-line" data-id="${l.id}">
      <img src="${l.product.image}" alt="${l.product.name}">
      <div class="cart-line-info">
        <div class="name">${l.product.name}</div>
        <div class="meta">${CATEGORY_META[l.product.category].label}</div>
        <div class="cart-line-qty">
          <button class="qty-btn" onclick="updateCartQty('${l.id}', ${l.qty - 1})">−</button>
          <span>${l.qty}</span>
          <button class="qty-btn" onclick="updateCartQty('${l.id}', ${l.qty + 1})">+</button>
        </div>
        <button class="cart-line-remove" onclick="removeFromCart('${l.id}')">Remove</button>
      </div>
      <div class="cart-line-price">${formatPKR(l.product.price * l.qty)}</div>
    </div>
  `).join("");

  if(foot) foot.innerHTML = `
    <div class="drawer-total"><span>Total</span><span>${formatPKR(cartTotal())}</span></div>
    <button class="btn btn-primary btn-block" onclick="checkoutWhatsApp()">Proceed to Checkout →</button>`;
}

function checkoutWhatsApp(){
  const lines = cartLines();
  if(lines.length === 0) return;
  let msg = "Hello Gentify Essentials, I'd like to place an order:%0A%0A";
  lines.forEach(l => {
    msg += `• ${l.product.name} x${l.qty} — ${formatPKR(l.product.price * l.qty)}%0A`;
  });
  msg += `%0ATotal: ${formatPKR(cartTotal())}`;
  window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${msg}`, "_blank");
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

let toastTimer;
function showToast(text){
  const toast = document.getElementById("toast");
  if(!toast) return;
  toast.innerHTML = `<span class="gold">✓</span> ${text}`;
  toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("show"), 2600);
}

document.addEventListener("DOMContentLoaded", updateCartCount);
