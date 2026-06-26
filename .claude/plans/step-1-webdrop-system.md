# Step 1 — webdrop.store Sales Site
> Thời gian: 3 tuần | Status: ✅ HOÀN THÀNH

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
- [x] `app/(admin)/admin/page.tsx` — stats cards + recent orders (real DB data)
- [x] `app/(admin)/admin/orders/page.tsx` — bảng đơn hàng (real DB data)
- [x] `app/(admin)/admin/customers/page.tsx` — bảng khách hàng (real DB data)

### 1.6 Database & API
- [x] Setup PostgreSQL local (port 5432, DB: `webdrop_system`)
- [x] `.env.local` — DATABASE_URL + SESSION_SECRET
- [x] `npx prisma migrate dev --name init` — migration `20260530032745_init`
- [x] `prisma/seed.ts` — 6 templates, 6 industries, 3 gói, 1 admin, 6 settings
- [x] `app/api/templates/route.ts` — GET list published
- [x] `app/api/templates/[slug]/route.ts` — GET single
- [x] `app/api/orders/route.ts` — POST tạo đơn (upsert customer, calc price)
- [x] `app/api/admin/stats/route.ts` — GET dashboard stats
- [x] `app/api/admin/templates/route.ts` + `[id]/route.ts`
- [x] `app/api/admin/orders/route.ts` + `[id]/route.ts`
- [x] `app/api/admin/customers/route.ts`
- [x] `app/api/admin/settings/route.ts`
- [x] `app/api/auth/login/route.ts` + `logout/route.ts`
- [x] `middleware.ts` — auth guard `/admin/*` + `/api/admin/*`, Edge-compatible HMAC verify

### 1.7 Security fixes (sau review)
- [x] `src/lib/auth.ts` — Token có `exp` field, check expiry khi verify
- [x] `src/lib/auth.ts` — Dùng `timingSafeEqual` cho HMAC signature comparison
- [x] `src/lib/auth.ts` — Throw error nếu `SESSION_SECRET` không được set
- [x] `middleware.ts` — Return 500 nếu `SESSION_SECRET` thiếu, pass secret vào `verifyTokenEdge`
- [x] Admin pages — Fix `in_progress` → CSS class `in-progress` (dùng `replaceAll('_','-')`)
- [x] Admin pages — Fix sort mutation (`[...arr].sort(...)`)
- [x] Admin pages — Fix count display đúng total từ DB

---

## Done khi
- [x] `npm run build` — 25 routes build thành công, không lỗi TypeScript
- [x] Login API: `POST /api/auth/login` → 200 với session cookie
- [x] Admin stats API (có cookie): 200 với real data từ PostgreSQL
- [x] Unauthorized: 401 khi không có session cookie
- [x] Templates API: 6 templates từ DB

## Thông tin kỹ thuật
- **Admin login**: admin@webdrop.store / webdrop@2025
- **DB**: PostgreSQL 18 local, database `webdrop_system`
- **Auth**: Custom JWT-like tokens, HMAC-SHA256, httpOnly cookie `wd_session`, 7 ngày
- **Next.js**: 16.2.6 (Turbopack)
