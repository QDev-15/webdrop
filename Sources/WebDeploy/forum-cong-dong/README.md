# Forum Cong Dong — Huong dan Deploy

Website dien dan cong dong voi React SPA + PHP API + SQLite.

---

## Cau truc san pham

```
forum-cong-dong/
├── website/        # React SPA - trang cong dong public
├── admin/          # React SPA - trang quan tri
├── api/            # PHP backend + SQLite
├── build.bat       # Windows: chay de build
├── build.sh        # Linux/Mac: chay de build
└── build.mjs       # Build script chinh (Node.js)
```

---

## Buoc 1 — Build

**Yeu cau:** Node.js 18+ da cai dat.

**Windows:**
```bat
build.bat
```

**Linux/Mac:**
```bash
bash build.sh
```

Sau khi build xong, thu muc `deploy/` duoc tao tu dong. Upload tat ca noi dung trong `deploy/` len hosting.

---

## Buoc 2 — Upload len hosting

Upload tat ca noi dung trong `deploy/` vao thu muc `public_html/` tren hosting.

Cau truc sau khi upload:
```
public_html/
├── index.html          # Trang cong dong chinh
├── assets/             # CSS, JS, anh trang chinh
├── admin/              # Trang quan tri
│   ├── index.html
│   └── assets/
└── api/                # PHP backend
    ├── index.php
    ├── config.php      # ← CAN SUA
    ├── schema.sql
    ├── database/       # Thu muc SQLite (can quyen ghi)
    └── uploads/        # Thu muc upload anh (can quyen ghi)
```

---

## Buoc 3 — Cau hinh (BAT BUOC)

Mo file `api/config.php` va sua:

```php
// ⚠️  SUA DONG NAY
define('APP_URL', 'https://your-domain.com');  // URL thuc cua website (khong co / cuoi)
```

`APP_KEY` da duoc tu dong tao khi build — khong can sua.

---

## Buoc 4 — Kiem tra sau deploy

Truy cap endpoint kiem tra:
```
https://your-domain.com/api/health
```

Ket qua JSON phai co:
```json
{
  "status": "ok",
  "pdo_sqlite": true,
  "db_dir": "writable",
  "schema_sql": "found"
}
```

**Neu co van de:**
- `"pdo_sqlite": false` → Hosting khong ho tro SQLite, can doi sang MySQL
- `"db_dir": "not writable"` → Chay: `chmod 755 api/database/`
- `"schema_sql": "MISSING"` → Upload lai file `api/schema.sql`

---

## Buoc 5 — Phan quyen thu muc (neu can)

```bash
chmod 755 api/database/
chmod 755 api/uploads/
```

---

## Buoc 6 — Dang nhap admin

Truy cap:
```
https://your-domain.com/admin
```

Tai khoan mac dinh:
- **Email:** sysadmin@admin.com
- **Mat khau:** 123456

**Doi mat khau ngay sau khi dang nhap lan dau!**

Vao: Admin → Tai khoan cua toi → Doi mat khau

---

## Yeu cau hosting

| Yeu cau | Mo ta |
|---|---|
| PHP 7.4+ | Khuyen nghi PHP 8.x |
| pdo_sqlite | Extension SQLite cho PHP |
| mod_rewrite / URL Rewrite | Apache (.htaccess) hoac IIS (web.config) |
| Quyen ghi thu muc | `api/database/` va `api/uploads/` |

---

## Tinh nang

**Trang cong dong:**
- Hero banner voi thong ke (so thanh vien, chu de, bai viet)
- Hien thi danh muc dien dan
- Danh sach chu de bai viet (loc: Moi nhat, Hot, Chua tra loi)
- Tags pho bien
- Form lien he

**Trang quan tri (`/admin`):**
- Dashboard tong quan
- Quan ly danh muc dien dan (CRUD)
- Quan ly chu de bai viet (CRUD)
- Quan ly tags
- Hero Slides - quan ly banner trang chu
- Thu vien Media (upload anh)
- Xem va xu ly lien he tu nguoi dung
- Cai dat toan dien (thong tin, dien dan, SEO, mang xa hoi, SMTP, Cloudinary, Unsplash)
- Doi mat khau tai khoan

---

## API Endpoints

### Public (khong can dang nhap)
- `GET /api/public/settings` — Cai dat website
- `GET /api/public/forum-categories` — Danh muc dien dan
- `GET /api/public/forum-threads` — Danh sach chu de (co filter)
- `GET /api/public/forum-tags` — Tags pho bien
- `POST /api/public/contact` — Gui form lien he
- `GET /api/health` — Kiem tra tinh trang server

### Admin (yeu cau dang nhap)
- Auth: `POST /api/auth/login`, `POST /api/auth/logout`, `GET /api/auth/me`
- Forum: `/api/forum-categories/*`, `/api/forum-threads/*`, `/api/forum-tags/*`
- Slides: `/api/hero-slides/*`
- Media: `/api/media/*`, `POST /api/media/upload`
- Upload: `POST /api/upload`
- Unsplash: `GET /api/unsplash`, `POST /api/unsplash`
- Settings: `GET /api/settings`, `POST /api/settings/update`
- Users: `/api/users/*`

---

## Phat trien local

### Backend PHP
```bash
cd api
php -S localhost:8000
```

### Website React
```bash
cd website
npm install
npm run dev
# Truy cap: http://localhost:5173
```

### Admin React
```bash
cd admin
npm install
npm run dev
# Truy cap: http://localhost:5174/admin/
```

---

*Tao boi web-deploy-builder — webdrop.vn*
