# Barber & Style — Website hoàn chỉnh

React SPA + PHP API + SQLite — deploy upload là chạy.

## Thông tin đăng nhập mặc định

- **URL admin**: `/admin`
- **Email**: `sysadmin@admin.com`
- **Mật khẩu**: `123456`

> ⚠️ Đổi mật khẩu ngay sau khi deploy tại `/admin/profile`.

## Cấu trúc thư mục

```
tiem-toc-barber/
├── website/          ← React SPA public (Vite)
├── admin/            ← React SPA admin (Vite)
├── api/               ← PHP backend + SQLite
│   ├── config.php    ← Cấu hình (sửa APP_URL + APP_KEY sau khi deploy)
│   ├── schema.sql     ← Schema DB (không chứa seed user — seed qua PHP)
│   ├── index.php      ← Entry point + health check
│   ├── check-hash.php ← Debug hash mật khẩu — XÓA sau khi deploy xong
│   └── src/
│       ├── Auth.php, Database.php, Router.php, Response.php
│       ├── bootstrap.php   ← Đăng ký toàn bộ route
│       └── controllers/
└── build.bat / build.sh
```

## Yêu cầu hosting

- PHP 8.0+ với extension `pdo_sqlite`
- Hỗ trợ `.htaccess` (Apache) hoặc `web.config` (IIS/Windows)
- Không cần MySQL — dùng SQLite, tự tạo + seed data khi nhận request đầu tiên

## Build & Deploy

### Windows
```bat
build.bat
```

### Linux / Mac
```bash
bash build.sh
```

Output nằm trong thư mục `_output-deploy/` — cùng cấp với `tiem-toc-barber/`.

### Cấu trúc output

```
_output-deploy/
├── index.html, assets/   ← Website public
├── admin/                 ← Admin panel
├── api/                   ← PHP backend + SQLite
├── .htaccess               ← SPA routing (Apache)
├── web.config               ← SPA routing (IIS)
└── favicon.ico
```

## Sau khi upload lên hosting

1. Upload toàn bộ nội dung `_output-deploy/` lên thư mục gốc hosting (`public_html/` hoặc tương đương).
2. Sửa `api/config.php`:
   - `APP_URL` → URL thực của website (VD: `https://barberstyle.vn`)
   - `APP_KEY` → build.mjs đã tự sinh chuỗi ngẫu nhiên — không cần sửa thủ công
   - `CORS_ORIGINS` → thêm domain thực nếu frontend/API khác domain
3. Kiểm tra `https://domain.vn/api/health` → phải thấy `pdo_sqlite: true`, `db_dir: writable`.
4. Chmod thư mục `api/database/` và `api/uploads/` nếu hosting Linux yêu cầu quyền ghi.
5. Truy cập `/admin` — đăng nhập `sysadmin@admin.com` / `123456` — đổi mật khẩu ngay.
6. Xóa file `api/check-hash.php` khỏi server sau khi deploy xong (chỉ dùng để debug).

## Tính năng

### Website khách (`/`)
- Trang chủ: Hero split (H10 geometric), stat bar (đếm số động), dịch vụ nổi bật, gallery bento, đội ngũ stylist, đánh giá khách hàng, CTA đặt lịch, Zalo float
- `/dich-vu`: Bảng giá đầy đủ theo danh mục (Cắt & tạo kiểu Nam/Nữ, Cạo râu, Uốn, Nhuộm, Duỗi, Chăm sóc)
- `/dat-lich`: Form đặt lịch 3 bước (dịch vụ & stylist → ngày giờ → thông tin khách) + panel thông tin tiệm + chính sách đặt lịch
- `/lien-he`: Thông tin liên hệ, form gửi tin nhắn, bản đồ Google Maps embed, FAQ
- Reveal animation toàn site qua `AppShell` (IntersectionObserver + MutationObserver)

### Admin (`/admin`)
- Dashboard: thống kê tổng quan (lịch đặt, dịch vụ, stylist, đánh giá, liên hệ) + lịch đặt gần đây
- Quản lý danh mục dịch vụ (icon, tag, thứ tự)
- Quản lý dịch vụ & bảng giá (ảnh, ghi chú, giá, nổi bật)
- Quản lý đặt lịch — filter theo trạng thái + detail panel + đổi trạng thái
- Quản lý stylist (ảnh chân dung, chuyên môn)
- Quản lý đánh giá khách hàng
- Quản lý hero slides, gallery, liên hệ, thư viện media
- Cài đặt website: thông tin chung, Hero, chính sách đặt lịch, SEO, mạng xã hội, footer, liên hệ (map), SMTP, Cloudinary, Unsplash
- Hồ sơ cá nhân: đổi tên, đổi mật khẩu

## Seed data mặc định (từ nội dung thực trong template)

- **7 danh mục dịch vụ**: Cắt & tạo kiểu Nam/Nữ, Cạo râu & chăm sóc râu, Uốn tóc, Nhuộm tóc, Duỗi/thẳng tóc, Chăm sóc & dưỡng tóc
- **29 dịch vụ** với giá thực từ bảng giá template (100.000đ – 2.500.000đ)
- **4 stylist**: Master Barber, Senior Stylist, Color Specialist, Junior Stylist
- **3 đánh giá** khách hàng mẫu
- **5 ảnh gallery**
- **30+ cài đặt** mặc định (thông tin liên hệ, hero, SEO, chính sách đặt lịch)

## API Endpoints

### Public (không cần auth)
- `GET /api/public/settings` — Cài đặt website (flat key-value)
- `GET /api/public/hero-slides` — Hero slides
- `GET /api/public/service-categories` — Danh mục dịch vụ
- `GET /api/public/services[?featured=1][?category=slug]` — Dịch vụ
- `GET /api/public/team` — Đội ngũ stylist
- `GET /api/public/testimonials` — Đánh giá
- `GET /api/public/gallery` — Ảnh gallery
- `POST /api/public/booking` — Gửi đặt lịch
- `POST /api/public/contact` — Gửi liên hệ

### Admin (cần đăng nhập — xem chi tiết trong `api/src/bootstrap.php`)
- `/service-categories`, `/services`, `/bookings`, `/team`, `/testimonials`, `/gallery`, `/hero-slides`, `/contacts`, `/media`, `/settings`, `/stats`, `/users`

## Lưu ý kỹ thuật

- Chỉ dùng GET và POST — PUT/DELETE qua suffix `/update`, `/delete` (tránh IIS/WebDAV block)
- SQLite bắt buộc `PRAGMA foreign_keys = ON`
- Session name: `TiemTocBarber` (alphanumeric, không dấu gạch ngang — bắt buộc trên PHP 8)
- DB file: `api/database/app.db` — tự tạo + seed lần đầu khi có request
- `.htaccess` / `web.config` chặn truy cập trực tiếp vào file `.db`
- Mật khẩu admin dùng `password_hash()` (bcrypt) — sinh tại thời điểm seed, không hardcode trong `schema.sql`
