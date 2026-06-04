<?php
declare(strict_types=1);

class Response {
    public static function json(mixed $data, int $code = 200): void {
        http_response_code($code);
        echo json_encode($data, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    }

    public static function error(string $message, int $code = 400): void {
        self::json(['error' => $message], $code);
    }
}
