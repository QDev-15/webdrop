# shop-ami-mobile — AMI Mobile (Shop điện thoại di động & phụ kiện)

Website deploy hoàn chỉnh: React SPA (frontend + admin) + PHP API + SQLite.
Identity: **RETRO-BOLD**, font Space Grotesk 800, accent Teal `#1f7a6b` + Mustard `#c98a1f`, prefix CSS `mb-`.

## 1. Build

```bash
# Windows
build.bat

# Linux/Mac
bash build.sh
```

Output nằm ở `../_output-deploy/` (cùng cấp với thư mục `shop-ami-mobile/`):

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
   - `APP_URL` → URL thực của website (không có dấu `/` cuối), ví dụ `https://amimobile.vn`.
   - `APP_KEY` đã được `build.mjs` tự sinh ngẫu nhiên — không cần sửa.
3. Kiểm tra `https://domain.vn/api/health` → phải trả về `{"status":"ok","pdo_sqlite":true,"db_dir":"writable",...}`.
   - Nếu `db_dir` không phải `writable` → `chmod 755 api/database/` (và `api/uploads/`) trên hosting Linux.
4. DB SQLite tự tạo + seed dữ liệu mẫu (4 danh mục, 42 sản phẩm, cài đặt mặc định) ngay lần đầu server nhận request — không cần setup thủ công.
5. Đăng nhập admin tại `/admin`:
   - Email: `sysadmin@admin.com`
   - Mật khẩu: `123456`
   - **Đổi mật khẩu ngay** sau khi đăng nhập lần đầu (menu Profile).
6. **Xóa `api/check-hash.php` khỏi server sau khi deploy xong** — đây là file debug hỗ trợ verify hash password trực tiếp trên server, không được để lại trên production.

## 3. Cấu hình bán hàng (Admin → Cài đặt)

- Tab **💳 Thanh toán**: bật/tắt COD và/hoặc SePay (chuyển khoản QR). Nếu bật SePay phải điền đủ ngân hàng + số tài khoản + tên chủ tài khoản + SePay API Access (dùng để verify webhook `POST /api/public/sepay-webhook` — cấu hình URL này trong dashboard SePay).
- Tab **Thông tin chung / Trang chủ / Về chúng tôi / Khuyến mãi / Footer / Liên hệ**: toàn bộ nội dung trang chính (trừ danh mục/sản phẩm — quản lý riêng ở menu Sản phẩm) đều chỉnh được tại đây.
- Menu **Sản phẩm → Danh mục / Sản phẩm**: CRUD đầy đủ. Trường "Màu sắc", "Thương hiệu" và "Hiển thị ở section trang chủ" trong form sản phẩm phải khớp đúng danh sách cố định trong code (`ProductForm.tsx` / `ProductsPage.tsx` / `HomePage.tsx`) để bộ lọc + section trang chủ hoạt động đúng.
- Menu **Đơn hàng**: xem/xác nhận trạng thái đơn COD, theo dõi đơn SePay tự động chuyển `paid` khi nhận được webhook.

## 4. Ghi chú kỹ thuật riêng của site này

- Mở rộng bảng `products` ngoài schema chuẩn: `brand` (apple/samsung/xiaomi/oppo/sony/jbl/anker), `theme` (comma-separated: noi-bat/phu-kien/moi-ve/giam-gia — quyết định sản phẩm xuất hiện ở section nào trên trang chủ + `?theme=` trên trang Sản phẩm), `sold` (số lượng đã bán). `ShopPublicController::products()` được mở rộng thêm filter `brands`/`theme` (comment cho phép mở rộng sẵn có trong file — cùng precedent đã áp dụng ở `shop-may-anh`/`shop-may-tinh`).
- Trang Sản phẩm (`san-pham.html` gốc) dùng **filter toolbar NGANG** (category pill + brand/color dropdown checkbox + price range slider + sort select, áp dụng tức thì không nút Apply) — KHÔNG phải sidebar dọc 5-block chuẩn rule 22, bám đúng cấu trúc thật của template (giống ngoại lệ đã áp dụng ở `shop-tui-sach`/`shop-may-tinh`).
- Trang chủ theo **Mode B (themed-sections)**: 4 section theo chủ đề (Điện thoại nổi bật / Phụ kiện hot / Hàng mới về / Đang giảm giá), 2 section đầu+cuối có tìm kiếm cục bộ + brand quick-filter riêng (không ảnh hưởng URL/trang Sản phẩm).
- Hero (Intro Banner — H5 Bold Typography) **không dùng ảnh** (chỉ chữ lớn + ticker marquee) — bảng `hero_slides` vẫn được seed 1 record để menu admin hoạt động đúng chuẩn scaffold, nhưng toàn bộ nội dung hiển thị (stamp/tiêu đề 3 dòng/mô tả/CTA/ticker) đọc từ settings nhóm `hero`.
- Trang chi tiết sản phẩm: thông số kỹ thuật (5 tab Màn hình/Camera/Hiệu năng/Pin & Sạc/Kết nối & Thiết kế) chỉ hiển thị khi `category_slug === 'dien-thoai'`, dữ liệu suy ra từ tên sản phẩm qua `src/lib/phoneSpecs.ts` (port nguyên vẹn `PHONE_PROFILES` từ template gốc — không lưu DB vì đây là dữ liệu suy diễn theo dòng máy, không phải field nhập tay). Danh mục khác hiển thị bảng thông tin chung đơn giản hơn.
- Khối "Ưu đãi khi mua hàng" trên trang chi tiết là nội dung tĩnh (voucher/quà tặng/trả góp/freeship) theo đúng template gốc.

## 5. Tài khoản mặc định

| Vai trò | Email | Mật khẩu |
|---|---|---|
| Super Admin | `sysadmin@admin.com` | `123456` |

**Bắt buộc đổi mật khẩu ngay sau khi deploy production.**
