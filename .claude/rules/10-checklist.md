---
description: Checklist bắt buộc chạy trước khi ship bất kỳ thay đổi nào trong webdrop.vn
alwaysApply: false
---

# Pre-Ship Checklist

Chạy toàn bộ checklist này trước khi kết thúc bất kỳ task nào.

## UI

- [ ] Font chỉ dùng DM Sans, không có font nào khác
- [ ] Màu sắc đều tham chiếu CSS variables (không hardcode hex)
- [ ] Section header căn giữa với eyebrow + title + sub
- [ ] Slide content căn giữa (trừ `.sl-features`)
- [ ] Slider controls chỉ có 5 dots, không có số/mũi tên
- [ ] Cards có hover effect: lift `translateY(-7px)` + image zoom `scale(1.06)`
- [ ] Nav transparent trên hero, frosted glass khi scroll > 60px
- [ ] Scroll reveal hoạt động trên tất cả `.reveal` elements

## Responsive

- [ ] Test trên 320px (mobile S — nhỏ nhất)
- [ ] Test trên 768px (tablet)
- [ ] Test trên 1440px (desktop L)
- [ ] `clamp()` được dùng cho font-size quan trọng
- [ ] Không có horizontal scroll ở bất kỳ breakpoint nào
- [ ] Touch targets ≥ 44px trên mobile

## Performance

- [ ] Ảnh có đúng kích thước (card 300px không load ảnh 2000px)
- [ ] `loading="lazy"` trên ảnh dưới fold
- [ ] Animations chỉ dùng `transform` và `opacity`
- [ ] Không có `console.error` trong DevTools
- [ ] Không có unused CSS variables

## Bugs

- [ ] Slider tự chạy đúng 5 giây
- [ ] Direction animation đúng (next→ enter từ phải, prev← enter từ trái)
- [ ] Scroll reveal không trigger lại sau khi đã visible
- [ ] Nav scroll behavior đúng trên Chrome, Firefox, Safari
- [ ] Footer map hiển thị đúng filter grayscale+invert
