# Step 1 — webdrop.vn Sales Site
> Thời gian: 3 tuần | Deliverable: Trang bán hàng chạy local, sẵn sàng deploy

## Mockup tham chiếu
| Mockup (documents/) | → Next.js |
|---|---|
| `index.html` | `app/(site)/page.tsx` |
| `template_detail_page.html` | `app/(site)/templates/[slug]/page.tsx` |
| `checkout_page.html` | `app/(site)/checkout/page.tsx` |
| `admin_dashboard.html` | `app/(admin)/admin/page.tsx` |

---

## Tasks

### 1.1 Design System (0.5 ngày)
- [ ] `src/styles/globals.css` — CSS vars (copy từ `documents/index.html`), utility classes (`.wd-container`, `.sec-pad`, `.reveal`)
- [ ] `src/components/ui/Button.tsx`, `Badge.tsx`, `Card.tsx`

### 1.2 Landing Page (3 ngày)
- [ ] `NavBar.tsx` — transparent → scrolled khi scroll > 60px, mobile menu
- [ ] `HeroSlider.tsx` — 5 slides, auto-play, dot indicators
- [ ] `HowItWorks.tsx` — 3 bước, reveal animation
- [ ] `TemplateGrid.tsx` — filter tabs (All / Web / Admin), cards
- [ ] `PricingSection.tsx` — 3 gói A/B/C, hot badge
- [ ] `Reviews.tsx` — testimonials
- [ ] `Footer.tsx` — links, social, copyright
- [ ] `src/data/templates.ts`, `pricing.ts` — hardcode data tạm

### 1.3 Template Detail Page (1.5 ngày)
- [ ] `app/(site)/templates/[slug]/page.tsx`
- [ ] `TemplateGallery.tsx` — ảnh chính + thumbnails
- [ ] `TabPanel.tsx` — 4 tabs: Tính năng / Các trang / Kỹ thuật / Đánh giá
- [ ] `BuySidebar.tsx` — giá, nút mua, badge đã bán

### 1.4 Checkout Page (1.5 ngày)
- [ ] `app/(site)/checkout/page.tsx`
- [ ] 3-step wizard: Thông tin → Gói dịch vụ → Thanh toán (QR)
- [ ] Validation client-side

### 1.5 Admin Dashboard (2 ngày)
- [ ] `src/components/admin/AdminLayout.tsx` — sidebar 214px + main
- [ ] `app/(admin)/layout.tsx` — wrap AdminLayout
- [ ] `app/(admin)/admin/page.tsx` — stats: doanh thu, đơn hàng, khách
- [ ] `app/(admin)/admin/orders/page.tsx` — bảng đơn hàng, filter status
- [ ] `app/(admin)/admin/customers/page.tsx` — bảng khách hàng

### 1.6 Database & API (2 ngày)
- [ ] Setup PostgreSQL local (Docker hoặc native)
- [ ] `npx prisma migrate dev --name init`
- [ ] `prisma/seed.ts` — 3 template, 1 admin user, 3 đơn test
- [ ] `app/api/templates/route.ts` — GET list
- [ ] `app/api/templates/[slug]/route.ts` — GET detail
- [ ] `app/api/orders/route.ts` — POST tạo đơn
- [ ] `app/api/admin/stats/route.ts` — GET stats (protected)
- [ ] `middleware.ts` — redirect `/admin/login` nếu chưa auth

---

## Done khi
- [ ] `npm run dev` không lỗi TS, không console error
- [ ] `/` render đúng, responsive 320px+, slider + reveal hoạt động
- [ ] `/templates/agency-web` — gallery, tabs, sidebar đúng
- [ ] `/checkout` — 3 steps điều hướng đúng
- [ ] `/admin` chưa login → redirect `/admin/login`
- [ ] `/admin` đã login → stats hiển thị
- [ ] `npm run build` không lỗi
