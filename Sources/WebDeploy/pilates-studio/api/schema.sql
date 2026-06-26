PRAGMA foreign_keys = ON;

-- ═══════════════════════════════════════════════════
-- CORE TABLES
-- ═══════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS users (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  name       TEXT    NOT NULL,
  email      TEXT    NOT NULL UNIQUE,
  password   TEXT    NOT NULL,
  role       TEXT    NOT NULL DEFAULT 'user' CHECK (role IN ('superadmin','user')),
  created_at TEXT    NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS contacts (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  name       TEXT    NOT NULL,
  email      TEXT,
  phone      TEXT,
  subject    TEXT,
  message    TEXT    NOT NULL,
  status     TEXT    NOT NULL DEFAULT 'new' CHECK (status IN ('new','read','replied')),
  created_at TEXT    NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS settings (
  key        TEXT PRIMARY KEY,
  value      TEXT NOT NULL DEFAULT '',
  grp        TEXT NOT NULL DEFAULT 'general'
);

CREATE TABLE IF NOT EXISTS hero_slides (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  title      TEXT    NOT NULL,
  subtitle   TEXT,
  image_url  TEXT    NOT NULL,
  cta_text   TEXT,
  cta_link   TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0,
  is_active  INTEGER NOT NULL DEFAULT 1,
  created_at TEXT    NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS media (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  filename    TEXT    NOT NULL,
  filepath    TEXT    NOT NULL,
  filesize    INTEGER,
  filetype    TEXT,
  alt_text    TEXT,
  uploaded_by INTEGER REFERENCES users(id) ON DELETE SET NULL,
  created_at  TEXT    NOT NULL DEFAULT (datetime('now'))
);

-- ═══════════════════════════════════════════════════
-- EXTENSION: PILATES STUDIO
-- ═══════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS service_categories (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  name        TEXT    NOT NULL,
  slug        TEXT    NOT NULL UNIQUE,
  description TEXT,
  sort_order  INTEGER NOT NULL DEFAULT 0,
  created_at  TEXT    NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS services (
  id                INTEGER PRIMARY KEY AUTOINCREMENT,
  category_id       INTEGER REFERENCES service_categories(id) ON DELETE SET NULL,
  name              TEXT    NOT NULL,
  slug              TEXT    NOT NULL UNIQUE,
  description       TEXT,
  duration_min      INTEGER,
  max_students      INTEGER,
  level             TEXT,
  price_per_session INTEGER,
  image_url         TEXT,
  tag               TEXT,
  is_featured       INTEGER NOT NULL DEFAULT 0,
  sort_order        INTEGER NOT NULL DEFAULT 0,
  created_at        TEXT    NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS bookings (
  id                INTEGER PRIMARY KEY AUTOINCREMENT,
  name              TEXT    NOT NULL,
  phone             TEXT    NOT NULL,
  email             TEXT,
  birth_year        TEXT,
  class_type        TEXT,
  level             TEXT,
  package           TEXT,
  goal              TEXT,
  preferred_days    TEXT,
  preferred_time    TEXT,
  start_date        TEXT,
  health_conditions TEXT,
  medications       TEXT,
  notes             TEXT,
  status            TEXT    NOT NULL DEFAULT 'new' CHECK (status IN ('new','contacted','confirmed','cancelled')),
  created_at        TEXT    NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS testimonials (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  name        TEXT    NOT NULL,
  role        TEXT,
  avatar_url  TEXT,
  content     TEXT    NOT NULL,
  rating      INTEGER NOT NULL DEFAULT 5,
  is_active   INTEGER NOT NULL DEFAULT 1,
  sort_order  INTEGER NOT NULL DEFAULT 0,
  created_at  TEXT    NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS team (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  name        TEXT    NOT NULL,
  role        TEXT,
  cert        TEXT,
  bio         TEXT,
  image_url   TEXT,
  tags        TEXT,
  sort_order  INTEGER NOT NULL DEFAULT 0,
  is_active   INTEGER NOT NULL DEFAULT 1,
  created_at  TEXT    NOT NULL DEFAULT (datetime('now'))
);
