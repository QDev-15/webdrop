# Blog Ca Nhan — Huong dan Deploy

## Yeu cau hosting
- PHP 7.4+ (khuyen nghi 8.x)
- Extension: pdo_sqlite
- mod_rewrite (Apache) hoac URL Rewrite Module (IIS)

## Buoc 1 — Build

**Windows:**
```
Double-click build.bat
```

**Linux/Mac:**
```bash
bash build.sh
```

Output ra thu muc `deploy/`

## Buoc 2 — Upload

Upload toan bo noi dung trong thu muc `deploy/` len `public_html/` cua hosting.

Cau truc sau khi upload:
```
public_html/
├── index.html          ← Website chinh
├── assets/             ← CSS/JS website
├── admin/              ← Trang quan tri
│   ├── index.html
│   └── assets/
├── api/                ← PHP Backend
│   ├── index.php
│   ├── config.php      ← Can sua APP_URL
│   ├── schema.sql
│   ├── database/       ← SQLite DB (tu dong tao)
│   └── uploads/        ← Anh upload
├── .htaccess           ← Apache routing
└── web.config          ← IIS routing
```

## Buoc 3 — Cau hinh (BAT BUOC)

Mo file `api/config.php` va sua:

```php
define('APP_URL', 'https://yourdomain.com');  // URL that cua website, khong co / cuoi
// APP_KEY duoc tu dong tao khi build — khong can sua
```

## Buoc 4 — Kiem tra hosting

Truy cap: `https://yourdomain.com/api/health`

Ket qua JSON phai co:
- `"pdo_sqlite": true`     — neu false: hosting khong ho tro SQLite
- `"db_dir": "writable"`   — neu "not writable": chmod 755 api/database/
- `"schema_sql": "found"`  — neu "MISSING": upload lai file api/schema.sql

## Buoc 5 — Phan quyen (neu can)

```bash
chmod 755 api/database/
chmod 755 api/uploads/
```

## Buoc 6 — Dang nhap admin

Truy cap: `https://yourdomain.com/admin`

| Thong tin | Gia tri |
|---|---|
| Email | sysadmin@admin.com |
| Mat khau | 123456 |

**Doi mat khau ngay sau khi dang nhap lan dau!**

---

## Quan ly noi dung

### Bai viet
- Dang nhap admin → Bai viet → Tao bai moi
- Ho tro HTML trong noi dung bai viet
- Danh dau "Bai noi bat" de hien thi vu tri dau trang chu

### Danh muc
- Admin → Danh muc
- 4 danh muc mac dinh: Cong nghe, Tu duy, Cuoc song, Review sach
- Co the them, sua, xoa danh muc

### Cai dat blog
- Admin → Cai dat → Tab "Tac gia"
- Chinh sua: ten tac gia, chuc danh, bio, anh dai dien
- Tab "Thong tin chung": ten blog, mo ta, email

### Newsletter
- Nguoi dung dang ky qua sidebar hoac footer
- Xem danh sach tai Admin → Lien he (section "Dang ky Newsletter")

---

## Khac phuc su co

| Van de | Giai phap |
|---|---|
| Trang trang | Kiem tra /api/health, xem log PHP |
| 404 khi refresh trang | Kiem tra .htaccess (Apache) hoac web.config (IIS) |
| Upload anh that bai | chmod 755 api/uploads/ |
| DB khong tao duoc | chmod 755 api/database/ |
| Admin khong vao duoc | Kiem tra web.config: rule admin-spa dung `^admin(/.*)?$` |

---

## Cong nghe su dung

| Tang | Cong nghe |
|---|---|
| Frontend website | React 18 + TypeScript + Vite |
| Frontend admin | React 18 + TypeScript + Vite |
| Backend | PHP 8+ (thuan, khong framework) |
| Database | SQLite (PRAGMA foreign_keys = ON) |
| Routing (Apache) | .htaccess mod_rewrite |
| Routing (IIS) | web.config URL Rewrite |
