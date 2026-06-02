<?php
/**
 * Response — helper trả về JSON chuẩn
 */
class Response {
    public static function json(mixed $data, int $status = 200): void {
        http_response_code($status);
        echo json_encode($data, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
        exit;
    }

    public static function ok(mixed $data = null): void {
        self::json(['ok' => true, 'data' => $data]);
    }

    public static function created(mixed $data = null): void {
        self::json(['ok' => true, 'data' => $data], 201);
    }

    public static function error(string $message, int $status = 400): void {
        self::json(['ok' => false, 'error' => $message], $status);
    }

    public static function notFound(string $message = 'Không tìm thấy'): void {
        self::error($message, 404);
    }
}
