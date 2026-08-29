/* ══ PET HAUS — main.js — hành vi dùng chung mọi trang ══ */
'use strict';

const TC_FALLBACK_SVG = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='600' height='600'%3E%3Crect width='600' height='600' fill='%23f3ede4'/%3E%3Ctext x='50%25' y='50%25' font-size='20' fill='%239a9ea7' text-anchor='middle' dy='.3em'%3EPet Haus%3C/text%3E%3C/svg%3E";

function tcFmt(n) { return n.toLocaleString('vi-VN') + '₫'; }

/* ── Cart (localStorage) ── */
function tcGetCart() { try { return JSON.parse(localStorage.getItem('tc_cart') || '[]'); } catch (e) { return []; } }
function tcSaveCart(cart) { localStorage.setItem('tc_cart', JSON.stringify(cart)); tcUpdateCartBadge(); }
function tcAddToCart(id, qty, size) {
  const p = (typeof PRODUCTS !== 'undefined') ? PRODUCTS.find(x => x.id === id) : null;
  if (!p) return;
  const cart = tcGetCart();
  const key = id + '|' + (size || '');
  const existing = cart.find(x => (x.id + '|' + (x.size || '')) === key);
  if (existing) existing.qty += (qty || 1);
  else cart.push({ id, qty: qty || 1, size: size || '', name: p.name, price: p.salePrice ?? p.price, image: p.image });
  tcSaveCart(cart);
}
function tcUpdateCartBadge() {
  const count = tcGetCart().reduce((s, i) => s + i.qty, 0);
  document.querySelectorAll('.tc-cart-count').forEach(el => {
    el.textContent = count;
    el.style.display = count > 0 ? 'flex' : 'none';
  });
}

/* ── Mobile burger + Escape close ── */
(function initNav() {
  const burger = document.getElementById('tcBurger');
  const mob = document.getElementById('tcMobNav');
  if (burger && mob) {
    burger.addEventListener('click', () => {
      const o = mob.classList.toggle('open');
      burger.classList.toggle('open', o);
      document.body.style.overflow = o ? 'hidden' : '';
    });
  }
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && mob && mob.classList.contains('open')) {
      mob.classList.remove('open'); burger.classList.remove('open'); document.body.style.overflow = '';
    }
  });

  const searchBtn = document.getElementById('tcNavSearchBtn');
  const searchPanel = document.getElementById('tcNavSearchPanel');
  const searchInput = document.getElementById('tcNavSearchInput');
  const searchClose = document.getElementById('tcNavSearchClose');
  const searchSubmit = document.getElementById('tcNavSearchSubmit');
  if (searchBtn && searchPanel) {
    searchBtn.addEventListener('click', () => {
      const showing = searchPanel.style.display === 'block';
      searchPanel.style.display = showing ? 'none' : 'block';
      if (!showing) searchInput.focus();
    });
    searchClose && searchClose.addEventListener('click', () => { searchPanel.style.display = 'none'; });
    function goSearch() {
      const q = searchInput.value.trim();
      if (q) window.location.href = 'index.html?q=' + encodeURIComponent(q);
    }
    searchSubmit && searchSubmit.addEventListener('click', goSearch);
    searchInput && searchInput.addEventListener('keydown', e => { if (e.key === 'Enter') goSearch(); });
  }
})();

/* ── Reveal animation ── */
(function initReveal() {
  const ro = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); ro.unobserve(e.target); } });
  }, { threshold: .08, rootMargin: '0px 0px -36px 0px' });
  document.querySelectorAll('[data-reveal]').forEach(el => ro.observe(el));
})();

/* ── Counter animation ── */
(function initCounter() {
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
})();

/* ── FAQ accordion ── */
(function initFAQ() {
  document.querySelectorAll('.tc-faq-item').forEach(item => {
    const q = item.querySelector('.tc-faq-q');
    q && q.addEventListener('click', () => {
      const wasOpen = item.classList.contains('open');
      item.parentElement.querySelectorAll('.tc-faq-item').forEach(i => i.classList.remove('open'));
      if (!wasOpen) item.classList.add('open');
    });
  });
})();

tcUpdateCartBadge();
