-- ═══════════════════════════════════════════════════════════════════════════
-- CORE SCHEMA — cố định, dùng chung mọi site WebDeploy — KHÔNG được sửa/đổi tên cột
-- Khớp 1-1 với static controllers đã có sẵn trong scaffold:
-- UserController/Auth.php, SettingsController.php, HeroSlideController.php (+ HeroSlideForm/List.tsx),
-- ContactController.php (+ ContactList.tsx), MediaController.php
-- ═══════════════════════════════════════════════════════════════════════════
PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS users (
    id         INTEGER PRIMARY KEY AUTOINCREMENT,
    name       TEXT    NOT NULL,
    email      TEXT    NOT NULL UNIQUE,
    password   TEXT    NOT NULL,
    role       TEXT    NOT NULL DEFAULT 'user',
    created_at TEXT    NOT NULL DEFAULT (datetime('now','localtime'))
);

CREATE TABLE IF NOT EXISTS settings (
    key   TEXT PRIMARY KEY,
    value TEXT NOT NULL DEFAULT '',
    grp   TEXT NOT NULL DEFAULT 'general'
);

CREATE TABLE IF NOT EXISTS hero_slides (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    title       TEXT NOT NULL,
    subtitle    TEXT NOT NULL DEFAULT '',
    image       TEXT NOT NULL DEFAULT '',
    button_text TEXT NOT NULL DEFAULT '',
    button_link TEXT NOT NULL DEFAULT '',
    sort_order  INTEGER NOT NULL DEFAULT 0,
    status      TEXT NOT NULL DEFAULT 'published',
    created_at  TEXT NOT NULL DEFAULT (datetime('now','localtime'))
);

CREATE TABLE IF NOT EXISTS contacts (
    id         INTEGER PRIMARY KEY AUTOINCREMENT,
    name       TEXT NOT NULL,
    email      TEXT NOT NULL DEFAULT '',
    phone      TEXT NOT NULL DEFAULT '',
    subject    TEXT NOT NULL DEFAULT '',
    message    TEXT NOT NULL DEFAULT '',
    status     TEXT NOT NULL DEFAULT 'new',
    created_at TEXT NOT NULL DEFAULT (datetime('now','localtime'))
);

CREATE TABLE IF NOT EXISTS media (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    filename    TEXT NOT NULL,
    filepath    TEXT NOT NULL,
    filesize    INTEGER NOT NULL DEFAULT 0,
    filetype    TEXT NOT NULL DEFAULT '',
    alt_text    TEXT NOT NULL DEFAULT '',
    uploaded_by INTEGER REFERENCES users(id) ON DELETE SET NULL,
    created_at  TEXT NOT NULL DEFAULT (datetime('now','localtime'))
);

-- ═══════════════════════════════════════════════════════════════════════════
-- ▼ EXTENSION TABLES — AI (web-deploy-builder) thêm bảng riêng theo ngách TỪ ĐÂY.
-- KHÔNG sửa/xoá/đổi tên cột của 5 bảng core phía trên.
-- ═══════════════════════════════════════════════════════════════════════════

-- ═══════════════════════════════════════════════════════════════════════════
-- SHOP EXTENSION — tự động append bởi scaffolder.mjs khi type=shop.
-- Khớp 1-1 với các controller tĩnh: ProductCategoryController.php, ProductController.php,
-- OrderController.php, ShopPublicController.php — KHÔNG đổi tên/xoá các cột base bên dưới.
-- AI được phép thêm cột vào CUỐI mỗi bảng (brand, gallery, sizes, features, specs, origin...)
-- nếu template cần — nhưng phải thêm tương ứng vào ProductController.php whitelist (xem comment
-- trong file đó) và ProductForm.tsx (đánh dấu EXTRA FIELDS).
-- ═══════════════════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS product_categories (
    id         INTEGER PRIMARY KEY AUTOINCREMENT,
    name       TEXT NOT NULL,
    slug       TEXT NOT NULL UNIQUE,
    image      TEXT NOT NULL DEFAULT '',
    sort_order INTEGER NOT NULL DEFAULT 0,
    created_at TEXT NOT NULL DEFAULT (datetime('now','localtime'))
);

CREATE TABLE IF NOT EXISTS products (
    id           INTEGER PRIMARY KEY AUTOINCREMENT,
    category_id  INTEGER REFERENCES product_categories(id) ON DELETE SET NULL,
    name         TEXT NOT NULL,
    slug         TEXT NOT NULL UNIQUE,
    image        TEXT NOT NULL DEFAULT '',
    price        INTEGER NOT NULL DEFAULT 0,
    price_sale   INTEGER,
    badge        TEXT NOT NULL DEFAULT '',
    description  TEXT NOT NULL DEFAULT '',
    colors       TEXT NOT NULL DEFAULT '',      -- pipe-separated "Tên:#hex"
    rating       REAL NOT NULL DEFAULT 5,
    in_stock     INTEGER NOT NULL DEFAULT 1,
    is_featured  INTEGER NOT NULL DEFAULT 0,
    is_new       INTEGER NOT NULL DEFAULT 0,
    status       TEXT NOT NULL DEFAULT 'published',
    sort_order   INTEGER NOT NULL DEFAULT 0,
    created_at   TEXT NOT NULL DEFAULT (datetime('now','localtime')),
    updated_at   TEXT NOT NULL DEFAULT (datetime('now','localtime')),
    -- ▼ Cột riêng theo template (san-pham.html có block filter "Kích thước" S/M/L/XL — pipe-separated "S|M|L")
    sizes        TEXT NOT NULL DEFAULT ''
);

-- Đơn hàng — schema CỐ ĐỊNH, khớp 1-1 với OrderController.php + ShopPublicController.php.
-- KHÔNG đổi tên cột — mọi UI Order (admin) đã hardcode đúng các tên này.
CREATE TABLE IF NOT EXISTS orders (
    id              INTEGER PRIMARY KEY AUTOINCREMENT,
    order_code      TEXT NOT NULL UNIQUE,
    customer_name   TEXT NOT NULL,
    phone           TEXT NOT NULL,
    email           TEXT NOT NULL DEFAULT '',
    address         TEXT NOT NULL,
    note            TEXT NOT NULL DEFAULT '',
    subtotal        INTEGER NOT NULL DEFAULT 0,
    shipping_fee    INTEGER NOT NULL DEFAULT 0,
    discount        INTEGER NOT NULL DEFAULT 0,
    coupon_code     TEXT,
    total           INTEGER NOT NULL DEFAULT 0,
    payment_method  TEXT NOT NULL DEFAULT 'cod',   -- 'cod' | 'sepay'
    payment_status  TEXT NOT NULL DEFAULT 'unpaid', -- 'unpaid' | 'pending' | 'paid'
    status          TEXT NOT NULL DEFAULT 'pending', -- 'pending'|'processing'|'shipping'|'completed'|'cancelled'
    created_at      TEXT NOT NULL DEFAULT (datetime('now','localtime')),
    updated_at      TEXT NOT NULL DEFAULT (datetime('now','localtime'))
);

CREATE TABLE IF NOT EXISTS order_items (
    id           INTEGER PRIMARY KEY AUTOINCREMENT,
    order_id     INTEGER NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    product_id   INTEGER REFERENCES products(id) ON DELETE SET NULL,
    product_name TEXT NOT NULL,
    price        INTEGER NOT NULL DEFAULT 0,
    qty          INTEGER NOT NULL DEFAULT 1,
    subtotal     INTEGER NOT NULL DEFAULT 0
);

-- Settings nhóm 'payment' + 'shop' — seed trong Database.php::seedSettings() (AI viết, xem builder.md rule shop).
-- Keys bắt buộc: payment_cod_enabled, payment_sepay_enabled, sepay_bank_code, sepay_account_number,
-- sepay_account_name, sepay_webhook_secret, shipping_fee, free_shipping_threshold

-- ═══════════════════════════════════════════════════════════════════════════
-- COUPON EXTENSION — mã giảm giá riêng của site này, độc lập với hệ discount
-- của System DB webdrop.store. Khớp 1-1 với CouponController.php (admin CRUD)
-- và ShopPublicController::lookupCoupon()/validateCoupon()/createOrder().
-- ═══════════════════════════════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS coupons (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    code        TEXT    NOT NULL UNIQUE,
    type        TEXT    NOT NULL DEFAULT 'percent', -- percent | fixed
    value       INTEGER NOT NULL DEFAULT 0,
    min_order   INTEGER NOT NULL DEFAULT 0,
    max_uses    INTEGER,
    used_count  INTEGER NOT NULL DEFAULT 0,
    expires_at  TEXT,
    is_active   INTEGER NOT NULL DEFAULT 1,
    created_at  TEXT    NOT NULL DEFAULT (datetime('now','localtime'))
);
