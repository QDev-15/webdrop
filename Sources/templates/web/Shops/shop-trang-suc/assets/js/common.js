/* ══════════════════════════════════════════════════════════════
   common.js — VIOLETTE — dùng chung mọi trang (nav, cart, reveal)
   ══════════════════════════════════════════════════════════════ */

/* ── Nav scroll state ── */
const trNav = document.getElementById('tr-nav');
if (trNav) {
  const onScroll = () => trNav.classList.toggle('scrolled', window.scrollY > 40);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

/* ── Mobile hamburger ── */
(function () {
  const burger = document.getElementById('navBurger');
  const mob = document.getElementById('navMob');
  const mobClose = document.getElementById('navMobClose');
  if (!burger || !mob) return;
  function openMob() {
    mob.classList.add('open');
    burger.classList.add('open');
    burger.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  }
  function closeMob() {
    mob.classList.remove('open');
    burger.classList.remove('open');
    burger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }
  burger.addEventListener('click', () => mob.classList.contains('open') ? closeMob() : openMob());
  if (mobClose) mobClose.addEventListener('click', closeMob);
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeMob(); });
})();

/* ── Reveal animation ── */
(function () {
  const ro = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); ro.unobserve(e.target); } });
  }, { threshold: .08, rootMargin: '0px 0px -36px 0px' });
  document.querySelectorAll('[data-reveal]').forEach(el => ro.observe(el));
})();

/* ── Counter animation ── */
(function () {
  document.querySelectorAll('[data-counter]').forEach(el => {
    const cro = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        const target = +el.dataset.counter;
        const suffix = el.dataset.suffix || '';
        let cur = 0;
        const step = Math.max(1, Math.ceil(target / 60));
        const t = setInterval(() => {
          cur = Math.min(cur + step, target);
          el.textContent = cur.toLocaleString('vi-VN') + suffix;
          if (cur >= target) clearInterval(t);
        }, 25);
        cro.disconnect();
      }
    }, { threshold: .5 });
    cro.observe(el);
  });
})();

/* ── Cart (localStorage) ── */
const TR_CART_KEY = 'tr_cart';

function trGetCart() {
  try { return JSON.parse(localStorage.getItem(TR_CART_KEY)) || []; }
  catch (e) { return []; }
}
function trSaveCart(cart) {
  localStorage.setItem(TR_CART_KEY, JSON.stringify(cart));
  trUpdateCartCount();
}
function trAddToCart(id, qty) {
  qty = qty || 1;
  const cart = trGetCart();
  const line = cart.find(l => l.id === id);
  if (line) line.qty += qty;
  else cart.push({ id: id, qty: qty });
  trSaveCart(cart);
}
function trSetQty(id, qty) {
  const cart = trGetCart();
  const line = cart.find(l => l.id === id);
  if (line) {
    line.qty = Math.max(1, qty);
    trSaveCart(cart);
  }
}
function trRemoveFromCart(id) {
  trSaveCart(trGetCart().filter(l => l.id !== id));
}
function trCartCount() {
  return trGetCart().reduce((sum, l) => sum + l.qty, 0);
}
function trUpdateCartCount() {
  const el = document.getElementById('cartCount');
  if (el) el.textContent = trCartCount();
}
trUpdateCartCount();

/* ── Toast ── */
function trShowToast(msg) {
  const el = document.getElementById('trToast');
  if (!el) return;
  el.textContent = msg;
  el.classList.add('show');
  clearTimeout(el._t);
  el._t = setTimeout(() => el.classList.remove('show'), 2400);
}
