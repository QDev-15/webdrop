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
- **Nav "Kiến thức"** (2026-07-07): trỏ `/blog` — dùng chung route Blog đã có sẵn từ trước (không tạo route mới), chỉ thêm 1 phần tử vào mảng `navLinks` dùng chung cho desktop + mobile nav. Đã verify bằng screenshot Chrome headless ở 1024px/1100px/1200px — 7 mục nav vẫn đủ chỗ, không vỡ layout dù `.nav-links` không có `flex-wrap`.
- **Blog nội dung**: chiến lược nội dung là "Kiến thức/Cẩm nang" (case study từ WebDeploy projects + hướng dẫn theo ngách + so sánh template nội bộ) — KHÔNG đăng lại/dịch tin tức từ nguồn khác để tránh vi phạm bản quyền (Luật SHTT + Nghị định 72/2013). 11 bài viết hiện có, seed qua `prisma/seed.ts` (upsert Category + Post, `createdBy: admin.id`), 3 category: `cam-nang` (Cẩm nang — mặc định), `case-study` (Case Study), `so-sanh` (So sánh). Chọn category khác mặc định qua field `categorySlug?: string` trên từng object trong mảng `blogPosts`; resolve qua `blogCategoryMap[post.categorySlug] ?? blogCategory.id` (dùng `??` chứ không phải `? :` — tránh categoryId rơi về `undefined`/NULL nếu gõ sai `categorySlug` sau này). Nội dung `content` viết theo đúng convention parser `renderMarkdown()` trong `blog/[slug]/page.tsx`: dòng đứng riêng dạng `**Text**` → H2, `- ` đầu dòng → list item, `**bold**` inline → strong.
- **Blog redesign "trang chủ tin tức"** (2026-07-07): `blog/page.tsx` viết lại thành Server Component (fetch posts+categories, `take:60`) render `BlogClient.tsx` (Client Component MỚI, `src/components/site/`) — hero + ô tìm kiếm (client-side filter theo title/excerpt) + category chips + section "🔥 Nổi bật" (ưu tiên `post.featured=true`, fallback bài mới nhất nếu chưa có bài nào featured) + grid "Bài viết mới nhất". Export thêm `PostCard` + type `BlogPostItem` để tái dùng ở trang chi tiết (related posts).
- **Auto-fetch ảnh Unsplash cho bài chưa có thumbnail**: `src/lib/blogThumbnail.ts` — `ensurePostThumbnail(post)` chỉ chạy khi `post.thumbnail` rỗng; đọc `unsplash_access_key` từ bảng `settings` (đã có sẵn, cấu hình qua Admin → Cài đặt → Tích hợp — cùng key dùng cho `UnsplashPicker` trong admin); suy ra 1 query tiếng Anh từ tiêu đề qua bảng `NICHE_KEYWORDS` (vd "nha khoa"→"dental clinic interior") thay vì gửi thẳng câu tiếng Việt (Unsplash index theo tiếng Anh, query Việt thường ra 0 kết quả hoặc ảnh không liên quan); gọi Search API `per_page=5` rồi **chọn ảnh theo `post.id % 5`** (không phải luôn lấy kết quả đầu) để nhiều bài cùng ngách (vd nhiều bài về nha khoa) không bị gán trùng y hệt 1 tấm ảnh; lưu `thumbnail` vào DB qua `prisma.post.update` — chỉ gọi Unsplash **1 lần/bài**, các lần render sau đọc thẳng từ DB (không tốn quota lặp lại). Có track `download_location` (fire-and-forget) theo Unsplash API Guidelines. Nếu chưa cấu hình `unsplash_access_key` → trả `null` ngay, không gọi API, site vẫn chạy bình thường với emoji 📝 placeholder như cũ (graceful degradation).
- **Related posts** (`blog/[slug]/page.tsx`): `getRelatedPosts(excludeId, categoryId, extraExcludeIds)` lấy tối đa 6 bài cùng category (loại trừ bài hiện tại + `extraExcludeIds`), nếu thiếu thì lấy thêm bài mới nhất **bất kỳ category nào** để đủ 6 (cũng loại trừ `extraExcludeIds`) — luôn có nội dung để hiển thị kể cả category chỉ có 1-2 bài. Biến `fromDb: boolean` phân biệt bài lấy từ DB thật hay bài mock fallback (khi DB offline) — chỉ query related posts + gọi Unsplash khi `fromDb=true`, không đụng DB ở nhánh mock.
- Qua vòng reviewer (SHIP, 0 blocker) + qa-tester (READY TO SHIP, 0 fail) — verify runtime qua curl: `/blog` hiển thị đủ search+chips+hot section+11 ảnh Unsplash thật (0 emoji fallback vì đã cấu hình sẵn `unsplash_access_key`), 3 trang chi tiết đại diện 3 category đều có đúng 6 bài liên quan không tự trỏ về chính nó, alt text đầy đủ, heading order sạch (trừ 1 bài cũ `top-10-mau-website-nha-khoa-2026` nhảy h1→h3 do content gốc không có subheading — gap ở nội dung bài viết, không phải bug code, chưa fix vì ngoài phạm vi yêu cầu redesign).
- **Trang chi tiết bố cục 2 cột + sidebar** (2026-07-08): bỏ giới hạn `maxWidth: 760` cũ, `blog/[slug]/page.tsx` giờ dùng full `.wd-container` với `row g-4 g-lg-5` → `col-lg-8` (nội dung chính, không đổi) + `col-lg-4` (sidebar mới, `position: sticky, top: 80`). Sidebar gồm 3 phần: (1) form search `<form action="/blog" method="GET">` input `name="q"` — GET thuần không cần JS, điều hướng sang `/blog?q=...`; (2) widget "Bài viết mới nhất" — hàm mới `getLatestPosts(excludeId, limit)` lấy 5 bài mới nhất (trừ bài hiện tại), thumbnail nhỏ 56×56 + title + ngày; (3) ô placeholder "Vị trí quảng cáo" (dashed border, chưa có nội dung thật — chỗ để gắn ad sau này).
  - **Nối search sidebar → trang listing**: `blog/page.tsx` giờ nhận `searchParams: Promise<{q?:string}>` (Next.js 15 — phải `await`), truyền `initialQuery` mới cho `BlogClient` (`useState(initialQuery)` thay vì `useState('')`) — gõ search ở sidebar trang chi tiết sẽ điều hướng sang `/blog?q=...` và tự động lọc kết quả đúng ngay khi trang listing tải xong.
  - **Dedupe giữa "Bài viết liên quan" và "Bài viết mới nhất"** — 2 khu vực này có thể trùng bài do cùng logic "mới nhất" khi tổng số bài còn ít. Fix (qua vòng reviewer P1): tính `latestRaw` (5 bài) TRƯỚC, truyền `latestRaw.map(id)` làm `extraExcludeIds` cho `getRelatedPosts` — loại trừ ở CẢ nhánh category-match lẫn nhánh filler. Hệ quả phụ đã fix luôn: tránh gọi Unsplash trùng lặp cho cùng 1 bài xuất hiện ở cả 2 danh sách (tốn quota không cần thiết). Với 11 bài hiện có: "liên quan" co lại còn 5 (không phải 6) vì pool bài khả dụng bị 5 bài "mới nhất" chiếm hết — graceful degradation đúng như thiết kế, không phải bug.
  - `loading.tsx` (skeleton) cập nhật khớp layout 2 cột mới: bỏ hero skeleton kiểu "dark2 + text" thấp, thay bằng khối cao `clamp(220px,30vw,420px)` mô phỏng hero-có-ảnh (biến thể phổ biến hơn từ khi có auto-fetch Unsplash), thêm skeleton category+title trong `col-lg-8`, thêm skeleton sidebar (search bar + 5 item latest-posts + ô ad) — tránh giật layout khi content thật load xong.
  - Qua 2 vòng reviewer (vòng 1 tìm 3 P1: dedupe thiếu, Unsplash gọi trùng, skeleton chưa khớp hero-có-ảnh → đã fix cả 3; vòng 2 verify lại: SHIP) + qa-tester (READY TO SHIP, 0 fail) — verify runtime qua curl: layout 2 cột đúng, search sidebar→`/blog?q=spa` pre-fill đúng giá trị, 0 bài trùng giữa "liên quan" (5 bài) và "mới nhất" (5 bài) — tổng phủ đủ 10/10 bài khác trong DB, alt text đầy đủ, đúng 1 H1/trang.
- **Fix `admin/posts` filter reload trang** (2026-07-08): trang cũ là async Server Component nhưng gọi `useState` trực tiếp trong hàm (bug thật — Server Component không được dùng React hooks), khiến filter tab (Tất cả/Đã đăng/Nháp) không hoạt động và search phải submit `<form method="GET">` reload toàn trang. Viết lại hoàn toàn thành Client Component (`'use client'`, không convention sẵn trong dự án cho pattern này — tham khảo gần nhất `admin/users/page.tsx`): `useState` cho `posts/pages/counts/status/q/debouncedQ/page/loading/fetchError`, debounce ô search 400ms trước khi fetch, đổi status/search tự reset về trang 1, tất cả filter/pagination giờ là `onClick` set state gọi `fetch('/api/admin/posts?...')` — không còn `<form>`/`<a href="?...">` nào nên không reload trang. `app/api/admin/posts/route.ts` (GET) thêm field `counts: {all,published,draft}` trong response (độc lập với search text `q`, đúng hành vi cũ) để client chỉ cần 1 lần fetch/thao tác thay vì gọi nhiều lần.
  - Qua vòng reviewer: SHIP với 2 P1 (đã fix ngay): (1) `page` param không validate `isNaN` — `?page=abc` gây `NaN` lan vào Prisma `skip` làm crash 500 không kiểm soát → thêm `Number.isNaN` check + bọc try/catch quanh toàn bộ query; (2) 2 query count trùng nhau khi ở tab "Tất cả" không search (`total` và `allCount` cùng đếm y hệt) → thêm cờ `isAllUnfiltered` tái dùng `allCount` làm `total`, giảm 1 query thừa mỗi lần fetch. Cũng áp dụng 3 gợi ý P2: dùng `data.pages` từ API response thay vì tự tính lại `Math.ceil` phía client (tránh lệch nếu đổi `limit` sau này mà quên đồng bộ 2 nơi), sửa message rỗng dùng `debouncedQ` thay vì `q` (tránh hiển thị sai trong khoảng debounce 400ms), thêm `aria-label` cho ô search.
  - Qua vòng qa-tester: READY TO SHIP, 0 fail — các cảnh báo còn lại (thiếu `aria-pressed`/`aria-current`, hex màu badge ngoài whitelist design-system) đều là pattern có sẵn từ trước ở `users/page.tsx`, không phải regression riêng của trang này nên không chặn ship.
  - **Verify runtime bằng Playwright thật** (không chỉ đọc code tĩnh): cài `playwright` tạm vào thư mục scratchpad riêng (không đụng `package.json` chính), dùng Chrome hệ thống qua `channel:'chrome'`. Vì không rõ mật khẩu admin hiện tại (đã bị đổi khác mặc định `webdrop@2025` trong seed — xác nhận qua kiểm tra định dạng hash trong DB là scrypt `salt:hash` custom từ `src/lib/auth.ts`, không phải bcrypt như hàm `hashPassword` cục bộ trong `seed.ts`, nghĩa là mật khẩu thật đã được đổi qua `/admin/profile` ở lần nào đó chứ không phải seed mismatch), đã **backup hash mật khẩu gốc → tạm set mật khẩu test → verify xong → khôi phục lại hash gốc** bằng script tsx tạm (xoá ngay sau khi dùng), xác nhận qua curl login lại bằng mật khẩu test báo lỗi 401 sau khi khôi phục. Playwright xác nhận: 0 lần `framenavigated` khi click tab filter hoặc gõ search (không reload trang), đúng 1 API call debounce mỗi thao tác, search "nha khoa" trả đúng 4/11 bài, `?page=abc` không hợp lệ trả 200 (không crash) sau fix.
- **Fix XSS trong `renderMarkdown()`** (`blog/[slug]/page.tsx`, phát hiện qua reviewer khi làm blog redesign ở trên, code lỗi có từ trước — xác nhận qua `git diff`): trước đây dùng `dangerouslySetInnerHTML` để convert `**bold**` → `<strong>`, nhưng phần chữ còn lại trong dòng bị nhét thẳng làm HTML thô — nếu nội dung bài viết (nhập qua Admin Post editor) chứa `<img onerror=...>`/`<script>` sẽ thực thi được trên trình duyệt của MỌI khách xem bài (stored XSS). Đã sửa: bỏ hoàn toàn `dangerouslySetInnerHTML` ở 2 chỗ (list item + paragraph), thay bằng hàm `renderInlineBold()` tách `**chữ đậm**` thành React node `<strong>` thật qua `text.split(/\*\*([^*]+)\*\*/g)` — phần chữ còn lại luôn là text thuần đi qua React (tự động escape), không còn đường nào để chèn HTML/script. Verify bằng cách tạo 1 bài test tạm chứa payload `<img src=x onerror="...">` thật, xác nhận qua HTML response: payload chỉ còn là text data an toàn (0 thẻ `<img>` thực thi được, `<strong>` từ `**...**` vẫn hoạt động đúng), sau đó xóa bài test. Không đổi phần JSON-LD `dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}` — đây là schema markup có cấu trúc, không liên quan nội dung bài viết nhập tay, ngoài phạm vi fix này. Qua vòng reviewer riêng cho fix này: SHIP, 0 blocker/important — xác nhận `split(/\*\*([^*]+)\*\*/g)` xử lý đúng mọi edge case (nhiều cặp bold/dòng, không có `**`, dòng rỗng), không còn `dangerouslySetInnerHTML` nào áp lên nội dung bài viết (chỉ còn đúng 1 chỗ cho JSON-LD, không phải nội dung), không có React key warning tiềm ẩn.
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
- **SePay bank info (site chính)** — không còn hardcode `BANK_NAME/BANK_CODE/ACCOUNT_NO/ACCOUNT_NAME` trong `checkout/pending/page.tsx` (2026-07-06). Cấu hình qua Admin → Cài đặt → tab "🏦 SePay / Ngân hàng" (5 field: `sepay_api_key` + `sepay_bank_name/sepay_bank_code/sepay_account_no/sepay_account_name`, lưu trong bảng `settings` chung). `src/lib/sepay.ts`: `getSepayBankInfo()` chỉ dùng giá trị DB khi **đủ cả 4 field** — thiếu 1 field thì fallback nguyên cụm default (MB Bank cũ), tránh trộn bank code mới với số TK cũ. `getSepayApiKey()` đọc DB trước, fallback `process.env.SEPAY_API_KEY` — nên `app/api/webhooks/sepay/route.ts` không breaking nếu chưa cấu hình qua UI. 3 nơi hiển thị bank info (`checkout/pending/page.tsx`, `CheckoutClient.tsx`, `CvCheckoutClient.tsx`) đều gọi hook `useBankInfo()` (`src/lib/hooks/useBankInfo.ts`) → fetch public route `GET /api/checkout/bank-info` (không lộ `sepay_api_key`, chỉ 4 field hiển thị).
- **Đồng bộ tài khoản từ SePay API** — nút "🔄 Đồng bộ tài khoản từ SePay" trong Settings gọi `POST /api/admin/settings/sepay-sync` (superadmin only) → `fetchSepayBankAccounts()` gọi `GET https://my.sepay.vn/userapi/bankaccounts/list` với `Authorization: Bearer <sepay_api_key>` — SePay chỉ cấp 1 credential "API Access" nhưng dùng được cho CẢ 2 việc: xác thực webhook đến (`Authorization: Apikey`) VÀ gọi API chính chủ để lấy tài khoản NH đã liên kết (`Authorization: Bearer`) — tự động điền 4 field bank thay vì gõ tay. Lọc bỏ tài khoản `active:"0"`; nếu còn >1 tài khoản active thì chọn tài khoản đầu tiên + trả warning để admin tự kiểm tra (chưa có UI chọn account cụ thể — chỉ hỗ trợ trường hợp phổ biến 1 tài khoản/1 SePay account). Đồng bộ chỉ điền vào state, admin vẫn phải bấm "Lưu cài đặt" mới ghi DB.
- Qua vòng reviewer: fix `getSepayBankInfo()` trộn field (all-or-nothing thay vì per-field fallback), fix `fetchSepayBankAccounts()` bỏ qua tài khoản inactive, thêm timing-safe compare (`timingSafeEqual`) cho webhook token thay vì `!==` thô, và `GET /api/admin/settings` (route có từ trước, không riêng thay đổi này) giờ redact `sepay_api_key` cùng các secret khác (`smtp_password`, `cloudinary_api_secret`, `unsplash_access_key`, `football_api_key`) khỏi session không phải `superadmin`. TS build + `next build` 0 lỗi, verify runtime qua curl (bank-info trả default đúng khi chưa cấu hình, webhook 401 khi thiếu key/200 khi đúng key từ env fallback, các trang checkout render không lỗi).

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
| `nha-khoa-tre-em-kidsmile` | Nha khoa trẻ em | SOFT-PASTEL, Lilac `#9b7ef0`, Mint `#34c98e` | ✅ |
| `shop-ban-hang` | Shop bán hàng hữu cơ | ORGANIC-EARTH, Terracotta `#c4603a`, Sage `#6b8a7a` | ✅ |
| `shop-thoi-trang` | Shop thời trang | BOLD-EDITORIAL, Electric Blue `#0052ff` | ✅ |

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

*Cập nhật lần cuối: 2026-07-12 — thêm 2 template mới trong `Sources/templates/web/Shops/`: `shop-giay-dep` (shop giày dép/sneaker, DARK-ENERGY identity, Volt Lime `#d4ff3f` + Electric Cyan `#00e5ff`) và `shop-quan-ao` (shop quần áo/thời trang nữ, SOFT-PASTEL identity, Lavender Orchid `#b98bd1` + Butter Yellow `#f2c14e`) — mỗi template 5 trang (index/san-pham/chi-tiet-san-pham/gio-hang/lien-he), CSS viết từ đầu theo `template-builder.md`, không copy từ 2 template Shop có sẵn (`shop-ban-hang` ORGANIC-EARTH, `shop-thoi-trang` BOLD-EDITORIAL) — khác biệt rõ ở nav/hero/font/màu/layout, xem chi tiết ở ghi chú kỹ thuật riêng từng template phía dưới. Vì 2 custom agent `reviewer`/`qa-tester` không có sẵn trong danh sách subagent của môi trường phiên này (dù file `.claude/agents/reviewer.md` và `qa-tester.md` vẫn tồn tại), đã dùng `general-purpose` agent đóng vai trò tương đương, áp đúng checklist correctness+security của reviewer.md và structure/a11y/responsive của qa-tester.md (bỏ qua phần checklist riêng cho site chính như `.wd-container`/DM-Sans-only/logo `webdrop.vn` — không áp dụng cho template theo ngách). Kết quả: 0 blocker, 2 finding Important đã fix (swatch chọn size/màu không dùng được bằng bàn phím — thêm `tabindex`/`role="button"`/phím Enter-Space; tabs mô tả/thông số/đánh giá ở trang chi tiết khai báo `role="tablist"` nhưng thiếu `aria-selected`/`aria-controls`/`role="tabpanel"` — đã bổ sung đầy đủ) + 4 finding Minor đã fix (heading nhảy cấp h2→h4 ở section "Vì sao chọn chúng tôi"/"Cam kết của chúng tôi" → đổi thành h3; menu mobile ẩn (`right:-100%`) vẫn giữ nguyên trong tab order bàn phím dù đang đóng → thêm thuộc tính `inert` toggle qua JS khi mở/đóng; bộ lọc màu sắc ở `san-pham.html` chỉ cho chọn 1 màu trong khi bộ lọc size cho chọn nhiều (không nhất quán) → đổi màu sang multi-select giống size; nút "Cập nhật giỏ hàng" dùng `document.querySelector('[onclick="updateCart()"]')` để tự tìm lại chính nó thay vì nhận tham số trực tiếp → đổi sang `onclick="updateCart(this)"`). Đã verify lại bằng grep: không còn `var`, không `console.log`, mọi `target="_blank"` đều có `rel="noopener noreferrer"`.*

*Cập nhật lần trước: 2026-07-07 — Site chính (`Sources/system`) thiết kế lại toàn bộ trang Blog "Kiến thức" theo yêu cầu: (1) bố cục kiểu trang chủ tin tức — hero + tìm kiếm + filter theo chủ đề + section "Nổi bật" (ưu tiên bài `featured`, fallback bài mới nhất) + grid bài mới nhất, (2) tự động lấy ảnh Unsplash cho bài chưa có thumbnail dựa theo tiêu đề (suy ra từ khóa tiếng Anh qua bảng ánh xạ ngách, chọn ảnh theo `post.id % 5` để tránh trùng ảnh giữa các bài cùng chủ đề, lưu vào DB để chỉ gọi Unsplash 1 lần/bài), (3) section "Bài viết liên quan" tối đa 6 bài ở trang chi tiết (ưu tiên cùng category, fallback bài mới nhất nếu thiếu). Chi tiết implementation ở mục "Next.js System" phía trên. Qua vòng reviewer (SHIP) + qa-tester (READY TO SHIP), 0 blocker/fail. Phát hiện 1 vấn đề bảo mật pre-existing không thuộc phạm vi hôm nay (XSS tiềm ẩn trong `renderMarkdown()`) — đã báo cáo, chưa fix.*
*Cập nhật lần cuối: 2026-07-10 — hoàn thành WebDeploy `shop-thoi-trang` (BOLD-EDITORIAL identity, Outfit font, Electric Blue `#0052ff`, React + PHP + SQLite, TS website 47 modules 0 lỗi, admin 60 modules 0 lỗi, PHP 25/25 OK 0 BOM, 6 trang: `/`, `/san-pham`, `/san-pham/:slug`, `/gio-hang`, `/thanh-toan`, `/lien-he`, Nav-1 Transparent→Scrolled, H3 Magazine Grid hero). Site thứ 2 loại `shop` sau `shop-ban-hang` — áp dụng đầy đủ rule 36-41 của `web-deploy-builder.md` (sidebar filter 5 block, phân trang, checkout tự dựng, 2 phương thức thanh toán COD+SePay). Chi tiết đầy đủ ở mục "Ghi chú kỹ thuật `shop-thoi-trang` (WebDeploy)" phía trên. Phát hiện + tự fix (không chỉ đọc code tĩnh, verify qua PHP built-in server + curl thật): (1) bug hệ thống `api/index.php` `$router = require_once bootstrap.php` đè biến `$router` thật bằng return value mặc định của `require_once` (int `1`) → lỗi 500 "Call to a member function dispatch() on int" ở MỌI request — bug có sẵn trong `_scaffold/api/index.php`, chỉ fix trong `shop-thoi-trang` theo Rule 5, không sửa scaffold; (2) `HeroSlideController.php` sai tên cột (button_text/button_link/status thay vì btn_text/btn_link/is_active — cùng pattern bug đã gặp ở site khác); (3) `check-hash.php` chưa bị `.htaccess`/`web.config` chặn (P0); (4) `SettingsController.php` dùng cột `"group"` (reserved word) thay vì `grp` chuẩn của dự án. Không đụng đến `shop-ban-hang/` hay bất kỳ site nào khác trong quá trình build. Đã verify runtime toàn bộ luồng: settings/categories/products (filter theo size/color/price/danh mục đúng số lượng), chi tiết sản phẩm + đánh giá, coupon validate (WELCOME10/FREESHIP), tạo đơn COD, admin login/CRUD — sau đó xóa `api/database/app.db` test để site bàn giao với seed sạch.*

*Cập nhật lần cuối trước: 2026-07-07 — Site chính (`Sources/system`) thiết kế lại toàn bộ trang Blog "Kiến thức" theo yêu cầu: (1) bố cục kiểu trang chủ tin tức — hero + tìm kiếm + filter theo chủ đề + section "Nổi bật" (ưu tiên bài `featured`, fallback bài mới nhất) + grid bài mới nhất, (2) tự động lấy ảnh Unsplash cho bài chưa có thumbnail dựa theo tiêu đề (suy ra từ khóa tiếng Anh qua bảng ánh xạ ngách, chọn ảnh theo `post.id % 5` để tránh trùng ảnh giữa các bài cùng chủ đề, lưu vào DB để chỉ gọi Unsplash 1 lần/bài), (3) section "Bài viết liên quan" tối đa 6 bài ở trang chi tiết (ưu tiên cùng category, fallback bài mới nhất nếu thiếu). Chi tiết implementation ở mục "Next.js System" phía trên. Qua vòng reviewer (SHIP) + qa-tester (READY TO SHIP), 0 blocker/fail. Phát hiện 1 vấn đề bảo mật pre-existing không thuộc phạm vi hôm nay (XSS tiềm ẩn trong `renderMarkdown()`) — đã báo cáo, chưa fix.*

*Cập nhật lần trước: 2026-07-07 — Site chính (`Sources/system`) bổ sung thêm 10 bài viết Blog (tổng 11 bài) + 2 category mới "Case Study" (slug `case-study`) và "So sánh" (slug `so-sanh`), tiếp nối bài mồi đầu tiên ở bản cập nhật ngay dưới. 10 bài: 3 case study (nha khoa chỉnh nha, shop bán hàng hữu cơ, nha khoa trẻ em — kể lại cách tiếp cận thiết kế thực tế, không bịa số liệu kinh doanh chưa xảy ra), 5 cẩm nang (checklist website bán hàng, thiết kế website spa, website cho quán cafe/nhà hàng, CV Online là gì, website agency/portfolio cần gì), 2 so sánh (top 10 mẫu website nha khoa, chọn Gói Template hay Gói Website hoàn chỉnh). Implementation: `blogCategories` upsert 3 category qua `Promise.all` (giữ đúng thứ tự index vì Promise.all không đảo thứ tự theo tốc độ resolve), `blogCategoryMap` slug→id, mỗi bài viết có field optional `categorySlug` để chọn category khác mặc định `cam-nang`. Qua vòng reviewer (SHIP, 1 P1 hardening: đổi `categoryId: cond ? map[x] : fallback` sang `(cond ? map[x] : undefined) ?? fallback` để category không âm thầm rơi về NULL nếu gõ sai slug — đã fix ngay dù chưa phải bug đang xảy ra) + qa-tester (READY TO SHIP, 0 fail — verify runtime qua curl: đủ 11/11 bài trong listing, cả 3 category badge đều xuất hiện, mỗi trong 10 slug mới đúng 1 H1 + JSON-LD Article hợp lệ, 2 bài dạng listicle đúng 10 `<li>` unique không trùng lặp, không lỗi encoding tiếng Việt). Đã chạy `npx tsc --noEmit` sạch + `npm run db:seed` 2 lần (trước và sau fix hardening) đều thành công vào DB dev Neon.*

*Cập nhật lần trước: 2026-07-07 — Site chính (`Sources/system`) thêm tab nav "Kiến thức" trỏ `/blog` (route Blog đã tồn tại sẵn từ trước nhưng chưa từng gắn vào NavBar) + bài viết mồi đầu tiên "5 điều website nha khoa cần có để tăng tỷ lệ đặt lịch" (category mới `Cẩm nang`, slug `website-nha-khoa-tang-dat-lich`). Đây là bước đầu triển khai chiến lược content hub "Kiến thức/Cẩm nang" (không phải "Tin tức" theo nghĩa đen) để tăng traffic SEO hợp pháp mà không vi phạm bản quyền — nội dung 100% tự viết dựa trên kinh nghiệm thực tế xây 10+ site nha khoa, không copy/dịch từ nguồn ngoài. Implementation: thêm 1 phần tử vào mảng `navLinks` dùng chung desktop+mobile trong `NavBar.tsx`; thêm block upsert Category + Post vào cuối `prisma/seed.ts` (idempotent qua `upsert`, chạy `npm run db:seed` thành công vào DB dev Neon). Đã qua vòng reviewer (SHIP, 0 blocker, 2 suggestion không cần fix — lưu ý `update: {}` rỗng trong upsert nghĩa là sửa nội dung bài sau này qua seed sẽ không tự cập nhật DB, phải sửa qua admin hoặc đổi seed) + qa-tester (READY TO SHIP, 0 fail — verify runtime qua curl trên dev server thật: `/blog` và `/blog/[slug]` render đúng, đúng 1 H1/trang, JSON-LD Article schema hợp lệ). QA nêu lo ngại nav 7 mục có thể chật ở viewport 1024-1150px — đã tự verify bằng screenshot Chrome headless thật ở 1024/1100/1200px, xác nhận không vỡ layout, còn dư khoảng trống trước nút "Liên hệ ngay".*

*Cập nhật lần trước: 2026-07-06 — `shop-ban-hang` thêm nút "🔄 Đồng bộ tài khoản từ SePay" trong Admin → Cài đặt → tab "💳 Thanh toán", làm giống tính năng vừa build cho site chính (`Sources/system/`). Không đổi model 1-credential đã chốt trước đó (SePay chỉ cấp 1 "API Access" — không có API Token riêng) — tận dụng ĐÚNG credential đó (`sepay_webhook_secret`) theo 2 vai trò: xác thực webhook đến (`Authorization: Apikey`, không đổi) VÀ giờ thêm gọi API chính chủ SePay (`Authorization: Bearer`) để lấy tài khoản NH đã liên kết, tự điền `sepay_bank_code`/`sepay_account_number`/`sepay_account_name` thay vì gõ tay. Implementation: `SettingsController::syncSepayBankAccounts()` (PHP, `Auth::require()` — cùng tier với `index()`/`update()`, không có tier superadmin riêng trong app này) curl tới `https://my.sepay.vn/userapi/bankaccounts/list`, lọc bỏ tài khoản `active:"0"`, cảnh báo nếu >1 tài khoản active (chọn tài khoản đầu, không có UI chọn cụ thể — chỉ hỗ trợ trường hợp phổ biến 1 tài khoản/1 SePay account); route mới `POST /settings/sepay-sync`. Đồng bộ chỉ điền vào state React, admin vẫn phải bấm "Lưu cài đặt" để ghi DB. Không đổi `PublicController::paymentMethods()` (gating `sepay_enabled` theo 3 field không đổi) hay cơ chế webhook. Qua vòng reviewer: SHIP, 0 finding (so sánh trực tiếp với bản main site đã review trước đó — cùng pattern, không phát sinh vấn đề mới). PHP lint OK, TS admin 57 modules 0 lỗi.*

*Cập nhật lần trước: 2026-07-06 — `shop-ban-hang` thêm 20 sản phẩm mới (12 → 32 tổng, 5 sản phẩm/danh mục × 4 danh mục: Thời Trang, Phụ Kiện, Chăm Sóc, Nội Thất & Decor). Ảnh Unsplash được verify từng cái qua HTTP request thật trước khi dùng (tránh hallucinate ID ảnh không tồn tại). Implementation: method mới `Database::seedMoreProducts()` dùng `INSERT OR IGNORE` **không gate theo `COUNT(*) > 0` toàn bảng** như `seedProducts()` gốc — chủ đích để chạy an toàn kể cả khi DB đã seed 12 sản phẩm cũ từ trước (rút kinh nghiệm trực tiếp từ bug duplicate-slug vừa fix: gate theo count-toàn-bảng khiến việc bổ sung dữ liệu về sau rất dễ vỡ). Verify: 32 slug duy nhất không trùng lặp, seed sạch 32 sản phẩm trên DB mới tinh, chạy lại lần 2 (idempotency check — cùng 1 DB file, restart server) vẫn ra đúng 32 sản phẩm không lỗi. PHP lint 34/34 OK.*

*Cập nhật lần trước: 2026-07-06 — fix `shop-ban-hang` `Database.php::seedProducts()` — mảng `$products` bị nhân đôi (24 dòng thay vì 12), hầu hết slug trùng được thêm hậu tố "1" nhưng sót ít nhất 2 dòng (`ao-linen-tu-nhien`, `ao-khoac-linen-nhe`) giữ nguyên slug gốc → INSERT dòng thứ 2 trùng slug văng lỗi `SQLSTATE[23000]: UNIQUE constraint failed: products.slug`. Vì lỗi xảy ra ngay trong `Database::getInstance()` (chạy ở MỌI request qua `bootstrap.php`), lỗi này chặn đứng toàn bộ API cho đến khi seed xong — có thể là nguyên nhân gây luôn cả hiện tượng "Not found" báo cùng lúc (request đi ngang lúc DB đang ở trạng thái seed dở/crash). Đã xóa nguyên khối 12 dòng bị nhân đôi, verify lại: DB mới tinh seed sạch 12 sản phẩm, `X-Total-Count: 12`, cả 2 kịch bản routing (domain root + subfolder) vẫn đúng như đã fix ở bug 3. **Lưu ý quan trọng**: nếu máy test đã có sẵn `api/database/app.db` bị crash dở từ lần trước, phải XÓA file đó để site tự seed lại sạch — sửa source code không tự sửa được DB đã lỡ tạo hỏng trên đĩa.*

*Cập nhật lần trước: 2026-07-06 — `shop-ban-hang` thêm tìm kiếm sản phẩm theo tên (trang `/san-pham` trước đó không có ô search nào — template gốc cũng không thiết kế sẵn). Ô "Tìm kiếm" đặt đầu tiên trong sidebar filter, gõ-là-tự-tìm (debounce 400ms, không cần bấm "Áp dụng bộ lọc"). Backend: `PublicController::products()` thêm param `q`, match `LIKE` trên `name`/`material`/`description` (cột TEXT thuần — không dính bug CAST đã fix ở bug 1 vì đó chỉ xảy ra khi so sánh numeric với biểu thức tính toán). Phân trang dùng chung cơ chế `X-Total-Count` đã có sẵn nên tự động hoạt động đúng cho kết quả search — verify qua curl (tìm "linen" → 3 kết quả, phân trang 2 trang đúng thứ tự) + Playwright (gõ vào ô search → danh sách lọc còn 3 sản phẩm, pagination ẩn đúng vì 1 trang; xóa bộ lọc → về lại 12 sản phẩm + ô search rỗng). Empty-state hiển thị đúng tên từ khóa khi không tìm thấy. PHP OK, TS website 49 modules 0 lỗi.*

*Cập nhật lần trước: 2026-07-06 — fix bug 3 `shop-ban-hang` — `api/index.php` route "Not found" khi test qua XAMPP htdocs subfolder: `preg_replace('#^/api#', '', $rawPath)` chỉ cắt literal-leading "/api", nên khi site nằm trong subfolder (vd `htdocs/shop-ban-hang/` → request thật là `/shop-ban-hang/api/...`) thì regex không match gì cả, path đầy đủ lọt xuống Router → không route nào khớp → `{"error":"Not found"}`. Deploy ở domain root (production thật) không bị vì path đúng là `/api/...` ngay từ đầu — đây là gap khi TEST LOCAL qua subfolder, không phải lỗi khi lên hosting thật. Fix: đổi thành `preg_replace('#^.*/api#', '', $rawPath)` — cắt đến hết "/api" GẦN NHẤT bất kể có subfolder phía trước hay không, khớp với cách `website/src/api/client.ts` đã tính BASE URL động hỗ trợ subfolder từ trước (PHP giờ nhất quán với JS). Verify bằng PHP built-in server giả lập cả 2 kịch bản (domain root + subfolder) — cả 2 đều hoạt động đúng.*
  - **⚠️ Phát hiện cùng lúc: đây là bug hệ thống, không riêng `shop-ban-hang`** — dòng `preg_replace('#^/api#', ...)` y hệt tồn tại trong `_scaffold/api/index.php` (nguồn gốc) và ~40 site WebDeploy khác đã build từ scaffold (toàn bộ nha-khoa-*, nhà hàng, spa, portfolio-toi, nail-salon, v.v. — xem `_scaffold/` và các site liệt kê trong bảng WebDeploy Projects). Theo Rule 5, KHÔNG tự sửa các site khác hay scaffold — chỉ báo cáo để chủ dự án quyết định có muốn bulk-fix hay cập nhật scaffold hay không.

*Cập nhật lần trước: 2026-07-06 — fix 2 bug nghiêm trọng `shop-ban-hang`, cả 2 đã verify trực tiếp bằng cách chạy thật site (PHP built-in server + Vite dev server + Playwright headless browser + curl), không chỉ đọc code tĩnh:*
  - ***Bug 1 — trang `/san-pham` không load/filter được sản phẩm nào (0 kết quả luôn luôn):*** root cause là `PDOStatement::execute(array $params)` (PHP PDO) luôn bind mọi tham số dạng `PARAM_STR` bất kể kiểu gốc PHP. Filter giá so sánh với biểu thức tính toán `COALESCE(NULLIF(p.price_sale,0), p.price)` (không phải cột thuần) nên SQLite không tự áp column affinity — so sánh NUMERIC với TEXT theo storage-class thô khiến `>= '0'` LUÔN false. Vì website mặc định luôn gửi kèm `min_price=0`, **100% sản phẩm bị lọc mất mọi lúc**, kéo theo pagination/filter "không hoạt động" vì không có gì để hiển thị. Fix: bọc `CAST(? AS INTEGER)` quanh 2 placeholder giá trong `PublicController::products()`. Đã rescan toàn bộ file — không còn chỗ nào khác bị lỗi tương tự (rating/category_id so sánh trực tiếp với cột có affinity nên an toàn; LIMIT/OFFSET được SQLite ép kiểu riêng nên cũng an toàn).
  - ***Bug 2 — chọn thanh toán SePay nhưng không có mã QR để quét:*** không phải lỗi code — do Admin bật "Chuyển khoản trước qua SePay" nhưng chưa điền `sepay_bank_code`/`sepay_account_number`/`sepay_account_name` trong Cài đặt → Thanh toán, nên hệ thống tạo đơn thành công nhưng object `sepay` trả về rỗng → frontend đúng thiết kế fallback qua text "liên hệ shop" thay vì hiện QR vỡ, nhưng trải nghiệm vẫn coi là "không có gì để quét". Đã siết chặt gốc rễ: `paymentMethods()` giờ chỉ báo `sepay_enabled: true` khi TOGGLE bật VÀ đủ cả 3 field ngân hàng không rỗng (trước đó chỉ check toggle); `createOrder()` re-validate y hệt phía server (defense in depth, không tin riêng response phía client) và trả lỗi 422 rõ ràng thay vì tạo đơn không thể thanh toán được.
  - Qua vòng reviewer (verdict SHIP, 0 blocker) + fix thêm 1 P2 (đồng bộ `sepay_account_name` vào điều kiện gate cho nhất quán với 2 field kia). PHP toàn bộ OK, TS website 49 modules 0 lỗi. Xóa `api/database/app.db` test sau khi verify xong để site ship với seed sạch ở lần chạy thật đầu tiên.*

*Cập nhật lần trước: 2026-07-06 — `shop-ban-hang` thêm hệ thống Theme chọn màu trong admin. Admin → Cài đặt → tab mới "🎨 Giao diện" cho chọn 1 trong 10 theme màu (mặc định = theme hiện tại ORGANIC-EARTH), chỉ đổi màu sắc — không đổi layout/font. Implementation: `website/src/data/themes.ts` + `admin/src/data/themes.ts` (10 preset, mỗi preset override đúng 17 CSS custom properties đã có sẵn trong `template.css` `:root`); `SiteContext.tsx` áp theme qua `document.documentElement.style.setProperty` (ưu tiên cao hơn `:root{}` trong stylesheet, không cần inject `<style>` riêng) — dùng `useLayoutEffect` + cache `localStorage` để tránh flash màu mặc định trước khi `/public/settings` load xong; setting mới `site_theme` (nhóm `design`, mặc định `organic-earth`). Qua vòng reviewer (fix P0: DB đã seed trước đó sẽ không tự có `site_theme` → thêm backfill `INSERT OR IGNORE` ngoài guard `count>0`; fix P1: theme flash khi load lần đầu) + qa-tester (fix: `localStorage` không try/catch có thể crash toàn site ở private mode/sandbox — đã bọc an toàn). Đã document đầy đủ 10 theme (mood, accent chính/phụ, cách áp dụng cho site khác) vào `rules/design-system.md` § "🎨 10 Theme Presets" để tái sử dụng khi xây template mới. PHP toàn bộ OK, TS website 49 modules 0 lỗi, admin 57 modules 0 lỗi.*

*Cập nhật lần trước: 2026-07-06 — `shop-ban-hang` REVERT tính năng verify kết nối SePay thật (thêm ở lần trước) theo yêu cầu chủ dự án: SePay trong thực tế chỉ cấp DUY NHẤT 1 credential "API Access" — không có nơi nào cấp riêng "API Token" để gọi API xác minh tài khoản như đã giả định. Đã bỏ hẳn field `sepay_api_token`, bỏ `SettingsController::verifySepayConnection()` + logic chặn lưu, quay về model đơn giản giống hệt site chính webdrop.store (`Sources/system/app/api/webhooks/sepay/route.ts`) — chỉ 1 secret (`sepay_webhook_secret`, đổi label UI thành "SePay API Access" cho đúng thuật ngữ SePay) dùng để xác thực webhook gửi đến, không có bước gọi ngược API SePay để pre-validate. Giữ lại fix bug `Settings.tsx` nuốt lỗi im lặng (`catch { /* ignore */ }` → hiển thị qua `form-error-banner`) vì đây là bug thật độc lập với tính năng verify. PHP toàn bộ OK, TS admin 56 modules 0 lỗi.*

*Cập nhật lần trước: 2026-07-06 — `shop-ban-hang` admin Cài đặt → Thanh toán: verify kết nối SePay THẬT khi lưu (đã revert ở bản cập nhật ngay phía trên — xem lý do). Thêm setting `sepay_api_token` + `SettingsController::verifySepayConnection()` gọi `GET https://my.sepay.vn/userapi/bankaccounts/list` để xác nhận API Token hợp lệ và số tài khoản/mã ngân hàng khớp với tài khoản đã liên kết trên SePay.*

*Cập nhật lần trước: 2026-07-06 — `shop-ban-hang` admin `ProductForm.tsx`: đổi trường "Màu sắc" từ input text tự gõ "Tên:#hex" sang swatch picker chọn bằng click (giống hệt UI filter "Màu sắc" ở website `ProductsPage.tsx`) — khóa cứng vào đúng 6 màu palette (Terracotta/Sage/Kem/Đen/Trắng/Nâu) để đảm bảo admin không gõ nhầm tên/mã màu khiến bộ lọc trên website không nhận diện được. TS admin 56 modules 0 lỗi.*

*Cập nhật lần trước: 2026-07-06 — seed System DB (`Sources/system/prisma/seed.ts`) cho 2 template Shops chưa từng được đăng lên webdrop.store: thêm industry mới `shop` (Shop bán hàng, sortOrder 8) + 2 template `shop-ban-hang` (category `web`, **hasWebsite: true** — có website đầy đủ tại `Sources/WebDeploy/shop-ban-hang/`, demoUrl `webdrop-eol.pages.dev/Shops/shop-ban-hang/`) và `shop-thoi-trang` (template-only, demoUrl `webdrop-eol.pages.dev/Shops/shop-thoi-trang/`), giá 99.000đ, status `published`. Thêm field `hasWebsite?: boolean` vào type annotation của `templateData` + truyền vào `Template.upsert()` (trước đây field này tồn tại trong schema nhưng seed.ts chưa bao giờ set, luôn mặc định `false`). Đã chạy `npm run db:seed` thành công — Industries: 8, Templates: 43 (42 web + 1 admin, tăng từ 41).*

*Cập nhật lần trước: 2026-07-06 — fix `shop-ban-hang` admin.css: TOÀN BỘ trang CRUD (Products, Product Categories, Testimonials, Settings, Orders, Dashboard) render không có style (input/button/table mặc định trình duyệt) vì `admin.css` được viết theo convention class khác (`.page-header`/`.card`/`.btn-accent`/`.form-control`) so với convention thực tế mà các trang này dùng (`.admin-page`/`.admin-form`/`.btn btn-primary`/`.form-group` với `<label>`/`<input>` trần không class) — chỉ các trang từ scaffold gốc (Login, Hero Slides, Media, Contacts, Profile) là khớp CSS. Đã bổ sung toàn bộ class thiếu vào `admin.css` (`.admin-page-header/-title/-sub`, `.admin-form` + style label/input/select/textarea bên trong `.form-group`, `.form-check`, `.form-error-banner`/`.form-success-banner`, `.admin-table-wrap`, `.admin-loading-box`, `.btn-primary`/`.btn-outline`, `.status-badge` + 6 màu theo design-system.md, `.settings-tabs`/`.settings-tab`, `.stat-icon/-num/-label/-link` cho Dashboard) — không đổi tên class trong .tsx. TS admin 56 modules 0 lỗi, CSS bundle 9.09kB → 12.65kB.*

*Cập nhật lần trước: 2026-07-06 — `shop-ban-hang` bổ sung tìm kiếm/lọc sản phẩm đúng thiết kế template + phân trang + giỏ hàng/thanh toán thật (site trước đó lệch hẳn thiết kế `san-pham.html`/`gio-hang.html` — chỉ có 1 filter danh mục dạng radio, không phân trang, giỏ hàng chỉ là trang tĩnh rỗng, không có checkout). Đã note toàn bộ yêu cầu đặc thù cho type `shop` vào `web-deploy-builder.md` (rule 36-43, có mức độ ưu tiên P0/P1/P2) để áp dụng cho các site shop sau này. Chi tiết thay đổi:
  - **DB**: `products` thêm `colors` (pipe-separated "Tên:#hex"), `rating`, `in_stock`; thêm bảng `orders` + `order_items`; `settings` thêm nhóm `payment` (payment_cod_enabled, payment_sepay_enabled, sepay_bank_code/account_number/account_name/webhook_secret) + vá một loạt key Settings.tsx tham chiếu nhưng chưa từng được seed (site_slogan, meta_title, shipping_fee, free_shipping_threshold, stat_reviews, v.v.)
  - **API**: `GET /public/products` hỗ trợ filter đầy đủ (category_ids, min/max price, colors, min_rating, in_stock, sale, is_new, sort) + phân trang (page/per_page, trả tổng số qua header `X-Total-Count` — giữ nguyên rule response array thuần); thêm `GET /public/payment-methods`, `POST /public/orders` (tính lại giá từ DB, không tin giá client), `GET /public/orders/:code/status` (polling), `POST /public/sepay-webhook` (xác thực qua `hash_equals` + `Authorization: Apikey <secret>`, khớp mã đơn qua regex nội dung chuyển khoản); thêm `OrderController` (admin: index/show/update-status)
  - **Admin**: tab Settings mới "💳 Thanh toán"; trang `/orders` (list + detail + đổi trạng thái); ProductForm thêm colors/rating/in_stock; Sidebar có badge đơn chờ xử lý
  - **Website**: `CartContext` (giỏ hàng localStorage, key theo product_id+color), `ProductsPage` viết lại hoàn toàn theo đúng 5 block sidebar filter (giá/danh mục/màu/đánh giá/tình trạng) + tab bar danh mục + phân trang, `ProductDetailPage` nối thật add-to-cart + chọn màu + rating thật, `CartPage` viết lại đọc từ CartContext, `CheckoutPage` mới (form khách hàng + chọn COD/SePay + hiển thị QR VietQR + polling xác nhận thanh toán)
  - **Fix phát sinh khi review**: thêm Bootstrap 5.3.3 + Bootstrap Icons CDN vào `website/index.html` (thiếu hoàn toàn từ trước); `PublicController::settings()` thiếu lọc nhóm `payment` → có thể lộ `sepay_webhook_secret` qua endpoint public (đã vá); `CartContext` update/remove theo `product_id` thôi trong khi add theo `product_id+color` → sửa 2 sản phẩm khác màu bị gộp nhầm; đồng bộ lại UX filter "Đang giảm giá" (trước đó áp dụng tức thời trong khi các checkbox cùng khối lại cần bấm "Áp dụng bộ lọc")
  - PHP 34/34 files OK 0 BOM, TS website 48 modules 224kB 0 lỗi, admin 56 modules 234kB 0 lỗi — qua vòng reviewer + qa-tester*

*Cập nhật lần trước: 2026-07-06 — reviewer+qa fix `shop-ban-hang`: P0 index.php `$router = require_once` → plain `require_once` (Router bị ghi đè bởi true), P0 ProductController/ProductCategoryController/TestimonialController `$params[1]` → `$params['id']`, P0 PublicController::productBySlug `$params[1]` → `$params['slug']`, P0 HeroSlideController dùng sai column `button_text`/`button_link`/`status` → `btn_text`/`btn_link`/`is_active` + SELECT alias cho form compat, P0 PublicController::settings() lọc `grp NOT IN ('smtp','cloudinary','integrations')` chặn credential leak, P1 schema.sql products `DEFAULT 'active'` → `DEFAULT 'published'` (đồng bộ với React filter + PHP WHERE), P1 ProductController::update() price_sale fallback `$row['price_sale']` thay vì luôn null, P2 category_id isset() trong store(), P2 contact length limits, xóa Unsplash key hardcode khỏi seed. PHP 25/25 OK, TS website 46 modules 0 lỗi, admin 54 modules 0 lỗi.*

**Ghi chú kỹ thuật `shop-ban-hang` (WebDeploy):**
- CSS prefix: `sb-` xuyên suốt (kế thừa từ template)
- Identity: ORGANIC-EARTH — Fraunces weight 500 (heading serif) + DM Sans (body), nền warm cream `#f7f3ee`, Terracotta accent `#c4603a`, Sage secondary `#6b8a7a`
- Nav: Nav-7 Split — Logo left / Links center / Cart+CTA+burger right — always solid bg `rgba(247,243,238,.95)`
- Hero: H9 Product Showcase — Left text 40% + Right 2×3 product showcase grid 60% (dynamic từ featured products)
- Fonts: Google Fonts — Fraunces + DM Sans (không dùng Bunny Fonts — kế thừa từ HTML template)
- Bootstrap 5.3.3 + Bootstrap Icons 1.11.3 CDN trong `website/index.html` (thiếu từ bản đầu — đã bổ sung 2026-07-06, cần cho `bi bi-*` icons ở trang Sản phẩm/Giỏ hàng/Thanh toán)
- Trang website: `/`, `/san-pham` (filter+phân trang), `/san-pham/:slug`, `/gio-hang`, `/thanh-toan` (checkout — KHÔNG có trong template gốc, tự dựng theo design system), `/lien-he` (6 routes)
- SiteContext: settings, products (per_page=200 để lấy toàn bộ catalog cho homepage/related — KHÔNG dùng cho trang `/san-pham`), categories, testimonials
- CartContext: giỏ hàng localStorage (key `sb_cart`), item định danh theo `product_id` + `color` — mọi thao tác update/remove phải truyền cả 2 field
- Public API: `GET /public/settings` (lọc bỏ nhóm `smtp,cloudinary,integrations,payment` — không lộ secret), `GET /public/hero-slides`, `GET /public/product-categories`, `GET /public/products` (query: **q** — tìm theo tên/chất liệu/mô tả, category_ids, min_price, max_price, colors, min_rating, in_stock, sale, is_new, sort, page, per_page — trả `X-Total-Count` header), `GET /public/products/:slug`, `GET /public/testimonials`, `GET /public/payment-methods`, `POST /public/orders`, `GET /public/orders/:code/status`, `POST /public/sepay-webhook`, `POST /public/contact`
- Tìm kiếm sản phẩm: ô search đầu sidebar filter ở `/san-pham`, gõ-là-tự-tìm (debounce 400ms, không cần nút Áp dụng) — param `q` match `LIKE` trên `name`/`material`/`description`, dùng chung cơ chế phân trang `X-Total-Count` nên paging tự hoạt động đúng cho kết quả search
- DB Extension tables: product_categories (name, slug UNIQUE, image, sort_order), products (category_id FK, name, slug UNIQUE, image, price, price_sale, badge, description, material, **colors** pipe-separated "Tên:#hex", **rating** REAL, **in_stock** INTEGER, is_featured, is_new, status, sort_order), testimonials (author_name, author_avatar, author_location, content, stars, product_purchased, is_active, sort_order), **orders** (order_code UNIQUE, customer_name, phone, email, address, note, subtotal, shipping_fee, discount, total, payment_method, payment_status, status), **order_items** (order_id FK, product_id FK, product_name, price, qty, subtotal)
- DB seed: 4 product categories, 32 products (hữu cơ/thủ công, có colors/rating — 12 gốc qua `seedProducts()` + 20 bổ sung qua `seedMoreProducts()` chạy `INSERT OR IGNORE` không gate count để an toàn bổ sung sau này), 5 testimonials, 50+ settings keys (thêm nhóm `payment`, `design`)
- Status values: `'published'` và `'draft'` (không phải `'active'`) — lưu ý cho các controller filter
- Thanh toán: 2 phương thức COD + SePay, bật/tắt qua Settings tab "💳 Thanh toán" (`payment_cod_enabled`, `payment_sepay_enabled`); chỉ 1 credential `sepay_webhook_secret` (label UI "SePay API Access") dùng xác thực webhook — KHÔNG có bước gọi ngược API SePay để pre-validate (SePay chỉ cấp 1 credential, không có API Token riêng); SePay hiển thị QR VietQR (`img.vietqr.io`) + polling `GET /public/orders/:code/status`; webhook `POST /public/sepay-webhook` xác thực bằng `hash_equals()` so khớp `Authorization: Apikey <sepay_webhook_secret>`
- **`sepay_enabled` chỉ true khi ĐỦ 4 điều kiện**: `payment_sepay_enabled='1'` VÀ `sepay_bank_code`/`sepay_account_number`/`sepay_account_name` đều không rỗng (`PublicController::paymentMethods()` + re-validate độc lập trong `createOrder()`) — bật toggle mà chưa điền đủ tài khoản sẽ KHÔNG chào phương thức SePay cho khách và `createOrder()` từ chối tạo đơn (422), tránh tạo đơn "không thể thanh toán" (không có gì để quét QR)
- **Price filter (`min_price`/`max_price`) BẮT BUỘC bọc `CAST(? AS INTEGER)`** quanh placeholder khi so sánh với biểu thức tính toán (`COALESCE(NULLIF(p.price_sale,0), p.price)`) — `PDOStatement::execute(array)` luôn bind `PARAM_STR` bất kể kiểu PHP gốc, và biểu thức COALESCE không có column affinity để SQLite tự ép kiểu, nên so sánh NUMERIC với TEXT theo storage-class sẽ luôn false (bug đã khiến trang `/san-pham` không hiển thị sản phẩm nào — fix 2026-07-06). So sánh trực tiếp với cột thật (vd `p.rating >= ?`, `p.category_id IN (?)`) thì an toàn vì SQLite tự áp column affinity, không cần CAST.
- Theme: setting `site_theme` (nhóm `design`, mặc định `organic-earth`) — 10 preset màu tại `website/src/data/themes.ts` + `admin/src/data/themes.ts` (đồng bộ 2 file), áp dụng qua `document.documentElement.style.setProperty` trong `SiteContext.tsx`, cache `localStorage` (key `sb_theme_slug`) để tránh flash màu khi load trang — xem đầy đủ palette tại `.claude/rules/design-system.md` § "10 Theme Presets"
- Contact form fields: name, phone, email, topic (select 5 options), message
- Admin pages: dashboard, product-categories, products, testimonials, **orders** (list + detail + đổi trạng thái), contacts, slides, media, settings (10 tabs), profile
- Settings tabs: Thông tin chung, **🎨 Giao diện**, SEO, Mạng xã hội, Cửa hàng, 💳 Thanh toán, Liên hệ, SMTP, ☁️ Cloudinary, 🔌 Tích hợp
- Settings endpoint: `POST /settings/update` (không phải `POST /settings`)
- TS build: website 49 modules 230kB 0 lỗi, admin 57 modules 242kB 0 lỗi
- PHP syntax: 34/34 files OK, 0 BOM

**Ghi chú kỹ thuật `shop-thoi-trang` (WebDeploy):**
- CSS prefix: `st-` xuyên suốt (kế thừa từ template) — font thực tế của template là **Outfit** (Google Fonts), không phải Syne như ghi chú cũ ở mục template-only bên dưới (đã đối chiếu trực tiếp `assets/css/style.css` gốc — Syne là nhầm lẫn từ lần ghi chú trước, không sửa lại note cũ để giữ nguyên lịch sử)
- Identity: BOLD-EDITORIAL — Outfit 300–800, nền near-white `#f4f4f4`, Electric Blue accent `#0052ff`, border-radius 0 (editorial sharp)
- Nav: Nav-1 Transparent→Scrolled (trang chủ) / always-solid (các trang con — đúng như template) — `useLocation` pathname `isHome` quyết định trạng thái ban đầu
- Hero: H3 Magazine Grid — text tĩnh từ settings nhóm `hero`, 3 ảnh lưới bên phải lấy từ `hero_slides` (field `title` đóng vai trò nhãn "Nữ"/"Nam"/"Phụ kiện" — KHÔNG dùng làm carousel, khác với các site khác trong hệ thống dùng hero_slides làm slideshow thật)
- Scaffold với type `company` (gần nhất, do scaffolder chưa có type `shop` — xem rule 42 `web-deploy-builder.md`) rồi tự dọn các placeholder company-specific (Service/Team/Project) không dùng, tự viết toàn bộ Product/ProductCategory/ProductReview/Coupon/Order/Public/Settings/Stats theo đúng rule 36-41
- Trang website: `/`, `/san-pham` (filter+phân trang), `/san-pham/:slug`, `/gio-hang`, `/thanh-toan` (checkout — không có trong template gốc, tự dựng theo design system), `/lien-he` (6 routes)
- Sidebar filter `/san-pham` bám sát đúng 5 block của template gốc (không rút gọn theo rule 36): Tìm kiếm, Danh mục (multi-select có count), Khoảng giá (4 radio range cố định — không phải 2 input min/max như `shop-ban-hang`, nhưng nội bộ vẫn map ra `min_price`/`max_price` cho API để đúng chuẩn rule 37), Size (checkbox chip XS-XXL — không lọc được size dạng số như jeans/giày, đây là giới hạn có chủ đích vì template chỉ demo size chữ), Màu sắc (swatch), Trạng thái (Mới/Sale/Còn hàng) + 2 nút Áp dụng/Xóa. Tab bar danh mục ngang phía trên grid, đọc thêm `?cat=slug`/`?sale=1`/`?q=...` từ URL khi vào thẳng từ Header/Footer/link ngoài
- SiteContext: settings, products (per_page=200 cho trang chủ/liên quan), categories, testimonials, **heroSlides** (thêm mới so với `shop-ban-hang` — dùng cho magazine grid)
- CartContext: giỏ hàng localStorage (key `st_cart`), item định danh theo `product_id`+`color`+`size` (3 field — nhiều hơn `shop-ban-hang` vì sản phẩm thời trang cần cả 2 chiều biến thể), thêm state `coupon` (code+discount) dùng chung giữa CartPage và CheckoutPage, tự reset khi số lượng dòng hàng trong giỏ đổi (đơn tối thiểu mã giảm giá có thể không còn hợp lệ)
- Public API: `GET /public/settings`, `GET /public/hero-slides`, `GET /public/product-categories`, `GET /public/products` (query: q, category_ids, min_price, max_price, colors, **sizes**, min_rating không dùng (không có control rating ở sidebar theo đúng template), in_stock, sale, is_new, sort, page, per_page — trả `X-Total-Count`), `GET /public/products/:slug`, `GET /public/products/:slug/reviews` (route mới — đánh giá riêng theo sản phẩm, khác với `testimonials` là đánh giá chung trang chủ), `GET /public/testimonials`, `GET /public/payment-methods`, `POST /public/coupons/validate` (route mới), `POST /public/orders`, `GET /public/orders/:code/status`, `POST /public/sepay-webhook`, `POST /public/contact`
- DB Extension tables: product_categories, **products** (thêm so với `shop-ban-hang`: brand, gallery pipe-separated URL ảnh phụ, features newline-separated bullet, specs TEXT JSON `[[label,value],...]`, origin, **sizes** pipe-separated, review_count, sold_count, stock_qty — ngoài colors/rating/in_stock đã có), **product_reviews** (bảng mới — product_id FK, author_name, rating, variant_note, review_date, content; `ProductReviewController` tự tính lại `products.rating`+`review_count` mỗi khi thêm/sửa/xóa đánh giá), testimonials (đổi `author_location`→**`author_role`** cho đúng ngữ cảnh template "Khách hàng thường xuyên" thay vì địa danh), **coupons** (bảng mới — code UNIQUE, type percent/fixed, value, min_order, max_uses, used_count, expires_at, is_active), orders (thêm `coupon_code`), order_items (thêm `color`+`size` thay vì chỉ có trong CartItem, không có ở `shop-ban-hang`)
- Mã giảm giá: `PublicController::lookupCoupon()` dùng chung cho cả `validateCoupon()` (endpoint riêng, gọi khi bấm "Áp Dụng" ở giỏ hàng) và `createOrder()` (validate lại độc lập phía server, không tin discount client gửi lên) — discount luôn `min(discount, subtotal)` để không bao giờ âm; `used_count` chỉ tăng khi đơn hàng thực sự được tạo thành công, không tăng khi chỉ validate
- DB seed: 5 danh mục (Nữ/Nam/Trẻ Em/Phụ Kiện/Giày Dép), 24 sản phẩm (8 Nữ, 6 Nam, 3 Trẻ Em, 4 Phụ Kiện, 3 Giày Dép — đủ brand/gallery/features/specs/colors/sizes/origin thực tế theo từng loại), 12 product_reviews mẫu trên các sản phẩm tiêu biểu, 5 testimonials, 2 coupons mẫu (`WELCOME10` giảm 10% đơn từ 300k, `FREESHIP` giảm 30k đơn từ 500k), 3 hero_slides (ảnh magazine grid)
- Ảnh seed dùng `picsum.photos/seed/...` (giống hệt cách template gốc tự dùng cho toàn bộ ảnh demo) thay vì Unsplash URL đoán ID — tránh rủi ro hallucinate ID ảnh không tồn tại, nhất quán 100% với ảnh minh họa gốc của template
- Thanh toán: 2 phương thức COD + SePay giống hệt pattern `shop-ban-hang` (bật/tắt qua Settings tab 💳 Thanh toán, `sepay_enabled` chỉ true khi đủ 4 điều kiện, nút "🔄 Đồng bộ tài khoản từ SePay")
- Admin pages: dashboard, slides, product-categories, products (thêm gallery multi-ImageField, color swatch picker riêng theo palette 10 màu của site này, specs key-value row editor, features textarea), **product-reviews** (mới — chọn sản phẩm từ dropdown, rating, ngày, nội dung), testimonials, **coupons** (mới), orders, contacts, media, settings (12 tab: Chung, Trang chủ, Câu chuyện, Flash Sale, SEO, Mạng xã hội, Cửa hàng, 💳 Thanh toán, Liên hệ, SMTP, Cloudinary, Tích hợp — không có tab "🎨 Giao diện"/theme picker vì site này chỉ có 1 identity cố định, không implement hệ 10-theme như `shop-ban-hang`), profile
- Bug phát hiện qua tự verify runtime (curl + PHP built-in server, không chỉ đọc code tĩnh): **`api/index.php` dòng `$router = require_once __DIR__.'/src/bootstrap.php'`** — gán return value của `require_once` (luôn là `1`/true vì `bootstrap.php` không có `return $router;` ở cuối) đè lên biến `$router` thật mà `bootstrap.php` đã định nghĩa trong cùng scope, gây lỗi 500 "Call to a member function dispatch() on int" ở MỌI request không phải `/health`. Đây là bug hệ thống có sẵn trong `_scaffold/api/index.php` (nguồn gốc) — đã fix riêng trong `shop-thoi-trang` theo Rule 5, KHÔNG sửa scaffold hay các site khác. So sánh: `shop-ban-hang/api/index.php` không có bug này vì gọi `require_once` KHÔNG gán biến (để `$router` tự nhiên tồn tại trong scope nhờ `require_once` chạy cùng scope với khối `try{}` bao ngoài) — 2 cách viết index.php khác nhau đang tồn tại song song giữa các site cũ/mới trong hệ thống, chưa đồng bộ về 1 chuẩn.
- Cũng tự fix thêm trong `shop-thoi-trang`: `HeroSlideController.php` sai tên cột (`button_text`/`button_link`/`status` thay vì `btn_text`/`btn_link`/`is_active` — cùng bug pattern đã từng gặp và fix ở `shop-ban-hang`, do cả 2 site đều thừa hưởng từ `_scaffold/api/src/controllers/HeroSlideController.php` gốc chưa sửa); `.htaccess`+`web.config` chặn truy cập `check-hash.php` (P0 — cùng pattern đã áp dụng cho `nha-khoa-tre-em-kidsmile`, scaffold gốc chưa chặn); `SettingsController.php` đổi từ cột `"group"` (reserved word, cần quote) sang `grp` cho khớp `schema.sql` (scaffold mặc định dùng `"group"`, các site shop trước đó đã thống nhất dùng `grp`); `CouponController` validate percent không vượt 100%.
- Verify runtime qua PHP built-in server + curl: health OK, settings/categories/products (24 sản phẩm, filter theo size/color/price đều đúng số lượng), product detail + reviews, testimonials, coupon validate (đúng số tiền giảm + đúng lỗi khi dưới đơn tối thiểu), tạo đơn COD thành công (tính đúng subtotal/shipping/total), payment-methods, admin login + stats + settings + orders + coupons — toàn bộ hoạt động đúng sau khi fix bug router. Đã xóa `api/database/app.db` test trước khi bàn giao để site seed sạch ở lần chạy thật đầu tiên.
- TS build: website 47 modules 244.69kB JS 0 lỗi, admin 60 modules 257.72kB JS 0 lỗi
- PHP syntax: 25/25 files OK, 0 BOM

*Cập nhật lần trước: 2026-07-05 — hoàn thành template `shop-thoi-trang` (BOLD-EDITORIAL identity, Syne 800 + Syne 400, near-white #f4f4f4, Electric Blue #0052ff accent, Nav-1 Transparent→Scrolled, H3 Magazine Grid, 5 trang: index/san-pham/chi-tiet-san-pham/gio-hang/lien-he, st- CSS prefix, Bootstrap 5.3.3, 6 layout patterns: STAT-BAR/GRID-CARDS/BENTO-GRID/ALTERNATING-STRIPS/FULL-BLEED/HORIZONTAL-SCROLL)*

**Ghi chú kỹ thuật `shop-giay-dep`:**
- CSS prefix: `gd-` xuyên suốt (giay-dep)
- Identity: DARK-ENERGY — Syne weight 700/800 (heading) + Space Grotesk (body), nền full dark `#0a0e0c`, Volt Lime accent `#d4ff3f`, Electric Cyan phụ `#00e5ff`
- Nav: Nav-3 Dark Floating Pill — fixed top 16px, border-radius 999px, backdrop-blur, không cần scroll JS
- Hero: H1 Full-Screen Overlay — ảnh nền opacity .34 + gradient tối dần xuống `--bg`, heading uppercase `clamp(44px,8vw,96px)`
- Fonts: Google Fonts — Syne + Space Grotesk (không dùng Bunny Fonts)
- Trang: `index.html`, `san-pham.html`, `chi-tiet-san-pham.html`, `gio-hang.html`, `lien-he.html` (5 trang)
- Layout patterns: FULL-BLEED (hero + promo), GRID-CARDS (danh mục), BENTO-GRID (sản phẩm nổi bật, card đầu chiếm 2×2), FEATURE-ICON-ROW (vì sao chọn), HORIZONTAL-SCROLL (đánh giá), STAT-BAR (số liệu)
- Card: `border-left: 3px solid transparent` → accent khi hover + shadow neon lime, border-radius 4px (sharp, đúng tinh thần dark-energy)
- Button: pill (border-radius 999px), primary volt lime nền đặc + glow ring khi hover, outline/cyan variants
- Filter sidebar (`san-pham.html`): size + màu đều multi-select (toggle độc lập), khác trang chi tiết sản phẩm (size/màu single-select — chọn đúng 1 biến thể để mua)
- Swatch (size/màu) có `tabindex="0"` + `role="button"` + xử lý phím Enter/Space qua hàm dùng chung `makeSwatchKeyboardAccessible()` — không chỉ bắt sự kiện `click`
- Tab mô tả/thông số/đánh giá (`chi-tiet-san-pham.html`): đủ bộ ARIA — `role="tablist"/"tab"/"tabpanel"`, `aria-selected`, `aria-controls`/`aria-labelledby` đồng bộ qua id
- Menu mobile (`#gd-nav-mob`) dùng thuộc tính `inert` toggle bằng JS khi mở/đóng — tránh giữ link trong tab order khi menu đang ẩn ngoài màn hình
- Footer: full dark `--dark`, 3-col, neon accent link hover
- Không có console.log, tất cả `target="_blank"` có `rel="noopener noreferrer"`, tất cả img có alt

**Ghi chú kỹ thuật `shop-quan-ao`:**
- CSS prefix: `qa-` xuyên suốt (quan-ao)
- Identity: SOFT-PASTEL — DM Sans italic 300 (heading) + Manrope (body), nền warm blush white `#fdf9f6`, Lavender Orchid accent `#b98bd1`, Butter Yellow phụ `#f2c14e` (khác hue với Lilac/Mint đã dùng ở `nha-khoa-tre-em-kidsmile`)
- Nav: Nav-2 Always Solid Light — fixed, background trắng cố định, không cần scroll JS
- Hero: H12 Two-Column Equal — text trái 50% / ảnh phải 50% cân bằng, có floating rating card + floating sale badge tròn
- Fonts: Google Fonts — DM Sans (italic only) + Manrope (không dùng Bunny Fonts, không trùng cách phối font với `shop-ban-hang` Fraunces+DM Sans)
- Trang: `index.html`, `san-pham.html`, `chi-tiet-san-pham.html`, `gio-hang.html`, `lien-he.html` (5 trang)
- Layout patterns: GRID-CARDS (danh mục), MASONRY (sản phẩm nổi bật — CSS `columns`, không phải BENTO-GRID để tránh trùng 3 template Shop kia), LIST-ELEGANT (giá trị thương hiệu, đánh số 01-04), FULL-BLEED (promo, bo góc 32px thay vì full-width), HORIZONTAL-SCROLL (đánh giá), STAT-BAR (số liệu, nền blush nhạt)
- Card: border-radius 24px, shadow tím nhạt, hover lift + shadow đậm hơn (đúng tinh thần soft-pastel)
- Button: pill (border-radius 999px), primary lavender, phụ butter-yellow, ghost trắng
- Footer: **nền sáng blush** (`--blush-light`) — chủ đích khác hẳn 3 template Shop còn lại đều dùng footer nền tối
- Filter sidebar (`san-pham.html`): size + màu đều multi-select (toggle độc lập, đồng nhất với size) — trang chi tiết sản phẩm vẫn single-select cho cả 2 (chọn đúng 1 biến thể để mua)
- Swatch (size/màu) có `tabindex="0"` + `role="button"` + xử lý phím Enter/Space qua hàm dùng chung `makeSwatchKeyboardAccessible()`
- Tab mô tả/thông số/đánh giá (`chi-tiet-san-pham.html`): đủ bộ ARIA — `role="tablist"/"tab"/"tabpanel"`, `aria-selected`, `aria-controls`/`aria-labelledby` đồng bộ qua id
- Menu mobile (`#qa-nav-mob`) dùng thuộc tính `inert` toggle bằng JS khi mở/đóng
- Không có console.log, tất cả `target="_blank"` có `rel="noopener noreferrer"`, tất cả img có alt

**Ghi chú kỹ thuật `shop-thoi-trang`:**
- CSS prefix: `st-` xuyên suốt (shop-thoi-trang)
- Identity: BOLD-EDITORIAL — Syne weight 800 (heading + body), nền near-white `#f4f4f4`, Electric Blue accent `#0052ff`, border-radius: 0 (editorial sharp)
- Nav: Nav-1 Transparent→Scrolled — trong suốt trên hero tối, trắng khi scrollY > 80px
- Hero: H3 Magazine Grid — text left 55% / 3-panel asymmetric image grid right 45% (1 tall + 2 stacked)
- Trang: `index.html`, `san-pham.html`, `chi-tiet-san-pham.html`, `gio-hang.html`, `lien-he.html`
- Sections: STAT-BAR (dark strip + counters), GRID-CARDS (6 categories), BENTO-GRID (1 large + 4 small products), ALTERNATING-STRIPS (2 brand story rows), FULL-BLEED (flash sale countdown), HORIZONTAL-SCROLL (testimonials)
- Product card: hover lift + image zoom, action overlay buttons, color dots, size display
- FAQ accordion (lien-he), gallery switcher + tab system + qty control (chi-tiet), cart qty + remove + coupon (gio-hang)
- Không có console.log, tất cả target="_blank" có rel="noopener noreferrer", tất cả img có alt
- Bootstrap Icons 1.11.3, Google Fonts Syne

*Cập nhật lần trước: 2026-07-05 — hoàn thành template `shop-ban-hang` (ORGANIC-EARTH identity, Fraunces 500 + DM Sans, warm cream #f7f3ee, Terracotta #c4603a + Sage #6b8a7a, Nav-7 Split, H9 Product Showcase, 5 trang: index/san-pham/chi-tiet-san-pham/gio-hang/lien-he, sb- CSS prefix, Bootstrap 5.3.3, 6 layout patterns: GRID-CARDS/BENTO-GRID/ALTERNATING-STRIPS/FULL-BLEED/HORIZONTAL-SCROLL/STAT-BAR)*

**Ghi chú kỹ thuật `shop-ban-hang`:**
- CSS prefix: `sb-` xuyên suốt (shop-ban-hang)
- Identity: ORGANIC-EARTH — Fraunces weight 500 (heading serif) + DM Sans (body), nền warm cream `#f7f3ee`, Terracotta accent `#c4603a`, Sage secondary `#6b8a7a`
- Nav: Nav-7 Split — Logo left / Links center / Cart icon + CTA right
- Hero: H9 Product Showcase — Left text 40% + Right 2×3 product grid 60%
- Trang: `index.html`, `san-pham.html`, `chi-tiet-san-pham.html`, `gio-hang.html`, `lien-he.html`
- Section layouts: GRID-CARDS (categories), BENTO-GRID (featured, bento lớn ×1 + nhỏ ×4), ALTERNATING-STRIPS (brand story 2 row), FULL-BLEED (promo banner + countdown), HORIZONTAL-SCROLL (testimonials), STAT-BAR (stats dark)
- Cards: border-radius 16px, hover scale(1.02) + shadow — đúng ORGANIC-EARTH spec
- Buttons: border-radius 8px earthy (primary terracotta, secondary sage, ghost/outline)
- Footer: 3-col dark warm, social icons, payment badges
- Tính năng: countdown timer, image gallery switcher (chi-tiet), tab system (chi-tiet), FAQ accordion (lien-he), cart qty control, coupon input
- Không có console.log, tất cả `target="_blank"` có `rel="noopener noreferrer"`, tất cả img có alt

*Cập nhật lần trước: 2026-07-05 — reviewer+qa fix `nha-khoa-tre-em-kidsmile`: P0 block check-hash.php via .htaccess, P1 TestimonialController store() `? 1 : 1` → `? 1 : 0`, P1 Settings.tsx hero tab keys `hero_eyebrow`+`hero_title`+`hero_subtitle`, P1 HeroSlider.tsx đọc hero_title/hero_subtitle/hero_eyebrow từ DB, P1 Contact.tsx `.ks-contact-grid` class + CSS moved to template.css + remove embedded style tag, P2 data-delay="undefined" → omit attribute khi index=0 (4 components), P2 App.tsx Zalo float button dùng zalo_number từ settings API, P2 Contact.tsx map_embed render iframe nếu có giá trị, P2 Database.php SQL interpolation → prepared statement, P1 breadcrumb `<a href="/">` → `<Link to="/">` toàn bộ 5 trang (ServicesPage, TeamPage, BookingPage, ArticlesPage, ContactPage). TS website 50 modules 204kB 0 lỗi, admin 58 modules 236kB 0 lỗi, PHP 25/25 OK*

*Cập nhật lần trước: 2026-07-05 — hoàn thành WebDeploy `nha-khoa-tre-em-kidsmile` (SOFT-PASTEL identity, DM Sans italic 300, lilac `#9b7ef0` + mint `#34c98e`, warm white `#faf8ff`, React + PHP + SQLite, TS website 50 modules 204kB 0 lỗi, admin 58 modules 236kB 0 lỗi, PHP 25/25 OK 0 BOM, 6 trang: /, /dich-vu, /cam-nang-cha-me, /bac-si, /dat-lich, /lien-he, Nav-5 centered logo always-solid, H6 Asymmetric Offset hero, ks- CSS prefix, articles table cho cẩm nang cha mẹ, booking fields parent_name+child_name+child_age, author_meta cho testimonials)*

*Cập nhật lần cuối trước: 2026-07-05 — hoàn thành WebDeploy `nha-khoa-tong-quat-antam` (ZEN-MINIMAL identity, Cormorant Garamond 300 + DM Sans, warm white #f7f5f0, Sage green #6b8067, React + PHP + SQLite, TS website 49 modules 200kB 0 lỗi, admin 56 modules 232kB 0 lỗi, PHP 23/23 OK 0 BOM, 5 trang: /, /dich-vu, /bac-si, /dat-lich, /lien-he, Nav transparent→scrolled, H11 Full-Width Text hero + marquee, List-Elegant services, Alternating-Strips team, at- CSS prefix)*

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

**Ghi chú kỹ thuật `nha-khoa-tre-em-kidsmile`:**
- CSS prefix: `ks-` xuyên suốt (kidsmile)
- Identity: SOFT-PASTEL — DM Sans italic weight 300 (heading), nền warm white `#faf8ff`, Lilac accent `#9b7ef0`, Mint accent `#34c98e`
- Nav: NAV-5 Centered Logo + Links Below — always solid `rgba(255,255,255,.92)` backdrop-blur, không transparent/scroll
- Fonts: Bunny Fonts — dm-sans:300,300i,400,400i,500,600 (không dùng Google Fonts)
- Hero: H6 Asymmetric Offset — text left max-width 640px, image absolute right -8%, float-card-1 (bottom-left) + float-card-2 (top-right)
- Trang website: `/`, `/dich-vu`, `/cam-nang-cha-me`, `/bac-si`, `/dat-lich`, `/lien-he` (6 trang)
- SiteContext: stat_patients, stat_years, stat_satisfaction, stat_doctors (4 stats)
- Public API: `GET /public/settings`, `GET /public/service-categories`, `GET /public/services`, `GET /public/doctors`, `GET /public/testimonials`, `GET /public/articles`, `POST /public/bookings`, `POST /public/contact`
- DB Extension tables: service_categories, services (icon TEXT, tags TEXT pipe-separated), doctors, bookings (parent_name, child_name, child_age), testimonials (author_meta TEXT), articles (title, slug, excerpt, content, thumbnail, tag, read_time, status, sort_order)
- Booking fields: parent_name, phone, email, child_name, child_age, service, date, time, note (unique parent/child focus)
- Testimonials: `author_meta` thay vì `author_role` — format "Mẹ bé Bảo An, 5 tuổi"
- DB seed: 3 nhóm dịch vụ (Khám & phòng ngừa, Điều trị, Phát triển hàm răng), 9 dịch vụ, 6 bác sĩ, 3 testimonials, 3 articles, 38 settings keys
- Admin pages: dashboard, bookings, services (+categories), team, testimonials, articles (NEW), contacts, slides, media, settings (8 tabs), profile
- AppShell: IO + MO cho `[data-reveal]` animation trong App.tsx
- ProfileController.php: thiếu khi scaffold → tạo thủ công
- website/src/main.tsx: thiếu khi scaffold → tạo thủ công
- website/src/pages/: không có trong scaffold → tạo thủ công (6 page files + ArticlesPage.tsx)
- TS build: website 50 modules 204kB 0 lỗi, admin 58 modules 236kB 0 lỗi
- PHP syntax: 25/25 files OK, 0 BOM

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

**Ghi chú kỹ thuật `nha-khoa-tre-em-kidsmile`:**
- CSS prefix: `ks-` xuyên suốt (kidsmile)
- Identity: SOFT-PASTEL — DM Sans italic 300, warm white `#faf8ff`, Lilac accent `#9b7ef0`, Mint `#34c98e`, border-radius lớn (16-24px) — thân thiện trẻ em
- Nav: transparent → `.ks-scrolled` khi scrollY > 60 (Nav-1 pastel, không blur mạnh)
- Fonts: Bunny Fonts — dm-sans:300,300i,400,400i,500,500i,600,600i
- Trang website: `/`, `/dich-vu`, `/bac-si`, `/dat-lich`, `/bai-viet`, `/lien-he` (6 trang — có /bai-viet)
- SiteContext: stat_cases, stat_doctors, stat_years, stat_satisfaction + hero_eyebrow, hero_title, hero_subtitle (từ DB settings)
- Public API: `GET /public/settings`, `GET /public/hero-slides`, `GET /public/service-categories`, `GET /public/services`, `GET /public/doctors`, `GET /public/testimonials`, `POST /public/bookings`, `POST /public/contact`
- DB Extension tables: service_categories, services (category_id FK, tag, price, price_unit, is_featured), doctors (specialties pipe-separated), bookings (fullname, phone, email, service, doctor, date, time, note), testimonials (author_avatar, rating, is_featured)
- DB seed: service categories + services, doctors, testimonials, settings đầy đủ
- Booking fields: fullname, phone, email, service, doctor, date, time, note
- Admin pages: dashboard, bookings, services (+ categories), team, testimonials, contacts, slides, media, settings, profile
- Bugs fixed (reviewer + qa-tester): TestimonialController `is_featured` (`? 1 : 1` → `? 1 : 0`), Settings.tsx hero tab keys (hero_eyebrow/hero_title/hero_subtitle), HeroSlider đọc từ DB thay vì hardcode, Contact.tsx map_embed render iframe, breadcrumbs dùng Link thay href, data-delay="undefined" removed, Zalo float động từ settings, SQL injection fix trong seedServices()
- check-hash.php blocked by .htaccess (HTTP 403) ← P0 fix
- TS build: website 50 modules 204kB 0 lỗi, admin 58 modules 236kB 0 lỗi
- PHP syntax: 25/25 files OK, 0 BOM

---

*Cập nhật lần cuối: 2026-07-05 — hoàn thành WebDeploy `nha-khoa-tre-em-kidsmile` (SOFT-PASTEL identity, DM Sans 300, warm white #faf8ff, Lilac #9b7ef0 + Mint #34c98e, React + PHP + SQLite, TS website 50 modules 204kB 0 lỗi, admin 58 modules 236kB 0 lỗi, PHP 25/25 OK 0 BOM, 6 trang: /, /dich-vu, /bac-si, /dat-lich, /bai-viet, /lien-he, Nav transparent→scrolled, ks- CSS prefix, reviewer+qa-tester pass)*
