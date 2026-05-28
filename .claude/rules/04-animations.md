---
description: Animation, transition, scroll reveal, slider animation, hover effects — chuẩn chính thức của webdrop.vn
globs: "*.html,*.css,*.js,*.ts,*.tsx"
alwaysApply: false
---

# Animations & Transitions

## Nguyên Tắc

- **Mượt mà, nhẹ nhàng** — không flashy, không distract
- Duration: 200–800ms. Không quá 1s ngoại trừ hero
- Easing vào: `cubic-bezier(0.16, 1, 0.3, 1)` (spring-like)
- Easing ra: `cubic-bezier(0.4, 0, 0.6, 1)`
- Chỉ dùng `transform` và `opacity` — không animate layout properties (width, height, top, left)

## Scroll Reveal

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
.reveal-d1 { transition-delay: 0.08s; }
.reveal-d2 { transition-delay: 0.16s; }
.reveal-d3 { transition-delay: 0.24s; }
.reveal-d4 { transition-delay: 0.32s; }
```

```js
new IntersectionObserver(cb, {
  threshold: 0.1,
  rootMargin: '0px 0px -36px 0px'
})
// Không trigger lại sau khi đã visible — unobserve sau khi trigger
```

## Hero Slider

Slide chuyển theo hướng:
- **Next →**: slide cũ exit trái (`leaveToLeft`), slide mới enter từ phải (`enterFromRight`)
- **Prev ←**: slide cũ exit phải (`leaveToRight`), slide mới enter từ trái (`enterFromLeft`)

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

## Hover Effects

```css
/* Card lift */
.card:hover { transform: translateY(-7px); transition: 0.28s cubic-bezier(0.16,1,0.3,1); }

/* Image zoom inside card */
.card-thumb img { transition: transform 0.4s ease; }
.card:hover .card-thumb img { transform: scale(1.06); }

/* Button */
.btn:hover { transform: translateY(-1px); opacity: 0.92; }

/* Nav link */
.nav-link { transition: color 0.25s; }
```
