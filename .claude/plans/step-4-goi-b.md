# Step 4 — Gói B: Website Framework
> Thời gian: 5 tháng | Deliverable: Sản phẩm Gói B đóng gói ZIP, bán được

## Kiến trúc deploy
```
public_html/         ← upload lên hosting PHP
├── index.html       ← React build (frontend)
├── assets/          ← JS, CSS build output
├── api/             ← PHP backend
│   ├── src/         ← Core classes
│   ├── config.php   ← Khách chỉ sửa file này
│   ├── index.php
│   └── install.php  ← Chạy 1 lần, tự xóa sau
├── database/app.db  ← SQLite (tạo tự động)
└── uploads/
```

---

## Tasks

### M1 — PHP Backend Core (tháng 1, 2 tuần)
- [ ] `backend/src/Database.php` — PDO wrapper, FK ON, prepared statements
- [ ] `backend/src/Router.php` — RESTful routing, middleware chain
- [ ] `backend/src/Auth.php` — JWT generate/verify, role check
- [ ] `backend/src/Response.php` — json(), error(), paginate()
- [ ] `backend/src/bootstrap.php` — load config, init DB, set headers, error handler

### M2 — Core API Modules (tháng 1–2, 3 tuần)
- [ ] `api/auth.php` — login, logout, me
- [ ] `api/settings.php` — GET/PUT key-value theo group
- [ ] `api/posts.php` — CRUD, slug, status, category
- [ ] `api/pages.php` — CRUD
- [ ] `api/media.php` — upload, list, delete
- [ ] `api/contacts.php` — list, update status
- [ ] `api/banners.php` — CRUD, reorder
- [ ] `api/categories.php` — CRUD

### M3 — React Admin Frontend (tháng 2–3, 3 tuần)
- [ ] `components/AdminLayout.tsx` — sidebar 214px + topbar
- [ ] `lib/api.ts` — fetch wrapper + JWT header
- [ ] `pages/Login.tsx`
- [ ] `pages/Dashboard.tsx` — stats tổng quan
- [ ] `pages/Posts/` — list + editor (Quill.js)
- [ ] `pages/Pages/` — CRUD
- [ ] `pages/Media/` — upload + gallery grid
- [ ] `pages/Settings/` — form theo tab group
- [ ] `pages/Contacts/` — list + mark read
- [ ] `pages/Banners/` — CRUD + drag reorder
- [ ] Auth guard: route `/admin/*` → redirect login nếu JWT invalid

### M4 — Build & Deploy Script (tháng 3, 3 ngày)
- [ ] `vite.config.ts`: output → `../backend/public/`
- [ ] `install.php`: tạo bảng → seed → tạo admin → tự xóa → redirect login
- [ ] Test deploy trên fresh hosting PHP (pdo_sqlite required)

### M5 — Extension: Spa (tháng 4, 2 tuần)
- [ ] Schema: `services`, `staff`, `bookings`, `time_slots`
- [ ] API: GET services (public), POST booking (public), GET/PUT admin bookings
- [ ] Admin pages: `/admin/bookings`, `/admin/services`

### M6 — Extension: Nhà hàng (tháng 4, 2 tuần)
- [ ] Schema: `menu_categories`, `menu_items`, `table_reservations`
- [ ] API + Admin CRUD (cùng pattern M5)

### M7 — Đóng gói & Launch (tháng 5, 1 tuần)
- [ ] Build ZIP: `goi-b-spa-v1.0.zip` — public_html + README + CHANGELOG
- [ ] `README.md`: hướng dẫn deploy 4 bước (tiếng Việt)
- [ ] Test trên shared hosting fresh từ đầu
- [ ] Upload Gumroad + đăng lên webdrop.store

---

## Security checklist (bắt buộc trước khi bán)
- [ ] Tất cả query dùng prepared statements
- [ ] `.htaccess` chặn truy cập `.db` và `config.php`
- [ ] JWT check trên mọi endpoint `/api/admin/*`
- [ ] File upload: validate MIME type + giới hạn size
- [ ] `install.php` tự xóa sau khi chạy
- [ ] Không `console.log`, `var_dump` trong production build

---

## Done khi
- [ ] Upload lên fresh hosting → `/install.php` → DB tạo → login thành công
- [ ] CRUD posts, pages, settings, media đều hoạt động
- [ ] Upload ảnh lưu đúng thư mục
- [ ] Extension spa: đặt lịch → admin thấy booking mới
- [ ] Build React minified, không source map, không env var lộ
- [ ] ZIP download → giải nén → upload hosting → chạy ngay
