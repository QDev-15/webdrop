# Step 2 — Gói A: HTML Templates
> Thời gian: 4 tuần | Deliverable: 3 web template + 1 admin template sẵn sàng bán

## Templates cần xây

| # | Folder | Trang | Màu accent | Giá |
|---|---|---|---|---|
| 2.1 | `templates/web/agency-web/` | index, dich-vu, ve-chung-toi, du-an, lien-he | `#1a6b52` (mặc định) | 2.500.000đ |
| 2.2 | `templates/web/spa-beauty/` | index, dich-vu, dat-lich, lien-he | `#c17a6b` rose | 2.800.000đ |
| 2.3 | `templates/web/restaurant/` | index, thuc-don, dat-ban, lien-he | `#b45309` amber | 3.000.000đ |
| 2.4 | `templates/admin/basic-admin/` | dashboard, users, posts, settings, login | `#1a6b52` (mặc định) | 1.200.000đ |

> 2.1 agency-web đã có `lien-he.html` — chỉ cần thêm 4 trang còn lại

---

## Tasks

### Mỗi template
- [ ] Các trang HTML theo danh sách trên
- [ ] `assets/css/style.css` — shared styles
- [ ] `README.md` — hướng dẫn chỉnh nội dung (tiếng Việt)
- [ ] ZIP: `[tên]-v1.0.zip` — HTML + CSS + JS + assets

### Bàn giao
- [ ] Ảnh placeholder Unsplash (free commercial, WebP < 200KB)
- [ ] Demo URL (host sau Step 3): `demo.webdrop.vn/[tên-template]/`
- [ ] Đăng Gumroad ngay khi xong từng template (không cần đợi website)

---

## Checklist mỗi template
- [ ] Bootstrap 5.3.3 CDN, DM Sans Google Fonts
- [ ] CSS vars đúng design-system, không hardcode màu ngoài palette
- [ ] `.wd-container` (không dùng `.container` Bootstrap)
- [ ] `lang="vi"`, meta charset/viewport/title/description
- [ ] Semantic HTML, `alt` cho ảnh, `label` cho input
- [ ] H1 duy nhất, headings đúng thứ tự
- [ ] `loading="lazy"` cho ảnh (trừ hero), script dùng `defer`
- [ ] JS: `const`/`let`, không jQuery, không `console.log`
- [ ] Responsive: test 320 / 576 / 768 / 1024 / 1440px

---

## Timeline
| Tuần | Việc |
|---|---|
| 1 | agency-web: thêm index, dich-vu, ve-chung-toi, du-an |
| 2 | spa-beauty: 4 trang |
| 3 | restaurant: 4 trang |
| 4 | basic-admin: 5 trang + đóng gói ZIP tất cả |
