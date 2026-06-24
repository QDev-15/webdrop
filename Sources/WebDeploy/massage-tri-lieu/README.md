# massage-tri-lieu — Hướng dẫn Deploy

Website massage trị liệu chuyên nghiệp. React SPA + PHP API + SQLite.

## Yêu cầu hosting

- PHP 7.4+ (khuyến nghị 8.1+)
- Extension: `pdo_sqlite`
- Apache mod_rewrite HOẶC IIS URL Rewrite

## Cấu trúc thư mục deploy

```
_output-deploy/
  index.html          <- Trang chủ (React SPA)
  assets/             <- JS/CSS đã build
  .htaccess           <- Apache routing
  web.config          <- IIS routing
  admin/              <- Admin panel (React SPA)
    index.html
    assets/
  api/                <- PHP backend
    index.php
    config.php        <- CẤU HÌNH CHÍNH - sửa trước khi deploy
    schema.sql
    src/
    database/         <- Thư mục SQLite DB (cần chmod 755/777)
    uploads/          <- Thư mục upload ảnh (cần chmod 755/777)
```

## Các bước deploy

### Bước 1 — Upload files

Upload toàn bộ nội dung trong `_output-deploy/` lên thư mục `public_html/` (hoặc `www/`, `htdocs/`) của hosting.

**Quan trọng:** Upload cả file ẩn `.htaccess` (Apache) và `web.config` (IIS).

### Bước 2 — Cấu hình API

Mở file `api/config.php` và sửa:

```php
define('APP_URL', 'https://yourdomain.com');  // URL chính xác của website
```

`APP_KEY` đã được tự động tạo trong lúc build — không cần thay đổi.

### Bước 3 — Phân quyền thư mục

```bash
chmod 755 api/database/
chmod 755 api/uploads/
```

Trên Windows hosting (IIS/Plesk): đảm bảo IIS_IUSRS có quyền Write vào 2 thư mục này.

### Bước 4 — Kiểm tra health endpoint

Mở trình duyệt và truy cập:
```
https://yourdomain.com/api/health
```

Kết quả mong đợi:
```json
{
  "status": "ok",
  "pdo_sqlite": true,
  "db_dir": "writable",
  "db_exists": false,
  "schema_sql": "found"
}
```

Nếu `pdo_sqlite: false` → liên hệ hosting để bật extension.
Nếu `db_dir: "not writable"` → chmod lại thư mục `api/database/`.

### Bước 5 — Đăng nhập admin

1. Truy cập `https://yourdomain.com/admin`
2. Đăng nhập với tài khoản mặc định:
   - **Email:** `sysadmin@admin.com`
   - **Mật khẩu:** `123456`
3. **ĐỔI MẬT KHẨU NGAY** sau khi đăng nhập lần đầu!

DB sẽ tự động seed dữ liệu mẫu khi nhận request đầu tiên.

### Bước 6 — Cấu hình website

Trong admin panel, vào **Cài đặt** để:
- Sửa tên website, số điện thoại, địa chỉ
- Thêm link mạng xã hội (Facebook, Zalo, Instagram)
- Cấu hình SEO
- Upload ảnh cho Hero section

## Tài khoản mặc định

| Email | Mật khẩu | Quyền |
|---|---|---|
| sysadmin@admin.com | 123456 | superadmin |

**Bảo mật:** Đổi mật khẩu ngay sau khi deploy!

## Tính năng

- Trang chủ: Hero, Dịch vụ, Thống kê, Quy trình, Gói combo, Đội ngũ, Đánh giá
- Trang Dịch vụ & Giá: Danh sách dịch vụ theo danh mục + bảng giá + gói combo
- Trang Đặt lịch: Form đặt lịch với xác thực cơ bản
- Trang Liên hệ: Form liên hệ + bản đồ
- Admin panel: Quản lý tất cả nội dung
- Upload ảnh: Local upload + Unsplash picker

## Xử lý sự cố

**Trang trắng sau khi upload:**
- Kiểm tra `.htaccess` đã được upload chưa (file ẩn)
- Kiểm tra mod_rewrite đã bật chưa (Apache)

**API trả về 404:**
- Kiểm tra `APP_URL` trong `api/config.php` có đúng không
- Kiểm tra URL rewrite rules

**Admin không đăng nhập được:**
- Kiểm tra `api/health` → `db_dir: "writable"`
- Kiểm tra PHP session storage có thể ghi được

**Ảnh không hiển thị:**
- Kiểm tra quyền ghi của `api/uploads/`
- Nếu dùng Cloudinary: cấu hình trong Admin → Cài đặt → Cloudinary

## Cấu trúc DB (SQLite)

File DB tự động tạo tại `api/database/massage-tri-lieu.db` khi có request đầu tiên.

Bảng chính:
- `users` — tài khoản quản trị
- `settings` — cài đặt toàn bộ website (key-value)
- `hero_slides` — slide hero (hiện tại dùng settings)
- `service_categories` — danh mục dịch vụ
- `services` — dịch vụ massage
- `service_packages` — gói combo
- `bookings` — lịch đặt
- `therapists` — chuyên viên trị liệu
- `testimonials` — đánh giá khách hàng
- `contacts` — liên hệ từ form
- `media` — quản lý media

---

*Website: massage-tri-lieu | Build: React 18 + Vite + PHP 8 + SQLite*
