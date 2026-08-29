/* ══════════════════════════════════════════════════════════════
   products-data.js — VIOLETTE Fine Jewelry
   45 sản phẩm mock | 5 danh mục | PER_PAGE=12 → 4 trang
   Ảnh: 100% URL Unsplash đã verify HTTP 200, KHÔNG dùng assets/img/
   ══════════════════════════════════════════════════════════════ */

const CATEGORIES = [
  { slug: 'nhan', label: 'Nhẫn' },
  { slug: 'day-chuyen', label: 'Dây chuyền' },
  { slug: 'bong-tai', label: 'Bông tai' },
  { slug: 'lac-tay', label: 'Lắc tay' },
  { slug: 'bo-trang-suc', label: 'Bộ trang sức' }
];

const MATERIALS = [
  { slug: 'bac-925', label: 'Bạc 925' },
  { slug: 'vang-18k', label: 'Vàng 18K' },
  { slug: 'vang-24k', label: 'Vàng 24K' },
  { slug: 'da-quy', label: 'Đá quý tự nhiên' },
  { slug: 'dinh-da', label: 'Đính đá CZ' }
];

const TONES = [
  { slug: 'vang', label: 'Vàng' },
  { slug: 'bac', label: 'Bạc' },
  { slug: 'hong-vang', label: 'Vàng hồng' }
];

const OCCASIONS = [
  { slug: 'hang-ngay', label: 'Hàng ngày' },
  { slug: 'du-tiec', label: 'Dự tiệc' },
  { slug: 'cuoi-hoi', label: 'Cưới hỏi' },
  { slug: 'qua-tang', label: 'Quà tặng' }
];

const THEME_LABELS = {
  'moi-ve': 'Bộ sưu tập mới về',
  'ban-chay': 'Bán chạy nhất',
  'uu-dai': 'Đang ưu đãi',
  'qua-tang': 'Quà tặng ý nghĩa'
};

const PRODUCTS = [
  /* ── NHẪN (10) ── */
  { id: 1, name: 'Nhẫn Bạc 925 Solitaire Tối Giản', slug: 'nhan-bac-925-solitaire-toi-gian', price: 590000, salePrice: null, category: 'nhan', material: 'bac-925', tone: 'bac', occasion: 'hang-ngay', theme: ['moi-ve'], rating: 4.7, sold: 320, stock: true, badge: 'new', image: 'https://images.unsplash.com/photo-1622398925373-3f91b1e275f5?w=600&auto=format&fit=crop&q=80' },
  { id: 2, name: 'Nhẫn Vàng 18K Đính Kim Cương Nhân Tạo 5 Ly', slug: 'nhan-vang-18k-dinh-kim-cuong-nhan-tao-5-ly', price: 4850000, salePrice: null, category: 'nhan', material: 'vang-18k', tone: 'vang', occasion: 'du-tiec', theme: ['ban-chay'], rating: 4.9, sold: 214, stock: true, badge: 'hot', image: 'https://images.unsplash.com/photo-1598560917807-1bae44bd2be8?w=600&auto=format&fit=crop&q=80' },
  { id: 3, name: 'Nhẫn Vàng 24K Trơn Truyền Thống', slug: 'nhan-vang-24k-tron-truyen-thong', price: 12500000, salePrice: null, category: 'nhan', material: 'vang-24k', tone: 'vang', occasion: 'cuoi-hoi', theme: [], rating: 4.8, sold: 96, stock: true, badge: null, image: 'https://images.unsplash.com/photo-1611107683227-e9060eccd846?w=600&auto=format&fit=crop&q=80' },
  { id: 4, name: 'Nhẫn Đá Thạch Anh Tím Tự Nhiên', slug: 'nhan-da-thach-anh-tim-tu-nhien', price: 1290000, salePrice: null, category: 'nhan', material: 'da-quy', tone: 'bac', occasion: 'hang-ngay', theme: ['moi-ve'], rating: 4.6, sold: 154, stock: true, badge: 'new', image: 'https://images.unsplash.com/photo-1713950920412-97799efdf870?w=600&auto=format&fit=crop&q=80' },
  { id: 5, name: 'Nhẫn Đính Đá CZ Xoắn Ốc Bạc 925', slug: 'nhan-dinh-da-cz-xoan-oc-bac-925', price: 720000, salePrice: 590000, category: 'nhan', material: 'dinh-da', tone: 'bac', occasion: 'du-tiec', theme: ['uu-dai'], rating: 4.5, sold: 410, stock: true, badge: 'sale', image: 'https://images.unsplash.com/photo-1611955167811-4711904bb9f8?w=600&auto=format&fit=crop&q=80' },
  { id: 6, name: 'Nhẫn Cặp Đôi Vàng 18K Khắc Tên', slug: 'nhan-cap-doi-vang-18k-khac-ten', price: 6900000, salePrice: null, category: 'nhan', material: 'vang-18k', tone: 'vang', occasion: 'cuoi-hoi', theme: ['qua-tang'], rating: 4.9, sold: 187, stock: true, badge: null, image: 'https://images.unsplash.com/photo-1631982690223-8aa4be0a2497?w=600&auto=format&fit=crop&q=80' },
  { id: 7, name: 'Nhẫn Vàng Hồng 18K Đính Đá Sapphire', slug: 'nhan-vang-hong-18k-dinh-da-sapphire', price: 8250000, salePrice: null, category: 'nhan', material: 'vang-18k', tone: 'hong-vang', occasion: 'du-tiec', theme: ['ban-chay'], rating: 4.8, sold: 132, stock: true, badge: null, image: 'https://images.unsplash.com/photo-1685970731194-e27b477e87ba?w=600&auto=format&fit=crop&q=80' },
  { id: 8, name: 'Nhẫn Bạc 925 Mặt Trăng Ngôi Sao', slug: 'nhan-bac-925-mat-trang-ngoi-sao', price: 450000, salePrice: 380000, category: 'nhan', material: 'bac-925', tone: 'bac', occasion: 'hang-ngay', theme: ['moi-ve', 'uu-dai'], rating: 4.6, sold: 505, stock: true, badge: 'sale', image: 'https://images.unsplash.com/photo-1603561596973-8166e9e089d1?w=600&auto=format&fit=crop&q=80' },
  { id: 9, name: 'Nhẫn Vàng 24K Hình Rồng Phong Thủy', slug: 'nhan-vang-24k-hinh-rong-phong-thuy', price: 15800000, salePrice: null, category: 'nhan', material: 'vang-24k', tone: 'vang', occasion: 'qua-tang', theme: ['qua-tang'], rating: 4.7, sold: 58, stock: true, badge: null, image: 'https://images.unsplash.com/photo-1633934542430-0905ccb5f050?w=600&auto=format&fit=crop&q=80' },
  { id: 10, name: 'Nhẫn Đá Ruby Tự Nhiên Dáng Ovan', slug: 'nhan-da-ruby-tu-nhien-dang-ovan', price: 18500000, salePrice: null, category: 'nhan', material: 'da-quy', tone: 'vang', occasion: 'du-tiec', theme: ['ban-chay'], rating: 4.9, sold: 41, stock: true, badge: 'hot', image: 'https://images.unsplash.com/photo-1628926379972-9843ad139a8c?w=600&auto=format&fit=crop&q=80' },

  /* ── DÂY CHUYỀN (10) ── */
  { id: 11, name: 'Dây Chuyền Bạc 925 Mặt Trái Tim', slug: 'day-chuyen-bac-925-mat-trai-tim', price: 690000, salePrice: null, category: 'day-chuyen', material: 'bac-925', tone: 'bac', occasion: 'hang-ngay', theme: ['moi-ve'], rating: 4.6, sold: 288, stock: true, badge: 'new', image: 'https://images.unsplash.com/photo-1617038220319-276d3cfab638?w=600&auto=format&fit=crop&q=80' },
  { id: 12, name: 'Dây Chuyền Vàng 18K Mặt Chữ Cái', slug: 'day-chuyen-vang-18k-mat-chu-cai', price: 3200000, salePrice: null, category: 'day-chuyen', material: 'vang-18k', tone: 'vang', occasion: 'qua-tang', theme: ['qua-tang'], rating: 4.8, sold: 245, stock: true, badge: null, image: 'https://images.unsplash.com/photo-1611652022419-a9419f74343d?w=600&auto=format&fit=crop&q=80' },
  { id: 13, name: 'Dây Chuyền Vàng 24K Kiềng Trơn', slug: 'day-chuyen-vang-24k-kieng-tron', price: 22000000, salePrice: null, category: 'day-chuyen', material: 'vang-24k', tone: 'vang', occasion: 'cuoi-hoi', theme: [], rating: 4.9, sold: 34, stock: true, badge: null, image: 'https://images.unsplash.com/photo-1589128777073-263566ae5e4d?w=600&auto=format&fit=crop&q=80' },
  { id: 14, name: 'Dây Chuyền Đính Đá CZ Hoa Văn', slug: 'day-chuyen-dinh-da-cz-hoa-van', price: 890000, salePrice: 750000, category: 'day-chuyen', material: 'dinh-da', tone: 'bac', occasion: 'du-tiec', theme: ['uu-dai'], rating: 4.5, sold: 366, stock: true, badge: 'sale', image: 'https://images.unsplash.com/photo-1635767798638-3e25273a8236?w=600&auto=format&fit=crop&q=80' },
  { id: 15, name: 'Dây Chuyền Đá Ngọc Bích Tự Nhiên', slug: 'day-chuyen-da-ngoc-bich-tu-nhien', price: 2450000, salePrice: null, category: 'day-chuyen', material: 'da-quy', tone: 'vang', occasion: 'hang-ngay', theme: ['moi-ve'], rating: 4.7, sold: 121, stock: true, badge: 'new', image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=600&auto=format&fit=crop&q=80' },
  { id: 16, name: 'Dây Chuyền Vàng Hồng 18K Mặt Cầu', slug: 'day-chuyen-vang-hong-18k-mat-cau', price: 5600000, salePrice: null, category: 'day-chuyen', material: 'vang-18k', tone: 'hong-vang', occasion: 'du-tiec', theme: ['ban-chay'], rating: 4.8, sold: 176, stock: true, badge: 'hot', image: 'https://images.unsplash.com/photo-1602173574767-37ac01994b2a?w=600&auto=format&fit=crop&q=80' },
  { id: 17, name: 'Dây Chuyền Bạc 925 Đôi Basic', slug: 'day-chuyen-bac-925-doi-basic', price: 520000, salePrice: null, category: 'day-chuyen', material: 'bac-925', tone: 'bac', occasion: 'hang-ngay', theme: [], rating: 4.4, sold: 298, stock: true, badge: null, image: 'https://images.unsplash.com/photo-1685970731571-72ede0cb26ea?w=600&auto=format&fit=crop&q=80' },
  { id: 18, name: 'Dây Chuyền Vàng 18K Mặt Phật Bản Mệnh', slug: 'day-chuyen-vang-18k-mat-phat-ban-menh', price: 7400000, salePrice: null, category: 'day-chuyen', material: 'vang-18k', tone: 'vang', occasion: 'qua-tang', theme: ['qua-tang'], rating: 4.9, sold: 88, stock: true, badge: null, image: 'https://images.unsplash.com/photo-1616837874254-8d5aaa63e273?w=600&auto=format&fit=crop&q=80' },
  { id: 19, name: 'Dây Chuyền Đính Đá Kim Cương Nhân Tạo Layer', slug: 'day-chuyen-dinh-da-kim-cuong-nhan-tao-layer', price: 1150000, salePrice: null, category: 'day-chuyen', material: 'dinh-da', tone: 'bac', occasion: 'du-tiec', theme: ['ban-chay'], rating: 4.6, sold: 340, stock: true, badge: null, image: 'https://images.unsplash.com/photo-1601821765780-754fa98637c1?w=600&auto=format&fit=crop&q=80' },
  { id: 20, name: 'Dây Chuyền Đá Thạch Anh Hồng Tình Yêu', slug: 'day-chuyen-da-thach-anh-hong-tinh-yeu', price: 980000, salePrice: 850000, category: 'day-chuyen', material: 'da-quy', tone: 'hong-vang', occasion: 'qua-tang', theme: ['uu-dai', 'qua-tang'], rating: 4.7, sold: 202, stock: true, badge: 'sale', image: 'https://images.unsplash.com/photo-1588444837495-c6cfeb53f32d?w=600&auto=format&fit=crop&q=80' },

  /* ── BÔNG TAI (9) ── */
  { id: 21, name: 'Bông Tai Bạc 925 Ngọc Trai Nước Ngọt', slug: 'bong-tai-bac-925-ngoc-trai-nuoc-ngot', price: 480000, salePrice: null, category: 'bong-tai', material: 'bac-925', tone: 'bac', occasion: 'hang-ngay', theme: ['moi-ve'], rating: 4.7, sold: 412, stock: true, badge: 'new', image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=600&auto=format&fit=crop&q=80' },
  { id: 22, name: 'Bông Tai Vàng 18K Đính Đá Sapphire Nhỏ', slug: 'bong-tai-vang-18k-dinh-da-sapphire-nho', price: 3850000, salePrice: null, category: 'bong-tai', material: 'vang-18k', tone: 'vang', occasion: 'du-tiec', theme: ['ban-chay'], rating: 4.8, sold: 156, stock: true, badge: null, image: 'https://images.unsplash.com/photo-1629224316810-9d8805b95e76?w=600&auto=format&fit=crop&q=80' },
  { id: 23, name: 'Bông Tai Vàng 24K Bản To Truyền Thống', slug: 'bong-tai-vang-24k-ban-to-truyen-thong', price: 9600000, salePrice: null, category: 'bong-tai', material: 'vang-24k', tone: 'vang', occasion: 'cuoi-hoi', theme: [], rating: 4.8, sold: 47, stock: true, badge: null, image: 'https://images.unsplash.com/photo-1590166223826-12dee1677420?w=600&auto=format&fit=crop&q=80' },
  { id: 24, name: 'Bông Tai Đính Đá CZ Vòng Tròn', slug: 'bong-tai-dinh-da-cz-vong-tron', price: 350000, salePrice: 290000, category: 'bong-tai', material: 'dinh-da', tone: 'bac', occasion: 'hang-ngay', theme: ['uu-dai'], rating: 4.5, sold: 588, stock: true, badge: 'sale', image: 'https://images.unsplash.com/photo-1615655114865-4cc1bda5901e?w=600&auto=format&fit=crop&q=80' },
  { id: 25, name: 'Bông Tai Đá Opal Tự Nhiên', slug: 'bong-tai-da-opal-tu-nhien', price: 2150000, salePrice: null, category: 'bong-tai', material: 'da-quy', tone: 'bac', occasion: 'du-tiec', theme: ['ban-chay'], rating: 4.7, sold: 98, stock: true, badge: null, image: 'https://images.unsplash.com/photo-1693212793204-bcea856c75fe?w=600&auto=format&fit=crop&q=80' },
  { id: 26, name: 'Bông Tai Vàng Hồng 18K Hình Lá', slug: 'bong-tai-vang-hong-18k-hinh-la', price: 2900000, salePrice: null, category: 'bong-tai', material: 'vang-18k', tone: 'hong-vang', occasion: 'hang-ngay', theme: ['moi-ve'], rating: 4.6, sold: 143, stock: true, badge: 'new', image: 'https://images.unsplash.com/photo-1652766540048-de0a878a3266?w=600&auto=format&fit=crop&q=80' },
  { id: 27, name: 'Bông Tai Bạc 925 Dạng Khoen Basic', slug: 'bong-tai-bac-925-dang-khoen-basic', price: 320000, salePrice: null, category: 'bong-tai', material: 'bac-925', tone: 'bac', occasion: 'hang-ngay', theme: [], rating: 4.4, sold: 320, stock: true, badge: null, image: 'https://images.unsplash.com/photo-1603974372039-adc49044b6bd?w=600&auto=format&fit=crop&q=80' },
  { id: 28, name: 'Bông Tai Vàng 18K Rủ Dài Dự Tiệc', slug: 'bong-tai-vang-18k-ru-dai-du-tiec', price: 5100000, salePrice: null, category: 'bong-tai', material: 'vang-18k', tone: 'vang', occasion: 'du-tiec', theme: ['ban-chay'], rating: 4.9, sold: 87, stock: true, badge: 'hot', image: 'https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?w=600&auto=format&fit=crop&q=80' },
  { id: 29, name: 'Bông Tai Đính Đá Kim Cương Nhân Tạo Hình Bướm', slug: 'bong-tai-dinh-da-kim-cuong-nhan-tao-hinh-buom', price: 610000, salePrice: null, category: 'bong-tai', material: 'dinh-da', tone: 'bac', occasion: 'qua-tang', theme: ['qua-tang'], rating: 4.6, sold: 234, stock: true, badge: null, image: 'https://images.unsplash.com/photo-1655255114527-d0a834d9a774?w=600&auto=format&fit=crop&q=80' },

  /* ── LẮC TAY (8) ── */
  { id: 30, name: 'Lắc Tay Bạc 925 Charm Trái Tim', slug: 'lac-tay-bac-925-charm-trai-tim', price: 550000, salePrice: null, category: 'lac-tay', material: 'bac-925', tone: 'bac', occasion: 'qua-tang', theme: ['qua-tang'], rating: 4.6, sold: 267, stock: true, badge: null, image: 'https://images.unsplash.com/photo-1633810543462-77c4a3b13f07?w=600&auto=format&fit=crop&q=80' },
  { id: 31, name: 'Lắc Tay Vàng 18K Mắt Xích Cuban', slug: 'lac-tay-vang-18k-mat-xich-cuban', price: 6800000, salePrice: null, category: 'lac-tay', material: 'vang-18k', tone: 'vang', occasion: 'du-tiec', theme: ['ban-chay'], rating: 4.8, sold: 112, stock: true, badge: 'hot', image: 'https://images.unsplash.com/photo-1619119069152-a2b331eb392a?w=600&auto=format&fit=crop&q=80' },
  { id: 32, name: 'Lắc Tay Vàng 24K Trơn Cổ Điển', slug: 'lac-tay-vang-24k-tron-co-dien', price: 14200000, salePrice: null, category: 'lac-tay', material: 'vang-24k', tone: 'vang', occasion: 'cuoi-hoi', theme: [], rating: 4.8, sold: 39, stock: true, badge: null, image: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=600&auto=format&fit=crop&q=80' },
  { id: 33, name: 'Lắc Tay Đính Đá CZ Tennis', slug: 'lac-tay-dinh-da-cz-tennis', price: 1350000, salePrice: 1090000, category: 'lac-tay', material: 'dinh-da', tone: 'bac', occasion: 'du-tiec', theme: ['uu-dai'], rating: 4.7, sold: 198, stock: true, badge: 'sale', image: 'https://images.unsplash.com/photo-1721206624492-3d05631471ea?w=600&auto=format&fit=crop&q=80' },
  { id: 34, name: 'Lắc Tay Đá Thạch Anh Vàng Phong Thủy', slug: 'lac-tay-da-thach-anh-vang-phong-thuy', price: 890000, salePrice: null, category: 'lac-tay', material: 'da-quy', tone: 'vang', occasion: 'hang-ngay', theme: ['moi-ve'], rating: 4.6, sold: 176, stock: true, badge: 'new', image: 'https://images.unsplash.com/photo-1717605383946-96c6884c36b4?w=600&auto=format&fit=crop&q=80' },
  { id: 35, name: 'Lắc Tay Vàng Hồng 18K Charm Ngôi Sao', slug: 'lac-tay-vang-hong-18k-charm-ngoi-sao', price: 4100000, salePrice: null, category: 'lac-tay', material: 'vang-18k', tone: 'hong-vang', occasion: 'qua-tang', theme: ['qua-tang'], rating: 4.7, sold: 95, stock: true, badge: null, image: 'https://images.unsplash.com/photo-1676291055501-286c48bb186f?w=600&auto=format&fit=crop&q=80' },
  { id: 36, name: 'Lắc Tay Bạc 925 Basic Trơn', slug: 'lac-tay-bac-925-basic-tron', price: 380000, salePrice: null, category: 'lac-tay', material: 'bac-925', tone: 'bac', occasion: 'hang-ngay', theme: [], rating: 4.4, sold: 289, stock: true, badge: null, image: 'https://images.unsplash.com/photo-1708221235482-a6e2a807198f?w=600&auto=format&fit=crop&q=80' },
  { id: 37, name: 'Lắc Tay Đính Đá Kim Cương Nhân Tạo Vòng Đôi', slug: 'lac-tay-dinh-da-kim-cuong-nhan-tao-vong-doi', price: 1780000, salePrice: null, category: 'lac-tay', material: 'dinh-da', tone: 'bac', occasion: 'du-tiec', theme: ['ban-chay'], rating: 4.6, sold: 164, stock: true, badge: null, image: 'https://images.unsplash.com/photo-1728646998199-127b357a464d?w=600&auto=format&fit=crop&q=80' },

  /* ── BỘ TRANG SỨC (8) ── */
  { id: 38, name: 'Bộ Trang Sức Bạc 925 Ngọc Trai (Dây + Bông Tai)', slug: 'bo-trang-suc-bac-925-ngoc-trai', price: 1450000, salePrice: null, category: 'bo-trang-suc', material: 'bac-925', tone: 'bac', occasion: 'cuoi-hoi', theme: ['moi-ve'], rating: 4.7, sold: 143, stock: true, badge: 'new', image: 'https://images.unsplash.com/photo-1585960622850-ed33c41d6418?w=600&auto=format&fit=crop&q=80' },
  { id: 39, name: 'Bộ Trang Sức Vàng 18K Đính Đá Sapphire (3 Món)', slug: 'bo-trang-suc-vang-18k-dinh-da-sapphire-3-mon', price: 15600000, salePrice: null, category: 'bo-trang-suc', material: 'vang-18k', tone: 'vang', occasion: 'cuoi-hoi', theme: ['ban-chay'], rating: 4.9, sold: 62, stock: true, badge: 'hot', image: 'https://images.unsplash.com/photo-1608042314453-ae338d80c427?w=600&auto=format&fit=crop&q=80' },
  { id: 40, name: 'Bộ Trang Sức Vàng 24K Cô Dâu Truyền Thống', slug: 'bo-trang-suc-vang-24k-co-dau-truyen-thong', price: 32000000, salePrice: null, category: 'bo-trang-suc', material: 'vang-24k', tone: 'vang', occasion: 'cuoi-hoi', theme: [], rating: 4.9, sold: 21, stock: true, badge: null, image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=600&auto=format&fit=crop&q=80' },
  { id: 41, name: 'Bộ Trang Sức Đính Đá CZ Cao Cấp (4 Món)', slug: 'bo-trang-suc-dinh-da-cz-cao-cap-4-mon', price: 2450000, salePrice: 1990000, category: 'bo-trang-suc', material: 'dinh-da', tone: 'bac', occasion: 'du-tiec', theme: ['uu-dai'], rating: 4.6, sold: 108, stock: true, badge: 'sale', image: 'https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?w=600&auto=format&fit=crop&q=80' },
  { id: 42, name: 'Bộ Trang Sức Đá Ruby Tự Nhiên (2 Món)', slug: 'bo-trang-suc-da-ruby-tu-nhien-2-mon', price: 24500000, salePrice: null, category: 'bo-trang-suc', material: 'da-quy', tone: 'vang', occasion: 'du-tiec', theme: ['ban-chay'], rating: 4.9, sold: 18, stock: true, badge: null, image: 'https://images.unsplash.com/photo-1599643477877-530eb83abc8e?w=600&auto=format&fit=crop&q=80' },
  { id: 43, name: 'Bộ Trang Sức Vàng Hồng 18K Tối Giản (2 Món)', slug: 'bo-trang-suc-vang-hong-18k-toi-gian-2-mon', price: 8900000, salePrice: null, category: 'bo-trang-suc', material: 'vang-18k', tone: 'hong-vang', occasion: 'qua-tang', theme: ['qua-tang'], rating: 4.8, sold: 74, stock: true, badge: null, image: 'https://images.unsplash.com/photo-1592317295760-5c1f677dfc78?w=600&auto=format&fit=crop&q=80' },
  { id: 44, name: 'Bộ Trang Sức Bạc 925 Cưới Hỏi Cơ Bản', slug: 'bo-trang-suc-bac-925-cuoi-hoi-co-ban', price: 1150000, salePrice: null, category: 'bo-trang-suc', material: 'bac-925', tone: 'bac', occasion: 'cuoi-hoi', theme: [], rating: 4.5, sold: 190, stock: true, badge: null, image: 'https://images.unsplash.com/photo-1671642883395-0ab89c3ac890?w=600&auto=format&fit=crop&q=80' },
  { id: 45, name: 'Bộ Trang Sức Đính Đá Kim Cương Nhân Tạo Full (5 Món)', slug: 'bo-trang-suc-dinh-da-kim-cuong-nhan-tao-full-5-mon', price: 3600000, salePrice: null, category: 'bo-trang-suc', material: 'dinh-da', tone: 'bac', occasion: 'du-tiec', theme: ['ban-chay'], rating: 4.7, sold: 133, stock: true, badge: null, image: 'https://images.unsplash.com/photo-1610214354095-684029c14300?w=600&auto=format&fit=crop&q=80' }
];

/* Ảnh phụ dùng cho gallery trang chi tiết + banner bộ sưu tập — không gắn vào 1 sản phẩm cố định */
const EXTRA_IMAGES = [
  'https://images.unsplash.com/photo-1620656798579-1984d9e87df7?w=900&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1631982686092-e6561a853187?w=900&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1705326455036-0fab8ecba04d?w=900&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1614606140245-2c33ece9e2cf?w=900&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1543294001-f7cd5d7fb516?w=900&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1722410180670-b6d5a2e704fa?w=900&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1610694955371-d4a3e0ce4b52?w=900&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1671644730555-916aa8d8157f?w=900&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1621939745912-aad97fd3a34d?w=900&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1731406322264-dac59f83828b?w=900&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1625516152414-8f33eef3d660?w=900&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1608508644127-ba99d7732fee?w=900&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1689367436629-1d288f1e23b6?w=900&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=900&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1721103428054-6bcf4f655594?w=900&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1692421098809-6cdfcfea289a?w=900&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1722410180687-b05b50922362?w=900&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1624588057318-5f1b2eb81012?w=900&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1722410180681-9f5a22d7ebb6?w=900&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1764591576264-ad2e0e4e793c?w=900&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1689560025810-4599bc195814?w=900&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1622704776938-bed6cd156e04?w=900&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1580582202907-d01fd0bd4c87?w=900&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1660860547079-fd4845880af9?w=900&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1629212093109-354efe3fc541?w=900&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1590370094718-6003d268a11d?w=900&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1685489807405-fdffb06aef2c?w=900&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1667286266946-4bbb7969b32b?w=900&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1604306354577-68136efdf03b?w=900&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1583419960327-87f038955e4a?w=900&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1724986481830-4e7b781c2bd1?w=900&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1646624867902-b970108e9137?w=900&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1626136978522-b67ac41126e9?w=900&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1576723417715-6b408c988c23?w=900&auto=format&fit=crop&q=80'
];

/* Ảnh chân dung khách hàng — testimonials */
const PORTRAITS = [
  'https://images.unsplash.com/photo-1557053908-94f31a224f8f?w=200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1654765437547-6b572f52ee1a?w=200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1779398970350-14a7222482eb?w=200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1779398969759-ad146920ff99?w=200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1746733706320-bc3b55dfcd57?w=200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1638872141103-7231aa359aa4?w=200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1643555331266-b6ad33f8d729?w=200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1643555357363-066734b0a96e?w=200&auto=format&fit=crop&q=80'
];

const SVG_FALLBACK = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='600' height='600' viewBox='0 0 600 600'%3E%3Crect width='600' height='600' fill='%231c1720'/%3E%3Ctext x='50%25' y='50%25' text-anchor='middle' dy='.3em' fill='%237d7488' font-size='18' font-family='sans-serif'%3EVIOLETTE%3C/text%3E%3C/svg%3E";

function formatVND(n) {
  return n.toLocaleString('vi-VN') + '₫';
}

function getRelatedProducts(product, count) {
  const sameCat = PRODUCTS.filter(p => p.category === product.category && p.id !== product.id);
  const pool = sameCat.length >= count ? sameCat : PRODUCTS.filter(p => p.id !== product.id);
  const out = [];
  for (let i = 0; i < count && i < pool.length; i++) {
    out.push(pool[(product.id + i) % pool.length]);
  }
  return out;
}

function getProductGallery(product) {
  const start = product.id % EXTRA_IMAGES.length;
  return [product.image, EXTRA_IMAGES[start], EXTRA_IMAGES[(start + 1) % EXTRA_IMAGES.length]];
}
