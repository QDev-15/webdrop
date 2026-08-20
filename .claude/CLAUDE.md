# 📋 PROJECT OVERVIEW — Template & Website Business

> File này lưu toàn bộ ý tưởng, yêu cầu và tiến độ xây dựng dự án.
> Cập nhật liên tục theo từng giai đoạn phát triển.

## Quy tắc bắt buộc

1. **Mỗi khi thay đổi code phải review fix bug thành vòng lặp đến khi hết bug.**
2. **Mỗi khi thêm một chức năng hay thay đổi flow thì review fix bug rồi review fix lại cho đến khi hết bug.**
3. **⛔ WebDeploy scope: khi sửa một website `Sources/WebDeploy/[slug]/` thì CHỈ sửa trong thư mục đó — không tự ý sửa sang site khác.**
4. Quy tắc compact tự động (2-trigger):
   - Trước khi bắt đầu task mới: nếu context còn < 60% → compact trước rồi mới thực hiện task.
   - Bất kỳ lúc nào trong lúc làm việc: nếu context còn < 40% → compact ngay lập tức, sau đó báo lại vị trí đang làm dở để tiếp tục.
   - Mục tiêu: không bao giờ để context xuống dưới 30%.
7. **CLAUDE.md ghi facts tra cứu (conventions, bug pattern, schema, identity token...), KHÔNG ghi nhật ký thay đổi (ai sửa gì ngày nào, quá trình review/QA chi tiết) — lịch sử đó đã có trong `git log`.** Mỗi khi hoàn thành 1 site/feature: cập nhật hoặc thêm mới đúng 1 block "Ghi chú kỹ thuật" tương ứng, không thêm block tường thuật riêng.
8. Đối với các task nặng mà Claude Code tự động tạo agent chạy nền (background agent): mặc định các agent chạy nền đó phải chạy ở model Claude Sonnet 5.
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
- [x] Agency / Portfolio / Công ty — **DONE** (6 templates: `Companies/`, `Portfolios/`. 9 template Companies đã retrofit nội dung chiều sâu — case study chi tiết dự án (mục G, chỉ 3 site có: `agency-sang-tao`, `agency-web`, `cong-ty-xay-dung`; `luat-van-phong` case study là "vụ việc" pháp lý), FAQ thật ≥6 câu qua `<details>/<summary>` (mục H) và bảng giá ≥3 tier (mục I, `strategy-consulting` dùng "Hình thức hợp tác" thay vì giá cố định do bản chất dịch vụ). Áp dụng cả 2 lớp: bản tĩnh `Sources/templates/web/Companies/[slug]/` VÀ bản WebDeploy `Sources/WebDeploy/[slug]/` tương ứng (schema mới `faqs`/`pricing_plans` + case-study columns, controller CRUD, trang chi tiết React, admin quản lý). `startup-cong-nghe` không cần retrofit vì đã có sẵn FAQ+Pricing từ khi build (site dạng SaaS landing). Rule cho template mới từ nay: xem `.claude/agents/template-builder.md` mục G/H/I.)
- [x] Blog / Forum — **DONE** (`Blogs/`, `Forums/`)
- [x] Nha khoa — **DONE** (10 template: `Dental-Clinics/` — 10 Identity Token khác nhau: LUXE-DARK, FRESH-MINIMAL, BOLD-EDITORIAL, GEOMETRIC-MODERN, SOFT-PASTEL, DARK-ENERGY, CLEAN-CORPORATE, ZEN-MINIMAL, RETRO-BOLD, GLASS-MODERN)
- [x] Shop bán hàng — **DONE** (16 templates, TOÀN BỘ 16 đã có WebDeploy đầy đủ — `shop-ban-hang/` ORGANIC-EARTH, `shop-thoi-trang/` BOLD-EDITORIAL, `shop-giay-dep/` DARK-ENERGY, `shop-quan-ao/` SOFT-PASTEL, `shop-rau-xanh/` WARM-ARTISAN, `shop-thuc-pham-sach/` FRESH-MINIMAL, `shop-tui-sach/` LUXE-DARK, `shop-may-tinh/` GLASS-MODERN, `shop-may-anh/` GEOMETRIC-MODERN, `shop-ami-mobile/` RETRO-BOLD, `shop-quan-ao-ami/` ZEN-MINIMAL (WebDeploy build 2026-07-24), `shop-my-pham/` LUXE-DARK variant Rose Gold (WebDeploy build 2026-07-28), `shop-do-gia-dung/` WARM-ARTISAN variant Terracotta+Sage (WebDeploy build 2026-07-29), `shop-do-choi/` SOFT-PASTEL variant Sky Blue+Coral (WebDeploy build 2026-07-29, phát hiện lại 2026-08-04), `shop-van-phong-pham/` CLEAN-CORPORATE fresh token Steel Blue (WebDeploy build 2026-08-06), `shop-the-thao/` DARK-ENERGY variant Signal Orange (WebDeploy build dở dang phát hiện + fix hoàn chỉnh 2026-08-06) — xem bảng **WebDeploy Projects**)
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
│       │   ├── shop-the-thao/      (DARK-ENERGY variant Signal Orange, WebDeploy đầy đủ, css prefix tt-, shop-catalog-builder)
│       │   ├── shop-do-choi/       (SOFT-PASTEL variant Sky Blue+Coral, WebDeploy đầy đủ, css prefix dc-, shop-catalog-builder)
│       │   ├── shop-my-pham/       (LUXE-DARK variant Rose Gold #c98a8a, WebDeploy đầy đủ, css prefix mp-, shop-catalog-builder)
│       │   ├── shop-do-gia-dung/   (WARM-ARTISAN Terracotta+Sage, WebDeploy đầy đủ, css prefix dg-, shop-catalog-builder 2026-07-29, styling fixed 2026-07-30)
│       │   └── shop-van-phong-pham/ (CLEAN-CORPORATE fresh token Steel Blue, WebDeploy đầy đủ, css prefix vp-, shop-catalog-builder, WebDeploy build 2026-08-06)
│       └── CVs/                   ← 🔲 PLANNING (5 mẫu: classic, minimal, creative, dark, executive)
├── documents/                      ← Prototype UI HTML (tham khảo)
└── .gitignore
```

---

## 🖥️ HẠ TẦNG

- **VPS**: AZDIGI Linux (~200–300k/tháng, 2 vCPU, 2GB RAM, NVMe, datacenter VN)
- **System DB**: Neon PostgreSQL — **phát hiện 2026-07-28: local dev và production webdrop.store hiện dùng CHUNG 1 Neon DB** (`DATABASE_URL` trong `.env` local trỏ thẳng vào DB mà `NEXT_PUBLIC_URL=https://webdrop.store` cũng dùng — khác kế hoạch "PostgreSQL tự host riêng cho prod" ghi trước đây, có thể là kế hoạch chưa triển khai). **Hệ quả quan trọng: mọi thao tác test (tạo order, checkout, xác nhận thanh toán...) trên localhost đều ghi thẳng vào dữ liệu thật của webdrop.store** — cẩn thận khi tạo/xoá dữ liệu test, luôn dọn dẹp sau khi test xong.
- **Prisma `directUrl` (thêm 2026-07-30)**: `schema.prisma` datasource giờ có `directUrl = env("DIRECT_URL")` bên cạnh `url = env("DATABASE_URL")` — `DATABASE_URL` là endpoint `-pooler` (PgBouncer) dùng cho query runtime bình thường, `DIRECT_URL` là endpoint KHÔNG có hậu tố `-pooler` (convention chuẩn của Neon: bỏ `-pooler` khỏi hostname là ra endpoint trực tiếp) dùng riêng cho Prisma Migrate. Cả 2 đã verify kết nối thành công qua raw query thật.
- **⚠️ Giới hạn đã biết, CHƯA fix hẳn (phát hiện 2026-07-29/30)**: `npx prisma migrate status`/`migrate deploy` báo SAI cả 3 migration hiện có đều "chưa applied" (kể cả `init`) dù DB thật hoàn toàn nguyên vẹn — **đã xác minh kỹ, KHÔNG PHẢI mất dữ liệu**: query SQL thô trực tiếp xác nhận đủ 45 bảng, 4 users, 58 templates, và bảng `webdrop._prisma_migrations` có đủ 3 bản ghi `finished_at` hợp lệ. `migrate deploy` thử chạy thật báo lỗi engine `Invariant violation: migration persistence is not initialized` (không phải lỗi SQL, không đụng gì tới schema/data — an toàn). Đã thử 2 hướng fix: (1) thêm `directUrl` (xem trên) — không giải quyết được; (2) xóa 1 dòng tracking bị trùng do 1 lần fail cũ chưa dọn sạch trong `_prisma_migrations` (migration `20260611_add_template_prices` từng fail lần đầu vì cột đã tồn tại sẵn — xem ghi chú cũ — để lại cả dòng fail lẫn dòng `migrate resolve --applied`, đã xóa đúng dòng fail, giữ nguyên dòng resolved) — cũng không giải quyết được. **Nghi vấn nguyên nhân gốc**: `schema.prisma` dùng preview feature `multiSchema` với `schemas = ["webdrop"]` KHÔNG có `"public"` trong danh sách — bảng `_prisma_migrations` nằm trong `webdrop` thay vì `public`, có thể ngoài phạm vi hỗ trợ chính thức của schema-engine cho migration bookkeeping (Prisma Client thường vẫn hoạt động bình thường vì không phụ thuộc cơ chế này, chỉ generate query theo model đã định nghĩa — đúng như thực tế `db:seed` chạy tốt trong khi `migrate status` báo sai). **KHÔNG được chạy `migrate reset`/`db push --force-reset` hay bất kỳ lệnh nào có khả năng xóa schema để "fix"** — DB đang chứa dữ liệu production thật. Việc thêm bảng/cột mới (nếu cần sau này) vẫn có thể làm thủ công qua `migration.sql` viết tay + `psql`/raw query trực tiếp, hoặc `prisma migrate resolve --applied` sau khi tự chạy DDL, thay vì trông cậy `migrate dev`/`deploy` cho tới khi vấn đề multiSchema này được điều tra triệt để hoặc Prisma nâng cấp version.
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
