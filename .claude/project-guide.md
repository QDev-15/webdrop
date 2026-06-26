# Hướng Dẫn Dự Án webdrop.store — Dành cho Developer Mới

> Tài liệu này giải thích toàn bộ codebase tại `Sources/system/` — từ cấu trúc thư mục, routing, data fetching, auth, đến workflow tạo feature mới. Mọi giải thích đều gắn với file và dòng code thực tế.

---

## 1. Tổng Quan Dự Án

### Mục đích

webdrop.store là hệ thống bán template website và dịch vụ thiết kế web. Hệ thống gồm hai phần chính chạy trên cùng Next.js app:

- **Trang public** (`/`, `/templates`, `/pricing`, v.v.) — nơi khách hàng xem và đặt mua
- **Trang admin** (`/admin/*`) — nơi quản lý đơn hàng, khách hàng, template, blog, cài đặt

### Tech Stack

| Layer | Công nghệ | Ghi chú |
|---|---|---|
| Framework | Next.js 16 (App Router) | File tại `Sources/system/` |
| Language | TypeScript | Strict mode |
| Database | PostgreSQL (Neon cloud) | Dev dùng Neon free tier |
| ORM | Prisma 5.x | Schema tại `prisma/schema.prisma` |
| Styling | CSS custom properties + Bootstrap 5.3.3 | Không dùng Tailwind |
| Auth | JWT custom (không dùng NextAuth) | `src/lib/auth.ts` |
| Font | DM Sans (Google Fonts) | Load qua `next/font/google` |
| Password hashing | Node.js `scryptSync` (built-in `crypto`) | Không dùng bcrypt trực tiếp trong auth |

**Phụ thuộc chính** (xem `package.json`):
```
next 16.2.6, react 19, @prisma/client 5.22, bcryptjs 3.0, bootstrap 5.3.3
```

### Cấu Trúc Thư Mục Quan Trọng

```
Sources/system/
├── app/                        ← Next.js App Router
│   ├── layout.tsx              ← Root layout: DM Sans font, metadata
│   ├── (site)/                 ← Route group: trang public
│   ├── (checkout)/             ← Route group: checkout
│   ├── (admin)/                ← Route group: admin dashboard
│   ├── api/                    ← API Route Handlers
│   └── not-found.tsx           ← Trang 404 toàn cục
├── src/
│   ├── components/
│   │   ├── site/               ← Components trang public
│   │   └── admin/              ← Components admin
│   ├── lib/
│   │   ├── auth.ts             ← JWT helpers, getSession()
│   │   └── prisma.ts           ← Prisma client singleton
│   └── styles/globals.css      ← CSS vars, design system
└── prisma/
    └── schema.prisma           ← Database schema
```

**Path alias:** `@/*` trỏ tới `./src/*`. Ví dụ: `import { prisma } from '@/lib/prisma'` = `src/lib/prisma.ts`.

---

## 2. App Router — Route Groups và File Conventions

### Route Groups là gì

Route groups là thư mục tên trong `()` — nhóm các route để dùng chung layout mà **không ảnh hưởng URL**.

```
app/(site)/page.tsx             → URL: /
app/(site)/pricing/page.tsx     → URL: /pricing
app/(checkout)/checkout/page.tsx → URL: /checkout
app/(admin)/admin/page.tsx      → URL: /admin
```

Dấu `()` bị Next.js bỏ qua hoàn toàn khi tạo URL.

### Tại sao cần tách group

Mỗi group có layout riêng với mục đích khác nhau:

- `(site)/layout.tsx` — render `<NavBar />` cho tất cả trang public
- `(checkout)/layout.tsx` — layout trống, checkout có nav riêng trong page
- `(admin)/layout.tsx` — wrapper trống, AdminLayout được import thủ công trong từng page

### Layout Nesting

Layout lồng nhau theo cây thư mục:

```
app/layout.tsx              ← Root: <html>, <body>, DM Sans font — áp dụng TẤT CẢ
└── (site)/layout.tsx       ← Thêm <NavBar /> cho mọi trang public
    └── page.tsx            ← Homepage content
    └── templates/[slug]/page.tsx ← Template detail
```

Root layout tại `app/layout.tsx` là nơi duy nhất set `<html lang="vi">` và inject font DM Sans qua `dmSans.variable`.

### Các File Convention Đặc Biệt

| File | Chức năng | Ví dụ trong project |
|---|---|---|
| `page.tsx` | Trang hiển thị tại URL đó | `app/(site)/page.tsx` → `/` |
| `layout.tsx` | Bọc tất cả trang con | `app/(site)/layout.tsx` |
| `loading.tsx` | Skeleton hiển thị khi page đang load | `app/(admin)/admin/loading.tsx` |
| `error.tsx` | Bắt lỗi runtime phía client | `app/(site)/templates/[slug]/error.tsx` |
| `not-found.tsx` | Trang 404 | `app/not-found.tsx` |
| `route.ts` | API endpoint | `app/api/admin/templates/route.ts` |

**loading.tsx thực tế** — Next.js tự động hiển thị file này trong khi `page.tsx` đang fetch data:
```tsx
import AdminLoadingPage from '@/components/admin/AdminLoadingPage'
export default function Loading() {
  return <AdminLoadingPage type="cards" rows={4} />
}
```

**error.tsx** — bắt lỗi client-side, phải có `'use client'`:
```tsx
'use client'
export default function TemplateError({ error, reset }: { error: Error; reset: () => void }) { ... }
```

### Dynamic Routes

Tên thư mục `[slug]` hoặc `[id]` = dynamic segment. Giá trị được truyền qua `params`.

**Quan trọng — Next.js 15+:** `params` và `searchParams` là **Promise**, phải `await`:

```tsx
// app/(site)/templates/[slug]/page.tsx
export default async function TemplateDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params  // bắt buộc await
}

// app/(admin)/admin/templates/page.tsx
export default async function AdminTemplatesPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; category?: string; status?: string; industry?: string }>
}) {
  const sp = await searchParams  // bắt buộc await
  const q  = sp.q?.trim() ?? ''
}
```

---

## 3. Server Component vs Client Component

### Server Component (mặc định)

Mọi file `.tsx` trong `app/` là Server Component trừ khi có `'use client'`. Server Component:
- Chạy hoàn toàn trên server, không gửi JS về browser
- Có thể `async/await` trực tiếp, gọi Prisma, đọc DB
- **Không được dùng:** `useState`, `useEffect`, `useRouter`, `useSearchParams`, `window`, `document`

**Ví dụ Server Component** — `app/(admin)/admin/page.tsx`:
```tsx
export default async function AdminDashboardPage() {
  const [totalOrders, recentOrders] = await Promise.all([
    prisma.order.count(),
    prisma.order.findMany({ take: 5, orderBy: { createdAt: 'desc' }, include: { customer: true } }),
  ])
  return <AdminLayout title="Tổng quan">...</AdminLayout>
}
```

### Client Component

Thêm `'use client'` ở dòng đầu tiên của file. Client Component:
- Có thể dùng hooks: `useState`, `useEffect`, `useRouter`, `usePathname`
- Chạy trên browser, có thể tương tác
- **Không được** gọi Prisma trực tiếp (không có DB connection trên browser)

**Ví dụ Client Component** — `src/components/admin/AdminLayout.tsx`:
```tsx
'use client'
import { usePathname, useRouter } from 'next/navigation'
export default function AdminLayout({ children, title }: ...) {
  const pathname = usePathname()  // hook — chỉ dùng được vì 'use client'
}
```

### Pattern Tách XxxClient.tsx

Khi một page cần cả Server (fetch data) lẫn Client (interactive UI), tách thành 2 file:

```
page.tsx              ← Server Component: fetch data từ DB
XxxClient.tsx         ← Client Component: render UI có state
```

**Ví dụ thực tế** — template detail:

`app/(site)/templates/[slug]/page.tsx` (Server):
```tsx
export default async function TemplateDetailPage({ params }: ...) {
  const { slug } = await params
  const row = await prisma.template.findFirst({ where: { slug, status: 'published' }, include: { industry: true } })
  return (
    <div style={{ paddingTop: 62 }}>
      <TemplateDetailClient template={template} />  {/* truyền data xuống */}
    </div>
  )
}
```

`app/(site)/templates/[slug]/TemplateDetailClient.tsx` (Client):
```tsx
'use client'
import { useState } from 'react'
export default function TemplateDetailClient({ template }: { template: Template }) {
  const [activeImg, setActiveImg] = useState(0)  // cần useState → phải 'use client'
  const [activeTab, setActiveTab] = useState(0)
}
```

**Các cặp page/client tương tự trong project:**
- `contact/page.tsx` + `contact/ContactClient.tsx`
- `faq/page.tsx` + `faq/FaqClient.tsx`
- `admin/orders/[id]/page.tsx` + `admin/orders/[id]/OrderStatusUpdater.tsx`
- `admin/projects/[id]/page.tsx` + `admin/projects/[id]/ProjectDetailClient.tsx`

### Quy tắc quan trọng

**Async Server Component KHÔNG được import từ Client Component.** Nếu cần data từ server trong Client Component, phải truyền qua props hoặc dùng API route.

```tsx
// SAI — async component không thể dùng trong 'use client'
'use client'
import ServerFetchComponent from './ServerFetchComponent' // lỗi!

// ĐÚNG — Server Component cha fetch data, truyền xuống Client Component
// page.tsx (Server)
const data = await prisma.post.findMany()
return <ClientComponent data={data} />
```

---

## 4. Data Fetching

### Prisma trực tiếp trong Server Component

Cách phổ biến nhất trong project — gọi Prisma ngay trong `async` page/component:

```tsx
// app/(admin)/admin/templates/page.tsx
;[templates, industries] = await Promise.all([
  prisma.template.findMany({
    where,
    include: { industry: { select: { name: true, slug: true } } },
    orderBy: { createdAt: 'desc' },
  }),
  prisma.industry.findMany({ orderBy: { sortOrder: 'asc' }, select: { slug: true, name: true } }),
])
```

`Promise.all()` để chạy song song — quan trọng khi cần nhiều query độc lập.

### Fetch API trong Client Component

Client Component gọi API routes qua `fetch()`:

```tsx
// src/components/admin/TemplateForm.tsx
const res = mode === 'new'
  ? await fetch('/api/admin/templates', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
  : await fetch(`/api/admin/templates/${id}`, { method: 'PATCH', ... })
```

```tsx
// app/(admin)/admin/settings/page.tsx
useEffect(() => {
  fetch('/api/admin/settings')
    .then(r => r.json())
    .then(data => { if (data.settings) setValues(data.settings) })
}, [])
```

### ISR — Incremental Static Regeneration

Một số trang dùng `revalidate` để cache kết quả và tự làm mới sau một khoảng thời gian:

```tsx
// app/(site)/page.tsx
export const revalidate = 60  // cache 60 giây, sau đó revalidate background
```

Admin pages dùng `force-dynamic` để luôn fetch mới:
```tsx
// app/(admin)/admin/page.tsx
export const dynamic = 'force-dynamic'
```

### generateStaticParams — Pre-render Dynamic Routes

```tsx
// app/(site)/templates/[slug]/page.tsx
export async function generateStaticParams() {
  try {
    const rows = await prisma.template.findMany({ where: { status: 'published' }, select: { slug: true } })
    return rows.map((t: { slug: string }) => ({ slug: t.slug }))
  } catch {
    return mockTemplates.map(t => ({ slug: t.slug }))  // fallback nếu DB lỗi
  }
}
```

### Error Handling Pattern

Toàn project dùng pattern `try/catch` với giá trị mặc định rỗng — tránh crash toàn trang khi DB lỗi:

```tsx
// app/(admin)/admin/templates/page.tsx
let templates = []
try {
  templates = await prisma.template.findMany({ ... })
} catch { /* DB chưa kết nối */ }
// templates vẫn là [] nếu lỗi → trang render "Chưa có template" thay vì crash
```

---

## 5. Prisma ORM

### lib/prisma.ts — Singleton Pattern

File `src/lib/prisma.ts` tạo một PrismaClient duy nhất cho toàn app, tránh tạo quá nhiều connection:

```typescript
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
  prismaUrl: string | undefined
}

// Tạo lại client nếu DATABASE_URL thay đổi (tránh connection cũ sau đổi .env)
const currentUrl = process.env.DATABASE_URL
if (globalForPrisma.prismaUrl && globalForPrisma.prismaUrl !== currentUrl) {
  globalForPrisma.prisma?.$disconnect()
  globalForPrisma.prisma = undefined
}

export const prisma = globalForPrisma.prisma ?? createClient()

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma  // dev: lưu vào globalThis để hot-reload không tạo lại
}
```

Khi dùng: `import { prisma } from '@/lib/prisma'`

### Đọc Schema Prisma

File `prisma/schema.prisma` định nghĩa tất cả bảng. Mỗi `model` = một bảng:

```prisma
model Template {
  id          Int              @id @default(autoincrement())  // PK tự tăng
  name        String
  slug        String           @unique                         // unique index
  price       Decimal
  category    TemplateCategory                                 // enum
  industryId  Int?             @map("industry_id")            // FK nullable, tên cột DB là industry_id
  hasWebsite  Boolean          @default(false) @map("has_website")
  status      PostStatus       @default(draft)
  createdAt   DateTime         @default(now()) @map("created_at")

  industry Industry? @relation(fields: [industryId], references: [id])  // relation

  @@map("templates")  // tên bảng thực trong PostgreSQL là "templates"
}
```

**Prisma dùng camelCase** trong code (`industryId`), nhưng column DB dùng snake_case (`industry_id`) — mapping qua `@map("...")`.

### Các Query Cơ Bản

```typescript
// findMany — lấy nhiều records
const templates = await prisma.template.findMany({
  where: { status: 'published' },
  include: { industry: { select: { name: true } } },
  orderBy: { createdAt: 'desc' },
  take: 9,
  skip: 0,
})

// findFirst — lấy record đầu tiên khớp điều kiện
// Dùng thay findUnique khi filter nhiều cột
const row = await prisma.template.findFirst({
  where: { slug, status: 'published' },
  include: { industry: { select: { name: true } } },
})

// findUnique — lấy theo PK hoặc unique field
const template = await prisma.template.findUnique({ where: { id: parseInt(id) } })

// count — đếm
const total = await prisma.order.count({ where: { status: 'new' } })

// aggregate — tổng hợp
const stats = await prisma.template.aggregate({ _sum: { salesCount: true } })
// dùng: stats._sum.salesCount

// create
const template = await prisma.template.create({
  data: { name, slug, price, category, industryId: industryId || null, status: 'draft' },
})

// update — dùng where PK
const updated = await prisma.template.update({
  where: { id: parseInt(id) },
  data: { name, slug, price },
})

// upsert — create nếu chưa có, update nếu đã có
// app/api/admin/settings/route.ts
await prisma.setting.upsert({
  where: { key },
  update: { value },
  create: { key, value, group: key.split('_')[0] },
})

// delete
await prisma.template.delete({ where: { id: parseInt(id) } })
```

### Include vs Select

```typescript
// include — lấy toàn bộ fields của relation
include: { industry: true }
// → { id, name, slug, description, status, sortOrder }

// include + select — chỉ lấy fields cần thiết (hiệu quả hơn)
include: { industry: { select: { name: true, slug: true } } }
// → { name, slug }
```

### Xử Lý Prisma Errors

```typescript
} catch (e: unknown) {
  const err = e as { code?: string }
  if (err.code === 'P2025') return NextResponse.json({ error: 'Không tìm thấy' }, { status: 404 })
  // P2002 = unique constraint violation (slug đã tồn tại)
  // P2025 = record not found (update/delete)
}
```

### Kiểu TypeScript cho Prisma Queries

```typescript
import { Prisma } from '@prisma/client'

type TemplateWithIndustry = Prisma.TemplateGetPayload<{
  include: { industry: { select: { name: true; slug: true } } }
}>
// → TypeScript tự biết kiểu của template.industry.name
```

### Lệnh Prisma Quan Trọng

```bash
npm run db:push    # push schema lên DB mà không tạo migration file (dùng trong dev)
npm run db:migrate # tạo migration file + apply (dùng khi ready)
npm run db:studio  # mở Prisma Studio GUI để xem/sửa data
npm run db:seed    # chạy file prisma/seed.ts để tạo dữ liệu mẫu
```

---

## 6. API Routes

### Cấu Trúc File

File `route.ts` trong thư mục `app/api/` tạo HTTP endpoint. Tên HTTP method = tên function export:

```typescript
// app/api/admin/templates/route.ts
export async function GET(req: NextRequest) { ... }   // GET /api/admin/templates
export async function POST(req: NextRequest) { ... }  // POST /api/admin/templates

// app/api/admin/templates/[id]/route.ts
export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params  // Next.js 15: params là Promise
}
export async function DELETE(...) { ... }
```

### Auth Check Pattern

**Mọi admin API route** đều kiểm tra session trước khi xử lý:

```typescript
// Pattern chuẩn
export async function GET(req: NextRequest) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  // ...
}

// Route yêu cầu quyền superadmin
export async function POST(req: NextRequest) {
  const session = await getSession()
  if (!session || session.role !== 'superadmin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
}
```

### Validation và Error Handling

```typescript
// Validate bắt buộc
const { name, slug, price, category } = body
if (!name || !slug || !price || !category) {
  return NextResponse.json({ error: 'Thiếu thông tin bắt buộc' }, { status: 400 })
}
```

**Whitelist fields** khi update — không nhận `data: body` trực tiếp:
```typescript
const body = await req.json()
const { name, slug, description, thumbnail, demoUrl, price, category, industryId, status, hasWebsite } = body
// Chỉ những field này mới được update, các field khác (id, createdAt...) bị bỏ qua
```

### revalidatePath — Xóa Cache Sau Khi Mutate

```typescript
import { revalidatePath } from 'next/cache'

// Sau khi tạo/sửa/xóa data
revalidatePath('/')  // xóa cache của homepage để hiện template mới ngay
return NextResponse.json(template, { status: 201 })
```

### Ví Dụ Route Handler Đầy Đủ

```typescript
import { NextRequest, NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'

export async function GET(req: NextRequest) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { searchParams } = new URL(req.url)
  const search = searchParams.get('q')

  const items = await prisma.someModel.findMany({
    where: search ? { name: { contains: search, mode: 'insensitive' } } : {},
    orderBy: { createdAt: 'desc' },
  })
  return NextResponse.json(items)
}

export async function POST(req: NextRequest) {
  const session = await getSession()
  if (!session || session.role !== 'superadmin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await req.json()
  const { name, slug } = body
  if (!name || !slug) return NextResponse.json({ error: 'Thiếu thông tin' }, { status: 400 })

  try {
    const item = await prisma.someModel.create({ data: { name, slug } })
    revalidatePath('/')
    return NextResponse.json(item, { status: 201 })
  } catch (e: unknown) {
    const err = e as { code?: string }
    if (err.code === 'P2002') return NextResponse.json({ error: 'Slug đã tồn tại' }, { status: 409 })
    return NextResponse.json({ error: 'Lỗi server' }, { status: 500 })
  }
}
```

---

## 7. Authentication — Custom JWT

### Cơ Chế Hoạt Động

Dự án dùng JWT custom viết bằng Node.js built-in `crypto`, lưu trong HTTP-only cookie `wd_session`.

**File:** `src/lib/auth.ts`

### Các Function Quan Trọng

```typescript
// Tạo token sau khi login thành công
createSessionToken({ id: user.id, email: user.email, role: user.role })
// → "base64url_payload.base64url_signature"

// Đọc session từ request hiện tại (dùng trong Server Component và API Route)
const session = await getSession()
// → { id, email, role } hoặc null
```

### Login Flow

1. User submit form tại `app/(admin)/admin/login/page.tsx`
2. Gọi `POST /api/auth/login`
3. API tìm user trong DB, verify password, tạo token, set cookie `wd_session` (httpOnly, secure, 7 ngày)
4. Client redirect về `/admin`

### Protect Admin Pages

```typescript
// app/(admin)/admin/posts/page.tsx
const session = await getSession()
if (!session) redirect('/admin/login')
```

### Logout

```typescript
// src/components/admin/AdminLayout.tsx
async function handleLogout() {
  await fetch('/api/auth/logout', { method: 'POST' })
  router.push('/admin/login')
}
```

---

## 8. Components

### src/components/site/ — Trang Public

| Component | Mô tả |
|---|---|
| `NavBar` | Navigation cố định, transparent → solid khi scroll |
| `HeroSlider` | Slider hero, data từ DB `hero_slides` |
| `TemplateGrid` | Grid template cards, filter theo category |
| `PricingSection` | Bảng giá 3 gói |
| `Footer` | Footer động, fetch settings từ DB |
| `RevealObserver` | IntersectionObserver cho animation `.reveal` |
| `HowItWorks` | Section quy trình 3 bước |

**TemplateGrid** — nhận prop `homepage`:
- `homepage={true}`: hiển thị 9 cards, ẩn filter bar, show "Xem tất cả" link
- `homepage={false}` (default): hiển thị filter category, pagination

**NavBar** — Client Component có 3 useEffect:
- Effect 1: scroll listener để set class `scrolled`
- Effect 2: lock body scroll khi mobile menu open
- Effect 3: Escape key đóng mobile menu

### src/components/admin/ — Admin Dashboard

| Component | Mô tả |
|---|---|
| `AdminLayout` | Sidebar + topbar wrapper cho mọi admin page |
| `AdminLoadingPage` | Skeleton loader, 5 kiểu: table/cards/detail/form/chart |
| `TemplateForm` | Form tạo/sửa template (dùng cho cả new và edit) |
| `PostForm` | Form tạo/sửa bài viết blog |

**AdminLayout** — Client Component (dùng `usePathname()` để highlight nav item active):
```tsx
return (
  <AdminLayout title="Tên trang">
    {/* content */}
  </AdminLayout>
)
```

**AdminLoadingPage** — dùng trong `loading.tsx`:
```tsx
// Các kiểu skeleton: 'table' (default), 'cards', 'detail', 'form', 'chart'
<AdminLoadingPage type="cards" rows={6} />
```

**TemplateForm** — mode new hoặc edit:
```tsx
// Mode new
<TemplateForm mode="new" industries={industries} />

// Mode edit
<TemplateForm mode="edit" id={template.id} industries={industries} initial={{ name, slug, ... }} />
```

---

## 9. Design System trong Code

### CSS Custom Properties

Defined tại `src/styles/globals.css`. Dùng trực tiếp qua `var()`:

```tsx
<div style={{ color: 'var(--text)', background: 'var(--surface)', border: '1px solid var(--border)' }}>
```

**Các biến chính:**

```css
--bg: #faf9f7          /* Nền tổng thể */
--surface: #fff        /* Card, panel, nav */
--text: #1a1917        /* Text chính */
--text-2: #6b6760      /* Text phụ */
--accent: #1a6b52      /* Green chính — CTA, link active */
--accent-h: #155a44    /* Accent hover */
--border: #e8e5df      /* Border mặc định */
--dark: #0c0b09        /* Footer background */
--sidebar: #111009     /* Admin sidebar */
```

### CSS Classes Quan Trọng

```css
.wd-container   /* max-width 1100px, padding responsive */
.sec-pad        /* section padding top/bottom responsive */
.reveal         /* animation: opacity:0 translateY(32px) → visible khi scroll vào view */
.eyebrow        /* label nhỏ trên section header, màu accent */
.sec-title      /* tiêu đề section lớn */
.status-badge   /* badge trạng thái admin */
.tc             /* template card */
.pill           /* filter pill button */
.admin-body     /* flex layout admin */
.admin-sidebar  /* sidebar cố định 214px */
.admin-main     /* main area flex:1 */
```

---

## 10. Workflow Tạo Feature Mới — Step by Step

Ví dụ: Thêm tính năng quản lý **Testimonials** (đánh giá từ khách hàng).

### Bước 1 — Thêm Prisma Model

Mở `prisma/schema.prisma`, thêm model mới:

```prisma
model Testimonial {
  id        Int        @id @default(autoincrement())
  name      String
  company   String?
  content   String
  rating    Int        @default(5)
  avatar    String?
  status    PostStatus @default(draft)
  sortOrder Int        @default(0) @map("sort_order")
  createdAt DateTime   @default(now()) @map("created_at")

  @@map("testimonials")
}
```

### Bước 2 — Push Schema lên DB

```bash
cd Sources/system
npm run db:push  # prisma db push + prisma generate
```

Sau lệnh này, bảng `testimonials` tồn tại trong DB và Prisma Client được regenerate với type `Testimonial`.

### Bước 3 — Tạo API Routes

```
app/api/admin/testimonials/route.ts        ← GET list, POST create
app/api/admin/testimonials/[id]/route.ts   ← PATCH update, DELETE
```

Nội dung theo pattern chuẩn (xem phần 6).

### Bước 4 — Tạo Form Component (Client)

Tạo `src/components/admin/TestimonialForm.tsx` — theo pattern `TemplateForm.tsx`:

```typescript
'use client'
import { useState, FormEvent } from 'react'
import { useRouter } from 'next/navigation'

export default function TestimonialForm({ mode, id, initial }: { mode: 'new' | 'edit'; id?: number; initial?: { name: string; content: string } }) {
  const router = useRouter()
  const [form, setForm] = useState({ name: initial?.name ?? '', content: initial?.content ?? '' })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setSaving(true)
    try {
      const res = mode === 'new'
        ? await fetch('/api/admin/testimonials', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) })
        : await fetch(`/api/admin/testimonials/${id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) })
      if (!res.ok) { const d = await res.json(); setError(d.error || 'Lỗi'); return }
      router.push('/admin/testimonials')
      router.refresh()
    } finally { setSaving(false) }
  }
  // ... JSX form
}
```

### Bước 5 — Tạo Admin Pages (Server)

Tạo thư mục `app/(admin)/admin/testimonials/`:

**`page.tsx`** — list page:
```typescript
export const dynamic = 'force-dynamic'
import AdminLayout from '@/components/admin/AdminLayout'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'

export default async function TestimonialsPage() {
  const items = await prisma.testimonial.findMany({ orderBy: { sortOrder: 'asc' } }).catch(() => [])
  return (
    <AdminLayout title="Đánh giá">
      <Link href="/admin/testimonials/new" ...>+ Thêm đánh giá</Link>
      {/* render table/grid */}
    </AdminLayout>
  )
}
```

**`new/page.tsx`** — create page:
```typescript
import AdminLayout from '@/components/admin/AdminLayout'
import TestimonialForm from '@/components/admin/TestimonialForm'

export default function NewTestimonialPage() {
  return (
    <AdminLayout title="Thêm đánh giá">
      <TestimonialForm mode="new" />
    </AdminLayout>
  )
}
```

**`[id]/edit/page.tsx`** — edit page:
```typescript
import { notFound } from 'next/navigation'
import AdminLayout from '@/components/admin/AdminLayout'
import TestimonialForm from '@/components/admin/TestimonialForm'
import { prisma } from '@/lib/prisma'

export default async function EditTestimonialPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const item = await prisma.testimonial.findUnique({ where: { id: parseInt(id) } }).catch(() => null)
  if (!item) notFound()

  return (
    <AdminLayout title={`Sửa: ${item.name}`}>
      <TestimonialForm mode="edit" id={item.id} initial={{ name: item.name, content: item.content }} />
    </AdminLayout>
  )
}
```

### Bước 6 — Thêm Loading Skeleton

Tạo `app/(admin)/admin/testimonials/loading.tsx`:
```typescript
import AdminLoadingPage from '@/components/admin/AdminLoadingPage'
export default function Loading() {
  return <AdminLoadingPage type="table" rows={6} />
}
```

### Bước 7 — Thêm Vào Sidebar

Mở `src/components/admin/AdminLayout.tsx`, thêm nav item vào mảng `navItems`:
```typescript
{ href: '/admin/testimonials', icon: '⭐', label: 'Đánh giá' }
```

---

## 11. Phân Tích Feature Mẫu — Admin Posts (Blog)

Feature CRUD hoàn chỉnh nhất để tham khảo. Phân tích luồng từ DB → API → Page → Component.

### DB Schema

`prisma/schema.prisma` — model `Post`:
```prisma
model Post {
  id         Int        @id @default(autoincrement())
  title      String
  slug       String     @unique
  content    String?
  status     PostStatus @default(draft)
  featured   Boolean    @default(false)
  categoryId Int?       @map("category_id")
  createdBy  Int?       @map("created_by")
  createdAt  DateTime   @default(now()) @map("created_at")

  category Category? @relation(fields: [categoryId], references: [id])
  author   User?     @relation(fields: [createdBy], references: [id])
}
```

### API Routes

**`app/api/admin/posts/route.ts`** — GET với pagination + filter:

```typescript
export async function GET(req: NextRequest) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { searchParams } = new URL(req.url)
  const page = Math.max(1, parseInt(searchParams.get('page') || '1'))
  const limit = 20

  const [posts, total] = await Promise.all([
    prisma.post.findMany({
      where,
      include: { category: { select: { name: true } }, author: { select: { name: true } } },
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.post.count({ where }),
  ])
  return NextResponse.json({ posts, total, page, pages: Math.ceil(total / limit) })
}
```

### Admin List Page

`app/(admin)/admin/posts/page.tsx` — URL filter pattern: `/admin/posts?status=published&q=nextjs&page=2`:

```typescript
export default async function PostsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; status?: string; page?: string }>
}) {
  const { q, status, page: pageStr } = await searchParams

  const where: Record<string, unknown> = {}
  if (status && status !== 'all') where.status = status
  if (q) where.OR = [
    { title: { contains: q, mode: 'insensitive' } },
    { slug: { contains: q, mode: 'insensitive' } },
  ]

  const [rows, cnt, all, pub, drf] = await Promise.all([
    prisma.post.findMany({ where, include: { ... }, skip: ..., take: limit }),
    prisma.post.count({ where }),
    prisma.post.count({}),
    prisma.post.count({ where: { status: 'published' } }),
    prisma.post.count({ where: { status: 'draft' } }),
  ])
}
```

### Form Component

`src/components/admin/PostForm.tsx` — Client Component:
- Dùng `useState` cho form values
- Submit gọi `fetch('/api/admin/posts', { method: 'POST', body: JSON.stringify(...) })`
- Redirect sau khi success: `router.push('/admin/posts'); router.refresh()`
- `router.refresh()` quan trọng — force Server Component re-fetch data mới từ DB

---

## 12. Các Pattern Thường Gặp

### Đọc Search Params trong Server Component

```typescript
export default async function SomePage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; page?: string }>
}) {
  const { q, page: pageStr } = await searchParams
  const page = Math.max(1, parseInt(pageStr || '1'))
}
```

### Fetch Nhiều Queries Song Song

```typescript
// Dùng Promise.all thay vì await từng cái — nhanh hơn
const [orders, customers, total] = await Promise.all([
  prisma.order.findMany({ ... }),
  prisma.customer.findMany({ ... }),
  prisma.order.count(),
])
```

### Xử Lý DB Offline Gracefully

```typescript
let items = []
try {
  items = await prisma.someModel.findMany()
} catch { /* DB offline hoặc lỗi */ }
// Component render "Chưa có dữ liệu" thay vì crash
```

### Decimal Type trong Prisma

```typescript
// prisma/schema.prisma: price Decimal
// Trong code:
const n = typeof row.price === 'number' ? row.price : (row.price as { toNumber(): number }).toNumber()
const formatted = n.toLocaleString('vi-VN') + 'đ'
```

### Slugify Tiếng Việt

```typescript
// src/components/admin/TemplateForm.tsx
function slugify(str: string) {
  return str.toLowerCase()
    .normalize('NFD').replace(/[̀-ͯ]/g, '')  // bỏ dấu
    .replace(/đ/g, 'd')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim().replace(/\s+/g, '-')
}
// "Nhà hàng Phú Quý" → "nha-hang-phu-quy"
```

### parseInt Validation

```typescript
const numId = parseInt(id)
if (isNaN(numId)) return NextResponse.json({ error: 'ID không hợp lệ' }, { status: 400 })
```

---

## 13. Biến Môi Trường

File `.env` tại `Sources/system/` (không commit lên git):

```env
DATABASE_URL="postgresql://user:pass@ep-xxx.neon.tech/dbname?sslmode=require&connect_timeout=30&pool_timeout=30"
SESSION_SECRET="random-secret-string-at-least-32-chars"
```

- `DATABASE_URL`: Neon PostgreSQL connection string với pooler
- `SESSION_SECRET`: Dùng để ký JWT token — phải giữ bí mật

---

## 14. Các Lỗi Thường Gặp Khi Viết Code Mới

### 1. Quên `await params` / `await searchParams`
```tsx
// SAI
const { slug } = params

// ĐÚNG
const { slug } = await params
```

### 2. Dùng Hook trong Server Component
```tsx
// SAI — không có 'use client', không thể dùng useState
export default async function SomePage() {
  const [count, setCount] = useState(0)  // lỗi!
}
```

### 3. Import Async Server Component vào Client Component
```tsx
// SAI
'use client'
import AsyncServerComp from './AsyncServerComp'  // lỗi: async component trong client
```

### 4. Không Gọi `router.refresh()` Sau Khi Mutate
```tsx
// SAI — data cũ vẫn hiển thị sau khi submit form
router.push('/admin/posts')

// ĐÚNG
router.push('/admin/posts')
router.refresh()
```

### 5. Dùng `data: body` Trực Tiếp Khi Update
```typescript
// SAI — mass-assignment risk
const data = await req.json()
await prisma.template.update({ where: { id }, data })

// ĐÚNG — whitelist fields
const { name, slug, price } = await req.json()
await prisma.template.update({ where: { id }, data: { name, slug, price } })
```

---

## Tóm Tắt Nhanh cho Developer

| Muốn làm gì | Làm ở đâu | Pattern tham khảo |
|---|---|---|
| Fetch data từ DB | Server Component (`async function`) | `app/(admin)/admin/page.tsx` |
| State / Event handler | Client Component (`'use client'`) | `src/components/admin/TemplateForm.tsx` |
| API endpoint | `app/api/xxx/route.ts` | `app/api/admin/templates/route.ts` |
| Trang mới trong admin | `app/(admin)/admin/xxx/page.tsx` | `app/(admin)/admin/posts/page.tsx` |
| Loading skeleton | `app/(admin)/admin/xxx/loading.tsx` | `app/(admin)/admin/templates/loading.tsx` |
| Form tạo/sửa | `src/components/admin/XxxForm.tsx` | `src/components/admin/TemplateForm.tsx` |
| Auth check trong page | `const session = await getSession(); if (!session) redirect(...)` | `app/(admin)/admin/posts/page.tsx` |
| Auth check trong API | `const session = await getSession(); if (!session) return 401` | `app/api/admin/templates/route.ts` |
| Thêm model mới | `prisma/schema.prisma` → `npm run db:push` | Schema model `Template` |
| CSS variables | `var(--accent)`, `var(--text)`, `var(--border)` | `src/styles/globals.css` |

---

## Files quan trọng nhất

| File | Vai trò |
|---|---|
| [Sources/system/prisma/schema.prisma](../Sources/system/prisma/schema.prisma) | Database schema — nguồn sự thật |
| [Sources/system/src/lib/prisma.ts](../Sources/system/src/lib/prisma.ts) | Prisma client singleton |
| [Sources/system/src/lib/auth.ts](../Sources/system/src/lib/auth.ts) | JWT helpers, getSession() |
| [Sources/system/src/styles/globals.css](../Sources/system/src/styles/globals.css) | CSS vars, design system |
| [Sources/system/src/components/admin/AdminLayout.tsx](../Sources/system/src/components/admin/AdminLayout.tsx) | Layout + sidebar admin |
| [Sources/system/src/components/admin/AdminLoadingPage.tsx](../Sources/system/src/components/admin/AdminLoadingPage.tsx) | Skeleton loader |
| [Sources/system/src/components/admin/TemplateForm.tsx](../Sources/system/src/components/admin/TemplateForm.tsx) | Ví dụ form CRUD tốt nhất |
| [Sources/system/app/(admin)/admin/posts/page.tsx](../Sources/system/app/(admin)/admin/posts/page.tsx) | Ví dụ admin list page với filter |
| [Sources/system/app/api/admin/templates/route.ts](../Sources/system/app/api/admin/templates/route.ts) | Ví dụ API route CRUD |

---

*Tạo: 2026-06-03 — dựa trên phân tích thực tế codebase `Sources/system/`.*
