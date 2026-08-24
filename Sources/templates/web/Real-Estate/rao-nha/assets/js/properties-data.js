/* ══ RaoNhà — Sàn giao dịch bất động sản (Loại hình A — Marketplace) ══ */
/* Dữ liệu mock data-driven: PROPERTIES sinh từ công thức theo AREAS/loại hình/khoảng cách ngày đăng.
   Không hardcode 44 object thủ công — dùng generator để đảm bảo tính nhất quán số liệu (giá theo m²/thành phố),
   nhưng nội dung mô tả vẫn là câu văn thật, có số liệu cụ thể (không lorem ipsum). */

/* ---------- Danh mục dùng chung ---------- */
const TYPE_LABELS = {
  'chung-cu': 'Chung cư', 'nha-pho': 'Nhà phố', 'dat-nen': 'Đất nền',
  'biet-thu': 'Biệt thự', 'shophouse': 'Shophouse', 'can-ho-dich-vu': 'Căn hộ dịch vụ'
};
const DIRECTION_LABELS = {
  'dong': 'Đông', 'tay': 'Tây', 'nam': 'Nam', 'bac': 'Bắc',
  'dong-nam': 'Đông Nam', 'dong-bac': 'Đông Bắc', 'tay-nam': 'Tây Nam', 'tay-bac': 'Tây Bắc'
};
const LEGAL_LABELS = {
  'so-do': 'Sổ đỏ', 'so-hong': 'Sổ hồng', 'hop-dong-mua-ban': 'Hợp đồng mua bán', 'dang-cho-so': 'Đang chờ sổ'
};
const FURNISHING_LABELS = { 'day-du': 'Đầy đủ nội thất', 'co-ban': 'Nội thất cơ bản', 'tho': 'Nhà thô' };
const ROLE_LABELS = { 'moi-gioi-tu-do': 'Môi giới tự do', 'chinh-chu': 'Chính chủ', 'cong-ty-moi-gioi': 'Công ty môi giới' };
const TIER_LABELS = { 'vip-kim-cuong': 'VIP Kim Cương', 'vip-vang': 'VIP Vàng', 'vip-bac': 'VIP Bạc', 'thuong': 'Tin thường' };
const TIER_ORDER = { 'vip-kim-cuong': 0, 'vip-vang': 1, 'vip-bac': 2, 'thuong': 3 };

const AREAS = [
  { slug: 'cau-giay-ha-noi', label: 'Cầu Giấy', city: 'Hà Nội', lat: 21.0308, lng: 105.7988 },
  { slug: 'dong-da-ha-noi', label: 'Đống Đa', city: 'Hà Nội', lat: 21.0136, lng: 105.8258 },
  { slug: 'hai-ba-trung-ha-noi', label: 'Hai Bà Trưng', city: 'Hà Nội', lat: 21.0075, lng: 105.8567 },
  { slug: 'tay-ho-ha-noi', label: 'Tây Hồ', city: 'Hà Nội', lat: 21.0687, lng: 105.8194 },
  { slug: 'long-bien-ha-noi', label: 'Long Biên', city: 'Hà Nội', lat: 21.0473, lng: 105.8890 },
  { slug: 'ha-dong-ha-noi', label: 'Hà Đông', city: 'Hà Nội', lat: 20.9715, lng: 105.7783 },
  { slug: 'nam-tu-liem-ha-noi', label: 'Nam Từ Liêm', city: 'Hà Nội', lat: 21.0138, lng: 105.7615 },
  { slug: 'quan-1-hcm', label: 'Quận 1', city: 'TP.HCM', lat: 10.7769, lng: 106.7009 },
  { slug: 'quan-7-hcm', label: 'Quận 7', city: 'TP.HCM', lat: 10.7329, lng: 106.7218 },
  { slug: 'binh-thanh-hcm', label: 'Bình Thạnh', city: 'TP.HCM', lat: 10.8106, lng: 106.7091 },
  { slug: 'thu-duc-hcm', label: 'TP. Thủ Đức', city: 'TP.HCM', lat: 10.8494, lng: 106.7537 },
  { slug: 'tan-binh-hcm', label: 'Tân Bình', city: 'TP.HCM', lat: 10.8014, lng: 106.6528 },
  { slug: 'hai-chau-da-nang', label: 'Hải Châu', city: 'Đà Nẵng', lat: 16.0544, lng: 108.2208 },
  { slug: 'son-tra-da-nang', label: 'Sơn Trà', city: 'Đà Nẵng', lat: 16.0730, lng: 108.2450 },
  { slug: 'ngu-hanh-son-da-nang', label: 'Ngũ Hành Sơn', city: 'Đà Nẵng', lat: 15.9980, lng: 108.2540 }
];

const STREETS = {
  'Hà Nội': ['Nguyễn Trãi', 'Trần Duy Hưng', 'Xuân Thủy', 'Kim Mã', 'Láng Hạ', 'Nguyễn Chí Thanh', 'Hoàng Quốc Việt', 'Lạc Long Quân'],
  'TP.HCM': ['Nguyễn Văn Linh', 'Lê Văn Lương', 'Nguyễn Hữu Thọ', 'Phạm Văn Đồng', 'Nguyễn Thị Thập', 'Huỳnh Tấn Phát', 'Cách Mạng Tháng Tám'],
  'Đà Nẵng': ['Bạch Đằng', 'Võ Nguyên Giáp', 'Nguyễn Văn Thoại', 'Trần Hưng Đạo', 'Ngô Quyền']
};

/* ---------- Ảnh Unsplash đã verify HTTP 200 ---------- */
const PROPERTY_IMAGES = [
  '1518780664697-55e3ad937233','1613977257363-707ba9348227','1570129477492-45c003edd2be',
  '1600585154340-be6161a56a0c','1600596542815-ffad4c1539a9','1600607687939-ce8a6c25118c',
  '1600607687920-4e2a09cf159d','1600566753086-00f18fb6b3ea','1600585154526-990dced4db0d',
  '1600047509807-ba8f99d2cdde','1600566752355-35792bedcfea','1600585152915-d208bec867a1',
  '1512917774080-9991f1c4c750','1493809842364-78817add7ffb','1449844908441-8829872d2607',
  '1502672260266-1c1ef2d93688','1523217582562-09d0def993a6','1484154218962-a197022b5858',
  '1560448204-e02f11c3d0e2','1560184611-ff3e53f00e8f','1560185007-c5ca9d2c014d',
  '1560185127-6ed189bf02f4','1571055107559-3e67626fa8be','1574362848149-11496d93a7c7',
  '1600121848594-d8644e57abab','1600573472550-8090b5e0745e','1613490493576-7fde63acd811',
  '1580587771525-78b9dba3b914','1568605114967-8130f3a36994','1554995207-c18c203602cb',
  '1600566753151-384129cf4e3e','1523755231516-e43fd2e8dca5','1494526585095-c41746248156',
  '1512918728675-ed5a9ecdebfd','1615529182904-14819c35db37','1522708323590-d24dbb6b0267',
  '1560518883-ce09059eeffa','1616486338812-3dadae4b4ace','1615873968403-89e068629265',
  '1583608205776-bfd35f0d9f83','1615874959474-d609969a20ed'
];
const PORTRAIT_IMAGES = [
  '1507003211169-0a1dd7228f2d','1500648767791-00dcc994a43e','1519085360753-af0119f7cbe7',
  '1494790108377-be9c29b29330','1560250097-0b93528c311a','1517841905240-472988babdf9',
  '1531123897727-8f129e1688ce','1544005313-94ddf0286df2','1552058544-f2b08422138a',
  '1573496359142-b8d87734a5a2','1580489944761-15a19d654956','1544725176-7c40e5a71c5e',
  '1500917293891-ef795e70e1f6','1607746882042-944635dfe10e','1522075469751-3a6694fb2f61',
  '1487412720507-e7ab37603c6f','1519345182560-3f2917c472ef','1506794778202-cad84cf45f1d',
  '1508214751196-bcfd4ca60f91','1541823709867-1b206113eafd','1601412436009-d964bd02edbc',
  '1544168190-79c17527004f'
];
const BANNER_IMAGES = [
  '1583417319070-4a69db38a482','1555431189-0fabf2667795','1512453979798-5ea266f8880c',
  '1470770903676-69b98201ea1c','1493397212122-2b85dda8106b','1493246507139-91e8fad9978e',
  '1449034446853-66c86144b0ad','1466442929976-97f336a657be','1470004914212-05527e49370b',
  '1573167243872-43c6433b9d40','1444084316824-dc26d6657664','1461749280684-dccba630e2f6',
  '1498050108023-c5249f4df085','1421789665209-c9b2a435e3dc'
];

function unsplash(id, w) { return `https://images.unsplash.com/photo-${id}?w=${w || 1200}&auto=format&fit=crop&q=80`; }
function pickImages(seed, n) {
  const out = [];
  for (let k = 0; k < n; k++) out.push(unsplash(PROPERTY_IMAGES[(seed * 6 + k) % PROPERTY_IMAGES.length], 1200));
  return out;
}
function pickPortrait(seed) { return unsplash(PORTRAIT_IMAGES[seed % PORTRAIT_IMAGES.length], 300); }
function pickBanner(seed) { return unsplash(BANNER_IMAGES[seed % BANNER_IMAGES.length], 1600); }

function slugify(str) {
  return str.toString().normalize('NFD').replace(/[̀-ͯ]/g, '')
    .replace(/đ/g, 'd').replace(/Đ/g, 'D')
    .toLowerCase().trim().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-');
}

/* ---------- Người đăng tin — 14 người khác nhau, KHÔNG quy về 1 công ty ---------- */
const POSTERS = [
  { name: 'Nguyễn Văn Hùng', role: 'moi-gioi-tu-do', phone: '0912 345 678' },
  { name: 'Trần Thị Mai', role: 'chinh-chu', phone: '0987 654 321' },
  { name: 'Lê Minh Tuấn', role: 'moi-gioi-tu-do', phone: '0933 221 456' },
  { name: 'Phạm Thu Hà', role: 'chinh-chu', phone: '0977 112 233' },
  { name: 'Địa Ốc Phú Gia', role: 'cong-ty-moi-gioi', phone: '0286 273 8899' },
  { name: 'Hoàng Đức Thịnh', role: 'moi-gioi-tu-do', phone: '0967 890 123' },
  { name: 'Vũ Thị Ngọc', role: 'chinh-chu', phone: '0918 456 789' },
  { name: 'Bất Động Sản Kim Long', role: 'cong-ty-moi-gioi', phone: '0243 998 7766' },
  { name: 'Đặng Quốc Bảo', role: 'moi-gioi-tu-do', phone: '0932 567 890' },
  { name: 'Ngô Thị Thu Trang', role: 'chinh-chu', phone: '0909 334 556' },
  { name: 'Công ty CP Nhà Đất An Cư', role: 'cong-ty-moi-gioi', phone: '0236 384 5567' },
  { name: 'Bùi Văn Long', role: 'moi-gioi-tu-do', phone: '0356 778 990' },
  { name: 'Trịnh Thị Kim Anh', role: 'chinh-chu', phone: '0794 223 118' },
  { name: 'Phan Đình Nam', role: 'moi-gioi-tu-do', phone: '0813 667 245' }
].map((p, i) => ({ ...p, avatar: pickPortrait(i) }));

/* ---------- Bảng giá tham chiếu theo m² (triệu VNĐ/m² cho bán, nghìn VNĐ/m²/tháng cho thuê) ---------- */
const SALE_PRICE_M2 = {
  'chung-cu': { 'Hà Nội': 46, 'TP.HCM': 52, 'Đà Nẵng': 33 },
  'nha-pho': { 'Hà Nội': 125, 'TP.HCM': 148, 'Đà Nẵng': 88 },
  'dat-nen': { 'Hà Nội': 58, 'TP.HCM': 68, 'Đà Nẵng': 38 },
  'biet-thu': { 'Hà Nội': 52, 'TP.HCM': 62, 'Đà Nẵng': 36 },
  'shophouse': { 'Hà Nội': 135, 'TP.HCM': 158, 'Đà Nẵng': 92 },
  'can-ho-dich-vu': { 'Hà Nội': 50, 'TP.HCM': 58, 'Đà Nẵng': 34 }
};
const RENT_PRICE_M2 = {
  'chung-cu': { 'Hà Nội': 170, 'TP.HCM': 190, 'Đà Nẵng': 120 },
  'nha-pho': { 'Hà Nội': 210, 'TP.HCM': 240, 'Đà Nẵng': 150 },
  'biet-thu': { 'Hà Nội': 260, 'TP.HCM': 300, 'Đà Nẵng': 190 },
  'shophouse': { 'Hà Nội': 330, 'TP.HCM': 380, 'Đà Nẵng': 240 },
  'can-ho-dich-vu': { 'Hà Nội': 240, 'TP.HCM': 270, 'Đà Nẵng': 170 }
};

const FEATURE_POOL = {
  'chung-cu': ['Hồ bơi nội khu', 'Gần trường quốc tế', 'An ninh 24/7', 'Có chỗ để ô tô', 'Ban công thoáng mát', 'Gần siêu thị', 'Thang máy riêng biệt'],
  'nha-pho': ['Hẻm xe hơi ra vào', 'Gần chợ dân sinh', 'Đã hoàn công đầy đủ', 'Gần trường học', 'Khu dân cư yên tĩnh', 'Sân trước để xe'],
  'dat-nen': ['Sổ đỏ riêng từng lô', 'Đường nhựa trước đất', 'Quy hoạch 1/500 rõ ràng', 'Gần khu công nghiệp', 'Đất thổ cư 100%', 'Không vướng quy hoạch'],
  'biet-thu': ['Sân vườn rộng', 'Hồ bơi riêng', 'An ninh khép kín 24/7', 'Gần sân golf', 'Gara ô tô rộng', 'Thiết kế biệt lập'],
  'shophouse': ['Mặt tiền kinh doanh sầm uất', 'Lưu lượng người qua lại cao', 'Phù hợp mở cửa hàng/văn phòng', 'Có gác lửng', 'Vỉa hè rộng để xe'],
  'can-ho-dich-vu': ['Dịch vụ dọn phòng hàng tuần', 'Đầy đủ nội thất cao cấp', 'Gần khu văn phòng', 'Bảo vệ 24/7', 'Có gym & hồ bơi chung cư']
};

const DIRECTION_KEYS = Object.keys(DIRECTION_LABELS);
const LEGAL_KEYS = Object.keys(LEGAL_LABELS);
const FURNISH_KEYS = Object.keys(FURNISHING_LABELS);
const TYPE_KEYS = Object.keys(TYPE_LABELS);

function tierFor(i) {
  if ([3, 27].includes(i)) return 'vip-kim-cuong';
  if ([7, 15, 23, 35].includes(i)) return 'vip-vang';
  if ([1, 9, 13, 19, 25, 31, 37, 41].includes(i)) return 'vip-bac';
  return 'thuong';
}
function specsFor(type, i) {
  switch (type) {
    case 'chung-cu': return { bedrooms: 1 + (i % 3), bathrooms: 1 + (i % 2), area: 45 + (i % 6) * 9, floors: null };
    case 'nha-pho': return { bedrooms: 3 + (i % 3), bathrooms: 2 + (i % 3), area: 60 + (i % 8) * 13, floors: 2 + (i % 4) };
    case 'dat-nen': return { bedrooms: 0, bathrooms: 0, area: 80 + (i % 10) * 22, floors: null };
    case 'biet-thu': return { bedrooms: 4 + (i % 3), bathrooms: 3 + (i % 3), area: 200 + (i % 6) * 42, floors: 2 + (i % 3) };
    case 'shophouse': return { bedrooms: 2 + (i % 3), bathrooms: 2 + (i % 2), area: 80 + (i % 6) * 12, floors: 3 + (i % 3) };
    case 'can-ho-dich-vu': return { bedrooms: 1 + (i % 2), bathrooms: 1 + (i % 2), area: 35 + (i % 5) * 8, floors: null };
  }
}
function needFor(i, type) {
  if (type === 'dat-nen') return 'ban';
  if (type === 'can-ho-dich-vu') return 'cho-thue';
  return (i % 4 === 2) ? 'cho-thue' : 'ban';
}
function calcRawPrice(type, need, area, city) {
  if (need === 'ban') {
    const perM2 = (SALE_PRICE_M2[type] && SALE_PRICE_M2[type][city]) || 50;
    return Math.round((perM2 * area * 1e6) / 1e8) * 1e8;
  }
  const perM2 = (RENT_PRICE_M2[type] && RENT_PRICE_M2[type][city]) || 180;
  return Math.round((perM2 * 1000 * area) / 5e5) * 5e5;
}
function buildTitle(type, need, s, areaLabel) {
  let t;
  switch (type) {
    case 'chung-cu': t = `Căn hộ ${s.bedrooms} phòng ngủ ${s.area}m² tại ${areaLabel}`; break;
    case 'nha-pho': t = `Nhà phố ${s.floors} tầng ${s.area}m² mặt tiền ${areaLabel}`; break;
    case 'dat-nen': t = `Đất nền thổ cư ${s.area}m² tại ${areaLabel}`; break;
    case 'biet-thu': t = `Biệt thự sân vườn ${s.area}m² tại ${areaLabel}`; break;
    case 'shophouse': t = `Shophouse ${s.floors} tầng mặt tiền kinh doanh tại ${areaLabel}`; break;
    case 'can-ho-dich-vu': t = `Căn hộ dịch vụ ${s.bedrooms} phòng ngủ đầy đủ nội thất tại ${areaLabel}`; break;
  }
  return need === 'cho-thue' ? `${t} - cho thuê` : t;
}
function buildDescription(type, need, s, direction, legal, furnishing, areaLabel) {
  const typeLabel = TYPE_LABELS[type].toLowerCase();
  const roomPart = s.bedrooms > 0 ? `thiết kế ${s.bedrooms} phòng ngủ, ${s.bathrooms} phòng tắm` : 'phù hợp xây dựng tự do theo quy hoạch được duyệt';
  const purpose = need === 'ban' ? 'an cư lâu dài hoặc đầu tư sinh lời' : 'thuê ở ngay hoặc kinh doanh';
  return `${TYPE_LABELS[type]} tọa lạc tại khu vực ${areaLabel}, diện tích ${s.area}m², ${roomPart}, hướng ${DIRECTION_LABELS[direction].toLowerCase()} đón gió mát quanh năm. `
    + `Tình trạng pháp lý ${LEGAL_LABELS[legal].toLowerCase()}, ${FURNISHING_LABELS[furnishing].toLowerCase()}, sẵn sàng bàn giao ngay khi hoàn tất thủ tục. `
    + `Khu vực xung quanh tiện ích đầy đủ — gần trường học, chợ/siêu thị, giao thông thuận tiện kết nối trung tâm — phù hợp cho nhu cầu ${purpose}.`;
}

const PROPERTIES = Array.from({ length: 44 }, (_, i) => {
  const id = i + 1;
  const area = AREAS[i % AREAS.length];
  const type = TYPE_KEYS[i % TYPE_KEYS.length];
  const need = needFor(i, type);
  const s = specsFor(type, i);
  const direction = DIRECTION_KEYS[i % DIRECTION_KEYS.length];
  const legal = type === 'dat-nen' ? 'so-do' : LEGAL_KEYS[i % LEGAL_KEYS.length];
  const furnishing = type === 'dat-nen' ? 'tho' : FURNISH_KEYS[i % FURNISH_KEYS.length];
  const tier = tierFor(i);
  const daysAgo = (i * 3 + 1) % 60;
  const price = calcRawPrice(type, need, s.area, area.city);
  const title = buildTitle(type, need, s, area.label);
  const posted = new Date(2026, 7, 23); // 2026-08-23
  posted.setDate(posted.getDate() - daysAgo);
  const street = STREETS[area.city][i % STREETS[area.city].length];
  const badge = daysAgo <= 3 ? 'moi' : (tier === 'vip-kim-cuong' || tier === 'vip-vang' ? 'hot' : null);
  const features = [0, 1, 2, 3].map(k => FEATURE_POOL[type][(i + k) % FEATURE_POOL[type].length]);

  return {
    id,
    title,
    slug: slugify(title) + '-' + id,
    listingType: need,
    propertyType: type,
    price,
    priceUnit: need === 'ban' ? (price >= 1e9 ? 'tỷ' : 'triệu') : 'triệu/tháng',
    area: s.area,
    bedrooms: s.bedrooms,
    bathrooms: s.bathrooms,
    floors: s.floors,
    direction,
    legalStatus: legal,
    furnishing,
    district: area.label,
    districtSlug: area.slug,
    city: area.city,
    posterSlug: slugify(POSTERS[i % POSTERS.length].name),
    address: `Đường ${street}, ${area.label}, ${area.city}`,
    lat: area.lat + ((i % 7) - 3) * 0.0035,
    lng: area.lng + ((i % 5) - 2) * 0.0035,
    badge,
    listingTier: tier,
    postedDate: posted.toISOString().slice(0, 10),
    images: pickImages(i, 6),
    poster: POSTERS[i % POSTERS.length],
    description: buildDescription(type, need, s, direction, legal, furnishing, area.label),
    features
  };
});

/* ---------- Định dạng tiền tệ kiểu Việt Nam ---------- */
function formatPrice(vnd, listingType) {
  if (listingType === 'cho-thue') {
    const m = vnd / 1e6;
    return `${m % 1 === 0 ? m.toFixed(0) : m.toFixed(1)} triệu/tháng`;
  }
  if (vnd >= 1e9) {
    const t = vnd / 1e9;
    return `${t % 1 === 0 ? t.toFixed(0) : t.toFixed(1)} tỷ`;
  }
  return `${Math.round(vnd / 1e6)} triệu`;
}
function formatFullVND(vnd) { return Math.round(vnd).toLocaleString('vi-VN') + ' đ'; }

/* ---------- Công cụ tính vay / trả góp ---------- */
function calcMonthlyPayment(loanAmount, annualRatePercent, years) {
  const r = (annualRatePercent / 100) / 12;
  const n = years * 12;
  if (n <= 0) return 0;
  if (r === 0) return loanAmount / n;
  return loanAmount * r * Math.pow(1 + r, n) / (Math.pow(1 + r, n) - 1);
}

/* ---------- BĐS tương tự (round-robin cùng loại hình hoặc cùng khu vực) ---------- */
function getRelatedProperties(current, n) {
  const sameType = PROPERTIES.filter(p => p.id !== current.id && p.propertyType === current.propertyType);
  const sameArea = PROPERTIES.filter(p => p.id !== current.id && p.district === current.district && p.propertyType !== current.propertyType);
  const pool = [...sameType, ...sameArea, ...PROPERTIES.filter(p => p.id !== current.id)];
  const seen = new Set(); const out = [];
  for (const p of pool) { if (!seen.has(p.id)) { seen.add(p.id); out.push(p); } if (out.length >= n) break; }
  return out;
}

/* ---------- Bài viết Tin tức — nội dung thật, không lorem ipsum ---------- */
const ARTICLES = [
  {
    id: 1, slug: 'kinh-nghiem-dat-coc-mua-nha-an-toan',
    title: 'Kinh nghiệm đặt cọc mua nhà an toàn, tránh rủi ro pháp lý',
    category: 'Kinh nghiệm', date: '2026-08-18', author: 'Đội ngũ biên tập RaoNhà',
    thumb: pickBanner(0),
    excerpt: 'Đặt cọc là bước quan trọng nhưng cũng tiềm ẩn nhiều rủi ro nhất trong giao dịch mua bán nhà đất. Dưới đây là những điều người mua cần kiểm tra kỹ trước khi đặt bút ký.',
    content: `Đặt cọc là bước ràng buộc đầu tiên giữa người mua và người bán trước khi ra công chứng, vì vậy đây cũng là giai đoạn xảy ra tranh chấp nhiều nhất trên thị trường bất động sản. Trước khi đặt cọc, người mua cần yêu cầu xem bản gốc sổ đỏ/sổ hồng, đối chiếu thông tin thửa đất, diện tích, tên chủ sở hữu trên sổ với thông tin thực tế và với căn cước công dân của người bán.

Thứ hai, cần kiểm tra tài sản có đang bị thế chấp ngân hàng, kê biên thi hành án hay tranh chấp thừa kế hay không bằng cách tra cứu tại văn phòng đăng ký đất đai hoặc nhờ luật sư, công chứng viên hỗ trợ xác minh. Nhiều trường hợp người mua mất cọc oan vì tài sản đang thế chấp mà bên bán cố tình giấu thông tin.

Thứ ba, hợp đồng đặt cọc cần ghi rõ: số tiền cọc, thời hạn ra công chứng, điều khoản phạt cọc hai chiều (không chỉ phạt người mua bỏ cọc mà cả người bán nếu đổi ý không bán), và phương án xử lý nếu phát sinh tranh chấp về diện tích/quy hoạch sau khi đo đạc thực tế. Mức cọc phổ biến hiện nay dao động 50-100 triệu đồng hoặc 5-10% giá trị giao dịch, tùy thỏa thuận.

Cuối cùng, nên đặt cọc thông qua chuyển khoản ngân hàng thay vì tiền mặt để có chứng từ rõ ràng, và nếu giá trị giao dịch lớn, nên cân nhắc đặt cọc tại văn phòng công chứng hoặc có bên thứ ba (môi giới, luật sư) làm chứng ký tên trong hợp đồng cọc. Một khoản cọc được chuẩn bị kỹ lưỡng sẽ giúp cả hai bên yên tâm tiến tới bước công chứng và sang tên mà không phát sinh tranh cãi.`
  },
  {
    id: 2, slug: 'phan-biet-so-do-so-hong-hop-dong-mua-ban',
    title: 'Phân biệt Sổ đỏ, Sổ hồng và Hợp đồng mua bán — người mua nhà cần biết',
    category: 'Pháp lý', date: '2026-08-14', author: 'Đội ngũ biên tập RaoNhà',
    thumb: pickBanner(1),
    excerpt: 'Ba loại giấy tờ pháp lý này quyết định trực tiếp đến quyền lợi và độ an toàn của người mua. Bài viết giải thích rõ sự khác biệt và mức độ rủi ro tương ứng.',
    content: `"Sổ đỏ" là tên gọi quen thuộc của Giấy chứng nhận quyền sử dụng đất, thường cấp cho đất ở, đất nông nghiệp, đất chưa có tài sản gắn liền. "Sổ hồng" là Giấy chứng nhận quyền sử dụng đất, quyền sở hữu nhà ở và tài sản khác gắn liền với đất — áp dụng phổ biến cho nhà phố, căn hộ chung cư đã hoàn công. Từ năm 2009, hai loại giấy tờ này về cơ bản đã được hợp nhất thành một mẫu chung do Bộ Tài nguyên và Môi trường (nay thuộc Bộ Nông nghiệp và Môi trường) phát hành, nhưng người dân vẫn quen gọi theo tên cũ dựa trên loại tài sản.

"Hợp đồng mua bán" là trường hợp phổ biến với căn hộ chung cư hình thành trong tương lai hoặc dự án đang chờ cấp sổ — người mua chưa có sổ riêng mà chỉ có hợp đồng ký với chủ đầu tư, kèm theo biên bản bàn giao, hóa đơn thanh toán. Đây là loại giấy tờ có độ rủi ro cao hơn hai loại trên vì phụ thuộc vào tiến độ pháp lý và uy tín của chủ đầu tư — cần kiểm tra dự án đã được cấp phép xây dựng, đã hoàn thành nghĩa vụ tài chính với Nhà nước hay chưa trước khi mua lại qua hình thức chuyển nhượng hợp đồng.

Khi xem tin đăng, người mua nên ưu tiên các bất động sản đã có sổ riêng (đỏ/hồng) đứng tên chính chủ để giảm thiểu rủi ro, hoặc nếu chấp nhận mua dạng hợp đồng mua bán/đang chờ sổ thì cần yêu cầu bên bán cung cấp đầy đủ hồ sơ pháp lý dự án và tốt nhất nên có luật sư tư vấn trước khi đặt cọc.`
  },
  {
    id: 3, slug: 'xu-huong-gia-chung-cu-noi-thanh-2026',
    title: 'Xu hướng giá chung cư nội thành Hà Nội và TP.HCM nửa cuối 2026',
    category: 'Thị trường', date: '2026-08-10', author: 'Đội ngũ biên tập RaoNhà',
    thumb: pickBanner(2),
    excerpt: 'Giá căn hộ tại các quận trung tâm tiếp tục neo ở vùng cao do nguồn cung mới hạn chế. Bài viết tổng hợp diễn biến giá theo khu vực và dự báo ngắn hạn.',
    content: `Trong nửa đầu năm 2026, mặt bằng giá căn hộ chung cư tại các quận trung tâm Hà Nội (Cầu Giấy, Đống Đa, Tây Hồ) và TP.HCM (Quận 1, Quận 7, Bình Thạnh) tiếp tục duy trì xu hướng tăng nhẹ so với cùng kỳ, chủ yếu do nguồn cung dự án mới hạn chế trong khi nhu cầu ở thực và đầu tư vẫn cao. Các căn hộ 2 phòng ngủ diện tích 60-70m² tại khu vực nội thành hiện phổ biến ở mức 2,8 - 4,5 tỷ đồng tùy vị trí và chất lượng bàn giao.

Ngược lại, phân khúc vùng ven và các đô thị vệ tinh như Hà Đông, Nam Từ Liêm, Thủ Đức, Tân Bình ghi nhận mức giá dễ tiếp cận hơn, dao động 1,8 - 3 tỷ đồng cho căn 2 phòng ngủ, phù hợp với nhóm khách hàng trẻ mua nhà lần đầu. Đây cũng là khu vực có lượng tin đăng và lượt tìm kiếm tăng mạnh nhất trên các nền tảng giao dịch trực tuyến trong quý vừa qua.

Tại Đà Nẵng, giá căn hộ khu vực Hải Châu và Sơn Trà tương đối ổn định, dao động 1,5 - 2,8 tỷ đồng cho căn 2 phòng ngủ view gần biển, thu hút cả người mua ở thực lẫn nhà đầu tư cho thuê ngắn hạn phục vụ khách du lịch.

Dự báo trong các quý tới, mặt bằng giá khó có khả năng giảm sâu do chi phí xây dựng và tiền sử dụng đất vẫn ở mức cao, nhưng tốc độ tăng sẽ chậm lại khi nguồn cung mới từ các dự án đang triển khai dần được đưa ra thị trường vào cuối năm.`
  },
  {
    id: 4, slug: 'thu-tuc-sang-ten-so-do-can-giay-to-gi',
    title: 'Thủ tục sang tên Sổ đỏ/Sổ hồng cần chuẩn bị những giấy tờ gì?',
    category: 'Pháp lý', date: '2026-08-05', author: 'Đội ngũ biên tập RaoNhà',
    thumb: pickBanner(3),
    excerpt: 'Sang tên là bước cuối cùng hoàn tất giao dịch. Danh sách giấy tờ và trình tự các bước công chứng - kê khai thuế - đăng bộ giúp người mua chủ động thời gian.',
    content: `Sau khi hai bên đã thống nhất giá và đặt cọc, bước tiếp theo là ký hợp đồng chuyển nhượng tại văn phòng công chứng. Hồ sơ cần chuẩn bị gồm: bản gốc Giấy chứng nhận quyền sử dụng đất/quyền sở hữu nhà, căn cước công dân và sổ hộ khẩu (hoặc giấy xác nhận cư trú) của cả bên mua và bên bán, giấy chứng nhận tình trạng hôn nhân (nếu tài sản chung vợ chồng cần cả hai cùng ký), và hợp đồng đặt cọc (nếu có) để đối chiếu điều khoản.

Sau khi công chứng hợp đồng chuyển nhượng, các bên tiến hành kê khai nghĩa vụ tài chính tại Chi cục Thuế nơi có bất động sản, bao gồm thuế thu nhập cá nhân (thường 2% giá trị chuyển nhượng, bên bán nộp) và lệ phí trước bạ (thường 0,5% giá trị, bên mua nộp) — có thể thỏa thuận khác trong hợp đồng. Thời gian xử lý hồ sơ thuế thường 10-15 ngày làm việc.

Bước cuối cùng là nộp hồ sơ đăng ký biến động đất đai tại Văn phòng đăng ký đất đai cấp quận/huyện để được cấp Giấy chứng nhận đứng tên chủ mới, thời gian xử lý theo quy định thường không quá 10 ngày làm việc kể từ khi nhận đủ hồ sơ hợp lệ. Người mua nên giữ lại toàn bộ biên lai nộp thuế, phí và bản sao hợp đồng công chứng để đối chiếu khi cần thiết trong tương lai.`
  },
  {
    id: 5, slug: 'kinh-nghiem-thue-nha-nguyen-can-lan-dau',
    title: 'Kinh nghiệm thuê nhà nguyên căn lần đầu — tránh mất cọc oan',
    category: 'Kinh nghiệm', date: '2026-07-30', author: 'Đội ngũ biên tập RaoNhà',
    thumb: pickBanner(4),
    excerpt: 'Người thuê nhà lần đầu thường bỏ qua nhiều chi tiết quan trọng trong hợp đồng thuê. Bài viết chỉ ra các điều khoản cần đọc kỹ trước khi đặt cọc.',
    content: `Khi thuê nhà nguyên căn hoặc căn hộ dịch vụ, người thuê cần yêu cầu chủ nhà xuất trình giấy tờ chứng minh quyền sở hữu hoặc quyền cho thuê hợp pháp (sổ đỏ/sổ hồng đứng tên hoặc giấy ủy quyền cho thuê nếu người ký hợp đồng không phải chủ sở hữu). Đây là bước nhiều người thuê bỏ qua nhưng lại quan trọng để tránh trường hợp thuê lại từ người không có quyền cho thuê.

Hợp đồng thuê nhà cần ghi rõ: thời hạn thuê, giá thuê và chu kỳ tăng giá (nếu có, thường không quá 10%/năm), số tiền đặt cọc (phổ biến 1-3 tháng tiền thuê) và điều kiện hoàn/không hoàn cọc, ai chịu trách nhiệm sửa chữa hư hỏng phát sinh trong quá trình sử dụng, và điều khoản chấm dứt hợp đồng trước hạn — bên nào vi phạm sẽ mất cọc hoặc phải bồi thường ra sao.

Trước khi nhận nhà, nên cùng chủ nhà lập biên bản bàn giao tài sản, ghi chú tình trạng nội thất, chỉ số điện nước ban đầu, có chụp ảnh làm bằng chứng — điều này giúp tránh tranh chấp khi trả nhà về sau. Nếu thuê qua môi giới, cần xác minh môi giới có được chủ nhà ủy quyền thật sự hay không trước khi chuyển tiền cọc, tránh trường hợp lừa đảo cọc giữ chỗ nhà không có thật.`
  },
  {
    id: 6, slug: 'dau-tu-dat-nen-vung-ven-can-luu-y-gi',
    title: 'Đầu tư đất nền vùng ven: cơ hội và những rủi ro cần lưu ý',
    category: 'Đầu tư', date: '2026-07-22', author: 'Đội ngũ biên tập RaoNhà',
    thumb: pickBanner(5),
    excerpt: 'Đất nền vùng ven vẫn hấp dẫn nhà đầu tư nhờ biên độ tăng giá theo hạ tầng, nhưng đi kèm rủi ro quy hoạch và thanh khoản chậm hơn khu trung tâm.',
    content: `Đất nền tại các khu vực vùng ven như Hà Đông, Thủ Đức hay các huyện lân cận Đà Nẵng vẫn thu hút dòng tiền đầu tư nhờ mức giá còn tương đối "mềm" so với khu trung tâm và tiềm năng tăng giá khi hạ tầng giao thông (đường vành đai, cầu, metro) được hoàn thiện. Tuy nhiên, nhà đầu tư cần lưu ý ba rủi ro chính trước khi xuống tiền.

Thứ nhất là rủi ro quy hoạch: cần tra cứu thông tin quy hoạch sử dụng đất tại phòng Tài nguyên và Môi trường hoặc trên cổng thông tin quy hoạch của địa phương để chắc chắn thửa đất không nằm trong diện quy hoạch treo, lộ giới mở đường, hoặc đất công trình công cộng. Thứ hai là tính thanh khoản — đất nền vùng ven thường mất nhiều thời gian hơn để bán lại so với căn hộ hoặc nhà phố nội thành, nên phù hợp với dòng vốn trung-dài hạn hơn là lướt sóng ngắn hạn.

Thứ ba, cần kiểm tra kỹ pháp lý phân lô: đất đã tách thửa, có sổ đỏ riêng từng lô hay chưa, dự án phân lô có được cơ quan có thẩm quyền phê duyệt 1/500 hay không — tránh mua đất nền tự phân lô trái phép vốn tiềm ẩn nguy cơ không được cấp phép xây dựng sau này. Nhà đầu tư nên ưu tiên các lô đất đã có sổ đỏ riêng, vị trí gần trục đường chính đang hoặc sắp được nâng cấp, và có quy hoạch rõ ràng để giảm thiểu rủi ro pháp lý về lâu dài.`
  },
  {
    id: 7, slug: 'goi-tin-vip-khac-gi-tin-thuong',
    title: 'Gói tin VIP khác gì tin thường? Nên chọn gói nào khi đăng tin bán nhà',
    category: 'Hướng dẫn', date: '2026-07-15', author: 'Đội ngũ biên tập RaoNhà',
    thumb: pickBanner(6),
    excerpt: 'Với hàng chục nghìn tin đăng mới mỗi ngày, vị trí hiển thị quyết định phần lớn khả năng tiếp cận người mua. Bài viết so sánh chi tiết 4 gói tin trên RaoNhà.',
    content: `Trên các sàn giao dịch bất động sản trực tuyến, số lượng tin đăng mới mỗi ngày có thể lên tới hàng nghìn tin, vì vậy vị trí hiển thị của tin đăng ảnh hưởng trực tiếp đến số lượt xem và số cuộc gọi liên hệ mà người bán/môi giới nhận được. RaoNhà cung cấp 4 mức gói tin để người đăng lựa chọn theo nhu cầu và ngân sách.

Gói Tin thường miễn phí, phù hợp với người bán chính chủ đăng thử hoặc bất động sản có mức giá cạnh tranh sẵn, tin hiển thị theo thứ tự thời gian đăng, không có vị trí ưu tiên. Gói VIP Bạc và VIP Vàng có mức phí vừa phải, giúp tin được đẩy lên vị trí ưu tiên trong danh sách và trang chủ, có thêm số lần làm mới tin tự động trong tuần để duy trì thứ hạng. Gói VIP Kim Cương là mức cao nhất, tin luôn ở vị trí đầu bảng danh sách kết quả tìm kiếm, hiển thị badge nổi bật và được ưu tiên trong các khối "Tin nổi bật" trên trang chủ.

Kinh nghiệm thực tế cho thấy các bất động sản có mức giá cao hoặc cần bán/cho thuê gấp nên cân nhắc gói VIP Vàng hoặc Kim Cương để rút ngắn thời gian tìm được người mua/thuê phù hợp, trong khi tin đăng phổ thông vẫn có thể tiếp cận khách hàng tốt với gói Bạc kết hợp làm mới tin đều đặn.`
  },
  {
    id: 8, slug: 'phan-tich-khu-vực-thu-duc-tiem-nang-2026',
    title: 'Phân tích khu vực TP. Thủ Đức: tiềm năng tăng giá bất động sản đến 2027',
    category: 'Thị trường', date: '2026-07-08', author: 'Đội ngũ biên tập RaoNhà',
    thumb: pickBanner(7),
    excerpt: 'TP. Thủ Đức tiếp tục là điểm sáng thu hút dòng vốn nhờ hạ tầng giao thông và quy hoạch đô thị sáng tạo. Bài viết điểm qua các yếu tố tác động đến giá đất khu vực.',
    content: `TP. Thủ Đức, được thành lập trên cơ sở sáp nhập Quận 2, Quận 9 và Quận Thủ Đức cũ, tiếp tục là một trong những khu vực được giới đầu tư bất động sản quan tâm nhiều nhất tại TP.HCM nhờ định hướng phát triển thành đô thị sáng tạo, tương tác cao phía Đông thành phố. Các tuyến hạ tầng trọng điểm như tuyến Metro số 1 (Bến Thành - Suối Tiên) đã đi vào vận hành, cùng các dự án mở rộng đường Vành đai 3 đang triển khai, góp phần cải thiện đáng kể khả năng kết nối với khu trung tâm.

Phân khúc căn hộ chung cư tại khu vực gần các nhà ga metro và trục đường Nguyễn Thị Thập, Nguyễn Hữu Thọ ghi nhận mức độ quan tâm tìm kiếm tăng cao trong các quý gần đây, đặc biệt ở nhóm căn 2-3 phòng ngủ diện tích 60-90m² phù hợp gia đình trẻ. Đất nền và nhà phố tại các phường ven sông cũng duy trì sức hút với nhà đầu tư dài hạn nhờ quỹ đất còn tương đối dồi dào so với khu trung tâm truyền thống.

Tuy nhiên, người mua cần lưu ý một số khu vực vẫn đang trong giai đoạn hoàn thiện hạ tầng, tiện ích xã hội (trường học, bệnh viện, chợ) chưa đồng bộ ở tất cả các phường, nên cần khảo sát thực địa kỹ trước khi quyết định, đặc biệt với mục đích ở thực thay vì chỉ đầu tư chờ tăng giá.`
  }
];
