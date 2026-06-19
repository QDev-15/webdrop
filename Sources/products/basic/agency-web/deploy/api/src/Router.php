<?php
declare(strict_types=1);

class Router {
    private array $routes = [];

    public function add(string $method, string $path, mixed $handler): void {
        $this->routes[] = [
            'method'  => strtoupper($method),
            'path'    => $path,
            'handler' => $handler,
        ];
    }

    public function dispatch(string $method, string $path): void {
        $method = strtoupper($method);
        $path   = '/' . ltrim(parse_url($path, PHP_URL_PATH) ?? $path, '/');

        foreach ($this->routes as $route) {
            if ($route['method'] !== $method) continue;
            $params = $this->match($route['path'], $path);
            if ($params !== null) {
                header('Content-Type: application/json; charset=utf-8');
                ($route['handler'])($params);
                return;
            }
        }

        header('Content-Type: application/json; charset=utf-8');
        http_response_code(404);
        echo json_encode(['error' => 'Not found'], JSON_UNESCAPED_UNICODE);
    }

    private function match(string $routePath, string $requestPath): ?array {
        $pattern = preg_replace('#/:([^/]+)#', '/(?P<$1>[^/]+)', $routePath);
        $pattern = '#^' . $pattern . '$#';
        if (preg_match($pattern, $requestPath, $matches)) {
            return array_filter($matches, 'is_string', ARRAY_FILTER_USE_KEY);
        }
        return null;
    }
}
