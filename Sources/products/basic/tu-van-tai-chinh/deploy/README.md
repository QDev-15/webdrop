# VietFinance — Website Tư Vấn Tài Chính

Website React SPA + PHP API + SQLite cho công ty tư vấn tài chính chuyên nghiệp.

## Cấu trúc

```
tu-van-tai-chinh/
├── website/      ← React SPA public site
├── admin/        ← React SPA admin panel
├── api/          ← PHP backend + SQLite
├── build.bat     ← Build trên Windows
├── build.sh      ← Build trên Linux/Mac
└── build.mjs     ← Build script (Node.js)
```

## Build và Deploy

### Yêu cầu
- Node.js 18+
- PHP 7.4+ với extension pdo_sqlite
- mod_rewrite (Apache) hoặc URL Rewrite Module (IIS)

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

### Bước 2 — Upload

Upload toàn bộ nội dung trong thư mục `deploy/` lên `public_html/` của hosting.

### Bước 3 — Cấu hình (BẮT BUỘC)

Mở file `api/config.php` và sửa:
- `APP_URL` → URL thực của website (ví dụ: `https://vietfinance.vn`) — không có dấu `/` cuối
- `APP_KEY` đã được tạo tự động khi build — **không cần sửa**

### Bước 4 — Kiểm tra hosting

Truy cập: `https://yourdomain.vn/api/health`

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

Truy cập: `https://yourdomain.vn/admin`

| Thông tin | Giá trị |
|---|---|
| Email | sysadmin@admin.com |
| Mật khẩu | 123456 |

**Đổi mật khẩu ngay sau khi đăng nhập lần đầu!**

## Yêu cầu Hosting

| Yêu cầu | Chi tiết |
|---|---|
| PHP | 7.4+ (khuyến nghị 8.x) |
| Extension | pdo_sqlite |
| Web server | Apache + mod_rewrite hoặc IIS + URL Rewrite |
| Thư mục ghi | api/database/ và api/uploads/ |

## Admin Menu

| Module | Mô tả |
|---|---|
| Dashboard | Tổng quan, thống kê, liên hệ mới |
| Hero Slides | Quản lý slider trang chủ |
| Dịch vụ | CRUD 4 dịch vụ tư vấn |
| Đội ngũ | CRUD ban lãnh đạo và chuyên gia |
| Đánh giá | CRUD testimonials khách hàng |
| Liên hệ | Xem và quản lý form đặt lịch tư vấn |
| Media | Thư viện ảnh upload |
| Cài đặt | Thông tin công ty, SEO, SMTP, v.v. |

## API Endpoints

| Method | Path | Mô tả |
|---|---|---|
| GET | /api/health | Kiểm tra hệ thống |
| POST | /api/auth/login | Đăng nhập |
| GET | /api/public/settings | Settings public |
| GET | /api/public/hero-slides | Slides trang chủ |
| GET | /api/public/services | Danh sách dịch vụ |
| GET | /api/public/team | Đội ngũ chuyên gia |
| GET | /api/public/testimonials | Đánh giá khách hàng |
| POST | /api/public/contact | Gửi form đặt lịch |

## Tài khoản mặc định

```
Email:    sysadmin@admin.com
Password: 123456
```

Thay đổi ngay sau khi deploy!
