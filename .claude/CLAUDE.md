# 📋 PROJECT OVERVIEW — Template & Website Business

> File này lưu toàn bộ ý tưởng, yêu cầu và tiến độ xây dựng dự án.
> Cập nhật liên tục theo từng giai đoạn phát triển.

## Quy tắc bắt buộc

1. Mỗi khi thay đổi code phải review fix bug thành vòng lặp đến khi hết bug.
2. Update file [CLAUDE.md](./CLAUDE.md) mỗi khi có thay đổi code.
3. Mỗi khi thêm một chức năng hay thay đổi flow thì review fix bug rồi review fix lại cho đến khi hết bug.
4. **Sau mỗi lần thay đổi code, bắt buộc gọi agent `reviewer` để review code, sau đó gọi agent `qa-tester` để test UI/design system — fix hết issue trước khi commit.**
5. **⛔ WebDeploy scope: khi sửa một website `Sources/WebDeploy/[slug]/` thì CHỈ sửa trong thư mục đó — không tự ý sửa sang site khác. Phát hiện bug tương tự ở site khác → báo cáo, không tự fix.**
6. Quy tắc compact tự động (2-trigger):
   - Trước khi bắt đầu task mới: nếu context còn < 60% → compact trước rồi mới thực hiện task.
   - Bất kỳ lúc nào trong lúc làm việc: nếu context còn < 40% → compact ngay lập tức, sau đó báo lại vị trí đang làm dở để tiếp tục.
   - Mục tiêu: không bao giờ để context xuống dưới 30%.
---

## 🛠️ TOOLING & AGENTS

### Agents (`.claude/agents/`)

| Agent | Dùng khi | Tools |
|---|---|---|
| `qa-tester` | Kiểm tra HTML sau khi viết/sửa — design system, Bootstrap, responsive | Read, Glob, Grep, Bash |
| `reviewer` | Review code trước khi ship — bug, security, logic | Read, Glob, Grep, Bash |
| `research` | Tra cứu kỹ thuật, tài liệu, so sánh giải pháp | Read, Glob, Grep, WebFetch, Bash |
| `teacher` | Học Next.js/React qua code thực tế | Read, Glob, Grep, WebFetch |
| `design-scout` | Thu thập & phân tích design website theo ngành → Design Brief | WebSearch, WebFetch, Read |
| `template-builder` | Nhận chủ đề + Brief → tạo template HTML/CSS/Bootstrap vào `Sources/templates/` | Read, Write, Edit, WebFetch, WebSearch |
| `web-deploy-builder` | Nhận slug → **chạy scaffolder** → đọc template HTML → fill ~45% AI files → tạo React + PHP + SQLite vào `Sources/WebDeploy/[slug]/` | Read, Write, Edit, Glob, Grep, Bash |
| `web-deploy-fixer` | Nhận slug → chạy TS build + PHP check → tự fix lỗi → lặp đến 0 error | Read, Write, Edit, Glob, Grep, Bash |
| `cv-template-builder` | Nhận tên template (minimal/creative/dark/executive) → tạo React CV component vào `Sources/system/src/components/cv/templates/` → cập nhật CvPreview.tsx → TypeScript check 0 lỗi | Read, Write, Edit, Glob, Grep, Bash |
| `design-match` | Dựng/fix HTML+CSS khớp 100% với ảnh thiết kế tham chiếu — vòng lặp screenshot (Playwright) → đối chiếu ảnh gốc → fix → lặp lại đến khi khớp | Read, Write, Edit, Glob, Grep, Bash |

### Project Settings

**Hai file settings — phân biệt rõ:**
- `.claude/settings.json` — commit vào git, **không hardcode path hay credential**
- `.claude/settings.local.json` — local only, không commit, dùng cho path máy cụ thể

**Stop hook** — tự động phát âm thanh + WPF popup khi Claude hoàn thành task:
- Script: `C:\Users\QuynhNH\.claude\hooks\stop-notify.ps1`
- Cấu hình: `~/.claude/settings.json` (global — áp dụng mọi project trên máy)

**PermissionRequest hook** — auto-allow permission dialogs:
- Bật: `New-Item ~/.claude/auto-allow-enabled -ItemType File`
- Tắt: `Remove-Item ~/.claude/auto-allow-enabled`

### Rules files (`.claude/rules/`) — đọc trực tiếp, không lặp lại ở đây

| File | Nội dung |
|---|---|
| `rules/design-system.md` | Design system đầy đủ — màu, font, layout, components, Bootstrap 5.3.3 |
| `rules/database.md` | Database schema — core tables, extension schema, FK rules |
| `rules/tech-stack.md` | Tech stack theo từng layer, hosting, CDN |
| `rules/product-packages.md` | Gói sản phẩm, tính năng, giá bán |
| `rules/coding-workflow.md` | Coding workflow, review & QA process |

### Lệnh `/fetch claude`
```
/fetch claude
```

---

## 🎯 MỤC TIÊU DỰ ÁN

Xây dựng và bán 3 nhóm sản phẩm chính:
1. **Template** — HTML/CSS thuần dùng Bootstrap, không build system
2. **Website hoàn chỉnh** — React SPA + PHP API + SQLite, deploy lên hosting là chạy luôn
3. **CV Builder SaaS** — Nền tảng lưu trữ CV cá nhân online: user chỉnh sửa → có link CV để gửi đi phỏng vấn / xin việc → export file khi cần. CV thiết kế dạng 1 trang, cuộn dọc (single-page scrollable)

---

## 🗂️ NGÁCH THỊ TRƯỜNG ƯU TIÊN

- [x] Nhà hàng / Quán ăn / Cafe — **DONE** (10 templates: `Restaurants/`, `Cafes/`)
- [x] Spa / Thẩm mỹ / Làm đẹp — **DONE** (10 templates: `Spa-Services/`)
- [ ] Bất động sản
- [x] Agency / Portfolio / Công ty — **DONE** (6 templates: `Companies/`, `Portfolios/`)
- [x] Blog / Forum — **DONE** (`Blogs/`, `Forums/`)
- [x] Nha khoa — **DONE** (10 template: `Dental-Clinics/` — 10 Identity Token khác nhau: LUXE-DARK, FRESH-MINIMAL, BOLD-EDITORIAL, GEOMETRIC-MODERN, SOFT-PASTEL, DARK-ENERGY, CLEAN-CORPORATE, ZEN-MINIMAL, RETRO-BOLD, GLASS-MODERN)
- [ ] Landing page sản phẩm / Dịch vụ
- [ ] CV cá nhân — **PLANNING** (CV Builder SaaS — xem `.claude/plans/cv-template-saas.md`)

---

## 🚀 ROADMAP PHÁT TRIỂN

### Giai đoạn 1 — 0 đến 6 tháng ✅ HOÀN THÀNH

- [x] Xây web template theo ngành — **40 templates** (Restaurant, Spa, Agency, Company, Blog, Cafe, Forum, Portfolio, Dental-Clinics)
- [x] Xây 1 admin template cơ bản — `Sources/templates/admin/basic-admin/`
- [x] Thiết lập kênh bán (webdrop.store) — deploy Vercel, custom domain
- [x] Đóng gói Gói Web cơ bản thành sản phẩm chuẩn (`Sources/products/goi-b/`)
- [x] Tích hợp Sepay webhook auto-confirm đơn hàng + tạo download token
- [x] Deploy website demo — xem bảng **WebDeploy Projects** (bao gồm `nail-salon` 2026-06-26, `pilates-studio` 2026-06-26, `spa-beauty` 2026-06-27, `tham-my-vien` 2026-07-01, `nha-khoa-chinh-nha-saigon` 2026-07-04, `nha-khoa-cong-nghe-smiletech` 2026-07-04)
- [x] Tạo Admin Profile page (`/admin/profile`) — đổi tên, đổi password
- [x] Tạo Admin Users page (`/admin/users`) — quản lý tài khoản, nâng/hạ cấp, xóa (superadmin only)
- [x] Tạo hệ thống thống kê truy cập (`/admin/analytics`) — track page views, top pages, nguồn truy cập, recent visits
- [x] Hệ thống mã khuyến mại (`/admin/discounts`) — percent/fixed, maxUses, expiresAt; đơn 100% off bypass chuyển khoản ngay
- [ ] Upload ảnh thực tế cho website demo (cafe-thoi-gian)
- [ ] Nhận đơn hàng đầu tiên

### Giai đoạn 2 — 6 đến 18 tháng

- [ ] Mở rộng thư viện template — BĐS, landing page sản phẩm
- [ ] Nhận dự án Gói Theo Yêu cầu giá trị cao
- [ ] Xây trang showcase / portfolio
- [ ] **CV Builder SaaS** — implement theo plan `.claude/plans/cv-template-saas.md`
  - [ ] Phase 1: Schema + API + Editor (Prisma migrate, API routes, /cv-manager)
  - [ ] Phase 2: Templates + Browse (/cvs, /cv-[slug], 2 mẫu đầu)
  - [ ] Phase 3: Export (.html, .pdf)
  - [ ] Phase 4: 3 mẫu còn lại + export .docx
  - [ ] Phase 5: Checkout integration + Admin quản lý

### Giai đoạn 3 — 18 tháng trở đi

- [ ] SaaS nhỏ: khách tự cài template qua giao diện
- [ ] Affiliate / đại lý resell template
- [ ] Gói bảo trì tạo MRR

---

**Scaffold (tạo project mới nhanh):**
```
cd Sources/WebDeploy
node scaffolder.mjs [slug] [type: cafe|restaurant|spa|spa-service|portfolio|company|blog]
```
Copy ~40 core files từ `_scaffold/` → tiết kiệm ~55% thời gian AI. AI chỉ fill phần còn lại.

**Build:**
- Windows: `build.bat` — build React + assemble → `_output-deploy/` (cùng cấp với thư mục source)
- Linux/Mac: `bash build.sh`

```
WebDeploy/
├── [slug]/               ← source code
│   ├── website/
│   ├── admin/
│   ├── api/
│   └── build.bat
└── _output-deploy/        ← build output (cùng cấp với source)
    ├── index.html, assets/   ← public site (website/dist/)
    ├── web.config, .htaccess ← SPA routing
    ├── favicon.ico ← Icon
    ├── admin/                ← admin panel (admin/dist/)
    └── api/                  ← PHP backend + SQLite
```

---

## 📁 CẤU TRÚC DỰ ÁN

```
webdrop/
├── .claude/
│   ├── CLAUDE.md
│   ├── agents/
│   ├── rules/                      ← design-system, database, tech-stack, product-packages
│   ├── settings.json               ← commit — không hardcode path
│   └── settings.local.json         ← local only — path máy cụ thể
├── Sources/
│   ├── system/                     ← Next.js 15 (webdrop.store)
│   │   ├── app/
│   │   │   ├── (site)/             ← / · /templates · /blog · /pricing · /about · /contact · /faq · /policies
│   │   │   │                          /cvs (browse CV templates)
│   │   │   ├── (checkout)/         ← /checkout · /checkout/success
│   │   │   ├── (admin)/admin/      ← dashboard · orders · customers · templates · slides
│   │   │   │                          posts · contacts · projects · revenue · settings
│   │   │   ├── cv-manager/         ← CV Editor (protected, NO sitemap) — /cv-manager/edit
│   │   │   ├── cv-[slug]/          ← Public CV page (NO sitemap, NO Google index)
│   │   │   └── api/                ← auth · orders · contact · packages · admin/* · cv/*
│   │   ├── src/components/
│   │   │   ├── site/               ← NavBar, Footer, HeroSlider, TemplateGrid, PricingSection...
│   │   │   └── admin/              ← AdminLayout, AdminLoadingPage, TemplateForm, PostForm...
│   │   ├── src/lib/prisma.ts
│   │   ├── prisma/schema.prisma    ← PostgreSQL (Neon dev / VPS prod) — xem .env
│   │   ├── prisma/seed.ts          ← 31 templates + industries + packages + admin user
│   │   └── .env                    ← DB URL + secrets (không commit)
│   ├── WebDeploy/[slug]/
│   │   ├── website/                ← React SPA public
│   │   ├── admin/                  ← React SPA admin
│   │   ├── api/                    ← PHP + SQLite
│   │   ├── build.bat               ← Windows
│   │   ├── build.sh                ← Linux/Mac
│   │   └── build.mjs               ← Build script
│   ├── products/goi-b/             ← Base code Gói B
│   └── templates/web/
│       ├── Companies/              ← ✅ 6 templates
│       ├── Restaurants/            ← ✅ 10 templates
│       ├── Spa-Services/           ← ✅ 10 templates
│       ├── Cafes/                  ← ✅ cafe-thoi-gian
│       ├── Blogs/                  ← ✅ blog-ca-nhan
│       ├── Forums/                 ← ✅ forum-cong-dong
│       ├── Portfolios/             ← ✅ portfolio-toi
│       ├── Dental-Clinics/         ← ✅ 10 templates (xem ghi chú kỹ thuật)
│       └── CVs/                   ← 🔲 PLANNING (5 mẫu: classic, minimal, creative, dark, executive)
├── documents/                      ← Prototype UI HTML (tham khảo)
└── .gitignore
```

---

## 🖥️ HẠ TẦNG

- **VPS**: AZDIGI Linux (~200–300k/tháng, 2 vCPU, 2GB RAM, NVMe, datacenter VN)
- **System DB**: Neon PostgreSQL (dev) / PostgreSQL tự host (prod) — xem `.env`
- **ORM**: Prisma 5.x — `Sources/system/prisma/schema.prisma`
- **Admin login**: xem `.claude/Info/companyInfo.md`
- **Media/ảnh**: Cloudflare R2 (free bandwidth)
- **Demo template live**: Cloudflare Pages

```
VPS AZDIGI Linux
├── Nginx          → reverse proxy
├── Next.js (PM2)  → webdrop.store + admin
├── PostgreSQL     → System DB
└── PHP-FPM        → website khách (Gói B) + SQLite
```

---

## 📝 GHI CHÚ KỸ THUẬT

### Next.js System

- **NavBar**: `(!isHome || scrolled)` — transparent chỉ ở homepage khi chưa scroll; check() chạy ngay khi mount
- **Loading skeleton**: Mọi route có DB query đều có `loading.tsx`
- **Admin loading**: `AdminLoadingPage` shared component (5 loại: table/cards/detail/form/chart)
- **Error boundary**: `error.tsx` ở template detail
- **Template detail**: Không dùng `wd-nav` riêng — breadcrumb nằm inline trong page flow
- **Prisma + Neon**: `lib/prisma.ts` detect URL thay đổi để tạo lại client; URL có `connect_timeout=30&pool_timeout=30`
- **Image fallback**: `TemplateGrid` dùng `TemplateImage` với `onError` → placeholder khi Unsplash fail
- **Checkout plan IDs**: `starter/standard/premium` (không phải `a/b/c`)
- **`findFirst` vs `findUnique`**: Dùng `findFirst` khi filter theo nhiều cột
- **TemplateGrid `homepage` prop**: `true` → ẩn filter, limit 9 cards, show "Xem tất cả". `false` → /templates behavior
- **TemplateGrid IntersectionObserver**: `useEffect([active])` re-observe sau filter, `setTimeout(fn, 0)` chờ DOM paint
- **TemplateGrid active reset**: `useEffect([propTemplates])` reset `active` về `categoryList[0]`

### API Security

- Admin routes: `getSession()` → 401 nếu chưa đăng nhập
- PATCH/PUT: whitelist fields — không dùng `data: body` trực tiếp
- Prisma errors: P2002 → 409, P2025 → 404
- `parseInt(id)`: check `isNaN()` → 400
- Next.js 15: `params` và `searchParams` là **Promise** — phải `await params`

### Settings & Dynamic Content

- Auth: custom JWT, env var `SESSION_SECRET`
- **Footer**, **Contact**: fetch `site_name`, `site_phone`, `site_email`, `site_address`, `working_hours`, social từ bảng `settings`
- **Hero Slider**: bảng `hero_slides`, quản lý `/admin/slides`, fallback `src/data/slides.config.ts`

### Templates (webdrop.store)

- `hasWebsite: Boolean` — phân biệt template-only vs có website đầy đủ
- `/templates?type=starter` → `hasWebsite=false` | `?type=standard` → `hasWebsite=true`
- Khi không có `?type` → show tất cả, badge 📦/🌐

### Gói Web cơ bản (WebDeploy)

- Build: `build.bat` (Windows), `bash build.sh` (Linux/Mac) → output `deploy/`
- DB tự seed lần đầu khi PHP nhận request đầu tiên — không cần setup thủ công
- Ship 2 file routing song song: `.htaccess` (Apache) + `web.config` (IIS) — cập nhật cả hai khi đổi rule
- Schema: `schema.sql` (SQLite) + `schema_mysql.sql` (MySQL option)
- Đã test: PA Vietnam Windows hosting (Plesk + IIS + PHP 8.3 FastCGI)

### Client vs Server Component

- Async Server Component **không được import** từ Client Component
- Pattern: tách interactive part ra `XxxClient.tsx` (`'use client'`), `page.tsx` là Server Component
- Áp dụng: `faq/`, `contact/`, `policies/[slug]/`

### Dental-Clinics (10 templates, batch 2026-07-03)

- Xây song song bằng 10 sub-agent, mỗi agent 1 Identity Token riêng (pre-assigned để tránh trùng lặp khi chạy song song) — chi tiết: `nha-khoa-dong-do` (LUXE-DARK), `nha-khoa-gia-dinh-sunrise` (FRESH-MINIMAL), `nha-khoa-tham-my-luxdental` (BOLD-EDITORIAL), `nha-khoa-chinh-nha-saigon` (GEOMETRIC-MODERN), `nha-khoa-tre-em-kidsmile` (SOFT-PASTEL), `nha-khoa-implant-future` (DARK-ENERGY), `nha-khoa-quoc-te-vietduc` (CLEAN-CORPORATE), `nha-khoa-tong-quat-antam` (ZEN-MINIMAL), `nha-khoa-nu-cuoi-xua` (RETRO-BOLD), `nha-khoa-cong-nghe-smiletech` (GLASS-MODERN)
- Đã qua vòng reviewer + qa-tester (5 batch song song) — fix hết P0/P1: bug tính ngày (dong-do), branch-tab không filter (vietduc), class CSS chết làm vỡ nav mobile (implant-future), label thiếu `for`/`id` (vietduc, nu-cuoi-xua), form thiếu `preventDefault` (nu-cuoi-xua), thiếu `loading="lazy"` (luxdental, chinh-nha-saigon, nu-cuoi-xua), `href="#"` trên social link toàn bộ 10 template (đã đổi sang placeholder URL thật + `target="_blank"`)
- `nha-khoa-dong-do` và `nha-khoa-cong-nghe-smiletech` dùng CSS Grid/Flexbox thuần thay vì Bootstrap `row/col-*` cho phần lớn layout (chủ đích cho bento/geometric-split) — đã đổi tên class container về `.wd-container` chuẩn dự án nhưng giữ nguyên hệ Grid, không refactor toàn bộ sang Bootstrap (quyết định 2026-07-03, tránh vỡ thiết kế)
- Template gốc `nha-khoa-an-nhien` đã bị xóa chủ động bởi chủ dự án (2026-07-03) — không còn tồn tại
- Đã seed vào System DB (`prisma/seed.ts`): industry mới `dental` (Nha khoa, sortOrder 7) + 10 template (category `web`, giá 99.000đ, status `published`, demoUrl trỏ `webdrop-eol.pages.dev/Dental-Clinics/[slug]/`) — tổng templates DB hiện tại: 41 (40 web + 1 admin)

### WebDeploy Projects (2026-07-04)

| Slug | Ngách | Identity | Build |
|---|---|---|---|
| `nail-salon` | Nail / Làm đẹp | — | ✅ |
| `pilates-studio` | Pilates / Yoga | — | ✅ |
| `spa-beauty` | Spa / Thẩm mỹ | — | ✅ |
| `tham-my-vien` | Thẩm mỹ viện | — | ✅ |
| `nha-khoa-chinh-nha-saigon` | Nha khoa chỉnh nha | GEOMETRIC-MODERN, cobalt `#1d4fd8` | ✅ |
| `nha-khoa-dong-do` | Nha khoa cao cấp | LUXE-DARK, Jade Emerald `#0e7c66` | ✅ |
| `nha-khoa-implant-future` | Nha khoa Implant chuyên sâu | DARK-ENERGY, neon magenta `#c026d3` | ✅ |
| `nha-khoa-gia-dinh-sunrise` | Nha khoa gia đình | FRESH-MINIMAL, Sky Blue `#2f8fd1` | ✅ |
| `nha-khoa-nu-cuoi-xua` | Nha khoa phong cách retro | RETRO-BOLD, Teal `#1f7a6b`, Mustard `#c98a1f` | ✅ |
| `nha-khoa-quoc-te-vietduc` | Nha khoa quốc tế đa chi nhánh | CLEAN-CORPORATE, Teal `#0f6d82` | ✅ |
| `nha-khoa-tham-my-luxdental` | Nha khoa thẩm mỹ cao cấp | BOLD-EDITORIAL, Scarlet `#d63b1f` | ✅ |
| `nha-khoa-tong-quat-antam` | Nha khoa tổng quát | ZEN-MINIMAL, Sage green `#6b8067` | ✅ |

**Ghi chú kỹ thuật `nha-khoa-chinh-nha-saigon`:**
- CSS prefix: `cn-` xuyên suốt (không dùng `tmv-`)
- Identity: GEOMETRIC-MODERN — Space Grotesk font, cobalt blue `#1d4fd8`, hero layout: geometric split (H10)
- Nav: always-solid (không transparent) — luôn background rgba(255,255,255,.94) backdrop-blur
- Trang website: `/`, `/dich-vu`, `/quy-trinh-nieng`, `/bac-si`, `/dat-lich`, `/lien-he`
- SiteContext: stat_cases, stat_doctors, stat_years, stat_satisfaction
- Public API: `GET /public/settings`, `GET /public/services`, `GET /public/doctors`, `GET /public/testimonials`, `POST /public/bookings`, `POST /public/contact`
- DB Extension tables: services, doctors, bookings, testimonials (ngoài core)
- Fields booking: customer_name, phone, email, pref_service, pref_date, pref_time, note
- Fields testimonials: author_name, author_role, content, rating, avatar_initial, is_featured
- Fields doctors: name, role, photo, description, experience_years, specialties (pipe-separated), tag
- TS build: website 52 modules (213.9kB JS), admin 56 modules (223.6kB JS) — 0 lỗi
- PHP syntax: 24/24 files OK, 0 BOM

**Ghi chú kỹ thuật `nha-khoa-quoc-te-vietduc`:**
- CSS prefix: `vd-` xuyên suốt
- Identity: CLEAN-CORPORATE — Outfit font (Bunny Fonts), nền sáng `#f4f8fb`, Navy/Teal accent `#0f6d82`, structured 12-col grid
- Nav: transparent → `.scrolled` khi scrollY > 60 (Nav-1 pattern)
- Fonts: Bunny Fonts — outfit:300,400,500,600,700 (không dùng Google Fonts)
- Trang website: `/`, `/dich-vu`, `/co-so-vat-chat`, `/bac-si`, `/dat-lich`, `/lien-he` (6 trang)
- SiteContext: stat_branches, stat_doctors, stat_patients, stat_satisfaction
- Public API: `GET /public/settings`, `GET /public/hero-slides`, `GET /public/service-categories`, `GET /public/services`, `GET /public/doctors`, `GET /public/testimonials`, `POST /public/bookings`, `POST /public/contact`
- DB Extension tables: service_categories, services (category_id FK, tag, price, price_unit), doctors (flag: Trong nuoc/Quoc te, tags), bookings (pref_date, pref_time, service, branch), testimonials (is_featured)
- Multi-branch settings keys: branch_hcm_address, branch_hcm_phone, branch_hn_address, branch_hn_phone, branch_dn_address, branch_dn_phone, branch_ct_address, branch_ct_phone, branch_nt_address, branch_nt_phone
- Booking fields: fullname, phone, email, branch, service, pref_date, pref_time, note
- Bento gallery on /co-so-vat-chat page (6 items), branch filter tabs on /lien-he
- fix: bootstrap.php missing require_once for MediaController, UnsplashController, UploadController
- fix: website/index.html missing Bootstrap 5.3.3 CDN (layout broken without it)
- fix: extensive unaccented Vietnamese text across all 6 pages → fully corrected
- TS build: website 44 modules (214.18kB JS), admin 58 modules (233.30kB JS) — 0 lỗi
- PHP syntax: 24/24 files OK, 0 BOM

### CV Builder SaaS

> Plan chi tiết: `.claude/plans/cv-template-saas.md`

- **DB**: `CvProfile` (1-1 với `User`) + `CvData` (1-1 với `CvProfile`) — dùng chung `users` table
- **Access control**: kiểm tra `cvProfile` record, không dùng role riêng
- **Template types**: `classic | minimal | creative | dark | executive` — cùng `CvData` prop, render khác nhau
- **Routing**: `/cvs` (public) · `/cv-manager/edit` (protected) · `/cv-[slug]` (public, NO sitemap)
- **robots.txt**: `Disallow: /cv-manager` và `Disallow: /cv-` — không cho Google index
- **Export**: `.html` (SSR renderToStaticMarkup) · `.pdf` (Puppeteer) · `.docx` (npm `docx`)
- **Auto-save editor**: debounce 1.5s → `PUT /api/cv/data`; preview realtime từ local state
- **Checkout**: Sepay webhook tạo `cvProfile` + `cvData` (empty) + gửi email credentials
- **Slug**: auto-gen `slugify(name) + nanoid(4)`, user có thể đổi sau (validate unique)
- **isPrint prop**: mỗi CV template nhận `isPrint?: boolean` — dùng khi export PDF/HTML

---

*Cập nhật lần cuối: 2026-07-05 — hoàn thành WebDeploy `nha-khoa-tong-quat-antam` (ZEN-MINIMAL identity, Cormorant Garamond 300 + DM Sans, warm white #f7f5f0, Sage green #6b8067, React + PHP + SQLite, TS website 49 modules 200kB 0 lỗi, admin 56 modules 232kB 0 lỗi, PHP 23/23 OK 0 BOM, 5 trang: /, /dich-vu, /bac-si, /dat-lich, /lien-he, Nav transparent→scrolled, H11 Full-Width Text hero + marquee, List-Elegant services, Alternating-Strips team, at- CSS prefix)*

*Cập nhật lần cuối trước: 2026-07-05 — hoàn thành WebDeploy `nha-khoa-tham-my-luxdental` (BOLD-EDITORIAL identity, Syne 800, Scarlet `#d63b1f`, warm white `#faf9f6`, React + PHP + SQLite, TS website 49 modules 210kB 0 lỗi, admin 56 modules 237kB 0 lỗi, PHP 24/24 OK 0 BOM, 6 trang: /, /dich-vu, /truoc-sau, /bac-si, /dat-lich, /lien-he, Nav-8 underline-active always-solid, H5 Bold Typography Only hero, bento-grid services, masonry before/after gallery, lx- CSS prefix)*

*Cập nhật lần trước: 2026-07-05 — web-deploy-fixer `nha-khoa-quoc-te-vietduc` hoàn thành: fix bootstrap.php thiếu require_once MediaController/UnsplashController/UploadController, fix website/index.html thiếu Bootstrap 5.3.3 CDN, fix toàn bộ UI tiếng Việt có dấu trên tất cả 6 trang website (Header, Footer, HomePage, ServicesPage, FacilitiesPage, TeamPage, BookingPage, ContactPage), PHP 24/24 OK 0 BOM, TS website 44 modules 214kB 0 lỗi, admin 58 modules 233kB 0 lỗi — build ✅)*

*Cập nhật lần trước: 2026-07-04 — hoàn thành WebDeploy `nha-khoa-nu-cuoi-xua` (RETRO-BOLD identity, Space Grotesk 800, cream `#f5efdd`, Teal `#1f7a6b`, Mustard `#c98a1f`, React + PHP + SQLite, TS website 51 modules 212kB 0 lỗi, admin 57 modules 230kB 0 lỗi, PHP 24/24 OK 0 BOM, 6 trang: /, /dich-vu, /cau-chuyen, /bac-si, /dat-lich, /lien-he)*

*Cập nhật lần trước: 2026-07-04 — hoàn thành WebDeploy `nha-khoa-implant-future` (DARK-ENERGY identity, Syne 800, full dark #0a0710, neon magenta #c026d3, React + PHP + SQLite, TS website 50 modules 222kB 0 lỗi, admin 55 modules 221kB 0 lỗi, PHP 23/23 OK 0 BOM, Vite build thành công cả 2)*

**Ghi chú kỹ thuật `nha-khoa-implant-future`:**
- CSS prefix: `ft-` xuyên suốt
- Identity: DARK-ENERGY — Syne font weight 800, nền `#0a0710`, neon magenta `#c026d3`/`#e64fef`, violet `#7c3aed`
- Nav: always dark (fixed, `#0d0916` background, không transparent)
- Fonts: Bunny Fonts — syne:400,600,700,800 (không dùng Google Fonts)
- Trang website: `/`, `/dich-vu-implant`, `/cong-nghe-3d`, `/bac-si`, `/dat-lich`, `/lien-he`
- SiteContext: stat_cases, stat_doctors, stat_years, stat_satisfaction
- Public API: `GET /public/settings`, `GET /public/hero-slides`, `GET /public/services`, `GET /public/doctors`, `GET /public/testimonials`, `POST /public/bookings`, `POST /public/contact`
- DB Extension tables: services (number, features, price, is_featured, sort_order), doctors, bookings (pref_service, pref_date), testimonials (avatar_url, is_featured)
- DB seed: 6 dịch vụ Implant, 4 bác sĩ chuyên sâu, 4 testimonials, 35 settings keys
- TS build: website 50 modules 222kB 0 lỗi, admin 55 modules 221kB 0 lỗi
- PHP syntax: 23/23 files OK, 0 BOM
- Admin không có UserList route (không cần quản lý users riêng)

**Ghi chú kỹ thuật `nha-khoa-gia-dinh-sunrise`:**
- CSS prefix: `sr-` xuyên suốt
- Identity: FRESH-MINIMAL — Plus Jakarta Sans (Bunny Fonts), nền sáng `#f7fafd`, accent Sky Blue `#2f8fd1`
- Nav: transparent → `.scrolled` khi scrollY > 60 (Nav-1 pattern)
- Fonts: Bunny Fonts — plus-jakarta-sans:300,400,500,600,700 (không dùng Google Fonts, không Bootstrap)
- Trang website: `/`, `/dich-vu`, `/bac-si`, `/dat-lich`, `/lien-he`
- Extension tables: service_categories, services (category_id FK), doctors, bookings, testimonials
- DB seed: 5 nhóm dịch vụ, 15 dịch vụ (3/nhóm), 6 bác sĩ, 3 testimonials
- Booking fields: fullname, phone, email, service, member_count, date, time, note
- Social settings keys: `facebook`, `instagram`, `youtube`, `tiktok`, `zalo` (không có `_url` suffix)
- `api/client.ts` admin: `api.put` → POST `/path/update`, `api.delete` → POST `/path/delete` (IIS compat)
- web-deploy-fixer fix: SettingsController cột `group` → `grp`; tạo ProfileController.php missing; thêm routes `GET /hero-slides/:id` + `POST /users/:id/change-password`

**Ghi chú kỹ thuật `nha-khoa-dong-do`:**
- CSS prefix: `dd-` xuyên suốt
- Identity: LUXE-DARK — Cormorant Garamond (heading italic 300) + DM Sans (body), nền `#0b0d0c`, Jade Emerald `#0e7c66`/`#16a184`
- Nav: floating pill (fixed top 16px, border-radius 12px, shadow 0 24px 60px rgba(0,0,0,.5))
- Fonts: Bunny Fonts (không dùng Google Fonts) — cormorant-garamond + dm-sans
- Trang website: `/`, `/dich-vu`, `/doi-ngu-bac-si`, `/cong-nghe`, `/dat-lich`, `/lien-he`
- Extension tables: services (number, features, image, is_featured, sort_order), doctors, bookings (pref_doctor), testimonials (avatar_url)
- DB seed: 6 dịch vụ, 6 bác sĩ, 3 testimonials — nội dung từ template HTML thật
- `api/client.ts` admin: `api.put` và `api.delete` là aliases → tự gọi POST với suffix `/update` và `/delete`*

**Ghi chú kỹ thuật `nha-khoa-nu-cuoi-xua`:**
- CSS prefix: `nc-` xuyên suốt
- Identity: RETRO-BOLD — Space Grotesk weight 800, cream `#f5efdd`, Teal `#1f7a6b`, Mustard `#c98a1f`
- Nav: Nav-5 poster style — centered logo framed (nc-logo, border+shadow 4px 4px 0 var(--accent)), links below (nc-nav-links dashed border-top), always solid bg (no transparent/scroll)
- Fonts: Bunny Fonts — space-grotesk:300,400,500,600,700,800 (không dùng Google Fonts)
- Trang website: `/`, `/dich-vu`, `/cau-chuyen`, `/bac-si`, `/dat-lich`, `/lien-he` (6 trang — có thêm /cau-chuyen so với sunrise)
- SiteContext: stat_cases, stat_doctors, stat_years, stat_satisfaction, story_year, story_title, story_text, story_image
- Public API: `GET /public/settings`, `GET /public/hero-slides`, `GET /public/service-categories`, `GET /public/services`, `GET /public/doctors`, `GET /public/testimonials`, `POST /public/bookings`, `POST /public/contact`
- DB Extension tables: service_categories, services (category_id FK, image, tag, price, price_unit), doctors (tags, quote), bookings (pref_date, pref_time, pref_doctor), testimonials (author_avatar, stars, is_active, sort_order)
- DB seed: 5 nhóm dịch vụ, 11 dịch vụ, 6 bác sĩ, 3 testimonials, 35 settings keys
- Booking fields: fullname, phone, email, service, pref_date, pref_time, pref_doctor, note
- ProfileController.php: thiếu khi scaffold → tạo thủ công (queryOne + Auth::user())
- TS build: website 51 modules 212kB 0 lỗi, admin 57 modules 230kB 0 lỗi
- PHP syntax: 24/24 files OK, 0 BOM

**Ghi chú kỹ thuật `nha-khoa-quoc-te-vietduc`:**
- CSS prefix: `vd-` xuyên suốt
- Identity: CLEAN-CORPORATE — Outfit (Bunny Fonts), nền sáng `#f8fbfc`, accent Teal `#0f6d82`, dark `#0a2129`
- Nav: Nav-4 transparent → `.scrolled` khi scrollY > 20, border-top 3px solid var(--accent) khi scrolled
- Fonts: Bunny Fonts — outfit:300,400,500,600,700 (không dùng Google Fonts)
- Trang website: `/`, `/dich-vu`, `/co-so-vat-chat` (FacilitiesPage), `/bac-si`, `/dat-lich`, `/lien-he`
- SiteContext: stat_branches, stat_cities, stat_doctors, stat_years (thông tin đa chi nhánh quốc tế)
- Public API: `GET /public/settings`, `GET /public/hero-slides`, `GET /public/service-categories`, `GET /public/services`, `GET /public/doctors`, `GET /public/testimonials`, `POST /public/bookings`, `POST /public/contact`
- DB Extension tables: service_categories, services (category_id FK, tag, price, is_featured), doctors (flag TEXT DEFAULT 'Trong nuoc', tags pipe-separated), bookings (branch TEXT — đa chi nhánh), testimonials (avatar_url, is_featured)
- `doctors.flag` column: `'Trong nuoc'` hoặc `'Quoc te'` — filter trên TeamPage và TeamList admin
- `bookings.branch` column: duy nhất cho vietduc (đa chi nhánh) — select branch khi đặt lịch
- DB seed: 6 nhóm dịch vụ, 11 dịch vụ, 8 bác sĩ (4 Trong nuoc + 4 Quoc te), 3 testimonials, settings gồm branch info (branch_hcm_address, branch_hn_address, etc.)
- Booking fields: fullname, phone, email, branch, service, pref_date, pref_time (radio TIME_SLOTS), note
- Auth.php: session_name `vietduc_sess` (không phải tên mặc định scaffold)
- ProfileController.php: thiếu khi scaffold → tạo thủ công
- UserList.tsx: thiếu khi scaffold → tạo thủ công
- ContactDetail.tsx: thiếu khi scaffold → tạo stub re-export ContactList
- main.tsx website: thiếu khi scaffold → tạo thủ công (import App + template.css)
- Admin CSS: dùng `adm-*` prefix cho pages mới + `sb-*` cho Sidebar — alias block thêm vào admin.css
- Admin Settings: 8 tabs (general, seo, social, contact, hero, stats, cloudinary, integrations) + branch info fields
- TS build: website 44 modules 214kB 0 lỗi, admin 58 modules 233kB 0 lỗi
- PHP syntax: 24/24 files OK, 0 BOM
- web-deploy-fixer fixes (2026-07-05): migrate() comment-stripping pattern, thêm routes /media + /upload + /unsplash vào bootstrap.php, fix MediaController::destroy dùng $p[1] thay $p['id'], fix build.mjs duplicate blocks, fix toàn bộ UI tiếng Việt có dấu

**Ghi chú kỹ thuật `nha-khoa-tong-quat-antam`:**
- CSS prefix: `at-` xuyên suốt (an-tam)
- Identity: ZEN-MINIMAL — Cormorant Garamond weight 300 (heading) + DM Sans (body), nền warm white `#f7f5f0`, Sage green accent `#6b8067`
- Nav: transparent → `.at-nav-scrolled` khi scrollY > 60 (Nav-1 tối giản, không blur mạnh)
- Fonts: Bunny Fonts — cormorant-garamond:300,400,400i,500 + dm-sans:300,400,500,600
- Hero: H11 Full-Width Text — heading serif clamp(46px,9.2vw,132px), marquee strip (28s), scroll hint animation
- Trang website: `/`, `/dich-vu`, `/bac-si`, `/dat-lich`, `/lien-he` (5 trang)
- Services: List-Elegant style (số thứ tự + tên + giá, hover indent), phân theo 3 nhóm: Khám & phòng ngừa, Điều trị, Thẩm mỹ răng
- Team: Alternating-Strips layout (homepage) + Grid 4-col (team page)
- SiteContext: stat_patients, stat_years, stat_satisfaction (3 stats) + calm_quote, calm_attr_name, calm_attr_role (philosophy section)
- Public API: `GET /public/settings`, `GET /public/hero-slides`, `GET /public/service-categories`, `GET /public/services`, `GET /public/doctors`, `GET /public/testimonials`, `POST /public/bookings`, `POST /public/contact`
- DB Extension tables: service_categories, services (number, price, price_unit, is_featured), doctors (specialties pipe-separated), bookings (fullname, phone, email, service, doctor, date, time, note), testimonials (author_avatar, rating, is_featured)
- DB seed: 3 nhóm dịch vụ, 12 dịch vụ, 4 bác sĩ, 3 testimonials, 35 settings keys
- Booking fields: fullname, phone, email, service, doctor, date, time, note
- Admin pages: dashboard, bookings, services (+ categories), team, testimonials, contacts, slides, media, settings, profile
- TS build: website 49 modules 200kB 0 lỗi, admin 56 modules 232kB 0 lỗi
- PHP syntax: 23/23 files OK, 0 BOM
- website/src/main.tsx: thiếu khi scaffold → tạo thủ công

**Ghi chú kỹ thuật `nha-khoa-tham-my-luxdental`:**
- CSS prefix: `lx-` xuyên suốt
- Identity: BOLD-EDITORIAL — Syne font weight 800 (Bunny Fonts), warm white `#faf9f6`, Scarlet accent `#d63b1f`, 0px border-radius (no rounding)
- Nav: Nav-8 — underline-active only (::after scaleX), always solid `background: var(--bg)`, no transparent/scrolled behavior
- Fonts: Bunny Fonts — syne:400,600,700,800 (không dùng Google Fonts)
- Hero: H5 Bold Typography Only — huge heading `clamp(52px, 10.5vw, 148px)`, diagonal repeating-linear-gradient pattern + "Smile" watermark, marquee strip dark background
- Trang website: `/`, `/dich-vu`, `/truoc-sau`, `/bac-si`, `/dat-lich`, `/lien-he` (6 trang — /truoc-sau thay cho /cau-chuyen)
- SiteContext: stat_cases, stat_doctors, stat_years, stat_satisfaction, hero_title_line1, hero_title_line2, hero_subtitle
- Public API: `GET /public/settings`, `GET /public/service-categories`, `GET /public/services`, `GET /public/doctors`, `GET /public/testimonials`, `POST /public/bookings`, `POST /public/contact`
- DB Extension tables: service_categories, services (category_id FK, image, tag, price, price_unit, is_featured), doctors (credentials pipe-separated, experience_years), bookings (fullname, phone, email, service, date, time, note), testimonials (author_avatar, stars, is_featured)
- DB seed: 3 nhóm dịch vụ, 9 dịch vụ, 4 bác sĩ, 3 testimonials, 35 settings keys
- Booking fields: fullname, phone, email, service, date, time, note
- Services page: filter by category with tag-strip buttons
- Before/After page: masonry 3-column layout, lx-ba-grid 2-column split, lx-ba-label badge
- Cards: `border-left: 6px solid var(--accent)` + hover darkens to `var(--dark)` bg
- Footer mega text: `LuxDental` với `span { color: var(--accent) }`
- ProfileController.php: thiếu khi scaffold → tạo thủ công
- website/src/main.tsx: thiếu khi scaffold → tạo thủ công
- website/src/pages/: không có trong scaffold → tạo thủ công (6 page files)
- TS build: website 49 modules 210kB 0 lỗi, admin 56 modules 237kB 0 lỗi
- PHP syntax: 24/24 files OK, 0 BOM
