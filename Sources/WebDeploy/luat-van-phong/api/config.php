<?php
/**
 * Luật Văn Phòng — Cấu hình hệ thống
 * ─────────────────────────────────────
 * Chỉnh sửa các thông tin bên dưới theo hosting của bạn.
 * File này KHÔNG được upload lên môi trường public.
 */

// ── DATABASE ──────────────────────────────────────────────────────────────────
// Mặc định dùng SQLite — không cần cài thêm gì, chỉ cần PHP có pdo_sqlite
define('DB_TYPE',   'sqlite');
define('DB_FILE',   __DIR__ . '/database/app.db');

// Chỉ điền nếu bạn dùng MySQL hoặc PostgreSQL thay cho SQLite
define('DB_HOST',   'localhost');
define('DB_PORT',   '3306');
define('DB_NAME',   'ten_database');
define('DB_USER',   'ten_user');
define('DB_PASS',   'mat_khau');

// ── ỨNG DỤNG ─────────────────────────────────────────────────────────────────
define('APP_URL',   'https://example.com');           // URL website (không có dấu / cuối)
define('APP_ENV',   'development');                    // production | development
define('APP_KEY',   'change-this-to-32-random-chars'); // Khóa bí mật, đặt ngẫu nhiên

// ── UPLOAD FILE ───────────────────────────────────────────────────────────────
define('UPLOAD_DRIVER',      'local');                 // local | r2
define('UPLOAD_DIR',         __DIR__ . '/uploads/');
define('UPLOAD_URL',         APP_URL . '/api/uploads/');
// Cloudflare R2 (nếu dùng, để trống nếu không dùng)
define('R2_ACCOUNT_ID',      '');
define('R2_ACCESS_KEY',      '');
define('R2_SECRET_KEY',      '');
define('R2_BUCKET',          '');
define('R2_PUBLIC_URL',      '');

// ── SMTP (gửi email) ──────────────────────────────────────────────────────────
define('SMTP_HOST',           'smtp.gmail.com');
define('SMTP_PORT',           587);
define('SMTP_USER',           '');
define('SMTP_PASS',           '');
define('SMTP_FROM_NAME',      'Văn Phòng Luật Sư');
define('SMTP_FROM_EMAIL',     '');

// ── CORS ──────────────────────────────────────────────────────────────────────
// Thêm domain của bạn vào đây. Localhost được phép mặc định trong development.
define('CORS_ORIGINS', [
    'http://localhost:5173',
    'http://localhost:5174',
    'https://example.com',       // <-- thay bằng domain thực của bạn
]);
