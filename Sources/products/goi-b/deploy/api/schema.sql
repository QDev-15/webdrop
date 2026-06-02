-- Gói B — SQLite Schema
-- Chỉ chứa CREATE TABLE — không có seed data
-- Seed được thực hiện bởi Database.php khi khởi động lần đầu

PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS users (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  name       TEXT NOT NULL,
  email      TEXT NOT NULL UNIQUE,
  password   TEXT NOT NULL,
  role       TEXT NOT NULL DEFAULT 'user' CHECK(role IN ('superadmin', 'user')),
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS categories (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  name        TEXT NOT NULL,
  slug        TEXT NOT NULL UNIQUE,
  description TEXT,
  thumbnail   TEXT,
  parent_id   INTEGER REFERENCES categories(id) ON DELETE SET NULL,
  created_at  DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS posts (
  id               INTEGER PRIMARY KEY AUTOINCREMENT,
  title            TEXT NOT NULL,
  slug             TEXT NOT NULL UNIQUE,
  content          TEXT,
  excerpt          TEXT,
  thumbnail        TEXT,
  category_id      INTEGER REFERENCES categories(id) ON DELETE SET NULL,
  status           TEXT NOT NULL DEFAULT 'draft' CHECK(status IN ('draft', 'published')),
  featured         INTEGER NOT NULL DEFAULT 0,
  meta_title       TEXT,
  meta_description TEXT,
  created_by       INTEGER REFERENCES users(id) ON DELETE SET NULL,
  created_at       DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at       DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS pages (
  id               INTEGER PRIMARY KEY AUTOINCREMENT,
  title            TEXT NOT NULL,
  slug             TEXT NOT NULL UNIQUE,
  content          TEXT,
  template         TEXT,
  meta_title       TEXT,
  meta_description TEXT,
  status           TEXT NOT NULL DEFAULT 'draft' CHECK(status IN ('draft', 'published')),
  created_at       DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at       DATETIME DEFAULT CURRENT_TIMESTAMP,
  created_by       INTEGER REFERENCES users(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS media (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  filename    TEXT NOT NULL,
  filepath    TEXT NOT NULL,
  filesize    INTEGER,
  filetype    TEXT,
  alt_text    TEXT,
  uploaded_by INTEGER REFERENCES users(id) ON DELETE SET NULL,
  created_at  DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS banners (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  title      TEXT NOT NULL,
  image      TEXT NOT NULL,
  link       TEXT,
  target     TEXT DEFAULT '_self' CHECK(target IN ('_blank', '_self')),
  position   TEXT NOT NULL,
  sort_order INTEGER DEFAULT 0,
  status     TEXT DEFAULT 'published',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS contacts (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  name       TEXT NOT NULL,
  email      TEXT,
  phone      TEXT,
  subject    TEXT,
  message    TEXT NOT NULL,
  status     TEXT DEFAULT 'new' CHECK(status IN ('new', 'read', 'replied')),
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS settings (
  key   TEXT PRIMARY KEY,
  value TEXT,
  "group" TEXT NOT NULL
);
