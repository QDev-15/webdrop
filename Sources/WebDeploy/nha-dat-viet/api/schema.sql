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
-- Ngách: Bất động sản — sàn giao dịch tổng hợp (Loại hình A, mô hình 1 agency quản lý
-- catalog tin đăng của mình qua 1 admin panel — KHÔNG phải marketplace nhiều tài khoản).
-- ═══════════════════════════════════════════════════════════════════════════

-- Đội ngũ môi giới (môi giới phụ trách từng tin đăng + hiển thị ở trang Giới thiệu)
CREATE TABLE IF NOT EXISTS agents (
    id         INTEGER PRIMARY KEY AUTOINCREMENT,
    name       TEXT NOT NULL,
    title      TEXT NOT NULL DEFAULT '',
    phone      TEXT NOT NULL DEFAULT '',
    zalo       TEXT NOT NULL DEFAULT '',
    avatar     TEXT NOT NULL DEFAULT '',
    sort_order INTEGER NOT NULL DEFAULT 0,
    created_at TEXT NOT NULL DEFAULT (datetime('now','localtime'))
);

-- Tin đăng bất động sản (catalog chính — bat-dong-san.html + chi-tiet-bds.html)
CREATE TABLE IF NOT EXISTS properties (
    id            INTEGER PRIMARY KEY AUTOINCREMENT,
    title         TEXT NOT NULL,
    slug          TEXT NOT NULL UNIQUE,
    listing_type  TEXT NOT NULL DEFAULT 'ban',        -- ban | cho-thue
    property_type TEXT NOT NULL DEFAULT 'chung-cu',    -- chung-cu|nha-pho|dat-nen|biet-thu|shophouse|can-ho-dich-vu
    price         REAL NOT NULL DEFAULT 0,
    price_unit    TEXT NOT NULL DEFAULT 'tỷ',           -- tỷ | triệu/tháng
    area          REAL NOT NULL DEFAULT 0,
    bedrooms      INTEGER NOT NULL DEFAULT 0,
    bathrooms     INTEGER NOT NULL DEFAULT 0,
    direction     TEXT NOT NULL DEFAULT 'dong',
    legal_status  TEXT NOT NULL DEFAULT 'so-hong',
    furnishing    TEXT NOT NULL DEFAULT 'co-ban',
    district      TEXT NOT NULL DEFAULT 'quan-1',
    street        TEXT NOT NULL DEFAULT '',
    lat           REAL NOT NULL DEFAULT 10.7756,
    lng           REAL NOT NULL DEFAULT 106.7019,
    badge         TEXT NOT NULL DEFAULT '',            -- '' | moi | hot | da-ban | dang-giao-dich
    posted_date   TEXT NOT NULL DEFAULT (date('now')),
    agent_id      INTEGER REFERENCES agents(id) ON DELETE SET NULL,
    description   TEXT NOT NULL DEFAULT '',
    features      TEXT NOT NULL DEFAULT '',            -- pipe-separated: "Tính năng 1|Tính năng 2"
    images        TEXT NOT NULL DEFAULT '',            -- pipe-separated URL
    created_at    TEXT NOT NULL DEFAULT (datetime('now','localtime'))
);
CREATE INDEX IF NOT EXISTS idx_properties_listing  ON properties(listing_type);
CREATE INDEX IF NOT EXISTS idx_properties_type     ON properties(property_type);
CREATE INDEX IF NOT EXISTS idx_properties_district ON properties(district);

-- Dự án đang phân phối (du-an.html — Nhà Đất Việt hợp tác phân phối, không phải chủ đầu tư)
CREATE TABLE IF NOT EXISTS projects (
    id           INTEGER PRIMARY KEY AUTOINCREMENT,
    title        TEXT NOT NULL,
    image        TEXT NOT NULL DEFAULT '',
    status_label TEXT NOT NULL DEFAULT 'Đang mở bán',
    description  TEXT NOT NULL DEFAULT '',
    investor     TEXT NOT NULL DEFAULT '',
    price_label  TEXT NOT NULL DEFAULT '',
    area_label   TEXT NOT NULL DEFAULT '',
    sort_order   INTEGER NOT NULL DEFAULT 0,
    created_at   TEXT NOT NULL DEFAULT (datetime('now','localtime'))
);

-- Đánh giá khách hàng (trang chủ + có thể tái dùng nơi khác) — template luôn hiển thị 5 sao
-- cố định (★★★★★) nên KHÔNG có cột rating riêng, tránh field thừa không khớp UI thực tế.
CREATE TABLE IF NOT EXISTS testimonials (
    id         INTEGER PRIMARY KEY AUTOINCREMENT,
    avatar     TEXT NOT NULL DEFAULT '',
    name       TEXT NOT NULL,
    role       TEXT NOT NULL DEFAULT '',
    content    TEXT NOT NULL DEFAULT '',
    sort_order INTEGER NOT NULL DEFAULT 0,
    created_at TEXT NOT NULL DEFAULT (datetime('now','localtime'))
);

-- Câu hỏi thường gặp (mục H)
CREATE TABLE IF NOT EXISTS faqs (
    id         INTEGER PRIMARY KEY AUTOINCREMENT,
    question   TEXT NOT NULL,
    answer     TEXT NOT NULL DEFAULT '',
    sort_order INTEGER NOT NULL DEFAULT 0,
    created_at TEXT NOT NULL DEFAULT (datetime('now','localtime'))
);
