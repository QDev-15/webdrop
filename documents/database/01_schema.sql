-- ============================================================
-- WEBDROP.VN — DATABASE SCHEMA
-- PostgreSQL (Neon)
-- Generated: 2026-06-03
-- ORM: Prisma 5.x (Sources/system/prisma/schema.prisma)
-- ============================================================
-- Usage:
--   psql $DATABASE_URL -f 01_schema.sql
-- ============================================================

-- ── Enums ────────────────────────────────────────────────────

CREATE TYPE "UserRole"         AS ENUM ('superadmin', 'user');
CREATE TYPE "PostStatus"       AS ENUM ('draft', 'published');
CREATE TYPE "BannerTarget"     AS ENUM ('blank', 'self');
CREATE TYPE "ContactStatus"    AS ENUM ('new', 'read', 'replied');
CREATE TYPE "TemplateCategory" AS ENUM ('web', 'admin');
CREATE TYPE "CustomerStatus"   AS ENUM ('active', 'inactive');
CREATE TYPE "OrderType"        AS ENUM ('template', 'website');
CREATE TYPE "OrderStatus"      AS ENUM ('new', 'confirmed', 'in_progress', 'delivered', 'completed', 'cancelled');
CREATE TYPE "PaymentMethod"    AS ENUM ('cash', 'bank', 'momo', 'vnpay');
CREATE TYPE "PaymentStatus"    AS ENUM ('pending', 'paid', 'refunded');
CREATE TYPE "ProjectType"      AS ENUM ('goi_b', 'goi_c');
CREATE TYPE "ProjectStatus"    AS ENUM ('planning', 'designing', 'developing', 'reviewing', 'delivered', 'done');
CREATE TYPE "MilestoneStatus"  AS ENUM ('pending', 'done');
CREATE TYPE "SlideType"        AS ENUM ('intro', 'features', 'grid', 'pricing', 'testimonial');

-- ============================================================
-- CORE SCHEMA
-- ============================================================

-- ── users ────────────────────────────────────────────────────
CREATE TABLE users (
  id         SERIAL PRIMARY KEY,
  name       VARCHAR(255)     NOT NULL,
  email      VARCHAR(255)     NOT NULL UNIQUE,
  password   VARCHAR(255)     NOT NULL,
  role       "UserRole"       NOT NULL DEFAULT 'user',
  created_at TIMESTAMPTZ      NOT NULL DEFAULT NOW()
);

-- ── categories ───────────────────────────────────────────────
CREATE TABLE categories (
  id          SERIAL PRIMARY KEY,
  name        VARCHAR(255) NOT NULL,
  slug        VARCHAR(255) NOT NULL UNIQUE,
  description TEXT,
  thumbnail   VARCHAR(500),
  parent_id   INT REFERENCES categories(id),
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ── posts ────────────────────────────────────────────────────
CREATE TABLE posts (
  id               SERIAL PRIMARY KEY,
  title            VARCHAR(500)  NOT NULL,
  slug             VARCHAR(500)  NOT NULL UNIQUE,
  content          TEXT,
  excerpt          TEXT,
  thumbnail        VARCHAR(500),
  category_id      INT           REFERENCES categories(id),
  status           "PostStatus"  NOT NULL DEFAULT 'draft',
  featured         BOOLEAN       NOT NULL DEFAULT FALSE,
  meta_title       VARCHAR(255),
  meta_description TEXT,
  created_by       INT           REFERENCES users(id),
  created_at       TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
  updated_at       TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);

-- ── pages ────────────────────────────────────────────────────
CREATE TABLE pages (
  id               SERIAL PRIMARY KEY,
  title            VARCHAR(500)  NOT NULL,
  slug             VARCHAR(500)  NOT NULL UNIQUE,
  content          TEXT,
  template         VARCHAR(100),
  meta_title       VARCHAR(255),
  meta_description TEXT,
  status           "PostStatus"  NOT NULL DEFAULT 'draft',
  created_at       TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
  updated_at       TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
  created_by       INT           REFERENCES users(id)
);

-- ── media ────────────────────────────────────────────────────
CREATE TABLE media (
  id          SERIAL PRIMARY KEY,
  filename    VARCHAR(255) NOT NULL,
  filepath    VARCHAR(500) NOT NULL,
  filesize    INT          NOT NULL,
  filetype    VARCHAR(100) NOT NULL,
  alt_text    VARCHAR(500),
  uploaded_by INT          REFERENCES users(id),
  created_at  TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

-- ── banners ──────────────────────────────────────────────────
CREATE TABLE banners (
  id         SERIAL PRIMARY KEY,
  title      VARCHAR(255)    NOT NULL,
  image      VARCHAR(500)    NOT NULL,
  link       VARCHAR(500),
  target     "BannerTarget"  NOT NULL DEFAULT 'self',
  position   VARCHAR(100)    NOT NULL,
  sort_order INT             NOT NULL DEFAULT 0,
  status     "PostStatus"    NOT NULL DEFAULT 'draft',
  created_at TIMESTAMPTZ     NOT NULL DEFAULT NOW()
);

-- ── contacts ─────────────────────────────────────────────────
CREATE TABLE contacts (
  id         SERIAL PRIMARY KEY,
  name       VARCHAR(255)      NOT NULL,
  email      VARCHAR(255),
  phone      VARCHAR(50),
  subject    VARCHAR(500),
  message    TEXT              NOT NULL,
  status     "ContactStatus"   NOT NULL DEFAULT 'new',
  created_at TIMESTAMPTZ       NOT NULL DEFAULT NOW()
);

-- ── settings (key-value store) ───────────────────────────────
-- Groups: general | seo | social | design | header | footer | contact | smtp | scripts | system
CREATE TABLE settings (
  key   VARCHAR(100) PRIMARY KEY,
  value TEXT,
  group VARCHAR(50)  NOT NULL
);

-- ============================================================
-- EXTENSION: AGENCY (webdrop.vn — System DB)
-- ============================================================

-- ── industries ───────────────────────────────────────────────
CREATE TABLE industries (
  id          SERIAL PRIMARY KEY,
  name        VARCHAR(255)  NOT NULL,
  slug        VARCHAR(255)  NOT NULL UNIQUE,
  description TEXT,
  status      "PostStatus"  NOT NULL DEFAULT 'published',
  sort_order  INT           NOT NULL DEFAULT 0
);

-- ── service_packages ─────────────────────────────────────────
CREATE TABLE service_packages (
  id          SERIAL PRIMARY KEY,
  name        VARCHAR(255)   NOT NULL,
  code        VARCHAR(50)    NOT NULL UNIQUE,
  description TEXT,
  price_from  NUMERIC(15,2),
  price_to    NUMERIC(15,2),
  status      "PostStatus"   NOT NULL DEFAULT 'published',
  sort_order  INT            NOT NULL DEFAULT 0
);

-- ── package_industries (pivot) ───────────────────────────────
CREATE TABLE package_industries (
  package_id  INT NOT NULL REFERENCES service_packages(id),
  industry_id INT NOT NULL REFERENCES industries(id),
  PRIMARY KEY (package_id, industry_id)
);

-- ── templates ────────────────────────────────────────────────
CREATE TABLE templates (
  id           SERIAL PRIMARY KEY,
  name         VARCHAR(255)       NOT NULL,
  slug         VARCHAR(255)       NOT NULL UNIQUE,
  description  TEXT,
  thumbnail    VARCHAR(500),
  demo_url     VARCHAR(500),
  download_url VARCHAR(500),
  price        NUMERIC(15,2)      NOT NULL,
  category     "TemplateCategory" NOT NULL,
  industry_id  INT                REFERENCES industries(id),
  has_website  BOOLEAN            NOT NULL DEFAULT FALSE,
  sales_count  INT                NOT NULL DEFAULT 0,
  status       "PostStatus"       NOT NULL DEFAULT 'draft',
  created_at   TIMESTAMPTZ        NOT NULL DEFAULT NOW()
);

-- ── customers ────────────────────────────────────────────────
CREATE TABLE customers (
  id         SERIAL PRIMARY KEY,
  name       VARCHAR(255)     NOT NULL,
  email      VARCHAR(255),
  phone      VARCHAR(50),
  company    VARCHAR(255),
  address    TEXT,
  note       TEXT,
  status     "CustomerStatus" NOT NULL DEFAULT 'active',
  created_at TIMESTAMPTZ      NOT NULL DEFAULT NOW()
);

-- ── customer_contacts ────────────────────────────────────────
CREATE TABLE customer_contacts (
  id          SERIAL PRIMARY KEY,
  customer_id INT          NOT NULL REFERENCES customers(id),
  type        VARCHAR(50)  NOT NULL,   -- zalo | facebook | email | phone
  value       VARCHAR(255) NOT NULL,
  note        TEXT
);

-- ── orders ───────────────────────────────────────────────────
CREATE TABLE orders (
  id           SERIAL PRIMARY KEY,
  code         VARCHAR(50)    NOT NULL UNIQUE,
  customer_id  INT            NOT NULL REFERENCES customers(id),
  package_id   INT            REFERENCES service_packages(id),
  type         "OrderType"    NOT NULL,
  title        VARCHAR(500)   NOT NULL,
  price        NUMERIC(15,2)  NOT NULL,
  discount     NUMERIC(15,2)  NOT NULL DEFAULT 0,
  total        NUMERIC(15,2)  NOT NULL,
  status       "OrderStatus"  NOT NULL DEFAULT 'new',
  note         TEXT,
  started_at   TIMESTAMPTZ,
  deadline_at  TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  created_at   TIMESTAMPTZ    NOT NULL DEFAULT NOW()
);

-- ── order_items ──────────────────────────────────────────────
CREATE TABLE order_items (
  id         SERIAL PRIMARY KEY,
  order_id   INT            NOT NULL REFERENCES orders(id),
  item_type  VARCHAR(50)    NOT NULL,   -- template | service | hosting | domain
  item_name  VARCHAR(500)   NOT NULL,
  qty        INT            NOT NULL DEFAULT 1,
  unit_price NUMERIC(15,2)  NOT NULL,
  subtotal   NUMERIC(15,2)  NOT NULL,
  note       TEXT
);

-- ── contracts ────────────────────────────────────────────────
CREATE TABLE contracts (
  id       SERIAL PRIMARY KEY,
  order_id INT          NOT NULL REFERENCES orders(id),
  file_url VARCHAR(500),
  signed_at TIMESTAMPTZ,
  note     TEXT
);

-- ── payments ─────────────────────────────────────────────────
CREATE TABLE payments (
  id          SERIAL PRIMARY KEY,
  order_id    INT              NOT NULL REFERENCES orders(id),
  amount      NUMERIC(15,2)    NOT NULL,
  method      "PaymentMethod"  NOT NULL,
  status      "PaymentStatus"  NOT NULL DEFAULT 'pending',
  paid_at     TIMESTAMPTZ,
  note        TEXT,
  receipt_url VARCHAR(500)
);

-- ── projects ─────────────────────────────────────────────────
CREATE TABLE projects (
  id           SERIAL PRIMARY KEY,
  order_id     INT            NOT NULL UNIQUE REFERENCES orders(id),
  customer_id  INT            NOT NULL REFERENCES customers(id),
  name         VARCHAR(500)   NOT NULL,
  type         "ProjectType"  NOT NULL,
  status       "ProjectStatus" NOT NULL DEFAULT 'planning',
  hosting_info TEXT,
  domain       VARCHAR(255),
  admin_url    VARCHAR(500),
  note         TEXT,
  created_at   TIMESTAMPTZ    NOT NULL DEFAULT NOW()
);

-- ── project_milestones ───────────────────────────────────────
CREATE TABLE project_milestones (
  id           SERIAL PRIMARY KEY,
  project_id   INT               NOT NULL REFERENCES projects(id),
  title        VARCHAR(500)      NOT NULL,
  description  TEXT,
  status       "MilestoneStatus" NOT NULL DEFAULT 'pending',
  due_at       TIMESTAMPTZ,
  completed_at TIMESTAMPTZ
);

-- ── project_notes ────────────────────────────────────────────
CREATE TABLE project_notes (
  id         SERIAL PRIMARY KEY,
  project_id INT         NOT NULL REFERENCES projects(id),
  content    TEXT        NOT NULL,
  created_by INT         REFERENCES users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ── project_files ────────────────────────────────────────────
CREATE TABLE project_files (
  id          SERIAL PRIMARY KEY,
  project_id  INT          NOT NULL REFERENCES projects(id),
  filename    VARCHAR(255) NOT NULL,
  filepath    VARCHAR(500) NOT NULL,
  type        VARCHAR(50)  NOT NULL,   -- design | source | build | contract
  uploaded_by INT          REFERENCES users(id),
  created_at  TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

-- ── revenues ─────────────────────────────────────────────────
CREATE TABLE revenues (
  id         SERIAL PRIMARY KEY,
  order_id   INT           REFERENCES orders(id),
  payment_id INT           REFERENCES payments(id),
  amount     NUMERIC(15,2) NOT NULL,
  month      INT           NOT NULL,
  year       INT           NOT NULL,
  note       TEXT,
  created_at TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);

-- ── expenses ─────────────────────────────────────────────────
CREATE TABLE expenses (
  id         SERIAL PRIMARY KEY,
  type       VARCHAR(50)   NOT NULL,   -- hosting | domain | tool | other
  title      VARCHAR(500)  NOT NULL,
  amount     NUMERIC(15,2) NOT NULL,
  paid_at    TIMESTAMPTZ,
  note       TEXT,
  created_at TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);

-- ── hero_slides ──────────────────────────────────────────────
CREATE TABLE hero_slides (
  id         SERIAL PRIMARY KEY,
  type       "SlideType"  NOT NULL,
  bg         VARCHAR(500) NOT NULL,
  badge      VARCHAR(255) NOT NULL,
  title      JSONB        NOT NULL,
  data       JSONB        NOT NULL,
  buttons    JSONB        NOT NULL,
  sort_order INT          NOT NULL DEFAULT 0,
  status     "PostStatus" NOT NULL DEFAULT 'published',
  created_at TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

-- ── activity_logs ────────────────────────────────────────────
CREATE TABLE activity_logs (
  id          SERIAL PRIMARY KEY,
  admin_id    INT          REFERENCES users(id),
  action      VARCHAR(100) NOT NULL,
  target_type VARCHAR(100),
  target_id   INT,
  description TEXT,
  created_at  TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

-- ── Indexes ──────────────────────────────────────────────────
CREATE INDEX idx_posts_slug         ON posts(slug);
CREATE INDEX idx_posts_status       ON posts(status);
CREATE INDEX idx_posts_category_id  ON posts(category_id);
CREATE INDEX idx_templates_slug     ON templates(slug);
CREATE INDEX idx_templates_status   ON templates(status);
CREATE INDEX idx_templates_category ON templates(category);
CREATE INDEX idx_templates_industry ON templates(industry_id);
CREATE INDEX idx_orders_code        ON orders(code);
CREATE INDEX idx_orders_customer    ON orders(customer_id);
CREATE INDEX idx_orders_status      ON orders(status);
CREATE INDEX idx_projects_order     ON projects(order_id);
CREATE INDEX idx_revenues_year_month ON revenues(year, month);
CREATE INDEX idx_hero_slides_sort   ON hero_slides(sort_order);
CREATE INDEX idx_activity_logs_admin ON activity_logs(admin_id);
CREATE INDEX idx_contacts_status    ON contacts(status);
