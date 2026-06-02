# Request Workflow — Sources/system

> Mô tả toàn bộ hành trình một request từ browser đi qua những file nào, theo thứ tự nào.
> Codebase: `Sources/system/` — Next.js 16, App Router, Prisma 5, Neon PostgreSQL.

---

## 1. CẤU TRÚC THƯ MỤC — Ý NGHĨA TỪNG FOLDER

```
Sources/system/
│
├── middleware.ts              ← Chạy ĐẦU TIÊN, trước mọi request
│
├── app/                       ← Toàn bộ routes (Next.js App Router)
│   ├── layout.tsx             ← Root layout: <html>, <body>, load CSS, font
│   ├── not-found.tsx          ← Trang 404 toàn cục
│   │
│   ├── (site)/                ← Route group: trang bán hàng public (không ảnh hưởng URL)
│   │   ├── layout.tsx         ← Layout cho site: thêm <NavBar /> vào mọi trang
│   │   ├── page.tsx           → URL: /          (Homepage)
│   │   ├── templates/
│   │   │   ├── page.tsx       → URL: /templates
│   │   │   ├── loading.tsx    ← Skeleton khi /templates đang load
│   │   │   └── [slug]/
│   │   │       ├── page.tsx   → URL: /templates/agency-web
│   │   │       ├── loading.tsx
│   │   │       ├── error.tsx  ← Error boundary khi component crash
│   │   │       └── TemplateDetailClient.tsx  ← Client component: gallery, tabs
│   │   ├── blog/
│   │   │   ├── page.tsx       → URL: /blog
│   │   │   ├── loading.tsx
│   │   │   └── [slug]/
│   │   │       ├── page.tsx   → URL: /blog/huong-dan-fnb
│   │   │       └── loading.tsx
│   │   ├── pricing/page.tsx   → URL: /pricing
│   │   ├── about/page.tsx     → URL: /about
│   │   ├── contact/page.tsx   → URL: /contact
│   │   ├── faq/page.tsx       → URL: /faq
│   │   └── policies/[slug]/
│   │       └── page.tsx       → URL: /policies/privacy | terms | refund
│   │
│   ├── (checkout)/            ← Route group: luồng mua hàng
│   │   ├── layout.tsx         ← Layout rỗng (pass-through)
│   │   └── checkout/
│   │       ├── page.tsx       → URL: /checkout
│   │       ├── CheckoutClient.tsx  ← Client component: form 3 bước
│   │       └── success/
│   │           └── page.tsx   → URL: /checkout/success?code=WD-xxx&type=template
│   │
│   ├── (admin)/               ← Route group: trang quản trị
│   │   ├── layout.tsx         ← Layout rỗng (pass-through)
│   │   └── admin/
│   │       ├── loading.tsx    ← Admin skeleton dùng chung
│   │       ├── page.tsx       → URL: /admin (dashboard)
│   │       ├── login/page.tsx → URL: /admin/login
│   │       ├── orders/
│   │       │   ├── page.tsx + loading.tsx  → /admin/orders
│   │       │   └── [id]/
│   │       │       ├── page.tsx + loading.tsx  → /admin/orders/5
│   │       │       └── OrderStatusUpdater.tsx  ← Client: radio buttons update status
│   │       ├── customers/
│   │       │   ├── page.tsx + loading.tsx  → /admin/customers
│   │       │   ├── new/page.tsx + loading.tsx
│   │       │   └── [id]/page.tsx + loading.tsx
│   │       ├── templates/
│   │       │   ├── page.tsx + loading.tsx
│   │       │   ├── new/page.tsx + loading.tsx
│   │       │   └── [id]/edit/page.tsx + loading.tsx
│   │       ├── posts/         ← Quản lý blog
│   │       │   ├── page.tsx + loading.tsx
│   │       │   ├── new/page.tsx + loading.tsx
│   │       │   └── [id]/edit/page.tsx + loading.tsx
│   │       ├── contacts/
│   │       │   ├── page.tsx + loading.tsx
│   │       │   └── ContactList.tsx  ← Client: expand/collapse + status update
│   │       ├── projects/
│   │       │   ├── page.tsx + loading.tsx
│   │       │   └── [id]/
│   │       │       ├── page.tsx + loading.tsx
│   │       │       └── ProjectDetailClient.tsx  ← Client: milestones + notes
│   │       ├── revenue/page.tsx + loading.tsx
│   │       └── settings/page.tsx + loading.tsx
│   │
│   └── api/                   ← API Routes (trả JSON hoặc file)
│       ├── auth/
│       │   ├── login/route.ts    POST → xác thực + đặt cookie session
│       │   └── logout/route.ts   POST → xóa cookie session
│       ├── orders/route.ts       POST → tạo đơn hàng (public)
│       ├── contact/route.ts      POST → lưu form liên hệ (public)
│       ├── packages/route.ts     GET  → danh sách gói dịch vụ (public)
│       ├── download/route.ts     GET  → trả file ZIP (public, verify bằng order code)
│       ├── templates/
│       │   ├── route.ts          GET  → danh sách templates (public)
│       │   └── [slug]/route.ts   GET  → chi tiết template (public)
│       └── admin/                ← Tất cả đều cần session cookie
│           ├── stats/route.ts    GET  → thống kê dashboard
│           ├── orders/
│           │   ├── route.ts      GET  (filter, search, pagination)
│           │   └── [id]/route.ts GET + PATCH (detail + update status)
│           ├── customers/
│           │   ├── route.ts      GET + POST
│           │   └── [id]/route.ts GET + PATCH
│           ├── templates/
│           │   ├── route.ts      GET + POST
│           │   └── [id]/route.ts PATCH + DELETE
│           ├── posts/
│           │   ├── route.ts      GET + POST
│           │   └── [id]/route.ts GET + PATCH + DELETE
│           ├── contacts/
│           │   ├── route.ts      GET
│           │   └── [id]/route.ts PATCH (đổi status: new→read→replied)
│           ├── projects/
│           │   ├── [id]/route.ts GET + PATCH
│           │   ├── [id]/milestones/[mid]/route.ts  PATCH (toggle done/pending)
│           │   └── [id]/notes/route.ts             POST (thêm ghi chú)
│           ├── revenue/route.ts  GET + POST (báo cáo + thêm chi phí)
│           └── settings/route.ts GET + POST
│
├── src/                       ← Source code dùng chung (không phải route)
│   ├── components/
│   │   ├── site/              ← Components cho trang bán hàng public
│   │   │   ├── NavBar.tsx          'use client' — fixed nav, scroll detection
│   │   │   ├── Footer.tsx          Server — 4 cột + map + bottom bar
│   │   │   ├── HeroSlider.tsx      'use client' — slider 5 slides tự động
│   │   │   ├── HowItWorks.tsx      Server — section "Quy trình 3 bước"
│   │   │   ├── WhyUs.tsx           Server — section "Tại sao chọn chúng tôi"
│   │   │   ├── PricingSection.tsx  Server — bảng giá 3 gói
│   │   │   ├── Reviews.tsx         Server — testimonials khách hàng
│   │   │   ├── CTASection.tsx      Server — call-to-action cuối trang
│   │   │   ├── TemplateGrid.tsx    'use client' — grid + filter + pagination
│   │   │   └── RevealObserver.tsx  'use client' — IntersectionObserver cho .reveal
│   │   └── admin/             ← Components cho trang quản trị
│   │       ├── AdminLayout.tsx      'use client' — shell: sidebar + topbar + content
│   │       ├── AdminLoadingPage.tsx Server — skeleton loading toàn trang admin
│   │       ├── TemplateForm.tsx     'use client' — form tạo/sửa template
│   │       └── PostForm.tsx         'use client' — form tạo/sửa bài blog (có tab SEO)
│   ├── data/
│   │   ├── templates.ts       ← Mock data 6 templates (fallback khi DB fail)
│   │   └── pricing.ts         ← Dữ liệu giá các gói (dùng cho PricingSection)
│   └── lib/
│       ├── prisma.ts          ← PrismaClient singleton (Neon-aware, URL-change detection)
│       └── auth.ts            ← Mã hoá password (scrypt), tạo/xác minh session token (HMAC)
│
├── prisma/
│   ├── schema.prisma          ← Định nghĩa models, quan hệ, enums → PostgreSQL
│   └── seed.ts                ← Dữ liệu khởi tạo: 31 templates, 6 industries, 3 gói, admin user
│
├── .env                       ← Biến môi trường (DATABASE_URL, SESSION_SECRET)
├── middleware.ts              ← Edge runtime: guard /admin/* và /api/admin/*
├── next.config.ts             ← Cấu hình Next.js
├── tailwind.config.ts         ← (nếu có)
└── package.json               ← Scripts: dev, build, db:push, db:seed
```

---

## 2. HÀNH TRÌNH REQUEST — 4 LOẠI CHÍNH

### Loại A — Trang Public (ví dụ: GET /templates)
### Loại B — Trang Admin (ví dụ: GET /admin/orders)
### Loại C — API Public (ví dụ: POST /api/orders)
### Loại D — API Admin (ví dụ: GET /api/admin/stats)

---

## LOẠI A — Trang Public: `GET /templates`

```
Browser
  │
  ▼
┌─────────────────────────────────────────────┐
│  middleware.ts  (Edge Runtime)              │
│  Kiểm tra config.matcher:                  │
│  ['/admin/:path*', '/api/admin/:path*']     │
│  /templates KHÔNG khớp → pass through       │
└─────────────────────┬───────────────────────┘
                       │ NextResponse.next()
                       ▼
┌─────────────────────────────────────────────┐
│  app/layout.tsx  (RootLayout)               │
│  • Bọc <html lang="vi">                     │
│  • <body className={dmSans.variable}>       │
│  • import globals.css                       │
│    → CSS variables (:root), Bootstrap link  │
└─────────────────────┬───────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────┐
│  app/(site)/layout.tsx  (SiteLayout)        │
│  • Render <NavBar />                        │
│  • Render {children}                        │
└─────────────────────┬───────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────┐
│  app/(site)/templates/loading.tsx           │
│  (Suspense boundary — hiện NGAY tức thì)   │
│  • Skeleton: hero + 9 card pulse animation  │
│  • Không cần data, render đồng bộ           │
└─────────────────────┬───────────────────────┘
                       │ Sau khi page resolve:
                       ▼
┌─────────────────────────────────────────────┐
│  app/(site)/templates/page.tsx              │
│  async Server Component                     │
│                                             │
│  export const revalidate = 60              │
│  ← ISR: cache 60s, sau đó rebuild nền      │
│                                             │
│  1. getTemplates()                          │
│     └─ import prisma từ src/lib/prisma.ts  │
│        └─ PrismaClient singleton           │
│           (check globalThis, URL change)   │
│        └─ prisma.template.findMany({       │
│             where: { status: 'published' } │
│             include: { industry }          │
│             orderBy: { salesCount: 'desc'} │
│           })                               │
│        └─ TCP → Neon PostgreSQL pooler     │
│        └─ SQL: SELECT + JOIN industries    │
│        └─ rows[] trả về                    │
│     └─ map rows → Template[]               │
│        (price: Decimal→string, badge, ...) │
│     catch → trả mockTemplates (6 items)    │
│                                             │
│  2. return JSX:                             │
│     <RevealObserver />                      │
│     <NavBar />  ← (trùng với layout!)      │
│     <div paddingTop:62>                     │
│       <Hero section />                      │
│       <TemplateGrid templates={...} />      │
│     </div>                                  │
│     <Footer />                              │
└─────────────────────┬───────────────────────┘
                       │ HTML string gửi về browser
                       ▼
┌─────────────────────────────────────────────┐
│  BROWSER — Nhận HTML                        │
│  • FCP: paint NavBar, hero, cards           │
│  • Download JS chunks                       │
│  • React Hydration:                         │
│    ① NavBar: useEffect → check scrollY     │
│               → add scroll/keyboard events  │
│    ② RevealObserver: useEffect              │
│         → IntersectionObserver             │
│         → observe tất cả .reveal elements  │
│    ③ TemplateGrid: useState → filter pills │
│         → category buttons interactive      │
│         → TemplateImage onError handlers   │
│    ④ Footer: Server, không cần hydrate     │
└─────────────────────────────────────────────┘
```

---

## LOẠI B — Trang Admin: `GET /admin/orders`

```
Browser
  │
  ▼
┌─────────────────────────────────────────────┐
│  middleware.ts  (Edge Runtime)              │
│  /admin/orders KHỚP matcher                 │
│                                             │
│  1. Đọc cookie 'wd_session'                 │
│  2. verifyTokenEdge(token, secret):         │
│     • Tách token thành [data, sig]          │
│     • Import HMAC key từ SESSION_SECRET     │
│       (crypto.subtle — Web Crypto API)      │
│     • Verify HMAC-SHA256                    │
│     • Parse JSON payload, check exp         │
│                                             │
│  Nếu invalid/expired:                       │
│   → redirect /admin/login?redirect=/admin/orders │
│                                             │
│  Nếu valid:                                 │
│   → NextResponse.next()                     │
└─────────────────────┬───────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────┐
│  app/layout.tsx (RootLayout)                │
│  + app/(admin)/layout.tsx (pass-through)    │
│    return <>{children}</>                   │
└─────────────────────┬───────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────┐
│  app/(admin)/admin/orders/loading.tsx       │
│  import AdminLoadingPage                    │
│  → <AdminLoadingPage type="table" rows={10}>│
│    • Render static admin shell:             │
│      - Sidebar với nav items (dummies)      │
│      - Table skeleton (10 rows pulsing)     │
│    • Hiện NGAY, không cần data              │
└─────────────────────┬───────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────┐
│  app/(admin)/admin/orders/page.tsx          │
│  export const dynamic = 'force-dynamic'    │
│  ← Không cache, luôn fetch mới             │
│                                             │
│  1. getSession() ← src/lib/auth.ts         │
│     • cookies().get('wd_session')           │
│     • verifySessionToken (Node crypto)      │
│     • if null → redirect('/admin/login')   │
│                                             │
│  2. Đọc searchParams:                       │
│     q, status, page                         │
│                                             │
│  3. prisma.order.findMany({                 │
│       where: { status?, OR: [code, title,  │
│                customer.name] },            │
│       include: { customer: {name,phone} }, │
│       orderBy: { createdAt: 'desc' },       │
│       skip: (page-1)*20, take: 20           │
│     })                                      │
│                                             │
│  4. return JSX:                             │
│     <AdminLayout title="Đơn hàng">          │
│       {/* toolbar: search + filter */}      │
│       {/* orders table */}                  │
│       {/* pagination */}                    │
│     </AdminLayout>                          │
└─────────────────────┬───────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────┐
│  src/components/admin/AdminLayout.tsx       │
│  'use client'                               │
│  • usePathname() → highlight active nav     │
│  • useRouter() → handleLogout()             │
│  • Render: sidebar + topbar + content       │
│  • Sidebar: 9 nav items với icons           │
└─────────────────────────────────────────────┘
```

---

## LOẠI C — API Public: `POST /api/orders`

```
Browser (fetch từ CheckoutClient)
  │  POST /api/orders
  │  Body: { name, phone, email, plan, slug, ... }
  ▼
┌─────────────────────────────────────────────┐
│  middleware.ts                              │
│  /api/orders KHÔNG khớp /api/admin/*       │
│  → pass through                             │
└─────────────────────┬───────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────┐
│  app/api/orders/route.ts                    │
│  export async function POST(req)            │
│                                             │
│  1. Parse body JSON                         │
│  2. Validate: name && phone (bắt buộc)     │
│  3. Upsert customer:                        │
│     if email → findFirst({ email })        │
│     if not found → create customer          │
│  4. Tính giá:                               │
│     planPrices = { starter:1.2tr,           │
│                   standard:2.5tr,           │
│                   premium:12tr }            │
│     addonPrices = { maintenance, domain... }│
│     total = basePrice + addonTotal          │
│  5. generateOrderCode():                    │
│     timestamp(base36) + random(3 chars)     │
│     → "WD-K2JABCX"                         │
│  6. prisma.order.create({                   │
│       code, customerId, type,               │
│       items: { create: [...] },             │
│       payments: paymentMethod !== 'consult' │
│         ? { create: { pending } } : undef  │
│     })                                      │
│  7. return { ok: true, code, orderId }      │
└─────────────────────────────────────────────┘
  │  Response JSON
  ▼
Browser → router.push('/checkout/success?code=WD-xxx&type=template&slug=agency-web')
```

---

## LOẠI D — API Admin: `GET /api/admin/stats`

```
Browser (AdminLayout dashboard fetch)
  │  GET /api/admin/stats
  │  Cookie: wd_session=data.sig
  ▼
┌─────────────────────────────────────────────┐
│  middleware.ts                              │
│  /api/admin/stats KHỚP /api/admin/*        │
│  → verifyTokenEdge(cookie, SECRET)          │
│  → if fail: return 401 JSON                 │
│  → if ok: NextResponse.next()               │
└─────────────────────┬───────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────┐
│  app/api/admin/stats/route.ts               │
│                                             │
│  1. getSession() — double-check server side │
│  2. Promise.all([                           │
│       revenue this month (payments paid),   │
│       new orders this month,                │
│       total customers,                      │
│       templates published count,            │
│       recent 5 orders                       │
│     ])                                      │
│  3. return JSON stats                       │
└─────────────────────────────────────────────┘
```

---

## 3. LUỒNG AUTHENTICATION CHI TIẾT

```
/admin/login                POST /api/auth/login
     │                            │
     ▼                            ▼
AdminLoginPage            route.ts POST handler
(form email + password)
     │                     1. prisma.user.findUnique({ email })
     │ fetch POST          2. verifyPassword(input, stored)
     │──────────────────▶     • scrypt(password, salt, 64)
                              • timingSafeEqual (timing-safe)
                           3. createSessionToken({ id, email, role })
                              • JSON payload → base64url
                              • HMAC-SHA256 với SESSION_SECRET
                              • token = "data.sig"
                           4. res.cookies.set('wd_session', token, {
                                httpOnly: true,
                                secure: production,
                                sameSite: 'lax',
                                maxAge: 7 ngày
                              })
                           5. return { ok: true, user: {...} }
     │
     ▼
Redirect → /admin


Mỗi request tiếp theo đến /admin/*:
  Cookie wd_session theo request
  middleware.ts verifyTokenEdge:
    • Web Crypto API (Edge compatible)
    • Verify HMAC + check exp
  Route handler getSession():
    • Node.js crypto (Server compatible)
    • Verify HMAC + check exp (double-check)
```

---

## 4. LUỒNG DOWNLOAD FILE

```
/checkout/success?code=WD-K2J&type=template&slug=agency-web
     │
     ▼
CheckoutSuccessPage (client)
  • useSearchParams → đọc code, type, slug
  • Render DownloadButton với href:
    /api/download?code=WD-K2J&file=template

User click Download
     │
     ▼
GET /api/download?code=WD-K2J&file=template
     │
     ▼
app/api/download/route.ts
  1. Parse: code, file (template|web|admin)
  2. prisma.order.findUnique({ code })
     → Xác minh đơn tồn tại
  3. Kiểm tra type khớp (template↔template, web/admin↔website)
  4. Tuỳ file:
     ─ template: findTemplateDir(slug)
                 → quét Sources/templates/web/{category}/{slug}/
                 → zipDirectories([{ src: templateDir, dest: slug }])
     ─ web:      Sources/products/goi-b/website/ + backend/
                 → zip thành web.zip
     ─ admin:    Sources/products/goi-b/frontend/ + backend/
                 → zip thành admin.zip
  5. zipDirectories() → ReadableStream (archiver → Web Stream bridge)
  6. return new Response(stream, {
       Content-Type: application/zip,
       Content-Disposition: attachment; filename="agency-web.zip"
     })
     ↓ Browser tự download file
```

---

## 5. CÁC FILE ĐẶC BIỆT — VAI TRÒ CỤ THỂ

### `middleware.ts`
- Chạy trên **Edge Runtime** (V8 isolate, không phải Node.js)
- Chỉ xử lý routes khớp `config.matcher`
- Dùng `crypto.subtle` (Web Crypto API) thay vì `crypto` của Node
- Không có Prisma (Edge Runtime không hỗ trợ TCP connections)
- Kết quả: redirect hoặc `NextResponse.next()`

### `src/lib/prisma.ts`
```
import lần đầu:
  globalThis.prisma undefined?
    → createClient() → new PrismaClient()
    → lưu vào globalThis.prisma (tránh tạo nhiều client khi hot reload)

DATABASE_URL thay đổi?
    → $disconnect() client cũ
    → tạo client mới

export prisma ← dùng trong mọi server component và API route
```

### `src/lib/auth.ts`
```
hashPassword(password):
  randomBytes(16) → salt
  scryptSync(password, salt, 64) → hash
  return "salt:hash"

verifyPassword(input, stored):
  tách salt:hash
  scryptSync(input, salt, 64) → derived
  timingSafeEqual(derived, hash)  ← chống timing attack

createSessionToken({ id, email, role }):
  payload = JSON.stringify({ ...data, iat, exp })
  data = base64url(payload)
  sig  = HMAC-SHA256(data, SESSION_SECRET)
  return "data.sig"

getSession():
  cookies().get('wd_session')
  → verifySessionToken(token)
  → return { id, email, role } hoặc null
```

### `loading.tsx` files
```
Tồn tại ở mọi route có DB query.
Next.js bọc page trong <Suspense fallback={loading}>
Khi navigate:
  1. Skeleton render NGAY LẬP TỨC (0ms)
  2. Server fetch data (50-200ms)
  3. Content replace skeleton
```

### `error.tsx` files
```
Chỉ có ở app/(site)/templates/[slug]/error.tsx
'use client' — React Error Boundary

Khi TemplateDetailClient crash:
  → error.tsx hiện thay vì blank screen
  → Nút "Thử lại" gọi reset()
```

### Route groups `(site)`, `(admin)`, `(checkout)`
```
Dấu ngoặc () = route group — KHÔNG ảnh hưởng URL
Chỉ dùng để:
  1. Áp dụng layout riêng cho từng nhóm
  2. Tổ chức code gọn gàng

(site)/layout.tsx    → inject NavBar cho tất cả trang public
(admin)/layout.tsx   → pass-through (AdminLayout nằm trong từng page)
(checkout)/layout.tsx → pass-through
```

### `[slug]`, `[id]` — Dynamic segments
```
[slug] → params.slug → giá trị từ URL
  /templates/agency-web → params.slug = "agency-web"
  /blog/huong-dan-fnb  → params.slug = "huong-dan-fnb"

[id] → params.id
  /admin/orders/5 → params.id = "5"

Trong Next.js 15: params là Promise → await params
```

---

## 6. SERVER vs CLIENT COMPONENTS

| File | Loại | Lý do |
|---|---|---|
| `app/**/page.tsx` | **Server** | Fetch DB, không cần browser API |
| `app/**/layout.tsx` | **Server** | Static structure |
| `app/**/loading.tsx` | **Server** | Static skeleton |
| `NavBar.tsx` | **Client** | usePathname, scroll events, state |
| `TemplateGrid.tsx` | **Client** | useState filter/pagination |
| `HeroSlider.tsx` | **Client** | Timer, animation state |
| `RevealObserver.tsx` | **Client** | window.IntersectionObserver |
| `AdminLayout.tsx` | **Client** | usePathname, useRouter |
| `TemplateForm.tsx` | **Client** | Form state, fetch POST |
| `PostForm.tsx` | **Client** | Form state, tabs, fetch |
| `OrderStatusUpdater.tsx` | **Client** | Radio buttons, fetch PATCH |
| `ContactList.tsx` | **Client** | Expand/collapse, status update |
| `ProjectDetailClient.tsx` | **Client** | Milestone toggle, add note |
| `CheckoutClient.tsx` | **Client** | 3-step form flow |
| `Footer.tsx` | **Server** | Static content |
| `HowItWorks.tsx` | **Server** | Static content |
| `PricingSection.tsx` | **Server** | Static content |

---

## 7. DATABASE — FLOW DỮ LIỆU

```
.env
  DATABASE_URL="postgresql://...@neon.tech/neondb?sslmode=require"
       │
       ▼
src/lib/prisma.ts  ← đọc process.env khi module load
  PrismaClient → kết nối TCP đến Neon PostgreSQL pooler
       │
       ▼
prisma/schema.prisma  ← định nghĩa tables và relations
  models: User, Post, Category, Template, Customer,
          Order, OrderItem, Payment, Project,
          ProjectMilestone, ProjectNote, Revenue,
          Expense, Setting, Contact, Industry, ...
       │
       ▼
Prisma Client API (type-safe):
  prisma.template.findMany(...)  → SELECT query
  prisma.order.create(...)       → INSERT query
  prisma.customer.update(...)    → UPDATE query
       │
       ▼
Neon PostgreSQL (cloud)
  Chứa dữ liệu seed: 31 templates, 6 industries,
  3 service packages, 1 admin user
  Seed script: prisma/seed.ts
  Chạy: npm run db:seed
```

---

## 8. TÓM TẮT NHANH — "File này làm gì?"

| File | Làm gì trong 1 dòng |
|---|---|
| `middleware.ts` | Guard /admin/* — verify cookie trước khi vào trang |
| `app/layout.tsx` | Bọc HTML, inject font + CSS cho toàn app |
| `app/(site)/layout.tsx` | Thêm NavBar cho tất cả trang public |
| `app/(site)/page.tsx` | Render trang chủ: fetch templates từ DB + các section |
| `app/(site)/templates/page.tsx` | Trang /templates: fetch DB + render TemplateGrid có phân trang |
| `app/(site)/templates/[slug]/page.tsx` | Trang chi tiết template: fetch 1 template theo slug |
| `app/(admin)/admin/page.tsx` | Dashboard: hiện stats (doanh thu, đơn mới, khách hàng) |
| `src/lib/prisma.ts` | Tạo/cache Prisma Client, tái tạo khi URL DB thay đổi |
| `src/lib/auth.ts` | Hash/verify password + tạo/xác minh session token |
| `app/api/auth/login/route.ts` | Đăng nhập: verify credentials → set cookie |
| `app/api/orders/route.ts` | Tạo đơn hàng từ checkout form (public) |
| `app/api/download/route.ts` | Trả file ZIP theo order code (template/web/admin) |
| `src/components/site/NavBar.tsx` | Navigation bar fixed, trong suốt ở homepage, solid ở nơi khác |
| `src/components/site/TemplateGrid.tsx` | Grid templates có filter category + phân trang [20/50/100] |
| `src/components/admin/AdminLayout.tsx` | Shell admin: sidebar + topbar + content area |
| `prisma/seed.ts` | Chạy 1 lần: tạo data mẫu vào DB (templates, users, settings) |

---

*File này mô tả codebase tại thời điểm 2026-06-02.*
*Codebase: `Sources/system/` — Next.js 16, App Router, Prisma 5, Neon PostgreSQL.*
