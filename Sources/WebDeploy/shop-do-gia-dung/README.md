# Shop Đồ Gia Dụng — Website Deploy (shop-do-gia-dung)

Website bán đồ gia dụng, nội thất nhỏ và trang trí nhà cửa — React SPA (website + admin) + PHP API + SQLite. Build từ template `Sources/templates/web/Shops/shop-do-gia-dung/` (Identity Token WARM-ARTISAN variant, Terracotta `#b5651d` + Sage `#87a06b`, font Fraunces + Karla).

## Kiến trúc

```
shop-do-gia-dung/
├── website/     React SPA — trang chính (Vite + React Router)
├── admin/       React SPA — quản trị (Vite + React Router)
├── api/         PHP thuần + SQLite
├── build.mjs    Script build (Windows: build.bat, Linux/Mac: build.sh)
└── favicon.ico
```

## Hướng dẫn deploy lên hosting

1. **Build**
   ```
   cd Sources/WebDeploy/shop-do-gia-dung
   node build.mjs      (hoặc build.bat trên Windows / bash build.sh trên Linux/Mac)
   ```
   Output: thư mục `_output-deploy/` nằm **cùng cấp** với thư mục `shop-do-gia-dung/` (tức `Sources/WebDeploy/_output-deploy/`).

2. **Upload** toàn bộ nội dung trong `_output-deploy/` lên `public_html/` (hoặc thư mục gốc web) của hosting.

3. **Sửa cấu hình** — mở `api/config.php` trên server và sửa:
   - `APP_URL` → URL thực của website (không có dấu `/` cuối), ví dụ `https://shopgiadadung.vn`
   - `APP_KEY` đã được tự sinh ngẫu nhiên bởi `build.mjs` — không cần sửa.

4. **Kiểm tra**: truy cập `https://yourdomain.com/api/health` — kỳ vọng JSON `{"status":"ok","pdo_sqlite":true,...}`. Nếu `db_dir` báo "not writable", chmod thư mục `api/database/` và `api/uploads/` lên `755` hoặc `775`.

5. **Đăng nhập admin**: `https://yourdomain.com/admin`
   - Email: `sysadmin@admin.com`
   - Mật khẩu: `123456`
   - **Đổi mật khẩu ngay sau lần đăng nhập đầu tiên** (menu Hồ sơ).

6. **Bảo mật**: xóa file `api/check-hash.php` khỏi server sau khi deploy xong — đây là file debug chỉ dùng để verify hash lúc phát triển, không được để lộ ra ngoài production.

## Yêu cầu hosting

- PHP 8.1+ với extension `pdo_sqlite`
- Ghi được vào `api/database/` và `api/uploads/`
- Hỗ trợ `.htaccess` (Apache) hoặc IIS `web.config` (đã có sẵn cả 2)

## Tài khoản & thanh toán mặc định

- Admin mặc định: `sysadmin@admin.com` / `123456`
- Thanh toán: COD bật sẵn, SePay (chuyển khoản QR) tắt sẵn — bật + điền tài khoản ngân hàng tại Admin → Cài đặt → tab "💳 Thanh toán" (có nút "🔄 Đồng bộ tài khoản từ SePay" để tự lấy thông tin ngân hàng từ API Access).
- Phí vận chuyển mặc định: 50.000đ, miễn phí từ đơn 500.000đ.
- Đổi trả trong 30 ngày, bảo hành 12 tháng (chỉnh tại Admin → Cài đặt → tab "Cửa hàng").

## Dữ liệu mẫu

DB tự seed lần đầu khi nhận request đầu tiên — không cần setup thủ công:
- 5 danh mục: Nhà Bếp, Trang Trí, Phòng Tắm, Nội Thất Nhỏ, Đèn & Chiếu Sáng
- 38 sản phẩm đồ gia dụng thật (tên/giá/mô tả lấy từ template gốc)
- 3 hero slide mẫu, toàn bộ nội dung Search Zone/Footer/Liên hệ quản lý được qua Admin → Cài đặt

## Đặc điểm kỹ thuật riêng của site này

- Trang chủ dùng "Search Zone" (tiêu đề lớn + ô tìm kiếm + category chip) thay cho hero ảnh — đúng theo template gốc (Biến thể 2 CATEGORY-SECTIONS), không có banner/slider ảnh. Component `website/src/components/HeroSlider.tsx` render khối này, đọc mô tả phụ từ setting `hero_subtitle` (tab "Trang chủ" trong Admin → Cài đặt).
- Trang Sản phẩm dùng filter bar (category pill + khoảng giá + sort) + lưới sản phẩm — đọc dữ liệu qua `GET /public/products`.
- Module Phiếu giảm giá (coupon) không có trong phạm vi build này.
- `admin/src/styles/admin.css` đã bổ sung khối "Admin CRUD pages" (class `admin-page-*`, `admin-form`, `btn btn-primary/outline`, `status-badge`, `settings-tab`, sidebar profile/avatar/logout, dashboard `stat-*`) để khớp đúng các trang quản trị đã viết sẵn.
- `website/src/styles/template.css` copy nguyên vẹn từ template gốc, có bổ sung thêm 1 khối CSS cho các thành phần Header/Footer/ProductCard (dùng class dạng phẳng, không BEM) để khớp đúng markup React thực tế.
