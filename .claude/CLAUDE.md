# 📋 PROJECT OVERVIEW — Template & Website Business

> File này lưu toàn bộ ý tưởng, yêu cầu, giá bán và tiến độ xây dựng dự án.
> Cập nhật liên tục theo từng giai đoạn phát triển.

## Quy tắc bắt buộc

1. Mỗi khi thay đổi code phải review fix bug thành vòng lặp đến khi hết bug.
2. Update file [CLAUDE.md](./CLAUDE.md) mỗi khi có thay đổi code.
3. Mỗi khi thêm một chức năng hay thay đổi flow thì review fix bug rồi review fix lại cho đến khi hết bug.
4. **Sau mỗi lần thay đổi code, bắt buộc gọi agent `reviewer` để review code, sau đó gọi agent `qa-tester` để test UI/design system — fix hết issue trước khi commit.**

---

## 🛠️ TOOLING & AGENTS

### Agents (`.claude/agents/`)
| Agent | Dùng khi | Tools |
|---|---|---|
| `qa-tester` | Kiểm tra HTML sau khi viết/sửa — design system, Bootstrap, responsive | Read, Glob, Grep, Bash |
| `reviewer` | Review code trước khi ship — bug, security, logic | Read, Glob, Grep, Bash |
| `research` | Tra cứu kỹ thuật, tài liệu, so sánh giải pháp | Read, Glob, Grep, WebFetch, Bash |
| `teacher` | Học Next.js/React qua code thực tế — files, routing, data flow, TypeScript, Prisma | Read, Glob, Grep, WebFetch |

### Project Settings (`.claude/settings.json`)

**PermissionRequest hook** — auto-allow permission dialogs:
- Mặc định: tắt (hỏi bình thường)
- Bật: `touch ~/.claude/auto-allow-enabled` → tất cả permission tự động Allow
- Tắt: `rm ~/.claude/auto-allow-enabled`

**Stop hook** — thông báo khi Claude hoàn thành task:
- Phát tiếng ting ting + WPF popup "Webdrop Claude đã hoàn thành tác vụ"
- Script: `C:\Users\QuynhNH\.claude\hooks\stop-notify.ps1`

### Lệnh `/fetch claude`
Sync CLAUDE.md từ GitHub về context hiện tại:
```
/fetch claude
```

---

## 🎯 MỤC TIÊU DỰ ÁN

Xây dựng và bán 2 nhóm sản phẩm chính:
1. **Template** — HTML/CSS thuần dùng Bootstrap, không build system
2. **Website hoàn chỉnh** — React SPA + PHP API + SQLite, deploy lên hosting là chạy luôn

---

## 🎨 DESIGN SYSTEM — webdrop.vn

> Áp dụng nhất quán cho tất cả các trang: index, checkout, template detail, admin dashboard.
> **Bootstrap version**: 5.3.3 (CDN: `https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css`)

### Typography
- **Font chính**: `DM Sans` (Google Fonts) — weights: 300, 400, 500, 600; italic 400
- `font-family: 'DM Sans', sans-serif` — set qua CSS var `--sans`
- Không dùng font hệ thống hay font khác

### Color Palette (CSS Custom Properties)
```css
:root {
  --bg: #faf9f7;          /* Nền tổng thể — warm off-white */
  --surface: #fff;         /* Nền card, panel, nav */
  --dark: #0c0b09;         /* Nền tối (footer) */
  --dark2: #141210;        /* Nền tối section (why us, hero) */
  --sidebar: #111009;      /* Nền sidebar admin */
  --border: #e8e5df;       /* Border mặc định */
  --border-light: #f0ede8; /* Border nhẹ (dividers) */
  --text: #1a1917;         /* Text chính */
  --text-2: #6b6760;       /* Text phụ */
  --text-3: #a09d97;       /* Text mờ, placeholder */
  --accent: #1a6b52;       /* Green accent chính — CTA, link, active */
  --accent-h: #155a44;     /* Hover của accent */
  --accent-light: #e8f4ef; /* Nền nhạt của accent */
  --accent-mid: #2d9b73;   /* Accent trung gian */
  --warm: #f5f0e8;         /* Warm off-white (backgrounds nhẹ) */
  --warm2: #ede8df;        /* Warm đậm hơn */
  --danger: #e24b4a;       /* Màu lỗi/validation */
}
```

**Màu bổ sung dùng inline (không qua CSS var):**
- `#4ade80` — bright green, dùng trên nền tối (logo dot, hero badge, sidebar active)
- `#f59e0b` — amber/yellow, dùng cho sao đánh giá (★★★★★)
- `#dc2626` — red, dùng cho trạng thái khẩn cấp, lỗi
- `#d97706` — amber, trạng thái chờ, cảnh báo
- `#0068FF` — Zalo blue (nút float Zalo)

### Layout & Spacing
- **Max width trang**: `1100px` (index, detail) | `960px` (checkout) — class `.wd-container`
- **Padding ngang**: `clamp(20px, 5vw, 80px)` — co giãn theo viewport
- **Section padding**: `clamp(72px, 10vw, 128px) 0` — class `.sec-pad`
- **Bootstrap container**: Không dùng `.container` mặc định, dùng custom `.wd-container`
- **Grid**: Bootstrap `row` + `col-*` cho tất cả multi-column layout

### Border Radius
- Card lớn: `14–16px`
- Card nhỏ: `10–12px`
- Button: `8–10px`
- Input: `8px`
- Badge/pill: `5–20px` (tùy loại)
- Avatar: `50%`

### Shadows
- Card hover: `0 20px 52px rgba(0,0,0,.1)`
- Card nhỏ hover: `0 10px 32px rgba(0,0,0,.07)`
- Pricing hover: `0 14px 44px rgba(0,0,0,.08)`

### Buttons
| Tên | Style |
|---|---|
| CTA chính (accent) | bg `--accent`, color `#fff`, radius `9px`, hover bg `--accent-h` |
| Ghost | transparent, border `--border`, color `--text-2`, hover bg `--warm` |
| Dark (nav scrolled) | bg `--text`, color `#fff` |
| White on dark | bg `#fff`, color `--dark`, dùng trên hero/dark section |
| Outline on dark | transparent, border `rgba(255,255,255,.18)`, color `rgba(255,255,255,.65)` |

### Component Patterns

**Nav (index.html)**:
- `position: fixed`, transparent → `scrolled` class khi scroll > 60px
- Khi scrolled: `background rgba(250,249,247,.9)`, `backdrop-filter: blur(16px)`, border-bottom

**Cards (template cards)**:
- Hover: `translateY(-7px)`, shadow tăng, border transparent
- Image scale 1.06 khi hover

**Section Header**:
- Eyebrow: `11px uppercase`, màu `--accent`, có dòng kẻ 2 bên (::before/::after)
- Title: `clamp(26px,3.8vw,46px)`, `font-weight: 600`, `letter-spacing: -.8px`
- Em italic: màu `--accent`, `font-weight: 300`

**Pricing Cards**:
- `pc.hot` (gói nổi bật): border `--accent-mid`, background gradient nhạt xanh → trắng
- Label nổi: absolute, top `-11px`, bg `--accent`

**Status Badges (admin)**:
- Dạng dot + text, mỗi trạng thái có màu riêng biệt
- new (xanh dương), brief (amber), building (tím), review (cam), done (xanh lá), maintain (xanh nhạt)

**Reveal Animation**:
- Class `.reveal`: `opacity:0`, `translateY(32px)` → `.visible`: opacity 1, translateY 0
- Trigger: `IntersectionObserver` threshold 0.1
- Delay: `.reveal-d1` 0.08s, `.reveal-d2` 0.16s, `.reveal-d3` 0.24s

### Admin Dashboard Layout
- Sidebar cố định: `214px` rộng, nền `var(--sidebar)` — `#111009`
- `body`: `display:flex`, `height:100vh`, `overflow:hidden`
- Main area: `flex:1`, scroll nội bộ

### Pages & Files
| File | Mô tả |
|---|---|
| `documents/index.html` | Landing page chính — hero slider 5 slide, how-it-works, templates, pricing, reviews, CTA, footer |
| `documents/checkout_page.html` | 3-step checkout — thông tin → gói dịch vụ → thanh toán |
| `documents/template_detail_page.html` | Chi tiết template — gallery, tabs (tính năng/trang/kỹ thuật/đánh giá), sidebar mua hàng |
| `documents/admin_dashboard.html` | Dashboard quản trị — đơn hàng, khách hàng, doanh thu |

---

## 📦 SẢN PHẨM & DỊCH VỤ

### GÓI A — Template thuần (CSS/HTML + Bootstrap)

**Mô tả:**
- File HTML/CSS/JS, mở thẳng trên trình duyệt, không cần build
- Responsive toàn thiết bị
- Plugin Bootstrap đi kèm theo từng template
- Hướng dẫn chỉnh nội dung cơ bản

**Loại template:**
- `web-template` — Template website (landing page, multi-page)
- `admin-template` — Template trang quản trị

**Bàn giao:** File ZIP + link demo live

**Giá bán:**

| Loại | Đơn lẻ | Bundle (5 template) |
|---|---|---|
| Web Template 1 trang | 199.000 – 499.000đ | ~1.500.000đ |
| Web Template multi-page | 499.000 – 999.000đ | ~3.000.000đ |
| Admin Template | 699.000 – 1.499.000đ | ~4.000.000đ |

---

### GÓI B — Website chuẩn, triển khai nhanh (chức năng cố định)

**Mô tả:**
- Frontend: React SPA — gọi PHP API để lấy data, render động theo DB
- Backend: PHP — cung cấp API cho React
- DB mặc định: SQLite — 1 file `.db` lưu thẳng trong thư mục hosting, có data default khi deploy
- Deploy: Upload lên hosting → chạy luôn, không cần config gì
- Flow: Deploy lên hosting → data default được seed vào SQLite → React gọi API PHP → render web động

**Cấu trúc URL:**
```
website.vn          → Frontend
website.vn/admin    → Trang quản trị
```

**Bàn giao:** Bản build + hướng dẫn upload, hoặc cài đặt trọn gói

**Giá bán:**

| Gói | Tính năng | Giá |
|---|---|---|
| Basic | Landing 1 trang + form liên hệ + admin xem form | 3.000.000 – 5.000.000đ |
| Standard | 5–7 trang + blog/tin tức + admin quản lý nội dung | 7.000.000 – 12.000.000đ |
| Pro | 10+ trang + đa ngôn ngữ + SEO cơ bản + admin đầy đủ | 15.000.000 – 22.000.000đ |

> Cài đặt hosting + domain: **+500.000 – 1.000.000đ** (1 lần, tính riêng)

**Kỹ thuật:**

#### Cấu hình DB
- File `config.php` — comment tiếng Việt rõ ràng, khách chỉ điền thông tin vào
- Mặc định dùng SQLite (zero config)
- Option: đổi sang MySQL/PostgreSQL bất kỳ, chỉ cần đúng tên bảng của hệ thống
- Kèm file `schema.sql` để khách tự tạo bảng nếu dùng DB ngoài

#### Yêu cầu Hosting
- Hỗ trợ PHP
- Hỗ trợ SQLite (`pdo_sqlite`) — đây là **requirement bắt buộc** của hệ thống

#### Bảo mật
- Dùng `.htaccess` chặn truy cập trực tiếp vào file `.db`
- File config không được expose ra ngoài public

#### Schema
- Tên bảng và tên cột được **chuẩn hóa và không thay đổi** giữa các phiên bản
- Có document schema rõ ràng đi kèm sản phẩm
- Thay đổi schema (nếu có) phải kèm migration script

#### Phân quyền Admin
- 2 role: **superadmin** và **user**
- Ảnh hưởng đến bảng `users` — cần thiết kế từ đầu

#### Upload File / Ảnh
- **Mặc định**: upload vào folder trên hosting
- **Option nâng cao**: kết nối cloud storage (S3, Cloudinary…) — khách tự config

---

### GÓI C — Website + Admin theo yêu cầu (Full custom)

**Mô tả:**
- Giao diện & chức năng thiết kế theo yêu cầu khách hàng
- 2 phase rõ ràng:
  - **Phase 1**: Wireframe → Design → Khách duyệt
  - **Phase 2**: Phát triển → Test → Deploy → Bàn giao
- Kết nối DB theo yêu cầu (MySQL, PostgreSQL, MongoDB…)
- Bàn giao source code hoặc bản build tùy khách

**Tùy chọn bàn giao:**

| Tùy chọn | Ghi chú |
|---|---|
| Bản build deploy sẵn | Mặc định, bao gồm trong giá |
| Source code | +20–30% giá trị dự án |
| Cài đặt hosting + domain | Tính phí dịch vụ riêng |
| Kết nối DB theo yêu cầu | Theo yêu cầu cụ thể |
| Bảo trì hàng tháng | 1.000.000 – 3.000.000đ/tháng |

**Giá bán:**

| Loại dự án | Giá khởi điểm |
|---|---|
| Website brochure custom UI | 20.000.000 – 40.000.000đ |
| Website + hệ thống quản lý trung bình | 40.000.000 – 80.000.000đ |
| Hệ thống phức tạp (đặt hàng, CRM nhỏ…) | 80.000.000đ+ |

---

## 🗂️ NGÁCH THỊ TRƯỜNG ƯU TIÊN

Template và website sẽ tập trung vào các ngành có nhu cầu cao tại Việt Nam:

- [x] Nhà hàng / Quán ăn / Cafe — **DONE** (`Sources/templates/web/restaurant/`)
- [x] Spa / Thẩm mỹ / Làm đẹp — **DONE** (`Sources/templates/web/spa-beauty/`)
- [ ] Bất động sản
- [x] Agency / Portfolio cá nhân — **DONE** (`Sources/templates/web/agency-web/`)
- [ ] Landing page sản phẩm / Dịch vụ

---

## 🚀 ROADMAP PHÁT TRIỂN

### Giai đoạn 1 — 0 đến 6 tháng ✅ IN PROGRESS
- [x] Xây 2–3 web template theo ngách — **3 templates xong** (agency, spa, restaurant)
- [x] Xây 1 admin template cơ bản — **DONE** (`Sources/templates/admin/basic-admin/`)
- [ ] Thiết lập kênh bán (webdrop.vn) — Next.js đang build
- [ ] Nhận dự án Gói B để tạo dòng tiền

### Giai đoạn 2 — 6 đến 18 tháng
- [ ] Mở rộng thư viện template (5–10 ngành) — còn BĐS, landing page
- [ ] Đóng gói Gói B thành sản phẩm chuẩn bán nhanh
- [ ] Nhận dự án Gói C giá trị cao
- [ ] Xây trang showcase / portfolio

### Giai đoạn 3 — 18 tháng trở đi
- [ ] SaaS nhỏ: khách tự cài template qua giao diện
- [ ] Affiliate / đại lý resell template
- [ ] Gói bảo trì tạo MRR (doanh thu tháng lặp lại)

---

## 📁 CẤU TRÚC DỰ ÁN

```
webdrop/                            ← GitHub repo
├── .claude/
│   ├── CLAUDE.md                   ← File này
│   ├── agents/                     ← Custom agents
│   │   ├── qa-tester.md            ← QA design system + HTML
│   │   ├── reviewer.md             ← Code review (bug, security, logic)
│   │   └── research.md             ← Research & documentation
│   ├── rules/                      ← Coding rules (design-system, db, tech-stack...)
│   └── settings.json               ← Project settings (hooks, permissions)
├── Sources/                        ← Toàn bộ source code sản phẩm
│   ├── system/                     ← Next.js (System Admin + trang bán hàng webdrop.vn)
│   │   ├── app/
│   │   │   ├── (site)/             ← Trang bán hàng public (URL: /)
│   │   │   ├── (checkout)/         ← Checkout flow (URL: /checkout)
│   │   │   └── (admin)/            ← System Admin (URL: /admin)
│   │   ├── prisma/schema.prisma    ← PostgreSQL schema (Agency extension)
│   │   └── package.json
│   ├── products/
│   │   └── goi-b/                  ← Base code Gói B (React + PHP + SQLite)
│   │       ├── frontend/           ← React SPA (Vite)
│   │       └── backend/            ← PHP API (config.php, index.php, schema.sql, .htaccess)
│   └── templates/
│       ├── web/                    ← Web templates HTML/CSS/Bootstrap (Gói A)
│       │   ├── agency-web/         ← ✅ Agency template (index, dich-vu, ve-chung-toi, du-an)
│       │   ├── spa-beauty/         ← ✅ Spa template (index, dich-vu, dat-lich, lien-he)
│       │   └── restaurant/         ← ✅ Nhà hàng template (index, thuc-don, dat-ban, lien-he)
│       └── admin/
│           └── basic-admin/        ← ✅ Admin template (login, dashboard, posts, users, settings)
├── documents/                      ← Prototype UI (index, checkout, admin, template-detail)
└── .gitignore
```

---

## 🗄️ DATABASE SCHEMA

### Kiến trúc tổng quan

```
System DB (DB trung tâm — hệ thống cha)
├── Core Schema         → nền chung, dùng cho cả system lẫn mọi website con
├── Extension: Agency   → nghiệp vụ riêng của hệ thống cha (customers, orders, projects...)
└── Sinh ra DB con ──→  Website DB (độc lập, deploy lên hosting khách)
                            ├── Core Schema  (copy từ system)
                            └── Extension theo ngách (BĐS / Shop / Blog / Agency...)
```

> **Nguyên tắc:** System DB là trung tâm — schema của mọi website con đều được generate từ đây, đảm bảo thống nhất version và dễ thống kê tập trung. Mỗi website con có DB riêng, độc lập trên hosting khách.

> **Lưu ý:** Ngách `agency` (bán dịch vụ/template) chính là schema của hệ thống cha — nếu khách mua website để bán dịch vụ web như bạn, dùng extension này.

> **FK:** Dùng SQLite với `PRAGMA foreign_keys = ON` — bật FK constraint để đảm bảo data integrity, tránh rác data về lâu dài. PHP xử lý logic, DB bảo vệ tính toàn vẹn.

---

### CORE SCHEMA
> Dùng chung cho System DB và mọi website con (Gói B/C).

#### Bảng `users`
| Cột | Kiểu | Ghi chú |
|---|---|---|
| id | INT PK | |
| name | VARCHAR | |
| email | VARCHAR | unique |
| password | VARCHAR | hashed |
| role | ENUM | superadmin / user |
| created_at | DATETIME | |

#### Bảng `posts`
- id, title, slug, content, excerpt
- thumbnail, category_id
- status (draft/published), featured
- meta_title, meta_description
- created_by, created_at, updated_at

#### Bảng `categories`
- id, name, slug, description, thumbnail
- parent_id (hỗ trợ danh mục con)
- created_at

#### Bảng `pages`
- id, title, slug, content
- template (tên layout riêng nếu có)
- meta_title, meta_description
- status, created_at, updated_at

#### Bảng `media`
- id, filename, filepath, filesize, filetype
- alt_text, uploaded_by, created_at

#### Bảng `banners`
- id, title, image, link, target (_blank/_self)
- position (homepage_hero, popup…)
- sort_order, status, created_at

#### Bảng `contacts`
- id, name, email, phone, subject, message
- status (new/read/replied)
- created_at

#### Bảng `settings`
Lưu dạng key-value: `key | value | group`

**Nhóm: general** — site_name, site_description, site_logo, site_favicon, site_email, site_phone, site_phone_2, site_address, site_language, site_timezone

**Nhóm: seo** — meta_title, meta_description, meta_keywords, og_image, google_analytics_id, google_tag_manager_id, google_site_verification, facebook_pixel_id

**Nhóm: social** — social_facebook, social_youtube, social_instagram, social_tiktok, social_zalo, social_linkedin, social_twitter

**Nhóm: design** — primary_color, secondary_color, font_heading, font_body, header_style, footer_style, logo_width, logo_height

**Nhóm: header** — header_sticky, header_transparent, topbar_enabled, topbar_text, topbar_bg_color

**Nhóm: footer** — footer_copyright, footer_description, footer_show_social, footer_show_map, footer_google_map_embed

**Nhóm: contact** — contact_form_enabled, contact_email_receiver, google_map_lat, google_map_lng, google_map_zoom, google_map_api_key

**Nhóm: smtp** — smtp_host, smtp_port, smtp_user, smtp_password, smtp_from_name, smtp_from_email, smtp_encryption

**Nhóm: scripts** — script_header, script_footer, custom_css

**Nhóm: system** — maintenance_mode, maintenance_message, site_under_construction

> Schema settings có thể bổ sung thêm field sau mà không ảnh hưởng cấu trúc bảng.

---

### EXTENSION SCHEMA
> Mỗi ngách chỉ thêm bảng mới, không sửa core schema. Thêm ngách mới thì update sau.

#### Ngách: BĐS (Real Estate)
- `properties` — id, title, slug, description, thumbnail, price, price_unit, area, bedrooms, bathrooms, floors, direction, legal, status (đang bán/đã bán/cho thuê), featured, category_id, created_by, created_at
- `property_categories` — id, name, slug, parent_id
- `property_images` — id, property_id, image, sort_order
- `property_utilities` — id, name, icon
- `property_utility` — property_id, utility_id (pivot)
- `property_contacts` — id, property_id, name, phone, email, message, created_at

#### Ngách: Bán hàng (E-commerce cơ bản)
- `products` — id, title, slug, description, thumbnail, price, price_sale, stock, sku, status, featured, category_id, created_at
- `product_categories` — id, name, slug, parent_id
- `product_images` — id, product_id, image, sort_order
- `product_attributes` — id, product_id, name, value
- `orders` — id, code, customer_name, customer_email, customer_phone, customer_address, note, total, status (pending/confirmed/shipping/done/cancelled), payment_method, payment_status, created_at
- `order_items` — id, order_id, product_id, product_name, product_price, quantity, subtotal
- `coupons` — id, code, type (percent/fixed), value, min_order, max_uses, used_count, expired_at, status

#### Ngách: Tin tức / Blog
- Core schema (`posts`, `categories`) đã đủ, thêm field vào `posts`: read_time, allow_comment
- `tags` — id, name, slug
- `post_tags` — post_id, tag_id (pivot)

#### Ngách: Agency (Bán dịch vụ / Template) ★ dùng cho System DB
- `industries` — id, name, slug (bds/shop/blog/agency...), description, status, sort_order
- `package_industries` — package_id, industry_id (pivot — gói B hỗ trợ ngách nào)
- `customers` — id, name, email, phone, company, address, note, status (active/inactive), created_at
- `customer_contacts` — id, customer_id, type (zalo/facebook/email/phone), value, note
- `service_packages` — id, name, code (GOI_A/GOI_B/GOI_C), description, price_from, price_to, status, sort_order
- `templates` — id, name, slug, description, thumbnail, demo_url, download_url, price, category (web/admin), industry_id → `industries`, sales_count, status, created_at
- `orders` — id, code, customer_id, package_id, type (template/website), title, price, discount, total, status (new/confirmed/in-progress/delivered/completed/cancelled), note, started_at, deadline_at, completed_at, created_at
- `order_items` — id, order_id, item_type (template/service/hosting/domain), item_name, qty, unit_price, subtotal, note
- `contracts` — id, order_id, file_url, signed_at, note
- `payments` — id, order_id, amount, method (cash/bank/momo/vnpay), status (pending/paid/refunded), paid_at, note, receipt_url
- `projects` — id, order_id, customer_id, name, type (goi-b/goi-c), status (planning/designing/developing/reviewing/delivered/done), hosting_info, domain, admin_url, note, created_at
- `project_milestones` — id, project_id, title, description, status (pending/done), due_at, completed_at
- `project_notes` — id, project_id, content, created_by, created_at
- `project_files` — id, project_id, filename, filepath, type (design/source/build/contract), uploaded_by, created_at
- `revenues` — id, order_id, payment_id, amount, month, year, note, created_at
- `expenses` — id, type (hosting/domain/tool/other), title, amount, paid_at, note, created_at
- `activity_logs` — id, admin_id, action, target_type, target_id, description, created_at

---

## 🖥️ HẠ TẦNG & CÔNG NGHỆ

### Hosting
- **Nhà cung cấp**: AZDIGI VPS Linux
- **Gói khởi điểm**: ~200.000–300.000đ/tháng (2 vCPU, 2GB RAM, NVMe)
- **Datacenter**: Việt Nam (HCM/Bình Dương) — tốc độ tốt thị trường nội địa
- **1 VPS duy nhất** chạy tất cả: System, demo website, trang bán hàng

### Kiến trúc server
```
VPS AZDIGI Linux
├── Nginx                → reverse proxy, serve static files
├── Next.js (PM2)        → System Admin + trang bán hàng
├── PostgreSQL           → System DB (trang bán hàng của bạn)
└── PHP-FPM              → serve website khách (Gói B)
                              └── SQLite (.db file trong hosting dir)
```

### Công nghệ theo từng phần

| Phần | Công nghệ |
|---|---|
| Trang bán hàng (frontend) | React (Next.js) |
| System Admin | Next.js full-stack |
| System DB | **PostgreSQL** |
| Website khách Gói B (frontend) | React SPA |
| Website khách Gói B (backend) | PHP |
| Website khách Gói B (DB mặc định) | SQLite |
| Web server | Nginx |
| Process manager | PM2 |

### Storage Strategy

| Loại dữ liệu | Lưu ở đâu | Ghi chú |
|---|---|---|
| Ảnh hệ thống (demo, trang bán hàng) | Cloudflare R2 | Nén ảnh trước khi upload, 10GB free là đủ |
| Ảnh khách upload (Gói B) | Cloudflare R2 | Free bandwidth, chỉ tính phí storage nếu vượt 10GB |
| Video | YouTube / Vimeo (embed link) | Không lưu trực tiếp, tiết kiệm storage |
| Source code | GitHub (private repo) | Version control, deploy qua git pull |
| File nhỏ (contract, design file) | VPS storage | Số lượng ít, không đáng kể |
| DB backup | GitHub private repo / Google Drive | Backup định kỳ |

### Lý do chọn PostgreSQL cho System DB
- Mạnh về query phức tạp, thống kê, báo cáo tài chính
- Hỗ trợ JSON column — linh hoạt khi cần
- Ecosystem tốt với Next.js (Prisma / Drizzle ORM)
- Scale tốt về lâu dài, không cần đổi DB


> **Lý do chọn Cloudflare R2:** Free bandwidth hoàn toàn (không tính egress fee) — khách upload nhiều ảnh, traffic cao cũng không lo phí phát sinh.

---

## 📝 GHI CHÚ & QUYẾT ĐỊNH KỸ THUẬT

- Template Bootstrap không dùng build system → giảm dependency, khách tự chỉnh dễ
- Luôn có demo live cho mỗi template → tăng tỷ lệ chuyển đổi
- Gói C bắt buộc ký checklist scope trước khi bắt đầu → tránh scope creep
- Frontend web + admin chung 1 project React, tách route `/admin` — tái sử dụng component, dễ maintain
- SQLite dùng `PRAGMA foreign_keys = ON` — bật FK để bảo vệ data integrity

---

*Cập nhật lần cuối: chốt storage strategy — Cloudflare R2 cho ảnh/media, GitHub cho source code*