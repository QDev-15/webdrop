# Shop Do Gia Dung — Huong Dan Deploy

Website ban do gia dung. React SPA + PHP backend + SQLite. Identity Token: WARM-ARTISAN Terracotta #b5651d + Sage #87a06b.

---

## Yeu cau hosting

- PHP 7.4+ (khuyen nghi PHP 8.x)
- Extension `pdo_sqlite` bat buoc
- Apache voi `mod_rewrite` (`.htaccess`) HOAC IIS voi URL Rewrite (`web.config`)
- Thu muc `api/database/` phai co quyen ghi (chmod 755 hoac 777)
- Thu muc `api/uploads/` phai co quyen ghi (chmod 755 hoac 777)

---

## Buoc deploy

### 1. Upload len hosting

Upload toan bo noi dung trong `_output-deploy/` vao thu muc `public_html/` tren hosting:

```
public_html/
├── index.html          <- Trang chu React
├── assets/             <- JS/CSS build
├── admin/              <- Admin panel
├── api/                <- PHP backend
├── .htaccess           <- Apache rewrite rules
├── web.config          <- IIS rewrite rules
└── robots.txt
```

### 2. Cau hinh APP_URL

Mo file `api/config.php` va sua dong APP_URL:

```php
define('APP_URL', 'https://yourdomain.com');
```

Thay `yourdomain.com` bang domain that cua website.

### 3. Kiem tra suc khoe

Truy cap URL sau de kiem tra:

```
https://yourdomain.com/api/health
```

Ket qua tra ve JSON nhu sau la thanh cong:

```json
{
  "status": "ok",
  "php": "8.x.x",
  "pdo_sqlite": true,
  "db_dir": "writable"
}
```

Neu `pdo_sqlite: false` → hosting chua cai extension nay, lien he nha cung cap.
Neu `db_dir: false` → thu muc database chua co quyen ghi.

### 4. Phan quyen thu muc

```bash
chmod 755 api/database/
chmod 755 api/uploads/
```

Tren Windows hosting (IIS), dam bao IIS_IUSRS co quyen Write vao 2 thu muc tren.

### 5. Kiem tra loi

Neu gap 500 error, tat debug PHP (thay doi trong `api/config.php`):

```php
define('APP_DEBUG', false);  // Tat debug tren production
```

### 6. Seed du lieu lan dau

Database SQLite tu dong tao va seed khi co request dau tien. Khong can chay lenh nao them. Kiem tra bang cach mo trang chu.

---

## Dang nhap Admin

URL: `https://yourdomain.com/admin`

| Truong | Gia tri |
|--------|---------|
| Email | sysadmin@admin.com |
| Mat khau | 123456 |

**Doi mat khau ngay sau khi dang nhap lan dau** tai trang Profile.

---

## Cau truc Admin

| Menu | Chuc nang |
|------|-----------|
| Dashboard | Thong ke doanh thu, don hang, san pham |
| Hero Slides | Quan ly banner trang chu (Search Zone) |
| Danh muc SP | Them/sua/xoa danh muc san pham |
| San pham | CRUD san pham, anh, mau sac, gia |
| Don hang | Xem va cap nhat trang thai don hang |
| Lien he | Xem cac lien he gui tu khach hang |
| Thu vien anh | Upload va quan ly file media |
| Cai dat | Thong tin chung, SEO, mang xa hoi, thanh toan, SMTP, Cloudinary, Unsplash |

---

## Cai dat thanh toan

### COD (thanh toan khi nhan hang)

Trong Admin → Cai dat → tab "Thanh toan":
- Bat `COD (Thanh toan khi nhan hang)` → ON

### SePay (chuyen khoan truoc qua QR)

1. Dang ky tai `my.sepay.vn`
2. Lien ket tai khoan ngan hang
3. Lay API key
4. Dien vao Admin → Cai dat → tab "Thanh toan":
   - Ma ngan hang (vd: `VCB`, `TCB`, `MB`)
   - So tai khoan
   - Ten chu tai khoan
   - SePay Webhook Secret
5. Tren dashboard SePay, them Webhook URL: `https://yourdomain.com/api/public/sepay-webhook`

---

## Gia van chuyen

Admin → Cai dat → tab "Cua hang":
- Phi van chuyen mac dinh (vi du: 30000)
- Nguong mien phi van chuyen (vi du: 500000 — don tu 500k mien phi)

---

## Upload anh qua Cloudinary (tuy chon)

Neu muon luu anh tren Cloudinary (khong gioi han dung luong nhu hosting):

1. Tao tai khoan tai `cloudinary.com`
2. Lay Cloud Name, API Key, API Secret
3. Admin → Cai dat → tab "Cloudinary" → dien thong tin → Luu

---

## Unsplash (anh mau mien phi)

Mac dinh da co sẵn Unsplash Access Key de tim anh. De thay key rieng:

Admin → Cai dat → tab "Tich hop" → nhap Unsplash Access Key → Luu.

---

## Bao mat sau deploy

1. **Xoa `api/check-hash.php`** khoi server sau khi deploy xong — day la file debug, khong nen de lai tren production.
2. Dam bao file `.htaccess` hoac `web.config` da chặn truy cap truc tiep vao `api/database/*.db`.
3. Doi mat khau admin ngay lap tuc.

---

## Sitemap & SEO

Sitemap tu dong sinh tai: `https://yourdomain.com/api/sitemap.xml`

`robots.txt` da co san, troi `Sitemap:` vao sitemap XML tren. Google va cac bot se tu doc.

---

## Cau truc website

9 trang:
- `/` — Trang chu (Search Zone + 4 section san pham theo chu de)
- `/san-pham` — Danh sach san pham + bo loc ngang
- `/san-pham/:slug` — Chi tiet san pham
- `/bo-suu-tap` — Bento grid bộ sưu tập theo danh muc
- `/ve-chung-toi` — Gioi thieu thuong hieu
- `/gio-hang` — Gio hang
- `/thanh-toan` — Thanh toan
- `/lien-he` — Lien he
- `/chinh-sach-bao-mat` — Chinh sach bao mat
- `/dieu-khoan` — Dieu khoan su dung
