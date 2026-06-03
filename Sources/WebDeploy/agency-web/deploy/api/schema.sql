-- Agency Web — Database Schema
-- Generated for SQLite with FK support
PRAGMA foreign_keys = ON;

-- ══ CORE TABLES ══════════════════════════════════════════

CREATE TABLE IF NOT EXISTS users (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    name        TEXT    NOT NULL,
    email       TEXT    NOT NULL UNIQUE,
    password    TEXT    NOT NULL,
    role        TEXT    NOT NULL DEFAULT 'user' CHECK(role IN ('superadmin','user')),
    created_at  DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS contacts (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    name        TEXT    NOT NULL,
    email       TEXT,
    phone       TEXT,
    subject     TEXT,
    service     TEXT,
    message     TEXT    NOT NULL,
    status      TEXT    DEFAULT 'new' CHECK(status IN ('new','read','replied')),
    created_at  DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS settings (
    key     TEXT PRIMARY KEY,
    value   TEXT,
    "group" TEXT NOT NULL DEFAULT 'general'
);

CREATE TABLE IF NOT EXISTS hero_slides (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    title       TEXT    NOT NULL,
    subtitle    TEXT,
    badge_text  TEXT,
    button_text TEXT,
    button_link TEXT,
    button2_text TEXT,
    button2_link TEXT,
    image       TEXT,
    stat1_num   TEXT,
    stat1_label TEXT,
    stat2_num   TEXT,
    stat2_label TEXT,
    stat3_num   TEXT,
    stat3_label TEXT,
    sort_order  INTEGER DEFAULT 0,
    status      TEXT    DEFAULT 'published' CHECK(status IN ('published','draft')),
    created_at  DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS media (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    filename    TEXT    NOT NULL,
    filepath    TEXT    NOT NULL,
    filesize    INTEGER,
    filetype    TEXT,
    alt_text    TEXT,
    uploaded_by INTEGER REFERENCES users(id) ON DELETE SET NULL,
    created_at  DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- ══ EXTENSION: AGENCY ════════════════════════════════════

CREATE TABLE IF NOT EXISTS services (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    name        TEXT    NOT NULL,
    slug        TEXT    UNIQUE,
    description TEXT,
    content     TEXT,
    icon        TEXT,
    image       TEXT,
    price_text  TEXT,
    features    TEXT,   -- JSON array
    featured    INTEGER DEFAULT 0,
    sort_order  INTEGER DEFAULT 0,
    status      TEXT    DEFAULT 'published' CHECK(status IN ('published','draft')),
    created_at  DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS projects (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    title       TEXT    NOT NULL,
    slug        TEXT    UNIQUE,
    category    TEXT,   -- web, app, brand
    industry    TEXT,   -- Bất động sản, F&B, Beauty, Startup...
    description TEXT,
    image       TEXT,
    client      TEXT,
    url         TEXT,
    featured    INTEGER DEFAULT 0,
    sort_order  INTEGER DEFAULT 0,
    status      TEXT    DEFAULT 'published' CHECK(status IN ('published','draft')),
    created_at  DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS team_members (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    name        TEXT    NOT NULL,
    position    TEXT,
    bio         TEXT,
    avatar      TEXT,
    sort_order  INTEGER DEFAULT 0,
    status      TEXT    DEFAULT 'published' CHECK(status IN ('published','draft'))
);

CREATE TABLE IF NOT EXISTS testimonials (
    id           INTEGER PRIMARY KEY AUTOINCREMENT,
    author_name  TEXT    NOT NULL,
    author_title TEXT,
    author_avatar TEXT,
    content      TEXT    NOT NULL,
    rating       INTEGER DEFAULT 5,
    sort_order   INTEGER DEFAULT 0,
    status       TEXT    DEFAULT 'published' CHECK(status IN ('published','draft'))
);

CREATE TABLE IF NOT EXISTS posts (
    id               INTEGER PRIMARY KEY AUTOINCREMENT,
    title            TEXT    NOT NULL,
    slug             TEXT    UNIQUE,
    excerpt          TEXT,
    content          TEXT,
    thumbnail        TEXT,
    category         TEXT,
    status           TEXT    DEFAULT 'draft' CHECK(status IN ('draft','published')),
    featured         INTEGER DEFAULT 0,
    meta_title       TEXT,
    meta_description TEXT,
    created_by       INTEGER REFERENCES users(id) ON DELETE SET NULL,
    created_at       DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at       DATETIME DEFAULT CURRENT_TIMESTAMP
);
