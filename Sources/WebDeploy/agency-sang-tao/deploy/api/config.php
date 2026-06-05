<?php
/**
 * Agency Sáng Tạo — Cấu hình hệ thống
 * Chỉnh sửa thông tin bên dưới theo hosting của bạn.
 */

// DATABASE — Mặc định SQLite, không cần cài thêm gì
define('DB_TYPE', 'sqlite');
define('DB_FILE', __DIR__ . '/database/app.db');

// Chỉ điền nếu dùng MySQL / PostgreSQL
define('DB_HOST', 'localhost');
define('DB_PORT', '3306');
define('DB_NAME', 'ten_database');
define('DB_USER', 'ten_user');
define('DB_PASS', 'mat_khau');

// APP — Thay đổi APP_URL thành domain thật của bạn
define('APP_URL', 'https://nhienadmin.tkid.io.vn');
define('APP_ENV', 'production');
define('APP_KEY', 'de8dde0a0fbe99934994df069dcae85428aae7328c9673d6431ddedf8aaf7e86');

// UPLOAD — Nơi lưu ảnh và file
define('UPLOAD_DRIVER', 'local');
define('UPLOAD_DIR', __DIR__ . '/uploads/');
define('UPLOAD_URL', APP_URL . '/api/uploads/');

// Cloudflare R2 (tùy chọn) — bỏ trống nếu dùng local
define('R2_ACCOUNT_ID', '');
define('R2_ACCESS_KEY', '');
define('R2_SECRET_KEY', '');
define('R2_BUCKET', '');
define('R2_PUBLIC_URL', '');

// SMTP — Cấu hình gửi email
define('SMTP_HOST', 'smtp.gmail.com');
define('SMTP_PORT', 587);
define('SMTP_USER', '');      // Điền email Gmail của bạn
define('SMTP_PASS', '');      // Mật khẩu ứng dụng Gmail
define('SMTP_FROM_NAME', 'Agency Sáng Tạo');
define('SMTP_FROM_EMAIL', '');
