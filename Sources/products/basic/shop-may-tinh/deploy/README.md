# NovaTech — Website Deploy (shop-may-tinh)

Website bán máy tính & laptop — React SPA (website + admin) + PHP API + SQLite.
Identity Token: **GLASS-MODERN** (Indigo `#6d5ef8` + Cyan `#22d3ee`), font Inter (unified), prefix CSS `mt-`.

## Cấu trúc

```
shop-may-tinh/
├── website/     React SPA công khai (trang chủ, sản phẩm, dịch vụ, khuyến mãi, giỏ hàng, thanh toán, liên hệ)
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

Output nằm tại `../_output-deploy/` (cùng cấp với thư mục `shop-may-tinh/`):

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
2. Mở `api/config.php`, sửa `APP_URL` thành domain thật (vd `https://novatech.vn`).
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

- 5 danh mục sản phẩm: Laptop, PC Desktop, Linh kiện, Gaming Gear, Màn hình & Phụ kiện
- 10 sản phẩm mẫu (đủ cấu hình RAM/Ổ cứng, màu sắc/vỏ case, thông số kỹ thuật, giá/giá sale)
- 4 Hero Slide trang chủ (crossfade)
- Toàn bộ settings (thông tin chung, SEO, mạng xã hội, trang chủ, đánh giá khách hàng, footer, liên hệ, thanh toán...)

## Cột mở rộng riêng cho `products` (ngoài base scaffold)

- `gallery` — pipe-separated URL ảnh phụ hiển thị ở gallery thumbnail trang chi tiết sản phẩm.
- `config_options` — pipe-separated cấu hình RAM/Ổ cứng thật của sản phẩm (vd `8GB / 256GB|16GB / 512GB`).
- `specs` — pipe-separated `Nhãn:Giá trị` cho tab "Thông số kỹ thuật" trang chi tiết.
- `review_count` — số lượt đánh giá hiển thị cạnh điểm rating.

`ShopPublicController::products()` được mở rộng thêm tham số `?config=` (lọc theo cột `config_options`, cùng pattern với `?colors=`) — theo đúng comment cho phép mở rộng sẵn có trong file gốc.

## Thanh toán

- **COD** — mặc định bật, admin xác nhận thủ công qua Admin → Đơn hàng.
- **SePay (chuyển khoản QR)** — tắt mặc định, cần cấu hình tại Admin → Cài đặt → 💳 Thanh toán:
  - SePay API Access (dùng để xác thực webhook + đồng bộ tài khoản)
  - Mã ngân hàng, số tài khoản, tên chủ tài khoản nhận tiền
  - Webhook URL cần khai báo trên SePay: `https://your-domain.vn/api/public/sepay-webhook`
- Trang `/thanh-toan` (`CheckoutPage.tsx`) là trang tự dựng — template gốc không có (nút "Thanh toán ngay" ở giỏ hàng chỉ là `href="#"`).

## Tài khoản mặc định

| Trường | Giá trị |
|---|---|
| Email | sysadmin@admin.com |
| Mật khẩu | 123456 |

**Đổi mật khẩu ngay sau khi deploy.**
