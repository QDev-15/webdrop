# LuxDental — Nha Khoa Thẩm Mỹ Cao Cấp

> WebDeploy project — BOLD-EDITORIAL identity | CSS prefix: `lx-` | Scarlet `#d63b1f`

## Tech Stack

- **Website**: React SPA (Syne font, BOLD-EDITORIAL design)
- **Admin**: React SPA (6 tabs + media/settings/profile)
- **Backend**: PHP 8.x + SQLite (PDO)
- **Build**: Vite 5

## Tài khoản mặc định

| Field | Value |
|---|---|
| Email | `sysadmin@admin.com` |
| Password | `123456` |
| Role | `superadmin` |

**Đổi mật khẩu ngay sau lần đăng nhập đầu tiên!**

## Cấu trúc

```
nha-khoa-tham-my-luxdental/
├── website/          ← React SPA public (6 trang)
├── admin/            ← React SPA admin panel
├── api/              ← PHP backend + SQLite
│   ├── index.php     ← Entry point
│   ├── config.php    ← Cấu hình (sửa APP_URL)
│   ├── schema.sql    ← Schema SQLite
│   └── src/
│       ├── Database.php     ← Migrate + Seed
│       ├── bootstrap.php    ← Routes
│       └── controllers/     ← 13 controllers
├── build.bat         ← Windows build
└── build.sh          ← Linux/Mac build
```

## Trang website

| Route | Trang |
|---|---|
| `/` | Trang chủ |
| `/dich-vu` | Dịch vụ |
| `/truoc-sau` | Trước & Sau |
| `/bac-si` | Đội ngũ bác sĩ |
| `/dat-lich` | Đặt lịch |
| `/lien-he` | Liên hệ |

## Hướng dẫn Deploy

### 1. Build

**Windows:**
```bat
build.bat
```

**Linux/Mac:**
```bash
bash build.sh
```

Output: `../_output-deploy/` (cùng cấp, không phải trong thư mục source)

### 2. Upload lên Hosting

Upload toàn bộ nội dung thư mục `_output-deploy/` lên `public_html/` (hoặc thư mục web root).

**Yêu cầu hosting:**
- PHP 8.0+
- Extension: `pdo_sqlite`, `json`, `mbstring`
- Apache với `mod_rewrite` HOẶC IIS với URL Rewrite

### 3. Cấu hình

Sửa file `api/config.php`:
```php
define('APP_URL', 'https://your-domain.com');  // URL thật của site
define('DB_FILE', __DIR__ . '/luxdental.db');   // Đường dẫn SQLite
```

APP_KEY được tự động tạo khi build (randomBytes(32)).

### 4. Khởi động lần đầu

Database tự động migrate + seed khi PHP nhận request đầu tiên — không cần setup thủ công.

Seed data gồm:
- 3 nhóm dịch vụ (Veneer & Phục hình, Tẩy trắng & Niềng răng, Phẫu thuật & Implant)
- 9 dịch vụ thẩm mỹ nha khoa
- 4 bác sĩ chuyên khoa
- 3 testimonials
- 35 settings keys

### 5. Truy cập

- **Website**: `https://your-domain.com/`
- **Admin**: `https://your-domain.com/admin/`

## Admin Panel

| Section | Routes |
|---|---|
| Tổng quan | `/` (Dashboard) |
| Dịch vụ | `/services`, `/service-categories` |
| Đội ngũ | `/team` |
| Đánh giá | `/testimonials` |
| Hero Slides | `/slides` |
| Đặt lịch | `/bookings` |
| Liên hệ | `/contacts` |
| Media | `/media` |
| Cài đặt | `/settings` (10 tabs) |
| Hồ sơ | `/profile` |

## Bảo mật

- File `api/check-hash.php` dùng để test password hash trong quá trình phát triển.
  **Xóa file này sau khi deploy lên production!**
- File `.db` được chặn truy cập HTTP qua `.htaccess`/`web.config`
- Session name riêng: `NhaKhoaThamMyLuxdental`

## Settings quan trọng

Đăng nhập Admin → Cài đặt để chỉnh:

| Tab | Keys quan trọng |
|---|---|
| Thông tin chung | `site_name`, `site_phone`, `site_address`, `working_hours` |
| SEO | `meta_title`, `meta_description`, `og_image` |
| Mạng xã hội | `facebook`, `instagram`, `zalo` |
| Hero | `hero_title_line1`, `hero_title_line2`, `hero_subtitle` |
| Thống kê | `stat_cases`, `stat_doctors`, `stat_years`, `stat_satisfaction` |
| Cloudinary | `cloudinary_cloud_name`, `cloudinary_api_key`, `cloudinary_api_secret` |

## Design Identity

- **Token**: BOLD-EDITORIAL
- **Font**: Syne weight 800, Bunny Fonts
- **Accent**: Scarlet `#d63b1f`
- **Background**: `#faf9f6` (warm white)
- **Dark**: `#0a0a0a`
- **Nav**: Nav-8 — underline-active only, always-solid background
- **Hero**: H5 Bold Typography Only — huge heading, diagonal pattern, watermark "Smile"
- **Cards**: `border-left: 6px solid var(--accent)`, 0px border-radius

## Build info

- Website: 49 modules, ~210kB JS — 0 TypeScript errors
- Admin: 56 modules, ~237kB JS — 0 TypeScript errors
- PHP: 24/24 files OK, 0 BOM
