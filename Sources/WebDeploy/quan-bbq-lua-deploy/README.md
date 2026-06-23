# BBQ Lua Hong — Huong dan Deploy

Website hoan chinh cho quan BBQ: React SPA frontend + React SPA admin + PHP backend + SQLite.

## Yeu cau hosting

- PHP 7.4+ voi extension pdo_sqlite bat san
- Ho tro .htaccess (Apache) hoac web.config (IIS / Windows hosting)
- Thu muc api/database/ va api/uploads/ phai co quyen ghi

## Buoc 1 — Build

Windows:
  cd Sources/WebDeploy/quan-bbq-lua
  build.bat

Linux/Mac:
  cd Sources/WebDeploy/quan-bbq-lua
  bash build.sh

Output xuat ra Sources/WebDeploy/_output-deploy/quan-bbq-lua/

## Buoc 2 — Cau hinh

Mo file _output-deploy/quan-bbq-lua/api/config.php va sua:
  define('APP_URL', 'https://domain-cua-ban.vn');

APP_KEY da duoc build.mjs tu dong generate.

## Buoc 3 — Upload len hosting

Upload toan bo noi dung _output-deploy/quan-bbq-lua/ vao public_html/ tren hosting.

## Buoc 4 — Phan quyen

  chmod 755 public_html/api/database/
  chmod 755 public_html/api/uploads/

## Buoc 5 — Kiem tra health

Truy cap: https://domain-cua-ban.vn/api/health

Ket qua mong doi:
  { "ok": true, "pdo_sqlite": true, "db_dir": "writable", "upload_dir": "writable" }

## Buoc 6 — Dang nhap admin

Truy cap: https://domain-cua-ban.vn/admin
  Email: sysadmin@admin.com
  Mat khau: 123456

BAT BUOC doi mat khau ngay sau khi dang nhap lan dau qua menu Profile.

## Cau truc URL

/               Trang chu
/thuc-don       Thuc don BBQ day du
/khong-gian     Gallery khong gian
/dat-ban        Form dat ban
/lien-he        Lien he + ban do
/admin          Trang quan tri
/api/health     Kiem tra trang thai he thong

## Tinh nang admin

- Dashboard thong ke (dat ban, lien he, mon an)
- Quan ly Hero Slides
- Quan ly Thuc don (danh muc + mon an, gia, badge)
- Quan ly Dat ban (xem, xac nhan, huy)
- Quan ly Gallery khong gian
- Quan ly Testimonials
- Quan ly Lien he
- Media library
- Cai dat he thong (thong tin quan, SEO, mang xa hoi, SMTP)
- Tich hop Cloudinary va Unsplash

## Xu ly su co

500 Internal Server Error:
  - Kiem tra BOM trong PHP files (build.mjs strip tu dong khi build)
  - Kiem tra api/config.php co dung APP_URL khong

Khong dang nhap duoc admin:
  - Kiem tra api/database/ co quyen ghi
  - Kiem tra HTTPS detection trong Auth.php

Anh khong upload duoc:
  - Kiem tra api/uploads/ co quyen ghi
  - Kiem tra upload_max_filesize trong php.ini

Form dat ban khong gui duoc:
  - Kiem tra CORS_ORIGINS trong api/config.php
  - Kiem tra APP_URL tro dung domain
