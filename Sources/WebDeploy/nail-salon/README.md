# Nail Salon — Gói Web Chuẩn (Gói B)

Website nail salon hoàn chỉnh: React SPA + PHP API + SQLite. Upload lên hosting PHP là chạy ngay.

## Yêu cầu hosting

- PHP 8.0+, extension `pdo_sqlite`
- Apache (mod_rewrite) hoặc IIS (URL Rewrite)
- Không cần MySQL, Node.js hay bất kỳ build tool nào

## Cấu trúc deploy

```
_output-deploy/
├── index.html          ← public website (React SPA)
├── assets/             ← JS/CSS/fonts
├── .htaccess           ← Apache SPA routing
├── web.config          ← IIS SPA routing
├── favicon.ico
├── admin/
│   ├── index.html      ← admin panel (React SPA)
│   ├── assets/
│   ├── .htaccess
│   └── web.config
└── api/
    ├── index.php       ← API entry point
    ├── config.php      ← Cấu hình DB, URL, CORS
    ├── .htaccess       ← Block trực tiếp .db
    ├── web.config
    ├── schema.sql      ← SQLite schema
    ├── database.db     ← Tạo tự động lần đầu
    └── src/            ← PHP classes + controllers
```

## Hướng dẫn deploy

### Bước 1 — Build

**Windows:**
```bat
build.bat
```

**Linux/Mac:**
```bash
bash build.sh
```

Output tại `../_output-deploy/nail-salon/`

### Bước 2 — Upload

Upload toàn bộ thư mục `_output-deploy/nail-salon/` lên hosting (thư mục gốc `public_html/` hoặc subdomain).

### Bước 3 — Cấu hình

Mở file `api/config.php` và điền thông tin:

```php
define('APP_URL', 'https://your-domain.com');        // URL website
define('CORS_ORIGINS', ['https://your-domain.com']); // Domains được phép gọi API
```

> `APP_KEY` được tự động generate khi build — không cần điền thủ công.

### Bước 4 — Seed dữ liệu

Truy cập website lần đầu: PHP sẽ tự động:
1. Tạo file `database.db` (SQLite)
2. Chạy migration từ `schema.sql`
3. Seed dữ liệu mặc định

### Bước 5 — Đăng nhập admin

Truy cập `/admin` và đăng nhập với:
- **Email:** `sysadmin@admin.com`
- **Password:** `123456`

> **Đổi mật khẩu ngay sau khi đăng nhập lần đầu!**

## Trang & URL

| URL | Mô tả |
|-----|-------|
| `/` | Trang chủ |
| `/dich-vu` | Dịch vụ & Bảng giá |
| `/dat-lich` | Đặt lịch hẹn |
| `/lien-he` | Liên hệ |
| `/admin` | Trang quản trị |

## Admin Panel

| Mục | Chức năng |
|-----|-----------|
| Dashboard | Thống kê tổng quan |
| Hero Slides | 5 ảnh mosaic trang chủ |
| Danh mục | Nhóm dịch vụ |
| Dịch vụ | CRUD dịch vụ + giá |
| Lịch hẹn | Quản lý đặt lịch |
| Đánh giá | Testimonials khách hàng |
| Đội ngũ | Thông tin thợ nail |
| Gallery | Bộ sưu tập ảnh |
| Liên hệ | Form liên hệ từ web |
| Media | Thư viện ảnh upload |
| Cài đặt | Thông tin web, SEO, SMTP, Unsplash... |

## Build từ source

```bash
# Cài dependencies
cd website && npm install
cd ../admin && npm install

# Build
cd ..
build.bat   # Windows
bash build.sh  # Linux/Mac
```

## Troubleshooting

**Lỗi 500 / API không hoạt động:**
- Kiểm tra PHP error log
- Đảm bảo `pdo_sqlite` extension được bật
- Kiểm tra quyền ghi vào thư mục `api/`

**Trang trắng sau upload:**
- Kiểm tra `.htaccess` (Apache) hoặc `web.config` (IIS) đã được upload
- Với IIS: đảm bảo URL Rewrite module đã cài

**Admin không load:**
- Clear browser cache
- Kiểm tra `/admin/index.html` đã được upload

**CORS error:**
- Cập nhật `CORS_ORIGINS` trong `api/config.php` với đúng domain
