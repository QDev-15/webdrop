# Template Nhà hàng & Cafe — Hướng dẫn chỉnh nội dung

Template website đẹp mắt cho nhà hàng, quán cafe, quán ăn.

## Các trang
| File | Trang |
|---|---|
| `index.html` | Trang chủ — hero, món nổi bật, về nhà hàng, reviews, CTA |
| `thuc-don.html` | Thực đơn — filter theo loại, ảnh món ăn, giá |
| `dat-ban.html` | Đặt bàn — form chọn ngày/giờ/khu vực/số người |
| `lien-he.html` | Liên hệ — form + bản đồ + giờ mở cửa |

## Yêu cầu kỹ thuật
- Mở thẳng trên trình duyệt — không cần cài đặt gì
- Bootstrap 5.3.3 (CDN)
- Font DM Sans (Google Fonts)
- Vanilla JS thuần

## Cách chỉnh nội dung

### 1. Tên nhà hàng & logo
Tìm và thay tên mặc định bằng tên nhà hàng/cafe của bạn trong tất cả file HTML.

### 2. Thông tin liên hệ & giờ mở cửa
Tìm và thay trong tất cả các file:
- Số điện thoại đặt bàn
- Email
- Địa chỉ
- Giờ mở cửa (ví dụ: `10:00 — 22:00`)

### 3. Thực đơn
Trong `thuc-don.html`, mỗi món có dạng:
```html
<div class="menu-item" data-category="khai-vi">
  <img src="..." alt="Tên món">
  <div class="menu-info">
    <h5>Tên món ăn</h5>
    <p>Mô tả ngắn về món</p>
    <div class="menu-price">85.000đ</div>
  </div>
</div>
```
- Thay `data-category` theo loại: `khai-vi`, `chinh`, `trang-mien`, `nuoc`
- Thay tên, mô tả, giá, và ảnh món ăn

**Thêm/xóa danh mục filter:** Trong phần filter buttons:
```html
<button class="filter-btn active" data-filter="all">Tất cả</button>
<button class="filter-btn" data-filter="khai-vi">Khai vị</button>
```
Thêm button mới = thêm `data-category` tương ứng cho món.

### 4. Đặt bàn — Khu vực ngồi
Trong `dat-ban.html`, tìm phần chọn khu vực:
```html
<option value="trong">Trong nhà</option>
<option value="ngoai">Ngoài trời</option>
<option value="private">Phòng riêng</option>
```
Chỉnh theo khu vực thực tế của nhà hàng bạn.

Mặc định form không gửi dữ liệu thật. Để nhận đặt bàn qua email:
- Dùng [Formspree](https://formspree.io): thay `action="#"` bằng URL Formspree

### 5. Món nổi bật (trang chủ)
Trong `index.html`, tìm section featured dishes:
```html
<div class="featured-dish">
  <img src="..." alt="Tên món">
  <h4>Tên món đặc biệt</h4>
  <p>Mô tả hấp dẫn...</p>
  <span class="dish-price">120.000đ</span>
</div>
```

### 6. Ảnh
- Hero: ảnh nhà hàng/không gian, ngang 16:9
- Món ăn: ảnh vuông 1:1 hoặc 4:3, chụp từ trên xuống
- Thay tất cả link Unsplash bằng ảnh thực tế của quán

### 7. Màu sắc (Amber theme)
Trong `<style>` của mỗi file, tìm `:root`:
```css
:root {
  --accent: #b45309; /* Màu amber/nâu — đổi theo thương hiệu */
}
```

### 8. Reviews / Đánh giá
Trong `index.html`, thay các đánh giá mặc định bằng feedback thực từ khách:
```html
<blockquote>"Đồ ăn ngon, không khí ấm cúng..."</blockquote>
<cite>— Tên khách, nguồn (Google Maps ★★★★★)</cite>
```

### 9. Google Maps
Trong `lien-he.html`, tìm `<iframe>` và thay bằng embed địa chỉ nhà hàng:
1. Google Maps → tìm địa chỉ → Share → Embed a map → Copy HTML

### 10. Zalo đặt bàn
Tìm nút Zalo float, thay số:
```html
<a href="https://zalo.me/0900000000">
```

## Lưu ý
- Ảnh món ăn chất lượng cao là yếu tố quan trọng nhất — đầu tư vào ảnh thực tế
- Test trên mobile vì hầu hết khách tìm nhà hàng qua điện thoại
- Nếu menu thay đổi thường xuyên, xem xét Gói B (có trang admin quản lý menu)

## Hỗ trợ
Liên hệ webdrop.vn để được hỗ trợ chỉnh sửa nội dung.
