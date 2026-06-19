PRAGMA foreign_keys = ON;

-- Core: users
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  password TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'user' CHECK(role IN ('superadmin','user')),
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Core: contacts
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

-- Core: settings (key-value store)
CREATE TABLE IF NOT EXISTS settings (
  key TEXT PRIMARY KEY,
  value TEXT,
  "group" TEXT NOT NULL DEFAULT 'general'
);

-- Core: hero_slides
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

-- Core: media
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

-- Extension: menu_categories
CREATE TABLE IF NOT EXISTS menu_categories (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  slug TEXT UNIQUE,
  description TEXT,
  icon TEXT,
  sort_order INTEGER DEFAULT 0,
  status TEXT DEFAULT 'published',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Extension: menu_items
CREATE TABLE IF NOT EXISTS menu_items (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  category_id INTEGER REFERENCES menu_categories(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  slug TEXT UNIQUE,
  description TEXT,
  price REAL,
  price_sale REAL,
  price_note TEXT,
  image TEXT,
  badge TEXT,
  featured INTEGER DEFAULT 0,
  status TEXT DEFAULT 'published',
  sort_order INTEGER DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Extension: testimonials (Google reviews style)
CREATE TABLE IF NOT EXISTS testimonials (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  author_name TEXT NOT NULL,
  author_title TEXT,
  author_avatar TEXT,
  content TEXT NOT NULL,
  rating INTEGER DEFAULT 5,
  source TEXT DEFAULT 'Google Maps',
  sort_order INTEGER DEFAULT 0,
  status TEXT DEFAULT 'published',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Extension: gallery_items
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
