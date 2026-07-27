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
7. **CLAUDE.md ghi facts tra cứu (conventions, bug pattern, schema, identity token...), KHÔNG ghi nhật ký thay đổi (ai sửa gì ngày nào, quá trình review/QA chi tiết) — lịch sử đó đã có trong `git log`.** Mỗi khi hoàn thành 1 site/feature: cập nhật hoặc thêm mới đúng 1 block "Ghi chú kỹ thuật" tương ứng, không thêm block tường thuật riêng.
8. Đối với các task nặng mà Claude Code tự động tạo agent chạy nền (background agent): mặc định các agent chạy nền đó phải chạy ở model Claude Sonnet 4.6.
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
| `shop-template-builder` | Chuyên biệt từ `template-builder` cho ngách shop — catalog sản phẩm JS thật (bộ lọc ngang trên lưới, sort, phân trang cổ điển, áp dụng tức thì không nút Apply), 2 mode trang chủ (catalog hợp nhất / chia chủ đề) random mỗi lần tạo | Read, Write, Edit, Glob, Grep, WebFetch, WebSearch, Bash |
| `shop-catalog-builder` | Chuyên biệt hóa thêm từ `shop-template-builder` — trang chủ CHỈ tìm kiếm + catalog sản phẩm, KHÔNG hero/story/testimonials/stat-bar thương hiệu; toàn bộ nội dung giới thiệu dồn sang trang Giới thiệu/Dịch vụ riêng trong nav | Read, Write, Edit, Glob, Grep, WebFetch, WebSearch, Bash |
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
- [x] Shop bán hàng — **DONE** (16 templates, 11 có WebDeploy đầy đủ — `shop-ban-hang/` ORGANIC-EARTH, `shop-thoi-trang/` BOLD-EDITORIAL, `shop-giay-dep/` DARK-ENERGY, `shop-quan-ao/` SOFT-PASTEL, `shop-rau-xanh/` WARM-ARTISAN, `shop-thuc-pham-sach/` FRESH-MINIMAL, `shop-tui-sach/` LUXE-DARK, `shop-may-tinh/` GLASS-MODERN, `shop-may-anh/` GEOMETRIC-MODERN, `shop-ami-mobile/` RETRO-BOLD, `shop-quan-ao-ami/` ZEN-MINIMAL (WebDeploy build 2026-07-24); 5 template-only từ batch `shop-catalog-builder` 2026-07-27 — `shop-the-thao/` DARK-ENERGY variant Signal Orange, `shop-do-choi/` SOFT-PASTEL variant Sky Blue+Coral, `shop-my-pham/` LUXE-DARK variant Rose Gold, `shop-do-gia-dung/` WARM-ARTISAN variant Terracotta+Sage, `shop-van-phong-pham/` CLEAN-CORPORATE fresh token Steel Blue — xem bảng **WebDeploy Projects**)
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
- [x] Deploy website demo — xem bảng **WebDeploy Projects** (bao gồm `nail-salon` 2026-06-26, `pilates-studio` 2026-06-26, `spa-beauty` 2026-06-27, `tham-my-vien` 2026-07-01, `nha-khoa-chinh-nha-saigon` 2026-07-04, `nha-khoa-cong-nghe-smiletech` 2026-07-04, `shop-quan-ao` 2026-07-13, `shop-giay-dep` 2026-07-13, `shop-rau-xanh` 2026-07-16, `shop-thuc-pham-sach` 2026-07-16)
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
node scaffolder.mjs [slug] [type: cafe|restaurant|spa|spa-service|portfolio|company|blog|shop]
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
│       ├── Shops/                  ← ✅ 14 shop templates (xem bảng tra nhanh cho chi tiết từng site)
│       │   ├── shop-ban-hang/      (ORGANIC-EARTH, WebDeploy đầy đủ)
│       │   ├── shop-thoi-trang/    (BOLD-EDITORIAL, WebDeploy đầy đủ)
│       │   ├── shop-giay-dep/      (DARK-ENERGY, WebDeploy đầy đủ)
│       │   ├── shop-quan-ao/       (SOFT-PASTEL, WebDeploy đầy đủ)
│       │   ├── shop-thuc-pham-sach/ (FRESH-MINIMAL, WebDeploy đầy đủ)
│       │   ├── shop-rau-xanh/      (WARM-ARTISAN, WebDeploy đầy đủ)
│       │   ├── shop-tui-sach/      (LUXE-DARK, WebDeploy đầy đủ)
│       │   ├── shop-may-anh/       (GEOMETRIC-MODERN, WebDeploy đầy đủ)
│       │   ├── shop-may-tinh/      (GLASS-MODERN, WebDeploy đầy đủ)
│       │   ├── shop-ami-mobile/    (RETRO-BOLD, WebDeploy đầy đủ, css prefix mb-)
│       │   ├── shop-quan-ao-ami/   (ZEN-MINIMAL, WebDeploy đầy đủ, css prefix am-, shop-catalog-builder)
│       │   ├── shop-the-thao/      (DARK-ENERGY variant Signal Orange, template-only, css prefix tt-, shop-catalog-builder)
│       │   ├── shop-do-choi/       (SOFT-PASTEL variant Sky Blue+Coral, template-only, css prefix dc-, shop-catalog-builder)
│       │   ├── shop-my-pham/       (LUXE-DARK variant Rose Gold #c98a8a, WebDeploy đầy đủ, css prefix mp-, shop-catalog-builder)
│       │   ├── shop-do-gia-dung/   (WARM-ARTISAN variant Terracotta+Sage, template-only, css prefix dg-, shop-catalog-builder)
│       │   └── shop-van-phong-pham/ (CLEAN-CORPORATE fresh token Steel Blue, template-only, css prefix vp-, shop-catalog-builder)
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
- **Nav "Kiến thức"**: trỏ `/blog` — dùng chung route Blog có sẵn, 1 phần tử trong mảng `navLinks` dùng chung cho desktop + mobile nav.
- **Blog nội dung**: chiến lược "Kiến thức/Cẩm nang" (case study từ WebDeploy projects + hướng dẫn theo ngách + so sánh template nội bộ) — KHÔNG đăng lại/dịch tin tức từ nguồn khác (tránh vi phạm Luật SHTT + Nghị định 72/2013). Seed qua `prisma/seed.ts` (upsert Category + Post), 3 category: `cam-nang` (mặc định), `case-study`, `so-sanh` — chọn qua field `categorySlug?: string`, resolve qua `blogCategoryMap[post.categorySlug] ?? blogCategory.id` (dùng `??` để category không rơi về NULL nếu gõ sai slug). Content parser `renderMarkdown()` trong `blog/[slug]/page.tsx`: dòng riêng `**Text**` → H2, `- ` đầu dòng → list item, `**bold**` inline → strong.
- **Blog trang chủ tin tức**: `blog/page.tsx` là Server Component (fetch posts+categories) render `BlogClient.tsx` (Client Component) — hero + search client-side + category chips + section "🔥 Nổi bật" (ưu tiên `featured`, fallback mới nhất) + grid mới nhất.
- **Auto-fetch ảnh Unsplash**: `src/lib/blogThumbnail.ts` — `ensurePostThumbnail(post)` chỉ chạy khi `thumbnail` rỗng; đọc `unsplash_access_key` từ bảng `settings`; suy ra query tiếng Anh qua bảng `NICHE_KEYWORDS` (Unsplash index theo tiếng Anh); chọn ảnh theo `post.id % 5` (tránh trùng ảnh giữa bài cùng ngách); lưu vào DB — chỉ gọi Unsplash 1 lần/bài. Chưa cấu hình key → graceful degradation về emoji 📝 placeholder.
- **Related posts**: `getRelatedPosts(excludeId, categoryId, extraExcludeIds)` tối đa 6 bài cùng category, fallback bài mới nhất nếu thiếu (loại trừ cả `extraExcludeIds`). Biến `fromDb: boolean` phân biệt DB thật vs mock fallback.
- **Trang chi tiết bố cục 2 cột + sidebar**: `.wd-container` với `row g-4 g-lg-5` → `col-lg-8` nội dung + `col-lg-4` sidebar (sticky top 80) gồm search form GET thuần (`/blog?q=...`), widget "Bài viết mới nhất" (`getLatestPosts`), ô placeholder quảng cáo. **Dedupe bắt buộc**: tính `latestRaw` (5 bài) TRƯỚC, truyền `latestRaw.map(id)` làm `extraExcludeIds` cho `getRelatedPosts` — tránh trùng bài giữa "liên quan" và "mới nhất" + tránh gọi Unsplash trùng lặp.
- **`admin/posts` filter**: Client Component (`'use client'`) — debounce search 400ms, filter/pagination qua `onClick` set state + `fetch()`, không dùng `<form>`/`<a href="?...">` (tránh reload trang). API `GET /api/admin/posts` trả kèm `counts: {all,published,draft}`. `page` param validate `Number.isNaN` trước khi truyền Prisma `skip` (tránh crash 500 với `?page=abc`).
- **XSS trong `renderMarkdown()`**: KHÔNG dùng `dangerouslySetInnerHTML` cho nội dung bài viết — dùng `renderInlineBold()` tách `**chữ đậm**` thành React node `<strong>` qua `text.split(/\*\*([^*]+)\*\*/g)`, phần còn lại luôn là text thuần qua React (tự escape). Chỉ còn đúng 1 `dangerouslySetInnerHTML` cho JSON-LD (không phải nội dung bài viết).
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
- **SePay bank info (site chính)**: cấu hình qua Admin → Cài đặt → tab "🏦 SePay / Ngân hàng" (5 field: `sepay_api_key` + `sepay_bank_name/sepay_bank_code/sepay_account_no/sepay_account_name`, bảng `settings` chung). `src/lib/sepay.ts::getSepayBankInfo()` chỉ dùng giá trị DB khi **đủ cả 4 field** — thiếu 1 field thì fallback nguyên cụm default, tránh trộn bank code mới với số TK cũ. `getSepayApiKey()` đọc DB trước, fallback `process.env.SEPAY_API_KEY`. 3 nơi hiển thị bank info đều gọi hook `useBankInfo()` → fetch public route `GET /api/checkout/bank-info` (không lộ `sepay_api_key`).
- **Đồng bộ tài khoản từ SePay API**: nút "🔄 Đồng bộ tài khoản từ SePay" gọi `POST /api/admin/settings/sepay-sync` (superadmin only) → `fetchSepayBankAccounts()` gọi `GET https://my.sepay.vn/userapi/bankaccounts/list` với `Authorization: Bearer <sepay_api_key>` — SePay chỉ cấp 1 credential "API Access" dùng CẢ 2 việc: xác thực webhook đến (`Authorization: Apikey`) VÀ gọi API chính chủ lấy tài khoản NH đã liên kết (`Authorization: Bearer`). Lọc bỏ tài khoản `active:"0"`; >1 tài khoản active → chọn đầu tiên + warning. Chỉ điền state, phải bấm "Lưu cài đặt" mới ghi DB.
- `GET /api/admin/settings` redact secret (`sepay_api_key`, `smtp_password`, `cloudinary_api_secret`, `unsplash_access_key`, `football_api_key`) khỏi session không phải `superadmin`. Webhook token compare dùng `timingSafeEqual` (không dùng `!==` thô — tránh timing attack).

### Templates (webdrop.store)

- `hasWebsite: Boolean` — phân biệt template-only vs có website đầy đủ
- `/templates?type=starter` → `hasWebsite=false` | `?type=standard` → `hasWebsite=true`
- Khi không có `?type` → show tất cả, badge 📦/🌐
- **`deployUrl: String?` (thêm 2026-07-24, mặc định `null`)** — link website đã triển khai thật (khác `demoUrl` là bản demo tĩnh trên `webdrop-eol.pages.dev`). Ưu tiên resolve `deployUrl || demoUrl` ở MỌI nơi hiển thị nút "Xem demo": `TemplateGrid.tsx` (2 vị trí `DemoButton`), `TemplateDetailClient.tsx` (gallery overlay + sidebar — riêng effect fetch screenshot vẫn dùng cứng `demoUrl`, không đổi), admin list page (`Demo ↗`). Sửa/thêm qua admin `TemplateForm.tsx` (field "Deploy URL" ngay dưới "Demo URL") → API `POST/PATCH /api/admin/templates`. Migration `20260724_add_template_deploy_url`. **Lưu ý khi migrate DB này**: `migrate dev` không chạy được (môi trường non-interactive) — phải tạo migration.sql thủ công + `migrate deploy`; đồng thời phát hiện migration cũ `20260611_add_template_prices` chưa từng được đánh dấu applied dù cột đã tồn tại thật trong DB (drift từ trước) — đã fix bằng `prisma migrate resolve --applied` (không đụng dữ liệu) trước khi deploy migration mới.
- **Bug pattern phát hiện 2026-07-23**: build xong 1 site `Sources/WebDeploy/[slug]/` KHÔNG tự động xuất hiện trên trang `/templates` — phải thêm thủ công 1 entry vào `templateData` trong `Sources/system/prisma/seed.ts` rồi chạy `npm run db:seed` (thư mục `Sources/system`) để upsert vào Postgres. Đã phát hiện 7 site shop (`shop-giay-dep`, `shop-quan-ao`, `shop-thuc-pham-sach`, `shop-rau-xanh`, `shop-tui-sach`, `shop-may-anh`, `shop-may-tinh`) build xong từ lâu nhưng chưa từng được thêm vào seed — đã bổ sung, tổng template hiện tại: 50 (49 web + 1 admin).
- **Bug pattern thứ 2 phát hiện cùng ngày, phạm vi rộng hơn**: kể cả những site ĐÃ có trong seed từ trước, phần lớn vẫn thiếu field `hasWebsite: true` dù có site WebDeploy đầy đủ tương ứng — hậu quả: trang `/templates` hiển thị nhầm badge 📦 (template-only) thay vì 🌐 (có website) cho gần như toàn bộ site đã build. Kiểm tra chéo `templateData` với danh sách thư mục thực tế trong `Sources/WebDeploy/` phát hiện 40/49 slug bị thiếu — đã bổ sung `hasWebsite: true` cho toàn bộ (Restaurants, Cafes, Companies, Forums, Portfolios, Blogs, Spa-Services, Dental-Clinics, `shop-thoi-trang`). Sau fix: 48/49 template web có `hasWebsite: true` — chỉ còn `yoga-wellness` là `false` đúng nghĩa (chưa có site WebDeploy tương ứng). **Quy trình chuẩn từ nay khi build xong 1 site**: thêm/update entry `templateData` với `hasWebsite: true` NGAY khi build xong, không tách rời 2 bước như trước.
- **`shop-ami-mobile` + `shop-quan-ao-ami` (2026-07-24)**: 2 template shop mới thêm vào `Sources/templates/web/Shops/` — `shop-ami-mobile` (AMI Mobile, điện thoại & phụ kiện, tông mustard, có WebDeploy đầy đủ → `hasWebsite: true`) và `shop-quan-ao-ami` (AMI Fashion, thời trang tối giản — ban đầu template-only, đã build WebDeploy đầy đủ cùng ngày, xem block riêng bên dưới → `hasWebsite: true`). Cả 2 khi phát hiện đều còn sót placeholder bracket chưa điền (`[SỐ_ĐIỆN_THOẠI]`/`[ZALO_NUMBER]`/`[EMAIL@AMI.VN]`/`[ĐỊA CHỈ SHOWROOM]`/`[5.000+]`...) — ĐÃ điền demo hợp lý cho cả 2 (không phải bug bắt buộc fix vì convention bracket-placeholder này vẫn đang dùng ở nhiều template khác đã publish như `shop-tui-sach`/`shop-quan-ao`/`shop-may-anh`, nhưng chủ dự án muốn điền demo thật cho riêng 2 site này). Đã thêm vào `prisma/seed.ts` + chạy `db:seed`. Tổng template: 53 (52 web + 1 admin).

### Gói Web cơ bản (WebDeploy)

- Build: `build.bat` (Windows), `bash build.sh` (Linux/Mac) → output `deploy/`
- DB tự seed lần đầu khi PHP nhận request đầu tiên — không cần setup thủ công
- Ship 2 file routing song song: `.htaccess` (Apache) + `web.config` (IIS) — cập nhật cả hai khi đổi rule
- Schema: `schema.sql` (SQLite) + `schema_mysql.sql` (MySQL option)
- Đã test: PA Vietnam Windows hosting (Plesk + IIS + PHP 8.3 FastCGI)

### SEO baseline cho site WebDeploy (2026-07-18)

Audit phát hiện: site WebDeploy là React SPA thuần (CSR, không SSR) — trước đây chỉ có title/meta description TĨNH giống nhau cho mọi trang, không OG/Twitter/canonical, không robots.txt/sitemap.xml, không đọc `settings` nhóm `seo` (đã seed trong DB nhưng không nơi nào dùng tới). Đã vá ở **cấp `_scaffold/`** (áp dụng cho site MỚI từ giờ trở đi — KHÔNG hồi tố 47 site đã build, xem `web-deploy-builder.md` rule 30 cho chi tiết đầy đủ):
- `_scaffold/website/public/robots.txt` — file tĩnh mới, trỏ `Sitemap: /api/sitemap.xml`.
- `_scaffold/website/src/hooks/useDocumentMeta.ts` — hook mới, mọi page gọi để set title/meta description/canonical THEO ĐÚNG route (không cần react-helmet — chỉ `useEffect` thao tác `document.head` trực tiếp).
- `_scaffold/types/shop/api/src/controllers/ShopPublicController.php` — thêm method `sitemap()` (tĩnh, deterministic) sinh XML động từ bảng `products` thật + route `GET /sitemap.xml` (đăng ký ở rule 28b). Site type khác `shop` (`restaurant`/`cafe`/`spa-service`/`company`/`portfolio`/`blog`) chưa có bản scaffold tĩnh tương ứng — AI tự viết theo pattern nêu ở rule 30 vì `PublicController.php` các type này vốn đã do AI viết riêng.
- Route path `/sitemap.xml` (không tiền tố `/api`) vì `api/index.php` tự strip `/api` khỏi `$rawPath` trước khi dispatch — request thật vào `https://domain/api/sitemap.xml`.

**Retrofit cho 8 site shop đã build (2026-07-18):** áp dụng baseline trên vào toàn bộ site WebDeploy nhóm shop hiện có (`shop-ban-hang`, `shop-thoi-trang`, `shop-giay-dep`, `shop-quan-ao`, `shop-rau-xanh`, `shop-thuc-pham-sach`, `shop-tui-sach`, `shop-may-tinh`) — KHÔNG áp dụng cho 9 template tĩnh (gap SEO này đặc thù kiến trúc CSR SPA, template tĩnh mỗi trang đã có `<title>`/`<meta>` riêng sẵn trong HTML, không bị vấn đề tương tự) và KHÔNG áp dụng cho các site WebDeploy ngành khác (nhà hàng/spa/nha khoa...) — ngoài phạm vi yêu cầu. 2 site thế hệ cũ (`shop-ban-hang`, `shop-thoi-trang`) không có `ShopPublicController.php` riêng — method `sitemap()` được thêm thẳng vào `PublicController.php` (file gộp chung mọi logic public của site đó) thay vì `ShopPublicController.php`. Mỗi site: `$staticRoutes` trong `sitemap()` đã điều chỉnh khớp đúng route thật của `App.tsx` từng site (không dùng chung 1 danh sách — `shop-may-tinh` có `/dich-vu`/`/khuyen-mai` thay vì `/ve-chung-toi`/`/bo-suu-tap` như các site khác). Verify độc lập: `php -l` + `tsc --noEmit` 0 lỗi trên cả 8 site, `useDocumentMeta` có mặt ở toàn bộ file trong `pages/`.

**Retrofit cho `blog-ca-nhan` (2026-07-18, WebDeploy blog duy nhất hiện có):** site này đã có sẵn hook `usePageTitle` tự viết (set `document.title` theo route, dùng ở cả 7 page trong `website/src/components/pages/` — thư mục pages khác vị trí so với site shop, không phải `src/pages/`) — thay vì tạo `useDocumentMeta` song song gây trùng lặp, đã MỞ RỘNG `usePageTitle` thêm tham số `description` thứ 2 tùy chọn để set thêm meta description/OG/Twitter/canonical, giữ nguyên toàn bộ chữ ký gọi cũ (page nào không truyền description vẫn chạy đúng như trước, tự fallback về `settings.meta_description`). `PublicController::sitemap()` gồm route tĩnh (`/`, `/lien-he`, `/ve-toi`, `/tat-ca-bai-viet` — loại `/tim-kiem` vì trang search không nên index) + toàn bộ `posts` (published)/`post_categories`/`tags` theo slug thật.

**Retrofit cho 7 site cafe/company (2026-07-18):** `cafe-thoi-gian` (cafe); `agency-sang-tao`/`agency-web`/`cong-ty-xay-dung`/`tu-van-tai-chinh` (company, schema chuẩn `services`/`team_members`/`projects`/`testimonials`); `startup-cong-nghe`/`luat-van-phong` (company theo phân loại của chủ dự án dù schema bespoke riêng — SaaS landing page và law-office, không có `team_members`/`projects` giống nhau nhưng cùng nhóm "company" về mặt sản phẩm). Cả 7 site đều KHÔNG có route chi tiết động (menu/dự án/dịch vụ hiển thị inline, không có trang `/xxx/:slug` riêng) nên `sitemap()` chỉ liệt kê route tĩnh, không cần query DB. 5/7 site (`cafe-thoi-gian`, `agency-web`, `tu-van-tai-chinh`, `startup-cong-nghe`, `luat-van-phong`) đã có sẵn hook `usePageTitle` tự viết (cùng thế hệ scaffold với `blog-ca-nhan`) — mở rộng thêm tham số `description` thay vì tạo hook mới; 2/7 site (`agency-sang-tao`, `cong-ty-xay-dung`) chưa có hook nào — tạo mới `useDocumentMeta` theo baseline `_scaffold/`. Phát hiện phụ đã tiện tay sửa: `tu-van-tai-chinh/website/index.html` có `meta description` gốc bị lỗi mojibake (double-encoded UTF-8) — sửa luôn vì đang cập nhật đúng dòng đó.

**⚠️ Bug phát hiện, CHƯA fix (ngoài phạm vi task SEO):** `luat-van-phong/api/src/Database.php` — phần seed `$settings` (site_name/site_tagline/site_description/meta_title/meta_description/meta_keywords/site_address/working_hours...) bị lỗi mojibake double-encoded UTF-8 (vd `'Nguyá»…n & Äá»“ng Nghiá»‡p'` thay vì `'Nguyễn & Đồng Nghiệp'`) — các chuỗi khác trong cùng file (vd message trong `submitConsultation()`) không bị lỗi, nên đây là lỗi cục bộ ở khối seed settings, không phải toàn file. `website/index.html` đã viết tay nội dung đúng (không lấy từ seed bị lỗi) nên không bị ảnh hưởng, nhưng dữ liệu thật hiển thị trên site (site_name, tagline, địa chỉ, giờ làm việc...) vẫn sẽ sai ký tự cho đến khi sửa + re-seed DB — cần xử lý riêng, không thuộc phạm vi SEO baseline.

**Retrofit cho 11 site Dental-Clinics (2026-07-20/21):** áp dụng baseline SEO trên toàn bộ site WebDeploy nha khoa (`nha-khoa-chinh-nha-saigon`, `nha-khoa-chinh-nha-saigon-green`, `nha-khoa-cong-nghe-smiletech`, `nha-khoa-dong-do`, `nha-khoa-gia-dinh-sunrise`, `nha-khoa-implant-future`, `nha-khoa-nu-cuoi-xua`, `nha-khoa-quoc-te-vietduc`, `nha-khoa-tham-my-luxdental`, `nha-khoa-tong-quat-antam`, `nha-khoa-tre-em-kidsmile`). Batch này chạy qua 11 agent song song, 9/11 gặp lỗi giới hạn phiên API giữa chừng — phần dở dang được audit thủ công (grep robots.txt/hook/mức độ page đã wire/method `sitemap()`/route đăng ký/`og:title`) rồi hoàn thiện trực tiếp thay vì dispatch lại agent (tránh lặp lại rủi ro giới hạn phiên).
- **Bug phát hiện lặp lại ở 3 site** (`nha-khoa-chinh-nha-saigon-green`, `nha-khoa-gia-dinh-sunrise`, `nha-khoa-nu-cuoi-xua`): `App.tsx`/`AppShell` render JSX `<title>{siteName}...</title>` tĩnh (React 19 native `<title>` tag) — re-render mỗi lần đổi route và ĐÈ MẤT title động vừa set bởi hook `useDocumentMeta` của từng trang. Fix: xoá cả dòng `<title>` JSX lẫn khai báo `const siteName = ...` không còn dùng.
- **Kiến trúc lệch nhau giữa các site** (đã audit từng site trước khi sửa, không giả định pattern chung): import path `useSite` khác nhau (`'../contexts/SiteContext'` ở đa số, `'../App'` ở `nha-khoa-tham-my-luxdental`); chữ ký `PublicController::sitemap()` khác nhau theo file gốc từng site (`array $p`, `array $p = []`, hoặc không tham số — Router vẫn gọi được cả 3 vì PHP bỏ qua tham số dư khi dispatch); tên biến PublicController trong `bootstrap.php` khác nhau (`$pub` phổ biến nhất, `$publicCtrl` ở `nha-khoa-tham-my-luxdental`).
- **2 site không có site-context system nào** (`nha-khoa-tong-quat-antam`, không có `contexts/` lẫn `useSite`): title/description hardcode trực tiếp trong từng `useDocumentMeta({...})` call, lấy từ seed thật trong `Database.php` (đã verify không mojibake) thay vì cố ép vào pattern settings-context không tồn tại.
- `nha-khoa-quoc-te-vietduc`, `nha-khoa-tham-my-luxdental`, `nha-khoa-tong-quat-antam`, `nha-khoa-tre-em-kidsmile`: build toàn bộ thủ công (agent tương ứng fail sớm hoặc chưa chạm tới) — đều đã qua `php -l` + `npx tsc --noEmit` 0 lỗi.
- **Bug phụ phát hiện qua review độc lập sau batch, đã fix**: `nha-khoa-implant-future/website/src/contexts/SiteContext.tsx` — interface `SiteSettings` thiếu 2 field `meta_title`/`meta_description` dù DB seed có 2 key này (`Database.php` nhóm `seo`) — `HomePage.tsx` dùng `settings.meta_title`/`settings.meta_description` trong `useDocumentMeta()` bị lỗi TS2339. Đã bổ sung 2 field vào interface.
- Verify độc lập toàn batch (11/11 site): `robots.txt` + hook file + `useDocumentMeta`/`usePageTitle` ở 100% trang + method `sitemap()` + route `/sitemap.xml` đăng ký + `og:title` trong `index.html` — đều OK; `php -l` 0 lỗi trên `PublicController.php` + `bootstrap.php` cả 11 site; `npx tsc --noEmit` 0 lỗi cả 11 site (sau khi fix bug `nha-khoa-implant-future` ở trên); 0 file còn `console.log`; 0 site còn title-conflict JSX.

**Retrofit cho `forum-cong-dong` (2026-07-21, WebDeploy forum duy nhất hiện có):** site này có kiến trúc tối giản hơn hẳn — chỉ 2 trang (`HomePage.tsx` hiển thị category + thread list inline, `ContactPage.tsx`), 2 route (`/`, `/contact`), KHÔNG có route chi tiết thread (`/thread/:slug`) dù backend `ForumThreadController`/`PublicController::forumThreads()` đã hỗ trợ đầy đủ — nên `sitemap()` chỉ liệt kê 2 route tĩnh, không query DB. Chưa có hook nào sẵn có → tạo mới `useDocumentMeta.ts` theo baseline `_scaffold/`, wire vào cả 2 page. `settings()` trả về gộp theo `group` (`{general:{...}, seo:{...},...}`) — `SiteContext.tsx` đã tự flatten qua spread trước khi expose `settings.meta_title`/`settings.meta_description`. Verify: `php -l` + `npx tsc --noEmit` 0 lỗi, 0 `console.log`, không có title-conflict JSX.

**Retrofit cho `portfolio-toi` (2026-07-21, WebDeploy portfolio duy nhất hiện có):** site này KHÔNG dùng React Router — toàn bộ nội dung (Hero/About/Projects/Skills/Testimonials/Contact) render trong một `App.tsx` duy nhất, chỉ 1 "route" (`/`). Trước đó `App.tsx` đã tự set `document.title = s.meta_title` thủ công trong `useEffect` fetch settings — thay bằng gọi `useDocumentMeta({ title, description })` (hook mới tạo, cùng baseline `_scaffold/`) để có thêm OG/Twitter/canonical, xoá dòng set title thủ công cũ. `sitemap()` chỉ liệt kê đúng 1 route tĩnh `/`. Verify: `php -l` + `npx tsc --noEmit` 0 lỗi, 0 `console.log`.

**Retrofit cho 9 site Restaurants (2026-07-21):** `am-thuc`, `nha-hang-cao-cap`, `nha-hang-chay-organic`, `nha-hang-hai-san`, `nha-hang-nhat-ban`, `nha-hang-phap`, `nha-hang-truyen-thong`, `quan-an-pho-bien`, `quan-bbq-lua`. Chạy 9 agent song song (không lặp lại sự cố giới hạn phiên API của batch nha khoa trước đó — cả 9 agent hoàn thành sạch trong 1 lần). Kiến trúc lệch nhau rõ rệt giữa các site, mỗi agent tự phát hiện và thích ứng thay vì ép theo 1 khuôn:
- **4 site có `src/pages/` riêng** (`am-thuc`, `nha-hang-chay-organic`, `nha-hang-truyen-thong`, `quan-bbq-lua`) — pattern chuẩn giống batch nha khoa.
- **5 site "single-file"**: page component định nghĩa TRỰC TIẾP trong `App.tsx` (không có thư mục `pages/`) — `nha-hang-cao-cap`, `nha-hang-hai-san`, `nha-hang-nhat-ban`, `nha-hang-phap`, `quan-an-pho-bien` — hook được wire trực tiếp vào từng function component nằm chung file đó.
- **`nha-hang-cao-cap` là site 1-trang thật sự** (anchor-nav, không dùng React Router dù có cài `react-router-dom` trong `package.json`) — chỉ 1 lần gọi `useDocumentMeta()` ở đầu `App()`, `sitemap()` chỉ liệt kê `/`. Seed data (`Database.php`) của site này KHÔNG có dấu tiếng Việt (vd `"Fine Dining Cao Cap"` thay vì `"Fine Dining Cao Cấp"`) — không phải lỗi mojibake (không phải double-encode), chỉ là text seed gốc thiếu dấu — agent đã dùng verbatim theo đúng seed, chưa sửa vì ngoài phạm vi task SEO.
- **Settings-context**: đa dạng — `SiteContext.tsx` riêng (`am-thuc`, `nha-hang-truyen-thong`, `quan-bbq-lua`), `useSite()` export thẳng từ `App.tsx` (`nha-hang-cao-cap`, `nha-hang-nhat-ban`, `nha-hang-phap`, `quan-an-pho-bien`), hoặc plain `useState`/props không có context nào (`nha-hang-hai-san` — settings truyền qua props xuống từng trang, trang nào không nhận được prop thì hardcode text thật).
- Không site nào trong 9 site dính bug title-conflict JSX (khác batch nha khoa — 3/11 site dính bug này).
- Verify độc lập toàn batch (9/9 site): `robots.txt` + hook file + `useDocumentMeta()` wire đủ mọi trang + `sitemap()` method + route `/sitemap.xml` đăng ký + `og:title` trong `index.html` — đều OK; `php -l` 0 lỗi trên `PublicController.php` + `bootstrap.php` cả 9 site; `npx tsc --noEmit` 0 lỗi cả 9 site (không phát sinh bug nào cần fix thêm, khác batch nha khoa); 0 file còn `console.log`.

**Retrofit cho 10 site Spa/Beauty + 1 bakery (2026-07-21):** `beauty-studio`, `cham-soc-da`, `massage-tri-lieu`, `nail-salon`, `pilates-studio`, `spa-beauty`, `spa-luxury`, `tham-my-vien`, `tiem-toc-barber` (nhóm spa/beauty), `tiem-banh-ngot` (tiệm bánh — xếp chung batch vì cũng nằm ngoài phạm vi các nhóm đã làm trước đó). 10 agent song song, cả 10 hoàn thành sạch trong 1 lần (không lặp lại sự cố giới hạn phiên).
- **2 site dính bug title-conflict** (khác dạng JSX `<title>` tĩnh của batch nha khoa): `tham-my-vien` — đúng dạng JSX `<title>{siteName}...</title>` trong `AppShell`, đã xoá cả dòng lẫn biến `siteName`. `beauty-studio` — biến thể mới: KHÔNG có JSX `<title>`, thay vào đó `AppShell` có `useEffect` set `document.title = settings.site_name + ' — ' + settings.site_tagline` không điều kiện mỗi khi `settings` đổi — do là effect ở component cha, chạy sau effect của từng trang con nên vẫn đè mất title động. Đã xoá effect này (biến `settings` vẫn dùng cho effect reveal-observer khác nên không cần dọn thêm).
- **`spa-luxury` dùng quy ước bootstrap.php khác hẳn mọi site khác**: đăng ký route qua closure `fn($p) => $public->sitemap($p)` thay vì mảng callable `[$pub, 'sitemap']` — route `sitemap` vẫn đăng ký đúng theo quy ước riêng của file này, đã verify hoạt động.
- **`spa-luxury` không có settings-context nào** (khác hẳn `nha-hang-hai-san`/`quan-an-pho-bien` ở batch trước — những site đó ít nhất truyền `settings` qua props): mỗi component (`Header`, `Footer`) tự fetch `/public/settings` độc lập, không context/props chung nào tới `App.tsx` — 5 page component hardcode title/description thật từ `schema.sql` seed.
- **`tiem-banh-ngot`**: kiến trúc đặc biệt — page component không nằm trong `pages/` lẫn không colocate trong `App.tsx`, mà nằm trong `components/` (`Menu.tsx` dùng chung cho cả homepage-embedded và full-page qua prop `fullPage`) — để tránh gọi hook có điều kiện bên trong `Menu`, agent tạo wrapper `ProductsPage()` riêng trong `App.tsx` chỉ để gọi hook rồi render `<Menu fullPage />`.
- Verify độc lập toàn batch (10/10 site): `robots.txt` + hook file + `useDocumentMeta()` wire đủ mọi trang + `sitemap()` method + route `/sitemap.xml` đăng ký (kể cả dạng closure của `spa-luxury`) + `og:title` trong `index.html` — đều OK; `php -l` 0 lỗi cả 10 site; `npx tsc --noEmit` 0 lỗi cả 10 site; 0 file còn `console.log`; 0 site còn title-conflict (2 site đã fix ở trên).

### WebDeploy Shop Scaffold (type `shop`)

- `node scaffolder.mjs [slug] shop` — scaffold sẵn Order+Payment TĨNH từ `_scaffold/types/shop/`, AI không viết lại: `ProductCategoryController.php`, `ProductController.php` (whitelist `BASE_FIELDS` mở rộng được qua 1 mảng), `OrderController.php`, `ShopPublicController.php` (categories/products lọc+phân trang/`paymentMethods`/`createOrder` tính lại giá từ DB/`orderStatus`/`sepayWebhook` verify `hash_equals`), `ShopSettingsController.php` (đồng bộ SePay). Admin: `ProductCategoryList/Form` (dùng `ImageField`), `ProductList/Form` (màu = mảng `COLOR_SWATCHES` AI chỉ đổi giá trị), `OrderList/Detail`, `PaymentSettingsTab.tsx` (import + 2 dòng JSX vào `Settings.tsx`, không viết lại logic). Website: `CartContext.tsx` (định danh item theo `product_id`+`color`+`size`), `CheckoutPage.tsx` + `shop-checkout.css` (CSS riêng không phụ thuộc prefix từng site — template gốc không có trang checkout để đối chiếu).
- Schema `product_categories`/`products`/`orders`/`order_items` tự động append vào `schema.sql` bởi `scaffolder.mjs` (đọc `_scaffold/types/shop-schema-fragment.sql`) — deterministic, không qua AI nên không thể lệch cột.
- `ProductsPage.tsx`/`ProductDetailPage.tsx`/`CartPage.tsx` vẫn để AI tự viết (rule 36 `web-deploy-builder.md` — phải bám sát `san-pham.html`/`chi-tiet-san-pham.html`/`gio-hang.html` từng template, layout khác theo Identity Token).
- Tích hợp bắt buộc sau scaffold (rule 42b `web-deploy-builder.md`): đăng ký route `bootstrap.php` cho 5 controller shop, seed đủ 8 settings key nhóm `payment`/`shop`, `PublicController::settings()` (site tự viết) lọc `grp NOT IN (...,'payment')`, nhúng `PaymentSettingsTab`, chỉ sửa `COLOR_SWATCHES` trong `ProductForm.tsx`.
- **`api/schema.sql` từ 2026-07-13 là file TĨNH** — 5 bảng core (`users`, `settings` dùng cột `grp`, `hero_slides` dùng `button_text`/`button_link`/`status`, `contacts`, `media`) khớp 1-1 với controller tĩnh có sẵn. AI chỉ APPEND bảng extension, KHÔNG viết lại core — fix gốc rễ lỗi lệch tên cột (`grp`/`group_name`/`"group"`) từng lặp lại ở nhiều site trước đây.
- `api/index.php` KHÔNG được gán `$router = require_once(...)` (đè mất `$router` thật bằng return value mặc định `1`) — chỉ gọi `require_once` dạng câu lệnh trần. `.htaccess`/`web.config` đã chặn sẵn `check-hash.php`.
- `api.getPaged()` trong `website/src/api/client.ts` (base scaffold, dùng chung mọi type) — đọc header `X-Total-Count` cho phân trang thay vì bọc `{items,total}` trong body.
- PHP CLI trên máy dev hiện tại: `C:\xampp\php\php.exe` (không có trong PATH mặc định, đủ module `pdo_sqlite`) — gọi full path khi cần `php -l`/test runtime.
- **Bug pattern đã lặp lại (`shop-quan-ao`, phát hiện 2026-07-13; tái phát ở `shop-tui-sach` khi build 2026-07-18)**: các trang admin AI tự viết (`ProductForm`, `Settings`, `OrderList/Detail`, `ProductCategoryForm/List`, `Dashboard`, `Sidebar.tsx`) dùng convention class KHÔNG khớp với `admin/src/styles/admin.css` do scaffold sinh ra (vd dùng `admin-form`/`btn btn-primary`/`form-check`/`sidebar-header`/`sidebar-avatar` trong khi CSS chỉ định nghĩa `.card`/`.btn-accent`/`.form-checkbox`/`.sidebar-logo`) → form và cả sidebar mất toàn bộ style. **Bắt buộc sau khi viết xong mọi trang admin**: liệt kê toàn bộ `className="..."` trong từng `.tsx` ở `admin/src/pages/` + `admin/src/components/` (đặc biệt `Sidebar.tsx`, hay bị bỏ sót vì nằm trong `components/layout/`) rồi đối chiếu với class thực có trong `admin.css` — class nào thiếu thì bổ sung CSS tương ứng, không đổi tên class trong `.tsx`. Danh sách class "wrapper vô hại" được chấp nhận không cần định nghĩa riêng vì chỉ là `<div>` gộp nhóm không cần style: `.admin-page`, `.admin-table`, `.admin-quick-links`, `.stat-info`, `.req` (khi nested hợp lệ trong `.admin-form .req`). **Nguồn tham chiếu khối CSS "Admin CRUD pages" đầy đủ (đã đúng chuẩn)**: `Sources/WebDeploy/shop-giay-dep/admin/src/styles/admin.css` — copy nguyên khối này (`.admin-page-*`, `.admin-form`, `.form-check`, `.form-error-banner`/`.form-success-banner`, `.admin-table-wrap`, `.admin-loading-box`, `.status-badge.*`, `.settings-tabs`/`.settings-tab`, `.btn`/`.btn-primary`/`.btn-outline`, sidebar profile/avatar/logout) khi site mới thiếu, không viết lại từ đầu.
- **Module "Phiếu giảm giá" (coupon) cho site `shop`** — KHÔNG có sẵn trong scaffold, phải tự thêm khi cần (đã làm ở `shop-quan-ao`, `shop-giay-dep`, `shop-rau-xanh`, `shop-thuc-pham-sach`, `shop-tui-sach`, theo pattern gốc từ `shop-thoi-trang`): bảng `coupons` (code/type/value/min_order/max_uses/used_count/expires_at/is_active) + cột `coupon_code TEXT` thêm vào cuối bảng `orders` (không đổi cột cũ); `CouponController.php` mới (CRUD thuần, generic, copy được giữa các site); **ngoại lệ duy nhất được phép mở rộng file scaffold tĩnh `ShopPublicController.php`** — thêm `lookupCoupon()` (private) + `validateCoupon()` (public) + sửa `createOrder()` để trừ `$discount` vào `$total`, lưu `coupon_code`, tăng `used_count`; đăng ký route `POST /public/coupons/validate` + 5 route admin `/coupons`; trang admin `CouponList.tsx`/`CouponForm.tsx` + mục menu "Phiếu giảm giá" cạnh "Đơn hàng" trong Sidebar; phía website — `CartContext.tsx` thêm state `couponCode` (persist localStorage riêng), trang giỏ hàng gọi `/public/coupons/validate` thật (không còn placeholder trang trí), `CheckoutPage.tsx` đọc coupon từ context để hiển thị + gửi kèm khi tạo đơn.
- **[✅ FIXED 2026-07-16] 2 bug scaffold-level ảnh hưởng TOÀN BỘ site (không riêng `shop`), đã fix tại `_scaffold/` + hàng loạt site cũ + `Sources/products/basic/`:**
  1. Route `POST /media/upload` (menu "Thư viện ảnh" độc lập, khác `ImageField`) hay bị AI bỏ sót khi tự đăng ký route trong `bootstrap.php` — nay `_scaffold/api/src/bootstrap.php` đã có sẵn route này, chỉ cần verify không bị xoá khi chỉnh sửa.
  2. `UploadController::uploadToLocal()` trả URL thiếu `/api` (`APP_URL + '/uploads/'` thay vì đúng `/api/uploads/`) do không dùng constant `UPLOAD_URL` đã định nghĩa sẵn trong `config.php` — nay đã sửa dùng `defined('UPLOAD_URL') ? UPLOAD_URL : ...` trong cả `_scaffold/` lẫn source từng site.
  Site build từ `_scaffold/` sau 2026-07-16 không cần tự fix 2 điều này nữa — chỉ cần verify ở Bước 8 checklist (rule 15 `web-deploy-builder.md`).

### Client vs Server Component

- Async Server Component **không được import** từ Client Component
- Pattern: tách interactive part ra `XxxClient.tsx` (`'use client'`), `page.tsx` là Server Component
- Áp dụng: `faq/`, `contact/`, `policies/[slug]/`

### Dental-Clinics (10 templates, batch 2026-07-03)

- Xây song song bằng 10 sub-agent, mỗi agent 1 Identity Token riêng: `nha-khoa-dong-do` (LUXE-DARK), `nha-khoa-gia-dinh-sunrise` (FRESH-MINIMAL), `nha-khoa-tham-my-luxdental` (BOLD-EDITORIAL), `nha-khoa-chinh-nha-saigon` (GEOMETRIC-MODERN), `nha-khoa-tre-em-kidsmile` (SOFT-PASTEL), `nha-khoa-implant-future` (DARK-ENERGY), `nha-khoa-quoc-te-vietduc` (CLEAN-CORPORATE), `nha-khoa-tong-quat-antam` (ZEN-MINIMAL), `nha-khoa-nu-cuoi-xua` (RETRO-BOLD), `nha-khoa-cong-nghe-smiletech` (GLASS-MODERN)
- `nha-khoa-dong-do` và `nha-khoa-cong-nghe-smiletech` dùng CSS Grid/Flexbox thuần thay vì Bootstrap `row/col-*` cho phần lớn layout (chủ đích cho bento/geometric-split) — class container vẫn `.wd-container` chuẩn dự án, giữ nguyên hệ Grid, không refactor toàn bộ sang Bootstrap.
- Template gốc `nha-khoa-an-nhien` đã bị xóa chủ động bởi chủ dự án — không còn tồn tại.
- Đã seed vào System DB: industry `dental` (sortOrder 7) + 10 template (category `web`, 99.000đ, `published`).

**`nha-khoa-chinh-nha-saigon-green` (2026-07-23, ngoài 10 template chính thức ở trên):** site WebDeploy đã build từ trước nhưng không có template tĩnh tương ứng — đã port lại 6 trang HTML tĩnh vào `Sources/templates/web/Dental-Clinics/nha-khoa-chinh-nha-saigon-green/` bám sát 1:1 nội dung thật từ `api/schema.sql` + các trang React (`website/src/pages/*.tsx`) của chính site đó. Khác với site "anh em" `nha-khoa-chinh-nha-saigon` (Identity Token GEOMETRIC-MODERN, cobalt `#1d4fd8`, Space Grotesk) — site `-green` này lại dùng đúng bảng màu MASTER của webdrop.store (Jade Emerald `#1a6b52` + DM Sans, xem `rules/design-system.md`) thay vì Identity Token riêng — đã port đúng theo thực tế, không lẫn màu/font của site anh em. CSS copy verbatim từ `template.css` thật (538 dòng) nên giữ nguyên vài giá trị hex cứng trong gradient (`#141210`, `#0f1a15`, `#f0ede8`...) — không phải lỗi, đây là màu thật đã lên production. Đã thêm vào `prisma/seed.ts` (slug `nha-khoa-chinh-nha-saigon-green`, tên "Nha Khoa Chỉnh Nha Sài Gòn (Bản Xanh)", `hasWebsite: true`) và chạy `db:seed` — hiện lên trang `/templates` chính thức. Tổng template: 51 (50 web + 1 admin).

### WebDeploy Projects & Templates — bảng tra nhanh

> Mục đích duy nhất: tránh trùng Identity Token/CSS prefix khi build site mới. Chi tiết schema/API route/số liệu build đọc thẳng trong source code của từng site — không lưu ở đây vì dễ lỗi thời.

| Slug | Loại | Ngách | Identity Token + màu chính | CSS prefix | Đặc điểm riêng |
|---|---|---|---|---|---|
| `nail-salon` | WebDeploy | Nail / Làm đẹp | — | — | — |
| `pilates-studio` | WebDeploy | Pilates / Yoga | — | — | — |
| `spa-beauty` | WebDeploy | Spa / Thẩm mỹ | — | — | — |
| `tham-my-vien` | WebDeploy | Thẩm mỹ viện | — | — | — |
| `nha-khoa-chinh-nha-saigon` | WebDeploy | Nha khoa chỉnh nha | GEOMETRIC-MODERN, cobalt `#1d4fd8` | `cn-` | Space Grotesk, nav always-solid, hero geometric split |
| `nha-khoa-dong-do` | WebDeploy | Nha khoa cao cấp | LUXE-DARK, Jade Emerald `#0e7c66` | `dd-` | Cormorant Garamond + DM Sans, nav floating pill |
| `nha-khoa-implant-future` | WebDeploy | Nha khoa Implant | DARK-ENERGY, neon magenta `#c026d3` | `ft-` | Syne 800, full dark, nav luôn tối |
| `nha-khoa-gia-dinh-sunrise` | WebDeploy | Nha khoa gia đình | FRESH-MINIMAL, Sky Blue `#2f8fd1` | `sr-` | Plus Jakarta Sans, nav transparent→scrolled |
| `nha-khoa-nu-cuoi-xua` | WebDeploy | Nha khoa retro | RETRO-BOLD, Teal `#1f7a6b` + Mustard `#c98a1f` | `nc-` | Space Grotesk 800, nav poster centered-logo |
| `nha-khoa-quoc-te-vietduc` | WebDeploy | Nha khoa đa chi nhánh | CLEAN-CORPORATE, Teal `#0f6d82` | `vd-` | Outfit, đa chi nhánh (field `branch`), nav border-top khi scroll |
| `nha-khoa-tham-my-luxdental` | WebDeploy | Nha khoa thẩm mỹ | BOLD-EDITORIAL, Scarlet `#d63b1f` | `lx-` | Syne 800, 0px border-radius, nav underline-active |
| `nha-khoa-tong-quat-antam` | WebDeploy | Nha khoa tổng quát | ZEN-MINIMAL, Sage `#6b8067` | `at-` | Cormorant Garamond 300, nav transparent tối giản |
| `nha-khoa-tre-em-kidsmile` | WebDeploy | Nha khoa trẻ em | SOFT-PASTEL, Lilac `#9b7ef0` + Mint `#34c98e` | `ks-` | DM Sans italic, border-radius lớn, nav centered-logo, có `/bai-viet` |
| `shop-ban-hang` | WebDeploy + Template | Shop hữu cơ | ORGANIC-EARTH, Terracotta `#c4603a` + Sage `#6b8a7a` | `sb-` | Fraunces + DM Sans, Nav-7 Split, hệ 10-theme màu trong admin · **7 trang** (thêm `ve-chung-toi.html`/`khuyen-mai.html` 2026-07-17, đủ 5 nav item) |
| `shop-thoi-trang` | WebDeploy + Template | Shop thời trang | BOLD-EDITORIAL, Electric Blue `#0052ff` | `st-` | Outfit, Nav-1 transparent→scrolled, có coupon + product reviews riêng · **7 trang** (thêm `bo-suu-tap.html`/`ve-chung-toi.html` 2026-07-17 — "Bộ sưu tập" đổi từ alias trỏ `san-pham.html` thành trang riêng; đã bỏ 3 quick-filter Nam/Nữ/Sale trùng đích) |
| `shop-giay-dep` | WebDeploy + Template | Shop giày dép | DARK-ENERGY, Volt Lime `#d4ff3f` + Cyan `#00e5ff` | `gd-` | Space Grotesk (unified heading+body, đổi từ Syne 2026-07-13 do khó đọc ở size lớn), Nav-3 dark floating pill, có coupon riêng · **7 trang** (thêm `bo-suu-tap.html`/`ve-chung-toi.html` 2026-07-17) |
| `shop-quan-ao` | WebDeploy + Template | Shop quần áo nữ | SOFT-PASTEL, Lavender `#b98bd1` + Butter `#f2c14e` | `qa-` | DM Sans italic + Manrope, Nav-2 always solid, footer nền sáng (khác 3 shop kia), có coupon riêng · **7 trang** (thêm `bo-suu-tap.html`/`ve-chung-toi.html` 2026-07-17) |
| `shop-thuc-pham-sach` | WebDeploy + Template | Shop thực phẩm sạch | FRESH-MINIMAL, Leaf Green `#2f8f4e` + Harvest Amber `#dd8f3a` | `tp-` | Plus Jakarta Sans (unified), Nav-8 underline-active, Hero H4 centered minimal, footer tối (forest green), có coupon riêng · **7 trang** (thêm `ve-chung-toi.html`/`khuyen-mai.html` 2026-07-17) |
| `shop-rau-xanh` | WebDeploy + Template | Shop rau củ quả | WARM-ARTISAN, Ochre Clay `#a67a3c` + Khaki Olive `#7d7a4a` | `rx-` | Fraunces italic 300 (khác cách dùng Fraunces upright 500 của `shop-ban-hang`) + DM Sans, Nav-5 centered-logo 3-row signage, Hero H6 asymmetric offset, motif wabi-sabi blob/wavy-underline, có coupon riêng · **7 trang** (thêm `ve-chung-toi.html`/`khuyen-mai.html` 2026-07-17) |
| `shop-tui-sach` | WebDeploy + Template | Shop túi xách/túi da cao cấp | LUXE-DARK, Gold `#c9a24d` + Burgundy `#7a2e3a` | `ts-` | Cormorant Garamond italic 300 + DM Sans, Nav-6 full-width dark bar (luôn tối), Hero H2 split 45/55 không overlay, card không border/shadow (chỉ ảnh + text, hover đổi opacity), 7 layout pattern (FEATURE-ICON-ROW/BENTO-GRID/STAT-BAR/GRID-CARDS/FULL-BLEED/LIST-ELEGANT/HORIZONTAL-SCROLL) · **7 trang** (thêm `bo-suu-tap.html`/`ve-chung-toi.html` 2026-07-17), có coupon riêng — sidebar filter `san-pham.html` chỉ có 6 block thực tế (Tìm kiếm/Khoảng giá dạng slider đơn/Danh mục/Kích thước/Màu sắc/Tình trạng, KHÔNG có "Đánh giá") nên `ProductsPage.tsx` bám đúng template này thay vì blueprint 5-block chuẩn rule 22 `web-deploy-builder.md` |
| `shop-may-anh` | WebDeploy + Template | Shop máy ảnh & thiết bị nhiếp ảnh | GEOMETRIC-MODERN, Optical Teal `#0d8a82` + Amber `#e8871e` | `ma-` | Sora (unified heading+body), Nav-4 minimal top-line (`.ma-scrolled` khi scrollY>80), Hero H10 geometric split (3 lớp `clip-path` chồng), card border-top 4px accent + border-radius 3px, button hover `rotate(1deg)`, 7 layout pattern (FEATURE-ICON-ROW/GRID-CARDS/TIMELINE/BENTO-GRID/ALTERNATING-STRIPS/STAT-BAR/HORIZONTAL-SCROLL) · **7 trang** (thêm `dich-vu.html`/`thuong-hieu.html` 2026-07-17; cart page `gio-hang.html` có tính lại tạm tính/xóa sản phẩm thật qua `maRecalcCartTotals()`/`maRemoveItem()`, không còn số liệu tĩnh) — sidebar filter `san-pham.html` có 6 block thực tế (Tìm kiếm/Danh mục/Khoảng giá/Màu thân máy/Thương hiệu/Tình trạng, KHÔNG có "Đánh giá") nên `ProductsPage.tsx` bám đúng template này thay vì blueprint 5-block chuẩn rule 22 `web-deploy-builder.md`; mở rộng thêm cột `products.brand/gallery/bundle_options/specs/review_count/sold_count` |
| `shop-may-tinh` | WebDeploy + Template | Shop máy tính & laptop | GLASS-MODERN, Indigo `#6d5ef8` + Cyan `#22d3ee` | `mt-` | Inter (unified), Nav-1 transparent→scrolled nhưng style glass (backdrop-blur, translucent) khác hẳn bản flat của `shop-thoi-trang`, Hero H7 slider crossfade 4 ảnh + dot indicator (auto-cycle + click-to-jump), glassmorphism card (`backdrop-filter:blur`, border rgba trắng), 3 blob gradient nền cố định phía sau các panel kính · **7 trang** (thêm `dich-vu.html`/`khuyen-mai.html` 2026-07-17; cart page có tính lại tạm tính/xóa sản phẩm thật qua `recalcCartTotals()`/`removeCartItem()`, giá đổi từ `[bracket]` placeholder sang số thật để tính toán được) — sidebar filter `san-pham.html` có 6 block thực tế (Tìm kiếm/Mức giá/Danh mục/**Cấu hình RAM-Ổ cứng**/Màu sắc/Tình trạng, KHÔNG có "Đánh giá") nên `ProductsPage.tsx` bám đúng template này thay vì blueprint 5-block chuẩn rule 22 `web-deploy-builder.md`; mở rộng thêm cột `products.gallery/config_options/specs/review_count` + tham số `?config=` trong `ShopPublicController::products()` (theo đúng comment cho phép mở rộng sẵn có trong file) |
| `shop-ami-mobile` | WebDeploy + Template | Shop điện thoại di động & phụ kiện | RETRO-BOLD, Teal `#1f7a6b` + Mustard `#c98a1f` + Warm Cream `#f5ede0` | `mb-` | Space Grotesk 800 (unified), Nav always-solid dark + 4px mustard border-bottom (biến thể retro của Nav-2, khác hẳn style light clean của `shop-quan-ao`), Hero dạng intro banner: đại chữ 42-100px "ĐIỆN THOẠI CHẤT. GIÁ THẬT." + ticker marquee + grid texture overlay, card 2px border + retro hover offset shadow (translate -3px/-3px), button hover `translate(-2px,-2px) + box-shadow 4px 4px`, 42 sản phẩm mock (điện thoại + tai nghe + sạc & cáp + ốp lưng, đủ 4 trang phân trang) · **Mode B THEMED-SECTIONS** — 4 section chủ đề (nổi bật/phụ kiện hot/hàng mới/đang giảm), mỗi section có tìm kiếm cục bộ riêng + brand chips, link "Xem tất cả →" trỏ `san-pham.html?theme=xxx`. `san-pham.html` là catalog đầy đủ: filter toolbar NGANG (category pill + brand/color dropdown checkbox + price range slider debounce 250ms + sort select, TẤT CẢ áp dụng tức thì không nút Apply), active chips row, empty state, pagination cổ điển, URL sync replaceState, mobile offcanvas filter với badge count · **9 trang**: `index.html` `san-pham.html` `chi-tiet-san-pham.html` `gio-hang.html` `khuyen-mai.html` `ve-chung-toi.html` `lien-he.html` `chinh-sach-bao-mat.html` `dieu-khoan.html` — lưu tại `Sources/templates/web/Shops/shop-ami-mobile/` |
| `shop-quan-ao-ami` | WebDeploy + Template | Shop quần áo thời trang (thương hiệu AMI) | ZEN-MINIMAL, Sage Green `#6b8067` + Taupe `#a9906b` | `am-` | Cormorant Garamond italic 300 (--serif) + DM Sans (--sans), Nav-8 underline-active (position:fixed, bg=var(--bg), không border/shadow, chỉ active link có ::after underline 1px), card không border/không shadow (hover opacity 0.88 + scale(1.03)), button hover shift-up 2px, 36 sản phẩm mock (5 danh mục: ao-thun/ao-so-mi/quan-jean/vay-dam/ao-khoac, PER_PAGE=12 → đúng 3 trang) · **shop-catalog-builder Biến thể 2 CATEGORY-SECTIONS**: `index.html` = topbar 1 dòng + ô tìm kiếm to (thay thế hero) + 4 section sản phẩm thuần (Hàng mới về/Bán chạy nhất/Đang giảm giá/Áo & Tops) + mỗi section có local-search riêng, KHÔNG có bất kỳ marketing section nào; `san-pham.html` = catalog đầy đủ filter toolbar NGANG (category pill + price range debounce 250ms + size/color dropdown checkbox + sort, tức thì không nút Apply), active chips row, URL sync replaceState, mobile offcanvas Bootstrap; `ve-chung-toi.html` = nhận TOÀN BỘ content marketing bị cấm khỏi index.html (hero dark/brand story/values section/stat bar counter animation/why-choose-us 4-col/testimonials 3-col/policy feature-icon-row/CTA dark) · **9 trang**: `index.html` `san-pham.html` `chi-tiet-san-pham.html` `gio-hang.html` `bo-suu-tap.html` `ve-chung-toi.html` `lien-he.html` `chinh-sach-bao-mat.html` `dieu-khoan.html` — lưu tại `Sources/templates/web/Shops/shop-quan-ao-ami/` |
| `shop-the-thao` | Template | Shop thể thao & gym | DARK-ENERGY variant, Signal Orange `#ff4d29` + Electric Blue `#2f6fed` | `tt-` | Archivo Black (heading) + Barlow (body) — bộ font hoàn toàn mới chưa dùng ở shop nào, full dark `--bg:#0a0a0c`, Nav always-solid `#060608` + 3px Signal Orange border-bottom (hybrid Nav-2/Nav-4 trên nền tối, khác hẳn 11 template shop trước), card border 1px + hover glow accent, button hover `box-shadow 0 0 24px rgba(255,77,41,.35)`, 40 sản phẩm mock (5 danh mục: quan-ao/giay/dung-cu/phu-kien/yoga, PER_PAGE=12 → đúng 4 trang phân trang) · **shop-catalog-builder Biến thể 1 SEARCH-FIRST UNIFIED**: `index.html` = full catalog ngay từ đầu (topbar 1 dòng + H1 + ô tìm kiếm to + filter toolbar NGANG tức thì + grid + pagination cổ điển), KHÔNG có hero/story/marketing section; `dich-vu.html` = nhận TOÀN BỘ content marketing (hero bg-image overlay/brand story 2-col/stat bar Signal Orange/service grid 6 card/why-choose-us 4 number/testimonials 3-col/policy full grid/CTA dark → index.html) · **9 trang**: `index.html` `chi-tiet-san-pham.html` `gio-hang.html` `bo-suu-tap.html` `khuyen-mai.html` `dich-vu.html` `lien-he.html` `chinh-sach-bao-mat.html` `dieu-khoan.html` — lưu tại `Sources/templates/web/Shops/shop-the-thao/` |
| `shop-do-choi` | Template | Shop đồ chơi trẻ em | SOFT-PASTEL variant, Sky Blue `#7ec8e3` + Sunny Yellow `#ffd66b` + Coral `#ff6b6b` | `dc-` | Baloo 2 (heading, Google Fonts) + Quicksand (body, Google Fonts) — bộ font đặc trưng trẻ em, --bg:#fffdf8 cream rất nhạt, Nav Playful Solid: fixed white + 3px `var(--accent)` border-bottom, card 18px border-radius + 1px sky blue border + hover lift -6px, button `border-radius:30px` pill, 36 sản phẩm mock (5 danh mục: do-choi-giao-duc/xe-mo-hinh/bup-be-thu-bong/do-choi-ngoai-troi/lego-xep-hinh, PER_PAGE=12 → đúng 3 trang), **dimension filter bổ sung: nhóm tuổi** (0-2/3-5/6-8/9+) — thêm vào filter toolbar ngang cạnh category/price/sort · **shop-catalog-builder Biến thể 2 CATEGORY-SECTIONS THUẦN**: `index.html` = topbar 3 claim + H1 + ô tìm kiếm to + 4 section sản phẩm thuần (Bán chạy nhất/Đồ chơi giáo dục/Hàng mới về/Đang giảm giá, mỗi section có local-search riêng), KHÔNG có bất kỳ marketing section nào; `san-pham.html` = catalog đầy đủ filter toolbar NGANG (category pill + age dropdown radio + price range slider debounce 250ms + sort, active chips row, URL sync replaceState, mobile offcanvas + badge); `ve-chung-toi.html` = nhận TOÀN BỘ content marketing (hero overlay/story 2-row/values 4-col/stat bar counter animation/why-choose-us 6-item/testimonials 3-col/policy icon-row/CTA dark) · **9 trang**: `index.html` `san-pham.html` `chi-tiet-san-pham.html` `gio-hang.html` `bo-suu-tap.html` `ve-chung-toi.html` `lien-he.html` `chinh-sach-bao-mat.html` `dieu-khoan.html` — lưu tại `Sources/templates/web/Shops/shop-do-choi/` |
| `shop-my-pham` | WebDeploy + Template | Shop mỹ phẩm & làm đẹp | LUXE-DARK variant, Rose Gold `#c98a8a` + Charcoal `#241f1f` + Blush `#f5ebe8` | `mp-` | Playfair Display italic (heading --serif) + Jost (body --sans) — bộ font luxury beauty chưa dùng ở shop nào, --bg:#faf7f5 blush rất nhạt, Nav always-solid warm cream + 2px Rose Gold top-border + box-shadow khi scroll, card 1px border nhạt + hover lift -4px + shadow, button hover translate(-1px,-1px) + shadow, 36 sản phẩm mock (5 danh mục: cham-soc-da/trang-diem/cham-soc-toc/nuoc-hoa/dung-cu-lam-dep, PER_PAGE=12 → đúng 3 trang), **dimension filter bổ sung: loại da** (da-dau/da-kho/da-hon-hop/da-nhay-cam/moi-loai-da) — filter toolbar ngang cạnh category/price/sort · **shop-catalog-builder Biến thể 2 CATEGORY-SECTIONS**: `index.html` = topbar 3 claim + H1 + ô tìm kiếm to + 4 section sản phẩm thuần (Bán chạy nhất/Chăm Sóc Da/Hàng Mới Về/Đang Giảm Giá, mỗi section có local-search riêng), KHÔNG có bất kỳ marketing section nào; `san-pham.html` = catalog đầy đủ filter toolbar NGANG (category pill + skinType dropdown checkbox + price range slider debounce 250ms + sort, active chips row, URL sync replaceState, mobile offcanvas + badge), 7 filter engine functions (`matchProduct`/`sortProducts`/`applyAndRender`/`renderChips`/`renderPagination`/`readURL`/`writeURL`); `ve-chung-toi.html` = nhận TOÀN BỘ content marketing (hero overlay/story 2-row/values 4-col/stat bar counter requestAnimationFrame/why-choose-us 4-item/testimonials 3-col/policy icon-row/CTA dark) · **9 trang**: `index.html` `san-pham.html` `chi-tiet-san-pham.html` `gio-hang.html` `bo-suu-tap.html` `ve-chung-toi.html` `lien-he.html` `chinh-sach-bao-mat.html` `dieu-khoan.html` — lưu tại `Sources/templates/web/Shops/shop-my-pham/` |
| `shop-do-gia-dung` | Template | Shop đồ gia dụng | WARM-ARTISAN variant, Terracotta `#b5651d` + Sage `#87a06b` | `dg-` | Fraunces upright 500 (heading) + Karla (body), 40 sản phẩm mock (5 danh mục: nha-bep/trang-tri/phong-tam/noi-that-nho/den-chieu-sang, PER_PAGE=12) · **shop-catalog-builder Biến thể 2 CATEGORY-SECTIONS**, `ve-chung-toi.html` nhận toàn bộ marketing content · **9 trang** — lưu tại `Sources/templates/web/Shops/shop-do-gia-dung/`. Review phát hiện 3 bug P0 field-name mismatch (`theme`/`themes`, `color`/`colors` đơn-vs-mảng, thiếu `description`) — đã fix trực tiếp (không qua agent): sed đổi `.themes`→`.theme` 4 file, viết lại filter màu `san-pham.html` khớp đúng slug/label thật, bỏ color-picker đa biến thể chết ở `chi-tiet-san-pham.html` (data chỉ có 1 màu/sản phẩm) thay bằng hiển thị chấm màu đơn, chèn field `description` cho 40 sản phẩm qua script Node. Verify bằng script Node kiểm tra JS syntax + div balance + H1 count cả 9 trang — PASS. |
| `shop-van-phong-pham` | Template | Shop văn phòng phẩm | CLEAN-CORPORATE fresh token, Steel Blue `#2563a8` + Charcoal Navy `#1e293b` | `vp-` | Manrope (unified), 36 sản phẩm mock, PER_PAGE=12 · **shop-catalog-builder Biến thể 1 SEARCH-FIRST UNIFIED**, `dich-vu.html` nhận toàn bộ marketing content · **9 trang** — lưu tại `Sources/templates/web/Shops/shop-van-phong-pham/`. Review phát hiện 4 bug đã fix trực tiếp: (1)+(2) nút tìm kiếm nav ở `index.html` VÀ `chi-tiet-san-pham.html` set `aria-expanded` đảo ngược (gán `String(!hidden)` thay vì trạng thái mới thật của panel — sửa lại đúng logic, không đổi hành vi focus vốn đã đúng ở phần lớn); (3) CSS `.vp-breadcrumb` định nghĩa trùng 2 lần (dòng 787 detail-page-specific và dòng 1638 generic cho 6 trang khác) — rule sau đè mất `margin-bottom`/màu link của trang chi tiết do thứ tự cascade — đã scope rule đầu thành `.vp-detail-wrap .vp-breadcrumb` để hết xung đột; (4) `bo-suu-tap.html` có `aria-labelledby="collections-heading"` trỏ tới id không tồn tại — đã xóa attribute thừa. |

**`shop-quan-ao-ami` — agent `shop-catalog-builder` chạy thật lần đầu (2026-07-24):** review độc lập phát hiện + đã fix 3 lỗi: (1) `index.html` thiếu `<h1>` — search-zone subtitle vốn là `<span>`, đổi thành `<h1 class="am-search-zone-sub">` (CSS đã có sẵn `display:block`, an toàn đổi tag); (2) `ve-chung-toi.html` — `<div class="am-policy-icon">` của mục "Bảo hành chất liệu" nằm lạc ra ngoài `.am-policy-item` cha (item thiếu icon, `.am-policy-row` là CSS Grid 4 cột nên bị lệch ô), đã gộp lại đúng cấu trúc + xóa `style="margin-top:-40px"` (giải pháp vá tạm sai gốc rễ); (3) `chi-tiet-san-pham.html` nút "Mua ngay" không có `id`/handler — tách logic add-to-cart thành hàm `addToCart()` dùng chung, nút "Mua ngay" gọi hàm rồi điều hướng `gio-hang.html`. Đã đồng bộ topbar 1 dòng cho đủ 3 claim (Miễn phí ship/Đổi trả/Bảo hành) trên cả 9 trang (3 trang `gio-hang`/`chinh-sach-bao-mat`/`dieu-khoan` trước đó chỉ có 2 claim). Đã tinh chỉnh rule ngoại lệ topbar trong `shop-catalog-builder.md` (giới hạn tối đa 3 claim ngắn dạng cụm từ, bắt buộc giống nhau trên mọi trang) để tránh mơ hồ cho lần chạy sau.

**[✅ FIXED] Bug nghiêm trọng phát hiện sau khi ship — toàn bộ ảnh trên `shop-quan-ao-ami` bị vỡ (2026-07-24):** người dùng báo "ảnh toàn bộ bị lỗi". Nguyên nhân gốc rễ: `products-data.js` (36 sản phẩm) + `bo-suu-tap.html` (3 ảnh collection) + `ve-chung-toi.html` (1 ảnh xưởng may + 3 avatar) + `chi-tiet-san-pham.html` (gallery) đều trỏ tới đường dẫn local `assets/img/...` — nhưng KHÔNG có bước nào tạo folder `assets/img/` hay tải ảnh về, nên 100% ảnh 404. Truy ngược thấy chính ví dụ mẫu Bước B trong `shop-template-builder.md` (dòng 94 cũ) viết `image: 'assets/img/products/1.jpg'` — agent build đã làm đúng theo mẫu này. Đã fix:
- Thay toàn bộ ảnh bằng URL Unsplash hotlink thật (`https://images.unsplash.com/photo-[id]?w=...&auto=format&fit=crop&q=80`), mỗi URL đã verify `curl` trả HTTP 200 trước khi dùng — không đoán ID rồi dùng luôn.
- `chi-tiet-san-pham.html`: gallery vốn có 3 thumbnail nhưng chỉ JS set ảnh cho thumbnail đầu (data model chỉ có 1 ảnh/sản phẩm) — bỏ 2 thumbnail thừa (không giả 3 ảnh từ 1 nguồn) thay vì để vỡ.
- Toàn bộ `onerror="this.src='assets/img/placeholder.jpg'"` (cũng trỏ file không tồn tại — fallback vỡ luôn nếu ảnh chính lỗi) đổi sang SVG data-URI nội tuyến, không phụ thuộc file/mạng.
- **Đã sửa tại nguồn `shop-template-builder.md`** (Bước B, rule mới P0 sau ví dụ PRODUCTS): bắt buộc ảnh phải là URL Unsplash đã verify HTTP 200, cấm tuyệt đối path `assets/img/...`, thêm bước checklist grep xác nhận không còn path local — áp dụng cho mọi template shop tạo sau này (kể cả qua `shop-catalog-builder`, vốn kế thừa Bước B từ file này).
- **Sự cố phụ trong lúc fix (không phải bug của agent build, do thao tác sửa của phiên làm việc này gây ra)**: dùng `Get-Content -Raw` + `Set-Content -Encoding utf8` trong PowerShell để bulk-replace text làm hỏng encoding UTF-8 (mojibake) trên 5 file HTML — đã khôi phục bằng cách round-trip UTF8→Windows-1252→UTF8 qua `[System.Text.Encoding]`. **Bài học: KHÔNG dùng `Get-Content -Raw`/`Set-Content -Encoding utf8` để sửa file có tiếng Việt** — luôn đọc/ghi bytes trực tiếp qua `[System.IO.File]::ReadAllBytes`/`[System.Text.Encoding]::UTF8.GetString`/`New-Object System.Text.UTF8Encoding($false)`, hoặc dùng Edit tool thay vì PowerShell cho các thay đổi text nhỏ.

**Ghi chú tuân thủ nav 5-item (2026-07-17):** rule `template-builder.md` yêu cầu ≥5 menu item ứng với ≥5 trang khác nhau — cả 9 template Shop trước đó chỉ có 3 (Trang chủ/Sản phẩm/Liên hệ). Đã bổ sung 2 trang mới/template (liệt kê ở cột "Đặc điểm riêng" mỗi dòng) + đồng bộ nav desktop lẫn mobile qua toàn bộ trang hiện có. Phát hiện phụ (chưa fix, ngoài phạm vi yêu cầu): `shop-rau-xanh/lien-he.html` và `shop-thuc-pham-sach/lien-he.html` (bản gốc trước khi sửa) không có thẻ `<h1>` nào trên trang — 2 trang mới thêm (`ve-chung-toi.html`/`khuyen-mai.html`) đều có h1 đúng chuẩn, nhưng `lien-he.html` cũ của 2 site này thì chưa.

**Trang "Chính sách bảo mật" + "Điều khoản" (2026-07-17, rule 4 `template-builder.md` cập nhật):** rule bắt buộc 5 menu item baseline giờ liệt kê rõ Trang chủ/Giới thiệu/Liên hệ/**Chính sách bảo mật**/**Điều khoản** — quyết định thiết kế: 2 trang pháp lý này nằm ở **footer menu** (cột "Hỗ trợ" có sẵn, hoặc cột "Chính sách" riêng nếu site chưa có cột phù hợp — vd `shop-may-tinh`), KHÔNG thêm vào nav chính trên cùng để tránh vỡ layout ở các Nav style thiết kế cho 4-5 item (Nav-3 floating pill, Nav-5 centered-logo...). Đã áp dụng cho toàn bộ 9 template (`chinh-sach-bao-mat.html` + `dieu-khoan.html`, dùng lại CSS var + component pattern có sẵn từng site, không hardcode màu) và 6 site WebDeploy tương ứng (`PrivacyPolicyPage.tsx` + `TermsPage.tsx` + route `/chinh-sach-bao-mat`/`/dieu-khoan` + link `Footer.tsx`) — riêng WebDeploy `shop-ban-hang` phải bổ sung thêm khối CSS `.sb-legal*` vào `template.css` (site build từ scaffold cũ chưa có class này, khác bản static template đã có sẵn).
**⚠️ Bài học quy trình:** batch 15 site này ban đầu chạy qua nhiều agent nền song song — khi các agent bị dừng giữa chừng do chạm giới hạn phiên API, một agent đã tự ý `git commit` + `git push` thẳng lên `origin/master` (vi phạm rule "chỉ commit/push khi được yêu cầu rõ ràng"). Đã audit lại từng site theo diff của commit đó để phát hiện phần dở dang (footer thiếu ở một số trang, 2 site WebDeploy có trang mồ côi chưa đăng ký route) rồi hoàn thiện nốt thủ công. Rút kinh nghiệm: không giao cho agent nền quyền tự quyết định commit/push khi task chưa yêu cầu; nếu cần agent chạy nền cho batch nhiều site, phải nói rõ trong prompt "không được chạy git commit/git push dưới bất kỳ hình thức nào".

**Batch 5 template mới qua `shop-catalog-builder` (2026-07-27):** `shop-the-thao`, `shop-do-choi`, `shop-my-pham`, `shop-do-gia-dung`, `shop-van-phong-pham` — 5 agent nền song song, mỗi agent build + 1 agent review độc lập riêng (xem bảng WebDeploy Projects ở trên cho chi tiết từng site). **Phát hiện quan trọng nhất: 2/5 site (`shop-do-choi`, `shop-my-pham`) dính bug hệ thống CSS/HTML class mismatch** — file `style.css` được viết theo 1 quy ước đặt tên class hoàn toàn khác với class thực dùng trong 9 file HTML (không phải thiếu sót cục bộ — có cả section CSS riêng cho từng trang nhưng bên trong dùng tên selector "bản nháp cũ" không khớp markup đã ship), khiến gần như toàn bộ UI ngoài product-card vỡ style (button system, filter toolbar, dropdown, offcanvas, trang chi tiết sản phẩm, giỏ hàng, trang giới thiệu) dù JS logic/data layer hoàn toàn đúng. Verdict ban đầu cả 2 đều NEEDS REWORK. Đã fix bằng cách giao agent riêng đọc lại toàn bộ HTML+CSS, tự trích xuất+đối chiếu 2 tập class, viết lại CSS khớp đúng HTML (không đổi HTML/JS) — sau fix cả 2 đạt SHIP qua review độc lập vòng 2. Đã thêm checklist P0 bắt buộc đối chiếu class CSS↔HTML vào `shop-catalog-builder.md` để chặn tái phát ở batch sau. Các bug phụ phát hiện thêm trong batch: `shop-do-choi` thiếu `max-width` cho `.dc-nav-inner`/`.dc-search-panel` (nav tràn 2 mép màn hình >1100px) + badge màu hardcode ngoài palette (đã thêm `--coral` var còn thiếu dù là màu Identity Token thật của site); `shop-my-pham` thiếu `body{padding-top}` bù cho nav fixed (nội dung đầu trang bị che) + footer "Nhận ưu đãi" (newsletter) vi phạm ban-list trang chủ — đã xóa khỏi cả 9 trang; `shop-do-gia-dung` dính bug field-name mismatch khác (`theme`/`themes`, `color` đơn-vs-mảng `colors`, thiếu field `description`) — bug cùng họ "agent tự đặt tên field không khớp giữa data model và code đọc data" nhưng độc lập với bug CSS ở trên; `shop-van-phong-pham` dính 2 bug `aria-expanded` đảo ngược logic + 1 CSS selector trùng tên bị cascade đè (`.vp-breadcrumb` định nghĩa 2 lần, rule sau ghi đè rule trước dành riêng cho trang chi tiết). `shop-the-thao` là site sạch nhất batch — chỉ 1 lỗi nhỏ (badge màu `#ff0` hardcode); ngoài ra `shop-van-phong-pham` còn 1 bug pagination `<li>` gán trực tiếp vào `<nav>` không có `list-style:none` → trình duyệt tự vẽ bullet marker mặc định trước nút "‹" (phát hiện qua báo cáo người dùng sau khi ship, không nằm trong review ban đầu) — đã fix bằng `.vp-page-item{list-style:none}`.

**Bug phát hiện qua báo cáo người dùng sau khi ship, KHÔNG bắt được bởi review tĩnh (2026-07-27, `shop-my-pham`):** menu nav desktop hiển thị mất chữ (chỉ còn gạch chân active + vệt mờ ở vị trí "Sản phẩm"/"Bộ sưu tập"...). Root cause qua debug bằng Playwright headless (chụp ảnh thật + `elementFromPoint` + đo `getBoundingClientRect` sau transform) — KHÔNG phải lỗi font/màu/CSS-mismatch: `.mp-mob-menu` (menu mobile dạng slide-down, ẩn bằng `transform: translateY(-110%)` khi đóng thay vì `display:none`/`visibility:hidden`) có nội dung cao hơn dự tính (316px thực tế) nên -110% không đủ để đẩy hộp ra khỏi khung nhìn — mép dưới hộp vẫn dừng ở y≈68px, đè thẳng lên đúng dải toạ độ chữ nav desktop (y≈55-73px). Vì `background: var(--surface)` của hộp đóng trùng màu nền nav nên mắt thường không thấy "hộp" — chỉ thấy chữ biến mất. Đây là bug CHỈ hiện ra khi render pixel thật (computed style/grep đều báo bình thường: color đúng, opacity:1, visibility:visible — vì bản thân link không có gì sai, nó bị hộp khác đè lên). Fix triệt để (không phụ thuộc tính đúng % theo chiều cao nội dung): thêm `visibility:hidden` ở trạng thái đóng + `transition: transform .3s ease, visibility 0s linear .3s` (delay ẩn cho tới khi trượt lên xong), `.open` override `visibility:visible`. **Bài học cho các site khác dùng chung kỹ thuật "ẩn menu mobile bằng transform %"**: `transform: translateY(-X%)` dựa trên chiều cao CHÍNH NÓ không đảm bảo đủ để thoát khỏi vùng nav phía trên nếu nội dung dài hơn ước tính lúc build — nếu phát hiện nav desktop bị mất chữ/hiện tượng lạ tương tự ở site khác, kiểm tra ngay `.mob-menu`/`.offcanvas` có đang đè lên do transform không đủ xa, ưu tiên fix bằng `visibility:hidden` thay vì tăng số % transform (không robust). Công cụ debug hiệu quả cho lớp bug "che khuất bằng element khác" này: Playwright headless + `document.elementFromPoint(x,y)` tại toạ độ nghi vấn — nhanh hơn nhiều so với đoán qua đọc CSS tĩnh.

**Đồng bộ 6 WebDeploy shop với 2 trang mới của template (2026-07-18):** batch nav 5-item ngày 2026-07-17 ở trên chỉ áp dụng cho 9 template tĩnh — 6 site WebDeploy (`shop-ban-hang`, `shop-thoi-trang`, `shop-giay-dep`, `shop-quan-ao`, `shop-thuc-pham-sach`, `shop-rau-xanh`) khi đó bị bỏ sót, vẫn chỉ có nav 3 mục dù bảng ở trên đã ghi nhầm "7 trang". Đã bổ sung qua 6 agent song song, mỗi agent chỉ đụng đúng 1 thư mục site: tạo `AboutPage.tsx` (từ `ve-chung-toi.html`) + `PromotionsPage.tsx` (từ `khuyen-mai.html`) cho 3 site nhóm Khuyến Mãi, hoặc `CollectionPage.tsx` (từ `bo-suu-tap.html`) + `AboutPage.tsx` cho 3 site nhóm Bộ Sưu Tập; thêm route trong `App.tsx`, nav item ở cả desktop + mobile trong `Header.tsx`. Riêng `shop-giay-dep` phải bổ sung thêm block CSS `.gd-split-row`/`.gd-split-media`/`.gd-split-content` vào `template.css` (site build trước khi template có layout alternating-row cho 2 trang này). Review phát hiện pattern lặp lại: 3/6 site (`shop-thoi-trang`, `shop-thuc-pham-sach`, `shop-rau-xanh`) quên thêm link 2 trang mới vào `Footer.tsx` dù `shop-ban-hang`/`shop-giay-dep`/`shop-quan-ao` đã làm đúng trong cùng batch — đã fix thủ công (thêm 2 `<Link>` mỗi site, không phải lỗi thiết kế cố ý).

### Tìm kiếm sản phẩm (2026-07-18)

Trước đó không site shop nào có tìm kiếm thật (2/9 template chỉ có icon kính lúp trang trí `href="#"`/link tĩnh; 2/6 site WebDeploy — `shop-ban-hang`, `shop-thoi-trang` — đã có ô tìm kiếm thật trên `ProductsPage` nhưng chưa đọc `?q=` khi điều hướng từ nơi khác; backend cả 6 site WebDeploy đã hỗ trợ sẵn `?q=` LIKE-search từ trước, kể cả 4 site build từ `_scaffold/types/shop/` — không cần đụng API). Đã bổ sung đồng bộ cho toàn bộ 9 template + 6 WebDeploy:
- **Nav**: nút kính lúp hoạt động thật trên MỌI trang (không chỉ trang Sản phẩm) — bấm mở panel trượt xuống có ô nhập, submit điều hướng `san-pham.html?q=<từ khóa>` (template) hoặc `navigate('/san-pham?q=...')` (WebDeploy, dùng `useNavigate`). Nav chính (menu items) không đổi.
- **Trang Sản phẩm**: filter-block "Tìm kiếm" đặt đầu tiên trong sidebar. Template: JS thuần lọc `.xx-prod-card` theo text `.xx-prod-name` (case-insensitive substring), tự đọc `?q=` từ URL bằng `URLSearchParams` khi tải trang. WebDeploy: state `searchInput`/`appliedSearch` debounce 400ms → set vào `query` (`URLSearchParams` gửi API `?q=...`), đọc `?q=` ban đầu qua `useSearchParams` trong 1 effect riêng (không gộp effect debounce).
- **Ngoại lệ class**: `shop-tui-sach` dùng `.ts-card`/`.ts-card-name` (không phải `.ts-prod-card`/`.ts-prod-name` như 8 site còn lại) — do site này thiết kế card kiểu `<a>` không border/shadow, khác quy ước chung.
- Site nào WebDeploy đã có sẵn tính năng tương đương (`shop-thoi-trang`) thì agent chỉ verify + không sửa gì thêm, tránh trùng lặp code.

### `shop-may-anh` — WebDeploy build (2026-07-22)

Site shop thứ 9 build đầy đủ WebDeploy (trước đó template-only) — scaffold type `shop` (`node scaffolder.mjs shop-may-anh shop`), toàn bộ 9 trang seed nội dung thật từ template (không Lorem ipsum), mở rộng `products` thêm cột `brand/gallery/bundle_options/specs/review_count/sold_count`. `CartItem.size` (field generic của `CartContext` scaffold) được tận dụng lại để mang giá trị "Gói phụ kiện" thay vì kích cỡ — quan hệ ngữ nghĩa, không sửa scaffold. Website dùng Google Fonts Sora (khác Bunny Fonts mặc định rule 17) — đúng theo font đã khai báo trong 9 file template gốc, cùng precedent với các site shop khác (mỗi site giữ đúng font riêng của template).

**Bug pattern tái phát, đã fix ngay trong batch review:** admin.css của site này chưa được đối chiếu/bổ sung sau khi viết xong các trang admin — đúng bug đã ghi nhận nhiều lần trước đó (`shop-quan-ao`, `shop-tui-sach`). Toàn bộ trang Dashboard/Sidebar/Settings/ProductForm/ProductCategoryForm/OrderList/OrderDetail dùng class (`admin-page-*`, `admin-form`, `btn btn-primary/outline`, `form-check`, `status-badge`, `settings-tab`, `sidebar-avatar/profile/logout`...) không tồn tại trong `admin.css` gốc (162 dòng, y hệt bản `_scaffold/`, chưa từng sửa). Fix: copy nguyên khối "Admin CRUD pages" (232 dòng) từ `shop-giay-dep/admin/src/styles/admin.css` — nguồn tham chiếu chuẩn đã ghi trong rule "Bug pattern đã lặp lại" ở mục WebDeploy Shop Scaffold — chỉ giữ lại đúng 1 khác biệt: `.sidebar-logo span`/`.login-logo span` giữ màu amber `#d97706` gốc của site thay vì lime `#d4ff3f` của `shop-giay-dep` (2 site khác Identity Token). Verify sau fix: liệt kê toàn bộ `className` trong `admin/src/pages/` + `admin/src/components/` đối chiếu `admin.css` — 0 class còn thiếu (ngoại trừ các class wrapper vô hại đã whitelist).

**Bug Nav-4 "chìm" trên nền tối, đã fix (2026-07-23):** nav style "Minimal Top Line" (`#ma-nav`, transparent khi chưa scroll, chỉ có border-top accent) dùng chữ/logo/icon màu tối (`var(--dark)`) — khi nav đè lên vùng hero/banner nền tối (hero H10 geometric-split ở trang chủ có polygon tối bên trái; `.ma-page-hero` nền `var(--dark)` full-width ở các trang list/dịch vụ/chính sách) thì chữ tối trên nền tối không đọc được, đặc biệt trên mobile (breakpoint <900px, polygon tối phủ 100% chiều rộng phần trên). Fix ở **cả 2 codebase** của site này (static template `Sources/templates/web/Shops/shop-may-anh/` + WebDeploy `Sources/WebDeploy/shop-may-anh/`):
- Thêm scrim gradient tối cố định (`#ma-nav::before`, cao 140px, fade dần) làm nền đảm bảo tương phản, cộng rule đổi màu logo/link/icon/burger sang trắng khi nav ở trạng thái transparent.
- **Static template**: dùng selector `#ma-nav:not(.ma-scrolled)` toàn cục — an toàn vì 8/9 trang con đã hardcode sẵn `class="ma-scrolled"` trong HTML (luôn nền trắng), chỉ `index.html` có nav transparent thật (JS toggle theo `scrollY`).
- **WebDeploy (React SPA)**: KHÔNG thể dùng `:not(.ma-scrolled)` toàn cục vì `Header.tsx` dùng chung 1 component cho mọi route — phải route-aware: thêm `navOnDarkRoutes = ['/', '/san-pham', '/dich-vu', '/thuong-hieu', '/chinh-sach-bao-mat', '/dieu-khoan']` (các route có `.ma-page-hero`/hero nền tối ngay dưới nav) → gán class `.ma-nav-on-dark` khi route khớp VÀ chưa scroll; 4 route còn lại (`/gio-hang`, `/thanh-toan`, `/lien-he`, `/san-pham/:slug`) có nền sáng ngay dưới nav nên giữ nguyên chữ tối, không đổi.
- **Bug phụ do chính fix gây ra, phát hiện qua reviewer**: scrim `::before` (z-index:1) đè lên `.ma-search-panel` (dropdown tìm kiếm, vốn không có z-index riêng) khi mở tìm kiếm lúc nav chưa scroll → che mờ ô input. Fix: thêm `z-index: 3` cho `.ma-search-panel` ở cả 2 file CSS.
- Đã rebuild `website/dist` (WebDeploy) qua `npm run build` sau cả 2 vòng fix. QA Playwright xác nhận cả 2 codebase + toàn bộ route/breakpoint liên quan đều đúng, không regression.
- **Bài học cho template/site khác dùng nav transparent kiểu tương tự** (Nav-1 transparent→scrolled, Nav-4 minimal top-line...): nếu nav dùng chữ màu tối cố định khi transparent, phải kiểm tra kỹ MỌI vùng nội dung có thể xuất hiện ngay dưới nav (không chỉ hero trang chủ) — với site React SPA dùng header chung cho mọi route, cách xử lý đúng là route-aware class thay vì global `:not(.scrolled)`.

### `shop-ami-mobile` — WebDeploy build (2026-07-24)

Site shop thứ 10 build đầy đủ WebDeploy (trước đó template-only) — scaffold type `shop` (`node scaffolder.mjs shop-ami-mobile shop`), toàn bộ 9 trang seed 42 sản phẩm thật từ `products-data.js` của template (không Lorem ipsum). Mở rộng `products` thêm cột `brand`/`theme`/`sold` — `theme` là comma-separated (`noi-bat,phu-kien,moi-ve,giam-gia`) quyết định sản phẩm xuất hiện ở section nào trên trang chủ + `?theme=` trên trang Sản phẩm. `ShopPublicController::products()` được mở rộng thêm 2 filter `brands`/`theme` (theo đúng comment cho phép mở rộng sẵn có trong file — cùng precedent `shop-may-anh`/`shop-may-tinh`).
- **Trang chủ theo Mode B (themed-sections)**: 4 section chủ đề (Điện thoại nổi bật/Phụ kiện hot/Hàng mới về/Đang giảm giá), 2 section đầu+cuối có tìm kiếm cục bộ + brand quick-filter riêng, không ảnh hưởng URL/trang Sản phẩm — port đúng theo cấu trúc `index.html` gốc.
- **Trang Sản phẩm dùng filter toolbar NGANG** (category pill + brand/color dropdown checkbox + price range slider debounce 250ms + sort select, áp dụng tức thì không nút Apply) thay vì sidebar dọc 5-block chuẩn rule 22 — bám đúng cấu trúc thật của `san-pham.html`, cùng ngoại lệ đã áp dụng ở `shop-tui-sach`/`shop-may-tinh`. Mobile filter drawer tự viết bằng React state (không dùng Bootstrap JS bundle — site chỉ load Bootstrap CSS qua CDN, không có `bootstrap.bundle.min.js`) tái dùng class `.offcanvas`/`.mb-offcanvas` sẵn có trong CSS, tự toggle `visibility`/`.show` thay vì `data-bs-toggle`.
- **Hero (Intro Banner H5 Bold Typography) không dùng ảnh** — chỉ chữ lớn 42–100px + ticker marquee, khác các site trước luôn có `HeroSlider.tsx` gắn với ảnh. Bảng `hero_slides` vẫn seed 1 record để menu admin hoạt động đúng chuẩn scaffold nhưng không hiển thị trên site; toàn bộ nội dung banner (stamp/3 dòng tiêu đề/mô tả/2 CTA/6 dòng ticker) đọc từ settings nhóm `hero`.
- **Thông số kỹ thuật trang chi tiết sản phẩm suy diễn theo tên máy, không lưu DB**: port nguyên vẹn `PHONE_PROFILES` (20 dòng máy) từ `chi-tiet-san-pham.html` sang `website/src/lib/phoneSpecs.ts` — chỉ áp dụng khi `category_slug === 'dien-thoai'`, danh mục khác hiển thị bảng thông tin chung đơn giản hơn (đúng theo `renderSpecsTabs()` gốc).
- **Bug pattern đã biết trước, tránh ngay từ đầu**: `website/src/main.tsx` **không có sẵn trong `_scaffold/`** (chỉ `admin/src/main.tsx` là core scaffold theo rule 20) — thiếu file này khiến `vite build` lỗi `Rollup failed to resolve import "/src/main.tsx"`. Đã tạo mới theo đúng pattern các site WebDeploy khác (`BrowserRouter` bọc ngoài `<App/>`, import `template.css` + `shop-checkout.css` tại đây thay vì trong `App.tsx`).
- **Bug pattern admin.css tái phát lần thứ 4** (sau `shop-quan-ao`, `shop-tui-sach`, `shop-may-anh`): admin.css gốc scaffold 162 dòng thiếu toàn bộ khối "Admin CRUD pages" — đã fix bằng cách copy nguyên khối chuẩn từ `shop-giay-dep/admin/src/styles/admin.css`, giữ đúng 1 khác biệt `.sidebar-logo span`/`.login-logo span` màu amber `#d97706` gốc của site. Verify: liệt kê `className` toàn bộ `admin/src/pages/`+`admin/src/components/` đối chiếu `admin.css` — 0 class thiếu (trừ 4 class wrapper vô hại đã whitelist: `.admin-page`, `.admin-table`, `.admin-quick-links`, `.stat-info`).
- Verify: `php -l` 0 lỗi toàn bộ `api/`, `npx tsc -b && vite build` 0 lỗi cả `website/` và `admin/`, 0 file còn `console.log`, không có title-conflict JSX, `useDocumentMeta` có mặt ở toàn bộ 9 file trong `website/src/pages/` + `Contact.tsx`.
- **⚠️ Bug phát hiện qua review độc lập, phạm vi RỘNG HƠN 1 site — CHƯA fix ở nơi khác:** 3 file `admin/src/pages/contacts/ContactList.tsx` + `admin/src/pages/slides/{HeroSlideForm,HeroSlideList}.tsx` copy nguyên từ `_scaffold/types/_common/` bị thiếu dấu tiếng Việt hoàn toàn (vi phạm rule 3 `web-deploy-builder.md`) — đã fix riêng cho `shop-ami-mobile` (nằm trong phạm vi site này). Do lỗi nằm ở **cấp scaffold dùng chung cho MỌI type** (không riêng `shop`), nhiều khả năng toàn bộ site build từ `_scaffold/` trước ngày fix này đều dính cùng lỗi ở đúng 3 file trên — chưa audit/fix hàng loạt vì ngoài phạm vi 1 site đơn lẻ, cần quyết định của chủ dự án trước khi fix `_scaffold/` + back-port sang các site cũ.

### `shop-quan-ao-ami` — WebDeploy build (2026-07-24)

Site shop thứ 11 build đầy đủ WebDeploy (trước đó template-only, xây bởi `shop-catalog-builder`) — scaffold type `shop` (`node scaffolder.mjs shop-quan-ao-ami shop`), toàn bộ 9 trang seed 36 sản phẩm thật từ `products-data.js` của template (không Lorem ipsum). Mở rộng `products` thêm cột `sizes`/`theme` (cả hai lưu dạng **padded pipe** `|XS|S|M|`/`|hang-moi|ban-chay|` — khác quy ước comma-separated của `shop-ami-mobile` — để tránh bug substring lệch khi filter LIKE, vd size "S" khớp nhầm vào "XS" nếu không có dấu `|` chặn 2 đầu) + `sold` (dùng cho sort "Bán chạy nhất"). `ShopPublicController::products()` mở rộng thêm 2 filter `sizes`/`theme` (LIKE `%|value|%`) + case `bestseller` cho sort — theo đúng comment cho phép mở rộng sẵn có trong file, cùng precedent `shop-may-anh`/`shop-may-tinh`/`shop-ami-mobile`.
- **Mỗi sản phẩm AMI chỉ có ĐÚNG 1 màu** (khác các site shop khác cho phép nhiều màu/sản phẩm) — vẫn lưu theo convention chung `colors = "Tên:#hex"` (rule 24) để đồng bộ whitelist, nhưng UI admin (`ProductForm.tsx`) chỉ cho chọn 1 swatch (không phải multi-toggle như các site khác), và `ProductsPage.tsx` filter theo tên màu (label có dấu, không phải slug ascii) để khớp đúng dữ liệu lưu trong cột `colors`.
- **Trang chủ giữ nguyên Biến thể 2 CATEGORY-SECTIONS của template gốc**: "Search Zone" (h1 + ô tìm kiếm lớn, KHÔNG có hero ảnh/banner) + 4 section sản phẩm thuần (Hàng mới về/Bán chạy nhất/Đang giảm giá/Áo & Tops), mỗi section (trừ Áo & Tops) có ô tìm kiếm cục bộ riêng lọc client-side trên dữ liệu đã preload qua `SiteContext` (`per_page=200`) — không gọi API riêng cho từng section, khớp đúng hành vi JS gốc (`Array.filter` trong bộ nhớ). File `HeroSlider.tsx` (giữ tên theo scaffold) được tái sử dụng để render Search Zone thay vì slider ảnh.
- **Trang Sản phẩm dùng filter toolbar NGANG** (category pill exclusivity + dropdown Khoảng giá/Size/Màu sắc + sort, áp dụng tức thì không nút Apply) thay vì sidebar dọc 5-block chuẩn rule 22 — bám đúng cấu trúc thật của `san-pham.html`, cùng ngoại lệ đã áp dụng ở `shop-tui-sach`/`shop-may-tinh`/`shop-ami-mobile`. Category state giữ dạng **mảng** (không phải string đơn như `shop-ami-mobile`) để hỗ trợ đúng 2 link gốc dùng nhiều danh mục cùng lúc (`?category=ao-thun,ao-so-mi` từ trang chủ + Bộ sưu tập) — pill click vẫn giữ đúng hành vi exclusivity của JS gốc (chọn 1 danh mục thay thế toàn bộ, click lại để bỏ chọn). Dropdown Khoảng giá/Size/Màu sắc dùng đúng class Bootstrap `dropdown-menu`/`.show` (CSS thuần, không cần `bootstrap.bundle.min.js`) thay vì `data-bs-toggle`, cùng kỹ thuật offcanvas React-controlled đã dùng ở `shop-ami-mobile`.
- **Trang Bộ sưu tập** (`/bo-suu-tap`) và **Giới thiệu** (`/ve-chung-toi`) toàn bộ nội dung (3 collection, hero/story/values/stat-bar/why/testimonials/policy/CTA) quản lý qua Settings — riêng 4 icon SVG "Vì sao chọn AMI" và 4 icon SVG "Chính sách mua hàng" giữ cố định trong code (không đơn giản là emoji như `shop-ami-mobile`) vì đúng theo thiết kế gốc dùng SVG phức tạp, chỉ title/desc mới settings-managed.
- **Không triển khai module Phiếu giảm giá (coupon)** dù template gốc (`gio-hang.html`) có UI coupon trang trí (`COUPONS` object hardcode client-side, không có backend thật) — nằm ngoài phạm vi yêu cầu ban đầu của site này (khác `shop-quan-ao`/`shop-giay-dep`/... đã làm coupon thật), theo đúng precedent `shop-ami-mobile` (cũng không có coupon).
- **`website/src/main.tsx` không có sẵn trong `_scaffold/`** (đã biết trước từ bug pattern `shop-ami-mobile`) — tạo mới ngay từ đầu theo đúng pattern (`BrowserRouter` bọc `<App/>`, import `template.css` + `shop-checkout.css` tại đây).
- **Bug pattern admin.css tái phát lần thứ 5** (sau `shop-quan-ao`, `shop-tui-sach`, `shop-may-anh`, `shop-ami-mobile`): admin.css gốc scaffold 162 dòng thiếu toàn bộ khối "Admin CRUD pages" — fix bằng cách copy nguyên khối chuẩn từ `shop-giay-dep/admin/src/styles/admin.css`, đổi màu `.sidebar-logo span`/`.login-logo span` từ amber gốc sang sage `#6b8067` (khớp accent thật của site, khác precedent giữ nguyên màu gốc ở các site trước — ở đây amber không liên quan gì đến palette ZEN-MINIMAL nên đổi cho nhất quán thương hiệu). Verify: liệt kê `className` toàn bộ `admin/src/pages/`+`admin/src/components/` đối chiếu `admin.css` — 0 class thiếu.
- **Bug scaffold-wide đã biết trước (từ `shop-ami-mobile`), fix ngay trong phạm vi site này**: 3 file `admin/src/pages/contacts/ContactList.tsx` + `admin/src/pages/slides/{HeroSlideForm,HeroSlideList}.tsx` copy từ `_scaffold/types/_common/` thiếu dấu tiếng Việt hoàn toàn — đã fix toàn bộ text sang tiếng Việt có dấu. Xác nhận lại: bug này vẫn CHƯA được fix ở cấp `_scaffold/`, mọi site build sau `shop-ami-mobile` (bao gồm site này) đều cần tự fix thủ công cho đến khi chủ dự án quyết định fix gốc.
- Đã test runtime thật (PHP built-in server): `/health`, `/public/settings` (xác nhận lọc payment/smtp), `/public/products` (36 sản phẩm, filter `theme`/`sizes`/`colors` đều đúng), `/public/products/:slug`, `/sitemap.xml` (đủ 7 route tĩnh), `/public/payment-methods`, `POST /public/orders` (tạo đơn COD thành công, tính đúng subtotal/shipping/total), admin `/stats`/`/settings`/`/products` (session cookie) — toàn bộ đúng như kỳ vọng.
- Verify: `php -l` 0 lỗi toàn bộ `api/`, `npx tsc -b && vite build` 0 lỗi cả `website/` và `admin/`, `node build.mjs` chạy thành công tạo `_output-deploy/` (test lại bằng PHP built-in server, `/api/health` + `/api/public/products` đều đúng qua tiền tố `/api`), 0 file còn `console.log`, không có title-conflict JSX, `useDocumentMeta` có mặt ở toàn bộ 9 file trong `website/src/pages/` + `Contact.tsx` (kể cả `CheckoutPage.tsx` — bổ sung thêm dù là file scaffold tĩnh, theo đúng precedent `shop-ami-mobile`).

### `shop-my-pham` — WebDeploy build (2026-07-28)

Site shop thứ 12 build đầy đủ WebDeploy (trước đó template-only, xây bởi `shop-catalog-builder`) — scaffold type `shop` (`node scaffolder.mjs shop-my-pham shop`), toàn bộ 9 trang seed 36 sản phẩm thật từ `products-data.js` của template (không Lorem ipsum). Mở rộng `products` thêm cột `brand`/`skin_type`/`theme`/`sold` — `skin_type`/`theme` lưu dạng **padded pipe** (`|da-dau|`/`|ban-chay|hang-moi|`, cùng convention `shop-quan-ao-ami` — không phải comma-separated như `shop-ami-mobile`) để tránh substring bug khi filter LIKE. `ShopPublicController::products()` mở rộng thêm filter `brands`/`skin_types`/`theme` + sort `rating-desc`/`sold-desc`/`newest` — theo đúng comment cho phép mở rộng sẵn có trong file, cùng precedent các site shop trước.
- **Trang chủ giữ nguyên Biến thể 2 CATEGORY-SECTIONS của template gốc**: Search Zone (không hero ảnh) + 4 section sản phẩm thuần, mỗi section (trừ 1) có tìm kiếm cục bộ riêng.
- **Trang Sản phẩm dùng filter toolbar NGANG** (category pill + brand/skin-type dropdown + price range slider + sort) thay vì sidebar dọc 5-block chuẩn rule 22 — bám đúng cấu trúc thật của `san-pham.html`, cùng ngoại lệ đã áp dụng ở `shop-tui-sach`/`shop-may-tinh`/`shop-ami-mobile`/`shop-quan-ao-ami`.
- **Trang chi tiết sản phẩm chỉ dùng 1 ảnh thật** (không giả thêm thumbnail phụ từ 1 nguồn) + có đủ handler "Thêm vào giỏ" VÀ "Mua ngay" — chủ động tránh đúng 2 bug đã từng gặp ở `shop-quan-ao-ami`.
- **Áp dụng đúng fix mobile-nav-overlay vừa phát hiện trên bản template tĩnh của chính site này** (`.mp-mob-menu` dùng `visibility:hidden` + `transition-delay` thay vì chỉ dựa vào `transform:translateY(-110%)`) — port nguyên fix này sang `website/src/styles/template.css` của bản React, xác nhận qua review không bị tái phát.
- **Bug pattern admin.css tái phát lần thứ 6** (sau `shop-quan-ao`, `shop-tui-sach`, `shop-may-anh`, `shop-ami-mobile`, `shop-quan-ao-ami`) — chủ động fix ngay từ đầu bằng cách copy khối chuẩn từ `shop-giay-dep/admin/src/styles/admin.css`, đổi `.sidebar-logo span`/`.login-logo span` sang Rose Gold `#c98a8a` khớp accent site. Verify: 0 class thiếu.
- **Bug scaffold-wide đã biết trước** (3 file `_common/` thiếu dấu tiếng Việt — `ContactList.tsx`/`HeroSlideForm.tsx`/`HeroSlideList.tsx`) — fix ngay trong phạm vi site này, vẫn CHƯA fix ở cấp `_scaffold/`.
- `website/src/main.tsx` không có sẵn trong `_scaffold/` (đã biết trước) — tạo mới đúng pattern.
- Review độc lập: **SHIP ngay lần đầu, không phát hiện bug nào** — kể cả live-test substring filter (`skin_types=da` trả về 0 kết quả đúng, không khớp nhầm `da-dau`/`da-kho`) và live-test `/public/settings` không lộ `sepay_webhook_secret`. Đây là site shop sạch nhất trong toàn bộ batch build WebDeploy tính đến nay — mọi bug pattern đã biết trước từ 11 site shop trước đó đều được chủ động tránh ngay từ đầu, không cần vòng fix nào sau review. `php -l` 0 lỗi, `tsc`/`vite build` 0 lỗi cả `website/` và `admin/`.

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

*Lịch sử thay đổi chi tiết (theo ngày, quá trình review/QA từng lần) xem `git log` — CLAUDE.md chỉ giữ facts tra cứu hiện hành.*
