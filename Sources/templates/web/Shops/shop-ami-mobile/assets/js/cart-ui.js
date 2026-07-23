// ==========================================================================
// AMI MOBILE — Cart helpers dùng chung (localStorage key: mb_cart)
// Cần load SAU products-data.js trên trang nào gọi addToCart()/addToCartById()
// ==========================================================================

function getCart() {
  return JSON.parse(localStorage.getItem('mb_cart') || '[]');
}

function saveCart(cart) {
  localStorage.setItem('mb_cart', JSON.stringify(cart));
}

function updateCartBadge() {
  const count = getCart().reduce((s, i) => s + i.qty, 0);
  document.querySelectorAll('.mb-cart-badge').forEach(b => b.textContent = count);
}

function showCartToast(message) {
  let toast = document.querySelector('.mb-toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.className = 'mb-toast';
    toast.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 6L9 17l-5-5"/></svg><span></span>';
    document.body.appendChild(toast);
  }
  toast.querySelector('span').textContent = message;
  toast.classList.add('show');
  clearTimeout(toast._hideTimer);
  toast._hideTimer = setTimeout(() => toast.classList.remove('show'), 2200);
}

// Thêm sản phẩm vào giỏ theo id (tra cứu từ mảng PRODUCTS toàn cục)
function addToCartById(id, qty) {
  qty = qty || 1;
  const product = PRODUCTS.find(p => p.id === id);
  if (!product) return;
  const price = product.salePrice ?? product.price;
  const cart = getCart();
  const idx = cart.findIndex(i => i.id === id);
  if (idx > -1) cart[idx].qty += qty;
  else cart.push({ id: product.id, name: product.name, price, image: product.image, qty });
  saveCart(cart);
  updateCartBadge();
  showCartToast('Đã thêm "' + product.name + '" vào giỏ hàng');
}

// Gọi từ nút icon trên product card — chặn nổi bọt để không kích hoạt link cha (nếu có)
function quickAddToCart(id, event) {
  if (event) { event.preventDefault(); event.stopPropagation(); }
  addToCartById(id);
  if (event && event.currentTarget) {
    const btn = event.currentTarget;
    btn.classList.add('is-added');
    setTimeout(() => btn.classList.remove('is-added'), 900);
  }
}

document.addEventListener('DOMContentLoaded', updateCartBadge);
