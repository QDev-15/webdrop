# Quán Ăn Phở Bình Dân — Website Deploy Package

Website hoàn chỉnh: React SPA + PHP backend + SQLite.

## Yêu cầu hosting

- PHP 7.4+ (khuyến nghị 8.x)
- Extension: `pdo_sqlite` (bật sẵn trên hầu hết shared hosting)
- Apache với `mod_rewrite` HOẶC IIS với URL Rewrite Module
- Thư mục `api/database/` và `api/uploads/` phải có quyền ghi (chmod 755)

## Hướng dẫn Deploy

### Bước 1 — Build (nếu chưa build)

```
# Windows:
build.bat

# Linux/Mac:
bash build.sh
```

Output: thư mục `deploy/`

### Bước 2 — Upload

Upload **toàn bộ nội dung** trong thư mục `deploy/` lên `public_html/` của hosting.

Cấu trúc sau khi upload:
```
public_html/
├── index.html       ← Trang chủ website
├── assets/          ← CSS, JS của website
├── admin/           ← Admin panel
│   ├── index.html
│   └── assets/
└── api/             ← PHP backend
    ├── config.php   ← CẦN SỬA sau khi upload
    ├── schema.sql
    ├── database/    ← SQLite DB (tự tạo khi chạy lần đầu)
    └── uploads/     ← File ảnh upload
```

### Bước 3 — Cấu hình (BẮT BUỘC)

Mở file `api/config.php` và sửa:

```php
define('APP_URL', 'https://tenweb.vn');  // URL thực của website (không có / cuối)
```

> `APP_KEY` đã được auto-generate bởi build script — không cần sửa.

### Bước 4 — Kiểm tra

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

Nếu `pdo_sqlite: false` → hosting không hỗ trợ SQLite → liên hệ host hoặc đổi sang MySQL.
Nếu `db_dir: "not writable"` → chạy `chmod 755 api/database/` trên hosting.

### Bước 5 — Phân quyền thư mục (nếu cần)

```bash
chmod 755 api/database/
chmod 755 api/uploads/
```

### Bước 6 — Đăng nhập admin

Truy cập: `https://tenweb.vn/admin`

```
Email:    sysadmin@admin.com
Mật khẩu: 123456
```

**Đổi mật khẩu ngay sau khi đăng nhập lần đầu!**
Vào: Admin → Tài khoản của tôi → Đổi mật khẩu

## Cấu trúc Admin

| Menu | Chức năng |
|---|---|
| Dashboard | Thống kê tổng quan |
| Hero Slides | Quản lý ảnh slider trang chủ |
| Danh mục thực đơn | Thêm/sửa/xóa danh mục |
| Món ăn | Thêm/sửa/xóa món ăn với ảnh |
| Đánh giá | Quản lý đánh giá khách hàng |
| Thư viện ảnh | Gallery hình ảnh quán |
| Liên hệ | Xem tin nhắn từ khách hàng |
| Media | Upload và quản lý ảnh |
| Cài đặt | Thông tin website, SEO, mạng xã hội, SMTP... |
| Tài khoản | Đổi mật khẩu |

## Tùy chỉnh nội dung

Toàn bộ nội dung trang chính được quản lý qua Admin:

- **Tên quán, địa chỉ, SĐT, email** → Cài đặt → Thông tin chung
- **Ảnh slider trang chủ** → Hero Slides
- **Thực đơn** → Danh mục + Món ăn
- **Đánh giá khách hàng** → Đánh giá
- **Hình ảnh quán** → Thư viện ảnh
- **Facebook, Zalo, Instagram** → Cài đặt → Mạng xã hội
- **Google Maps embed** → Cài đặt → Liên hệ & Bản đồ
- **SEO (title, description)** → Cài đặt → SEO

## Upload ảnh

Hỗ trợ 2 cách upload ảnh trong admin:
1. **Upload từ máy tính** — drag & drop hoặc click chọn file
2. **Tìm ảnh Unsplash** — click biểu tượng tìm kiếm, nhập từ khóa

## Hỗ trợ

- Kiểm tra lỗi: `https://tenweb.vn/api/health`
- Log PHP: `api/` → `error_log`
