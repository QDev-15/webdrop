PRAGMA foreign_keys = ON;
PRAGMA journal_mode = WAL;

-- ── Core tables ──────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS users (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  name       TEXT    NOT NULL,
  email      TEXT    NOT NULL UNIQUE,
  password   TEXT    NOT NULL,
  role       TEXT    NOT NULL DEFAULT 'user' CHECK(role IN ('superadmin','user')),
  created_at TEXT    NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS settings (
  key   TEXT PRIMARY KEY,
  value TEXT,
  grp   TEXT NOT NULL DEFAULT 'general'
);

CREATE TABLE IF NOT EXISTS hero_slides (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  title      TEXT,
  subtitle   TEXT,
  image      TEXT    NOT NULL,
  badge      TEXT,
  cta_text   TEXT,
  cta_url    TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0,
  status     TEXT    NOT NULL DEFAULT 'published',
  created_at TEXT    NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS media (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  filename    TEXT NOT NULL,
  filepath    TEXT NOT NULL,
  filesize    INTEGER,
  filetype    TEXT,
  alt_text    TEXT,
  uploaded_by INTEGER REFERENCES users(id) ON DELETE SET NULL,
  created_at  TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS contacts (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  name       TEXT NOT NULL,
  email      TEXT,
  phone      TEXT,
  subject    TEXT,
  message    TEXT,
  status     TEXT NOT NULL DEFAULT 'new' CHECK(status IN ('new','read','replied')),
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

-- ── Restaurant extension tables ───────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS menu_categories (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  name        TEXT    NOT NULL,
  name_fr     TEXT,
  slug        TEXT    NOT NULL UNIQUE,
  description TEXT,
  image       TEXT,
  sort_order  INTEGER NOT NULL DEFAULT 0,
  status      TEXT    NOT NULL DEFAULT 'published',
  created_at  TEXT    NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS menu_items (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  category_id INTEGER REFERENCES menu_categories(id) ON DELETE SET NULL,
  name        TEXT    NOT NULL,
  name_fr     TEXT,
  description TEXT,
  price       REAL,
  price_sale  REAL,
  image       TEXT,
  badge       TEXT,
  allergens   TEXT,
  featured    INTEGER NOT NULL DEFAULT 0,
  sort_order  INTEGER NOT NULL DEFAULT 0,
  status      TEXT    NOT NULL DEFAULT 'published',
  created_at  TEXT    NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS reservations (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  name       TEXT    NOT NULL,
  phone      TEXT    NOT NULL,
  email      TEXT,
  date       TEXT    NOT NULL,
  time       TEXT    NOT NULL,
  guests     INTEGER NOT NULL DEFAULT 2,
  occasion   TEXT,
  note       TEXT,
  menu_pkg   TEXT,
  status     TEXT    NOT NULL DEFAULT 'pending' CHECK(status IN ('pending','confirmed','cancelled')),
  created_at TEXT    NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS gallery_items (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  title       TEXT,
  description TEXT,
  image       TEXT    NOT NULL,
  category    TEXT    NOT NULL DEFAULT 'food',
  sort_order  INTEGER NOT NULL DEFAULT 0,
  status      TEXT    NOT NULL DEFAULT 'published',
  created_at  TEXT    NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS testimonials (
  id           INTEGER PRIMARY KEY AUTOINCREMENT,
  author_name  TEXT    NOT NULL,
  author_title TEXT,
  author_avatar TEXT,
  content      TEXT    NOT NULL,
  rating       INTEGER NOT NULL DEFAULT 5,
  sort_order   INTEGER NOT NULL DEFAULT 0,
  status       TEXT    NOT NULL DEFAULT 'published',
  created_at   TEXT    NOT NULL DEFAULT (datetime('now'))
);
