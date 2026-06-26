# Balance Pilates Studio — Website Deploy

Website hoàn chỉnh cho studio pilates: React SPA + PHP API + SQLite.

## Yêu cầu hosting

- PHP 8.0+ với extension `pdo_sqlite`
- Apache hoặc IIS (kèm `.htaccess` / `web.config`)
- Không cần MySQL, không cần Node.js trên server

## Build & Deploy

### Build (Windows)

```bat
build.bat
```

Output tại `../_output-deploy/pilates-studio/`

### Deploy

Upload toàn bộ nội dung thư mục `_output-deploy/pilates-studio/` lên public_html của hosting.

Lần đầu truy cập trang web, DB SQLite sẽ tự tạo và seed dữ liệu mẫu.

## Tài khoản admin mặc định

| Trường | Giá trị |
|---|---|
| URL | `/admin` |
| Email | `sysadmin@admin.com` |
| Mật khẩu | `123456` |

**Đổi mật khẩu ngay sau khi đăng nhập lần đầu.**

## Cấu trúc sau build

```
_output-deploy/pilates-studio/
├── index.html            ← Website chính (React SPA)
├── assets/               ← CSS, JS bundle
├── admin/
│   ├── index.html        ← Admin panel (React SPA)
│   └── assets/
├── api/                  ← PHP backend
│   ├── index.php
│   ├── config.php        ← Cấu hình DB, APP_KEY
│   ├── .htaccess         ← Bảo vệ .db file
│   └── src/
├── .htaccess             ← SPA routing (Apache)
└── web.config            ← SPA routing (IIS)
```

## Tính năng

### Website công khai (`/`)
- Trang chủ: Hero slider, Giới thiệu, Dịch vụ nổi bật, Đánh giá, Huấn luyện viên
- Trang dịch vụ (`/dich-vu`): Danh sách tất cả lớp học
- Đăng ký lớp (`/dat-lich`): Form đăng ký đầy đủ (họ tên, SĐT, loại lớp, sức khỏe...)
- Liên hệ (`/lien-he`): Form liên hệ + thông tin studio

### Admin panel (`/admin`)
- Dashboard: thống kê đăng ký, liên hệ, lớp học, huấn luyện viên
- Hero Slides: quản lý banner trang chủ
- Dịch vụ & Danh mục: CRUD lớp học theo danh mục
- Đăng ký lớp: xem, lọc trạng thái, cập nhật (mới/đã liên hệ/đã xác nhận/đã hủy)
- Đánh giá: quản lý testimonials có sao và avatar
- Huấn luyện viên: quản lý team với tags chuyên môn
- Liên hệ: xem tin nhắn từ khách
- Media: thư viện ảnh upload
- Cài đặt: general, SEO, mạng xã hội, liên hệ, Cloudinary, Unsplash
- Hồ sơ: đổi tên, đổi mật khẩu

## Customization

### Thay thông tin studio

Đăng nhập admin → **Cài đặt** → tab **Chung**:
- Tên studio, slogan, mô tả
- Số điện thoại, email, địa chỉ, giờ mở cửa

### Thêm lớp học

Admin → **Dịch vụ** → **Thêm lớp học**

### Đổi banner trang chủ

Admin → **Hero Slides** → **Thêm slide**

## Extension schema (SQLite)

Bảng mở rộng cho ngách pilates:
- `service_categories` — danh mục lớp học
- `services` — lớp học (giá, thời lượng, sĩ số, cấp độ)
- `bookings` — đăng ký lớp từ form công khai
- `testimonials` — đánh giá học viên
- `team` — huấn luyện viên
