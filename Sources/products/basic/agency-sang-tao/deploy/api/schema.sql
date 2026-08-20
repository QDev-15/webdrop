PRAGMA foreign_keys = ON;

-- ── CORE TABLES ──────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  password TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'user' CHECK(role IN ('superadmin','user')),
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS contacts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  subject TEXT,
  message TEXT NOT NULL,
  service TEXT,
  status TEXT DEFAULT 'new' CHECK(status IN ('new','read','replied')),
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS settings (
  key TEXT PRIMARY KEY,
  value TEXT,
  "group" TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS hero_slides (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  subtitle TEXT,
  button_text TEXT,
  button_link TEXT,
  image TEXT,
  sort_order INTEGER DEFAULT 0,
  status TEXT DEFAULT 'published',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS media (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  filename TEXT NOT NULL,
  filepath TEXT NOT NULL,
  filesize INTEGER,
  filetype TEXT,
  alt_text TEXT,
  uploaded_by INTEGER REFERENCES users(id) ON DELETE SET NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- ── AGENCY EXTENSION ─────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS services (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  slug TEXT UNIQUE,
  description TEXT,
  content TEXT,
  icon TEXT,
  image TEXT,
  tags TEXT,
  featured INTEGER DEFAULT 0,
  sort_order INTEGER DEFAULT 0,
  status TEXT DEFAULT 'published',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS projects (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  slug TEXT UNIQUE,
  category TEXT,
  description TEXT,
  image TEXT,
  tags TEXT,
  client_name TEXT,
  featured INTEGER DEFAULT 0,
  sort_order INTEGER DEFAULT 0,
  status TEXT DEFAULT 'published',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS team_members (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  position TEXT,
  bio TEXT,
  avatar TEXT,
  experience TEXT,
  sort_order INTEGER DEFAULT 0,
  status TEXT DEFAULT 'published'
);

CREATE TABLE IF NOT EXISTS testimonials (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  author_name TEXT NOT NULL,
  author_title TEXT,
  author_avatar TEXT,
  content TEXT NOT NULL,
  rating INTEGER DEFAULT 5,
  sort_order INTEGER DEFAULT 0,
  status TEXT DEFAULT 'published'
);

-- ── CASE STUDY EXTENSION (projects) ─────────────────────────────────────────
-- Cột mở rộng cho trang chi tiết dự án (/du-an/:slug). ALTER TABLE ADD COLUMN
-- lỗi "duplicate column" ở lần chạy sau sẽ bị Database::migrate() bắt và bỏ qua
-- (xem catch trong migrate()) — an toàn để chạy lại nhiều lần.
ALTER TABLE projects ADD COLUMN year TEXT;
ALTER TABLE projects ADD COLUMN duration TEXT;
ALTER TABLE projects ADD COLUMN scope_text TEXT;
ALTER TABLE projects ADD COLUMN result_summary TEXT;
ALTER TABLE projects ADD COLUMN challenge TEXT;
ALTER TABLE projects ADD COLUMN solution TEXT;
ALTER TABLE projects ADD COLUMN gallery_images TEXT;
ALTER TABLE projects ADD COLUMN stats TEXT;
ALTER TABLE projects ADD COLUMN testimonial_content TEXT;
ALTER TABLE projects ADD COLUMN testimonial_author TEXT;
ALTER TABLE projects ADD COLUMN testimonial_title TEXT;
ALTER TABLE projects ADD COLUMN testimonial_avatar TEXT;

-- ── FAQ ──────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS faqs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  page TEXT DEFAULT 'dich-vu',
  sort_order INTEGER DEFAULT 0,
  status TEXT DEFAULT 'published'
);

-- ── PRICING PLANS ────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS pricing_plans (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  price TEXT NOT NULL,
  description TEXT,
  features TEXT,
  is_featured INTEGER DEFAULT 0,
  cta_text TEXT DEFAULT 'Liên hệ ngay',
  cta_link TEXT DEFAULT '/lien-he',
  sort_order INTEGER DEFAULT 0,
  status TEXT DEFAULT 'published'
);
