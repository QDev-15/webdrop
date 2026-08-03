<?php
/**
 * Luat Van Phong — Cấu hình hệ thống
 * Chỉnh sửa thông tin bên dưới theo hosting của bạn.
 */

// ─────────────────────────────────────────────────────────
// DATABASE — Mặc định SQLite, không cần cài thêm gì
// ─────────────────────────────────────────────────────────

define('DB_TYPE', 'sqlite');
define('DB_FILE', __DIR__ . '/database/app.db');

// Chỉ điền nếu dùng MySQL:
define('DB_HOST', 'localhost');
define('DB_PORT', '3306');
define('DB_NAME', 'ten_database');
define('DB_USER', 'ten_user');
define('DB_PASS', 'mat_khau');

// ─────────────────────────────────────────────────────────
// APP — URL của website sau khi deploy
// Ví dụ: https://luatvanphong.vn
// ─────────────────────────────────────────────────────────

define('APP_URL', 'http://localhost:8081');
define('APP_ENV', 'production');
define('APP_KEY', '6385e0871bd8150ec754c74ca43fa34c9243c72bc1bf8b259b22672617944d26');

// ─────────────────────────────────────────────────────────
// UPLOAD — Lưu ảnh upload
// Mặc định: lưu vào folder uploads/ trong hosting
// ─────────────────────────────────────────────────────────

define('UPLOAD_DRIVER', 'local');
define('UPLOAD_DIR',    __DIR__ . '/uploads/');
define('UPLOAD_URL',    APP_URL . '/api/uploads/');

// Cloudflare R2 (để trống nếu không dùng):
define('R2_ACCOUNT_ID',  '');
define('R2_ACCESS_KEY',  '');
define('R2_SECRET_KEY',  '');
define('R2_BUCKET',      '');
define('R2_PUBLIC_URL',  '');

// ─────────────────────────────────────────────────────────
// SMTP — Gửi email thông báo
// Điền thông tin email để nhận thông báo khi có liên hệ mới
// ─────────────────────────────────────────────────────────

define('SMTP_HOST',       'smtp.gmail.com');
define('SMTP_PORT',       587);
define('SMTP_USER',       '');
define('SMTP_PASS',       '');
define('SMTP_FROM_NAME',  'Văn Phòng Luật Sư');
define('SMTP_FROM_EMAIL', '');
