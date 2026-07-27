# LUMIÈRE Beauty — Website Deploy (shop-my-pham)

Website bán mỹ phẩm cao cấp — React SPA (website + admin) + PHP API + SQLite. Build từ template `Sources/templates/web/Shops/shop-my-pham/` (Identity Token LUXE-DARK variant, Rose Gold `#c98a8a` + Charcoal `#241f1f`).

## Kiến trúc

```
shop-my-pham/
├── website/     React SPA — trang chính (Vite + React Router)
├── admin/       React SPA — quản trị (Vite + React Router)
├── api/         PHP thuần + SQLite
├── build.mjs    Script build (Windows: build.bat, Linux/Mac: build.sh)
└── favicon.ico
```

## Hướng dẫn deploy lên hosting

1. **Build**
   ```
   cd Sources/WebDeploy/shop-my-pham
   node build.mjs      (hoặc build.bat trên Windows / bash build.sh trên Linux/Mac)
   ```
   Output: thư mục `_output-deploy/` nằm **cùng cấp** với thư mục `shop-my-pham/` (tức `Sources/WebDeploy/_output-deploy/`).

2. **Upload** toàn bộ nội dung trong `_output-deploy/` lên `public_html/` (hoặc thư mục gốc web) của hosting.

3. **Sửa cấu hình** — mở `api/config.php` trên server và sửa:
   - `APP_URL` → URL thực của website (không có dấu `/` cuối), ví dụ `https://lumiere-beauty.vn`
   - `APP_KEY` đã được tự sinh ngẫu nhiên bởi `build.mjs` — không cần sửa.

4. **Kiểm tra**: truy cập `https://yourdomain.com/api/health` — kỳ vọng JSON `{"status":"ok","pdo_sqlite":true,...}`. Nếu `db_dir` báo "not writable", chmod thư mục `api/database/` và `api/uploads/` lên `755` hoặc `775`.

5. **Đăng nhập admin**: `https://yourdomain.com/admin`
   - Email: `sysadmin@admin.com`
   - Mật khẩu: `123456`
   - **Đổi mật khẩu ngay sau lần đăng nhập đầu tiên** (menu Hồ sơ).

6. **Bảo mật**: xóa file `api/check-hash.php` khỏi server sau khi deploy xong — đây là file debug chỉ dùng để verify hash lúc phát triển.

## Yêu cầu hosting

- PHP 8.1+ với extension `pdo_sqlite`
- Ghi được vào `api/database/` và `api/uploads/`
- Hỗ trợ `.htaccess` (Apache) hoặc IIS `web.config` (đã có sẵn cả 2)

## Tài khoản & thanh toán mặc định

- Admin mặc định: `sysadmin@admin.com` / `123456`
- Thanh toán: COD bật sẵn, SePay (chuyển khoản QR) tắt sẵn — bật + điền tài khoản ngân hàng tại Admin → Cài đặt → tab "💳 Thanh toán".
- Phí vận chuyển mặc định: 30.000đ, miễn phí từ đơn 500.000đ.

## Dữ liệu mẫu

DB tự seed lần đầu khi nhận request đầu tiên — không cần setup thủ công:
- 5 danh mục: Chăm Sóc Da, Trang Điểm, Chăm Sóc Tóc, Nước Hoa, Dụng Cụ Làm Đẹp
- 36 sản phẩm mỹ phẩm thật (tên/giá/thương hiệu lấy từ template gốc)
- Toàn bộ nội dung trang Giới thiệu, Bộ sưu tập, Liên hệ quản lý được qua Admin → Cài đặt

## Đặc điểm kỹ thuật riêng của site này

- Trang chủ dùng "Search Zone" (tiêu đề lớn + ô tìm kiếm + category chip) thay cho hero ảnh — đúng theo template gốc (Biến thể 2 CATEGORY-SECTIONS), không có banner/slider ảnh.
- Trang Sản phẩm dùng filter toolbar ngang (category pill + dropdown Thương hiệu/Loại da + dual price range slider + sort) thay vì sidebar dọc — bám đúng cấu trúc `san-pham.html` gốc.
- Mở rộng cột riêng cho `products`: `brand`, `skin_type` (loại da phù hợp — padded pipe), `theme` (chủ đề hiển thị trang chủ — padded pipe), `sold`.
- Module Phiếu giảm giá (coupon) không có trong phạm vi build này.
