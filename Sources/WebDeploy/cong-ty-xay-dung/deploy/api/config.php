<?php
/**
 * Công Ty Xây Dựng — Cấu hình hệ thống
 * ⚠️  SAU KHI UPLOAD LÊN HOSTING, BẮT BUỘC SỬA:
 *     1. APP_URL  → URL thực của website (ví dụ: https://tenweb.vn)
 *     2. APP_KEY  → chuỗi ngẫu nhiên 32 ký tự (tự động sinh khi build)
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
define('APP_URL', 'https://cong-ty-xay-dung.social-networking.me');
define('APP_ENV', 'production');
// ⚠️  Sửa APP_KEY thành chuỗi ngẫu nhiên 32 ký tự
define('APP_KEY', 'ee1441a34b3c133933efacb8fd6e93b57fd45fde6e65c3376402550548607768');

// ─── CORS ────────────────────────────────────────────────────────────────────
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
define('SMTP_FROM_NAME', 'Công Ty Xây Dựng'); define('SMTP_FROM_EMAIL', '');
