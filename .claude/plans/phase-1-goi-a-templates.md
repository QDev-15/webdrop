# Plan: Phase 1 — Gói A Templates (0–6 tháng)

## Mục tiêu
Xây 2–3 web template + 1 admin template, thiết lập kênh bán, tạo dòng tiền đầu tiên.

## Template cần xây (ưu tiên theo ngách)

### Template 1: Spa & Làm đẹp (ưu tiên cao nhất)
- **Lý do**: Nhu cầu cao tại VN, khách sẵn sàng trả tiền
- **Layout**: Hero fullscreen → Dịch vụ grid → Team → Đặt lịch → Testimonials → Liên hệ + Bản đồ
- **Màu sắc**: Warm rose/gold hoặc Sage green (tùy biến dễ)
- **Tính năng JS**: Lightbox gallery, smooth scroll, booking form
- **Giá bán**: 2.800.000đ (gói Standard webdrop)

### Template 2: Nhà hàng / Cafe (ưu tiên cao)
- **Layout**: Hero video/slider → Menu → About → Gallery → Đặt bàn → Địa chỉ + Map
- **Màu sắc**: Warm dark (coffee brown) hoặc Fresh green
- **Tính năng**: Menu tab filter, gallery masonry, reservation form
- **Giá bán**: 3.000.000đ

### Template 3: Công ty dịch vụ / Agency
- **Status**: Đã có design concept từ `documents/index.html` và `documents/template_detail_page.html`
- **Cần**: Chuyển từ documents sang template hoàn chỉnh + thêm trang phụ
- **Layout**: Landing + About + Services + Portfolio + Blog + Contact (7 trang)
- **Giá bán**: 2.500.000đ

### Template Admin: Dashboard cơ bản
- **Status**: Đã có concept từ `documents/admin_dashboard.html`
- **Cần**: Thêm các màn hình: settings, posts management, media library
- **Giá bán**: 1.200.000đ (standalone) | bundle với website template

---

## Checklist mỗi template

### Design
- [ ] Responsive: 320px, 576px, 768px, 1024px, 1440px
- [ ] Dark section contrast đủ (WCAG AA)
- [ ] Hình ảnh placeholder từ Unsplash (đã optimize)
- [ ] Print stylesheet không bị vỡ

### Code
- [ ] Bootstrap 5.3.3 CDN
- [ ] DM Sans font load
- [ ] CSS vars từ design-system.md
- [ ] Không hardcode màu ngoài palette
- [ ] JS: const/let, không jQuery, passive scroll listener
- [ ] Không `console.log`

### HTML
- [ ] `lang="vi"` trên `<html>`
- [ ] Meta: charset, viewport, title, description
- [ ] Semantic HTML: `<header>`, `<nav>`, `<main>`, `<section>`, `<footer>`
- [ ] Tất cả `<img>` có `alt`
- [ ] Form có `label` đúng cho mọi input
- [ ] Links có text có nghĩa

### Performance
- [ ] Hình ảnh dùng `loading="lazy"` (trừ hero)
- [ ] Không inline CSS >20 lines (dùng `<style>` block)
- [ ] Không blocking scripts (dùng `defer` hoặc cuối body)

### SEO Basic
- [ ] Title page mô tả đúng
- [ ] Meta description
- [ ] H1 duy nhất trên trang
- [ ] Headings theo thứ tự (H1 → H2 → H3)

---

## Kênh bán

### Ưu tiên 1: Website webdrop.vn (tự build)
- Trang chủ: đã có concept từ `documents/index.html`
- Trang chi tiết: đã có concept từ `documents/template_detail_page.html`
- Trang mua hàng: đã có concept từ `documents/checkout_page.html`

### Ưu tiên 2: Gumroad / Lemon Squeezy
- Upload template ZIP
- Demo link (host trên VPS)
- Giá: theo bảng giá Gói A

### Social
- Facebook Page + Zalo OA
- Post demo trực tiếp, không qua link

---

## Timeline
| Tuần | Việc cần làm |
|---|---|
| 1–2 | Hoàn thiện template Spa (design + code + test) |
| 3–4 | Hoàn thiện template Nhà hàng |
| 5–6 | Package Công ty dịch vụ từ documents/ |
| 7–8 | Admin template cơ bản |
| 9–10 | Setup website bán hàng webdrop.vn |
| 11–12 | Launch + marketing đầu tiên |
