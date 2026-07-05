# Nha Khoa Implant Future — Website Deploy

Identity: **DARK-ENERGY** — Full dark background (`#0a0710`), neon magenta/violet accent, Syne font 800.

## Cấu trúc

```
nha-khoa-implant-future/
├── website/          React SPA public
├── admin/            React SPA admin panel
├── api/              PHP backend + SQLite
├── build.bat         Build script Windows
├── build.sh          Build script Linux/Mac
└── build.mjs         Build orchestrator
```

## Build

```bash
# Windows
build.bat

# Linux / Mac
bash build.sh
```

Output: thư mục `../_output-deploy/nha-khoa-implant-future/` với cấu trúc:
- `index.html` + `assets/` — public website
- `admin/` — admin panel
- `api/` — PHP backend
- `.htaccess` + `web.config` — SPA routing

## Deploy lên hosting

1. Upload toàn bộ nội dung thư mục output lên hosting PHP
2. Hosting yêu cầu: PHP 8.0+, extension `pdo_sqlite`
3. Truy cập website: `https://domain.com/`
4. Truy cập admin: `https://domain.com/admin`
5. Đăng nhập: `sysadmin` / `123456` (đổi mật khẩu sau khi login)

## Thông tin kỹ thuật

- **CSS prefix**: `ft-`
- **Session name**: `nha_khoa_implant_future_sess`
- **DB**: SQLite tự seed lần đầu
- **Trang website**: `/`, `/dich-vu-implant`, `/cong-nghe-3d`, `/bac-si`, `/dat-lich`, `/lien-he`
- **Extension tables**: services, doctors, bookings, testimonials

## Tính năng admin

| Module | Tính năng |
|--------|-----------|
| Dashboard | Thống kê tổng quan |
| Hero Slides | Quản lý banner trang chủ |
| Dịch vụ Implant | CRUD đầy đủ, ảnh, giá, tính năng |
| Bác sĩ | CRUD, ảnh, chuyên môn, kinh nghiệm |
| Đặt lịch | Xem + cập nhật trạng thái |
| Đánh giá | CRUD đánh giá khách hàng |
| Liên hệ | Xem tin nhắn từ form liên hệ |
| Thư viện ảnh | Upload ảnh (local/Cloudinary/Unsplash) |
| Cài đặt | Thông tin chung, SEO, mạng xã hội, hero stats |

## Seed data mặc định

- 6 dịch vụ Implant (1 răng, All-on-4, All-on-6, Ghép xương, Implant tức thì, Mão sứ)
- 4 bác sĩ chuyên khoa
- 4 đánh giá khách hàng
- 35 settings keys (thông tin, SEO, social, stats)
