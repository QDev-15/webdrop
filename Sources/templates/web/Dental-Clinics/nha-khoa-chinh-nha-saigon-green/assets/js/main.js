// ══ Nha Khoa Chỉnh Nha Sài Gòn — GREEN — main.js ══
// Vanilla JS thuần — không jQuery, không framework

// === Reveal animation (IntersectionObserver) ===
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -36px 0px' });
document.querySelectorAll('[data-reveal]').forEach((el) => revealObserver.observe(el));

// === Nav elevated on scroll ===
const nav = document.getElementById('nav');
if (nav) {
  const onScroll = () => {
    if (window.scrollY > 40) {
      nav.classList.add('nav-elevated');
    } else {
      nav.classList.remove('nav-elevated');
    }
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

// === Mobile menu toggle ===
const burger = document.getElementById('navBurger');
const mobileMenu = document.getElementById('navMobileMenu');
const mobileClose = document.getElementById('navMobileClose');

function closeMobileMenu() {
  if (!burger || !mobileMenu) return;
  burger.classList.remove('open');
  mobileMenu.classList.remove('open');
  document.body.style.overflow = '';
}

if (burger && mobileMenu) {
  burger.addEventListener('click', () => {
    const isOpen = mobileMenu.classList.toggle('open');
    burger.classList.toggle('open', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });
  if (mobileClose) mobileClose.addEventListener('click', closeMobileMenu);
  mobileMenu.querySelectorAll('a').forEach((a) => a.addEventListener('click', closeMobileMenu));
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mobileMenu.classList.contains('open')) closeMobileMenu();
  });
}

// === Booking form submit (demo — template tĩnh không có backend) ===
function bindDemoForm(formId, successId) {
  const form = document.getElementById(formId);
  const success = document.getElementById(successId);
  if (!form || !success) return;
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (typeof form.reportValidity === 'function' && !form.reportValidity()) return;
    form.style.display = 'none';
    success.style.display = 'block';
    success.classList.add('show');
    form.reset();
  });
}
bindDemoForm('cnBookingForm', 'cnBookingSuccess');
bindDemoForm('cnContactForm', 'cnContactSuccess');

// === Dịch vụ — filter tabs theo danh mục ===
const filterTabs = document.querySelectorAll('[data-filter-tab]');
const serviceCards = document.querySelectorAll('[data-service-card]');
if (filterTabs.length && serviceCards.length) {
  filterTabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      filterTabs.forEach((t) => t.classList.remove('cn-btn-primary'));
      filterTabs.forEach((t) => { if (t !== tab) t.classList.add('cn-btn-ghost'); });
      tab.classList.remove('cn-btn-ghost');
      tab.classList.add('cn-btn-primary');

      const cat = tab.getAttribute('data-filter-tab');
      serviceCards.forEach((card) => {
        const show = cat === 'all' || card.getAttribute('data-service-card') === cat;
        card.style.display = show ? '' : 'none';
      });
    });
  });
}
