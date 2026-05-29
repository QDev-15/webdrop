# Coding Workflow Rules

## Quy tắc bắt buộc

1. **Bug loop**: Sau mỗi thay đổi code → review bug → fix → review lại cho đến khi hết bug. Không dừng giữa chừng.
2. **CLAUDE.md sync**: Cập nhật `CLAUDE.md` mỗi khi có thay đổi code, thêm tính năng, hoặc thay đổi flow.
3. **Feature loop**: Mỗi khi thêm chức năng hoặc thay đổi flow → review → fix bug → review lại cho đến sạch.
4. **Agent review + QA**: Sau mỗi lần thay đổi code — gọi agent `reviewer` review trước, sau đó gọi agent `qa-tester` test UI/logic. Fix hết issue được report trước khi commit.

## Review & QA Workflow

```
Thay đổi code
    ↓
Agent reviewer  →  phát hiện bug/issue  →  fix  →  reviewer lại
    ↓ (pass)
Agent qa-tester  →  test UI + logic + edge cases  →  fix  →  qa-tester lại
    ↓ (pass)
Commit
```

**Khi nào gọi reviewer:** Sau khi viết component mới, sửa logic, thêm API route, thay đổi CSS layout.

**Khi nào gọi qa-tester:** Sau khi reviewer pass — test trên browser, kiểm tra responsive, form validation, edge cases.

## Workflow Chuẩn

### Khi sửa file HTML/CSS
1. Đọc file hiện tại trước khi chỉnh
2. Thực hiện thay đổi
3. Kiểm tra: HTML structure hợp lệ, Bootstrap class đúng, responsive không bị vỡ
4. Kiểm tra: CSS var dùng đúng từ design system, không hardcode màu ngoài palette
5. Kiểm tra: JavaScript không có lỗi console

### Khi thêm component mới
1. Tham chiếu design system trước (file `rules/design-system.md`)
2. Dùng Bootstrap utilities tối đa, custom CSS chỉ khi cần thiết
3. Đặt tên class theo convention của dự án (prefix theo trang: `wd-`, `sb-`, `tc-`, v.v.)
4. Test responsive trên breakpoint: 320px, 576px, 768px, 1024px, 1200px+

### Khi thêm tính năng JavaScript
1. Không dùng jQuery — vanilla JS thuần
2. Không dùng `var` — dùng `const` / `let`
3. Không `console.log` trong code production
4. Event listener phải có `{passive: true}` cho scroll/touch events

## Không được làm
- Hardcode màu ngoài CSS vars (trừ 5 màu inline được phép trong design-system.md)
- Dùng Bootstrap `.container` mặc định — luôn dùng `.wd-container`
- Dùng jQuery hoặc thư viện JS nặng thêm vào
- Thêm font ngoài DM Sans
- Bỏ qua review bug sau khi thay đổi
