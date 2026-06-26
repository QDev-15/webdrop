-- ============================================================
-- webdrop.store — RESET + RESEED (FULL FRESH)
-- PostgreSQL (Neon)
-- ============================================================
-- WARNING: Xóa TOÀN BỘ data và schema, tạo lại từ đầu.
--          CHỈ dùng khi migrate sang môi trường mới.
-- ============================================================
-- Usage:
--   psql $DATABASE_URL -f 03_reset_and_reseed.sql
-- ============================================================

-- ── Drop all objects ─────────────────────────────────────────
DROP TABLE IF EXISTS activity_logs        CASCADE;
DROP TABLE IF EXISTS hero_slides          CASCADE;
DROP TABLE IF EXISTS expenses             CASCADE;
DROP TABLE IF EXISTS revenues             CASCADE;
DROP TABLE IF EXISTS project_files        CASCADE;
DROP TABLE IF EXISTS project_notes        CASCADE;
DROP TABLE IF EXISTS project_milestones   CASCADE;
DROP TABLE IF EXISTS projects             CASCADE;
DROP TABLE IF EXISTS payments             CASCADE;
DROP TABLE IF EXISTS contracts            CASCADE;
DROP TABLE IF EXISTS order_items          CASCADE;
DROP TABLE IF EXISTS orders               CASCADE;
DROP TABLE IF EXISTS customer_contacts    CASCADE;
DROP TABLE IF EXISTS customers            CASCADE;
DROP TABLE IF EXISTS templates            CASCADE;
DROP TABLE IF EXISTS package_industries   CASCADE;
DROP TABLE IF EXISTS service_packages     CASCADE;
DROP TABLE IF EXISTS industries           CASCADE;
DROP TABLE IF EXISTS settings             CASCADE;
DROP TABLE IF EXISTS contacts             CASCADE;
DROP TABLE IF EXISTS banners              CASCADE;
DROP TABLE IF EXISTS media                CASCADE;
DROP TABLE IF EXISTS pages                CASCADE;
DROP TABLE IF EXISTS posts                CASCADE;
DROP TABLE IF EXISTS categories           CASCADE;
DROP TABLE IF EXISTS users                CASCADE;

DROP TYPE IF EXISTS "UserRole"         CASCADE;
DROP TYPE IF EXISTS "PostStatus"       CASCADE;
DROP TYPE IF EXISTS "BannerTarget"     CASCADE;
DROP TYPE IF EXISTS "ContactStatus"    CASCADE;
DROP TYPE IF EXISTS "TemplateCategory" CASCADE;
DROP TYPE IF EXISTS "CustomerStatus"   CASCADE;
DROP TYPE IF EXISTS "OrderType"        CASCADE;
DROP TYPE IF EXISTS "OrderStatus"      CASCADE;
DROP TYPE IF EXISTS "PaymentMethod"    CASCADE;
DROP TYPE IF EXISTS "PaymentStatus"    CASCADE;
DROP TYPE IF EXISTS "ProjectType"      CASCADE;
DROP TYPE IF EXISTS "ProjectStatus"    CASCADE;
DROP TYPE IF EXISTS "MilestoneStatus"  CASCADE;
DROP TYPE IF EXISTS "SlideType"        CASCADE;

-- ── Re-create schema ─────────────────────────────────────────
\i 01_schema.sql

-- ── Re-seed data ─────────────────────────────────────────────
\i 02_seed_data.sql

-- ── Verify ───────────────────────────────────────────────────
SELECT 'users'             AS "table", COUNT(*) FROM users
UNION ALL SELECT 'industries',         COUNT(*) FROM industries
UNION ALL SELECT 'service_packages',   COUNT(*) FROM service_packages
UNION ALL SELECT 'templates',          COUNT(*) FROM templates
UNION ALL SELECT 'settings',           COUNT(*) FROM settings
UNION ALL SELECT 'hero_slides',        COUNT(*) FROM hero_slides
ORDER BY "table";
