PRAGMA foreign_keys = ON;

-- ════════════════════════════════════════════════
-- CORE TABLES
-- ════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS users (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  name       TEXT NOT NULL,
  email      TEXT NOT NULL UNIQUE,
  password   TEXT NOT NULL,
  role       TEXT NOT NULL DEFAULT 'user' CHECK(role IN ('superadmin','user')),
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS settings (
  key    TEXT PRIMARY KEY,
  value  TEXT,
  "group" TEXT NOT NULL DEFAULT 'general'
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

-- ════════════════════════════════════════════════
-- SERVICES (Dịch vụ xây dựng)
-- ════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS services (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  name        TEXT NOT NULL,
  slug        TEXT UNIQUE,
  number      TEXT,
  description TEXT,
  content     TEXT,
  icon_svg    TEXT,
  image       TEXT,
  anchor_id   TEXT,
  featured    INTEGER DEFAULT 0,
  sort_order  INTEGER DEFAULT 0,
  status      TEXT DEFAULT 'published' CHECK(status IN ('published','draft')),
  created_at  DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- ════════════════════════════════════════════════
-- PROJECTS (Dự án / Công trình)
-- ════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS project_categories (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  name       TEXT NOT NULL,
  slug       TEXT UNIQUE,
  sort_order INTEGER DEFAULT 0
);

CREATE TABLE IF NOT EXISTS projects (
  id            INTEGER PRIMARY KEY AUTOINCREMENT,
  category_id   INTEGER REFERENCES project_categories(id) ON DELETE SET NULL,
  title         TEXT NOT NULL,
  slug          TEXT UNIQUE,
  category      TEXT,
  location      TEXT,
  area          TEXT,
  floors        TEXT,
  duration      TEXT,
  year          TEXT,
  description   TEXT,
  content       TEXT,
  image         TEXT,
  featured      INTEGER DEFAULT 0,
  sort_order    INTEGER DEFAULT 0,
  status        TEXT DEFAULT 'published' CHECK(status IN ('published','draft')),
  created_at    DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- ════════════════════════════════════════════════
-- TESTIMONIALS (Đánh giá chủ đầu tư)
-- ════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS testimonials (
  id            INTEGER PRIMARY KEY AUTOINCREMENT,
  author_name   TEXT NOT NULL,
  author_title  TEXT,
  author_avatar TEXT,
  content       TEXT NOT NULL,
  rating        INTEGER DEFAULT 5,
  sort_order    INTEGER DEFAULT 0,
  status        TEXT DEFAULT 'published' CHECK(status IN ('published','draft')),
  created_at    DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- ════════════════════════════════════════════════
-- CONTACTS / QUOTE REQUESTS (Yêu cầu báo giá)
-- ════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS contacts (
  id               INTEGER PRIMARY KEY AUTOINCREMENT,
  name             TEXT NOT NULL,
  phone            TEXT NOT NULL,
  email            TEXT,
  construction_type TEXT,
  area             TEXT,
  budget           TEXT,
  location         TEXT,
  message          TEXT,
  status           TEXT DEFAULT 'new' CHECK(status IN ('new','read','replied')),
  created_at       DATETIME DEFAULT CURRENT_TIMESTAMP
);
