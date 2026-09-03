// ══ BẾP XANH — main.js (vanilla JS, không dùng thư viện ngoài) ══

// === Reveal animation ===
const bamRO = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); bamRO.unobserve(e.target); } });
}, { threshold: .08, rootMargin: '0px 0px -36px 0px' });
document.querySelectorAll('[data-reveal]').forEach(el => bamRO.observe(el));

// === Mobile hamburger ===
const bamBurger = document.getElementById('navBurger');
const bamMob = document.getElementById('navMob');
if (bamBurger && bamMob) {
  bamBurger.addEventListener('click', () => {
    const o = bamMob.classList.toggle('open');
    bamBurger.classList.toggle('open', o);
    document.body.style.overflow = o ? 'hidden' : '';
  });
  bamMob.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
    bamMob.classList.remove('open'); bamBurger.classList.remove('open'); document.body.style.overflow = '';
  }));
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && bamMob.classList.contains('open')) {
      bamMob.classList.remove('open'); bamBurger.classList.remove('open'); document.body.style.overflow = '';
    }
  });
}

// === Carousel Hero (vanilla JS, autoplay 5s, fade transition) ===
(function () {
  const hero = document.querySelector('.bam-hero');
  if (!hero) return;
  const slides = Array.from(hero.querySelectorAll('.bam-hero-slide'));
  const dots = Array.from(hero.querySelectorAll('.bam-hero-dot'));
  const prevBtn = hero.querySelector('.bam-hero-prev');
  const nextBtn = hero.querySelector('.bam-hero-next');
  let cur = slides.findIndex(s => s.classList.contains('active'));
  if (cur < 0) cur = 0;
  let timer = null;

  function show(i) {
    slides[cur].classList.remove('active');
    dots[cur] && dots[cur].classList.remove('active');
    cur = (i + slides.length) % slides.length;
    slides[cur].classList.add('active');
    dots[cur] && dots[cur].classList.add('active');
  }
  function next() { show(cur + 1); }
  function prev() { show(cur - 1); }
  function restart() { clearInterval(timer); timer = setInterval(next, 5000); }

  nextBtn && nextBtn.addEventListener('click', () => { next(); restart(); });
  prevBtn && prevBtn.addEventListener('click', () => { prev(); restart(); });
  dots.forEach((d, i) => d.addEventListener('click', () => { show(i); restart(); }));
  restart();
})();

// === FAQ accordion (custom) ===
document.querySelectorAll('.bam-faq-item').forEach(item => {
  const q = item.querySelector('.bam-faq-q');
  if (!q) return;
  q.addEventListener('click', () => {
    const isOpen = item.classList.contains('open');
    item.closest('.bam-faq-list').querySelectorAll('.bam-faq-item').forEach(i => i.classList.remove('open'));
    if (!isOpen) item.classList.add('open');
  });
});

// === Category tab filter (chuyen-muc.html) ===
(function () {
  const tabs = document.querySelectorAll('[data-tab]');
  const cards = document.querySelectorAll('[data-cat]');
  if (!tabs.length || !cards.length) return;
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      const target = tab.dataset.tab;
      cards.forEach(card => {
        const show = target === 'all' || card.dataset.cat === target;
        card.style.display = show ? '' : 'none';
      });
    });
  });
})();

// === Counter animation ([data-counter]) ===
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
