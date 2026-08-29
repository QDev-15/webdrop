/* ══════════════════════════════════════════════════════════════════
   PET HAUS — shop-thu-cung — products-data.js
   Dữ liệu mock 42 sản phẩm thú cưng, sinh từ mảng RAW qua map()
   để đảm bảo nhất quán slug/ảnh/giá — không hardcode trùng lặp.
   Toàn bộ ảnh là URL Unsplash thật đã verify HTTP 200 (xem báo cáo).
   ══════════════════════════════════════════════════════════════════ */

const CATEGORIES = [
  { slug: 'thuc-an',    label: 'Thức ăn' },
  { slug: 'phu-kien',   label: 'Phụ kiện' },
  { slug: 'do-choi',    label: 'Đồ chơi' },
  { slug: 'chuong-nha', label: 'Chuồng & Nhà ở' },
  { slug: 'cham-soc',   label: 'Chăm sóc & Vệ sinh' },
];

const PET_TYPES = [
  { slug: 'cho',     label: 'Chó' },
  { slug: 'meo',     label: 'Mèo' },
  { slug: 'ca-hai',  label: 'Chó & Mèo' },
];

const BRANDS = ['PawFresh', 'PetKing', 'MeowMart', "Buddy's Choice", 'VetCare Pro', 'FurNest', 'PurePaw', 'Happy Tail'];

const SIZE_OPTIONS = ['S', 'M', 'L'];

/* ── Ảnh Unsplash đã verify HTTP 200 qua curl trước khi đưa vào ── */
const IMG_DOG = [
  '1583337130417-3346a1be7dee', '1543466835-00a7907e9de1', '1552053831-71594a27632d',
  '1601758228041-f3b2795255f1', '1587300003388-59208cc962cb', '1560807707-8cc77767d783',
  '1548199973-03cce0bbc87b', '1618335829737-2228915674e0',
];
const IMG_CAT = [
  '1514888286974-6c03e2ca1dba', '1533738363-b7f9aef128ce', '1495360010541-f48722b34f7d',
  '1601979031925-424e53b6caaa', '1526336024174-e58f5cdd8e13', '1592194996308-7b43878e84a6',
  '1571566882372-1598d88abd90', '1548247416-ec66f4900b2e',
];
const IMG_GENERIC = [
  '1450778869180-41d0601e046e', '1596492784531-6e6eb5ea9993', '1583511655857-d19b40a7a54e',
  '1594149929911-78975a43d4f5', '1516371535707-512a1e83bb9a', '1583512603805-3cc6b41f3edb',
  '1591946614720-90a587da4a36', '1425082661705-1834bfd09dca', '1560743641-3914f2c45636',
  '1548681528-6a5c45b66b42', '1444212477490-ca407925329e', '1541364983171-a8ba01e95cfc',
  '1587764379873-97837921fd44', '1598133894008-61f7fdb8cc3a', '1548767797-d8c844163c4c',
  '1517423440428-a5a00ad493e8', '1541599468348-e96984315921', '1583468982228-19f19164aee2',
  '1516734212186-a967f81ad0d7', '1567016432779-094069958ea5', '1598214886806-c87b84b7078b',
  '1573497019940-1c28c88b4f3e', '1543852786-1cf6624b9987', '1544568100-847a948585b9',
  '1546975490-e8b92a360b24', '1601758003122-53c40e686a19', '1573865526739-10659fec78a5',
  '1620331311520-246422fd82f9', '1500462918059-b1a0cb512f1d',
];

function pickImage(petType, idx) {
  const pool = petType === 'cho' ? IMG_DOG : petType === 'meo' ? IMG_CAT : IMG_GENERIC;
  const id = pool[idx % pool.length];
  return `https://images.unsplash.com/photo-${id}?w=700&auto=format&fit=crop&q=80`;
}

function slugify(str) {
  return str.toLowerCase()
    .normalize('NFD').replace(/[̀-ͯ]/g, '')
    .replace(/đ/g, 'd').replace(/Đ/g, 'D')
    .replace(/[^a-z0-9\s-]/g, '').trim()
    .replace(/\s+/g, '-').replace(/-+/g, '-');
}

function formatVND(n) {
  return n.toLocaleString('vi-VN') + '₫';
}

/* [tên, category, petType, brandIdx, giá, cóGiảmGiá, sizes[], rating, sold, badge] */
const RAW = [
  // ── Thức ăn (10) ──
  ['Hạt khô cho chó trưởng thành vị gà 3kg', 'thuc-an', 'cho', 0, 285000, false, [], 4.8, 412, 'hot'],
  ['Pate mèo con vị cá ngừ 400g', 'thuc-an', 'meo', 2, 42000, true, [], 4.6, 530, 'sale'],
  ['Hạt khô mèo trưởng thành vị cá hồi 2kg', 'thuc-an', 'meo', 0, 255000, false, [], 4.7, 298, null],
  ['Thức ăn ướt cho chó vị bò 400g', 'thuc-an', 'cho', 3, 38000, false, [], 4.5, 187, 'new'],
  ['Hạt khô chó con vị gà & sữa 1.5kg', 'thuc-an', 'cho', 0, 175000, false, [], 4.9, 264, null],
  ['Snack thưởng cho chó vị phô mai 100g', 'thuc-an', 'cho', 4, 35000, true, [], 4.4, 610, 'sale'],
  ['Pate cao cấp cho mèo vị gà tây 200g', 'thuc-an', 'meo', 2, 48000, false, [], 4.7, 145, 'new'],
  ['Hạt khô mèo kiểm soát cân nặng 2kg', 'thuc-an', 'meo', 0, 268000, false, [], 4.6, 92, null],
  ['Thức ăn hạt cho chó giống nhỏ 2kg', 'thuc-an', 'cho', 4, 198000, false, [], 4.5, 176, null],
  ['Súp thưởng cho mèo vị sò điệp 60g', 'thuc-an', 'meo', 2, 22000, false, [], 4.8, 341, 'hot'],

  // ── Phụ kiện (10) ──
  ['Dây dắt chó phản quang cao cấp', 'phu-kien', 'cho', 1, 129000, false, ['S', 'M', 'L'], 4.6, 203, null],
  ['Vòng cổ da thật cho chó', 'phu-kien', 'cho', 1, 159000, true, ['S', 'M', 'L'], 4.7, 167, 'sale'],
  ['Áo len giữ ấm cho chó mùa đông', 'phu-kien', 'cho', 5, 145000, false, ['S', 'M', 'L'], 4.5, 289, 'new'],
  ['Bát ăn inox chống trượt cho thú cưng', 'phu-kien', 'ca-hai', 6, 89000, false, ['S', 'M'], 4.8, 455, 'hot'],
  ['Balo vận chuyển mèo thoáng khí', 'phu-kien', 'meo', 5, 420000, false, ['M', 'L'], 4.6, 88, null],
  ['Đai yếm ăn chống bẩn cho chó', 'phu-kien', 'cho', 1, 65000, false, ['S', 'M', 'L'], 4.3, 120, null],
  ['Rọ mõm êm ái cho chó', 'phu-kien', 'cho', 6, 95000, true, ['S', 'M', 'L'], 4.4, 76, 'sale'],
  ['Túi đựng phân vệ sinh cho chó (cuộn 15 túi)', 'phu-kien', 'cho', 7, 28000, false, [], 4.7, 512, null],
  ['Nơ cổ thời trang cho mèo (set 5 cái)', 'phu-kien', 'meo', 5, 49000, false, ['S'], 4.5, 198, 'new'],
  ['Áo mưa chống thấm cho chó', 'phu-kien', 'cho', 1, 119000, false, ['S', 'M', 'L'], 4.4, 64, null],

  // ── Đồ chơi (8) ──
  ['Bóng cao su phát nhạc cho chó', 'do-choi', 'cho', 7, 79000, false, [], 4.6, 377, null],
  ['Cần câu lông vũ cho mèo', 'do-choi', 'meo', 3, 55000, true, [], 4.8, 624, 'sale'],
  ['Chuột nhồi bông có catnip (set 3 cái)', 'do-choi', 'meo', 3, 45000, false, [], 4.7, 289, null],
  ['Đồ chơi gặm nhấm hình xương cao su', 'do-choi', 'cho', 7, 69000, false, [], 4.5, 156, 'new'],
  ['Cầu trèo kết hợp trụ cào cho mèo', 'do-choi', 'meo', 5, 890000, false, [], 4.9, 74, 'hot'],
  ['Dây kéo co vải dù cho chó', 'do-choi', 'cho', 7, 59000, false, [], 4.4, 203, null],
  ['Đĩa ném frisbee mềm cho chó', 'do-choi', 'cho', 4, 45000, false, [], 4.3, 98, null],
  ['Bóng lăn phát thức ăn thông minh', 'do-choi', 'ca-hai', 6, 135000, true, [], 4.7, 167, 'sale'],

  // ── Chuồng & Nhà ở (8) ──
  ['Chuồng sắt gấp gọn cho chó', 'chuong-nha', 'cho', 1, 890000, false, ['M', 'L'], 4.6, 142, null],
  ['Nệm ấm áp cho chó mèo mùa đông', 'chuong-nha', 'ca-hai', 6, 225000, false, ['S', 'M', 'L'], 4.7, 208, 'new'],
  ['Nhà gỗ hai tầng cho mèo', 'chuong-nha', 'meo', 5, 1250000, false, ['L'], 4.8, 56, 'hot'],
  ['Lồng vận chuyển nhựa cho thú cưng', 'chuong-nha', 'ca-hai', 6, 385000, true, ['M', 'L'], 4.5, 133, 'sale'],
  ['Giường võng treo cho mèo', 'chuong-nha', 'meo', 3, 165000, false, ['S', 'M'], 4.6, 187, null],
  ['Chuồng lưới quây sân chơi cho chó con', 'chuong-nha', 'cho', 1, 650000, false, ['M'], 4.4, 64, null],
  ['Đệm sofa mini cho thú cưng', 'chuong-nha', 'ca-hai', 5, 295000, false, ['S', 'M', 'L'], 4.7, 229, null],
  ['Lều vải gấp gọn cho mèo', 'chuong-nha', 'meo', 3, 215000, false, ['S', 'M'], 4.5, 95, 'new'],

  // ── Chăm sóc & Vệ sinh (6) ──
  ['Sữa tắm dịu nhẹ cho chó lông dài', 'cham-soc', 'cho', 4, 89000, false, [], 4.6, 321, null],
  ['Cát vệ sinh mèo khử mùi vón cục 10kg', 'cham-soc', 'meo', 2, 175000, false, [], 4.8, 489, 'hot'],
  ['Vitamin tổng hợp hỗ trợ tiêu hóa', 'cham-soc', 'ca-hai', 4, 145000, true, [], 4.5, 142, 'sale'],
  ['Lược chải lông chống rụng', 'cham-soc', 'ca-hai', 6, 69000, false, [], 4.7, 276, null],
  ['Nước súc miệng khử mùi cho chó', 'cham-soc', 'cho', 4, 55000, false, [], 4.4, 98, 'new'],
  ['Kem dưỡng ẩm mũi & chân cho thú cưng', 'cham-soc', 'ca-hai', 4, 79000, false, [], 4.6, 113, null],
];

const PRODUCTS = RAW.map((r, i) => {
  const [name, category, petType, brandIdx, price, hasSale, size, rating, sold, badge] = r;
  const id = i + 1;
  return {
    id,
    name,
    slug: slugify(name) + '-' + id,
    price,
    salePrice: hasSale ? Math.round(price * 0.8 / 1000) * 1000 : null,
    category,
    petType,
    brand: BRANDS[brandIdx],
    size,
    rating,
    sold,
    stock: true,
    badge,
    image: pickImage(petType, i),
    gallery: [pickImage(petType, i), pickImage(petType, i + 7), pickImage(petType === 'cho' ? 'meo' : 'cho', i + 3)],
  };
});
