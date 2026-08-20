-- ╔══════════════════════════════════════════════╗
-- ║  Luật Văn Phòng — Database Schema            ║
-- ║  SQLite với PRAGMA foreign_keys = ON          ║
-- ╚══════════════════════════════════════════════╝

PRAGMA foreign_keys = ON;
PRAGMA journal_mode = WAL;
PRAGMA synchronous = NORMAL;

-- ─── CORE TABLES ───────────────────────────────

CREATE TABLE IF NOT EXISTS users (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  name       TEXT    NOT NULL,
  email      TEXT    NOT NULL UNIQUE,
  password   TEXT    NOT NULL,
  role       TEXT    NOT NULL DEFAULT 'user' CHECK(role IN ('superadmin','user')),
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS contacts (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  name       TEXT    NOT NULL,
  email      TEXT,
  phone      TEXT,
  subject    TEXT,
  message    TEXT    NOT NULL,
  status     TEXT    DEFAULT 'new' CHECK(status IN ('new','read','replied')),
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS settings (
  key   TEXT PRIMARY KEY,
  value TEXT,
  "group" TEXT NOT NULL DEFAULT 'general'
);

CREATE TABLE IF NOT EXISTS hero_slides (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  title       TEXT    NOT NULL,
  subtitle    TEXT,
  button_text TEXT,
  button_link TEXT,
  image       TEXT,
  sort_order  INTEGER DEFAULT 0,
  status      TEXT    DEFAULT 'published',
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

-- ─── EXTENSION: LAW FIRM ───────────────────────

-- Lĩnh vực hành nghề (dịch vụ pháp lý)
CREATE TABLE IF NOT EXISTS services (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  name        TEXT    NOT NULL,
  slug        TEXT    UNIQUE,
  tag         TEXT,
  description TEXT,
  content     TEXT,
  icon        TEXT,
  sort_order  INTEGER DEFAULT 0,
  status      TEXT    DEFAULT 'published',
  created_at  DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS service_items (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  service_id INTEGER REFERENCES services(id) ON DELETE CASCADE,
  item       TEXT NOT NULL,
  sort_order INTEGER DEFAULT 0
);

-- Luật sư
CREATE TABLE IF NOT EXISTS lawyers (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  name       TEXT    NOT NULL,
  role       TEXT,
  bio        TEXT,
  speciality TEXT,
  avatar     TEXT,
  tags       TEXT,
  is_partner INTEGER DEFAULT 0,
  sort_order INTEGER DEFAULT 0,
  status     TEXT    DEFAULT 'published',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Vụ việc tiêu biểu
CREATE TABLE IF NOT EXISTS cases (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  title       TEXT    NOT NULL,
  category    TEXT,
  summary     TEXT,
  outcome     TEXT,
  year        INTEGER,
  location    TEXT,
  sort_order  INTEGER DEFAULT 0,
  status      TEXT    DEFAULT 'published',
  created_at  DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Đánh giá thân chủ
CREATE TABLE IF NOT EXISTS testimonials (
  id           INTEGER PRIMARY KEY AUTOINCREMENT,
  author_name  TEXT    NOT NULL,
  author_title TEXT,
  content      TEXT    NOT NULL,
  case_type    TEXT,
  sort_order   INTEGER DEFAULT 0,
  status       TEXT    DEFAULT 'published',
  created_at   DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Đăng ký tư vấn (từ form CTA)
CREATE TABLE IF NOT EXISTS consultations (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  name       TEXT    NOT NULL,
  phone      TEXT    NOT NULL,
  email      TEXT,
  field      TEXT,
  message    TEXT,
  time_pref  TEXT,
  status     TEXT    DEFAULT 'new' CHECK(status IN ('new','contacted','done','cancelled')),
  source     TEXT    DEFAULT 'website',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- ─── CASE STUDY EXTENSION (cases) ──────────────────────────
-- Cột mở rộng cho trang chi tiết vụ việc (/vu-viec/:slug). ALTER TABLE ADD COLUMN
-- lỗi "duplicate column" ở lần chạy sau sẽ bị Database::migrate() bắt và bỏ qua
-- (xem catch trong migrate()) — an toàn để chạy lại nhiều lần.
ALTER TABLE cases ADD COLUMN slug TEXT;
ALTER TABLE cases ADD COLUMN client_name TEXT;
ALTER TABLE cases ADD COLUMN practice_area TEXT;
ALTER TABLE cases ADD COLUMN duration_text TEXT;
ALTER TABLE cases ADD COLUMN scope_text TEXT;
ALTER TABLE cases ADD COLUMN result_headline TEXT;
ALTER TABLE cases ADD COLUMN challenge TEXT;
ALTER TABLE cases ADD COLUMN solution TEXT;
ALTER TABLE cases ADD COLUMN gallery_images TEXT;
ALTER TABLE cases ADD COLUMN stats TEXT;
ALTER TABLE cases ADD COLUMN testimonial_content TEXT;
ALTER TABLE cases ADD COLUMN testimonial_author TEXT;
ALTER TABLE cases ADD COLUMN testimonial_title TEXT;

-- ─── FAQ ────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS faqs (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  question   TEXT    NOT NULL,
  answer     TEXT    NOT NULL,
  page       TEXT    DEFAULT 'dich-vu',
  sort_order INTEGER DEFAULT 0,
  status     TEXT    DEFAULT 'published'
);

-- ─── PRICING PLANS ──────────────────────────────────────────
CREATE TABLE IF NOT EXISTS pricing_plans (
  id           INTEGER PRIMARY KEY AUTOINCREMENT,
  name         TEXT    NOT NULL,
  price        TEXT    NOT NULL,
  description  TEXT,
  features     TEXT,
  is_featured  INTEGER DEFAULT 0,
  cta_text     TEXT    DEFAULT 'Nhận báo giá',
  cta_link     TEXT    DEFAULT '/lien-he',
  sort_order   INTEGER DEFAULT 0,
  status       TEXT    DEFAULT 'published'
);
