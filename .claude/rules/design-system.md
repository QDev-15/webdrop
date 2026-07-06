# Design System Rules — webdrop.store

## Bootstrap Version
**5.3.3** — CDN bắt buộc:
```html
<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>
```

## Typography
- **Font duy nhất**: `DM Sans` — Google Fonts
- Weights dùng: 300, 400, 500, 600; italic 400
- Khai báo qua `--sans: 'DM Sans', sans-serif`
- Không dùng font hệ thống hay font khác bất kỳ

## Color Palette — CSS Custom Properties (bắt buộc khai báo :root)

```css
:root {
  --bg: #faf9f7;          /* Nền tổng thể */
  --surface: #fff;         /* Card, panel, nav */
  --dark: #0c0b09;         /* Footer background */
  --dark2: #141210;        /* Dark section (hero, why-us) */
  --sidebar: #111009;      /* Admin sidebar */
  --border: #e8e5df;       /* Border mặc định */
  --border-light: #f0ede8; /* Divider, border nhẹ */
  --text: #1a1917;         /* Text chính */
  --text-2: #6b6760;       /* Text phụ, label */
  --text-3: #a09d97;       /* Text mờ, placeholder, meta */
  --accent: #1a6b52;       /* Green chính — button CTA, link active */
  --accent-h: #155a44;     /* Accent hover */
  --accent-light: #e8f4ef; /* Accent background nhạt */
  --accent-mid: #2d9b73;   /* Accent trung gian */
  --warm: #f5f0e8;         /* Background ấm nhẹ */
  --warm2: #ede8df;        /* Background ấm đậm hơn */
  --danger: #e24b4a;       /* Error, validation */
}
```

**5 màu inline được phép (không qua CSS var):**
| Màu | Hex | Dùng ở đâu |
|---|---|---|
| Bright green | `#4ade80` | Logo dot, hero badge, sidebar active — chỉ trên nền tối |
| Star amber | `#f59e0b` | Sao đánh giá ★★★★★ |
| Error red | `#dc2626` | Trạng thái khẩn, badge lỗi admin |
| Warning amber | `#d97706` | Trạng thái chờ, cảnh báo |
| Zalo blue | `#0068FF` | Nút float Zalo duy nhất |

## Layout & Container

```css
/* Container chuẩn của dự án — KHÔNG dùng .container Bootstrap */
.wd-container {
  max-width: 1100px;    /* 960px cho checkout */
  margin: 0 auto;
  padding: 0 clamp(20px, 5vw, 80px);
}

/* Section padding */
.sec-pad { padding: clamp(72px, 10vw, 128px) 0; }
```

**Grid**: Dùng `row` + `col-*` của Bootstrap cho tất cả multi-column layout.

## Border Radius
| Element | Radius |
|---|---|
| Card lớn (template card, pricing card) | `14–16px` |
| Card nhỏ (mini panel, addon) | `10–12px` |
| Button chính | `9–10px` |
| Input, select | `8px` |
| Badge trạng thái | `5px` |
| Pill filter | `20px` |
| Avatar | `50%` |

## Shadows (chỉ dùng trên hover)
```css
/* Card template hover */
box-shadow: 0 20px 52px rgba(0,0,0,.1);

/* Card nhỏ hover */
box-shadow: 0 10px 32px rgba(0,0,0,.07);

/* Pricing card hover */
box-shadow: 0 14px 44px rgba(0,0,0,.08);
```

## Button Variants
| Variant | CSS |
|---|---|
| **Accent CTA** | `bg: var(--accent)`, `color: #fff`, `border: none`, hover `bg: var(--accent-h)` |
| **Ghost** | `bg: transparent`, `border: 1px solid var(--border)`, `color: var(--text-2)`, hover `bg: var(--warm)` |
| **Dark** | `bg: var(--text)`, `color: #fff` — dùng khi nav scrolled |
| **White on dark** | `bg: #fff`, `color: var(--dark)` — trên hero/section tối |
| **Outline on dark** | `bg: transparent`, `border: rgba(255,255,255,.18)`, `color: rgba(255,255,255,.65)` |

Tất cả button: `font-family: var(--sans)`, `cursor: pointer`, `transition: all .2s`

## Component Patterns

### Navbar (index.html)
- Transparent → `.scrolled` khi `scrollY > 60`
- Khi `.scrolled`: `background rgba(250,249,247,.9)`, `backdrop-filter: blur(16px)`, border-bottom accent

### Section Header
```html
<div class="eyebrow">Label</div>      <!-- 11px uppercase, màu --accent, dòng kẻ ::before/::after -->
<h2 class="sec-title">Title <em>italic</em></h2>  <!-- em: --accent, font-weight:300 -->
<p class="sec-sub">Mô tả...</p>       <!-- max-width 520px, font-weight:300 -->
```

### Cards (template cards)
- Hover: `translateY(-7px)`, shadow, `border-color: transparent`
- Image zoom: `transform: scale(1.06)` on `.tc:hover .tc-thumb img`

### Pricing Cards
- `.pc.hot`: `border-color: var(--accent-mid)`, `background: linear-gradient(160deg, var(--accent-light) 0%, #fff 55%)`
- Hot label: `position: absolute`, `top: -11px`, `left: 50%`, `background: var(--accent)`

### Status Badges (admin)
Dạng dot + text — class `.status-badge.{status}`:
- `new` → xanh dương (`#eff6ff` / `#1d4ed8`)
- `brief` → amber (`#fffbeb` / `#92400e`)
- `building` → tím (`#fdf4ff` / `#7e22ce`)
- `review` → cam (`#fff7ed` / `#9a3412`)
- `done` → xanh lá (`var(--accent-light)` / `var(--accent)`)
- `maintain` → xanh nhạt (`#f0f9ff` / `#075985`)

### Reveal Animation
```css
.reveal { opacity:0; transform:translateY(32px); transition: opacity .72s, transform .72s; }
.reveal.visible { opacity:1; transform:none; }
.reveal-d1 { transition-delay:.08s; }
.reveal-d2 { transition-delay:.16s; }
.reveal-d3 { transition-delay:.24s; }
```
Trigger bằng `IntersectionObserver`, threshold `0.1`.

### Admin Layout
- `body`: `display:flex`, `height:100vh`, `overflow:hidden`
- Sidebar: `width: 214px`, `flex-shrink: 0`, `background: var(--sidebar)`
- Main: `flex: 1`, `overflow: hidden`, content area scroll nội bộ

## Files & Pages
| File | Max-width container |
|---|---|
| `documents/index.html` | `1100px` |
| `documents/template_detail_page.html` | `1100px` |
| `documents/checkout_page.html` | `960px` |
| `documents/admin_dashboard.html` | No container (full layout) |

---

## 🎨 10 Theme Presets — Identity Tokens (dùng chung, tái sử dụng cho template khác)

> Nguồn gốc: bộ 10 palette này được tạo lần đầu cho hệ thống chọn Theme trong admin của `shop-ban-hang` (2026-07-06) — implementation tham khảo: `Sources/WebDeploy/shop-ban-hang/website/src/data/themes.ts` + `admin/src/data/themes.ts`. Mỗi theme **chỉ định nghĩa màu sắc** (không đổi font, layout, spacing, border-radius) — áp dụng bằng cách override 17 CSS custom properties cùng tên đã dùng trong `shop-ban-hang`: `--bg, --surface, --dark, --dark2, --border, --border-light, --text, --text-2, --text-3, --accent, --accent-h, --accent-light, --accent-mid, --sage, --sage-h, --sage-light, --cream-deep, --terracotta-bg` (2 tên biến cuối là do kế thừa từ theme gốc ORGANIC-EARTH — về mặt ngữ nghĩa hãy hiểu là "accent phụ" và "nền tint theo accent chính", không phải nghĩa đen sage/terracotta).
>
> **Khi tạo template/site mới muốn có nhiều theme màu**: copy nguyên bộ giá trị bên dưới vào file `themes.ts` tương ứng, giữ nguyên slug + tên biến, chỉ đổi khi site đó không dùng đúng 17 biến này (vd site khác đặt tên biến khác thì phải map lại).

| Slug | Tên | Mood | Accent chính | Accent phụ | Nền |
|---|---|---|---|---|---|
| `organic-earth` | Organic Earth | Mộc mạc, gần gũi thiên nhiên (mặc định) | `#c4603a` Terracotta | `#6b8a7a` Sage | Sáng, cream ấm |
| `luxe-dark` | Luxe Dark | Cao cấp, huyền bí | `#0e7c66` Jade Emerald | `#c9a24d` Gold | Tối tuyệt đối |
| `soft-pastel` | Soft Pastel | Dịu nhẹ, thân thiện | `#9b7ef0` Lilac | `#34c98e` Mint | Sáng, trắng ấm |
| `bold-editorial` | Bold Editorial | Tương phản cao, tạp chí | `#d63b1f` Scarlet | `#0f0f0f` Đen (contrast) | Sáng, trắng lạnh |
| `dark-energy` | Dark Energy | Trẻ trung, năng lượng cao | `#c026d3` Neon Magenta | `#7c3aed` Violet | Tối tuyệt đối |
| `clean-corporate` | Clean Corporate | Chuyên nghiệp, đáng tin cậy | `#0f6d82` Teal | `#0a2129` Navy | Sáng, xanh nhạt |
| `zen-minimal` | Zen Minimal | Tối giản, thiền định | `#6b8067` Sage Green | `#a9906b` Taupe | Sáng, warm white |
| `retro-bold` | Retro Bold | Hoài cổ, cá tính | `#1f7a6b` Teal | `#c98a1f` Mustard | Sáng, cream |
| `glass-modern` | Glass Modern | Hiện đại, công nghệ (glassmorphism) | `#4361ee` Blue | `#7209b7` Purple | Sáng, xanh rất nhạt |
| `geometric-modern` | Geometric Modern | Mạnh mẽ, có cấu trúc hình học | `#1d4fd8` Cobalt | `#0a1128` Navy đậm | Sáng, xám xanh nhạt |

Full giá trị 17 biến từng theme — xem trực tiếp `Sources/WebDeploy/shop-ban-hang/website/src/data/themes.ts` (đã đồng bộ với `admin/src/data/themes.ts`), không chép lại toàn bộ hex ở đây để tránh 2 nguồn dữ liệu lệch nhau khi 1 trong 2 chỗ được sửa sau này.

**Cách áp dụng cho site mới** (pattern đã dùng ở `shop-ban-hang`):
1. Copy `themes.ts` vào `website/src/data/` và `admin/src/data/` của site mới.
2. Seed setting `site_theme` (giá trị mặc định = slug theme đang có sẵn của site, vd site mới theo identity nào thì set slug đó) vào nhóm `design` trong `Database.php`.
3. Trong `SiteContext.tsx` (hoặc tương đương), sau khi fetch `/public/settings`, thêm `useEffect` tìm theme theo `settings.site_theme` rồi `document.documentElement.style.setProperty(key, value)` cho từng biến — override có độ ưu tiên cao hơn `:root {}` trong stylesheet nên không cần inject `<style>` riêng.
4. Trong Settings admin, thêm tab "🎨 Giao diện" render grid các theme (mỗi thẻ preview 4 dải màu: bg/accent/sage/dark) cho chủ site tự chọn.
