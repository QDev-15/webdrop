<?php
/**
 * Bootstrap — khởi động session, load tất cả class, đăng ký routes
 */
session_start();

// Load core classes
require_once __DIR__ . '/Database.php';
require_once __DIR__ . '/Router.php';
require_once __DIR__ . '/Auth.php';
require_once __DIR__ . '/Response.php';

// Load controllers
foreach (glob(__DIR__ . '/controllers/*.php') as $file) {
    require_once $file;
}

// Helper: tạo slug từ string
function slugify(string $text): string {
    $text = mb_strtolower($text, 'UTF-8');
    $map  = [
        'à'=>'a','á'=>'a','ả'=>'a','ã'=>'a','ạ'=>'a',
        'ă'=>'a','ắ'=>'a','ặ'=>'a','ằ'=>'a','ẳ'=>'a','ẵ'=>'a',
        'â'=>'a','ầ'=>'a','ấ'=>'a','ậ'=>'a','ẩ'=>'a','ẫ'=>'a',
        'đ'=>'d',
        'è'=>'e','é'=>'e','ẻ'=>'e','ẽ'=>'e','ẹ'=>'e',
        'ê'=>'e','ề'=>'e','ế'=>'e','ệ'=>'e','ể'=>'e','ễ'=>'e',
        'ì'=>'i','í'=>'i','ỉ'=>'i','ĩ'=>'i','ị'=>'i',
        'ò'=>'o','ó'=>'o','ỏ'=>'o','õ'=>'o','ọ'=>'o',
        'ô'=>'o','ồ'=>'o','ố'=>'o','ộ'=>'o','ổ'=>'o','ỗ'=>'o',
        'ơ'=>'o','ờ'=>'o','ớ'=>'o','ợ'=>'o','ở'=>'o','ỡ'=>'o',
        'ù'=>'u','ú'=>'u','ủ'=>'u','ũ'=>'u','ụ'=>'u',
        'ư'=>'u','ừ'=>'u','ứ'=>'u','ự'=>'u','ử'=>'u','ữ'=>'u',
        'ỳ'=>'y','ý'=>'y','ỷ'=>'y','ỹ'=>'y','ỵ'=>'y',
    ];
    $text = strtr($text, $map);
    $text = preg_replace('/[^a-z0-9\s-]/', '', $text);
    $text = preg_replace('/[\s-]+/', '-', trim($text));
    return $text;
}

// Helper: sanitize HTML content — strip script/iframe/event attributes
// Dùng khi lưu rich-text content từ admin editor vào DB
function sanitizeHtml(string $html): string {
    // Strip nguyên cả block các tag nguy hiểm
    $html = preg_replace(
        '/<\s*(script|style|iframe|object|embed|form|input|button)\b[^>]*>.*?<\s*\/\s*\1\s*>/is',
        '', $html
    );
    // Strip self-closing nguy hiểm
    $html = preg_replace('/<\s*(script|iframe|object|embed)\b[^>]*\/?\s*>/is', '', $html);
    // Strip event attributes (onclick, onerror, onload, ...)
    $html = preg_replace('/\s+on\w+\s*=\s*(\'[^\']*\'|"[^"]*")/i', '', $html);
    // Strip javascript: trong href/src
    $html = preg_replace('/(href|src)\s*=\s*["\']?\s*javascript:[^"\'>\s]*/i', '$1="#"', $html);
    return $html;
}

// Helper: đọc JSON body
function bodyJson(): array {
    return json_decode(file_get_contents('php://input'), true) ?? [];
}

// Khởi tạo DB và Router
$db     = new Database();
$router = new Router();

// ── PUBLIC (no auth) ──────────────────────────────────────────────────────
$pub = new PublicController($db);
$router->add('GET',  '/public/settings',       [$pub, 'settings']);
$router->add('GET',  '/public/pages',          [$pub, 'pages']);
$router->add('GET',  '/public/pages/:slug',    [$pub, 'pageBySlug']);
$router->add('GET',  '/public/posts',          [$pub, 'posts']);
$router->add('GET',  '/public/posts/:slug',    [$pub, 'postBySlug']);
$router->add('GET',  '/public/categories',     [$pub, 'categories']);
$router->add('GET',  '/public/banners',        [$pub, 'banners']);
$router->add('POST', '/public/contact',        [$pub, 'contact']);

// ── AUTH ──────────────────────────────────────────────────────────────────
$auth = new AuthController($db);
$router->add('POST',   '/auth/login',    [$auth, 'login']);
$router->add('POST',   '/auth/logout',   [$auth, 'logout']);
$router->add('GET',    '/auth/me',       [$auth, 'me']);

// ── STATS (dashboard) ─────────────────────────────────────────────────────
$stats = new StatsController($db);
$router->add('GET', '/stats', [$stats, 'index']);

// ── POSTS ─────────────────────────────────────────────────────────────────
$post = new PostController($db);
$router->add('GET',    '/posts',         [$post, 'index']);
$router->add('GET',    '/posts/:id',     [$post, 'show']);
$router->add('POST',   '/posts',         [$post, 'store']);
$router->add('PUT',    '/posts/:id',     [$post, 'update']);
$router->add('DELETE', '/posts/:id',     [$post, 'destroy']);

// ── PAGES ─────────────────────────────────────────────────────────────────
$page = new PageController($db);
$router->add('GET',    '/pages',         [$page, 'index']);
$router->add('GET',    '/pages/:id',     [$page, 'show']);
$router->add('POST',   '/pages',         [$page, 'store']);
$router->add('PUT',    '/pages/:id',     [$page, 'update']);
$router->add('DELETE', '/pages/:id',     [$page, 'destroy']);

// ── CATEGORIES ────────────────────────────────────────────────────────────
$cat = new CategoryController($db);
$router->add('GET',    '/categories',    [$cat, 'index']);
$router->add('GET',    '/categories/:id', [$cat, 'show']);
$router->add('POST',   '/categories',    [$cat, 'store']);
$router->add('PUT',    '/categories/:id', [$cat, 'update']);
$router->add('DELETE', '/categories/:id', [$cat, 'destroy']);

// ── CONTACTS ──────────────────────────────────────────────────────────────
$contact = new ContactController($db);
$router->add('GET',    '/contacts',      [$contact, 'index']);
$router->add('GET',    '/contacts/:id',  [$contact, 'show']);
$router->add('PUT',    '/contacts/:id',  [$contact, 'update']);
$router->add('DELETE', '/contacts/:id',  [$contact, 'destroy']);

// ── SETTINGS ──────────────────────────────────────────────────────────────
$settings = new SettingsController($db);
$router->add('GET',    '/settings',      [$settings, 'index']);
$router->add('POST',   '/settings',      [$settings, 'update']);

// ── MEDIA ─────────────────────────────────────────────────────────────────
$media = new MediaController($db);
$router->add('GET',    '/media',         [$media, 'index']);
$router->add('POST',   '/media',         [$media, 'store']);
$router->add('DELETE', '/media/:id',     [$media, 'destroy']);

// ── BANNERS ───────────────────────────────────────────────────────────────
$banner = new BannerController($db);
$router->add('GET',    '/banners',       [$banner, 'index']);
$router->add('GET',    '/banners/:id',   [$banner, 'show']);
$router->add('POST',   '/banners',       [$banner, 'store']);
$router->add('PUT',    '/banners/:id',   [$banner, 'update']);
$router->add('DELETE', '/banners/:id',   [$banner, 'destroy']);

$router->dispatch();
