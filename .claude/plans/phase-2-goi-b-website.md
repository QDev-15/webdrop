# Plan: Step 4+5 — Gói B Website Framework

> **Vị trí trong Master Roadmap:** Step 4 (Base Framework) + Step 5 (Extensions + Launch)
> **Thời gian:** ~5 tháng tổng
> **Deliverable:** Sản phẩm Gói B hoàn chỉnh, đóng gói ZIP, bán được

## Mục tiêu
Đóng gói Gói B thành sản phẩm chuẩn — upload lên hosting PHP là chạy, không cần config gì thêm.

---

## Cấu trúc source code

```
Sources/products/goi-b/
├── frontend/                   ← React SPA (Vite + React Router)
│   ├── src/
│   │   ├── pages/              ← Admin pages
│   │   ├── components/         ← UI components
│   │   └── lib/                ← API helper, auth utils
│   └── package.json
└── backend/                    ← PHP API
    ├── src/                    ← Core PHP classes
    │   ├── bootstrap.php
    │   ├── Database.php
    │   ├── Router.php
    │   ├── Auth.php
    │   └── Response.php
    ├── api/                    ← API endpoint handlers
    ├── config.php              ← Khách chỉ sửa file này
    ├── index.php               ← Entry point
    ├── install.php             ← Chạy lần đầu: seed DB, tạo admin
    ├── schema.sql              ← SQLite schema
    └── .htaccess               ← Bảo mật .db, route API
```

**Deploy output (upload lên hosting):**
```
public_html/
├── index.html          ← React build
├── assets/             ← JS, CSS (React build output)
├── api/                ← PHP backend
│   ├── src/
│   ├── config.php
│   ├── index.php
│   ├── install.php
│   └── .htaccess
├── database/
│   └── app.db          ← SQLite (tạo tự động khi chạy install.php)
└── uploads/            ← User uploads
```

---

## Step 4 — Base Framework (3 tháng)

### 4.1 — PHP Backend Core (2 tuần)

**`Sources/products/goi-b/backend/src/`**

`Database.php`:
- PDO wrapper cho SQLite + MySQL + PostgreSQL
- `PRAGMA foreign_keys = ON` bắt buộc khi kết nối SQLite
- Prepared statements wrapper: `query($sql, $params)`
- Transaction support

`Router.php`:
- RESTful routing: `GET /api/posts`, `POST /api/posts`, `PUT /api/posts/:id`, `DELETE /api/posts/:id`
- Middleware chain (auth check, CORS)
- 404/405 handler trả JSON

`Auth.php`:
- JWT-based (stateless, phù hợp React SPA)
- `generateToken(userId, role)` → JWT string
- `verifyToken(token)` → payload hoặc false
- Role check: `requireRole('superadmin')`

`Response.php`:
- `json($data, $status = 200)`
- `error($message, $status = 400)`
- `paginate($data, $total, $page, $limit)`

`bootstrap.php`:
- Load config.php
- Khởi tạo DB connection
- Set headers (CORS, Content-Type JSON)
- Error handler → JSON response

### 4.2 — Core API Modules (3 tuần)

**`Sources/products/goi-b/backend/api/`**

| File | Endpoints |
|---|---|
| `auth.php` | `POST /api/auth/login`, `POST /api/auth/logout`, `GET /api/auth/me` |
| `settings.php` | `GET /api/settings`, `GET /api/settings?group=general`, `PUT /api/settings` |
| `posts.php` | CRUD + `GET /api/posts?status=published&page=1` |
| `pages.php` | CRUD + slug check |
| `media.php` | `POST /api/media/upload`, `GET /api/media`, `DELETE /api/media/:id` |
| `contacts.php` | `GET /api/contacts`, `PUT /api/contacts/:id/status` |
| `banners.php` | CRUD + `PUT /api/banners/reorder` |
| `categories.php` | CRUD cho categories (dùng chung posts + products) |

**Security rules:**
- Tất cả query dùng prepared statements (không nối string)
- Input validation + sanitize trước khi lưu
- JWT check trên mọi endpoint `/api/admin/*`
- CORS: chỉ allow domain config trong `config.php`
- Rate limit đơn giản: 60 req/phút/IP

### 4.3 — React Admin Frontend (3 tuần)

**`Sources/products/goi-b/frontend/src/`**

**Pages:**
| File | URL | Mô tả |
|---|---|---|
| `pages/Login.tsx` | `/admin/login` | Form đăng nhập, redirect sau login |
| `pages/Dashboard.tsx` | `/admin` | Stats: contacts mới, posts, pages |
| `pages/Posts/List.tsx` | `/admin/posts` | Bảng bài viết, filter, phân trang |
| `pages/Posts/Edit.tsx` | `/admin/posts/:id` | Rich text editor (Quill.js) |
| `pages/Pages/List.tsx` | `/admin/pages` | CRUD trang tĩnh |
| `pages/Media/Index.tsx` | `/admin/media` | Grid upload + gallery |
| `pages/Settings/Index.tsx` | `/admin/settings` | Form theo tabs group |
| `pages/Contacts/List.tsx` | `/admin/contacts` | Danh sách, đánh dấu đã đọc |
| `pages/Banners/List.tsx` | `/admin/banners` | CRUD + drag reorder |

**Components:**
- `components/AdminLayout.tsx` — sidebar 214px + topbar + main
- `components/DataTable.tsx` — sortable, paginated table
- `components/MediaPicker.tsx` — reusable media selector
- `components/RichEditor.tsx` — Quill wrapper

**`lib/api.ts`:**
- `apiFetch(endpoint, options)` — fetch wrapper tự thêm Authorization header
- `useApi(endpoint)` — hook cho GET với loading/error state
- JWT lưu `localStorage`, tự refresh nếu còn hạn

**Auth flow:**
- Login → nhận JWT → lưu localStorage
- React Router guard: route `/admin/*` check JWT → redirect `/admin/login` nếu invalid
- Axios interceptor: 401 → clear token → redirect login

### 4.4 — Build & Deploy Script (3 ngày)

**`Sources/products/goi-b/frontend/`:**
- `vite.config.ts`: build output → `../backend/public/`
- Base path: `/` (React Router `BrowserRouter`)

**`Sources/products/goi-b/backend/install.php`:**
1. Check nếu `database/app.db` chưa tồn tại
2. Chạy `schema.sql` tạo bảng
3. Seed settings mặc định
4. Tạo superadmin (password từ `$_POST['password']` hoặc default)
5. Xóa `install.php` sau khi chạy (bảo mật)
6. Redirect về `/admin/login`

**Kiểm tra deploy:**
- Upload lên hosting PHP test (có `pdo_sqlite`)
- Truy cập `/install.php` → chạy setup
- Login `/admin` → CRUD hoạt động
- Frontend `/` load đúng

---

## Step 5 — Extensions + Launch (2 tháng)

### 5.1 — Extension: Spa/Làm đẹp (2 tuần)

**Bảng thêm vào `schema.sql`:**
```sql
CREATE TABLE services (id, name, description, image, price, duration_min, category, status, sort_order);
CREATE TABLE staff (id, name, title, bio, avatar, status);
CREATE TABLE bookings (id, service_id, staff_id, customer_name, customer_phone, customer_email, booking_date, time_slot, note, status, created_at);
CREATE TABLE time_slots (id, day_of_week, start_time, end_time, is_active);
```

**API endpoints thêm:**
- `GET /api/services` — public
- `POST /api/bookings` — public (gửi booking)
- `GET /api/admin/bookings` — protected (admin xem)
- `PUT /api/admin/bookings/:id/status` — protected

**Frontend pages thêm (React):**
- `/admin/bookings` — bảng booking, filter by date/status
- `/admin/services` — CRUD services

**Frontend public (template tích hợp):**
- Section đặt lịch trong template spa-beauty

### 5.2 — Extension: Nhà hàng (2 tuần)

**Bảng thêm:**
```sql
CREATE TABLE menu_categories (id, name, description, sort_order);
CREATE TABLE menu_items (id, category_id, name, description, image, price, status, featured);
CREATE TABLE table_reservations (id, name, phone, email, date, time, guests, note, status, created_at);
```

**API + Admin CRUD** tương tự pattern spa.

### 5.3 — Đóng gói sản phẩm (1 tuần)

**Mỗi gói bao gồm:**
```
goi-b-spa-v1.0.zip
├── public_html/        ← Bản đã build, upload thẳng lên hosting
├── README.md           ← Hướng dẫn deploy từng bước (tiếng Việt)
├── CHANGELOG.md
└── schema_mysql.sql    ← Nếu khách dùng MySQL thay SQLite
```

**README.md hướng dẫn:**
1. Upload `public_html/` lên hosting
2. Truy cập `yourdomain.com/api/install.php`
3. Đặt password admin
4. Login vào `/admin` và cập nhật settings

**Checklist trước khi đóng gói:**
- [ ] Prepared statements tất cả queries
- [ ] `.htaccess` chặn `.db` và `config.php`
- [ ] `install.php` tự xóa sau khi chạy
- [ ] Không có `console.log`, `var_dump`, `dd()` trong code
- [ ] Build React production (minified, không source map)
- [ ] Test trên fresh hosting (shared hosting + PHP 8.2)
- [ ] CORS config đúng
- [ ] Upload ảnh hoạt động

---

## Checklist hoàn thành Gói B

### Backend
- [ ] Tất cả query dùng prepared statements
- [ ] JWT auth hoạt động, role check đúng
- [ ] File upload validate type + size
- [ ] `.htaccess` bảo vệ `.db`, `config.php`
- [ ] FK ON cho SQLite
- [ ] install.php tự xóa sau khi chạy

### Frontend
- [ ] Build production không lỗi
- [ ] Không env var trong bundle
- [ ] 404 page cho route không tồn tại
- [ ] Loading states cho mọi API call
- [ ] Token expire → redirect login

### Deploy test
- [ ] Upload lên hosting PHP test → chạy được
- [ ] Install.php → tạo DB → login được
- [ ] CRUD tất cả modules hoạt động
- [ ] Upload ảnh hoạt động
- [ ] Mobile-friendly admin

---

## Timeline

| Milestone | Thời gian | Mô tả |
|---|---|---|
| M1 (4.1) | Tháng 1 | PHP Backend Core (Database, Router, Auth, Response) |
| M2 (4.2) | Tháng 1–2 | Core API: auth, settings, posts, pages, media, contacts, banners |
| M3 (4.3) | Tháng 2–3 | React Admin: Login, Dashboard, Posts, Pages, Settings, Media |
| M4 (4.4) | Tháng 3 | Build script, install.php, test deploy |
| M5 (5.1) | Tháng 4 | Extension Spa (bookings, services) |
| M6 (5.2) | Tháng 4 | Extension Nhà hàng (menu, reservations) |
| M7 (5.3) | Tháng 5 | Đóng gói, test, viết README, launch bán |
