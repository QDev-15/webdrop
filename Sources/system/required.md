# Required — Danh sách việc cần làm (webdrop System)

> Review date: 2026-06-01
> Scope: `Sources/system/` — Next.js app (trang bán hàng + admin)

---

## 1. MÀN HÌNH ĐÃ CÓ — Tình trạng

| Route | Màn hình | Tình trạng |
|---|---|---|
| `/` | Homepage | ✅ Hoạt động — ISR 60s |
| `/templates/[slug]` | Chi tiết template | ⚠️ Thiếu revalidate, thiếu nội dung đầy đủ |
| `/checkout` | Đặt hàng | ⚠️ Giá hardcode không khớp Gói A/B/C |
| `/admin/login` | Đăng nhập admin | ✅ Hoạt động |
| `/admin` | Dashboard | ✅ Hoạt động — stats từ DB |
| `/admin/templates` | Danh sách template | ⚠️ Chỉ có view, link "Thêm/Sửa" dẫn đến trang 404 |
| `/admin/orders` | Danh sách đơn hàng | ⚠️ Chỉ view, không sửa được, không lọc được |
| `/admin/customers` | Danh sách khách hàng | ⚠️ Chỉ view, không có chi tiết/sửa |
| `/admin/settings` | Cài đặt | ✅ Hoạt động |

---

## 2. MÀN HÌNH THIẾU HOÀN TOÀN (cần tạo mới)

### Admin
- [ ] `/admin/templates/new` — Form tạo template mới *(link đã có trong `/admin/templates` nhưng trang 404)*
- [ ] `/admin/templates/[id]/edit` — Form sửa template *(link đã có nhưng trang 404)*
- [ ] `/admin/orders/[id]` — Chi tiết đơn hàng + cập nhật trạng thái
- [ ] `/admin/customers/[id]` — Chi tiết khách hàng + lịch sử đơn
- [ ] `/admin/customers/new` — Thêm khách hàng thủ công
- [ ] `/admin/revenue` — Báo cáo doanh thu / tài chính *(model Revenue đã có trong schema)*
- [ ] `/admin/projects` — Quản lý dự án Gói B/C *(model Project đã có trong schema)*

### Public
- [ ] `/templates` — Trang danh sách TẤT CẢ templates (hiện tại chỉ hiển thị trên homepage)
- [ ] `not-found.tsx` — Trang 404 custom

---

## 3. CHỨC NĂNG THIẾU TRÊN TỪNG MÀN HÌNH

### `/templates/[slug]` — Chi tiết template
- [ ] Thiếu `export const revalidate = 60` → trang static mãi mãi sau build
- [ ] Thiếu nội dung đầy đủ: mô tả dài, danh sách trang có trong template, công nghệ sử dụng
- [ ] Thiếu gallery ảnh (hiện chỉ có 1 ảnh thumbnail)
- [ ] Thiếu related templates cùng ngành

### `/checkout` — Đặt hàng
- [ ] Giá gói hardcode (`starter: 1.2tr`, `standard: 2.5tr`, `premium: 12tr`) không khớp với Gói A/B/C trong `service_packages`
- [ ] Thiếu email xác nhận đơn hàng sau khi đặt thành công
- [ ] Thiếu trang xác nhận `/checkout/success?code=WD-xxxx`
- [ ] `generateOrderCode()` dùng vòng lặp while → có thể infinite loop nếu DB đầy mã

### `/admin/templates` — Danh sách template
- [ ] Thiếu trang `/admin/templates/new` (form tạo mới)
- [ ] Thiếu trang `/admin/templates/[id]/edit` (form sửa)
- [ ] Thiếu search/filter theo tên, ngành, trạng thái
- [ ] Thiếu phân trang (hiện tải toàn bộ)
- [ ] Thiếu nút xóa template

### `/admin/orders` — Đơn hàng
- [ ] Thiếu cập nhật trạng thái đơn hàng (chỉ xem)
- [ ] Thiếu trang chi tiết đơn `/admin/orders/[id]`
- [ ] Thiếu filter theo trạng thái, ngày, loại
- [ ] Thiếu search theo mã đơn, tên khách
- [ ] Pagination hardcode 50 đơn — thiếu phân trang thực sự
- [ ] Thiếu export CSV/Excel

### `/admin/customers` — Khách hàng
- [ ] Thiếu trang chi tiết khách `/admin/customers/[id]`
- [ ] Thiếu form thêm khách thủ công
- [ ] Thiếu search theo tên, email, SĐT
- [ ] Pagination hardcode 50 — thiếu phân trang

### `/admin/settings` — Cài đặt
- [ ] Thiếu nhóm cài đặt: Design (màu sắc, logo), Header/Footer config
- [ ] Thiếu upload logo/favicon
- [ ] Thiếu preview thay đổi trước khi lưu

---

## 4. API THIẾU / CÒN LỖI

| API | Vấn đề |
|---|---|
| `POST /api/orders` | `generateOrderCode()` dùng `while` không giới hạn — có thể treo |
| `POST /api/orders` | Không gửi email xác nhận sau khi tạo đơn |
| `POST /api/orders` | Giá tính theo `plan` hardcode, không đọc từ DB `service_packages` |
| `GET /api/admin/orders` | Thiếu filter/search/pagination params |
| `GET /api/admin/customers` | Thiếu filter/search/pagination params |
| Thiếu `GET /api/admin/orders/[id]` | Không có API lấy chi tiết 1 đơn |
| Thiếu `GET /api/admin/customers/[id]` | Không có API lấy chi tiết 1 khách |
| Thiếu `GET /api/admin/revenue` | Schema có model Revenue nhưng chưa có API |
| Thiếu `POST /api/admin/customers` | Không tạo khách hàng từ admin được |

---

## 5. BUG / ISSUES RÕ RÀNG

| # | Vị trí | Vấn đề |
|---|---|---|
| B1 | `orders/route.ts:38-40` | `while (await prisma.order.findUnique(...))` — vòng lặp không giới hạn, có thể treo nếu DB có quá nhiều mã WD-xxxx |
| B2 | `templates/[slug]/page.tsx` | Thiếu `revalidate` → detail page bị static hoàn toàn sau deploy |
| B3 | `admin/templates/page.tsx` | Link `/admin/templates/new` và `/admin/templates/[id]/edit` dẫn đến 404 |
| B4 | `checkout/page.tsx` | Giá gói không sync với DB `service_packages` |
| B5 | `admin/orders/page.tsx` | `take: 50` cứng — không có pagination, không thể xem đơn cũ hơn |
| B6 | `admin/customers/page.tsx` | `take: 50` cứng — tương tự orders |
| B7 | `api/orders/route.ts` | Không validate trùng email trước khi tạo customer — có thể tạo duplicate nếu email null |

---

## 6. THỨ TỰ ƯU TIÊN FIX

### P0 — Fix ngay (blocking)
1. Tạo `/admin/templates/new` và `/admin/templates/[id]/edit` — link 404 ảnh hưởng UX admin
2. Fix `generateOrderCode()` — bug tiềm ẩn

### P1 — Quan trọng (sprint tiếp theo)
3. Thêm `revalidate = 60` vào `/templates/[slug]/page.tsx`
4. Trang chi tiết đơn hàng + cập nhật trạng thái `/admin/orders/[id]`
5. Sync giá checkout với DB `service_packages`
6. Trang xác nhận đơn hàng `/checkout/success`

### P2 — Cải thiện
7. Trang chi tiết khách hàng `/admin/customers/[id]`
8. Search/filter trên admin orders, customers, templates
9. Trang `/templates` — danh sách đầy đủ
10. Trang 404 custom

### P3 — Tính năng mới
11. `/admin/revenue` — báo cáo tài chính
12. `/admin/projects` — quản lý dự án Gói B/C
13. Email xác nhận đơn hàng
14. Phân trang thực sự (thay thế hardcode 50)
