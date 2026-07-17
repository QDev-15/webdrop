# Tươi Mỗi Ngày — Website Deploy (shop-thuc-pham-sach)

Website bán thực phẩm sạch (rau củ hữu cơ, thịt cá tươi, gạo & đồ khô) — React SPA (website + admin) + PHP API + SQLite.
Identity Token: **FRESH-MINIMAL** (Leaf Green `#2f8f4e` + Harvest Amber `#dd8f3a`), font Plus Jakarta Sans (unified), Nav-8 underline-active, Hero H4 centered minimal, footer tối (forest green), prefix CSS `tp-`.

## Cấu trúc

```
shop-thuc-pham-sach/
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

Output nằm tại `../_output-deploy/` (cùng cấp với thư mục `shop-thuc-pham-sach/`):

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
2. Mở `api/config.php`, sửa `APP_URL` thành domain thật (vd `https://tuoimoingay.vn`).
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

- 6 danh mục sản phẩm: Rau Củ Hữu Cơ, Trái Cây Tươi, Thịt & Hải Sản Sạch, Gạo & Ngũ Cốc, Trứng & Sữa Tươi, Gia Vị & Đồ Khô
- 27 sản phẩm mẫu (đủ đơn vị bó/kg/hộp/chai, tông màu nhóm thực phẩm, giá/giá sale, chứng nhận VietGAP/Organic, thông tin dinh dưỡng + nguồn gốc cho một số sản phẩm)
- 2 mã giảm giá demo: `TUOI10` (giảm 10%, đơn tối thiểu 150.000đ), `FREESHIP` (giảm 15.000đ, đơn tối thiểu 200.000đ)
- 1 Hero Slide trang chủ
- Toàn bộ settings (thông tin chung, SEO, mạng xã hội, trang chủ — cam kết/quy trình/câu chuyện nông trại/thống kê, đánh giá khách hàng, footer, liên hệ, thanh toán...)

## Cột mở rộng của bảng `products` (riêng cho ngách thực phẩm sạch)

Ngoài các cột base dùng chung mọi site shop (`colors`/`rating`/`in_stock`), site này có thêm:

| Cột | Ý nghĩa |
|---|---|
| `unit` | Đơn vị hiển thị cạnh giá: "bó 300g", "kg", "hộp 10 quả", "chai 500ml"... |
| `certs` | Chứng nhận (pipe-separated, chỉ nhận `VietGAP`/`Organic`/`GlobalGAP`) — dùng cho filter "Chứng nhận" ở trang Sản phẩm, hiển thị badge ở trang chi tiết |
| `gallery` | URL ảnh phụ (pipe-separated), hiển thị dạng thumbnail ở trang chi tiết |
| `nutrition` | Bảng dinh dưỡng (pipe-separated "Tên:Giá trị") — hiển thị ở tab "Thông tin dinh dưỡng" |
| `origin_farm` | Tên nông trại / nguồn gốc — hiển thị ở tab "Nguồn gốc" |
| `harvest_note` | Ghi chú thời gian thu hoạch — hiển thị ở tab "Nguồn gốc" |
| `sold_count` | Số lượng đã bán — hiển thị "Đã bán X+" |
| `stock_qty` | Số lượng tồn kho cụ thể |

`colors` ở site này KHÔNG phải màu sản phẩm mà là **tông màu nhóm thực phẩm** (Xanh lá/Đỏ/Cam/Vàng) dùng cho bộ lọc "Màu sắc" ở trang Sản phẩm — khớp giữa `admin/src/pages/products/ProductForm.tsx` và `website/src/pages/ProductsPage.tsx` (biến `COLOR_SWATCHES`).

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
