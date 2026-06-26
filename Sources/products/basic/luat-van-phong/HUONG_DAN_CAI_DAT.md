# Hướng dẫn cài đặt — Văn Phòng Luật Sư

## Yêu cầu hệ thống

- PHP 8.0 trở lên (khuyến nghị PHP 8.2)
- Extension PHP: `pdo_sqlite`, `fileinfo`, `json`
- Apache (dùng `.htaccess`) hoặc IIS/Nginx
- Node.js 18+ (chỉ cần để build, không cần trên hosting)

---

## Bước 1: Build

### Windows
```
Double-click file build.bat
```

### Linux / Mac
```bash
chmod +x build.sh && ./build.sh
```

Output sẽ được tạo trong thư mục `deploy/`.

---

## Bước 2: Cấu hình

Mở file `deploy/api/config.php` và chỉnh các thông tin:

```php
// URL website của bạn
define('APP_URL', 'https://ten-domain.vn');

// Khóa bảo mật (đặt chuỗi ngẫu nhiên 32 ký tự)
define('APP_KEY', 'chuoi-ngau-nhien-32-ky-tu-tai-day');

// Email liên hệ (tùy chọn)
define('SMTP_USER', 'email@gmail.com');
define('SMTP_PASS', 'app-password');
```

**Mặc định dùng SQLite** — không cần cài thêm database.

---

## Bước 3: Deploy lên hosting

### Apache / cPanel / Linux hosting
1. Upload toàn bộ nội dung trong `deploy/` lên thư mục `public_html/`
2. Đảm bảo `.htaccess` được upload (file ẩn)
3. Phân quyền thư mục: `chmod 755 api/database/ api/uploads/`

### IIS / Windows hosting (PA Vietnam, GNET, v.v.)
1. Upload toàn bộ nội dung trong `deploy/` lên `public_html/` hoặc `wwwroot/`
2. File `web.config` đã được cấu hình sẵn cho IIS
3. Đảm bảo PHP FastCGI được bật trong Plesk/cPanel

---

## Bước 4: Kiểm tra

Sau khi upload, truy cập:
- **Website**: `https://ten-domain.vn`
- **Admin**: `https://ten-domain.vn/admin`

### Đăng nhập admin mặc định
| Email | Mật khẩu |
|---|---|
| `admin@luatvanphong.vn` | `Admin@123` |

**Quan trọng**: Đổi mật khẩu ngay sau khi đăng nhập lần đầu!

---

## Cấu trúc thư mục deploy

```
deploy/
├── index.html              ← Website React (trang chủ)
├── assets/                 ← CSS, JS, fonts của website
├── .htaccess               ← Routing Apache + bảo mật
├── web.config              ← Routing IIS
├── admin/                  ← Admin panel
│   ├── index.html
│   └── assets/
└── api/                    ← PHP Backend
    ├── index.php           ← Entry point
    ├── config.php          ← CẦN CHỈNH SỬA
    ├── schema.sql          ← Cấu trúc database
    ├── .htaccess           ← Bảo vệ database
    ├── database/           ← SQLite database (tự tạo)
    ├── uploads/            ← File upload từ admin
    └── src/                ← Source code PHP
```

---

## URL và Routes

| URL | Nội dung |
|---|---|
| `/` | Trang chủ |
| `/dich-vu` | Lĩnh vực hành nghề |
| `/luat-su` | Đội ngũ luật sư |
| `/du-an` | Vụ việc tiêu biểu |
| `/lien-he` | Liên hệ & Tư vấn |
| `/admin` | Admin panel |
| `/api/*` | PHP API endpoints |

---

## Admin — Quản lý nội dung

### Menu admin (tương ứng với trang web)

| Menu Admin | Quản lý |
|---|---|
| Hero Slides | Slide trang chủ |
| Lĩnh vực hành nghề | 6 lĩnh vực pháp lý + danh sách dịch vụ |
| Đội ngũ luật sư | Thông tin, ảnh, chuyên môn từng luật sư |
| Vụ việc tiêu biểu | Các case study với kết quả |
| Đánh giá thân chủ | Testimonials / quotes |
| Đăng ký tư vấn | Form đăng ký từ trang web |
| Liên hệ | Form liên hệ |
| Media | Upload và quản lý hình ảnh |
| Cài đặt | Tên VP, địa chỉ, điện thoại, SEO, social, SMTP |

### Đổi thông tin văn phòng
Admin > Cài đặt > Thông tin chung:
- Tên văn phòng luật
- Địa chỉ, điện thoại, email
- Giờ làm việc
- Năm thành lập

### Đổi nội dung Hero trang chủ
Admin > Cài đặt > Trang chủ / Hero:
- Kicker text, heading, sub text
- Hình ảnh hero
- Số liệu thống kê (vụ việc, năm, luật sư, tỷ lệ)

---

## Xử lý sự cố

### Lỗi 500 Internal Server Error
- Kiểm tra PHP version (cần 8.0+)
- Kiểm tra extension `pdo_sqlite` đã bật chưa
- Xem error log của hosting

### Trang trắng hoặc 404
- Kiểm tra `.htaccess` đã được upload (file ẩn)
- Với IIS: kiểm tra `web.config`
- Bật mod_rewrite trên Apache

### Không upload được ảnh
- Kiểm tra quyền thư mục `api/uploads/` (chmod 755 hoặc 777)
- Kiểm tra `upload_max_filesize` trong php.ini (tối thiểu 10M)

### Database lỗi
- Kiểm tra quyền thư mục `api/database/` (chmod 755)
- Kiểm tra extension `pdo_sqlite` đã bật

---

## Bảo mật

- File `.db` được chặn truy cập từ web qua `.htaccess`
- Tất cả input đều dùng prepared statement
- Session-based authentication
- CORS chỉ cho phép domain được cấu hình

---

## Cập nhật nội dung

Mọi nội dung trên website đều có thể cập nhật qua Admin:
- Không cần sửa code
- Thay đổi có hiệu lực ngay lập tức
- Database SQLite lưu tất cả

---

*Văn Phòng Luật Sư — Deploy Package v1.0*
*Được tạo bởi webdrop.store*
