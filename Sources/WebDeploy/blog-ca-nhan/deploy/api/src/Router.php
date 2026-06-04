<?php
declare(strict_types=1);

class Router {
    private array $routes = [];

    public function add(string $method, string $path, callable $handler): void {
        $this->routes[] = [
            'method'  => strtoupper($method),
            'path'    => $path,
            'handler' => $handler,
        ];
    }

    public function dispatch(string $method, string $path): void {
        $method = strtoupper($method);
        foreach ($this->routes as $route) {
            $params = $this->match($route['method'], $route['path'], $method, $path);
            if ($params !== null) {
                ($route['handler'])($params);
                return;
            }
        }
        http_response_code(404);
        header('Content-Type: application/json; charset=utf-8');
        echo json_encode(['error' => 'Route not found: ' . $method . ' ' . $path], JSON_UNESCAPED_UNICODE);
    }

    private function match(string $routeMethod, string $routePath, string $reqMethod, string $reqPath): ?array {
        if ($routeMethod !== $reqMethod) return null;
        $pattern = preg_replace('#:([a-zA-Z_]+)#', '(?P<$1>[^/]+)', $routePath);
        $pattern = '#^' . $pattern . '$#';
        if (!preg_match($pattern, $reqPath, $matches)) return null;
        $params = [];
        foreach ($matches as $k => $v) {
            if (is_string($k)) $params[$k] = $v;
        }
        return $params;
    }
}
