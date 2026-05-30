# Template Spa & Làm đẹp — Hướng dẫn chỉnh nội dung

Template website sang trọng cho spa, thẩm mỹ viện, salon tóc, làm đẹp.

## Các trang
| File | Trang |
|---|---|
| `index.html` | Trang chủ — hero, dịch vụ nổi bật, team, reviews, CTA |
| `dich-vu.html` | Dịch vụ — bảng giá, mô tả chi tiết từng dịch vụ |
| `dat-lich.html` | Đặt lịch — form chọn dịch vụ + chọn khung giờ |
| `lien-he.html` | Liên hệ — form + bản đồ + thông tin |

## Yêu cầu kỹ thuật
- Mở thẳng trên trình duyệt — không cần cài đặt gì
- Bootstrap 5.3.3 (CDN)
- Font DM Sans (Google Fonts)
- Vanilla JS thuần

## Cách chỉnh nội dung

### 1. Tên spa & logo
Tìm và thay `"Bella Spa"` (hoặc tên mặc định) bằng tên spa của bạn trong tất cả file HTML.

### 2. Thông tin liên hệ
Tìm và thay trong tất cả các file:
- Số điện thoại: `0900 000 000`
- Email: `hello@bellaspa.vn`
- Địa chỉ: trong footer và trang liên hệ
- Giờ mở cửa: trong footer và `lien-he.html`

### 3. Dịch vụ & Bảng giá
Trong `dich-vu.html`, mỗi dịch vụ có dạng:
```html
<div class="service-item">
  <h4>Tên dịch vụ</h4>
  <p>Mô tả ngắn về dịch vụ</p>
  <div class="price">250.000đ</div>
  <div class="duration">60 phút</div>
</div>
```
Chỉnh `<h4>`, `<p>`, `.price` và `.duration` theo giá thực của bạn.

### 4. Đặt lịch — khung giờ
Trong `dat-lich.html`, tìm phần chọn giờ:
```html
<div class="time-slot">09:00</div>
<div class="time-slot">10:00</div>
<!-- ... -->
```
Chỉnh các khung giờ theo giờ hoạt động thực tế của spa.

Mặc định form đặt lịch không gửi dữ liệu thật. Để nhận booking qua email:
- Dùng [Formspree](https://formspree.io): thay `action="#"` bằng URL Formspree

### 5. Team / Chuyên viên
Trong `index.html`, tìm section team:
```html
<div class="team-member">
  <img src="..." alt="Tên">
  <h5>Nguyễn Thị A</h5>
  <p>Chuyên viên massage</p>
  <p>5 năm kinh nghiệm</p>
</div>
```
Thay ảnh, tên và chức danh của nhân viên thực.

### 6. Ảnh
- Thay các link `https://images.unsplash.com/...` bằng ảnh thực tế
- Hero: ảnh ngang 16:9, chất lượng cao
- Team: ảnh vuông 1:1
- Dịch vụ: ảnh 4:3

### 7. Màu sắc chủ đạo (Rose theme)
Trong `<style>` của mỗi file, tìm `:root`:
```css
:root {
  --accent: #c17a6b; /* Màu rose — đổi theo thương hiệu của bạn */
}
```

### 8. Reviews / Đánh giá
Trong `index.html`, tìm section reviews:
```html
<div class="review-card">
  <p>"Nội dung đánh giá..."</p>
  <div class="reviewer">Tên Khách — Nguồn (Google/Zalo)</div>
</div>
```
Thay bằng đánh giá thực từ khách hàng của bạn.

### 9. Google Maps
Trong `lien-he.html`, tìm `<iframe>` và thay bằng embed của địa chỉ bạn:
1. Google Maps → tìm địa chỉ → Share → Embed a map → Copy HTML

### 10. Zalo / Liên hệ nhanh
Tìm nút Zalo float (class `zf-btn`), thay số điện thoại Zalo:
```html
<a href="https://zalo.me/0900000000">
```
Thay `0900000000` bằng số Zalo của spa.

## Lưu ý
- Test responsive trên mobile — quan trọng vì hầu hết khách đặt lịch qua điện thoại
- Form đặt lịch cần kết nối backend để hoạt động thật (xem Gói B của webdrop.vn)

## Hỗ trợ
Liên hệ webdrop.vn để được hỗ trợ chỉnh sửa nội dung.
