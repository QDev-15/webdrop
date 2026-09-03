# Mộc Vang — shop-ruou-vang (Website Deploy)

Website bán rượu vang nhập khẩu (React SPA + React Admin SPA + PHP API + SQLite).

## Cấu trúc

```
shop-ruou-vang/
├── website/    React SPA — trang chủ, sản phẩm, giỏ hàng, thanh toán...
├── admin/      React SPA — quản trị nội dung/đơn hàng
├── api/        PHP + SQLite backend
└── build.mjs   Script build → _output-deploy/ (nằm cạnh thư mục này)
```

## Build

Windows:
```
build.bat
```
Linux/Mac:
```
bash build.sh
```

Kết quả build nằm ở `../_output-deploy/` (cùng cấp với thư mục `shop-ruou-vang/`).

## Hướng dẫn deploy lên hosting

1. Upload toàn bộ nội dung thư mục `_output-deploy/` lên thư mục gốc hosting (qua FTP/File Manager).
2. Mở `api/config.php` trên server, sửa `APP_URL` thành domain thật (không có dấu `/` cuối), ví dụ:
   ```php
   define('APP_URL', 'https://mocvang.vn');
   ```
3. Kiểm tra hosting hỗ trợ PHP ≥ 8.0 và extension `pdo_sqlite` đã bật.
4. Kiểm tra hệ thống hoạt động: truy cập `https://tenmien.vn/api/health` — phải thấy:
   ```json
   { "status": "ok", "pdo_sqlite": true, "db_dir": "writable", "schema_sql": "found" }
   ```
5. Đảm bảo các thư mục sau có quyền ghi (chmod 755 hoặc 775 tùy hosting):
   - `api/database/`
   - `api/uploads/`
6. Đăng nhập trang quản trị tại `https://tenmien.vn/admin`:
   - Email: `sysadmin@admin.com`
   - Mật khẩu: `123456`
   - **Đổi mật khẩu ngay sau khi đăng nhập lần đầu** (menu Hồ sơ).
7. **Xóa file `api/check-hash.php` khỏi server ngay sau khi deploy xong** — đây là file debug hỗ trợ kiểm tra hash mật khẩu, không nên để lại trên môi trường production.
8. Vào **Cài đặt → 💳 Thanh toán** để bật/cấu hình:
   - COD (thanh toán khi nhận hàng) — bật sẵn mặc định.
   - SePay (chuyển khoản QR) — cần điền SePay API Access hoặc điền tay số tài khoản ngân hàng nhận tiền, đồng thời điền **SePay API Access** vào đúng ô "SePay API Access" (đây cũng chính là secret dùng để xác thực webhook).
9. Vào **Cài đặt → Thông tin chung** để cập nhật tên cửa hàng, số điện thoại, địa chỉ, giờ mở cửa, số Zalo, bản đồ Google Maps, số giấy phép kinh doanh rượu, và ngày kết thúc chương trình khuyến mãi (đếm ngược ở trang Khuyến mãi).

## Tài khoản mặc định

| Vai trò | Email | Mật khẩu |
|---|---|---|
| Super Admin | sysadmin@admin.com | 123456 |

## Ghi chú kỹ thuật

- Database SQLite tại `api/database/shop-ruou-vang.db` — tự động khởi tạo + seed dữ liệu mẫu (5 danh mục, 48 sản phẩm rượu vang, 3 đánh giá khách hàng, 3 mã khuyến mãi) khi chạy lần đầu.
- Trang chủ (`/`) hiển thị toàn bộ catalog sản phẩm (không có trang `/san-pham` riêng — đúng thiết kế gốc của template).
- Trang thanh toán (`/thanh-toan`) hỗ trợ 2 phương thức: COD và chuyển khoản SePay (VietQR).
- Sitemap động tại `/api/sitemap.xml`.
