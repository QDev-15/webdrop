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
- [x] Shop bán hàng — **DONE** (2 templates: `shop-ban-hang/` ORGANIC-EARTH, `shop-thoi-trang/` BOLD-EDITORIAL — 5 trang mỗi template; cả 2 đều đã có bản WebDeploy đầy đủ — xem bảng **WebDeploy Projects**)
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
│       ├── shop-ban-hang/          ← ✅ 1 template (ORGANIC-EARTH identity — xem ghi chú kỹ thuật)
│       ├── shop-thoi-trang/        ← ✅ 1 template (BOLD-EDITORIAL identity — xem ghi chú kỹ thuật)
│       ├── shop-giay-dep/          ← ✅ 1 template (DARK-ENERGY identity — xem ghi chú kỹ thuật)
│       ├── shop-quan-ao/           ← ✅ 1 template (SOFT-PASTEL identity — xem ghi chú kỹ thuật)
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

### Gói Web cơ bản (WebDeploy)

- Build: `build.bat` (Windows), `bash build.sh` (Linux/Mac) → output `deploy/`
- DB tự seed lần đầu khi PHP nhận request đầu tiên — không cần setup thủ công
- Ship 2 file routing song song: `.htaccess` (Apache) + `web.config` (IIS) — cập nhật cả hai khi đổi rule
- Schema: `schema.sql` (SQLite) + `schema_mysql.sql` (MySQL option)
- Đã test: PA Vietnam Windows hosting (Plesk + IIS + PHP 8.3 FastCGI)

### WebDeploy Shop Scaffold (type `shop`)

- `node scaffolder.mjs [slug] shop` — scaffold sẵn Order+Payment TĨNH từ `_scaffold/types/shop/`, AI không viết lại: `ProductCategoryController.php`, `ProductController.php` (whitelist `BASE_FIELDS` mở rộng được qua 1 mảng), `OrderController.php`, `ShopPublicController.php` (categories/products lọc+phân trang/`paymentMethods`/`createOrder` tính lại giá từ DB/`orderStatus`/`sepayWebhook` verify `hash_equals`), `ShopSettingsController.php` (đồng bộ SePay). Admin: `ProductCategoryList/Form` (dùng `ImageField`), `ProductList/Form` (màu = mảng `COLOR_SWATCHES` AI chỉ đổi giá trị), `OrderList/Detail`, `PaymentSettingsTab.tsx` (import + 2 dòng JSX vào `Settings.tsx`, không viết lại logic). Website: `CartContext.tsx` (định danh item theo `product_id`+`color`+`size`), `CheckoutPage.tsx` + `shop-checkout.css` (CSS riêng không phụ thuộc prefix từng site — template gốc không có trang checkout để đối chiếu).
- Schema `product_categories`/`products`/`orders`/`order_items` tự động append vào `schema.sql` bởi `scaffolder.mjs` (đọc `_scaffold/types/shop-schema-fragment.sql`) — deterministic, không qua AI nên không thể lệch cột.
- `ProductsPage.tsx`/`ProductDetailPage.tsx`/`CartPage.tsx` vẫn để AI tự viết (rule 36 `web-deploy-builder.md` — phải bám sát `san-pham.html`/`chi-tiet-san-pham.html`/`gio-hang.html` từng template, layout khác theo Identity Token).
- Tích hợp bắt buộc sau scaffold (rule 42b `web-deploy-builder.md`): đăng ký route `bootstrap.php` cho 5 controller shop, seed đủ 8 settings key nhóm `payment`/`shop`, `PublicController::settings()` (site tự viết) lọc `grp NOT IN (...,'payment')`, nhúng `PaymentSettingsTab`, chỉ sửa `COLOR_SWATCHES` trong `ProductForm.tsx`.
- **`api/schema.sql` từ 2026-07-13 là file TĨNH** — 5 bảng core (`users`, `settings` dùng cột `grp`, `hero_slides` dùng `button_text`/`button_link`/`status`, `contacts`, `media`) khớp 1-1 với controller tĩnh có sẵn. AI chỉ APPEND bảng extension, KHÔNG viết lại core — fix gốc rễ lỗi lệch tên cột (`grp`/`group_name`/`"group"`) từng lặp lại ở nhiều site trước đây.
- `api/index.php` KHÔNG được gán `$router = require_once(...)` (đè mất `$router` thật bằng return value mặc định `1`) — chỉ gọi `require_once` dạng câu lệnh trần. `.htaccess`/`web.config` đã chặn sẵn `check-hash.php`.
- `api.getPaged()` trong `website/src/api/client.ts` (base scaffold, dùng chung mọi type) — đọc header `X-Total-Count` cho phân trang thay vì bọc `{items,total}` trong body.
- PHP CLI trên máy dev hiện tại: `C:\xampp\php\php.exe` (không có trong PATH mặc định, đủ module `pdo_sqlite`) — gọi full path khi cần `php -l`/test runtime.

### Client vs Server Component

- Async Server Component **không được import** từ Client Component
- Pattern: tách interactive part ra `XxxClient.tsx` (`'use client'`), `page.tsx` là Server Component
- Áp dụng: `faq/`, `contact/`, `policies/[slug]/`

### Dental-Clinics (10 templates, batch 2026-07-03)

- Xây song song bằng 10 sub-agent, mỗi agent 1 Identity Token riêng: `nha-khoa-dong-do` (LUXE-DARK), `nha-khoa-gia-dinh-sunrise` (FRESH-MINIMAL), `nha-khoa-tham-my-luxdental` (BOLD-EDITORIAL), `nha-khoa-chinh-nha-saigon` (GEOMETRIC-MODERN), `nha-khoa-tre-em-kidsmile` (SOFT-PASTEL), `nha-khoa-implant-future` (DARK-ENERGY), `nha-khoa-quoc-te-vietduc` (CLEAN-CORPORATE), `nha-khoa-tong-quat-antam` (ZEN-MINIMAL), `nha-khoa-nu-cuoi-xua` (RETRO-BOLD), `nha-khoa-cong-nghe-smiletech` (GLASS-MODERN)
- `nha-khoa-dong-do` và `nha-khoa-cong-nghe-smiletech` dùng CSS Grid/Flexbox thuần thay vì Bootstrap `row/col-*` cho phần lớn layout (chủ đích cho bento/geometric-split) — class container vẫn `.wd-container` chuẩn dự án, giữ nguyên hệ Grid, không refactor toàn bộ sang Bootstrap.
- Template gốc `nha-khoa-an-nhien` đã bị xóa chủ động bởi chủ dự án — không còn tồn tại.
- Đã seed vào System DB: industry `dental` (sortOrder 7) + 10 template (category `web`, 99.000đ, `published`).

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
| `shop-ban-hang` | WebDeploy + Template | Shop hữu cơ | ORGANIC-EARTH, Terracotta `#c4603a` + Sage `#6b8a7a` | `sb-` | Fraunces + DM Sans, Nav-7 Split, hệ 10-theme màu trong admin |
| `shop-thoi-trang` | WebDeploy + Template | Shop thời trang | BOLD-EDITORIAL, Electric Blue `#0052ff` | `st-` | Outfit, Nav-1 transparent→scrolled, có coupon + product reviews riêng |
| `shop-giay-dep` | Template-only | Shop giày dép | DARK-ENERGY, Volt Lime `#d4ff3f` + Cyan `#00e5ff` | `gd-` | Syne + Space Grotesk, Nav-3 dark floating pill |
| `shop-quan-ao` | Template-only | Shop quần áo nữ | SOFT-PASTEL, Lavender `#b98bd1` + Butter `#f2c14e` | `qa-` | DM Sans italic + Manrope, Nav-2 always solid, footer nền sáng (khác 3 shop kia) |

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
