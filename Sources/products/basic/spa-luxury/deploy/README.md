# Luxury Spa Resort — Hướng dẫn Deploy

Website hoàn chỉnh: React SPA + PHP API + SQLite
Template: Spa Luxury (dark luxury, champagne gold accent)

---

## Yêu cầu Hosting

- PHP 8.1+ với extension: `pdo_sqlite`, `pdo`, `json`, `fileinfo`
- Apache + mod_rewrite **hoặc** IIS + URL Rewrite Module
- Thư mục ghi được: `api/database/`, `api/uploads/`

---

## Bước 1 — Upload lên Hosting

Upload toàn bộ nội dung thư mục `_output-deploy/` lên thư mục gốc website (public_html hoặc wwwroot).

Cấu trúc sau khi upload:
```
public_html/
├── index.html          ← trang chủ React SPA
├── assets/             ← JS, CSS bundle của website
├── web.config          ← SPA routing cho IIS
├── .htaccess           ← SPA routing cho Apache
├── favicon.ico
├── admin/
│   ├── index.html      ← admin panel React SPA
│   └── assets/
└── api/
    ├── index.php       ← PHP API entry point
    ├── config.php      ← CẦN SỬA sau khi upload
    ├── schema.sql      ← DB schema + seed data
    ├── .htaccess       ← bảo vệ file .db
    ├── database/       ← SQLite DB tự tạo (cần chmod 755)
    └── uploads/        ← ảnh upload (cần chmod 755)
```

---

## Bước 2 — Sửa config.php

Mở file `api/config.php` và sửa:

```php
// Bắt buộc sửa — URL thực của website (không có dấu / cuối)
define('APP_URL', 'https://tenwebsite.vn');

// APP_KEY đã được auto-generate bởi build script — không cần sửa
```

---

## Bước 3 — Phân quyền thư mục (Linux/Apache)

```bash
chmod 755 api/database/
chmod 755 api/uploads/
```

Trên Windows/IIS: đảm bảo IIS_IUSRS có quyền Write vào hai thư mục trên.

---

## Bước 4 — Kiểm tra Health Check

Truy cập: `https://tenwebsite.vn/api/health`

Kết quả mong đợi:
```json
{
  "status": "ok",
  "php": "8.x.x",
  "pdo_sqlite": true,
  "db_dir": "writable",
  "db_exists": false,
  "schema_sql": "found"
}
```

Nếu `db_dir` là `not writable` → chmod lại thư mục `api/database/`.

---

## Bước 5 — Đăng nhập Admin

Truy cập: `https://tenwebsite.vn/admin`

Tài khoản mặc định:
- **Email**: `sysadmin@admin.com`
- **Mật khẩu**: `123456`

**Bắt buộc đổi mật khẩu ngay sau lần đăng nhập đầu tiên** tại: Admin → Profile.

---

## Bước 6 — Cấu hình nội dung

Sau khi đăng nhập admin:

1. **Cài đặt → Chung**: Sửa tên spa, tagline, thông tin hero section
2. **Cài đặt → Liên hệ**: Số điện thoại, email, địa chỉ, giờ làm việc
3. **Cài đặt → SEO**: Meta title, meta description
4. **Cài đặt → Mạng xã hội**: Facebook, Instagram, Zalo
5. **Hero Slides**: Thêm/sửa ảnh hero section
6. **Dịch vụ**: Cập nhật danh mục và danh sách dịch vụ
7. **Đội ngũ**: Thêm thông tin chuyên viên
8. **Đánh giá**: Thêm testimonials từ khách hàng thực

---

## Cấu trúc URLs

| URL | Nội dung |
|-----|----------|
| `/` | Trang chủ |
| `/dich-vu` | Trải nghiệm & Dịch vụ |
| `/dat-lich` | Form đặt gói |
| `/lien-he` | Liên hệ |
| `/admin` | Admin panel |
| `/api/health` | Health check |

---

## Troubleshooting

**Trang trắng sau khi upload**
→ Kiểm tra `/api/health` xem PHP có lỗi không
→ Bật PHP error log trên hosting

**Không đăng nhập được admin**
→ Kiểm tra `api/database/` có file `app.db` chưa (tự tạo khi gọi API đầu tiên)
→ Kiểm tra cookie có bị block không (cần HTTPS cho Secure cookie)

**API trả về 404**
→ Kiểm tra `.htaccess` được upload đúng (file ẩn)
→ Với IIS: đảm bảo `web.config` ở đúng thư mục `api/`

**Ảnh không upload được**
→ `api/uploads/` phải có quyền write
→ Kiểm tra PHP `upload_max_filesize` và `post_max_size` (khuyến nghị tối thiểu 10MB)

---

## Thông tin kỹ thuật

- **Frontend**: React 18 + TypeScript + Vite
- **Backend**: PHP 8.1+ (no framework)
- **Database**: SQLite (tự động tạo và seed lần đầu)
- **CSS**: Custom luxury dark theme (champagne gold accent)
- **Font**: DM Sans via Bunny Fonts
- **Routing**: SPA — .htaccess (Apache) + web.config (IIS)
- **Session**: `spa_luxury_sess` (unique per site)
- **Upload**: Local filesystem (thư mục `api/uploads/`) hoặc Cloudinary (cấu hình trong Settings)
