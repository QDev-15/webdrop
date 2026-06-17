<?php
declare(strict_types=1);

class Router {
    private array $routes = [];

    public function add(string $method, string $path, mixed $handler): void {
        $this->routes[] = compact('method', 'path', 'handler');
    }

    public function dispatch(string $method, string $path): void {
        $path = '/' . ltrim(parse_url($path, PHP_URL_PATH) ?? $path, '/');
        foreach ($this->routes as $route) {
            if ($route['method'] !== $method) continue;
            $pattern = preg_replace('#:([a-z_]+)#', '(?P<$1>[^/]+)', $route['path']);
            $pattern = '#^' . $pattern . '$#';
            if (preg_match($pattern, $path, $m)) {
                $params = array_filter($m, 'is_string', ARRAY_FILTER_USE_KEY);
                header('Content-Type: application/json; charset=utf-8');
                ($route['handler'])($params);
                return;
            }
        }
        header('Content-Type: application/json; charset=utf-8');
        http_response_code(404);
        echo json_encode(['error' => 'Route not found: ' . $method . ' ' . $path], JSON_UNESCAPED_UNICODE);
    }
}
