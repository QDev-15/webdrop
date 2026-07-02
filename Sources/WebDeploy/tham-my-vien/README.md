# Thẩm Mỹ Viện — Website hoàn chỉnh

React SPA + PHP API + SQLite — deploy upload là chạy.

## Thông tin đăng nhập mặc định

- **URL admin**: `/admin`
- **Email**: `sysadmin@admin.com`
- **Mật khẩu**: `123456`

> Đổi mật khẩu ngay sau khi deploy tại `/admin/profile`.

## Cấu trúc thư mục

```
tham-my-vien/
├── website/          ← React SPA public (Vite)
├── admin/            ← React SPA admin (Vite)
├── api/              ← PHP backend + SQLite
│   ├── config.php    ← Cấu hình (sửa APP_URL + APP_KEY)
│   ├── schema.sql    ← Schema + seed data
│   ├── index.php     ← Entry point
│   └── src/
│       ├── Auth.php, Database.php, Router.php, Response.php
│       ├── bootstrap.php
│       └── controllers/
└── build.bat / build.sh
```

## Yêu cầu hosting

- PHP 8.0+ với `pdo_sqlite` extension
- Hosting cho phép `.htaccess` (Apache) hoặc `web.config` (IIS/Windows)
- Không cần MySQL — dùng SQLite (tự tạo khi boot lần đầu)

## Build & Deploy

### Windows

```bat
build.bat
```

### Linux / Mac

```bash
bash build.sh
```

Output sẽ nằm trong thư mục `_output-deploy/` cùng cấp với `tham-my-vien/`.

### Cấu trúc output

```
_output-deploy/
├── index.html          ← Website public
├── assets/             ← JS/CSS đã bundle
├── .htaccess           ← SPA routing (Apache)
├── web.config          ← SPA routing (IIS)
├── favicon.ico
├── admin/
│   ├── index.html      ← Admin panel
│   └── assets/
└── api/
    ├── index.php
    ├── config.php      ← Chỉnh APP_URL + APP_KEY + CORS_ORIGINS
    ├── schema.sql
    ├── .htaccess       ← Chặn truy cập .db
    └── src/
```

## Cài đặt trên hosting

1. Upload toàn bộ nội dung `_output-deploy/` lên thư mục gốc của domain.
2. Mở file `api/config.php`, sửa:
   - `APP_URL` → URL thực của website (VD: `https://thammy.vn`)
   - `APP_KEY` → Một chuỗi ngẫu nhiên dài 32+ ký tự (dùng làm secret JWT)
   - `CORS_ORIGINS` → Thêm domain thực vào mảng
3. Truy cập website — DB SQLite tự khởi tạo và seed data lần đầu.
4. Đăng nhập admin tại `/admin` với `sysadmin@admin.com` / `123456`.

## Tính năng

### Website khách (/)
- Hero split 45/55 với nội dung dynamic từ DB
- Thống kê (số ca, bác sĩ, năm KN, hài lòng)
- Dịch vụ phân theo danh mục với tab filter
- Đội ngũ bác sĩ với ảnh và thông tin chuyên môn
- Đánh giá khách hàng (testimonials)
- Form đặt lịch tư vấn — không cần đăng nhập
- Nút Zalo float
- Reveal animation với IntersectionObserver + MutationObserver

### Admin (/admin)
- Dashboard: thống kê tổng quan + đặt lịch gần đây
- Quản lý dịch vụ (thêm/sửa/xóa, phân danh mục, ảnh)
- Quản lý danh mục dịch vụ
- Quản lý đặt lịch với filter theo trạng thái + detail panel
- Quản lý đội ngũ bác sĩ
- Quản lý đánh giá khách hàng
- Quản lý hero slides
- Quản lý liên hệ
- Thư viện media (upload ảnh)
- Cài đặt website: thông tin, SEO, mạng xã hội, hero, Cloudinary, Unsplash
- Hồ sơ: đổi tên, đổi mật khẩu

## Seed data mặc định

- **Danh mục**: Thẩm mỹ gương mặt / Chăm sóc da & Laser / Thẩm mỹ cơ thể
- **13 dịch vụ** với giá thực từ template
- **6 bác sĩ** với thông tin chuyên môn đầy đủ
- **3 đánh giá** khách hàng mẫu
- **28 cài đặt** mặc định (thông tin liên hệ, SEO, hero)

## API Endpoints

### Public (không cần auth)
- `GET /api/public/settings` — Cài đặt website
- `GET /api/public/slides` — Hero slides
- `GET /api/public/services[?featured=1][?category=slug]` — Dịch vụ
- `GET /api/public/service-categories` — Danh mục
- `GET /api/public/team` — Đội ngũ
- `GET /api/public/testimonials` — Đánh giá
- `POST /api/bookings` — Gửi đặt lịch

### Admin (cần đăng nhập)
- Xem API docs trong `api/src/bootstrap.php`

## Lưu ý kỹ thuật

- Chỉ dùng GET và POST (PUT/DELETE qua suffix `/update`, `/delete`)
- SQLite FK bắt buộc ON — mọi connection đều `PRAGMA foreign_keys = ON`
- Session name: `ThamMyVien` (alphanumeric, không dấu gạch ngang)
- DB file: `api/data/tham-my-vien.db` — tự tạo lần đầu
- `.htaccess` chặn HTTP access vào thư mục `data/`
