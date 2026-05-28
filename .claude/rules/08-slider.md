---
description: Hero slider specification cho webdrop.vn — 5 slides, controls, auto-advance, content layout
globs: "index.html"
alwaysApply: false
---

# Hero Slider Specification

## Cấu Trúc 5 Slides

| # | Chủ đề | Nội dung chính | CTA |
|---|---|---|---|
| 1 | Main intro | Hero title + stats bar | Xem mẫu / Cách hoạt động |
| 2 | Features | 4 feature bullets | Xem quy trình / Bảng giá |
| 3 | Categories | 6 card grid ngành nghề | Xem tất cả mẫu |
| 4 | Pricing | 3 pricing preview cards | Xem chi tiết / Xem mẫu trước |
| 5 | Testimonial | Quote + author | Đặt hàng ngay / Xem đánh giá |

## Content Layout — Căn Giữa

```css
.slide-inner {
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
}
```

**Ngoại lệ duy nhất:** `.sl-features` và `.sl-feat` giữ `text-align: left` vì đọc theo hàng ngang.

## Controls (Dots Only)

- **Chỉ hiển thị 5 dấu gạch ngang** `_ _ _ _ _` căn giữa dưới slide
- Active: width 52px, màu `#4ade80`
- Inactive: width 32px, màu `rgba(255,255,255,0.18)`
- Hover inactive: `rgba(255,255,255,0.38)`
- **Không hiển thị**: số đếm, nút `‹ ›`, progress bar, bất kỳ navigation element nào khác

## Auto-advance

```js
const AUTO_MS = 5000; // 5 giây
// Reset timer mỗi khi user click dot
// Không reset khi hover
```

## Animation Direction

Xem file `04-animations.md` — section "Hero Slider" để biết keyframes chi tiết.
