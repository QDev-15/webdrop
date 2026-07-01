PRAGMA foreign_keys = ON;
PRAGMA journal_mode = WAL;

-- ─── USERS ───────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS users (
    id         INTEGER PRIMARY KEY AUTOINCREMENT,
    name       TEXT    NOT NULL,
    email      TEXT    NOT NULL UNIQUE,
    password   TEXT    NOT NULL,
    role       TEXT    NOT NULL DEFAULT 'user',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- ─── SETTINGS ────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS settings (
    key    TEXT PRIMARY KEY,
    value  TEXT,
    "group" TEXT
);

-- ─── CONTACTS ────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS contacts (
    id         INTEGER PRIMARY KEY AUTOINCREMENT,
    name       TEXT NOT NULL,
    email      TEXT,
    phone      TEXT,
    subject    TEXT,
    message    TEXT,
    status     TEXT DEFAULT 'new',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- ─── HERO SLIDES ─────────────────────────────────────────────────────────────
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

-- ─── MEDIA ───────────────────────────────────────────────────────────────────
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

-- ─── SERVICE CATEGORIES ──────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS service_categories (
    id         INTEGER PRIMARY KEY AUTOINCREMENT,
    name       TEXT NOT NULL,
    slug       TEXT UNIQUE,
    sort_order INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- ─── SERVICES ────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS services (
    id               INTEGER PRIMARY KEY AUTOINCREMENT,
    category_id      INTEGER REFERENCES service_categories(id) ON DELETE SET NULL,
    name             TEXT NOT NULL,
    description      TEXT,
    duration_minutes INTEGER,
    price            INTEGER,
    price_unit       TEXT DEFAULT 'người',
    is_featured      INTEGER DEFAULT 0,
    image            TEXT,
    sort_order       INTEGER DEFAULT 0,
    created_at       DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- ─── BOOKINGS ────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS bookings (
    id               INTEGER PRIMARY KEY AUTOINCREMENT,
    full_name        TEXT NOT NULL,
    phone            TEXT NOT NULL,
    email            TEXT,
    package_selected TEXT,
    guests           INTEGER DEFAULT 1,
    pref_date        TEXT,
    pref_time        TEXT,
    special_requests TEXT,
    status           TEXT DEFAULT 'new',
    created_at       DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- ─── TESTIMONIALS ────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS testimonials (
    id           INTEGER PRIMARY KEY AUTOINCREMENT,
    name         TEXT NOT NULL,
    role         TEXT,
    location     TEXT,
    rating       INTEGER DEFAULT 5,
    content      TEXT NOT NULL,
    avatar       TEXT,
    is_published INTEGER DEFAULT 1,
    sort_order   INTEGER DEFAULT 0,
    created_at   DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- ─── TEAM ────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS team (
    id           INTEGER PRIMARY KEY AUTOINCREMENT,
    name         TEXT NOT NULL,
    title        TEXT,
    bio          TEXT,
    image        TEXT,
    specialties  TEXT,
    is_published INTEGER DEFAULT 1,
    sort_order   INTEGER DEFAULT 0,
    created_at   DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- ─── GALLERY ITEMS ───────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS gallery_items (
    id           INTEGER PRIMARY KEY AUTOINCREMENT,
    name         TEXT NOT NULL,
    description  TEXT,
    image        TEXT NOT NULL,
    sort_order   INTEGER DEFAULT 0,
    is_published INTEGER DEFAULT 1,
    created_at   DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- ═══════════════════════════════════════════════════════════════════════════════
-- SEED DATA
-- ═══════════════════════════════════════════════════════════════════════════════

-- ─── ADMIN USER ──────────────────────────────────────────────────────────────
INSERT OR IGNORE INTO users (name, email, password, role)
VALUES ('Admin', 'sysadmin@admin.com', '$2y$10$B2immhTk8e.ewEy6xvafzuOBrrcFGLRnv2zfwdOLRWTie3ue39eGK', 'superadmin');

-- ─── SETTINGS ────────────────────────────────────────────────────────────────
INSERT OR IGNORE INTO settings (key, value, "group") VALUES
    ('site_name',        'Luxury Spa Resort',                                                         'general'),
    ('site_phone',       '0901 234 567',                                                              'general'),
    ('site_email',       'info@luxuryspa.vn',                                                         'general'),
    ('site_address',     '123 Đường Resort, Quận 2, TP.HCM',                                          'general'),
    ('working_hours',    'Thứ 2 - Chủ nhật: 7:00 - 22:00',                                           'general'),
    ('social_facebook',  'https://facebook.com/luxuryspa',                                            'social'),
    ('social_instagram', 'https://instagram.com/luxuryspa',                                           'social'),
    ('social_youtube',   'https://youtube.com/@luxuryspa',                                            'social'),
    ('social_zalo',      '0901234567',                                                                 'social'),
    ('meta_title',       'Luxury Spa Resort — Resort Spa Cao Cấp 5 Sao',                              'seo'),
    ('meta_description', 'Trải nghiệm nghỉ dưỡng thư giãn toàn diện — liệu trình cao cấp, không gian thiên nhiên và dịch vụ 5 sao', 'seo'),
    ('hero_title',       'Nơi thời gian dừng lại',                                                    'design'),
    ('hero_subtitle',    'Trải nghiệm nghỉ dưỡng thư giãn toàn diện — liệu trình cao cấp, không gian thiên nhiên và dịch vụ 5 sao dành riêng cho bạn.', 'design'),
    ('hero_badge',       'Resort Spa 5 Sao',                                                          'design'),
    ('stat1_num',        '2000+',                                                                      'design'),
    ('stat1_label',      'Khách hài lòng',                                                            'design'),
    ('stat2_num',        '8',                                                                          'design'),
    ('stat2_label',      'Năm kinh nghiệm',                                                           'design'),
    ('stat3_num',        '12',                                                                         'design'),
    ('stat3_label',      'Liệu trình cao cấp',                                                        'design'),
    ('stat4_num',        '98%',                                                                        'design'),
    ('stat4_label',      'Đánh giá 5 sao',                                                            'design'),
    ('footer_desc',      'Resort Spa 5 sao — nơi thư giãn đỉnh cao giữa thiên nhiên tĩnh lặng.',     'footer'),
    ('cta_title',        'Dành thời gian cho bản thân',                                               'design'),
    ('cta_subtitle',     'Liên hệ ngay để nhận tư vấn gói phù hợp và ưu đãi đặt sớm dành riêng cho bạn.', 'design'),
    ('unsplash_access_key', 'BdVQbpMxCxFAU2ijjhhvwC5-t3Y9CqFe65Mf09t11kY',                          'system');

-- ─── HERO SLIDES ─────────────────────────────────────────────────────────────
INSERT OR IGNORE INTO hero_slides (title, subtitle, button_text, button_link, image, sort_order, status)
VALUES (
    'Nơi thời gian dừng lại',
    'Trải nghiệm nghỉ dưỡng thư giãn toàn diện — liệu trình cao cấp, không gian thiên nhiên và dịch vụ 5 sao dành riêng cho bạn.',
    'Đặt lịch ngay',
    '#booking',
    'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=1800&q=70&auto=format&fit=crop',
    0,
    'published'
);

-- ─── SERVICE CATEGORIES ──────────────────────────────────────────────────────
INSERT OR IGNORE INTO service_categories (id, name, slug, sort_order) VALUES
    (1, 'Chăm sóc toàn thân',  'cham-soc-toan-than', 1),
    (2, 'Chăm sóc da mặt',     'cham-soc-da-mat',    2),
    (3, 'Detox & Wellness',     'detox-wellness',     3);

-- ─── SERVICES ────────────────────────────────────────────────────────────────
-- Chăm sóc toàn thân
INSERT OR IGNORE INTO services (category_id, name, description, duration_minutes, price, price_unit, is_featured, sort_order) VALUES
(1, 'Royal Lotus Body Wrap',
 'Liệu trình bọc cơ thể với tinh chất hoa sen hoàng gia, dưỡng ẩm chuyên sâu và thư giãn hoàn toàn.',
 90, 2500000, 'người', 1, 1),
(1, 'Volcanic Stone Massage',
 'Massage đá nham thạch nóng, giải phóng căng thẳng cơ bắp và kích thích lưu thông tuần hoàn.',
 75, 1900000, 'người', 0, 2),
(1, 'Balinese Full Body Massage',
 'Kỹ thuật massage Bali truyền thống kết hợp dầu thảo mộc tự nhiên, mang lại trạng thái thư giãn sâu.',
 60, 1400000, 'người', 0, 3),
(1, 'Deep Tissue Muscle Release',
 'Liệu trình tác động sâu vào cơ, giải phóng các nút căng và phục hồi cơ thể hiệu quả.',
 90, 1700000, 'người', 0, 4),
(1, 'Rose Petal Bath Ritual',
 'Nghi thức tắm hoa hồng kết hợp tinh dầu và muối khoáng thiên nhiên, thanh lọc da toàn diện.',
 45, 980000, 'người', 0, 5);

-- Chăm sóc da mặt
INSERT OR IGNORE INTO services (category_id, name, description, duration_minutes, price, price_unit, is_featured, sort_order) VALUES
(2, 'Gold 24K Facial Treatment',
 'Liệu trình dưỡng da mặt với vàng 24K, chống lão hóa và tăng cường đàn hồi da.',
 75, 2200000, 'người', 1, 1),
(2, 'LED Light Therapy Facial',
 'Công nghệ ánh sáng LED kết hợp serum chuyên biệt, điều trị mụn và làm sáng da an toàn.',
 60, 1600000, 'người', 0, 2),
(2, 'Hydra Boost Facial',
 'Liệu trình cấp ẩm chuyên sâu với hyaluronic acid và chiết xuất thực vật thuần tự nhiên.',
 50, 1200000, 'người', 0, 3);

-- Detox & Wellness
INSERT OR IGNORE INTO services (category_id, name, description, duration_minutes, price, price_unit, is_featured, sort_order) VALUES
(3, 'Royal Detox Ritual',
 'Gói detox toàn diện kết hợp xông hơi thảo dược, massage detox và liệu trình thanh lọc da — trải nghiệm signature cao cấp nhất.',
 120, 2800000, 'người', 1, 1),
(3, 'Yoga & Meditation Session',
 'Buổi yoga và thiền định dưới sự hướng dẫn của chuyên gia, giúp cân bằng tâm trí và thể xác.',
 60, 750000, 'người', 0, 2),
(3, 'Wellness Consultation',
 'Tư vấn sức khỏe và lên kế hoạch chăm sóc cá nhân hóa phù hợp với nhu cầu và thể trạng.',
 30, 0, 'người', 0, 3);

-- Gói spa (type phân biệt bằng price_unit='cặp' hoặc ghi chú trong description)
INSERT OR IGNORE INTO services (category_id, name, description, duration_minutes, price, price_unit, is_featured, sort_order) VALUES
(NULL, 'Spa Day Retreat',
 'Trọn gói thư giãn cả ngày: body massage + facial + bath ritual + lunch. Phổ biến nhất.',
 NULL, 3900000, 'người', 1, 10),
(NULL, 'Half Day Escape',
 'Gói nửa ngày: body massage + facial + thảo mộc xông hơi. Lựa chọn lý tưởng cho ngày bận rộn.',
 NULL, 1800000, 'người', 0, 11),
(NULL, 'Couple Weekend',
 'Gói nghỉ cuối tuần dành cho cặp đôi: 2 massage + 2 facial + tắm hoa hồng + bữa tối lãng mạn.',
 NULL, 8500000, 'cặp', 0, 12),
(NULL, 'Couple Sunset',
 'Trải nghiệm hoàng hôn lãng mạn: massage đôi + tắm muối hồng + cocktail sunset không cồn.',
 NULL, 3200000, 'cặp', 0, 13),
(NULL, 'Couple Sanctuary',
 'Gói sanctuary signature cho cặp đôi: detox ritual đôi + gold facial + bath ritual + dinner riêng tư.',
 NULL, 4500000, 'cặp', 1, 14),
(NULL, 'Royal VIP Day',
 'Trải nghiệm VIP cao cấp nhất với toàn bộ dịch vụ cao cấp và butler phục vụ riêng. Liên hệ để báo giá.',
 NULL, 0, 'liên hệ', 0, 15);

-- ─── TESTIMONIALS ────────────────────────────────────────────────────────────
INSERT OR IGNORE INTO testimonials (name, role, location, rating, content, is_published, sort_order) VALUES
(
    'Nguyễn Thị Lan',
    'Doanh nhân',
    'Hà Nội',
    5,
    'Dịch vụ tại Luxury Spa Resort thực sự xuất sắc. Từ lúc bước vào đến khi ra về, tôi cảm thấy hoàn toàn được chăm sóc. Các liệu trình chuyên nghiệp, không gian thanh tịnh và đội ngũ nhân viên tận tâm. Sẽ quay lại nhiều lần nữa!',
    1, 1
),
(
    'Trần Minh Khoa',
    'Kiến trúc sư',
    'TP.HCM',
    5,
    'Royal Detox Ritual là trải nghiệm tôi không thể quên. Sau một tuần làm việc căng thẳng, chỉ cần 2 tiếng ở đây là cơ thể và tâm trí được tái tạo hoàn toàn. Không gian thiên nhiên và âm nhạc thư giãn tạo nên sự khác biệt thực sự.',
    1, 2
),
(
    'Phạm Thu Hà',
    'Bác sĩ',
    'Đà Nẵng',
    5,
    'Là người có kiến thức y tế, tôi đánh giá cao sự chuyên nghiệp và an toàn trong từng liệu trình. Các chuyên viên được đào tạo bài bản, sản phẩm sử dụng hoàn toàn tự nhiên. Gold 24K Facial thực sự cải thiện đáng kể làn da của tôi.',
    1, 3
);

-- ─── TEAM ────────────────────────────────────────────────────────────────────
INSERT OR IGNORE INTO team (name, title, bio, specialties, is_published, sort_order) VALUES
(
    'Nguyễn Minh Châu',
    'Trưởng chuyên viên Spa',
    'Hơn 10 năm kinh nghiệm trong lĩnh vực spa cao cấp, đào tạo tại Thái Lan và Bali. Chuyên gia về liệu trình thư giãn và phục hồi toàn thân.',
    'Body Massage, Detox Ritual, Balinese Therapy',
    1, 1
),
(
    'Lê Thị Hương',
    'Chuyên viên Chăm sóc Da',
    'Chuyên gia da liễu thẩm mỹ với 8 năm kinh nghiệm, được chứng nhận quốc tế về công nghệ chăm sóc da tiên tiến.',
    'Gold Facial, LED Therapy, Anti-aging Treatment',
    1, 2
),
(
    'Trần Văn Đức',
    'Chuyên viên Wellness',
    'Huấn luyện viên yoga được chứng nhận RYT-500, chuyên gia thiền định và wellness với triết lý chăm sóc toàn diện thân-tâm-trí.',
    'Yoga, Meditation, Wellness Consultation',
    1, 3
);

-- ─── GALLERY ITEMS ───────────────────────────────────────────────────────────
INSERT OR IGNORE INTO gallery_items (name, description, image, sort_order, is_published) VALUES
(
    'Hồ bơi vô cực',
    'Hồ bơi vô cực với tầm nhìn panorama — không gian thư giãn đặc trưng của resort.',
    'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=900&q=70&auto=format&fit=crop',
    1, 1
),
(
    'Sauna đá muối',
    'Phòng sauna đá muối Himalaya với nhiệt độ lý tưởng, thanh lọc cơ thể từ bên trong.',
    'https://images.unsplash.com/photo-1583417319070-4a69db38a482?w=600&q=70&auto=format&fit=crop',
    2, 1
),
(
    'Steam Room',
    'Phòng xông hơi ướt với thảo dược thiên nhiên, mở lỗ chân lông và thải độc tố.',
    'https://images.unsplash.com/photo-1600334129128-685c5582fd35?w=600&q=70&auto=format&fit=crop',
    3, 1
),
(
    'Phòng liệu trình',
    'Không gian phòng liệu trình riêng tư, yên tĩnh với thiết kế sang trọng và ánh sáng dịu nhẹ.',
    'https://images.unsplash.com/photo-1455238450088-4b1b5f1e1d3e?w=600&q=70&auto=format&fit=crop',
    4, 1
),
(
    'Garden Lounge',
    'Khu vực lounge giữa vườn xanh — nơi thư giãn và thưởng trà sau liệu trình.',
    'https://images.unsplash.com/photo-1439130490301-25e322d88054?w=600&q=70&auto=format&fit=crop',
    5, 1
);
