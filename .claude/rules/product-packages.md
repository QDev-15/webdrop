# Product Package Rules

## Gói A — Template thuần (HTML/CSS/Bootstrap)

**Tiêu chí bắt buộc cho mỗi template:**
- Mở thẳng trên trình duyệt — không cần build, không cần server
- Bootstrap 5.3.3 CDN
- Responsive từ 320px đến 4K
- DM Sans font
- Có live demo link khi bán
- Bàn giao: file ZIP (HTML + CSS + JS + assets)

**Loại:**
- `web-template` — Landing page / multi-page website
- `admin-template` — Dashboard quản trị

**Giá bán:**
| Loại | Đơn lẻ | Bundle 5 |
|---|---|---|
| 1 trang | 199k–499k | ~1.5tr |
| Multi-page | 499k–999k | ~3tr |
| Admin | 699k–1.499k | ~4tr |

---

## Gói B — Website chuẩn (chức năng cố định)

**Tiêu chí bắt buộc:**
- React SPA + PHP API + SQLite — deploy upload là chạy
- Hosting yêu cầu: PHP + `pdo_sqlite`
- URL: `/` frontend, `/admin` quản trị
- Seed data mặc định khi deploy lần đầu
- Kèm `config.php` (comment tiếng Việt), `schema.sql`
- `.htaccess` chặn truy cập `.db`

**Bậc giá:**
| Gói | Tính năng | Giá |
|---|---|---|
| Basic | 1 trang + form + admin | 3tr–5tr |
| Standard | 5–7 trang + blog + admin | 7tr–12tr |
| Pro | 10+ trang + đa ngôn ngữ + SEO + admin | 15tr–22tr |

Cài đặt hosting + domain: +500k–1tr (tính riêng)

---

## Gói C — Full custom

**Process bắt buộc:**
1. Ký checklist scope trước khi bắt đầu (tránh scope creep)
2. Phase 1: Wireframe → Design → Khách duyệt
3. Phase 2: Phát triển → Test → Deploy → Bàn giao

**Tùy chọn bàn giao:**
- Bản build deploy sẵn: included
- Source code: +20–30% giá trị
- Cài đặt hosting: tính riêng
- Bảo trì: 1tr–3tr/tháng

---

## Thị trường mục tiêu (ưu tiên)
1. Nhà hàng / Quán ăn / Cafe
2. Spa / Thẩm mỹ / Làm đẹp
3. Bất động sản
4. Agency / Portfolio cá nhân
5. Landing page sản phẩm / Dịch vụ

---

## Quyết định kỹ thuật đã chốt
- Template không build system → khách tự chỉnh dễ
- Luôn có demo live → tăng conversion rate
- Gói C bắt buộc ký scope checklist → tránh scope creep
- Frontend + Admin cùng 1 React project, tách route `/admin`
- Cloudflare R2 cho ảnh/media (free bandwidth)
- PostgreSQL cho System DB (reporting mạnh)
- SQLite FK ON bắt buộc
