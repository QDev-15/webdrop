<?php
/**
 * Gói B — Cấu hình hệ thống
 * Chỉnh sửa các thông tin bên dưới theo thông tin hosting của bạn.
 */

// -------------------------------------------------------
// DATABASE
// Mặc định dùng SQLite — không cần cài thêm gì
// -------------------------------------------------------
define('DB_TYPE', 'sqlite');       // Loại DB: 'sqlite' | 'mysql' | 'pgsql'
define('DB_FILE', __DIR__ . '/database/app.db');  // Đường dẫn file SQLite

// Chỉ điền nếu dùng MySQL / PostgreSQL
define('DB_HOST', 'localhost');
define('DB_PORT', '3306');
define('DB_NAME', 'ten_database');
define('DB_USER', 'ten_user');
define('DB_PASS', 'mat_khau');

// -------------------------------------------------------
// APP
// -------------------------------------------------------
define('APP_URL', 'https://example.com');   // URL website (không có dấu / cuối)
define('APP_ENV', 'production');            // 'development' | 'production'
define('APP_KEY', 'change-this-random-32-char-string');

// -------------------------------------------------------
// UPLOAD
// -------------------------------------------------------
define('UPLOAD_DRIVER', 'local');    // 'local' | 'r2'
define('UPLOAD_DIR', __DIR__ . '/uploads/');
define('UPLOAD_URL', APP_URL . '/uploads/');

// Cloudflare R2 (chỉ dùng nếu UPLOAD_DRIVER = 'r2')
define('R2_ACCOUNT_ID', '');
define('R2_ACCESS_KEY', '');
define('R2_SECRET_KEY', '');
define('R2_BUCKET', '');
define('R2_PUBLIC_URL', '');

// -------------------------------------------------------
// EMAIL (SMTP)
// -------------------------------------------------------
define('SMTP_HOST', 'smtp.gmail.com');
define('SMTP_PORT', 587);
define('SMTP_USER', '');
define('SMTP_PASS', '');
define('SMTP_FROM_NAME', 'Website');
define('SMTP_FROM_EMAIL', '');
