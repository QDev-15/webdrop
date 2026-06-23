PRAGMA foreign_keys = ON;

-- ─── Core tables ──────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS users (
    id         INTEGER PRIMARY KEY AUTOINCREMENT,
    name       TEXT NOT NULL,
    email      TEXT NOT NULL UNIQUE,
    password   TEXT NOT NULL,
    role       TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('superadmin','user')),
    created_at TEXT NOT NULL DEFAULT (datetime('now','localtime'))
);

CREATE TABLE IF NOT EXISTS settings (
    key   TEXT PRIMARY KEY,
    value TEXT NOT NULL DEFAULT '',
    grp   TEXT NOT NULL DEFAULT 'general'
);

CREATE TABLE IF NOT EXISTS hero_slides (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    title       TEXT NOT NULL DEFAULT '',
    subtitle    TEXT NOT NULL DEFAULT '',
    button_text TEXT NOT NULL DEFAULT '',
    button_link TEXT NOT NULL DEFAULT '',
    image       TEXT NOT NULL DEFAULT '',
    sort_order  INTEGER NOT NULL DEFAULT 0,
    status      TEXT NOT NULL DEFAULT 'published' CHECK (status IN ('published','draft')),
    created_at  TEXT NOT NULL DEFAULT (datetime('now','localtime'))
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

CREATE TABLE IF NOT EXISTS contacts (
    id         INTEGER PRIMARY KEY AUTOINCREMENT,
    name       TEXT NOT NULL,
    email      TEXT NOT NULL DEFAULT '',
    phone      TEXT NOT NULL DEFAULT '',
    subject    TEXT NOT NULL DEFAULT '',
    message    TEXT NOT NULL,
    status     TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new','read','replied')),
    created_at TEXT NOT NULL DEFAULT (datetime('now','localtime'))
);

-- ─── Extension tables — beauty-studio ─────────────────────────────────────────

CREATE TABLE IF NOT EXISTS service_categories (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    name        TEXT NOT NULL,
    slug        TEXT NOT NULL UNIQUE,
    icon        TEXT NOT NULL DEFAULT '',
    description TEXT NOT NULL DEFAULT '',
    image       TEXT NOT NULL DEFAULT '',
    sort_order  INTEGER NOT NULL DEFAULT 0,
    created_at  TEXT NOT NULL DEFAULT (datetime('now','localtime'))
);

CREATE TABLE IF NOT EXISTS services (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    category_id INTEGER REFERENCES service_categories(id) ON DELETE SET NULL,
    name        TEXT NOT NULL,
    description TEXT NOT NULL DEFAULT '',
    price       TEXT NOT NULL DEFAULT '',
    image       TEXT NOT NULL DEFAULT '',
    badge       TEXT NOT NULL DEFAULT '',
    sort_order  INTEGER NOT NULL DEFAULT 0,
    is_featured INTEGER NOT NULL DEFAULT 0,
    created_at  TEXT NOT NULL DEFAULT (datetime('now','localtime'))
);

CREATE TABLE IF NOT EXISTS bookings (
    id             INTEGER PRIMARY KEY AUTOINCREMENT,
    name           TEXT NOT NULL,
    phone          TEXT NOT NULL,
    service_group  TEXT NOT NULL DEFAULT '',
    service_detail TEXT NOT NULL DEFAULT '',
    stylist        TEXT NOT NULL DEFAULT '',
    book_date      TEXT NOT NULL,
    book_time      TEXT NOT NULL,
    note           TEXT NOT NULL DEFAULT '',
    status         TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','confirmed','cancelled','done')),
    created_at     TEXT NOT NULL DEFAULT (datetime('now','localtime'))
);

CREATE TABLE IF NOT EXISTS testimonials (
    id            INTEGER PRIMARY KEY AUTOINCREMENT,
    author_name   TEXT NOT NULL,
    author_title  TEXT NOT NULL DEFAULT '',
    author_avatar TEXT NOT NULL DEFAULT '',
    content       TEXT NOT NULL,
    rating        INTEGER NOT NULL DEFAULT 5 CHECK (rating BETWEEN 1 AND 5),
    sort_order    INTEGER NOT NULL DEFAULT 0,
    is_visible    INTEGER NOT NULL DEFAULT 1,
    created_at    TEXT NOT NULL DEFAULT (datetime('now','localtime'))
);

CREATE TABLE IF NOT EXISTS team_members (
    id         INTEGER PRIMARY KEY AUTOINCREMENT,
    name       TEXT NOT NULL,
    role       TEXT NOT NULL,
    bio        TEXT NOT NULL DEFAULT '',
    avatar     TEXT NOT NULL DEFAULT '',
    sort_order INTEGER NOT NULL DEFAULT 0,
    is_visible INTEGER NOT NULL DEFAULT 1,
    created_at TEXT NOT NULL DEFAULT (datetime('now','localtime'))
);

CREATE TABLE IF NOT EXISTS gallery_items (
    id         INTEGER PRIMARY KEY AUTOINCREMENT,
    image      TEXT NOT NULL,
    title      TEXT NOT NULL DEFAULT '',
    category   TEXT NOT NULL DEFAULT '',
    sort_order INTEGER NOT NULL DEFAULT 0,
    created_at TEXT NOT NULL DEFAULT (datetime('now','localtime'))
);

CREATE TABLE IF NOT EXISTS promo_combos (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    tag         TEXT NOT NULL DEFAULT '',
    title       TEXT NOT NULL,
    description TEXT NOT NULL DEFAULT '',
    price_new   TEXT NOT NULL DEFAULT '',
    price_old   TEXT NOT NULL DEFAULT '',
    sort_order  INTEGER NOT NULL DEFAULT 0,
    is_visible  INTEGER NOT NULL DEFAULT 1,
    created_at  TEXT NOT NULL DEFAULT (datetime('now','localtime'))
);
