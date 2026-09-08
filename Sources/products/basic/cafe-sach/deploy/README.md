# Lặng Trang — Cà Phê Sách Yên Tĩnh — Hướng dẫn Deploy

## Yêu cầu hosting

- PHP 7.4+ với extension `pdo_sqlite`
- Quyền ghi vào thư mục (chmod 755)
- Apache (mod_rewrite) hoặc IIS (URL Rewrite module)

## Bước 1: Build

**Windows:**
```
build.bat
```

**Linux/Mac:**
```
bash build.sh
```

Output nằm tại `../_output-deploy/` (thư mục cùng cấp với source).

## Bước 2: Upload

Upload toàn bộ nội dung trong `_output-deploy/` lên thư mục gốc của hosting (thường là `public_html/` hoặc `httpdocs/`).

Cấu trúc sau khi upload:
```
public_html/
├── index.html          ← Website chính
├── assets/             ← JS/CSS website
├── admin/              ← Trang quản trị
├── api/                ← PHP backend
│   ├── config.php      ← Cần sửa APP_URL
│   ├── database/       ← SQLite DB (tự tạo)
│   └── uploads/        ← Media uploads
├── .htaccess           ← Apache routing
└── web.config          ← IIS routing
```

## Bước 3: Cấu hình

Mở file `api/config.php` và sửa:

```php
define('APP_URL', 'https://ten-domain-cua-ban.vn');
```

## Bước 4: Phân quyền (Linux/cPanel)

```bash
chmod 755 api/database/
chmod 755 api/uploads/
```

## Bước 5: Kiểm tra

Truy cập: `https://ten-domain.vn/api/health`

Kết quả mong đợi:
```json
{
  "status": "ok",
  "pdo_sqlite": true,
  "db_dir": "writable"
}
```

## Bước 6: Đăng nhập Admin

- URL: `https://ten-domain.vn/admin`
- Email: `sysadmin@admin.com`
- Mật khẩu: `123456`

**Đổi mật khẩu ngay sau khi đăng nhập lần đầu!**

Vào: Admin → Hồ sơ (Profile) → Đổi mật khẩu

## Bước 7: Cấu hình website

Vào Admin → Cài đặt để cập nhật:
- Tên quán, địa chỉ, số điện thoại, giờ mở cửa
- Mạng xã hội (Facebook, Instagram, Zalo)
- SEO (meta title, description)
- Google Maps embed (tab Liên hệ)
- Nội dung trang Giới thiệu (câu chuyện, triết lý, số liệu thống kê)

Vào Admin → các mục quản lý nội dung:
- **Thực đơn**: Danh mục + Món & đồ uống
- **Thư viện ảnh**: ảnh khu vực đọc (Không gian) và khoảnh khắc (Khoảnh khắc)
- **Đánh giá**: nhận xét khách hàng
- **Câu hỏi thường gặp**: FAQ trang chủ
- **Đặt chỗ / Liên hệ**: xem yêu cầu đặt chỗ gửi từ trang Liên hệ

## Bảo mật sau khi deploy

**Xóa file `api/check-hash.php` khỏi server sau khi deploy xong** — đây là file debug dùng để verify mật khẩu hash trực tiếp trên server, không nên để lại trên môi trường production.

## Xử lý lỗi thường gặp

**500 Internal Server Error:**
- Kiểm tra `/api/health` — nếu không truy cập được, mod_rewrite chưa bật
- Đảm bảo `api/database/` có quyền ghi (chmod 755)
- Kiểm tra PHP extension `pdo_sqlite` đã bật chưa

**Admin không đăng nhập được:**
- Kiểm tra `api/config.php` APP_URL có khớp domain thực không
- Xóa cookie trình duyệt và thử lại

**Ảnh không hiển thị:**
- Unsplash images: cần kết nối internet
- Upload ảnh local: đảm bảo `api/uploads/` có quyền ghi

## Thông tin kỹ thuật

- Frontend: React 18 + React Router + Vite
- Backend: PHP 8.x thuần (không framework)
- Database: SQLite (tự seed khi deploy lần đầu)
- CSS: Bootstrap 5.3.3 + Template CSS tùy chỉnh (Identity Token: ZEN-MINIMAL)
- Font: Cormorant Garamond (heading) + DM Sans (body) — Bunny Fonts CDN
- Accent color: Forest Green `#3f5b45`
