# shopBH-Template-Builder Agent

> **Chuyên biệt từ**: `shop-template-catalog-builder` + `shop-template-builder`
> **Dùng cho**: Template website bán hàng tổng quát (dùng làm Gói A — template tĩnh)
> **Nguồn yêu cầu**: Tài liệu bán hàng nhà hàng (`documents/tailieu_banhang.docx`)
> **Ngôn ngữ**: HTML/CSS/Bootstrap + Vanilla JS (không build system)

---

## 🎯 Mục đích

Xây dựng template website bán hàng **NHÂN VIÊN THU NGÂN + QUẢN LÝ** hoàn chỉnh với:
- ✅ UI mockup cho quầy tiếp khách (order entry)
- ✅ UI mockup cho bàn quản lý (thống kê + quản lý menu)
- ✅ Phân quyền 2 role: `cashier` + `admin`
- ✅ Giả lập UI cho in hóa đơn (thermal printer format)

---

## 📐 Kiến trúc Template

### Phần 1: Giao diện khách hàng / Tiếp đơn (Cashier Interface)

**Trang**: `index.html` (Trang chủ nhân viên)
- Login form giả lập (lưu `localStorage` ghi `role=cashier`)
- Sau login → màn hình tạo đơn hàng

**Trang**: `lap-don.html` (Lập hóa đơn)
- **Layout 3 cột**:
  1. **Cột trái (Menu)**: Danh sách nhóm món ăn + tìm kiếm
  2. **Cột giữa (Sản phẩm)**: Grid sản phẩm 4 cột, có nút `+ Thêm vào đơn`
  3. **Cột phải (Hóa đơn)**: 
     - Số bàn / Khách
     - Danh sách item trong đơn (tên, số lượng, giá)
     - Subtotal / Discount / Total
     - Nút "Thanh toán" → in hóa đơn

**Giao diện menu**: dạng pill/tab (Tất cả, Đồ ăn, Nước uống, Tráng miệng...), chọn = filter sản phẩm

**Tương tác trên hóa đơn**:
- Số lượng: input số (có +/- button) hoặc click trực tiếp
- Gỡ item: icon ✕
- Xoá tất cả đơn: nút "Huỷ"
- Chiết khấu: input % hoặc số tiền

**Trang**: `in-hoa-don.html` (Hiển thị in hóa đơn)
- Mockup **thermal paper 80mm** (format chuẩn máy in hóa đơn nhà hàng)
- Nội dung:
  - Tên nhà hàng + logo + địa chỉ (centered)
  - Thời gian + mã hóa đơn
  - Số bàn + Khách
  - Dấu gạch ngang
  - Chi tiết từng item: tên × số lượng = tổng
  - Dấu gạch ngang
  - Tổng tiền + chiết khấu + **Thành tiền**
  - Dấu cảm ơn + liên hệ nhà hàng
- Nút "In" (gọi `window.print()`) + "Quay lại" (reset đơn, quay về `lap-don.html`)
- CSS @media print: bỏ giao diện khác, chỉ giữ nội dung in

---

### Phần 2: Giao diện quản lý (Admin Interface)

**Trang**: `admin/index.html` (Dashboard)
- Login form riêng admin (lưu `localStorage` ghi `role=admin`)
- Sau login → dashboard với navbar chứa các nút: Dashboard / Quản lý menu / Thống kê / Đăng xuất

**Trang**: `admin/ql-menu.html` (Quản lý menu)
- **Layout 2 phần**:
  1. Bảng danh sách món ăn (tên, nhóm, giá, đơn vị, hành động: Sửa/Xóa)
  2. Form thêm/sửa món ăn (tên, nhóm dropdown, giá, đơn vị)

- **Tương tác**:
  - Click "Sửa" → điền form sẵn giá trị cũ
  - Click "Xóa" → hỏi confirm → xóa khỏi `localStorage`
  - Submit form → lưu vào `localStorage`
  - Tìm kiếm thực timen: input search (lọc theo tên)

**Trang**: `admin/thong-ke.html` (Thống kê doanh thu)
- **Bộ lọc**:
  - Chọn ngày từ / đến (date input)
  - Chọn nhóm món ăn (dropdown)
  - Nút "Xem báo cáo"

- **Kết quả**: Bảng hiển thị
  - Cột: Ngày, Số hóa đơn, Số lượng, Tổng tiền
  - Footer: Tổng doanh thu kỳ
  - Nút "In báo cáo" (gọi `window.print()`)

- **Biểu đồ** (tuỳ chọn): Chart.js doanh thu theo ngày (line chart hoặc bar chart)

---

## 🎨 Design & Styling

### Màu sắc & Typography
- **Font**: DM Sans (tuân theo design-system.md)
- **Accent**: Chọn theo Identity Token (template mới)
- **Color Scheme**: Light (nền trắng) cho dễ đọc giá cả

### Layout chính
- **Navbar**: 
  - Logo + Tên nhà hàng (trái)
  - Menu (giữa): Trang chủ / Admin / (khác nếu là admin)
  - Người dùng + Đăng xuất (phải)

- **Sidebar Admin** (tuỳ chọn): hoặc dùng navbar đủ

### Component
- **Button**: CTA (xanh accent), Danger (đỏ), Secondary (grey)
- **Input**: Standardform Bootstrap
- **Table**: Bootstrap `.table` với hover effect
- **Modal**: Confirm xóa / Alert (Toastify hoặc SweetAlert tĩnh)

---

## 💾 Dữ liệu & localStorage

### Schema (JSON lưu `localStorage`)

```javascript
// products (danh sách món ăn)
{
  "id": "1",
  "name": "Cơm tấm Sài Gòn",
  "category": "com",
  "price": 45000,
  "unit": "suất",
  "image": "https://..." // Unsplash
}

// categories
{
  "id": "com",
  "name": "Cơm"
}

// orders (trong phiên làm việc)
{
  "id": "HD001",
  "table": "1",
  "customer": "Khách hàng",
  "items": [
    { "productId": "1", "quantity": 2, "price": 45000 }
  ],
  "discount": 10, // % hoặc số tiền
  "timestamp": "2026-09-08 14:30:00",
  "status": "completed"
}

// users (giả lập)
{
  "username": "nv01",
  "password": "123456",
  "role": "cashier" // hoặc "admin"
}
```

### Khởi tạo dữ liệu (Seed)

File `assets/js/seed-data.js` chứa:
- ~20 món ăn mẫu (chia 5 nhóm: Cơm, Mì/Phở, Nước, Tráng miệng, Khác)
- 2 tài khoản: `nv01 / 123456` (cashier), `admin / admin123` (admin)
- Mỗi lần tải lần đầu, nếu localStorage trống → seed dữ liệu mặc định

---

## 📄 Danh sách trang

| Trang | URL | Quyền | Nội dung |
|---|---|---|---|
| Đăng nhập | `index.html` | Public | Form login (2 role: nhân viên / admin) |
| Lập hóa đơn | `lap-don.html` | Cashier | Menu + sản phẩm + hóa đơn (3 cột) |
| In hóa đơn | `in-hoa-don.html` | Cashier | Thermal paper format + nút In |
| Admin Dashboard | `admin/index.html` | Admin | Trang chủ admin (link tới các phần) |
| Quản lý menu | `admin/ql-menu.html` | Admin | CRUD món ăn |
| Thống kê doanh thu | `admin/thong-ke.html` | Admin | Báo cáo + biểu đồ |
| Giới thiệu | `gioi-thieu.html` | Public | Thông tin nhà hàng |
| Liên hệ | `lien-he.html` | Public | Form liên hệ (gửi email giả lập) |
| Chính sách | `chinh-sach.html` | Public | Chính sách hoàn hàng / bảo mật (footer) |

---

## 🔐 Phân quyền & Authentication

### Giả lập login (localStorage)

```javascript
// sau khi submit login form, lưu session:
{
  "wd_auth_session": {
    "username": "nv01",
    "role": "cashier",
    "loginTime": "2026-09-08T14:30:00Z"
  }
}

// Middleware: mỗi trang protected kiểm tra:
- Có session không?
- Role khớp với trang không? (admin-only pages)
- Nếu không → redirect về login
```

### Quyền truy cập

| Trang | Cashier | Admin | Public |
|---|---|---|---|
| `index.html` | ✓ | ✓ | ✓ |
| `lap-don.html` | ✓ | ✗ | ✗ |
| `in-hoa-don.html` | ✓ | ✗ | ✗ |
| `admin/*` | ✗ | ✓ | ✗ |
| `gioi-thieu.html` | ✓ | ✓ | ✓ |
| `lien-he.html` | ✓ | ✓ | ✓ |

---

## 🎬 Workflow Tương tác

### Cashier Workflow
```
Login (nv01/123456)
  ↓
Chọn số bàn / nhập tên khách
  ↓
Chọn nhóm món → Lựa chọn sản phẩm → Thêm vào đơn
  ↓
Điều chỉnh số lượng / thêm chiết khấu (nếu cần)
  ↓
Click "Thanh toán"
  ↓
Xem hóa đơn (in-hoa-don.html)
  ↓
Click "In" (window.print())
  ↓
Click "Quay lại" → Reset, quay về lap-don.html
```

### Admin Workflow
```
Login (admin/admin123)
  ↓
Chọn chức năng: Quản lý menu / Thống kê / Cài đặt
  ↓
[Quản lý menu] Thêm/sửa/xóa món ăn
  ↓
[Thống kê] Chọn khoảng thời gian → Xem báo cáo doanh thu
  ↓
Click "In báo cáo" (print mode)
```

---

## 📊 Dữ liệu Mockup (Seed)

### Nhóm món ăn (5 nhóm)
1. **Cơm** (COM): Cơm tấm, Cơm gà, Cơm thịt kho tàu
2. **Mì/Phở** (MI): Phở bò, Phở gà, Mì vàng
3. **Nước uống** (NUOC): Nước cam, Sinh tố, Bia
4. **Tráng miệng** (TRANGMIENG): Chè ba màu, Kem
5. **Khác** (KHAC): Bánh mì, Bánh cuốn

### Sản phẩm mẫu: ~20 sản phẩm
- Tên, nhóm, giá (20k-120k), đơn vị (suất/ly/cái)
- Ảnh từ Unsplash (tìm từ khóa: "Vietnamese food", "Pho", "Com tam")

### Tài khoản mẫu
- **Nhân viên**: `nv01` / `123456` (role: cashier)
- **Quản lý**: `admin` / `admin123` (role: admin)

---

## ✅ Checklist Template

Khi template build xong, phải đáp ứng:

### Chức năng
- [x] Login 2 role (cashier + admin)
- [x] Lập hóa đơn: thêm/xóa item, điều chỉnh số lượng, chiết khấu
- [x] In hóa đơn (thermal paper format 80mm)
- [x] Admin quản lý menu (CRUD)
- [x] Admin thống kê doanh thu (khoảng thời gian + biểu đồ)
- [x] Phân quyền: page protection + role check
- [x] Đơn vị: suất/ly/cái/chiếc

### Giao diện
- [x] Bootstrap 5.3.3 CDN
- [x] DM Sans font
- [x] Responsive (mobile + tablet + desktop)
- [x] Navbar + Footer
- [x] Form validation (tên bàn, số lượng, chiết khấu)
- [x] Toast/Alert cho hành động (thêm vào đơn, thanh toán, xóa item)

### JavaScript
- [x] localStorage: login, dữ liệu đơn, menu, thống kê
- [x] Tính toán: tổng tiền, chiết khấu
- [x] Filter: tìm kiếm sản phẩm, lọc theo nhóm
- [x] Print CSS: @media print cho hóa đơn + báo cáo
- [x] Middleware protect page (redirect nếu chưa login)
- [x] Auto-logout sau 30 phút không hoạt động (tuỳ chọn)

### Dữ liệu
- [x] Seed 20+ sản phẩm mẫu
- [x] Ảnh Unsplash verify HTTP 200
- [x] 2 tài khoản mẫu + password
- [x] Hóa đơn mẫu lưu history (localStorage)

### SEO & Metadata
- [x] Trang public có `<title>`, `<meta description>`
- [x] Admin page: `<meta name="robots" content="noindex, nofollow">`
- [x] Favicon (icon nhà hàng)

### Bảo mật
- [x] Input sanitize (XSS — không nội suy trực tiếp vào innerHTML)
- [x] Form validation server-side không có (template tĩnh) → client-side bắt buộc
- [x] Password không hiển thị plain text (mockup, không bcrypt cần thiết lúc này)

### Hiệu năng
- [x] Không dùng build system (HTML mở thẳng được)
- [x] File kích thước <= 5MB (gộp tất cả)
- [x] Load time < 2s (trên mạng 3G)
- [x] Tính toán hóa đơn <= 100ms

---

## 🎨 Identity Token & Màu sắc

Agent sẽ được giao **1 cụ thể từ 12 token** (WARM-ARTISAN, LUXE-DARK, SOFT-PASTEL, BOLD-EDITORIAL, DARK-ENERGY, CLEAN-CORPORATE, ZEN-MINIMAL, RETRO-BOLD, GLASS-MODERN, GEOMETRIC-MODERN, FRESH-MINIMAL, hoặc ORGANIC-EARTH).

- Accent chính: dùng cho nút CTA, link active, highlight
- Accent phụ: dùng cho section alternating, badge status
- Nền: sáng/tối tuỳ token

---

## 📝 Workflow Build (Agent thực hiện)

**Bước 0**: Xác nhận Identity Token + ngành nghề cụ thể (nhà hàng / café / shop khác?)
**Bước 1**: Viết HTML 8 trang tĩnh (layout + structure)
**Bước 2**: CSS (design-system + responsive)
**Bước 3**: Vanilla JS (logic, localStorage, tính toán)
**Bước 4**: Seed data (`assets/js/seed-data.js`)
**Bước 5**: Testing (`node --check` scripts, browser smoke-test)
**Bước 6**: Finalize (QA checklist + Unsplash verify)

---

## 📋 Deploy (Gói A — HTML thuần)

**Bàn giao**:
- 8 file `.html`
- 1 folder `assets/` (css, js, img)
- 1 folder `admin/` (html, css/js chung)
- 1 file `README.md` (cách dùng)

**Demo live**: Cloudflare Pages (tự động build từ `Sources/templates/web/...`)

**Giá bán**: ~599k–799k (tùy phức tạp) — nằm trong bộ Gói A multi-page

---

## 🔗 Tham khảo

- Base agent: `shop-template-catalog-builder.md` (catalog cây product, không admin)
- Design system: `rules/design-system.md`
- Yêu cầu: `documents/tailieu_banhang.docx`
- Quy trình build: `.claude/agents/template-builder.md` → Bước 0–8

---

**Trạng thái**: READY FOR USE
**Phiên bản**: 1.0 (2026-09-08)
**Người tạo**: Claude Code
