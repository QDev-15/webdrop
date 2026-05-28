---
description: Quy tắc vàng bắt buộc tuân thủ trước mọi thay đổi code hoặc design trong dự án webdrop.vn
alwaysApply: true
---

# Quy Tắc Vàng — Bắt Buộc Tuân Thủ

## So sánh trước khi thay đổi

Trước mọi thay đổi design, bắt buộc:
1. Xem lại design gốc (file `index.html`)
2. Xác định chính xác phần cần thay đổi
3. Giữ nguyên: màu sắc, font, spacing, animation style
4. Chỉ thay đổi đúng phần được yêu cầu, không side-effect sang phần khác

## Bug-free Workflow

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

## Responsive — Breakpoints Bắt Buộc

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
