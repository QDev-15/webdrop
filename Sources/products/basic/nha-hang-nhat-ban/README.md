# Nhà Hàng Nhật Bản — Omakase & Sushi

Website deploy hoàn chỉnh: React SPA + PHP Backend + SQLite Database.

## Cấu trúc dự án

```
nha-hang-nhat-ban/
├── website/     React SPA — trang public
├── admin/       React SPA — trang quản trị
├── api/         PHP backend + SQLite
├── build.mjs    Script build tự động
├── build.bat    Windows build
├── build.sh     Linux/Mac build
└── deploy/      Output sau khi build (upload lên hosting)
```

## Build & Deploy

### Bước 1 — Build

**Windows:**
```bat
build.bat
```

**Linux/Mac:**
```bash
bash build.sh
```

Output sẽ được tạo trong thư mục `deploy/`.

### Bước 2 — Upload lên hosting

Upload toàn bộ nội dung trong thư mục `deploy/` lên `public_html/` của hosting.

### Bước 3 — Cấu hình (BẮT BUỘC)

Mở file `api/config.php` trên hosting và sửa:

```php
define('APP_URL', 'https://tenweb.vn');  // URL thực của website, KHÔNG có / cuối
```

`APP_KEY` đã được auto-generate bởi build script — không cần sửa thủ công.

### Bước 4 — Kiểm tra hosting

Truy cập: `https://yourdomain.com/api/health`

Kết quả JSON phải có:
- `"pdo_sqlite": true` — nếu false, hosting không hỗ trợ SQLite
- `"db_dir": "writable"` — nếu "not writable", chmod 755 cho thư mục `api/database/`
- `"schema_sql": "found"` — nếu "MISSING", upload lại file `api/schema.sql`

### Bước 5 — Phân quyền thư mục (nếu cần)

```bash
chmod 755 api/database/
chmod 755 api/uploads/
```

### Bước 6 — Đăng nhập admin

Truy cập: `https://yourdomain.com/admin`

| Thông tin | Giá trị |
|-----------|---------|
| Email | `sysadmin@admin.com` |
| Mật khẩu | `123456` |

**Lưu ý: Đổi mật khẩu ngay sau khi đăng nhập lần đầu!**

## Yêu cầu hosting

| Yêu cầu | Chi tiết |
|---------|----------|
| PHP | 7.4+ (khuyến nghị 8.x) |
| Extension | `pdo_sqlite` |
| Web server | Apache (mod_rewrite) hoặc IIS (URL Rewrite Module) |
| Thư mục writable | `api/database/`, `api/uploads/` |

## Tính năng admin

| Module | Mô tả |
|--------|-------|
| Dashboard | Thống kê tổng quan: đặt bàn, liên hệ mới |
| Hero Slides | Quản lý slider trang chủ |
| Thực đơn | Danh mục và món ăn (Sashimi, Sushi, Ramen, Teppanyaki, Set cơm, Tráng miệng) |
| Đặt bàn | Xem và quản lý lịch đặt bàn (xác nhận / hủy) |
| Thư viện ảnh | Gallery ảnh nhà hàng |
| Đánh giá | Quản lý testimonials thực khách |
| Liên hệ | Tin nhắn từ form liên hệ |
| Media | Upload và quản lý ảnh |
| Cài đặt | Thông tin chung, SEO, mạng xã hội, SMTP, Cloudinary, Unsplash |

## Tài khoản mặc định

- **Đăng nhập admin:** `/admin`
- **Email:** `sysadmin@admin.com`
- **Mật khẩu:** `123456`

## Cấu hình nâng cao

### Unsplash (tìm ảnh miễn phí)

Vào Admin > Cài đặt > Tích hợp > nhập Unsplash Access Key.
Tạo API key tại: https://unsplash.com/developers

### Cloudinary (lưu trữ ảnh cloud)

Vào Admin > Cài đặt > Cloudinary > nhập thông tin tài khoản.
Tạo tài khoản miễn phí tại: https://cloudinary.com

### SMTP Email

Vào Admin > Cài đặt > SMTP Email > cấu hình để nhận thông báo qua email.

## Cấu trúc URL

| URL | Mô tả |
|-----|-------|
| `/` | Trang chủ |
| `/thuc-don` | Thực đơn |
| `/sushi-bar` | Trải nghiệm Sushi Bar |
| `/dat-ban` | Đặt bàn |
| `/lien-he` | Liên hệ |
| `/admin` | Trang quản trị |
| `/api/health` | Kiểm tra trạng thái API |
