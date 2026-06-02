<?php
/**
 * Router — khớp METHOD + PATH và gọi handler tương ứng
 */
class Router {
    private array $routes = [];

    public function add(string $method, string $path, callable $handler): void {
        $this->routes[] = [$method, $path, $handler];
    }

    public function dispatch(): void {
        $method = $_SERVER['REQUEST_METHOD'];
        $uri    = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);

        // Strip tất cả trước /api (hỗ trợ cả deploy ở subdirectory)
        $path = '/' . ltrim(preg_replace('#^.*/api#', '', $uri) ?? '', '/');
        $path = $path ?: '/';

        foreach ($this->routes as [$m, $pattern, $handler]) {
            if ($m !== $method) continue;

            // Chuyển :param thành regex group
            $regex = '#^' . preg_replace('#:([a-z_]+)#', '(?P<$1>[^/]+)', $pattern) . '$#';
            if (preg_match($regex, $path, $matches)) {
                $params = array_filter($matches, 'is_string', ARRAY_FILTER_USE_KEY);
                $handler($params);
                return;
            }
        }

        Response::json(['error' => 'Not found'], 404);
    }
}
