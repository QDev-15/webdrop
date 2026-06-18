# Agency Web — Hướng dẫn Deploy

Website agency với React SPA + PHP backend + SQLite.

## Cấu trúc dự án

```
agency-web/
├── website/     React SPA trang chính
├── admin/       React SPA trang quản trị
├── api/         PHP backend + SQLite
├── build.mjs    Build script (Node.js)
├── build.bat    Build cho Windows
└── build.sh     Build cho Linux/Mac
```

## Build dự án

### Yêu cầu
- Node.js 18+
- PHP 7.4+ (để test local)

### Chạy build

**Windows:**
```
double-click build.bat
```

**Linux/Mac:**
```bash
bash build.sh
```

Output sẽ tạo thư mục `deploy/` — đây là thứ cần upload lên hosting.

---

## Hướng dẫn Deploy lên Hosting

### Bước 1 — Upload
Upload **toàn bộ nội dung trong thư mục `deploy/`** lên thư mục `public_html/` của hosting.

Cấu trúc sau khi upload:
```
public_html/
├── index.html        ← Trang chính
├── assets/           ← JS/CSS website
├── admin/            ← Trang quản trị
│   ├── index.html
│   └── assets/
├── api/              ← PHP backend
│   ├── index.php
│   ├── config.php    ← ⚠️ CẦN SỬA
│   ├── schema.sql
│   ├── database/     ← SQLite DB sẽ tạo ở đây
│   └── uploads/      ← Ảnh upload
├── .htaccess         ← Apache routing
└── web.config        ← IIS routing
```

### Bước 2 — Cấu hình (BẮT BUỘC)

Mở file `api/config.php` và sửa:

```php
// ⚠️  Sửa APP_URL thành URL thực của hosting (không có dấu / cuối)
define('APP_URL', 'https://yourdomain.com');
```

**Lưu ý:** `APP_KEY` đã được tự động generate trong quá trình build — không cần sửa.

### Bước 3 — Kiểm tra hosting

Truy cập: `https://yourdomain.com/api/health`

Kết quả JSON phải có:
```json
{
  "status": "ok",
  "pdo_sqlite": true,
  "db_dir": "writable",
  "schema_sql": "found"
}
```

- `"pdo_sqlite": true` — bắt buộc. Nếu `false`: hosting không hỗ trợ SQLite
- `"db_dir": "writable"` — bắt buộc. Nếu `"not writable"`: cần `chmod 755 api/database/`
- `"schema_sql": "found"` — bắt buộc. Nếu `"MISSING"`: upload lại file `api/schema.sql`

### Bước 4 — Phân quyền (nếu cần)

Trên Linux hosting:
```bash
chmod 755 api/database/
chmod 755 api/uploads/
```

### Bước 5 — Đăng nhập admin

Truy cập: `https://yourdomain.com/admin`

```
Email:     sysadmin@admin.com
Mật khẩu: 123456
```

**Quan trọng:** Đổi mật khẩu ngay sau khi đăng nhập lần đầu! (Vào mục Tài khoản → Đổi mật khẩu)

---

## Yêu cầu Hosting

| Yêu cầu | Bắt buộc |
|---|---|
| PHP 7.4+ (khuyến nghị 8.x) | Bắt buộc |
| Extension `pdo_sqlite` | Bắt buộc |
| `mod_rewrite` (Apache) hoặc URL Rewrite Module (IIS) | Bắt buộc |
| HTTPS | Khuyến nghị |

## Phân hệ Admin

| Module | URL |
|---|---|
| Dashboard | `/admin` |
| Hero Slides | `/admin/slides` |
| Dịch vụ | `/admin/services` |
| Dự án / Portfolio | `/admin/projects` |
| Đội ngũ | `/admin/team` |
| Đánh giá khách hàng | `/admin/testimonials` |
| Liên hệ | `/admin/contacts` |
| Media Library | `/admin/media` |
| Cài đặt | `/admin/settings` |
| Tài khoản | `/admin/users` |

## Troubleshooting

**Lỗi 500 khi vào website:**
- Kiểm tra `/api/health` trước
- Đảm bảo `api/database/` có quyền write (chmod 755)

**Trang `/admin` trả về trang chủ (không phải trang login):**
- Kiểm tra file `.htaccess` hoặc `web.config` đã được upload chưa
- IIS: đảm bảo đã cài URL Rewrite Module

**API trả lỗi 405 (Method Not Allowed):**
- Xảy ra trên IIS/Windows hosting
- Đảm bảo `web.config` trong thư mục `api/` đã có cấu hình remove WebDAV

**Upload ảnh không hoạt động:**
- Kiểm tra quyền của thư mục `api/uploads/` (chmod 755)
- Kiểm tra PHP `upload_max_filesize` và `post_max_size`
