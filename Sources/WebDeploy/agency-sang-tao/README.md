# Agency Sang Tao — Website Deploy

Website deploy hoan chinh cho Agency Sang Tao.
React SPA (frontend + admin) + PHP API + SQLite.

## Cau truc

```
agency-sang-tao/
├── api/          ← PHP backend + SQLite
├── website/      ← React SPA public site
├── admin/        ← React SPA admin panel
├── build.bat     ← Windows build
├── build.sh      ← Linux/Mac build
└── build.mjs     ← Build script (Node.js)
```

## Huong dan Build

### Windows
```
build.bat
```

### Linux / Mac
```bash
chmod +x build.sh
./build.sh
```

Output ra thu muc `deploy/` — upload len hosting la chay.

## Huong dan Deploy

### Buoc 1 — Upload
Upload toan bo noi dung trong thu muc `deploy/` len `public_html/` cua hosting.

Cau truc sau khi upload:
```
public_html/
├── index.html          ← Trang chu website
├── assets/             ← JS/CSS da build
├── admin/              ← Admin panel
│   ├── index.html
│   └── assets/
├── api/                ← PHP backend
│   ├── index.php
│   ├── config.php      ← ⚠️ CAN SUA
│   ├── schema.sql
│   ├── database/       ← SQLite DB (tu dong tao)
│   └── uploads/        ← Anh upload
├── .htaccess           ← Apache routing
└── web.config          ← IIS routing
```

### Buoc 2 — Cau hinh (BAT BUOC)
Mo file `api/config.php` va sua:

```php
define('APP_URL', 'https://tenweb.vn');       // ← URL thuc cua website
define('APP_KEY', 'random-32-chars-string');  // ← Da tu dong tao khi build
```

> APP_KEY da duoc tu dong generate khi build — KHONG can sua.
> Chi can sua APP_URL thanh domain that cua ban.

### Buoc 3 — Kiem tra hosting
Truy cap: `https://tenweb.vn/api/health`

Ket qua JSON phai co:
- `"pdo_sqlite": true` ← neu false, hosting khong ho tro SQLite
- `"db_dir": "writable"` ← neu "not writable", chmod 755 cho api/database/
- `"schema_sql": "found"` ← neu "MISSING", upload lai file api/schema.sql

### Buoc 4 — Phan quyen thu muc (neu can)
```bash
chmod 755 api/database/
chmod 755 api/uploads/
```

### Buoc 5 — Dang nhap admin
- Truy cap: `https://tenweb.vn/admin`
- Email: `sysadmin@admin.com`
- Mat khau: `123456`

> BAT BUOC doi mat khau ngay sau khi dang nhap lan dau!
> Vao: Admin → Profile (click ten nguoi dung) → Doi mat khau

## Yeu cau hosting

| Yeu cau | Ghi chu |
|---------|---------|
| PHP 7.4+ | Khuyen nghi PHP 8.x |
| Extension pdo_sqlite | BAT BUOC — dung SQLite |
| mod_rewrite (Apache) | Hoac URL Rewrite (IIS) |
| PHP mbstring | De xu ly tieng Viet |
| PHP curl | De upload Cloudinary, Unsplash |

## URL he thong

| URL | Mo ta |
|-----|-------|
| `/` | Trang chu website |
| `/du-an` | Trang du an / portfolio |
| `/dich-vu` | Trang dich vu |
| `/ve-chung-toi` | Trang gioi thieu |
| `/lien-he` | Trang lien he |
| `/admin` | Admin panel |
| `/api/health` | Health check endpoint |

## Tai khoan mac dinh

| Truong | Gia tri |
|--------|---------|
| Email | sysadmin@admin.com |
| Mat khau | 123456 |
| Role | Quan tri vien (superadmin) |

## Cac tinh nang Admin

- **Dashboard** — Thong ke tong quan
- **Hero Slides** — Quan ly slider (chi dung cho admin, hero section trang chu la CTA section voi form)
- **Du an** — CRUD portfolio du an, filter theo danh muc
- **Dich vu** — CRUD dich vu, co flag "noi bat"
- **Doi ngu** — CRUD thanh vien team
- **Danh gia** — CRUD testimonials khach hang
- **Lien he** — Xem va quan ly form lien he
- **Media** — Thu vien file anh upload
- **Cai dat** — 11 tabs: Thong tin chung, SEO, Mang xa hoi, Footer, Lien he, SMTP, Hero & About, Thong ke, He thong, Cloudinary, Tich hop

## Ho tro

Lien he: webdrop.vn
