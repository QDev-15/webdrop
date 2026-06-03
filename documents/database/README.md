# Database Documents — webdrop.vn

**Provider:** Neon PostgreSQL (cloud)  
**ORM:** Prisma 5.x  
**Schema source:** `Sources/system/prisma/schema.prisma`  
**Generated:** 2026-06-03

---

## Danh sách file

| File | Mục đích |
|------|----------|
| `01_schema.sql` | DDL — tạo toàn bộ enum types + tables + indexes |
| `02_seed_data.sql` | Seed data mặc định (admin user, industries, packages, 31 templates, settings, 5 hero slides) |
| `03_reset_and_reseed.sql` | Full reset: drop → recreate schema → reseed (dùng khi migrate môi trường mới) |

---

## Cách dùng

### Deploy môi trường mới (fresh database)

```bash
# Cách 1: Chạy từng bước
psql $DATABASE_URL -f 01_schema.sql
psql $DATABASE_URL -f 02_seed_data.sql

# Cách 2: Reset hoàn toàn + tạo lại (full wipe)
psql $DATABASE_URL -f 03_reset_and_reseed.sql
```

### Prisma migration (cách chính thức của dự án)

```bash
cd Sources/system
npm run db:migrate    # prisma migrate deploy
npm run db:seed       # npx ts-node prisma/seed.ts
```

---

## Thông tin kết nối

**Neon (dev/production):**
```
ep-mute-snow-apw724xb-pooler.c-7.us-east-1.aws.neon.tech
Database: neondb
```

Connection string đầy đủ trong `Sources/system/.env` — file này KHÔNG commit lên repo.

---

## Database Schema Overview

### Core Tables (dùng chung)

| Table | Mô tả |
|-------|-------|
| `users` | Tài khoản admin — role: superadmin / user |
| `posts` | Bài viết / blog |
| `categories` | Danh mục (tự tham chiếu — hỗ trợ nested) |
| `pages` | Trang tĩnh |
| `media` | File upload |
| `banners` | Banner quảng cáo |
| `contacts` | Form liên hệ |
| `settings` | Key-value config (general/seo/social/smtp...) |

### Extension: Agency (webdrop.vn)

| Table | Mô tả |
|-------|-------|
| `industries` | Ngành nghề (agency, spa-beauty, restaurant...) |
| `service_packages` | Gói dịch vụ (GOI_A / GOI_B / GOI_C) |
| `package_industries` | Pivot: gói ↔ ngành |
| `templates` | 31 templates (web + admin) |
| `customers` | Khách hàng |
| `customer_contacts` | Kênh liên hệ của khách (zalo/fb/email) |
| `orders` | Đơn hàng |
| `order_items` | Chi tiết đơn |
| `contracts` | Hợp đồng |
| `payments` | Thanh toán |
| `projects` | Dự án triển khai (goi_b / goi_c) |
| `project_milestones` | Mốc tiến độ dự án |
| `project_notes` | Ghi chú nội bộ |
| `project_files` | File đính kèm dự án |
| `revenues` | Doanh thu |
| `expenses` | Chi phí |
| `hero_slides` | Slide trang chủ (JSON data) |
| `activity_logs` | Audit log hành động admin |

---

## Seed Data Summary

| Table | Số record |
|-------|-----------|
| users | 1 (admin@webdrop.vn) |
| industries | 6 |
| service_packages | 3 (GOI_A / GOI_B / GOI_C) |
| templates | 31 (30 web + 1 admin) |
| settings | 6 (site_name, email, phone, socials) |
| hero_slides | 5 (intro / features / grid / pricing / testimonial) |

### Admin login (development)
- Email: `admin@webdrop.vn`
- Password: `webdrop@2025`

> **Thay password ngay sau khi deploy production!**

---

## Enums

| Enum | Values |
|------|--------|
| `UserRole` | superadmin, user |
| `PostStatus` | draft, published |
| `BannerTarget` | blank, self |
| `ContactStatus` | new, read, replied |
| `TemplateCategory` | web, admin |
| `CustomerStatus` | active, inactive |
| `OrderType` | template, website |
| `OrderStatus` | new, confirmed, in_progress, delivered, completed, cancelled |
| `PaymentMethod` | cash, bank, momo, vnpay |
| `PaymentStatus` | pending, paid, refunded |
| `ProjectType` | goi_b, goi_c |
| `ProjectStatus` | planning, designing, developing, reviewing, delivered, done |
| `MilestoneStatus` | pending, done |
| `SlideType` | intro, features, grid, pricing, testimonial |
