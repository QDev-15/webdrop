-- ═══════════════════════════════════════════════════════════════════════════
-- CORE SCHEMA — cố định, dùng chung mọi site WebDeploy — KHÔNG được sửa/đổi tên cột
-- Khớp 1-1 với static controllers đã có sẵn trong scaffold:
-- UserController/Auth.php, SettingsController.php, HeroSlideController.php (+ HeroSlideForm/List.tsx),
-- ContactController.php (+ ContactList.tsx), MediaController.php
-- ═══════════════════════════════════════════════════════════════════════════
PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS users (
    id         INTEGER PRIMARY KEY AUTOINCREMENT,
    name       TEXT    NOT NULL,
    email      TEXT    NOT NULL UNIQUE,
    password   TEXT    NOT NULL,
    role       TEXT    NOT NULL DEFAULT 'user',
    created_at TEXT    NOT NULL DEFAULT (datetime('now','localtime'))
);

CREATE TABLE IF NOT EXISTS settings (
    key   TEXT PRIMARY KEY,
    value TEXT NOT NULL DEFAULT '',
    grp   TEXT NOT NULL DEFAULT 'general'
);

CREATE TABLE IF NOT EXISTS hero_slides (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    title       TEXT NOT NULL,
    subtitle    TEXT NOT NULL DEFAULT '',
    image       TEXT NOT NULL DEFAULT '',
    button_text TEXT NOT NULL DEFAULT '',
    button_link TEXT NOT NULL DEFAULT '',
    sort_order  INTEGER NOT NULL DEFAULT 0,
    status      TEXT NOT NULL DEFAULT 'published',
    created_at  TEXT NOT NULL DEFAULT (datetime('now','localtime'))
);

CREATE TABLE IF NOT EXISTS contacts (
    id         INTEGER PRIMARY KEY AUTOINCREMENT,
    name       TEXT NOT NULL,
    email      TEXT NOT NULL DEFAULT '',
    phone      TEXT NOT NULL DEFAULT '',
    subject    TEXT NOT NULL DEFAULT '',
    message    TEXT NOT NULL DEFAULT '',
    status     TEXT NOT NULL DEFAULT 'new',
    created_at TEXT NOT NULL DEFAULT (datetime('now','localtime'))
);

CREATE TABLE IF NOT EXISTS media (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    filename    TEXT NOT NULL,
    filepath    TEXT NOT NULL,
    filesize    INTEGER NOT NULL DEFAULT 0,
    filetype    TEXT NOT NULL DEFAULT '',
    alt_text    TEXT NOT NULL DEFAULT '',
    uploaded_by INTEGER REFERENCES users(id) ON DELETE SET NULL,
    created_at  TEXT NOT NULL DEFAULT (datetime('now','localtime'))
);

-- ═══════════════════════════════════════════════════════════════════════════
-- ▼ EXTENSION TABLES — AI (web-deploy-builder) thêm bảng riêng theo ngách TỪ ĐÂY.
-- KHÔNG sửa/xoá/đổi tên cột của 5 bảng core phía trên.
-- ═══════════════════════════════════════════════════════════════════════════

-- ── PROJECTS (du-an.html grid bento/list + du-an-chi-tiet-1/2.html case study) ──
-- Mỗi dự án là 1 thẻ trong du-an.html; nếu has_case_study=1 thì có thêm trang chi tiết
-- đầy đủ 7 mục (page hero, overview bar, thách thức, giải pháp 4-bước, gallery, kết quả, testimonial + liên quan).
CREATE TABLE IF NOT EXISTS projects (
    id                  INTEGER PRIMARY KEY AUTOINCREMENT,
    title               TEXT NOT NULL,
    slug                TEXT UNIQUE,
    category            TEXT NOT NULL DEFAULT '',
    image               TEXT NOT NULL DEFAULT '',
    short_desc          TEXT NOT NULL DEFAULT '',
    year                TEXT NOT NULL DEFAULT '',
    has_case_study      INTEGER NOT NULL DEFAULT 0,
    client_name         TEXT NOT NULL DEFAULT '',
    hero_desc           TEXT NOT NULL DEFAULT '',
    industry            TEXT NOT NULL DEFAULT '',
    duration            TEXT NOT NULL DEFAULT '',
    services_provided   TEXT NOT NULL DEFAULT '',
    key_result          TEXT NOT NULL DEFAULT '',
    challenge_title     TEXT NOT NULL DEFAULT '',
    challenge_intro      TEXT NOT NULL DEFAULT '',
    challenge_details     TEXT NOT NULL DEFAULT '',
    solution_items        TEXT NOT NULL DEFAULT '',
    gallery_images        TEXT NOT NULL DEFAULT '',
    results_note          TEXT NOT NULL DEFAULT '',
    results_items         TEXT NOT NULL DEFAULT '',
    testimonial_content   TEXT NOT NULL DEFAULT '',
    testimonial_author    TEXT NOT NULL DEFAULT '',
    testimonial_role      TEXT NOT NULL DEFAULT '',
    featured            INTEGER NOT NULL DEFAULT 0,
    sort_order          INTEGER NOT NULL DEFAULT 0,
    status              TEXT NOT NULL DEFAULT 'published',
    created_at          TEXT NOT NULL DEFAULT (datetime('now','localtime'))
);

-- ── TESTIMONIALS (trang chủ teaser 3 thẻ + ve-toi.html hscroll đầy đủ + case study) ──
CREATE TABLE IF NOT EXISTS testimonials (
    id            INTEGER PRIMARY KEY AUTOINCREMENT,
    author_name   TEXT NOT NULL,
    author_title  TEXT NOT NULL DEFAULT '',
    author_avatar TEXT NOT NULL DEFAULT '',
    content       TEXT NOT NULL DEFAULT '',
    rating        INTEGER NOT NULL DEFAULT 5,
    sort_order    INTEGER NOT NULL DEFAULT 0,
    status        TEXT NOT NULL DEFAULT 'published',
    created_at    TEXT NOT NULL DEFAULT (datetime('now','localtime'))
);

-- ── FAQ (dich-vu.html) ──
CREATE TABLE IF NOT EXISTS faqs (
    id         INTEGER PRIMARY KEY AUTOINCREMENT,
    question   TEXT NOT NULL,
    answer     TEXT NOT NULL,
    page       TEXT NOT NULL DEFAULT 'dich-vu',
    sort_order INTEGER NOT NULL DEFAULT 0,
    status     TEXT NOT NULL DEFAULT 'published'
);

-- ── PRICING PLANS (dich-vu.html — 3 gói: UX Audit / Full Product Design / Design System) ──
CREATE TABLE IF NOT EXISTS pricing_plans (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    name        TEXT NOT NULL,
    tag         TEXT NOT NULL DEFAULT '',
    price       TEXT NOT NULL,
    unit        TEXT NOT NULL DEFAULT '',
    features    TEXT NOT NULL DEFAULT '',
    is_featured INTEGER NOT NULL DEFAULT 0,
    cta_text    TEXT NOT NULL DEFAULT 'Chọn gói này',
    cta_link    TEXT NOT NULL DEFAULT '/lien-he',
    sort_order  INTEGER NOT NULL DEFAULT 0,
    status      TEXT NOT NULL DEFAULT 'published'
);

-- ── TIMELINE ITEMS (ve-toi.html — hành trình sự nghiệp) ──
CREATE TABLE IF NOT EXISTS timeline_items (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    year        TEXT NOT NULL,
    title       TEXT NOT NULL,
    description TEXT NOT NULL DEFAULT '',
    sort_order  INTEGER NOT NULL DEFAULT 0,
    status      TEXT NOT NULL DEFAULT 'published'
);
