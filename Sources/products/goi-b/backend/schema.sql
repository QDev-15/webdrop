-- Gói B — SQLite Schema
-- Chạy lần đầu khi deploy để tạo bảng
-- Tên bảng và tên cột không được thay đổi giữa các phiên bản

PRAGMA foreign_keys = ON;

-- Core: users
CREATE TABLE IF NOT EXISTS users (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  name       TEXT NOT NULL,
  email      TEXT NOT NULL UNIQUE,
  password   TEXT NOT NULL,
  role       TEXT NOT NULL DEFAULT 'user' CHECK(role IN ('superadmin', 'user')),
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Core: categories
CREATE TABLE IF NOT EXISTS categories (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  name        TEXT NOT NULL,
  slug        TEXT NOT NULL UNIQUE,
  description TEXT,
  thumbnail   TEXT,
  parent_id   INTEGER REFERENCES categories(id) ON DELETE SET NULL,
  created_at  DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Core: posts
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

-- Core: pages
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

-- Core: media
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

-- Core: banners
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

-- Core: contacts
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

-- Core: settings (key-value store)
CREATE TABLE IF NOT EXISTS settings (
  key   TEXT PRIMARY KEY,
  value TEXT,
  group TEXT NOT NULL
);

-- Seed: superadmin mặc định
-- Mật khẩu: admin@123 (đổi ngay sau khi deploy!)
INSERT OR IGNORE INTO users (name, email, password, role)
VALUES ('Admin', 'admin@example.com', '$2y$12$placeholder_bcrypt_hash', 'superadmin');

-- Seed: settings cơ bản
INSERT OR IGNORE INTO settings (key, value, group) VALUES
  ('site_name', 'Tên website', 'general'),
  ('site_description', 'Mô tả website', 'general'),
  ('site_email', 'contact@example.com', 'general'),
  ('site_phone', '', 'general'),
  ('maintenance_mode', '0', 'system');
