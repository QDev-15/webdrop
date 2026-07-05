-- ══ NHA KHOA AN TÂM — ZEN-MINIMAL ══
-- SQLite Schema
-- PRAGMA foreign_keys = ON is set in Database.php on every connection

PRAGMA foreign_keys = ON;

-- ── Core tables ────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS users (
    id         INTEGER PRIMARY KEY AUTOINCREMENT,
    name       TEXT NOT NULL,
    email      TEXT NOT NULL UNIQUE,
    password   TEXT NOT NULL,
    role       TEXT NOT NULL DEFAULT 'user',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS contacts (
    id         INTEGER PRIMARY KEY AUTOINCREMENT,
    name       TEXT NOT NULL,
    email      TEXT,
    phone      TEXT,
    subject    TEXT,
    message    TEXT,
    status     TEXT NOT NULL DEFAULT 'new',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS settings (
    key        TEXT PRIMARY KEY,
    value      TEXT,
    "group"    TEXT NOT NULL DEFAULT 'general'
);

CREATE TABLE IF NOT EXISTS hero_slides (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    title       TEXT,
    subtitle    TEXT,
    button_text TEXT,
    button_link TEXT,
    image       TEXT,
    sort_order  INTEGER DEFAULT 0,
    status      TEXT NOT NULL DEFAULT 'published',
    created_at  DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS media (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    filename    TEXT NOT NULL,
    filepath    TEXT NOT NULL,
    filesize    INTEGER DEFAULT 0,
    filetype    TEXT,
    alt_text    TEXT,
    uploaded_by INTEGER REFERENCES users(id) ON DELETE SET NULL,
    created_at  DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- ── Extension tables — Nha khoa tổng quát An Tâm ──────────────────────────

CREATE TABLE IF NOT EXISTS service_categories (
    id         INTEGER PRIMARY KEY AUTOINCREMENT,
    name       TEXT NOT NULL,
    slug       TEXT NOT NULL UNIQUE,
    sort_order INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS services (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    category_id INTEGER REFERENCES service_categories(id) ON DELETE SET NULL,
    number      TEXT,
    name        TEXT NOT NULL,
    description TEXT,
    price       TEXT,
    price_unit  TEXT,
    is_featured INTEGER NOT NULL DEFAULT 0,
    sort_order  INTEGER DEFAULT 0,
    created_at  DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS doctors (
    id               INTEGER PRIMARY KEY AUTOINCREMENT,
    name             TEXT NOT NULL,
    role             TEXT,
    bio              TEXT,
    photo            TEXT,
    experience_years INTEGER DEFAULT 0,
    specialties      TEXT,
    sort_order       INTEGER DEFAULT 0,
    is_active        INTEGER NOT NULL DEFAULT 1,
    created_at       DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS bookings (
    id         INTEGER PRIMARY KEY AUTOINCREMENT,
    fullname   TEXT NOT NULL,
    phone      TEXT NOT NULL,
    email      TEXT,
    service    TEXT,
    doctor     TEXT,
    date       TEXT,
    time       TEXT,
    note       TEXT,
    status     TEXT NOT NULL DEFAULT 'new',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS testimonials (
    id            INTEGER PRIMARY KEY AUTOINCREMENT,
    author_name   TEXT NOT NULL,
    author_role   TEXT,
    author_avatar TEXT,
    content       TEXT NOT NULL,
    rating        INTEGER NOT NULL DEFAULT 5,
    is_featured   INTEGER NOT NULL DEFAULT 1,
    sort_order    INTEGER DEFAULT 0,
    created_at    DATETIME DEFAULT CURRENT_TIMESTAMP
);
