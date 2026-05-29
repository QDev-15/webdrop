# Plan: Step 2 — Gói A Templates

> **Vị trí trong Master Roadmap:** Step 2 (sau Step 1 webdrop.vn site)
> **Thời gian:** ~4 tuần
> **Deliverable:** 3 web template + 1 admin template sẵn sàng bán

## Mục tiêu
Xây 3 web template + 1 admin template. Mỗi template có live demo, ZIP download, giá bán rõ ràng, đăng lên webdrop.vn và Gumroad.

---

## Template cần xây

### 2.1 — agency-web: Công ty dịch vụ / Agency
- **Status:** Đã có `lien-he.html` tại `Sources/templates/web/agency-web/`
- **Cần thêm:**
  - `index.html` — Landing page (hero slider, dịch vụ, portfolio, testimonials)
  - `dich-vu.html` — Danh sách dịch vụ chi tiết
  - `ve-chung-toi.html` — Giới thiệu công ty, team
  - `du-an.html` — Portfolio / case studies
  - `assets/css/style.css` — Shared styles
- **Màu:** Green accent (`--accent: #1a6b52`) — giữ nguyên design system
- **Giá bán:** 2.500.000đ (multi-page)

### 2.2 — spa-beauty: Spa & Làm đẹp
- **Folder:** `Sources/templates/web/spa-beauty/`
- **Trang:** `index.html`, `dich-vu.html`, `dat-lich.html`, `lien-he.html`
- **Layout index:** Hero fullscreen → Dịch vụ grid → Team → Đặt lịch form → Testimonials → Footer + Map
- **Màu chủ đạo:** Override CSS vars sang rose/gold:
  ```css
  --accent: #c17a6b;
  --accent-h: #a8614f;
  --accent-light: #fdf3f0;
  ```
- **JS đặc biệt:** Lightbox gallery, booking form validation
- **Giá bán:** 2.800.000đ

### 2.3 — restaurant: Nhà hàng / Cafe
- **Folder:** `Sources/templates/web/restaurant/`
- **Trang:** `index.html`, `thuc-don.html`, `dat-ban.html`, `lien-he.html`
- **Layout index:** Hero video/slider → Menu preview tabs → About → Gallery masonry → Đặt bàn → Địa chỉ + Map
- **Màu chủ đạo:** Override sang warm dark:
  ```css
  --accent: #b45309;
  --accent-h: #92400e;
  --accent-light: #fef3c7;
  ```
- **JS đặc biệt:** Menu tab filter, reservation form
- **Giá bán:** 3.000.000đ

### 2.4 — basic-admin: Admin Template cơ bản
- **Folder:** `Sources/templates/admin/basic-admin/`
- **Base:** Convert từ `documents/admin_dashboard.html`
- **Trang:**
  - `dashboard.html` — Stats overview, charts cơ bản
  - `users.html` — Bảng user management
  - `posts.html` — Bảng quản lý bài viết
  - `settings.html` — Form settings theo group
  - `login.html` — Trang đăng nhập
- **Giá bán:** 1.200.000đ (standalone) | bundle với web template

---

## Checklist mỗi template

### Code
- [ ] Bootstrap 5.3.3 CDN (không cài npm)
- [ ] DM Sans font load từ Google Fonts
- [ ] CSS vars từ design-system.md (`:root` block đúng)
- [ ] Không hardcode màu ngoài palette (trừ 5 màu inline được phép)
- [ ] JS: `const`/`let`, không jQuery, `{passive: true}` cho scroll events
- [ ] Không `console.log`
- [ ] Dùng `.wd-container` (không dùng `.container` Bootstrap)

### HTML
- [ ] `lang="vi"` trên `<html>`
- [ ] Meta: charset, viewport, title, description
- [ ] Semantic: `<header>`, `<nav>`, `<main>`, `<section>`, `<footer>`
- [ ] Tất cả `<img>` có `alt`
- [ ] Form: `<label>` đúng cho mọi input
- [ ] H1 duy nhất, headings đúng thứ tự

### Responsive
- [ ] Test 320px (iPhone SE)
- [ ] Test 576px
- [ ] Test 768px (tablet)
- [ ] Test 1024px
- [ ] Test 1440px+

### Performance
- [ ] `loading="lazy"` cho ảnh (trừ hero above-the-fold)
- [ ] Scripts dùng `defer` hoặc cuối body
- [ ] Ảnh dùng WebP hoặc JPG optimize (<200KB/ảnh)

### Bàn giao
- [ ] ZIP file: HTML + CSS + JS + assets
- [ ] Hình ảnh placeholder từ Unsplash (free commercial use)
- [ ] `README.md` hướng dẫn chỉnh nội dung cơ bản
- [ ] Demo live URL (host trên VPS sau Step 3)
- [ ] Ghi giá bán rõ ràng

---

## Kênh bán

### webdrop.vn (sau Step 1 + 3)
- Trang chủ: template card trong TemplateGrid
- Trang chi tiết: `/templates/[slug]`
- Mua: Checkout 3-step

### Gumroad (song song)
- Upload ZIP ngay khi có template xong
- Demo link = URL trên VPS
- Description + preview screenshots

### Social
- Facebook Page + Zalo OA: post video demo ngắn
- Không cần website xong mới bán được qua Gumroad

---

## Timeline

| Tuần | Việc |
|---|---|
| 1 | agency-web: thêm index, dich-vu, ve-chung-toi, du-an |
| 2 | spa-beauty: 4 trang hoàn chỉnh |
| 3 | restaurant: 4 trang hoàn chỉnh |
| 4 | basic-admin: 5 trang, đóng gói ZIP, viết README |
