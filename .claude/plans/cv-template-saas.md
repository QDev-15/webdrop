# Plan: CV Template SaaS — webdrop.store

> Tạo: 2026-06-30
> Trạng thái: PLANNING (chưa implement)

---

## Tổng quan sản phẩm

Nền tảng lưu trữ CV cá nhân online tích hợp vào webdrop.store. User có 1 nơi duy nhất để giữ CV của mình, luôn cập nhật, và dùng link để gửi đi khi phỏng vấn / xin việc — thay vì gửi file đính kèm email lỗi thời.

**Use case chính:**
- Lưu CV online, chỉnh sửa bất cứ lúc nào
- Gửi link `/cv-[slug]` cho nhà tuyển dụng thay vì file .docx
- Export ra file khi form xin việc bắt buộc đính kèm

**Định dạng thiết kế — Single-page scrollable:**
- Toàn bộ CV nằm trên **1 trang web cuộn dọc** — không có tab, không có trang phân trang
- Nhà tuyển dụng mở link → cuộn xuống đọc hết, không cần click thêm
- Export PDF: 1-2 trang A4 (tùy độ dài nội dung), không bị cắt giữa section
- Responsive: đọc được trên mobile lẫn desktop

**Điểm khác biệt kỹ thuật:**
- 1 database schema chung cho tất cả mẫu CV
- UI template (type) là layer hiển thị — cùng data, render khác nhau
- Dùng chung `users` table của webdrop.store — 1 tài khoản mua được nhiều sản phẩm
- Public URL `/cv-[slug]` không được index Google, không có trong sitemap

---

## Routing

| Route | Loại | Sitemap | Mô tả |
|---|---|---|---|
| `/cvs` | Public | ✅ Có | Browse & preview mẫu CV |
| `/cv-manager` | Protected | ❌ Không | Redirect → login hoặc editor |
| `/cv-manager/edit` | Protected | ❌ Không | Editor chỉnh sửa CV |
| `/cv-[slug]` | Public | ❌ Không | Trang CV live chia sẻ |

**robots.txt bổ sung:**
```
Disallow: /cv-manager
Disallow: /cv-
```

**next-sitemap.config.js bổ sung:**
```js
exclude: ['/cv-manager', '/cv-manager/*', '/cv-*']
```

---

## Database Schema (Prisma — PostgreSQL)

### Model `CvProfile`
```prisma
model CvProfile {
  id           Int      @id @default(autoincrement())
  userId       Int      @unique
  user         User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  templateType String   // 'classic' | 'minimal' | 'creative' | 'dark' | 'executive'
  slug         String   @unique  // dùng cho /cv-[slug], do user chọn hoặc auto-gen
  isPublic     Boolean  @default(true)
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt
  data         CvData?

  @@map("cv_profiles")
}
```

### Model `CvData`
```prisma
model CvData {
  id             Int       @id @default(autoincrement())
  cvId           Int       @unique
  cv             CvProfile @relation(fields: [cvId], references: [id], onDelete: Cascade)

  // Personal info
  fullName       String?
  jobTitle       String?
  avatarUrl      String?
  summary        String?   @db.Text
  email          String?
  phone          String?
  location       String?
  website        String?
  linkedin       String?
  github         String?
  twitter        String?

  // JSON arrays — flexible, không cần migration khi thêm field
  experience     Json?     // [{id, company, role, startDate, endDate, isCurrent, description, highlights[]}]
  education      Json?     // [{id, school, degree, field, startDate, endDate, gpa, description}]
  skills         Json?     // [{id, name, level(1-5), category}]
  projects       Json?     // [{id, name, description, url, tech[], highlights[]}]
  certifications Json?     // [{id, name, issuer, date, credentialUrl}]
  languages      Json?     // [{id, language, level: 'native'|'fluent'|'intermediate'|'basic'}]

  updatedAt      DateTime  @updatedAt

  @@map("cv_data")
}
```

### Quan hệ với `User` model hiện tại
```prisma
// Thêm vào model User hiện tại:
cvProfile  CvProfile?
```

**Access control logic:**
```ts
// Không dùng role — kiểm tra sự tồn tại của cv_profiles record
const cvProfile = await db.cvProfile.findUnique({ where: { userId: session.user.id } })
if (!cvProfile) redirect('/cvs') // chưa mua → về trang browse
```

---

## Template Types

5 loại UI, cùng nhận 1 `CvData` prop, render khác nhau:

| type | File component | Phong cách | Target user |
|---|---|---|---|
| `classic` | `CvClassic.tsx` | 2 cột, trắng sạch, conservative | Văn phòng, kế toán, HR |
| `minimal` | `CvMinimal.tsx` | Typography-first, ít màu, nhiều whitespace | Dev, researcher, academic |
| `creative` | `CvCreative.tsx` | Accent mạnh, màu sắc nổi bật | Designer, marketer |
| `dark` | `CvDark.tsx` | Dark bg, neon accent | DevOps, fullstack, game dev |
| `executive` | `CvExecutive.tsx` | Elegant, gold/navy, formal | C-level, senior manager |

**Layout bắt buộc cho tất cả template:**
- **Single-page scrollable** — tất cả sections nối tiếp nhau cuộn dọc, không phân trang
- Thứ tự sections (cố định): Hero (ảnh + tên + title) → Summary → Experience → Education → Skills → Projects → Certifications → Languages
- Section nào không có data → ẩn hoàn toàn (không hiện placeholder trống)
- `@media print` + `isPrint` prop: ẩn elements không cần thiết khi in, giữ page-break hợp lý giữa sections

**Component interface:**
```ts
interface CvTemplateProps {
  data: CvData
  isPrint?: boolean  // true khi render cho PDF/print — ẩn interactive elements
}
```

**Render selector:**
```ts
// app/cv-[slug]/page.tsx & cv-manager/edit/page.tsx dùng chung
const CV_TEMPLATES = {
  classic: CvClassic,
  minimal: CvMinimal,
  creative: CvCreative,
  dark: CvDark,
  executive: CvExecutive,
}

const Template = CV_TEMPLATES[profile.templateType] ?? CvClassic
return <Template data={cvData} />
```

---

## File Structure (Sources/system/)

```
app/
├── (site)/
│   └── cvs/
│       ├── page.tsx          ← Server Component — list tất cả template types
│       └── loading.tsx
├── cv-manager/
│   ├── layout.tsx            ← Auth guard: check session + cv_profiles
│   ├── page.tsx              ← Redirect → /cv-manager/edit nếu đã có profile
│   └── edit/
│       ├── page.tsx          ← Server Component — load cv data
│       └── CvEditorClient.tsx ← 'use client' — form editor + preview realtime
└── cv-[slug]/
    ├── page.tsx              ← Server Component — public CV render
    └── loading.tsx

src/components/cv/
├── templates/
│   ├── CvClassic.tsx
│   ├── CvMinimal.tsx
│   ├── CvCreative.tsx
│   ├── CvDark.tsx
│   └── CvExecutive.tsx
├── editor/
│   ├── PersonalSection.tsx   ← Form section: thông tin cá nhân
│   ├── ExperienceSection.tsx ← Form section: kinh nghiệm (add/edit/delete/reorder)
│   ├── EducationSection.tsx
│   ├── SkillsSection.tsx
│   ├── ProjectsSection.tsx
│   ├── CertSection.tsx
│   └── LanguagesSection.tsx
└── CvPreviewPanel.tsx        ← Preview realtime bên phải editor

api/
└── cv/
    ├── profile/
    │   └── route.ts          ← GET (lấy profile), PUT (đổi template/slug)
    ├── data/
    │   └── route.ts          ← GET (lấy data), PUT (lưu section)
    ├── public/
    │   └── [slug]/
    │       └── route.ts      ← GET (không cần auth — dùng cho /cv-[slug])
    └── export/
        └── [slug]/
            └── route.ts      ← GET ?format=html|pdf|docx
```

---

## API Routes Chi Tiết

### `GET /api/cv/profile`
- Auth: bắt buộc (session)
- Response: `{ profile: CvProfile, data: CvData }`
- Error: 404 nếu chưa mua

### `PUT /api/cv/profile`
- Auth: bắt buộc
- Body: `{ templateType?, slug?, isPublic? }`
- Whitelist fields — không nhận field ngoài danh sách
- Slug validation: lowercase, chỉ `a-z 0-9 -`, dài 3–50 ký tự
- Slug unique check → 409 nếu đã tồn tại
- Response: `{ profile: CvProfile }`

### `PUT /api/cv/data`
- Auth: bắt buộc
- Body: bất kỳ field nào của `CvData` (partial update)
- Dùng `update` với `where: { cvId: profile.id }`
- Response: `{ data: CvData }`

### `GET /api/cv/public/[slug]`
- Không cần auth
- Check `isPublic: true` — nếu false → 404
- Response: `{ profile: { templateType, slug }, data: CvData }`

### `GET /api/cv/export/[slug]?format=html|pdf|docx`
- Auth: bắt buộc (chỉ chủ sở hữu mới export được)
- `html`: render SSR template → trả string HTML với inline CSS
- `pdf`: trigger Puppeteer endpoint → trả file PDF
- `docx`: generate bằng `docx` npm package → trả file .docx
- Response headers: `Content-Disposition: attachment; filename=cv-[slug].[ext]`

---

## CV Editor UX (`/cv-manager/edit`)

**Layout:**
```
┌─────────────────────────────────────────────────────┐
│  Header: [← Đổi mẫu] [Slug: /cv-xxx] [Export ▼]   │
├─────────────────────────┬───────────────────────────┤
│  FORM (left, scroll)    │  PREVIEW (right, sticky)  │
│                         │                           │
│  [Thông tin cá nhân]    │  [Live render CV template]│
│  [Kinh nghiệm]          │                           │
│  [Học vấn]              │  Scale fit trong viewport │
│  [Kỹ năng]              │                           │
│  [Dự án]                │                           │
│  [Chứng chỉ]            │                           │
│  [Ngôn ngữ]             │                           │
└─────────────────────────┴───────────────────────────┘
```

**Auto-save:** Debounce 1.5s sau mỗi keystroke → `PUT /api/cv/data`

**Preview realtime:** State `cvData` update local → Preview re-render ngay (không cần đợi save)

**Export dropdown:**
```
[Export ▼]
  → Tải .html
  → Tải .pdf
  → Tải .docx
  → Copy link chia sẻ
```

---

## Checkout Integration

Khi đơn hàng CV được xác nhận thanh toán (Sepay webhook):

```ts
// Trong handler /api/webhooks/sepay (file hiện tại)
if (order.productType === 'cv') {
  // Tạo user nếu chưa có (email từ đơn hàng)
  const user = await db.user.upsert({
    where: { email: order.email },
    update: {},
    create: {
      name: order.customerName,
      email: order.email,
      password: await hash(generateTempPassword(), 10),
      role: 'user',
    },
  })

  // Tạo cv_profile + cv_data trong 1 transaction
  await db.$transaction([
    db.cvProfile.create({
      data: {
        userId: user.id,
        templateType: order.templateType, // từ đơn hàng
        slug: generateSlug(user.name),    // auto-gen, user có thể đổi sau
        data: { create: {} },             // empty CvData
      },
    }),
  ])

  // Gửi email: thông tin tài khoản + link /cv-manager
  await sendEmail({
    to: order.email,
    subject: 'Tài khoản CV của bạn đã sẵn sàng',
    template: 'cv-account-created',
    data: { name: user.name, loginUrl: '/cv-manager', tempPassword }
  })
}
```

---

## Export Implementation Chi Tiết

### HTML Export
```ts
// Render template component to string (SSR)
import { renderToStaticMarkup } from 'react-dom/server'
const html = renderToStaticMarkup(<CvTemplate data={cvData} isPrint />)

// Wrap với full HTML page + inline styles
const fullHtml = `<!DOCTYPE html><html>...<style>${cssContent}</style>${html}</html>`
return new Response(fullHtml, {
  headers: {
    'Content-Type': 'text/html',
    'Content-Disposition': `attachment; filename="cv-${slug}.html"`,
  },
})
```

### PDF Export
```ts
// Dùng Puppeteer (cần cài trên VPS)
// Render /cv-[slug]?print=1 → screenshot/print to PDF
const browser = await puppeteer.launch({ headless: 'new' })
const page = await browser.newPage()
await page.goto(`${BASE_URL}/cv-${slug}?print=1`, { waitUntil: 'networkidle0' })
await page.emulateMediaType('print')
const pdf = await page.pdf({ format: 'A4', printBackground: true })
await browser.close()
```

### DOCX Export
```ts
// Dùng npm package 'docx' — generate từ data, không phụ thuộc UI template
import { Document, Paragraph, TextRun, HeadingLevel } from 'docx'
const doc = new Document({
  sections: [{
    children: [
      new Paragraph({ text: data.fullName, heading: HeadingLevel.HEADING_1 }),
      new Paragraph({ text: data.jobTitle }),
      // ... map từng section
    ]
  }]
})
const buffer = await Packer.toBuffer(doc)
```

---

## Pricing

| Gói | Nội dung | Giá |
|---|---|---|
| Basic | 1 mẫu CV, export HTML, public link | 99k |
| Pro | Chọn bất kỳ mẫu, export HTML+PDF+DOCX, custom slug | 299k |
| Lifetime | Pro + đổi mẫu miễn phí mãi mãi | 699k |

---

## Giai Đoạn Implement

### Phase 1 — Nền tảng (Schema + API + Editor)
- [ ] Thêm `CvProfile` + `CvData` vào `prisma/schema.prisma`
- [ ] Chạy `prisma migrate dev`
- [ ] Thêm quan hệ `cvProfile` vào `User` model
- [ ] API: `GET/PUT /api/cv/profile`
- [ ] API: `GET/PUT /api/cv/data`
- [ ] API: `GET /api/cv/public/[slug]`
- [ ] Layout `/cv-manager/layout.tsx` với auth guard
- [ ] Page `/cv-manager/edit` — editor form + preview
- [ ] Component `PersonalSection.tsx` (form cơ bản nhất)
- [ ] Component `ExperienceSection.tsx`
- [ ] Auto-save debounce

### Phase 2 — Templates + Browse
- [ ] Template `CvClassic.tsx` — với `isPrint` prop
- [ ] Template `CvMinimal.tsx`
- [ ] Page `/cvs` — browse tất cả template với demo data mẫu
- [ ] Page `/cv-[slug]` — public render
- [ ] Exclude sitemap + robots.txt

### Phase 3 — Export
- [ ] Export `.html` (SSR to string)
- [ ] Export `.pdf` (Puppeteer)
- [ ] `?print=1` CSS: ẩn nav, optimize layout cho A4
- [ ] Export dropdown UI trong editor

### Phase 4 — Templates còn lại + DOCX
- [ ] Template `CvCreative.tsx`
- [ ] Template `CvDark.tsx`
- [ ] Template `CvExecutive.tsx`
- [ ] Export `.docx` (docx package)
- [ ] Editor sections còn lại: Skills, Projects, Certifications, Languages

### Phase 5 — Checkout + Admin
- [ ] Tích hợp checkout flow (product type = cv)
- [ ] Sepay webhook tạo cv_profile sau thanh toán
- [ ] Email template "tài khoản CV sẵn sàng"
- [ ] `/admin` thêm menu quản lý CV users (superadmin)

---

## Ghi Chú Kỹ Thuật

- **Slug generation**: `slugify(user.name) + '-' + nanoid(4)` để tránh collision
- **JSON arrays trong Prisma**: dùng `Json?` type, validate bằng Zod schema trước khi lưu
- **Preview realtime**: dùng `useState` local, không debounce preview — chỉ debounce API call save
- **`/cv-[slug]` dynamic route**: Next.js 15 — `params` là Promise, phải `await params`
- **Puppeteer trên VPS**: cần `--no-sandbox` flag trên Linux; cân nhắc dùng `@sparticuz/chromium` nếu deploy Vercel
- **CSS print**: mỗi template có `@media print` rules — ẩn header editor, expand full width, page break hợp lý
- **isPublic = false**: trả 404 ở cả `/cv-[slug]` lẫn `/api/cv/public/[slug]` — không để lộ data
