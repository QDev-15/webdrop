---
description: Cấu trúc layout trang chủ webdrop.vn — thứ tự sections, nav behavior, section header pattern
globs: "*.html"
alwaysApply: false
---

# Cấu Trúc Trang — Homepage

## Thứ Tự Sections (Bắt Buộc)

```
nav          (sticky, transparent → frosted glass khi scroll)
  ↓
#hero        (100vh, dark bg #141210, auto slider 5 slides)
  ↓
#how         (Quy trình 4 bước, light bg)
  ↓
#templates   (Grid 3 cột, 6 mẫu, filter pills)
  ↓
#why         (Dark bg, grid 4 cột lợi ích)
  ↓
#pricing     (3 gói, card grid, light bg)
  ↓
#reviews     (3 testimonial cards, bg kem)
  ↓
.clients-strip (Logo bar, grayscale)
  ↓
#cta         (Full-width banner, accent green bg)
  ↓
.footer-image-strip (Panoramic office photo)
  ↓
footer       (Dark bg, 4 columns + map + contact)
```

## Nav Behavior

```
Ban đầu (trên hero):
  background: transparent
  logo + links: trắng
  CTA button: nền trắng, text tối

Sau scroll > 60px:
  background: rgba(250,249,247,0.9) + backdrop-filter:blur(16px)
  border-bottom: 1px solid var(--border)
  logo + links: var(--text) tối
  CTA button: nền tối, text trắng
```

```css
nav { position: fixed; top: 0; z-index: 500; transition: all 0.4s ease; }
nav.scrolled {
  background: rgba(250,249,247,0.9);
  backdrop-filter: blur(16px);
  border-bottom: 1px solid var(--border);
}
```

## Section Header Pattern

Tất cả section header đều dùng pattern này (căn giữa):

```html
<div class="sec-head reveal">
  <div class="eyebrow">Từ khóa ngắn</div>
  <h2 class="sec-title">Tiêu đề chính <em>nhấn mạnh</em></h2>
  <p class="sec-sub">Mô tả ngắn, tối đa 2 dòng.</p>
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

**Dark section** thêm class `.dark`:
```css
.sec-head.dark .eyebrow { color: #4ade80; }
.sec-head.dark .sec-title { color: #fff; }
.sec-head.dark .sec-sub  { color: rgba(255,255,255,0.38); }
```
