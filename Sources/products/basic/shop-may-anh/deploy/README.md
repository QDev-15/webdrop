# shop-may-anh — PhotoPro (Shop máy ảnh & thiết bị nhiếp ảnh)

Website deploy hoàn chỉnh: React SPA (frontend + admin) + PHP API + SQLite.
Identity: **GEOMETRIC-MODERN**, font Sora, accent Optical Teal `#0d8a82` + Amber `#e8871e`, prefix CSS `ma-`.

## 1. Build

```bash
# Windows
build.bat

# Linux/Mac
bash build.sh
```

Output nằm ở `../_output-deploy/` (cùng cấp với thư mục `shop-may-anh/`):

```
_output-deploy/
├── index.html, assets/     ← public site (website/dist/)
├── web.config, .htaccess   ← SPA routing (IIS/Apache)
├── favicon.ico
├── admin/                  ← admin panel (admin/dist/)
└── api/                    ← PHP backend + SQLite (schema.sql, config.php, src/...)
```

## 2. Deploy lên hosting

1. Upload toàn bộ nội dung `_output-deploy/` lên thư mục gốc web (hoặc thư mục con nếu chạy dưới sub-path).
2. Sửa `api/config.php`:
   - `APP_URL` → URL thực của website (không có dấu `/` cuối), ví dụ `https://photopro.vn`.
   - `APP_KEY` đã được `build.mjs` tự sinh ngẫu nhiên — không cần sửa.
3. Kiểm tra `https://domain.vn/api/health` → phải trả về `{"status":"ok","pdo_sqlite":true,"db_dir":"writable",...}`.
   - Nếu `db_dir` không phải `writable` → `chmod 755 api/database/` (và `api/uploads/`) trên hosting Linux.
4. DB SQLite tự tạo + seed dữ liệu mẫu (6 danh mục, 9 sản phẩm, cài đặt mặc định) ngay lần đầu server nhận request — không cần setup thủ công.
5. Đăng nhập admin tại `/admin`:
   - Email: `sysadmin@admin.com`
   - Mật khẩu: `123456`
   - **Đổi mật khẩu ngay** sau khi đăng nhập lần đầu (menu Profile).
6. **Xóa `api/check-hash.php` khỏi server sau khi deploy xong** — đây là file debug hỗ trợ verify hash password trực tiếp trên server, không được để lại trên production.

## 3. Cấu hình bán hàng (Admin → Cài đặt)

- Tab **💳 Thanh toán**: bật/tắt COD và/hoặc SePay (chuyển khoản QR). Nếu bật SePay phải điền đủ ngân hàng + số tài khoản + tên chủ tài khoản + webhook secret (secret dùng để verify webhook `POST /api/public/sepay-webhook` từ SePay — cấu hình URL này trong dashboard SePay).
- Tab **Thông tin chung / Trang chủ / Đánh giá khách hàng / Thương hiệu / Footer / Liên hệ**: toàn bộ nội dung trang chính (trừ danh mục/sản phẩm — quản lý riêng ở menu Sản phẩm) đều chỉnh được tại đây.
- Menu **Sản phẩm → Danh mục / Sản phẩm**: CRUD đầy đủ. Trường "Màu thân máy" và "Thương hiệu" trong form sản phẩm phải khớp đúng danh sách cố định trong code (`ProductForm.tsx` / `ProductsPage.tsx`) để bộ lọc trên site hoạt động đúng.
- Menu **Đơn hàng**: xem/xác nhận trạng thái đơn COD, theo dõi đơn SePay tự động chuyển `paid` khi nhận được webhook.

## 4. Ghi chú kỹ thuật riêng của site này

- Mở rộng bảng `products` ngoài schema chuẩn: `brand` (Sony/Canon/Fujifilm/Nikon — chỉ áp dụng thân máy/ống kính), `gallery` (ảnh phụ trang chi tiết), `bundle_options` (gói phụ kiện), `specs` (thông số kỹ thuật), `review_count`, `sold_count`.
- Sidebar lọc trang Sản phẩm (`san-pham.html` gốc) chỉ có 6 block: Tìm kiếm / Danh mục / Khoảng giá / Màu thân máy / Thương hiệu / Tình trạng — **không có block "Đánh giá"** (khác blueprint 5-block chuẩn của rule 22, giống ngoại lệ đã ghi nhận ở `shop-tui-sach`/`shop-may-tinh`).
- Hero (H10 Geometric Split) là ảnh **tĩnh**, không phải slider crossfade — component `HeroSlider.tsx` vẫn đọc từ bảng `hero_slides` (dùng `heroSlides[0]`) để admin có thể đổi ảnh qua menu "Hero Slides" sẵn có, nhưng phần chữ (tag/tiêu đề/mô tả) đọc từ settings nhóm `hero`.
- Trang "Dịch vụ" (`ServicesPage.tsx`) dùng nội dung tĩnh (const arrays `FEATURES`/`PROCESS`) không quản lý qua admin — theo đúng precedent đã áp dụng ở `shop-may-tinh` (nội dung boilerplate, không có phần nào biến đổi theo mùa/khuyến mãi trong template gốc).
- Trang "Thương hiệu" (`BrandsPage.tsx`) ngược lại có nội dung quản lý qua admin (settings nhóm `brands`, 4 mục) vì đây là catalog thật (tên hãng + ảnh + mô tả) có khả năng thay đổi.

## 5. Tài khoản mặc định

| Vai trò | Email | Mật khẩu |
|---|---|---|
| Super Admin | `sysadmin@admin.com` | `123456` |

**Bắt buộc đổi mật khẩu ngay sau khi deploy production.**
