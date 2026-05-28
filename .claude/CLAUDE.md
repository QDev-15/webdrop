# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

---

# webdrop.vn Design System & Development Rules

> Tài liệu này là nguồn tham chiếu duy nhất cho mọi thay đổi UI/UX của dự án webdrop.vn.
> Mọi AI assistant hoặc developer đều phải đọc và tuân thủ toàn bộ nội dung này trước khi chỉnh sửa bất kỳ dòng code nào.

---

## 1. QUY TẮC VÀNG — Bắt buộc tuân thủ tuyệt đối

### 1.1 So sánh trước khi thay đổi
Trước mọi thay đổi design, bắt buộc:
1. Xem lại design gốc (file `index.html`)
2. Xác định chính xác phần cần thay đổi
3. Giữ nguyên: màu sắc, font, spacing, animation style
4. Chỉ thay đổi đúng phần được yêu cầu, không side-effect sang phần khác

### 1.2 Quy trình xử lý tính năng mới (Bug-free Workflow)
```
1. Implement tính năng mới
      ↓
2. Review toàn bộ code vừa viết
      ↓
3. Tìm và fix tất cả bug
      ↓
4. Review lại lần 2
      ↓
5. Fix tiếp nếu còn bug
      ↓
6. Lặp lại cho đến khi không còn bug
      ↓
7. Mới được merge / deploy
```
**Không bao giờ** bỏ qua bước review. Không ship code chưa review.

### 1.3 Responsive — Hỗ trợ mọi kích thước màn hình
Tất cả component phải hiển thị đúng trên:

| Breakpoint | Kích thước | Ghi chú |
|---|---|---|
| Mobile S | 320px | Nhỏ nhất cần hỗ trợ |
| Mobile M | 375px | iPhone standard |
| Mobile L | 414px | iPhone Plus/Max |
| Tablet | 768px | iPad portrait |
| Laptop | 1024px | |
| Desktop | 1280px | Standard |
| Desktop L | 1440px | |
| 4K | 1920px+ | Max-width capped |

**Quy tắc responsive:**
- Dùng `clamp()` cho font-size và padding thay vì media query cứng
- Grid dùng `repeat(auto-fill, minmax(..., 1fr))` khi có thể
- Ảnh luôn có `width:100%; height:auto` hoặc `object-fit:cover`
- Touch target tối thiểu 44×44px trên mobile
- Không dùng `overflow:hidden` trên `body` ngoại trừ hero section

---

## 2. CÔNG NGHỆ SỬ DỤNG

### 2.1 Frontend Web
```
HTML5 + CSS3 thuần (không framework CSS)
JavaScript ES6+ thuần (không jQuery)
React (cho các component phức tạp / SPA)
```

### 2.2 Mobile
```
React Native (iOS + Android)
Expo (build & deploy)
```

### 2.3 Nguyên tắc CSS
- **Không dùng**: Bootstrap, Tailwind, Material UI, hay bất kỳ CSS framework nào
- **Dùng**: CSS Variables, Flexbox, CSS Grid, CSS Animations
- **Viết CSS theo thứ tự**: Layout → Typography → Color → Spacing → Animation
- Mọi màu sắc đều phải tham chiếu qua CSS Variables, không hardcode hex trực tiếp trong component

### 2.4 React
- Functional components + Hooks
- Không dùng class components
- State management: React Context hoặc Zustand (không Redux)
- Styling trong React: CSS Modules hoặc inline style với design token object

### 2.5 React Native
- StyleSheet.create() cho tất cả styles
- Không dùng inline style ngoại trừ dynamic styles
- Navigation: React Navigation v6+
- Giữ nguyên design token màu sắc đồng nhất với web

---

## 3. DESIGN SYSTEM

### 3.1 Typography

**Font chính duy nhất:** `DM Sans` — dùng cho 100% text trong toàn bộ dự án

```css
font-family: 'DM Sans', sans-serif;
```

**Import:**
```html
<link href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;1,9..40,400&display=swap" rel="stylesheet">
```

**Font weight được dùng:**
| Weight | Dùng cho |
|---|---|
| 300 | Body text, mô tả, placeholder |
| 400 | Text thông thường |
| 500 | Label, button, nav link |
| 600 | Heading, title, price, logo |

**Scale font:**
| Token | Size | Dùng cho |
|---|---|---|
| `--fs-xs` | 11px | Eyebrow, label nhỏ, meta |
| `--fs-sm` | 13px | Body nhỏ, caption |
| `--fs-base` | 14–15px | Body mặc định |
| `--fs-md` | 16–17px | Subheading, intro |
| `--fs-lg` | `clamp(22px,2.5vw,28px)` | Section sub-title |
| `--fs-xl` | `clamp(26px,3.5vw,40px)` | Section title |
| `--fs-hero` | `clamp(38px,5.5vw,76px)` | Hero headline |

### 3.2 Color Palette

```css
:root {
  /* Backgrounds */
  --bg:           #faf9f7;   /* Page background — kem nhạt */
  --surface:      #ffffff;   /* Card, panel */
  --warm:         #f5f0e8;   /* Tint nhẹ — thumbnail bg, input bg */
  --warm2:        #ede8df;   /* Border nhạt hơn */
  --dark:         #0c0b09;   /* Footer bg */
  --dark2:        #141210;   /* Hero bg, dark section */

  /* Text */
  --text:         #1a1917;   /* Primary text */
  --text-2:       #6b6760;   /* Secondary text, mô tả */
  --text-3:       #a09d97;   /* Placeholder, meta, muted */

  /* Brand — Green */
  --accent:       #1a6b52;   /* Primary action, CTA */
  --accent-h:     #155a44;   /* Hover state của accent */
  --accent-light: #e8f4ef;   /* Accent background tint */
  --accent-mid:   #2d9b73;   /* Accent medium — border, icon */

  /* Border */
  --border:       #e8e5df;   /* Border mặc định */
  --border-light: #f0ede8;   /* Border nhạt hơn — divider */

  /* Layout */
  --max:  1100px;            /* Max content width */
  --pad:  clamp(20px,5vw,80px); /* Horizontal padding responsive */
}
```

**Quy tắc màu:**
- Nền trang: `--bg` (kem), không dùng trắng thuần
- Nền card/panel: `--surface` (trắng)
- Text chính: `--text` (#1a1917) — không dùng đen thuần (#000)
- Không thêm màu mới ngoài palette trên, trừ khi có yêu cầu rõ ràng

### 3.3 Spacing

Dùng bội số của 4px:

```
4, 8, 12, 16, 20, 24, 28, 32, 40, 48, 56, 64, 72, 80, 96, 128
```

**Section padding:**
```css
section { padding: clamp(72px, 10vw, 128px) 0; }
```

**Inner container:**
```css
.inner { max-width: var(--max); margin: 0 auto; padding: 0 var(--pad); }
```

### 3.4 Border Radius

| Dùng cho | Value |
|---|---|
| Pill / Badge / Tag | `20px` hoặc `9999px` |
| Button | `8–9px` |
| Card nhỏ | `10px` |
| Card lớn / Panel | `14px` |
| Section visual / Feature block | `16–20px` |
| Avatar tròn | `50%` |

### 3.5 Shadow

```css
/* Card hover */
box-shadow: 0 20px 52px rgba(0,0,0,0.10);

/* Panel nhẹ */
box-shadow: 0 8px 32px rgba(0,0,0,0.06);

/* Button hover */
box-shadow: 0 8px 24px rgba(0,0,0,0.14);
```

Không dùng shadow nặng (`rgba(0,0,0,0.3+)`). Tối đa 3 level shadow trong toàn trang.

---

## 4. ANIMATION & TRANSITIONS

### 4.1 Nguyên tắc animation
- **Mượt mà, nhẹ nhàng** — không flashy, không distract
- Duration: 200–800ms. Không quá 1s ngoại trừ hero
- Easing chuẩn: `cubic-bezier(0.16, 1, 0.3, 1)` (spring-like)
- Easing exit: `cubic-bezier(0.4, 0, 0.6, 1)`

### 4.2 Scroll Reveal

```css
.reveal {
  opacity: 0;
  transform: translateY(32px);
  transition: opacity 0.72s cubic-bezier(0.16,1,0.3,1),
              transform 0.72s cubic-bezier(0.16,1,0.3,1);
}
.reveal.visible {
  opacity: 1;
  transform: none;
}
/* Stagger delays */
.reveal-d1 { transition-delay: 0.08s; }
.reveal-d2 { transition-delay: 0.16s; }
.reveal-d3 { transition-delay: 0.24s; }
.reveal-d4 { transition-delay: 0.32s; }
```

**IntersectionObserver config:**
```js
new IntersectionObserver(cb, {
  threshold: 0.1,
  rootMargin: '0px 0px -36px 0px'
})
```

### 4.3 Hero Slider Animation

Slide chuyển theo hướng:
- **Next (→):** Slide cũ exit trái (`leaveToLeft`), slide mới enter từ phải (`enterFromRight`)
- **Prev (←):** Slide cũ exit phải (`leaveToRight`), slide mới enter từ trái (`enterFromLeft`)

```css
@keyframes enterFromRight {
  from { opacity: 0; transform: translateX(52px); }
  to   { opacity: 1; transform: translateX(0); }
}
@keyframes enterFromLeft {
  from { opacity: 0; transform: translateX(-52px); }
  to   { opacity: 1; transform: translateX(0); }
}
@keyframes leaveToLeft {
  from { opacity: 1; transform: translateX(0); }
  to   { opacity: 0; transform: translateX(-36px); }
}
@keyframes leaveToRight {
  from { opacity: 1; transform: translateX(0); }
  to   { opacity: 0; transform: translateX(36px); }
}
```

**Auto-advance:** 5000ms. Progress indicator: 5 dấu gạch ngang `_____`, không có số đếm, không có nút mũi tên.

### 4.4 Hover Effects

```css
/* Card lift */
.card:hover { transform: translateY(-7px); transition: 0.28s; }

/* Image zoom inside card */
.card:hover img { transform: scale(1.06); transition: 0.4s ease; }

/* Button */
.btn:hover { transform: translateY(-1px); opacity: 0.92; }

/* Nav link */
.nav-link { transition: color 0.25s; }
```

---

## 5. CẤU TRÚC TRANG — HOMEPAGE

### 5.1 Thứ tự section

```
nav (sticky, transparent → frosted glass khi scroll)
  ↓
#hero (100vh, dark bg #141210, auto slider 5 slides)
  ↓
#how (Quy trình 4 bước, light bg)
  ↓
#templates (Grid 3 cột, 6 mẫu, filter pills)
  ↓
#why (Dark bg, grid 4 cột lợi ích)
  ↓
#pricing (3 gói, card grid, light bg)
  ↓
#reviews (3 testimonial cards, bg kem)
  ↓
.clients-strip (Logo bar, grayscale)
  ↓
#cta (Full-width banner, accent green bg)
  ↓
.footer-image-strip (Panoramic office photo)
  ↓
footer (Dark bg, 4 columns + map + contact)
```

### 5.2 Nav Behavior

```
Trạng thái ban đầu (trên hero):
- Background: transparent
- Logo, links: màu trắng
- CTA button: nền trắng, text tối

Sau khi scroll > 60px:
- Background: rgba(250,249,247,0.9) + backdrop-filter:blur(16px)
- Border-bottom: 1px solid var(--border)
- Logo, links: màu text tối
- CTA button: nền tối, text trắng
```

### 5.3 Section Header Pattern (căn giữa)

Tất cả section header đều dùng pattern này:

```html
<div class="sec-head reveal">
  <div class="eyebrow">Từ khóa ngắn</div>
  <h2 class="sec-title">Tiêu đề chính <em>nhấn mạnh</em></h2>
  <p class="sec-sub">Mô tả ngắn, tối đa 2 dòng, căn giữa.</p>
</div>
```

```css
.sec-head { text-align: center; margin-bottom: clamp(40px,6vw,64px); }
.eyebrow {
  display: inline-flex; align-items: center; gap: 7px;
  font-size: 11px; font-weight: 500; color: var(--accent);
  text-transform: uppercase; letter-spacing: 1.4px; margin-bottom: 14px;
}
.eyebrow::before, .eyebrow::after {
  content: ''; width: 16px; height: 1px; background: var(--accent);
}
.sec-title {
  font-size: clamp(26px,3.8vw,46px); font-weight: 600;
  letter-spacing: -0.8px; line-height: 1.1; margin-bottom: 14px;
}
.sec-title em { color: var(--accent); font-style: italic; font-weight: 300; }
.sec-sub { font-size: 15.5px; font-weight: 300; max-width: 520px; margin: 0 auto; }
```

**Dark section** thêm class `.dark` vào `.sec-head`:
```css
.sec-head.dark .eyebrow { color: #4ade80; }
.sec-head.dark .sec-title { color: #fff; }
.sec-head.dark .sec-sub { color: rgba(255,255,255,0.38); }
```

---

## 6. COMPONENT LIBRARY

### 6.1 Buttons

```css
/* Primary — Dark */
.btn-primary {
  background: var(--text); color: #fff;
  padding: 12px 24px; border-radius: 9px;
  font-size: 13.5px; font-weight: 500;
  border: none; cursor: pointer;
  transition: all 0.2s;
}
.btn-primary:hover { background: #3f3f46; transform: translateY(-1px); }

/* Primary — Accent */
.btn-accent {
  background: var(--accent); color: #fff;
  /* same structure */
}
.btn-accent:hover { background: var(--accent-h); }

/* Outline */
.btn-outline {
  background: transparent; color: var(--text);
  border: 1px solid var(--border);
  padding: 12px 24px; border-radius: 9px;
}
.btn-outline:hover { background: var(--warm); }

/* Ghost (trên dark bg) */
.btn-ghost {
  background: transparent; color: rgba(255,255,255,0.7);
  border: 1px solid rgba(255,255,255,0.2);
}
.btn-ghost:hover { border-color: rgba(255,255,255,0.6); color: #fff; }
```

### 6.2 Cards

```css
.card {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 14px;
  padding: 24px;
  transition: transform 0.28s cubic-bezier(0.16,1,0.3,1),
              box-shadow 0.28s, border-color 0.2s;
}
.card:hover {
  transform: translateY(-7px);
  box-shadow: 0 20px 52px rgba(0,0,0,0.10);
  border-color: transparent;
}
```

### 6.3 Badges / Tags

```css
/* Eyebrow badge */
.badge {
  display: inline-flex; align-items: center; gap: 5px;
  font-size: 10–11px; font-weight: 500;
  padding: 3px 10px; border-radius: 20px;
}
.badge-green { background: var(--accent-light); color: var(--accent); }
.badge-dark  { background: var(--text); color: #fff; }

/* Tag (filter pill) */
.pill {
  font-size: 12.5px; padding: 7px 16px;
  border-radius: 20px; border: 1px solid var(--border);
  background: var(--surface); color: var(--text-2);
  cursor: pointer; transition: all 0.15s;
}
.pill.active { background: var(--text); color: #fff; border-color: var(--text); }
```

### 6.4 Form Elements

```css
.input {
  height: 40px; border: 1px solid var(--border);
  border-radius: 8px; padding: 0 12px;
  font-size: 14px; font-family: var(--sans);
  background: var(--surface); color: var(--text);
  transition: border-color 0.15s, box-shadow 0.15s;
  outline: none;
}
.input:focus {
  border-color: var(--accent);
  box-shadow: 0 0 0 3px rgba(26,107,82,0.08);
}
.input.error {
  border-color: #e24b4a;
  box-shadow: 0 0 0 3px rgba(226,75,74,0.08);
}
```

---

## 7. IMAGES & MEDIA

### 7.1 Nguồn ảnh

**Unsplash** (free, high quality): `https://images.unsplash.com/photo-{id}?w={width}&q=80&auto=format&fit=crop`

**Query params chuẩn:**
- Hero/fullwidth: `?w=1400&q=70`
- Section wide: `?w=1200&q=80`
- Card thumbnail: `?w=600&q=80`
- Avatar: `?w=100&q=80&fit=crop&crop=face`

### 7.2 Image IDs đang dùng

| Vị trí | Unsplash Photo ID | Mô tả |
|---|---|---|
| Slide 1 bg | `1547658719-da2b51169166` | Web design workspace |
| Slide 2 bg | `1460925895917-afdab827c52f` | Analytics screen |
| Slide 3 bg | `1558655146-d09347e92766` | Design tool |
| Slide 4 bg | `1553484771-371a605b060b` | Business planning |
| Slide 5 bg | `1521737711867-e3b97375f902` | Team meeting |
| How it works | `1498050108023-c5249f4df085` | Laptop workspace |
| Card 1 (Cty) | `1467232004584-a241de8bcf5d` | Corporate web |
| Card 2 (Portfolio) | `1545665277-5937489579f2` | Dark portfolio |
| Card 3 (F&B) | `1414235077428-338989a2e8c0` | Restaurant |
| Card 4 (Blog) | `1499750310107-5fef28a66643` | Blog writing |
| Card 5 (Spa) | `1544161515-4ab6ce6db874` | Spa treatment |
| Card 6 (Forum) | `1522202176988-66273c2fd55f` | Team community |
| Why us banner | `1600880292203-757bb62b4baf` | Office team |
| Footer strip | `1497366216548-37526070297c` | Modern office |
| Avatar 1 | `1507003211169-0a1dd7228f2d` | Male portrait |
| Avatar 2 | `1494790108377-be9c29b29330` | Female portrait |
| Avatar 3 | `1472099645785-5658abf4ff4e` | Male casual |

### 7.3 CSS Image Rules

```css
/* Luôn dùng object-fit cho ảnh trong container cố định */
img { display: block; width: 100%; height: 100%; object-fit: cover; }

/* Thumbnail card — zoom on hover */
.card-thumb img { transition: transform 0.4s ease; }
.card:hover .card-thumb img { transform: scale(1.06); }

/* Avatar */
.avatar img { width: 34px; height: 34px; border-radius: 50%; object-fit: cover; }
```

---

## 8. SLIDER SPECIFICATION

### 8.1 Cấu trúc 5 slides

| # | Chủ đề | Nội dung chính | CTA |
|---|---|---|---|
| 1 | Main intro | Hero title + stats bar | Xem mẫu / Cách hoạt động |
| 2 | Features | 4 feature bullets | Xem quy trình / Bảng giá |
| 3 | Categories | 6 card grid ngành nghề | Xem tất cả mẫu |
| 4 | Pricing | 3 pricing preview cards | Xem chi tiết / Xem mẫu trước |
| 5 | Testimonial | Quote + author | Đặt hàng ngay / Xem đánh giá |

### 8.2 Slide content — căn giữa

Tất cả nội dung trong slide phải căn giữa:
```css
.slide-inner {
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
}
```

Ngoại lệ: `.sl-features` và `.sl-feat` giữ `text-align: left` vì đọc theo hàng ngang.

### 8.3 Controls

- Chỉ hiển thị: **5 dấu gạch ngang** `_ _ _ _ _` căn giữa, dưới cùng slide
- Active dot: dài hơn (52px), màu `#4ade80`
- Inactive dot: 32px, `rgba(255,255,255,0.18)`
- Hover inactive: `rgba(255,255,255,0.38)`
- **Không hiển thị**: số đếm, nút `‹ ›`, progress bar

### 8.4 Auto-advance

```js
const AUTO_MS = 5000; // 5 giây
// Timer reset mỗi khi user click dot hoặc tương tác
```

---

## 9. FOOTER SPECIFICATION

### 9.1 Cấu trúc footer

```
footer (dark #0c0b09)
├── ft-main (4 columns)
│   ├── Col 1: Logo + mô tả + social buttons (2fr)
│   ├── Col 2: Dịch vụ (1fr)
│   ├── Col 3: Tài nguyên (1fr)
│   └── Col 4: Công ty (1fr)
├── ft-map-strip (dark #0a0908)
│   ├── Left: Contact info (địa chỉ, SĐT, email, giờ)
│   └── Right: Google Maps embed (280px, grayscale + invert)
└── ft-bottom (darkest #080706)
    ├── Left: Copyright
    └── Right: Legal links
```

### 9.2 Map embed

```html
<iframe
  src="https://www.google.com/maps/embed?pb=..."
  style="width:100%;height:100%;border:none;
         opacity:0.7;
         filter:grayscale(100%) invert(92%) contrast(82%)">
</iframe>
```

Filter `grayscale + invert` để map hòa với theme tối của footer.

---

## 10. THÔNG TIN DỰ ÁN

```
Tên dự án:    webdrop.vn
Loại:         Web design template marketplace + deployment service
Ngôn ngữ:     Tiếng Việt (primary)
Target:       SME, hộ kinh doanh, freelancer, cá nhân tại Việt Nam
```

### 10.1 Thông tin liên hệ (placeholder)

```
Địa chỉ:   Tây Hồ, Hà Nội, Việt Nam
Zalo/Phone: 0901 234 567
Email:      hello@webdrop.vn
Giờ hỗ trợ: 8:00–18:00, Thứ 2–Thứ 7
```

### 10.2 Các page đã có

| File | Mô tả |
|---|---|
| `index.html` | Trang chủ (main) |
| `template_detail_page.html` | Trang chi tiết mẫu |
| `checkout_page.html` | Trang đặt hàng 3 bước |
| `admin_dashboard.html` | Admin quản lý đơn hàng |

### 10.3 Gói dịch vụ

| Gói | Giá | Mô tả |
|---|---|---|
| Starter | 1.200.000đ | Source code + hướng dẫn tự cài |
| Standard | 2.500.000đ | Cài đặt trọn gói + hosting + domain |
| Premium | 12.000.000đ | Custom design theo yêu cầu |
| Duy trì | 200–500k/tháng | Maintenance hàng tháng (addon) |

---

## 11. CHECKLIST TRƯỚC KHI SHIP

### UI Checklist
- [ ] Font chỉ dùng DM Sans, không có font nào khác
- [ ] Màu sắc đều tham chiếu CSS variables
- [ ] Section header căn giữa với eyebrow + title + sub
- [ ] Slide content căn giữa (trừ sl-features)
- [ ] Slider controls chỉ có dots, không có số/mũi tên
- [ ] Cards có hover effect lift + image zoom
- [ ] Nav transparent trên hero, frosted glass khi scroll
- [ ] Scroll reveal hoạt động trên tất cả reveal elements

### Responsive Checklist
- [ ] Test trên 320px (mobile nhỏ nhất)
- [ ] Test trên 768px (tablet)
- [ ] Test trên 1440px (desktop lớn)
- [ ] clamp() được dùng cho font-size quan trọng
- [ ] Không có horizontal scroll ở bất kỳ breakpoint nào
- [ ] Touch targets ≥ 44px trên mobile

### Performance Checklist
- [ ] Ảnh có đúng kích thước (không load ảnh 2000px cho thumbnail 300px)
- [ ] Lazy loading cho ảnh dưới fold
- [ ] Animations dùng transform/opacity (không layout-trigger properties)
- [ ] Không có console error
- [ ] Không có unused CSS variables

### Bug Checklist
- [ ] Slider tự chạy đúng 5 giây
- [ ] Direction animation đúng (next→ từ phải, prev← từ trái)
- [ ] Scroll reveal không trigger lại sau khi đã hiện
- [ ] Nav scroll behavior đúng trên mọi browser
- [ ] Footer map hiển thị đúng màu

---

*Cập nhật lần cuối: Tháng 5, 2026 — webdrop.vn Design System v1.0*

---

## DỰ ÁN & PHÁT TRIỂN

**webdrop.vn** — nền tảng bán mẫu website + triển khai trọn gói cho SME và cá nhân tại Việt Nam.

### Không có build system
Dự án là **pure HTML/CSS/JS** — không có npm, bundler, hay test framework.
- Mở trực tiếp file `.html` trong trình duyệt để xem kết quả
- Toàn bộ CSS và JS được viết inline trong mỗi file HTML

### Các file trang

| File | Mô tả |
|---|---|
| `index.html` | Trang chủ storefront — **file tham chiếu design chính** |
| `template_detail_page.html` | Trang xem chi tiết + preview mẫu |
| `checkout_page.html` | Quy trình đặt hàng 3 bước |
| `admin_dashboard.html` | Quản lý đơn hàng nội bộ |

### Tài liệu ngữ cảnh

| File | Mô tả |
|---|---|
| `idea_description_huongB.md` | Mô tả chi tiết mô hình kinh doanh (gói dịch vụ, khách hàng mục tiêu, roadmap) |
| `context_md.md` | Chiến lược dài hạn: AI Community Platform |
