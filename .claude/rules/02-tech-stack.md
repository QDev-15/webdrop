---
description: Công nghệ được phép và bị cấm dùng trong webdrop.vn — áp dụng khi viết bất kỳ code nào
alwaysApply: true
---

# Tech Stack — Công Nghệ Sử Dụng

## Frontend Web (hiện tại)

```
HTML5 + CSS3 thuần (không framework CSS)
JavaScript ES6+ thuần (không jQuery)
React (cho các component phức tạp / SPA)
```

**Không có build system** — mở trực tiếp file `.html` trong trình duyệt. Toàn bộ CSS và JS viết inline trong mỗi file HTML.

## Mobile

```
React Native (iOS + Android)
Expo (build & deploy)
```

## Nguyên Tắc CSS

- **Không dùng**: Bootstrap, Tailwind, Material UI, hay bất kỳ CSS framework nào
- **Dùng**: CSS Variables, Flexbox, CSS Grid, CSS Animations
- **Viết CSS theo thứ tự**: Layout → Typography → Color → Spacing → Animation
- Mọi màu sắc đều phải tham chiếu qua CSS Variables — không hardcode hex trực tiếp trong component

## React (khi dùng)

- Functional components + Hooks
- Không dùng class components
- State management: React Context hoặc Zustand (không Redux)
- Styling: CSS Modules hoặc inline style với design token object

## React Native (khi dùng)

- `StyleSheet.create()` cho tất cả styles
- Không dùng inline style ngoại trừ dynamic styles
- Navigation: React Navigation v6+
- Giữ nguyên design token màu sắc đồng nhất với web
