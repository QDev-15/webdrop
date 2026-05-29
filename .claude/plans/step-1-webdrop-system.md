# Step 1 — webdrop.vn Sales Site
> Thời gian: 3 tuần | Status: ✅ UI hoàn thành | 1.6 DB/API còn lại

## Mockup tham chiếu
| Mockup (documents/) | → Next.js |
|---|---|
| `index.html` | `app/(site)/page.tsx` |
| `template_detail_page.html` | `app/(site)/templates/[slug]/page.tsx` |
| `checkout_page.html` | `app/(site)/checkout/page.tsx` |
| `admin_dashboard.html` | `app/(admin)/admin/page.tsx` |

---

## Tasks

### 1.1 Design System
- [x] `src/styles/globals.css` — CSS vars, Bootstrap 5.3.3, utility classes, tất cả components
- [x] `app/layout.tsx` — DM Sans font, import globals.css

### 1.2 Landing Page
- [x] `NavBar.tsx` — transparent → scrolled, mobile hamburger + overlay
- [x] `HeroSlider.tsx` — 5 slides, auto-play 5s, keyboard nav, dot indicators
- [x] `HowItWorks.tsx` — 4 bước, reveal animation
- [x] `TemplateGrid.tsx` — filter tabs, template cards hover
- [x] `WhyUs.tsx` — dark section, 4 items grid
- [x] `PricingSection.tsx` — 3 gói, hot badge
- [x] `Reviews.tsx` — 3 testimonials
- [x] `CTASection.tsx` — green CTA section
- [x] `Footer.tsx` — links, contact info, map
- [x] `RevealObserver.tsx` — IntersectionObserver cho reveal animation
- [x] `src/data/templates.ts`, `pricing.ts`

### 1.3 Template Detail Page
- [x] `app/(site)/templates/[slug]/page.tsx` + `TemplateDetailClient.tsx`
- [x] Gallery + thumbnails click-to-switch
- [x] Tabs: Tính năng / Các trang / Kỹ thuật / Đánh giá
- [x] Buy sidebar: giá, nút mua, includes list

### 1.4 Checkout Page
- [x] `app/(site)/checkout/page.tsx` + `CheckoutClient.tsx`
- [x] 3-step wizard: Thông tin → Gói dịch vụ → Thanh toán
- [x] Validation client-side, Suspense wrap

### 1.5 Admin Dashboard
- [x] `AdminLayout.tsx` — sidebar 214px, topbar, active nav
- [x] `app/(admin)/admin/page.tsx` — stats cards + recent orders table
- [x] `app/(admin)/admin/orders/page.tsx` — bảng đơn hàng
- [x] `app/(admin)/admin/customers/page.tsx` — bảng khách hàng

### 1.6 Database & API (chưa làm — cần PostgreSQL)
- [ ] Setup PostgreSQL local
- [ ] `npx prisma migrate dev --name init`
- [ ] `prisma/seed.ts` — 3 template, 1 admin user, 3 đơn test
- [ ] `app/api/templates/route.ts` — GET list
- [ ] `app/api/orders/route.ts` — POST tạo đơn
- [ ] `app/api/admin/stats/route.ts` — GET stats (protected)
- [ ] `middleware.ts` — auth guard cho `/admin`

---

## Done khi
- [x] `npm run build` — 6 routes build thành công, không lỗi TypeScript
- [ ] DB + API kết nối — cần PostgreSQL setup (Step 3 VPS hoặc Docker local)
