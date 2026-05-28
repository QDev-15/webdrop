---
description: Design tokens chính thức của webdrop.vn — màu sắc, typography, spacing, border radius, shadow. Áp dụng khi viết HTML/CSS/JS/TSX
globs: "*.html,*.css,*.tsx,*.jsx,*.ts,*.js"
alwaysApply: false
---

# Design Tokens — webdrop.vn

## Typography

**Font duy nhất:** `DM Sans` — dùng cho 100% text

```html
<link href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;1,9..40,400&display=swap" rel="stylesheet">
```

| Weight | Dùng cho |
|---|---|
| 300 | Body text, mô tả, placeholder |
| 400 | Text thông thường |
| 500 | Label, button, nav link |
| 600 | Heading, title, price, logo |

| Token | Size | Dùng cho |
|---|---|---|
| `--fs-xs` | 11px | Eyebrow, label nhỏ, meta |
| `--fs-sm` | 13px | Body nhỏ, caption |
| `--fs-base` | 14–15px | Body mặc định |
| `--fs-md` | 16–17px | Subheading, intro |
| `--fs-lg` | `clamp(22px,2.5vw,28px)` | Section sub-title |
| `--fs-xl` | `clamp(26px,3.5vw,40px)` | Section title |
| `--fs-hero` | `clamp(38px,5.5vw,76px)` | Hero headline |

## Color Palette

```css
:root {
  /* Backgrounds */
  --bg:           #faf9f7;   /* Page background — kem nhạt */
  --surface:      #ffffff;   /* Card, panel */
  --warm:         #f5f0e8;   /* Thumbnail bg, input bg */
  --warm2:        #ede8df;   /* Border nhạt hơn */
  --dark:         #0c0b09;   /* Footer bg */
  --dark2:        #141210;   /* Hero bg, dark section */

  /* Text */
  --text:         #1a1917;   /* Primary text */
  --text-2:       #6b6760;   /* Secondary text, mô tả */
  --text-3:       #a09d97;   /* Placeholder, meta, muted */

  /* Brand — Green */
  --accent:       #1a6b52;   /* Primary action, CTA */
  --accent-h:     #155a44;   /* Hover state */
  --accent-light: #e8f4ef;   /* Accent background tint */
  --accent-mid:   #2d9b73;   /* Border, icon */

  /* Border */
  --border:       #e8e5df;
  --border-light: #f0ede8;

  /* Layout */
  --max:  1100px;
  --pad:  clamp(20px,5vw,80px);
}
```

**Quy tắc màu:**
- Nền trang: `--bg` — không dùng trắng thuần
- Text chính: `--text` — không dùng `#000`
- Không thêm màu mới ngoài palette trên

## Spacing

Dùng bội số 4px: `4, 8, 12, 16, 20, 24, 28, 32, 40, 48, 56, 64, 72, 80, 96, 128`

```css
section { padding: clamp(72px, 10vw, 128px) 0; }
.inner  { max-width: var(--max); margin: 0 auto; padding: 0 var(--pad); }
```

## Border Radius

| Dùng cho | Value |
|---|---|
| Pill / Badge / Tag | `20px` hoặc `9999px` |
| Button | `8–9px` |
| Card nhỏ | `10px` |
| Card lớn / Panel | `14px` |
| Section visual | `16–20px` |
| Avatar | `50%` |

## Shadow

```css
/* Card hover   */ box-shadow: 0 20px 52px rgba(0,0,0,0.10);
/* Panel nhẹ    */ box-shadow: 0 8px 32px rgba(0,0,0,0.06);
/* Button hover */ box-shadow: 0 8px 24px rgba(0,0,0,0.14);
```

Không dùng shadow nặng `rgba(0,0,0,0.3+)`. Tối đa 3 level shadow trong toàn trang.
