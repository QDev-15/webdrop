# Template Agency Web — Hướng dẫn chỉnh nội dung

Template website cho agency, công ty dịch vụ, freelancer.

## Các trang
| File | Trang |
|---|---|
| `index.html` | Trang chủ — hero, dịch vụ, portfolio, pricing, reviews, CTA |
| `dich-vu.html` | Dịch vụ — danh sách dịch vụ chi tiết |
| `ve-chung-toi.html` | Về chúng tôi — story, team, timeline |
| `du-an.html` | Dự án — portfolio filter theo loại |
| `lien-he.html` | Liên hệ — form + bản đồ |

## Yêu cầu kỹ thuật
- Mở thẳng trên trình duyệt — không cần cài đặt gì
- Bootstrap 5.3.3 (CDN)
- Font DM Sans (Google Fonts)
- Vanilla JS thuần

## Cách chỉnh nội dung

### 1. Logo & tên công ty
Tìm và thay toàn bộ `"AgencyPro"` bằng tên công ty của bạn trong tất cả file HTML.

```html
<!-- Trước -->
<span class="logo-text">AgencyPro</span>

<!-- Sau -->
<span class="logo-text">Tên Công Ty Bạn</span>
```

### 2. Thông tin liên hệ
Trong `index.html` và `lien-he.html`, tìm và thay:
- Số điện thoại: `0900 000 000`
- Email: `hello@agencypro.vn`
- Địa chỉ: trong section footer và trang liên hệ

### 3. Hero section (trang chủ)
Trong `index.html`, tìm `<!-- HERO -->` và chỉnh:
- Tiêu đề chính (thẻ `<h1>`)
- Mô tả ngắn (thẻ `<p>` ngay sau h1)
- Nút CTA (text và link)

### 4. Dịch vụ
Trong `dich-vu.html`, mỗi dịch vụ có dạng:
```html
<div class="service-card">
  <div class="service-icon">...</div>
  <h3>Tên dịch vụ</h3>
  <p>Mô tả dịch vụ...</p>
</div>
```
Thay nội dung trong các thẻ `<h3>` và `<p>`.

### 5. Portfolio / Dự án
Trong `du-an.html`, mỗi dự án có dạng:
```html
<div class="project-card" data-category="web">
  <img src="..." alt="Tên dự án">
  <div class="project-info">
    <h4>Tên dự án</h4>
    <p>Loại dự án</p>
  </div>
</div>
```
Thay ảnh bằng link ảnh thực tế của bạn.

### 6. Team
Trong `ve-chung-toi.html`, tìm section team:
```html
<div class="team-card">
  <img src="..." alt="Tên">
  <h4>Nguyễn Văn A</h4>
  <p>Chức vụ</p>
</div>
```

### 7. Ảnh
- Thay các link `https://images.unsplash.com/...` bằng ảnh thực của bạn
- Ảnh nên có tỷ lệ: hero 16:9, team 1:1, portfolio 4:3

### 8. Màu sắc
Trong thẻ `<style>` của mỗi file HTML, tìm `:root` và chỉnh `--accent`:
```css
:root {
  --accent: #1a6b52; /* Đổi sang màu thương hiệu của bạn */
}
```

### 9. Google Maps
Trong `lien-he.html`, tìm `<iframe>` map và thay `src` bằng embed link của địa chỉ bạn:
1. Vào Google Maps → tìm địa chỉ của bạn
2. Nhấn Share → Embed a map → Copy HTML
3. Thay toàn bộ `<iframe>` cũ bằng code vừa copy

### 10. Form liên hệ
Trong `lien-he.html`, form mặc định không gửi email. Để nhận email thực:
- Dùng [Formspree](https://formspree.io) (miễn phí): thay `action="#"` bằng URL từ Formspree
- Hoặc dùng [EmailJS](https://emailjs.com): thêm script EmailJS vào

## Lưu ý
- Sau khi chỉnh, mở file HTML trên trình duyệt để xem kết quả ngay
- Nên test trên cả mobile (F12 → toggle device toolbar)
- Không xóa class CSS vì sẽ ảnh hưởng layout

## Hỗ trợ
Liên hệ webdrop.store để được hỗ trợ chỉnh sửa nội dung.
