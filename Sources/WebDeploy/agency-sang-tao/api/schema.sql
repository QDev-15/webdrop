PRAGMA foreign_keys = ON;

-- ── Users ────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS users (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  name       TEXT    NOT NULL,
  email      TEXT    NOT NULL UNIQUE,
  password   TEXT    NOT NULL,
  role       TEXT    NOT NULL DEFAULT 'user' CHECK(role IN ('superadmin','user')),
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- ── Contacts (form liên hệ) ──────────────────────────────
CREATE TABLE IF NOT EXISTS contacts (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  name       TEXT NOT NULL,
  email      TEXT,
  phone      TEXT,
  company    TEXT,
  service    TEXT,
  budget     TEXT,
  subject    TEXT,
  message    TEXT NOT NULL,
  status     TEXT DEFAULT 'new' CHECK(status IN ('new','read','replied')),
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- ── Settings (key-value store) ───────────────────────────
CREATE TABLE IF NOT EXISTS settings (
  key   TEXT PRIMARY KEY,
  value TEXT,
  "group" TEXT NOT NULL
);

-- ── Hero Slides (không dùng cho agency-sang-tao vì hero là typography-only)
-- Giữ lại để tương thích core schema
CREATE TABLE IF NOT EXISTS hero_slides (
  id           INTEGER PRIMARY KEY AUTOINCREMENT,
  title        TEXT NOT NULL,
  subtitle     TEXT,
  badge_text   TEXT,
  button_text  TEXT,
  button_link  TEXT,
  button2_text TEXT,
  button2_link TEXT,
  image        TEXT,
  stat1_num    TEXT,
  stat1_label  TEXT,
  stat2_num    TEXT,
  stat2_label  TEXT,
  stat3_num    TEXT,
  stat3_label  TEXT,
  sort_order   INTEGER DEFAULT 0,
  status       TEXT DEFAULT 'published',
  created_at   DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- ── Services (Dịch vụ) ──────────────────────────────────
CREATE TABLE IF NOT EXISTS services (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  name        TEXT NOT NULL,
  slug        TEXT UNIQUE,
  number      TEXT,
  description TEXT,
  content     TEXT,
  icon        TEXT,
  tags        TEXT,
  price_text  TEXT,
  featured    INTEGER DEFAULT 0,
  sort_order  INTEGER DEFAULT 0,
  status      TEXT DEFAULT 'published',
  created_at  DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- ── Projects (Dự án / Portfolio) ───────────────────────
CREATE TABLE IF NOT EXISTS projects (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  title       TEXT NOT NULL,
  slug        TEXT UNIQUE,
  category    TEXT,
  industry    TEXT,
  description TEXT,
  image       TEXT,
  client      TEXT,
  tags        TEXT,
  featured    INTEGER DEFAULT 0,
  sort_order  INTEGER DEFAULT 0,
  status      TEXT DEFAULT 'published',
  created_at  DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- ── Team Members (Đội ngũ) ──────────────────────────────
CREATE TABLE IF NOT EXISTS team_members (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  name        TEXT NOT NULL,
  position    TEXT,
  bio         TEXT,
  experience  TEXT,
  avatar      TEXT,
  sort_order  INTEGER DEFAULT 0,
  status      TEXT DEFAULT 'published'
);

-- ── Testimonials (Nhận xét khách hàng) ─────────────────
CREATE TABLE IF NOT EXISTS testimonials (
  id            INTEGER PRIMARY KEY AUTOINCREMENT,
  author_name   TEXT NOT NULL,
  author_title  TEXT,
  author_avatar TEXT,
  content       TEXT NOT NULL,
  rating        INTEGER DEFAULT 5,
  sort_order    INTEGER DEFAULT 0,
  status        TEXT DEFAULT 'published'
);

-- ── Media (Thư viện ảnh) ───────────────────────────────
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

-- ── Process Steps (Quy trình làm việc) ─────────────────
CREATE TABLE IF NOT EXISTS process_steps (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  number      TEXT NOT NULL,
  name        TEXT NOT NULL,
  description TEXT,
  sort_order  INTEGER DEFAULT 0,
  status      TEXT DEFAULT 'published'
);

-- ── Awards (Giải thưởng) ────────────────────────────────
CREATE TABLE IF NOT EXISTS awards (
  id           INTEGER PRIMARY KEY AUTOINCREMENT,
  year         TEXT,
  title        TEXT NOT NULL,
  organization TEXT,
  sort_order   INTEGER DEFAULT 0
);
