# shop-quan-ao — Lys Chic

Website bán quần áo nữ (React SPA website + React SPA admin + PHP/SQLite backend), chuyển đổi từ template `Sources/templates/web/Shops/shop-quan-ao/` (Identity Token: SOFT-PASTEL — Lavender `#b98bd1` + Butter `#f2c14e`, CSS prefix `qa-`).

## Cấu trúc

```
shop-quan-ao/
├── website/     React SPA public (Vite + TypeScript)
├── admin/       React SPA admin (Vite + TypeScript)
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

Output nằm ở `../_output-deploy/` (cùng cấp với thư mục `shop-quan-ao/`):

```
_output-deploy/
├── index.html, assets/    ← website/dist/
├── web.config, .htaccess  ← SPA routing (IIS + Apache)
├── favicon.ico
├── admin/                 ← admin/dist/
└── api/                   ← PHP backend + SQLite
```

## Deploy lên hosting

1. Upload toàn bộ nội dung `_output-deploy/` lên thư mục gốc hosting (`public_html/` hoặc tương đương).
2. Mở `api/config.php` trên hosting, sửa:
   - `APP_URL` → URL thực của website (không có dấu `/` cuối), ví dụ `https://lyschic.vn`
   - `APP_KEY` đã được `build.mjs` tự sinh ngẫu nhiên — không cần sửa thủ công.
3. Kiểm tra hosting có PHP ≥ 8.0 và extension `pdo_sqlite` được bật.
4. Truy cập `https://domain.vn/api/health` — phải thấy:
   ```json
   { "status": "ok", "pdo_sqlite": true, "db_dir": "writable", "db_exists": true, "schema_sql": "found" }
   ```
   Nếu `pdo_sqlite` là `false` → liên hệ hosting bật extension. Nếu `db_dir` là `not writable` → chmod thư mục `api/database/` lên `755` hoặc `775`.
5. `chmod -R 755 api/database/ api/uploads/` (hoặc quyền ghi tương đương) — DB SQLite và ảnh upload cần quyền ghi.
6. Đăng nhập admin tại `https://domain.vn/admin/` với tài khoản mặc định:
   - Email: `sysadmin@admin.com`
   - Mật khẩu: `123456`
   - **Đổi mật khẩu ngay sau khi đăng nhập lần đầu** (menu Tài khoản → Đổi mật khẩu).
7. Xóa file `api/check-hash.php` khỏi server sau khi deploy xong (file debug dùng để verify bcrypt hash trong DB, không cần thiết ở production).
8. Vào Admin → Cài đặt để điền đầy đủ thông tin cửa hàng thật (SĐT, địa chỉ, mạng xã hội, ảnh sản phẩm...) — dữ liệu seed mặc định chỉ mang tính demo.

## Thanh toán

- **COD** — mặc định bật, không cần cấu hình thêm.
- **SePay (chuyển khoản QR)** — vào Admin → Cài đặt → tab "💳 Thanh toán":
  1. Bật "Chuyển khoản trước qua SePay"
  2. Nhập SePay API Access (lấy tại my.sepay.vn → Cài đặt công ty → API Access)
  3. Bấm "🔄 Đồng bộ tài khoản từ SePay" để tự động điền mã ngân hàng/số tài khoản/tên chủ tài khoản, hoặc điền tay
  4. Cấu hình Webhook trên SePay trỏ về: `https://domain.vn/api/public/sepay-webhook`
  5. Nhấn "Lưu cài đặt"

## Database

- SQLite tự tạo và seed dữ liệu mẫu (4 danh mục, 18 sản phẩm, 1 hero slide, tài khoản admin, đầy đủ settings) khi nhận request đầu tiên — không cần setup thủ công.
- Schema: `api/schema.sql` — 5 bảng core (`users`, `settings`, `hero_slides`, `contacts`, `media`) + extension (`product_categories`, `products`, `orders`, `order_items`).
- `.htaccess` / `web.config` đã chặn truy cập trực tiếp vào file `.db`.

## Dev local

```bash
cd website && npm install && npm run dev   # http://localhost:5173
cd admin    && npm install && npm run dev  # http://localhost:5174 (hoặc port Vite tự chọn)
```

API PHP chạy qua `php -S localhost:8081 -t api` (hoặc XAMPP/tương đương) — vite proxy `/api` đã trỏ sẵn tới `http://localhost:8081`.
