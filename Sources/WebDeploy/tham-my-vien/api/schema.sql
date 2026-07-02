-- Thẩm Mỹ Viện — Schema SQLite
PRAGMA foreign_keys = ON;

-- ── USERS ─────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS users (
    id         INTEGER PRIMARY KEY AUTOINCREMENT,
    name       TEXT    NOT NULL,
    email      TEXT    NOT NULL UNIQUE,
    password   TEXT    NOT NULL,
    role       TEXT    NOT NULL DEFAULT 'user' CHECK (role IN ('superadmin','user')),
    created_at TEXT    NOT NULL DEFAULT (datetime('now'))
);

-- ── SETTINGS ──────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS settings (
    key        TEXT PRIMARY KEY,
    value      TEXT NOT NULL DEFAULT '',
    group_name TEXT NOT NULL DEFAULT 'general'
);

-- ── HERO SLIDES ───────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS hero_slides (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    title       TEXT    NOT NULL,
    subtitle    TEXT    NOT NULL DEFAULT '',
    button_text TEXT    NOT NULL DEFAULT '',
    button_link TEXT    NOT NULL DEFAULT '',
    image       TEXT    NOT NULL DEFAULT '',
    sort_order  INTEGER NOT NULL DEFAULT 0,
    status      TEXT    NOT NULL DEFAULT 'published' CHECK (status IN ('published','draft')),
    created_at  TEXT    NOT NULL DEFAULT (datetime('now'))
);

-- ── SERVICE CATEGORIES ────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS service_categories (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    name        TEXT    NOT NULL,
    slug        TEXT    NOT NULL UNIQUE,
    description TEXT    NOT NULL DEFAULT '',
    icon_svg    TEXT    NOT NULL DEFAULT '',
    sort_order  INTEGER NOT NULL DEFAULT 0,
    created_at  TEXT    NOT NULL DEFAULT (datetime('now'))
);

-- ── SERVICES ──────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS services (
    id            INTEGER PRIMARY KEY AUTOINCREMENT,
    category_id   INTEGER NOT NULL REFERENCES service_categories(id) ON DELETE CASCADE,
    name          TEXT    NOT NULL,
    slug          TEXT    NOT NULL UNIQUE,
    description   TEXT    NOT NULL DEFAULT '',
    price_from    INTEGER NOT NULL DEFAULT 0,
    price_unit    TEXT    NOT NULL DEFAULT 'ca',
    duration      TEXT    NOT NULL DEFAULT '',
    recovery      TEXT    NOT NULL DEFAULT '',
    image         TEXT    NOT NULL DEFAULT '',
    is_featured   INTEGER NOT NULL DEFAULT 0,
    sort_order    INTEGER NOT NULL DEFAULT 0,
    status        TEXT    NOT NULL DEFAULT 'published' CHECK (status IN ('published','draft')),
    created_at    TEXT    NOT NULL DEFAULT (datetime('now'))
);

-- ── BOOKINGS ──────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS bookings (
    id            INTEGER PRIMARY KEY AUTOINCREMENT,
    full_name     TEXT    NOT NULL,
    phone         TEXT    NOT NULL,
    email         TEXT    NOT NULL DEFAULT '',
    service_name  TEXT    NOT NULL DEFAULT '',
    doctor_pref   TEXT    NOT NULL DEFAULT '',
    pref_date     TEXT    NOT NULL DEFAULT '',
    pref_time     TEXT    NOT NULL DEFAULT '',
    message       TEXT    NOT NULL DEFAULT '',
    status        TEXT    NOT NULL DEFAULT 'new' CHECK (status IN ('new','confirmed','completed','cancelled')),
    note          TEXT    NOT NULL DEFAULT '',
    created_at    TEXT    NOT NULL DEFAULT (datetime('now'))
);

-- ── TESTIMONIALS ──────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS testimonials (
    id            INTEGER PRIMARY KEY AUTOINCREMENT,
    customer_name TEXT    NOT NULL,
    avatar        TEXT    NOT NULL DEFAULT '',
    service_name  TEXT    NOT NULL DEFAULT '',
    rating        INTEGER NOT NULL DEFAULT 5 CHECK (rating BETWEEN 1 AND 5),
    content       TEXT    NOT NULL,
    status        TEXT    NOT NULL DEFAULT 'published' CHECK (status IN ('published','draft')),
    sort_order    INTEGER NOT NULL DEFAULT 0,
    created_at    TEXT    NOT NULL DEFAULT (datetime('now'))
);

-- ── TEAM ──────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS team (
    id             INTEGER PRIMARY KEY AUTOINCREMENT,
    name           TEXT    NOT NULL,
    title          TEXT    NOT NULL DEFAULT '',
    role           TEXT    NOT NULL DEFAULT '',
    specialty      TEXT    NOT NULL DEFAULT '',
    education      TEXT    NOT NULL DEFAULT '',
    experience     TEXT    NOT NULL DEFAULT '',
    cases_count    INTEGER NOT NULL DEFAULT 0,
    certifications TEXT    NOT NULL DEFAULT '',
    image          TEXT    NOT NULL DEFAULT '',
    badge          TEXT    NOT NULL DEFAULT '',
    sort_order     INTEGER NOT NULL DEFAULT 0,
    status         TEXT    NOT NULL DEFAULT 'published' CHECK (status IN ('published','draft')),
    created_at     TEXT    NOT NULL DEFAULT (datetime('now'))
);

-- ── CONTACTS ──────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS contacts (
    id         INTEGER PRIMARY KEY AUTOINCREMENT,
    name       TEXT    NOT NULL,
    email      TEXT    NOT NULL DEFAULT '',
    phone      TEXT    NOT NULL DEFAULT '',
    subject    TEXT    NOT NULL DEFAULT '',
    message    TEXT    NOT NULL DEFAULT '',
    status     TEXT    NOT NULL DEFAULT 'new' CHECK (status IN ('new','read','replied')),
    created_at TEXT    NOT NULL DEFAULT (datetime('now'))
);

-- ── MEDIA ─────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS media (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    filename    TEXT    NOT NULL,
    filepath    TEXT    NOT NULL,
    filesize    INTEGER NOT NULL DEFAULT 0,
    filetype    TEXT    NOT NULL DEFAULT '',
    alt_text    TEXT    NOT NULL DEFAULT '',
    uploaded_by INTEGER NOT NULL DEFAULT 1,
    created_at  TEXT    NOT NULL DEFAULT (datetime('now'))
);

-- ── SEED DATA ─────────────────────────────────────────────────────────────────

-- Admin user: sysadmin / 123456 (bcrypt)
INSERT OR IGNORE INTO users (name, email, password, role) VALUES
('Admin', 'sysadmin@admin.com', '$2y$10$4v6x7xoSjfvlzY1mZ4zsBe1DvChoeeI/IPen.XG9wjAPy3zddLYvm', 'superadmin');

-- Settings
INSERT OR IGNORE INTO settings (key, value, group_name) VALUES
('site_name',             'Thẩm Mỹ Viện Quốc Tế',    'general'),
('site_tagline',          'Medical Aesthetics',          'general'),
('site_phone',            '0901 234 567',                'general'),
('site_email',            'info@thammy.vn',              'general'),
('site_address',          '123 Nguyễn Trãi, Quận 1, TP. Hồ Chí Minh', 'general'),
('working_hours',         'Thứ 2 – Thứ 7: 8:00 – 20:00 | Chủ nhật: 9:00 – 17:00', 'general'),
('zalo_number',           '0901234567',                  'general'),
('facebook_url',          '',                            'social'),
('instagram_url',         '',                            'social'),
('youtube_url',           '',                            'social'),
('tiktok_url',            '',                            'social'),
('license_number',        '',                            'general'),
('meta_title',            'Thẩm Mỹ Viện Quốc Tế — Medical Aesthetics', 'seo'),
('meta_description',      'Thẩm mỹ viện chuyên nghiệp hàng đầu. Nâng mũi, độn cằm, căng da, xóa nếp nhăn, điêu khắc cơ thể với đội ngũ bác sĩ giàu kinh nghiệm.', 'seo'),
('stat_cases',            '8500',                        'general'),
('stat_doctors',          '15',                          'general'),
('stat_years',            '12',                          'general'),
('stat_satisfaction',     '98',                          'general'),
('hero_badge',            'Thẩm Mỹ Y Khoa Cao Cấp',    'general'),
('hero_title_1',          'Vẻ đẹp',                     'general'),
('hero_title_em',         'hoàn hảo',                   'general'),
('hero_title_3',          'từ chuyên gia.',              'general'),
('hero_subtitle',         'Nơi hội tụ đội ngũ bác sĩ hàng đầu và công nghệ thẩm mỹ tiên tiến nhất, mang đến kết quả an toàn và tự nhiên cho bạn.', 'general'),
('hero_image',            'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=1000&q=80&auto=format&fit=crop', 'general'),
('unsplash_access_key',   '',                            'integration'),
('cloudinary_cloud_name', '',                            'cloudinary'),
('cloudinary_api_key',    '',                            'cloudinary'),
('cloudinary_api_secret', '',                            'cloudinary');

-- Service categories
INSERT OR IGNORE INTO service_categories (id, name, slug, description, sort_order) VALUES
(1, 'Thẩm mỹ gương mặt', 'tham-my-guong-mat', 'Phẫu thuật và không phẫu thuật vùng mặt', 1),
(2, 'Chăm sóc da & Laser', 'cham-soc-da-laser', 'Công nghệ laser và chăm sóc da chuyên sâu', 2),
(3, 'Thẩm mỹ cơ thể', 'tham-my-co-the', 'Điêu khắc và tạo hình cơ thể chuyên nghiệp', 3);

-- Services
INSERT OR IGNORE INTO services (id, category_id, name, slug, description, price_from, price_unit, duration, recovery, image, is_featured, sort_order) VALUES
(1,  1, 'Nâng mũi cấu trúc bằng sụn', 'nang-mui-cau-truc',
 'Kỹ thuật nâng mũi cấu trúc bằng sụn tự thân (sụn vành tai, sụn vách ngăn) hoặc sụn nhân tạo Medpor cao cấp. Kết quả tự nhiên, bền vững, an toàn lâu dài.',
 15000000, 'ca', '90–120 phút', '7–10 ngày',
 'https://images.unsplash.com/photo-1552511556-9f16dcb6561f?w=600&q=75&auto=format&fit=crop', 1, 1),
(2,  1, 'Độn cằm V-Line / Cắt gọt xương hàm', 'don-cam-v-line',
 'Phẫu thuật độn cằm tạo đường viền mặt V-Line sắc nét, cân đối. Kết hợp cắt gọt xương hàm cho khuôn mặt hài hòa.',
 12000000, 'ca', '60–90 phút', '5–7 ngày',
 'https://images.unsplash.com/photo-1527613426441-4da17471b66d?w=600&q=75&auto=format&fit=crop', 1, 2),
(3,  1, 'Cắt mí / Tạo mắt 2 mí Hàn Quốc', 'cat-mi-2-mi',
 'Kỹ thuật cắt mí tiên tiến theo phương pháp Hàn Quốc, tạo nếp mí tự nhiên, mắt to sáng.',
 6000000, 'ca', '45–60 phút', '5–7 ngày',
 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=600&q=75&auto=format&fit=crop', 0, 3),
(4,  1, 'Tiêm Botox & Filler xóa nhăn', 'botox-filler',
 'Tiêm Botox Allergan và Filler Juvederm/Restylane nhập khẩu chính hãng. Xóa mờ nếp nhăn, làm đầy vùng thiếu hụt.',
 3500000, 'vùng', '30–45 phút', 'Không nghỉ dưỡng',
 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=600&q=75&auto=format&fit=crop', 1, 4),
(5,  1, 'Căng mỏng môi / Tiêm filler môi', 'filler-moi',
 'Tạo hình và bơm đầy môi bằng filler HA mềm mại, cho đôi môi căng mọng, đường viền sắc nét.',
 2500000, 'lần', '20–30 phút', '1–2 ngày',
 'https://images.unsplash.com/photo-1731355771418-f10ab62c9f86?w=160&q=75&auto=format&fit=crop', 0, 5),
(6,  1, 'PRP / Huyết tương giàu tiểu cầu trẻ hóa da', 'prp-tre-hoa',
 'Liệu pháp PRP sử dụng máu tự thân, kích thích collagen tự nhiên, tái tạo da từ bên trong.',
 4500000, 'lần', '45 phút', '1–2 ngày',
 'https://images.unsplash.com/photo-1559757175-0eb30cd8c063?w=600&q=75&auto=format&fit=crop', 0, 6),
(7,  2, 'Laser CO2 Fractional tái tạo da', 'laser-co2',
 'Laser phân đoạn CO2 thế hệ mới xóa sẹo, tái tạo da mặt, thu nhỏ lỗ chân lông, điều trị nám.',
 4000000, 'buổi', '45–60 phút', '5–7 ngày',
 'https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?w=600&q=75&auto=format&fit=crop', 1, 7),
(8,  2, 'Pico Laser xóa nám & tàn nhang', 'pico-laser',
 'Pico Laser thế hệ 4.0 phá vỡ hắc tố nám, tàn nhang ở cấp độ nano giây, không xâm lấn.',
 3000000, 'buổi', '30–45 phút', '1–3 ngày',
 'https://images.unsplash.com/photo-1559757175-0eb30cd8c063?w=600&q=75&auto=format&fit=crop', 0, 8),
(9,  2, 'HIFU 7D Ultraformer căng da không phẫu thuật', 'hifu-7d',
 'Siêu âm hội tụ cường độ cao 7 lớp, nâng cơ mặt và căng da toàn diện. Hiệu quả 12–18 tháng.',
 8000000, 'liệu trình', '60–90 phút', 'Không nghỉ dưỡng',
 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&q=75&auto=format&fit=crop', 1, 9),
(10, 2, 'Peel da hóa học & Microneedling', 'peel-da',
 'Liệu trình peel da kết hợp microneedling làm sáng da, giảm thâm mụn, thu nhỏ lỗ chân lông.',
 1800000, 'buổi', '45–60 phút', '3–5 ngày',
 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=600&q=75&auto=format&fit=crop', 0, 10),
(11, 3, 'Hút mỡ điêu khắc Body Jet', 'hut-mo-body-jet',
 'Hút mỡ thế hệ mới bằng tia nước — định hình chính xác vùng bụng, eo, đùi. Phục hồi nhanh.',
 20000000, 'ca', '120–180 phút', '10–14 ngày',
 'https://images.unsplash.com/photo-1609840114035-3c981b782dfe?w=600&q=75&auto=format&fit=crop', 1, 11),
(12, 3, 'Nâng ngực túi silicon', 'nang-nguc',
 'Nâng ngực với túi silicon Motiva/Mentor thế hệ mới, đường rạch ẩn, tỷ lệ tự nhiên.',
 28000000, 'ca', '90–120 phút', '7–10 ngày',
 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=600&q=75&auto=format&fit=crop', 0, 12),
(13, 3, 'Triệt lông vĩnh viễn Laser Diode', 'triet-long',
 'Laser Diode 808nm triệt lông toàn thân an toàn, không đau, hiệu quả sau 4–6 buổi.',
 500000, 'buổi', '20–60 phút', 'Không nghỉ dưỡng',
 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&q=75&auto=format&fit=crop', 0, 13);

-- Testimonials
INSERT OR IGNORE INTO testimonials (id, customer_name, service_name, rating, content, avatar, sort_order) VALUES
(1, 'Nguyễn Thị Lan', 'Nâng mũi cấu trúc', 5,
 'Tôi đã rất lo lắng trước khi quyết định nâng mũi. Nhưng sau khi gặp bác sĩ tư vấn tận tình và chuyên nghiệp, tôi hoàn toàn yên tâm. Kết quả vượt ngoài mong đợi, tự nhiên và đẹp hơn cả tưởng tượng.',
 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&q=80&auto=format&fit=crop', 1),
(2, 'Trần Minh Thu', 'Căng da HIFU 7D', 5,
 'Căng da HIFU tại đây thay đổi hoàn toàn. Chỉ sau 1 lần điều trị, da mặt tôi săn chắc hơn hẳn. Đội ngũ rất thân thiện và không gian phòng khám rất sạch sẽ, chuyên nghiệp.',
 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&q=80&auto=format&fit=crop', 2),
(3, 'Lê Phương Linh', 'Laser trị nám', 5,
 'Bác sĩ rất am hiểu và tư vấn rất kỹ. Tôi làm laser trị nám 3 buổi đã thấy rõ hiệu quả. Đặc biệt tôi tin tưởng vào thiết bị và sản phẩm chính hãng nhập khẩu.',
 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=80&q=80&auto=format&fit=crop', 3);

-- Team
INSERT OR IGNORE INTO team (id, name, title, role, specialty, education, experience, cases_count, certifications, image, badge, sort_order) VALUES
(1, 'ThS.BS. Nguyễn Văn Minh', 'Thạc sĩ Bác sĩ', 'Phẫu thuật thẩm mỹ mặt',
 'Phẫu thuật nâng mũi, độn cằm và tạo hình vùng mặt',
 'Thạc sĩ Y khoa — Đại học Y Hà Nội | Tu nghiệp phẫu thuật thẩm mỹ tại Seoul, Hàn Quốc',
 '15+ năm', 3200, 'ISAPS Member | Bộ Y Tế cấp phép | FDA Certified',
 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=600&q=80&auto=format&fit=crop',
 'Trưởng khoa', 1),
(2, 'TS.BS. Trần Thị Hương', 'Tiến sĩ Bác sĩ', 'Da liễu thẩm mỹ',
 'Điều trị laser, trẻ hóa da và các liệu pháp không xâm lấn',
 'Tiến sĩ Da liễu — Đại học Quốc gia Seoul | Nghiên cứu sinh tại Viện Da liễu Paris',
 '12+ năm', 2800, 'ASLMS Member | Cynosure Certified | CE Certified',
 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=600&q=80&auto=format&fit=crop',
 'Chuyên gia', 2),
(3, 'ThS.BS. Lê Quốc Hùng', 'Thạc sĩ Bác sĩ', 'Tạo hình thẩm mỹ',
 'Căng da không phẫu thuật, tiêm Botox và Filler',
 'Thạc sĩ Y khoa — Đại học Y Dược TP.HCM | Fellowship tại Allergan Training Center',
 '10+ năm', 1900, 'Allergan Certified | Merz Certified | IPRAS Member',
 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=600&q=80&auto=format&fit=crop',
 'Chuyên gia', 3),
(4, 'BSCK.II Phạm Thị Mai', 'Bác sĩ Chuyên khoa II', 'Thẩm mỹ cơ thể',
 'Hút mỡ Body Jet, điêu khắc vóc dáng và phẫu thuật nâng ngực',
 'Bác sĩ CK II — Đại học Y Dược TP.HCM | Đào tạo hút mỡ tại Human Med AG, Đức',
 '8+ năm', 1400, 'Body Jet Certified | ASAPS Member | Bộ Y Tế cấp phép',
 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=600&q=80&auto=format&fit=crop',
 'Chuyên gia', 4),
(5, 'ThS.BS. Vũ Đức Thành', 'Thạc sĩ Bác sĩ', 'Laser & Công nghệ cao',
 'Laser CO2 Fractional, Pico Laser, HIFU 7D',
 'Thạc sĩ Da liễu — Đại học Y Hà Nội | Chứng chỉ Laser từ Syneron-Candela',
 '9+ năm', 2100, 'Candela Certified | Ultraformer III | FDA Cleared',
 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=600&q=80&auto=format&fit=crop',
 'Chuyên gia', 5),
(6, 'ThS.BS. Hoàng Thị Nga', 'Thạc sĩ Bác sĩ', 'Gây mê hồi sức',
 'An toàn gây mê trong phẫu thuật thẩm mỹ',
 'Thạc sĩ Gây mê hồi sức — ĐH Y Dược TP.HCM | Chứng chỉ gây mê quốc tế',
 '11+ năm', 4000, 'WFSA Member | ACLS Certified | Bộ Y Tế cấp phép',
 'https://images.unsplash.com/photo-1651008376811-b90baee60c1f?w=600&q=80&auto=format&fit=crop',
 'Bác sĩ GMHS', 6);
