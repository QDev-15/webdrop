-- ══ LuxDental — NHA KHOA THẨM MỸ — schema.sql ══
-- PRAGMA foreign_keys = ON; được bật trong Database.php
-- KHÔNG hardcode bcrypt hash ở đây — seed user thực hiện trong Database::seedUsers()

-- Core tables
CREATE TABLE IF NOT EXISTS users (
    id         INTEGER PRIMARY KEY AUTOINCREMENT,
    name       TEXT NOT NULL,
    email      TEXT NOT NULL UNIQUE,
    password   TEXT NOT NULL,
    role       TEXT NOT NULL DEFAULT 'user',
    created_at TEXT NOT NULL DEFAULT (datetime('now','localtime'))
);

CREATE TABLE IF NOT EXISTS settings (
    key     TEXT PRIMARY KEY,
    value   TEXT NOT NULL DEFAULT '',
    "group" TEXT NOT NULL DEFAULT 'general'
);

CREATE TABLE IF NOT EXISTS hero_slides (
    id         INTEGER PRIMARY KEY AUTOINCREMENT,
    title      TEXT NOT NULL,
    subtitle   TEXT NOT NULL DEFAULT '',
    cta_text   TEXT NOT NULL DEFAULT '',
    cta_url    TEXT NOT NULL DEFAULT '',
    image      TEXT NOT NULL DEFAULT '',
    sort_order INTEGER NOT NULL DEFAULT 0,
    is_active  INTEGER NOT NULL DEFAULT 1,
    created_at TEXT NOT NULL DEFAULT (datetime('now','localtime'))
);

CREATE TABLE IF NOT EXISTS contacts (
    id         INTEGER PRIMARY KEY AUTOINCREMENT,
    name       TEXT NOT NULL,
    email      TEXT NOT NULL DEFAULT '',
    phone      TEXT NOT NULL DEFAULT '',
    subject    TEXT NOT NULL DEFAULT '',
    message    TEXT NOT NULL,
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
    uploaded_by INTEGER,
    created_at  TEXT NOT NULL DEFAULT (datetime('now','localtime')),
    FOREIGN KEY (uploaded_by) REFERENCES users(id) ON DELETE SET NULL
);

-- Extension: Dental Clinic (LuxDental)
CREATE TABLE IF NOT EXISTS service_categories (
    id         INTEGER PRIMARY KEY AUTOINCREMENT,
    name       TEXT NOT NULL,
    slug       TEXT NOT NULL UNIQUE,
    sort_order INTEGER NOT NULL DEFAULT 0,
    created_at TEXT NOT NULL DEFAULT (datetime('now','localtime'))
);

CREATE TABLE IF NOT EXISTS services (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    category_id INTEGER,
    name        TEXT NOT NULL,
    description TEXT NOT NULL DEFAULT '',
    image       TEXT NOT NULL DEFAULT '',
    tag         TEXT NOT NULL DEFAULT '',
    price       TEXT NOT NULL DEFAULT '',
    price_unit  TEXT NOT NULL DEFAULT '',
    is_featured INTEGER NOT NULL DEFAULT 0,
    sort_order  INTEGER NOT NULL DEFAULT 0,
    created_at  TEXT NOT NULL DEFAULT (datetime('now','localtime')),
    FOREIGN KEY (category_id) REFERENCES service_categories(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS doctors (
    id               INTEGER PRIMARY KEY AUTOINCREMENT,
    name             TEXT NOT NULL,
    role             TEXT NOT NULL DEFAULT '',
    photo            TEXT NOT NULL DEFAULT '',
    description      TEXT NOT NULL DEFAULT '',
    experience_years INTEGER NOT NULL DEFAULT 0,
    credentials      TEXT NOT NULL DEFAULT '',
    tag              TEXT NOT NULL DEFAULT '',
    sort_order       INTEGER NOT NULL DEFAULT 0,
    created_at       TEXT NOT NULL DEFAULT (datetime('now','localtime'))
);

CREATE TABLE IF NOT EXISTS bookings (
    id         INTEGER PRIMARY KEY AUTOINCREMENT,
    fullname   TEXT NOT NULL,
    phone      TEXT NOT NULL,
    email      TEXT NOT NULL DEFAULT '',
    service    TEXT NOT NULL DEFAULT '',
    pref_date  TEXT NOT NULL DEFAULT '',
    pref_time  TEXT NOT NULL DEFAULT '',
    note       TEXT NOT NULL DEFAULT '',
    status     TEXT NOT NULL DEFAULT 'new',
    created_at TEXT NOT NULL DEFAULT (datetime('now','localtime'))
);

CREATE TABLE IF NOT EXISTS testimonials (
    id            INTEGER PRIMARY KEY AUTOINCREMENT,
    author_name   TEXT NOT NULL,
    author_role   TEXT NOT NULL DEFAULT '',
    author_avatar TEXT NOT NULL DEFAULT '',
    content       TEXT NOT NULL,
    stars         INTEGER NOT NULL DEFAULT 5,
    is_featured   INTEGER NOT NULL DEFAULT 1,
    sort_order    INTEGER NOT NULL DEFAULT 0,
    created_at    TEXT NOT NULL DEFAULT (datetime('now','localtime'))
);
