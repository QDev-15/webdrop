-- Tiệm Tóc Barber — Schema SQLite
PRAGMA foreign_keys = ON;

-- ── USERS ─────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS users (
    id         INTEGER PRIMARY KEY AUTOINCREMENT,
    name       TEXT    NOT NULL,
    email      TEXT    NOT NULL UNIQUE,
    password   TEXT    NOT NULL,
    role       TEXT    NOT NULL DEFAULT 'user' CHECK (role IN ('superadmin','user')),
    created_at TEXT    NOT NULL DEFAULT (datetime('now'))
);

-- ── SETTINGS ──────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS settings (
    key     TEXT PRIMARY KEY,
    value   TEXT NOT NULL DEFAULT '',
    "group" TEXT NOT NULL DEFAULT 'general'
);

-- ── HERO SLIDES ───────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS hero_slides (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    title       TEXT    NOT NULL,
    subtitle    TEXT    NOT NULL DEFAULT '',
    button_text TEXT    NOT NULL DEFAULT '',
    button_link TEXT    NOT NULL DEFAULT '',
    image       TEXT    NOT NULL DEFAULT '',
    sort_order  INTEGER NOT NULL DEFAULT 0,
    status      TEXT    NOT NULL DEFAULT 'published' CHECK (status IN ('published','draft')),
    created_at  TEXT    NOT NULL DEFAULT (datetime('now'))
);

-- ── SERVICE CATEGORIES ────────────────────────────────────────────────────────
-- Nhóm dịch vụ dùng cho bảng giá trang Dịch vụ — VD: "Cắt & Tạo kiểu Nam", "Nhuộm tóc"...
-- tag: nhãn ngắn hiển thị trên card dịch vụ nổi bật trang chủ ("Tóc Nam", "Barber"...)
CREATE TABLE IF NOT EXISTS service_categories (
    id         INTEGER PRIMARY KEY AUTOINCREMENT,
    name       TEXT    NOT NULL,
    slug       TEXT    NOT NULL UNIQUE,
    icon       TEXT    NOT NULL DEFAULT '',
    tag        TEXT    NOT NULL DEFAULT '',
    sort_order INTEGER NOT NULL DEFAULT 0,
    created_at TEXT    NOT NULL DEFAULT (datetime('now'))
);

-- ── SERVICES ──────────────────────────────────────────────────────────────────
-- Từng dòng dịch vụ trong bảng giá + card dịch vụ nổi bật trang chủ (is_featured=1)
-- note: ghi chú ngắn dưới tên dịch vụ (VD: "Wash + cắt + sấy")
-- price_text: hiển thị dạng text vì template có cả giá cố định ("100.000đ") lẫn khoảng giá ("350.000đ–550.000đ")
CREATE TABLE IF NOT EXISTS services (
    id           INTEGER PRIMARY KEY AUTOINCREMENT,
    category_id  INTEGER NOT NULL REFERENCES service_categories(id) ON DELETE CASCADE,
    name         TEXT    NOT NULL,
    note         TEXT    NOT NULL DEFAULT '',
    description  TEXT    NOT NULL DEFAULT '',
    price_text   TEXT    NOT NULL DEFAULT '',
    image        TEXT    NOT NULL DEFAULT '',
    is_featured  INTEGER NOT NULL DEFAULT 0,
    sort_order   INTEGER NOT NULL DEFAULT 0,
    status       TEXT    NOT NULL DEFAULT 'published' CHECK (status IN ('published','draft')),
    created_at   TEXT    NOT NULL DEFAULT (datetime('now'))
);

-- ── BOOKINGS (Đặt lịch) ───────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS bookings (
    id           INTEGER PRIMARY KEY AUTOINCREMENT,
    full_name    TEXT    NOT NULL,
    phone        TEXT    NOT NULL,
    service_name TEXT    NOT NULL DEFAULT '',
    stylist_pref TEXT    NOT NULL DEFAULT '',
    pref_date    TEXT    NOT NULL DEFAULT '',
    pref_time    TEXT    NOT NULL DEFAULT '',
    note         TEXT    NOT NULL DEFAULT '',
    status       TEXT    NOT NULL DEFAULT 'new' CHECK (status IN ('new','confirmed','completed','cancelled')),
    created_at   TEXT    NOT NULL DEFAULT (datetime('now'))
);

-- ── TEAM (Stylist / Barber) ───────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS team (
    id         INTEGER PRIMARY KEY AUTOINCREMENT,
    name       TEXT    NOT NULL,
    role       TEXT    NOT NULL DEFAULT '',
    specialty  TEXT    NOT NULL DEFAULT '',
    image      TEXT    NOT NULL DEFAULT '',
    sort_order INTEGER NOT NULL DEFAULT 0,
    status     TEXT    NOT NULL DEFAULT 'published' CHECK (status IN ('published','draft')),
    created_at TEXT    NOT NULL DEFAULT (datetime('now'))
);

-- ── TESTIMONIALS ──────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS testimonials (
    id            INTEGER PRIMARY KEY AUTOINCREMENT,
    customer_name TEXT    NOT NULL,
    avatar        TEXT    NOT NULL DEFAULT '',
    meta          TEXT    NOT NULL DEFAULT '',
    rating        INTEGER NOT NULL DEFAULT 5 CHECK (rating BETWEEN 1 AND 5),
    content       TEXT    NOT NULL,
    status        TEXT    NOT NULL DEFAULT 'published' CHECK (status IN ('published','draft')),
    sort_order    INTEGER NOT NULL DEFAULT 0,
    created_at    TEXT    NOT NULL DEFAULT (datetime('now'))
);

-- ── GALLERY ───────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS gallery_items (
    id         INTEGER PRIMARY KEY AUTOINCREMENT,
    image      TEXT    NOT NULL,
    alt_text   TEXT    NOT NULL DEFAULT '',
    sort_order INTEGER NOT NULL DEFAULT 0,
    status     TEXT    NOT NULL DEFAULT 'published' CHECK (status IN ('published','draft')),
    created_at TEXT    NOT NULL DEFAULT (datetime('now'))
);

-- ── CONTACTS ──────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS contacts (
    id         INTEGER PRIMARY KEY AUTOINCREMENT,
    name       TEXT    NOT NULL,
    email      TEXT    NOT NULL DEFAULT '',
    phone      TEXT    NOT NULL DEFAULT '',
    subject    TEXT    NOT NULL DEFAULT '',
    message    TEXT    NOT NULL DEFAULT '',
    status     TEXT    NOT NULL DEFAULT 'new' CHECK (status IN ('new','read','replied')),
    created_at TEXT    NOT NULL DEFAULT (datetime('now'))
);

-- ── MEDIA ─────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS media (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    filename    TEXT    NOT NULL,
    filepath    TEXT    NOT NULL,
    filesize    INTEGER NOT NULL DEFAULT 0,
    filetype    TEXT    NOT NULL DEFAULT '',
    alt_text    TEXT    NOT NULL DEFAULT '',
    uploaded_by INTEGER NOT NULL DEFAULT 1,
    created_at  TEXT    NOT NULL DEFAULT (datetime('now'))
);
