# TechFlow — Hướng dẫn Deploy

## Cấu trúc dự án

```
startup-cong-nghe/
├── website/     React SPA public site
├── admin/       React SPA admin panel
├── api/         PHP backend + SQLite
├── build.bat    Build script (Windows)
├── build.sh     Build script (Linux/Mac)
└── deploy/      Output sau khi build (upload lên hosting)
```

---

## Bước 1 — Build

### Windows
```
Double-click build.bat
```

### Linux / Mac
```bash
bash build.sh
```

Kết quả: thư mục `deploy/` chứa toàn bộ file cần upload.

---

## Bước 2 — Upload lên hosting

Upload **toàn bộ nội dung bên trong** thư mục `deploy/` lên `public_html/` của hosting (không upload thư mục `deploy/` mà upload nội dung bên trong).

---

## Bước 3 — Cấu hình BẮT BUỘC

Mở file `api/config.php` và sửa 2 dòng sau:

```php
define('APP_URL', 'https://tentenweb.vn');  // URL thực của website
define('APP_KEY', 'random-32-chars-key');    // Chuỗi ngẫu nhiên 32 ký tự
```

Tạo APP_KEY tại: https://randomkeygen.com

---

## Bước 4 — Kiểm tra hosting

Truy cập: `https://tentenweb.vn/api/health`

Kết quả JSON cần có:
- `"pdo_sqlite": true` — nếu false, hosting không hỗ trợ SQLite. Liên hệ hosting để bật extension hoặc đổi sang MySQL.
- `"db_dir": "writable"` — nếu "not writable", chạy lệnh: `chmod 755 api/database/`
- `"schema_sql": "found"` — nếu "MISSING", upload lại file `api/schema.sql`

---

## Bước 5 — Phân quyền thư mục (Linux/Apache)

```bash
chmod 755 api/database/
chmod 755 api/uploads/
```

---

## Bước 6 — Đăng nhập admin

Truy cập: `https://tentenweb.vn/admin`

```
Email:    sysadmin@admin.com
Mật khẩu: 123456
```

**Đổi mật khẩu ngay sau khi đăng nhập lần đầu!**

---

## Yêu cầu hosting

| Yêu cầu | Mô tả |
|---------|-------|
| PHP 7.4+ | Khuyến nghị PHP 8.x |
| pdo_sqlite | Extension SQLite cho PHP |
| mod_rewrite | Bật URL rewrite (Apache) |
| URL Rewrite Module | Tương đương cho IIS/Windows hosting |

---

## Cấu trúc URL sau deploy

| URL | Mô tả |
|-----|-------|
| `https://tentenweb.vn/` | Trang chủ |
| `https://tentenweb.vn/san-pham` | Tính năng sản phẩm |
| `https://tentenweb.vn/bang-gia` | Bảng giá |
| `https://tentenweb.vn/lien-he` | Liên hệ & Demo |
| `https://tentenweb.vn/admin` | Admin panel |
| `https://tentenweb.vn/api/health` | Health check |

---

## Admin modules

| Module | Chức năng |
|--------|-----------|
| Hero Slides | Quản lý slider trang chủ |
| Tính năng | Thêm/sửa/xóa tính năng sản phẩm |
| Bảng giá | Quản lý các gói dịch vụ và tính năng trong gói |
| FAQ | Câu hỏi thường gặp trên trang Bảng giá |
| Đánh giá | Testimonials từ khách hàng |
| Liên hệ | Tin nhắn từ form liên hệ |
| Đặt lịch demo | Yêu cầu đặt lịch demo sản phẩm |
| Media | Upload và quản lý ảnh |
| Cài đặt | Cấu hình toàn bộ nội dung website |

---

## Đổi sang MySQL (tùy chọn)

Mở `api/config.php`, thay đổi:

```php
define('DB_TYPE', 'mysql');  // đổi từ 'sqlite'
define('DB_HOST', 'localhost');
define('DB_NAME', 'ten_database');
define('DB_USER', 'ten_user');
define('DB_PASS', 'mat_khau');
```

Sau đó tạo database và chạy `api/schema.sql` để tạo bảng.
