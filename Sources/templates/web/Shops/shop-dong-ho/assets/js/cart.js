/* ══════════════════════════════════════════════════════════════════
   MERIDIAN — cart.js — giỏ hàng mock localStorage, dùng chung mọi trang
   ══════════════════════════════════════════════════════════════════ */

const DH_CART_KEY = 'dh_cart';

function dhGetCart() {
  try { return JSON.parse(localStorage.getItem(DH_CART_KEY)) || []; }
  catch (e) { return []; }
}

function dhSaveCart(cart) {
  localStorage.setItem(DH_CART_KEY, JSON.stringify(cart));
  dhRenderCartBadge();
}

function dhAddToCart(slug, qty) {
  qty = qty || 1;
  const cart = dhGetCart();
  const existing = cart.find(i => i.slug === slug);
  if (existing) existing.qty += qty;
  else cart.push({ slug, qty });
  dhSaveCart(cart);
  dhShowToast('Đã thêm vào giỏ hàng');
}

function dhUpdateQty(slug, qty) {
  const cart = dhGetCart();
  const item = cart.find(i => i.slug === slug);
  if (!item) return;
  item.qty = Math.max(1, qty);
  dhSaveCart(cart);
}

function dhRemoveFromCart(slug) {
  dhSaveCart(dhGetCart().filter(i => i.slug !== slug));
}

function dhCartCount() {
  return dhGetCart().reduce((sum, i) => sum + i.qty, 0);
}

function dhRenderCartBadge() {
  const count = dhCartCount();
  document.querySelectorAll('.dh-cart-count').forEach(el => { el.textContent = count; });
}

function dhShowToast(msg) {
  let toast = document.getElementById('dhToast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'dhToast';
    toast.style.cssText = 'position:fixed;bottom:26px;left:50%;transform:translateX(-50%) translateY(20px);background:#071b1d;color:#fff;padding:14px 26px;border-radius:12px;font-size:14px;font-weight:600;z-index:2000;opacity:0;transition:opacity .3s,transform .3s;box-shadow:0 14px 34px rgba(0,0,0,.28);';
    document.body.appendChild(toast);
  }
  toast.textContent = msg;
  requestAnimationFrame(() => { toast.style.opacity = '1'; toast.style.transform = 'translateX(-50%) translateY(0)'; });
  clearTimeout(toast._t);
  toast._t = setTimeout(() => { toast.style.opacity = '0'; toast.style.transform = 'translateX(-50%) translateY(20px)'; }, 2200);
}

document.addEventListener('DOMContentLoaded', dhRenderCartBadge);
