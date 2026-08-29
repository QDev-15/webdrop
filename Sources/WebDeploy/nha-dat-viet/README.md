# Nhà Đất Việt — Hướng dẫn deploy

Website sàn giao dịch bất động sản TP.HCM: React SPA (website + admin) + PHP API + SQLite.

## 1. Build

```bash
# Windows
build.bat

# Linux/Mac
bash build.sh
```

Kết quả build nằm ở `../_output-deploy/` (cùng cấp thư mục với source), sẵn sàng upload lên hosting.

## 2. Deploy lên hosting

1. Upload **toàn bộ nội dung** trong `_output-deploy/` lên thư mục gốc web (`public_html/` hoặc tương đương) của hosting — giữ nguyên cấu trúc thư mục (`admin/`, `api/`, `index.html`, `.htaccess`, `web.config`...).
2. Mở `api/config.php` trên server, sửa:
   - `APP_URL` → URL thực của website (vd: `https://nhadatviet.vn`), **không có dấu `/` ở cuối**.
3. Yêu cầu hosting hỗ trợ PHP ≥ 8.0 và extension `pdo_sqlite`.
4. Đảm bảo thư mục `api/database/` và `api/uploads/` có quyền ghi (chmod 755 hoặc 775 tùy hosting).

## 3. Kiểm tra sau deploy

Truy cập `https://tenmien.vn/api/health` — phải thấy:
```json
{ "status": "ok", "php": "...", "pdo_sqlite": true, "db_dir": "writable", ... }
```

Nếu `pdo_sqlite: false` → liên hệ hosting bật extension `pdo_sqlite`.
Nếu `db_dir: "not writable"` → chmod thư mục `api/database/`.

## 4. Đăng nhập quản trị

- URL: `https://tenmien.vn/admin`
- Tài khoản mặc định: `sysadmin@admin.com` / `123456`
- **Đổi mật khẩu ngay** sau lần đăng nhập đầu tiên (menu Hồ sơ cá nhân).

## 5. Bảo mật sau deploy

- **Xóa file `api/check-hash.php` khỏi server** sau khi deploy xong — đây là file debug hỗ trợ kiểm tra hash mật khẩu trong lúc cài đặt, không cần thiết khi vận hành thật.
- Không chia sẻ nội dung `api/config.php` (đã bị `.htaccess` chặn truy cập trực tiếp qua trình duyệt, nhưng vẫn nên cẩn trọng).

## 6. Quản lý nội dung qua Admin

Sau khi đăng nhập admin, có thể quản lý:
- **Hero Slides** — 4 slide trang chủ (tiêu đề dùng `*từ*` để tô màu accent, mô tả theo định dạng `nhãn||mô tả`)
- **Tin đăng** — toàn bộ bất động sản (bán/cho thuê), lọc/tìm kiếm/phân trang
- **Môi giới** — đội ngũ tư vấn, gán vào từng tin đăng
- **Dự án phân phối** — các dự án hợp tác phân phối (trang "Dự án")
- **Câu hỏi thường gặp**, **Đánh giá khách hàng**
- **Liên hệ** — danh sách yêu cầu tư vấn/đặt lịch xem nhà gửi từ website
- **Cài đặt** — thông tin chung, SEO, mạng xã hội, số liệu thống kê, ảnh banner, SMTP, Cloudinary, tích hợp Unsplash

## 7. Cấu trúc dữ liệu

- Database SQLite: `api/database/nha-dat-viet.db` — tự động tạo + seed dữ liệu mẫu khi chạy lần đầu.
- Model: `users`, `settings`, `hero_slides`, `contacts`, `media` (core) + `properties`, `agents`, `projects`, `testimonials`, `faqs` (mở rộng riêng cho ngách bất động sản).

## 8. Ghi chú kiến trúc

Đây là mô hình **1 agency quản lý toàn bộ catalog tin đăng qua 1 admin panel duy nhất** (không phải marketplace nhiều tài khoản người bán tự đăng ký). Toàn bộ CRUD tin đăng/môi giới/dự án do quản trị viên (`sysadmin`) thực hiện qua `/admin`.
