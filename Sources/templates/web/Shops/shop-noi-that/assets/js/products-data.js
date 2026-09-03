/* products-data.js — MỘC AN Nội thất */
/* 44 sản phẩm mock | 7 danh mục | PER_PAGE=12 → 4 trang */
/* Ảnh: 100% URL Unsplash đã verify HTTP 200 qua curl VÀ visual-verify (xem thumbnail đối chiếu đúng chủ đề sản phẩm) — audit lại 2026-08-30, KHÔNG dùng assets/img/ */

const MAX_PRICE = 18000000; /* trần slider — sản phẩm trên mức này vẫn hiển thị ở "Tất cả" (giá trị range mặc định) */

const CATEGORIES = [
  { slug: 'tat-ca', name: 'Tất cả' },
  { slug: 'sofa', name: 'Sofa & ghế bành' },
  { slug: 'ban', name: 'Bàn' },
  { slug: 'ghe', name: 'Ghế' },
  { slug: 'tu-ke', name: 'Tủ & kệ' },
  { slug: 'giuong', name: 'Giường ngủ' },
  { slug: 'den', name: 'Đèn trang trí' },
  { slug: 'trang-tri', name: 'Đồ trang trí' }
];

const MATERIALS = [
  { slug: 'go-tu-nhien', name: 'Gỗ tự nhiên' },
  { slug: 'go-cong-nghiep', name: 'Gỗ công nghiệp' },
  { slug: 'kim-loai', name: 'Kim loại' },
  { slug: 'vai-boc', name: 'Vải bọc' },
  { slug: 'da', name: 'Da' },
  { slug: 'may-tre', name: 'Mây tre đan' },
  { slug: 'khac', name: 'Khác' }
];

const COLORS = [
  { slug: 'nau-go', name: 'Nâu gỗ', hex: '#8b5e3c' },
  { slug: 'trang-kem', name: 'Trắng kem', hex: '#f3ece1' },
  { slug: 'den', name: 'Đen', hex: '#242424' },
  { slug: 'xam', name: 'Xám', hex: '#9a9691' },
  { slug: 'be', name: 'Be', hex: '#d8c7ac' },
  { slug: 'xanh-rem', name: 'Xanh rêu', hex: '#5c6b4f' }
];

const ROOMS = [
  { slug: 'phong-khach', name: 'Phòng khách' },
  { slug: 'phong-an', name: 'Phòng ăn' },
  { slug: 'phong-ngu', name: 'Phòng ngủ' },
  { slug: 'phong-lam-viec', name: 'Phòng làm việc' },
  { slug: 'ban-cong-san-vuon', name: 'Ban công & sân vườn' }
];

const COLLECTIONS = [
  {
    slug: 'scandinavian',
    name: 'Bắc Âu tối giản',
    desc: 'Đường nét thanh gọn, gỗ sáng màu và tông trung tính — cảm hứng từ nội thất Scandinavia.',
    image: 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=900&auto=format&fit=crop&q=80'
  },
  {
    slug: 'nhat-ban-zen',
    name: 'Nhật Bản Zen',
    desc: 'Không gian sống chậm, chi tiết mộc mạc và sự cân bằng của triết lý Wabi-sabi.',
    image: 'https://images.unsplash.com/photo-1618219944342-824e40a13285?w=900&auto=format&fit=crop&q=80'
  },
  {
    slug: 'industrial',
    name: 'Công nghiệp mộc mạc',
    desc: 'Kim loại thô, gam màu trầm và cấu trúc khỏe khoắn cho không gian cá tính.',
    image: 'https://images.unsplash.com/photo-1505873242700-f289a29e1e0f?w=900&auto=format&fit=crop&q=80'
  },
  {
    slug: 'vintage',
    name: 'Hoài cổ Vintage',
    desc: 'Chất liệu da, nhung và gỗ tối màu gợi nhắc vẻ đẹp cổ điển sang trọng.',
    image: 'https://images.unsplash.com/photo-1699901530443-bfda8755f66a?w=900&auto=format&fit=crop&q=80'
  }
];

const PRODUCTS = [
  /* ── SOFA & GHẾ BÀNH (7) ── */
  { id: 1, name: 'Sofa băng vải bố 3 chỗ ngồi Rustic', slug: 'sofa-bang-vai-bo-3-cho-rustic', price: 8900000, salePrice: 7490000, category: 'sofa', collection: 'scandinavian', material: 'vai-boc', color: 'be', room: 'phong-khach', rating: 4.7, sold: 186, stock: true, badge: 'sale', image: 'https://images.unsplash.com/photo-1759722665629-29df6ee4f9a5?w=700&auto=format&fit=crop&q=80' },
  { id: 2, name: 'Sofa góc chữ L da PU cao cấp Oslo', slug: 'sofa-goc-chu-l-da-pu-oslo', price: 15900000, salePrice: null, category: 'sofa', collection: 'vintage', material: 'da', color: 'den', room: 'phong-khach', rating: 4.8, sold: 94, stock: true, badge: 'hot', image: 'https://images.unsplash.com/photo-1723470917218-c21e7b3e87d4?w=700&auto=format&fit=crop&q=80' },
  { id: 3, name: 'Sofa đơn armchair bọc vải nỉ Tulip', slug: 'sofa-don-armchair-vai-ni-tulip', price: 3200000, salePrice: null, category: 'sofa', collection: 'scandinavian', material: 'vai-boc', color: 'xanh-rem', room: 'phong-khach', rating: 4.6, sold: 152, stock: true, badge: 'new', image: 'https://images.unsplash.com/photo-1579656592043-a20e25a4aa4b?w=700&auto=format&fit=crop&q=80' },
  { id: 4, name: 'Sofa giường đa năng gấp gọn Multi', slug: 'sofa-giuong-da-nang-multi', price: 6500000, salePrice: null, category: 'sofa', collection: 'industrial', material: 'vai-boc', color: 'xam', room: 'phong-khach', rating: 4.4, sold: 71, stock: true, badge: null, image: 'https://images.unsplash.com/photo-1646615760570-30a38e4ba704?w=700&auto=format&fit=crop&q=80' },
  { id: 5, name: 'Sofa văng gỗ tự nhiên khung sồi Nordic', slug: 'sofa-vang-go-soi-nordic', price: 11200000, salePrice: null, category: 'sofa', collection: 'scandinavian', material: 'go-tu-nhien', color: 'nau-go', room: 'phong-khach', rating: 4.9, sold: 63, stock: true, badge: null, image: 'https://images.unsplash.com/photo-1759722667581-16853f1ddcd0?w=700&auto=format&fit=crop&q=80' },
  { id: 6, name: 'Sofa mây tre đan phong cách Bali', slug: 'sofa-may-tre-dan-bali', price: 4800000, salePrice: null, category: 'sofa', collection: 'nhat-ban-zen', material: 'may-tre', color: 'nau-go', room: 'ban-cong-san-vuon', rating: 4.5, sold: 48, stock: true, badge: 'new', image: 'https://images.unsplash.com/photo-1577421759415-bba870669383?w=700&auto=format&fit=crop&q=80' },
  { id: 7, name: 'Sofa 2 chỗ ngồi vải nhung Emerald Velvet', slug: 'sofa-2-cho-vai-nhung-emerald', price: 5600000, salePrice: 4750000, category: 'sofa', collection: 'vintage', material: 'vai-boc', color: 'xanh-rem', room: 'phong-khach', rating: 4.7, sold: 109, stock: true, badge: 'sale', image: 'https://images.unsplash.com/photo-1763827513396-5917fc6c84f3?w=700&auto=format&fit=crop&q=80' },

  /* ── BÀN (7) ── */
  { id: 8, name: 'Bàn ăn gỗ sồi 6 ghế Skandi', slug: 'ban-an-go-soi-6-ghe-skandi', price: 14500000, salePrice: null, category: 'ban', collection: 'scandinavian', material: 'go-tu-nhien', color: 'nau-go', room: 'phong-an', rating: 4.8, sold: 57, stock: true, badge: null, image: 'https://images.unsplash.com/photo-1615920606214-6428b3324c74?w=700&auto=format&fit=crop&q=80' },
  { id: 9, name: 'Bàn trà mặt kính chân kim loại Orbit', slug: 'ban-tra-mat-kinh-orbit', price: 2450000, salePrice: null, category: 'ban', collection: 'industrial', material: 'kim-loai', color: 'den', room: 'phong-khach', rating: 4.5, sold: 133, stock: true, badge: null, image: 'https://images.unsplash.com/photo-1499955085172-a104c9463ece?w=700&auto=format&fit=crop&q=80' },
  { id: 10, name: 'Bàn làm việc gỗ công nghiệp Minimo', slug: 'ban-lam-viec-go-cn-minimo', price: 1890000, salePrice: null, category: 'ban', collection: 'scandinavian', material: 'go-cong-nghiep', color: 'trang-kem', room: 'phong-lam-viec', rating: 4.6, sold: 214, stock: true, badge: 'new', image: 'https://images.unsplash.com/photo-1611269154421-4e27233ac5c7?w=700&auto=format&fit=crop&q=80' },
  { id: 11, name: 'Bàn console phòng khách chân gỗ Slim', slug: 'ban-console-chan-go-slim', price: 3100000, salePrice: null, category: 'ban', collection: 'nhat-ban-zen', material: 'go-tu-nhien', color: 'nau-go', room: 'phong-khach', rating: 4.4, sold: 39, stock: true, badge: null, image: 'https://images.unsplash.com/photo-1609879938030-31acdeded104?w=700&auto=format&fit=crop&q=80' },
  { id: 12, name: 'Bàn ăn tròn mở rộng Extendo 4–6 người', slug: 'ban-an-tron-mo-rong-extendo', price: 6700000, salePrice: null, category: 'ban', collection: 'scandinavian', material: 'go-cong-nghiep', color: 'be', room: 'phong-an', rating: 4.7, sold: 88, stock: true, badge: 'hot', image: 'https://images.unsplash.com/photo-1599327286062-40b0a7f2b305?w=700&auto=format&fit=crop&q=80' },
  { id: 13, name: 'Bàn bar quầy bếp cao Counter Oak', slug: 'ban-bar-counter-oak', price: 4300000, salePrice: null, category: 'ban', collection: 'industrial', material: 'go-tu-nhien', color: 'nau-go', room: 'phong-an', rating: 4.3, sold: 27, stock: true, badge: null, image: 'https://images.unsplash.com/photo-1772016127953-19bb88908950?w=700&auto=format&fit=crop&q=80' },
  { id: 14, name: 'Bàn học sinh chống gù có kệ sách Study Pro', slug: 'ban-hoc-chong-gu-study-pro', price: 2150000, salePrice: 1790000, category: 'ban', collection: 'scandinavian', material: 'go-cong-nghiep', color: 'trang-kem', room: 'phong-lam-viec', rating: 4.6, sold: 176, stock: true, badge: 'sale', image: 'https://images.unsplash.com/photo-1766245205527-7de4de05e95f?w=700&auto=format&fit=crop&q=80' },

  /* ── GHẾ (7) ── */
  { id: 15, name: 'Ghế ăn bọc nệm chân gỗ Tulip Dining', slug: 'ghe-an-boc-nem-tulip', price: 890000, salePrice: null, category: 'ghe', collection: 'scandinavian', material: 'go-tu-nhien', color: 'be', room: 'phong-an', rating: 4.5, sold: 302, stock: true, badge: null, image: 'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=700&auto=format&fit=crop&q=80' },
  { id: 16, name: 'Ghế văn phòng công thái học ErgoFlex', slug: 'ghe-van-phong-ergoflex', price: 3450000, salePrice: null, category: 'ghe', collection: 'industrial', material: 'kim-loai', color: 'den', room: 'phong-lam-viec', rating: 4.8, sold: 241, stock: true, badge: 'hot', image: 'https://images.unsplash.com/photo-1681418659069-eef28d44aeab?w=700&auto=format&fit=crop&q=80' },
  { id: 17, name: 'Ghế bar chân kim loại Nordic Stool', slug: 'ghe-bar-nordic-stool', price: 750000, salePrice: null, category: 'ghe', collection: 'industrial', material: 'kim-loai', color: 'xam', room: 'phong-an', rating: 4.3, sold: 118, stock: true, badge: null, image: 'https://images.unsplash.com/photo-1552324190-9e86fa095c4a?w=700&auto=format&fit=crop&q=80' },
  { id: 18, name: 'Ghế bành thư giãn bọc da Lounge Chair', slug: 'ghe-banh-lounge-chair-da', price: 5900000, salePrice: null, category: 'ghe', collection: 'vintage', material: 'da', color: 'nau-go', room: 'phong-khach', rating: 4.9, sold: 66, stock: true, badge: null, image: 'https://images.unsplash.com/photo-1650167202574-d8448576292a?w=700&auto=format&fit=crop&q=80' },
  { id: 19, name: 'Ghế ăn mây tự nhiên đan tay Rattan Weave', slug: 'ghe-an-may-rattan-weave', price: 1250000, salePrice: null, category: 'ghe', collection: 'nhat-ban-zen', material: 'may-tre', color: 'nau-go', room: 'phong-an', rating: 4.6, sold: 84, stock: true, badge: 'new', image: 'https://images.unsplash.com/photo-1686806372785-fcfe9efa9b70?w=700&auto=format&fit=crop&q=80' },
  { id: 20, name: 'Ghế xoay làm việc lưng lưới Mesh Comfort', slug: 'ghe-xoay-mesh-comfort', price: 1680000, salePrice: 1390000, category: 'ghe', collection: 'industrial', material: 'kim-loai', color: 'xam', room: 'phong-lam-viec', rating: 4.5, sold: 197, stock: true, badge: 'sale', image: 'https://images.unsplash.com/photo-1688578735427-994ecdea3ea4?w=700&auto=format&fit=crop&q=80' },
  { id: 21, name: 'Ghế đôn gỗ tròn đa năng Stool Wood', slug: 'ghe-don-go-tron-stool-wood', price: 590000, salePrice: null, category: 'ghe', collection: 'nhat-ban-zen', material: 'go-tu-nhien', color: 'nau-go', room: 'phong-khach', rating: 4.4, sold: 143, stock: true, badge: null, image: 'https://images.unsplash.com/photo-1540809799-5da9372c3f64?w=700&auto=format&fit=crop&q=80' },

  /* ── TỦ & KỆ (8) ── */
  { id: 22, name: 'Tủ quần áo 3 cánh gỗ công nghiệp Wardrobe MDF', slug: 'tu-quan-ao-3-canh-wardrobe-mdf', price: 7200000, salePrice: null, category: 'tu-ke', collection: 'scandinavian', material: 'go-cong-nghiep', color: 'trang-kem', room: 'phong-ngu', rating: 4.6, sold: 71, stock: true, badge: null, image: 'https://images.unsplash.com/photo-1662454419622-a41092ecd245?w=700&auto=format&fit=crop&q=80' },
  { id: 23, name: 'Kệ tivi treo tường gỗ óc chó Walnut TV Console', slug: 'ke-tivi-walnut-tv-console', price: 4600000, salePrice: null, category: 'tu-ke', collection: 'nhat-ban-zen', material: 'go-tu-nhien', color: 'nau-go', room: 'phong-khach', rating: 4.7, sold: 59, stock: true, badge: 'hot', image: 'https://images.unsplash.com/photo-1617229538605-7d9054d75104?w=700&auto=format&fit=crop&q=80' },
  { id: 24, name: 'Kệ sách 5 tầng khung thép Industrial Shelf', slug: 'ke-sach-5-tang-industrial-shelf', price: 2300000, salePrice: null, category: 'tu-ke', collection: 'industrial', material: 'kim-loai', color: 'den', room: 'phong-lam-viec', rating: 4.5, sold: 122, stock: true, badge: null, image: 'https://images.unsplash.com/photo-1668584086736-852b7b5a4260?w=700&auto=format&fit=crop&q=80' },
  { id: 25, name: 'Tủ giày thông minh cửa lật Shoe Cabinet', slug: 'tu-giay-cua-lat-shoe-cabinet', price: 1950000, salePrice: null, category: 'tu-ke', collection: 'scandinavian', material: 'go-cong-nghiep', color: 'trang-kem', room: 'phong-khach', rating: 4.4, sold: 165, stock: true, badge: 'new', image: 'https://images.unsplash.com/photo-1593720947007-8d77fe2733a7?w=700&auto=format&fit=crop&q=80' },
  { id: 26, name: 'Tủ đầu giường 2 ngăn kéo Nightstand Oak', slug: 'tu-dau-giuong-nightstand-oak', price: 1350000, salePrice: null, category: 'tu-ke', collection: 'nhat-ban-zen', material: 'go-tu-nhien', color: 'nau-go', room: 'phong-ngu', rating: 4.6, sold: 208, stock: true, badge: null, image: 'https://images.unsplash.com/photo-1630835016348-ba2854bbf78b?w=700&auto=format&fit=crop&q=80' },
  { id: 27, name: 'Kệ góc trang trí đa năng Corner Shelf', slug: 'ke-goc-da-nang-corner-shelf', price: 890000, salePrice: 690000, category: 'tu-ke', collection: 'scandinavian', material: 'go-cong-nghiep', color: 'be', room: 'phong-khach', rating: 4.3, sold: 97, stock: true, badge: 'sale', image: 'https://images.unsplash.com/photo-1572060728039-748cba8c3c75?w=700&auto=format&fit=crop&q=80' },
  { id: 28, name: 'Tủ bếp treo tường mở Kitchen Open Shelf', slug: 'tu-bep-treo-tuong-open-shelf', price: 2750000, salePrice: null, category: 'tu-ke', collection: 'scandinavian', material: 'go-cong-nghiep', color: 'trang-kem', room: 'phong-an', rating: 4.4, sold: 44, stock: true, badge: null, image: 'https://images.unsplash.com/photo-1647021453272-dd4fa8dea8b2?w=700&auto=format&fit=crop&q=80' },
  { id: 29, name: 'Tủ hồ sơ văn phòng khóa an toàn Office Cabinet', slug: 'tu-ho-so-office-cabinet', price: 3100000, salePrice: null, category: 'tu-ke', collection: 'industrial', material: 'kim-loai', color: 'xam', room: 'phong-lam-viec', rating: 4.2, sold: 33, stock: true, badge: null, image: 'https://images.unsplash.com/photo-1707185792575-5c4afd1ff186?w=700&auto=format&fit=crop&q=80' },

  /* ── ĐÈN TRANG TRÍ (6) ── */
  { id: 30, name: 'Đèn cây đứng chân gỗ chao vải Floor Lamp Linen', slug: 'den-cay-dung-floor-lamp-linen', price: 1450000, salePrice: null, category: 'den', collection: 'nhat-ban-zen', material: 'go-tu-nhien', color: 'nau-go', room: 'phong-khach', rating: 4.6, sold: 78, stock: true, badge: 'new', image: 'https://images.unsplash.com/photo-1561664701-5b89dafffdd5?w=700&auto=format&fit=crop&q=80' },
  { id: 31, name: 'Đèn bàn làm việc điều chỉnh góc LED Desk Lamp', slug: 'den-ban-lam-viec-led-desk-lamp', price: 590000, salePrice: null, category: 'den', collection: 'industrial', material: 'kim-loai', color: 'den', room: 'phong-lam-viec', rating: 4.5, sold: 261, stock: true, badge: null, image: 'https://images.unsplash.com/photo-1543512214-4f76e81f8bfc?w=700&auto=format&fit=crop&q=80' },
  { id: 32, name: 'Đèn trần thả pha lê hiện đại Chandelier Crystal', slug: 'den-tran-tha-chandelier-crystal', price: 3900000, salePrice: null, category: 'den', collection: 'vintage', material: 'kim-loai', color: 'trang-kem', room: 'phong-khach', rating: 4.7, sold: 52, stock: true, badge: 'hot', image: 'https://images.unsplash.com/photo-1698577289907-3a32072c386e?w=700&auto=format&fit=crop&q=80' },
  { id: 33, name: 'Đèn ngủ đầu giường cảm ứng chạm Touch Night Lamp', slug: 'den-ngu-cam-ung-touch-night-lamp', price: 420000, salePrice: 350000, category: 'den', collection: 'scandinavian', material: 'go-cong-nghiep', color: 'be', room: 'phong-ngu', rating: 4.4, sold: 189, stock: true, badge: 'sale', image: 'https://images.unsplash.com/photo-1517862774645-dd398fbfaffa?w=700&auto=format&fit=crop&q=80' },
  { id: 34, name: 'Đèn treo tường trang trí Wall Sconce Brass', slug: 'den-treo-tuong-wall-sconce-brass', price: 680000, salePrice: null, category: 'den', collection: 'vintage', material: 'kim-loai', color: 'nau-go', room: 'phong-khach', rating: 4.3, sold: 61, stock: true, badge: null, image: 'https://images.unsplash.com/photo-1659100171587-a8a5e9d9417a?w=700&auto=format&fit=crop&q=80' },
  { id: 35, name: 'Đèn thả bàn ăn dây treo điều chỉnh Pendant Rattan', slug: 'den-tha-ban-an-pendant-rattan', price: 990000, salePrice: null, category: 'den', collection: 'nhat-ban-zen', material: 'may-tre', color: 'nau-go', room: 'phong-an', rating: 4.6, sold: 87, stock: true, badge: null, image: 'https://images.unsplash.com/photo-1564586880927-99376cbf0f4f?w=700&auto=format&fit=crop&q=80' },

  /* ── ĐỒ TRANG TRÍ (6) ── */
  { id: 36, name: 'Gương tròn viền gỗ trang trí Round Mirror Oak', slug: 'guong-tron-vien-go-round-mirror', price: 780000, salePrice: null, category: 'trang-tri', collection: 'nhat-ban-zen', material: 'go-tu-nhien', color: 'nau-go', room: 'phong-khach', rating: 4.7, sold: 134, stock: true, badge: 'new', image: 'https://images.unsplash.com/photo-1631679706909-1844bbd07221?w=700&auto=format&fit=crop&q=80' },
  { id: 37, name: 'Thảm trải sàn lông ngắn Soft Rug Beige', slug: 'tham-trai-san-soft-rug-beige', price: 1250000, salePrice: null, category: 'trang-tri', collection: 'scandinavian', material: 'vai-boc', color: 'be', room: 'phong-khach', rating: 4.5, sold: 96, stock: true, badge: null, image: 'https://images.unsplash.com/photo-1620230757457-772a4712a926?w=700&auto=format&fit=crop&q=80' },
  { id: 38, name: 'Tranh treo tường canvas trừu tượng Abstract Canvas', slug: 'tranh-canvas-abstract', price: 650000, salePrice: null, category: 'trang-tri', collection: 'industrial', material: 'khac', color: 'be', room: 'phong-khach', rating: 4.4, sold: 58, stock: true, badge: null, image: 'https://images.unsplash.com/photo-1598240087583-2f610faf1eaf?w=700&auto=format&fit=crop&q=80' },
  { id: 39, name: 'Bình hoa gốm trang trí để bàn Ceramic Vase', slug: 'binh-hoa-gom-ceramic-vase', price: 320000, salePrice: 260000, category: 'trang-tri', collection: 'nhat-ban-zen', material: 'khac', color: 'trang-kem', room: 'phong-khach', rating: 4.6, sold: 221, stock: true, badge: 'sale', image: 'https://images.unsplash.com/photo-1612196808214-b8e1d6145a8c?w=700&auto=format&fit=crop&q=80' },
  { id: 40, name: 'Gối tựa lưng sofa họa tiết Cushion Cover Set', slug: 'goi-tua-cushion-cover-set', price: 280000, salePrice: null, category: 'trang-tri', collection: 'vintage', material: 'vai-boc', color: 'xanh-rem', room: 'phong-khach', rating: 4.3, sold: 312, stock: true, badge: null, image: 'https://images.unsplash.com/photo-1591456196771-c6d35c4e2683?w=700&auto=format&fit=crop&q=80' },
  { id: 41, name: 'Rèm cửa vải lanh chống nắng Linen Curtain', slug: 'rem-cua-vai-lanh-linen-curtain', price: 890000, salePrice: null, category: 'trang-tri', collection: 'scandinavian', material: 'vai-boc', color: 'be', room: 'phong-khach', rating: 4.4, sold: 73, stock: true, badge: 'new', image: 'https://images.unsplash.com/photo-1578500467296-441a11d5d55a?w=700&auto=format&fit=crop&q=80' },

  /* ── GIƯỜNG NGỦ (3) ── */
  { id: 42, name: 'Giường ngủ gỗ tự nhiên khung sồi Oak Bed Frame 1m8', slug: 'giuong-ngu-oak-bed-frame-1m8', price: 12500000, salePrice: null, category: 'giuong', collection: 'nhat-ban-zen', material: 'go-tu-nhien', color: 'nau-go', room: 'phong-ngu', rating: 4.8, sold: 46, stock: true, badge: 'hot', image: 'https://images.unsplash.com/photo-1663337049364-5c6ba8ba1e78?w=700&auto=format&fit=crop&q=80' },
  { id: 43, name: 'Giường tầng trẻ em an toàn Kids Bunk Bed', slug: 'giuong-tang-tre-em-bunk-bed', price: 8900000, salePrice: null, category: 'giuong', collection: 'scandinavian', material: 'go-cong-nghiep', color: 'trang-kem', room: 'phong-ngu', rating: 4.6, sold: 29, stock: true, badge: null, image: 'https://images.unsplash.com/photo-1588939349575-7ab15c8bd1ef?w=700&auto=format&fit=crop&q=80' },
  { id: 44, name: 'Giường bọc nệm da cao cấp Upholstered Bed 1m6', slug: 'giuong-boc-da-upholstered-bed-1m6', price: 16900000, salePrice: 14500000, category: 'giuong', collection: 'vintage', material: 'da', color: 'xam', room: 'phong-ngu', rating: 4.9, sold: 21, stock: true, badge: 'sale', image: 'https://images.unsplash.com/photo-1580948516270-b914bd6bccf3?w=700&auto=format&fit=crop&q=80' }
];
