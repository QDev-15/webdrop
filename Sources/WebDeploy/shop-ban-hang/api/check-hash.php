<?php
// CÔNG CỤ DEBUG TẠM — XÓA KHỎI SERVER SAU KHI DÙNG
// Truy cập: https://yourdomain.com/api/check-hash.php
require_once __DIR__ . '/config.php';

header('Content-Type: text/plain; charset=utf-8');

$pass = $_GET['pass'] ?? '123456';

// Kiểm tra hash từ DB
try {
    $pdo = new PDO('sqlite:' . DB_FILE, null, null, [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION]);
    $row = $pdo->query("SELECT email, password FROM users WHERE email = 'sysadmin@admin.com'")->fetch(PDO::FETCH_ASSOC);
    if ($row) {
        $ok = password_verify($pass, $row['password']);
        echo "User found: {$row['email']}\n";
        echo "password_verify('$pass') = " . ($ok ? 'TRUE ✓ — đúng mật khẩu' : 'FALSE ✗ — sai mật khẩu') . "\n";
        echo "Hash trong DB: {$row['password']}\n";
    } else {
        echo "KHÔNG TÌM THẤY user sysadmin@admin.com trong DB!\n";
        echo "Bảng users rỗng — seed chưa chạy hoặc bị lỗi.\n";
    }
} catch (Exception $e) {
    echo "Lỗi DB: " . $e->getMessage() . "\n";
}

echo "\n--- Tạo hash mới cho '$pass' ---\n";
echo password_hash($pass, PASSWORD_DEFAULT) . "\n";
echo "\n⚠️  Xóa file này khỏi server ngay sau khi debug xong!\n";
