-- ============================================================
-- webdrop.store — SEED DATA
-- PostgreSQL (Neon)
-- Generated: 2026-06-03
-- Source: Sources/system/prisma/seed.ts
-- ============================================================
-- Usage:
--   psql $DATABASE_URL -f 02_seed_data.sql
-- ============================================================
-- NOTE: Password hash below = bcrypt('webdrop@2025', 10)
--       Change before production deployment!
-- ============================================================

-- ── Users ────────────────────────────────────────────────────
INSERT INTO users (name, email, password, role) VALUES
  ('Admin', 'admin@webdrop.store', '$2b$10$N7mNXzbJMdz9buc4s5prPO9eLLtG6Al.2ctAB6f.E1/3kV9X0nbeC', 'superadmin')
ON CONFLICT (email) DO NOTHING;

-- ── Industries ───────────────────────────────────────────────
INSERT INTO industries (name, slug, sort_order) VALUES
  ('Agency / Công ty dịch vụ',  'agency',     1),
  ('Spa / Làm đẹp',             'spa-beauty',  2),
  ('Nhà hàng / Cafe',           'restaurant',  3),
  ('Cá nhân / Portfolio',       'personal',    4),
  ('Blog',                      'blog',        5),
  ('Cộng đồng / Forum',         'community',   6)
ON CONFLICT (slug) DO NOTHING;

-- ── Service Packages ─────────────────────────────────────────
INSERT INTO service_packages (name, code, description, price_from, price_to, sort_order) VALUES
  (
    'Gói A — Template',
    'GOI_A',
    'Template HTML/CSS/Bootstrap thuần, bàn giao file ZIP',
    199000, 1499000, 1
  ),
  (
    'Gói B — Website chuẩn',
    'GOI_B',
    'React + PHP + SQLite, deploy lên hosting là chạy',
    3000000, 22000000, 2
  ),
  (
    'Gói C — Website full custom',
    'GOI_C',
    'Thiết kế theo yêu cầu, Phase 1 wireframe, Phase 2 develop',
    20000000, NULL, 3
  )
ON CONFLICT (code) DO NOTHING;

-- ── Templates ────────────────────────────────────────────────
-- Demo base: https://webdrop-eol.pages.dev
-- Format: (name, slug, description, thumbnail, demo_url, price, category, industry_slug, sales_count, status)

-- Blogs
INSERT INTO templates (name, slug, description, thumbnail, demo_url, price, category, industry_id, sales_count, status)
SELECT
  'Blog Cá Nhân', 'blog-ca-nhan',
  'Template blog cá nhân sạch sẽ, tập trung nội dung. Danh mục, tags, sidebar.',
  'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=800&q=80&auto=format&fit=crop',
  'https://webdrop-eol.pages.dev/Blogs/blog-ca-nhan/',
  499000, 'web', id, 12, 'published'
FROM industries WHERE slug = 'blog'
ON CONFLICT (slug) DO NOTHING;

-- Cafes
INSERT INTO templates (name, slug, description, thumbnail, demo_url, price, category, industry_id, sales_count, status)
SELECT
  'Cafe Thời Gian', 'cafe-thoi-gian',
  'Template quán cafe hiện đại, menu đồ uống, không gian ấm cúng, đặt bàn.',
  'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=800&q=80&auto=format&fit=crop',
  'https://webdrop-eol.pages.dev/Cafes/cafe-thoi-gian/',
  799000, 'web', id, 18, 'published'
FROM industries WHERE slug = 'restaurant'
ON CONFLICT (slug) DO NOTHING;

-- Companies
INSERT INTO templates (name, slug, description, thumbnail, demo_url, price, category, industry_id, sales_count, status)
SELECT
  'Agency Sáng Tạo', 'agency-sang-tao',
  'Template agency sáng tạo chuyên nghiệp. Portfolio dự án, đội ngũ, dịch vụ thiết kế.',
  'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=800&q=80&auto=format&fit=crop',
  'https://webdrop-eol.pages.dev/Companies/agency-sang-tao/',
  999000, 'web', id, 24, 'published'
FROM industries WHERE slug = 'agency'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO templates (name, slug, description, thumbnail, demo_url, price, category, industry_id, sales_count, status)
SELECT
  'Agency Web', 'agency-web',
  'Template công ty web agency. Hero slider, portfolio, pricing plans, testimonials.',
  'https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?w=800&q=80&auto=format&fit=crop',
  'https://webdrop-eol.pages.dev/Companies/agency-web/',
  999000, 'web', id, 38, 'published'
FROM industries WHERE slug = 'agency'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO templates (name, slug, description, thumbnail, demo_url, price, category, industry_id, sales_count, status)
SELECT
  'Công Ty Xây Dựng', 'cong-ty-xay-dung',
  'Template công ty xây dựng. Dự án thi công, đội ngũ kỹ sư, báo giá, chứng chỉ.',
  'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800&q=80&auto=format&fit=crop',
  'https://webdrop-eol.pages.dev/Companies/cong-ty-xay-dung/',
  799000, 'web', id, 15, 'published'
FROM industries WHERE slug = 'agency'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO templates (name, slug, description, thumbnail, demo_url, price, category, industry_id, sales_count, status)
SELECT
  'Văn Phòng Luật', 'luat-van-phong',
  'Template văn phòng luật sư uy tín. Lĩnh vực tư vấn, đội ngũ luật sư, form tư vấn.',
  'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=800&q=80&auto=format&fit=crop',
  'https://webdrop-eol.pages.dev/Companies/luat-van-phong/',
  999000, 'web', id, 11, 'published'
FROM industries WHERE slug = 'agency'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO templates (name, slug, description, thumbnail, demo_url, price, category, industry_id, sales_count, status)
SELECT
  'Startup Công Nghệ', 'startup-cong-nghe',
  'Template landing page cho startup tech, SaaS, app. Pricing plans, features, CTA mạnh.',
  'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&q=80&auto=format&fit=crop',
  'https://webdrop-eol.pages.dev/Companies/startup-cong-nghe/',
  799000, 'web', id, 29, 'published'
FROM industries WHERE slug = 'agency'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO templates (name, slug, description, thumbnail, demo_url, price, category, industry_id, sales_count, status)
SELECT
  'Tư Vấn Tài Chính', 'tu-van-tai-chinh',
  'Template công ty tư vấn tài chính & đầu tư. Chuyên gia, dịch vụ, case study.',
  'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=800&q=80&auto=format&fit=crop',
  'https://webdrop-eol.pages.dev/Companies/tu-van-tai-chinh/',
  799000, 'web', id, 9, 'published'
FROM industries WHERE slug = 'agency'
ON CONFLICT (slug) DO NOTHING;

-- Forums
INSERT INTO templates (name, slug, description, thumbnail, demo_url, price, category, industry_id, sales_count, status)
SELECT
  'Forum Cộng Đồng', 'forum-cong-dong',
  'Template diễn đàn cộng đồng. Threads, categories, members, trending topics.',
  'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&q=80&auto=format&fit=crop',
  'https://webdrop-eol.pages.dev/Forums/forum-cong-dong/',
  499000, 'web', id, 8, 'published'
FROM industries WHERE slug = 'community'
ON CONFLICT (slug) DO NOTHING;

-- Portfolios
INSERT INTO templates (name, slug, description, thumbnail, demo_url, price, category, industry_id, sales_count, status)
SELECT
  'Portfolio Tối', 'portfolio-toi',
  'Template portfolio cá nhân nền tối sang trọng. Phù hợp designer, developer, photographer.',
  'https://images.unsplash.com/photo-1545665277-5937489579f2?w=800&q=80&auto=format&fit=crop',
  'https://webdrop-eol.pages.dev/Portfolios/portfolio-toi/',
  499000, 'web', id, 24, 'published'
FROM industries WHERE slug = 'personal'
ON CONFLICT (slug) DO NOTHING;

-- Restaurants
INSERT INTO templates (name, slug, description, thumbnail, demo_url, price, category, industry_id, sales_count, status)
SELECT
  'Ẩm Thực Việt', 'am-thuc',
  'Template nhà hàng ẩm thực Việt Nam. Menu phong phú, đặt bàn, không gian truyền thống.',
  'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&q=80&auto=format&fit=crop',
  'https://webdrop-eol.pages.dev/Restaurants/am-thuc/',
  799000, 'web', id, 17, 'published'
FROM industries WHERE slug = 'restaurant'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO templates (name, slug, description, thumbnail, demo_url, price, category, industry_id, sales_count, status)
SELECT
  'Nhà Hàng Cao Cấp', 'nha-hang-cao-cap',
  'Template fine dining cao cấp. Gallery ảnh đẹp, menu tasting, đặt bàn, chef profile.',
  'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&q=80&auto=format&fit=crop',
  'https://webdrop-eol.pages.dev/Restaurants/nha-hang-cao-cap/',
  999000, 'web', id, 22, 'published'
FROM industries WHERE slug = 'restaurant'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO templates (name, slug, description, thumbnail, demo_url, price, category, industry_id, sales_count, status)
SELECT
  'Nhà Hàng Chay Organic', 'nha-hang-chay-organic',
  'Template nhà hàng chay & organic. Tươi sạch, thân thiện môi trường, menu healthy.',
  'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&q=80&auto=format&fit=crop',
  'https://webdrop-eol.pages.dev/Restaurants/nha-hang-chay-organic/',
  799000, 'web', id, 14, 'published'
FROM industries WHERE slug = 'restaurant'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO templates (name, slug, description, thumbnail, demo_url, price, category, industry_id, sales_count, status)
SELECT
  'Nhà Hàng Hải Sản', 'nha-hang-hai-san',
  'Template nhà hàng hải sản tươi sống. Menu phong phú, gallery món ăn, đặt bàn nhóm.',
  'https://images.unsplash.com/photo-1559742811-822873691df8?w=800&q=80&auto=format&fit=crop',
  'https://webdrop-eol.pages.dev/Restaurants/nha-hang-hai-san/',
  999000, 'web', id, 19, 'published'
FROM industries WHERE slug = 'restaurant'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO templates (name, slug, description, thumbnail, demo_url, price, category, industry_id, sales_count, status)
SELECT
  'Nhà Hàng Nhật Bản', 'nha-hang-nhat-ban',
  'Template nhà hàng Nhật tinh tế. Menu sushi/ramen, không gian zen, đặt bàn online.',
  'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=800&q=80&auto=format&fit=crop',
  'https://webdrop-eol.pages.dev/Restaurants/nha-hang-nhat-ban/',
  999000, 'web', id, 31, 'published'
FROM industries WHERE slug = 'restaurant'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO templates (name, slug, description, thumbnail, demo_url, price, category, industry_id, sales_count, status)
SELECT
  'Nhà Hàng Pháp', 'nha-hang-phap',
  'Template nhà hàng Pháp sang trọng. Fine dining, wine list, chef profile, reservations.',
  'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&q=80&auto=format&fit=crop',
  'https://webdrop-eol.pages.dev/Restaurants/nha-hang-phap/',
  999000, 'web', id, 13, 'published'
FROM industries WHERE slug = 'restaurant'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO templates (name, slug, description, thumbnail, demo_url, price, category, industry_id, sales_count, status)
SELECT
  'Nhà Hàng Truyền Thống', 'nha-hang-truyen-thong',
  'Template nhà hàng Việt truyền thống. Đậm đà bản sắc, không gian ấm cúng, thực đơn gia truyền.',
  'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&q=80&auto=format&fit=crop',
  'https://webdrop-eol.pages.dev/Restaurants/nha-hang-truyen-thong/',
  799000, 'web', id, 16, 'published'
FROM industries WHERE slug = 'restaurant'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO templates (name, slug, description, thumbnail, demo_url, price, category, industry_id, sales_count, status)
SELECT
  'Quán Ăn Phổ Biến', 'quan-an-pho-bien',
  'Template quán ăn bình dân, menu đơn giản, đặt đồ online, giờ mở cửa.',
  'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&q=80&auto=format&fit=crop',
  'https://webdrop-eol.pages.dev/Restaurants/quan-an-pho-bien/',
  499000, 'web', id, 27, 'published'
FROM industries WHERE slug = 'restaurant'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO templates (name, slug, description, thumbnail, demo_url, price, category, industry_id, sales_count, status)
SELECT
  'Quán BBQ & Lửa', 'quan-bbq-lua',
  'Template quán BBQ nướng lửa. Menu thịt nướng, combo nhóm, đặt bàn, không khí sôi động.',
  'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&q=80&auto=format&fit=crop',
  'https://webdrop-eol.pages.dev/Restaurants/quan-bbq-lua/',
  999000, 'web', id, 20, 'published'
FROM industries WHERE slug = 'restaurant'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO templates (name, slug, description, thumbnail, demo_url, price, category, industry_id, sales_count, status)
SELECT
  'Tiệm Bánh Ngọt', 'tiem-banh-ngot',
  'Template tiệm bánh ngọt & bakery. Gallery bánh đẹp, đặt bánh theo yêu cầu, cửa hàng.',
  'https://images.unsplash.com/photo-1517433670267-08bbd4be890f?w=800&q=80&auto=format&fit=crop',
  'https://webdrop-eol.pages.dev/Restaurants/tiem-banh-ngot/',
  799000, 'web', id, 23, 'published'
FROM industries WHERE slug = 'restaurant'
ON CONFLICT (slug) DO NOTHING;

-- Spa-Services
INSERT INTO templates (name, slug, description, thumbnail, demo_url, price, category, industry_id, sales_count, status)
SELECT
  'Spa & Làm Đẹp', 'spa-beauty',
  'Template spa & làm đẹp sang trọng. Dịch vụ massage, chăm sóc da, đặt lịch online.',
  'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=800&q=80&auto=format&fit=crop',
  'https://webdrop-eol.pages.dev/Spa-Services/spa-beauty/',
  799000, 'web', id, 33, 'published'
FROM industries WHERE slug = 'spa-beauty'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO templates (name, slug, description, thumbnail, demo_url, price, category, industry_id, sales_count, status)
SELECT
  'Nail Salon', 'nail-salon',
  'Template tiệm nail chuyên nghiệp. Gallery mẫu nail, bảng giá dịch vụ, đặt lịch theo thợ.',
  'https://images.unsplash.com/photo-1604654894610-df63bc536371?w=800&q=80&auto=format&fit=crop',
  'https://webdrop-eol.pages.dev/Spa-Services/nail-salon/',
  699000, 'web', id, 28, 'published'
FROM industries WHERE slug = 'spa-beauty'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO templates (name, slug, description, thumbnail, demo_url, price, category, industry_id, sales_count, status)
SELECT
  'Yoga & Wellness', 'yoga-wellness',
  'Template trung tâm yoga & wellness. Lịch lớp học, giáo viên, gói thành viên.',
  'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&q=80&auto=format&fit=crop',
  'https://webdrop-eol.pages.dev/Spa-Services/yoga-wellness/',
  799000, 'web', id, 19, 'published'
FROM industries WHERE slug = 'spa-beauty'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO templates (name, slug, description, thumbnail, demo_url, price, category, industry_id, sales_count, status)
SELECT
  'Tiệm Tóc & Barber', 'tiem-toc-barber',
  'Template tiệm tóc & barber shop. Dark theme, gallery kiểu tóc, đặt lịch theo stylist.',
  'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=800&q=80&auto=format&fit=crop',
  'https://webdrop-eol.pages.dev/Spa-Services/tiem-toc-barber/',
  699000, 'web', id, 21, 'published'
FROM industries WHERE slug = 'spa-beauty'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO templates (name, slug, description, thumbnail, demo_url, price, category, industry_id, sales_count, status)
SELECT
  'Massage Trị Liệu', 'massage-tri-lieu',
  'Template trung tâm massage trị liệu. Các loại massage, đặt lịch theo thời lượng.',
  'https://images.unsplash.com/photo-1600334089648-b0d9d3028eb2?w=800&q=80&auto=format&fit=crop',
  'https://webdrop-eol.pages.dev/Spa-Services/massage-tri-lieu/',
  799000, 'web', id, 16, 'published'
FROM industries WHERE slug = 'spa-beauty'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO templates (name, slug, description, thumbnail, demo_url, price, category, industry_id, sales_count, status)
SELECT
  'Thẩm Mỹ Viện', 'tham-my-vien',
  'Template thẩm mỹ viện chuyên nghiệp. Dịch vụ, đội ngũ bác sĩ, before/after gallery.',
  'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=800&q=80&auto=format&fit=crop',
  'https://webdrop-eol.pages.dev/Spa-Services/tham-my-vien/',
  999000, 'web', id, 25, 'published'
FROM industries WHERE slug = 'spa-beauty'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO templates (name, slug, description, thumbnail, demo_url, price, category, industry_id, sales_count, status)
SELECT
  'Spa Luxury', 'spa-luxury',
  'Template resort spa cao cấp 5 sao. Gói trải nghiệm, couple package, không gian đẳng cấp.',
  'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=800&q=80&auto=format&fit=crop',
  'https://webdrop-eol.pages.dev/Spa-Services/spa-luxury/',
  999000, 'web', id, 12, 'published'
FROM industries WHERE slug = 'spa-beauty'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO templates (name, slug, description, thumbnail, demo_url, price, category, industry_id, sales_count, status)
SELECT
  'Pilates Studio', 'pilates-studio',
  'Template studio pilates & fitness. Lớp học, reformer, huấn luyện viên, gói tháng.',
  'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=800&q=80&auto=format&fit=crop',
  'https://webdrop-eol.pages.dev/Spa-Services/pilates-studio/',
  799000, 'web', id, 14, 'published'
FROM industries WHERE slug = 'spa-beauty'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO templates (name, slug, description, thumbnail, demo_url, price, category, industry_id, sales_count, status)
SELECT
  'Chăm Sóc Da', 'cham-soc-da',
  'Template phòng khám da liễu & skincare clinic. Điều trị da, công nghệ laser, bác sĩ.',
  'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=800&q=80&auto=format&fit=crop',
  'https://webdrop-eol.pages.dev/Spa-Services/cham-soc-da/',
  999000, 'web', id, 18, 'published'
FROM industries WHERE slug = 'spa-beauty'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO templates (name, slug, description, thumbnail, demo_url, price, category, industry_id, sales_count, status)
SELECT
  'Beauty Studio', 'beauty-studio',
  'Template beauty studio tổng hợp: tóc, nail, makeup, skincare. Đặt lịch theo dịch vụ.',
  'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800&q=80&auto=format&fit=crop',
  'https://webdrop-eol.pages.dev/Spa-Services/beauty-studio/',
  799000, 'web', id, 26, 'published'
FROM industries WHERE slug = 'spa-beauty'
ON CONFLICT (slug) DO NOTHING;

-- Admin template (no industry)
INSERT INTO templates (name, slug, description, thumbnail, demo_url, price, category, industry_id, sales_count, status)
VALUES (
  'Admin Basic', 'admin-basic',
  'Template admin dashboard cơ bản. Quản lý bài viết, người dùng, cài đặt. Dark sidebar.',
  'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80&auto=format&fit=crop',
  NULL,
  1499000, 'admin', NULL, 8, 'published'
)
ON CONFLICT (slug) DO NOTHING;

-- ── Settings ─────────────────────────────────────────────────
INSERT INTO settings (key, value, "group") VALUES
  ('site_name',        'webdrop.store',                          'general'),
  ('site_description', 'Mẫu web đẹp, triển khai trọn gói',   'general'),
  ('site_email',       'hello@webdrop.store',                    'general'),
  ('site_phone',       '0900 000 000',                        'general'),
  ('social_facebook',  'https://facebook.com/webdrop.store',     'social'),
  ('social_zalo',      '0900000000',                          'social')
ON CONFLICT (key) DO NOTHING;

-- ── Hero Slides ───────────────────────────────────────────────
-- Slide 1 — Giới thiệu chính (intro)
INSERT INTO hero_slides (type, bg, badge, title, data, buttons, sort_order, status)
VALUES (
  'intro',
  'https://images.unsplash.com/photo-1547658719-da2b51169166?w=1400&q=60&auto=format&fit=crop',
  'Website chuyên nghiệp · Triển khai trọn gói',
  '[
    {"text":"Chọn mẫu đẹp,"},
    {"br":true},
    {"text":"tôi "},
    {"text":"cài đặt","variant":"em"},
    {"text":"cho bạn.","variant":"muted"}
  ]'::jsonb,
  '{
    "subtitle": "Hơn 30 mẫu thiết kế hiện đại cho mọi ngành nghề. Thanh toán xong — website hoàn chỉnh trong 3–5 ngày làm việc, không cần biết kỹ thuật.",
    "stats": [
      {"value":"127+","label":"Khách hàng"},
      {"value":"30+","label":"Mẫu thiết kế"},
      {"value":"3–5","label":"Ngày bàn giao"},
      {"value":"4.9 ★","label":"Đánh giá trung bình"}
    ]
  }'::jsonb,
  '[
    {"label":"Xem mẫu thiết kế →","variant":"primary","action":{"type":"scroll","target":"templates"}},
    {"label":"Cách hoạt động","variant":"outline","action":{"type":"scroll","target":"how"}}
  ]'::jsonb,
  0, 'published'
);

-- Slide 2 — Tại sao chọn webdrop (features)
INSERT INTO hero_slides (type, bg, badge, title, data, buttons, sort_order, status)
VALUES (
  'features',
  'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1400&q=60&auto=format&fit=crop',
  'Tại sao chọn webdrop.store',
  '[
    {"text":"Không chỉ là"},
    {"br":true},
    {"text":"template","variant":"em"},
    {"text":"— là dịch vụ.","variant":"muted"}
  ]'::jsonb,
  '{
    "features": [
      {"icon":"⚡","text":"Bàn giao trong","highlight":"3–5 ngày làm việc"},
      {"icon":"🎨","text":"Hơn 30 mẫu hiện đại,","highlight":"responsive"},
      {"icon":"🔧","text":"Hosting, domain, SSL —","highlight":"tất cả trong một gói"},
      {"icon":"🛡️","text":"Hoàn tiền 100% trong 7 ngày nếu không hài lòng"}
    ],
    "tags": ["SEO chuẩn","PageSpeed 90+","Hỗ trợ tiếng Việt","Gói duy trì hàng tháng"]
  }'::jsonb,
  '[
    {"label":"Xem quy trình →","variant":"primary","action":{"type":"scroll","target":"how"}},
    {"label":"Xem bảng giá","variant":"outline","action":{"type":"scroll","target":"pricing"}}
  ]'::jsonb,
  1, 'published'
);

-- Slide 3 — Ngành nghề (grid)
INSERT INTO hero_slides (type, bg, badge, title, data, buttons, sort_order, status)
VALUES (
  'grid',
  'https://images.unsplash.com/photo-1558655146-d09347e92766?w=1400&q=60&auto=format&fit=crop',
  '30+ mẫu thiết kế sẵn có',
  '[
    {"text":"Mẫu cho"},
    {"br":true},
    {"text":"mọi ngành","variant":"em"},
    {"text":"nghề.","variant":"muted"}
  ]'::jsonb,
  '{
    "items": [
      {"icon":"🏢","label":"Giới thiệu công ty","desc":"Chuyên nghiệp, tối ưu chuyển đổi"},
      {"icon":"💼","label":"Portfolio cá nhân","desc":"Showcase công việc ấn tượng"},
      {"icon":"🍜","label":"Nhà hàng & F&B","desc":"Menu, đặt bàn, địa chỉ"},
      {"icon":"✍️","label":"Blog cá nhân","desc":"Viết bài, phân loại, SEO"},
      {"icon":"💆","label":"Spa & Làm đẹp","desc":"Dịch vụ, đặt lịch, đội ngũ"},
      {"icon":"💬","label":"Forum & Community","desc":"Q&A, thảo luận, thành viên"}
    ]
  }'::jsonb,
  '[
    {"label":"Xem tất cả mẫu →","variant":"primary","action":{"type":"scroll","target":"templates"}}
  ]'::jsonb,
  2, 'published'
);

-- Slide 4 — Bảng giá (pricing)
INSERT INTO hero_slides (type, bg, badge, title, data, buttons, sort_order, status)
VALUES (
  'pricing',
  'https://images.unsplash.com/photo-1553484771-371a605b060b?w=1400&q=60&auto=format&fit=crop',
  'Giá minh bạch, không phát sinh',
  '[
    {"text":"Phù hợp với"},
    {"br":true},
    {"text":"mọi ngân sách","variant":"em"},
    {"text":".","variant":"muted"}
  ]'::jsonb,
  '{
    "plans": [
      {"name":"Starter","price":"1.200.000đ","desc":"Mẫu + source code, tự cài theo hướng dẫn"},
      {"name":"Standard","price":"2.500.000đ","desc":"Cài đặt trọn gói · Hosting · Domain · Nội dung","hot":true},
      {"name":"Premium","price":"12.000.000đ","desc":"Thiết kế custom độc quyền theo yêu cầu"}
    ],
    "tags": ["Hosting 1 năm included","Hoàn tiền 7 ngày","Hỗ trợ 30 ngày"]
  }'::jsonb,
  '[
    {"label":"Xem chi tiết bảng giá →","variant":"primary","action":{"type":"scroll","target":"pricing"}},
    {"label":"Xem mẫu trước","variant":"outline","action":{"type":"scroll","target":"templates"}}
  ]'::jsonb,
  3, 'published'
);

-- Slide 5 — Testimonial
INSERT INTO hero_slides (type, bg, badge, title, data, buttons, sort_order, status)
VALUES (
  'testimonial',
  'https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=1400&q=60&auto=format&fit=crop',
  '127 khách hàng đã tin tưởng',
  '[]'::jsonb,
  '{
    "quote": "Tôi không biết gì về website nhưng chỉ cần điền form brief là xong. 4 ngày sau có website đẹp hơn tôi tưởng tượng. Khách hàng hỏi \"ai làm web cho bạn vậy?\"",
    "author": {
      "name":   "Nguyễn Lan Anh",
      "role":   "Chủ Spa Lavender · Hà Nội · Gói Standard",
      "avatar": "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&q=80&auto=format&fit=crop&crop=face"
    }
  }'::jsonb,
  '[
    {"label":"Đặt hàng ngay →","variant":"primary","action":{"type":"scroll","target":"templates"}},
    {"label":"Xem thêm đánh giá","variant":"outline","action":{"type":"scroll","target":"reviews"}}
  ]'::jsonb,
  4, 'published'
);

-- ── How It Works Packages ────────────────────────────────────
INSERT INTO how_it_works_packages (name, slug, tagline, icon, price, hot, cta_label, cta_href, suitable, sort_order, status)
VALUES
  ('Gói Template',      'goi-template',     'Mua file, tự cài đặt theo hướng dẫn',          '📦', 'Từ 199.000đ',     false, 'Xem thư viện mẫu', '/templates', ARRAY['Có kinh nghiệm kỹ thuật cơ bản','Muốn tự kiểm soát hoàn toàn','Ngân sách tối ưu'], 0, 'published'),
  ('Gói Web cơ bản',   'goi-web-co-ban',   'Website đầy đủ — deploy xong là chạy luôn',    '🌐', 'Từ 3.000.000đ',   true,  'Đặt hàng ngay',    '/templates', ARRAY['Không rành kỹ thuật','Muốn website nhanh — 3 đến 5 ngày','Cần cài đặt trọn gói'], 1, 'published'),
  ('Gói Theo Yêu cầu', 'goi-theo-yeu-cau', 'Thiết kế độc quyền từ đầu theo yêu cầu',       '✏️', 'Từ 20.000.000đ',  false, 'Liên hệ tư vấn',   '/contact',   ARRAY['Cần thiết kế riêng biệt','Có tính năng đặc thù theo nghiệp vụ','Dự án lớn, dài hạn'], 2, 'published')
ON CONFLICT (slug) DO NOTHING;

-- Steps for Gói Template
INSERT INTO how_it_works_steps (package_id, title, desc, sort_order)
SELECT id, 'Chọn mẫu',             'Duyệt thư viện 30+ mẫu, xem demo live, chọn mẫu phù hợp ngành nghề.', 0 FROM how_it_works_packages WHERE slug = 'goi-template'
UNION ALL SELECT id, 'Thanh toán',            'Chuyển khoản — xác nhận trong 2 giờ làm việc.',                         1 FROM how_it_works_packages WHERE slug = 'goi-template'
UNION ALL SELECT id, 'Nhận file ZIP',         'Download file HTML/CSS/JS + hướng dẫn chỉnh nội dung chi tiết.',        2 FROM how_it_works_packages WHERE slug = 'goi-template'
UNION ALL SELECT id, 'Tự chỉnh & triển khai', 'Thay text, ảnh theo hướng dẫn. Upload lên bất kỳ hosting nào là chạy.', 3 FROM how_it_works_packages WHERE slug = 'goi-template';

-- Steps for Gói Web cơ bản
INSERT INTO how_it_works_steps (package_id, title, desc, sort_order)
SELECT id, 'Chọn mẫu & đặt hàng', 'Chọn template từ thư viện, điền form brief ngắn (ngành, màu sắc, nội dung chính).', 0 FROM how_it_works_packages WHERE slug = 'goi-web-co-ban'
UNION ALL SELECT id, 'Chúng tôi cài đặt',   'Setup hosting, domain, SSL. Điền nội dung theo brief. Thường hoàn thành trong 3–5 ngày.', 1 FROM how_it_works_packages WHERE slug = 'goi-web-co-ban'
UNION ALL SELECT id, 'Duyệt & bàn giao',    'Review website, yêu cầu chỉnh sửa (tối đa 2 lần). Bàn giao quyền truy cập đầy đủ.', 2 FROM how_it_works_packages WHERE slug = 'goi-web-co-ban'
UNION ALL SELECT id, 'Hỗ trợ 30 ngày',      'Hỗ trợ kỹ thuật miễn phí 30 ngày đầu qua Zalo. Sau đó có gói bảo trì tháng.', 3 FROM how_it_works_packages WHERE slug = 'goi-web-co-ban';

-- Steps for Gói Theo Yêu cầu
INSERT INTO how_it_works_steps (package_id, title, desc, sort_order)
SELECT id, 'Trao đổi & brief',     'Cuộc gọi / Zalo 30 phút để hiểu rõ yêu cầu, ngành nghề, đối tượng khách hàng, ngân sách.', 0 FROM how_it_works_packages WHERE slug = 'goi-theo-yeu-cau'
UNION ALL SELECT id, 'Wireframe & ký scope', 'Phác thảo cấu trúc trang, danh sách tính năng. Ký checklist scope tránh phát sinh.', 1 FROM how_it_works_packages WHERE slug = 'goi-theo-yeu-cau'
UNION ALL SELECT id, 'Design UI',            'Thiết kế giao diện trên Figma. Khách duyệt, chỉnh sửa đến khi ưng ý.', 2 FROM how_it_works_packages WHERE slug = 'goi-theo-yeu-cau'
UNION ALL SELECT id, 'Phát triển',           'Code frontend + backend theo thiết kế đã duyệt. Báo cáo tiến độ hàng tuần.', 3 FROM how_it_works_packages WHERE slug = 'goi-theo-yeu-cau'
UNION ALL SELECT id, 'Test & Deploy',        'Kiểm thử kỹ trên nhiều thiết bị. Deploy lên hosting, cấu hình domain, SSL.', 4 FROM how_it_works_packages WHERE slug = 'goi-theo-yeu-cau'
UNION ALL SELECT id, 'Bàn giao & hỗ trợ',   'Bàn giao source code (nếu chọn) hoặc bản build. Hỗ trợ 90 ngày sau bàn giao.', 5 FROM how_it_works_packages WHERE slug = 'goi-theo-yeu-cau';
