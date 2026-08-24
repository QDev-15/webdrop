/* ══════════════════════════════════════════════════════════
   NHÀ ĐẤT VIỆT — properties-data.js
   Nguồn dữ liệu duy nhất cho toàn bộ site (catalog + trang chủ + chi tiết).
   Không filter DOM trực tiếp — mọi trang render lại từ mảng PROPERTIES.
   ══════════════════════════════════════════════════════════ */

/* ── Danh mục khu vực (TP.HCM) — toạ độ trung tâm gần đúng từng quận/huyện ── */
const DISTRICTS = [
  { code: 'quan-1',      name: 'Quận 1',        lat: 10.7756, lng: 106.7019 },
  { code: 'quan-3',      name: 'Quận 3',        lat: 10.7843, lng: 106.6907 },
  { code: 'quan-4',      name: 'Quận 4',        lat: 10.7590, lng: 106.7020 },
  { code: 'quan-7',      name: 'Quận 7',        lat: 10.7326, lng: 106.7218 },
  { code: 'quan-8',      name: 'Quận 8',        lat: 10.7411, lng: 106.6558 },
  { code: 'quan-10',     name: 'Quận 10',       lat: 10.7729, lng: 106.6674 },
  { code: 'quan-12',     name: 'Quận 12',       lat: 10.8672, lng: 106.6413 },
  { code: 'binh-thanh',  name: 'Bình Thạnh',    lat: 10.8106, lng: 106.7091 },
  { code: 'phu-nhuan',   name: 'Phú Nhuận',     lat: 10.7991, lng: 106.6805 },
  { code: 'tan-binh',    name: 'Tân Bình',      lat: 10.8014, lng: 106.6528 },
  { code: 'go-vap',      name: 'Gò Vấp',        lat: 10.8386, lng: 106.6653 },
  { code: 'nha-be',      name: 'Nhà Bè',        lat: 10.6959, lng: 106.7378 },
  { code: 'thu-duc',     name: 'TP. Thủ Đức',   lat: 10.8494, lng: 106.7537 },
  { code: 'binh-chanh',  name: 'Bình Chánh',    lat: 10.6957, lng: 106.5954 },
  { code: 'cu-chi',      name: 'Củ Chi',        lat: 10.9738, lng: 106.4900 }
];

function districtByCode(code) { return DISTRICTS.find(d => d.code === code) || { name: code, lat: 10.7756, lng: 106.7019 }; }
function districtLabel(code) { return districtByCode(code).name; }

/* ── Nhãn hiển thị ── */
const PROPERTY_TYPE_LABELS = {
  'chung-cu': 'Căn hộ chung cư',
  'nha-pho': 'Nhà phố',
  'dat-nen': 'Đất nền',
  'biet-thu': 'Biệt thự',
  'shophouse': 'Shophouse',
  'can-ho-dich-vu': 'Căn hộ dịch vụ'
};

const DIRECTION_LABELS = {
  'dong': 'Đông', 'tay': 'Tây', 'nam': 'Nam', 'bac': 'Bắc',
  'dong-nam': 'Đông Nam', 'dong-bac': 'Đông Bắc', 'tay-nam': 'Tây Nam', 'tay-bac': 'Tây Bắc'
};

const LEGAL_LABELS = {
  'so-do': 'Sổ đỏ', 'so-hong': 'Sổ hồng',
  'hop-dong-mua-ban': 'Hợp đồng mua bán', 'dang-cho-so': 'Đang chờ sổ'
};

const FURNISHING_LABELS = {
  'day-du': 'Đầy đủ nội thất', 'co-ban': 'Nội thất cơ bản', 'tho': 'Nhà thô / đất trống'
};

const BADGE_LABELS = {
  'moi': 'Mới đăng', 'hot': 'Hot', 'da-ban': 'Đã giao dịch', 'dang-giao-dich': 'Đang giao dịch'
};

/* ── Đội ngũ môi giới ── */
const AGENTS = [
  { name: 'Nguyễn Minh Khôi', title: 'Trưởng phòng kinh doanh', phone: '0909 123 456', zalo: '0909123456',
    avatar: 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=300&auto=format&fit=crop&q=80' },
  { name: 'Trần Thị Ngọc Hân', title: 'Chuyên viên tư vấn cấp cao', phone: '0918 234 567', zalo: '0918234567',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=300&auto=format&fit=crop&q=80' },
  { name: 'Lê Hoàng Phúc', title: 'Chuyên viên tư vấn', phone: '0933 345 678', zalo: '0933345678',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=300&auto=format&fit=crop&q=80' },
  { name: 'Phạm Thu Trang', title: 'Chuyên viên tư vấn', phone: '0977 456 789', zalo: '0977456789',
    avatar: 'https://images.unsplash.com/photo-1502764613149-7f1d229e230f?w=300&auto=format&fit=crop&q=80' },
  { name: 'Đỗ Anh Tuấn', title: 'Chuyên viên tư vấn', phone: '0966 567 890', zalo: '0966567890',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=300&auto=format&fit=crop&q=80' },
  { name: 'Vũ Thị Mai Anh', title: 'Chuyên viên tư vấn', phone: '0988 678 901', zalo: '0988678901',
    avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=300&auto=format&fit=crop&q=80' }
];

/* ── Kho ảnh Unsplash đã verify HTTP 200 (nhà/căn hộ/nội thất) ── */
const PROPERTY_IMAGE_POOL = [
  '1560448204-e02f11c3d0e2','1568605114967-8130f3a36994','1570129477492-45c003edd2be',
  '1512917774080-9991f1c4c750','1600585154340-be6161a56a0c','1600596542815-ffad4c1539a9',
  '1600607687939-ce8a6c25118c','1600566753086-00f18fb6b3ea','1600585152220-90363fe7e115',
  '1613977257363-707ba9348227','1600047509807-ba8f99d2cdde','1600210492486-724fe5c67fb0',
  '1600585154363-67eb9e2e2099','1600566753190-17f0baa2a6c3','1600607688969-a5bfcd646154',
  '1580587771525-78b9dba3b914','1583608205776-bfd35f0d9f83','1613490493576-7fde63acd811',
  '1502005229762-cf1b2da7c5d6','1449844908441-8829872d2607','1522708323590-d24dbb6b0267',
  '1484154218962-a197022b5858','1523192193543-6e7296d960e4','1505873242700-f289a29e1e0f',
  '1580216643062-cf460548a66a','1554995207-c18c203602cb','1616137466211-f939a420be84',
  '1600210491892-03d54c0aaf87','1600210492493-0946911123ea','1592595896616-c37162298647',
  '1560184897-ae75f418493e','1600585152915-d208bec867a1','1600607687920-4e2a09cf159d',
  '1600566752355-35792bedcfea','1600585154526-990dced4db0d','1600585154084-4e5fe7c39198',
  '1560448204-603b3fc33ddc','1615874959474-d609969a20ed','1615529182904-14819c35db37',
  '1615873968403-89e068629265','1600880292203-757bb62b4baf','1489171078254-c3365d6e359f',
  '1544984243-ec57ea16fe25','1544198365-f5d60b6d8190','1521791136064-7986c2920216',
  '1524758631624-e2822e304c36','1502672260266-1c1ef2d93688','1494203484021-3c454daf695d',
  '1509644851169-2acc08aa25b5','1600880292089-90a7e086ee0c','1567016376408-0226e4d0c1ea',
  '1567016432779-094069958ea5','1615875605825-5eb9bb5d52ac','1616486338812-3dadae4b4ace',
  '1616594039964-ae9021a400a0','1560518883-ce09059eeffa'
];

function imgUrl(id, w) { return `https://images.unsplash.com/photo-${id}?w=${w || 1200}&auto=format&fit=crop&q=80`; }

function pickImages(seed, count) {
  const pool = PROPERTY_IMAGE_POOL;
  const start = (seed * 7) % pool.length;
  const out = [];
  for (let k = 0; k < count; k++) out.push(imgUrl(pool[(start + k) % pool.length]));
  return out;
}

/* ── Helper format ── */
function formatPrice(value, unit) {
  if (unit === 'tỷ') return (value / 1e9).toLocaleString('vi-VN', { maximumFractionDigits: 2 }) + ' tỷ';
  if (unit === 'triệu') return Math.round(value / 1e6).toLocaleString('vi-VN') + ' triệu';
  if (unit === 'triệu/tháng') return Math.round(value / 1e6).toLocaleString('vi-VN') + ' triệu/tháng';
  if (unit === 'đ/tháng') return Math.round(value).toLocaleString('vi-VN') + ' đ/tháng';
  return value.toLocaleString('vi-VN') + ' đ';
}
function formatVND(n) { return Math.round(n).toLocaleString('vi-VN'); }
function formatDateVN(iso) { const [y, m, d] = iso.split('-'); return `${d}/${m}/${y}`; }
function slugify(str) {
  return str.toString().toLowerCase()
    .replace(/đ/g, 'd').replace(/Đ/g, 'd')
    .normalize('NFD').replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim().replace(/\s+/g, '-').replace(/-+/g, '-');
}
function nearbyAmenities(districtName) {
  return [
    `Chợ dân sinh khu vực ${districtName} — khoảng 500m`,
    `Trường tiểu học / THCS lân cận — khoảng 700m`,
    `Siêu thị / cửa hàng tiện lợi — khoảng 900m`,
    `Bệnh viện, phòng khám khu vực — khoảng 1.2km`,
    `Tuyến xe buýt công cộng — khoảng 300m`
  ];
}

/* ── Dữ liệu gốc 42 tin đăng — nội dung thật, đa dạng loại hình/khu vực/nhu cầu ──
   [title, listingType, propertyType, price, priceUnit, area, bedrooms, bathrooms,
    direction, legalStatus, furnishing, district, street, badge, postedDate, agentIdx, description, features[]] */
const RAW_LISTINGS = [
  ['Căn hộ 2PN The Sun Avenue view sông Sài Gòn','ban','chung-cu',4300000000,'tỷ',72,2,2,'dong-nam','so-hong','day-du','thu-duc','Mai Chí Thọ','hot','2026-08-05',0,
    'Căn hộ tầng 15 dự án The Sun Avenue, view trọn sông Sài Gòn và Quận 1, ban công rộng đón gió mát quanh năm. Nội thất cao cấp đã setup sẵn, có thể dọn vào ở ngay. Cư dân được sử dụng hồ bơi, gym, khu BBQ và an ninh 24/7.',
    ['View sông trực diện','Hồ bơi & gym nội khu','An ninh 24/7','Gần Metro số 1']],
  ['Chung cư 3PN Vinhomes Central Park, full nội thất','ban','chung-cu',7800000000,'tỷ',108,3,2,'tay-nam','so-hong','day-du','binh-thanh','Nguyễn Hữu Cảnh','moi','2026-08-15',1,
    'Căn hộ 3 phòng ngủ tại Landmark 81, nội thất nhập khẩu đồng bộ, sàn gỗ ấm cúng. Không gian sống xanh với công viên trung tâm rộng 14ha ngay dưới chân tòa nhà. Phù hợp gia đình có trẻ nhỏ, gần trường quốc tế và trung tâm thương mại Vincom.',
    ['Công viên trung tâm 14ha','Trường quốc tế trong khuôn viên','Bãi đỗ xe hầm','View Landmark 81']],
  ['Cho thuê căn hộ 1PN Masteri Thảo Điền, đầy đủ nội thất','cho-thue','chung-cu',12000000,'triệu/tháng',52,1,1,'dong','so-hong','day-du','thu-duc','Xa lộ Hà Nội',null,'2026-07-20',2,
    'Căn hộ 1 phòng ngủ setup nội thất châu Âu, bếp riêng, máy giặt máy sấy đầy đủ. Khu Thảo Điền gần nhiều trường quốc tế, nhà hàng, phù hợp chuyên gia nước ngoài. Hợp đồng thuê tối thiểu 6 tháng, hồ sơ pháp lý minh bạch.',
    ['Gần trường quốc tế','Bếp + máy giặt riêng','Hồ bơi vô cực','Cho thuê dài hạn']],
  ['Căn hộ 2PN Sunrise City, hướng Đông Nam thoáng mát','ban','chung-cu',3900000000,'tỷ',78,2,2,'dong-nam','so-hong','co-ban','quan-7','Nguyễn Hữu Thọ',null,'2026-06-28',3,
    'Căn hộ tầng trung, hướng Đông Nam đón gió tự nhiên, không bị nắng chiều gắt. Khu Sunrise City nội khu có hồ bơi, siêu thị, trường mầm non ngay tầng trệt. Phù hợp gia đình trẻ tại khu Nam Sài Gòn, gần Phú Mỹ Hưng.',
    ['Gần Phú Mỹ Hưng','Trường mầm non nội khu','Siêu thị tầng trệt','Sổ hồng riêng từng căn']],
  ['Cho thuê căn hộ 2PN Vinhomes Grand Park giá tốt','cho-thue','chung-cu',9000000,'triệu/tháng',65,2,2,'tay','so-hong','day-du','thu-duc','Nguyễn Xiển','moi','2026-08-12',4,
    'Căn hộ mới bàn giao, nội thất cơ bản đầy đủ tủ bếp, điều hòa, nóng lạnh. Đại đô thị Vinhomes Grand Park có công viên, trường học, bệnh viện ngay trong nội khu. Thích hợp gia đình trẻ hoặc người đi làm khu vực phía Đông thành phố.',
    ['Đại đô thị khép kín','Công viên & hồ cảnh quan','Trường học liên cấp','Giá thuê tốt']],
  ['Bán căn hộ Studio Millennium, trung tâm Quận 4','ban','chung-cu',3100000000,'tỷ',45,1,1,'bac','so-hong','day-du','quan-4','Bến Vân Đồn','da-ban','2026-07-02',5,
    'Căn hộ Studio thiết kế thông minh, tối ưu diện tích sử dụng, view thành phố về đêm lung linh. Chỉ 5 phút di chuyển sang Quận 1, thuận tiện cho người độc thân hoặc đầu tư cho thuê. Cư dân văn minh, quản lý chuyên nghiệp.',
    ['Cách Quận 1 5 phút','Thiết kế studio tối ưu','View thành phố','Tiềm năng cho thuê tốt']],
  ['Chung cư 3PN Botanica Premier, Tân Bình','ban','chung-cu',5600000000,'tỷ',95,3,2,'dong-bac','so-hong','day-du','tan-binh','Hồng Hà','hot','2026-08-01',0,
    'Căn hộ 3 phòng ngủ gần sân bay Tân Sơn Nhất, thiết kế ban công rộng trồng cây xanh. Khu Botanica Premier an ninh khép kín, có khu vui chơi trẻ em và phòng gym riêng biệt từng block. Phù hợp gia đình đông người cần không gian rộng rãi.',
    ['Gần sân bay Tân Sơn Nhất','Ban công trồng cây','Khu vui chơi trẻ em','Diện tích rộng 95m²']],
  ['Cho thuê căn hộ 1PN De Capella, Thủ Đức','cho-thue','chung-cu',8500000,'triệu/tháng',48,1,1,'nam','so-hong','co-ban','thu-duc','Song Hành',null,'2026-07-25',1,
    'Căn hộ mới 100%, gần Đại học Quốc gia và khu công nghệ cao, phù hợp sinh viên hoặc kỹ sư trẻ. Nội thất cơ bản gồm tủ bếp, điều hòa, có thể tự trang bị thêm theo nhu cầu. Tuyến Metro số 1 chỉ cách 5 phút đi bộ.',
    ['Gần Metro số 1','Gần khu công nghệ cao','Nội thất cơ bản','Giá thuê sinh viên/kỹ sư']],
  ['Bán căn hộ 2PN Celadon City, gần Gò Vấp','ban','chung-cu',3400000000,'tỷ',70,2,2,'tay-bac','so-hong','day-du','go-vap','Tân Thới Hiệp','da-ban','2026-06-15',2,
    'Căn hộ trong khu đô thị Celadon City rộng hơn 16.000m² mảng xanh, hồ điều hòa lớn. Căn góc 2 mặt thoáng, không bị chắn tầm nhìn bởi tòa nhà đối diện. Tiện ích nội khu đầy đủ trường học, gần Aeon Mall Tân Phú.',
    ['Gần Aeon Mall Tân Phú','Căn góc 2 mặt thoáng','Mảng xanh rộng','Hồ điều hòa lớn']],
  ['Cho thuê căn hộ 3PN Hà Đô Centrosa, Quận 10','cho-thue','chung-cu',16000000,'triệu/tháng',98,3,2,'dong-nam','so-hong','day-du','quan-10','Ba Tháng Hai','moi','2026-08-18',3,
    'Căn hộ cao cấp trung tâm Quận 10, gần Kỳ Hòa và các bệnh viện lớn của thành phố. Nội thất gỗ tự nhiên, bếp mở hiện đại, phù hợp gia đình có con đi học các trường lân cận. Bảo vệ 24/7, có hầm giữ xe ô tô riêng.',
    ['Gần bệnh viện trung tâm','Nội thất gỗ tự nhiên','Hầm giữ xe ô tô','Bảo vệ 24/7']],

  ['Nhà phố 1 trệt 3 lầu mặt tiền Phan Xích Long','ban','nha-pho',15500000000,'tỷ',80,4,4,'dong-nam','so-hong','co-ban','phu-nhuan','Phan Xích Long','hot','2026-08-08',4,
    'Nhà mặt tiền đường Phan Xích Long sầm uất, kinh doanh buôn bán thuận lợi, gần chợ và nhiều quán cà phê nổi tiếng. Nhà xây kiên cố 1 trệt 3 lầu, có thang máy, phù hợp vừa ở vừa cho thuê mặt bằng tầng trệt. Hẻm xe hơi vào tận nhà.',
    ['Mặt tiền kinh doanh','Có thang máy','Hẻm xe hơi','Sổ hồng riêng']],
  ['Nhà phố hẻm xe hơi đường Nguyễn Văn Trỗi','ban','nha-pho',8900000000,'tỷ',64,3,3,'tay','so-hong','tho','phu-nhuan','Nguyễn Văn Trỗi',null,'2026-07-10',5,
    'Nhà thô đang xây dở, chủ nhà cần bán gấp để chuyển công tác, khách mua có thể tự hoàn thiện theo ý thích. Hẻm rộng 6m xe hơi tránh nhau thoải mái, cách trục đường Nguyễn Văn Trỗi 50m. Khu dân cư an ninh, gần trường tiểu học.',
    ['Hẻm 6m xe hơi tránh nhau','Gần trường tiểu học','Đang xây, tự hoàn thiện','Giá thương lượng']],
  ['Nhà phố mới xây đường Lê Văn Lương, Nhà Bè','ban','nha-pho',6200000000,'tỷ',90,4,3,'nam','so-hong','day-du','nha-be','Lê Văn Lương','moi','2026-08-14',0,
    'Nhà mới xây hoàn thiện 100%, nội thất cơ bản đã lắp đặt sẵn tủ bếp và đèn trang trí. Khu vực Nhà Bè đang phát triển hạ tầng nhanh, gần cầu Phú Xuân kết nối trực tiếp Quận 7. Phù hợp gia đình trẻ muốn sở hữu nhà riêng.',
    ['Nhà mới 100%','Gần cầu Phú Xuân','Giá vừa túi tiền','Kết nối nhanh Quận 7']],
  ['Nhà phố 2 mặt tiền hẻm góc Gò Vấp','ban','nha-pho',7500000000,'tỷ',72,3,3,'dong-bac','so-hong','co-ban','go-vap','Nguyễn Oanh',null,'2026-06-30',1,
    'Căn nhà 2 mặt tiền hẻm thông thoáng, ánh sáng tự nhiên tràn vào mọi phòng. Vị trí gần chợ Gò Vấp và bệnh viện quận, tiện di chuyển vào trung tâm qua đường Nguyễn Kiệm. Có thể cải tạo thành nhà cho thuê phòng trọ.',
    ['2 mặt tiền hẻm','Ánh sáng tự nhiên tốt','Gần chợ & bệnh viện','Tiềm năng cho thuê phòng']],
  ['Cho thuê nguyên căn nhà phố Thảo Điền làm văn phòng','cho-thue','nha-pho',45000000,'triệu/tháng',150,5,5,'dong-nam','so-hong','day-du','thu-duc','Trần Não','hot','2026-08-10',2,
    'Nhà phố phong cách hiện đại, sân vườn nhỏ phía trước, phù hợp làm văn phòng công ty hoặc homestay cao cấp. Khu Thảo Điền quy tụ nhiều chuyên gia nước ngoài sinh sống, an ninh tốt, đường nội khu rộng rãi.',
    ['Sân vườn riêng','Phù hợp văn phòng/homestay','Khu chuyên gia nước ngoài','Hợp đồng dài hạn']],
  ['Nhà phố góc 2 mặt tiền Quốc lộ 1A, Quận 12','ban','nha-pho',5400000000,'tỷ',100,3,2,'tay-nam','hop-dong-mua-ban','tho','quan-12','Quốc lộ 1A',null,'2026-07-05',3,
    'Nhà nằm ngay mặt tiền Quốc lộ 1A, lưu lượng xe qua lại đông đúc, rất thích hợp kinh doanh cửa hàng hoặc showroom. Đất đã có hợp đồng mua bán công chứng, đang hoàn tất thủ tục sang tên sổ hồng. Chủ nhà hỗ trợ pháp lý trọn gói.',
    ['Mặt tiền Quốc lộ 1A','Phù hợp kinh doanh showroom','Hỗ trợ pháp lý trọn gói','Lưu lượng xe đông']],
  ['Nhà phố kiểu Pháp cổ điển đường Trần Quốc Thảo','ban','nha-pho',22000000000,'tỷ',110,5,5,'dong','so-do','day-du','quan-3','Trần Quốc Thảo','hot','2026-08-03',4,
    'Ngôi nhà mang kiến trúc Pháp cổ điển hiếm có giữa trung tâm Quận 3, đã được cải tạo giữ nguyên nét hoài cổ kết hợp tiện nghi hiện đại. Sân trước rộng trồng cây cổ thụ, không gian sống yên tĩnh nhưng chỉ cách chợ Bến Thành 10 phút.',
    ['Kiến trúc Pháp cổ điển','Sân vườn cây cổ thụ','Gần trung tâm Quận 1','Sổ đỏ chính chủ']],
  ['Nhà phố liền kề khu dân cư Trung Sơn','ban','nha-pho',9800000000,'tỷ',84,4,4,'dong-nam','so-hong','day-du','binh-chanh','Trung Sơn',null,'2026-07-18',5,
    'Nhà liền kề trong khu dân cư quy hoạch bài bản Trung Sơn, đường nội bộ rộng 12m, vỉa hè trồng cây xanh. Cư dân văn minh, an ninh khép kín có bảo vệ tuần tra 24/24. Gần trường quốc tế và bệnh viện Trung Sơn.',
    ['Khu dân cư quy hoạch','Đường nội bộ 12m','An ninh khép kín','Gần trường quốc tế']],

  ['Đất nền thổ cư Nhà Bè, gần khu đô thị Phú Xuân','ban','dat-nen',3200000000,'tỷ',100,0,0,'dong-nam','so-do','tho','nha-be','Phú Xuân','moi','2026-08-16',0,
    'Lô đất thổ cư 100% nằm trong khu dân cư hiện hữu, đường trước nhà rộng 8m, đã có điện nước đầy đủ. Vị trí gần khu đô thị Phú Xuân đang phát triển hạ tầng cầu đường mạnh mẽ. Phù hợp xây nhà ở hoặc đầu tư chờ tăng giá.',
    ['Thổ cư 100%','Đường trước nhà 8m','Điện nước đầy đủ','Tiềm năng tăng giá']],
  ['Đất nền dự án Bình Chánh, sổ riêng từng nền','ban','dat-nen',2600000000,'tỷ',120,0,0,'dong','so-hong','tho','binh-chanh','Trần Văn Giàu',null,'2026-06-20',1,
    'Nền đất trong dự án khu dân cư đã hoàn thiện hạ tầng đường nhựa, vỉa hè, cây xanh. Mỗi nền đã tách sổ hồng riêng, pháp lý minh bạch, công chứng sang tên trong ngày. Khu vực đang được đầu tư tuyến metro kết nối trung tâm.',
    ['Sổ riêng từng nền','Hạ tầng hoàn thiện','Gần tuyến Metro','Công chứng trong ngày']],
  ['Đất nền view sông Củ Chi, phù hợp làm homestay','ban','dat-nen',3800000000,'tỷ',500,0,0,'tay-bac','so-do','tho','cu-chi','Tỉnh lộ 8',null,'2026-07-22',2,
    'Lô đất rộng ven sông Sài Gòn, không khí trong lành, phù hợp làm nhà vườn nghỉ dưỡng hoặc homestay sinh thái. Đường vào bằng bê tông rộng 4m, cách trung tâm Củ Chi khoảng 5km. Sổ đỏ đầy đủ, không dính quy hoạch.',
    ['View sông Sài Gòn','Phù hợp homestay sinh thái','Không dính quy hoạch','Đường bê tông vào tận nơi']],
  ['Đất nền góc 2 mặt tiền hẻm Quận 12','ban','dat-nen',2100000000,'tỷ',80,0,0,'dong-nam','so-do','tho','quan-12','Nguyễn Ảnh Thủ',null,'2026-06-25',3,
    'Đất nền vuông vắn, vị trí góc 2 mặt tiền hẻm thông thoáng, tiện xây nhà theo nhiều hướng thiết kế. Khu vực dân cư đông đúc, gần chợ và trường học cấp 1, cấp 2. Giá tốt phù hợp người mua để ở lâu dài hoặc đầu tư nhỏ lẻ.',
    ['Đất vuông vắn','Góc 2 mặt tiền hẻm','Gần chợ & trường học','Giá tốt đầu tư']],
  ['Đất nền dự án ven sông Nhà Bè, đầu tư sinh lời','ban','dat-nen',5500000000,'tỷ',150,0,0,'dong','so-hong','tho','nha-be','Nguyễn Bình','hot','2026-08-11',4,
    'Dự án khu đô thị ven sông với cảnh quan xanh mát, tiện ích công viên và bến du thuyền nội khu. Nền đất diện tích lớn phù hợp xây biệt thự sân vườn hoặc giữ đầu tư đón đầu quy hoạch. Chủ đầu tư uy tín, pháp lý hoàn chỉnh.',
    ['Cảnh quan ven sông','Tiện ích bến du thuyền','Đón đầu quy hoạch hạ tầng','Chủ đầu tư uy tín']],
  ['Đất thổ cư mặt tiền đường lớn khu vực Củ Chi','ban','dat-nen',4200000000,'tỷ',200,0,0,'nam','so-do','tho','cu-chi','Nguyễn Thị Rành',null,'2026-07-08',5,
    'Lô đất mặt tiền đường nhựa 12m, xe tải lớn ra vào dễ dàng, thích hợp kinh doanh kho bãi hoặc xưởng nhỏ. Khu vực đang thu hút nhiều nhà đầu tư nhờ giá đất còn mềm so với các quận trung tâm. Sổ đỏ thổ cư toàn bộ diện tích.',
    ['Mặt tiền đường 12m','Phù hợp kho bãi/xưởng nhỏ','Không vướng quy hoạch treo','Giá đất còn mềm']],
  ['Đất nền khu quy hoạch, TP. Thủ Đức','ban','dat-nen',6800000000,'tỷ',90,0,0,'dong-nam','so-hong','tho','thu-duc','Nguyễn Xiển','moi','2026-08-17',0,
    'Nền đất trong khu quy hoạch 1/500 đã được phê duyệt, hạ tầng điện ngầm, cấp thoát nước hoàn chỉnh. Vị trí gần khu công nghệ cao và các trường đại học lớn của TP Thủ Đức. Phù hợp xây nhà ở hoặc phòng trọ cho thuê.',
    ['Quy hoạch 1/500 đã duyệt','Điện ngầm, hạ tầng hoàn chỉnh','Gần khu công nghệ cao','Tiềm năng cho thuê trọ']],
  ['Đất vườn sinh thái ven kênh, Bình Chánh','ban','dat-nen',8500000000,'tỷ',1000,0,0,'tay','so-do','tho','binh-chanh','Nguyễn Văn Linh nối dài',null,'2026-06-12',1,
    'Khu đất vườn rộng ven kênh rạch, nhiều cây ăn trái lâu năm, không khí trong lành xa khói bụi thành phố. Phù hợp làm trang trại nghỉ dưỡng cuối tuần hoặc chia lô đầu tư dài hạn. Đường vào xe tải nhỏ.',
    ['Vườn cây ăn trái lâu năm','Ven kênh rạch mát mẻ','Phù hợp trang trại nghỉ dưỡng','Tiềm năng chia lô']],

  ['Biệt thự song lập Thảo Điền, sân vườn hồ bơi riêng','ban','biet-thu',38000000000,'tỷ',350,5,6,'dong-nam','so-hong','day-du','thu-duc','Nguyễn Cơ Thạch','hot','2026-08-06',2,
    'Biệt thự phong cách hiện đại với hồ bơi riêng và sân vườn rộng rợp bóng cây, nằm trong khu compound an ninh khép kín Thảo Điền. Nội thất nhập khẩu cao cấp, hệ thống nhà thông minh điều khiển từ xa.',
    ['Hồ bơi riêng','Nhà thông minh','Compound an ninh khép kín','Nội thất nhập khẩu']],
  ['Biệt thự vườn Gò Vấp, không gian xanh mát','ban','biet-thu',19500000000,'tỷ',280,4,4,'tay-bac','so-hong','co-ban','go-vap','Quang Trung',null,'2026-07-14',3,
    'Biệt thự sân vườn rộng rãi với nhiều cây xanh lâu năm, không gian sống thoáng đãng hiếm có giữa thành phố. Kiến trúc mái Thái cổ điển, phòng khách thông tầng cao 6m sang trọng.',
    ['Sân vườn cây lâu năm','Phòng khách thông tầng','Kiến trúc mái Thái','Gần đường Phạm Văn Đồng']],
  ['Biệt thự đơn lập Phú Mỹ Hưng, Quận 7','ban','biet-thu',42000000000,'tỷ',300,5,5,'nam','so-hong','day-du','quan-7','Nguyễn Lương Bằng','hot','2026-08-09',4,
    'Biệt thự đơn lập trong khu đô thị kiểu mẫu Phú Mỹ Hưng, thiết kế tân cổ điển sang trọng với thang máy gia đình. Khuôn viên riêng biệt 4 mặt thoáng, sân để được 3-4 xe ô tô.',
    ['Khu đô thị kiểu mẫu','Thang máy gia đình','Sân đỗ 3-4 ô tô','Gần bệnh viện quốc tế']],
  ['Biệt thự nghỉ dưỡng ven sông Nhà Bè','ban','biet-thu',25000000000,'tỷ',400,4,5,'dong','so-hong','co-ban','nha-be','Nguyễn Bình',null,'2026-07-01',5,
    'Biệt thự phong cách resort với bến du thuyền riêng, view sông thoáng đãng đón gió mát quanh năm. Không gian sân vườn rộng phù hợp tổ chức tiệc gia đình hoặc nghỉ dưỡng cuối tuần.',
    ['Bến du thuyền riêng','View sông thoáng đãng','Sân vườn rộng tổ chức tiệc','Cách Quận 7 15 phút']],
  ['Biệt thự mini 1 trệt 2 lầu Củ Chi, giá đầu tư','ban','biet-thu',9500000000,'tỷ',200,4,4,'tay-nam','so-do','tho','cu-chi','Tỉnh lộ 8',null,'2026-06-18',0,
    'Biệt thự mini xây thô hoàn thiện mặt ngoài, khách mua tự hoàn thiện nội thất theo phong cách riêng. Khuôn viên rộng có sân trước trồng cây cảnh, phù hợp làm nhà vườn nghỉ dưỡng cuối tuần.',
    ['Khuôn viên rộng','Sân vườn trồng cây cảnh','Giá đầu tư hấp dẫn','Tự hoàn thiện nội thất']],
  ['Biệt thự song lập Bình Thạnh, view thành phố','ban','biet-thu',31000000000,'tỷ',260,5,5,'dong-bac','so-hong','day-du','binh-thanh','Xô Viết Nghệ Tĩnh','moi','2026-08-19',1,
    'Biệt thự song lập nằm trên cao, tầm nhìn bao quát toàn cảnh thành phố về đêm lung linh ánh đèn. Thiết kế 3 tầng với sân thượng rộng làm khu vườn trên mái, gần cầu Sài Gòn.',
    ['View toàn cảnh thành phố','Sân thượng vườn trên mái','Gần cầu Sài Gòn','3 tầng thiết kế mở']],

  ['Shophouse mặt tiền Nguyễn Văn Linh, Quận 7','ban','shophouse',18000000000,'tỷ',100,4,4,'dong-nam','so-hong','tho','quan-7','Nguyễn Văn Linh','hot','2026-08-04',2,
    'Shophouse 1 trệt 4 lầu mặt tiền đại lộ Nguyễn Văn Linh, lưu lượng giao thông cực lớn, phù hợp mở ngân hàng, showroom hoặc chuỗi cửa hàng thương hiệu. Mặt tiền rộng 5m, tầng trệt thông suốt không cột giữa.',
    ['Mặt tiền đại lộ lớn','Tầng trệt không cột giữa','Phù hợp chuỗi thương hiệu','Dân cư thu nhập cao']],
  ['Cho thuê shophouse Vinhomes Grand Park kinh doanh F&B','cho-thue','shophouse',55000000,'triệu/tháng',90,3,3,'tay','so-hong','co-ban','thu-duc','Nguyễn Xiển',null,'2026-07-27',3,
    'Shophouse mặt tiền trục đường chính trong đại đô thị Vinhomes Grand Park, lượng cư dân nội khu hơn 20.000 người là khách hàng tiềm năng. Không gian phù hợp mở quán cà phê, nhà hàng hoặc phòng khám.',
    ['20.000+ cư dân nội khu','Phù hợp F&B/phòng khám','Hỗ trợ pháp lý kinh doanh','Mặt tiền trục chính']],
  ['Shophouse góc 2 mặt tiền Tân Bình, gần sân bay','ban','shophouse',21000000000,'tỷ',110,5,5,'dong','so-hong','co-ban','tan-binh','Cộng Hòa','da-ban','2026-06-22',4,
    'Shophouse góc 2 mặt tiền ngay khu vực gần sân bay Tân Sơn Nhất, tiềm năng kinh doanh dịch vụ lưu trú, ăn uống cho khách công tác. Diện tích sử dụng rộng rãi 5 tầng, thang máy riêng biệt.',
    ['Góc 2 mặt tiền','Gần sân bay Tân Sơn Nhất','Thang máy riêng','Tiềm năng lưu trú/F&B']],
  ['Shophouse compound ven sông Quận 8','ban','shophouse',12500000000,'tỷ',84,3,3,'nam','so-hong','tho','quan-8','Phạm Thế Hiển','moi','2026-08-13',5,
    'Shophouse trong compound ven sông mới bàn giao, thiết kế hiện đại với sân trước rộng để xe và bày hàng hóa. Khu vực Quận 8 đang được đầu tư mạnh hạ tầng cầu mới kết nối Quận 1.',
    ['Compound ven sông','Sân trước để xe/bày hàng','Đón đầu hạ tầng cầu mới','Giá tốt đầu tư']],
  ['Shophouse trung tâm thương mại Quận 12','cho-thue','shophouse',30000000,'triệu/tháng',70,2,2,'dong-nam','so-hong','co-ban','quan-12','Nguyễn Ảnh Thủ',null,'2026-07-15',0,
    'Mặt bằng shophouse nằm trong khu trung tâm thương mại sầm uất Quận 12, lượng khách qua lại ổn định mỗi ngày. Phù hợp kinh doanh thời trang, mỹ phẩm hoặc cửa hàng tiện lợi. Có sẵn biển hiệu mặt tiền.',
    ['Trong khu TTTM sầm uất','Lượng khách ổn định','Có sẵn biển hiệu mặt tiền','Bàn giao ngay']],

  ['Căn hộ dịch vụ full nội thất Quận 1, cho thuê ngắn hạn','cho-thue','can-ho-dich-vu',11000000,'triệu/tháng',35,1,1,'dong','so-hong','day-du','quan-1','Đồng Khởi','hot','2026-08-07',1,
    'Căn hộ dịch vụ ngay trung tâm Quận 1, đi bộ đến phố đi bộ Nguyễn Huệ chỉ 5 phút. Nội thất đầy đủ tiện nghi khách sạn, dọn phòng và thay ga giường hàng tuần. Phù hợp chuyên gia nước ngoài hoặc khách thuê ngắn hạn.',
    ['Trung tâm Quận 1','Dịch vụ dọn phòng hàng tuần','Cho thuê linh hoạt theo tháng','Gần phố đi bộ Nguyễn Huệ']],
  ['Căn hộ dịch vụ mini Phú Nhuận cho thuê người độc thân','cho-thue','can-ho-dich-vu',7000000,'triệu/tháng',28,1,1,'tay','so-hong','day-du','phu-nhuan','Nguyễn Văn Trỗi',null,'2026-06-29',2,
    'Căn hộ mini diện tích tối ưu dành cho người độc thân hoặc cặp đôi trẻ, gồm gác lửng ngủ riêng biệt. Khu vực Phú Nhuận yên tĩnh nhưng gần chợ, quán ăn và các tuyến xe buýt trung tâm.',
    ['Gác lửng riêng biệt','Giá đã gồm phí quản lý','Khu vực yên tĩnh','Gần chợ & tuyến bus']],
  ['Căn hộ dịch vụ cao cấp Thảo Điền, view Landmark','cho-thue','can-ho-dich-vu',18000000,'triệu/tháng',55,1,1,'dong-nam','so-hong','day-du','thu-duc','Trần Não','moi','2026-08-20',3,
    'Căn hộ dịch vụ hạng sang view thẳng Landmark 81, nội thất thiết kế theo phong cách khách sạn 5 sao. Có hồ bơi vô cực tầng thượng và phòng gym riêng cho cư dân toà nhà dịch vụ.',
    ['View Landmark 81','Hồ bơi vô cực tầng thượng','Nội thất phong cách khách sạn','Khách thuê chuyên gia cấp cao']],
  ['Căn hộ dịch vụ giá rẻ Gò Vấp cho sinh viên','cho-thue','can-ho-dich-vu',4500000,'triệu/tháng',25,1,1,'bac','so-hong','co-ban','go-vap','Nguyễn Oanh',null,'2026-07-03',4,
    'Căn hộ dịch vụ nhỏ gọn giá rẻ, phù hợp sinh viên hoặc người mới đi làm ngân sách hạn chế. Khu vực Gò Vấp gần nhiều trường đại học, cao đẳng và chợ sinh viên giá bình dân.',
    ['Giá rẻ phù hợp sinh viên','Gần nhiều trường đại học','Có thang máy & bảo vệ','An toàn cho người ở một mình']],
  ['Căn hộ dịch vụ 2PN Bình Thạnh cho gia đình nhỏ','cho-thue','can-ho-dich-vu',13500000,'triệu/tháng',60,2,1,'tay-nam','so-hong','day-du','binh-thanh','Điện Biên Phủ','dang-giao-dich','2026-07-30',5,
    'Căn hộ dịch vụ 2 phòng ngủ phù hợp gia đình nhỏ có 1-2 con, gần trường tiểu học và công viên Gia Định. Nội thất đầy đủ máy giặt, tủ lạnh, bếp riêng biệt không dùng chung.',
    ['Phù hợp gia đình nhỏ','Gần công viên Gia Định','Bếp & máy giặt riêng','Chủ nhà hỗ trợ linh hoạt']]
];

/* ── Chuyển RAW_LISTINGS thành PROPERTIES đầy đủ field ── */
const PROPERTIES = RAW_LISTINGS.map((r, i) => {
  const [title, listingType, propertyType, price, priceUnit, area, bedrooms, bathrooms,
    direction, legalStatus, furnishing, district, street, badge, postedDate, agentIdx, description, features] = r;
  const d = districtByCode(district);
  const id = i + 1;
  return {
    id,
    title,
    slug: slugify(title) + '-' + id,
    listingType, propertyType, price, priceUnit, area, bedrooms, bathrooms,
    direction, legalStatus, furnishing, district,
    address: `${street}, ${d.name}, TP.HCM`,
    lat: d.lat + ((i % 7) - 3) * 0.0015,
    lng: d.lng + ((i % 5) - 2) * 0.0015,
    badge, postedDate,
    images: pickImages(id, 6),
    agent: AGENTS[agentIdx],
    description, features
  };
});

/* ── Khoảng giá mốc dùng cho filter dropdown ── */
const PRICE_RANGES_BAN = [
  { value: '', label: 'Tất cả mức giá' },
  { value: 'lt2', label: 'Dưới 2 tỷ', min: 0, max: 2e9 },
  { value: '2-5', label: '2 - 5 tỷ', min: 2e9, max: 5e9 },
  { value: '5-10', label: '5 - 10 tỷ', min: 5e9, max: 10e9 },
  { value: '10-20', label: '10 - 20 tỷ', min: 10e9, max: 20e9 },
  { value: 'gt20', label: 'Trên 20 tỷ', min: 20e9, max: Infinity }
];
const PRICE_RANGES_THUE = [
  { value: '', label: 'Tất cả mức giá' },
  { value: 'lt5', label: 'Dưới 5 triệu/tháng', min: 0, max: 5e6 },
  { value: '5-10', label: '5 - 10 triệu/tháng', min: 5e6, max: 10e6 },
  { value: '10-20', label: '10 - 20 triệu/tháng', min: 10e6, max: 20e6 },
  { value: 'gt20', label: 'Trên 20 triệu/tháng', min: 20e6, max: Infinity }
];
const AREA_RANGES = [
  { value: '', label: 'Tất cả diện tích' },
  { value: 'lt50', label: 'Dưới 50m²', min: 0, max: 50 },
  { value: '50-80', label: '50 - 80m²', min: 50, max: 80 },
  { value: '80-120', label: '80 - 120m²', min: 80, max: 120 },
  { value: 'gt120', label: 'Trên 120m²', min: 120, max: Infinity }
];
