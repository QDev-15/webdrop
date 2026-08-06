# OFFICEHUB — Website Deploy (shop-van-phong-pham)

Website bán văn phòng phẩm — React SPA (website + admin) + PHP API + SQLite. Build từ template `Sources/templates/web/Shops/shop-van-phong-pham/` (Identity Token CLEAN-CORPORATE, Steel Blue `#2563a8` + Charcoal Navy `#1e293b`, font Manrope).

## Kiến trúc

```
shop-van-phong-pham/
├── website/     React SPA — trang chính (Vite + React Router)
├── admin/       React SPA — quản trị (Vite + React Router)
├── api/         PHP thuần + SQLite
├── build.mjs    Script build (Windows: build.bat, Linux/Mac: build.sh)
└── favicon.ico
```

## Hướng dẫn deploy lên hosting

1. **Build**
   ```
   cd Sources/WebDeploy/shop-van-phong-pham
   node build.mjs      (hoặc build.bat trên Windows / bash build.sh trên Linux/Mac)
   ```
   Output: thư mục `_output-deploy/` nằm **cùng cấp** với thư mục `shop-van-phong-pham/` (tức `Sources/WebDeploy/_output-deploy/`).

2. **Upload** toàn bộ nội dung trong `_output-deploy/` lên `public_html/` (hoặc thư mục gốc web) của hosting.

3. **Sửa cấu hình** — mở `api/config.php` trên server và sửa:
   - `APP_URL` → URL thực của website (không có dấu `/` cuối), ví dụ `https://officehub.vn`
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
- Thanh toán: COD bật sẵn, SePay (chuyển khoản QR) bật sẵn với tài khoản test — điền tài khoản ngân hàng thật tại Admin → Cài đặt → tab "💳 Thanh toán" trước khi vận hành thật.
- Phí vận chuyển mặc định: 30.000đ, miễn phí từ đơn 500.000đ.

## Dữ liệu mẫu

DB tự seed lần đầu khi nhận request đầu tiên — không cần setup thủ công:
- 5 danh mục: Bút viết, Sổ tay & giấy note, File & kẹp tài liệu, Dụng cụ văn phòng, Balo & túi laptop
- 36 sản phẩm văn phòng phẩm thật (tên/giá/thương hiệu lấy nguyên từ `products-data.js` của template gốc)
- Toàn bộ nội dung trang Bộ sưu tập, Khuyến mãi, Dịch vụ doanh nghiệp, Liên hệ quản lý được qua Admin → Cài đặt

## Đặc điểm kỹ thuật riêng của site này

- Trang chủ dùng **Biến thể 1 SEARCH-FIRST UNIFIED** — catalog đầy đủ (filter toolbar ngang + grid + pagination) nằm ngay ở route `/`, KHÔNG có hero/marketing section nào ở trang chủ — đúng theo `index.html` gốc. Toàn bộ nội dung marketing (hero, 4 dịch vụ, quy trình 4 bước, 6 lý do chọn, stat bar, 3 testimonial, 4 chính sách, CTA) chuyển sang trang `/dich-vu` (đúng `dich-vu.html` gốc).
- Trang Sản phẩm KHÔNG tồn tại độc lập (`san-pham.html` không có trong template gốc) — component `HeroSlider.tsx` được tái sử dụng để render "Page Header Search Zone" (h1 + ô tìm kiếm lớn) phía trên filter toolbar, thay cho slider ảnh.
- Filter toolbar ngang: category pill (danh mục) + dropdown "Thương hiệu" (checkbox, danh sách brand động lấy từ dữ liệu thật) + price range slider + sort select — áp dụng tức thì, không nút "Áp dụng". Mobile có offcanvas filter riêng.
- Mở rộng cột riêng cho `products`: `brand` (thương hiệu), `theme` (padded-pipe, dùng cho sort "bán chạy"/lọc theo section), `sold` (số lượng đã bán, dùng cho sort "Bán chạy").
- Module Phiếu giảm giá (coupon) không có trong phạm vi build này — trang `/khuyen-mai` chỉ hiển thị mã khuyến mãi dạng thông tin (sao chép mã), không tích hợp trừ tiền tự động vì `CheckoutPage.tsx` (scaffold tĩnh) không có trường discount.
