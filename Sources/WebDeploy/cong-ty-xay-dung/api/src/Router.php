<?php
declare(strict_types=1);

class Router
{
    private array $routes = [];

    public function add(string $method, string $path, callable $handler): void
    {
        $this->routes[] = [
            'method'  => strtoupper($method),
            'path'    => $path,
            'handler' => $handler,
        ];
    }

    public function dispatch(string $method, string $uri): void
    {
        $uri = strtok($uri, '?');
        $uri = '/' . trim($uri, '/');

        foreach ($this->routes as $route) {
            if ($route['method'] !== $method) continue;

            $params = $this->match($route['path'], $uri);
            if ($params !== null) {
                ($route['handler'])($params);
                return;
            }
        }

        Response::notFound('Route not found: ' . $method . ' ' . $uri);
    }

    private function match(string $routePath, string $uri): ?array
    {
        $routePath = '/' . trim($routePath, '/');
        $pattern   = preg_replace('/\/:([^\/]+)/', '/(?P<$1>[^/]+)', $routePath);
        $pattern   = '#^' . $pattern . '$#';

        if (preg_match($pattern, $uri, $matches)) {
            $params = [];
            foreach ($matches as $key => $val) {
                if (is_string($key)) {
                    $params[$key] = $val;
                }
            }
            return $params;
        }

        return null;
    }
}
