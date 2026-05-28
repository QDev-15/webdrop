# Plan: Phase 2 — Gói B Website (6–18 tháng)

## Mục tiêu
Đóng gói Gói B thành sản phẩm chuẩn — upload lên hosting là chạy, không cần config.

## Architecture

```
/public_html/
├── index.html          ← React SPA build
├── assets/             ← JS, CSS, images (React build output)
├── api/
│   ├── index.php       ← Router PHP
│   ├── config.php      ← DB config (comment tiếng Việt)
│   └── endpoints/      ← API handlers
├── database/
│   └── webdrop.db      ← SQLite file
├── uploads/            ← User uploads (images, files)
├── schema.sql          ← For MySQL/PostgreSQL migration
└── .htaccess           ← Chặn .db, redirect API
```

## Build flow
1. React build → output vào `/public_html/`
2. PHP API tại `/public_html/api/`
3. Upload toàn bộ lên hosting
4. PHP tự detect nếu `.db` chưa có → seed data mặc định
5. React gọi `/api/` → render động

## PHP API Structure

```php
// config.php — khách chỉ cần sửa file này
define('DB_TYPE', 'sqlite');           // hoặc 'mysql' / 'pgsql'
define('DB_PATH', __DIR__.'/../database/webdrop.db'); // SQLite
// define('DB_HOST', 'localhost');     // MySQL/PgSQL
// define('DB_NAME', 'webdrop');
// define('DB_USER', 'root');
// define('DB_PASS', 'password');
```

## Core Modules cần build

### Module 1: Auth
- [ ] Login/logout admin
- [ ] Session-based (PHP session)
- [ ] Role check: superadmin vs user
- [ ] Rate limiting cơ bản (chống brute force)

### Module 2: Settings
- [ ] CRUD settings (key-value) theo group
- [ ] Upload logo, favicon
- [ ] Cập nhật thông tin liên hệ, mạng xã hội

### Module 3: Posts / Blog
- [ ] CRUD bài viết
- [ ] Upload thumbnail
- [ ] Category management
- [ ] Slug tự generate
- [ ] Status: draft / published

### Module 4: Pages
- [ ] CRUD trang tĩnh
- [ ] Rich text editor (TinyMCE hoặc Quill)
- [ ] SEO meta per page

### Module 5: Media Library
- [ ] Upload ảnh (local folder)
- [ ] List/delete ảnh
- [ ] Option: Cloudflare R2 (advanced)

### Module 6: Contacts
- [ ] Xem form liên hệ
- [ ] Đánh dấu đã đọc/đã trả lời
- [ ] Export CSV

### Module 7: Banners
- [ ] CRUD banner (hero, popup)
- [ ] Sort order
- [ ] Link target

---

## Extensions theo ngách (chọn khi xây cho khách)

### Ngách Spa/Dịch vụ
- Booking form → lưu vào DB
- Admin xem/quản lý lịch đặt
- Email thông báo (SMTP)

### Ngách F&B
- Menu categories + items
- Gallery ảnh món ăn
- Table booking

### Ngách BĐS
- Properties CRUD
- Property search/filter (React)
- Image gallery per property

### Ngách Blog/Tin tức
- Core `posts` + `categories` là đủ
- Tags, related posts
- Comment (optional)

---

## Checklist Gói B trước khi bàn giao

### Backend PHP
- [ ] Prepared statements tất cả queries
- [ ] Input validation + sanitize
- [ ] `.htaccess` chặn `.db` file
- [ ] `config.php` ngoài public
- [ ] CORS header đúng (chỉ allow domain khách)
- [ ] FK ON cho SQLite
- [ ] Seed data khi deploy lần đầu

### Frontend React
- [ ] Build production (`npm run build`)
- [ ] Env variables không có trong bundle
- [ ] Error boundary
- [ ] Loading states
- [ ] 404 page

### Deploy
- [ ] Test trên môi trường fresh hosting
- [ ] Hướng dẫn upload PDF (tiếng Việt)
- [ ] Video hướng dẫn 10 phút
- [ ] `schema.sql` cho MySQL migration

---

## Timeline
| Milestone | Mô tả |
|---|---|
| M1 | Core framework: Auth + Settings + Media |
| M2 | Posts + Pages + Contacts |
| M3 | React frontend kết nối PHP API |
| M4 | Admin dashboard hoàn chỉnh |
| M5 | Extension Spa/Dịch vụ |
| M6 | Đóng gói, test deploy, hướng dẫn |
| M7 | Launch bán Gói B |
