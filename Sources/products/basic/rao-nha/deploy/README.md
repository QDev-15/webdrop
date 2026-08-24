# RaoNhà — Sàn giao dịch bất động sản trực tuyến

Website deploy hoàn chỉnh: **React SPA frontend + React SPA admin + PHP backend + SQLite**, build từ template `Sources/templates/web/Real-Estate/rao-nha/`.

## Kiến trúc quan trọng — 2 hệ thống tài khoản riêng biệt

1. **Admin (`/admin`)** — dùng để quản lý nội dung site (hero slides, tin tức, FAQ, gói tin, testimonials, cài đặt) và **kiểm duyệt tin đăng + duyệt giao dịch nạp tiền**. Đăng nhập bằng `users` table, session riêng tên `RaoNha`.
2. **Tài khoản người đăng tin (website công khai)** — chính chủ / môi giới tự do / công ty môi giới tự đăng ký để đăng tin bất động sản. Lưu ở bảng `accounts` HOÀN TOÀN TÁCH BIỆT khỏi `users`, session riêng tên `RaoNhaAcc`. Một trình duyệt có thể đăng nhập cả 2 cùng lúc mà không xung đột.

## Build & Deploy

```bash
cd Sources/WebDeploy/rao-nha
node build.mjs        # hoặc build.bat (Windows) / build.sh (Linux/Mac)
```

Kết quả build nằm ở `Sources/WebDeploy/_output-deploy/` (cùng cấp thư mục `rao-nha/`).

### Các bước sau khi upload lên hosting

1. Upload toàn bộ nội dung trong `_output-deploy/` lên thư mục `public_html/` (hoặc thư mục gốc web) của hosting.
2. Mở `api/config.php`, sửa `APP_URL` thành URL thực của website (không có dấu `/` ở cuối). `APP_KEY` đã được tự động sinh ngẫu nhiên khi build — không cần sửa.
3. Đảm bảo hosting hỗ trợ PHP 8+ với extension `pdo_sqlite`.
4. Kiểm tra: mở `https://tenmien.vn/api/health` — phải thấy `"status":"ok"`, `"pdo_sqlite":true`, `"db_dir":"writable"`.
5. Phân quyền ghi (CHMOD 755 hoặc 775) cho 2 thư mục: `api/database/` và `api/uploads/` — đây là nơi SQLite tạo file `.db` và lưu ảnh upload.
6. Truy cập `https://tenmien.vn/admin` và đăng nhập:
   - **Email**: `sysadmin@admin.com`
   - **Mật khẩu**: `123456`
   - **⚠️ Đổi mật khẩu ngay sau lần đăng nhập đầu tiên** (menu Hồ sơ cá nhân).
7. **Xóa file `api/check-hash.php` khỏi server sau khi deploy xong** — đây chỉ là công cụ debug hash mật khẩu, không nên để lại trên môi trường production.

### Dữ liệu mẫu (seed) có sẵn sau khi deploy lần đầu

- 14 tài khoản người đăng tin demo (mật khẩu `123456` cho tất cả) với vai trò khác nhau (chính chủ / môi giới tự do / công ty môi giới).
- 44 tin đăng bất động sản (chung cư, nhà phố, đất nền, biệt thự, shophouse, căn hộ dịch vụ) tại Hà Nội, TP.HCM, Đà Nẵng — đã duyệt (`approved`), phân bổ theo đúng công thức tier VIP như bản template gốc.
- 4 gói tin (Tin thường/VIP Bạc/VIP Vàng/VIP Kim Cương), 8 FAQ, 8 bài viết tin tức, 7 đánh giá người dùng.
- 4 hero slide carousel trang chủ.

## Cấu hình thanh toán (nạp credit vào ví)

Vào **Admin → Cài đặt → 💳 Thanh toán**:

- **Chuyển khoản thủ công** (mặc định bật): người dùng gửi yêu cầu nạp credit → admin vào **Ví & giao dịch** để xác nhận thủ công sau khi nhận được tiền thật.
- **SePay (tự động qua webhook)** (mặc định tắt): bật cờ `payment_sepay_enabled`, điền đầy đủ thông tin ngân hàng + `sepay_webhook_secret`, rồi cấu hình SePay gọi:
  ```
  POST https://tenmien.vn/api/public/sepay-webhook
  Header: Authorization: Apikey <sepay_webhook_secret>
  ```
  Nếu không dùng SePay, chỉ cần giữ phương thức chuyển khoản thủ công là đủ vận hành.

## Cấu trúc thư mục

```
_output-deploy/
├── index.html, assets/         ← website công khai (React SPA)
├── web.config, .htaccess       ← SPA routing (Apache/IIS)
├── admin/                      ← admin panel (React SPA)
└── api/
    ├── config.php              ← cấu hình (APP_URL, DB, upload, SMTP...)
    ├── schema.sql               ← core tables + extension tables (accounts, listings...)
    ├── database/rao-nha.db      ← tự tạo khi request đầu tiên chạy
    ├── uploads/                 ← ảnh upload local (nếu không dùng Cloudinary)
    └── src/                    ← Router, Auth (admin), AccountAuth (người đăng tin), controllers
```

## Module quản lý trong Admin

| Menu | Chức năng |
|---|---|
| Dashboard | Thống kê tin chờ duyệt, tài khoản, giao dịch chờ xử lý, liên hệ mới |
| Hero Slides | Carousel 4 slide trang chủ |
| Tin đăng | Duyệt / từ chối / xóa tin đăng bất động sản |
| Gói tin VIP | Chỉnh giá, thời hạn, quyền lợi 4 gói tin |
| Tài khoản đăng tin | Xem danh sách, khóa/mở tài khoản người đăng tin |
| Ví & giao dịch | Duyệt yêu cầu nạp credit qua chuyển khoản thủ công |
| Tin tức | CRUD bài viết kiến thức bất động sản |
| Đánh giá | CRUD testimonials hiển thị trang chủ / giới thiệu |
| Câu hỏi thường gặp | CRUD FAQ trang chủ |
| Liên hệ | Quản lý tin nhắn liên hệ từ khách |
| Thư viện ảnh | Media library dùng chung |
| Cài đặt | Thông tin chung, SEO, mạng xã hội, footer, liên hệ, thống kê, thanh toán, SMTP, Cloudinary, tích hợp |

## Ghi chú kỹ thuật

- Database: SQLite, tự động migrate + seed dữ liệu mẫu khi chạy lần đầu (`api/src/Database.php`).
- 2 session riêng biệt hoàn toàn: `Auth.php` (admin, session `RaoNha`) và `AccountAuth.php` (người đăng tin, session `RaoNhaAcc`). Không session nào truy cập được tài nguyên của session còn lại.
- Mọi thao tác sửa/xóa tin đăng của người dùng công khai đều kiểm tra `account_id` khớp session trước khi thực hiện — một tài khoản không thể sửa/xóa tin của tài khoản khác.
- `/public/settings` lọc bỏ toàn bộ nhóm `smtp`, `cloudinary`, `integrations`, `payment` — không lộ `sepay_webhook_secret` hay bất kỳ khóa bí mật nào qua endpoint public.
- Mật khẩu (cả admin `users` và tài khoản đăng tin `accounts`) đều hash bằng `password_hash()` (bcrypt) — không lưu plaintext.
