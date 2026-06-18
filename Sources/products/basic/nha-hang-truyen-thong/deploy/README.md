# Nhà Hàng Ẩm Thực Truyền Thống — Website Deploy

Website nhà hàng ẩm thực Việt Nam truyền thống — React SPA + PHP Backend + SQLite.

## Cấu trúc thư mục

```
deploy/
├── index.html, assets/   ← Trang chủ và các trang public
├── .htaccess             ← SPA routing (Apache)
├── web.config            ← SPA routing (IIS/Windows hosting)
├── admin/                ← Trang quản trị admin
│   └── index.html
└── api/                  ← PHP backend + SQLite database
    ├── config.php        ← Cấu hình (BẮT BUỘC SỬA sau khi upload)
    ├── schema.sql        ← Database schema
    ├── index.php         ← Entry point API
    ├── database/         ← SQLite database file (tự tạo khi chạy lần đầu)
    └── uploads/          ← Thư mục chứa ảnh upload
```

## Hướng dẫn Deploy

### Bước 1 — Chạy build (nếu cần)

Nếu bạn có source code, chạy build trước:

```bash
# Windows
build.bat

# Linux/Mac
bash build.sh
```

Sau khi build, thư mục `deploy/` sẽ được tạo ra.

### Bước 2 — Upload lên hosting

Upload toàn bộ nội dung trong thư mục `deploy/` lên thư mục `public_html/` của hosting.

**Lưu ý:** Upload nội dung BÊN TRONG `deploy/`, không phải thư mục `deploy/` chính nó.

### Bước 3 — Cấu hình (BẮT BUỘC)

Mở file `api/config.php` và sửa:

```php
define('APP_URL', 'https://yourdomain.com');  // URL thực của website (không có / cuối)
```

> APP_KEY đã được tự động tạo bởi build script. Không cần sửa.

### Bước 4 — Kiểm tra hosting

Truy cập URL sau để kiểm tra:

```
https://yourdomain.com/api/health
```

Kết quả JSON phải có:
- `"pdo_sqlite": true` — nếu `false`, hosting không hỗ trợ SQLite → cần chuyển sang MySQL
- `"db_dir": "writable"` — nếu `"not writable"`, chạy: `chmod 755 api/database/`
- `"schema_sql": "found"` — nếu `"MISSING"`, upload lại file `api/schema.sql`

### Bước 5 — Phân quyền thư mục (Linux hosting)

```bash
chmod 755 api/database/
chmod 755 api/uploads/
```

### Bước 6 — Đăng nhập admin

Truy cập trang quản trị:
```
https://yourdomain.com/admin
```

Tài khoản mặc định:
- **Email:** `sysadmin@admin.com`
- **Mật khẩu:** `123456`

> **Quan trọng:** Đổi mật khẩu ngay sau khi đăng nhập lần đầu!
> Vào Admin → avatar góc trái dưới → Tài khoản của tôi → Đổi mật khẩu

## Yêu cầu hosting

| Yêu cầu | Tối thiểu | Khuyến nghị |
|---|---|---|
| PHP | 7.4+ | 8.1+ |
| Extension | pdo_sqlite | pdo_sqlite, gd |
| Web server | Apache + mod_rewrite | Apache 2.4+ hoặc IIS 10+ |
| Disk | 50MB | 500MB+ |

### Hosting thử nghiệm thành công
- PA Vietnam (Windows IIS + PHP 8.3 FastCGI)
- AZDIGI (Linux Apache + PHP 8.2)
- SiteGround (Linux Apache + PHP 8.1)

## Tính năng

### Trang chủ
- Slider ảnh hero (quản lý qua admin)
- Menu nổi bật với tab filter theo danh mục
- Câu chuyện nhà hàng với số liệu thống kê
- Thư viện ảnh không gian
- Lý do chọn nhà hàng
- Đánh giá từ thực khách

### Các trang
- `/thuc-don` — Thực đơn đầy đủ theo danh mục
- `/dat-ban` — Form đặt bàn online
- `/lien-he` — Thông tin liên hệ + bản đồ + form

### Admin (`/admin`)
- **Dashboard** — Thống kê tổng quan
- **Hero Slides** — Quản lý slider trang chủ
- **Danh mục thực đơn** — Khai vị, Món chính, Tráng miệng, Đồ uống
- **Món ăn** — CRUD đầy đủ với ảnh, giá, badge
- **Đặt bàn** — Xem và xử lý đơn đặt bàn
- **Thư viện ảnh** — Ảnh không gian nhà hàng
- **Đánh giá** — Quản lý testimonials
- **Liên hệ** — Xem tin nhắn từ khách
- **Media** — Quản lý file upload
- **Cài đặt** — Toàn bộ nội dung website

## Hỗ trợ kỹ thuật

Nếu gặp vấn đề:
1. Kiểm tra `/api/health` endpoint
2. Kiểm tra PHP error log của hosting
3. Đảm bảo `api/database/` có quyền ghi (chmod 755)
4. Đảm bảo `api/uploads/` có quyền ghi (chmod 755)

---

Phát triển bởi **webdrop.vn** — Made in Vietnam
