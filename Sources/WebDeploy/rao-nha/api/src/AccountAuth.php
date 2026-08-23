<?php
declare(strict_types=1);

/**
 * AccountAuth — phiên đăng nhập cho NGƯỜI ĐĂNG TIN công khai (chính chủ / môi giới tự do /
 * công ty môi giới). HOÀN TOÀN TÁCH BIỆT khỏi Auth.php (dùng cho admin sysadmin):
 *   - Session name riêng: 'RaoNhaAcc' (Auth.php dùng 'RaoNha')
 *   - Session key riêng: $_SESSION['account_id'] (Auth.php dùng $_SESSION['user_id'])
 *   - Thư mục lưu session riêng: sessions_acc/ (Auth.php dùng sessions/)
 * => Một trình duyệt có thể vừa đăng nhập admin (/admin) vừa đăng nhập tài khoản người
 *    đăng tin (website) cùng lúc mà không xung đột phiên.
 */
class AccountAuth {
    public static function start(): void {
        if (session_status() === PHP_SESSION_NONE) {
            $sessDir = dirname(DB_FILE) . DIRECTORY_SEPARATOR . 'sessions_acc';
            if (!is_dir($sessDir)) { @mkdir($sessDir, 0755, true); }
            // Chặn truy cập HTTP trực tiếp vào thư mục session — không chỉ trông cậy rule chặn
            // "api/database/" ở .htaccess gốc (file session không có phần mở rộng, có thể lọt qua
            // rule chặn theo extension trên 1 số cấu hình host).
            $sessHtaccess = $sessDir . DIRECTORY_SEPARATOR . '.htaccess';
            if (is_dir($sessDir) && !file_exists($sessHtaccess)) {
                @file_put_contents($sessHtaccess, "Order allow,deny\nDeny from all\n");
            }
            if (is_dir($sessDir) && is_writable($sessDir)) session_save_path($sessDir);
            $isHttps = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off')
                     || ($_SERVER['HTTP_X_FORWARDED_PROTO'] ?? '') === 'https'
                     || ($_SERVER['HTTP_X_FORWARDED_SSL']   ?? '') === 'on'
                     || ($_SERVER['SERVER_PORT'] ?? '') === '443';
            session_set_cookie_params([
                'lifetime' => 86400 * 30,
                'path'     => '/',
                'secure'   => $isHttps,
                'httponly' => true,
                'samesite' => 'Lax',
            ]);
            session_name('RaoNhaAcc');
            session_start();
        }
    }

    public static function login(array $account): void {
        self::start();
        session_regenerate_id(true);
        $_SESSION['account_id']    = $account['id'];
        $_SESSION['account_name']  = $account['name'];
        $_SESSION['account_email'] = $account['email'] ?? '';
    }

    public static function logout(): void {
        self::start();
        session_destroy();
    }

    public static function account(): ?array {
        self::start();
        if (empty($_SESSION['account_id'])) return null;
        return [
            'id'    => $_SESSION['account_id'],
            'name'  => $_SESSION['account_name'] ?? '',
            'email' => $_SESSION['account_email'] ?? '',
        ];
    }

    /** Trả về account đang đăng nhập, hoặc thoát với 401 nếu chưa đăng nhập. */
    public static function require(): array {
        $acc = self::account();
        if (!$acc) {
            header('Content-Type: application/json; charset=utf-8');
            http_response_code(401);
            echo json_encode(['error' => 'Bạn cần đăng nhập để thực hiện thao tác này.'], JSON_UNESCAPED_UNICODE);
            exit;
        }
        return $acc;
    }
}
