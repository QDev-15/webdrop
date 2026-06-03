<?php
/**
 * Agency Web — Cấu hình hệ thống
 * -------------------------------------------------------
 * Chỉnh sửa thông tin bên dưới theo hosting của bạn.
 * Không commit file này lên public repo.
 */

// ── DATABASE ─────────────────────────────────────────────
// Mặc định dùng SQLite — zero config, không cần cài gì thêm.
define('DB_TYPE', 'sqlite');
define('DB_FILE', __DIR__ . '/database/app.db');

// Chỉ điền nếu bạn muốn dùng MySQL / PostgreSQL
define('DB_HOST', 'localhost');
define('DB_PORT', '3306');
define('DB_NAME', 'agency_web');
define('DB_USER', 'root');
define('DB_PASS', '');

// ── APP ───────────────────────────────────────────────────
// Đổi thành domain thực của bạn (không có dấu / cuối)
define('APP_URL', 'https://example.com');
define('APP_ENV', 'production'); // 'development' hoặc 'production'

// Thay bằng chuỗi ngẫu nhiên 32 ký tự (dùng password generator)
define('APP_KEY', 'change-this-to-random-32-chars-secret');

// ── UPLOAD ────────────────────────────────────────────────
// Mặc định lưu file lên hosting. Đổi sang 'r2' nếu dùng Cloudflare R2.
define('UPLOAD_DRIVER', 'local'); // 'local' hoặc 'r2'
define('UPLOAD_DIR', __DIR__ . '/uploads/');
define('UPLOAD_URL', APP_URL . '/api/uploads/');

// Cloudflare R2 (chỉ điền khi UPLOAD_DRIVER = 'r2')
define('R2_ACCOUNT_ID', '');
define('R2_ACCESS_KEY', '');
define('R2_SECRET_KEY', '');
define('R2_BUCKET', '');
define('R2_PUBLIC_URL', '');

// ── SMTP ─────────────────────────────────────────────────
// Cấu hình gửi email thông báo liên hệ
define('SMTP_HOST', 'smtp.gmail.com');
define('SMTP_PORT', 587);
define('SMTP_USER', '');
define('SMTP_PASS', '');
define('SMTP_FROM_NAME', 'Agency Web');
define('SMTP_FROM_EMAIL', '');

// ── SESSION ──────────────────────────────────────────────
define('SESSION_LIFETIME', 86400 * 7); // 7 ngày (giây)
define('COOKIE_SECURE', false); // true khi dùng HTTPS
