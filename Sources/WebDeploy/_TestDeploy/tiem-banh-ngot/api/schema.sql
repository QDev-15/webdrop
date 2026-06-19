PRAGMA foreign_keys = ON;

-- ── Core tables ───────────────────────────────────────────────────────────────

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

-- ── Extension: Bakery ─────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS product_categories (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  slug TEXT UNIQUE,
  description TEXT,
  icon TEXT,
  image TEXT,
  sort_order INTEGER DEFAULT 0,
  status TEXT DEFAULT 'published',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS products (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  category_id INTEGER REFERENCES product_categories(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  slug TEXT UNIQUE,
  description TEXT,
  price REAL,
  price_note TEXT,
  image TEXT,
  tag TEXT DEFAULT '' CHECK(tag IN ('bestseller','new','seasonal','custom','')),
  featured INTEGER DEFAULT 0,
  sort_order INTEGER DEFAULT 0,
  status TEXT DEFAULT 'published',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS orders (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT,
  cake_type TEXT,
  cake_size TEXT,
  flavors TEXT,
  decoration_style TEXT,
  color_theme TEXT,
  cake_message TEXT,
  special_request TEXT,
  pickup_date TEXT,
  delivery_type TEXT DEFAULT 'pickup',
  delivery_address TEXT,
  status TEXT DEFAULT 'pending' CHECK(status IN ('pending','confirmed','in_progress','ready','completed','cancelled')),
  note TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS gallery_items (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT,
  description TEXT,
  image TEXT NOT NULL,
  category TEXT,
  sort_order INTEGER DEFAULT 0,
  status TEXT DEFAULT 'published',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS testimonials (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  author_name TEXT NOT NULL,
  author_title TEXT,
  author_avatar TEXT,
  content TEXT NOT NULL,
  rating INTEGER DEFAULT 5,
  emoji TEXT DEFAULT '💖',
  sort_order INTEGER DEFAULT 0,
  status TEXT DEFAULT 'published'
);

CREATE TABLE IF NOT EXISTS flavors (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  icon TEXT,
  description TEXT,
  tags TEXT,
  bg_color TEXT DEFAULT '#fce7f3',
  sort_order INTEGER DEFAULT 0,
  status TEXT DEFAULT 'published'
);
