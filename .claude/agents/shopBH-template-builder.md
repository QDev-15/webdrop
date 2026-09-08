# shopBH-Template-Builder Agent (v2.0)

> **Chuyên biệt từ**: `shop-template-catalog-builder` + `shop-template-builder`
> **Dùng cho**: Template website POS/quản lý bán hàng (dùng làm Gói A — template tĩnh)
> **Nguồn yêu cầu**: `documents/tailieu_banhang.docx` + research thị trường (KiotViet, Sapo POS, Square, Lightspeed 2026)
> **Ngôn ngữ**: HTML/CSS/Bootstrap + Vanilla JS (không build system)

---

## 🎯 Mục đích

Xây dựng template website bán hàng **POS chuyên nghiệp** — mô phỏng đầy đủ workflow của phần mềm quản lý bán hàng thực tế (KiotViet/Sapo/Square rút gọn), gồm:
- ✅ POS bán hàng: barcode, giữ đơn tạm, đa thanh toán, trả hàng
- ✅ Quản lý ca làm việc (mở/đóng ca, kiểm kê tiền mặt)
- ✅ Quản lý kho: nhập hàng, kiểm kê, cảnh báo hết hàng, biến thể sản phẩm
- ✅ CRM khách hàng: tích điểm, hạng thành viên
- ✅ Dashboard báo cáo trực quan (biểu đồ Chart.js, top sản phẩm)
- ✅ Phân quyền 2 role: `cashier` + `admin`

**Đối chiếu nguồn cảm hứng** (research 2026):
| Tính năng | KiotViet | Sapo | Template này |
|---|---|---|---|
| Barcode + tồn kho real-time | ✓ | ✓ | ✓ (mockup) |
| Tích điểm khách hàng | ✓ | — | ✓ |
| Đa thanh toán, in Bluetooth | — | ✓ | ✓ (mockup) |
| Phân quyền nhân viên | — | ✓ | ✓ (2 role) |
| Biểu đồ báo cáo trực quan | ✓ | ✓ | ✓ (Chart.js) |
| Đa chi nhánh, tích hợp sàn TMĐT | ✓ | ✓ | ✗ (ngoài phạm vi Gói A tĩnh) |

---

## 📐 Kiến trúc Template (15 trang)

### Phần 1: Giao diện Cashier (nhân viên thu ngân)

**`index.html`** — Login
- Form login (username/password) → lưu `localStorage` session theo role

**`lap-don.html`** — POS bán hàng (trang trung tâm, nâng cấp lớn nhất)
- **Thanh trên cùng**: 
  - Ô quét/nhập mã vạch (barcode input, autofocus, Enter = thêm luôn vào đơn nếu khớp SKU)
  - Tabs "Đơn đang xử lý" (hold orders) — hiển thị nhiều đơn cùng lúc dạng tab ngang (Đơn 1, Đơn 2...), click tab = chuyển đơn active, nút "+ Đơn mới"
- **Layout 3 cột** (giữ nguyên bố cục v1, mở rộng nội dung):
  1. **Cột trái (Menu)**: nhóm sản phẩm + tìm kiếm tên/SKU
  2. **Cột giữa (Sản phẩm)**: grid sản phẩm — card hiện thêm badge "Sắp hết hàng" nếu `stock <= minStock`, nếu sản phẩm có biến thể (size/màu) thì click mở modal chọn biến thể trước khi thêm vào đơn
  3. **Cột phải (Hóa đơn)**:
     - Số bàn / Khách hàng — ô tìm khách theo SĐT (autocomplete từ `bp_customers`), hiện tên + hạng thành viên + điểm tích lũy nếu khớp; nút "+ Khách mới" mở mini-form
     - Danh sách item (tên, biến thể nếu có, số lượng +/-, đơn giá, xóa)
     - Nút "Giữ đơn" (hold — lưu đơn hiện tại vào danh sách tab, reset cột phải để phục vụ khách khác)
     - Subtotal / Chiết khấu (% hoặc số tiền) / Điểm tích lũy được cộng (nếu có khách) / **Tổng tiền**
     - **Chọn phương thức thanh toán**: Tiền mặt / Chuyển khoản / QR code / Thẻ — mỗi loại có UI riêng (tiền mặt: input tiền khách đưa → tự tính tiền thối; QR: hiện mã QR mock; chuyển khoản/thẻ: chỉ xác nhận)
     - Nút "Thanh toán" → trừ tồn kho (mock), cộng điểm khách hàng, lưu đơn vào `bp_orders`, redirect `in-hoa-don.html`

**`in-hoa-don.html`** — In hóa đơn (giữ nguyên v1: thermal 80mm, `@media print`)
- Bổ sung: hiển thị tên khách hàng + điểm tích lũy vừa cộng (nếu có), phương thức thanh toán, tiền khách đưa/tiền thối (nếu tiền mặt)

**`tra-hang.html`** — Trả hàng / Hoàn tiền (trang mới)
- Ô tìm mã hóa đơn gốc (input mã HD) → hiện lại chi tiết đơn hàng đó
- Chọn sản phẩm cần trả + số lượng trả (không vượt số lượng đã mua)
- Chọn lý do trả hàng (dropdown: lỗi sản phẩm/đổi ý/giao nhầm/khác)
- Tính tiền hoàn trả tự động
- Nút "Xác nhận hoàn tiền" → cộng lại tồn kho, lưu vào `bp_returns`, đơn gốc đánh dấu `hasReturn: true`

**`ca-lam-viec.html`** — Quản lý ca làm việc (trang mới)
- **Trạng thái "Chưa mở ca"**: form nhập "Tiền mặt đầu ca" → nút "Mở ca" → lưu `bp_shifts` (status: open)
- **Trạng thái "Đang mở ca"**: hiển thị thống kê ca hiện tại (số đơn, tổng doanh thu, tiền mặt thu được — tính từ `bp_orders` trong ca) + nút "Đóng ca"
- **Đóng ca**: form nhập "Tiền mặt đếm thực tế cuối ca" → tự tính chênh lệch (thực tế − (đầu ca + doanh thu tiền mặt)) → hiện cảnh báo đỏ/xanh nếu lệch → nút "Xác nhận đóng ca" → lưu vào `bp_shifts` (status: closed) + redirect login
- Trang `lap-don.html` phải kiểm tra: nếu chưa mở ca → chặn, redirect `ca-lam-viec.html`

---

### Phần 2: Giao diện Admin (quản lý)

**`admin/index.html`** — Dashboard (nâng cấp lớn)
- 4 stat card: Doanh thu hôm nay, Số đơn hôm nay, Sản phẩm sắp hết hàng, Khách hàng mới
- **Biểu đồ Chart.js**: 
  - Line chart doanh thu 7 ngày gần nhất
  - Pie/donut chart doanh thu theo nhóm sản phẩm
- **Top 5 sản phẩm bán chạy** (bảng: tên, số lượng bán, doanh thu)
- Danh sách 5 đơn gần nhất + trạng thái ca làm việc hiện tại

**`admin/ql-menu.html`** — Quản lý sản phẩm (nâng cấp: biến thể)
- Form thêm/sửa: tên, nhóm, giá bán, **giá vốn** (cost price — dùng tính lợi nhuận), đơn vị, tồn kho, **tồn kho tối thiểu** (minStock — ngưỡng cảnh báo)
- **Biến thể sản phẩm** (tuỳ chọn khi thêm/sửa): bật switch "Có biến thể" → hiện bảng con nhập size/màu + SKU riêng + tồn kho riêng cho từng biến thể (vd: Áo thun → S/M/L × Đỏ/Xanh = 6 biến thể)
- Bảng danh sách: thêm cột "Tồn kho" (badge đỏ nếu ≤ minStock), cột "Biến thể" (số lượng biến thể nếu có)
- Tìm kiếm theo tên/SKU

**`admin/nhap-kho.html`** — Nhập kho (trang mới)
- Form tạo phiếu nhập: chọn nhà cung cấp (dropdown, có thể thêm mới nhanh), ngày nhập
- Bảng chọn sản phẩm + số lượng nhập + đơn giá nhập (mặc định = giá vốn hiện tại, có thể sửa)
- Tổng tiền nhập tự tính
- Nút "Xác nhận nhập kho" → cộng tồn kho sản phẩm tương ứng, lưu vào `bp_stock_imports`
- Bảng lịch sử phiếu nhập (ngày, NCC, tổng tiền, số mặt hàng)

**`admin/kiem-kho.html`** — Kiểm kê tồn kho (trang mới)
- Bảng toàn bộ sản phẩm: Tên | Tồn kho hệ thống | Tồn kho thực tế (input) | Chênh lệch (tự tính, đỏ nếu âm/dương)
- Filter: chỉ hiện sản phẩm có chênh lệch / tất cả
- Nút "Xác nhận kiểm kê" → cập nhật lại tồn kho hệ thống = tồn kho thực tế, lưu lịch sử kiểm kê (ngày, người kiểm, số SP lệch)

**`admin/ql-khach-hang.html`** — CRM khách hàng (trang mới)
- Bảng danh sách khách: Tên | SĐT | Hạng thành viên (badge màu: Đồng/Bạc/Vàng/Kim Cương) | Điểm tích lũy | Tổng chi tiêu | Lần mua gần nhất
- Form thêm/sửa khách: tên, SĐT, email (optional), ngày sinh (optional)
- Click vào 1 khách → xem chi tiết: lịch sử đơn hàng đầy đủ của khách đó
- **Hạng thành viên tự động** theo tổng chi tiêu (vd: Đồng <2tr, Bạc 2-10tr, Vàng 10-30tr, Kim Cương >30tr) — hiển thị thanh tiến trình lên hạng tiếp theo
- Tìm kiếm theo tên/SĐT

**`admin/thong-ke.html`** — Báo cáo doanh thu (nâng cấp v1)
- Bộ lọc: ngày từ/đến, nhóm sản phẩm, nhân viên (dropdown)
- Bảng kết quả: Ngày | Số hóa đơn | Số lượng | Doanh thu | **Lợi nhuận** (doanh thu − giá vốn)
- Biểu đồ Chart.js: cột doanh thu theo ngày trong khoảng đã chọn
- **Top sản phẩm bán chạy trong kỳ** (bảng riêng)
- **Báo cáo theo nhân viên**: doanh số từng nhân viên trong kỳ (đối chiếu `bp_shifts`)
- Nút "In báo cáo"

---

### Phần 3: Public

**`gioi-thieu.html`**, **`lien-he.html`**, 2 trang pháp lý — giữ nguyên như v1.

---

## 🎨 Design & Styling

Giữ nguyên toàn bộ từ v1 (Bootstrap 5.3.3, DM Sans, Identity Token, `.wd-container` pattern, button variants) — **KHÔNG thay đổi phần này**.

### Component mới cần thêm
- **Badge tồn kho thấp**: đỏ `#dc2626`, text "Sắp hết hàng"
- **Badge hạng thành viên**: 4 màu riêng (Đồng `#a0714d`, Bạc `#94a3b8`, Vàng `#eab308`, Kim Cương `#38bdf8`)
- **Tab đơn hàng (hold orders)**: pill tabs ngang trên cùng `lap-don.html`, tab active có border-bottom accent
- **Modal chọn biến thể**: Bootstrap modal, grid chọn size/màu trước khi thêm vào giỏ
- **Progress bar hạng thành viên**: thanh tiến trình % lên hạng tiếp theo
- **Chart.js**: dùng CDN `https://cdn.jsdelivr.net/npm/chart.js` — line/bar/pie/donut theo đúng CDN allowlist dự án

---

## 💾 Dữ liệu & localStorage (Schema mở rộng)

```javascript
// bp_products (mở rộng)
{
  "id": "1", "name": "Áo thun basic", "category": "ao",
  "price": 150000, "costPrice": 90000, "unit": "cái",
  "stock": 45, "minStock": 10,
  "hasVariants": true,
  "variants": [
    { "sku": "AT-S-DO", "size": "S", "color": "Đỏ", "stock": 12 },
    { "sku": "AT-M-DO", "size": "M", "color": "Đỏ", "stock": 15 }
  ],
  "barcode": "8938501234567",
  "image": "https://..."
}

// bp_customers
{
  "id": "c1", "name": "Nguyễn Văn A", "phone": "0901234567",
  "email": "", "birthday": "",
  "points": 320, "totalSpent": 4500000, "tier": "bac",
  "createdAt": "2026-08-01"
}

// bp_orders (mở rộng)
{
  "id": "HD202609081430", "table": "1", "customerId": "c1",
  "items": [ { "productId": "1", "variantSku": "AT-S-DO", "quantity": 2, "price": 150000 } ],
  "discount": 10, "subtotal": 300000, "total": 270000,
  "paymentMethod": "cash", "cashReceived": 300000, "changeGiven": 30000,
  "pointsEarned": 27, "shiftId": "s1",
  "timestamp": "2026-09-08T14:30:00Z", "status": "completed", "hasReturn": false
}

// bp_held_orders (đơn giữ tạm — cấu trúc giống order nhưng chưa thanh toán)
{ "id": "hold1", "label": "Đơn 2", "table": "3", "items": [...], "createdAt": "..." }

// bp_shifts (ca làm việc)
{
  "id": "s1", "cashierUsername": "nv01",
  "openedAt": "2026-09-08T08:00:00Z", "openingCash": 500000,
  "closedAt": null, "closingCashCounted": null, "closingCashExpected": null,
  "difference": null, "status": "open"
}

// bp_stock_imports (nhập kho)
{
  "id": "pi1", "supplier": "NCC Thời trang ABC", "date": "2026-09-01",
  "items": [ { "productId": "1", "quantity": 50, "unitCost": 90000 } ],
  "totalCost": 4500000
}

// bp_returns (trả hàng)
{
  "id": "rt1", "orderId": "HD202609081430", "items": [ { "productId": "1", "quantity": 1 } ],
  "reason": "loi-san-pham", "refundAmount": 150000, "timestamp": "..."
}

// bp_stocktakes (kiểm kê — lịch sử)
{ "id": "st1", "date": "2026-09-08", "checkedBy": "admin", "discrepancies": 3 }
```

### Khởi tạo dữ liệu (Seed) — mở rộng

File `assets/js/seed-data.js`:
- ~20 sản phẩm mẫu (giữ v1), thêm `costPrice`, `stock`, `minStock`, `barcode`; **3-4 sản phẩm có biến thể** (vd áo/giày với size/màu) để demo tính năng
- **8-10 khách hàng mẫu** đủ 4 hạng thành viên, có lịch sử `totalSpent`/`points` hợp lý
- 2 tài khoản: `nv01/123456` (cashier), `admin/admin123` (admin)
- 1-2 phiếu nhập kho mẫu, 1 phiếu trả hàng mẫu
- Đơn hàng mẫu trải trong 7 ngày gần nhất (để dashboard có dữ liệu biểu đồ)

---

## 📄 Danh sách trang (15 trang)

| Trang | URL | Quyền | Mới/Nâng cấp |
|---|---|---|---|
| Đăng nhập | `index.html` | Public | Giữ nguyên |
| POS bán hàng | `lap-don.html` | Cashier | **Nâng cấp lớn**: barcode, hold, đa thanh toán, khách hàng |
| In hóa đơn | `in-hoa-don.html` | Cashier | Nâng cấp nhẹ |
| Trả hàng | `tra-hang.html` | Cashier | **Mới** |
| Ca làm việc | `ca-lam-viec.html` | Cashier | **Mới** |
| Admin Dashboard | `admin/index.html` | Admin | **Nâng cấp lớn**: biểu đồ + top SP |
| Quản lý sản phẩm | `admin/ql-menu.html` | Admin | **Nâng cấp**: biến thể, tồn kho |
| Nhập kho | `admin/nhap-kho.html` | Admin | **Mới** |
| Kiểm kê kho | `admin/kiem-kho.html` | Admin | **Mới** |
| Quản lý khách hàng | `admin/ql-khach-hang.html` | Admin | **Mới** |
| Thống kê doanh thu | `admin/thong-ke.html` | Admin | **Nâng cấp**: lợi nhuận, biểu đồ, theo NV |
| Giới thiệu | `gioi-thieu.html` | Public | Giữ nguyên |
| Liên hệ | `lien-he.html` | Public | Giữ nguyên |
| Chính sách bảo mật | `chinh-sach-bao-mat.html` | Public | Giữ nguyên |
| Điều khoản | `dieu-khoan.html` | Public | Giữ nguyên |

---

## 🔐 Phân quyền & Authentication

Giữ nguyên pattern v1 (`wd_auth_session`, role check, redirect). Bổ sung:
- `lap-don.html` kiểm tra thêm: có ca làm việc đang mở (`bp_shifts` status=open của user hiện tại) không → chưa có thì redirect `ca-lam-viec.html`
- `tra-hang.html`, `ca-lam-viec.html`: quyền cashier
- 5 trang admin mới: quyền admin

---

## 🎬 Workflow Tương tác (cập nhật)

### Cashier Workflow (đầy đủ)
```
Login (nv01/123456)
  ↓
[Chưa mở ca] → ca-lam-viec.html → Nhập tiền đầu ca → Mở ca
  ↓
lap-don.html:
  - Quét/nhập barcode HOẶC chọn sản phẩm từ grid
  - (Nếu biến thể) → chọn size/màu trong modal
  - Tìm khách theo SĐT (optional) hoặc thêm khách mới
  - Điều chỉnh số lượng / chiết khấu
  - [Có thể] Giữ đơn → chuyển sang khách khác → quay lại đơn cũ qua tab
  - Chọn phương thức thanh toán (tiền mặt tự tính tiền thối)
  - Thanh toán → cộng điểm khách, trừ tồn kho
  ↓
in-hoa-don.html → In → Quay lại lap-don.html
  ↓
[Cuối ngày] → ca-lam-viec.html → Đếm tiền thực tế → Đóng ca → Xem chênh lệch
```

### Trả hàng Workflow
```
tra-hang.html → Nhập mã HD → Chọn SP + số lượng trả + lý do → Xác nhận → Cộng lại tồn kho
```

### Admin Workflow (đầy đủ)
```
Login (admin/admin123)
  ↓
Dashboard: xem biểu đồ doanh thu 7 ngày + top SP + cảnh báo tồn kho thấp
  ↓
[Quản lý SP] Thêm SP mới (có thể bật biến thể) / Sửa tồn kho tối thiểu
  ↓
[Nhập kho] Khi hàng về → Tạo phiếu nhập → Cộng tồn kho
  ↓
[Định kỳ] Kiểm kê kho → Đối chiếu thực tế → Xác nhận điều chỉnh
  ↓
[CRM] Xem danh sách khách theo hạng → Chăm sóc khách VIP
  ↓
[Thống kê] Lọc theo kỳ → Xem doanh thu/lợi nhuận/top SP → In báo cáo
```

---

## ✅ Checklist Template (v2.0)

Kế thừa toàn bộ checklist v1 (giao diện, JS, dữ liệu, SEO, bảo mật, hiệu năng) — bổ sung:

### Chức năng mới
- [ ] Barcode input → tự thêm SP vào đơn khi khớp mã (Enter)
- [ ] Giữ đơn tạm (hold) — tối thiểu 2 đơn đồng thời qua tab
- [ ] Trả hàng: tìm đơn gốc, chọn SP trả, tính hoàn tiền, cộng lại tồn kho
- [ ] Ca làm việc: mở/đóng ca, tính chênh lệch tiền mặt
- [ ] Đa phương thức thanh toán: tiền mặt (tự tính tiền thối) / chuyển khoản / QR / thẻ
- [ ] CRM: tìm khách theo SĐT, tự động tính hạng thành viên, tích điểm khi mua
- [ ] Biến thể sản phẩm: modal chọn size/màu, tồn kho riêng từng biến thể
- [ ] Nhập kho: tạo phiếu, cộng tồn kho tự động
- [ ] Kiểm kê: đối chiếu tồn kho thực tế, tự tính chênh lệch
- [ ] Dashboard: Chart.js line + pie/donut chart hoạt động đúng dữ liệu seed
- [ ] Cảnh báo tồn kho thấp: badge đỏ khi `stock <= minStock`

### Ràng buộc dữ liệu (integrity)
- [ ] Thanh toán → trừ đúng tồn kho (sản phẩm/biến thể tương ứng)
- [ ] Trả hàng → cộng lại đúng tồn kho, không cho trả vượt số lượng đã mua
- [ ] Nhập kho → cộng đúng tồn kho theo từng sản phẩm trong phiếu
- [ ] Kiểm kê → ghi đè tồn kho hệ thống = tồn kho thực tế đã nhập
- [ ] Đóng ca → chặn nếu chưa nhập tiền đếm thực tế
- [ ] `lap-don.html` chặn thao tác nếu chưa mở ca

---

## 🎨 Identity Token & Màu sắc

Giữ nguyên v1 — Agent được giao 1 token cụ thể từ 12 token chuẩn dự án.

---

## 📝 Workflow Build (Agent thực hiện) — v2.0

**Bước 0**: Xác nhận Identity Token + ngành nghề
**Bước 1**: Viết HTML 15 trang tĩnh (layout + structure) — public/cashier/admin
**Bước 2**: CSS (design-system + responsive + component mới: badge/tab/modal/progress-bar)
**Bước 3**: Vanilla JS — chia module rõ ràng:
   - `auth.js` (login/session/shift-guard)
   - `pos.js` (lap-don: barcode/hold/variant-modal/payment)
   - `inventory.js` (ql-menu/nhap-kho/kiem-kho)
   - `crm.js` (ql-khach-hang/tier calculation)
   - `reports.js` (thong-ke/dashboard Chart.js)
   - `shift.js` (ca-lam-viec)
   - `returns.js` (tra-hang)
**Bước 4**: Seed data mở rộng (20 SP + biến thể, 8-10 khách, đơn 7 ngày, phiếu nhập/trả mẫu)
**Bước 5**: Testing (`node --check` mọi file JS, browser smoke-test luồng đầy đủ: mở ca → bán hàng có biến thể → giữ đơn → trả hàng → đóng ca → xem báo cáo)
**Bước 6**: Finalize (QA checklist đầy đủ + Unsplash verify + README.md cập nhật hướng dẫn tính năng mới)

---

## 📋 Deploy (Gói A — HTML thuần)

**Bàn giao**:
- 15 file `.html`
- 1 folder `assets/` (css, js theo module, img)
- 1 file `README.md` (cách dùng — cập nhật đầy đủ workflow mới)

**Demo live**: Cloudflare Pages

**Giá bán**: ~899k–1.2tr (phức tạp hơn v1 nhiều, gần ngưỡng trên Gói A multi-page)

---

## 🔗 Tham khảo

- Base agent: `shop-template-catalog-builder.md`
- Design system: `rules/design-system.md`
- Yêu cầu gốc: `documents/tailieu_banhang.docx`
- Research thị trường: KiotViet, Sapo POS, Square/Lightspeed (2026) — xem bảng đối chiếu đầu file
- Quy trình build: `.claude/agents/template-builder.md` → Bước 0–8

---

**Trạng thái**: READY FOR USE
**Phiên bản**: 2.0 (2026-09-08) — nâng cấp toàn diện theo research KiotViet/Sapo, thay thế v1.0 cơ bản
**Người tạo**: Claude Code
