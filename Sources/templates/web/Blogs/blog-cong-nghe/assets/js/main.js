// ════════════════════════════════════════════════════
// PIXEL. — Blog Công Nghệ — main.js (vanilla JS thuần)
// ════════════════════════════════════════════════════

// === Reveal animation ===
const bcnRO = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('bcn-visible'); bcnRO.unobserve(e.target); } });
}, { threshold: .08, rootMargin: '0px 0px -36px 0px' });
document.querySelectorAll('[data-reveal]').forEach(el => bcnRO.observe(el));

// === Mobile hamburger ===
const bcnBurger = document.getElementById('bcnBurger');
const bcnMob = document.getElementById('bcnMobNav');
const bcnOverlay = document.getElementById('bcnMobOverlay');
function bcnCloseMob() {
  bcnMob?.classList.remove('bcn-open');
  bcnBurger?.classList.remove('bcn-open');
  bcnOverlay?.classList.remove('bcn-open');
  document.body.style.overflow = '';
}
if (bcnBurger && bcnMob) {
  bcnBurger.addEventListener('click', () => {
    const opening = !bcnMob.classList.contains('bcn-open');
    bcnMob.classList.toggle('bcn-open', opening);
    bcnBurger.classList.toggle('bcn-open', opening);
    bcnOverlay?.classList.toggle('bcn-open', opening);
    document.body.style.overflow = opening ? 'hidden' : '';
  });
  bcnOverlay?.addEventListener('click', bcnCloseMob);
  document.addEventListener('keydown', e => { if (e.key === 'Escape') bcnCloseMob(); });
}

// === Counter animation ===
document.querySelectorAll('[data-counter]').forEach(el => {
  const cro = new IntersectionObserver(([entry]) => {
    if (entry.isIntersecting) {
      const target = +el.dataset.counter;
      const suffix = el.dataset.suffix || '';
      let cur = 0; const step = Math.ceil(target / 60);
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

// === Carousel Hero (vanilla JS, autoplay 5s, fade) ===
(function () {
  const hero = document.querySelector('.bcn-hero');
  if (!hero) return;
  const slides = Array.from(hero.querySelectorAll('.bcn-hero-slide'));
  const dots = Array.from(hero.querySelectorAll('.bcn-hero-dot'));
  const prevBtn = hero.querySelector('.bcn-hero-prev');
  const nextBtn = hero.querySelector('.bcn-hero-next');
  let idx = slides.findIndex(s => s.classList.contains('bcn-active'));
  if (idx < 0) idx = 0;
  let timer = null;

  function show(i) {
    slides.forEach((s, n) => s.classList.toggle('bcn-active', n === i));
    dots.forEach((d, n) => d.classList.toggle('bcn-active', n === i));
    idx = i;
  }
  function next() { show((idx + 1) % slides.length); }
  function prev() { show((idx - 1 + slides.length) % slides.length); }
  function restart() { clearInterval(timer); timer = setInterval(next, 5000); }

  dots.forEach((d, n) => d.addEventListener('click', () => { show(n); restart(); }));
  nextBtn?.addEventListener('click', () => { next(); restart(); });
  prevBtn?.addEventListener('click', () => { prev(); restart(); });
  restart();
})();

// === Chuyên mục — filter tabs (vanilla JS, client-side) ===
(function () {
  const tabs = document.querySelectorAll('.bcn-tab[data-filter]');
  if (!tabs.length) return;
  const cards = document.querySelectorAll('[data-cat]');
  const empty = document.querySelector('.bcn-empty-state');
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('bcn-tab-active'));
      tab.classList.add('bcn-tab-active');
      const f = tab.dataset.filter;
      let visibleCount = 0;
      cards.forEach(card => {
        const show = f === 'all' || card.dataset.cat === f;
        card.style.display = show ? '' : 'none';
        if (show) visibleCount++;
      });
      empty?.classList.toggle('bcn-show', visibleCount === 0);
    });
  });
})();
