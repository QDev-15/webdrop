# Beauty Studio — Huong dan Deploy

Website hoan chinh cho Beauty Studio (Toc, Nail, Makeup, Skincare).
Stack: React SPA frontend + React SPA admin + PHP backend + SQLite.

---

## Yeu cau hosting

- PHP 8.0+ voi extension `pdo_sqlite` (bat san tren hau het shared hosting)
- Ho tro Apache (.htaccess) hoac IIS (web.config)
- Thu muc writable cho `api/database/` va `api/uploads/`

---

## Buoc 1 — Build deploy

Chay lenh sau tren may tinh (Windows):

```
cd Sources\WebDeploy\beauty-studio
build.bat
```

Hoac Linux/Mac:

```
cd Sources/WebDeploy/beauty-studio
bash build.sh
```

Output nam tai `Sources\WebDeploy\_output-deploy\` (cung cap voi thu muc source).

---

## Buoc 2 — Cau hinh APP_URL

Mo file `_output-deploy/api/config.php`, sua dong:

```php
define('APP_URL', 'http://localhost:8081');
```

Thanh URL thuc cua hosting, vi du:

```php
define('APP_URL', 'https://beautystudio.vn');
```

---

## Buoc 3 — Upload len hosting

Upload toan bo noi dung thu muc `_output-deploy/` vao public_html/ tren hosting.

Cau truc sau khi upload:

```
public_html/
├── index.html          (website frontend)
├── assets/             (JS/CSS website)
├── .htaccess           (SPA routing + bao mat)
├── web.config          (IIS routing)
├── favicon.ico
├── admin/
│   ├── index.html      (admin panel)
│   └── assets/
└── api/
    ├── index.php       (entry point)
    ├── config.php      (cau hinh - SUA APP_URL)
    ├── schema.sql
    ├── database/       (SQLite - can writable)
    └── uploads/        (anh upload - can writable)
```

---

## Buoc 4 — Phan quyen thu muc

```bash
chmod 755 api/database/
chmod 755 api/uploads/
```

---

## Buoc 5 — Kiem tra health endpoint

Truy cap: `https://domain.vn/api/health`

Ket qua mong muon:

```json
{
  "status": "ok",
  "pdo_sqlite": true,
  "db_dir": "writable",
  "upload_dir": "writable"
}
```

---

## Buoc 6 — Dang nhap admin

Truy cap: `https://domain.vn/admin`

Tai khoan mac dinh:
- Email: `sysadmin@admin.com`
- Mat khau: `123456`

**Bat buoc doi mat khau ngay sau khi dang nhap lan dau** tai menu Profile.

---

## Buoc 7 — Cau hinh website

Sau khi dang nhap admin:

1. **Cai dat > Thong tin chung**: Cap nhat ten studio, dia chi, SDT, email, gio mo cua.
2. **Cai dat > Mang xa hoi**: Them link Facebook, Instagram, TikTok, Zalo.
3. **Trang chu > Hero Slides**: Them anh banner trang chu.
4. **Dich vu > Danh muc** va **Dich vu > Dich vu**: Cap nhat gia va mo ta.
5. **Doi ngu**: Them anh va thong tin stylist thuc te.
6. **Danh gia**: Them review tu khach hang thuc.
7. **Cai dat > Tich hop**: Them Unsplash Access Key de dung thu vien anh mien phi.

---

## Cau truc Admin

| URL | Chuc nang |
|---|---|
| `/admin` | Tong quan |
| `/admin/slides` | Quan ly anh hero slider |
| `/admin/service-categories` | Danh muc dich vu |
| `/admin/services` | Dich vu & bang gia |
| `/admin/bookings` | Lich hen khach hang |
| `/admin/team` | Doi ngu Stylist & Artist |
| `/admin/testimonials` | Danh gia khach hang |
| `/admin/contacts` | Tin nhan lien he |
| `/admin/media` | Thu vien anh |
| `/admin/settings` | Cau hinh website |
| `/admin/profile` | Tai khoan |

---

## API Endpoints public

| Method | URL | Mo ta |
|---|---|---|
| GET | `/api/public/settings` | Cau hinh website |
| GET | `/api/public/hero-slides` | Slides trang chu |
| GET | `/api/public/service-categories` | Danh muc dich vu |
| GET | `/api/public/services` | Dich vu (them `?featured=1` de loc noi bat) |
| GET | `/api/public/team` | Doi ngu |
| GET | `/api/public/testimonials` | Danh gia |
| GET | `/api/public/promo-combos` | Combo uu dai |
| POST | `/api/public/booking` | Gui dat lich |
| POST | `/api/public/contact` | Gui lien he |
| GET | `/api/health` | Kiem tra he thong |

---

## Xu ly su co

**500 Internal Server Error:**
- Kiem tra `api/database/` co writable khong
- Kiem tra `api/config.php` khong co ky tu BOM
- Bat error_log trong PHP de xem chi tiet

**Trang trang sau khi deploy:**
- Kiem tra APP_URL trong `api/config.php` dung chua
- Kiem tra `.htaccess` hoac `web.config` da upload chua

**Admin khong dang nhap duoc:**
- Kiem tra `/api/health` chay duoc khong
- Clear cookie trinh duyet roi thu lai

---

Ho tro: https://webdrop.store
