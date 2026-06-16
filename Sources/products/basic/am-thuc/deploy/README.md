# Nhà Hàng Ẩm Thực — Website Deploy Guide

Website nhà hàng ẩm thực Việt Nam truyền thống. React SPA + PHP API + SQLite.

## Yêu cầu hosting

- PHP 7.4+ (khuyến nghị 8.x)
- Extension: `pdo_sqlite`
- Apache: `mod_rewrite` | IIS: URL Rewrite Module
- Thư mục `api/database/` và `api/uploads/` phải có quyền ghi (chmod 755)

## Build (lần đầu)

```bash
# Windows
build.bat

# Linux/Mac
bash build.sh
```

Sau khi build xong, thư mục `deploy/` chứa toàn bộ files sẵn sàng upload.

## Hướng dẫn Deploy

### Bước 1 — Upload

Upload toàn bộ nội dung trong thư mục `deploy/` lên `public_html/` của hosting.

```
public_html/
├── index.html          ← trang chủ website
├── assets/             ← JS, CSS đã build
├── admin/              ← trang quản trị
│   └── index.html
├── api/                ← PHP backend
│   ├── config.php      ← ⚠️ PHẢI SỬA sau khi upload
│   ├── index.php
│   ├── schema.sql
│   ├── database/       ← SQLite database (tự tạo)
│   └── uploads/        ← file upload
├── .htaccess           ← Apache routing
└── web.config          ← IIS routing
```

### Bước 2 — Cấu hình (BẮT BUỘC)

Mở file `api/config.php` và sửa:

```php
define('APP_URL', 'https://tenweb.vn');  // ← URL thực của website (không có / cuối)
```

> `APP_KEY` đã được tự động generate khi build — không cần sửa.

### Bước 3 — Kiểm tra hosting

Truy cập: `https://tenweb.vn/api/health`

Kết quả JSON phải có:
```json
{
  "status": "ok",
  "pdo_sqlite": true,
  "db_dir": "writable",
  "schema_sql": "found"
}
```

- `"pdo_sqlite": false` → hosting không hỗ trợ SQLite, cần đổi sang MySQL
- `"db_dir": "not writable"` → chmod 755 cho thư mục `api/database/`
- `"schema_sql": "MISSING"` → upload lại file `api/schema.sql`

### Bước 4 — Phân quyền thư mục (nếu cần — Linux hosting)

```bash
chmod 755 api/database/
chmod 755 api/uploads/
```

### Bước 5 — Đăng nhập admin

Truy cập: `https://tenweb.vn/admin`

```
Email:    sysadmin@admin.com
Mật khẩu: 123456
```

> Đổi mật khẩu ngay sau khi đăng nhập lần đầu tại menu "Tài khoản của tôi"!

## Cấu trúc Admin

| Menu | Chức năng |
|---|---|
| Dashboard | Thống kê tổng quan: đặt bàn, liên hệ |
| Hero Slides | Quản lý banner trang chủ |
| Danh mục thực đơn | Thêm/sửa/xóa danh mục món ăn |
| Món ăn | Quản lý toàn bộ thực đơn |
| Đặt bàn | Xem và xác nhận đặt bàn |
| Thư viện ảnh | Quản lý gallery hình ảnh |
| Đánh giá | Quản lý testimonials khách hàng |
| Media | Upload và quản lý file ảnh |
| Liên hệ | Xem tin nhắn từ khách |
| Cài đặt | Cấu hình tên, địa chỉ, SĐT, SEO, social... |
| Tài khoản | Đổi mật khẩu |

## Tài khoản mặc định

| Field | Giá trị |
|---|---|
| Email | sysadmin@admin.com |
| Mật khẩu | 123456 |
| Vai trò | Quản trị viên (superadmin) |

## Troubleshooting

**Trang hiện 500 lỗi:**
- Kiểm tra `/api/health` xem lỗi gì
- Xem PHP error log trong Plesk/cPanel
- Đảm bảo PHP >= 7.4 và pdo_sqlite được bật

**Admin không load (blank page):**
- Kiểm tra file `admin/index.html` tồn tại
- Kiểm tra `.htaccess` hoặc `web.config` hoạt động

**Upload ảnh lỗi:**
- Kiểm tra thư mục `api/uploads/` có quyền ghi
- Kiểm tra PHP upload_max_filesize >= 10M

**Session bị mất:**
- Kiểm tra thư mục `api/database/sessions/` có quyền ghi
- Nếu dùng HTTPS, đảm bảo cấu hình SSL đúng

## Tech Stack

- Frontend: React 18 + Vite + TypeScript
- Admin: React 18 + React Router 6 + TypeScript
- Backend: PHP (vanilla, no framework)
- Database: SQLite (tự seed dữ liệu mẫu khi khởi động lần đầu)
- Hosting: bất kỳ shared hosting có PHP + pdo_sqlite
