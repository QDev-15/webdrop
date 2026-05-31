# Template Basic Admin — Hướng dẫn sử dụng

Template dashboard quản trị nội dung website.

## Các trang
| File | Trang |
|---|---|
| `login.html` | Trang đăng nhập |
| `dashboard.html` | Tổng quan — stats, đơn hàng gần đây |
| `posts.html` | Quản lý bài viết — danh sách, filter, CRUD |
| `users.html` | Quản lý tài khoản — danh sách, phân quyền |
| `settings.html` | Cài đặt — thông tin site, SEO, mạng xã hội |

## Yêu cầu kỹ thuật
- Mở thẳng trên trình duyệt — không cần cài đặt gì
- Bootstrap 5.3.3 (CDN)
- Font DM Sans (Google Fonts)
- Vanilla JS thuần (modal, sidebar toggle, table actions)

## Lưu ý quan trọng
Đây là **template giao diện tĩnh** — dùng để:
- Làm prototype/mockup cho khách hàng xem trước
- Dùng làm design reference khi xây backend
- Bán kèm Gói A như một bộ giao diện hoàn chỉnh

Để có chức năng thật (login, CRUD database), cần kết hợp với backend (Gói B của webdrop.vn).

## Cách chỉnh nội dung

### 1. Tên hệ thống & logo
Trong tất cả file, tìm tên hệ thống mặc định và thay bằng tên thực:
```html
<div class="sidebar-logo">
  <span>Tên<span style="color:#4ade80">CMS</span></span>
</div>
```

### 2. Màu sắc
Trong `<style>` của mỗi file:
```css
:root {
  --accent: #1a6b52;    /* Màu xanh chủ đạo — đổi theo brand */
  --sidebar: #111009;   /* Nền sidebar tối */
}
```

### 3. Menu sidebar
Chỉnh danh sách menu theo chức năng thực của hệ thống bạn:
```html
<a href="dashboard.html" class="nav-link active">
  <span class="nav-icon">📊</span>
  <span>Tổng quan</span>
</a>
```
Thêm/bớt các `<a>` trong sidebar theo nhu cầu.

### 4. Stats cards (dashboard)
Trong `dashboard.html`, thay 4 thẻ stats:
```html
<div class="stat-card">
  <div class="stat-label">Tên chỉ số</div>
  <div class="stat-value">1,234</div>
  <div class="stat-change up">+12% tháng này</div>
</div>
```

### 5. Bảng dữ liệu
Thay tiêu đề cột `<th>` và dữ liệu mẫu `<td>` trong các bảng theo nội dung thực:
```html
<thead>
  <tr>
    <th>Cột 1</th>
    <th>Cột 2</th>
  </tr>
</thead>
```

### 6. Responsive
Template đã responsive sẵn — trên mobile, sidebar thu lại và có nút hamburger để mở.

## Tích hợp với backend

Khi kết nối backend (PHP/Node.js):
1. Thay các link `href="*.html"` bằng route thực của ứng dụng
2. Thay data tĩnh trong bảng bằng data từ API (fetch/axios)
3. Form login cần gửi POST request đến `/api/auth/login`

## Hỗ trợ
Liên hệ webdrop.vn để được tư vấn tích hợp backend cho template này.
