# Sunrise — Nha Khoa Gia Dinh | WebDeploy

Identity: **FRESH-MINIMAL** — Plus Jakarta Sans, accent Sky Blue `#2f8fd1`, nen sang `#f7fafd`

## Yeu cau Hosting

- PHP 8.0+ voi extension `pdo_sqlite`
- Mod rewrite (Apache) hoac URL Rewrite (IIS)
- Quyen ghi file cho thu muc `api/` (de tao database)

## Cau truc sau khi build

```
_output-deploy/
├── index.html          ← Public website (React SPA)
├── assets/             ← JS + CSS da minify
├── .htaccess           ← Apache SPA routing
├── web.config          ← IIS SPA routing
├── favicon.ico
├── admin/
│   ├── index.html      ← Admin panel (React SPA)
│   └── assets/
└── api/
    ├── index.php       ← API entry point
    ├── config.php      ← CAU HINH — chinh sua truoc khi deploy
    ├── schema.sql      ← SQLite schema
    └── src/
```

## Cau hinh truoc khi deploy

Mo `api/config.php` va dien:

```php
define('SITE_NAME', 'Sunrise — Nha Khoa Gia Dinh');
define('SITE_URL',  'https://yourdomain.com');
define('JWT_SECRET', 'random-secret-key-it-nhat-32-ky-tu');
```

## Deploy

1. Upload toan bo noi dung `_output-deploy/` len public_html (hoac thu muc web root)
2. Tro domain vao thu muc do
3. Truy cap website lan dau — database tu dong duoc tao va seed
4. Dang nhap admin tai `/admin` voi tai khoan mac dinh:
   - Email: `sysadmin@admin.com`
   - Mat khau: `123456`
5. **Doi mat khau ngay sau lan dang nhap dau tien**

## Trang website

| Route | Mo ta |
|---|---|
| `/` | Trang chu — hero, gioi thieu, dich vu, doi ngu, cam nhan |
| `/dich-vu` | Danh sach day du dich vu nha khoa theo nhom |
| `/bac-si` | Doi ngu bac si |
| `/dat-lich` | Form dat lich kham |
| `/lien-he` | Lien he + ban do |

## Trang admin

| Route | Mo ta |
|---|---|
| `/admin` | Dashboard thong ke |
| `/admin/slides` | Quan ly Hero Slider |
| `/admin/service-categories` | Nhom dich vu |
| `/admin/services` | Dich vu nha khoa |
| `/admin/team` | Doi ngu bac si |
| `/admin/bookings` | Dat lich kham |
| `/admin/testimonials` | Cam nhan khach hang |
| `/admin/contacts` | Tin nhan lien he |
| `/admin/media` | Thu vien anh |
| `/admin/settings` | Cai dat he thong |
| `/admin/profile` | Thong tin tai khoan |
| `/admin/users` | Quan ly tai khoan (superadmin) |

## Build tu source

```bash
# Windows
build.bat

# Linux / Mac
bash build.sh
```

Output: `../_output-deploy/` (cung cap voi thu muc source)

## Ky thuat

- **Frontend**: React + TypeScript + Vite, CSS thuan (FRESH-MINIMAL vars), Bunny Fonts (Plus Jakarta Sans)
- **Admin**: React + TypeScript + Vite, 57 modules
- **API**: PHP thuan (khong framework), chi GET + POST (tuong thich IIS)
- **Database**: SQLite — auto-seed khi deploy lan dau (5 nhom dich vu, 15 dich vu, 6 bac si, 3 cam nhan)
- **CSS prefix**: `sr-` xuyen suot
- **Session**: `NhaKhoaGiaDinhSunrise` (alphanumeric)
