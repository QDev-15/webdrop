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
    -- ▼ Cột riêng shop-ruou-vang (rượu vang) — khớp UI thực trong template gốc (index.html toolbar filter)
    origin       TEXT NOT NULL DEFAULT '',      -- phap|y|chile|tay-ban-nha|argentina|uc|my|duc|nam-phi
    abv          REAL NOT NULL DEFAULT 0,       -- nồng độ cồn (%)
    volume       INTEGER NOT NULL DEFAULT 750,  -- dung tích (ml)
    occasion     TEXT NOT NULL DEFAULT '',      -- csv: qua-tang,tiec-tung,suu-tam,khai-vi,hang-ngay
    sold         INTEGER NOT NULL DEFAULT 0     -- số lượng đã bán (dùng cho sort "Bán chạy")
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
-- shop-ruou-vang EXTENSION — 2 bảng mới (testimonials, coupons) khớp UI thực
-- trong template gốc (index.html, khuyen-mai.html). Cột riêng của products (rượu vang:
-- origin/abv/volume/occasion/sold) đã được thêm trực tiếp vào cuối CREATE TABLE products ở trên.
-- ═══════════════════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS testimonials (
    id            INTEGER PRIMARY KEY AUTOINCREMENT,
    author_name   TEXT NOT NULL,
    author_role   TEXT NOT NULL DEFAULT '',
    author_avatar TEXT NOT NULL DEFAULT '',
    content       TEXT NOT NULL,
    rating        INTEGER NOT NULL DEFAULT 5,
    sort_order    INTEGER NOT NULL DEFAULT 0,
    created_at    TEXT NOT NULL DEFAULT (datetime('now','localtime'))
);

-- Mã khuyến mãi hiển thị dạng thẻ thông tin (voucher-card) tại trang /khuyen-mai — khớp
-- khuyen-mai.html gốc (VANG50/FREESHIP/VIP10). KHÔNG có luồng "áp dụng mã" tự động trong
-- template gốc (không có ô nhập mã ở gio-hang.html) — bảng này chỉ phục vụ admin quản lý nội dung
-- hiển thị, đúng rule 4 (mọi text trên trang chính phải quản lý được qua admin).
CREATE TABLE IF NOT EXISTS coupons (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    code        TEXT NOT NULL UNIQUE,
    description TEXT NOT NULL DEFAULT '',
    sort_order  INTEGER NOT NULL DEFAULT 0,
    created_at  TEXT NOT NULL DEFAULT (datetime('now','localtime'))
);
