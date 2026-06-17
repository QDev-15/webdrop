<?php
declare(strict_types=1);

class Router {
    private array $routes = [];

    public function add(string $method, string $path, mixed $handler): void {
        $this->routes[] = compact('method', 'path', 'handler');
    }

    public function dispatch(string $method, string $path): void {
        $path = rtrim($path, '/') ?: '/';
        foreach ($this->routes as $route) {
            if (strtoupper($route['method']) !== strtoupper($method)) continue;
            $pattern = preg_replace('#:([^/]+)#', '(?P<$1>[^/]+)', $route['path']);
            $pattern = '#^' . $pattern . '$#';
            if (preg_match($pattern, $path, $matches)) {
                $params = array_filter($matches, 'is_string', ARRAY_FILTER_USE_KEY);
                ($route['handler'])($params);
                return;
            }
        }
        http_response_code(404);
        header('Content-Type: application/json; charset=utf-8');
        echo json_encode(['error' => 'Không tìm thấy.'], JSON_UNESCAPED_UNICODE);
    }
}
