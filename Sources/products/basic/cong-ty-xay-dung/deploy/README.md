# Website Công Ty Xây Dựng

Website doanh nghiệp cho công ty xây dựng với đầy đủ tính năng quản lý nội dung qua admin panel.

## Tính năng

- **Trang chủ**: Hero slider, thống kê, dịch vụ, dự án tiêu biểu, đánh giá, form báo giá
- **Trang dịch vụ**: Danh sách dịch vụ xây dựng
- **Trang dự án**: Danh mục công trình đã thực hiện với bộ lọc
- **Trang liên hệ**: Form báo giá + bản đồ + thông tin liên hệ
- **Admin panel**: Quản lý toàn bộ nội dung

## Yêu cầu hosting

- PHP 7.4+ (khuyến nghị PHP 8.x)
- Extension: `pdo_sqlite`
- Apache: `mod_rewrite` | IIS: `URL Rewrite Module`

---

## Hướng dẫn Deploy

### Bước 1 — Build (chỉ cần thực hiện 1 lần)

**Windows:**
```
double-click build.bat
```

**Linux/Mac:**
```bash
bash build.sh
```

Sau khi build, thư mục `deploy/` sẽ được tạo.

### Bước 2 — Upload

Upload **toàn bộ nội dung** trong thư mục `deploy/` lên thư mục `public_html/` của hosting.

Cấu trúc sau khi upload:
```
public_html/
├── index.html          ← Website chính
├── assets/             ← JS/CSS của website
├── admin/              ← Admin panel
│   ├── index.html
│   └── assets/
├── api/                ← PHP Backend
│   ├── config.php      ← CẦN SỬA
│   ├── index.php
│   ├── schema.sql
│   ├── database/       ← SQLite DB (cần chmod 755)
│   └── uploads/        ← File upload (cần chmod 755)
├── .htaccess           ← Apache routing
└── web.config          ← IIS routing
```

### Bước 3 — Cấu hình BẮT BUỘC

Mở file `api/config.php` và sửa:

```php
// Sửa thành URL thực của website (không có dấu / cuối)
define('APP_URL', 'https://tenwebsite.vn');
```

> `APP_KEY` đã được tự động sinh ngẫu nhiên khi build — không cần sửa.

### Bước 4 — Phân quyền thư mục (nếu cần)

Trên Linux hosting:
```bash
chmod 755 api/database/
chmod 755 api/uploads/
```

### Bước 5 — Kiểm tra

Truy cập: `https://tenwebsite.vn/api/health`

Kết quả JSON phải có:
- `"pdo_sqlite": true` — nếu `false`, hosting không hỗ trợ SQLite
- `"db_dir": "writable"` — nếu không, chmod thư mục `api/database/`
- `"schema_sql": "found"` — nếu `MISSING`, upload lại file `api/schema.sql`

### Bước 6 — Đăng nhập Admin

Truy cập: `https://tenwebsite.vn/admin`

| Trường | Giá trị |
|--------|---------|
| Email | `sysadmin@admin.com` |
| Mật khẩu | `123456` |

**Sau khi đăng nhập lần đầu, đổi mật khẩu ngay tại: Admin > Tài khoản của tôi**

---

## Quản lý nội dung qua Admin

| Module | Mô tả |
|--------|-------|
| Hero Slides | Ảnh slider trang chủ |
| Dịch vụ | Danh sách dịch vụ xây dựng |
| Dự án | Danh mục công trình đã thực hiện |
| Đánh giá | Nhận xét từ khách hàng |
| Liên hệ | Yêu cầu báo giá từ khách |
| Media | Thư viện ảnh upload |
| Cài đặt | Tên website, logo, liên hệ, SEO, mạng xã hội, v.v. |

---

## Cấu trúc source code

```
cong-ty-xay-dung/
├── website/          ← React SPA công khai
├── admin/            ← React SPA quản trị
├── api/              ← PHP Backend
│   ├── config.php
│   ├── schema.sql
│   ├── index.php
│   └── src/
│       ├── Auth.php
│       ├── Database.php
│       ├── Router.php
│       ├── Response.php
│       ├── bootstrap.php
│       └── controllers/
├── build.mjs         ← Build script
├── build.bat         ← Windows build
└── build.sh          ← Linux/Mac build
```

---

## Tài khoản admin mặc định

| Thông tin | Giá trị |
|-----------|---------|
| Email | sysadmin@admin.com |
| Mật khẩu | 123456 |
| Vai trò | Quản trị viên |

> Đổi mật khẩu ngay sau khi triển khai!
