// ══ LUMIÈRE BEAUTY — Dữ liệu sản phẩm mock ══
// 36 sản phẩm, 5 danh mục, đủ 3 trang phân trang (12/trang)
// theme: 'ban-chay' | 'hang-moi' | 'giam-gia'
// skinType: 'da-dau' | 'da-kho' | 'da-hon-hop' | 'da-nhay-cam' | 'moi-loai-da'

const PRODUCTS = [
  // === CHĂM SÓC DA (8 sản phẩm) ===
  {
    id: 1, name: 'Serum Vitamin C & Niacinamide', slug: 'serum-vitamin-c-niacinamide',
    price: 580000, salePrice: null, category: 'cham-soc-da',
    theme: ['ban-chay', 'hang-moi'], skinType: ['da-dau', 'da-hon-hop'],
    brand: 'The Ordinary', rating: 4.8, sold: 248, stock: true, badge: 'hot',
    image: 'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=600&auto=format&fit=crop&q=80'
  },
  {
    id: 2, name: 'Kem Dưỡng Ẩm Sâu Hyaluronic', slug: 'kem-duong-am-sau-hyaluronic',
    price: 720000, salePrice: null, category: 'cham-soc-da',
    theme: ['ban-chay'], skinType: ['da-kho', 'da-nhay-cam', 'moi-loai-da'],
    brand: 'CeraVe', rating: 4.7, sold: 195, stock: true, badge: null,
    image: 'https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?w=600&auto=format&fit=crop&q=80'
  },
  {
    id: 3, name: 'Toner Cân Bằng Da pH Essence', slug: 'toner-can-bang-da-ph',
    price: 390000, salePrice: null, category: 'cham-soc-da',
    theme: ['ban-chay'], skinType: ['da-dau', 'da-hon-hop', 'moi-loai-da'],
    brand: 'Innisfree', rating: 4.5, sold: 173, stock: true, badge: null,
    image: 'https://images.unsplash.com/photo-1609840114035-3c981b782dfe?w=600&auto=format&fit=crop&q=80'
  },
  {
    id: 4, name: 'Sữa Rửa Mặt Dịu Nhẹ Ceramide', slug: 'sua-rua-mat-diu-nhe-ceramide',
    price: 320000, salePrice: null, category: 'cham-soc-da',
    theme: ['hang-moi'], skinType: ['da-nhay-cam', 'moi-loai-da'],
    brand: 'CeraVe', rating: 4.6, sold: 142, stock: true, badge: 'new',
    image: 'https://images.unsplash.com/photo-1585238342024-78d387f4a707?w=600&auto=format&fit=crop&q=80'
  },
  {
    id: 5, name: 'Kem Chống Nắng SPF50+ PA++++', slug: 'kem-chong-nang-spf50-pa',
    price: 450000, salePrice: 360000, category: 'cham-soc-da',
    theme: ['ban-chay', 'giam-gia'], skinType: ['moi-loai-da'],
    brand: 'Anessa', rating: 4.9, sold: 312, stock: true, badge: 'sale',
    image: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=600&auto=format&fit=crop&q=80'
  },
  {
    id: 6, name: 'Mặt Nạ Dưỡng Da Ngủ Laneige', slug: 'mat-na-duong-da-ngu-laneige',
    price: 680000, salePrice: 520000, category: 'cham-soc-da',
    theme: ['giam-gia'], skinType: ['moi-loai-da'],
    brand: 'Laneige', rating: 4.4, sold: 98, stock: true, badge: 'sale',
    image: 'https://images.unsplash.com/photo-1612817288484-6f916006741a?w=600&auto=format&fit=crop&q=80'
  },
  {
    id: 7, name: 'Kem Mắt Chống Lão Hóa Collagen', slug: 'kem-mat-chong-lao-hoa-collagen',
    price: 850000, salePrice: null, category: 'cham-soc-da',
    theme: ['hang-moi'], skinType: ['moi-loai-da'],
    brand: 'Sulwhasoo', rating: 4.8, sold: 67, stock: true, badge: 'new',
    image: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=600&auto=format&fit=crop&q=80'
  },
  {
    id: 8, name: 'Retinol Serum 0.5% Anti-Aging', slug: 'retinol-serum-05-anti-aging',
    price: 690000, salePrice: null, category: 'cham-soc-da',
    theme: ['ban-chay'], skinType: ['da-kho', 'moi-loai-da'],
    brand: 'The Ordinary', rating: 4.7, sold: 178, stock: true, badge: null,
    image: 'https://images.unsplash.com/photo-1619451334792-150fd785ee74?w=600&auto=format&fit=crop&q=80'
  },

  // === TRANG ĐIỂM (8 sản phẩm) ===
  {
    id: 9, name: 'Kem Nền Lâu Trôi Pro Longwear', slug: 'kem-nen-lau-troi-pro-longwear',
    price: 890000, salePrice: null, category: 'trang-diem',
    theme: ['ban-chay'], skinType: ['da-dau', 'da-hon-hop'],
    brand: 'MAC', rating: 4.8, sold: 224, stock: true, badge: 'hot',
    image: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=600&auto=format&fit=crop&q=80'
  },
  {
    id: 10, name: 'Son Môi Velvet Liquid Rouge', slug: 'son-moi-velvet-liquid-rouge',
    price: 520000, salePrice: null, category: 'trang-diem',
    theme: ['ban-chay', 'hang-moi'], skinType: ['moi-loai-da'],
    brand: 'Charlotte Tilbury', rating: 4.9, sold: 289, stock: true, badge: 'new',
    image: 'https://images.unsplash.com/photo-1551038247-3d9af20df552?w=600&auto=format&fit=crop&q=80'
  },
  {
    id: 11, name: 'Phấn Mắt 16 Màu Smoky Eyes', slug: 'phan-mat-16-mau-smoky-eyes',
    price: 750000, salePrice: null, category: 'trang-diem',
    theme: ['ban-chay'], skinType: ['moi-loai-da'],
    brand: 'MAC', rating: 4.7, sold: 156, stock: true, badge: null,
    image: 'https://images.unsplash.com/photo-1538332576228-eb5b4c4de6f5?w=600&auto=format&fit=crop&q=80'
  },
  {
    id: 12, name: 'Mascara Dài Mi Ultra Volume', slug: 'mascara-dai-mi-ultra-volume',
    price: 390000, salePrice: 299000, category: 'trang-diem',
    theme: ['giam-gia'], skinType: ['moi-loai-da'],
    brand: "L'Occitane", rating: 4.5, sold: 134, stock: true, badge: 'sale',
    image: 'https://images.unsplash.com/photo-1607344645866-009c320b63e0?w=600&auto=format&fit=crop&q=80'
  },
  {
    id: 13, name: 'Kem Che Khuyết Điểm HD Cover', slug: 'kem-che-khuyet-diem-hd',
    price: 420000, salePrice: null, category: 'trang-diem',
    theme: ['hang-moi'], skinType: ['da-kho', 'da-nhay-cam'],
    brand: 'Charlotte Tilbury', rating: 4.6, sold: 89, stock: true, badge: 'new',
    image: 'https://images.unsplash.com/photo-1592136957897-b2b6ca21e10d?w=600&auto=format&fit=crop&q=80'
  },
  {
    id: 14, name: 'Má Hồng Peach Glow Blush', slug: 'ma-hong-peach-glow-blush',
    price: 580000, salePrice: null, category: 'trang-diem',
    theme: ['hang-moi'], skinType: ['moi-loai-da'],
    brand: 'Charlotte Tilbury', rating: 4.8, sold: 112, stock: true, badge: 'new',
    image: 'https://images.unsplash.com/photo-1548247416-ec66f4900b2e?w=600&auto=format&fit=crop&q=80'
  },
  {
    id: 15, name: 'Highlighter Satin Glow', slug: 'highlighter-satin-glow',
    price: 490000, salePrice: 370000, category: 'trang-diem',
    theme: ['giam-gia'], skinType: ['moi-loai-da'],
    brand: 'MAC', rating: 4.6, sold: 78, stock: true, badge: 'sale',
    image: 'https://images.unsplash.com/photo-1542736143-29a8432162bc?w=600&auto=format&fit=crop&q=80'
  },
  {
    id: 16, name: 'Phấn Phủ Kiểm Dầu Translucent', slug: 'phan-phu-kiem-dau-translucent',
    price: 620000, salePrice: null, category: 'trang-diem',
    theme: ['ban-chay'], skinType: ['da-dau', 'da-hon-hop'],
    brand: 'MAC', rating: 4.7, sold: 189, stock: true, badge: null,
    image: 'https://images.unsplash.com/photo-1519638831568-d9897f54ed69?w=600&auto=format&fit=crop&q=80'
  },

  // === CHĂM SÓC TÓC (7 sản phẩm) ===
  {
    id: 17, name: 'Dầu Gội Phục Hồi Hư Tổn', slug: 'dau-goi-phuc-hoi-hu-ton',
    price: 380000, salePrice: null, category: 'cham-soc-toc',
    theme: ['ban-chay'], skinType: ['moi-loai-da'],
    brand: 'Kérastase', rating: 4.7, sold: 201, stock: true, badge: null,
    image: 'https://images.unsplash.com/photo-1574482620811-1aa16ffe3c82?w=600&auto=format&fit=crop&q=80'
  },
  {
    id: 18, name: 'Dầu Xả Keratin Phục Hồi Sâu', slug: 'dau-xa-keratin-phuc-hoi-sau',
    price: 420000, salePrice: null, category: 'cham-soc-toc',
    theme: ['ban-chay'], skinType: ['moi-loai-da'],
    brand: 'Kérastase', rating: 4.6, sold: 167, stock: true, badge: null,
    image: 'https://images.unsplash.com/photo-1563178406-4cdc2923acbc?w=600&auto=format&fit=crop&q=80'
  },
  {
    id: 19, name: 'Mặt Nạ Tóc Collagen Deep Care', slug: 'mat-na-toc-collagen-deep',
    price: 550000, salePrice: 420000, category: 'cham-soc-toc',
    theme: ['giam-gia'], skinType: ['moi-loai-da'],
    brand: "L'Occitane", rating: 4.5, sold: 89, stock: true, badge: 'sale',
    image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&auto=format&fit=crop&q=80'
  },
  {
    id: 20, name: 'Tinh Dầu Dưỡng Tóc Argan Oil', slug: 'tinh-dau-duong-toc-argan',
    price: 680000, salePrice: null, category: 'cham-soc-toc',
    theme: ['hang-moi'], skinType: ['moi-loai-da'],
    brand: "L'Occitane", rating: 4.8, sold: 124, stock: true, badge: 'new',
    image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=600&auto=format&fit=crop&q=80'
  },
  {
    id: 21, name: 'Xịt Dưỡng Tóc Leave-In', slug: 'xit-duong-toc-leave-in',
    price: 310000, salePrice: 240000, category: 'cham-soc-toc',
    theme: ['giam-gia'], skinType: ['moi-loai-da'],
    brand: 'Kérastase', rating: 4.4, sold: 76, stock: true, badge: 'sale',
    image: 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=600&auto=format&fit=crop&q=80'
  },
  {
    id: 22, name: 'Serum Tóc Chống Đứt Gãy', slug: 'serum-toc-chong-dut-gay',
    price: 490000, salePrice: null, category: 'cham-soc-toc',
    theme: ['ban-chay'], skinType: ['moi-loai-da'],
    brand: 'Kérastase', rating: 4.7, sold: 143, stock: true, badge: null,
    image: 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=600&auto=format&fit=crop&q=80'
  },
  {
    id: 23, name: 'Kem Ủ Tóc Phục Hồi Overnight', slug: 'kem-u-toc-phuc-hoi-overnight',
    price: 360000, salePrice: null, category: 'cham-soc-toc',
    theme: ['hang-moi'], skinType: ['moi-loai-da'],
    brand: "L'Occitane", rating: 4.5, sold: 58, stock: true, badge: 'new',
    image: 'https://images.unsplash.com/photo-1631729371254-42c2892f0e6e?w=600&auto=format&fit=crop&q=80'
  },

  // === NƯỚC HOA (6 sản phẩm) ===
  {
    id: 24, name: 'Nước Hoa Floral Bloom EDP', slug: 'nuoc-hoa-floral-bloom-edp',
    price: 1850000, salePrice: null, category: 'nuoc-hoa',
    theme: ['ban-chay', 'hang-moi'], skinType: ['moi-loai-da'],
    brand: 'Chanel', rating: 4.9, sold: 87, stock: true, badge: 'new',
    image: 'https://images.unsplash.com/photo-1527799820374-dcf8d9d4a388?w=600&auto=format&fit=crop&q=80'
  },
  {
    id: 25, name: 'Nước Hoa Rose Noir EDP 75ml', slug: 'nuoc-hoa-rose-noir-edp',
    price: 2100000, salePrice: null, category: 'nuoc-hoa',
    theme: ['ban-chay'], skinType: ['moi-loai-da'],
    brand: 'Chanel', rating: 4.8, sold: 64, stock: true, badge: null,
    image: 'https://images.unsplash.com/photo-1521341957697-b93449760f30?w=600&auto=format&fit=crop&q=80'
  },
  {
    id: 26, name: 'Tinh Dầu Khuếch Tán Phòng', slug: 'tinh-dau-khuech-tan-phong',
    price: 680000, salePrice: 520000, category: 'nuoc-hoa',
    theme: ['giam-gia'], skinType: ['moi-loai-da'],
    brand: "L'Occitane", rating: 4.6, sold: 112, stock: true, badge: 'sale',
    image: 'https://images.unsplash.com/photo-1527239441953-caffd968d952?w=600&auto=format&fit=crop&q=80'
  },
  {
    id: 27, name: 'Nước Hoa Tóc Floral Hair Mist', slug: 'nuoc-hoa-toc-floral-mist',
    price: 480000, salePrice: null, category: 'nuoc-hoa',
    theme: ['hang-moi'], skinType: ['moi-loai-da'],
    brand: 'Chanel', rating: 4.5, sold: 45, stock: true, badge: 'new',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80'
  },
  {
    id: 28, name: 'Set Nước Hoa Mini 5 Mùi', slug: 'set-nuoc-hoa-mini-5-mui',
    price: 950000, salePrice: 720000, category: 'nuoc-hoa',
    theme: ['giam-gia'], skinType: ['moi-loai-da'],
    brand: 'Chanel', rating: 4.7, sold: 98, stock: true, badge: 'sale',
    image: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=600&auto=format&fit=crop&q=80'
  },
  {
    id: 29, name: 'Nước Hoa Oriental Oud Noir EDP', slug: 'nuoc-hoa-oriental-oud-noir',
    price: 2500000, salePrice: null, category: 'nuoc-hoa',
    theme: ['ban-chay'], skinType: ['moi-loai-da'],
    brand: 'Chanel', rating: 4.9, sold: 38, stock: true, badge: null,
    image: 'https://images.unsplash.com/photo-1551292831-023188e78222?w=600&auto=format&fit=crop&q=80'
  },

  // === DỤNG CỤ LÀM ĐẸP (7 sản phẩm) ===
  {
    id: 30, name: 'Máy Rửa Mặt Sonic Vibration', slug: 'may-rua-mat-sonic-vibration',
    price: 1250000, salePrice: null, category: 'dung-cu-lam-dep',
    theme: ['ban-chay'], skinType: ['moi-loai-da'],
    brand: 'Foreo', rating: 4.8, sold: 145, stock: true, badge: 'hot',
    image: 'https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?w=600&auto=format&fit=crop&q=80'
  },
  {
    id: 31, name: 'Bộ Cọ Trang Điểm 12 Cái', slug: 'bo-co-trang-diem-12-cai',
    price: 680000, salePrice: null, category: 'dung-cu-lam-dep',
    theme: ['ban-chay'], skinType: ['moi-loai-da'],
    brand: 'MAC', rating: 4.7, sold: 132, stock: true, badge: null,
    image: 'https://images.unsplash.com/photo-1506252374453-ef5237291d83?w=600&auto=format&fit=crop&q=80'
  },
  {
    id: 32, name: 'Bông Tán Phấn Đàn Hồi Velvet', slug: 'bong-tan-phan-dan-hoi-velvet',
    price: 120000, salePrice: 89000, category: 'dung-cu-lam-dep',
    theme: ['giam-gia'], skinType: ['moi-loai-da'],
    brand: 'Generic', rating: 4.3, sold: 78, stock: true, badge: 'sale',
    image: 'https://images.unsplash.com/photo-1525268771113-32d9e9021a97?w=600&auto=format&fit=crop&q=80'
  },
  {
    id: 33, name: 'Gương Trang Điểm LED 3 Chế Độ', slug: 'guong-trang-diem-led-3-che-do',
    price: 890000, salePrice: null, category: 'dung-cu-lam-dep',
    theme: ['hang-moi'], skinType: ['moi-loai-da'],
    brand: 'Generic', rating: 4.6, sold: 67, stock: true, badge: 'new',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=600&auto=format&fit=crop&q=80'
  },
  {
    id: 34, name: 'Máy Cuộn Mi Hơi Nóng Tự Động', slug: 'may-cuon-mi-hoi-nong',
    price: 350000, salePrice: 270000, category: 'dung-cu-lam-dep',
    theme: ['giam-gia'], skinType: ['moi-loai-da'],
    brand: 'Generic', rating: 4.4, sold: 56, stock: true, badge: 'sale',
    image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=600&auto=format&fit=crop&q=80'
  },
  {
    id: 35, name: 'Lăn Đá Thạch Anh Hồng Dưỡng Da', slug: 'lan-da-thach-anh-hong',
    price: 480000, salePrice: null, category: 'dung-cu-lam-dep',
    theme: ['ban-chay', 'hang-moi'], skinType: ['moi-loai-da'],
    brand: 'Generic', rating: 4.7, sold: 198, stock: true, badge: null,
    image: 'https://images.unsplash.com/photo-1568702846914-96b305d2aaeb?w=600&auto=format&fit=crop&q=80'
  },
  {
    id: 36, name: 'Máy Xịt Khoáng Nano Mist Facial', slug: 'may-xit-khoang-nano-mist',
    price: 290000, salePrice: null, category: 'dung-cu-lam-dep',
    theme: ['ban-chay'], skinType: ['moi-loai-da'],
    brand: 'Generic', rating: 4.5, sold: 134, stock: true, badge: null,
    image: 'https://images.unsplash.com/photo-1519984388953-d2406bc725e1?w=600&auto=format&fit=crop&q=80'
  }
];

// Helper: format VND
function mpFmt(n) {
  return n.toLocaleString('vi-VN') + 'đ';
}

// Helper: SVG placeholder
const MP_PLACEHOLDER = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='600' height='800'%3E%3Crect width='100%25' height='100%25' fill='%23f5ebe8'/%3E%3C/svg%3E";

// Helper: render card HTML
function mpRenderCard(p) {
  const badgeMap = { new: ['Mới', '#22c55e'], sale: ['Sale', '#e24b4a'], hot: ['Hot', '#d97706'] };
  const badge = (p.badge && badgeMap[p.badge])
    ? `<span class="mp-badge" style="background:${badgeMap[p.badge][1]}" aria-label="${badgeMap[p.badge][0]}">${badgeMap[p.badge][0]}</span>` : '';
  const priceHtml = p.salePrice
    ? `<div class="mp-card-price"><span class="mp-price-current mp-price-sale">${mpFmt(p.salePrice)}</span><span class="mp-price-original">${mpFmt(p.price)}</span></div>`
    : `<div class="mp-card-price"><span class="mp-price-current">${mpFmt(p.price)}</span></div>`;
  return `<div class="mp-card" data-product-id="${p.id}">
    <a href="chi-tiet-san-pham.html" class="mp-card-img-wrap" aria-label="${p.name}">
      <img src="${p.image}" alt="${p.name}" class="mp-card-img" loading="lazy" onerror="this.src='${MP_PLACEHOLDER}'">
      ${badge}
    </a>
    <div class="mp-card-body">
      <div class="mp-card-brand">${p.brand}</div>
      <div class="mp-card-name"><a href="chi-tiet-san-pham.html">${p.name}</a></div>
      ${priceHtml}
      <div class="mp-card-meta">⭐ ${p.rating} · Đã bán ${p.sold}+</div>
      <div class="mp-card-trust"><span>✓ Chính hãng</span> · Đổi trả 30 ngày</div>
      <button class="mp-btn-cart" data-cart-btn data-id="${p.id}" aria-label="Thêm ${p.name} vào giỏ">+ Thêm vào giỏ</button>
    </div>
  </div>`;
}

// Cart helpers
function mpAddToCart(id) {
  const product = PRODUCTS.find(p => p.id === id);
  if (!product) return;
  const cart = JSON.parse(localStorage.getItem('mp_cart') || '[]');
  const existing = cart.find(i => i.id === id);
  if (existing) { existing.qty++; }
  else { cart.push({ id: product.id, name: product.name, price: product.price, salePrice: product.salePrice, image: product.image, brand: product.brand, qty: 1 }); }
  localStorage.setItem('mp_cart', JSON.stringify(cart));
  mpUpdateCartCount();
  const btn = document.querySelector(`[data-cart-btn][data-id="${id}"]`);
  if (btn) { const orig = btn.textContent; btn.textContent = '✓ Đã thêm'; btn.style.background = 'var(--accent)'; btn.style.color = '#fff'; setTimeout(() => { btn.textContent = orig; btn.style.background = ''; btn.style.color = ''; }, 1200); }
}

function mpUpdateCartCount() {
  const cart = JSON.parse(localStorage.getItem('mp_cart') || '[]');
  const total = cart.reduce((s, i) => s + i.qty, 0);
  const el = document.getElementById('mpCartCount');
  if (el) { el.textContent = total; el.classList.toggle('has-items', total > 0); }
}
