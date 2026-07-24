# AMI Fashion — Website Deploy (shop-quan-ao-ami)

Website bán hàng thời trang AMI Fashion — React SPA (frontend + admin) + PHP API + SQLite.
Identity Token: **ZEN-MINIMAL** (Sage Green `#6b8067` + Taupe `#a9906b`, font Cormorant Garamond + DM Sans, CSS prefix `am-`).

## 1. Build

```bash
# Windows
build.bat

# Linux/Mac
bash build.sh
```

Build sẽ biên dịch `website/` + `admin/` (React/Vite) và gom toàn bộ vào thư mục
`_output-deploy/` nằm **cùng cấp** với thư mục source (`Sources/WebDeploy/_output-deploy/`).

## 2. Deploy lên hosting

1. Upload toàn bộ nội dung thư mục `_output-deploy/` lên thư mục gốc web (`public_html` hoặc tương đương).
2. Mở `api/config.php`, sửa:
   - `APP_URL` → URL thật của website (không có dấu `/` cuối), ví dụ `https://amifashion.vn`.
   - `APP_KEY` đã được `build.mjs` tự sinh ngẫu nhiên — không cần sửa thủ công.
3. Kiểm tra hosting hỗ trợ PHP 8.x + extension `pdo_sqlite`.
4. Truy cập `https://domain-cua-ban/api/health` — phải thấy:
   ```json
   { "status": "ok", "pdo_sqlite": true, "db_dir": "writable", ... }
   ```
   Nếu `db_dir` báo "not writable" → chmod thư mục `api/database/` (và `api/uploads/`) lên `755`
   hoặc `775` tùy cấu hình hosting.
5. Lần đầu tiên nhận request, hệ thống tự tạo database SQLite (`api/database/app.db`) và seed sẵn
   toàn bộ dữ liệu mẫu thật của AMI Fashion (5 danh mục, 36 sản phẩm, cài đặt mặc định...).

## 3. Đăng nhập Admin

- URL: `https://domain-cua-ban/admin`
- Tài khoản mặc định: `sysadmin@admin.com` / `123456`
- **Đổi mật khẩu ngay** sau lần đăng nhập đầu tiên (menu Hồ sơ / Profile).

## 4. Cấu hình thanh toán

Vào **Admin → Cài đặt → 💳 Thanh toán**:
- **COD** (thanh toán khi nhận hàng): bật/tắt tùy ý, mặc định đang **bật**.
- **SePay** (chuyển khoản QR): điền đủ 4 trường (mã ngân hàng, số tài khoản, tên chủ tài khoản,
  webhook secret) rồi mới bật — thiếu 1 trường thì khách sẽ không thấy phương thức này.
- Cấu hình phí vận chuyển (`shipping_fee`) và ngưỡng miễn phí ship (`free_shipping_threshold`)
  cùng trong tab này.

## 5. Bảo mật sau khi deploy

- **Xóa file `api/check-hash.php` khỏi server ngay sau khi deploy xong** — đây là file debug hỗ
  trợ verify hash mật khẩu, không nên để tồn tại lâu dài trên môi trường production.
- File `.htaccess` (Apache) / `web.config` (IIS) đã tự chặn truy cập trực tiếp `.db`, `.sql`, `config.php`.

## 6. Ghi chú kỹ thuật

- Trang chủ dùng **"Search Zone"** (tiêu đề lớn + ô tìm kiếm) thay cho hero ảnh — không có banner/slider,
  đúng theo thiết kế gốc của template (Biến thể 2 CATEGORY-SECTIONS).
- Trang Sản phẩm (`/san-pham`) dùng **filter toolbar ngang** (category pill + dropdown Khoảng giá/Size/
  Màu sắc + sort), không phải sidebar dọc — bám đúng cấu trúc thật của `san-pham.html` gốc.
- Mỗi sản phẩm AMI chỉ có **đúng 1 màu** (khác các site shop khác cho phép nhiều màu/sản phẩm).
- Cột mở rộng riêng của site này trong bảng `products`: `sizes` (padded pipe `|XS|S|M|`), `theme`
  (padded pipe `|hang-moi|ban-chay|giam-gia|` — quyết định sản phẩm xuất hiện ở section nào của
  trang chủ), `sold` (dùng cho sort "Bán chạy nhất").
- Trang `/thanh-toan` (Checkout) là trang tự dựng thêm (template gốc không có, nút "Thanh toán ngay"
  chỉ là `href="#"`) — CSS riêng `shop-checkout.css`, không phụ thuộc prefix `am-` của site.
- Chưa tích hợp module Phiếu giảm giá (coupon) — nằm ngoài phạm vi yêu cầu ban đầu, có thể bổ sung
  sau theo pattern đã dùng ở các site shop khác nếu cần.
