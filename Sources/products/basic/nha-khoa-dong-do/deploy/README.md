# Nha Khoa Đông Đô — WebDeploy

Identity: **LUXE-DARK** — Cormorant Garamond + DM Sans, nền tối `#0b0d0c`, accent Jade Emerald `#0e7c66`

## Yêu cầu Hosting

- PHP 8.0+ với extension `pdo_sqlite`
- Mod rewrite (Apache) hoặc URL Rewrite (IIS)
- Quyền ghi file cho thư mục `api/` (để tạo database)

## Cấu trúc sau khi build

```
_output-deploy/
├── index.html          ← Public website (React SPA)
├── assets/             ← JS + CSS đã minify
├── .htaccess           ← Apache SPA routing
├── web.config          ← IIS SPA routing
├── favicon.ico
├── admin/
│   ├── index.html      ← Admin panel (React SPA)
│   └── assets/
└── api/
    ├── index.php       ← API entry point
    ├── config.php      ← CẤU HÌNH — chỉnh sửa trước khi deploy
    ├── schema.sql      ← SQLite schema
    └── src/
```

## Cấu hình trước khi deploy

Mở `api/config.php` và điền:

```php
define('SITE_NAME', 'Nha Khoa Đông Đô');
define('SITE_URL',  'https://yourdomain.com');
define('JWT_SECRET', 'random-secret-key-ít-nhất-32-ký-tự');
```

## Deploy

1. Upload toàn bộ nội dung `_output-deploy/` lên public_html (hoặc thư mục web root)
2. Trỏ domain vào thư mục đó
3. Truy cập website lần đầu — database tự động được tạo và seed
4. Đăng nhập admin tại `/admin` với tài khoản mặc định:
   - Email: `sysadmin@admin.com`
   - Mật khẩu: `123456`
5. **Đổi mật khẩu ngay sau lần đăng nhập đầu tiên**

## Trang website

| Route | Mô tả |
|---|---|
| `/` | Trang chủ — hero, dịch vụ nổi bật, đội ngũ, CTA |
| `/dich-vu` | Danh sách tất cả dịch vụ |
| `/doi-ngu-bac-si` | Đội ngũ bác sĩ |
| `/cong-nghe` | Công nghệ & thiết bị |
| `/dat-lich` | Form đặt lịch tư vấn |
| `/lien-he` | Liên hệ + bản đồ |

## Trang admin

| Route | Mô tả |
|---|---|
| `/admin` | Dashboard thống kê |
| `/admin/slides` | Quản lý Hero Slider |
| `/admin/services` | Quản lý dịch vụ |
| `/admin/team` | Quản lý đội ngũ bác sĩ |
| `/admin/bookings` | Quản lý đặt lịch |
| `/admin/testimonials` | Quản lý đánh giá |
| `/admin/contacts` | Tin nhắn liên hệ |
| `/admin/media` | Thư viện ảnh |
| `/admin/settings` | Cài đặt hệ thống |
| `/admin/profile` | Thông tin tài khoản |

## Build từ source

```bash
# Windows
build.bat

# Linux / Mac
bash build.sh
```

Output: `../_output-deploy/` (cùng cấp với thư mục source)

## Kỹ thuật

- **Frontend**: React + TypeScript + Vite, CSS thuần (LUXE-DARK vars), Bunny Fonts
- **Admin**: React + TypeScript + Vite
- **API**: PHP thuần (không framework), chỉ GET + POST (tương thích IIS)
- **Database**: SQLite — auto-seed khi deploy lần đầu
- **CSS prefix**: `dd-` xuyên suốt
- **Session**: `NhaKhoaDongDo` (alphanumeric)
