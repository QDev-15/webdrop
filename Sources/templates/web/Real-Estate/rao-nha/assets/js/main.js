/* ══ RaoNhà — main.js (nav / reveal / catalog filter engine / trang chi tiết / đăng tin / tin tức) ══ */

/* === Reveal animation (bắt buộc mọi template) === */
const ro = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); ro.unobserve(e.target); } });
}, { threshold: .08, rootMargin: '0px 0px -36px 0px' });
function observeReveal(root) { (root || document).querySelectorAll('[data-reveal]').forEach(el => ro.observe(el)); }
observeReveal();

/* === Mobile hamburger === */
const burger = document.getElementById('navBurger');
const mob = document.getElementById('navMob');
if (burger && mob) {
  burger.addEventListener('click', () => {
    const o = mob.classList.toggle('open');
    burger.classList.toggle('open', o);
    document.body.style.overflow = o ? 'hidden' : '';
  });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && mob.classList.contains('open')) {
      mob.classList.remove('open'); burger.classList.remove('open'); document.body.style.overflow = '';
    }
  });
}

/* === Counter animation === */
document.querySelectorAll('[data-counter]').forEach(el => {
  const cro = new IntersectionObserver(([entry]) => {
    if (entry.isIntersecting) {
      const target = +el.dataset.counter;
      const suffix = el.dataset.suffix || '';
      let cur = 0; const step = Math.ceil(target / 60);
      const t = setInterval(() => { cur = Math.min(cur + step, target); el.textContent = cur.toLocaleString('vi-VN') + suffix; if (cur >= target) clearInterval(t); }, 25);
      cro.disconnect();
    }
  }, { threshold: .5 });
  cro.observe(el);
});

document.querySelectorAll('[data-year]').forEach(el => el.textContent = new Date().getFullYear());

/* === Nav active state — xử lý riêng vì "Nhà đất bán"/"Nhà đất cho thuê" trỏ chung 1 file === */
(function navActive() {
  const file = location.pathname.split('/').pop() || 'index.html';
  if (file !== 'bat-dong-san.html') return;
  const need = new URLSearchParams(location.search).get('nhu-cau');
  document.querySelectorAll('.rn-nav-links a, .rn-nav-mob a').forEach(a => {
    const url = new URL(a.getAttribute('href'), location.href);
    if (url.pathname.split('/').pop() !== 'bat-dong-san.html') { a.classList.remove('active'); return; }
    const linkNeed = url.searchParams.get('nhu-cau');
    a.classList.toggle('active', linkNeed === need);
  });
})();

/* ---------------------------------------------------------------- */
/* ===== Tài khoản / ví / thời hạn tin (MOCK — UI demo, không backend thật) =====
   Toàn bộ state lưu ở localStorage phía trình duyệt, chỉ để minh hoạ trải nghiệm
   đăng nhập → quản lý tin → nạp credit → mua/gia hạn gói VIP → thời hạn tin đăng.
   Bản WebDeploy thật cần tài khoản/thanh toán/duyệt tin xử lý ở backend — xem
   ghi chú phạm vi trong real-estate-template-builder.md. */
const RN_AUTH_KEY = 'rn_mock_account';
const RN_TODAY = new Date(2026, 7, 23); // mốc "hôm nay" khớp với properties-data.js
const TIER_DURATION_DAYS = { 'thuong': 30, 'vip-bac': 15, 'vip-vang': 15, 'vip-kim-cuong': 15 };
const TIER_PRICE = { 'thuong': 0, 'vip-bac': 99000, 'vip-vang': 299000, 'vip-kim-cuong': 699000 };

function rnGetAccount() {
  try { return JSON.parse(localStorage.getItem(RN_AUTH_KEY)); } catch (e) { return null; }
}
function rnSetAccount(acc) { localStorage.setItem(RN_AUTH_KEY, JSON.stringify(acc)); }
function rnClearAccount() { localStorage.removeItem(RN_AUTH_KEY); }
function rnFormatVND(n) { return Math.round(n).toLocaleString('vi-VN') + 'đ'; }
function rnFormatDate(d) { return new Date(d).toLocaleDateString('vi-VN'); }

function rnDefaultAccount(overrides) {
  const acc = {
    name: 'Nguyễn Văn Nam',
    email: 'nam.nguyen@demo.vn',
    phone: '0912 345 678',
    credit: 250000,
    listings: [
      { propertyId: 2, tier: 'thuong', postedDate: rnDaysAgoISO(25) },
      { propertyId: 9, tier: 'vip-bac', postedDate: rnDaysAgoISO(20) },
      { propertyId: 16, tier: 'vip-vang', postedDate: rnDaysAgoISO(3) },
      { propertyId: 25, tier: 'thuong', postedDate: rnDaysAgoISO(2) }
    ],
    transactions: [
      { date: rnDaysAgoISO(18), type: 'nap', amount: 200000, method: 'Chuyển khoản ngân hàng', note: 'Nạp credit vào ví' },
      { date: rnDaysAgoISO(18), type: 'tru', amount: -99000, method: 'Trừ từ ví', note: 'Mua gói VIP Bạc cho 1 tin đăng' },
      { date: rnDaysAgoISO(10), type: 'nap', amount: 300000, method: 'Chuyển khoản ngân hàng', note: 'Nạp credit vào ví' },
      { date: rnDaysAgoISO(10), type: 'tru', amount: -299000, method: 'Trừ từ ví', note: 'Mua gói VIP Vàng cho 1 tin đăng' }
    ]
  };
  return Object.assign(acc, overrides || {});
}
function rnDaysAgoISO(n) {
  const d = new Date(RN_TODAY);
  d.setDate(d.getDate() - n);
  return d.toISOString().slice(0, 10);
}
function rnExpiryInfo(postedDate, tier) {
  const posted = new Date(postedDate);
  const duration = TIER_DURATION_DAYS[tier] || 30;
  const expires = new Date(posted);
  expires.setDate(expires.getDate() + duration);
  const daysLeft = Math.ceil((expires - RN_TODAY) / 86400000);
  return { expiresDate: expires, expiresLabel: rnFormatDate(expires), daysLeft, expired: daysLeft < 0 };
}
function rnFindProperty(id) { return PROPERTIES.find(p => p.id === id); }

/* Nav — chèn slot "Tài khoản" bên cạnh nút "+ Đăng tin" (chạy trên MỌI trang) */
function rnRenderAccountNav() {
  const acc = rnGetAccount();
  const desktopSlot = document.querySelector('.rn-nav-right');
  const mobSlot = document.querySelector('.rn-nav-mob-inner');
  document.querySelectorAll('.rn-nav-account, .rn-nav-mob-account').forEach(n => n.remove());
  if (!desktopSlot) return;

  const desktopHTML = acc
    ? `<a href="tai-khoan.html" class="rn-nav-account">👤 ${acc.name.split(' ').slice(-1)[0]} · <strong>${rnFormatVND(acc.credit)}</strong></a>`
    : `<a href="dang-nhap.html" class="rn-nav-account">Đăng nhập</a>`;
  const dTpl = document.createElement('template'); dTpl.innerHTML = desktopHTML.trim();
  const ctaBtn = desktopSlot.querySelector('.rn-nav-cta');
  if (ctaBtn) desktopSlot.insertBefore(dTpl.content.firstChild, ctaBtn); else desktopSlot.appendChild(dTpl.content.firstChild);

  if (mobSlot) {
    const mobHTML = acc
      ? `<a href="tai-khoan.html" class="rn-nav-mob-account">👤 Tài khoản của tôi · ${rnFormatVND(acc.credit)}</a>`
      : `<a href="dang-nhap.html" class="rn-nav-mob-account">Đăng nhập / Đăng ký</a>`;
    const mTpl = document.createElement('template'); mTpl.innerHTML = mobHTML.trim();
    const mobCta = mobSlot.querySelector('.rn-nav-cta');
    if (mobCta) mobSlot.insertBefore(mTpl.content.firstChild, mobCta); else mobSlot.appendChild(mTpl.content.firstChild);
  }
}
rnRenderAccountNav();

/* ---------------------------------------------------------------- */
/* ===== Component render dùng chung: thẻ bất động sản ===== */
function tierBadgeHTML(p) {
  if (p.listingTier === 'vip-kim-cuong') return '<span class="rn-tier rn-tier-kc">💎 VIP Kim Cương</span>';
  if (p.listingTier === 'vip-vang') return '<span class="rn-tier rn-tier-vang">★ VIP Vàng</span>';
  if (p.listingTier === 'vip-bac') return '<span class="rn-tier rn-tier-bac">VIP Bạc</span>';
  return '';
}
function statusBadgeHTML(p) {
  if (p.badge === 'moi') return '<span class="rn-badge rn-badge-moi">Mới đăng</span>';
  if (p.badge === 'hot') return '<span class="rn-badge rn-badge-hot">🔥 Hot</span>';
  return '';
}
function renderPropertyCard(p) {
  return `<a href="chi-tiet-bds.html?slug=${p.slug}" class="rn-card" data-reveal>
    <div class="rn-card-img">
      <img src="${p.images[0]}" alt="${p.title}" loading="lazy" onerror="this.src='data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22400%22 height=%22300%22%3E%3Crect width=%22400%22 height=%22300%22 fill=%22%23e5f5ec%22/%3E%3C/svg%3E'">
      <span class="rn-card-need">${p.listingType === 'ban' ? 'Bán' : 'Cho thuê'}</span>
      ${statusBadgeHTML(p)}
      ${tierBadgeHTML(p)}
    </div>
    <div class="rn-card-body">
      <div class="rn-card-price">${formatPrice(p.price, p.listingType)}</div>
      <h3 class="rn-card-title">${p.title}</h3>
      <div class="rn-card-meta">
        <span>${p.area}m²</span>
        ${p.bedrooms > 0 ? `<span>${p.bedrooms} PN</span>` : '<span>Đất nền</span>'}
        <span>📍 ${p.district}</span>
      </div>
      <div class="rn-card-foot">
        <span class="rn-card-poster">${p.poster.name}</span>
        <span class="rn-card-type">${TYPE_LABELS[p.propertyType]}</span>
      </div>
    </div>
  </a>`;
}

/* ---------------------------------------------------------------- */
/* ===== TRANG CHỦ ===== */
(function homepage() {
  const vipGrid = document.getElementById('vipGrid');
  const newGrid = document.getElementById('newGrid');
  const newsGrid = document.getElementById('homeNewsGrid');
  if (!vipGrid && !newGrid && !newsGrid) return;

  if (vipGrid) {
    const vip = PROPERTIES.filter(p => p.listingTier !== 'thuong')
      .sort((a, b) => TIER_ORDER[a.listingTier] - TIER_ORDER[b.listingTier]).slice(0, 8);
    vipGrid.innerHTML = vip.map(renderPropertyCard).join('');
    observeReveal(vipGrid);
  }
  if (newGrid) {
    const news = [...PROPERTIES].sort((a, b) => new Date(b.postedDate) - new Date(a.postedDate)).slice(0, 8);
    newGrid.innerHTML = news.map(renderPropertyCard).join('');
    observeReveal(newGrid);
  }
  if (newsGrid) {
    newsGrid.innerHTML = ARTICLES.slice(0, 4).map(a => `
      <a href="tin-tuc-chi-tiet.html?slug=${a.slug}" class="rn-news-card" data-reveal>
        <div class="rn-news-thumb"><img src="${a.thumb}" alt="${a.title}" loading="lazy"></div>
        <div class="rn-news-body">
          <span class="rn-news-cat">${a.category}</span>
          <h3>${a.title}</h3>
          <span class="rn-news-date">${new Date(a.date).toLocaleDateString('vi-VN')}</span>
        </div>
      </a>`).join('');
    observeReveal(newsGrid);
  }

  const heroForm = document.getElementById('heroSearchForm');
  if (heroForm) {
    heroForm.addEventListener('submit', e => {
      e.preventDefault();
      const fd = new FormData(heroForm);
      const params = new URLSearchParams();
      const need = fd.get('need'); if (need) params.set('nhu-cau', need);
      const type = fd.get('type'); if (type) params.set('loai', type);
      const area = fd.get('area'); if (area) params.set('khu-vuc', area);
      const price = fd.get('price'); if (price) params.set('gia', price);
      const q = fd.get('q'); if (q) params.set('q', q);
      window.location.href = 'bat-dong-san.html?' + params.toString();
    });
  }
  document.querySelectorAll('[data-need-tab]').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('[data-need-tab]').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      const hidden = heroForm ? heroForm.querySelector('input[name="need"]') : null;
      if (hidden) hidden.value = tab.dataset.needTab;
      const priceSel = heroForm ? heroForm.querySelector('select[name="price"]') : null;
      if (priceSel) {
        const ranges = tab.dataset.needTab === 'cho-thue' ? PRICE_RANGES_THUE : PRICE_RANGES_BAN;
        priceSel.innerHTML = '<option value="">Khoảng giá</option>' + ranges.map(r => `<option value="${r.v}">${r.label}</option>`).join('');
      }
    });
  });
})();

/* ---------------------------------------------------------------- */
/* ===== BỘ LỌC / CATALOG (bat-dong-san.html) ===== */
const PRICE_RANGES_BAN = [
  { v: 'duoi-2ty', label: 'Dưới 2 tỷ', min: 0, max: 2e9 },
  { v: '2-5ty', label: '2 - 5 tỷ', min: 2e9, max: 5e9 },
  { v: '5-10ty', label: '5 - 10 tỷ', min: 5e9, max: 10e9 },
  { v: '10-20ty', label: '10 - 20 tỷ', min: 10e9, max: 20e9 },
  { v: 'tren-20ty', label: 'Trên 20 tỷ', min: 20e9, max: Infinity }
];
const PRICE_RANGES_THUE = [
  { v: 'duoi-8tr', label: 'Dưới 8 triệu/tháng', min: 0, max: 8e6 },
  { v: '8-15tr', label: '8 - 15 triệu/tháng', min: 8e6, max: 15e6 },
  { v: '15-25tr', label: '15 - 25 triệu/tháng', min: 15e6, max: 25e6 },
  { v: 'tren-25tr', label: 'Trên 25 triệu/tháng', min: 25e6, max: Infinity }
];
const AREA_RANGES = [
  { v: 'duoi-60', label: 'Dưới 60m²', min: 0, max: 60 },
  { v: '60-100', label: '60 - 100m²', min: 60, max: 100 },
  { v: '100-200', label: '100 - 200m²', min: 100, max: 200 },
  { v: 'tren-200', label: 'Trên 200m²', min: 200, max: Infinity }
];
const FILTER_GROUP_MAP = { type: 'types', area: 'areas', direction: 'directions', legal: 'legal', furnishing: 'furnishing' };

(function catalog() {
  const grid = document.getElementById('propGrid');
  if (!grid) return;

  const PER_PAGE = 12;
  let state = { need: '', types: [], areas: [], priceRange: '', bedrooms: '', areaRange: '', directions: [], legal: [], furnishing: [], sort: 'moi-nhat', page: 1, q: '', nguoiDang: '' };

  const countEl = document.getElementById('resultCount');
  const chipsEl = document.getElementById('activeChips');
  const paginationEl = document.getElementById('pagination');
  const emptyEl = document.getElementById('emptyState');
  const filterBadge = document.getElementById('filterBadge');

  function priceRangesForNeed() { return state.need === 'cho-thue' ? PRICE_RANGES_THUE : PRICE_RANGES_BAN; }

  function renderPriceOptions() {
    const ranges = priceRangesForNeed();
    document.querySelectorAll('[data-select="price"]').forEach(sel => {
      sel.innerHTML = '<option value="">Khoảng giá</option>' + ranges.map(r => `<option value="${r.v}">${r.label}</option>`).join('');
      sel.value = state.priceRange;
    });
  }

  function matchProperty(p) {
    if (state.need && p.listingType !== state.need) return false;
    if (state.types.length && !state.types.includes(p.propertyType)) return false;
    if (state.areas.length && !state.areas.includes(p.districtSlug)) return false;
    if (state.priceRange) {
      const r = priceRangesForNeed().find(x => x.v === state.priceRange);
      if (r && (p.price < r.min || p.price >= r.max)) return false;
    }
    if (state.bedrooms) {
      if (state.bedrooms === '5') { if (!(p.bedrooms >= 5)) return false; }
      else if (p.bedrooms !== +state.bedrooms) return false;
    }
    if (state.areaRange) {
      const r = AREA_RANGES.find(x => x.v === state.areaRange);
      if (r && (p.area < r.min || p.area >= r.max)) return false;
    }
    if (state.directions.length && !state.directions.includes(p.direction)) return false;
    if (state.legal.length && !state.legal.includes(p.legalStatus)) return false;
    if (state.furnishing.length && !state.furnishing.includes(p.furnishing)) return false;
    if (state.nguoiDang && p.posterSlug !== state.nguoiDang) return false;
    if (state.q) {
      const q = state.q.toLowerCase();
      if (!p.title.toLowerCase().includes(q) && !p.district.toLowerCase().includes(q) && !p.city.toLowerCase().includes(q)) return false;
    }
    return true;
  }

  function sortProperties(list) {
    const arr = [...list];
    arr.sort((a, b) => {
      const tierDiff = TIER_ORDER[a.listingTier] - TIER_ORDER[b.listingTier];
      if (tierDiff !== 0) return tierDiff;
      if (state.sort === 'gia-tang') return a.price - b.price;
      if (state.sort === 'gia-giam') return b.price - a.price;
      if (state.sort === 'dien-tich-lon') return b.area - a.area;
      return new Date(b.postedDate) - new Date(a.postedDate);
    });
    return arr;
  }

  function activeFilterCount() {
    return (state.need ? 1 : 0) + state.types.length + state.areas.length + (state.priceRange ? 1 : 0)
      + (state.bedrooms ? 1 : 0) + (state.areaRange ? 1 : 0) + state.directions.length + state.legal.length + state.furnishing.length + (state.q ? 1 : 0);
  }

  function chipLabel(group, val) {
    if (group === 'type') return TYPE_LABELS[val];
    if (group === 'area') { const a = AREAS.find(x => x.slug === val); return a ? a.label : val; }
    if (group === 'direction') return DIRECTION_LABELS[val];
    if (group === 'legal') return LEGAL_LABELS[val];
    if (group === 'furnishing') return FURNISHING_LABELS[val];
    return val;
  }

  function renderActiveChips() {
    const chips = [];
    if (state.need) chips.push({ label: state.need === 'ban' ? 'Nhu cầu: Bán' : 'Nhu cầu: Cho thuê', remove: () => { state.need = ''; } });
    ['type', 'area', 'direction', 'legal', 'furnishing'].forEach(group => {
      const key = FILTER_GROUP_MAP[group];
      state[key].forEach(val => chips.push({ label: chipLabel(group, val), remove: () => { state[key] = state[key].filter(v => v !== val); } }));
    });
    if (state.priceRange) { const r = priceRangesForNeed().find(x => x.v === state.priceRange); chips.push({ label: r ? r.label : state.priceRange, remove: () => { state.priceRange = ''; } }); }
    if (state.bedrooms) chips.push({ label: state.bedrooms === '5' ? '5+ phòng ngủ' : state.bedrooms + ' phòng ngủ', remove: () => { state.bedrooms = ''; } });
    if (state.areaRange) { const r = AREA_RANGES.find(x => x.v === state.areaRange); chips.push({ label: r ? r.label : state.areaRange, remove: () => { state.areaRange = ''; } }); }
    if (state.q) chips.push({ label: `"${state.q}"`, remove: () => { state.q = ''; document.querySelectorAll('[data-search-input]').forEach(i => i.value = ''); } });

    if (!chips.length) { chipsEl.innerHTML = ''; chipsEl.hidden = true; return; }
    chipsEl.hidden = false;
    chipsEl.innerHTML = chips.map((c, i) => `<button type="button" class="rn-chip" data-chip="${i}">${c.label} <span>✕</span></button>`).join('')
      + `<button type="button" class="rn-chip-clear" id="clearAllChips">Xóa tất cả</button>`;
    chipsEl.querySelectorAll('[data-chip]').forEach(btn => btn.addEventListener('click', () => { chips[+btn.dataset.chip].remove(); onFilterChange(); }));
    const clearBtn = document.getElementById('clearAllChips');
    if (clearBtn) clearBtn.addEventListener('click', clearAllFilters);
  }

  function renderPagination(totalPages) {
    paginationEl.hidden = totalPages <= 1;
    if (totalPages <= 1) { paginationEl.innerHTML = ''; return; }
    let html = '';
    for (let n = 1; n <= totalPages; n++) html += `<li class="page-item${n === state.page ? ' active' : ''}"><button class="page-link" data-page="${n}">${n}</button></li>`;
    paginationEl.innerHTML = html;
  }

  function syncControlsFromState() {
    document.querySelectorAll('[data-need-pill]').forEach(btn => btn.classList.toggle('active', btn.dataset.needPill === state.need));
    document.querySelectorAll('[data-filter]').forEach(input => {
      const key = FILTER_GROUP_MAP[input.dataset.filter];
      input.checked = state[key].includes(input.value);
    });
    document.querySelectorAll('[data-select="bedrooms"]').forEach(s => s.value = state.bedrooms);
    document.querySelectorAll('[data-select="areaRange"]').forEach(s => s.value = state.areaRange);
    document.querySelectorAll('[data-select="sort"]').forEach(s => s.value = state.sort);
    document.querySelectorAll('[data-search-input]').forEach(s => { if (document.activeElement !== s) s.value = state.q; });
    renderPriceOptions();
    const count = activeFilterCount();
    if (filterBadge) { filterBadge.textContent = count; filterBadge.hidden = count === 0; }
  }

  function writeStateToURL() {
    const p = new URLSearchParams();
    if (state.need) p.set('nhu-cau', state.need);
    if (state.types.length) p.set('loai', state.types.join(','));
    if (state.areas.length) p.set('khu-vuc', state.areas.join(','));
    if (state.priceRange) p.set('gia', state.priceRange);
    if (state.bedrooms) p.set('pn', state.bedrooms);
    if (state.areaRange) p.set('dt', state.areaRange);
    if (state.directions.length) p.set('huong', state.directions.join(','));
    if (state.legal.length) p.set('phap-ly', state.legal.join(','));
    if (state.furnishing.length) p.set('noi-that', state.furnishing.join(','));
    if (state.sort !== 'moi-nhat') p.set('sort', state.sort);
    if (state.q) p.set('q', state.q);
    if (state.nguoiDang) p.set('nguoiDang', state.nguoiDang);
    if (state.page > 1) p.set('page', state.page);
    const qs = p.toString();
    history.replaceState(null, '', qs ? `?${qs}` : location.pathname);
  }

  function readStateFromURL() {
    const p = new URLSearchParams(location.search);
    if (p.get('nhu-cau')) state.need = p.get('nhu-cau');
    if (p.get('loai')) state.types = p.get('loai').split(',');
    if (p.get('khu-vuc')) state.areas = p.get('khu-vuc').split(',');
    if (p.get('gia')) state.priceRange = p.get('gia');
    if (p.get('pn')) state.bedrooms = p.get('pn');
    if (p.get('dt')) state.areaRange = p.get('dt');
    if (p.get('huong')) state.directions = p.get('huong').split(',');
    if (p.get('phap-ly')) state.legal = p.get('phap-ly').split(',');
    if (p.get('noi-that')) state.furnishing = p.get('noi-that').split(',');
    if (p.get('sort')) state.sort = p.get('sort');
    if (p.get('q')) state.q = p.get('q');
    if (p.get('nguoiDang')) state.nguoiDang = p.get('nguoiDang');
    if (p.get('page')) state.page = +p.get('page');
  }

  function render() {
    const filtered = sortProperties(PROPERTIES.filter(matchProperty));
    const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
    state.page = Math.min(Math.max(1, state.page), totalPages);
    const start = (state.page - 1) * PER_PAGE;
    const pageItems = filtered.slice(start, start + PER_PAGE);

    emptyEl.hidden = pageItems.length > 0;
    grid.hidden = pageItems.length === 0;
    grid.innerHTML = pageItems.map(renderPropertyCard).join('');
    observeReveal(grid);

    countEl.textContent = filtered.length
      ? `Tìm thấy ${filtered.length} bất động sản phù hợp — hiển thị ${start + 1}–${start + pageItems.length}`
      : 'Không tìm thấy bất động sản phù hợp với bộ lọc hiện tại';

    renderPagination(totalPages);
    renderActiveChips();
    syncControlsFromState();
    writeStateToURL();
  }

  function onFilterChange() { state.page = 1; render(); }

  function clearAllFilters() {
    state = { ...state, need: '', types: [], areas: [], priceRange: '', bedrooms: '', areaRange: '', directions: [], legal: [], furnishing: [], q: '', page: 1 };
    document.querySelectorAll('[data-search-input]').forEach(i => i.value = '');
    render();
  }

  document.querySelectorAll('[data-need-pill]').forEach(btn => btn.addEventListener('click', () => {
    state.need = state.need === btn.dataset.needPill ? '' : btn.dataset.needPill;
    state.priceRange = '';
    onFilterChange();
  }));
  document.querySelectorAll('[data-filter]').forEach(input => input.addEventListener('change', () => {
    const key = FILTER_GROUP_MAP[input.dataset.filter];
    if (input.checked) { if (!state[key].includes(input.value)) state[key].push(input.value); }
    else state[key] = state[key].filter(v => v !== input.value);
    onFilterChange();
  }));
  document.querySelectorAll('[data-select="price"]').forEach(s => s.addEventListener('change', () => { state.priceRange = s.value; onFilterChange(); }));
  document.querySelectorAll('[data-select="bedrooms"]').forEach(s => s.addEventListener('change', () => { state.bedrooms = s.value; onFilterChange(); }));
  document.querySelectorAll('[data-select="areaRange"]').forEach(s => s.addEventListener('change', () => { state.areaRange = s.value; onFilterChange(); }));
  document.querySelectorAll('[data-select="sort"]').forEach(s => s.addEventListener('change', () => { state.sort = s.value; onFilterChange(); }));

  let searchTimer;
  document.querySelectorAll('[data-search-input]').forEach(input => input.addEventListener('input', () => {
    clearTimeout(searchTimer);
    searchTimer = setTimeout(() => { state.q = input.value.trim(); onFilterChange(); }, 300);
  }));

  document.querySelectorAll('[data-clear-all]').forEach(btn => btn.addEventListener('click', clearAllFilters));

  paginationEl.addEventListener('click', e => {
    const btn = e.target.closest('[data-page]');
    if (!btn) return;
    state.page = +btn.dataset.page;
    render();
    grid.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });

  readStateFromURL();
  render();
})();

/* ---------------------------------------------------------------- */
/* ===== TRANG CHI TIẾT BĐS ===== */
(function detailPage() {
  const wrap = document.getElementById('bdsDetail');
  if (!wrap) return;

  const params = new URLSearchParams(location.search);
  const slug = params.get('slug');
  const p = PROPERTIES.find(x => x.slug === slug) || PROPERTIES[0];

  document.title = `${p.title} | RaoNhà`;
  const breadcrumbEl = document.getElementById('breadcrumbTitle');
  if (breadcrumbEl) breadcrumbEl.textContent = p.title;
  const h1El = document.getElementById('detailH1');
  if (h1El) h1El.textContent = p.title;

  document.getElementById('mainImage').src = p.images[0];
  document.getElementById('mainImage').alt = p.title;
  document.getElementById('galleryThumbs').innerHTML = p.images.map((img, i) =>
    `<button type="button" class="rn-thumb${i === 0 ? ' active' : ''}" data-img="${img}"><img src="${img}" alt="Ảnh ${i + 1}"></button>`).join('');
  document.getElementById('galleryStatus').textContent = p.listingType === 'ban' ? 'Đang bán' : 'Đang cho thuê';

  let curIdx = 0;
  function setImage(i) {
    curIdx = (i + p.images.length) % p.images.length;
    document.getElementById('mainImage').src = p.images[curIdx];
    document.querySelectorAll('.rn-thumb').forEach((t, idx) => t.classList.toggle('active', idx === curIdx));
  }
  document.getElementById('galleryThumbs').addEventListener('click', e => {
    const btn = e.target.closest('[data-img]');
    if (!btn) return;
    setImage([...document.querySelectorAll('.rn-thumb')].indexOf(btn));
  });

  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightboxImg');
  document.getElementById('mainImage').addEventListener('click', () => { lightbox.classList.add('open'); lightboxImg.src = p.images[curIdx]; });
  document.getElementById('lightboxClose').addEventListener('click', () => lightbox.classList.remove('open'));
  document.getElementById('lightboxPrev').addEventListener('click', () => { setImage(curIdx - 1); lightboxImg.src = p.images[curIdx]; });
  document.getElementById('lightboxNext').addEventListener('click', () => { setImage(curIdx + 1); lightboxImg.src = p.images[curIdx]; });
  lightbox.addEventListener('click', e => { if (e.target === lightbox) lightbox.classList.remove('open'); });

  document.getElementById('factPrice').textContent = formatPrice(p.price, p.listingType);
  document.getElementById('factArea').textContent = p.area + 'm²';
  document.getElementById('factBed').textContent = p.bedrooms > 0 ? p.bedrooms : '—';
  document.getElementById('factBath').textContent = p.bathrooms > 0 ? p.bathrooms : '—';
  document.getElementById('factDirection').textContent = DIRECTION_LABELS[p.direction];
  document.getElementById('factLegal').textContent = LEGAL_LABELS[p.legalStatus];

  document.getElementById('detailDesc').textContent = p.description;
  document.getElementById('detailAddress').textContent = p.address;
  document.getElementById('detailFurnishing').textContent = FURNISHING_LABELS[p.furnishing];
  document.getElementById('detailFeatures').innerHTML = p.features.map(f => `<li>${f}</li>`).join('');

  /* Ngày đăng + thời hạn hiển thị */
  const detailPostedEl = document.getElementById('detailPosted');
  const detailExpiryEl = document.getElementById('detailExpiry');
  if (detailPostedEl && detailExpiryEl) {
    detailPostedEl.textContent = rnFormatDate(p.postedDate);
    const exp = rnExpiryInfo(p.postedDate, p.listingTier);
    if (exp.expired) detailExpiryEl.innerHTML = `<span class="rn-expiry-pill rn-expiry-over">Tin đã hết hạn hiển thị</span>`;
    else if (exp.daysLeft <= 5) detailExpiryEl.innerHTML = `<span class="rn-expiry-pill rn-expiry-soon">Còn ${exp.daysLeft} ngày hiển thị (đến ${exp.expiresLabel})</span>`;
    else detailExpiryEl.innerHTML = `<span class="rn-expiry-pill rn-expiry-ok">Còn hiệu lực đến ${exp.expiresLabel}</span>`;
  }

  document.getElementById('detailMap').src = `https://maps.google.com/maps?q=${p.lat},${p.lng}&hl=vi&z=15&output=embed`;
  document.getElementById('nearbyDistrict').textContent = p.district + ', ' + p.city;

  /* Poster */
  document.getElementById('posterAvatar').src = p.poster.avatar;
  document.getElementById('posterName').textContent = p.poster.name;
  document.getElementById('posterRole').textContent = ROLE_LABELS[p.poster.role];
  document.getElementById('posterPhone').textContent = p.poster.phone;
  document.getElementById('posterCallBtn').href = 'tel:' + p.poster.phone.replace(/\s/g, '');
  document.getElementById('posterZaloBtn').href = 'https://zalo.me/' + p.poster.phone.replace(/\s/g, '');
  document.getElementById('posterAllListings').href = 'bat-dong-san.html?nguoiDang=' + p.posterSlug;

  /* Công cụ tính vay / ước tính thuê */
  const loanPanel = document.getElementById('loanCalc');
  const rentPanel = document.getElementById('rentEstimate');
  if (p.listingType === 'ban') {
    loanPanel.hidden = false; if (rentPanel) rentPanel.hidden = true;
    const priceInput = document.getElementById('calcPrice');
    const percentInput = document.getElementById('calcPercent');
    const rateInput = document.getElementById('calcRate');
    const yearsInput = document.getElementById('calcYears');
    const resultEl = document.getElementById('calcResult');
    priceInput.value = Math.round(p.price / 1e6);
    function updateCalc() {
      const price = (+priceInput.value || 0) * 1e6;
      const loanAmount = price * ((+percentInput.value || 0) / 100);
      const monthly = calcMonthlyPayment(loanAmount, +rateInput.value || 0, +yearsInput.value || 1);
      resultEl.textContent = formatFullVND(monthly) + '/tháng';
    }
    [priceInput, percentInput, rateInput, yearsInput].forEach(el => el.addEventListener('input', updateCalc, { passive: true }));
    updateCalc();
  } else if (rentPanel) {
    loanPanel.hidden = true; rentPanel.hidden = false;
    document.getElementById('rentMonthly').textContent = formatFullVND(p.price);
    document.getElementById('rentDeposit').textContent = formatFullVND(p.price * 2);
    document.getElementById('rentFirstPay').textContent = formatFullVND(p.price * 3);
  }

  /* BĐS tương tự */
  document.getElementById('relatedGrid').innerHTML = getRelatedProperties(p, 4).map(renderPropertyCard).join('');
  observeReveal(document.getElementById('relatedGrid'));

  const bookingForm = document.getElementById('bookingForm');
  if (bookingForm) bookingForm.addEventListener('submit', e => {
    e.preventDefault();
    document.getElementById('bookingSuccess').hidden = false;
    bookingForm.reset();
  });
})();

/* ---------------------------------------------------------------- */
/* ===== ĐĂNG TIN — form nhiều bước (UI mockup, Gói A không lưu dữ liệu) ===== */
(function dangTin() {
  const stepper = document.getElementById('dangTinStepper');
  if (!stepper) return;
  let curStep = 1;
  const totalSteps = 4;
  const steps = document.querySelectorAll('.rn-step-panel');
  const dots = document.querySelectorAll('.rn-step-dot');

  const prevBtn = document.querySelector('[data-step-prev]');
  const nextBtn = document.querySelector('[data-step-next]');
  const submitBtn = document.getElementById('submitDangTin');

  function showStep(n) {
    curStep = n;
    steps.forEach(s => s.hidden = +s.dataset.step !== n);
    dots.forEach(d => {
      const dn = +d.dataset.stepDot;
      d.classList.toggle('active', dn === n);
      d.classList.toggle('done', dn < n);
    });
    document.getElementById('stepLabel').textContent = `Bước ${n}/${totalSteps}`;
    if (prevBtn) prevBtn.style.visibility = n === 1 ? 'hidden' : 'visible';
    if (nextBtn) nextBtn.style.display = n === totalSteps ? 'none' : 'inline-flex';
    if (submitBtn) submitBtn.style.display = n === totalSteps ? 'inline-flex' : 'none';
    stepper.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
  if (nextBtn) nextBtn.addEventListener('click', () => showStep(Math.min(totalSteps, curStep + 1)));
  if (prevBtn) prevBtn.addEventListener('click', () => showStep(Math.max(1, curStep - 1)));

  function syncNeedRadioLabels() {
    document.querySelectorAll('.rn-need-radio label').forEach(l => l.classList.toggle('checked', l.querySelector('input').checked));
  }
  document.querySelectorAll('.rn-need-radio input').forEach(radio => radio.addEventListener('change', syncNeedRadioLabels));
  syncNeedRadioLabels();

  document.querySelectorAll('.rn-tier-card').forEach(card => card.addEventListener('click', () => {
    document.querySelectorAll('.rn-tier-card').forEach(c => c.classList.remove('selected'));
    card.classList.add('selected');
    const radio = card.querySelector('input[type="radio"]');
    if (radio) radio.checked = true;
  }));

  const dropzone = document.getElementById('dropzone');
  const fileInput = document.getElementById('fileInput');
  const fileList = document.getElementById('fileList');
  if (dropzone && fileInput) {
    dropzone.addEventListener('click', () => fileInput.click());
    fileInput.addEventListener('change', () => {
      fileList.innerHTML = [...fileInput.files].map(f => `<li>📷 ${f.name}</li>`).join('') || '<li class="text-muted">Chưa chọn ảnh nào</li>';
    });
  }

  const finalForm = document.getElementById('dangTinForm');
  if (finalForm) finalForm.addEventListener('submit', e => {
    e.preventDefault();
    document.getElementById('dangTinSuccess').hidden = false;
    document.getElementById('dangTinFormWrap').hidden = true;
  });

  showStep(1);
})();

/* ---------------------------------------------------------------- */
/* ===== TIN TỨC ===== */
(function newsIndex() {
  const grid = document.getElementById('newsIndexGrid');
  if (!grid) return;
  grid.innerHTML = ARTICLES.map(a => `
    <a href="tin-tuc-chi-tiet.html?slug=${a.slug}" class="rn-news-card" data-reveal>
      <div class="rn-news-thumb"><img src="${a.thumb}" alt="${a.title}" loading="lazy"></div>
      <div class="rn-news-body">
        <span class="rn-news-cat">${a.category}</span>
        <h3>${a.title}</h3>
        <p>${a.excerpt}</p>
        <span class="rn-news-date">${new Date(a.date).toLocaleDateString('vi-VN')} · ${a.author}</span>
      </div>
    </a>`).join('');
  observeReveal(grid);
})();

(function newsDetail() {
  const wrap = document.getElementById('articleDetail');
  if (!wrap) return;
  const params = new URLSearchParams(location.search);
  const slug = params.get('slug');
  const a = ARTICLES.find(x => x.slug === slug) || ARTICLES[0];
  document.title = `${a.title} | Tin tức RaoNhà`;
  document.getElementById('articleCategory').textContent = a.category;
  document.getElementById('articleTitle').textContent = a.title;
  document.getElementById('articleMeta').textContent = `${new Date(a.date).toLocaleDateString('vi-VN')} · ${a.author}`;
  document.getElementById('articleThumb').src = a.thumb;
  document.getElementById('articleThumb').alt = a.title;
  document.getElementById('articleContent').innerHTML = a.content.split('\n\n').map(p => `<p>${p}</p>`).join('');

  const related = ARTICLES.filter(x => x.id !== a.id).slice(0, 3);
  document.getElementById('relatedArticles').innerHTML = related.map(r => `
    <a href="tin-tuc-chi-tiet.html?slug=${r.slug}" class="rn-news-card rn-news-card-sm" data-reveal>
      <div class="rn-news-thumb"><img src="${r.thumb}" alt="${r.title}" loading="lazy"></div>
      <div class="rn-news-body"><span class="rn-news-cat">${r.category}</span><h3>${r.title}</h3></div>
    </a>`).join('');
  observeReveal(document.getElementById('relatedArticles'));
})();

/* ---------------------------------------------------------------- */
/* ===== Khu vực chip trang chủ — populate động ===== */
(function areaChips() {
  const el = document.getElementById('areaChipRow');
  if (!el) return;
  el.innerHTML = AREAS.map(a => `<a href="bat-dong-san.html?khu-vuc=${a.slug}" class="rn-area-chip">${a.label}<small>${a.city}</small></a>`).join('');
})();

/* ---------------------------------------------------------------- */
/* ===== Đăng nhập / Đăng ký (MOCK — không xác thực thật) ===== */
(function authPages() {
  const loginForm = document.getElementById('loginForm');
  if (loginForm) {
    document.getElementById('demoFillLogin')?.addEventListener('click', () => {
      loginForm.email.value = 'nam.nguyen@demo.vn';
      loginForm.password.value = '123456';
    });
    loginForm.addEventListener('submit', e => {
      e.preventDefault();
      rnSetAccount(rnDefaultAccount({ email: loginForm.email.value || 'nam.nguyen@demo.vn' }));
      location.href = 'tai-khoan.html';
    });
  }
  const registerForm = document.getElementById('registerForm');
  if (registerForm) {
    registerForm.addEventListener('submit', e => {
      e.preventDefault();
      rnSetAccount(rnDefaultAccount({
        name: registerForm.name.value || 'Thành viên RaoNhà',
        email: registerForm.email.value,
        phone: registerForm.phone.value,
        credit: 0,
        listings: [],
        transactions: []
      }));
      location.href = 'tai-khoan.html';
    });
  }
})();

/* ---------------------------------------------------------------- */
/* ===== Tài khoản của tôi — dashboard (MOCK) ===== */
(function myAccount() {
  const root = document.getElementById('accountDashboard');
  if (!root) return;
  const guard = document.getElementById('accountGuard');
  const acc = rnGetAccount();
  if (!acc) { root.hidden = true; if (guard) guard.hidden = false; return; }
  if (guard) guard.hidden = true;
  root.hidden = false;

  document.getElementById('accUserName').textContent = acc.name;
  document.getElementById('accUserInitial').textContent = acc.name.trim().charAt(0).toUpperCase();
  document.getElementById('accUserEmail').textContent = acc.email;
  document.getElementById('accCreditTop').textContent = rnFormatVND(acc.credit);

  /* Tabs */
  const tabs = document.querySelectorAll('.rn-account-tab[data-tab]');
  const panels = document.querySelectorAll('.rn-account-panel');
  tabs.forEach(t => t.addEventListener('click', () => {
    tabs.forEach(x => x.classList.remove('active'));
    panels.forEach(p => p.classList.remove('active'));
    t.classList.add('active');
    document.getElementById('panel-' + t.dataset.tab).classList.add('active');
  }));
  document.getElementById('accLogout')?.addEventListener('click', () => { rnClearAccount(); location.href = 'index.html'; });

  function renderListings() {
    const wrap = document.getElementById('myListingsWrap');
    if (!acc.listings.length) {
      wrap.innerHTML = '<p style="color:var(--text-3);padding:20px 0">Bạn chưa có tin đăng nào. <a href="dang-tin.html" style="color:var(--accent);font-weight:700">Đăng tin ngay →</a></p>';
      return;
    }
    wrap.innerHTML = acc.listings.map((l, idx) => {
      const p = rnFindProperty(l.propertyId);
      if (!p) return '';
      const exp = rnExpiryInfo(l.postedDate, l.tier);
      const statusPill = exp.expired
        ? `<span class="rn-expiry-pill rn-expiry-over">Hết hạn ${Math.abs(exp.daysLeft)} ngày trước</span>`
        : exp.daysLeft <= 5
          ? `<span class="rn-expiry-pill rn-expiry-soon">Còn ${exp.daysLeft} ngày</span>`
          : `<span class="rn-expiry-pill rn-expiry-ok">Còn ${exp.daysLeft} ngày</span>`;
      return `<div class="rn-mylisting">
        <img src="${p.images[0]}" alt="${p.title}">
        <div class="info">
          <a href="chi-tiet-bds.html?slug=${p.slug}">${p.title}</a>
          <div class="meta">${TIER_LABELS[l.tier]} · Đăng ${rnFormatDate(l.postedDate)} · ${statusPill}</div>
        </div>
        <div class="actions">
          <button type="button" class="primary" data-renew="${idx}">${exp.expired ? 'Đăng lại' : 'Gia hạn'}</button>
          <button type="button" data-upgrade="${idx}">Nâng cấp VIP</button>
          <button type="button" class="danger" data-remove="${idx}">Xoá tin</button>
        </div>
      </div>`;
    }).join('');

    wrap.querySelectorAll('[data-renew]').forEach(b => b.addEventListener('click', () => renewListing(+b.dataset.renew)));
    wrap.querySelectorAll('[data-remove]').forEach(b => b.addEventListener('click', () => removeListing(+b.dataset.remove)));
    wrap.querySelectorAll('[data-upgrade]').forEach(b => b.addEventListener('click', () => openUpgrade(+b.dataset.upgrade)));
  }

  function renewListing(idx) {
    const l = acc.listings[idx];
    const cost = TIER_PRICE[l.tier];
    if (acc.credit < cost) { alert('Số dư ví không đủ để gia hạn gói ' + TIER_LABELS[l.tier] + '. Vui lòng nạp thêm credit.'); return; }
    acc.credit -= cost;
    l.postedDate = new Date(RN_TODAY).toISOString().slice(0, 10);
    acc.transactions.unshift({ date: l.postedDate, type: 'tru', amount: -cost, method: 'Trừ từ ví', note: 'Gia hạn gói ' + TIER_LABELS[l.tier] });
    rnSetAccount(acc);
    renderListings(); renderWallet(); rnRenderAccountNav();
  }
  function removeListing(idx) {
    if (!confirm('Xoá tin đăng này khỏi danh sách của bạn?')) return;
    acc.listings.splice(idx, 1);
    rnSetAccount(acc);
    renderListings();
  }
  function openUpgrade(idx) {
    const l = acc.listings[idx];
    const order = ['thuong', 'vip-bac', 'vip-vang', 'vip-kim-cuong'];
    const next = order[Math.min(order.indexOf(l.tier) + 1, order.length - 1)];
    if (next === l.tier) { alert('Tin này đã ở gói cao nhất — VIP Kim Cương.'); return; }
    if (!confirm(`Nâng cấp tin lên gói ${TIER_LABELS[next]} với giá ${rnFormatVND(TIER_PRICE[next])}?`)) return;
    if (acc.credit < TIER_PRICE[next]) { alert('Số dư ví không đủ. Vui lòng nạp thêm credit trước khi nâng cấp.'); return; }
    acc.credit -= TIER_PRICE[next];
    l.tier = next;
    l.postedDate = new Date(RN_TODAY).toISOString().slice(0, 10);
    acc.transactions.unshift({ date: l.postedDate, type: 'tru', amount: -TIER_PRICE[next], method: 'Trừ từ ví', note: 'Nâng cấp gói ' + TIER_LABELS[next] });
    rnSetAccount(acc);
    renderListings(); renderWallet(); rnRenderAccountNav();
  }

  function renderWallet() {
    document.getElementById('accCreditBalance').textContent = rnFormatVND(acc.credit);
    document.getElementById('accCreditTop').textContent = rnFormatVND(acc.credit);
    const txnBody = document.getElementById('txnTableBody');
    txnBody.innerHTML = acc.transactions.map(t => `
      <tr>
        <td>${rnFormatDate(t.date)}</td>
        <td>${t.note}</td>
        <td>${t.method}</td>
        <td class="rn-txn-amount ${t.amount > 0 ? 'plus' : 'minus'}">${t.amount > 0 ? '+' : ''}${rnFormatVND(t.amount)}</td>
      </tr>`).join('') || '<tr><td colspan="4" style="color:var(--text-3)">Chưa có giao dịch nào.</td></tr>';
  }

  function renderProfile() {
    const f = document.getElementById('profileForm');
    if (!f) return;
    f.name.value = acc.name; f.email.value = acc.email; f.phone.value = acc.phone;
    f.addEventListener('submit', e => {
      e.preventDefault();
      acc.name = f.name.value; acc.email = f.email.value; acc.phone = f.phone.value;
      rnSetAccount(acc);
      document.getElementById('accUserName').textContent = acc.name;
      document.getElementById('accUserEmail').textContent = acc.email;
      document.getElementById('profileSaved').hidden = false;
      setTimeout(() => document.getElementById('profileSaved').hidden = true, 2500);
    });
  }

  renderListings(); renderWallet(); renderProfile();
})();

/* ---------------------------------------------------------------- */
/* ===== Nạp credit / Nâng cấp VIP (MOCK) ===== */
(function topupPage() {
  const wrap = document.getElementById('topupPage');
  if (!wrap) return;
  const guard = document.getElementById('accountGuard');
  let acc = rnGetAccount();
  if (!acc) { wrap.hidden = true; if (guard) guard.hidden = false; return; }
  if (guard) guard.hidden = true;
  wrap.hidden = false;
  document.getElementById('topupCurrentBalance').textContent = rnFormatVND(acc.credit);

  let selectedAmount = 200000;
  const chips = document.querySelectorAll('.rn-topup-chip[data-amount]');
  const customInput = document.getElementById('topupCustomAmount');
  chips.forEach(c => c.addEventListener('click', () => {
    chips.forEach(x => x.classList.remove('selected'));
    c.classList.add('selected');
    selectedAmount = +c.dataset.amount;
    if (customInput) customInput.value = '';
  }));
  if (customInput) customInput.addEventListener('input', () => {
    chips.forEach(x => x.classList.remove('selected'));
    selectedAmount = +customInput.value || 0;
  });
  if (chips[1]) chips[1].classList.add('selected');

  const confirmBtn = document.getElementById('topupConfirmBtn');
  const successEl = document.getElementById('topupSuccess');
  if (confirmBtn) confirmBtn.addEventListener('click', () => {
    if (selectedAmount < 20000) { alert('Số tiền nạp tối thiểu là 20.000đ.'); return; }
    acc = rnGetAccount();
    acc.credit += selectedAmount;
    acc.transactions.unshift({ date: new Date(RN_TODAY).toISOString().slice(0, 10), type: 'nap', amount: selectedAmount, method: 'Chuyển khoản ngân hàng', note: 'Nạp credit vào ví' });
    rnSetAccount(acc);
    document.getElementById('topupCurrentBalance').textContent = rnFormatVND(acc.credit);
    rnRenderAccountNav();
    successEl.hidden = false;
    successEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
  });
})();
