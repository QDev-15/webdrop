# POS Bán Hàng — Gói A (Template tĩnh)

## Giới thiệu

POS Bán hàng là một hệ thống quản lý bán hàng hoàn chỉnh dành cho nhà hàng, quán ăn, café, và các cửa hàng bán lẻ. Template này được thiết kế theo chuẩn **Gói A** — mở thẳng trên trình duyệt, không cần build system hay server backend.

**Identity Token:** CLEAN-CORPORATE (Teal `#0f6d82` + Navy `#0a2129`)  
**CSS Prefix:** `bp-`  
**Bootstrap Version:** 5.3.3  
**Font:** DM Sans

## Cấu trúc thư mục

```
shop-banhang/
├── index.html              # Trang đăng nhập
├── lap-don.html            # Lập hóa đơn (nhân viên)
├── in-hoa-don.html         # In hóa đơn thermal 80mm
├── gioi-thieu.html         # Giới thiệu cửa hàng
├── lien-he.html            # Liên hệ
├── admin/
│   ├── index.html          # Dashboard quản lý
│   ├── ql-menu.html        # Quản lý menu sản phẩm
│   └── thong-ke.html       # Báo cáo thống kê
└── assets/
    ├── css/
    │   └── style.css       # CSS chính (responsive + CLEAN-CORPORATE token)
    ├── js/
    │   ├── main.js         # Logic ứng dụng
    │   └── seed-data.js    # Dữ liệu khởi tạo (20 sản phẩm, 2 tài khoản)
    └── img/
        └── (favicon và hình ảnh)
```

## Cách sử dụng

### 1. Mở template

Chỉ cần mở file `index.html` trên trình duyệt bất kỳ:
- **Không cần server** — mở trực tiếp local
- **Không cần build** — HTML/CSS/JS thuần
- **Responsive** — hoạt động tốt từ 320px đến 4K

### 2. Đăng nhập

Có 2 tài khoản demo:

| Username | Mật khẩu | Vai trò | Quyền hạn |
|----------|----------|---------|----------|
| `nv01` | `123456` | Nhân viên | Lập hóa đơn, in hóa đơn |
| `admin` | `admin123` | Quản lý | Quản lý menu, xem thống kê, dashboard |

### 3. Tính năng chính

#### Nhân viên (role: cashier)
- **Lập đơn** (`lap-don.html`):
  - Chọn menu từ danh mục hoặc tìm kiếm
  - Thêm sản phẩm vào đơn (điều chỉnh số lượng)
  - Nhập số bàn, tên khách
  - Áp dụng chiết khấu (% hoặc tiền cố định)
  - Thanh toán → In hóa đơn
  
- **In hóa đơn** (`in-hoa-don.html`):
  - Format thermal 80mm sẵn sàng in
  - Mã hóa đơn tự động
  - In qua `window.print()`

#### Quản lý (role: admin)
- **Dashboard** (`admin/index.html`):
  - Tổng quan doanh thu
  - 5 hóa đơn gần đây
  - Liên kết nhanh tới các tính năng
  
- **Quản lý Menu** (`admin/ql-menu.html`):
  - Thêm sản phẩm mới
  - Sửa thông tin sản phẩm
  - Xóa sản phẩm
  - Tìm kiếm thực time
  - 20 sản phẩm seed sẵn

- **Thống kê** (`admin/thong-ke.html`):
  - Lọc theo khoảng thời gian
  - Tính doanh thu tổng/trung bình
  - Xuất báo cáo chi tiết
  - In báo cáo

#### Public
- **Giới thiệu** (`gioi-thieu.html`):
  - Tính năng chính
  - Cách sử dụng
  - FAQ (7 câu)
  
- **Liên hệ** (`lien-he.html`):
  - Form liên hệ
  - Thông tin cửa hàng
  - Giờ làm việc
  - Mạng xã hội

## Dữ liệu

### localStorage Schema

```javascript
{
  "bp_auth_session": {
    username: "nv01",
    role: "cashier",
    name: "Nhân viên 01",
    loginTime: "2026-09-08T10:00:00.000Z"
  },
  "bp_products": [
    { id, name, categoryId, price, unit, image }
  ],
  "bp_categories": [
    { id, name }
  ],
  "bp_orders": [
    { id, table, customer, items[], subtotal, discount, total, timestamp, status }
  ],
  "bp_users": [
    { username, password, role, name }
  ],
  "bp_contacts": [
    { id, name, email, phone, subject, message, timestamp, status }
  ]
}
```

### Seed Data

- **20 sản phẩm** qua 5 danh mục:
  - Cơm (5): Tấm, Gà, Thịt kho, Gà quay, Cơm tấm dòi
  - Mì/Phở (5): Phở bò, Phở gà, Mì vàng, Bánh canh, Hủ tiếu
  - Nước (5): Cam, Sinh tố, Bia, Cà phê, Trà
  - Tráng miệng (3): Chè ba màu, Kem, Bánh flan
  - Khác (2): Bánh mì, Bánh cuốn

- **2 tài khoản** (tên đăng nhập + mật khẩu)

- **Ảnh Unsplash** — tất cả verified HTTP 200

## Tính năng

### Cashier (Lập đơn)
- ✅ 3-column layout: Menu (trái) + Sản phẩm (giữa) + Hóa đơn (phải)
- ✅ Lọc theo danh mục (6 nút pill)
- ✅ Tìm kiếm sản phẩm thực time
- ✅ Thêm vào đơn (click 1 lần → thêm sản phẩm)
- ✅ Điều chỉnh số lượng (+/-)
- ✅ Xóa item khỏi đơn
- ✅ Tính tổng động
- ✅ Chiết khấu theo % hoặc tiền cố định
- ✅ Nhập số bàn, tên khách (tuỳ chọn)
- ✅ Thanh toán → In hóa đơn
- ✅ Huỷ đơn (xác nhận)

### Print Hóa đơn
- ✅ Format thermal 80mm (text-based)
- ✅ Mã hóa đơn tự động (HD + timestamp)
- ✅ Thông tin cửa hàng, bàn, khách
- ✅ Chi tiết sản phẩm (tên × số lượng = tổng)
- ✅ Cộng chiết khấu, thành tiền
- ✅ Cảm ơn + SĐT liên hệ
- ✅ CSS @media print tối ưu

### Admin Dashboard
- ✅ Tổng quan thống kê
- ✅ 5 hóa đơn gần đây (bảng)
- ✅ Liên kết nhanh tới admin pages

### Quản lý Menu
- ✅ Form thêm/sửa (tên, nhóm, giá, đơn vị)
- ✅ Bảng danh sách (tìm kiếm, sửa, xóa)
- ✅ Validate form (tên, giá > 0)
- ✅ Thông báo thành công

### Thống kê Báo cáo
- ✅ Bộ lọc: từ ngày, đến ngày, nhóm (tuỳ chọn)
- ✅ Tóm tắt: số hóa đơn, tổng doanh thu, trung bình
- ✅ Bảng chi tiết (mã HĐ, bàn, khách, số lượng, tiền, thời gian)
- ✅ In báo cáo qua `window.print()`

### Security & Validation
- ✅ Kiểm tra auth trước khi truy cập (protected pages)
- ✅ Phân biệt cashier/admin (role check)
- ✅ Sanitize input (không nội suy HTML trực tiếp)
- ✅ Validate form (tên bàn, số lượng, giá > 0)
- ✅ sessionStorage cho dữ liệu print tạm

### Responsive Design
- ✅ 320px — mobile (1 cột, navbar collapse)
- ✅ 576px — small tablet
- ✅ 768px — tablet (2-3 cột)
- ✅ 1024px — desktop (3 cột full layout)
- ✅ 1200px+ — large screen
- ✅ Bootstrap 5.3.3 grid system
- ✅ clamp() cho font-size/padding

### Performance
- ✅ Load < 2s (chỉ 3 JS file nhỏ)
- ✅ Tính toán < 100ms (vanilla JS)
- ✅ No build, no compilation
- ✅ Client-side only (no server calls)

## Sử dụng lại template

### Thay đổi dữ liệu
Chỉnh sửa `assets/js/seed-data.js`:

```javascript
const SEED_DATA = {
  categories: [
    { id: 1, name: 'Tên danh mục' },
    // ...
  ],
  products: [
    { id: 1, name: 'Tên sản phẩm', categoryId: 1, price: 50000, unit: 'suất', image: 'URL' },
    // ...
  ],
  users: [
    { username: 'user', password: '1234', role: 'cashier', name: 'Tên' },
    // ...
  ]
};
```

### Thay đổi branding
- **Tên cửa hàng**: Tìm "POS Bán Hàng" trong HTML, đổi thành tên của bạn
- **Màu sắc**: CLEAN-CORPORATE là mặc định — xem `assets/css/style.css` `:root` để đổi token khác
- **Logo**: Thay ảnh `.svg`/`.png` trong `assets/img/`
- **Liên hệ**: Cập nhật SĐT, email, địa chỉ ở `gioi-thieu.html`, `lien-he.html`

### Deployment
Gói A tĩnh — copy toàn bộ folder `shop-banhang/` lên hosting:
- FTP: Upload folder lên public_html/shop-banhang/
- GitHub Pages: Push repo, enable Pages
- Netlify: Drag & drop folder
- Cloudflare Pages: Connect repo
- Vercel: Import project

**Không cần PHP, database, build step — chỉ cần web server để serve static files.**

## Browser Support
- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile Safari (iOS 14+)
- Android Chrome

**Yêu cầu:** localStorage enabled

## Giới hạn (Gói A tĩnh)
- ❌ Quản lý nhân viên thêm (chỉ 2 tài khoản demo)
- ❌ Quản lý bàn ăn (sơ đồ)
- ❌ Lịch sử dài hạn (chỉ phiên hiện tại khi reload trang)
- ❌ Xuất Excel (chỉ in PDF via browser)
- ❌ Multi-language (chỉ Tiếng Việt)
- ❌ Backup/Sync (localStorage chỉ local)

**Để nâng cấp:** Chuyển sang **Gói B** (React SPA + PHP API + SQLite) hoặc **Gói C** (custom full-stack).

## Cấu hình

### CSS Variables (CLEAN-CORPORATE Token)
```css
--accent: #0f6d82;        /* Teal chính */
--accent-h: #0a5460;      /* Hover */
--navy: #0a2129;          /* Navy đậm */
--dark: #141210;          /* Background tối */
--bg: #faf9f7;            /* Nền nhạt */
```

Để đổi sang token khác (ORGANIC-EARTH, LUXE-DARK, v.v.), update 5 biến này ở `:root`.

### Seed Data Expiration
Hóa đơn không có thời hạn trong template này. Nếu muốn tính `expiresAt`, thêm logic vào `renderReportTable()`.

## Support & FAQ

**Q: Làm sao để xóa tất cả dữ liệu?**  
A: Mở DevTools → Application → Storage → LocalStorage → Clear All

**Q: Dữ liệu có backup được không?**  
A: Có, export localStorage qua JS:
```javascript
const data = localStorage;
const json = JSON.stringify(Object.assign({}, data));
// Save json to file
```

**Q: Tôi có thể custom ngành (bán quần áo, thuốc...) không?**  
A: Có, thay đổi `bp_categories` và `bp_products` trong seed-data.js, cập nhật tên/ảnh/giá/danh mục.

**Q: Làm sao để tích hợp thanh toán thật?**  
A: Template này là Gói A (tĩnh). Để thanh toán thật, nâng cấp lên **Gói B** (React + PHP + cổng thanh toán Sepay/Momo).

## License

Template này là phần của dự án webdrop.store. Được cung cấp dưới giấy phép tuỳ chỉnh.

---

**Version:** 1.0 (Sept 2026)  
**Created by:** webdrop.store POS Team
