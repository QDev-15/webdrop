-- Nha Khoa Chỉnh Nha Sài Gòn — Schema SQLite
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
    key   TEXT PRIMARY KEY,
    value TEXT NOT NULL DEFAULT '',
    "group" TEXT NOT NULL DEFAULT 'general'
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
-- NOTE: Users seed via PHP Database::seedUsers() — không hardcode bcrypt hash ở đây

-- Settings
INSERT OR IGNORE INTO settings (key, value, "group") VALUES
('site_name',             'Chỉnh Nha Sài Gòn',         'general'),
('site_tagline',          'Orthodontic Center',           'general'),
('site_phone',            '028 3822 0000',                'general'),
('site_email',            'lienhe@chinhnhasaigon.vn',     'general'),
('site_address',          '123 Đường Nguyễn Văn Trỗi, P.12, Q. Phú Nhuận, TP.HCM', 'general'),
('working_hours',         'T2–T7: 8:00–20:00 | CN: 8:00–12:00', 'general'),
('zalo_number',           '0283822000',                   'general'),
('facebook_url',          'https://facebook.com/chinhnhasaigon', 'social'),
('instagram_url',         'https://instagram.com/chinhnhasaigon', 'social'),
('youtube_url',           'https://youtube.com/chinhnhasaigon', 'social'),
('tiktok_url',            '',                             'social'),
('license_number',        '',                             'general'),
('meta_title',            'Nha Khoa Chỉnh Nha Sài Gòn — Niềng Răng Công Nghệ Số', 'seo'),
('meta_description',      'Nha Khoa Chỉnh Nha Sài Gòn chuyên khoa niềng răng, chỉnh nha công nghệ số: mắc cài kim loại, mắc cài sứ, Invisalign. Chính xác từng milimet.', 'seo'),
('stat_cases',            '4500',                         'general'),
('stat_doctors',          '6',                            'general'),
('stat_years',            '12',                           'general'),
('stat_satisfaction',     '98',                           'general'),
('hero_badge',            'Chỉnh nha kỹ thuật số chính xác', 'general'),
('hero_title_1',          'Nụ cười thẳng đều,',          'general'),
('hero_title_em',         'đo lường bằng dữ liệu',       'general'),
('hero_title_3',          '',                             'general'),
('hero_subtitle',         'Nha Khoa Chỉnh Nha Sài Gòn ứng dụng scan 3D và lập kế hoạch điều trị kỹ thuật số — theo dõi từng milimet dịch chuyển răng, rút ngắn thời gian niềng, kết quả dự đoán được ngay từ buổi tư vấn đầu tiên.', 'general'),
('hero_image',            'https://images.unsplash.com/photo-1609840114035-3c981b782dfe?w=1000&q=80&auto=format&fit=crop', 'general'),
('map_embed',             '',                             'general'),
('unsplash_access_key',   'BdVQbpMxCxFAU2ijjhhvwC5-t3Y9CqFe65Mf09t11kY', 'integration'),
('cloudinary_cloud_name', '',                             'cloudinary'),
('cloudinary_api_key',    '',                             'cloudinary'),
('cloudinary_api_secret', '',                             'cloudinary');

-- Service categories
INSERT OR IGNORE INTO service_categories (id, name, slug, description, sort_order) VALUES
(1, 'Mắc cài niềng răng', 'mac-cai-nieng-rang', 'Các loại mắc cài cố định truyền thống và hiện đại', 1),
(2, 'Khay trong suốt', 'khay-trong-suot', 'Niềng răng bằng khay trong suốt tháo lắp linh hoạt', 2),
(3, 'Tư vấn & Thăm khám', 'tu-van-tham-kham', 'Khám tổng quát, scan 3D và lập kế hoạch điều trị', 3);

-- Services
INSERT OR IGNORE INTO services (id, category_id, name, slug, description, price_from, price_unit, duration, recovery, image, is_featured, sort_order) VALUES
(1, 1, 'Mắc cài kim loại',
 'mac-cai-kim-loai',
 'Giải pháp kinh điển với hiệu quả điều chỉnh cao, xử lý được hầu hết các ca sai lệch khớp cắn từ nhẹ đến phức tạp. Chi phí hợp lý nhất trong các phương pháp chỉnh nha.',
 25000000, 'ca điều trị', '12–24 tháng', 'Không',
 'https://images.unsplash.com/photo-1609840114035-3c981b782dfe?w=600&q=75&auto=format&fit=crop',
 1, 1),
(2, 1, 'Mắc cài sứ thẩm mỹ',
 'mac-cai-su-tham-my',
 'Màu sắc gần với răng thật, giảm sự chú ý khi giao tiếp. Hiệu quả điều trị tương đương mắc cài kim loại nhưng thẩm mỹ hơn.',
 35000000, 'ca điều trị', '12–24 tháng', 'Không',
 'https://images.unsplash.com/photo-1588776814546-daab30f310ce?w=600&q=75&auto=format&fit=crop',
 1, 2),
(3, 1, 'Mắc cài tự buộc',
 'mac-cai-tu-buoc',
 'Cơ chế trượt tự động giảm ma sát, hạn chế số lần tái khám, rút ngắn thời gian mỗi lần thăm khám.',
 40000000, 'ca điều trị', '10–20 tháng', 'Không',
 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&q=75&auto=format&fit=crop',
 0, 3),
(4, 1, 'Mắc cài mặt trong',
 'mac-cai-mat-trong',
 'Gắn phía sau răng, hoàn toàn không lộ khi giao tiếp — phù hợp khách hàng có yêu cầu thẩm mỹ tuyệt đối.',
 90000000, 'ca điều trị', '14–26 tháng', 'Không',
 'https://images.unsplash.com/photo-1559757175-0eb30cd8c063?w=600&q=75&auto=format&fit=crop',
 0, 4),
(5, 2, 'Invisalign',
 'invisalign',
 'Khay trong suốt tháo lắp linh hoạt, gần như vô hình, nhập khẩu chính hãng Hoa Kỳ — thay khay mỗi 1–2 tuần theo kế hoạch 3D.',
 80000000, 'ca điều trị', '9–18 tháng', 'Không',
 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=600&q=75&auto=format&fit=crop',
 1, 5),
(6, 2, 'Khay trong suốt nội địa',
 'khay-trong-suot-noi-dia',
 'Lựa chọn tiết kiệm hơn cho các ca sai lệch nhẹ đến trung bình — vẫn ứng dụng công nghệ scan 3D và mô phỏng lộ trình dịch chuyển răng.',
 45000000, 'ca điều trị', '8–16 tháng', 'Không',
 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=600&q=75&auto=format&fit=crop',
 1, 6),
(7, 3, 'Thăm khám & Scan 3D',
 'tham-kham-scan-3d',
 'Chụp phim, scan hàm răng kỹ thuật số không đau. Mô phỏng lộ trình dịch chuyển răng bằng phần mềm 3D, xem trước kết quả cuối cùng.',
 0, 'lần', '45–60 phút', 'Không',
 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=600&q=75&auto=format&fit=crop',
 0, 7);

-- Testimonials
INSERT OR IGNORE INTO testimonials (id, customer_name, service_name, rating, content, avatar, sort_order) VALUES
(1, 'Nguyễn Thảo', 'Invisalign', 5,
 'Mình niềng Invisalign gần 18 tháng, bác sĩ theo dõi rất sát bằng scan 3D mỗi lần tái khám nên biết chính xác tiến độ. Kết quả vượt mong đợi, răng thẳng đều và tự tin hơn hẳn.',
 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&q=80&auto=format&fit=crop', 1),
(2, 'Lê Minh Khôi', 'Mắc cài sứ thẩm mỹ', 5,
 'Đội ngũ bác sĩ giải thích kỹ từng bước trong kế hoạch điều trị, không giấu diếm chi phí phát sinh. Rất an tâm khi điều trị lâu dài ở đây.',
 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&q=80&auto=format&fit=crop', 2),
(3, 'Phạm Thu Hà', 'Mắc cài kim loại', 5,
 'Con mình niềng răng từ năm lớp 8, phòng khám luôn nhắc lịch tái khám và tư vấn tận tâm cho phụ huynh. Giờ bé đã tự tin cười hơn rất nhiều.',
 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&q=80&auto=format&fit=crop', 3);

-- Team
INSERT OR IGNORE INTO team (id, name, title, role, specialty, education, experience, cases_count, certifications, image, badge, sort_order) VALUES
(1, 'BS. Trần Minh Anh', 'Bác sĩ Chuyên khoa Chỉnh nha', 'Trưởng khoa Chỉnh nha',
 'Niềng răng Invisalign và các ca sai lệch khớp cắn phức tạp',
 'Chuyên khoa I Chỉnh nha — Đại học Y Dược TP.HCM | Chứng chỉ Invisalign Diamond Provider',
 '15+ năm', 1800, 'Invisalign Diamond Provider | Hội Chỉnh nha Việt Nam | Bộ Y Tế cấp phép',
 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=600&q=80&auto=format&fit=crop',
 'Trưởng khoa', 1),
(2, 'BS. Nguyễn Hải Đăng', 'Bác sĩ Chuyên khoa Chỉnh nha', 'Bác sĩ Chỉnh nha',
 'Chỉnh nha cho trẻ em và thanh thiếu niên, mắc cài sứ',
 'Chuyên khoa I Chỉnh nha — Đại học Y Hà Nội | Tu nghiệp chỉnh nha nhi tại Nhật Bản',
 '10+ năm', 1200, 'Hội Nha khoa Nhi Việt Nam | Bộ Y Tế cấp phép',
 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=600&q=80&auto=format&fit=crop',
 'Chuyên gia', 2),
(3, 'BS. Lê Thảo Vy', 'Bác sĩ Chuyên khoa Chỉnh nha', 'Bác sĩ Chỉnh nha',
 'Khay trong suốt, Invisalign và các ca thẩm mỹ phức tạp',
 'Chuyên khoa I Chỉnh nha — Đại học Y Dược TP.HCM | Chứng chỉ Invisalign Certified Provider',
 '8+ năm', 900, 'Invisalign Certified Provider | Hội Chỉnh nha Việt Nam',
 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=600&q=80&auto=format&fit=crop',
 'Chuyên gia', 3),
(4, 'BS. Phạm Quốc Bảo', 'Bác sĩ Chuyên khoa Chỉnh nha', 'Bác sĩ Chỉnh nha',
 'Mắc cài kim loại và mắc cài tự buộc cho các ca khớp cắn phức tạp',
 'Chuyên khoa I Chỉnh nha — Đại học Y Dược TP.HCM',
 '9+ năm', 1100, 'Hội Chỉnh nha Việt Nam | Bộ Y Tế cấp phép',
 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=600&q=80&auto=format&fit=crop',
 'Chuyên gia', 4),
(5, 'BS. Đỗ Ngọc Mai', 'Bác sĩ Chuyên khoa Chỉnh nha', 'Bác sĩ Chỉnh nha',
 'Lập kế hoạch điều trị 3D và theo dõi tiến độ scan số hóa, Invisalign',
 'Chuyên khoa I Chỉnh nha — Đại học Y Hà Nội | Chứng chỉ scan 3D iTero',
 '7+ năm', 750, 'Invisalign Certified | iTero Certified Scanner',
 'https://images.unsplash.com/photo-1651008376811-b90baee60c1f?w=600&q=80&auto=format&fit=crop',
 'Chuyên gia', 5),
(6, 'BS. Vũ Thành Trung', 'Bác sĩ Chuyên khoa Chỉnh nha', 'Bác sĩ Chỉnh nha',
 'Chỉnh nha kết hợp phẫu thuật hàm mặt, mắc cài mặt trong',
 'Chuyên khoa II Chỉnh nha — Đại học Y Dược TP.HCM | Đào tạo phẫu thuật hàm mặt tại Hàn Quốc',
 '11+ năm', 1300, 'Hội Phẫu thuật Hàm mặt Việt Nam | Bộ Y Tế cấp phép',
 'https://images.unsplash.com/photo-1622902046580-2b47f47f5471?w=600&q=80&auto=format&fit=crop',
 'Chuyên gia', 6);
