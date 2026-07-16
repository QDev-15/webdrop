# Vườn Xanh — Website Deploy (shop-rau-xanh)

Website bán rau củ quả hữu cơ — React SPA (website + admin) + PHP API + SQLite.
Identity Token: **WARM-ARTISAN** (Ochre Clay `#a67a3c` + Khaki Olive `#7d7a4a`, tone sáng ấm), font Fraunces italic + DM Sans, prefix CSS `rx-`.

## Cấu trúc

```
shop-rau-xanh/
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

Output nằm tại `../_output-deploy/` (cùng cấp với thư mục `shop-rau-xanh/`):

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
2. Mở `api/config.php`, sửa `APP_URL` thành domain thật (vd `https://vuonxanh.vn`).
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

- 5 danh mục sản phẩm: Rau ăn lá, Củ quả tươi, Rau gia vị, Trái cây sạch, Combo rau củ tuần
- 22 sản phẩm mẫu (đủ đơn vị bó/kg/túi/combo, tông màu nông sản, giá/giá sale, thông tin dinh dưỡng cho một số sản phẩm)
- 2 mã giảm giá demo: `RAUXANH10` (giảm 10%, đơn tối thiểu 150.000đ), `FREESHIP20` (giảm 20.000đ, đơn tối thiểu 200.000đ)
- 1 Hero Slide trang chủ
- Toàn bộ settings (thông tin chung, SEO, mạng xã hội, trang chủ — cam kết/quy trình/combo/câu chuyện thương hiệu/thống kê, đánh giá khách hàng, footer, liên hệ, thanh toán...)

## Cột mở rộng của bảng `products` (riêng cho ngách rau củ quả)

Ngoài các cột base dùng chung mọi site shop (`colors`/`rating`/`in_stock`), site này có thêm:

| Cột | Ý nghĩa |
|---|---|
| `unit` | Đơn vị hiển thị cạnh giá: "bó", "kg", "túi 300g", "combo"... |
| `gallery` | URL ảnh phụ (pipe-separated), hiển thị dạng thumbnail ở trang chi tiết |
| `tags` | Đặc điểm sản phẩm (pipe-separated): "Hữu cơ", "VietGAP", "Không thuốc BVTV"... — hiển thị badge trang chi tiết |
| `nutrition` | Bảng dinh dưỡng (pipe-separated "Tên:Giá trị") — hiển thị ở tab "Thông tin dinh dưỡng" |
| `sold_count` | Số lượng đã bán — hiển thị "Đã bán X+" |
| `stock_qty` | Số lượng tồn kho cụ thể — hiển thị "còn X túi/kg/..." |

`colors` ở site này KHÔNG phải màu sản phẩm mà là **tông màu nông sản** (Xanh lá/Đỏ/Cam/Vàng) dùng cho bộ lọc "Màu sắc" ở trang Sản phẩm — khớp giữa `admin/src/pages/products/ProductForm.tsx` và `website/src/pages/ProductsPage.tsx` (biến `COLOR_SWATCHES`).

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
