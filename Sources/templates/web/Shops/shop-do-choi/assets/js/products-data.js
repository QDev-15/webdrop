'use strict';
/* ══ KidZone — Products Data & Shared Utilities ══ */

// ── CONSTANTS ──
const PER_PAGE = 12;
const MAX_PRICE = 1500000;
const IMG_BASE = 'https://images.unsplash.com/photo-';
const IMG_PARAMS = '?w=600&auto=format&fit=crop&q=80';
const PLACEHOLDER = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='600' height='600'%3E%3Crect width='600' height='600' fill='%23e0f4fb'/%3E%3C/svg%3E";

const CAT_LABELS = {
  'do-choi-giao-duc': 'Giáo dục',
  'xe-mo-hinh': 'Xe & Mô hình',
  'bup-be-thu-bong': 'Búp bê & Thú bông',
  'do-choi-ngoai-troi': 'Ngoài trời',
  'lego-xep-hinh': 'Lego & Xếp hình'
};
const AGE_LABELS = {
  '0-2': '0–2 tuổi',
  '3-5': '3–5 tuổi',
  '6-8': '6–8 tuổi',
  '9+': '9+ tuổi'
};

// ── PRODUCTS ARRAY (36 sản phẩm, đủ 3 trang phân trang) ──
const PRODUCTS = [
  // ─── ĐỒ CHƠI GIÁO DỤC (7) ───
  {
    id: 1, name: 'Bộ xếp hình học thông minh', slug: 'bo-xep-hinh-hoc-thong-minh',
    price: 280000, salePrice: null,
    category: 'do-choi-giao-duc', theme: ['ban-chay','giao-duc'],
    ageGroup: '3-5', brand: 'SmartKid',
    rating: 4.8, sold: 324, stock: true, badge: 'hot',
    image: IMG_BASE + '1587654780291-39c9404d746b' + IMG_PARAMS
  },
  {
    id: 2, name: 'Bảng chữ cái nam châm 26 chữ', slug: 'bang-chu-cai-nam-cham',
    price: 195000, salePrice: null,
    category: 'do-choi-giao-duc', theme: ['giao-duc'],
    ageGroup: '3-5', brand: 'EduFun',
    rating: 4.6, sold: 187, stock: true, badge: null,
    image: IMG_BASE + '1633469924738-52101af51d87' + IMG_PARAMS
  },
  {
    id: 3, name: 'Đồ chơi thả hình khối màu sắc', slug: 'do-choi-tha-hinh-khoi',
    price: 320000, salePrice: null,
    category: 'do-choi-giao-duc', theme: ['hang-moi','giao-duc'],
    ageGroup: '0-2', brand: 'BabyLearn',
    rating: 4.7, sold: 98, stock: true, badge: 'new',
    image: IMG_BASE + '1516641051054-9df6a1aad654' + IMG_PARAMS
  },
  {
    id: 4, name: 'Bộ thí nghiệm khoa học mini', slug: 'bo-thi-nghiem-khoa-hoc-mini',
    price: 580000, salePrice: null,
    category: 'do-choi-giao-duc', theme: ['giao-duc'],
    ageGroup: '6-8', brand: 'ScienceKid',
    rating: 4.9, sold: 156, stock: true, badge: null,
    image: IMG_BASE + '1562240020-ce31ccb0fa7d' + IMG_PARAMS
  },
  {
    id: 5, name: 'Trò chơi ghép tranh 100 miếng', slug: 'tro-choi-ghep-tranh-100',
    price: 150000, salePrice: 120000,
    category: 'do-choi-giao-duc', theme: ['giam-gia','giao-duc'],
    ageGroup: '6-8', brand: 'PuzzleKid',
    rating: 4.4, sold: 212, stock: true, badge: 'sale',
    image: IMG_BASE + '1596461404969-9ae70f2830c1' + IMG_PARAMS
  },
  {
    id: 6, name: 'Bảng vẽ ma thuật LCD không bẩn', slug: 'bang-ve-ma-thuat-lcd',
    price: 245000, salePrice: null,
    category: 'do-choi-giao-duc', theme: ['hang-moi','giao-duc'],
    ageGroup: '3-5', brand: 'DrawMagic',
    rating: 4.5, sold: 143, stock: true, badge: 'new',
    image: IMG_BASE + '1545558014-8692077e9b5c' + IMG_PARAMS
  },
  {
    id: 7, name: 'Bộ nhạc cụ thu nhỏ cho bé', slug: 'bo-nhac-cu-thu-nho',
    price: 350000, salePrice: null,
    category: 'do-choi-giao-duc', theme: ['ban-chay','giao-duc'],
    ageGroup: '3-5', brand: 'MusicKid',
    rating: 4.7, sold: 278, stock: true, badge: 'hot',
    image: IMG_BASE + '1600978398568-48175fd97cce' + IMG_PARAMS
  },

  // ─── XE & MÔ HÌNH (7) ───
  {
    id: 8, name: 'Xe ô tô điều khiển từ xa tốc độ cao', slug: 'xe-o-to-dieu-khien-tu-xa',
    price: 550000, salePrice: null,
    category: 'xe-mo-hinh', theme: ['ban-chay'],
    ageGroup: '6-8', brand: 'RacePro',
    rating: 4.7, sold: 401, stock: true, badge: 'hot',
    image: IMG_BASE + '1618842676088-c4d48a6a7c9d' + IMG_PARAMS
  },
  {
    id: 9, name: 'Bộ đường ray tàu hỏa điện đầy đủ', slug: 'bo-duong-ray-tau-hoa-dien',
    price: 680000, salePrice: null,
    category: 'xe-mo-hinh', theme: ['ban-chay'],
    ageGroup: '3-5', brand: 'TrainWorld',
    rating: 4.8, sold: 265, stock: true, badge: null,
    image: IMG_BASE + '1540575467063-178a50c2df87' + IMG_PARAMS
  },
  {
    id: 10, name: 'Xe mô hình kim loại die-cast 1:36', slug: 'xe-mo-hinh-kim-loai-die-cast',
    price: 145000, salePrice: 99000,
    category: 'xe-mo-hinh', theme: ['giam-gia'],
    ageGroup: '6-8', brand: 'ModelCar',
    rating: 4.3, sold: 389, stock: true, badge: 'sale',
    image: IMG_BASE + '1611532736597-de2d4265fba3' + IMG_PARAMS
  },
  {
    id: 11, name: 'Máy bay điều khiển từ xa 4 kênh', slug: 'may-bay-dieu-khien-tu-xa',
    price: 890000, salePrice: null,
    category: 'xe-mo-hinh', theme: ['hang-moi'],
    ageGroup: '9+', brand: 'SkyFly',
    rating: 4.6, sold: 89, stock: true, badge: 'new',
    image: IMG_BASE + '1597534458220-9fb4969f2df5' + IMG_PARAMS
  },
  {
    id: 12, name: 'Xe ben xây dựng đồ chơi cỡ lớn', slug: 'xe-ben-xay-dung-do-choi',
    price: 280000, salePrice: null,
    category: 'xe-mo-hinh', theme: [],
    ageGroup: '3-5', brand: 'BuildKid',
    rating: 4.4, sold: 176, stock: true, badge: null,
    image: IMG_BASE + '1503454537195-1dcabb73ffb9' + IMG_PARAMS
  },
  {
    id: 13, name: 'Xe đua mô hình 4WD tốc độ 35km/h', slug: 'xe-dua-mo-hinh-4wd',
    price: 720000, salePrice: null,
    category: 'xe-mo-hinh', theme: ['ban-chay'],
    ageGroup: '9+', brand: 'RacePro',
    rating: 4.8, sold: 312, stock: true, badge: 'hot',
    image: IMG_BASE + '1561049933-c8fbef47b329' + IMG_PARAMS
  },
  {
    id: 14, name: 'Xe cứu thương có đèn và âm thanh', slug: 'xe-cuu-thuong-den-am-thanh',
    price: 380000, salePrice: null,
    category: 'xe-mo-hinh', theme: ['hang-moi'],
    ageGroup: '3-5', brand: 'CityPlay',
    rating: 4.6, sold: 134, stock: true, badge: 'new',
    image: IMG_BASE + '1626187429639-7a77bfad0523' + IMG_PARAMS
  },

  // ─── BÚP BÊ & THÚ BÔNG (7) ───
  {
    id: 15, name: 'Gấu bông lớn 60cm siêu mềm', slug: 'gau-bong-lon-60cm',
    price: 450000, salePrice: null,
    category: 'bup-be-thu-bong', theme: ['ban-chay'],
    ageGroup: '0-2', brand: 'SoftToys',
    rating: 4.9, sold: 567, stock: true, badge: 'hot',
    image: IMG_BASE + '1602734846297-9299fc2d4703' + IMG_PARAMS
  },
  {
    id: 16, name: 'Búp bê thay trang phục 12 bộ', slug: 'bup-be-thay-trang-phuc',
    price: 380000, salePrice: 290000,
    category: 'bup-be-thu-bong', theme: ['giam-gia'],
    ageGroup: '3-5', brand: 'DollTime',
    rating: 4.5, sold: 234, stock: true, badge: 'sale',
    image: IMG_BASE + '1562040506-a9b32cb51b94' + IMG_PARAMS
  },
  {
    id: 17, name: 'Thú nhồi bông công chúa dễ thương', slug: 'thu-nhoibong-cong-chua',
    price: 290000, salePrice: null,
    category: 'bup-be-thu-bong', theme: ['ban-chay'],
    ageGroup: '3-5', brand: 'PrincessKid',
    rating: 4.6, sold: 198, stock: true, badge: null,
    image: IMG_BASE + '1648311203209-da34f7d0d800' + IMG_PARAMS
  },
  {
    id: 18, name: 'Gấu bông Totoro 45cm chính hãng', slug: 'gau-bong-totoro-45cm',
    price: 350000, salePrice: null,
    category: 'bup-be-thu-bong', theme: ['hang-moi'],
    ageGroup: '0-2', brand: 'StudioGhibli',
    rating: 4.9, sold: 143, stock: true, badge: 'new',
    image: IMG_BASE + '1556012018-50c5c0da73bf' + IMG_PARAMS
  },
  {
    id: 19, name: 'Thú bông unicorn phát sáng ban đêm', slug: 'thu-bong-unicorn-phat-sang',
    price: 420000, salePrice: 320000,
    category: 'bup-be-thu-bong', theme: ['giam-gia'],
    ageGroup: '3-5', brand: 'GlowToys',
    rating: 4.7, sold: 289, stock: true, badge: 'sale',
    image: IMG_BASE + '1530325553241-4f6e7690cf36' + IMG_PARAMS
  },
  {
    id: 20, name: 'Búp bê tắm tương tác có nước', slug: 'bup-be-tam-tuong-tac',
    price: 520000, salePrice: null,
    category: 'bup-be-thu-bong', theme: ['hang-moi'],
    ageGroup: '3-5', brand: 'BabyBorn',
    rating: 4.8, sold: 176, stock: true, badge: 'new',
    image: IMG_BASE + '1588090644556-14707d0e886a' + IMG_PARAMS
  },
  {
    id: 21, name: 'Thú nhồi bông khủng long T-Rex', slug: 'thu-nhoibong-khung-long',
    price: 180000, salePrice: null,
    category: 'bup-be-thu-bong', theme: [],
    ageGroup: '3-5', brand: 'DinoKid',
    rating: 4.4, sold: 121, stock: true, badge: null,
    image: IMG_BASE + '1543886151-3bc2b944c718' + IMG_PARAMS
  },

  // ─── ĐỒ CHƠI NGOÀI TRỜI (7) ───
  {
    id: 22, name: 'Nhà banh bi lắp ghép cho bé', slug: 'nha-banh-bi-lap-ghep',
    price: 1200000, salePrice: null,
    category: 'do-choi-ngoai-troi', theme: ['ban-chay'],
    ageGroup: '0-2', brand: 'PlayHouse',
    rating: 4.8, sold: 234, stock: true, badge: 'hot',
    image: IMG_BASE + '1607453998774-d533f65dac99' + IMG_PARAMS
  },
  {
    id: 23, name: 'Cát động học vui nhộn 1kg + khuôn', slug: 'cat-dong-hoc-vui-nhon',
    price: 280000, salePrice: 220000,
    category: 'do-choi-ngoai-troi', theme: ['giam-gia'],
    ageGroup: '3-5', brand: 'KineticSand',
    rating: 4.6, sold: 312, stock: true, badge: 'sale',
    image: IMG_BASE + '1725297952113-36be1c7cefb4' + IMG_PARAMS
  },
  {
    id: 24, name: 'Xe chòi chân hình thú ngộ nghĩnh', slug: 'xe-choi-chan-hinh-thu',
    price: 650000, salePrice: null,
    category: 'do-choi-ngoai-troi', theme: ['ban-chay'],
    ageGroup: '0-2', brand: 'RideOn',
    rating: 4.7, sold: 198, stock: true, badge: null,
    image: IMG_BASE + '1615486363973-f79d875780cf' + IMG_PARAMS
  },
  {
    id: 25, name: 'Hồ bơi phao tròn gia đình cỡ 120cm', slug: 'ho-boi-phao-tron-gia-dinh',
    price: 350000, salePrice: 280000,
    category: 'do-choi-ngoai-troi', theme: ['giam-gia'],
    ageGroup: '0-2', brand: 'AquaFun',
    rating: 4.5, sold: 267, stock: true, badge: 'sale',
    image: IMG_BASE + '1615486364134-62a4c72c822d' + IMG_PARAMS
  },
  {
    id: 26, name: 'Bộ tennis mini vợt mềm cho bé', slug: 'bo-tennis-mini-vot-mem',
    price: 180000, salePrice: null,
    category: 'do-choi-ngoai-troi', theme: ['hang-moi'],
    ageGroup: '3-5', brand: 'SportKid',
    rating: 4.3, sold: 89, stock: true, badge: 'new',
    image: IMG_BASE + '1600987608520-29713f8cc23e' + IMG_PARAMS
  },
  {
    id: 27, name: 'Xe đạp 3 bánh có mái che bé yêu', slug: 'xe-dap-3-banh-mai-che',
    price: 850000, salePrice: null,
    category: 'do-choi-ngoai-troi', theme: ['hang-moi'],
    ageGroup: '0-2', brand: 'TrikeBike',
    rating: 4.8, sold: 156, stock: true, badge: 'new',
    image: IMG_BASE + '1741389544696-0750a7ac6bbb' + IMG_PARAMS
  },
  {
    id: 28, name: 'Vòng nhảy đèn LED âm nhạc 8 chế độ', slug: 'vong-nhay-den-led-am-nhac',
    price: 220000, salePrice: 180000,
    category: 'do-choi-ngoai-troi', theme: ['giam-gia'],
    ageGroup: '3-5', brand: 'DanceKid',
    rating: 4.5, sold: 178, stock: true, badge: 'sale',
    image: IMG_BASE + '1655087751207-1020c89f7eee' + IMG_PARAMS
  },

  // ─── LEGO & XẾP HÌNH (8) ───
  {
    id: 29, name: 'LEGO Classic Sáng tạo 200 miếng', slug: 'lego-classic-sang-tao-200',
    price: 480000, salePrice: null,
    category: 'lego-xep-hinh', theme: ['ban-chay'],
    ageGroup: '6-8', brand: 'LEGO',
    rating: 4.9, sold: 456, stock: true, badge: 'hot',
    image: IMG_BASE + '1631106256072-54c89defe828' + IMG_PARAMS
  },
  {
    id: 30, name: 'Bộ xếp hình Lâu đài Công chúa 450 miếng', slug: 'bo-xep-hinh-lau-dai-cong-chua',
    price: 650000, salePrice: null,
    category: 'lego-xep-hinh', theme: ['ban-chay'],
    ageGroup: '6-8', brand: 'BrickWorld',
    rating: 4.8, sold: 312, stock: true, badge: null,
    image: IMG_BASE + '1557774394-de53f40ccb02' + IMG_PARAMS
  },
  {
    id: 31, name: 'LEGO City Đội cảnh sát 500 miếng', slug: 'lego-city-doi-canh-sat',
    price: 890000, salePrice: null,
    category: 'lego-xep-hinh', theme: ['hang-moi'],
    ageGroup: '6-8', brand: 'LEGO',
    rating: 4.9, sold: 189, stock: true, badge: 'new',
    image: IMG_BASE + '1631106254201-ffbee2305c5b' + IMG_PARAMS
  },
  {
    id: 32, name: 'LEGO DUPLO dành cho bé nhỏ 0-5 tuổi', slug: 'lego-duplo-be-nho',
    price: 320000, salePrice: null,
    category: 'lego-xep-hinh', theme: ['ban-chay','giao-duc'],
    ageGroup: '0-2', brand: 'LEGO',
    rating: 4.8, sold: 398, stock: true, badge: 'hot',
    image: IMG_BASE + '1646995477167-a344548ce6b9' + IMG_PARAMS
  },
  {
    id: 33, name: 'Xếp hình robot biến hình 320 miếng', slug: 'xep-hinh-robot-bien-hinh',
    price: 380000, salePrice: 290000,
    category: 'lego-xep-hinh', theme: ['giam-gia'],
    ageGroup: '6-8', brand: 'TransBot',
    rating: 4.6, sold: 234, stock: true, badge: 'sale',
    image: IMG_BASE + '1652501595862-1d06fe543544' + IMG_PARAMS
  },
  {
    id: 34, name: 'Bộ xếp hình nông trại vui vẻ 180 miếng', slug: 'bo-xep-hinh-nong-trai',
    price: 280000, salePrice: 220000,
    category: 'lego-xep-hinh', theme: ['giam-gia'],
    ageGroup: '3-5', brand: 'FarmBrick',
    rating: 4.5, sold: 167, stock: true, badge: 'sale',
    image: IMG_BASE + '1659883718058-e03d7ec598ca' + IMG_PARAMS
  },
  {
    id: 35, name: 'LEGO Architecture Tháp Eiffel 648 miếng', slug: 'lego-architecture-thap-eiffel',
    price: 1200000, salePrice: null,
    category: 'lego-xep-hinh', theme: ['hang-moi'],
    ageGroup: '9+', brand: 'LEGO',
    rating: 4.9, sold: 98, stock: true, badge: 'new',
    image: IMG_BASE + '1644175897056-50f4d3a9a827' + IMG_PARAMS
  },
  {
    id: 36, name: 'Bộ xếp hình nhà gỗ 3D lắp ráp', slug: 'bo-xep-hinh-nha-go-3d',
    price: 420000, salePrice: null,
    category: 'lego-xep-hinh', theme: [],
    ageGroup: '6-8', brand: 'WoodBrick',
    rating: 4.6, sold: 145, stock: true, badge: null,
    image: IMG_BASE + '1560961911-ba7ef651a56c' + IMG_PARAMS
  }
];

// ── UTILITIES ──

function formatPrice(n) {
  return n.toLocaleString('vi-VN') + 'đ';
}

function renderCard(p, showBtn) {
  if (showBtn === undefined) showBtn = true;
  const price = p.salePrice !== null ? p.salePrice : p.price;
  const origPrice = p.salePrice !== null ? p.price : null;
  const catLabel = CAT_LABELS[p.category] || p.category;
  const ageLabel = AGE_LABELS[p.ageGroup] || p.ageGroup;
  const badgeHtml = p.badge === 'new'
    ? '<span class="dc-badge dc-badge-new">Mới</span>'
    : p.badge === 'sale'
      ? '<span class="dc-badge dc-badge-sale">Giảm</span>'
      : p.badge === 'hot'
        ? '<span class="dc-badge dc-badge-hot">Hot</span>'
        : '';
  const origHtml = origPrice
    ? `<span class="dc-prod-price-orig">${formatPrice(origPrice)}</span>`
    : '';
  const btnHtml = showBtn
    ? `<button class="dc-prod-btn" id="addCart${p.id}" data-add-cart="${p.id}" type="button">Thêm vào giỏ</button>`
    : '';
  return `<div class="dc-prod-card" data-id="${p.id}" data-category="${p.category}" data-age="${p.ageGroup}">
  <a href="chi-tiet-san-pham.html?slug=${p.slug}" class="dc-prod-img-link">
    <div class="dc-prod-img-wrap">
      <img src="${p.image}" alt="${p.name}" loading="lazy" width="600" height="600"
           onerror="this.onerror=null;this.src='${PLACEHOLDER}'">
      <div class="dc-prod-badges">${badgeHtml}</div>
      <span class="dc-badge-age">${ageLabel}</span>
    </div>
  </a>
  <div class="dc-prod-body">
    <span class="dc-prod-cat">${catLabel}</span>
    <a href="chi-tiet-san-pham.html?slug=${p.slug}" class="dc-prod-name">${p.name}</a>
    <div class="dc-prod-price-row">
      <span class="dc-prod-price">${formatPrice(price)}</span>
      ${origHtml}
    </div>
    <div class="dc-prod-rating">★ ${p.rating} &nbsp;·&nbsp; ${p.sold} đã bán</div>
    ${btnHtml}
  </div>
</div>`;
}

// ── CART ──

function getCart() {
  return JSON.parse(localStorage.getItem('dcCart') || '[]');
}

function saveCart(cart) {
  localStorage.setItem('dcCart', JSON.stringify(cart));
}

function addToCart(productId) {
  const p = PRODUCTS.find(x => x.id === productId);
  if (!p) return;
  const cart = getCart();
  const existing = cart.find(x => x.id === productId);
  if (existing) {
    existing.qty++;
  } else {
    cart.push({ id: productId, qty: 1 });
  }
  saveCart(cart);
  updateCartBadge();
  showToast('Đã thêm "' + p.name + '" vào giỏ!');
}

function updateCartBadge() {
  const cart = getCart();
  const total = cart.reduce((s, i) => s + (i.qty || 0), 0);
  const badge = document.getElementById('dcCartCount');
  if (badge) badge.textContent = total;
}

// ── TOAST ──

function showToast(msg) {
  const existing = document.querySelector('.dc-toast');
  if (existing) existing.remove();
  const t = document.createElement('div');
  t.className = 'dc-toast';
  t.textContent = msg;
  document.body.appendChild(t);
  requestAnimationFrame(() => requestAnimationFrame(() => t.classList.add('show')));
  setTimeout(() => { t.classList.remove('show'); setTimeout(() => t.remove(), 350); }, 2600);
}

// ── SECTION RENDER (index.html) ──

function renderSection(gridId, filterFn, limit) {
  if (limit === undefined) limit = 8;
  const container = document.getElementById(gridId);
  if (!container) return;
  const items = PRODUCTS.filter(filterFn).slice(0, limit);
  container.innerHTML = items.map(p => renderCard(p)).join('');
}

function initSectionSearch(inputId, gridId) {
  const input = document.getElementById(inputId);
  const grid = document.getElementById(gridId);
  if (!input || !grid) return;
  input.addEventListener('input', () => {
    const q = input.value.trim().toLowerCase();
    grid.querySelectorAll('.dc-prod-card').forEach(card => {
      const name = card.querySelector('.dc-prod-name');
      const text = name ? name.textContent.toLowerCase() : '';
      card.style.display = (!q || text.includes(q)) ? '' : 'none';
    });
  });
}

// ── NAV + REVEAL (shared) ──

function initNav() {
  const burger = document.getElementById('dcBurger');
  const mob = document.getElementById('dcNavMob');
  const searchBtn = document.getElementById('dcSearchBtn');
  const searchPanel = document.getElementById('dcSearchPanel');
  const searchInput = document.getElementById('dcSearchInput');

  if (burger && mob) {
    burger.addEventListener('click', () => {
      const open = mob.classList.toggle('open');
      burger.classList.toggle('open', open);
      burger.setAttribute('aria-expanded', String(open));
      mob.setAttribute('aria-hidden', String(!open));
      document.body.style.overflow = open ? 'hidden' : '';
    });
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && mob.classList.contains('open')) {
        mob.classList.remove('open');
        burger.classList.remove('open');
        burger.setAttribute('aria-expanded', 'false');
        mob.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
      }
    });
  }

  if (searchBtn && searchPanel) {
    searchBtn.addEventListener('click', () => {
      const wasHidden = searchPanel.hidden;
      searchPanel.hidden = !wasHidden;
      searchBtn.setAttribute('aria-expanded', String(wasHidden));
      if (wasHidden && searchInput) {
        searchInput.focus();
      }
    });
    document.addEventListener('click', e => {
      if (!searchPanel.hidden && !searchPanel.contains(e.target) && e.target !== searchBtn) {
        searchPanel.hidden = true;
        searchBtn.setAttribute('aria-expanded', 'false');
      }
    });
  }
}

function initReveal() {
  const ro = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('visible'); ro.unobserve(e.target); }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -32px 0px' });
  document.querySelectorAll('[data-reveal]').forEach(el => ro.observe(el));
}

// ── GLOBAL ADD-TO-CART EVENT DELEGATION ──
document.addEventListener('DOMContentLoaded', () => {
  document.addEventListener('click', e => {
    const btn = e.target.closest('[data-add-cart]');
    if (btn) {
      e.preventDefault();
      addToCart(parseInt(btn.dataset.addCart, 10));
    }
  });
  updateCartBadge();
  initNav();
  initReveal();
});
