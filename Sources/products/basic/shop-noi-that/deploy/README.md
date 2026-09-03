# MỘC AN — Website Deploy (shop-noi-that)

Website bán nội thất gỗ tối giản (sofa, bàn ghế, tủ kệ, đèn trang trí) — React SPA (website + admin) + PHP API + SQLite. Build từ template `Sources/templates/web/Shops/shop-noi-that/` (Identity ZEN-MINIMAL biến thể Walnut Brown `#8b5e3c`, font Newsreader + Inter).

## Kiến trúc

```
shop-noi-that/
├── website/     React SPA — trang chính (Vite + React Router)
├── admin/       React SPA — quản trị (Vite + React Router)
├── api/         PHP thuần + SQLite
├── build.mjs    Script build (Windows: build.bat, Linux/Mac: build.sh)
└── favicon.ico
```

## Hướng dẫn deploy lên hosting

1. **Build**
   ```
   cd Sources/WebDeploy/shop-noi-that
   node build.mjs      (hoặc build.bat trên Windows / bash build.sh trên Linux/Mac)
   ```
   Output: thư mục `_output-deploy/` nằm **cùng cấp** với thư mục `shop-noi-that/` (tức `Sources/WebDeploy/_output-deploy/`).

2. **Upload** toàn bộ nội dung trong `_output-deploy/` lên `public_html/` (hoặc thư mục gốc web) của hosting.

3. **Sửa cấu hình** — mở `api/config.php` trên server và sửa:
   - `APP_URL` → URL thực của website (không có dấu `/` cuối), ví dụ `https://mocan.vn`
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
- Thanh toán: COD bật sẵn. SePay (chuyển khoản QR) **tắt sẵn** — vào Admin → Cài đặt → tab "💳 Thanh toán" để bật + điền tài khoản ngân hàng thật + SePay API Access trước khi vận hành thật.
- Phí vận chuyển mặc định: 200.000đ, miễn phí từ đơn 5.000.000đ (khớp đúng logic giỏ hàng của template gốc).

## Dữ liệu mẫu

DB tự seed lần đầu khi nhận request đầu tiên — không cần setup thủ công:
- 7 danh mục: Sofa & ghế bành, Bàn, Ghế, Tủ & kệ, Giường ngủ, Đèn trang trí, Đồ trang trí
- 44 sản phẩm nội thất gỗ thật (tên/giá/chất liệu/màu sắc lấy nguyên từ `products-data.js` của template gốc)
- 4 bộ sưu tập phong cách: Bắc Âu tối giản, Nhật Bản Zen, Công nghiệp mộc mạc, Hoài cổ Vintage
- 3 đánh giá khách hàng (trang Giới thiệu) + 3 mã giảm giá (trang Khuyến mãi)
- Toàn bộ nội dung trên đều quản lý được qua Admin (menu Sản phẩm / Bộ sưu tập / Nội dung / Cài đặt)

## Đặc điểm kỹ thuật riêng của site này

- Trang chủ = catalog đầy đủ (banner tìm kiếm + quick-category + filter toolbar ngang + grid + pagination), đúng `index.html` gốc — KHÔNG có trang `/san-pham` riêng.
- Filter toolbar có 3 dropdown checkbox (Chất liệu / Màu sắc / Không gian) + price range slider + sort — áp dụng tức thì, không cần nút "Áp dụng".
- Mở rộng cột riêng cho `products`: `material` (chất liệu), `room` (không gian phù hợp), `collection_id` (bộ sưu tập), `sold` (số lượng đã bán).
- 3 bảng mới ngoài chuẩn shop: `collections` (bộ sưu tập), `testimonials` (đánh giá khách hàng), `coupons` (mã giảm giá — chỉ hiển thị để khách "Sao chép", không tự động trừ tiền ở giỏ hàng, đúng hành vi template gốc).
- Trang `/thanh-toan` (Checkout) là trang tự thiết kế mới — template gốc không có (nút "Thanh toán ngay" ở giỏ hàng chỉ là `href="#"`).
