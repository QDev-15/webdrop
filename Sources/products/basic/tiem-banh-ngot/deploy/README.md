# La Douceur Patisserie — Tài liệu deploy

Website tiệm bánh ngọt thủ công cao cấp. React SPA + PHP API + SQLite.

---

## Tài khoản admin mặc định

| | |
|---|---|
| URL Admin | `/admin` |
| Email | `sysadmin@admin.com` |
| Mật khẩu | `123456` |

**Doi mat khau ngay sau khi dang nhap lan dau!**

---

## Yêu cầu hosting

- PHP 7.4+ (khuyến nghị PHP 8.x)
- Extension `pdo_sqlite` (hầu hết shared hosting đã có)
- `mod_rewrite` (Apache) hoặc URL Rewrite Module (IIS)
- Thư mục `api/database/` và `api/uploads/` phải có quyền ghi (chmod 755)

---

## Hướng dẫn deploy

### Bước 1 — Build

Chạy lệnh build để tạo thư mục `deploy/`:

**Windows:**
```
build.bat
```

**Linux/Mac:**
```
bash build.sh
```

### Bước 2 — Upload

Upload toàn bộ nội dung trong thư mục `deploy/` lên `public_html/` của hosting.

Cấu trúc sau khi upload:
```
public_html/
├── index.html          ← website chính
├── assets/             ← JS/CSS/fonts
├── web.config          ← IIS routing (Windows hosting)
├── .htaccess           ← Apache routing (Linux hosting)
├── admin/              ← trang quản trị
│   ├── index.html
│   └── assets/
└── api/                ← PHP backend
    ├── index.php
    ├── config.php      ← CẦN SỬA APP_URL
    ├── schema.sql
    ├── database/       ← SQLite DB tự tạo khi chạy lần đầu
    └── uploads/        ← ảnh upload
```

### Bước 3 — Cấu hình (BẮT BUỘC)

Mở file `api/config.php` và sửa:

```php
define('APP_URL', 'https://tenweb.vn');  // ← URL thực của website (không có / cuối)
```

> APP_KEY đã được tự động tạo bởi script build — không cần sửa thủ công.

### Bước 4 — Kiểm tra

Truy cập: `https://yourdomain.com/api/health`

Kết quả JSON phải có:
- `"pdo_sqlite": true` — nếu `false`, hosting không hỗ trợ SQLite
- `"db_dir": "writable"` — nếu `"not writable"`, chạy `chmod 755 api/database/`
- `"schema_sql": "found"` — nếu `"MISSING"`, upload lại file `api/schema.sql`

### Bước 5 — Phân quyền (nếu cần)

```bash
chmod 755 api/database/
chmod 755 api/uploads/
```

### Bước 6 — Đăng nhập admin

Truy cập: `https://yourdomain.com/admin`

Email: `sysadmin@admin.com`
Mat khau: `123456`

---

## Cấu trúc dự án (source)

```
tiem-banh-ngot/
├── website/            ← React SPA website chính
├── admin/              ← React SPA trang quản trị
├── api/                ← PHP backend
│   ├── config.php      ← Cấu hình app
│   ├── schema.sql      ← DB schema + seed data
│   ├── index.php       ← Entry point + /api/health
│   └── src/
│       ├── Database.php
│       ├── Router.php
│       ├── Auth.php
│       ├── bootstrap.php
│       └── controllers/
├── build.mjs           ← Build script chính
├── build.bat           ← Windows shortcut
└── build.sh            ← Linux/Mac shortcut
```

---

## Tính năng

### Website (public)
- Trang chủ với hero grid hiển thị sản phẩm đẹp nhất
- Trang sản phẩm với filter theo danh mục
- Trang đặt bánh theo yêu cầu (form đầy đủ: loại bánh, hương vị, trang trí, giao hàng)
- Trang liên hệ với form + bản đồ Google Maps
- Reveal animation khi scroll
- Responsive full (mobile/tablet/desktop)

### Admin
- Dashboard với thống kê đơn hàng, sản phẩm, liên hệ
- Quản lý danh mục bánh
- Quản lý sản phẩm (tag, giá, hương vị, ảnh)
- Quản lý đơn đặt bánh (workflow: chờ → xác nhận → đang làm → sẵn sàng → hoàn thành)
- Gallery ảnh
- Đánh giá khách hàng
- Liên hệ inbox
- Media library với upload ảnh local + tìm ảnh Unsplash
- Cài đặt toàn bộ nội dung website (11 tabs)

---

## Hỗ trợ

Gói website này được build bởi **webdrop.vn**.

Liên hệ support: support@webdrop.vn
