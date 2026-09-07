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

CREATE TABLE IF NOT EXISTS post_categories (
    id         INTEGER PRIMARY KEY AUTOINCREMENT,
    name       TEXT NOT NULL,
    slug       TEXT NOT NULL UNIQUE,
    icon       TEXT NOT NULL DEFAULT '',
    tag_class  TEXT NOT NULL DEFAULT '',
    sort_order INTEGER NOT NULL DEFAULT 0,
    created_at TEXT NOT NULL DEFAULT (datetime('now','localtime'))
);

CREATE TABLE IF NOT EXISTS posts (
    id             INTEGER PRIMARY KEY AUTOINCREMENT,
    category_id    INTEGER REFERENCES post_categories(id) ON DELETE SET NULL,
    title          TEXT NOT NULL,
    slug           TEXT NOT NULL UNIQUE,
    thumbnail      TEXT NOT NULL DEFAULT '',
    excerpt        TEXT NOT NULL DEFAULT '',
    content        TEXT NOT NULL DEFAULT '',
    tags           TEXT NOT NULL DEFAULT '',
    gallery_images TEXT NOT NULL DEFAULT '',
    read_time      INTEGER NOT NULL DEFAULT 5,
    published_date TEXT NOT NULL DEFAULT '',
    updated_date   TEXT NOT NULL DEFAULT '',
    featured       INTEGER NOT NULL DEFAULT 0,
    sort_order     INTEGER NOT NULL DEFAULT 0,
    status         TEXT NOT NULL DEFAULT 'published',
    created_at     TEXT NOT NULL DEFAULT (datetime('now','localtime'))
);

CREATE TABLE IF NOT EXISTS destinations (
    id             INTEGER PRIMARY KEY AUTOINCREMENT,
    name           TEXT NOT NULL,
    category_label TEXT NOT NULL DEFAULT '',
    image          TEXT NOT NULL DEFAULT '',
    sort_order     INTEGER NOT NULL DEFAULT 0,
    status         TEXT NOT NULL DEFAULT 'published'
);

CREATE TABLE IF NOT EXISTS faqs (
    id         INTEGER PRIMARY KEY AUTOINCREMENT,
    question   TEXT NOT NULL,
    answer     TEXT NOT NULL,
    sort_order INTEGER NOT NULL DEFAULT 0,
    status     TEXT NOT NULL DEFAULT 'published'
);
