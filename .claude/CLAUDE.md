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
| `real-estate-template-builder` | Chuyên biệt hóa từ `template-builder` cho ngách bất động sản — catalog tin đăng/dự án data-driven (filter giá/khu vực/diện tích/phòng ngủ/hướng nhà/pháp lý, sort, phân trang), trang chi tiết BĐS riêng (gallery, bản đồ, tính vay trả góp, môi giới phụ trách, BĐS tương tự — thay cho case-study 7 mục), 2 loại hình (môi giới tổng hợp / dự án chủ đầu tư đơn lẻ) | Read, Write, Edit, Glob, Grep, WebFetch, WebSearch, Bash |
| `web-deploy-builder` | Nhận slug → **chạy scaffolder** → đọc template HTML → fill ~45% AI files → tạo React + PHP + SQLite vào `Sources/WebDeploy/[slug]/` | Read, Write, Edit, Glob, Grep, Bash |
| `web-deploy-fixer` | Nhận slug → chạy TS build + PHP check → tự fix lỗi → lặp đến 0 error | Read, Write, Edit, Glob, Grep, Bash |
| `cv-template-builder` | Nhận tên template (minimal/creative/dark/executive) → tạo React CV component vào `Sources/system/src/components/cv/templates/` → cập nhật CvPreview.tsx → TypeScript check 0 lỗi | Read, Write, Edit, Glob, Grep, Bash |
| `design-match` | Dựng/fix HTML+CSS khớp 100% với ảnh thiết kế tham chiếu — vòng lặp screenshot (Playwright) → đối chiếu ảnh gốc → fix → lặp lại đến khi khớp | Read, Write, Edit, Glob, Grep, Bash |
| `db-template-sync` | Đối chiếu `Sources/products/basic/` + `Sources/templates/web/` với bảng `Template` trong DB hệ thống (`Sources/system` — Neon Postgres CHIA SẺ VỚI PRODUCTION) → phát hiện + tự sửa an toàn: template thiếu record, cờ `hasWebsite` sai. KHÔNG tự set `deployUrl` trừ khi user xác nhận site đã deploy thật. KHÔNG bao giờ chạy lại `npm run db:seed` toàn bộ | Read, Write, Edit, Glob, Grep, Bash |

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
- [x] Bất động sản — **IN PROGRESS** (3 template tĩnh: `Real-Estate/green-valley-residence` Loại hình B GLASS-MODERN, `Real-Estate/nha-dat-viet` Loại hình A CLEAN-CORPORATE (build cũ, sai ý — CHƯA retrofit theo Bước A đã sửa), `Real-Estate/rao-nha` Loại hình A FRESH-MINIMAL (build đúng theo Bước A đã sửa 2026-08-23, tham khảo đúng mô hình marketplace). WebDeploy: `rao-nha` (kiến trúc dual-auth admin/`accounts` + ví credit/gói VIP thật, xem block ghi chú kỹ thuật bên dưới) và `green-valley-residence` (build 2026-08-24, nền `company` + 7 entity BĐS mới thay Services/Team/Projects, xem `Sources/WebDeploy/green-valley-residence/`) đã có bản WebDeploy đầy đủ; `nha-dat-viet` CHƯA có WebDeploy. DB `Sources/system`: cả 3 đã có record + industry `real-estate`, `hasWebsite` khớp đúng thực tế trên đĩa (`green-valley-residence`/`rao-nha`: true, `nha-dat-viet`: false) — đồng bộ 2026-08-24 qua agent `db-template-sync`
- [x] Agency / Portfolio / Công ty — **DONE** (11 templates: `Companies/` 6, `Portfolios/` 5 — chưa tính `portfolio-toi` cũ, xem bảng bên dưới). 9 template Companies đã retrofit nội dung chiều sâu — case study chi tiết dự án (mục G, chỉ 3 site có: `agency-sang-tao`, `agency-web`, `cong-ty-xay-dung`; `luat-van-phong` case study là "vụ việc" pháp lý), FAQ thật ≥6 câu qua `<details>/<summary>` (mục H) và bảng giá ≥3 tier (mục I, `strategy-consulting` dùng "Hình thức hợp tác" thay vì giá cố định do bản chất dịch vụ). Áp dụng cả 2 lớp: bản tĩnh `Sources/templates/web/Companies/[slug]/` VÀ bản WebDeploy `Sources/WebDeploy/[slug]/` tương ứng (schema mới `faqs`/`pricing_plans` + case-study columns, controller CRUD, trang chi tiết React, admin quản lý). `startup-cong-nghe` không cần retrofit vì đã có sẵn FAQ+Pricing từ khi build (site dạng SaaS landing). **Batch 5 template Portfolio mới (2026-08-21)** — `portfolio-nhiep-anh` (WARM-ARTISAN), `portfolio-thiet-ke-do-hoa` (BOLD-EDITORIAL), `portfolio-ux-designer` (GLASS-MODERN), `portfolio-kien-truc-su` (ZEN-MINIMAL), `portfolio-minh-hoa` (RETRO-BOLD) — mỗi site 9 trang (trang chủ carousel hero + dự án + 2 case-study mục G + dịch vụ có FAQ mục H/bảng giá mục I + về tôi + liên hệ + 2 trang pháp lý footer-only), xem block "5 template Portfolio" riêng bên dưới. Rule cho template mới từ nay: xem `.claude/agents/template-builder.md` mục G/H/I.)
- [x] Blog / Forum — **DONE** (`Blogs/` 6 templates — `blog-ca-nhan` + 5 mới batch 2026-08-29, xem ghi chú kỹ thuật, `Forums/` `forum-cong-dong`)
- [x] Nha khoa — **DONE** (10 template: `Dental-Clinics/` — 10 Identity Token khác nhau: LUXE-DARK, FRESH-MINIMAL, BOLD-EDITORIAL, GEOMETRIC-MODERN, SOFT-PASTEL, DARK-ENERGY, CLEAN-CORPORATE, ZEN-MINIMAL, RETRO-BOLD, GLASS-MODERN)
- [x] Shop bán hàng — **DONE** (21 templates — 16 đã có WebDeploy đầy đủ, 5 mới nhất (`shop-noi-that`/`shop-trang-suc`/`shop-thu-cung`/`shop-dong-ho`/`shop-ruou-vang`) mới chỉ có bản tĩnh — `shop-ban-hang/` ORGANIC-EARTH, `shop-thoi-trang/` BOLD-EDITORIAL, `shop-giay-dep/` DARK-ENERGY, `shop-quan-ao/` SOFT-PASTEL, `shop-rau-xanh/` WARM-ARTISAN, `shop-thuc-pham-sach/` FRESH-MINIMAL, `shop-tui-sach/` LUXE-DARK, `shop-may-tinh/` GLASS-MODERN, `shop-may-anh/` GEOMETRIC-MODERN, `shop-ami-mobile/` RETRO-BOLD, `shop-quan-ao-ami/` ZEN-MINIMAL (WebDeploy build 2026-07-24), `shop-my-pham/` LUXE-DARK variant Rose Gold (WebDeploy build 2026-07-28), `shop-do-gia-dung/` WARM-ARTISAN variant Terracotta+Sage (WebDeploy build 2026-07-29), `shop-do-choi/` SOFT-PASTEL variant Sky Blue+Coral (WebDeploy build 2026-07-29, phát hiện lại 2026-08-04), `shop-van-phong-pham/` CLEAN-CORPORATE fresh token Steel Blue (WebDeploy build 2026-08-06), `shop-the-thao/` DARK-ENERGY variant Signal Orange (WebDeploy build dở dang phát hiện + fix hoàn chỉnh 2026-08-06). **Batch 5 template Shop mới (2026-08-29)**: `shop-noi-that/` ZEN-MINIMAL variant Walnut Brown, `shop-trang-suc/` LUXE-DARK variant 3 Amethyst, `shop-thu-cung/` GEOMETRIC-MODERN variant Coral, `shop-dong-ho/` GLASS-MODERN variant Deep Teal, `shop-ruou-vang/` RETRO-BOLD variant Burgundy — cả 5 build qua `shop-template-builder`, CHƯA có WebDeploy, xem block "5 template Shop mới" riêng bên dưới — xem bảng **WebDeploy Projects**)
- [ ] Landing page sản phẩm / Dịch vụ
- [ ] CV cá nhân — **PLANNING** (CV Builder SaaS — xem `.claude/plans/cv-template-saas.md`). Nền tảng cho phase này đã có sẵn: hệ thống tài khoản khách hàng (`CustomerAccount`) — xem ghi chú kỹ thuật bên dưới.

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
│       ├── Cafes/                  ← ✅ 6 templates (cafe-thoi-gian + 5 mới, xem ghi chú kỹ thuật)
│       ├── Blogs/                  ← ✅ 6 templates (blog-ca-nhan + 5 mới, xem ghi chú kỹ thuật)
│       ├── Forums/                 ← ✅ forum-cong-dong
│       ├── Portfolios/             ← ✅ 6 templates (portfolio-toi + 5 mới, xem ghi chú kỹ thuật)
│       ├── Dental-Clinics/         ← ✅ 10 templates (xem ghi chú kỹ thuật)
│       ├── Shops/                  ← ✅ 21 shop templates (xem bảng tra nhanh cho chi tiết từng site)
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
│       │   ├── shop-van-phong-pham/ (CLEAN-CORPORATE fresh token Steel Blue, WebDeploy đầy đủ, css prefix vp-, shop-catalog-builder, WebDeploy build 2026-08-06)
│       │   ├── shop-noi-that/      (ZEN-MINIMAL variant Walnut Brown #8b5e3c, bản tĩnh only (chưa WebDeploy), css prefix nt-, shop-template-builder Mode A CATALOG-UNIFIED, build 2026-08-29)
│       │   ├── shop-trang-suc/     (LUXE-DARK variant 3 Amethyst #7c5ba6, bản tĩnh only (chưa WebDeploy), css prefix tr-, shop-template-builder Mode B THEMED-SECTIONS, build 2026-08-29)
│       │   ├── shop-thu-cung/      (GEOMETRIC-MODERN variant Coral #ff6b5b, bản tĩnh only (chưa WebDeploy), css prefix tc-, shop-template-builder Mode A CATALOG-UNIFIED, build 2026-08-29)
│       │   ├── shop-dong-ho/       (GLASS-MODERN variant Deep Teal #0d7377, bản tĩnh only (chưa WebDeploy), css prefix dh-, shop-template-builder Mode B THEMED-SECTIONS, build 2026-08-29)
│       │   └── shop-ruou-vang/     (RETRO-BOLD variant Burgundy #722f37, bản tĩnh only (chưa WebDeploy), css prefix rv-, shop-template-builder Mode A CATALOG-UNIFIED, build 2026-08-29)
│       ├── Real-Estate/            ← 🔲 IN PROGRESS — 3 template (`green-valley-residence` GLASS-MODERN Loại hình B, `nha-dat-viet` CLEAN-CORPORATE Loại hình A build cũ sai ý, `rao-nha` FRESH-MINIMAL Loại hình A build đúng marketplace, xem ghi chú kỹ thuật)
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

---

## 📝 GHI CHÚ KỸ THUẬT

### Hệ thống tài khoản khách hàng — `CustomerAccount` (2026-08-28, `Sources/system`)

Trước đây webdrop.store KHÔNG có tài khoản khách hàng thật — checkout luôn guest (match/tạo `Customer` CRM theo email, không login được), và CV Builder dùng tạm bảng `users` (bảng ADMIN, role mặc định `user`) làm tài khoản CV, tạo mật khẩu ngẫu nhiên khi mua CV. Đã thay bằng model mới **`CustomerAccount`** (bảng `customer_accounts`) hoàn toàn tách biệt khỏi `User` — đăng ký/đăng nhập bằng email HOẶC SĐT (`email`/`phone` đều `@unique` trong schema, tự nhiên đảm bảo 1 SĐT chỉ gắn 1 email và ngược lại), quản lý tập trung template/CV/website đã mua + lịch sử đơn hàng + avatar + đổi mật khẩu.

**Phát hiện & vá kèm theo (độc lập với task nhưng liên quan trực tiếp)**: `POST /api/auth/login` (login admin) trước đây KHÔNG kiểm tra `role` — bất kỳ row nào trong `users` (kể cả tài khoản CV cũ role=`user`) đều lấy được session admin thật vì nhiều route `/api/admin/*` (GET) chỉ check "đã đăng nhập" chứ không check role. Đã vá thêm `if (user.role !== 'superadmin') return 403` trước khi cấp session.

**Kiến trúc**: `CvProfile.userId` (FK → `users`) đổi thành `CvProfile.accountId` (FK → `customer_accounts`) — CV Builder giờ dùng chung 1 tài khoản với phần còn lại của site. Session riêng `wd_account_session` (cookie/HMAC token pattern y hệt `wd_session`/`wd_cv_session` có sẵn trong `src/lib/auth.ts`, xem `getAccountSession()`/`createAccountSessionToken()`). Route API mới `app/api/account/{register,login,logout,me,profile,avatar,orders,cv}`. Trang giao diện `/login`, `/register`, `/account` (3 tab: Sản phẩm đã mua, CV của tôi, Thông tin cá nhân) dưới `app/(site)/`, `AccountProvider` (`src/contexts/AccountContext.tsx`) bọc toàn app trong `app/layout.tsx` cạnh `CartProvider`, `NavBar.tsx` hiển thị "Đăng nhập" hoặc avatar+tên tuỳ trạng thái (gate theo `loading` để tránh flash sai trạng thái).

**Checkout tích hợp**: `app/api/orders/route.ts` + `src/lib/orderConfirm.ts` (webhook/admin xác nhận thanh toán) dùng chung helper mới `src/lib/checkoutAccount.ts` (`resolveCustomerId`/`ensureCvProfileForAccount`/`createOrReuseGuestCvAccount`) — nếu đang đăng nhập, đơn hàng gắn thẳng vào `CustomerAccount.customerId` (không phụ thuộc khách gõ đúng email mỗi lần mua); mua CV lúc đã đăng nhập gắn `CvProfile` thẳng vào tài khoản, KHÔNG tạo tài khoản mới/mật khẩu tạm; guest mua CV vẫn giữ hành vi cũ (tạo/tái dùng tài khoản kèm mật khẩu tạm hiển thị 1 lần qua `downloadToken`).

**Migration production (2 `cv_profiles` hiện có, dữ liệu ít nên rủi ro thấp)**: viết tay `prisma/migration_20260828_customer_accounts.sql` + script Node chạy qua `DIRECT_URL` (theo đúng rule của DB này — KHÔNG dùng `prisma migrate dev/deploy`, xem mục Hạ tầng), copy nguyên `password` hash (cùng định dạng `scryptSync`, không cần reset mật khẩu 2 tài khoản CV cũ). Đã xoá tính năng admin "Cấp/Thu hồi CV profile cho User" (`/admin/users`, route `api/admin/users/[id]/cv-profile`) vì không còn ý nghĩa — CV giờ thuộc `CustomerAccount`, không thuộc `User`.

Đã verify bằng test thật qua `next start` + curl (không phải chỉ đọc code): đăng ký/đăng nhập bằng cả email lẫn SĐT, từ chối đúng khi email/SĐT trùng, đổi mật khẩu, đơn hàng lúc đăng nhập gắn đúng `customerId`, mua CV lúc đăng nhập gắn thẳng tài khoản không tạo trùng, tài khoản khách hàng KHÔNG đăng nhập được vào `/admin/login`. Toàn bộ dữ liệu test đã dọn sạch ngay sau khi verify (DB này dùng chung với production thật — xem cảnh báo mục Hạ tầng).

### 5 template Portfolio mới (2026-08-21)

`Sources/templates/web/Portfolios/` — build song song qua 5 sub-agent, mỗi agent 1 Identity Token riêng:

| Slug | Persona | Identity Token | Font | Nav | Hero | Prefix |
|---|---|---|---|---|---|---|
| `portfolio-nhiep-anh` | Nhiếp ảnh gia cưới | WARM-ARTISAN | Fraunces + DM Sans | Nav-5 | H3 Magazine Grid | `pna-` |
| `portfolio-thiet-ke-do-hoa` | Thiết kế đồ họa (brand/packaging) | ~~BOLD-EDITORIAL~~ (token bị loại, xem ghi chú dưới) | Bricolage Grotesque + Inter (đổi từ Syne) | Nav-8 | H5 Bold Typography | `ptk-` |
| `portfolio-ux-designer` | UX/Product Designer | GLASS-MODERN | Plus Jakarta Sans | Nav-3 | H2 Split 45/55 | `pux-` |
| `portfolio-kien-truc-su` | Kiến trúc sư | ZEN-MINIMAL | Cormorant Garamond + DM Sans | Nav-4 | H4 Centered Minimal | `pkt-` |
| `portfolio-minh-hoa` | Họa sĩ minh họa | RETRO-BOLD | Space Grotesk | Nav-6 | H6 Asymmetric Offset | `pmh-` |

Mỗi site 9 trang: trang chủ (Carousel Hero 4 slide) + `du-an.html` + 2 trang case-study đủ 7 mục (mục G) + `dich-vu.html` (FAQ ≥6 câu mục H + bảng giá ≥3 gói mục I) + `ve-toi.html` + `lien-he.html` + 2 trang pháp lý chỉ ở footer.

**Bug hệ thống phát hiện sau batch, đã fix cả 5 site**: mỗi carousel hero 4 slide dùng riêng `<h1>` cho từng slide → 4 `<h1>` cùng tồn tại trong DOM 1 trang (vi phạm rule 1-h1/trang, hại SEO/accessibility). Nguyên nhân: brief giao cho agent không nói rõ chỉ slide đầu mới là `<h1>`. Fix: giữ `<h1>` cho slide 1, đổi 3 slide còn lại sang `<h2>` (giữ nguyên class CSS). **Rule cho lần build carousel hero tiếp theo: chỉ slide đầu tiên/active mặc định dùng `<h1>`, các slide khác dùng `<h2>`.**

**Bug trùng hue phát hiện qua đối chiếu chéo sau khi cả 5 build xong**: 3/5 site rơi vào cùng nhóm hue đỏ/cam-đỏ (`portfolio-nhiep-anh` rust `#a13d2b`, `portfolio-thiet-ke-do-hoa` crimson `#e8291c`, `portfolio-minh-hoa` cam-đỏ `#e2542b` ban đầu) — do 5 agent chạy song song không thấy lựa chọn màu của nhau. Fix: đổi accent `portfolio-minh-hoa` sang vàng mù tạt `#d9a441` (hoán đổi giá trị 2 biến `--accent`↔`--gold` có sẵn trong file, không đổi tên biến). **Rule cho batch nhiều template cùng lúc: giao sẵn identity token/màu accent cụ thể cho từng agent thay vì để agent tự chọn, và đối chiếu chéo màu giữa các site sau khi build xong** (5 agent song song không thể tự tránh trùng nhau vì không thấy tiến trình của nhau).

`portfolio-thiet-ke-do-hoa` có thêm 1 bug riêng: biến CSS `--ink:#10161f` khai báo nhưng không khớp màu xanh thật sự dùng cho tone "ink" của carousel (`rgba(46,84,171,...)`) — đã sửa giá trị `--ink` thành `#2e54ab` cho khớp đúng những gì hiển thị thật (theo đúng pattern `--forest`/`--mustard` khác trong cùng file, vốn có giá trị khớp chính xác màu glow base của tone tương ứng).

**Phản hồi của chủ dự án sau khi xem `portfolio-thiet-ke-do-hoa` (2026-08-21): font "to và xấu"** — Identity Token `BOLD-EDITORIAL` (Syne weight 800, heading tới 148px, uppercase toàn heading chính) đã **loại khỏi danh sách chọn cho template MỚI trong `template-builder.md`** (còn 11 token). Site đã build đổi font sang Bricolage Grotesque (heading) + Inter (body), giảm size heading lớn nhất (~148px→88px, footer brand ~120px→84px), bỏ uppercase ở heading chính (giữ uppercase ở nhãn nhỏ: eyebrow/nav/label — không đổi). Layout/màu/nav/hero pattern/nội dung giữ nguyên, chỉ đổi typography. Các site cũ dùng BOLD-EDITORIAL (`shop-thoi-trang`, `nha-khoa-tham-my-luxdental`) KHÔNG bị đụng tới — quyết định chỉ áp dụng cho build mới.

**`portfolio-minh-hoa` — WebDeploy đầy đủ (2026-08-22)**: React SPA (website + admin) + PHP API + SQLite theo đúng kiến trúc chuẩn WebDeploy. Extension schema `projects` (12 dự án — 2 có case-study đầy đủ: challenge/process_steps/gallery_images/result_stats/testimonial, 10 card-only; related projects lấy ngẫu nhiên qua `ORDER BY RANDOM()` thay vì lưu cột quan hệ riêng) + `testimonials` + `faqs` + `pricing_plans`. Carousel hero 4 slide encode 2 nút (primary + outline) qua `subtitle` format `"tag||desc||primaryText||primaryLink"` (khác `portfolio-nhiep-anh` chỉ có 1 nút primary cố định) vì mỗi slide có cặp CTA khác nhau trong template gốc. Testimonials giữ nguyên placeholder ngoặc vuông từ template tĩnh (`"[Tên Biên tập viên]"`...) thay vì bịa tên thật, đúng nội dung nguồn.

**`portfolio-ux-designer` — WebDeploy đầy đủ (2026-08-22)**: React SPA (website + admin) + PHP API + SQLite theo đúng kiến trúc chuẩn WebDeploy, 9 trang đầy đủ (trang chủ carousel + `du-an` + 2 case-study + `dich-vu` + `ve-toi` + `lien-he` + 2 trang pháp lý). Extension schema: `projects` (12 dự án — 2 có case-study đầy đủ 7 mục: `industry`/`duration`/`services_provided`/`key_result` cho overview bar, `challenge_intro`+`challenge_details` tách cột trái/phải, `solution_items` format `"nhãn bước|ảnh|tiêu đề|mô tả"` cho 4-step process kèm ảnh minh họa mỗi bước — khác `portfolio-kien-truc-su` không có ảnh trong solution items; related projects tại trang case-study lấy từ `/public/projects` lọc bỏ slug hiện tại, không cột quan hệ riêng) + `testimonials` (dùng chung cho home teaser 3 thẻ đầu + trang Về tôi hscroll đầy đủ, không tách bảng riêng) + `faqs` + `pricing_plans` + `timeline_items`. Hero carousel 4 slide dùng nút phụ (ghost) hardcode theo index trong `HeroSlider.tsx` (không lưu DB) đúng pattern đã dùng ở `portfolio-kien-truc-su`. Do harness không có Task/Agent dispatch tool, bước 8.5 (reviewer + qa-tester) chỉ thực hiện được ở dạng self-check thủ công (PHP syntax, TS build, prepared statements, `Auth::require()`, filter settings nhóm nhạy cảm, PRAGMA FK, BOM, sitemap, `/media/upload`) — cần review độc lập bổ sung sau.

**`portfolio-thiet-ke-do-hoa` — WebDeploy đầy đủ (2026-08-22)**: React SPA (website + admin) + PHP API + SQLite theo đúng kiến trúc chuẩn WebDeploy, 9 trang đầy đủ (trang chủ carousel + `du-an` (12 thẻ) + 2 case-study `moc-coffee`/`nef-app` + `dich-vu` + `ve-toi` + `lien-he` + 2 trang pháp lý). Extension schema: `projects` (12 dự án — chỉ 2 có `has_case_study=1` đúng thực tế template chỉ có 2 trang chi tiết tĩnh, 10 còn lại chỉ card; case-study 7 mục dùng `industry`/`duration`/`services_provided`/`key_result` cho overview bar, `challenge_title`+`challenge_details` — không tách `challenge_intro` riêng vì template gốc cột trái case-study chỉ có eyebrow+h2 không có đoạn văn, `solution_heading`+`solution_items` dạng `"tiêu đề|mô tả"` (không kèm ảnh per-step, chỉ 1 `solution_image` chung cho cả mục) — khác `portfolio-ux-designer` có ảnh riêng từng bước, `gallery_images` dạng `"src|alt"`, `results_items` dạng `"value|suffix|label"`, `cta_title` riêng theo từng project cho CTA band cuối trang case-study) + `testimonials` (5 bản ghi — 1 làm teaser trang chủ, cả 5 hiển thị lại đầy đủ ở trang Về tôi, chấp nhận trùng lặp giống pattern `portfolio-ux-designer`) + `faqs` + `pricing_plans` + `timeline_items` + bảng mới **`tools_skills`** (tên công cụ/mức độ/% thanh tiến trình — riêng cho site này vì template có mục "Công cụ & kỹ năng" dạng hscroll+progress-bar mà 3 site portfolio trước không có). Hero carousel 4 slide encode tone màu (`red`/`mustard`/`ink`/`forest` — quyết định gradient nền + màu swatch qua CSS `data-tone`) vào `subtitle` theo format `"tone||label||desc"`. Font đổi Google Fonts → Bunny Fonts (`bricolage-grotesque` + `inter`) cho đúng rule 17, khác bản template tĩnh gốc dùng trực tiếp Google Fonts CDN. Phát hiện & fix `build.mjs` bị lặp block (dòng "Build admin" chạy 2 lần + block `mkdirSync`/`.gitkeep` lặp 2 lần + dòng log hướng dẫn lặp 2 lần) — bug có sẵn trong `_scaffold/build.mjs`, đã từng gặp ở `portfolio-minh-hoa`/`portfolio-ux-designer`, dọn về đúng 1 lần mỗi block. Do harness không có Task/Agent dispatch tool, bước 8.5 (reviewer + qa-tester) chỉ thực hiện được ở dạng self-check thủ công (PHP syntax, TS build 0 lỗi, prepared statements, `Auth::require()`, filter settings nhóm nhạy cảm khỏi `/public/settings`, PRAGMA FK, BOM, `/media/upload`, `/sitemap.xml` — verify qua PHP built-in server với router mô phỏng `.htaccess` vì `php -S` không tự rewrite phần mở rộng `.xml`) — cần review độc lập bổ sung sau.

**⚠️ Bug phát hiện qua review `portfolio-thiet-ke-do-hoa` (2026-08-22), khả năng ảnh hưởng TOÀN BỘ site build từ scaffold**: `_scaffold/admin/src/components/UnsplashPicker.tsx` gọi `api.post('/unsplash', ...)` để track download, nhưng route đăng ký trong `bootstrap.php` (mọi site) là `POST /unsplash/download` — request 404 âm thầm (bị `.catch(()=>{})` nuốt lỗi), chọn ảnh Unsplash vẫn hoạt động bình thường nhưng KHÔNG track download đúng chuẩn Unsplash API. Đã fix riêng lẻ tại `portfolio-thiet-ke-do-hoa`. **Chưa fix ở `_scaffold/` lẫn các site cũ** — cần quyết định của chủ dự án trước khi sửa hàng loạt (theo rule bulk-update ở `coding-workflow.md`).

### 5 template Cafe mới (2026-08-22)

`Sources/templates/web/Cafes/` — build song song qua 5 agent, mỗi agent được giao cố định Identity Token/font/màu/nav/hero (rút kinh nghiệm từ batch Portfolio: giao sẵn thay vì để agent tự chọn):

| Slug | Persona | Identity Token | Font | Nav | Hero | Accent | Prefix |
|---|---|---|---|---|---|---|---|
| `cafe-rang-xay` | Xưởng rang cà phê đặc sản | WARM-ARTISAN | Fraunces + DM Sans | Nav-5 | H3 Magazine Grid | Caramel `#b3672b` | `crx-` |
| `cafe-den-muon` | Espresso bar đêm muộn (NOX Coffee) | DARK-ENERGY | Syne | Nav-6 | H10 Geometric Split | Neon Cyan `#00d9c0` | `cdm-` |
| `cafe-banh-ngot` | Bánh & cà phê (Rosette Bakery) | SOFT-PASTEL | DM Sans italic | Nav-2 | H9 Product Showcase | Blush Pink `#e1849c` | `cbn-` |
| `cafe-hien-dai` | Cà phê hiện đại tối giản | GEOMETRIC-MODERN | Space Grotesk | Nav-8 | H12 Two-Column Equal | Cobalt Blue `#1d4fd8` | `chd-` |
| `cafe-sach` | Cà phê sách yên tĩnh (Lặng Trang) | ZEN-MINIMAL | Cormorant Garamond + DM Sans | Nav-4 | H4 Centered Minimal | Forest Green `#3f5b45` | `csa-` |

### Bất động sản — agent chuyên biệt `real-estate-template-builder` (mới, 2026-08-22; Loại hình A viết lại 2026-08-23)

Ngách mới của dự án, thư mục `Sources/templates/web/Real-Estate/`. Agent tách riêng từ `template-builder` (đọc `.claude/agents/real-estate-template-builder.md`) — khác biệt cốt lõi: 2 Loại hình site (A — sàn giao dịch/marketplace nhiều tin đăng nhiều khu vực; B — chủ đầu tư/dự án đơn lẻ nhiều loại căn), filter/catalog data-driven bằng JS thật (không mock tĩnh), trang chi tiết thay thế case-study 7 mục bằng cấu trúc riêng (gallery/quick-facts/bản đồ/tính vay/người đăng tin hoặc phòng KD dự án), **không dùng bản đồ tương tác đa điểm** (chỉ Google Maps iframe embed theo tọa độ từng BĐS/dự án, tránh phụ thuộc Leaflet/Mapbox trả phí).

**⚠️ Sửa sai hướng (2026-08-23)**: chủ dự án review batch đầu, xác nhận Loại hình A bị build sai ý — dựng thành "website riêng của 1 agency tự quản lý catalog tin đăng của mình" thay vì mô phỏng đúng **1 SÀN GIAO DỊCH/MARKETPLACE BĐS nhiều người đăng tin** (tham khảo trực tiếp batdongsan.com.vn — nền tảng lớn nhất VN, ~4 triệu người dùng/tháng, ~800.000 tin đăng/tháng, gói tin trả phí VIP Bạc/Vàng/Kim Cương). Đã viết lại toàn bộ Bước A (+ Bước B/G/checklist liên quan) trong `real-estate-template-builder.md` cho Loại hình A: mỗi tin gắn 1 `poster` (10-15 người đăng khác nhau, không quy về "đội ngũ 1 công ty"), field `listingTier` (thường/VIP Bạc/VIP Vàng/VIP Kim Cương) ảnh hưởng thứ tự hiển thị, nav thêm nút "Đăng tin" CTA tách biệt + trang `dang-tin.html` (form nhiều bước UI mockup + bảng 4 gói tin) + trang `tin-tuc.html`/`tin-tuc-chi-tiet.html` bắt buộc, trang giới thiệu đổi thành "giới thiệu nền tảng" thay vì "đội ngũ môi giới agency". **Loại hình B (`green-valley-residence`) không bị ảnh hưởng** — bản chất khác hẳn (1 dự án chủ đầu tư, không phải sàn nhiều tin đăng).

**Định hướng dài hạn đã xác nhận nhưng CHƯA triển khai**: chủ dự án muốn tiến tới xây marketplace THẬT nhiều tài khoản người dùng (mỗi môi giới/chủ nhà tự đăng ký, tự đăng/quản lý tin, trả phí gói VIP) giống batdongsan.com.vn — đây là kiến trúc khác hẳn Gói A (template tĩnh)/Gói B hiện tại (core schema chỉ 2 role `superadmin`/`user` cho nhân sự nội bộ 1 site, không hỗ trợ đăng ký công khai nhiều người bán). Cần 1 kế hoạch kiến trúc riêng (schema mới, auth công khai, thanh toán/duyệt tin) trước khi triển khai — chưa làm, không tự ý mở rộng core schema khi chưa có brief riêng. **2 template BĐS hiện có (`nha-dat-viet`, `green-valley-residence`) CHƯA được retrofit theo bản sửa này** — theo yêu cầu chủ dự án, chỉ agent instructions được cập nhật, quyết định sửa template cũ để sau.

**`green-valley-residence`** (`Real-Estate/green-valley-residence/`) — Loại hình B (dự án chủ đầu tư đơn lẻ), Identity `GLASS-MODERN`, font Plus Jakarta Sans, Nav-3 Dark Floating, Hero H2 Split 45/55 + carousel 4 slide, accent Electric Blue `#4361ee` + Royal Purple `#7209b7`, prefix `gvr-`. Dự án mock: căn hộ cao cấp ven sông Sài Gòn tại Thảo Điền, TP. Thủ Đức, chủ đầu tư "Tập đoàn Lộc Việt Land". 8 trang: `index.html` (carousel hero + overview + tiến độ tóm tắt + 4 loại căn nổi bật data-driven + bento tiện ích + testimonials + FAQ 7 câu) + `ve-chu-dau-tu.html` (nav gộp "Tổng quan dự án" — vị trí/quy mô/tiến độ đầy đủ/chính sách bán hàng/stat-bar chủ đầu tư) + `bang-gia.html` (catalog 10 loại căn, filter thật: loại căn/khoảng giá/diện tích/tầng/hướng/tình trạng, sort, phân trang PER_PAGE=4, URL sync qua `history.replaceState`) + `loai-can-chi-tiet.html` (data-driven qua query param `?loai=slug`, đọc từ `UNIT_TYPES`, fallback căn `sky-terrace-3pn` nếu slug không khớp — gallery mặt bằng+ảnh mẫu, quick-facts bar, bảng thông số, tiến độ thanh toán 7 đợt từ `PROJECT.paymentSchedule`, bản đồ, công cụ tính vay mặc định = giá căn đang xem, "Phòng Kinh doanh dự án" thay cho môi giới cá nhân, form đăng ký, loại căn tương tự round-robin) + `tien-ich.html` + `lien-he.html` + 2 trang pháp lý footer-only. Dữ liệu tập trung `assets/js/units-data.js` (`PROJECT` object + `UNIT_TYPES` 10 bản ghi + helper `formatVND`/`formatFullVND`/`calcMonthlyPayment`/`parseFloorRange`/`getRelatedUnits`) — mọi trang render lại DOM từ mảng này, không hardcode trùng lặp. Toàn bộ ảnh Unsplash (39 photo ID duy nhất dùng xuyên suốt site) đã verify HTTP 200 qua `curl`.

**`nha-dat-viet`** (`Real-Estate/nha-dat-viet/`) — Loại hình A (môi giới/sàn giao dịch tổng hợp), Identity `CLEAN-CORPORATE`, font Outfit (heading+body weight 600), Nav-7 Split Grid (solid trắng blur cố định, không transparent-on-scroll), Hero H1 Full-Screen Overlay + carousel 4 slide (chỉ slide 1 `<h1>`, slide 2-4 `<h2>`), accent Teal `#0f6d82` + Navy `#0a2129` (dark/footer), prefix `ndv-`. Bối cảnh: sàn môi giới tổng hợp TP.HCM, đa dạng loại hình (chung cư/nhà phố/đất nền/biệt thự/shophouse/căn hộ dịch vụ), cả bán lẫn cho thuê, 15 khu vực (Quận 1/3/4/7/8/10/12, Bình Thạnh, Phú Nhuận, Tân Bình, Gò Vấp, Nhà Bè, TP. Thủ Đức, Bình Chánh, Củ Chi). 8 trang: `index.html` (carousel hero + thanh tìm kiếm nổi persistent overlap đáy hero + chip khu vực horizontal-scroll + tabs Nổi bật/Mới đăng/Giá tốt data-driven + stat-bar + feature-icon-row + 4 alternating-strips quy trình + testimonials list-elegant + FAQ 8 câu) + `bat-dong-san.html` (catalog đầy đủ: toolbar 2 hàng — pill Nhu cầu, dropdown checkbox Loại hình/Khu vực, native-select Khoảng giá theo mốc VNĐ đổi động theo Nhu cầu/Phòng ngủ/Diện tích/Sort, dropdown "Thêm bộ lọc" gộp Hướng nhà+Pháp lý+**Tình trạng nội thất** — đủ 3 trường đặc thù VN, active-filter chips, offcanvas mobile đồng bộ state 2 chiều qua `syncControlsFromState()`, phân trang PER_PAGE=12 → 4 trang với 42 tin, URL sync `history.replaceState`) + `chi-tiet-bds.html` (data-driven qua `?slug=`, đủ 9 mục: gallery+lightbox, quick-facts bar, mô tả, đặc điểm nổi bật kèm tình trạng nội thất, bản đồ+tiện ích xung quanh, công cụ tính vay `calcMonthlyPayment()` mặc định 70%/8.5%/20 năm — hoặc "Ước tính chi phí thuê" nếu `listingType=cho-thue`, agent card, form đặt lịch xem nhà, BĐS tương tự round-robin) + `du-an.html` (tuỳ chọn — đã thêm để đủ 5 nav item, giới thiệu dự án agency phân phối, card thông tin không cần link riêng) + `ve-chung-toi.html` (story + stat-bar + đội ngũ 6 agent + "Thương vụ đã môi giới thành công" — mục phụ được phép cho Loại hình A) + `lien-he.html` + 2 trang pháp lý footer-only. Dữ liệu `assets/js/properties-data.js`: mảng `PROPERTIES` 42 tin đăng (generate từ `RAW_LISTINGS` qua `.map()` — slug tự động qua `slugify()`, ảnh qua `pickImages(id,6)` cycle từ pool 56 ảnh, toạ độ jitter theo index để không trùng pin cùng quận), 6 `AGENTS`, field đủ VN-specific (`direction`/`legalStatus`/`furnishing`). Toàn bộ ảnh (56 property pool + 13 hero banner + 24 portrait, dùng 62 unique) đã verify HTTP 200 qua `curl` theo batch.

**`rao-nha`** (`Real-Estate/rao-nha/`) — Loại hình A (SÀN GIAO DỊCH/MARKETPLACE, build đúng theo Bước A đã sửa 2026-08-23 — bản tham chiếu đầu tiên cho mô hình marketplace, KHÔNG phải "website 1 agency"), Identity `FRESH-MINIMAL`, font Plus Jakarta Sans, Nav-8 Underline-Active (solid `var(--bg)`, không border/shadow, chỉ gạch chân link active), Hero carousel 4 slide kiểu H3 Magazine Grid (text trái 55% + ảnh phải 2x2/lưới bất đối xứng) + thanh tìm kiếm nổi persistent overlap đáy hero (2 tab Mua bán/Cho thuê đổi động options Khoảng giá), accent Emerald Green `#1e8a5c` (hue khác hẳn Teal của `nha-dat-viet` và Blue/Purple của `green-valley-residence`), prefix `rn-`. Bối cảnh: sàn môi giới nhiều người đăng trên 3 thành phố (Hà Nội/TP.HCM/Đà Nẵng, 15 khu vực), đa dạng loại hình (chung cư/nhà phố/đất nền/biệt thự/shophouse/căn hộ dịch vụ). 10 trang: `index.html` (carousel hero + search overlay + area-chip horizontal-scroll + khối "Tin VIP nổi bật" TÁCH RIÊNG khối "Mới đăng" + stat-bar quy mô nền tảng + feature-icon-row quy trình 4 bước + testimonials list-elegant từ NGƯỜI DÙNG nền tảng (không phải đội ngũ agency) + tin tức mới nhất + FAQ 8 câu) + `bat-dong-san.html` (catalog: toolbar pill Nhu cầu + dropdown checkbox Loại hình/Khu vực (group theo 3 thành phố) + select Khoảng giá (đổi theo Nhu cầu)/Phòng ngủ/Diện tích/Sort + dropdown "Thêm bộ lọc" (Hướng nhà+Pháp lý+Tình trạng nội thất), offcanvas mobile đầy đủ control kể cả Sort, active-filter chips, PER_PAGE=12 → 4 trang với 44 tin, URL sync `history.replaceState`, sort LUÔN ưu tiên `listingTier` trước rồi mới áp dụng tiêu chí phụ) + `chi-tiet-bds.html` (data-driven `?slug=`, đủ 9 mục đúng thứ tự — có `<h1>` tiêu đề tin data-driven riêng biệt breadcrumb, mục 7 đổi tên "Người đăng tin" hiển thị `poster.role` qua `ROLE_LABELS`, nút Gọi/Zalo + "Xem tất cả tin của người này" trỏ `bat-dong-san.html?nguoiDang=slug`, công cụ tính vay 70%/8.5%/20 năm mặc định hoặc "Ước tính chi phí thuê" nếu `listingType=cho-thue`) + `dang-tin.html` (**BẮT BUỘC mới** — stepper 4 bước UI mockup: Nhu cầu+Loại hình+Khu vực → Chi tiết → Upload ảnh mock dropzone → bảng 4 gói tin Thường/VIP Bạc 99k/VIP Vàng 299k/VIP Kim Cương 699k mỗi 15 ngày kèm quyền lợi, nút "Đăng tin" cuối cùng hiện thông báo demo không lưu dữ liệu thật) + `tin-tuc.html` + `tin-tuc-chi-tiet.html` (**BẮT BUỘC mới** — 8 bài viết thật 250-500 từ mỗi bài, data-driven qua mảng `ARTICLES`, không lorem ipsum) + `ve-chung-toi.html` (giới thiệu NỀN TẢNG — sứ mệnh/cách hoạt động/cam kết an toàn/stat-bar quy mô + section phụ "Câu chuyện thành công từ người dùng nền tảng") + `lien-he.html` + 2 trang pháp lý footer-only (nội dung điều khoản/bảo mật viết riêng cho mô hình sàn trung gian, không phải 1 agency chịu trách nhiệm giao dịch). Dữ liệu `assets/js/properties-data.js`: mảng `PROPERTIES` 44 tin sinh bằng công thức xác định (không random) từ index — `specsFor()`/`calcRawPrice()` (bảng giá/m² riêng theo loại hình × thành phố) → giá/diện tích/phòng thực tế và nhất quán, `tierFor(i)` phân bổ đúng tỷ lệ khan hiếm (30 thường/8 VIP Bạc/4 VIP Vàng/2 VIP Kim Cương), 14 `POSTERS` (tên người thật đa dạng, 3 role `moi-gioi-tu-do`/`chinh-chu`/`cong-ty-moi-gioi`, KHÔNG quy về 1 công ty) gán round-robin qua từng tin, field `districtSlug`/`posterSlug` riêng phục vụ filter theo khu vực/người đăng, 8 `ARTICLES` nội dung thật. Toàn bộ ảnh Unsplash (41 property/interior + 22 portrait + 14 banner, dùng theo pool cycle) đã verify HTTP 200 qua `curl` theo batch. QA: syntax-check `node --check` cả 2 file JS, chạy generator qua Node xác nhận đúng số lượng/tier/slug unique, và smoke-test Playwright headless (chromium) qua toàn bộ 10 trang — 0 console error, filter/sort/pagination/empty-state/URL-sync/gallery-lightbox/mortgage-calculator/FAQ-accordion/mobile-hamburger/dang-tin-stepper đều hoạt động đúng.

**`rao-nha` — bổ sung UI mockup đăng nhập/quản lý tin/ví credit/thời hạn tin (2026-08-23)**: chủ dự án phản hồi bản build ban đầu còn thiếu phần đăng nhập → đăng tin → quản lý tin đăng → nạp VIP/nạp credit → thời hạn tin. Được hỏi rõ và **chủ dự án xác nhận hướng dài hạn là xây marketplace thật nhiều tài khoản** (ghi ở block trên), nhưng cho task này **chỉ chọn thêm UI mockup tĩnh** (không backend thật) — khớp bản chất Gói A. Đã thêm 4 trang mới: `dang-nhap.html`, `dang-ky.html` (form thật về UI, submit chỉ set mock account vào `localStorage` rồi redirect, không xác thực thật), `tai-khoan.html` (dashboard 3 tab: Tin đăng của tôi — danh sách tin kèm badge thời hạn còn/hết hạn tính từ `postedDate`+`TIER_DURATION_DAYS`, nút Gia hạn/Nâng cấp VIP/Xoá tin; Ví & Gói VIP — số dư + lịch sử giao dịch; Thông tin tài khoản), `nap-tien.html` (chọn mệnh giá hoặc nhập tự do, QR chuyển khoản mock SVG, nút xác nhận cộng credit ngay lập tức — có ghi chú rõ đây là demo, bản thật cần admin xác nhận). Toàn bộ state (tài khoản/tin đăng/ví/giao dịch) lưu trong `localStorage` key `rn_mock_account`, đọc/ghi qua các hàm `rn*` mới trong `main.js` (`rnGetAccount`/`rnSetAccount`/`rnDefaultAccount`/`rnExpiryInfo`/`rnRenderAccountNav`...) — nav mọi trang tự chèn slot "Đăng nhập" hoặc "👤 Tên · số dư" bằng JS (không sửa tay 12 file HTML nav). `TIER_DURATION_DAYS`/`TIER_PRICE` dùng chung cho gia hạn/nâng cấp, khớp đúng số liệu đã hiển thị ở bảng gói tin `dang-tin.html` (thường 30 ngày miễn phí, VIP Bạc/Vàng/Kim Cương mỗi 15 ngày giá 99k/299k/699k). Trang `chi-tiet-bds.html` (public) cũng hiển thị thêm dòng "Đăng ngày... · Còn hiệu lực đến..." dùng chung `rnExpiryInfo()`. Đã verify: `node --check` main.js pass, brace/div/section/form tag-balance khớp trên cả 4 trang mới, không id trùng lặp, mọi id JS tham chiếu đều có trong HTML tương ứng, logic tính hạn dùng ngày mốc `RN_TODAY` (2026-08-23, khớp `properties-data.js`) cho ra đúng 1 tin sắp hết hạn/1 tin đã hết hạn/2 tin còn hạn trong dữ liệu mock mặc định.

**`rao-nha` — WebDeploy đầy đủ, kiến trúc dual-auth (2026-08-23)**: sau khi chủ dự án yêu cầu 4 trang đăng nhập/quản lý tin/ví (vừa thêm UI mockup ở block trên) phải "chạy trơn chu" trong bản site thật — đã build `Sources/WebDeploy/rao-nha/` với **2 hệ thống auth hoàn toàn tách biệt**: `Auth.php` (admin sysadmin, session `RaoNha`, `$_SESSION['user_id']`, thư mục `sessions/`) và `AccountAuth.php` mới (người đăng tin công khai tự đăng ký, session `RaoNhaAcc`, `$_SESSION['account_id']`, thư mục `sessions_acc/`) — không dùng chung bảng/session, verify bằng test thật 2 cookie jar khác nhau không chồng lấn quyền. Schema mở rộng: `accounts` (role chinh-chu/moi-gioi-tu-do/cong-ty-moi-gioi, `credit_balance` có `CHECK(>=0)`), `wallet_transactions` (nap/tru, method sepay/chuyen-khoan-thu-cong/he-thong, status pending/completed/rejected), `listings` (account_id FK, status pending/approved/rejected, tier, posted_at/expires_at), `listing_packages`, `faqs`, `articles`, `testimonials`. Seed data port 1:1 logic generator JS của bản tĩnh sang PHP (14 accounts mật khẩu `123456`, 44 listings đúng tier/giá/diện tích/round-robin poster). Không có `type` scaffolder sẵn cho real-estate — build dùng `company` làm base trung lập rồi viết lại gần như toàn bộ.

Luồng tiền thật: nạp credit qua SePay (webhook verify secret qua `hash_equals`) hoặc chuyển khoản thủ công (`status='pending'` → admin duyệt trong `/wallet-transactions`); đăng tin trả phí trừ `credit_balance` ngay, tin luôn vào trạng thái `pending` chờ admin duyệt (`/listings/:id/approve`) mới tính `posted_at`/`expires_at` và hiển thị công khai; gia hạn/nâng cấp gói cũng trừ ví. Mọi thao tác sửa/xoá/gia hạn/nâng cấp trên `listings` bắt buộc `WHERE account_id = ?` theo session — không tin cậy id do client gửi.

**Bug phát hiện & tự fix bởi agent build**: `Database.php::seedSettings()` insert nhầm cột `"group"` thay vì `grp` thật, kéo theo `PublicController::settings()` filter cũng so sánh sai tên cột khiến WHERE luôn đúng — **rò rỉ `sepay_webhook_secret` qua endpoint public** (đúng đúng lỗi nghiêm trọng nhất lịch sử dự án, tái diễn ở 1 site mới) — đã tự phát hiện và fix, verify lại bằng review độc lập. Cũng tự fix: `bootstrap.php` gọi `Auth::start()` sớm làm đè session `AccountAuth` (PHP chỉ có 1 session active/tên session mỗi request) — bỏ gọi eager, để mỗi class tự lazy-start theo đúng session name riêng; comment `--` trong `schema.sql` chứa dấu `;` làm vỡ `explode(';')` khi migrate, làm rớt mất `wallet_transactions` và các bảng sau — sửa regex strip comment.

**Review độc lập sau build (reviewer + qa-tester thật, dispatch bởi orchestrator)**: 0 P0 — auth isolation/IDOR ownership check (`WHERE id=? AND account_id=?` mọi renew/upgrade/delete)/settings-leak filter đều đúng khi review lại. 4 P1 tự fix thêm bởi orchestrator sau review: (1) race condition TOCTOU khi trừ `credit_balance` ở `store()`/`renew()`/`upgrade()` — sửa thành `UPDATE ... WHERE credit_balance >= ?` + check `rowCount()` (helper mới `Database::executeAffected()`) thay vì SELECT-rồi-so-sánh-rồi-UPDATE riêng lẻ, cộng `CHECK(credit_balance>=0)` phòng vệ kép; áp dụng luôn cho `WalletController::approve()`/`sepayWebhook()` để chống double-credit nếu gọi trùng; (2) `check-hash.php` — đã có sẵn pattern chuẩn dự án (`.htaccess` block + README nhắc xoá sau deploy), không cần sửa thêm; (3) `UploadController` cho phép SVG/icon MIME ở cả route public — tách allowlist riêng `ALLOWED_PUBLIC` (bỏ SVG/icon) cho `/public/upload` vì ảnh tin đăng do người dùng công khai tải lên không có lý do hợp lệ là SVG (rủi ro XSS lưu trữ); (4) thư mục session (`database/sessions*/`) nằm trong docroot chỉ được `.htaccess` gốc chặn theo pattern `api/database/` — file session không có extension nên có thể lọt qua rule chặn theo extension ở 1 số cấu hình host — `Auth.php`/`AccountAuth.php` giờ tự ghi `.htaccess` (`Deny from all`) vào thư mục session ngay khi tạo. Toàn bộ 4 fix đã verify lại bằng live test qua PHP built-in server (login, tạo tin thiếu/đủ số dư, renew khi không đủ tiền, IDOR cross-account, SVG bị từ chối, settings không rò rỉ) — không có side-effect nào khi từ chối giao dịch (không tạo tin mồ côi, không trừ ví sai). QA-tester phát hiện 1 FAIL thật (label/input thiếu `htmlFor` gần như toàn bộ form ở `website/src/pages/` — cùng bug pattern đã gặp ở `portfolio-kien-truc-su`) — đã fix bằng agent riêng, verify lại `npm run build` 0 lỗi.

Mỗi site cafe 7 trang: `index.html` (Carousel Hero 4 slide, chỉ slide 1 dùng `<h1>`, slide 2-4 dùng `<h2>` — làm đúng ngay từ đầu, không lặp lại bug batch Portfolio) + `menu.html` + `khong-gian.html` + `gioi-thieu.html` + `lien-he.html` + 2 trang pháp lý chỉ ở footer (`chinh-sach-bao-mat.html`, `dieu-khoan.html`). FAQ accordion ≥6 câu (mục H, bắt buộc mọi ngành không ngoại lệ) đặt trên `index.html` hoặc `gioi-thieu.html` — mục G (case-study) và mục I (bảng giá) bỏ qua vì cafe không phải ngành dự án/gói dịch vụ phân tầng. Đối chiếu chéo sau batch: 5 hue hoàn toàn khác nhau (cam-caramel/cyan/hồng/xanh dương/xanh lá), không trùng token/font/nav/hero giữa 5 site. `cafe-rang-xay` (`#b3672b`) và `cafe-thoi-gian` cũ (`#78350f`, không thuộc hệ Identity Token) cùng nhóm hue nâu/cam nhưng khác biệt rõ độ sáng/bão hòa + toàn bộ font/nav/hero/component — đủ 6 điểm phân biệt theo rule, chấp nhận được.

### 5 template Shop mới (batch 2026-08-29)

`Sources/templates/web/Shops/` — build song song qua 5 agent `shop-template-builder`, mỗi agent được giao cố định Identity Token (biến thể)/màu/prefix/Homepage Layout Mode (rút kinh nghiệm từ batch Portfolio/Cafe: giao sẵn thay vì để agent tự chọn) vì cả 12 Identity Token đã dùng ít nhất 1 lần cho ngách shop trước batch này — cả 5 site đều là **biến thể màu** của token đã dùng, không có token nào hoàn toàn mới.

| Slug | Ngách | Token (biến thể) | Accent | Font | Nav | Prefix | Mode |
|---|---|---|---|---|---|---|---|
| `shop-noi-that` | Nội thất | ZEN-MINIMAL | Walnut Brown `#8b5e3c` | Newsreader + Inter | Nav-2 Always Solid Light | `nt-` | A |
| `shop-trang-suc` | Trang sức | LUXE-DARK (biến thể 3) | Amethyst `#7c5ba6` | Marcellus + Work Sans | Nav-4 Minimal Top Line | `tr-` | B |
| `shop-thu-cung` | Thú cưng | GEOMETRIC-MODERN | Coral `#ff6b5b` | Unbounded + Lexend | Nav-6 Full-Width Dark Bar | `tc-` | A |
| `shop-dong-ho` | Đồng hồ | GLASS-MODERN | Deep Teal `#0d7377` | Plus Jakarta Sans | Nav-3 Dark Floating | `dh-` | B |
| `shop-ruou-vang` | Rượu vang | RETRO-BOLD | Burgundy `#722f37` | Big Shoulders Display + Work Sans | Nav-4 biến thể dark | `rv-` | A |

Mỗi site 9 trang theo đúng cấu trúc Mode A/B của `shop-template-builder.md` (Mode A: trang chủ = catalog, thêm `bo-suu-tap.html`+`khuyen-mai.html`; Mode B: trang chủ chia section chủ đề + `san-pham.html` catalog đầy đủ riêng). Toàn bộ ảnh Unsplash mỗi site đã verify HTTP 200 qua `curl` trước khi đưa vào code, 0 path `assets/img/` local, mảng `PRODUCTS` 42-48 sản phẩm/site đủ ≥3 trang phân trang, filter/sort áp dụng tức thì không nút "Áp dụng" đúng rule cốt lõi của agent. `shop-dong-ho` verify thêm bằng Playwright thật (bắt và fix 2 bug CSS responsive: hamburger ẩn dưới 992px, toolbar đè lên nav floating); 4 site còn lại verify tĩnh (tag-balance, `node --check`, đối chiếu link/ảnh/id) vì môi trường build không có Playwright.

**Đối chiếu chéo sau batch (orchestrator, đúng bài học rút ra từ batch Portfolio/Cafe)**:
- **Trùng Nav thật giữa 2 site cùng batch**: `shop-trang-suc` và `shop-ruou-vang` đều dùng pattern **Nav-4 Minimal Top Line** — `shop-trang-suc` ban đầu định dùng Nav-3 nhưng tự đổi sang Nav-4 khi phát hiện `shop-dong-ho` (chạy song song) cũng được giao Nav-3, mà không biết `shop-ruou-vang` (cũng chạy song song) độc lập được giao sẵn Nav-4 — 2 agent chạy song song không thấy lựa chọn cuối của nhau. Thực thi khác nhau (light+viền 3px vs dark-variant+viền mustard 4px) và toàn bộ token/màu/font/hero/mode khác biệt hoàn toàn, nhưng đây là trùng lặp thật ở cấp component pattern, **chưa fix — cần chủ dự án xác nhận có đáng để sửa lại 1 trong 2 site hay chấp nhận** (khác 2 trường hợp hue-similarity bên dưới vốn đã đủ khác biệt qua nhiều trục khác).
- **2 cảnh báo hue-gần nhưng đủ khác biệt, chấp nhận được**: `shop-thu-cung` Coral `#ff6b5b` cùng nhóm hue đỏ-cam với `shop-the-thao` Signal Orange `#ff4d29` (site cũ, ngoài batch này) — độ bão hòa/sáng khác rõ + toàn bộ nền sáng-chủ-đạo vs nền tối hoàn toàn + font/nav/hero khác hẳn. `shop-dong-ho` Deep Teal `#0d7377` khá gần hue với `shop-may-anh` `#0d8a82` (site cũ, ngoài batch này) — glassmorphism/frosted-blur vs sharp-edged geometric grid + font/nav/hero/layout khác hẳn.
- Không phát hiện trùng lặp CSS prefix (21 prefix hiện tại đều unique) hay trùng Identity Token gốc (mọi site đều là biến thể màu rõ ràng của token đã dùng).

**Chưa có bản WebDeploy** cho cả 5 site (chỉ Gói A tĩnh theo yêu cầu task này).

**Review độc lập + fix toàn bộ bug (2026-08-30)**: dispatch 5 agent `reviewer` song song, mỗi agent 1 site. Tổng kết: 2 P0, 9 P1, nhiều P2 — tất cả P0/P1 đã fix, verify lại bằng `node --check` trên toàn bộ inline script sau khi sửa.

- **[P0] `shop-thu-cung`**: nút "Xóa tất cả" (active-filter chips) không bao giờ gắn được event listener — `insertAdjacentHTML(...) && addEventListener(...)` dùng `&&` sau lệnh luôn trả `undefined`, vế phải không bao giờ chạy. Fix: tách 2 câu lệnh riêng.
- **[P0] `shop-ruou-vang`**: `#rvCartWrap` dùng class Bootstrap `.row` (`display:flex` ở author stylesheet) nên thuộc tính `[hidden]` (chỉ có hiệu lực ở UA stylesheet, thua mọi rule tác giả bất kể specificity) bị đè mất — giỏ hàng trống vẫn hiện khối 2 cột + thông báo trống cùng lúc cho MỌI khách ghé lần đầu (100% trường hợp vì localStorage luôn rỗng lúc đầu). Fix: thêm `#rvCartWrap[hidden]{display:none}` tường minh, đúng pattern đã áp dụng cho 4 phần tử khác trong cùng file.
- **[P0 — phát hiện thêm bởi orchestrator, KHÔNG có trong báo cáo reviewer, tồn tại ở CẢ 5 SITE] Reflected XSS qua query string**: mọi site đều đọc `state.search`/`state.brand`/tương đương thẳng từ `?q=`/`?brand=...` (không validate) rồi nội suy chưa escape vào `innerHTML` khi render active-filter chip (`chipsRow.innerHTML = ...${c.label}...`) — link kiểu `index.html?q=<img src=x onerror=alert(1)>` chạy được script ngay khi nạn nhân bấm vào. Ở `shop-ruou-vang` còn có thêm biến thể tấn công qua breakout attribute (`data-remove='${JSON.stringify(...)}'` — giá trị chứa dấu `'` phá vỡ attribute, chèn `onXXX=` handler mới). Đây là bug hệ thống của cách `shop-template-builder` sinh code active-filter-chips, không phải lỗi riêng lẻ từng site — 4/5 agent reviewer độc lập (trừ agent review `shop-noi-that`) đều bỏ sót vì không kiểm tra theo hướng "URL param → chưa validate → innerHTML". Fix đồng loạt cả 5 site: thêm hàm `escapeHtml()` riêng mỗi file (prefix theo site: `escapeHtml`/`tcEscapeHtml`/`dhEscapeHtml`/`rvEscapeHtml`), áp dụng cho mọi label/value trước khi nội suy vào `innerHTML` hoặc thuộc tính HTML; `shop-noi-that` còn được validate thêm ở `readStateFromURL()` (category/material/color/room/collection phải khớp 1 slug hợp lệ, không gán thẳng chuỗi thô).
- **[P1] `shop-noi-that`**: điểm đánh giá lớn `#pdRatingBig` ở trang chi tiết sản phẩm hardcode tĩnh "4.6", không đồng bộ theo `product.rating` thực — mọi sản phẩm hiển thị cùng 1 số. Fix: gán động trong hàm render product-detail. Cũng fix page/price không được validate khi đọc từ URL (`?page=0`/`?page=-3` → index âm; `?price=abc` → NaN vô hiệu hoá bộ lọc giá âm thầm).
- **[P1] `shop-trang-suc`**: ô tìm kiếm trong nav không được reset khi bấm "Xóa tất cả bộ lọc"/gỡ chip từ khóa — filter đã sạch nhưng nếu mở lại panel tìm kiếm và Enter (không gõ gì mới) thì từ khóa cũ tự áp lại. Fix: reset `#navSearchInput` trong cả 2 điểm xoá. Cũng fix câu FAQ nêu sai giá thấp nhất (320.000₫ ghi nhầm, thực tế 290.000₫).
- **[P1×2] `shop-dong-ho`**: (1) filter chip theo phong cách ở 2 khối trang chủ ("BST Nam"/"BST Nữ") luôn báo rỗng cho 1-2/3 chip vì pool sản phẩm bị cắt còn 8 item TRƯỚC khi lọc theo style/search — sản phẩm hợp lệ có thật trong catalog vẫn không hiện ra. Fix: lọc theo style/search trước, cắt limit sau cùng. (2) `themeLabel` (tiêu đề/breadcrumb khi vào từ link chủ đề) không được reset khi bấm "Xóa tất cả bộ lọc" hoặc gỡ chip "Chỉ phiên bản giới hạn" — tiêu đề cũ ("Bộ sưu tập Nam"...) vẫn đứng yên dù lưới đã hiện lại đủ 44 sản phẩm. Fix: reset `themeLabel = null` ở cả 2 điểm xoá. Tiện thể thêm chip riêng cho `limitedOnly` (trước đây filter có tác dụng nhưng không hiện chip/không đếm vào badge số lượng filter — không có cách gỡ trừ mở offcanvas mobile) và sửa giá sai trên hero slide "BST Nam" (1.290.000₫ ghi nhầm giá của 1 sản phẩm unisex, giá thật thấp nhất của danh mục nam là 2.200.000₫).
- **[P1×3] `shop-ruou-vang`**: (1) badge giảm giá hardcode "-15%" cho MỌI sản phẩm sale bất kể % thật — khớp tình cờ ở dữ liệu mock hiện tại (đều đúng 15%) nhưng vỡ ngay khi khách hàng (Gói A, tự sửa `products-data.js`) đổi giá 1 sản phẩm. Fix: tính động theo công thức đã dùng đúng ở `khuyen-mai.html`. (2) sản phẩm `stock:false` không bị chặn thêm giỏ hàng ở cả trang danh sách lẫn trang chi tiết (chưa lộ ra vì data mock 100% `stock:true`). Fix: disable nút thêm giỏ + hiện badge "Hết hàng" khi hết hàng. (3) `<label>Giá tối đa</label>` không gắn `for=` với input range tương ứng — thêm `for="rvPriceRange"`.
- **P2 không fix (chấp nhận được, có lý do)**: `href="#"` cho social icon chưa cấu hình (đúng convention chung toàn dự án cho link chưa có tài khoản thật, xác nhận qua đối chiếu nhiều site khác); fallback câm lặng về `PRODUCTS[0]` khi slug không khớp ở `shop-trang-suc`; vài dead code nhỏ (`onRemove` param không dùng, observer riêng lẻ cho mỗi counter thay vì dùng chung).

**[P0 riêng, phát hiện qua báo cáo người dùng 2026-08-30] `shop-noi-that` — ảnh sản phẩm sai hoàn toàn chủ đề trên diện rộng (37/44 sản phẩm)**: người dùng báo "vỡ giao diện" khi xem trang chủ — hoá ra không phải bug CSS/layout mà là ảnh Unsplash gán cho sản phẩm hoàn toàn không liên quan (vd ảnh cái đồng hồ đeo tay cho "Giường tầng trẻ em", ảnh hành lang văn phòng có tủ lạnh cho "Sofa 2 chỗ nhung", ảnh bàn đầu giường cho "Bàn ăn gỗ sồi 6 ghế"). **Nguyên nhân gốc: bước verify ảnh lúc build chỉ check HTTP 200 (ảnh load được) chứ KHÔNG kiểm tra nội dung ảnh có đúng chủ đề sản phẩm không** — lỗ hổng quy trình này áp dụng cho MỌI site build bởi `shop-template-builder`/`template-builder` từ trước tới nay, không riêng site này (chưa rà soát lại các site khác, xem việc cần làm bên dưới). Đã fix: dispatch agent audit lại toàn bộ 44 sản phẩm + banner bộ sưu tập + ảnh trang Giới thiệu bằng cách tải thumbnail và **xem trực tiếp từng ảnh** (Read tool) đối chiếu tên sản phẩm trước khi quyết định giữ/thay — thay đúng 37/44 ảnh sản phẩm sai hoàn toàn. Orchestrator tự phúc tra lại bằng Playwright screenshot sau khi agent báo xong, phát hiện thêm 1 sai sót agent bỏ lọt (`id 41` "Rèm cửa vải lanh" — agent tự đánh giá "đã khớp" nhưng ảnh thực tế là phòng khách có sofa, rèm cửa chỉ là chi tiết phụ mờ nhạt ở nền) — tự tìm và thay ảnh đúng (cận cảnh vải lanh màu be, khớp cả `color:'be'` của sản phẩm) qua Unsplash search thật, không đoán ID. **Việc cần làm tiếp (chưa làm, cần xác nhận trước khi bulk-update)**: rà soát lại toàn bộ ~60 template khác trong dự án (không riêng ngách shop) theo đúng phương pháp "tải thumbnail + xem trực tiếp" này — vì lỗ hổng quy trình verify chỉ-check-HTTP-200 là hệ thống, không phải cá biệt 1 site.

### Hệ thống tài khoản khách hàng (`CustomerAccount`) + review bảo mật toàn hệ thống (2026-08-28)

`Sources/system` — model `CustomerAccount` (bảng `customer_accounts`) tách biệt hoàn toàn khỏi bảng admin `User`: đăng ký/đăng nhập công khai bằng email HOẶC SĐT (`email`/`phone` đều `@unique` — tự động đúng nghĩa "1 SĐT chỉ gắn 1 email"), session riêng `wd_account_session` (payload `{id,email,phone}`, không có `role`) qua `getAccountSession()`/`createAccountSessionToken()` trong `src/lib/auth.ts` — cùng pattern HMAC-SHA256 với session admin `wd_session` nhưng cookie/secret-payload tách biệt. `CvProfile.accountId` (trước là `userId` trỏ bảng `User`) FK sang `CustomerAccount` — CV Manager, checkout, và trang `/account` (dashboard mua hàng/CV/hồ sơ/đổi mật khẩu+avatar) đều dùng chung 1 hệ tài khoản này. API: `app/api/account/{register,login,logout,me,profile,avatar,orders,cv}`. Checkout (`app/api/orders/route.ts`) đọc `getAccountSession()` — có đăng nhập thì gắn `customerId` thẳng vào tài khoản (không match qua email), chưa đăng nhập thì giữ hành vi guest-checkout cũ (tự tạo `CustomerAccount` kèm mật khẩu tạm cho đơn mua CV, email qua `sendCvCredentialsEmail()`).

**Lỗ hổng có sẵn phát hiện & vá trong lúc khảo sát**: `POST /api/auth/login` (đăng nhập admin) trước đây không kiểm tra `role` — bất kỳ row nào trong bảng `User` (kể cả role `user`) đều lấy được session admin thật. Đã vá: `role !== 'superadmin'` → 403 ngay sau khi verify password. Hệ quả: kể từ nay **không tài khoản nào ngoài `role='superadmin'` đăng nhập được `/admin`** — trang `/admin/users` đã bỏ tuỳ chọn tạo mới role `user` (luôn tạo `superadmin`) và bỏ nút "Hạ cấp" (hạ cấp 1 superadmin xuống `user` nay tương đương khoá tài khoản vĩnh viễn — dùng nút Xóa thay vì hạ cấp); nút "Nâng cấp" vẫn giữ để dọn nợ các row `role='user'` tạo từ trước fix.

**Bản chất `middleware.ts` ở Next.js 16 đã đổi tên thành `proxy.ts`** (2 file cùng tồn tại làm build fail thẳng — "Both middleware file and proxy file are detected") — file `Sources/system/proxy.ts` (export `proxy()`, alias `middleware`) đã tồn tại từ trước và tự verify chữ ký token qua Web Crypto API (`crypto.subtle`, không dùng Node `crypto` vì proxy chạy Edge runtime) cho mọi request `/admin/*` + `/api/admin/*`, trừ `/admin/login` và `/api/auth/*`. Review lần này phát hiện `proxy.ts` gốc chỉ verify "token còn hợp lệ" mà KHÔNG kiểm tra `payload.role` — một session `role='user'` ký hợp lệ (chưa hết hạn 7 ngày) vẫn lọt qua được lớp proxy này dù không có quyền, dữ liệu thật vẫn rò rỉ qua các trang Server Component gọi thẳng Prisma. Đã sửa `verifyTokenEdge()` trả về payload thay vì boolean, thêm check `payload.role !== 'superadmin'` → redirect/401. Đã verify sống qua `next start` + `curl`: không cookie → chặn cả trang lẫn API; cookie ký hợp lệ nhưng `role:'user'` (giả lập bằng HMAC cùng `SESSION_SECRET`) → vẫn bị chặn cả hai.

**Loạt fix đồng bộ khác cùng đợt review** (dispatch 3 agent `reviewer` song song: Auth/Account, Checkout/Payments, Admin API):
- **42 route `app/api/admin/**`** trước đó chỉ check `if (!session)` (bất kỳ ai đăng nhập, không riêng superadmin) — bulk-patch đồng loạt thành `if (!session || session.role !== 'superadmin')`. `app/api/admin/help/articles` (+`[id]`) trước đó **không có bất kỳ check nào** (public CRUD hoàn toàn) — đã thêm `requireAdmin()` theo đúng pattern `help/categories`.
- `app/api/admin/unsplash` POST — SSRF: nhận `downloadLocation` tuỳ ý từ client rồi fetch kèm Access Key thật. Đã thêm allowlist bắt buộc `protocol==='https:' && hostname==='api.unsplash.com'`.
- `Order.downloadToken` từng lưu literal `'EXISTING_USER'` cho mọi đơn CV mà buyer đã có tài khoản — cột có `@unique` nên đơn thứ 2 trở đi vỡ `P2002`, rollback cả transaction (kể cả trong webhook Sepay khi tiền thật đã về). Đã thêm cột `Order.newCvAccount Boolean?`, đổi sang lưu `credentialToken: null` (NULL không đụng unique) + cờ boolean riêng — migrate DB thủ công qua `DIRECT_URL` (không dùng `prisma migrate`, xem mục Hạ tầng).
- Discount code (`used_count`) và `confirmOrderPayment()` (`paidAt`) đều có race condition TOCTOU (check-rồi-update tách rời) — sửa thành atomic: `consumeDiscountCode()` dùng raw SQL `UPDATE ... WHERE used_count < max_uses RETURNING id`, `confirmOrderPayment()` dùng `updateMany({where:{paidAt:null}})` + kiểm `count===0` làm guard trùng lặp.
- `app/api/admin/orders/[id]/confirm-payment` (xác nhận thanh toán thủ công — thao tác tài chính nhạy cảm) trước đó chỉ check có session, không check role — đã thêm `role!=='superadmin'`.
- `CheckoutClient.tsx` — early-return `if (!slug) return <CartCheckoutClient/>` từng nằm TRƯỚC một loạt `useState`/`useEffect` (vi phạm Rules of Hooks, crash khi giỏ hàng multi-item) — dời xuống sau toàn bộ hook.
- `generateOrderCode()` từng dùng `Date.now()+Math.random()` (~46,656 tổ hợp, endpoint `/api/orders/[code]/status` không auth dựa hẳn vào entropy mã đơn) — đổi sang `crypto.randomBytes` (~62 bit), vẫn khớp regex nhận diện mã đơn của webhook Sepay.
- `src/lib/email.ts` — tên/email khách hàng chèn thẳng vào HTML email không escape (HTML injection nếu khách đặt tên kiểu `<img onerror=...>`) — thêm `escapeHtml()` áp dụng cho mọi giá trị do khách nhập trước khi nội suy vào template email.
- `app/api/cv/profile/route.ts` PUT — `if (data.slug)` bỏ qua validate khi client gửi `slug: ''` (falsy) — đổi thành `if ('slug' in data)`.
- `src/components/cv/editor/AccountSection.tsx` — gọi route `/api/cv/account` đã xoá khi migrate sang `CustomerAccount` (sót lại từ lúc migrate, gây lỗi fetch mọi lần mở tab "Cài đặt tài khoản" trong CV Editor) — trỏ lại `/api/account/me` + `/api/account/profile`.
- Dọn dead code: `getCvSession`/`getCvSessionCookieOptions`/`CV_COOKIE_NAME_EXPORT`/cookie `wd_cv_session` trong `src/lib/auth.ts` (hết người gọi sau khi CV Manager migrate hẳn sang `wd_account_session`); `EMAIL_RE` trùng lặp ở `app/api/admin/users/route.ts` nay import từ `src/lib/accountValidation.ts`.

Verify cả đợt: `npx tsc --noEmit` 0 lỗi, `npm run build` (Next.js 16 Turbopack) 0 lỗi/warning, live-test qua `next start` + `curl` cho auth gate (có/không cookie, role đúng/sai) đều đúng kỳ vọng — không tạo dữ liệu test nào trong DB dùng chung với production (mọi request test đều bị chặn ở tầng session trước khi chạm Prisma).

### 5 template Blog mới (batch 2026-08-29)

`Sources/templates/web/Blogs/` — build song song qua 5 agent `template-builder`. Trước batch này, ngách blog/forum chỉ có `blog-ca-nhan`/`forum-cong-dong` dùng bảng màu master cũ của webdrop.store (`--accent:#1a6b52`), KHÔNG thuộc hệ 11 Identity Token — nên cả 5 site được toàn quyền chọn token mới, không cần biến thể như batch Shop trước đó. Mỗi agent được orchestrator gán sẵn token/font/nav/hero để giảm rủi ro trùng lặp, nhưng vẫn tự Bước 0 đối chiếu lại toàn bộ ~80 template hiện có và tự điều chỉnh khi phát hiện trùng thật với site NGOÀI batch.

| Slug | Ngách | Token | Font | Nav | Hero | Accent | Prefix |
|---|---|---|---|---|---|---|---|
| `blog-du-lich` | Du lịch | WARM-ARTISAN | Fraunces *italic* + DM Sans | Nav-1 Transparent→Scrolled (đổi lần 2, xem fix bên dưới) | H11 Full-Width Text + Scroll Hint (đổi lần 2) | Mustard Ochre `#a97d2f` + Stamp Teal `#2f6461` | `bdl-` |
| `blog-cong-nghe` | Công nghệ | GEOMETRIC-MODERN | Space Grotesk | Nav-7 | H6 Asymmetric Offset (đổi từ H10) | Volt Yellow `#eab308` + Ink Graphite `#1c1f24` | `bcn-` |
| `blog-am-thuc` | Ẩm thực | FRESH-MINIMAL | Plus Jakarta Sans | Nav-2 | H9 Product Showcase | Herb Green `#5a8f3d` + Ripe Tomato `#d9502f` | `bam-` |
| `blog-me-va-be` | Mẹ và bé | SOFT-PASTEL | DM Sans *italic* | Nav-8 | H4 Centered Minimal | Sage Mint `#5f9c7c` + Apricot Peach `#eda872` | `bmb-` |
| `blog-tai-chinh` | Tài chính cá nhân | CLEAN-CORPORATE | Outfit | Nav-6 | H2 Split 45/55 | Moss Green `#4f7a34` | `btc-` |

Mỗi site 8 trang, cấu trúc thống nhất tự thiết kế cho ngách blog (không có sẵn trong bảng "Pages theo ngành" của `template-builder.md`): `index.html` (carousel hero 4 slide + bài nổi bật + FAQ mục H) + `bai-viet-chi-tiet.html` (data-driven, bài thật 800-1100 từ) + `chuyen-muc.html` (filter JS thật) + 1 trang thứ 5 riêng theo ngách (`cam-nang-du-lich`/`danh-gia-san-pham`/`cong-thuc-nau-an`/`cam-nang`/`cong-cu-tinh-toan`) + `ve-toi.html` + `lien-he.html` + 2 trang pháp lý footer-only. Mục G (case-study) và mục I (bảng giá) bỏ qua đúng quy tắc (blog không phải ngành dự án/gói dịch vụ phân tầng) — mục H (FAQ ≥6 câu) đủ ở cả 5 site (7-8 câu/site, `blog-tai-chinh` có thêm disclaimer "không phải lời khuyên đầu tư"). Toàn bộ ảnh Unsplash mỗi site (25-48 ảnh/site) đã verify HTTP 200 qua `curl` trước khi đưa vào code, nội dung bài viết/công thức/review viết thật theo ngách (không Lorem ipsum).

**Đối chiếu chéo sau batch (orchestrator) — phát hiện 2 trùng lặp thật giữa các site CÙNG batch**:
- **Nav-2 Always Solid Light dùng 2 lần**: `blog-du-lich` (tự đổi từ Nav-5 sau khi phát hiện trùng 2 site WARM-ARTISAN khác ngoài batch) và `blog-am-thuc` (giữ đúng gán ban đầu) — 2 agent chạy song song không thấy lựa chọn cuối của nhau.
- **Hero H6 Asymmetric Offset dùng 2 lần**: `blog-du-lich` (đổi từ H3) và `blog-cong-nghe` (đổi từ H10, do trùng `shop-may-anh` cùng token GEOMETRIC-MODERN) — cùng lý do trên.
- Cả 2 cặp trùng lặp đều khác biệt hoàn toàn về token/font/màu — chỉ trùng đúng 1 trong 6 điểm phân biệt bắt buộc (nav hoặc hero), không trùng cả bộ. Tương tự tình huống Nav-4 đã gặp ở batch Shop cùng ngày (batch Shop: chủ dự án xác nhận CHẤP NHẬN, không fix) — pattern lặp lại của rủi ro "N agent chạy song song không thấy tiến trình của nhau", chưa có giải pháp kỹ thuật (vd. lock file/khai báo trước) để loại bỏ hoàn toàn.
- Không phát hiện trùng token, font-pairing, prefix, hay hue màu giữa 5 site trong batch.
- **Đã fix riêng cho batch Blog (2026-08-30, theo yêu cầu chủ dự án — khác quyết định "chấp nhận" ở batch Shop)**: dispatch agent riêng sửa `blog-du-lich` (site dính cả 2 lần trùng) — đổi Nav-2→**Nav-1 Transparent→Scrolled** (trong suốt trên page-hero tối, solid kraft-paper khi `scrollY>80`) và Hero H6→**H11 Full-Width Text + Scroll Hint** (text căn giữa + ticker cuộn ngang tên điểm đến kiểu bảng chuyến bay + mũi tên scroll-hint), giữ nguyên carousel 4 slide/gradient/auto-play/dot-indicator bắt buộc và toàn bộ token/font/màu/nội dung/prefix khác. Verify lại: tag-balance, đúng 1 `<h1>`/trang, `node --check` pass, không class CSS chết sót lại, không link hỏng. `blog-am-thuc`/`blog-cong-nghe` không bị đụng tới.
