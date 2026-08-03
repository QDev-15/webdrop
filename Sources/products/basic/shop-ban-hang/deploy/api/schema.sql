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

-- ── Extension Tables: Shop ────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS product_categories (
    id         INTEGER PRIMARY KEY AUTOINCREMENT,
    name       TEXT    NOT NULL,
    slug       TEXT    NOT NULL UNIQUE,
    image      TEXT,
    sort_order INTEGER NOT NULL DEFAULT 0,
    created_at TEXT    NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS products (
    id           INTEGER PRIMARY KEY AUTOINCREMENT,
    category_id  INTEGER,
    name         TEXT    NOT NULL,
    slug         TEXT    NOT NULL UNIQUE,
    image        TEXT,
    price        INTEGER NOT NULL DEFAULT 0,
    price_sale   INTEGER,
    badge        TEXT,
    description  TEXT,
    material     TEXT,
    colors       TEXT,                        -- pipe-separated "Tên:#hex" — vd "Terracotta:#c4603a|Sage:#6b8a7a"
    gallery      TEXT    DEFAULT '',           -- JSON array of additional image URLs
    rating       REAL    NOT NULL DEFAULT 5,   -- điểm đánh giá trung bình (0-5)
    in_stock     INTEGER NOT NULL DEFAULT 1,   -- 1 = còn hàng, 0 = hết hàng
    is_featured  INTEGER NOT NULL DEFAULT 0,
    is_new       INTEGER NOT NULL DEFAULT 0,
    status       TEXT    NOT NULL DEFAULT 'published',
    sort_order   INTEGER NOT NULL DEFAULT 0,
    created_at   TEXT    NOT NULL DEFAULT (datetime('now')),
    updated_at   TEXT    NOT NULL DEFAULT (datetime('now')),
    FOREIGN KEY (category_id) REFERENCES product_categories(id) ON DELETE SET NULL
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
    coupon_code    TEXT    DEFAULT '',
    total          INTEGER NOT NULL DEFAULT 0,
    payment_method TEXT    NOT NULL DEFAULT 'cod',    -- cod | sepay
    payment_status TEXT    NOT NULL DEFAULT 'unpaid', -- unpaid | pending | paid
    status         TEXT    NOT NULL DEFAULT 'pending', -- pending | processing | shipping | completed | cancelled
    created_at     TEXT    NOT NULL DEFAULT (datetime('now')),
    updated_at     TEXT    NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS coupons (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    code        TEXT    NOT NULL UNIQUE,
    type        TEXT    NOT NULL DEFAULT 'percent',   -- percent | fixed
    value       REAL    NOT NULL DEFAULT 0,
    min_order   REAL    NOT NULL DEFAULT 0,
    max_uses    INTEGER,                              -- NULL = không giới hạn
    used_count  INTEGER NOT NULL DEFAULT 0,
    expires_at  TEXT,                                 -- NULL = không giới hạn
    is_active   INTEGER NOT NULL DEFAULT 1,
    created_at  TEXT    NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS order_items (
    id           INTEGER PRIMARY KEY AUTOINCREMENT,
    order_id     INTEGER NOT NULL,
    product_id   INTEGER,
    product_name TEXT    NOT NULL,
    price        INTEGER NOT NULL DEFAULT 0,
    qty          INTEGER NOT NULL DEFAULT 1,
    subtotal     INTEGER NOT NULL DEFAULT 0,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS testimonials (
    id                INTEGER PRIMARY KEY AUTOINCREMENT,
    author_name       TEXT NOT NULL,
    author_avatar     TEXT,
    author_location   TEXT,
    content           TEXT NOT NULL,
    stars             INTEGER NOT NULL DEFAULT 5,
    product_purchased TEXT,
    is_active         INTEGER NOT NULL DEFAULT 1,
    sort_order        INTEGER NOT NULL DEFAULT 0,
    created_at        TEXT    NOT NULL DEFAULT (datetime('now'))
);
