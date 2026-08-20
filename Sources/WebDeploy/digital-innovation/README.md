# Digital Innovation — Website Deploy

Website công ty công nghệ (React SPA + PHP API + SQLite) — sẵn sàng deploy lên hosting hỗ trợ PHP + `pdo_sqlite`.

## Cấu trúc sau khi build

```
_output-deploy/
├── index.html, assets/     ← Website công khai (React SPA)
├── admin/                  ← Trang quản trị (React SPA) — truy cập tại /admin
├── api/                    ← Backend PHP + SQLite
├── .htaccess, web.config   ← Rewrite URL cho SPA routing (Apache / IIS)
└── favicon.ico
```

## Hướng dẫn deploy

1. **Build** (nếu chưa build): chạy `build.bat` (Windows) hoặc `bash build.sh` (Linux/Mac) trong thư mục source. Kết quả nằm ở `../_output-deploy/` (cùng cấp thư mục source).
2. **Upload** toàn bộ nội dung trong `_output-deploy/` lên thư mục gốc web (`public_html/` hoặc tương đương) của hosting.
3. Mở `api/config.php` trên server và sửa `APP_URL` thành URL thực của website (không có dấu `/` ở cuối). `APP_KEY` đã được tự động sinh ngẫu nhiên khi build — không cần sửa.
4. Đảm bảo hosting bật extension `pdo_sqlite` (hầu hết hosting PHP đều có sẵn).
5. Cấp quyền ghi (chmod 755 hoặc 775) cho 2 thư mục: `api/database/` và `api/uploads/`.
6. Kiểm tra hệ thống hoạt động: mở `https://yourdomain.com/api/health` — kỳ vọng JSON `{"status":"ok","pdo_sqlite":true,"db_dir":"writable",...}`.
7. Truy cập `https://yourdomain.com/admin` để đăng nhập quản trị.
8. **⚠️ Xóa file `api/check-hash.php` khỏi server ngay sau khi deploy xong** — đây là file debug hỗ trợ kiểm tra hash mật khẩu trực tiếp trên server, không được để lại trên production.

## Tài khoản quản trị mặc định

```
Email:    sysadmin@admin.com
Mật khẩu: 123456
```

**Bắt buộc đổi mật khẩu ngay sau lần đăng nhập đầu tiên** — vào menu *Hồ sơ* (góc dưới sidebar) để đổi.

## Nội dung quản lý được qua Admin

| Menu | Mô tả |
|---|---|
| Hero Slides | 4 slide carousel toàn màn hình ở trang chủ (tiêu đề, mô tả, ảnh, nút CTA) |
| Dịch vụ | Danh sách giải pháp công nghệ — hiển thị ở cả trang chủ và trang Dịch vụ |
| Liên hệ | Tin nhắn khách gửi từ form Liên hệ |
| Thư viện ảnh | Quản lý ảnh đã upload |
| Cài đặt | Thông tin chung, SEO, mạng xã hội, Footer, Liên hệ (bản đồ), Thống kê trang chủ, Nội dung từng trang (hero/CTA), Pháp lý (chính sách bảo mật/điều khoản), SMTP, Nâng cao, Cloudinary, Tích hợp (Unsplash) |

## Ghi chú kỹ thuật

- Database: SQLite, file tại `api/database/digital-innovation.db` — tự động tạo + seed dữ liệu mẫu trong lần chạy đầu tiên.
- Ảnh mặc định dùng link Unsplash — có thể thay bằng ảnh thật qua Admin (ImageField hỗ trợ upload trực tiếp hoặc tìm ảnh Unsplash).
- Toàn bộ API chỉ dùng `GET`/`POST` (tương thích shared hosting Windows/IIS chặn PUT/DELETE).
