PRAGMA foreign_keys = ON;

-- ── Core Tables ──────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS users (
    id         INTEGER PRIMARY KEY AUTOINCREMENT,
    name       TEXT    NOT NULL,
    email      TEXT    NOT NULL UNIQUE,
    password   TEXT    NOT NULL,
    role       TEXT    NOT NULL DEFAULT 'user',
    created_at TEXT    NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS hero_slides (
    id         INTEGER PRIMARY KEY AUTOINCREMENT,
    title      TEXT,
    subtitle   TEXT,
    image      TEXT,
    btn_text   TEXT,
    btn_link   TEXT,
    sort_order INTEGER NOT NULL DEFAULT 0,
    is_active  INTEGER NOT NULL DEFAULT 1,
    created_at TEXT    NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS contacts (
    id         INTEGER PRIMARY KEY AUTOINCREMENT,
    name       TEXT    NOT NULL,
    phone      TEXT,
    email      TEXT,
    topic      TEXT,
    message    TEXT    NOT NULL,
    status     TEXT    NOT NULL DEFAULT 'new',
    created_at TEXT    NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS settings (
    key   TEXT PRIMARY KEY,
    value TEXT,
    grp   TEXT NOT NULL DEFAULT 'general'
);

CREATE TABLE IF NOT EXISTS media (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    filename    TEXT NOT NULL,
    filepath    TEXT NOT NULL,
    filesize    INTEGER,
    filetype    TEXT,
    alt_text    TEXT,
    uploaded_by INTEGER,
    created_at  TEXT NOT NULL DEFAULT (datetime('now')),
    FOREIGN KEY (uploaded_by) REFERENCES users(id) ON DELETE SET NULL
);

-- ── Extension Tables: Shop Thời Trang ──────────────────────────────────────────

CREATE TABLE IF NOT EXISTS product_categories (
    id         INTEGER PRIMARY KEY AUTOINCREMENT,
    name       TEXT    NOT NULL,
    slug       TEXT    NOT NULL UNIQUE,
    image      TEXT,
    sort_order INTEGER NOT NULL DEFAULT 0,
    created_at TEXT    NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS products (
    id            INTEGER PRIMARY KEY AUTOINCREMENT,
    category_id   INTEGER,
    name          TEXT    NOT NULL,
    slug          TEXT    NOT NULL UNIQUE,
    brand         TEXT,
    image         TEXT,
    gallery       TEXT,                        -- pipe-separated URL ảnh phụ (thumbnail gallery)
    price         INTEGER NOT NULL DEFAULT 0,
    price_sale    INTEGER,
    badge         TEXT,                        -- "Mới" | "Hot" | "-30%" | "Bán chạy" ...
    description   TEXT,
    features      TEXT,                        -- mỗi dòng 1 bullet — tab "Mô tả"
    specs         TEXT,                        -- JSON [[label,value], ...] — tab "Thông số"
    material      TEXT,
    origin        TEXT    NOT NULL DEFAULT 'Việt Nam',
    colors        TEXT,                        -- pipe-separated "Tên:#hex"
    sizes         TEXT,                        -- pipe-separated "XS|S|M|L|XL|XXL"
    rating        REAL    NOT NULL DEFAULT 5,
    review_count  INTEGER NOT NULL DEFAULT 0,
    sold_count    INTEGER NOT NULL DEFAULT 0,
    stock_qty     INTEGER NOT NULL DEFAULT 50,
    in_stock      INTEGER NOT NULL DEFAULT 1,   -- 1 = còn hàng, 0 = hết hàng (cột lọc riêng theo rule 38)
    is_featured   INTEGER NOT NULL DEFAULT 0,
    is_new        INTEGER NOT NULL DEFAULT 0,
    status        TEXT    NOT NULL DEFAULT 'published',
    sort_order    INTEGER NOT NULL DEFAULT 0,
    created_at    TEXT    NOT NULL DEFAULT (datetime('now')),
    updated_at    TEXT    NOT NULL DEFAULT (datetime('now')),
    FOREIGN KEY (category_id) REFERENCES product_categories(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS product_reviews (
    id           INTEGER PRIMARY KEY AUTOINCREMENT,
    product_id   INTEGER NOT NULL,
    author_name  TEXT    NOT NULL,
    rating       INTEGER NOT NULL DEFAULT 5,
    variant_note TEXT,                          -- vd "Size M — Màu Trắng"
    review_date  TEXT,
    content      TEXT    NOT NULL,
    sort_order   INTEGER NOT NULL DEFAULT 0,
    created_at   TEXT    NOT NULL DEFAULT (datetime('now')),
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS testimonials (
    id                INTEGER PRIMARY KEY AUTOINCREMENT,
    author_name       TEXT    NOT NULL,
    author_avatar     TEXT,
    author_role       TEXT,
    content           TEXT    NOT NULL,
    stars             INTEGER NOT NULL DEFAULT 5,
    product_purchased TEXT,
    is_active         INTEGER NOT NULL DEFAULT 1,
    sort_order        INTEGER NOT NULL DEFAULT 0,
    created_at        TEXT    NOT NULL DEFAULT (datetime('now'))
);

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
    created_at  TEXT    NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS orders (
    id             INTEGER PRIMARY KEY AUTOINCREMENT,
    order_code     TEXT    NOT NULL UNIQUE,
    customer_name  TEXT    NOT NULL,
    phone          TEXT    NOT NULL,
    email          TEXT,
    address        TEXT    NOT NULL,
    note           TEXT,
    subtotal       INTEGER NOT NULL DEFAULT 0,
    shipping_fee   INTEGER NOT NULL DEFAULT 0,
    discount       INTEGER NOT NULL DEFAULT 0,
    coupon_code    TEXT,
    total          INTEGER NOT NULL DEFAULT 0,
    payment_method TEXT    NOT NULL DEFAULT 'cod',    -- cod | sepay
    payment_status TEXT    NOT NULL DEFAULT 'unpaid', -- unpaid | pending | paid
    status         TEXT    NOT NULL DEFAULT 'pending', -- pending | processing | shipping | completed | cancelled
    created_at     TEXT    NOT NULL DEFAULT (datetime('now')),
    updated_at     TEXT    NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS order_items (
    id           INTEGER PRIMARY KEY AUTOINCREMENT,
    order_id     INTEGER NOT NULL,
    product_id   INTEGER,
    product_name TEXT    NOT NULL,
    color        TEXT,
    size         TEXT,
    price        INTEGER NOT NULL DEFAULT 0,
    qty          INTEGER NOT NULL DEFAULT 1,
    subtotal     INTEGER NOT NULL DEFAULT 0,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE SET NULL
);
