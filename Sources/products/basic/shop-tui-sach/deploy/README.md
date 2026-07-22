# Maison Cuir — Website Deploy (shop-tui-sach)

Website bán hàng túi da thủ công cao cấp — React SPA (website + admin) + PHP API + SQLite.
Identity Token: **LUXE-DARK** (Gold `#c9a24d` + Burgundy `#7a2e3a`, tone dark tuyệt đối), font Cormorant Garamond italic 300 + DM Sans, prefix CSS `ts-`.

## Cấu trúc

```
shop-tui-sach/
├── website/     React SPA công khai (trang chủ, sản phẩm, bộ sưu tập, về chúng tôi, giỏ hàng, thanh toán, liên hệ)
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

Output nằm tại `../_output-deploy/` (cùng cấp với thư mục `shop-tui-sach/`):

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
2. Mở `api/config.php`, sửa `APP_URL` thành domain thật (vd `https://maisoncuir.vn`).
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

- 4 danh mục sản phẩm: Túi xách tay, Túi đeo chéo, Ví & Clutch, Phụ kiện da
- 8 sản phẩm mẫu (đủ màu sắc da thật, kích thước S/M/L/XL, giá/giá sale)
- 2 mã giảm giá demo: `WELCOME10` (giảm 10%, đơn tối thiểu 1.000.000đ), `FREESHIP` (giảm 50.000đ, đơn tối thiểu 1.000.000đ)
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
