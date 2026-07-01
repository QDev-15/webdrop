# Bella Spa — Website hoàn chỉnh (Gói B)

Website demo: Bella Spa & Làm đẹp cao cấp  
Công nghệ: React (Vite + TypeScript) + PHP + SQLite

---

## Cài đặt nhanh

### Yêu cầu hosting

- PHP 7.4+ với extension: `pdo_sqlite`, `json`, `mbstring`, `openssl`
- Tắt `display_errors` trên production

### Các bước deploy

1. **Build** (Windows):
   ```
   build.bat
   ```
   Hoặc Linux/Mac:
   ```
   bash build.sh
   ```
   Output sẽ nằm tại `../_output-deploy/spa-beauty/`

2. **Upload** toàn bộ thư mục `_output-deploy/spa-beauty/` lên hosting

3. **Trỏ domain** về thư mục vừa upload

4. **Khởi động**: Truy cập website lần đầu → PHP tự động tạo database + seed dữ liệu mẫu

---

## Tài khoản admin mặc định

| Trường | Giá trị |
|--------|---------|
| URL admin | `/admin` |
| Email | `sysadmin@admin.com` |
| Mật khẩu | `123456` |

**Đổi mật khẩu ngay sau khi deploy!** (Trang `/admin` → menu tài khoản → Hồ sơ)

---

## Cấu trúc sau build

```
_output-deploy/spa-beauty/
├── index.html          # Frontend SPA (React)
├── assets/             # JS/CSS đã bundle
├── favicon.ico
├── .htaccess           # SPA routing (Apache)
├── web.config          # SPA routing (IIS)
├── admin/
│   ├── index.html      # Admin SPA (React)
│   └── assets/
└── api/
    ├── index.php       # Entry point API
    ├── config.php      # Cấu hình (database, session...)
    ├── schema.sql      # SQLite schema
    ├── data/           # Database files (.db)
    └── src/            # PHP classes + controllers
```

---

## Quản lý nội dung (Admin Panel)

| Module | URL | Mô tả |
|--------|-----|-------|
| Dashboard | `/admin/` | Thống kê tổng quan |
| Hero Slides | `/admin/slides` | Ảnh slide trang chủ |
| Danh mục dịch vụ | `/admin/service-categories` | Nhóm dịch vụ (Massage, Skincare...) |
| Dịch vụ | `/admin/services` | CRUD dịch vụ, ảnh, giá, thời gian |
| Lịch hẹn | `/admin/bookings` | Quản lý đặt lịch, cập nhật trạng thái |
| Đánh giá | `/admin/testimonials` | Review khách hàng |
| Đội ngũ | `/admin/team` | Hồ sơ chuyên viên |
| Liên hệ | `/admin/contacts` | Tin nhắn từ khách |
| Media | `/admin/media` | Quản lý ảnh đã upload |
| Cài đặt | `/admin/settings` | Nội dung trang, SEO, mạng xã hội... |
| Tài khoản | `/admin/profile` | Đổi tên, mật khẩu |
| Users | `/admin/users` | Quản lý tài khoản (superadmin) |

---

## Dữ liệu mẫu (seed)

- **4 danh mục dịch vụ**: Massage 💆, Chăm sóc da ✨, Body Treatment 🌿, Nail & Lashes 💅
- **10 dịch vụ** với giá và thời gian thực
- **4 chuyên viên** có hồ sơ đầy đủ
- **3 đánh giá** từ khách hàng
- **Cài đặt website** đầy đủ: tên, địa chỉ, giờ mở cửa, SEO...

---

## Tùy chỉnh

### Đổi tên thương hiệu
Admin → Cài đặt → tab "Chung" → đổi `Tên website`

### Đổi màu chủ đạo
Chỉnh `--accent` trong `website/src/styles/template.css` trước khi build

### Tích hợp Cloudinary (upload ảnh)
Admin → Cài đặt → tab "☁️ Cloudinary" → nhập Cloud Name, API Key, API Secret

### Tích hợp Unsplash (tìm ảnh)
Admin → Cài đặt → tab "🔌 Tích hợp" → nhập Unsplash Access Key

---

## Công nghệ sử dụng

| Layer | Công nghệ |
|-------|-----------|
| Frontend | React 18 + Vite + TypeScript |
| Styling | Custom CSS (sb- prefix) + Bootstrap 5.3.3 |
| Font | DM Sans (Bunny Fonts) |
| Admin | React + React Router |
| API | PHP 7.4+ (thuần, không framework) |
| Database | SQLite (PDO) |
| Build | Node.js + Vite |

---

## Ghi chú kỹ thuật

- Database tự seed khi PHP nhận request đầu tiên (không cần setup thủ công)
- Chỉ dùng HTTP GET và POST — tương thích IIS/WebDAV shared hosting
- File `.db` được bảo vệ bởi `.htaccess` (không thể truy cập qua HTTP)
- Session name: `SpaBeauty` (alphanumeric, không gây xung đột)
- Ảnh upload lưu vào `api/data/uploads/`
