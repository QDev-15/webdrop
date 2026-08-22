/* ══════════════════════════════════════════════════════════════════
   GREEN VALLEY RESIDENCE — Dữ liệu dự án + loại căn hộ (Loại hình B)
   Nguồn dữ liệu duy nhất — mọi trang render lại DOM từ mảng này,
   KHÔNG filter DOM node trực tiếp.
   ══════════════════════════════════════════════════════════════════ */

/* ── Thông tin tổng quan dự án ── */
const PROJECT = {
  name: 'Green Valley Residence',
  developer: 'Tập đoàn Lộc Việt Land',
  developerFounded: 2009,
  developerProjectsDelivered: 14,
  developerUnitsDelivered: 9800,
  location: 'Phường Thảo Điền, TP. Thủ Đức, TP. Hồ Chí Minh',
  address: 'Số 88 đường Nguyễn Văn Hưởng, phường Thảo Điền, TP. Thủ Đức, TP. Hồ Chí Minh',
  lat: 10.8046,
  lng: 106.7350,
  towers: [
    { name: 'Tháp Aqua', floors: 35, units: 316 },
    { name: 'Tháp Terra', floors: 35, units: 316 }
  ],
  totalUnits: 632,
  siteArea: 18500, // m²
  density: 32, // % xây dựng
  legalStatus: 'Sổ hồng lâu dài — đã có Giấy phép xây dựng số 118/GPXD-TĐ, đang triển khai thi công phần thân',
  progressPercent: 55,
  progressLabel: 'Đang thi công tầng 18/35 — Tháp Aqua',
  progressUpdated: '15/08/2026',
  handover: 'Quý 4/2027',
  groundbreaking: 'Quý 2/2024',
  managementFeePerM2: 18000, // đ/m²/tháng
  bankPartners: ['Vietcombank', 'Techcombank', 'BIDV'],
  loanSupportPercent: 70,
  loanGracePeriodMonths: 24,
  hotline: '1900 6868',
  salesOfficeName: 'Phòng Kinh doanh dự án Green Valley Residence',
  salesPhone: '0909 888 686',
  salesEmail: 'kinhdoanh@greenvalleyresidence.vn',
  paymentSchedule: [
    { phase: 'Đợt 1', percent: 20, milestone: 'Ký Hợp đồng mua bán (HĐMB)' },
    { phase: 'Đợt 2', percent: 15, milestone: 'Hoàn thành móng & 2 tầng hầm' },
    { phase: 'Đợt 3', percent: 15, milestone: 'Cất nóc tầng 15' },
    { phase: 'Đợt 4', percent: 15, milestone: 'Cất nóc tầng 25' },
    { phase: 'Đợt 5', percent: 15, milestone: 'Hoàn thiện thô toàn bộ, lắp đặt MEP' },
    { phase: 'Đợt 6', percent: 10, milestone: 'Bàn giao căn hộ' },
    { phase: 'Đợt 7', percent: 10, milestone: 'Nhận Giấy chứng nhận quyền sở hữu (sổ hồng)' }
  ],
  discounts: [
    { label: 'Thanh toán sớm 95% giá trị HĐMB', value: 'Chiết khấu 8%' },
    { label: 'Khách hàng thân thiết / mua từ căn thứ 2', value: 'Chiết khấu thêm 2%' },
    { label: 'Thanh toán theo tiến độ tiêu chuẩn', value: 'Hỗ trợ vay 70%, ân hạn gốc 24 tháng' }
  ],
  internalAmenities: [
    { name: 'Hồ bơi vô cực tầng thượng', desc: 'View toàn cảnh sông Sài Gòn, tầng 35 mỗi tháp', image: 'https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=900&auto=format&fit=crop&q=80' },
    { name: 'Phòng gym & yoga 24/7', desc: 'Trang bị máy tập nhập khẩu, huấn luyện viên riêng', image: 'https://images.unsplash.com/photo-1540541338287-41700207dee6?w=900&auto=format&fit=crop&q=80' },
    { name: 'Công viên cây xanh nội khu', desc: 'Hơn 5.000m² mảng xanh, đường dạo bộ ven sông', image: 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=900&auto=format&fit=crop&q=80' },
    { name: 'Khu vui chơi trẻ em', desc: 'Sân chơi an toàn tiêu chuẩn châu Âu', image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=900&auto=format&fit=crop&q=80' },
    { name: 'Sân BBQ & khu tiệc ngoài trời', desc: 'Không gian tổ chức sự kiện cộng đồng cư dân', image: 'https://images.unsplash.com/photo-1494526585095-c41746248156?w=900&auto=format&fit=crop&q=80' },
    { name: 'Sân vườn cảnh quan tầng trệt', desc: 'Thiết kế cảnh quan nhiệt đới, ghế nghỉ chân', image: 'https://images.unsplash.com/photo-1580041065738-e72023775cdc?w=900&auto=format&fit=crop&q=80' },
    { name: 'Bãi đậu xe ngầm 2 tầng hầm', desc: 'Đáp ứng 100% nhu cầu ô tô + xe máy cư dân', image: 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=900&auto=format&fit=crop&q=80' },
    { name: 'An ninh 24/7 + nhận diện khuôn mặt', desc: 'Kiểm soát ra vào bằng thẻ từ và Face ID', image: 'https://images.unsplash.com/photo-1571508601891-ca5e7a713859?w=900&auto=format&fit=crop&q=80' }
  ],
  externalAmenities: [
    { name: 'Trường Quốc tế ABC School', distance: '500m' },
    { name: 'Bệnh viện Quốc tế City / FV', distance: '2km' },
    { name: 'TTTM Thảo Điền Pearl', distance: '1km' },
    { name: 'Sông Sài Gòn & Bến du thuyền', distance: 'Liền kề dự án' },
    { name: 'Nhà ga Metro số 1 — Thảo Điền', distance: '800m' },
    { name: 'Siêu thị Emart / Co.opmart', distance: '1.5km' }
  ],
  heroImages: [
    'https://images.unsplash.com/photo-1487958449943-2429e8be8625?w=1600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=1600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=1600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1600&auto=format&fit=crop&q=80'
  ]
};

const DIRECTION_LABELS = {
  'dong': 'Đông', 'tay': 'Tây', 'nam': 'Nam', 'bac': 'Bắc',
  'dong-nam': 'Đông Nam', 'tay-nam': 'Tây Nam',
  'dong-bac': 'Đông Bắc', 'tay-bac': 'Tây Bắc',
  'dong-nam-tay-bac': 'Đông Nam & Tây Bắc (2 mặt thoáng)'
};

const STATUS_LABELS = {
  'con-hang': { label: 'Còn hàng', cls: 'ok' },
  'sap-mo-ban': { label: 'Sắp mở bán', cls: 'soon' },
  'het-hang': { label: 'Hết hàng', cls: 'sold' }
};

/* ── Danh sách loại căn hộ ── */
const UNIT_TYPES = [
  {
    id: 1,
    name: 'Green Studio 1PN',
    slug: 'green-studio-1pn',
    typeTag: '1pn',
    bedrooms: 1,
    bathrooms: 1,
    area: 46,
    priceFrom: 2650000000,
    direction: 'dong-nam',
    floorRange: '5-15',
    block: 'Tháp Terra',
    view: 'View công viên nội khu',
    status: 'con-hang',
    badge: 'moi',
    floorPlanImage: 'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=1000&auto=format&fit=crop&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=1200&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=1200&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=1200&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=1200&auto=format&fit=crop&q=80'
    ],
    description: 'Căn hộ 1 phòng ngủ tối ưu diện tích cho người độc thân hoặc cặp đôi trẻ, thiết kế mở liên thông bếp – khách, ban công rộng đón sáng tự nhiên trọn ngày, view hướng công viên nội khu yên tĩnh.',
    features: ['Bàn giao hoàn thiện cơ bản', 'Cửa sổ kính lớn lấy sáng', 'Ban công riêng 4m²', 'Kho lưu trữ âm tường']
  },
  {
    id: 2,
    name: 'Riverside Compact 1PN+1',
    slug: 'riverside-compact-1pn1',
    typeTag: '1pn',
    bedrooms: 1,
    bathrooms: 2,
    area: 52,
    priceFrom: 3150000000,
    direction: 'dong',
    floorRange: '5-20',
    block: 'Tháp Aqua',
    view: 'View sông Sài Gòn một phần',
    status: 'con-hang',
    badge: null,
    floorPlanImage: 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=1000&auto=format&fit=crop&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1200&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1615529162924-f8605388461d?w=1200&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=1200&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=1200&auto=format&fit=crop&q=80'
    ],
    description: 'Phiên bản 1PN+1 có thêm phòng đa năng nhỏ dùng làm phòng làm việc hoặc phòng cho con — phù hợp gia đình trẻ mới cưới. Có 2 phòng vệ sinh riêng biệt, ban công hướng Đông đón bình minh.',
    features: ['Phòng đa năng linh hoạt', '2 phòng vệ sinh riêng biệt', 'Bếp có đảo bar mini', 'Sàn gỗ công nghiệp cao cấp']
  },
  {
    id: 3,
    name: 'Garden View 2PN',
    slug: 'garden-view-2pn',
    typeTag: '2pn',
    bedrooms: 2,
    bathrooms: 2,
    area: 68,
    priceFrom: 4250000000,
    direction: 'tay-nam',
    floorRange: '6-25',
    block: 'Tháp Terra',
    view: 'View sân vườn cảnh quan',
    status: 'con-hang',
    badge: 'hot',
    floorPlanImage: 'https://images.unsplash.com/photo-1571508601891-ca5e7a713859?w=1000&auto=format&fit=crop&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1200&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=1200&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=1200&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1583608205776-bfd35f0d9f83?w=1200&auto=format&fit=crop&q=80'
    ],
    description: 'Căn 2 phòng ngủ bán chạy nhất dự án, bố trí phòng ngủ tách biệt phòng khách tối ưu riêng tư, view trọn vẹn mảng xanh công viên nội khu, phù hợp gia đình 3-4 thành viên.',
    features: ['2 phòng ngủ tách biệt hoàn toàn', 'Logia phơi đồ riêng', 'View xanh mát quanh năm', 'Diện tích thông thủy chuẩn 68m²']
  },
  {
    id: 4,
    name: 'River View 2PN',
    slug: 'river-view-2pn',
    typeTag: '2pn',
    bedrooms: 2,
    bathrooms: 2,
    area: 72,
    priceFrom: 4980000000,
    direction: 'dong-nam',
    floorRange: '8-30',
    block: 'Tháp Aqua',
    view: 'View trực diện sông Sài Gòn',
    status: 'con-hang',
    badge: 'hot',
    floorPlanImage: 'https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?w=1000&auto=format&fit=crop&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1615529162924-f8605388461d?w=1200&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1615874959474-d609969a20ed?w=1200&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=1200&auto=format&fit=crop&q=80'
    ],
    description: 'Căn hộ sở hữu view sông trực diện hiếm có, ban công lớn 8m² lý tưởng để ngắm hoàng hôn trên sông Sài Gòn mỗi ngày, thiết kế nội thất hiện đại tối ưu ánh sáng tự nhiên.',
    features: ['View sông trực diện không bị che chắn', 'Ban công lớn 8m²', 'Bếp tách biệt có cửa lùa kính', 'Sàn cao 3.1m thông thoáng']
  },
  {
    id: 5,
    name: 'Family Plus 2PN+1',
    slug: 'family-plus-2pn1',
    typeTag: '2pn',
    bedrooms: 2,
    bathrooms: 2,
    area: 78,
    priceFrom: 5450000000,
    direction: 'nam',
    floorRange: '10-28',
    block: 'Tháp Terra',
    view: 'View công viên & một phần sông',
    status: 'sap-mo-ban',
    badge: 'sap-mo-ban',
    floorPlanImage: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=1000&auto=format&fit=crop&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1200&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1583608205776-bfd35f0d9f83?w=1200&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=1200&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=1200&auto=format&fit=crop&q=80'
    ],
    description: 'Phiên bản 2PN+1 dành cho gia đình 3 thế hệ, phòng đa năng thứ 3 có thể làm phòng cho ông bà hoặc phòng thờ riêng biệt, tổng diện tích rộng rãi 78m² thông thủy.',
    features: ['Phòng đa năng thứ 3 riêng biệt', 'Hướng Nam mát mẻ quanh năm', 'Bếp rộng có bàn ăn 6 người', 'Dự kiến mở bán Quý 4/2026']
  },
  {
    id: 6,
    name: 'Sky Terrace 3PN',
    slug: 'sky-terrace-3pn',
    typeTag: '3pn',
    bedrooms: 3,
    bathrooms: 2,
    area: 95,
    priceFrom: 6950000000,
    direction: 'dong-nam',
    floorRange: '12-32',
    block: 'Tháp Aqua',
    view: 'View sông & thành phố',
    status: 'con-hang',
    badge: 'hot',
    floorPlanImage: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1000&auto=format&fit=crop&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1200&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=1200&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1615874959474-d609969a20ed?w=1200&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=1200&auto=format&fit=crop&q=80'
    ],
    description: 'Căn hộ 3 phòng ngủ tiêu chuẩn dành cho gia đình đông thành viên, có ban công phụ (tiểu logia) riêng cho phòng ngủ master, thiết kế 2 mặt thoáng đón gió Đông Nam quanh năm.',
    features: ['3 phòng ngủ đều có cửa sổ', 'Tiểu logia riêng phòng master', 'Toilet master có bồn tắm', 'Kho chứa đồ 3m²']
  },
  {
    id: 7,
    name: 'River Corner 3PN',
    slug: 'river-corner-3pn',
    typeTag: '3pn',
    bedrooms: 3,
    bathrooms: 3,
    area: 105,
    priceFrom: 7850000000,
    direction: 'dong',
    floorRange: '15-33',
    block: 'Tháp Aqua',
    view: 'Căn góc — 2 mặt thoáng view sông',
    status: 'con-hang',
    badge: null,
    floorPlanImage: 'https://images.unsplash.com/photo-1487958449943-2429e8be8625?w=1000&auto=format&fit=crop&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1615529162924-f8605388461d?w=1200&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1584622781564-1d987f7333c1?w=1200&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=1200&auto=format&fit=crop&q=80'
    ],
    description: 'Căn góc cao cấp với 2 mặt thoáng không bị căn hộ liền kề che view, 3 phòng vệ sinh riêng biệt cho từng phòng ngủ, phù hợp gia đình lớn hoặc nhu cầu cho thuê dài hạn cao cấp.',
    features: ['Căn góc 2 mặt thoáng', '3 toilet riêng biệt', 'Phòng khách rộng 32m²', 'Ban công bao quanh 2 mặt']
  },
  {
    id: 8,
    name: 'Vertical Villa Duplex',
    slug: 'vertical-villa-duplex',
    typeTag: 'duplex',
    bedrooms: 3,
    bathrooms: 4,
    area: 140,
    priceFrom: 11200000000,
    direction: 'dong-nam',
    floorRange: '33-34',
    block: 'Tháp Aqua',
    view: 'View toàn cảnh sông & thành phố',
    status: 'sap-mo-ban',
    badge: 'sap-mo-ban',
    floorPlanImage: 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=1000&auto=format&fit=crop&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=1200&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1583608205776-bfd35f0d9f83?w=1200&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1584622781564-1d987f7333c1?w=1200&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1560185893-a55cbc8c57e8?w=1200&auto=format&fit=crop&q=80'
    ],
    description: 'Căn hộ thông tầng (duplex) 2 tầng riêng biệt trong 1 căn hộ — tầng dưới bố trí phòng khách, bếp và phòng ngủ khách; tầng trên là khu vực riêng tư với phòng master và phòng làm việc, cầu thang nội bộ bằng kính cường lực.',
    features: ['Thông tầng 2 lầu riêng biệt', 'Cầu thang kính cường lực', 'Sân vườn trên không riêng', 'Dự kiến mở bán Quý 1/2027']
  },
  {
    id: 9,
    name: 'Panorama Penthouse',
    slug: 'panorama-penthouse',
    typeTag: 'penthouse',
    bedrooms: 4,
    bathrooms: 5,
    area: 210,
    priceFrom: 14500000000,
    direction: 'dong-nam-tay-bac',
    floorRange: '35',
    block: 'Tháp Terra',
    view: 'Toàn cảnh 360° sông & trung tâm thành phố',
    status: 'con-hang',
    badge: 'hot',
    floorPlanImage: 'https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?w=1000&auto=format&fit=crop&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=1200&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=1200&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1615874959474-d609969a20ed?w=1200&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1600585152220-90363fe7e115?w=1200&auto=format&fit=crop&q=80'
    ],
    description: 'Penthouse độc bản duy nhất mỗi tháp, chiếm trọn tầng áp mái với tầm nhìn 360° không giới hạn, sân vườn riêng trên không, thang máy riêng lên thẳng căn hộ, bàn giao nội thất cao cấp trọn gói.',
    features: ['Thang máy riêng lên thẳng căn hộ', 'Sân vườn & bể sục riêng trên không', 'Bàn giao nội thất cao cấp trọn gói', 'Chỉ 2 căn duy nhất toàn dự án']
  },
  {
    id: 10,
    name: 'Sky Garden 3PN Góc',
    slug: 'sky-garden-3pn-goc',
    typeTag: '3pn',
    bedrooms: 3,
    bathrooms: 2,
    area: 112,
    priceFrom: 8250000000,
    direction: 'tay-nam',
    floorRange: '20-32',
    block: 'Tháp Terra',
    view: 'Căn góc view công viên & sông',
    status: 'het-hang',
    badge: null,
    floorPlanImage: 'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=1000&auto=format&fit=crop&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=1200&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1615529162924-f8605388461d?w=1200&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=1200&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1200&auto=format&fit=crop&q=80'
    ],
    description: 'Căn góc 3 phòng ngủ đã bán hết trong đợt mở bán đầu tiên nhờ vị trí đẹp view kép công viên và sông — hiện chỉ còn nhận đặt chỗ ưu tiên chuyển nhượng lại từ khách hàng hiện hữu.',
    features: ['Đã bán hết 100% giỏ hàng', 'Căn góc view kép', 'Chuyển nhượng qua Phòng KD dự án', 'Chênh lệch thị trường thứ cấp']
  }
];

/* ── Helper: định dạng tiền tệ kiểu Việt Nam ── */
function formatVND(value) {
  if (value >= 1e9) {
    const v = Math.round((value / 1e9) * 100) / 100;
    return (v % 1 === 0 ? v.toFixed(0) : v.toFixed(2).replace(/0$/, '')) + ' tỷ';
  }
  if (value >= 1e6) {
    return Math.round(value / 1e6) + ' triệu';
  }
  return value.toLocaleString('vi-VN') + ' đ';
}

function formatFullVND(value) {
  return Math.round(value).toLocaleString('vi-VN') + ' đ';
}

/* ── Helper: tính trả góp hàng tháng (amortization chuẩn) ── */
function calcMonthlyPayment(loanAmount, annualRatePercent, years) {
  const r = (annualRatePercent / 100) / 12;
  const n = years * 12;
  if (n <= 0) return 0;
  if (r === 0) return loanAmount / n;
  return loanAmount * r * Math.pow(1 + r, n) / (Math.pow(1 + r, n) - 1);
}

/* ── Helper: parse "min-max" hoặc "n" thành khoảng tầng ── */
function parseFloorRange(str) {
  const parts = String(str).split('-').map(Number);
  if (parts.length === 1) return [parts[0], parts[0]];
  return [parts[0], parts[1]];
}

/* ── Helper: lấy loại căn tương tự (round-robin theo typeTag, fallback toàn bộ) ── */
function getRelatedUnits(current, count) {
  count = count || 3;
  let pool = UNIT_TYPES.filter(u => u.slug !== current.slug && u.typeTag === current.typeTag);
  if (pool.length < count) {
    const rest = UNIT_TYPES.filter(u => u.slug !== current.slug && u.typeTag !== current.typeTag);
    pool = pool.concat(rest);
  }
  return pool.slice(0, count);
}
