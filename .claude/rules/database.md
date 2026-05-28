# Database Rules

## Kiến trúc tổng quan
```
System DB (PostgreSQL — trung tâm)
├── Core Schema       → dùng chung
├── Extension: Agency → nghiệp vụ webdrop.vn
└── → sinh ra Website DB (SQLite — độc lập trên hosting khách)
        ├── Core Schema (copy)
        └── Extension theo ngách
```

## Rules bắt buộc

### Foreign Keys
- SQLite: **bắt buộc** `PRAGMA foreign_keys = ON` trong mọi connection
- PostgreSQL: FK constraint mặc định đã bật — không disable
- PHP xử lý logic nghiệp vụ, DB bảo vệ tính toàn vẹn

### Schema Stability
- Tên bảng và tên cột **không được thay đổi** giữa các phiên bản sản phẩm
- Nếu đổi schema → phải kèm migration script (`migration_YYYYMMDD.sql`)
- Document schema phải đi kèm sản phẩm khi bàn giao

### Extension Rule
- Mỗi ngách chỉ **thêm bảng mới** — không sửa core schema
- Core schema là bất biến: `users`, `posts`, `categories`, `pages`, `media`, `banners`, `contacts`, `settings`

### Security
- File `.db` trong hosting: dùng `.htaccess` chặn truy cập HTTP trực tiếp
- File `config.php` không được nằm trong public directory
- Password: luôn hash (bcrypt) — không lưu plaintext
- SQL: dùng prepared statement — không nối string trực tiếp

## Core Schema Tables

### `users`
```
id, name, email (unique), password (hashed), role (superadmin|user), created_at
```

### `posts`
```
id, title, slug, content, excerpt, thumbnail, category_id,
status (draft|published), featured, meta_title, meta_description,
created_by, created_at, updated_at
```

### `categories`
```
id, name, slug, description, thumbnail, parent_id, created_at
```

### `pages`
```
id, title, slug, content, template, meta_title, meta_description, status, created_at, updated_at
```

### `media`
```
id, filename, filepath, filesize, filetype, alt_text, uploaded_by, created_at
```

### `contacts`
```
id, name, email, phone, subject, message, status (new|read|replied), created_at
```

### `settings` (key-value store)
```
key, value, group
```
Groups: general, seo, social, design, header, footer, contact, smtp, scripts, system

## Extension Schemas theo ngách
- **BĐS**: properties, property_categories, property_images, property_utilities, property_contacts
- **E-commerce**: products, product_categories, orders, order_items, coupons
- **Blog**: tags, post_tags (core posts/categories là đủ)
- **Agency** (System DB): industries, customers, orders, contracts, payments, projects, milestones, revenues, expenses, activity_logs

## Phân quyền
- 2 roles: `superadmin` và `user`
- Kiểm tra role ở PHP backend — không dựa vào client-side
