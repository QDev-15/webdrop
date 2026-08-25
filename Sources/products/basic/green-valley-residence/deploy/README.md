# Green Valley Residence — Hướng dẫn Deploy

Website dự án bất động sản (React SPA + PHP + SQLite) — deploy lên hosting PHP là chạy được ngay.

## 1. Yêu cầu hosting

- PHP 8.0 trở lên
- Extension `pdo_sqlite` đã bật
- Hỗ trợ `.htaccess` (Apache) hoặc IIS (dùng `web.config` có sẵn)

## 2. Cách deploy

1. Upload **toàn bộ nội dung** trong thư mục build (`_output-deploy/`) lên `public_html/` (hoặc thư mục gốc web) của hosting.
2. Mở file `api/config.php` trên hosting, sửa:
   ```php
   define('APP_URL', 'https://tenmien-cua-ban.vn');
   ```
   (không có dấu `/` ở cuối)
3. Kiểm tra hệ thống hoạt động: mở `https://tenmien-cua-ban.vn/api/health` — phải thấy:
   ```json
   { "status": "ok", "pdo_sqlite": true, "db_dir": "writable", ... }
   ```
   Nếu `db_dir` báo `not writable` → chmod thư mục `api/database/` và `api/uploads/` lên `755` (hoặc `775` tùy hosting).
4. Truy cập trang chủ `https://tenmien-cua-ban.vn/` — website sẽ tự tạo database + seed dữ liệu mẫu (10 loại căn hộ, 4 hero slides, tiện ích, FAQ, đánh giá...) trong lần gọi API đầu tiên.

## 3. Đăng nhập trang quản trị

- URL: `https://tenmien-cua-ban.vn/admin`
- Tài khoản mặc định:
  - Email: `sysadmin@admin.com`
  - Mật khẩu: `123456`
- **⚠️ Đổi mật khẩu ngay sau khi đăng nhập lần đầu** (menu Tài khoản của tôi ở góc dưới sidebar).

## 4. Các mục quản lý trong Admin

| Mục | Mô tả |
|---|---|
| Dashboard | Thống kê tổng quan (số loại căn, liên hệ mới...) |
| Hero Slides | 4 slide trang chủ |
| Loại căn hộ | 10 loại căn — tên, diện tích, giá, ảnh, mặt bằng, đặc điểm nổi bật |
| Tiện ích nội khu | Hồ bơi, gym, công viên... (bento grid) |
| Tiện ích xung quanh | Trường học, bệnh viện, TTTM gần dự án |
| Tiến độ thanh toán | Các đợt thanh toán theo tiến độ xây dựng |
| Chính sách bán hàng | Chiết khấu, hỗ trợ vay ngân hàng |
| Câu hỏi thường gặp | FAQ trang chủ |
| Đánh giá khách hàng | Testimonials cư dân/khách đặt chỗ |
| Liên hệ | Danh sách khách đăng ký nhận tư vấn/bảng giá |
| Thư viện ảnh | Upload & quản lý ảnh |
| Cài đặt | Thông tin chung, SEO, mạng xã hội, footer, liên hệ, **Dự án** (chủ đầu tư, tiến độ, pháp lý...), **Nội dung mô tả** (đoạn văn dài các trang), SMTP, Nâng cao, Cloudinary, Tích hợp (Unsplash) |

## 5. Bảo mật sau khi deploy

- **Xóa file `api/check-hash.php` khỏi server sau khi deploy xong** — đây là file debug hỗ trợ kiểm tra password hash, không cần thiết trên production.
- File `.htaccess` (Apache) / `web.config` (IIS) đã tự động chặn truy cập trực tiếp vào file `.db` trong `api/database/`.
- Không public API key nào bị lộ qua endpoint `/api/public/settings` (đã kiểm tra loại trừ nhóm `smtp`, `cloudinary`, `integrations`).

## 6. Cấu trúc dữ liệu (tham khảo)

Site dạng "dự án bất động sản chủ đầu tư đơn lẻ" (không phải sàn nhiều BĐS) — các bảng mở rộng ngoài core (`users`, `settings`, `hero_slides`, `contacts`, `media`):

- `unit_types` — 10 loại căn hộ (Studio 1PN → Penthouse)
- `amenities` — tiện ích nội khu
- `nearby_amenities` — tiện ích xung quanh dự án
- `payment_phases` — tiến độ thanh toán (7 đợt)
- `sales_policies` — chính sách bán hàng / chiết khấu
- `faqs` — câu hỏi thường gặp
- `testimonials` — đánh giá khách hàng

## 7. Công cụ tính vay / trả góp

Trang chi tiết từng loại căn hộ (`/loai-can-chi-tiet?loai=...`) có công cụ ước tính trả góp hàng tháng — chỉ mang tính minh họa tham khảo, không phải cam kết chính thức từ ngân hàng (xem thêm trang Điều khoản sử dụng).

## 8. Hỗ trợ

Mọi thắc mắc kỹ thuật liên hệ đội ngũ webdrop.store.
