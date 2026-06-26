# DermaCare Clinic — Website Deploy

Website phong kham da lieu va skincare. React SPA + PHP backend + SQLite.

---

## Yeu cau hosting

- PHP >= 7.4 voi extension `pdo_sqlite` va `pdo`
- Cho phep ghi file (chmod 755) vao thu muc `api/database/` va `api/uploads/`
- Apache (co mod_rewrite) hoac IIS (co URL Rewrite)

---

## Buoc 1 — Build

```bash
# Windows
build.bat

# Linux / Mac
bash build.sh
```

Output nam tai `../_output-deploy/` (cung cap voi thu muc source).

---

## Buoc 2 — Upload

Upload toan bo noi dung trong `_output-deploy/` len thu muc goc cua hosting (public_html hoac www).

Cau truc sau khi upload:

```
public_html/
  index.html          <- trang chu (React SPA)
  assets/             <- JS, CSS cua website
  admin/
    index.html        <- trang quan tri (React SPA)
    assets/           <- JS, CSS cua admin
  api/
    index.php         <- PHP entry point
    config.php        <- CAU HINH o day
    schema.sql
    .htaccess
    database/         <- SQLite DB (tu dong tao)
    uploads/          <- File upload
    src/
  .htaccess           <- SPA routing (Apache)
  web.config          <- SPA routing (IIS)
```

---

## Buoc 3 — Cau hinh

Mo file `api/config.php` va dien thong tin:

```php
define('APP_URL', 'https://domain.vn');       // URL chinh cua website
define('CORS_ORIGINS', 'https://domain.vn');  // Giong APP_URL
```

Cac cai dat khac (SMTP, Cloudinary) co the cau hinh qua trang Admin > Cai dat sau khi dang nhap.

---

## Buoc 4 — Phan quyen thu muc

```bash
chmod 755 api/database/
chmod 755 api/uploads/
```

Tren Windows hosting (IIS): dam bao IIS_IUSRS co quyen Write vao 2 thu muc nay.

---

## Buoc 5 — Kiem tra hoat dong

Truy cap `https://domain.vn/api/health` — ket qua mong doi:

```json
{
  "status": "ok",
  "pdo_sqlite": true,
  "db_dir": "writable",
  "php_version": "8.x.x"
}
```

Neu `pdo_sqlite: false` -> lien he hosting ho tro bat extension.
Neu `db_dir: not writable` -> kiem tra quyen ghi thu muc `api/database/`.

---

## Buoc 6 — Dang nhap admin

- URL: `https://domain.vn/admin`
- Email: `sysadmin@admin.com`
- Mat khau: `123456`

**DOI MAT KHAU NGAY sau khi dang nhap lan dau.**

Admin > Profile > Doi mat khau.

---

## Tinh nang

### Trang chu (/)
- Hero slider quan ly qua Admin > Hero Slides
- Thong ke: so ca dieu tri, bac si, ty le hai long, kinh nghiem
- Cac van de da dieu tri (tinh)
- Dich vu dieu tri (lay tu DB)
- Doi ngu bac si (lay tu DB)
- Quy trinh dieu tri (tinh)
- Danh gia khach hang (lay tu DB)
- CTA dat lich

### Trang Dich vu (/dich-vu)
- Filter theo danh muc dieu tri
- The dich vu: anh, ten, mo ta, gia, thoi gian

### Trang Dat lich (/dat-lich)
- Form: ho ten, SDD, email, van de da (checkbox), loai da, da dieu tri chua, lich hen, bac si muon gap, ghi chu
- Luu vao bang `bookings` (quan ly qua Admin > Lich hen)

### Trang Lien he (/lien-he)
- Thong tin lien he (lay tu Settings)
- Form gui tin nhan (luu vao `contacts`)
- Ban do nhung (cai dat link embed qua Admin > Settings > Lien he)
- FAQ accordion

### Admin (/admin)
- Dashboard: thong ke, lich hen moi, tin nhan moi
- Hero Slides: them/sua/xoa slide
- Danh muc dieu tri: quan ly nhom dich vu
- Dich vu dieu tri: them/sua/xoa dich vu (co upload anh)
- Lich hen: xem va cap nhat trang thai lich hen
- Bac si: them/sua/xoa thanh vien doi ngu (co upload anh)
- Danh gia: them/sua/xoa review khach hang (co upload anh)
- Tin nhan lien he: xem va xu ly
- Thu vien anh: upload va quan ly anh
- Cai dat: Thong tin chung, Phong kham, SEO, Mang xa hoi, Footer, Lien he, SMTP, Nang cao, Cloudinary, Tich hop (Unsplash)

---

## Cau truc du lieu mac dinh (seed)

Database tu dong seed khi request dau tien:

- **Tai khoan admin**: sysadmin@admin.com / 123456
- **5 danh muc dieu tri**: Dieu tri Mun, Tri Nam & Tan nhang, Tre hoa Da, Laser Tham my, Cham soc Da dau
- **11 dich vu**: Day du voi ten, mo ta, gia, thoi gian thuc te
- **4 bac si**: Dich vu viet theo nganh da lieu
- **3 danh gia khach hang**
- **2 hero slides**
- **Settings day du**: ten, dia chi, SDT, gio lam viec, social, v.v.

---

## Upload anh

- Upload qua Admin > Thu vien anh hoac qua ImageField trong tung form
- Driver mac dinh: `local` (luu vao `api/uploads/`)
- Chuyen sang Cloudinary: Admin > Cai dat > Cloudinary

---

## Cau hoi thuong gap

**Website bao ve sau khi deploy?**
Truy cap `https://domain.vn/api/health`. Kiem tra `pdo_sqlite` va `db_dir`.

**Quen mat khau admin?**
Xoa file `api/database/database.db` de reset toan bo (se mat du lieu). Hoac dung phpMyAdmin/sqlite3 CLI de update bang users.

**Muon them bac si moi?**
Admin > Doi ngu > Them bac si moi.

**Muon thay doi thong tin lien he / gio lam viec?**
Admin > Cai dat > Thong tin chung.

---

*Build voi web-deploy-builder — webdrop.store*
