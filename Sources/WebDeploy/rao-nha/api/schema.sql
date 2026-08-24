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
-- rao-nha là sàn giao dịch BĐS (marketplace) — có 2 hệ thống tài khoản SONG SONG:
--   1. `users` (core, phía trên) — admin sysadmin quản trị nội dung/kiểm duyệt (Auth.php)
--   2. `accounts` (dưới đây) — người đăng tin công khai (chính chủ/môi giới tự do/
--      công ty môi giới) tự đăng ký/đăng nhập ở website, xử lý bởi AccountAuth.php
--      — HOÀN TOÀN TÁCH BIỆT khỏi `users`, không dùng chung session/bảng.
-- ═══════════════════════════════════════════════════════════════════════════

-- Tài khoản người đăng tin công khai (chính chủ / môi giới tự do / công ty môi giới)
CREATE TABLE IF NOT EXISTS accounts (
    id             INTEGER PRIMARY KEY AUTOINCREMENT,
    name           TEXT    NOT NULL,
    email          TEXT    NOT NULL UNIQUE,
    phone          TEXT    NOT NULL DEFAULT '',
    password       TEXT    NOT NULL,
    role           TEXT    NOT NULL DEFAULT 'chinh-chu',   -- chinh-chu | moi-gioi-tu-do | cong-ty-moi-gioi
    avatar         TEXT    NOT NULL DEFAULT '',
    credit_balance INTEGER NOT NULL DEFAULT 0 CHECK (credit_balance >= 0),
    status         TEXT    NOT NULL DEFAULT 'active',       -- active | banned
    created_at     TEXT    NOT NULL DEFAULT (datetime('now','localtime'))
);

-- Lịch sử biến động ví credit (nạp tiền, trừ khi mua/gia hạn/nâng cấp gói VIP)
CREATE TABLE IF NOT EXISTS wallet_transactions (
    id         INTEGER PRIMARY KEY AUTOINCREMENT,
    account_id INTEGER NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
    type       TEXT    NOT NULL DEFAULT 'nap',        -- nap | tru
    amount     INTEGER NOT NULL DEFAULT 0,             -- luôn dương; type quyết định cộng/trừ khi hiển thị
    method     TEXT    NOT NULL DEFAULT 'he-thong',    -- sepay | chuyen-khoan-thu-cong | he-thong
    note       TEXT    NOT NULL DEFAULT '',
    status     TEXT    NOT NULL DEFAULT 'completed',   -- pending | completed | rejected
    sepay_ref  TEXT    NOT NULL DEFAULT '',
    created_at TEXT    NOT NULL DEFAULT (datetime('now','localtime'))
);

-- Tin đăng bất động sản
CREATE TABLE IF NOT EXISTS listings (
    id            INTEGER PRIMARY KEY AUTOINCREMENT,
    account_id    INTEGER NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
    title         TEXT    NOT NULL,
    slug          TEXT    NOT NULL UNIQUE,
    listing_type  TEXT    NOT NULL DEFAULT 'ban',          -- ban | cho-thue
    property_type TEXT    NOT NULL DEFAULT 'chung-cu',     -- chung-cu | nha-pho | dat-nen | biet-thu | shophouse | can-ho-dich-vu
    price         INTEGER NOT NULL DEFAULT 0,
    area          REAL    NOT NULL DEFAULT 0,
    bedrooms      INTEGER NOT NULL DEFAULT 0,
    bathrooms     INTEGER NOT NULL DEFAULT 0,
    direction     TEXT    NOT NULL DEFAULT 'dong',
    legal_status  TEXT    NOT NULL DEFAULT 'so-do',
    furnishing    TEXT    NOT NULL DEFAULT 'co-ban',
    district      TEXT    NOT NULL DEFAULT '',
    city          TEXT    NOT NULL DEFAULT '',
    address       TEXT    NOT NULL DEFAULT '',
    lat           REAL    NOT NULL DEFAULT 0,
    lng           REAL    NOT NULL DEFAULT 0,
    description   TEXT    NOT NULL DEFAULT '',
    features      TEXT    NOT NULL DEFAULT '',              -- pipe-separated
    images        TEXT    NOT NULL DEFAULT '',              -- pipe-separated URL
    tier          TEXT    NOT NULL DEFAULT 'thuong',         -- thuong | vip-bac | vip-vang | vip-kim-cuong
    status        TEXT    NOT NULL DEFAULT 'pending',        -- pending | approved | rejected
    posted_at     TEXT    NOT NULL DEFAULT (datetime('now','localtime')),
    expires_at    TEXT    NOT NULL DEFAULT (datetime('now','localtime')),
    created_at    TEXT    NOT NULL DEFAULT (datetime('now','localtime'))
);
CREATE INDEX IF NOT EXISTS idx_listings_status  ON listings(status);
CREATE INDEX IF NOT EXISTS idx_listings_account ON listings(account_id);

-- Bảng giá gói tin (khớp 4 gói trong dang-tin.html)
CREATE TABLE IF NOT EXISTS listing_packages (
    tier          TEXT PRIMARY KEY,
    label         TEXT    NOT NULL,
    price         INTEGER NOT NULL DEFAULT 0,
    duration_days INTEGER NOT NULL DEFAULT 30,
    benefits      TEXT    NOT NULL DEFAULT '',   -- pipe-separated
    sort_order    INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS faqs (
    id         INTEGER PRIMARY KEY AUTOINCREMENT,
    question   TEXT    NOT NULL,
    answer     TEXT    NOT NULL DEFAULT '',
    sort_order INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS articles (
    id           INTEGER PRIMARY KEY AUTOINCREMENT,
    title        TEXT NOT NULL,
    slug         TEXT NOT NULL UNIQUE,
    category     TEXT NOT NULL DEFAULT '',
    thumbnail    TEXT NOT NULL DEFAULT '',
    excerpt      TEXT NOT NULL DEFAULT '',
    content      TEXT NOT NULL DEFAULT '',
    author       TEXT NOT NULL DEFAULT '',
    published_at TEXT NOT NULL DEFAULT (datetime('now','localtime'))
);

CREATE TABLE IF NOT EXISTS testimonials (
    id         INTEGER PRIMARY KEY AUTOINCREMENT,
    name       TEXT    NOT NULL,
    role       TEXT    NOT NULL DEFAULT '',
    avatar     TEXT    NOT NULL DEFAULT '',
    content    TEXT    NOT NULL DEFAULT '',
    rating     INTEGER NOT NULL DEFAULT 5,
    sort_order INTEGER NOT NULL DEFAULT 0
);
