// ══ XÊ DỊCH — Travel Journal — main.js (vanilla JS, không jQuery) ══

// === Reveal animation ===
const bdlRO = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); bdlRO.unobserve(e.target); } });
}, { threshold: .08, rootMargin: '0px 0px -36px 0px' });
document.querySelectorAll('[data-reveal]').forEach(el => bdlRO.observe(el));

// === Nav scroll — Nav-1 Transparent → Scrolled ===
const bdlNav = document.getElementById('bdlNav');
if (bdlNav && bdlNav.dataset.scrollNav) {
  const bdlToggleNav = () => bdlNav.classList.toggle('scrolled', window.scrollY > 80);
  window.addEventListener('scroll', bdlToggleNav, { passive: true });
  bdlToggleNav();
}

// === Mobile hamburger ===
const bdlBurger = document.getElementById('bdlBurger');
const bdlMob = document.getElementById('bdlNavMob');
if (bdlBurger && bdlMob) {
  bdlBurger.addEventListener('click', () => {
    const o = bdlMob.classList.toggle('open');
    bdlBurger.classList.toggle('open', o);
    document.body.style.overflow = o ? 'hidden' : '';
  });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && bdlMob.classList.contains('open')) {
      bdlMob.classList.remove('open'); bdlBurger.classList.remove('open'); document.body.style.overflow = '';
    }
  });
  bdlMob.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
    bdlMob.classList.remove('open'); bdlBurger.classList.remove('open'); document.body.style.overflow = '';
  }));
}

// === Counter animation ===
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

// === Carousel Hero — vanilla JS, auto-play 5s, fade .8s ===
(function bdlHeroCarousel() {
  const hero = document.querySelector('.bdl-hero');
  if (!hero) return;
  const slides = Array.from(hero.querySelectorAll('.bdl-hero-slide'));
  const dots = Array.from(hero.querySelectorAll('.bdl-hero-dot'));
  const prevBtn = hero.querySelector('.bdl-hero-prev');
  const nextBtn = hero.querySelector('.bdl-hero-next');
  let idx = slides.findIndex(s => s.classList.contains('active'));
  if (idx < 0) idx = 0;
  let timer = null;

  function show(i) {
    slides.forEach((s, si) => s.classList.toggle('active', si === i));
    dots.forEach((d, di) => d.classList.toggle('active', di === i));
    idx = i;
  }
  function next() { show((idx + 1) % slides.length); }
  function prev() { show((idx - 1 + slides.length) % slides.length); }
  function restart() { if (timer) clearInterval(timer); timer = setInterval(next, 5000); }

  if (nextBtn) nextBtn.addEventListener('click', () => { next(); restart(); });
  if (prevBtn) prevBtn.addEventListener('click', () => { prev(); restart(); });
  dots.forEach((d, di) => d.addEventListener('click', () => { show(di); restart(); }));

  restart();
})();

// === Chuyên mục tabs (chuyen-muc.html) ===
(function bdlCatTabs() {
  const tabs = document.querySelectorAll('.bdl-cat-tab');
  if (!tabs.length) return;
  const panels = document.querySelectorAll('.bdl-cat-panel');
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const cat = tab.dataset.cat;
      tabs.forEach(t => t.classList.toggle('active', t === tab));
      panels.forEach(p => p.classList.toggle('active', p.dataset.cat === cat));
    });
  });
})();
