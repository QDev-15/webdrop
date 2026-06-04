<?php
declare(strict_types=1);

class Response
{
    public static function json(mixed $data, int $status = 200): never
    {
        http_response_code($status);
        header('Content-Type: application/json; charset=utf-8');
        echo json_encode($data, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
        exit;
    }

    public static function error(string $message, int $status = 400): never
    {
        self::json(['error' => $message], $status);
    }

    public static function notFound(string $message = 'Not found'): never
    {
        self::json(['error' => $message], 404);
    }

    public static function unauthorized(): never
    {
        self::json(['error' => 'Unauthorized'], 401);
    }

    public static function forbidden(): never
    {
        self::json(['error' => 'Forbidden'], 403);
    }
}
