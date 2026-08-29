// ==========================================================================
// MỘC VANG (shop-ruou-vang) — Common JS dùng chung mọi trang
// Cần load SAU products-data.js (nếu trang có dùng PRODUCTS)
// ==========================================================================

/* ── Fallback ảnh lỗi (nếu Unsplash hotlink ngừng phục vụ trong tương lai) ──
   Trỏ về SVG data-URI nội tuyến — KHÔNG dùng đường dẫn local (assets/img/... không tồn tại) */
const RV_IMG_FALLBACK = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='500' viewBox='0 0 400 500'%3E%3Crect width='400' height='500' fill='%23ece2cb'/%3E%3Cg fill='%23a4917a'%3E%3Crect x='170' y='120' width='60' height='160' rx='10'/%3E%3Ccircle cx='200' cy='320' r='45'/%3E%3C/g%3E%3Ctext x='50%25' y='430' font-family='sans-serif' font-size='16' fill='%236c5a49' text-anchor='middle'%3EMộc Vang%3C/text%3E%3C/svg%3E";
document.addEventListener('error', e => {
  const el = e.target;
  if (el && el.tagName === 'IMG' && el.src !== RV_IMG_FALLBACK) {
    el.src = RV_IMG_FALLBACK;
  }
}, true);

/* ── Reveal animation ─────────────────────────────────────────────────── */
const rvRevealObserver = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); rvRevealObserver.unobserve(e.target); } });
}, { threshold: .08, rootMargin: '0px 0px -36px 0px' });
document.querySelectorAll('[data-reveal]').forEach(el => rvRevealObserver.observe(el));

/* ── Nav scroll state ─────────────────────────────────────────────────── */
const rvNav = document.getElementById('rv-nav');
if (rvNav) {
  const onScroll = () => rvNav.classList.toggle('scrolled', window.scrollY > 60);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

/* ── Mobile hamburger ─────────────────────────────────────────────────── */
const rvBurger = document.getElementById('navBurger');
const rvMob = document.getElementById('navMob');
if (rvBurger && rvMob) {
  rvBurger.addEventListener('click', () => {
    const o = rvMob.classList.toggle('open');
    rvBurger.classList.toggle('open', o);
    document.body.style.overflow = o ? 'hidden' : '';
  });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && rvMob.classList.contains('open')) {
      rvMob.classList.remove('open'); rvBurger.classList.remove('open'); document.body.style.overflow = '';
    }
  });
}

/* ── Nav search toggle ────────────────────────────────────────────────── */
const rvSearchToggle = document.getElementById('rvSearchToggle');
const rvNavSearch = document.getElementById('rvNavSearch');
if (rvSearchToggle && rvNavSearch) {
  rvSearchToggle.addEventListener('click', () => {
    rvNavSearch.classList.toggle('open');
    if (rvNavSearch.classList.contains('open')) {
      const input = document.getElementById('rvSearchInput');
      if (input) setTimeout(() => input.focus(), 150);
    }
  });
}
// Submit tìm kiếm chung — trang chủ (index.html) tự lọc tại chỗ (xử lý riêng trong file index),
// các trang khác điều hướng sang index.html?q=
const rvSearchForm = document.getElementById('rvSearchForm');
if (rvSearchForm && !window.RV_IS_CATALOG_PAGE) {
  rvSearchForm.addEventListener('submit', e => {
    e.preventDefault();
    const q = document.getElementById('rvSearchInput').value.trim();
    window.location.href = 'index.html' + (q ? ('?q=' + encodeURIComponent(q)) : '');
  });
}

/* ── Counter animation ────────────────────────────────────────────────── */
document.querySelectorAll('[data-counter]').forEach(el => {
  const cro = new IntersectionObserver(([entry]) => {
    if (entry.isIntersecting) {
      const target = +el.dataset.counter;
      const suffix = el.dataset.suffix || '';
      let cur = 0; const step = Math.ceil(target / 60);
      const t = setInterval(() => { cur = Math.min(cur + step, target); el.textContent = cur + suffix; if (cur >= target) clearInterval(t); }, 25);
      cro.disconnect();
    }
  }, { threshold: .5 });
  cro.observe(el);
});

/* ── FAQ accordion ────────────────────────────────────────────────────── */
document.querySelectorAll('.rv-faq-item').forEach(item => {
  const q = item.querySelector('.rv-faq-q');
  if (!q) return;
  q.addEventListener('click', () => {
    const wasOpen = item.classList.contains('open');
    item.closest('.rv-faq').querySelectorAll('.rv-faq-item').forEach(i => i.classList.remove('open'));
    if (!wasOpen) item.classList.add('open');
  });
});

/* ── Generic dropdown toggle (toolbar filters) ───────────────────────── */
document.querySelectorAll('.rv-dd-btn').forEach(btn => {
  btn.addEventListener('click', e => {
    e.stopPropagation();
    const dd = btn.closest('.rv-dd');
    const wasOpen = dd.classList.contains('open');
    document.querySelectorAll('.rv-dd.open').forEach(d => d.classList.remove('open'));
    if (!wasOpen) dd.classList.add('open');
  });
});
document.addEventListener('click', e => {
  if (e.target.closest('.rv-dd')) return; // click bên trong dropdown (vd tick checkbox) — không đóng
  document.querySelectorAll('.rv-dd.open').forEach(d => d.classList.remove('open'));
});

/* ── Age-gate (localStorage: rv_age_ok) ──────────────────────────────── */
(function initAgeGate() {
  const gate = document.getElementById('rvAgeGate');
  if (!gate) return;
  if (localStorage.getItem('rv_age_ok') === '1') { gate.hidden = true; return; }
  gate.hidden = false;
  document.body.style.overflow = 'hidden';
  const confirmBtn = document.getElementById('rvAgeConfirm');
  const declineBtn = document.getElementById('rvAgeDecline');
  if (confirmBtn) confirmBtn.addEventListener('click', () => {
    localStorage.setItem('rv_age_ok', '1');
    gate.hidden = true;
    document.body.style.overflow = '';
  });
  if (declineBtn) declineBtn.addEventListener('click', () => {
    window.location.href = 'https://www.google.com';
  });
})();

/* ── Cart (localStorage key: rv_cart) ────────────────────────────────── */
function rvGetCart() { return JSON.parse(localStorage.getItem('rv_cart') || '[]'); }
function rvSaveCart(cart) { localStorage.setItem('rv_cart', JSON.stringify(cart)); }
function rvUpdateCartBadge() {
  const count = rvGetCart().reduce((s, i) => s + i.qty, 0);
  document.querySelectorAll('#rvCartCount').forEach(b => b.textContent = count);
}
function rvFormatVND(n) { return n.toLocaleString('vi-VN') + '₫'; }

function rvShowToast(message) {
  let toast = document.querySelector('.rv-toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.className = 'rv-toast';
    toast.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 6L9 17l-5-5"/></svg><span></span>';
    document.body.appendChild(toast);
  }
  toast.querySelector('span').textContent = message;
  toast.classList.add('show');
  clearTimeout(toast._hideTimer);
  toast._hideTimer = setTimeout(() => toast.classList.remove('show'), 2200);
}

function rvAddToCartById(id, qty) {
  qty = qty || 1;
  const product = (typeof PRODUCTS !== 'undefined') ? PRODUCTS.find(p => p.id === id) : null;
  if (!product) return;
  const price = product.salePrice ?? product.price;
  const cart = rvGetCart();
  const idx = cart.findIndex(i => i.id === id);
  if (idx > -1) cart[idx].qty += qty;
  else cart.push({ id: product.id, name: product.name, price, image: product.image, volume: product.volume, qty });
  rvSaveCart(cart);
  rvUpdateCartBadge();
  rvShowToast('Đã thêm "' + product.name + '" vào giỏ hàng');
}

function rvQuickAddToCart(id, event) {
  if (event) { event.preventDefault(); event.stopPropagation(); }
  rvAddToCartById(id);
  if (event && event.currentTarget) {
    const btn = event.currentTarget;
    btn.classList.add('is-added');
    setTimeout(() => btn.classList.remove('is-added'), 900);
  }
}

document.addEventListener('DOMContentLoaded', rvUpdateCartBadge);
