# SPORT THE THAO — Website Deploy (shop-the-thao)

Website bán đồ thể thao & gym — React SPA (website + admin) + PHP API + SQLite. Build từ template `Sources/templates/web/Shops/shop-the-thao/` (Identity Token DARK-ENERGY variant Signal Orange `#ff4d29` + Electric Blue `#2f6fed`, font Archivo Black + Barlow).

## Kiến trúc

```
shop-the-thao/
├── website/     React SPA — trang chính (Vite + React Router)
├── admin/       React SPA — quản trị (Vite + React Router)
├── api/         PHP thuần + SQLite
├── build.mjs    Script build (Windows: build.bat, Linux/Mac: build.sh)
└── favicon.ico
```

## Hướng dẫn deploy lên hosting

1. **Build**
   ```
   cd Sources/WebDeploy/shop-the-thao
   node build.mjs      (hoặc build.bat trên Windows / bash build.sh trên Linux/Mac)
   ```
   Output: thư mục `_output-deploy/` nằm **cùng cấp** với thư mục `shop-the-thao/` (tức `Sources/WebDeploy/_output-deploy/`).

2. **Upload** toàn bộ nội dung trong `_output-deploy/` lên `public_html/` (hoặc thư mục gốc web) của hosting.

3. **Sửa cấu hình** — mở `api/config.php` trên server và sửa:
   - `APP_URL` → URL thực của website (không có dấu `/` cuối), ví dụ `https://sportthethao.vn`
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
- Phí vận chuyển mặc định: 25.000đ, miễn phí từ đơn 500.000đ.

## Dữ liệu mẫu

DB tự seed lần đầu khi nhận request đầu tiên — không cần setup thủ công:
- 5 danh mục: Quần áo, Giày, Dụng cụ, Phụ kiện, Yoga
- 38 sản phẩm thể thao/gym thật (tên/giá/thương hiệu lấy nguyên từ `products-data.js` của template gốc)
- Toàn bộ nội dung trang Bộ sưu tập, Khuyến mãi, Dịch vụ được quản lý qua Admin → Cài đặt / trang tương ứng

## Đặc điểm kỹ thuật riêng của site này

- Trang chủ dùng **Biến thể 1 SEARCH-FIRST UNIFIED** — catalog đầy đủ (filter toolbar ngang + grid + pagination) nằm ngay ở route `/`, KHÔNG có hero/marketing section nào ở trang chủ — đúng theo `index.html` gốc. Toàn bộ nội dung marketing (hero, brand story, stat bar, service grid, why-choose-us, testimonials, policy, CTA) chuyển sang trang `/dich-vu` (đúng `dich-vu.html` gốc).
- Trang Sản phẩm dùng chung `HomePage.tsx` (route `/san-pham` re-export `HomePage`) — không có trang catalog riêng, khớp đúng thiết kế "unified" của template gốc.
- Mở rộng cột riêng cho `products`: `brand` (thương hiệu), `sizes` (padded-pipe), `theme` (padded-pipe, dùng cho lọc/sort theo section), `sold` (số lượng đã bán).
- Module Phiếu giảm giá (coupon) không có trong phạm vi build này.
