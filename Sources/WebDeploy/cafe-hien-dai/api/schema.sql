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

-- Danh mục thực đơn (5 tabs: Espresso-based, Pour Over/Syphon, Cold Brew, Trà, Bánh & Snack)
CREATE TABLE IF NOT EXISTS menu_categories (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    name        TEXT NOT NULL,
    slug        TEXT UNIQUE,
    description TEXT NOT NULL DEFAULT '',
    image       TEXT NOT NULL DEFAULT '',
    sort_order  INTEGER NOT NULL DEFAULT 0,
    status      TEXT NOT NULL DEFAULT 'published',
    created_at  TEXT NOT NULL DEFAULT (datetime('now','localtime'))
);

-- Món trong thực đơn — featured=1 hiển thị ở trang chủ kèm ảnh + badge (tag ngắn)
CREATE TABLE IF NOT EXISTS menu_items (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    category_id INTEGER REFERENCES menu_categories(id) ON DELETE SET NULL,
    name        TEXT NOT NULL,
    slug        TEXT UNIQUE,
    description TEXT NOT NULL DEFAULT '',
    price       REAL,
    price_sale  REAL,
    image       TEXT NOT NULL DEFAULT '',
    badge       TEXT NOT NULL DEFAULT '',
    allergens   TEXT NOT NULL DEFAULT '',
    featured    INTEGER NOT NULL DEFAULT 0,
    sort_order  INTEGER NOT NULL DEFAULT 0,
    status      TEXT NOT NULL DEFAULT 'published',
    created_at  TEXT NOT NULL DEFAULT (datetime('now','localtime'))
);

-- Thư viện ảnh không gian quán (khong-gian.html masonry — không có filter tabs)
CREATE TABLE IF NOT EXISTS gallery_items (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    title       TEXT NOT NULL DEFAULT '',
    description TEXT NOT NULL DEFAULT '',
    image       TEXT NOT NULL,
    category    TEXT NOT NULL DEFAULT '',
    sort_order  INTEGER NOT NULL DEFAULT 0,
    status      TEXT NOT NULL DEFAULT 'published',
    created_at  TEXT NOT NULL DEFAULT (datetime('now','localtime'))
);

-- Đánh giá khách hàng (index.html testimonial track)
CREATE TABLE IF NOT EXISTS testimonials (
    id            INTEGER PRIMARY KEY AUTOINCREMENT,
    author_name   TEXT NOT NULL,
    author_title  TEXT NOT NULL DEFAULT '',
    author_avatar TEXT NOT NULL DEFAULT '',
    content       TEXT NOT NULL DEFAULT '',
    rating        INTEGER NOT NULL DEFAULT 5,
    sort_order    INTEGER NOT NULL DEFAULT 0,
    status        TEXT NOT NULL DEFAULT 'published',
    created_at    TEXT NOT NULL DEFAULT (datetime('now','localtime'))
);

-- Gộp 3 danh sách icon+text ngắn (Vì sao chọn / Giá trị cốt lõi / Tiện ích) qua cột `section`
-- — đơn giản hoá kiến trúc (mỗi section vẫn CRUD độc lập trong admin qua filter theo section).
CREATE TABLE IF NOT EXISTS content_blocks (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    section     TEXT NOT NULL,             -- 'why-us' | 'values' | 'amenities'
    icon        TEXT NOT NULL DEFAULT '',
    title       TEXT NOT NULL,
    description TEXT NOT NULL DEFAULT '',
    sort_order  INTEGER NOT NULL DEFAULT 0,
    status      TEXT NOT NULL DEFAULT 'published'
);

-- Khu vực quán — dùng chung cho preview 3 thẻ trang chủ (overlay_text) và trang
-- Không gian (description đầy đủ hơn)
CREATE TABLE IF NOT EXISTS spaces (
    id           INTEGER PRIMARY KEY AUTOINCREMENT,
    name         TEXT NOT NULL,
    caption      TEXT NOT NULL DEFAULT '',
    overlay_text TEXT NOT NULL DEFAULT '',
    description  TEXT NOT NULL DEFAULT '',
    image        TEXT NOT NULL DEFAULT '',
    sort_order   INTEGER NOT NULL DEFAULT 0,
    status       TEXT NOT NULL DEFAULT 'published'
);

-- Đội ngũ barista (gioi-thieu.html)
CREATE TABLE IF NOT EXISTS team_members (
    id         INTEGER PRIMARY KEY AUTOINCREMENT,
    name       TEXT NOT NULL,
    position   TEXT NOT NULL DEFAULT '',
    bio        TEXT NOT NULL DEFAULT '',
    avatar     TEXT NOT NULL DEFAULT '',
    sort_order INTEGER NOT NULL DEFAULT 0,
    status     TEXT NOT NULL DEFAULT 'published'
);

-- Hành trình thương hiệu (gioi-thieu.html timeline)
CREATE TABLE IF NOT EXISTS timeline_items (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    year        TEXT NOT NULL,
    phase       TEXT NOT NULL DEFAULT '',
    title       TEXT NOT NULL,
    description TEXT NOT NULL DEFAULT '',
    sort_order  INTEGER NOT NULL DEFAULT 0,
    status      TEXT NOT NULL DEFAULT 'published'
);

-- Câu hỏi thường gặp (index.html FAQ accordion)
CREATE TABLE IF NOT EXISTS faqs (
    id         INTEGER PRIMARY KEY AUTOINCREMENT,
    question   TEXT NOT NULL,
    answer     TEXT NOT NULL,
    sort_order INTEGER NOT NULL DEFAULT 0,
    status     TEXT NOT NULL DEFAULT 'published'
);
