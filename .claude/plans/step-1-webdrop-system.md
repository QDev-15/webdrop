# Plan: Step 1 — webdrop.vn Sales Site

> **Vị trí trong Master Roadmap:** Step 1 (sau Step 0 foundation)
> **Thời gian:** ~3 tuần
> **Deliverable:** Trang bán hàng hoạt động local, sẵn sàng deploy

## Mục tiêu

Build webdrop.vn từ mockup HTML có sẵn trong `documents/` sang Next.js.
Cần có trước khi có hàng để bán (template), vì đây là "cửa hàng".

---

## Nguồn tham chiếu (mockup sẵn có)

| Mockup | Path | Convert sang |
|---|---|---|
| Landing page | `documents/index.html` | `app/(site)/page.tsx` |
| Template detail | `documents/template_detail_page.html` | `app/(site)/templates/[slug]/page.tsx` |
| Checkout | `documents/checkout_page.html` | `app/(site)/checkout/page.tsx` |
| Admin dashboard | `documents/admin_dashboard.html` | `app/(admin)/admin/page.tsx` |

---

## 1.1 — Design System (0.5 ngày)

**File tạo:**
- `Sources/system/src/styles/globals.css` — CSS vars + typography + utility classes

**Nội dung:**
- Copy nguyên `:root` CSS vars từ `documents/index.html`
- Thêm utility classes: `.wd-container`, `.sec-pad`, `.reveal`, `.reveal-d1/d2/d3`
- Font DM Sans load qua `next/font/google` (đã có trong `app/layout.tsx`)
- Reset và base styles

**UI components:**
- `Sources/system/src/components/ui/Button.tsx`
- `Sources/system/src/components/ui/Badge.tsx`
- `Sources/system/src/components/ui/Card.tsx`

---

## 1.2 — Landing Page (3 ngày)

**File chính:** `Sources/system/app/(site)/page.tsx`

**Components (`Sources/system/src/components/site/`):**
| Component | Mô tả |
|---|---|
| `NavBar.tsx` | Transparent → `.scrolled` khi scroll >60px, mobile hamburger |
| `HeroSlider.tsx` | 5 slides, auto-play, dot indicators, CTA button |
| `HowItWorks.tsx` | 3 bước có icon, reveal animation |
| `TemplateGrid.tsx` | Filter tabs (All/Web/Admin), card grid, hover effect |
| `PricingSection.tsx` | 3 pricing cards (Gói A/B/C), hot badge |
| `Reviews.tsx` | Testimonials carousel |
| `CTASection.tsx` | Dark section, CTA button |
| `Footer.tsx` | Links, social, copyright |

**Data:** Hardcode trong `src/data/templates.ts`, `src/data/pricing.ts` trước — kết nối DB sau ở 1.6.

**IntersectionObserver** cho `.reveal` animation (vanilla JS trong `useEffect`).

---

## 1.3 — Template Detail Page (1.5 ngày)

**File:** `Sources/system/app/(site)/templates/[slug]/page.tsx`

**Components:**
- `TemplateGallery.tsx` — ảnh chính + thumbnails, click zoom
- `TabPanel.tsx` — 4 tabs: Tính năng / Các trang / Kỹ thuật / Đánh giá
- `BuySidebar.tsx` — giá, nút mua, badge "Đã bán X lần"

**Data:** Static map `slug → template data` trước, sau dùng API.

---

## 1.4 — Checkout Page (1.5 ngày)

**File:** `Sources/system/app/(site)/checkout/page.tsx`

**3-step wizard:**
1. Thông tin khách hàng (name, email, phone, note)
2. Chọn gói dịch vụ (hiện thị gói đang xem)
3. Thanh toán (QR bank transfer, hướng dẫn)

**Validation:** Client-side, không library nặng.
**State:** `useState` trong component, không cần global state.

---

## 1.5 — Admin Dashboard (2 ngày)

**Files:**
- `Sources/system/app/(admin)/admin/page.tsx` — stats overview (doanh thu, đơn hàng, khách)
- `Sources/system/app/(admin)/admin/orders/page.tsx` — bảng đơn hàng, filter status
- `Sources/system/app/(admin)/admin/customers/page.tsx` — bảng khách hàng

**Layout component:**
- `Sources/system/src/components/admin/AdminLayout.tsx` — sidebar 214px + main area
- `Sources/system/src/components/admin/AdminSidebar.tsx` — nav items, active state
- CSS: sidebar `var(--sidebar)` = `#111009`, active item `#4ade80`

**Dùng `(admin)/layout.tsx`** để wrap AdminLayout cho tất cả admin pages.

---

## 1.6 — Database & API (2 ngày)

**Setup PostgreSQL:**
```bash
# Option A: Docker Compose (recommended local)
# Option B: Native PostgreSQL install
```

**Prisma:**
```bash
cd Sources/system
npx prisma migrate dev --name init
npx prisma db seed  # tạo file prisma/seed.ts
```

**Seed data (`Sources/system/prisma/seed.ts`):**
- 3 template mẫu (agency-web, spa-beauty, restaurant)
- 1 superadmin user
- 3 đơn hàng test với status khác nhau

**API Routes (`Sources/system/app/api/`):**
| Route | Method | Mô tả |
|---|---|---|
| `api/templates/route.ts` | GET | List templates (filter by category) |
| `api/templates/[slug]/route.ts` | GET | Template detail |
| `api/orders/route.ts` | POST | Tạo đơn hàng mới |
| `api/admin/stats/route.ts` | GET | Dashboard stats (protected) |
| `api/admin/orders/route.ts` | GET/PUT | Quản lý đơn (protected) |

**Auth admin:** Middleware `Sources/system/middleware.ts` — check session, redirect `/login` nếu chưa auth.

---

## Checklist hoàn thành Step 1

- [ ] `npm run dev` → không lỗi TypeScript, không console error
- [ ] `/` — landing page render đúng, responsive 320px+, slider chạy, reveal animation hoạt động
- [ ] `/templates/[slug]` — gallery, tabs, sidebar hiển thị đúng
- [ ] `/checkout` — 3-step form điều hướng đúng, validation hoạt động
- [ ] `/admin` — redirect về `/admin/login` nếu chưa auth
- [ ] `/admin` (đã login) — stats hiển thị, sidebar active đúng trang
- [ ] `npx prisma migrate dev` — không lỗi
- [ ] Seed chạy được: có data trong DB
- [ ] API `/api/templates` — trả về JSON đúng format
- [ ] `npm run build` — build production không lỗi

---

## Timeline chi tiết

| Ngày | Việc |
|---|---|
| 1 | Design system CSS + UI components cơ bản |
| 2–4 | Landing page (NavBar, Hero, HowItWorks, TemplateGrid) |
| 5 | Landing page (Pricing, Reviews, CTA, Footer) |
| 6–7 | Template detail page |
| 8–9 | Checkout page |
| 10–11 | Admin dashboard + layout |
| 12–13 | Admin orders + customers pages |
| 14–15 | Database setup, Prisma migrate, seed, API routes |
