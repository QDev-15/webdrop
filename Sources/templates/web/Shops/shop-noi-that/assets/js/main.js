/* ══ MỘC AN — main.js (vanilla JS, không jQuery) ══ */
(function () {
  'use strict';

  /* ══════════════════════════════════════════════════════════════
     REVEAL ANIMATION (chuẩn dự án)
     ══════════════════════════════════════════════════════════════ */
  const ro = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); ro.unobserve(e.target); } });
  }, { threshold: .08, rootMargin: '0px 0px -36px 0px' });
  document.querySelectorAll('[data-reveal]').forEach(el => ro.observe(el));

  /* ══════════════════════════════════════════════════════════════
     NAV/TOOLBAR BÁM ĐỈNH KHI TOPBAR ĐÃ CUỘN KHỎI MÀN HÌNH
     #nt-nav (fixed) và .nt-toolbar-wrap (sticky) đều tính top dựa trên
     var(--topbar-h) + var(--nav-h) để chừa chỗ cho .nt-topbar khi ở đỉnh
     trang. Khi cuộn xuống, topbar (nằm trong flow bình thường) trôi ra khỏi
     khung nhìn nhưng các phần tử fixed/sticky không tự theo — toggle class
     .scrolled trên <body> để CSS bớt đi đúng phần --topbar-h cho mọi phần
     tử liên quan (nav về top:0, toolbar về top:var(--nav-h)).
     ══════════════════════════════════════════════════════════════ */
  (function () {
    function sync() { document.body.classList.toggle('scrolled', window.scrollY > 0); }
    sync();
    window.addEventListener('scroll', sync, { passive: true });
  })();

  /* ══════════════════════════════════════════════════════════════
     COUNTER
     ══════════════════════════════════════════════════════════════ */
  document.querySelectorAll('[data-counter]').forEach(el => {
    const cro = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        const target = +el.dataset.counter;
        const suffix = el.dataset.suffix || '';
        let cur = 0; const step = Math.ceil(target / 60) || 1;
        const t = setInterval(() => { cur = Math.min(cur + step, target); el.textContent = cur.toLocaleString('vi-VN') + suffix; if (cur >= target) clearInterval(t); }, 25);
        cro.disconnect();
      }
    }, { threshold: .5 });
    cro.observe(el);
  });

  /* ══════════════════════════════════════════════════════════════
     UTIL
     ══════════════════════════════════════════════════════════════ */
  function fmtVND(n) { return n.toLocaleString('vi-VN') + '₫'; }
  function qs(id) { return document.getElementById(id); }
  function getParam(name) { return new URLSearchParams(location.search).get(name); }

  /* ══════════════════════════════════════════════════════════════
     NAV — hamburger, mobile overlay, search panel
     ══════════════════════════════════════════════════════════════ */
  const burger = qs('navBurger');
  const mob = qs('navMob');
  function closeMob() { if (!mob) return; mob.classList.remove('open'); burger.classList.remove('open'); document.body.style.overflow = ''; burger.setAttribute('aria-expanded', 'false'); }
  function openMob() { if (!mob) return; mob.classList.add('open'); burger.classList.add('open'); document.body.style.overflow = 'hidden'; burger.setAttribute('aria-expanded', 'true'); }
  if (burger && mob) {
    burger.addEventListener('click', () => { mob.classList.contains('open') ? closeMob() : openMob(); });
    const closeBtn = qs('navMobClose');
    if (closeBtn) closeBtn.addEventListener('click', closeMob);
    document.addEventListener('keydown', e => { if (e.key === 'Escape' && mob.classList.contains('open')) closeMob(); });
  }

  const searchBtn = qs('navSearchBtn');
  const searchPanel = qs('navSearchPanel');
  const searchInput = qs('navSearchInput');
  const searchSubmit = qs('navSearchSubmit');
  function submitNavSearch() {
    const q = (searchInput.value || '').trim();
    if (!q) return;
    if (qs('productGrid')) {
      if (window.__ntSetSearch) window.__ntSetSearch(q);
      searchPanel.hidden = true;
      qs('productGrid').scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
      location.href = 'index.html?q=' + encodeURIComponent(q);
    }
  }
  if (searchBtn && searchPanel) {
    searchBtn.addEventListener('click', () => {
      const willShow = searchPanel.hidden;
      searchPanel.hidden = !willShow;
      searchBtn.setAttribute('aria-expanded', String(willShow));
      if (willShow) searchInput.focus();
    });
    if (searchSubmit) searchSubmit.addEventListener('click', submitNavSearch);
    if (searchInput) searchInput.addEventListener('keydown', e => { if (e.key === 'Enter') submitNavSearch(); });
  }

  /* ══════════════════════════════════════════════════════════════
     CART (localStorage) — dùng chung mọi trang
     ══════════════════════════════════════════════════════════════ */
  const CART_KEY = 'nt_cart';
  const WISH_KEY = 'nt_wishlist';
  function getCart() { try { return JSON.parse(localStorage.getItem(CART_KEY) || '[]'); } catch (e) { return []; } }
  function saveCart(cart) { localStorage.setItem(CART_KEY, JSON.stringify(cart)); renderCartBadge(); }
  function getWishlist() { try { return JSON.parse(localStorage.getItem(WISH_KEY) || '[]'); } catch (e) { return []; } }
  function saveWishlist(w) { localStorage.setItem(WISH_KEY, JSON.stringify(w)); }

  function addToCart(id, qty) {
    qty = qty || 1;
    const cart = getCart();
    const row = cart.find(c => c.id === id);
    if (row) row.qty += qty; else cart.push({ id, qty });
    saveCart(cart);
  }
  function renderCartBadge() {
    const count = getCart().reduce((s, c) => s + c.qty, 0);
    document.querySelectorAll('.nt-cart-badge').forEach(b => { b.textContent = count; b.style.display = count ? 'flex' : 'none'; });
  }
  renderCartBadge();

  window.__ntAddToCart = addToCart;

  document.querySelectorAll('[data-add-cart]').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = +btn.dataset.addCart;
      addToCart(id, 1);
      const orig = btn.innerHTML;
      btn.classList.add('added');
      const label = btn.querySelector('.label');
      if (label) label.textContent = 'Đã thêm';
      setTimeout(() => { btn.classList.remove('added'); if (label) label.textContent = 'Thêm vào giỏ'; }, 1300);
    });
  });

  document.querySelectorAll('[data-wish-toggle]').forEach(btn => {
    const id = +btn.dataset.wishToggle;
    const wl = getWishlist();
    if (wl.includes(id)) btn.classList.add('active');
    btn.addEventListener('click', () => {
      let list = getWishlist();
      if (list.includes(id)) { list = list.filter(x => x !== id); btn.classList.remove('active'); }
      else { list.push(id); btn.classList.add('active'); }
      saveWishlist(list);
    });
  });

  /* ══════════════════════════════════════════════════════════════
     GENERIC ACCORDION (FAQ + product detail specs)
     ══════════════════════════════════════════════════════════════ */
  function wireAccordion(selector, qSelector) {
    document.querySelectorAll(selector).forEach(item => {
      const q = item.querySelector(qSelector);
      if (!q) return;
      q.addEventListener('click', () => { item.classList.toggle('open'); });
    });
  }
  wireAccordion('.nt-faq-item', '.nt-faq-q');
  wireAccordion('.nt-accordion-item', '.nt-accordion-q');

  /* ══════════════════════════════════════════════════════════════
     SHOWCASE SLIDER (ve-chung-toi.html — full-bleed dark, autoplay)
     ══════════════════════════════════════════════════════════════ */
  const showcase = qs('ntShowcase');
  if (showcase) {
    const slides = [...showcase.querySelectorAll('.nt-showcase-slide')];
    const dots = [...showcase.querySelectorAll('.nt-showcase-dot')];
    let idx = 0, timer;
    function go(n) {
      slides[idx].classList.remove('active'); dots[idx] && dots[idx].classList.remove('active');
      idx = (n + slides.length) % slides.length;
      slides[idx].classList.add('active'); dots[idx] && dots[idx].classList.add('active');
    }
    function autoplay() { timer = setInterval(() => go(idx + 1), 5000); }
    dots.forEach((d, i) => d.addEventListener('click', () => { go(i); clearInterval(timer); autoplay(); }));
    autoplay();
  }

  /* ══════════════════════════════════════════════════════════════
     VOUCHER COPY (khuyen-mai.html)
     ══════════════════════════════════════════════════════════════ */
  document.querySelectorAll('[data-copy-code]').forEach(btn => {
    btn.addEventListener('click', () => {
      const code = btn.dataset.copyCode;
      const done = () => { const orig = btn.textContent; btn.textContent = 'Đã chép ✓'; setTimeout(() => btn.textContent = orig, 1500); };
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(code).then(done).catch(done);
      } else { done(); }
    });
  });

  /* ══════════════════════════════════════════════════════════════
     COUNTDOWN (khuyen-mai.html) — tương đối, tính từ lúc tải trang + 5 ngày
     ══════════════════════════════════════════════════════════════ */
  const cd = qs('ntCountdown');
  if (cd) {
    const target = Date.now() + 5 * 24 * 60 * 60 * 1000;
    function tick() {
      const diff = Math.max(0, target - Date.now());
      const d = Math.floor(diff / 86400000);
      const h = Math.floor((diff % 86400000) / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      const s = Math.floor((diff % 60000) / 1000);
      cd.querySelector('[data-cd-d]').textContent = String(d).padStart(2, '0');
      cd.querySelector('[data-cd-h]').textContent = String(h).padStart(2, '0');
      cd.querySelector('[data-cd-m]').textContent = String(m).padStart(2, '0');
      cd.querySelector('[data-cd-s]').textContent = String(s).padStart(2, '0');
    }
    tick(); setInterval(tick, 1000);
  }

  /* ══════════════════════════════════════════════════════════════
     CATALOG ENGINE — chỉ chạy khi có #productGrid (index.html)
     ══════════════════════════════════════════════════════════════ */
  const grid = qs('productGrid');
  if (grid && typeof PRODUCTS !== 'undefined') {
    const PER_PAGE = 12;
    const paginationEl = qs('pagination');
    const emptyEl = qs('emptyState');
    const chipsRow = qs('chipsRow');
    const resultCountEl = qs('resultCount');
    const priceRange = qs('priceRange');
    const priceRangeMobile = qs('priceRangeMobile');
    const priceDisplay = qs('priceDisplay');
    const priceDisplayMobile = qs('priceDisplayMobile');
    const sortSelect = qs('sortSelect');
    const sortSelectMobile = qs('sortSelectMobile');
    const bannerSearch = qs('bannerSearchInput');

    let state = {
      category: 'tat-ca',
      material: [],
      color: [],
      room: [],
      price: MAX_PRICE,
      search: '',
      sort: 'newest',
      page: 1,
      collection: null
    };

    function matchProduct(p) {
      if (state.category !== 'tat-ca' && p.category !== state.category) return false;
      if (state.collection && p.collection !== state.collection) return false;
      const price = p.salePrice != null ? p.salePrice : p.price;
      if (price > state.price) return false;
      if (state.material.length && !state.material.includes(p.material)) return false;
      if (state.color.length && !state.color.includes(p.color)) return false;
      if (state.room.length && !state.room.includes(p.room)) return false;
      if (state.search && !p.name.toLowerCase().includes(state.search.toLowerCase())) return false;
      return true;
    }

    function sortProducts(list) {
      const arr = [...list];
      const bySale = p => p.salePrice != null ? p.salePrice : p.price;
      if (state.sort === 'price-asc') arr.sort((a, b) => bySale(a) - bySale(b));
      else if (state.sort === 'price-desc') arr.sort((a, b) => bySale(b) - bySale(a));
      else if (state.sort === 'rating') arr.sort((a, b) => b.rating - a.rating);
      else if (state.sort === 'bestseller') arr.sort((a, b) => (b.sold || 0) - (a.sold || 0));
      else arr.sort((a, b) => b.id - a.id);
      return arr;
    }

    function catName(slug) { const c = CATEGORIES.find(x => x.slug === slug); return c ? c.name : slug; }
    function matName(slug) { const m = MATERIALS.find(x => x.slug === slug); return m ? m.name : slug; }
    function colName(slug) { const c = COLORS.find(x => x.slug === slug); return c ? c.name : slug; }
    function roomName(slug) { const r = ROOMS.find(x => x.slug === slug); return r ? r.name : slug; }
    function collName(slug) { const c = COLLECTIONS.find(x => x.slug === slug); return c ? c.name : slug; }

    function cardHTML(p) {
      const sale = p.salePrice != null;
      const priceRow = sale
        ? `<span class="nt-prod-price sale">${fmtVND(p.salePrice)}</span><span class="nt-prod-price-old">${fmtVND(p.price)}</span>`
        : `<span class="nt-prod-price">${fmtVND(p.price)}</span>`;
      const badgeLabel = p.badge === 'sale' ? 'Giảm giá' : p.badge === 'new' ? 'Mới về' : p.badge === 'hot' ? 'Bán chạy' : '';
      return `
      <article class="nt-prod-card">
        <a href="chi-tiet-san-pham.html?slug=${p.slug}" class="nt-prod-thumb" aria-label="${p.name}">
          ${badgeLabel ? `<span class="nt-prod-badge ${p.badge}">${badgeLabel}</span>` : ''}
          <img src="${p.image}" alt="${p.name}" loading="lazy" onerror="this.src='data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 width=%27400%27 height=%27500%27%3E%3Crect width=%27400%27 height=%27500%27 fill=%27%23f3e9de%27/%3E%3C/svg%3E'">
        </a>
        <button class="nt-prod-wish" data-wish-toggle="${p.id}" aria-label="Yêu thích">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M20.8 4.6a5.5 5.5 0 00-7.8 0L12 5.6l-1-1a5.5 5.5 0 00-7.8 7.8l1 1L12 21l7.8-7.8 1-1a5.5 5.5 0 000-7.6z"/></svg>
        </button>
        <a href="chi-tiet-san-pham.html?slug=${p.slug}"><div class="nt-prod-cat">${catName(p.category)}</div>
        <h3 class="nt-prod-name">${p.name}</h3></a>
        <div class="nt-prod-meta">
          <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l2.9 6.6 7.1.6-5.4 4.7 1.6 7-6.2-3.7L5.8 21l1.6-7-5.4-4.7 7.1-.6z"/></svg>
          ${p.rating} · Đã bán ${p.sold}
        </div>
        <div class="nt-prod-price-row">${priceRow}</div>
        <button class="nt-prod-add" data-add-cart="${p.id}">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/></svg>
          <span class="label">Thêm vào giỏ</span>
        </button>
      </article>`;
    }

    function renderGrid(items) {
      if (!items.length) {
        grid.style.display = 'none';
        emptyEl.style.display = 'block';
        paginationEl.hidden = true;
        return;
      }
      grid.style.display = 'grid';
      emptyEl.style.display = 'none';
      grid.innerHTML = items.map(cardHTML).join('');
      // rewire add-to-cart & wishlist for newly rendered nodes
      grid.querySelectorAll('[data-add-cart]').forEach(btn => {
        btn.addEventListener('click', () => {
          addToCart(+btn.dataset.addCart, 1);
          const label = btn.querySelector('.label');
          btn.classList.add('added');
          if (label) label.textContent = 'Đã thêm';
          setTimeout(() => { btn.classList.remove('added'); if (label) label.textContent = 'Thêm vào giỏ'; }, 1300);
        });
      });
      grid.querySelectorAll('[data-wish-toggle]').forEach(btn => {
        const id = +btn.dataset.wishToggle;
        if (getWishlist().includes(id)) btn.classList.add('active');
        btn.addEventListener('click', () => {
          let list = getWishlist();
          if (list.includes(id)) { list = list.filter(x => x !== id); btn.classList.remove('active'); }
          else { list.push(id); btn.classList.add('active'); }
          saveWishlist(list);
        });
      });
    }

    function renderCount(total, start, shown) {
      if (!resultCountEl) return;
      resultCountEl.textContent = shown ? `Hiển thị ${start + 1}–${start + shown} trong ${total} sản phẩm` : `0 sản phẩm`;
    }

    function renderPagination(totalPages) {
      paginationEl.hidden = totalPages <= 1;
      if (totalPages <= 1) { paginationEl.innerHTML = ''; return; }
      paginationEl.innerHTML = Array.from({ length: totalPages }, (_, i) => {
        const n = i + 1;
        return `<li class="page-item${n === state.page ? ' active' : ''}"><button class="page-link" data-page="${n}">${n}</button></li>`;
      }).join('');
    }

    // Escape trước khi nội suy vào innerHTML — label chip có thể chứa state.search/state.category
    // đọc thẳng từ query string (?q=..., ?category=...), không escape sẽ là XSS phản chiếu.
    function escapeHtml(str) {
      return String(str).replace(/[&<>"']/g, ch => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch]));
    }

    function chip(label, onRemove) {
      const safeLabel = escapeHtml(label);
      return `<span class="nt-chip">${safeLabel}<button data-chip-remove aria-label="Bỏ lọc ${safeLabel}"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4"><path d="M18 6L6 18M6 6l12 12"/></svg></button></span>`;
    }

    function renderActiveChips() {
      const chips = [];
      if (state.category !== 'tat-ca') chips.push({ label: catName(state.category), clear: () => { state.category = 'tat-ca'; syncCatPills(); } });
      if (state.collection) chips.push({ label: 'BST: ' + collName(state.collection), clear: () => { state.collection = null; } });
      state.material.forEach(m => chips.push({ label: matName(m), clear: () => { state.material = state.material.filter(x => x !== m); syncCheckGroup('material'); } }));
      state.color.forEach(c => chips.push({ label: colName(c), clear: () => { state.color = state.color.filter(x => x !== c); syncCheckGroup('color'); } }));
      state.room.forEach(r => chips.push({ label: roomName(r), clear: () => { state.room = state.room.filter(x => x !== r); syncCheckGroup('room'); } }));
      if (state.price < MAX_PRICE) chips.push({ label: 'Giá ≤ ' + fmtVND(state.price), clear: () => { state.price = MAX_PRICE; if (priceRange) priceRange.value = MAX_PRICE; if (priceRangeMobile) priceRangeMobile.value = MAX_PRICE; updatePriceLabels(); } });
      if (state.search) chips.push({ label: 'Tìm: "' + state.search + '"', clear: () => { state.search = ''; if (bannerSearch) bannerSearch.value = ''; } });

      if (!chips.length) { chipsRow.style.display = 'none'; chipsRow.innerHTML = ''; return; }
      chipsRow.style.display = 'flex';
      chipsRow.innerHTML = chips.map((c, i) => chip(c.label)).join('') + `<button class="nt-chip-clear" id="clearAllChips">Xóa tất cả</button>`;
      [...chipsRow.querySelectorAll('[data-chip-remove]')].forEach((btn, i) => {
        btn.addEventListener('click', () => { chips[i].clear(); onFilterChange(); });
      });
      const clearAll = qs('clearAllChips');
      if (clearAll) clearAll.addEventListener('click', clearAllFilters);
    }

    function updatePriceLabels() {
      const txt = state.price >= MAX_PRICE ? 'Tất cả' : fmtVND(state.price);
      if (priceDisplay) priceDisplay.textContent = txt;
      if (priceDisplayMobile) priceDisplayMobile.textContent = txt;
    }

    function updateFilterBadge() {
      const badge = qs('filterBadge');
      if (!badge) return;
      const count = state.material.length + state.color.length + state.room.length + (state.price < MAX_PRICE ? 1 : 0);
      badge.textContent = count;
      badge.style.display = count ? 'flex' : 'none';
    }

    function writeStateToURL() {
      const params = new URLSearchParams();
      if (state.category !== 'tat-ca') params.set('category', state.category);
      if (state.material.length) params.set('material', state.material.join(','));
      if (state.color.length) params.set('color', state.color.join(','));
      if (state.room.length) params.set('room', state.room.join(','));
      if (state.price < MAX_PRICE) params.set('price', state.price);
      if (state.search) params.set('q', state.search);
      if (state.sort !== 'newest') params.set('sort', state.sort);
      if (state.page > 1) params.set('page', state.page);
      if (state.collection) params.set('collection', state.collection);
      const qsStr = params.toString();
      history.replaceState(null, '', qsStr ? `?${qsStr}` : location.pathname);
    }

    // Đọc query string — mọi giá trị dùng để phân loại (category/material/color/room/collection)
    // phải khớp đúng 1 slug hợp lệ trong dữ liệu thật, bỏ qua nếu không khớp (không gán thẳng
    // chuỗi thô từ URL vào state) — chặn cả sai lệch filter lẫn XSS phản chiếu qua chip label.
    function readStateFromURL() {
      const p = new URLSearchParams(location.search);
      const cat = p.get('category');
      if (cat && (cat === 'tat-ca' || CATEGORIES.some(x => x.slug === cat))) state.category = cat;
      if (p.get('material')) state.material = p.get('material').split(',').filter(s => MATERIALS.some(x => x.slug === s));
      if (p.get('color')) state.color = p.get('color').split(',').filter(s => COLORS.some(x => x.slug === s));
      if (p.get('room')) state.room = p.get('room').split(',').filter(s => ROOMS.some(x => x.slug === s));
      const price = +p.get('price');
      if (p.get('price') && !Number.isNaN(price) && price > 0) state.price = price;
      if (p.get('q')) state.search = p.get('q').slice(0, 100);
      if (p.get('sort')) state.sort = p.get('sort');
      if (p.get('page')) state.page = Math.max(1, +p.get('page') || 1);
      const coll = p.get('collection');
      if (coll && COLLECTIONS.some(x => x.slug === coll)) state.collection = coll;
    }

    function syncCatPills() {
      document.querySelectorAll('.nt-cat-pill').forEach(b => b.classList.toggle('active', b.dataset.cat === state.category));
    }
    function syncCheckGroup(key) {
      document.querySelectorAll(`[data-cb-group="${key}"]`).forEach(cb => { cb.checked = state[key].includes(cb.value); });
      updateFilterBadge();
    }

    function render() {
      const filtered = sortProducts(PRODUCTS.filter(matchProduct));
      const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
      state.page = Math.max(1, Math.min(state.page, totalPages));
      const start = (state.page - 1) * PER_PAGE;
      const pageItems = filtered.slice(start, start + PER_PAGE);

      renderGrid(pageItems);
      renderCount(filtered.length, start, pageItems.length);
      renderPagination(totalPages);
      renderActiveChips();
      updatePriceLabels();
      updateFilterBadge();
      writeStateToURL();
    }

    function onFilterChange() { state.page = 1; render(); }

    function clearAllFilters() {
      state = { category: 'tat-ca', material: [], color: [], room: [], price: MAX_PRICE, search: '', sort: 'newest', page: 1, collection: null };
      syncCatPills();
      document.querySelectorAll('[data-cb-group]').forEach(cb => cb.checked = false);
      if (priceRange) priceRange.value = MAX_PRICE;
      if (priceRangeMobile) priceRangeMobile.value = MAX_PRICE;
      if (sortSelect) sortSelect.value = 'newest';
      if (sortSelectMobile) sortSelectMobile.value = 'newest';
      if (bannerSearch) bannerSearch.value = '';
      render();
    }
    window.__ntClearAllFilters = clearAllFilters;

    /* Category pills */
    document.querySelectorAll('.nt-cat-pill').forEach(btn => {
      btn.addEventListener('click', () => { state.category = btn.dataset.cat; syncCatPills(); onFilterChange(); });
    });

    /* Dropdown checkbox groups (material/color/room) desktop */
    document.querySelectorAll('[data-cb-group]').forEach(cb => {
      cb.addEventListener('change', () => {
        const key = cb.dataset.cbGroup;
        const checkedVals = [...document.querySelectorAll(`[data-cb-group="${key}"]:checked`)].map(x => x.value);
        state[key] = checkedVals;
        syncCheckGroup(key);
        onFilterChange();
      });
    });

    /* Dropdown open/close */
    document.querySelectorAll('.nt-dropdown-btn').forEach(btn => {
      btn.addEventListener('click', e => {
        e.stopPropagation();
        const menu = document.getElementById(btn.getAttribute('aria-controls'));
        const isOpen = menu.classList.contains('show');
        document.querySelectorAll('.nt-dropdown-menu.show').forEach(m => m.classList.remove('show'));
        document.querySelectorAll('.nt-dropdown-btn.open').forEach(b => b.classList.remove('open'));
        if (!isOpen) { menu.classList.add('show'); btn.classList.add('open'); }
      });
    });
    document.addEventListener('click', () => {
      document.querySelectorAll('.nt-dropdown-menu.show').forEach(m => m.classList.remove('show'));
      document.querySelectorAll('.nt-dropdown-btn.open').forEach(b => b.classList.remove('open'));
    });
    document.querySelectorAll('.nt-dropdown-menu').forEach(m => m.addEventListener('click', e => e.stopPropagation()));

    /* Price range — debounce 250ms */
    let priceTimer;
    function onPriceInput(val) {
      clearTimeout(priceTimer);
      const v = +val;
      if (priceRange) priceRange.value = v;
      if (priceRangeMobile) priceRangeMobile.value = v;
      updatePriceLabels();
      priceTimer = setTimeout(() => { state.price = v; onFilterChange(); }, 250);
    }
    if (priceRange) priceRange.addEventListener('input', e => onPriceInput(e.target.value), { passive: true });
    if (priceRangeMobile) priceRangeMobile.addEventListener('input', e => onPriceInput(e.target.value), { passive: true });

    /* Sort */
    if (sortSelect) sortSelect.addEventListener('change', () => { state.sort = sortSelect.value; if (sortSelectMobile) sortSelectMobile.value = state.sort; onFilterChange(); });
    if (sortSelectMobile) sortSelectMobile.addEventListener('change', () => { state.sort = sortSelectMobile.value; if (sortSelect) sortSelect.value = state.sort; onFilterChange(); });

    /* Banner search */
    let searchTimer;
    if (bannerSearch) {
      bannerSearch.addEventListener('input', () => {
        clearTimeout(searchTimer);
        searchTimer = setTimeout(() => { state.search = bannerSearch.value.trim(); onFilterChange(); }, 300);
      }, { passive: true });
      const bannerSearchBtn = qs('bannerSearchBtn');
      if (bannerSearchBtn) bannerSearchBtn.addEventListener('click', () => { state.search = bannerSearch.value.trim(); onFilterChange(); });
    }
    window.__ntSetSearch = function (q) { state.search = q; if (bannerSearch) bannerSearch.value = q; onFilterChange(); };

    /* Quick category shortcuts (banner) */
    document.querySelectorAll('[data-quickcat]').forEach(el => {
      el.addEventListener('click', e => {
        e.preventDefault();
        state.category = el.dataset.quickcat;
        syncCatPills();
        onFilterChange();
        qs('toolbarWrap').scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    });

    /* Collection banner links inline on this page (?collection=) handled via readStateFromURL */

    /* Pagination clicks */
    paginationEl.addEventListener('click', e => {
      const btn = e.target.closest('[data-page]');
      if (!btn) return;
      state.page = +btn.dataset.page;
      render();
      grid.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });

    /* Empty state clear button */
    const clearAllBtn = qs('clearAllFiltersBtn');
    if (clearAllBtn) clearAllBtn.addEventListener('click', clearAllFilters);

    /* Mobile offcanvas */
    const offcanvas = qs('filterOffcanvas');
    const filterMobileBtn = qs('filterMobileBtn');
    function openOff() { offcanvas.classList.add('show'); document.body.style.overflow = 'hidden'; }
    function closeOff() { offcanvas.classList.remove('show'); document.body.style.overflow = ''; }
    if (filterMobileBtn) filterMobileBtn.addEventListener('click', openOff);
    const offClose = qs('offcanvasClose'); if (offClose) offClose.addEventListener('click', closeOff);
    const offBackdrop = qs('offcanvasBackdrop'); if (offBackdrop) offBackdrop.addEventListener('click', closeOff);
    const offDone = qs('offcanvasDone'); if (offDone) offDone.addEventListener('click', closeOff);
    const offClear = qs('offcanvasClear'); if (offClear) offClear.addEventListener('click', () => { clearAllFilters(); });

    /* Init from URL then render */
    readStateFromURL();
    syncCatPills();
    ['material', 'color', 'room'].forEach(syncCheckGroup);
    if (priceRange) priceRange.value = state.price;
    if (priceRangeMobile) priceRangeMobile.value = state.price;
    if (sortSelect) sortSelect.value = state.sort;
    if (sortSelectMobile) sortSelectMobile.value = state.sort;
    if (bannerSearch) bannerSearch.value = state.search;
    render();
  }

  /* ══════════════════════════════════════════════════════════════
     BỘ SƯU TẬP TEASER (bo-suu-tap.html) — hscroll sản phẩm theo collection
     ══════════════════════════════════════════════════════════════ */
  document.querySelectorAll('[data-collection-teaser]').forEach(container => {
    if (typeof PRODUCTS === 'undefined') return;
    const slug = container.dataset.collectionTeaser;
    const items = PRODUCTS.filter(p => p.collection === slug).slice(0, 6);
    container.innerHTML = items.map(p => `
      <article class="nt-prod-card">
        <a href="chi-tiet-san-pham.html?slug=${p.slug}" class="nt-prod-thumb">
          <img src="${p.image}" alt="${p.name}" loading="lazy">
        </a>
        <a href="chi-tiet-san-pham.html?slug=${p.slug}"><h3 class="nt-prod-name">${p.name}</h3></a>
        <div class="nt-prod-price-row"><span class="nt-prod-price">${fmtVND(p.salePrice != null ? p.salePrice : p.price)}</span></div>
      </article>`).join('');
  });

  /* ══════════════════════════════════════════════════════════════
     KHUYẾN MÃI — grid sản phẩm sale (khuyen-mai.html)
     ══════════════════════════════════════════════════════════════ */
  const saleGrid = qs('saleGrid');
  if (saleGrid && typeof PRODUCTS !== 'undefined') {
    const saleItems = PRODUCTS.filter(p => p.salePrice != null);
    saleGrid.innerHTML = saleItems.map(p => `
      <article class="nt-prod-card">
        <a href="chi-tiet-san-pham.html?slug=${p.slug}" class="nt-prod-thumb">
          <span class="nt-prod-badge sale">-${Math.round((1 - p.salePrice / p.price) * 100)}%</span>
          <img src="${p.image}" alt="${p.name}" loading="lazy">
        </a>
        <div class="nt-prod-cat">${(CATEGORIES.find(c => c.slug === p.category) || {}).name || ''}</div>
        <a href="chi-tiet-san-pham.html?slug=${p.slug}"><h3 class="nt-prod-name">${p.name}</h3></a>
        <div class="nt-prod-price-row">
          <span class="nt-prod-price sale">${fmtVND(p.salePrice)}</span>
          <span class="nt-prod-price-old">${fmtVND(p.price)}</span>
        </div>
        <button class="nt-prod-add" data-add-cart="${p.id}">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/></svg>
          <span class="label">Thêm vào giỏ</span>
        </button>
      </article>`).join('');
    saleGrid.querySelectorAll('[data-add-cart]').forEach(btn => {
      btn.addEventListener('click', () => {
        addToCart(+btn.dataset.addCart, 1);
        const label = btn.querySelector('.label');
        btn.classList.add('added'); if (label) label.textContent = 'Đã thêm';
        setTimeout(() => { btn.classList.remove('added'); if (label) label.textContent = 'Thêm vào giỏ'; }, 1300);
      });
    });
  }

  /* ══════════════════════════════════════════════════════════════
     PRODUCT DETAIL — chi-tiet-san-pham.html (?slug=)
     ══════════════════════════════════════════════════════════════ */
  const pdRoot = qs('productDetailRoot');
  if (pdRoot && typeof PRODUCTS !== 'undefined') {
    const slug = getParam('slug');
    const product = PRODUCTS.find(p => p.slug === slug) || PRODUCTS[0];
    const catLabel = (CATEGORIES.find(c => c.slug === product.category) || {}).name || '';
    const matLabel = (MATERIALS.find(m => m.slug === product.material) || {}).name || '';
    const colLabel = (COLORS.find(c => c.slug === product.color) || {}).name || '';
    const roomLabel = (ROOMS.find(r => r.slug === product.room) || {}).name || '';

    document.title = product.name + ' — MỘC AN';
    qs('pdBreadcrumbName').textContent = product.name;
    qs('pdBreadcrumbCat').textContent = catLabel;
    qs('pdBreadcrumbCat').href = 'index.html?category=' + product.category;
    qs('pdCat').textContent = catLabel;
    qs('pdTitle').textContent = product.name;
    qs('pdRating').textContent = product.rating;
    qs('pdSold').textContent = product.sold;
    if (qs('pdRatingBig')) qs('pdRatingBig').textContent = product.rating;

    const sale = product.salePrice != null;
    qs('pdPriceBox').innerHTML = sale
      ? `<span class="nt-pd-price sale">${fmtVND(product.salePrice)}</span><span class="nt-pd-price-old">${fmtVND(product.price)}</span><span class="nt-pd-save">Tiết kiệm ${fmtVND(product.price - product.salePrice)}</span>`
      : `<span class="nt-pd-price">${fmtVND(product.price)}</span>`;

    qs('pdSpecs').innerHTML = `
      <div class="nt-pd-spec-row"><span class="k">Chất liệu</span><span class="v">${matLabel}</span></div>
      <div class="nt-pd-spec-row"><span class="k">Màu sắc</span><span class="v">${colLabel}</span></div>
      <div class="nt-pd-spec-row"><span class="k">Phù hợp không gian</span><span class="v">${roomLabel}</span></div>
      <div class="nt-pd-spec-row"><span class="k">Mã sản phẩm</span><span class="v">MA-${String(product.id).padStart(4, '0')}</span></div>
    `;

    const mainImg = qs('pdMainImg');
    mainImg.src = product.image; mainImg.alt = product.name;
    const gallery = [product.image, ...PRODUCTS.filter(p => p.category === product.category && p.id !== product.id).slice(0, 3).map(p => p.image)];
    qs('pdThumbs').innerHTML = gallery.map((src, i) => `<div class="nt-pd-thumb${i === 0 ? ' active' : ''}" data-thumb><img src="${src}" alt="Ảnh ${i + 1}"></div>`).join('');
    qs('pdThumbs').querySelectorAll('[data-thumb]').forEach((el, i) => {
      el.addEventListener('click', () => {
        mainImg.src = gallery[i];
        qs('pdThumbs').querySelectorAll('[data-thumb]').forEach(t => t.classList.remove('active'));
        el.classList.add('active');
      });
    });

    /* Wishlist button */
    const wishBtn = qs('pdWishBtn');
    if (getWishlist().includes(product.id)) wishBtn.classList.add('active');
    wishBtn.addEventListener('click', () => {
      let list = getWishlist();
      if (list.includes(product.id)) { list = list.filter(x => x !== product.id); wishBtn.classList.remove('active'); }
      else { list.push(product.id); wishBtn.classList.add('active'); }
      saveWishlist(list);
    });

    /* Qty box */
    let qty = 1;
    const qtyInput = qs('pdQtyInput');
    qs('pdQtyMinus').addEventListener('click', () => { qty = Math.max(1, qty - 1); qtyInput.value = qty; });
    qs('pdQtyPlus').addEventListener('click', () => { qty = qty + 1; qtyInput.value = qty; });
    qtyInput.addEventListener('change', () => { qty = Math.max(1, +qtyInput.value || 1); qtyInput.value = qty; });

    qs('pdAddCart').addEventListener('click', () => {
      addToCart(product.id, qty);
      const label = qs('pdAddCart').querySelector('.label');
      qs('pdAddCart').classList.add('added');
      if (label) label.textContent = 'Đã thêm vào giỏ';
      setTimeout(() => { qs('pdAddCart').classList.remove('added'); if (label) label.textContent = 'Thêm vào giỏ hàng'; }, 1500);
    });

    /* Related products */
    const related = PRODUCTS.filter(p => p.category === product.category && p.id !== product.id).slice(0, 4);
    const fill = PRODUCTS.filter(p => p.id !== product.id && !related.includes(p));
    while (related.length < 4 && fill.length) related.push(fill.shift());
    qs('pdRelated').innerHTML = related.map(p => `
      <article class="nt-prod-card">
        <a href="chi-tiet-san-pham.html?slug=${p.slug}" class="nt-prod-thumb"><img src="${p.image}" alt="${p.name}" loading="lazy"></a>
        <div class="nt-prod-cat">${(CATEGORIES.find(c => c.slug === p.category) || {}).name || ''}</div>
        <a href="chi-tiet-san-pham.html?slug=${p.slug}"><h3 class="nt-prod-name">${p.name}</h3></a>
        <div class="nt-prod-price-row"><span class="nt-prod-price">${fmtVND(p.salePrice != null ? p.salePrice : p.price)}</span></div>
      </article>`).join('');
  }

  /* ══════════════════════════════════════════════════════════════
     GIỎ HÀNG — gio-hang.html
     ══════════════════════════════════════════════════════════════ */
  const cartRoot = qs('cartRoot');
  if (cartRoot && typeof PRODUCTS !== 'undefined') {
    function renderCartPage() {
      const cart = getCart();
      const rows = cart.map(c => ({ ...c, product: PRODUCTS.find(p => p.id === c.id) })).filter(r => r.product);
      if (!rows.length) {
        qs('cartFilled').style.display = 'none';
        qs('cartEmpty').style.display = 'block';
        return;
      }
      qs('cartFilled').style.display = 'grid';
      qs('cartEmpty').style.display = 'none';
      qs('cartRows').innerHTML = rows.map(r => {
        const price = r.product.salePrice != null ? r.product.salePrice : r.product.price;
        return `<div class="nt-cart-row">
          <img src="${r.product.image}" alt="${r.product.name}">
          <div>
            <div class="nt-cart-name">${r.product.name}</div>
            <div class="nt-cart-meta">${fmtVND(price)} / sản phẩm</div>
          </div>
          <div class="nt-qty-box">
            <button data-cart-minus="${r.id}">−</button>
            <input type="text" value="${r.qty}" readonly>
            <button data-cart-plus="${r.id}">+</button>
          </div>
          <div>
            <div style="font-weight:500;">${fmtVND(price * r.qty)}</div>
            <button class="nt-cart-remove" data-cart-remove="${r.id}">Xóa</button>
          </div>
        </div>`;
      }).join('');

      const subtotal = rows.reduce((s, r) => s + (r.product.salePrice != null ? r.product.salePrice : r.product.price) * r.qty, 0);
      const shipping = subtotal >= 5000000 || subtotal === 0 ? 0 : 200000;
      qs('cartSubtotal').textContent = fmtVND(subtotal);
      qs('cartShipping').textContent = shipping === 0 ? 'Miễn phí' : fmtVND(shipping);
      qs('cartTotal').textContent = fmtVND(subtotal + shipping);

      qs('cartRows').querySelectorAll('[data-cart-plus]').forEach(b => b.addEventListener('click', () => { changeQty(+b.dataset.cartPlus, 1); }));
      qs('cartRows').querySelectorAll('[data-cart-minus]').forEach(b => b.addEventListener('click', () => { changeQty(+b.dataset.cartMinus, -1); }));
      qs('cartRows').querySelectorAll('[data-cart-remove]').forEach(b => b.addEventListener('click', () => { removeRow(+b.dataset.cartRemove); }));
    }
    function changeQty(id, delta) {
      const cart = getCart();
      const row = cart.find(c => c.id === id);
      if (!row) return;
      row.qty = Math.max(1, row.qty + delta);
      saveCart(cart);
      renderCartPage();
    }
    function removeRow(id) {
      saveCart(getCart().filter(c => c.id !== id));
      renderCartPage();
    }
    const checkoutBtn = qs('cartCheckoutBtn');
    if (checkoutBtn) checkoutBtn.addEventListener('click', () => { alert('Đây là bản demo template — chưa tích hợp thanh toán thật. Khi triển khai thật, bước này sẽ chuyển sang trang thanh toán.'); });
    renderCartPage();
  }

  /* ══════════════════════════════════════════════════════════════
     CONTACT FORM (lien-he.html) — demo validate, không gửi thật
     ══════════════════════════════════════════════════════════════ */
  const contactForm = qs('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', e => {
      e.preventDefault();
      qs('contactFormMsg').style.display = 'block';
      contactForm.reset();
      setTimeout(() => { qs('contactFormMsg').style.display = 'none'; }, 4000);
    });
  }
})();
