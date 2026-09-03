// ══ La Bàn Tài Chính — main.js (vanilla JS, không jQuery) ══

// === Reveal animation ===
const btcRo = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); btcRo.unobserve(e.target); } });
}, { threshold: .08, rootMargin: '0px 0px -36px 0px' });
document.querySelectorAll('[data-reveal]').forEach(el => btcRo.observe(el));

// === Mobile hamburger ===
const btcBurger = document.getElementById('navBurger');
const btcMob = document.getElementById('navMob');
if (btcBurger && btcMob) {
  btcBurger.addEventListener('click', () => {
    const o = btcMob.classList.toggle('open');
    btcBurger.classList.toggle('open', o);
    document.body.style.overflow = o ? 'hidden' : '';
  });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && btcMob.classList.contains('open')) {
      btcMob.classList.remove('open'); btcBurger.classList.remove('open'); document.body.style.overflow = '';
    }
  });
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

// === Hero carousel — vanilla JS, fade transition, autoplay 5s ===
(function () {
  const hero = document.querySelector('.btc-hero');
  if (!hero) return;
  const slides = hero.querySelectorAll('.btc-hero-slide');
  const dots = hero.querySelectorAll('.btc-hero-dot');
  const prevBtn = hero.querySelector('.btc-hero-prev');
  const nextBtn = hero.querySelector('.btc-hero-next');
  let idx = 0; let timer = null;

  function go(n) {
    slides[idx].classList.remove('active');
    dots[idx] && dots[idx].classList.remove('active');
    idx = (n + slides.length) % slides.length;
    slides[idx].classList.add('active');
    dots[idx] && dots[idx].classList.add('active');
  }
  function next() { go(idx + 1); }
  function prev() { go(idx - 1); }
  function restart() { clearInterval(timer); timer = setInterval(next, 5000); }

  nextBtn && nextBtn.addEventListener('click', () => { next(); restart(); });
  prevBtn && prevBtn.addEventListener('click', () => { prev(); restart(); });
  dots.forEach((d, i) => d.addEventListener('click', () => { go(i); restart(); }));
  restart();
})();

// === FAQ accordion (custom toggle) ===
document.querySelectorAll('.btc-faq-item').forEach(item => {
  const q = item.querySelector('.btc-faq-q');
  const a = item.querySelector('.btc-faq-a');
  if (!q || !a) return;
  q.addEventListener('click', () => {
    const isOpen = item.classList.contains('open');
    item.parentElement.querySelectorAll('.btc-faq-item.open').forEach(other => {
      if (other !== item) { other.classList.remove('open'); other.querySelector('.btc-faq-a').style.maxHeight = null; }
    });
    if (isOpen) { item.classList.remove('open'); a.style.maxHeight = null; }
    else { item.classList.add('open'); a.style.maxHeight = a.scrollHeight + 'px'; }
  });
});

// === Filter chips (trang chuyên mục) ===
(function () {
  const chips = document.querySelectorAll('.btc-filter-chip');
  const cards = document.querySelectorAll('[data-cat]');
  if (!chips.length || !cards.length) return;
  chips.forEach(chip => {
    chip.addEventListener('click', () => {
      chips.forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      const val = chip.dataset.filter;
      cards.forEach(card => {
        const show = val === 'all' || card.dataset.cat === val;
        card.style.display = show ? '' : 'none';
      });
    });
  });
})();

// === Tabs (trang công cụ tính toán) ===
(function () {
  const tabBtns = document.querySelectorAll('.btc-tab-btn');
  const panels = document.querySelectorAll('.btc-tab-panel');
  if (!tabBtns.length) return;
  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      tabBtns.forEach(b => b.classList.remove('active'));
      panels.forEach(p => p.classList.remove('active'));
      btn.classList.add('active');
      document.getElementById(btn.dataset.tab).classList.add('active');
    });
  });
})();

// === Helpers ===
function btcVND(n) {
  return Math.round(n).toLocaleString('vi-VN') + ' đ';
}
function btcNum(id) {
  const el = document.getElementById(id);
  return el ? (parseFloat(el.value.replace(/[^0-9.-]/g, '')) || 0) : 0;
}

// === Máy tính lãi kép ===
(function () {
  const form = document.getElementById('btcCompoundForm');
  if (!form) return;
  function calc() {
    const principal = btcNum('btcPrincipal');
    const rate = btcNum('btcRate') / 100;
    const years = btcNum('btcYears');
    const monthly = btcNum('btcMonthly');
    const freq = document.getElementById('btcFreq').value; // yearly, quarterly, monthly
    const n = freq === 'monthly' ? 12 : freq === 'quarterly' ? 4 : 1;

    let balance = principal;
    let totalContrib = principal;
    const periodsPerYear = n;
    const ratePerPeriod = rate / periodsPerYear;
    const monthlyPerPeriod = monthly * (12 / periodsPerYear);

    for (let y = 0; y < years * periodsPerYear; y++) {
      balance = balance * (1 + ratePerPeriod) + monthlyPerPeriod;
      totalContrib += monthlyPerPeriod;
    }
    const interest = balance - totalContrib;
    const pctContrib = totalContrib / balance * 100;
    const pctInterest = 100 - pctContrib;

    document.getElementById('btcCompoundTotal').textContent = btcVND(balance);
    document.getElementById('btcCompoundContrib').textContent = btcVND(totalContrib);
    document.getElementById('btcCompoundInterest').textContent = btcVND(interest > 0 ? interest : 0);
    const barContrib = document.getElementById('btcBarContrib');
    const barInterest = document.getElementById('btcBarInterest');
    if (barContrib && barInterest) {
      barContrib.style.width = Math.max(pctContrib, 0) + '%';
      barInterest.style.width = Math.max(pctInterest, 0) + '%';
    }
  }
  form.addEventListener('input', calc);
  document.getElementById('btcFreq').addEventListener('change', calc);
  calc();
})();

// === Công cụ ngân sách 50/30/20 ===
(function () {
  const form = document.getElementById('btcBudgetForm');
  if (!form) return;
  function calc() {
    const income = btcNum('btcIncome');
    const needs = income * 0.5;
    const wants = income * 0.3;
    const save = income * 0.2;
    document.getElementById('btcBudgetNeeds').textContent = btcVND(needs);
    document.getElementById('btcBudgetWants').textContent = btcVND(wants);
    document.getElementById('btcBudgetSave').textContent = btcVND(save);
    const barNeeds = document.getElementById('btcBarNeeds');
    const barWants = document.getElementById('btcBarWants');
    const barSave = document.getElementById('btcBarSave');
    if (barNeeds) barNeeds.style.width = '50%';
    if (barWants) barWants.style.width = '30%';
    if (barSave) barSave.style.width = '20%';
  }
  form.addEventListener('input', calc);
  calc();
})();

// === Công cụ tính quỹ khẩn cấp ===
(function () {
  const form = document.getElementById('btcEmergencyForm');
  if (!form) return;
  function calc() {
    const monthlyCost = btcNum('btcMonthlyCost');
    const months = btcNum('btcMonthsTarget');
    const total = monthlyCost * months;
    document.getElementById('btcEmergencyTotal').textContent = btcVND(total);
    document.getElementById('btcEmergencyMonthly').textContent = btcVND(monthlyCost);
    document.getElementById('btcEmergencyMonths').textContent = months + ' tháng';
  }
  form.addEventListener('input', calc);
  document.getElementById('btcMonthsTarget').addEventListener('change', calc);
  calc();
})();

// === Contact form demo (không backend — chỉ UI feedback) ===
(function () {
  const form = document.getElementById('btcContactForm');
  if (!form) return;
  form.addEventListener('submit', e => {
    e.preventDefault();
    const btn = form.querySelector('button[type="submit"]');
    const original = btn.textContent;
    btn.textContent = 'Đã gửi — cảm ơn bạn!';
    btn.disabled = true;
    setTimeout(() => { btn.textContent = original; btn.disabled = false; form.reset(); }, 2600);
  });
})();

// === Newsletter form demo ===
(function () {
  const form = document.getElementById('btcNewsletterForm');
  if (!form) return;
  form.addEventListener('submit', e => {
    e.preventDefault();
    const btn = form.querySelector('button[type="submit"]');
    const original = btn.textContent;
    btn.textContent = 'Đã đăng ký!';
    setTimeout(() => { btn.textContent = original; form.reset(); }, 2400);
  });
})();
