# MERIDIAN — Đồng hồ chính hãng đa thương hiệu

Website bán hàng React SPA (website + admin) + PHP API + SQLite. Build sẵn để upload thẳng lên hosting hỗ trợ PHP + `pdo_sqlite`.

## 1. Build

```bash
# Windows
build.bat

# Linux / Mac
bash build.sh
```

Build xong sẽ tạo thư mục `_output-deploy/` **nằm CẠNH** thư mục `shop-dong-ho/` (không nằm trong). Toàn bộ nội dung trong `_output-deploy/` là những gì cần upload lên hosting.

## 2. Deploy lên hosting

1. Upload toàn bộ nội dung `_output-deploy/` vào thư mục gốc website trên hosting (qua FTP/File Manager).
2. Mở `api/config.php` trên server, sửa:
   - `APP_URL` → URL thật của website (ví dụ `https://dongho.vn`, không có dấu `/` cuối)
   - `APP_KEY` đã được tự sinh ngẫu nhiên khi build — không cần sửa
3. Phân quyền ghi (chmod 755 hoặc 775) cho 2 thư mục:
   - `api/database/`
   - `api/uploads/`
4. Kiểm tra hệ thống hoạt động: truy cập `https://domain-cua-ban/api/health` — kỳ vọng JSON trả về `"status":"ok"`, `"pdo_sqlite":true`, `"db_dir":"writable"`.
5. Truy cập `https://domain-cua-ban/` để xem website, `https://domain-cua-ban/admin` để vào trang quản trị.

## 3. Đăng nhập quản trị

- URL: `/admin`
- Tài khoản: `sysadmin@admin.com`
- Mật khẩu: `123456`

**⚠️ Đổi mật khẩu ngay sau khi đăng nhập lần đầu** (trang Hồ sơ cá nhân trong admin).

## 4. Bảo mật sau khi deploy

- **Xóa file `api/check-hash.php` khỏi server ngay sau khi deploy xong** — đây là file debug hỗ trợ kiểm tra hash mật khẩu trong DB, không nên để lại trên môi trường production.
- File `.htaccess`/`web.config` đã tự động chặn truy cập trực tiếp vào file `.db` và các file cấu hình nhạy cảm — không xóa các file này.

## 5. Cấu hình bổ sung (tùy chọn)

Toàn bộ cấu hình dưới đây có thể chỉnh trực tiếp trong trang **Cài đặt** của admin, không cần sửa code:

- **Thanh toán**: bật/tắt COD và chuyển khoản SePay, nhập thông tin tài khoản ngân hàng nhận tiền (tab "💳 Thanh toán").
- **Cloudinary**: dùng để lưu trữ ảnh sản phẩm trên CDN thay vì lưu cục bộ (tab "☁️ Cloudinary").
- **Unsplash**: đã có sẵn Access Key demo dùng chung — có thể đổi Access Key riêng nếu cần (tab "🔌 Tích hợp").

## 6. Cấu trúc dữ liệu

- `products` — sản phẩm đồng hồ (44 mẫu mẫu, đầy đủ 10 thương hiệu CASIO/SEIKO/CITIZEN/ORIENT/TISSOT/FOSSIL/MVMT/TIMEX/LONGINES/DANIEL WELLINGTON)
- `product_categories` — Đồng hồ Nam / Đồng hồ Nữ / Unisex
- `orders` + `order_items` — đơn hàng khách đặt qua website
- `testimonials` — đánh giá khách hàng hiển thị ở trang chủ
- `settings` — toàn bộ text/cấu hình hiển thị trên website, quản lý qua admin

## 7. Hỗ trợ kỹ thuật

Mọi thắc mắc về vận hành, liên hệ đội ngũ kỹ thuật qua kênh đã cung cấp khi bàn giao.
