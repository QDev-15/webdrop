---
name: web-deploy-builder-shop-rules
description: Shop-specific rules (22-28b) cho web-deploy-builder — chỉ dùng khi type=shop
---

# 🛍️ Shop-Specific Rules (22-28b) — Load khi `type=shop`

> **Khi nào load file này?** Agent khởi động với `node scaffolder.mjs [slug] shop` — tự động include rules 22-28b bên cạnh core rules 1-21.

---

## Rule 22 — P0 Loại hình Shop: Filter UI phức tạp

**Sidebar lọc (`san-pham.html` template gốc) bắt buộc đủ 5 block đúng thứ tự:**
- **Mức giá** — 2 input number (min/max), không cần slider nếu template không có
- **Danh mục** — checkbox **multi-select** (không phải radio single-select), mỗi option kèm số lượng `(N)` = COUNT thực tế trong DB
- **Màu sắc** — swatch tròn theo màu thật của sản phẩm (cần cột `colors` — xem rule 24)
- **Đánh giá** — checkbox lọc theo số sao tối thiểu (cần cột `rating` — xem rule 24)
- **Tình trạng** — checkbox: Còn hàng / Đang giảm giá / Hàng mới
- 2 nút cuối sidebar: **Áp dụng bộ lọc** (submit tất cả filter cùng lúc) + **Xóa bộ lọc** (reset về mặc định)
- **Tab bar danh mục** nằm NGANG phía trên grid (scroll-x trên mobile): "Tất cả | [mỗi danh mục] | Đang giảm giá" — tách biệt với sidebar, không gộp chung

Thiếu bất kỳ block nào = không đạt yêu cầu thiết kế.

---

## Rule 23 — P0 Phân trang (Pagination) bắt buộc

Template có component `sb-pagination` (nút trước/sau + số trang + dấu "…"). Không được tải toàn bộ sản phẩm một lần:
- **API**: `GET /public/products?page=1&per_page=12&category_id=&sort=&min_price=&max_price=` — trả **array thuần**; tổng số bản ghi trả qua HTTP header `X-Total-Count`
- **`api/client.ts`** cần method trả kèm headers (không chỉ body JSON) để website đọc `X-Total-Count`
- **Text hiển thị**: "Hiển thị **1–12** trong số **[48]** sản phẩm" (page header) + "Tìm thấy **[48]** sản phẩm" (top bar)

---

## Rule 24 — P0 Schema `products` mở rộng

```sql
colors        TEXT,              -- pipe-separated "Tên:#hex"
rating        REAL    NOT NULL DEFAULT 5,
in_stock      INTEGER NOT NULL DEFAULT 1
```
Xem `rules/database.md` cho chi tiết schema extension.

---

## Rule 25 — P1 Giỏ hàng (Cart) phức tạp

Persist `localStorage` + đồng bộ Context, không chỉ state cục bộ trong `CartPage`. Yêu cầu tối thiểu: hiển thị biến thể (`sb-cart-prod-var`), nút "Cập nhật giỏ hàng", ô mã giảm giá.

---

## Rule 26 — P0 Trang thanh toán (`/thanh-toan`)

Template gốc KHÔNG có trang này — tự dựng theo `rules/design-system.md`. Bắt buộc có:
- Form thông tin khách (họ tên, SĐT, email, địa chỉ, ghi chú)
- Khối tóm tắt đơn hàng
- **Chọn 1 trong 2 phương thức thanh toán** (rule 27)

---

## Rule 27 — P0 Thanh toán: 2 phương thức

Bật/tắt riêng từng phương thức tại Admin Settings (thêm tab "💳 Thanh toán"):

**Phương thức 1 — COD:** Tạo đơn `payment_method='cod'`, `payment_status='unpaid'`, `status='pending'`

**Phương thức 2 — SePay:** Tạo đơn `payment_method='sepay'`, `payment_status='pending'` → hiển thị QR VietQR → SePay webhook `POST /public/sepay-webhook` verify secret → cập nhật `payment_status='paid'`, `status='processing'`

**Settings keys nhóm `payment`:**
- `payment_cod_enabled` (0/1, mặc định `'1'`)
- `payment_sepay_enabled` (0/1, mặc định `'0'`)
- `sepay_bank_code`, `sepay_account_number`, `sepay_account_name`, `sepay_webhook_secret`

Nếu cả 2 đều tắt → checkout ẩn nút, hiển thị "Cửa hàng tạm ngừng nhận đơn online".

**Bảng mới bắt buộc:**
- `orders` (order_code UNIQUE, customer_name, phone, email, address, note, subtotal, shipping_fee, discount, total, payment_method, payment_status, status, created_at)
- `order_items` (order_id FK, product_id FK, product_name, price, qty, subtotal)

---

## Rule 28 — ✅ DONE Scaffold type `shop`

`scaffolder.mjs` có type `shop` tự động copy:
- `ProductCategoryController.php`, `ProductController.php`, `OrderController.php`, `ShopPublicController.php`, `ShopSettingsController.php`
- Admin pages: `ProductCategoryList/Form`, `ProductList/Form`, `OrderList/Detail`, `PaymentSettingsTab.tsx`
- Website: `CartContext.tsx`, `CheckoutPage.tsx` + `shop-checkout.css`
- Schema `product_categories/products/orders/order_items` append vào `schema.sql`

**AI KHÔNG viết lại** các file Order/Payment tĩnh này — chỉ tích hợp (rule 28b).

---

## Rule 28b — Tích hợp shop scaffold vào site

Sau khi scaffold, **4 công việc bắt buộc**:

**1. `bootstrap.php` — Đăng ký 5 controller:**
```php
$prodCat = new ProductCategoryController($db);
$router->add('GET',  '/product-categories',            [$prodCat, 'index']);
$router->add('GET',  '/product-categories/:id',        [$prodCat, 'show']);
$router->add('POST', '/product-categories',            [$prodCat, 'store']);
$router->add('POST', '/product-categories/:id/update', [$prodCat, 'update']);
$router->add('POST', '/product-categories/:id/delete', [$prodCat, 'destroy']);

$prod = new ProductController($db);
$router->add('GET',  '/products',            [$prod, 'index']);
$router->add('GET',  '/products/:id',        [$prod, 'show']);
$router->add('POST', '/products',            [$prod, 'store']);
$router->add('POST', '/products/:id/update', [$prod, 'update']);
$router->add('POST', '/products/:id/delete', [$prod, 'destroy']);

$order = new OrderController($db);
$router->add('GET',  '/orders',                  [$order, 'index']);
$router->add('GET',  '/orders/:id',               [$order, 'show']);
$router->add('POST', '/orders/:id/update-status', [$order, 'updateStatus']);

$shopSettings = new ShopSettingsController($db);
$router->add('POST', '/settings/sepay-sync', [$shopSettings, 'syncSepayBankAccounts']);

$shopPub = new ShopPublicController($db);
$router->add('GET',  '/public/product-categories',        [$shopPub, 'productCategories']);
$router->add('GET',  '/public/products',                  [$shopPub, 'products']);
$router->add('GET',  '/public/products/:slug',             [$shopPub, 'productBySlug']);
$router->add('GET',  '/public/payment-methods',            [$shopPub, 'paymentMethods']);
$router->add('POST', '/public/orders',                     [$shopPub, 'createOrder']);
$router->add('GET',  '/public/orders/:code/status',        [$shopPub, 'orderStatus']);
$router->add('POST', '/public/sepay-webhook',               [$shopPub, 'sepayWebhook']);
$router->add('GET',  '/sitemap.xml',                       [$shopPub, 'sitemap']);
```

**2. `Database.php::seedSettings()` — Seed 8 keys nhóm `payment`/`shop`:**
- `payment_cod_enabled`, `payment_sepay_enabled`, `sepay_bank_code`, `sepay_account_number`, `sepay_account_name`, `sepay_webhook_secret`, `shipping_fee`, `free_shipping_threshold`

**3. `PublicController::settings()` — Lọc bỏ nhóm `payment` khỏi kết quả:**
```php
WHERE grp NOT IN ('smtp','cloudinary','integrations','payment')
```
(Chặn lộ `sepay_webhook_secret` qua endpoint public)

**4. `Settings.tsx` — Thêm tab payment:**
```tsx
import PaymentSettingsTab from '../../components/PaymentSettingsTab'
// Mảng TABS: { id: 'payment', label: '💳 Thanh toán' }
// JSX: {activeTab === 'payment' && <PaymentSettingsTab val={val} set={set} />}
```

**Website AI tự viết (3 file không scaffold):**
- `ProductsPage.tsx` (sidebar filter 5 block)
- `ProductDetailPage.tsx`
- `CartPage.tsx` (đọc từ `CartContext`)
- `CheckoutPage.tsx` (đã scaffold, chỉ import + route)

---

## Ghi chú quan trọng

- Không dùng schema `shop-ban-hang` cũ làm chuẩn cho site shop tiếp theo — dùng rules 22-24
- Coupon module (nếu cần) tự thêm — không scaffold
- Admin form `ProductForm.tsx` chỉ sửa `COLOR_SWATCHES` để khớp palette site

---

**Xem thêm:** `CLAUDE.md` mục "WebDeploy Shop Scaffold (type shop)" + "WebDeploy Projects & Templates — bảng tra nhanh"
