# Volt Kicks — Website Deploy (shop-giay-dep)

Website bán hàng giày dép — React SPA (website + admin) + PHP API + SQLite.
Identity Token: **DARK-ENERGY** (Volt Lime `#d4ff3f` + Electric Cyan `#00e5ff`, tone dark dominant), font Space Grotesk, prefix CSS `gd-`.

## Cấu trúc

```
shop-giay-dep/
├── website/     React SPA công khai (trang chủ, sản phẩm, giỏ hàng, thanh toán, liên hệ)
├── admin/       React SPA quản trị (/admin)
├── api/         PHP backend + SQLite
├── build.bat    Build Windows
├── build.sh     Build Linux/Mac
└── build.mjs    Script build dùng chung
```

## Build

**Windows:**
```
build.bat
```

**Linux/Mac:**
```
bash build.sh
```

Output nằm tại `../_output-deploy/` (cùng cấp với thư mục `shop-giay-dep/`):

```
_output-deploy/
├── index.html, assets/     ← website/dist/
├── web.config, .htaccess   ← SPA routing (IIS + Apache)
├── favicon.ico
├── admin/                  ← admin/dist/
└── api/                    ← PHP backend + SQLite (tự seed lần đầu)
```

## Deploy lên hosting

1. Upload toàn bộ nội dung `_output-deploy/` lên thư mục gốc hosting (vd `public_html/`).
2. Mở `api/config.php`, sửa `APP_URL` thành domain thật (vd `https://voltkicks.vn`).
3. Kiểm tra `https://your-domain.vn/api/health` — phải trả về:
   ```json
   { "status": "ok", "php": "8.x", "pdo_sqlite": true, "db_dir": "writable", ... }
   ```
   Nếu `pdo_sqlite: false` → hosting thiếu extension `pdo_sqlite`, liên hệ nhà cung cấp hosting.
   Nếu `db_dir: "not writable"` → chmod thư mục `api/database/` (khuyến nghị 755, tối đa 775).
4. Chmod (nếu Linux hosting):
   ```
   chmod -R 755 api/database
   chmod -R 755 api/uploads
   ```
5. Đăng nhập admin tại `/admin`:
   - Email: `sysadmin@admin.com`
   - Mật khẩu: `123456`
   - **Đổi mật khẩu ngay sau khi đăng nhập lần đầu** (menu Cài đặt → Profile).
6. Vào **Admin → Cài đặt → 💳 Thanh toán** để bật/tắt COD, cấu hình SePay (nếu dùng chuyển khoản QR).
7. **Xóa file `api/check-hash.php` khỏi server sau khi deploy xong** — đây là file debug hỗ trợ kiểm tra hash mật khẩu trong DB, không nên để lại trên production.

## Dữ liệu mặc định (seed lần đầu)

- 4 danh mục sản phẩm: Sneaker, Boot, Chạy bộ, Sandal
- 18 sản phẩm mẫu (đủ màu sắc, kích cỡ 38–44, giá/giá sale)
- 2 mã giảm giá demo: `WELCOME10` (giảm 10%, đơn tối thiểu 500.000đ), `FREESHIP` (giảm 30.000đ, đơn tối thiểu 500.000đ)
- 1 Hero Slide trang chủ
- Toàn bộ settings (thông tin chung, SEO, mạng xã hội, trang chủ, đánh giá, footer, liên hệ, thanh toán...)

## Module Phiếu giảm giá (coupon)

- Quản lý tại **Admin → Đơn hàng → Phiếu giảm giá**
- Khách nhập mã ở trang Giỏ hàng hoặc Thanh toán — hệ thống gọi `POST /api/public/coupons/validate` để kiểm tra và tính giảm giá trước khi tạo đơn.
- Bảng `coupons` độc lập với hệ thống discount của webdrop.store (System DB) — chỉ áp dụng riêng cho site này.

## Thanh toán

- **COD** — mặc định bật, admin xác nhận thủ công qua Admin → Đơn hàng.
- **SePay (chuyển khoản QR)** — tắt mặc định, cần cấu hình tại Admin → Cài đặt → 💳 Thanh toán:
  - SePay API Access (dùng để xác thực webhook + đồng bộ tài khoản)
  - Mã ngân hàng, số tài khoản, tên chủ tài khoản nhận tiền
  - Webhook URL cần khai báo trên SePay: `https://your-domain.vn/api/public/sepay-webhook`

## Tài khoản mặc định

| Trường | Giá trị |
|---|---|
| Email | sysadmin@admin.com |
| Mật khẩu | 123456 |

**Đổi mật khẩu ngay sau khi deploy.**
