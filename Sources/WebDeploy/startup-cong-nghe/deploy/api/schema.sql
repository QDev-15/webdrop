PRAGMA foreign_keys = ON;

-- ── USERS ──────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS users (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  name       TEXT NOT NULL,
  email      TEXT NOT NULL UNIQUE,
  password   TEXT NOT NULL,
  role       TEXT NOT NULL DEFAULT 'user' CHECK(role IN ('superadmin','user')),
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- ── SETTINGS ───────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS settings (
  key   TEXT PRIMARY KEY,
  value TEXT,
  "group" TEXT NOT NULL
);

-- ── CONTACTS ───────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS contacts (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  name       TEXT NOT NULL,
  email      TEXT,
  phone      TEXT,
  company    TEXT,
  subject    TEXT,
  message    TEXT NOT NULL,
  status     TEXT DEFAULT 'new' CHECK(status IN ('new','read','replied')),
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- ── HERO SLIDES ────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS hero_slides (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  title       TEXT NOT NULL,
  subtitle    TEXT,
  button_text TEXT,
  button_link TEXT,
  image       TEXT,
  sort_order  INTEGER DEFAULT 0,
  status      TEXT DEFAULT 'published',
  created_at  DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- ── MEDIA ──────────────────────────────────────────────────────────────────
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

-- ── FEATURES (Tính năng sản phẩm) ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS features (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  name        TEXT NOT NULL,
  slug        TEXT UNIQUE,
  tag         TEXT,
  description TEXT,
  content     TEXT,
  icon        TEXT,
  image       TEXT,
  featured    INTEGER DEFAULT 0,
  sort_order  INTEGER DEFAULT 0,
  status      TEXT DEFAULT 'published',
  created_at  DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- ── PRICING PLANS (Gói giá) ────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS pricing_plans (
  id              INTEGER PRIMARY KEY AUTOINCREMENT,
  name            TEXT NOT NULL,
  slug            TEXT UNIQUE,
  description     TEXT,
  price_monthly   REAL DEFAULT 0,
  price_yearly    REAL DEFAULT 0,
  currency        TEXT DEFAULT 'VND',
  is_featured     INTEGER DEFAULT 0,
  is_free         INTEGER DEFAULT 0,
  cta_text        TEXT DEFAULT 'Bắt đầu',
  cta_link        TEXT DEFAULT '/lien-he',
  sort_order      INTEGER DEFAULT 0,
  status          TEXT DEFAULT 'published',
  created_at      DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- ── PRICING PLAN ITEMS (Tính năng trong gói) ──────────────────────────────
CREATE TABLE IF NOT EXISTS pricing_plan_items (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  plan_id    INTEGER NOT NULL REFERENCES pricing_plans(id) ON DELETE CASCADE,
  item       TEXT NOT NULL,
  available  INTEGER DEFAULT 1,
  sort_order INTEGER DEFAULT 0
);

-- ── TESTIMONIALS (Đánh giá) ────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS testimonials (
  id           INTEGER PRIMARY KEY AUTOINCREMENT,
  author_name  TEXT NOT NULL,
  author_title TEXT,
  author_avatar TEXT,
  content      TEXT NOT NULL,
  rating       INTEGER DEFAULT 5,
  sort_order   INTEGER DEFAULT 0,
  status       TEXT DEFAULT 'published',
  created_at   DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- ── DEMO REQUESTS (Đặt lịch demo) ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS demo_requests (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  name       TEXT NOT NULL,
  email      TEXT NOT NULL,
  phone      TEXT,
  time_pref  TEXT,
  note       TEXT,
  status     TEXT DEFAULT 'new' CHECK(status IN ('new','contacted','done','cancelled')),
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- ── FAQ ────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS faqs (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  question   TEXT NOT NULL,
  answer     TEXT NOT NULL,
  sort_order INTEGER DEFAULT 0,
  status     TEXT DEFAULT 'published',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
