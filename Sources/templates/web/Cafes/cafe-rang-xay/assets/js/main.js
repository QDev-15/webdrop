/* ══ Cà Phê Rang Xay — Xưởng Rang Đặc Sản — Shared JS (vanilla, no jQuery) ══ */

/* Nav scroll state */
const crxNav = document.getElementById('crxNav');
if (crxNav) {
  const toggleScrolled = () => { crxNav.classList.toggle('scrolled', window.scrollY > 60); };
  toggleScrolled();
  window.addEventListener('scroll', toggleScrolled, { passive: true });
}

/* Mobile hamburger menu */
const crxBurger = document.getElementById('crxBurger');
const crxNavMob = document.getElementById('crxNavMob');
if (crxBurger && crxNavMob) {
  const closeMobileNav = () => {
    crxNavMob.classList.remove('open');
    crxBurger.classList.remove('open');
    document.body.style.overflow = '';
  };
  crxBurger.addEventListener('click', () => {
    const isOpen = crxNavMob.classList.toggle('open');
    crxBurger.classList.toggle('open', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });
  crxNavMob.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMobileNav));
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeMobileNav(); });
}

/* Reveal on scroll — IntersectionObserver + [data-reveal] */
const crxRevealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      crxRevealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
document.querySelectorAll('[data-reveal]').forEach((el) => crxRevealObserver.observe(el));

/* Counter animation — [data-counter] */
const crxCounterObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    const el = entry.target;
    const target = parseFloat(el.dataset.counter);
    const suffix = el.dataset.counterSuffix || '';
    const duration = 1400;
    const start = performance.now();
    const step = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(target * eased) + suffix;
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
    crxCounterObserver.unobserve(el);
  });
}, { threshold: 0.4 });
document.querySelectorAll('[data-counter]').forEach((el) => crxCounterObserver.observe(el));

/* CAROUSEL HERO — vanilla JS, autoplay 5s, fade 0.8s (không dùng Bootstrap Carousel) */
const crxHero = document.getElementById('crxHero');
if (crxHero) {
  const slides = Array.from(crxHero.querySelectorAll('.crx-hero-slide'));
  const dots = Array.from(document.querySelectorAll('#crxHeroDots .crx-hero-dot'));
  const prevBtn = document.getElementById('crxHeroPrev');
  const nextBtn = document.getElementById('crxHeroNext');
  let current = 0;
  let autoplayTimer = null;

  const goToSlide = (index) => {
    const total = slides.length;
    current = (index + total) % total;
    slides.forEach((slide, i) => slide.classList.toggle('active', i === current));
    dots.forEach((dot, i) => dot.classList.toggle('active', i === current));
  };

  const startAutoplay = () => {
    stopAutoplay();
    autoplayTimer = setInterval(() => goToSlide(current + 1), 5000);
  };
  const stopAutoplay = () => { if (autoplayTimer) clearInterval(autoplayTimer); };

  if (prevBtn) prevBtn.addEventListener('click', () => { goToSlide(current - 1); startAutoplay(); });
  if (nextBtn) nextBtn.addEventListener('click', () => { goToSlide(current + 1); startAutoplay(); });
  dots.forEach((dot) => {
    dot.addEventListener('click', () => { goToSlide(parseInt(dot.dataset.go, 10)); startAutoplay(); });
  });

  crxHero.addEventListener('mouseenter', stopAutoplay, { passive: true });
  crxHero.addEventListener('mouseleave', startAutoplay, { passive: true });

  startAutoplay();
}

/* Menu tabs — thực đơn có phân loại */
const crxMenuTabs = document.querySelectorAll('.crx-mt-btn');
if (crxMenuTabs.length) {
  crxMenuTabs.forEach((btn) => {
    btn.addEventListener('click', () => {
      crxMenuTabs.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      document.querySelectorAll('.crx-menu-panel').forEach((panel) => panel.classList.remove('active'));
      const target = document.getElementById('crx-panel-' + btn.dataset.tab);
      if (target) target.classList.add('active');
    });
  });
}
