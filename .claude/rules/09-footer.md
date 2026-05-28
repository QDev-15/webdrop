---
description: Footer specification cho webdrop.vn — layout 4 cột, map strip, bottom bar
globs: "*.html"
alwaysApply: false
---

# Footer Specification

## Cấu Trúc

```
footer (dark #0c0b09)
├── ft-main (4 columns, grid: 2fr 1fr 1fr 1fr)
│   ├── Col 1: Logo + mô tả ngắn + social icons
│   ├── Col 2: Dịch vụ (links)
│   ├── Col 3: Tài nguyên (links)
│   └── Col 4: Công ty (links)
├── ft-map-strip (dark #0a0908)
│   ├── Left: Thông tin liên hệ (địa chỉ, SĐT, email, giờ)
│   └── Right: Google Maps embed (height: 280px)
└── ft-bottom (darkest #080706)
    ├── Left: Copyright © webdrop.vn
    └── Right: Legal links (CSBT, CSBH, Điều khoản)
```

## Map Embed

```html
<iframe
  src="https://www.google.com/maps/embed?pb=..."
  style="width:100%; height:100%; border:none;
         opacity:0.7;
         filter:grayscale(100%) invert(92%) contrast(82%)">
</iframe>
```

Filter `grayscale(100%) invert(92%) contrast(82%)` để map hoà với theme tối. Không thay đổi filter này.

## Thông Tin Liên Hệ (Placeholder)

```
Địa chỉ:    Tây Hồ, Hà Nội, Việt Nam
Zalo/Phone: 0901 234 567
Email:      hello@webdrop.vn
Giờ hỗ trợ: 8:00–18:00, Thứ 2–Thứ 7
```

## Màu Nền Footer

```css
footer        { background: #0c0b09; }
.ft-map-strip { background: #0a0908; }
.ft-bottom    { background: #080706; }
```

Dùng đúng 3 màu tối dần theo thứ tự này — không dùng một màu chung.
