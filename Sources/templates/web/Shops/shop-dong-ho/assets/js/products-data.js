/* ══════════════════════════════════════════════════════════════════
   MERIDIAN — Đồng hồ chính hãng đa thương hiệu
   products-data.js — nguồn dữ liệu duy nhất, mọi trang render lại DOM từ đây
   Toàn bộ ảnh là URL Unsplash thật (images.unsplash.com/photo-...) đã verify HTTP 200.
   ══════════════════════════════════════════════════════════════════ */

/* Pool ảnh đồng hồ (57 ảnh, verify HTTP 200 qua curl) — cycle theo index sản phẩm */
const WATCH_IMAGE_IDS = [
  '1507679252487-e3db58b1642e', '1600003014755-ba31aa59c4b6', '1670177257750-9b47927f68eb',
  '1618215650148-e8e61eae521c', '1670404160620-a3a86428560e', '1600003014637-ff82a275e191',
  '1600003014608-c2ccc1570a65', '1730757679771-b53e798846cf', '1524805444758-089113d48a6d',
  '1620625515032-6ed0c1790c75', '1604242692760-2f7b0c26856d', '1587925358603-c2eea5305bbc',
  '1634140704051-58a787556cd1', '1636639818651-d97365346a5c', '1548171916-c0dea7f94ca6',
  '1524592094714-0f0654e20314', '1506193095-80bc749473f2', '1618215649872-6e3143a716ec',
  '1579171931975-97962e46be2d', '1602752975366-5520991f958d', '1689287428096-7e1dcc705a5c',
  '1623998021450-85c29c644e0d', '1506796684999-9fa2770af9c3', '1451477334999-a9321157a431',
  '1590995505834-e5380bba1865', '1516461240763-822a87484851', '1625139109729-3611f838306d',
  '1584208124193-df98a65afaf6', '1490915785914-0af2806c22b6', '1526648856597-c2b6745ad7bd',
  '1580287017488-706e4d7598a1', '1605143185597-9fe1a8065fbb', '1605143185672-f4f5c892dda4',
  '1582043568252-63501953afcc', '1582043568452-86590c15107d', '1582043568328-69ce6fea1a7b',
  '1582043568773-a7a2b57239f5', '1766306285696-5469242d8085', '1770216533493-a25ce4224123',
  '1690729125175-fcda275386e4', '1783878081616-fc4a978a68e5', '1581409767632-6be2fff574a0',
  '1768062251809-739d987a42fe', '1772354318482-9caa5a429320', '1546868871-7041f2a55e12',
  '1508685096489-7aacd43bd3b1', '1660844817855-3ecc7ef21f12', '1637160151663-a410315e4e75',
  '1544117519-31a4b719223d', '1632794716789-42d9995fb5b6', '1696688713460-de12ac76ebc6',
  '1434494571168-ab162bce2813', '1631863552122-3072cf599a46', '1639575003095-d55df63b97be',
  '1598516802414-50a01bee818d', '1434494878577-86c23bcb06b9', '1596236100223-f3c656de3038'
];

function dhImg(idx, w) {
  const id = WATCH_IMAGE_IDS[idx % WATCH_IMAGE_IDS.length];
  return `https://images.unsplash.com/photo-${id}?w=${w || 700}&auto=format&fit=crop&q=80`;
}

function dhSlugify(str) {
  return str.toLowerCase()
    .normalize('NFD').replace(/[̀-ͯ]/g, '')
    .replace(/đ/g, 'd')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

/* Nhãn hiển thị cho từng field */
const CATEGORY_LABELS = { nam: 'Đồng hồ Nam', nu: 'Đồng hồ Nữ', unisex: 'Unisex' };
const MATERIAL_LABELS = { da: 'Dây da', 'kim-loai': 'Dây kim loại', 'cao-su': 'Dây cao su', vai: 'Dây vải (NATO)' };
const STYLE_LABELS = { 'co-dien': 'Cổ điển', 'the-thao': 'Thể thao', 'sang-trong': 'Sang trọng', smartwatch: 'Smartwatch' };
const THEME_LABELS = { nam: 'Bộ sưu tập Nam', nu: 'Bộ sưu tập Nữ', 'gioi-han': 'Phiên bản giới hạn', 'ban-chay': 'Bán chạy nhất', 'hang-moi': 'Hàng mới về' };

/* Dữ liệu thô — mỗi dòng: [tên, brand, category, material, style, giá gốc VNĐ, đã bán, có phiên bản giới hạn?] */
const RAW_WATCHES = [
  ['CASIO Edifice Chronograph EFR-556', 'CASIO', 'nam', 'kim-loai', 'the-thao', 3290000, 412, false],
  ['CASIO G-Shock GA-2100 Casioak', 'CASIO', 'nam', 'cao-su', 'the-thao', 2590000, 588, false],
  ['CASIO Sheen Crystal SHE-4057', 'CASIO', 'nu', 'kim-loai', 'sang-trong', 3890000, 156, false],
  ['CASIO Vintage A168 Retro', 'CASIO', 'unisex', 'kim-loai', 'the-thao', 1290000, 674, false],
  ['SEIKO Presage Cocktail Time', 'SEIKO', 'nam', 'kim-loai', 'co-dien', 8900000, 203, false],
  ['SEIKO 5 Sports Automatic SRPD', 'SEIKO', 'nam', 'kim-loai', 'the-thao', 5490000, 341, false],
  ['SEIKO Lukia Diamond Ladies', 'SEIKO', 'nu', 'kim-loai', 'sang-trong', 9900000, 87, true],
  ['SEIKO Chronograph SSB Series', 'SEIKO', 'nam', 'da', 'co-dien', 6200000, 128, false],
  ['CITIZEN Eco-Drive Promaster Diver', 'CITIZEN', 'nam', 'kim-loai', 'the-thao', 11500000, 176, false],
  ['CITIZEN Eco-Drive Elegance Ladies', 'CITIZEN', 'nu', 'kim-loai', 'sang-trong', 7900000, 142, false],
  ['CITIZEN Automatic Open Heart', 'CITIZEN', 'nam', 'da', 'co-dien', 8400000, 98, false],
  ['CITIZEN L Ladies Crystal', 'CITIZEN', 'nu', 'kim-loai', 'sang-trong', 6900000, 119, false],
  ['ORIENT Bambino Classic V4', 'ORIENT', 'nam', 'da', 'co-dien', 5200000, 264, false],
  ['ORIENT Star Ladies Elegant', 'ORIENT', 'nu', 'kim-loai', 'sang-trong', 12900000, 54, true],
  ['ORIENT Mako II Automatic Diver', 'ORIENT', 'nam', 'kim-loai', 'the-thao', 6800000, 187, false],
  ['ORIENT Contemporary Sun & Moon', 'ORIENT', 'nam', 'da', 'co-dien', 7400000, 76, false],
  ['TISSOT PRX Powermatic 80', 'TISSOT', 'unisex', 'kim-loai', 'co-dien', 24900000, 231, false],
  ['TISSOT T-Classic Le Locle', 'TISSOT', 'nam', 'da', 'sang-trong', 18500000, 92, false],
  ['TISSOT Lovely Square Ladies', 'TISSOT', 'nu', 'kim-loai', 'sang-trong', 15900000, 68, false],
  ['TISSOT Seastar Chronograph', 'TISSOT', 'nam', 'kim-loai', 'the-thao', 21500000, 61, false],
  ['FOSSIL Grant Chronograph', 'FOSSIL', 'nam', 'da', 'co-dien', 3900000, 298, false],
  ['FOSSIL Jacqueline Ladies', 'FOSSIL', 'nu', 'kim-loai', 'sang-trong', 4200000, 214, false],
  ['FOSSIL Gen 6 Smartwatch', 'FOSSIL', 'unisex', 'cao-su', 'smartwatch', 5900000, 189, false],
  ['FOSSIL Nate Leather Casual', 'FOSSIL', 'nam', 'da', 'the-thao', 3400000, 167, false],
  ['MVMT Classic Blacktop', 'MVMT', 'nam', 'kim-loai', 'the-thao', 2900000, 356, false],
  ['MVMT Bloom Ladies Rose Gold', 'MVMT', 'nu', 'da', 'sang-trong', 3200000, 245, false],
  ['MVMT Voyager GMT', 'MVMT', 'nam', 'kim-loai', 'the-thao', 4500000, 108, false],
  ['TIMEX Weekender Chrono', 'TIMEX', 'unisex', 'vai', 'the-thao', 1590000, 421, false],
  ['TIMEX Marlin Automatic Reissue', 'TIMEX', 'nam', 'da', 'co-dien', 4900000, 133, false],
  ['TIMEX Fairfield Ladies', 'TIMEX', 'nu', 'kim-loai', 'co-dien', 2200000, 187, false],
  ['LONGINES Master Collection', 'LONGINES', 'nam', 'da', 'sang-trong', 42000000, 34, true],
  ['LONGINES DolceVita Ladies', 'LONGINES', 'nu', 'kim-loai', 'sang-trong', 38500000, 29, true],
  ['LONGINES Conquest Chronograph', 'LONGINES', 'nam', 'kim-loai', 'the-thao', 45000000, 22, true],
  ['DANIEL WELLINGTON Classic Petite', 'DANIEL WELLINGTON', 'nu', 'da', 'co-dien', 2490000, 389, false],
  ['DANIEL WELLINGTON Iconic Link', 'DANIEL WELLINGTON', 'nu', 'kim-loai', 'sang-trong', 3600000, 276, false],
  ['DANIEL WELLINGTON Classic Cornwall', 'DANIEL WELLINGTON', 'nam', 'da', 'co-dien', 2690000, 198, false],
  ['CASIO Baby-G Shock Resistant', 'CASIO', 'nu', 'cao-su', 'the-thao', 2100000, 312, false],
  ['SEIKO Astron GPS Solar', 'SEIKO', 'nam', 'kim-loai', 'sang-trong', 32000000, 18, true],
  ['CITIZEN CZ Smart Wearable', 'CITIZEN', 'unisex', 'cao-su', 'smartwatch', 6900000, 96, false],
  ['ORIENT Kamasu Automatic Diver', 'ORIENT', 'nam', 'kim-loai', 'the-thao', 7900000, 71, false],
  ['TISSOT Everytime Ladies Slim', 'TISSOT', 'nu', 'da', 'co-dien', 12500000, 47, false],
  ['FOSSIL Townsman Automatic', 'FOSSIL', 'nam', 'da', 'sang-trong', 5400000, 84, false],
  ['MVMT Chrono Steel Sport', 'MVMT', 'nam', 'kim-loai', 'the-thao', 3700000, 143, false],
  ['TIMEX Q Reissue Retro', 'TIMEX', 'unisex', 'kim-loai', 'co-dien', 3200000, 92, false]
];

const PRODUCTS = RAW_WATCHES.map((row, i) => {
  const [name, brand, category, material, style, price, sold, limited] = row;
  const id = i + 1;
  const slug = dhSlugify(`${name}-${id}`);
  const onSale = i % 3 === 1; // ~1/3 sản phẩm giảm giá
  const salePrice = onSale ? Math.round(price * 0.85 / 10000) * 10000 : null;
  const themes = [category];
  if (sold >= 300) themes.push('ban-chay');
  if (limited) themes.push('gioi-han');
  if (i % 5 === 0) themes.push('hang-moi');
  let badge = null;
  if (limited) badge = 'hot';
  else if (onSale) badge = 'sale';
  else if (i % 5 === 0) badge = 'new';
  const rating = Math.round((4 + ((i * 7) % 10) / 10) * 10) / 10; // 4.0 - 4.9
  return {
    id, name, slug, brand, category, material, style,
    price, salePrice,
    theme: themes,
    rating,
    sold,
    stock: i % 17 !== 0, // gần như luôn còn hàng, 1 vài hết hàng
    limited,
    badge,
    warranty: limited ? '5 năm chính hãng' : '2 năm chính hãng',
    movement: style === 'smartwatch' ? 'Smart OS' : (style === 'co-dien' || style === 'sang-trong') && i % 2 === 0 ? 'Automatic (Cơ tự động)' : 'Quartz (Pin)',
    waterResist: style === 'the-thao' ? '100-200m' : style === 'smartwatch' ? '50m' : '30-50m',
    diameter: 34 + (i % 8), // 34-41mm
    description: `${name} — thiết kế ${STYLE_LABELS[style].toLowerCase()} dành cho ${CATEGORY_LABELS[category].toLowerCase()}, dây ${MATERIAL_LABELS[material].toLowerCase()}, bảo hành chính hãng ${limited ? '5 năm' : '2 năm'} tại MERIDIAN.`,
    images: [dhImg(id * 3, 900), dhImg(id * 3 + 1, 900), dhImg(id * 3 + 2, 900)],
    image: dhImg(id * 3, 700)
  };
});

/* Portrait pool cho testimonials/đội ngũ */
const PORTRAIT_IDS = [
  '1580489944761-15a19d654956', '1573496359142-b8d87734a5a2', '1494790108377-be9c29b29330',
  '1573497019940-1c28c88b4f3e', '1484863137850-59afcfe05386', '1500648767791-00dcc994a43e',
  '1581065178047-8ee15951ede6', '1592275772614-ec71b19e326f', '1630939687530-241d630735df',
  '1507003211169-0a1dd7228f2d', '1607990283143-e81e7a2c9349', '1589386417686-0d34b5903d23',
  '1562337404-3044c84ac061', '1662850886700-4ec19bd30d11', '1758691737605-69a0e78bd193'
];
function dhPortrait(idx, w) {
  const id = PORTRAIT_IDS[idx % PORTRAIT_IDS.length];
  return `https://images.unsplash.com/photo-${id}?w=${w || 300}&auto=format&fit=crop&q=80`;
}

/* Store/boutique pool cho trang Giới thiệu */
const STORE_IDS = [
  '1622704776938-bed6cd156e04', '1580582202907-d01fd0bd4c87', '1660860547079-fd4845880af9',
  '1744369382892-eb5b6a2fdc6f', '1685489807405-fdffb06aef2c', '1604306354577-68136efdf03b',
  '1583419960327-87f038955e4a', '1724986481830-4e7b781c2bd1', '1576723417715-6b408c988c23',
  '1679590988891-2357406aca80', '1650389236412-e7413cbcf2fe', '1685489807290-199befdb1f13',
  '1557176595-c6fce4b961e7', '1668365179846-3333fe14f552', '1521120098171-0400b4ec1319',
  '1786501135828-6927a8612593', '1778339517444-8deebfc0bf00'
];
function dhStore(idx, w) {
  const id = STORE_IDS[idx % STORE_IDS.length];
  return `https://images.unsplash.com/photo-${id}?w=${w || 800}&auto=format&fit=crop&q=80`;
}

function dhFormatVND(n) {
  return n.toLocaleString('vi-VN') + '₫';
}

function dhFindBySlug(slug) {
  return PRODUCTS.find(p => p.slug === slug);
}

function dhGetRelated(product, count) {
  count = count || 4;
  const pool = PRODUCTS.filter(p => p.id !== product.id && (p.category === product.category || p.style === product.style));
  const result = [];
  for (let i = 0; i < pool.length && result.length < count; i++) {
    result.push(pool[(product.id + i) % pool.length]);
  }
  // Đảm bảo không trùng
  return [...new Set(result)].slice(0, count);
}
