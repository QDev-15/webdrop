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
-- Ngách: POS bán hàng (nhà hàng/quán ăn/café/bán lẻ) — port từ template tĩnh
-- Sources/templates/web/POS/shop-banhang/assets/js/seed-data.js.
-- users.role: 'user' = thu ngân (cashier), 'superadmin' = quản lý (admin).
-- ═══════════════════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS categories (
    id         INTEGER PRIMARY KEY AUTOINCREMENT,
    name       TEXT NOT NULL,
    sort_order INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS products (
    id           INTEGER PRIMARY KEY AUTOINCREMENT,
    name         TEXT NOT NULL,
    category_id  INTEGER REFERENCES categories(id) ON DELETE SET NULL,
    price        REAL NOT NULL DEFAULT 0,
    cost_price   REAL NOT NULL DEFAULT 0,
    unit         TEXT NOT NULL DEFAULT '',
    barcode      TEXT,
    stock        INTEGER NOT NULL DEFAULT 0,
    min_stock    INTEGER NOT NULL DEFAULT 0,
    has_variants INTEGER NOT NULL DEFAULT 0,
    image        TEXT NOT NULL DEFAULT '',
    created_at   TEXT NOT NULL DEFAULT (datetime('now','localtime'))
);
CREATE UNIQUE INDEX IF NOT EXISTS idx_products_barcode ON products(barcode) WHERE barcode IS NOT NULL AND barcode != '';

CREATE TABLE IF NOT EXISTS product_variants (
    id         INTEGER PRIMARY KEY AUTOINCREMENT,
    product_id INTEGER NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    sku        TEXT NOT NULL UNIQUE,
    size       TEXT NOT NULL DEFAULT '',
    color      TEXT NOT NULL DEFAULT '',
    stock      INTEGER NOT NULL DEFAULT 0,
    price      REAL NOT NULL DEFAULT 0
);
CREATE INDEX IF NOT EXISTS idx_variants_product ON product_variants(product_id);

CREATE TABLE IF NOT EXISTS customers (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    name        TEXT NOT NULL,
    phone       TEXT NOT NULL UNIQUE,
    email       TEXT NOT NULL DEFAULT '',
    birthday    TEXT NOT NULL DEFAULT '',
    total_spent REAL NOT NULL DEFAULT 0,
    points      INTEGER NOT NULL DEFAULT 0,
    created_at  TEXT NOT NULL DEFAULT (datetime('now','localtime'))
);

CREATE TABLE IF NOT EXISTS shifts (
    id                     INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id                INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    opened_at              TEXT NOT NULL,
    opening_cash           REAL NOT NULL DEFAULT 0,
    closed_at              TEXT,
    closing_cash_counted   REAL,
    closing_cash_expected  REAL,
    difference             REAL,
    status                 TEXT NOT NULL DEFAULT 'open'
);
CREATE INDEX IF NOT EXISTS idx_shifts_user ON shifts(user_id);

CREATE TABLE IF NOT EXISTS orders (
    id             INTEGER PRIMARY KEY AUTOINCREMENT,
    code           TEXT NOT NULL UNIQUE,
    table_no       TEXT NOT NULL DEFAULT '',
    customer_id    INTEGER REFERENCES customers(id) ON DELETE SET NULL,
    subtotal       REAL NOT NULL DEFAULT 0,
    discount       REAL NOT NULL DEFAULT 0,
    total          REAL NOT NULL DEFAULT 0,
    payment_method TEXT NOT NULL DEFAULT 'cash',
    cash_received  REAL,
    change_given   REAL,
    points_earned  INTEGER NOT NULL DEFAULT 0,
    shift_id       INTEGER NOT NULL REFERENCES shifts(id) ON DELETE RESTRICT,
    created_by     INTEGER NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    status         TEXT NOT NULL DEFAULT 'completed',
    has_return     INTEGER NOT NULL DEFAULT 0,
    created_at     TEXT NOT NULL DEFAULT (datetime('now','localtime'))
);
CREATE INDEX IF NOT EXISTS idx_orders_shift ON orders(shift_id);
CREATE INDEX IF NOT EXISTS idx_orders_customer ON orders(customer_id);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at);

CREATE TABLE IF NOT EXISTS order_items (
    id            INTEGER PRIMARY KEY AUTOINCREMENT,
    order_id      INTEGER NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    product_id    INTEGER NOT NULL REFERENCES products(id) ON DELETE RESTRICT,
    variant_sku   TEXT,
    product_name  TEXT NOT NULL,
    unit          TEXT NOT NULL DEFAULT '',
    size          TEXT NOT NULL DEFAULT '',
    color         TEXT NOT NULL DEFAULT '',
    price         REAL NOT NULL DEFAULT 0,
    quantity      INTEGER NOT NULL DEFAULT 1
);
CREATE INDEX IF NOT EXISTS idx_order_items_order ON order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_order_items_product ON order_items(product_id);

CREATE TABLE IF NOT EXISTS suppliers (
    id   INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS stock_imports (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    supplier    TEXT NOT NULL,
    import_date TEXT NOT NULL,
    total_cost  REAL NOT NULL DEFAULT 0,
    created_by  INTEGER REFERENCES users(id) ON DELETE SET NULL,
    created_at  TEXT NOT NULL DEFAULT (datetime('now','localtime'))
);

CREATE TABLE IF NOT EXISTS stock_import_items (
    id           INTEGER PRIMARY KEY AUTOINCREMENT,
    import_id    INTEGER NOT NULL REFERENCES stock_imports(id) ON DELETE CASCADE,
    product_id   INTEGER NOT NULL REFERENCES products(id) ON DELETE RESTRICT,
    variant_sku  TEXT,
    product_name TEXT NOT NULL,
    quantity     INTEGER NOT NULL DEFAULT 0,
    unit_cost    REAL NOT NULL DEFAULT 0
);
CREATE INDEX IF NOT EXISTS idx_stock_import_items_import ON stock_import_items(import_id);

CREATE TABLE IF NOT EXISTS returns (
    id            INTEGER PRIMARY KEY AUTOINCREMENT,
    order_id      INTEGER NOT NULL REFERENCES orders(id) ON DELETE RESTRICT,
    reason        TEXT NOT NULL DEFAULT '',
    refund_amount REAL NOT NULL DEFAULT 0,
    created_by    INTEGER REFERENCES users(id) ON DELETE SET NULL,
    created_at    TEXT NOT NULL DEFAULT (datetime('now','localtime'))
);
CREATE INDEX IF NOT EXISTS idx_returns_order ON returns(order_id);

CREATE TABLE IF NOT EXISTS return_items (
    id           INTEGER PRIMARY KEY AUTOINCREMENT,
    return_id    INTEGER NOT NULL REFERENCES returns(id) ON DELETE CASCADE,
    product_id   INTEGER NOT NULL REFERENCES products(id) ON DELETE RESTRICT,
    variant_sku  TEXT,
    product_name TEXT NOT NULL,
    quantity     INTEGER NOT NULL DEFAULT 0
);
CREATE INDEX IF NOT EXISTS idx_return_items_return ON return_items(return_id);

CREATE TABLE IF NOT EXISTS stocktakes (
    id             INTEGER PRIMARY KEY AUTOINCREMENT,
    stocktake_date TEXT NOT NULL,
    checked_by     TEXT NOT NULL DEFAULT '',
    discrepancies  INTEGER NOT NULL DEFAULT 0,
    created_at     TEXT NOT NULL DEFAULT (datetime('now','localtime'))
);
