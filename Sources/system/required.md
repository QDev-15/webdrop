# Required — Danh sách việc cần làm (webdrop System)

> Review date: 2026-06-01 (updated after implementation session)
> Scope: `Sources/system/` — Next.js app (trang bán hàng + admin)

---

## 1. MÀN HÌNH ĐÃ CÓ — Tình trạng

| Route | Màn hình | Tình trạng |
|---|---|---|
| `/` | Homepage | ✅ Hoạt động — ISR 60s |
| `/templates` | Danh sách tất cả template | ✅ Tạo mới — ISR 60s |
| `/templates/[slug]` | Chi tiết template | ✅ Cập nhật — có revalidate 60s |
| `/checkout` | Đặt hàng | ✅ Cập nhật — plan IDs đồng bộ với API |
| `/checkout/success` | Xác nhận đặt hàng | ✅ Tạo mới — hiển thị mã đơn |
| `/about` | Về chúng tôi | ✅ Tạo mới |
| `/blog` | Blog / Tin tức | ✅ Tạo mới |
| `/contact` | Liên hệ + FAQ | ✅ Tạo mới — error handling đúng |
| `/faq` | FAQ | ✅ Tạo mới |
| `/pricing` | Bảng giá | ✅ Tạo mới |
| `/policies/[slug]` | Chính sách | ✅ Tạo mới |
| `not-found.tsx` | Trang 404 | ✅ Tạo mới |
| `/admin/login` | Đăng nhập admin | ✅ Hoạt động |
| `/admin` | Dashboard | ✅ Hoạt động — stats từ DB |
| `/admin/templates` | Danh sách template | ✅ Hoạt động |
| `/admin/templates/new` | Form tạo template | ✅ Tạo mới |
| `/admin/templates/[id]/edit` | Form sửa template | ✅ Tạo mới |
| `/admin/orders` | Danh sách đơn hàng | ✅ Cập nhật — filter/search |
| `/admin/orders/[id]` | Chi tiết đơn hàng + cập nhật TT | ✅ Tạo mới |
| `/admin/customers` | Danh sách khách hàng | ✅ Cập nhật — search/pagination |
| `/admin/customers/[id]` | Chi tiết khách hàng | ✅ Tạo mới |
| `/admin/customers/new` | Thêm khách hàng | ✅ Tạo mới |
| `/admin/revenue` | Báo cáo doanh thu | ✅ Tạo mới |
| `/admin/projects` | Quản lý dự án | ✅ Tạo mới |
| `/admin/settings` | Cài đặt | ✅ Hoạt động |

---

## 2. API — Tình trạng

| API | Tình trạng |
|---|---|
| `POST /api/orders` | ✅ Cập nhật — generateOrderCode() fixed, plan ID sync |
| `GET /api/admin/orders` | ✅ Có filter/search/pagination |
| `GET/PATCH /api/admin/orders/[id]` | ✅ Tạo mới — try/catch + P2025 handling |
| `GET /api/admin/customers` | ✅ Có search/pagination |
| `POST /api/admin/customers` | ✅ Tạo mới — try/catch + P2002 handling |
| `GET/PATCH /api/admin/customers/[id]` | ✅ Tạo mới — whitelist fields, error handling |
| `GET/POST /api/admin/templates` | ✅ Cập nhật — status field dùng từ request |
| `PATCH/DELETE /api/admin/templates/[id]` | ✅ Cập nhật — whitelist fields, error handling |
| `GET /api/admin/revenue` | ✅ Tạo mới |
| `POST /api/admin/revenue` | ✅ Tạo mới — amount validation |
| `POST /api/contact` | ✅ Tạo mới |
| `GET /api/packages` | ✅ Tạo mới |

---

## 3. BUG ĐÃ FIX

| # | Vị trí | Vấn đề | Trạng thái |
|---|---|---|---|
| B1 | `orders/route.ts` | `while` loop không giới hạn | ✅ Fix — dùng timestamp-based code |
| B2 | `templates/[slug]/page.tsx` | Thiếu `revalidate` | ✅ Fix — thêm `revalidate = 60` |
| B3 | `admin/templates/page.tsx` | Link `/new` và `/edit` → 404 | ✅ Fix — tạo đủ các trang |
| B4 | `checkout/page.tsx` | Plan ID mismatch (a/b/c vs starter/standard/premium) | ✅ Fix — đồng bộ IDs |
| B5 | `admin/orders/page.tsx` | `take: 50` cứng | ✅ Fix — pagination + filter |
| B6 | `admin/customers/page.tsx` | `take: 50` cứng | ✅ Fix — pagination + search |
| B7 | `api/orders/route.ts` | Duplicate customer nếu email null | ✅ Fix — upsert logic |
| B8 | `api/admin/customers/[id]/route.ts` | Mass-assignment vulnerability | ✅ Fix — whitelist fields |
| B9 | `api/admin/templates/[id]/route.ts` | Mass-assignment vulnerability | ✅ Fix — whitelist fields |
| B10 | `api/admin/customers/route.ts` | POST thiếu try/catch | ✅ Fix — P2002 handling |
| B11 | `api/admin/orders/[id]/route.ts` | PATCH thiếu try/catch | ✅ Fix — P2025 handling |
| B12 | `checkout/success/page.tsx` | Không hiển thị mã đơn hàng | ✅ Fix — đọc `?code=` từ URL |
| B13 | `contact/page.tsx` | Luôn show success dù API lỗi | ✅ Fix — check `res.ok` |
| B14 | `api/admin/revenue/route.ts` | `parseFloat` không validate | ✅ Fix — validate trước khi parse |
| B15 | `templates/[slug]/page.tsx` | `{ slug: any }` type | ✅ Fix — dùng `{ slug: string }` |
| B16 | `api/admin/templates/route.ts` | `status` bị ignored khi create | ✅ Fix — dùng `status ?? 'draft'` |

---

## 4. CÒN LẠI (P2–P3)

### P2 — Cải thiện (không blocking)
- [ ] `/admin/settings` — Thêm nhóm cài đặt Design, Header/Footer config
- [ ] `/admin/settings` — Upload logo/favicon
- [ ] Search/filter trên `/admin/templates` (hiện chỉ có search, chưa có filter ngành/trạng thái)
- [ ] Export CSV/Excel cho đơn hàng

### P3 — Tính năng mới
- [ ] Email xác nhận đơn hàng tự động
- [ ] Gallery ảnh cho template detail (hiện chỉ 1 ảnh thumbnail)
- [ ] Related templates cùng ngành trên template detail
- [ ] Rate limiting cho `POST /api/orders` (chống spam)
- [ ] `/admin/projects/[id]` — Chi tiết dự án + milestones management
