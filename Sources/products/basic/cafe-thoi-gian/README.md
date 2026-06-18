# Cà Phê Thời Gian — Website Deploy Package

Website hoàn chỉnh cho quán cà phê: React SPA + PHP API + SQLite.

## Cấu trúc

```
cafe-thoi-gian/
├── website/    React SPA trang chủ (port từ template HTML)
├── admin/      React SPA quản trị
├── api/        PHP backend + SQLite
├── build.bat   Windows build script
├── build.sh    Linux/Mac build script
└── build.mjs   Node.js build logic
```

## Hướng dẫn Build

### Windows
```
Double-click build.bat
```

### Linux / Mac
```bash
bash build.sh
```

Output: thư mục `deploy/` sẵn sàng upload lên hosting.

## Hướng dẫn Deploy

### Bước 1 — Upload
Upload toàn bộ nội dung trong thư mục `deploy/` lên `public_html/` của hosting.

### Bước 2 — Cấu hình (BẮT BUỘC)
Mở file `api/config.php` và sửa:
```
APP_URL = 'https://tenweb.vn'   // URL thực của website (không có / cuối)
```
> APP_KEY đã được tự động tạo ngẫu nhiên bởi build.mjs — không cần sửa.

### Bước 3 — Kiểm tra hosting
Truy cập: `https://tenweb.vn/api/health`

Kết quả JSON cần có:
- `"pdo_sqlite": true` — nếu `false`, hosting không hỗ trợ SQLite → cần đổi sang MySQL
- `"db_dir": "writable"` — nếu `"not writable"`, cần `chmod 755 api/database/`
- `"schema_sql": "found"` — nếu `"MISSING"`, upload lại file `api/schema.sql`

### Bước 4 — Phân quyền thư mục (nếu cần)
```bash
chmod 755 api/database/
chmod 755 api/uploads/
```

### Bước 5 — Đăng nhập admin
```
URL:      https://tenweb.vn/admin
Email:    sysadmin@admin.com
Mật khẩu: 123456
```
**Nhớ đổi mật khẩu ngay sau khi đăng nhập lần đầu!**

## Yêu cầu Hosting

- PHP 7.4+ (khuyến nghị 8.x)
- Extension: `pdo_sqlite`
- `mod_rewrite` (Apache) hoặc URL Rewrite Module (IIS)
- Thư mục `api/database/` và `api/uploads/` phải có quyền ghi

## Admin Panel

### Menu:
| Module | Chức năng |
|--------|-----------|
| Hero Slides | Ảnh và nội dung slider trang chủ |
| Danh mục | Nhóm trong thực đơn (Espresso, Cold Brew, Trà, Bánh, ...) |
| Món & Đồ uống | CRUD toàn bộ thực đơn |
| Đặt chỗ | Xem và xác nhận yêu cầu đặt bàn |
| Gallery ảnh | Bộ sưu tập hình ảnh quán |
| Đánh giá | Quản lý testimonials hiển thị trang chủ |
| Liên hệ | Tin nhắn từ form liên hệ |
| Cài đặt | Toàn bộ nội dung text, SEO, social, SMTP |
| Media | Thư viện upload ảnh |

## Tính năng website

- **Trang chủ**: Hero slider, món nổi bật, câu chuyện quán, phương pháp pha chế, không gian, menu nhanh, đánh giá, form đặt chỗ
- **Thực đơn**: Hiển thị full menu theo danh mục
- **Không gian**: Gallery ảnh, 3 khu vực, đặt sự kiện
- **Liên hệ**: Form đặt chỗ + thông tin liên hệ + bản đồ
- Responsive đầy đủ (mobile, tablet, desktop)
- Zalo float button

## Tech Stack

| Layer | Công nghệ |
|-------|-----------|
| Frontend | React 18 + TypeScript + Vite |
| Admin | React 18 + TypeScript + Vite |
| Backend | PHP 8.x (thuần, không framework) |
| Database | SQLite (zero config) |
| CSS | Template gốc (cafe brown theme) |

---
Được tạo bởi **webdrop.vn**
