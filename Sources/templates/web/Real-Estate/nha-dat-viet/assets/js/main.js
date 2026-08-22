/* ══ NHÀ ĐẤT VIỆT — main.js — logic dùng chung mọi trang ══ */

/* === Reveal animation === */
const ndvRO = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); ndvRO.unobserve(e.target); } });
}, { threshold: .08, rootMargin: '0px 0px -36px 0px' });
document.querySelectorAll('[data-reveal]').forEach(el => ndvRO.observe(el));

/* === Nav scroll shadow === */
const ndvNav = document.getElementById('ndvNav');
if (ndvNav) {
  window.addEventListener('scroll', () => {
    ndvNav.classList.toggle('scrolled', window.scrollY > 20);
  }, { passive: true });
}

/* === Mobile hamburger === */
const ndvBurger = document.getElementById('ndvNavBurger');
const ndvMob = document.getElementById('ndvNavMob');
if (ndvBurger && ndvMob) {
  ndvBurger.addEventListener('click', () => {
    const isOpen = ndvMob.classList.toggle('open');
    ndvBurger.classList.toggle('open', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && ndvMob.classList.contains('open')) {
      ndvMob.classList.remove('open'); ndvBurger.classList.remove('open'); document.body.style.overflow = '';
    }
  });
  ndvMob.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
    ndvMob.classList.remove('open'); ndvBurger.classList.remove('open'); document.body.style.overflow = '';
  }));
}

/* === Counter animation === */
document.querySelectorAll('[data-counter]').forEach(el => {
  const cro = new IntersectionObserver(([entry]) => {
    if (entry.isIntersecting) {
      const target = +el.dataset.counter;
      const suffix = el.dataset.suffix || '';
      let cur = 0; const step = Math.max(1, Math.ceil(target / 60));
      const t = setInterval(() => { cur = Math.min(cur + step, target); el.textContent = cur.toLocaleString('vi-VN') + suffix; if (cur >= target) clearInterval(t); }, 25);
      cro.disconnect();
    }
  }, { threshold: .5 });
  cro.observe(el);
});

/* === FAQ accordion (custom, không dùng Bootstrap) === */
document.querySelectorAll('.ndv-faq-item').forEach(item => {
  const q = item.querySelector('.ndv-faq-q');
  const a = item.querySelector('.ndv-faq-a');
  if (!q || !a) return;
  q.addEventListener('click', () => {
    const isOpen = item.classList.contains('open');
    item.closest('.ndv-faq').querySelectorAll('.ndv-faq-item.open').forEach(other => {
      if (other !== item) { other.classList.remove('open'); other.querySelector('.ndv-faq-a').style.maxHeight = null; }
    });
    if (isOpen) { item.classList.remove('open'); a.style.maxHeight = null; }
    else { item.classList.add('open'); a.style.maxHeight = a.scrollHeight + 'px'; }
  });
});

/* === Carousel Hero (vanilla JS, auto-play 5s, fade) === */
(function () {
  const slides = document.querySelectorAll('.ndv-hero-slide');
  const dots = document.querySelectorAll('.ndv-hero-dot');
  const prevBtn = document.querySelector('.ndv-hero-prev');
  const nextBtn = document.querySelector('.ndv-hero-next');
  if (!slides.length) return;
  let cur = 0, timer;

  function show(i) {
    slides.forEach(s => s.classList.remove('active'));
    dots.forEach(d => d.classList.remove('active'));
    cur = (i + slides.length) % slides.length;
    slides[cur].classList.add('active');
    if (dots[cur]) dots[cur].classList.add('active');
  }
  function next() { show(cur + 1); }
  function prev() { show(cur - 1); }
  function restart() { clearInterval(timer); timer = setInterval(next, 5000); }

  if (nextBtn) nextBtn.addEventListener('click', () => { next(); restart(); });
  if (prevBtn) prevBtn.addEventListener('click', () => { prev(); restart(); });
  dots.forEach((d, i) => d.addEventListener('click', () => { show(i); restart(); }));

  show(0);
  restart();
})();

/* === Icon strings dùng chung khi render card bằng JS === */
const NDV_ICON_PIN = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>';
const NDV_ICON_AREA = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3M3 16v3a2 2 0 0 0 2 2h3m11 0h3a2 2 0 0 0 2-2v-3"/></svg>';
const NDV_ICON_BED = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 18v-6a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v6M3 18v2M21 18v2M3 12V7a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v3"/></svg>';
const NDV_ICON_BATH = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 12h16a1 1 0 0 1 1 1v2a5 5 0 0 1-5 5H8a5 5 0 0 1-5-5v-2a1 1 0 0 1 1-1zM7 12V6a2 2 0 0 1 3.5-1.3"/></svg>';
const NDV_ICON_COMPASS = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"/></svg>';
const NDV_ICON_SHIELD = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>';
const NDV_ICON_CHECK = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>';

/* === Render badge + property card HTML (dùng chung: trang chủ / catalog / BĐS tương tự) === */
function ndvBadgeHTML(badge) {
  if (!badge) return '';
  return `<span class="ndv-badge ndv-badge-${badge}">${BADGE_LABELS[badge]}</span>`;
}
function ndvPropCardHTML(p) {
  const listingLabel = p.listingType === 'ban' ? 'Bán' : 'Cho thuê';
  return `
  <a href="chi-tiet-bds.html?slug=${p.slug}" class="ndv-prop-card" data-reveal>
    <div class="ndv-prop-thumb">
      <img src="${p.images[0]}" alt="${p.title}" loading="lazy">
      <div class="ndv-prop-badges">${ndvBadgeHTML(p.badge)}</div>
      <span class="ndv-prop-listing-tag">${listingLabel}</span>
      <span class="ndv-prop-type-tag">${PROPERTY_TYPE_LABELS[p.propertyType]}</span>
    </div>
    <div class="ndv-prop-body">
      <div class="ndv-prop-price">${formatPrice(p.price, p.priceUnit)}</div>
      <div class="ndv-prop-title">${p.title}</div>
      <div class="ndv-prop-addr">${NDV_ICON_PIN}<span>${p.address}</span></div>
      <div class="ndv-prop-meta">
        ${p.area ? `<span>${NDV_ICON_AREA} ${p.area}m²</span>` : ''}
        ${p.bedrooms ? `<span>${NDV_ICON_BED} ${p.bedrooms} PN</span>` : ''}
        ${p.bathrooms ? `<span>${NDV_ICON_BATH} ${p.bathrooms} WC</span>` : ''}
      </div>
      <div class="ndv-prop-legal">${LEGAL_LABELS[p.legalStatus]} · Hướng ${DIRECTION_LABELS[p.direction]}</div>
    </div>
  </a>`;
}

/* === Gallery lightbox (chi-tiet-bds.html) — helper dùng chung === */
function ndvOpenLightbox(src) {
  const box = document.getElementById('ndvLightbox');
  if (!box) return;
  box.querySelector('img').src = src;
  box.classList.add('open');
  document.body.style.overflow = 'hidden';
}
function ndvCloseLightbox() {
  const box = document.getElementById('ndvLightbox');
  if (!box) return;
  box.classList.remove('open');
  document.body.style.overflow = '';
}
