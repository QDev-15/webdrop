# POS Bán Hàng — Gói A (Template tĩnh) — v2.0

## Giới thiệu

POS Bán hàng là hệ thống quản lý bán hàng **chuyên nghiệp** dành cho nhà hàng, quán ăn, café và cửa hàng bán lẻ — tham khảo mô hình KiotViet/Sapo POS/Square. Bản v2.0 nâng cấp toàn diện từ 8 trang cơ bản lên **15 trang**, mô phỏng đầy đủ vòng đời một ca bán hàng: mở ca → bán hàng (barcode, giữ đơn, đa thanh toán, biến thể sản phẩm) → trả hàng → đóng ca đối soát tiền mặt — cộng với quản lý kho (nhập kho, kiểm kê, cảnh báo hết hàng), CRM khách hàng (tích điểm, hạng thành viên) và dashboard báo cáo trực quan (Chart.js).

Template được thiết kế theo chuẩn **Gói A** — mở thẳng trên trình duyệt, không cần build system hay server backend.

**Identity Token:** CLEAN-CORPORATE (Teal `#0f6d82` + Navy `#0a2129`)
**CSS Prefix:** `bp-`
**Bootstrap Version:** 5.3.3 (CDN)
**Font:** DM Sans (Google Fonts)
**Chart:** Chart.js (CDN `https://cdn.jsdelivr.net/npm/chart.js`)

## Cấu trúc thư mục (15 trang)

```
shop-banhang/
├── index.html                  # Đăng nhập
├── lap-don.html                # POS bán hàng — barcode/hold/biến thể/đa thanh toán
├── in-hoa-don.html             # In hóa đơn thermal 80mm
├── tra-hang.html                # Trả hàng / hoàn tiền
├── ca-lam-viec.html             # Quản lý ca làm việc
├── gioi-thieu.html              # Giới thiệu hệ thống + FAQ
├── lien-he.html                 # Liên hệ
├── chinh-sach-bao-mat.html      # Chính sách bảo mật (footer-only)
├── dieu-khoan.html              # Điều khoản sử dụng (footer-only)
├── admin/
│   ├── index.html               # Dashboard — 4 stat card + Chart.js + top SP
│   ├── ql-menu.html             # Quản lý sản phẩm + biến thể (size/màu)
│   ├── nhap-kho.html            # Nhập kho
│   ├── kiem-kho.html            # Kiểm kê tồn kho
│   ├── ql-khach-hang.html       # CRM khách hàng — hạng thành viên
│   └── thong-ke.html            # Báo cáo doanh thu/lợi nhuận + Chart.js
└── assets/
    ├── css/
    │   └── style.css            # CSS chính + component v2.0 (badge/tab/modal/progress-bar)
    └── js/
        ├── seed-data.js         # Data layer (localStorage) + seed 20 SP/10 khách/7 ngày đơn
        ├── auth.js               # Login/session/shift-guard
        ├── pos.js                 # lap-don: barcode/hold/variant/payment
        ├── inventory.js           # ql-menu/nhap-kho/kiem-kho
        ├── crm.js                 # ql-khach-hang/tier calculation
        ├── reports.js              # thong-ke/dashboard Chart.js
        ├── shift.js                 # ca-lam-viec
        └── returns.js                # tra-hang
```

## Cách sử dụng

### 1. Mở template

Chỉ cần mở file `index.html` trên trình duyệt bất kỳ — không cần server, không cần build, responsive từ 320px đến 4K.

### 2. Đăng nhập

| Username | Mật khẩu | Vai trò | Quyền hạn |
|----------|----------|---------|----------|
| `nv01` | `123456` | Thu ngân (cashier) | Lập đơn, trả hàng, ca làm việc |
| `admin` | `admin123` | Quản lý (admin) | Dashboard, menu, kho, khách hàng, thống kê |

### 3. Luồng sử dụng đầy đủ

```
Đăng nhập (nv01/123456)
  ↓
[Chưa mở ca] → ca-lam-viec.html → Nhập tiền đầu ca → Mở ca
  ↓
lap-don.html:
  - Quét/nhập mã vạch HOẶC chọn sản phẩm từ lưới
  - (Nếu sản phẩm có biến thể) → chọn size/loại trong modal
  - Tìm khách theo SĐT (tuỳ chọn) hoặc thêm khách mới
  - Điều chỉnh số lượng / áp dụng chiết khấu
  - [Có thể] Giữ đơn → phục vụ khách khác → quay lại đơn cũ qua tab
  - Chọn phương thức thanh toán (tiền mặt tự tính tiền thối / chuyển khoản / QR / thẻ)
  - Thanh toán → cộng điểm khách hàng, trừ tồn kho
  ↓
in-hoa-don.html → In → Quay lại lap-don.html
  ↓
[Có trả hàng] → tra-hang.html → Nhập mã HD → Chọn SP + số lượng + lý do → Hoàn tiền
  ↓
[Cuối ca] → ca-lam-viec.html → Đếm tiền thực tế → Đóng ca → Xem chênh lệch quỹ
```

**Admin**: Dashboard (biểu đồ doanh thu 7 ngày + top SP + cảnh báo tồn kho thấp) → Quản lý sản phẩm (thêm/sửa, bật biến thể) → Nhập kho khi hàng về → Kiểm kê định kỳ → CRM chăm sóc khách theo hạng → Thống kê lọc theo kỳ/nhóm/nhân viên → In báo cáo.

## Tính năng chi tiết theo trang

### Cashier

- **`lap-don.html`** — POS bán hàng (trang trung tâm):
  - Ô quét mã vạch (autofocus, Enter = thêm luôn nếu khớp)
  - Tabs "Đơn đang xử lý" (giữ đơn) — phục vụ nhiều khách cùng lúc
  - Grid sản phẩm 3 cột với badge "Sắp hết hàng" khi `stock ≤ minStock`
  - Modal chọn biến thể (size/màu/loại) cho sản phẩm có `hasVariants: true`
  - Tìm khách theo SĐT + autocomplete, hiện tên/hạng/điểm; nút "+ Khách mới"
  - Chiết khấu % hoặc số tiền cố định
  - 4 phương thức thanh toán: Tiền mặt (tự tính tiền thối), Chuyển khoản, QR Code (mock), Thẻ
  - Kiểm tra đã mở ca chưa — chưa có thì redirect `ca-lam-viec.html`
- **`in-hoa-don.html`** — hóa đơn thermal 80mm, hiện thêm khách hàng/điểm tích lũy/phương thức thanh toán/tiền thối
- **`tra-hang.html`** — tìm hóa đơn gốc, chọn SP + số lượng trả (không vượt số đã mua), chọn lý do, tự tính hoàn tiền, cộng lại tồn kho
- **`ca-lam-viec.html`** — mở ca (nhập tiền đầu ca) / đóng ca (đếm tiền thực tế → tự tính chênh lệch, chặn nếu chưa nhập)

### Admin

- **`admin/index.html`** — 4 stat card (doanh thu/số đơn hôm nay, SP sắp hết hàng, khách mới), line chart doanh thu 7 ngày, donut chart theo nhóm sản phẩm, top 5 SP bán chạy, 5 đơn gần nhất, trạng thái ca hiện tại
- **`admin/ql-menu.html`** — CRUD sản phẩm với giá vốn/tồn kho/tồn kho tối thiểu; switch "Có biến thể" mở bảng con nhập size/màu/SKU/tồn kho riêng từng biến thể
- **`admin/nhap-kho.html`** — tạo phiếu nhập (chọn/thêm NCC, nhiều dòng sản phẩm + số lượng + đơn giá), tự cộng tồn kho, lịch sử phiếu nhập
- **`admin/kiem-kho.html`** — đối chiếu tồn kho hệ thống với thực tế đếm được, tính chênh lệch, filter "chỉ hiện chênh lệch", xác nhận ghi đè tồn kho + lưu lịch sử
- **`admin/ql-khach-hang.html`** — danh sách khách kèm badge hạng (Đồng/Bạc/Vàng/Kim Cương), điểm, tổng chi tiêu, lần mua gần nhất; xem chi tiết lịch sử đơn hàng + thanh tiến trình lên hạng tiếp theo
- **`admin/thong-ke.html`** — lọc theo ngày/nhóm/nhân viên, bảng có cột lợi nhuận, bar chart doanh thu theo ngày, top SP trong kỳ, báo cáo theo nhân viên, in báo cáo

### Public

- **`gioi-thieu.html`** — tính năng, quy trình sử dụng, FAQ 6 câu
- **`lien-he.html`** — form liên hệ, thông tin cửa hàng, FAQ 4 câu
- **`chinh-sach-bao-mat.html`** / **`dieu-khoan.html`** — 2 trang pháp lý, chỉ liên kết ở footer

## Dữ liệu & localStorage Schema

```javascript
// bp_products — 20 sản phẩm, 3 có biến thể
{
  id, name, categoryId, price, costPrice, unit, barcode,
  stock, minStock, hasVariants,
  variants: [ { sku, size, color, stock, price }, ... ] // nếu hasVariants
}

// bp_customers — 10 khách hàng đủ 4 hạng
{ id, name, phone, email, birthday, totalSpent, points, createdAt }

// bp_orders
{
  id, table, customer, customerId, items[], subtotal, discount, total,
  paymentMethod, cashReceived, changeGiven, pointsEarned, shiftId,
  cashierUsername, timestamp, status, hasReturn
}

// bp_held_orders — đơn giữ tạm (cấu trúc tương tự order, chưa thanh toán)
// bp_shifts — { id, cashierUsername, openedAt, openingCash, closedAt,
//               closingCashCounted, closingCashExpected, difference, status }
// bp_stock_imports — { id, supplier, date, items[], totalCost }
// bp_returns — { id, orderId, items[], reason, refundAmount, timestamp }
// bp_stocktakes — { id, date, checkedBy, discrepancies }
// bp_suppliers — [ "Tên NCC 1", ... ]
// bp_categories, bp_users, bp_contacts, bp_auth_session — giữ nguyên v1
```

### Ràng buộc dữ liệu (đã kiểm chứng bằng test thật)

- Thanh toán → trừ đúng tồn kho sản phẩm/biến thể tương ứng; **chặn hoàn toàn** (không trừ phần nào) nếu bất kỳ item nào không đủ hàng hoặc tiền mặt khách đưa không đủ
- Trả hàng → cộng lại đúng tồn kho, không cho trả vượt (số đã mua − số đã trả trước đó) theo từng sản phẩm/biến thể
- Nhập kho → cộng đúng tồn kho theo từng sản phẩm/biến thể trong phiếu
- Kiểm kê → ghi đè tồn kho hệ thống = tồn kho thực tế đã nhập
- Đóng ca → chặn nếu chưa nhập tiền đếm thực tế hợp lệ (≥ 0)
- Mở ca → chặn nếu đã có ca đang mở cho cùng nhân viên
- `lap-don.html` chặn thao tác nếu chưa mở ca (redirect `ca-lam-viec.html`)
- Điểm tích lũy: 1 điểm / 10.000đ chi tiêu (`Math.floor(total / 10000)`), hạng thành viên tự động theo tổng chi tiêu: Đồng (< 2tr) / Bạc (2-10tr) / Vàng (10-30tr) / Kim Cương (> 30tr)

## Seed Data

- **20 sản phẩm** qua 5 danh mục (Cơm, Mì/Phở, Nước, Tráng miệng, Khác) — **3 sản phẩm có biến thể** (Cà Phê Sữa Đá, Trà Đào Cam Sả, Trà Sữa Trân Châu — size S/M/L × Đá/Nóng), 3 sản phẩm cố tình để tồn kho thấp để demo cảnh báo
- **10 khách hàng** đủ 4 hạng thành viên (Đồng/Bạc/Vàng/Kim Cương)
- **2 tài khoản** đăng nhập (thu ngân/quản lý)
- **~30 đơn hàng** sinh tự động trải đều 7 ngày gần nhất (để dashboard/thống kê có dữ liệu biểu đồ ngay từ lần mở đầu) — 7 ca làm việc tương ứng, tất cả đã đóng ca (không có ca nào mở sẵn, đúng luồng: đăng nhập lần đầu phải tự mở ca mới)
- **2 phiếu nhập kho mẫu**, **1 phiếu trả hàng mẫu** (liên kết đúng với 1 đơn hàng thật, đã trừ/cộng tồn kho khớp)
- Toàn bộ dữ liệu sinh bằng giờ địa phương của trình duyệt (không dùng UTC) — tự làm mới mỗi khi xoá localStorage và mở lại

## Component mới (v2.0)

- Badge tồn kho thấp (đỏ), badge hạng thành viên (4 màu: Đồng/Bạc/Vàng/Kim Cương)
- Tab đơn hàng (hold orders) — pill tabs ngang, tab active có border-bottom accent
- Modal chọn biến thể (Bootstrap modal) — grid chọn size/màu, disable khi hết hàng
- Progress bar hạng thành viên — thanh tiến trình % lên hạng tiếp theo
- Payment method selector — 4 lựa chọn với UI riêng từng loại
- Chart.js — line/bar/doughnut cho dashboard & báo cáo

## Bảo mật & Validation

- Kiểm tra auth trước khi truy cập mọi trang protected (cashier/admin)
- Kiểm tra ca làm việc đang mở trước khi cho phép bán hàng
- Escape HTML cho mọi giá trị nội suy vào `innerHTML` (chống XSS tự-inject qua tên sản phẩm/khách hàng/SKU)
- Validate số điện thoại khách hàng (10 số, bắt đầu bằng 0), chặn trùng SĐT
- Validate mã vạch/SKU không trùng lặp khi thêm/sửa sản phẩm
- Sanitize toàn bộ input trước khi hiển thị

## Responsive Design

- 320px — mobile (1 cột, navbar collapse, payment methods 2×2)
- 768px — tablet (cashier layout chuyển 1 cột, chart grid 1 cột)
- 1024px+ — desktop (layout 3 cột đầy đủ cho `lap-don.html`)
- Bootstrap 5.3.3 grid + `clamp()` cho font-size/padding

## Giới hạn (Gói A tĩnh)

- ❌ Quản lý nhân viên thêm (chỉ 2 tài khoản demo, không có trang tạo tài khoản mới)
- ❌ Quản lý bàn ăn (sơ đồ bàn)
- ❌ Đa chi nhánh, tích hợp sàn TMĐT
- ❌ Backup/sync dữ liệu giữa các thiết bị (localStorage chỉ local)
- ❌ Thanh toán/QR/Bluetooth print thật (đều là mock UI cho mục đích demo)

**Để nâng cấp lên hệ thống thật (đa người dùng, dữ liệu tập trung, thanh toán thật):** chuyển sang **Gói B** (React SPA + PHP API + SQLite) hoặc **Gói C** (custom full-stack).

## Tuỳ biến

### Thay đổi dữ liệu seed
Chỉnh sửa `assets/js/seed-data.js` — mảng `SEED_PRODUCTS`, `SEED_CUSTOMERS`, `SEED_CATEGORIES`, `SEED_USERS`, `SEED_SUPPLIERS`. Xoá `localStorage` (DevTools → Application → Storage) để seed lại từ đầu.

### Thay đổi branding
- **Tên cửa hàng**: tìm "POS Bán Hàng" trong HTML, đổi thành tên của bạn
- **Màu sắc**: CLEAN-CORPORATE mặc định — xem `:root` trong `assets/css/style.css`
- **Liên hệ**: cập nhật SĐT/email/địa chỉ ở `gioi-thieu.html`, `lien-he.html`, `in-hoa-don.html`

### Deployment
Gói A tĩnh — copy toàn bộ folder `shop-banhang/` lên hosting bất kỳ (FTP/GitHub Pages/Netlify/Cloudflare Pages/Vercel). Không cần PHP, database, hay build step.

## Browser Support

Chrome/Edge 90+, Firefox 88+, Safari 14+, Mobile Safari (iOS 14+), Android Chrome. Yêu cầu `localStorage` enabled.

## FAQ

**Q: Vì sao tôi không vào được `lap-don.html`?**
A: Cần mở ca làm việc trước ở `ca-lam-viec.html`.

**Q: Làm sao xoá toàn bộ dữ liệu demo?**
A: DevTools → Application → Storage → Clear site data. Lần mở tiếp theo sẽ tự seed lại.

**Q: Sản phẩm biến thể hoạt động ra sao?**
A: Bật switch "Có biến thể" ở `admin/ql-menu.html`, nhập từng tổ hợp size/màu/SKU/tồn kho — khi bán, hệ thống bắt buộc chọn đúng 1 biến thể trước khi thêm vào đơn.

**Q: Có thể custom sang ngành khác (quần áo, thuốc...) không?**
A: Có — đổi `SEED_CATEGORIES`/`SEED_PRODUCTS` trong `seed-data.js`. Field `variants` (size/màu) áp dụng được cho hầu hết ngành bán lẻ có biến thể.

## License

Template này là phần của dự án webdrop.store. Được cung cấp dưới giấy phép tuỳ chỉnh.

---

**Version:** 2.0 (Sept 2026) — nâng cấp toàn diện từ 8 trang cơ bản lên 15 trang POS chuyên nghiệp
**Created by:** webdrop.store POS Team
