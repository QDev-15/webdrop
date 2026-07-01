<?php
// FILE TẠM — XÓA NGAY SAU KHI DÙNG
$hash = '$2y$10$B2immhTk8e.ewEy6xvafzuOBrrcFGLRnv2zfwdOLRWTie3ue39eGK';
$pass = '123456';

$ok = password_verify($pass, $hash);

header('Content-Type: text/plain; charset=utf-8');
echo "password_verify('$pass', hash) = " . ($ok ? 'TRUE ✓ — hash đúng' : 'FALSE ✗ — hash sai') . "\n";
echo "\nHash mới tạo từ '$pass':\n";
echo password_hash($pass, PASSWORD_DEFAULT) . "\n";
