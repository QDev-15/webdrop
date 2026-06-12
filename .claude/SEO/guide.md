# SEO Guide — webdrop.vn

> Cập nhật lần cuối: 2026-06-12

---

## 1. Những gì đã implement (code)

### 1.1 Crawlability — Google discovery

| File | URL | Tác dụng |
|---|---|---|
| `Sources/system/app/sitemap.ts` | `/sitemap.xml` | Tự động tạo sitemap gồm trang tĩnh + mọi template published + mọi bài blog published |
| `Sources/system/app/robots.ts` | `/robots.txt` | Cho phép crawl `/`, chặn `/admin/`, `/api/`, `/checkout/` |

**Sitemap bao gồm:**
- Trang tĩnh: `/`, `/templates`, `/pricing`, `/lich-bong-da`, `/blog`, `/how-it-works`, `/about`, `/contact`, `/faq`
- Dynamic: `/templates/[slug]` — tự cập nhật khi thêm template mới
- Dynamic: `/blog/[slug]` — tự cập nhật khi publish bài mới

**Việc cần làm:** Vào Google Search Console → Sitemaps → Submit `https://webdrop.vn/sitemap.xml`

---

### 1.2 Root Layout (`app/layout.tsx`)

**Đã thêm:**
- `metadataBase: new URL(BASE)` — Next.js resolve relative URL trong OG/twitter đúng
- `viewport` export: `width=device-width`, `initialScale=1`, `themeColor=#1a6b52`
- Default `openGraph` cho mọi trang: `type: website`, `locale: vi_VN`, `siteName: webdrop.vn`
- Default `twitter: summary_large_image` cho mọi trang
- `robots: { googleBot: { max-snippet: -1, max-image-preview: large } }` — Google hiện ảnh lớn
- **Organization JSON-LD** (schema.org) — Google hiểu webdrop.vn là doanh nghiệp hợp lệ

---

### 1.3 Structured Data / JSON-LD (Rich Results)

| Trang | Schema type | Lợi ích Google |
|---|---|---|
| Root layout | `Organization` | Knowledge panel, brand trust |
| `/templates/[slug]` | `Product` + `Offer` | Hiện giá VNĐ trong kết quả, Google Shopping |
| `/blog/[slug]` | `Article` | Thumbnail lớn trong kết quả, ngày đăng |
| `/lich-bong-da` | `SportsEvent` | Rich snippet World Cup 2026 |

**Kiểm tra:** Dùng [Google Rich Results Test](https://search.google.com/test/rich-results) để verify JSON-LD đúng.

---

### 1.4 Metadata từng trang

| Trang | Title | Description | Canonical | OG/Twitter |
|---|---|---|---|---|
| `/` | ✅ | ✅ | ✅ | ✅ |
| `/templates` | ✅ | ✅ | — | ✅ (default) |
| `/templates/[slug]` | ✅ tên template + category | ✅ mô tả Bootstrap + ngành | ✅ | ✅ ảnh template |
| `/pricing` | ✅ | ✅ có giá từ | ✅ | ✅ (default) |
| `/blog` | ✅ | ✅ | ✅ | ✅ (default) |
| `/blog/[slug]` | ✅ tiêu đề bài | ✅ excerpt | ✅ | ✅ thumbnail bài |
| `/lich-bong-da` | ✅ keyword WC 2026 | ✅ dài + keywords | ✅ | ✅ OG riêng |
| `/how-it-works` | ✅ | ✅ | ✅ | ✅ (default) |
| `/about` | ✅ | ✅ | ✅ | ✅ (default) |
| `/contact` | ✅ | ✅ | — | ✅ (default) |
| `/faq` | ✅ | ✅ | ✅ | ✅ (default) |

---

### 1.5 Trang `/lich-bong-da` — SEO Traffic Hack

Trang này được tạo chủ yếu để thu hút traffic tự nhiên từ Google, sau đó convert sang khách mua template/website.

**Keywords mục tiêu:**
- `lịch thi đấu World Cup 2026`
- `tỉ số WC 2026 trực tiếp`
- `xem bóng đá World Cup 2026`
- `bảng xếp hạng World Cup 2026`

**Tính năng:**
- Lịch thi đấu + tỉ số live (polling 30s khi có trận đang diễn ra)
- Bảng xếp hạng nhóm
- YouTube embed khi có stream chính thức (admin set)
- Dữ liệu từ football-data.org (free API)
- SportsEvent JSON-LD schema

**Cài đặt:**
1. Đăng ký tại [football-data.org](https://www.football-data.org/account) → lấy API key miễn phí
2. Admin → Cài đặt → Tích hợp → `Football API Key` → dán key vào
3. Khi có trận live có YouTube official: Admin → `YouTube Live` → dán video ID

---

## 2. Việc cần làm thủ công

### 2.1 Ảnh OG (quan trọng cho social share)

Tạo file `Sources/system/public/og-default.jpg` (1200×630px):
- Background: màu `#0c0b09` (dark)
- Logo webdrop.vn trắng ở giữa
- Tagline: "Mẫu web đẹp, triển khai trọn gói"
- Dùng Canva/Figma tạo rồi export JPEG chất lượng cao

Tương tự tạo `public/og-wc2026.jpg` cho trang lịch bóng đá.

### 2.2 Google Search Console

1. Vào [search.google.com/search-console](https://search.google.com/search-console)
2. Add property → `https://webdrop.vn`
3. Verify qua DNS TXT record (cách dễ nhất)
4. Sitemaps → Add sitemap → `https://webdrop.vn/sitemap.xml`
5. Theo dõi: Impressions, Clicks, Average Position theo tuần

### 2.3 Google Analytics

1. Tạo tài khoản GA4 tại [analytics.google.com](https://analytics.google.com)
2. Lấy Measurement ID dạng `G-XXXXXXXXXX`
3. Admin → Cài đặt → SEO → `Google Analytics ID` → dán ID vào

---

## 3. Chiến lược SEO dài hạn

### 3.1 Content SEO (quan trọng nhất)

Viết bài blog nhắm vào intent tìm kiếm của khách hàng mục tiêu:

**Nhóm keyword ưu tiên:**

| Keyword | Volume ước tính | Intent |
|---|---|---|
| thiết kế website nhà hàng | Cao | Transactional |
| mẫu website cafe đẹp | Trung | Transactional |
| website spa thẩm mỹ viện | Trung | Transactional |
| template website bootstrap | Trung | Informational |
| làm website bán hàng giá rẻ | Cao | Transactional |
| thuê làm website theo yêu cầu | Cao | Transactional |
| website nhỏ cho doanh nghiệp | Trung | Transactional |
| lịch world cup 2026 | Cao (thời điểm) | Informational |

**Bài blog nên viết:**
- "Top 5 mẫu website nhà hàng đẹp nhất 2026"
- "Chi phí làm website nhà hàng hết bao nhiêu?"
- "Website spa cần những tính năng gì?"
- "So sánh Wix vs WordPress vs thuê làm riêng"
- "Checklist SEO cho website nhà hàng"
- "Tại sao website load chậm làm mất khách?"

### 3.2 On-page SEO checklist cho mỗi trang mới

- [ ] Title < 60 ký tự, chứa keyword chính
- [ ] Description 150–160 ký tự, có call-to-action
- [ ] Canonical URL đúng
- [ ] H1 duy nhất, chứa keyword
- [ ] Alt text cho tất cả ảnh
- [ ] Internal link đến trang liên quan
- [ ] Schema markup phù hợp

### 3.3 Technical SEO — cần cải thiện thêm

**Hiện trạng:**
- ❌ Hầu hết ảnh dùng `<img>` thay vì `<Image>` của Next.js → không tự optimize
- ❌ Chưa có LCP image `priority` prop cho hero sections
- ❌ Không có FAQ schema (tốt cho featured snippets)
- ✅ Font DM Sans qua next/font/google — tự preload
- ✅ Bootstrap qua CDN — cached tốt
- ✅ ISR (revalidate: 60) cho các trang DB-dependent

**Việc cần làm khi có thời gian:**
1. Chuyển hero/banner images sang `<Image priority>` của Next.js
2. Thêm `FAQPage` JSON-LD cho trang `/faq`
3. Thêm `BreadcrumbList` JSON-LD cho template detail và blog detail
4. Thêm `WebSite` JSON-LD với `SearchAction` (sitelinks searchbox)

### 3.4 Off-page SEO (Backlink)

Ưu tiên theo độ khó:

**Dễ, làm ngay:**
- Đăng showcase trên các group Facebook: "Cộng đồng Web Developer Việt Nam", "Startup Việt", "SME Digital"
- Đăng lên Reddit r/webdev (tiếng Anh) nếu có template đẹp
- Tạo profile trên ProductHunt, Indie Hackers
- Đăng lên các diễn đàn: voz.vn, tinhte.vn

**Trung bình:**
- Viết guest post cho các blog tech VN (toidicodedao, viblo.asia)
- Tạo video YouTube demo template → link về webdrop.vn
- TikTok/Reels: quay màn hình demo template đẹp

**Dài hạn:**
- Partnership với các đơn vị đào tạo web/marketing
- PR trên các báo công nghệ (ICTnews, VnReview)

---

## 4. Trang bóng đá — SEO Traffic Funnel

```
User tìm "lịch world cup 2026" trên Google
    ↓
Vào trang /lich-bong-da
    ↓
Xem lịch thi đấu, quay lại nhiều lần trong mùa giải
    ↓
Thấy navbar webdrop.vn → tò mò → vào /templates
    ↓
Thấy mẫu web phù hợp → checkout hoặc liên hệ
```

**Tips tối ưu trang này:**
- Chia sẻ link lên các group bóng đá Facebook trước mỗi trận
- Viết bài blog đi kèm: "Xem World Cup 2026 ở đâu? Lịch thi đấu đầy đủ"
- Cập nhật `football_youtube_embed` ngay khi có stream YouTube chính thức
- Trang sẽ có traffic cao nhất trong khoảng 11/06/2026 – 19/07/2026

---

## 5. Theo dõi & đo lường

| Công cụ | Dùng để theo dõi | Tần suất |
|---|---|---|
| Google Search Console | Impressions, clicks, ranking keywords | Hàng tuần |
| Google Analytics GA4 | Traffic, bounce rate, conversion | Hàng tuần |
| [PageSpeed Insights](https://pagespeed.web.dev) | Core Web Vitals (LCP, CLS, FID) | Mỗi khi deploy lớn |
| [Rich Results Test](https://search.google.com/test/rich-results) | Verify JSON-LD schema đúng | Khi thêm schema mới |
| [Ahrefs / Ubersuggest](https://app.ubersuggest.com) | Keyword research, competitor | Hàng tháng |

**KPI mục tiêu 3 tháng đầu:**
- Organic clicks: 100+/ngày
- Top 10 Google cho ít nhất 5 keyword ngách (VD: "mẫu website cafe bootstrap")
- `/lich-bong-da` top 5 trong mùa World Cup

---

## 6. Checklist deploy SEO

Trước mỗi lần deploy lên production:

- [ ] `npx tsc --noEmit` — không có lỗi TypeScript
- [ ] Test `/sitemap.xml` — trả về XML hợp lệ
- [ ] Test `/robots.txt` — đúng cấu hình
- [ ] PageSpeed score Desktop ≥ 85, Mobile ≥ 70
- [ ] OG image hiển thị đúng: dùng [opengraph.xyz](https://www.opengraph.xyz)
- [ ] JSON-LD valid: [Rich Results Test](https://search.google.com/test/rich-results)
- [ ] Google Search Console: không có Coverage errors mới
