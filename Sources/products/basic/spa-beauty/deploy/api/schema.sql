PRAGMA foreign_keys = ON;

-- Core tables

CREATE TABLE IF NOT EXISTS users (
    id         INTEGER PRIMARY KEY AUTOINCREMENT,
    name       TEXT    NOT NULL,
    email      TEXT    NOT NULL UNIQUE,
    password   TEXT    NOT NULL,
    role       TEXT    NOT NULL DEFAULT 'user',
    created_at TEXT    NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS settings (
    key   TEXT PRIMARY KEY,
    value TEXT,
    grp   TEXT NOT NULL DEFAULT 'general'
);

CREATE TABLE IF NOT EXISTS hero_slides (
    id         INTEGER PRIMARY KEY AUTOINCREMENT,
    image      TEXT    NOT NULL,
    alt        TEXT    NOT NULL DEFAULT '',
    sort_order INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS media (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    filename    TEXT    NOT NULL,
    filepath    TEXT    NOT NULL,
    filesize    INTEGER,
    filetype    TEXT,
    alt_text    TEXT    DEFAULT '',
    uploaded_by INTEGER REFERENCES users(id) ON DELETE SET NULL,
    created_at  TEXT    NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS contacts (
    id         INTEGER PRIMARY KEY AUTOINCREMENT,
    name       TEXT    NOT NULL,
    phone      TEXT,
    email      TEXT,
    subject    TEXT,
    message    TEXT    NOT NULL,
    status     TEXT    NOT NULL DEFAULT 'new',
    created_at TEXT    NOT NULL DEFAULT (datetime('now'))
);

-- Extension tables for spa-beauty

CREATE TABLE IF NOT EXISTS service_categories (
    id         INTEGER PRIMARY KEY AUTOINCREMENT,
    name       TEXT    NOT NULL,
    icon       TEXT    NOT NULL DEFAULT '💆',
    sort_order INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS services (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    category_id INTEGER REFERENCES service_categories(id) ON DELETE SET NULL,
    name        TEXT    NOT NULL,
    tag         TEXT    NOT NULL DEFAULT '',
    description TEXT    NOT NULL DEFAULT '',
    price       TEXT    NOT NULL DEFAULT '',
    duration    TEXT    NOT NULL DEFAULT '',
    image       TEXT    NOT NULL DEFAULT '',
    featured    INTEGER NOT NULL DEFAULT 0,
    sort_order  INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS bookings (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    name        TEXT    NOT NULL,
    phone       TEXT    NOT NULL,
    service     TEXT    NOT NULL,
    therapist   TEXT    NOT NULL DEFAULT '',
    date        TEXT    NOT NULL,
    time        TEXT    NOT NULL,
    note        TEXT    NOT NULL DEFAULT '',
    status      TEXT    NOT NULL DEFAULT 'new',
    created_at  TEXT    NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS gallery_items (
    id         INTEGER PRIMARY KEY AUTOINCREMENT,
    image      TEXT    NOT NULL,
    title      TEXT    NOT NULL DEFAULT '',
    sort_order INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS testimonials (
    id              INTEGER PRIMARY KEY AUTOINCREMENT,
    author_name     TEXT    NOT NULL,
    author_location TEXT    NOT NULL DEFAULT '',
    author_avatar   TEXT    NOT NULL DEFAULT '',
    content         TEXT    NOT NULL,
    rating          INTEGER NOT NULL DEFAULT 5,
    sort_order      INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS team_members (
    id         INTEGER PRIMARY KEY AUTOINCREMENT,
    name       TEXT    NOT NULL,
    role       TEXT    NOT NULL DEFAULT '',
    image      TEXT    NOT NULL DEFAULT '',
    experience TEXT    NOT NULL DEFAULT '',
    specialty1 TEXT    NOT NULL DEFAULT '',
    specialty2 TEXT    NOT NULL DEFAULT '',
    sort_order INTEGER NOT NULL DEFAULT 0
);
