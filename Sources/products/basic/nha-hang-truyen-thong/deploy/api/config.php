<?php
/**
 * {{SLUG}} — Cấu hình hệ thống
 * ⚠️  SAU KHI UPLOAD LÊN HOSTING, BẮT BUỘC SỬA:
 *     1. APP_URL  → URL thực của website (ví dụ: https://tenweb.vn)
 *     2. APP_KEY  → chuỗi ngẫu nhiên 64 ký tự hex (auto-generate bởi build.mjs)
 */

// ─── DATABASE — Mặc định SQLite, không cần cài thêm gì ────────────────────
define('DB_TYPE', 'sqlite');
define('DB_FILE', __DIR__ . '/database/app.db');

// Chỉ điền nếu dùng MySQL / PostgreSQL (đổi DB_TYPE thành 'mysql' hoặc 'pgsql'):
define('DB_HOST', 'localhost');
define('DB_PORT', '3306');
define('DB_NAME', 'ten_database');
define('DB_USER', 'ten_user');
define('DB_PASS', 'mat_khau');

// ─── APP ─────────────────────────────────────────────────────────────────────
// ⚠️  Sửa APP_URL thành URL thực của hosting (không có dấu / cuối)
define('APP_URL', 'http://localhost:8081');
define('APP_ENV', 'development');
// ⚠️  APP_KEY được auto-generate bởi build.mjs — không cần sửa thủ công
define('APP_KEY', '25cc1b524b72929e76e9982a4d28c8ff7a5a4c5c3eb37c79ff688d1cc25ad694');

// ─── CORS ────────────────────────────────────────────────────────────────────
// Danh sách origin được phép gọi API (để trống = chỉ cho phép APP_URL)
define('CORS_ORIGINS', [
    // 'https://www.tenweb.vn',
    // 'https://tenweb.vn',
]);

// ─── UPLOAD ──────────────────────────────────────────────────────────────────
define('UPLOAD_DRIVER', 'local');
define('UPLOAD_DIR', __DIR__ . '/uploads/');
define('UPLOAD_URL', APP_URL . '/api/uploads/');
define('R2_ACCOUNT_ID', ''); define('R2_ACCESS_KEY', ''); define('R2_SECRET_KEY', '');
define('R2_BUCKET', ''); define('R2_PUBLIC_URL', '');

// ─── SMTP ────────────────────────────────────────────────────────────────────
define('SMTP_HOST', 'smtp.gmail.com'); define('SMTP_PORT', 587);
define('SMTP_USER', ''); define('SMTP_PASS', '');
define('SMTP_FROM_NAME', 'Website'); define('SMTP_FROM_EMAIL', '');
