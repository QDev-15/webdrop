# Nova Store — Shop Thời Trang — Website Deploy

Website shop thời trang (BOLD-EDITORIAL identity). React SPA + PHP backend + SQLite.

---

## Yêu cầu hosting

- PHP >= 8.0 với extension `pdo_sqlite` và `pdo`
- Cho phép ghi file (chmod 755) vào thư mục `api/database/` và `api/uploads/`
- Apache (có mod_rewrite) hoặc IIS (có URL Rewrite)

---

## Bước 1 — Build

```bash
# Windows
build.bat

# Linux / Mac
bash build.sh
```

Output nằm tại `../_output-deploy/` (cùng cấp với thư mục source).

---

## Bước 2 — Upload

Upload toàn bộ nội dung trong `_output-deploy/` lên thư mục gốc của hosting (`public_html` hoặc `www`).

```
public_html/
  index.html          ← trang chủ (React SPA)
  assets/             ← JS, CSS của website
  admin/
    index.html        ← trang quản trị (React SPA)
    assets/
  api/
    index.php         ← PHP entry point
    config.php        ← CẤU HÌNH ở đây
    schema.sql
    .htaccess
    database/          ← SQLite DB (tự động tạo)
    uploads/
    src/
  .htaccess           ← SPA routing (Apache)
  web.config          ← SPA routing (IIS)
```

---

## Bước 3 — Cấu hình

Mở `api/config.php`:

```php
define('APP_URL', 'https://domain.vn');
define('CORS_ORIGINS', ['https://domain.vn']);
```

SMTP, Cloudinary, SePay có thể cấu hình sau qua Admin → Cài đặt.

---

## Bước 4 — Phân quyền thư mục

```bash
chmod 755 api/database/
chmod 755 api/uploads/
```

Trên IIS: đảm bảo `IIS_IUSRS` có quyền Write vào 2 thư mục này.

---

## Bước 5 — Kiểm tra

Truy cập `https://domain.vn/api/health`:

```json
{ "status": "ok", "pdo_sqlite": true, "db_dir": "writable", "php": "8.x.x" }
```

`pdo_sqlite: false` → liên hệ hosting bật extension. `db_dir: not writable` → chmod lại `api/database/`.

---

## Bước 6 — Đăng nhập admin

- URL: `https://domain.vn/admin`
- Email: `sysadmin@admin.com`
- Mật khẩu: `123456`

**Đổi mật khẩu ngay sau lần đăng nhập đầu tiên** — Admin → Profile → Đổi mật khẩu.

Sau khi deploy xong, **xóa file `api/check-hash.php`** khỏi server (chỉ dùng để debug hash mật khẩu lúc phát triển).

---

## Tính năng

### Trang chủ (`/`)
Hero Magazine Grid (ảnh quản lý qua Admin → Hero Slides), thanh thống kê, lưới danh mục, sản phẩm nổi bật (bento grid), 2 dải câu chuyện thương hiệu, banner Flash Sale (đếm ngược), đánh giá khách hàng, đăng ký nhận tin.

### Trang Bộ sưu tập (`/san-pham`)
Sidebar lọc đầy đủ: tìm kiếm, danh mục (multi-select), khoảng giá, size, màu sắc, trạng thái (mới/sale/còn hàng) + nút Áp dụng/Xóa bộ lọc. Tab bar danh mục phía trên. Phân trang, sắp xếp. Có thể vào thẳng từ link `?cat=slug`, `?sale=1`, `?q=từ-khóa`.

### Trang Chi tiết sản phẩm (`/san-pham/:slug`)
Gallery ảnh, chọn màu/size, số lượng, thêm giỏ hàng/mua ngay, 4 tab (Mô tả, Thông số, Đánh giá, Hướng dẫn chăm sóc), sản phẩm liên quan.

### Giỏ hàng (`/gio-hang`)
Cập nhật số lượng, xóa sản phẩm, áp mã giảm giá (`WELCOME10`, `FREESHIP` — seed sẵn), tóm tắt đơn hàng.

### Thanh toán (`/thanh-toan`)
Form thông tin giao hàng + chọn COD hoặc chuyển khoản SePay (QR VietQR, polling xác nhận tự động).

### Liên hệ (`/lien-he`)
Form liên hệ, thông tin cửa hàng, mạng xã hội, bản đồ (Google Maps embed), FAQ, đăng ký nhận tin.

### Admin (`/admin`)
Dashboard · Hero Slides · Danh mục sản phẩm · Sản phẩm (brand, gallery, màu/size, thông số, features) · Đánh giá sản phẩm (tự tính lại rating trung bình) · Đánh giá khách hàng (testimonials trang chủ) · Mã giảm giá · Đơn hàng (đổi trạng thái) · Liên hệ · Thư viện ảnh · Cài đặt (10 tab: Chung, Trang chủ, Câu chuyện, Flash Sale, SEO, Mạng xã hội, Cửa hàng, 💳 Thanh toán, Liên hệ, SMTP, Cloudinary, Tích hợp).

---

## Dữ liệu mặc định (seed)

Database tự seed khi request đầu tiên:

- Tài khoản admin: `sysadmin@admin.com` / `123456`
- 5 danh mục: Nữ, Nam, Trẻ Em, Phụ Kiện, Giày Dép
- 24 sản phẩm — đầy đủ brand, gallery ảnh, mô tả, features, thông số kỹ thuật, màu sắc, size, giá/giá sale
- 12 đánh giá sản phẩm mẫu (product_reviews) trên một số sản phẩm tiêu biểu
- 5 đánh giá khách hàng (testimonials trang chủ)
- 2 mã giảm giá mẫu: `WELCOME10` (giảm 10%, đơn tối thiểu 300.000đ), `FREESHIP` (giảm 30.000đ, đơn tối thiểu 500.000đ)
- 3 hero slides (ảnh cho lưới Magazine Grid trang chủ)
- Settings đầy đủ: thông tin chung, hero, câu chuyện thương hiệu, flash sale, thanh toán, v.v.

---

## Thanh toán

2 phương thức, bật/tắt tại Admin → Cài đặt → 💳 Thanh toán:

- **COD** — bật mặc định.
- **SePay** — tắt mặc định. Cần điền SePay API Access + thông tin tài khoản ngân hàng (hoặc dùng nút "🔄 Đồng bộ tài khoản từ SePay"). Webhook nhận tại `POST /api/public/sepay-webhook`, cấu hình URL này trong SePay dashboard.

---

## Câu hỏi thường gặp

**Website báo lỗi sau khi deploy?**
Truy cập `/api/health`, kiểm tra `pdo_sqlite` và `db_dir`.

**Quên mật khẩu admin?**
Xóa file `api/database/app.db` để reset toàn bộ (mất hết dữ liệu, DB sẽ seed lại từ đầu).

**Muốn thêm sản phẩm mới?**
Admin → Sản phẩm → Thêm sản phẩm mới. Trường Màu sắc/Size dùng để lọc ở trang Bộ sưu tập — phải điền đúng định dạng gợi ý trong form.

**Muốn đổi thông tin cửa hàng / giờ mở cửa?**
Admin → Cài đặt → Thông tin chung.

---

*Build với web-deploy-builder — webdrop.store*
