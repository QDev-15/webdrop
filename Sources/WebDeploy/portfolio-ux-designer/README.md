# Đỗ Khánh Linh — Website Deploy (portfolio-ux-designer)

Website portfolio Product Designer / UX Designer — React SPA (frontend + admin) + PHP API + SQLite.

## 1. Build

```bash
cd Sources/WebDeploy/portfolio-ux-designer
# Windows
build.bat
# Linux/Mac
bash build.sh
```

Build script sẽ:
- Cài `npm install` cho `website/` và `admin/` (nếu chưa có `node_modules`)
- Build cả 2 React app (`vite build`)
- Gộp tất cả vào thư mục `_output-deploy/` (nằm cạnh thư mục source, tức `Sources/WebDeploy/_output-deploy/`)
- Tự sinh `APP_KEY` ngẫu nhiên, ghi vào `api/config.php`
- Tự copy `.htaccess` + `web.config` (SPA routing) từ `website/public/` vào deploy root

## 2. Deploy lên hosting

1. Upload **toàn bộ nội dung** trong `_output-deploy/` lên thư mục gốc web (`public_html/` hoặc tương đương) của hosting — hosting cần hỗ trợ PHP 8+ và extension `pdo_sqlite`.
2. Mở `api/config.php` trên server, sửa `APP_URL` thành domain thật của bạn, ví dụ:
   ```php
   define('APP_URL', 'https://khanhlinh.design');
   ```
3. Cấp quyền ghi (chmod 755 hoặc 775) cho 2 thư mục:
   - `api/database/` — nơi SQLite tạo file `.db`
   - `api/uploads/` — nơi lưu ảnh upload từ admin
4. Kiểm tra hệ thống hoạt động: mở `https://tenmien.vn/api/health` — phải thấy:
   ```json
   { "status": "ok", "pdo_sqlite": true, "db_dir": "writable", "db_exists": true, "schema_sql": "found" }
   ```
   Nếu `db_dir` báo `not writable` → chmod lại thư mục `api/database/`.
5. Truy cập trang quản trị: `https://tenmien.vn/admin`

## 3. Tài khoản quản trị mặc định

```
Email:    sysadmin@admin.com
Mật khẩu: 123456
```

**Đổi mật khẩu ngay sau khi đăng nhập lần đầu** — vào menu 👤 (góc dưới sidebar) → Đổi mật khẩu.

## 4. Cấu trúc quản trị (Admin)

| Menu | Chức năng |
|---|---|
| Dashboard | Thống kê tổng quan |
| Hero Slides | Carousel 4 ảnh trang chủ (H2 Split 45/55) — mỗi slide có nhãn nhỏ, tiêu đề (dùng `*từ*` để in nghiêng gradient), mô tả, nút chính, ảnh |
| Dự án (Case Study) | Danh sách dự án UX/UI — mỗi dự án có thể bật thêm phần Case Study đầy đủ (overview bar, bối cảnh/thách thức, giải pháp 4 bước, gallery, kết quả, đánh giá) để có trang chi tiết riêng |
| Đánh giá | Nhận xét khách hàng — hiển thị ở trang chủ (3 thẻ teaser), trang Về tôi (hscroll đầy đủ) |
| Bảng giá | 3 gói dịch vụ (UX Audit / Full Product Design / Design System) |
| FAQ | Câu hỏi thường gặp — hiển thị ở trang Dịch vụ |
| Hành trình | Các mốc thời gian trong sự nghiệp — hiển thị ở trang Về tôi |
| Liên hệ | Danh sách yêu cầu tư vấn gửi từ form Liên hệ |
| Thư viện ảnh | Media Library — upload/quản lý ảnh độc lập |
| Cài đặt | Thông tin chung, SEO, Mạng xã hội, Footer, Liên hệ, **Nội dung trang** (toàn bộ text tĩnh từng trang), Pháp lý, SMTP, Cloudinary, Tích hợp (Unsplash) |

## 5. Lưu ý bảo mật

- **Xóa file `api/check-hash.php` khỏi server ngay sau khi deploy xong** — đây là file debug hỗ trợ kiểm tra hash mật khẩu trong lúc cài đặt, không được để lại trên môi trường production.
- File `.db` trong `api/database/` đã được `.htaccess`/`web.config` chặn truy cập trực tiếp qua trình duyệt — không cần thao tác thêm.

## 6. Công nghệ sử dụng

- Frontend + Admin: React 18 + TypeScript + Vite + React Router
- Backend: PHP 8 thuần (không framework), kiến trúc Router/Controller đơn giản
- Database: SQLite (file `.db`, tự động migrate + seed dữ liệu mẫu lần chạy đầu)
- Font: Plus Jakarta Sans (heading + body), qua Bunny Fonts

## 7. Hỗ trợ

Nếu gặp lỗi 500 hoặc trắng trang sau khi deploy, kiểm tra theo thứ tự:
1. `https://tenmien.vn/api/health` — xác nhận `pdo_sqlite: true` và `db_dir: writable`
2. Log PHP lỗi trên hosting (thường ở `error_log` cùng thư mục hoặc trong cPanel)
3. Đảm bảo đã sửa đúng `APP_URL` trong `api/config.php` (không có dấu `/` ở cuối)
