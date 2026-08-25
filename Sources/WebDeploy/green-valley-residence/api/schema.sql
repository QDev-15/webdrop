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
--
-- Ngành: Bất động sản — Loại hình B (dự án chủ đầu tư đơn lẻ, không phải sàn
-- môi giới nhiều BĐS khác nhau). Nguồn: Sources/templates/web/Real-Estate/green-valley-residence/
-- ═══════════════════════════════════════════════════════════════════════════

-- Loại căn hộ (10 loại: Studio 1PN → Penthouse) — bang-gia.html + loai-can-chi-tiet.html
CREATE TABLE IF NOT EXISTS unit_types (
    id               INTEGER PRIMARY KEY AUTOINCREMENT,
    name             TEXT    NOT NULL,
    slug             TEXT    NOT NULL UNIQUE,
    type_tag         TEXT    NOT NULL DEFAULT '1pn',      -- 1pn|2pn|3pn|duplex|penthouse
    bedrooms         INTEGER NOT NULL DEFAULT 1,
    bathrooms        INTEGER NOT NULL DEFAULT 1,
    area             REAL    NOT NULL DEFAULT 0,           -- m²
    price_from       REAL    NOT NULL DEFAULT 0,           -- VNĐ
    direction        TEXT    NOT NULL DEFAULT 'dong',
    floor_range      TEXT    NOT NULL DEFAULT '',          -- vd "5-15"
    block            TEXT    NOT NULL DEFAULT '',          -- vd "Tháp Aqua"
    view_desc        TEXT    NOT NULL DEFAULT '',
    status            TEXT   NOT NULL DEFAULT 'con-hang',  -- con-hang|sap-mo-ban|het-hang
    badge            TEXT    NOT NULL DEFAULT '',          -- moi|hot|sap-mo-ban|'' (rỗng)
    floor_plan_image TEXT    NOT NULL DEFAULT '',
    gallery          TEXT    NOT NULL DEFAULT '[]',        -- JSON array chuỗi URL ảnh
    description      TEXT    NOT NULL DEFAULT '',
    features         TEXT    NOT NULL DEFAULT '[]',        -- JSON array chuỗi đặc điểm nổi bật
    is_featured      INTEGER NOT NULL DEFAULT 0,           -- hiển thị ở "4 loại căn bán chạy" trang chủ
    sort_order       INTEGER NOT NULL DEFAULT 0,
    created_at       TEXT    NOT NULL DEFAULT (datetime('now','localtime'))
);

-- Tiện ích nội khu (8 items, bento-grid) — tien-ich.html + index.html preview
CREATE TABLE IF NOT EXISTS amenities (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    name        TEXT    NOT NULL,
    description TEXT    NOT NULL DEFAULT '',
    image       TEXT    NOT NULL DEFAULT '',
    sort_order  INTEGER NOT NULL DEFAULT 0,
    created_at  TEXT    NOT NULL DEFAULT (datetime('now','localtime'))
);

-- Tiện ích xung quanh (external, danh sách tên + khoảng cách) — tien-ich.html + ve-chu-dau-tu.html
CREATE TABLE IF NOT EXISTS nearby_amenities (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    name        TEXT    NOT NULL,
    distance    TEXT    NOT NULL DEFAULT '',
    sort_order  INTEGER NOT NULL DEFAULT 0,
    created_at  TEXT    NOT NULL DEFAULT (datetime('now','localtime'))
);

-- Tiến độ thanh toán (7 đợt) — loai-can-chi-tiet.html (PROJECT.paymentSchedule)
CREATE TABLE IF NOT EXISTS payment_phases (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    phase       TEXT    NOT NULL,          -- vd "Đợt 1"
    percent     REAL    NOT NULL DEFAULT 0,
    milestone   TEXT    NOT NULL DEFAULT '',
    sort_order  INTEGER NOT NULL DEFAULT 0,
    created_at  TEXT    NOT NULL DEFAULT (datetime('now','localtime'))
);

-- Chính sách bán hàng / chiết khấu (3 cards) — ve-chu-dau-tu.html "Ưu đãi & hỗ trợ tài chính"
CREATE TABLE IF NOT EXISTS sales_policies (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    icon        TEXT    NOT NULL DEFAULT '💸',
    title       TEXT    NOT NULL,
    description TEXT    NOT NULL DEFAULT '',
    sort_order  INTEGER NOT NULL DEFAULT 0,
    created_at  TEXT    NOT NULL DEFAULT (datetime('now','localtime'))
);

-- Câu hỏi thường gặp (≥6 câu) — index.html FAQ accordion
CREATE TABLE IF NOT EXISTS faqs (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    question    TEXT    NOT NULL,
    answer      TEXT    NOT NULL DEFAULT '',
    sort_order  INTEGER NOT NULL DEFAULT 0,
    created_at  TEXT    NOT NULL DEFAULT (datetime('now','localtime'))
);

-- Đánh giá cư dân / khách đặt chỗ — index.html horizontal-scroll testimonials
CREATE TABLE IF NOT EXISTS testimonials (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    author_name TEXT    NOT NULL,
    author_role TEXT    NOT NULL DEFAULT '',  -- vd "Chủ căn 4-08, Tháp Aqua"
    avatar      TEXT    NOT NULL DEFAULT '',
    content     TEXT    NOT NULL DEFAULT '',
    sort_order  INTEGER NOT NULL DEFAULT 0,
    created_at  TEXT    NOT NULL DEFAULT (datetime('now','localtime'))
);
