# Nha Hang Cao Cap — Huong dan Deploy

Website fine dining cao cap: React SPA + PHP backend + SQLite.
Tao boi web-deploy-builder.

---

## Yeu cau hosting

| Yeu cau | Chi tiet |
|---|---|
| PHP | 7.4+ (khuyen nghi 8.0+) |
| Extension PHP | `pdo_sqlite` (bat buoc), `gd` hoac `imagick` (cho upload anh) |
| Web server | Apache (mod_rewrite) hoac IIS (URL Rewrite Module) |
| Dung luong | Toi thieu 100 MB |

---

## Buoc 1 — Build

**Windows:**
```cmd
build.bat
```

**Linux / Mac:**
```bash
bash build.sh
```

Ket qua: thu muc `deploy/` chua toan bo files san sang de upload.

---

## Buoc 2 — Upload len hosting

Upload TOAN BO noi dung trong thu muc `deploy/` len `public_html/` tren hosting.

Cau truc sau khi upload:
```
public_html/
├── index.html          ← Trang chinh (React SPA)
├── assets/             ← JS/CSS da build
├── .htaccess           ← Routing Apache
├── web.config          ← Routing IIS
├── admin/              ← Admin panel (React SPA)
│   └── index.html
└── api/                ← PHP backend
    ├── config.php      ← ⚠ Can sua APP_URL
    ├── schema.sql
    ├── index.php
    ├── .htaccess
    ├── web.config
    ├── database/       ← SQLite DB (tu dong tao khi chay lan dau)
    └── uploads/        ← Anh upload
```

---

## Buoc 3 — Cau hinh (BAT BUOC)

Mo file `api/config.php` tren hosting va sua dong sau:

```php
// ⚠ Sua thanh URL thuc cua website (khong co / cuoi)
define('APP_URL', 'https://tenweb.vn');
```

`APP_KEY` da duoc tu dong tao ngau nhien khi chay `build.bat`. Ban chi can sua `APP_URL`.

---

## Buoc 4 — Kiem tra sau khi upload

Truy cap URL kiem tra suc khoe:
```
https://tenweb.vn/api/health
```

Ket qua JSON phai cho thay:
```json
{
  "status": "ok",
  "pdo_sqlite": true,
  "db_dir": "writable",
  "schema_sql": "found"
}
```

Neu `pdo_sqlite: false` — hosting khong ho tro SQLite, lien he ho tro.
Neu `db_dir: "not writable"` — chay `chmod 755 public_html/api/database/`.

---

## Buoc 5 — Dang nhap Admin

Truy cap:
```
https://tenweb.vn/admin
```

| Truong | Gia tri |
|---|---|
| Email | `sysadmin@admin.com` |
| Mat khau | `123456` |

**Doi mat khau ngay sau khi dang nhap lan dau!**

---

## Cau truc Admin Panel

| Menu | Chuc nang |
|---|---|
| Dashboard | Thong ke tong quan |
| Hero Slides | Slider trang chu |
| Thu vien anh | Gallery anh nha hang |
| Danh muc thuc don | Phan loai khoa an |
| Mon an | Them/sua/xoa mon, gia, mo ta |
| Dat ban | Quan ly yeu cau dat ban |
| Danh gia | Testimonial khach hang |
| Media | Thu vien anh, upload |
| Lien he | Tin nhan tu form lien he |
| Cai dat | Cau hinh noi dung website |

---

## Noi dung quan ly qua Admin

| Noi dung | Quan ly tai |
|---|---|
| Ten nha hang, dia chi, SDT | Cai dat > Thong tin chung |
| Slider trang chu | Hero Slides |
| Gioi thieu nha hang | Cai dat > Gioi thieu |
| Thuc don cac khoa | Danh muc + Mon an |
| Cai dat dat ban | Cai dat > Dat ban |
| Gallery anh | Thu vien anh |
| Danh gia khach | Danh gia |
| Mang xa hoi | Cai dat > Mang xa hoi |
| Google Maps | Cai dat > Lien he |
| SEO meta | Cai dat > SEO |
| SMTP email | Cai dat > SMTP Email |
| Cloudinary | Cai dat > Cloudinary |
| Unsplash API | Cai dat > Tich hop |

---

## Loi thuong gap

**Trang trang sau upload:**
- Kiem tra `api/config.php` da co dung APP_URL
- Kiem tra file `.htaccess` da duoc upload (file an)

**Loi 500 khi goi API:**
- `chmod 755 api/database/`

**Anh khong hien thi:**
- `chmod 755 api/uploads/`

**Admin bao loi dang nhap du mat khau dung:**
- Dam bao website co SSL (HTTPS)

**Trang `/admin` hien 404 hoac trang chu:**
- Kiem tra file routing da duoc upload (`web.config` cho IIS, `.htaccess` cho Apache)

---

## Thong tin ky thuat

- Frontend: React 18, TypeScript, Vite 5
- Backend: PHP 8.x (khong framework), SQLite
- API: REST tai `/api`, chi dung GET + POST
- Auth: Session-based, cookie HttpOnly
- Upload: Local (`api/uploads/`) hoac Cloudinary
