<?php
declare(strict_types=1);

require_once __DIR__ . '/Router.php';
require_once __DIR__ . '/Response.php';
require_once __DIR__ . '/Auth.php';
require_once __DIR__ . '/Database.php';
require_once __DIR__ . '/controllers/AuthController.php';
require_once __DIR__ . '/controllers/UserController.php';
require_once __DIR__ . '/controllers/SettingsController.php';
require_once __DIR__ . '/controllers/HeroSlideController.php';
require_once __DIR__ . '/controllers/MediaController.php';
require_once __DIR__ . '/controllers/ContactController.php';
require_once __DIR__ . '/controllers/StatsController.php';
require_once __DIR__ . '/controllers/PublicController.php';
require_once __DIR__ . '/controllers/MenuCategoryController.php';
require_once __DIR__ . '/controllers/MenuItemController.php';
require_once __DIR__ . '/controllers/TestimonialController.php';
require_once __DIR__ . '/controllers/GalleryController.php';
require_once __DIR__ . '/controllers/UploadController.php';
require_once __DIR__ . '/controllers/UnsplashController.php';

// ── Helpers ──────────────────────────────────────────────────────────────────

function bodyJson(): array {
    static $body = null;
    if ($body === null) {
        $raw = file_get_contents('php://input');
        $body = $raw ? (json_decode($raw, true) ?? []) : [];
        if (empty($body) && !empty($_POST)) { $body = $_POST; }
    }
    return $body;
}

function slugify(string $text): string {
    $text = mb_strtolower($text, 'UTF-8');
    $map = [
        'à'=>'a','á'=>'a','ả'=>'a','ã'=>'a','ạ'=>'a',
        'ă'=>'a','ắ'=>'a','ặ'=>'a','ằ'=>'a','ẳ'=>'a','ẵ'=>'a',
        'â'=>'a','ấ'=>'a','ầ'=>'a','ẩ'=>'a','ẫ'=>'a','ậ'=>'a',
        'è'=>'e','é'=>'e','ẻ'=>'e','ẽ'=>'e','ẹ'=>'e',
        'ê'=>'e','ế'=>'e','ề'=>'e','ể'=>'e','ễ'=>'e','ệ'=>'e',
        'ì'=>'i','í'=>'i','ỉ'=>'i','ĩ'=>'i','ị'=>'i',
        'ò'=>'o','ó'=>'o','ỏ'=>'o','õ'=>'o','ọ'=>'o',
        'ô'=>'o','ố'=>'o','ồ'=>'o','ổ'=>'o','ỗ'=>'o','ộ'=>'o',
        'ơ'=>'o','ớ'=>'o','ờ'=>'o','ở'=>'o','ỡ'=>'o','ợ'=>'o',
        'ù'=>'u','ú'=>'u','ủ'=>'u','ũ'=>'u','ụ'=>'u',
        'ư'=>'u','ứ'=>'u','ừ'=>'u','ử'=>'u','ữ'=>'u','ự'=>'u',
        'ỳ'=>'y','ý'=>'y','ỷ'=>'y','ỹ'=>'y','ỵ'=>'y',
        'đ'=>'d',
    ];
    $text = strtr($text, $map);
    $text = preg_replace('/[^a-z0-9\s-]/', '', $text);
    $text = preg_replace('/[\s-]+/', '-', trim($text));
    return trim($text, '-');
}

// ── Init ─────────────────────────────────────────────────────────────────────

Auth::start();
$db     = Database::getInstance();
$router = new Router();

// ── CORS ─────────────────────────────────────────────────────────────────────

$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
$allowed = array_merge([APP_URL], defined('CORS_ORIGINS') ? CORS_ORIGINS : []);
if (in_array($origin, $allowed, true)) {
    header("Access-Control-Allow-Origin: {$origin}");
} else {
    header('Access-Control-Allow-Origin: ' . APP_URL);
}
header('Access-Control-Allow-Credentials: true');
header('Access-Control-Allow-Headers: Content-Type, X-HTTP-Method-Override');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

// ── Auth routes ───────────────────────────────────────────────────────────────

$auth = new AuthController($db);
$router->add('POST', '/auth/login',  [$auth, 'login']);
$router->add('POST', '/auth/logout', [$auth, 'logout']);
$router->add('GET',  '/auth/me',     [$auth, 'me']);

// ── User routes ───────────────────────────────────────────────────────────────

$user = new UserController($db);
$router->add('GET',  '/users',                      [$user, 'index']);
$router->add('POST', '/users',                      [$user, 'store']);
$router->add('GET',  '/users/:id',                  [$user, 'show']);
$router->add('POST', '/users/:id/update',           [$user, 'update']);
$router->add('POST', '/users/:id/delete',           [$user, 'destroy']);
$router->add('POST', '/users/:id/change-password',  [$user, 'changePassword']);

// ── Settings ──────────────────────────────────────────────────────────────────

$settings = new SettingsController($db);
$router->add('GET',  '/settings',        [$settings, 'index']);
$router->add('POST', '/settings/update', [$settings, 'update']);

// ── Hero Slides ───────────────────────────────────────────────────────────────

$slide = new HeroSlideController($db);
$router->add('GET',  '/hero-slides',              [$slide, 'index']);
$router->add('POST', '/hero-slides',              [$slide, 'store']);
$router->add('POST', '/hero-slides/reorder',      [$slide, 'reorder']);
$router->add('GET',  '/hero-slides/:id',          [$slide, 'show']);
$router->add('POST', '/hero-slides/:id/update',   [$slide, 'update']);
$router->add('POST', '/hero-slides/:id/delete',   [$slide, 'destroy']);

// ── Media ─────────────────────────────────────────────────────────────────────

$media = new MediaController($db);
$router->add('GET',  '/media',            [$media, 'index']);
$router->add('POST', '/media/upload',     [$media, 'upload']);
$router->add('POST', '/media/:id/delete', [$media, 'destroy']);

// ── Contacts ─────────────────────────────────────────────────────────────────

$contact = new ContactController($db);
$router->add('GET',  '/contacts',               [$contact, 'index']);
$router->add('GET',  '/contacts/:id',           [$contact, 'show']);
$router->add('POST', '/contacts/:id/update',    [$contact, 'update']);
$router->add('POST', '/contacts/:id/delete',    [$contact, 'destroy']);

// ── Stats ─────────────────────────────────────────────────────────────────────

$stats = new StatsController($db);
$router->add('GET', '/stats', [$stats, 'index']);

// ── Menu Categories ───────────────────────────────────────────────────────────

$menuCat = new MenuCategoryController($db);
$router->add('GET',  '/menu-categories',              [$menuCat, 'index']);
$router->add('POST', '/menu-categories',              [$menuCat, 'store']);
$router->add('GET',  '/menu-categories/:id',          [$menuCat, 'show']);
$router->add('POST', '/menu-categories/:id/update',   [$menuCat, 'update']);
$router->add('POST', '/menu-categories/:id/delete',   [$menuCat, 'destroy']);

// ── Menu Items ────────────────────────────────────────────────────────────────

$menuItem = new MenuItemController($db);
$router->add('GET',  '/menu-items',              [$menuItem, 'index']);
$router->add('POST', '/menu-items',              [$menuItem, 'store']);
$router->add('GET',  '/menu-items/:id',          [$menuItem, 'show']);
$router->add('POST', '/menu-items/:id/update',   [$menuItem, 'update']);
$router->add('POST', '/menu-items/:id/delete',   [$menuItem, 'destroy']);

// ── Testimonials ──────────────────────────────────────────────────────────────

$testimonial = new TestimonialController($db);
$router->add('GET',  '/testimonials',              [$testimonial, 'index']);
$router->add('POST', '/testimonials',              [$testimonial, 'store']);
$router->add('GET',  '/testimonials/:id',          [$testimonial, 'show']);
$router->add('POST', '/testimonials/:id/update',   [$testimonial, 'update']);
$router->add('POST', '/testimonials/:id/delete',   [$testimonial, 'destroy']);

// ── Gallery ───────────────────────────────────────────────────────────────────

$gallery = new GalleryController($db);
$router->add('GET',  '/gallery',              [$gallery, 'index']);
$router->add('POST', '/gallery',              [$gallery, 'store']);
$router->add('GET',  '/gallery/:id',          [$gallery, 'show']);
$router->add('POST', '/gallery/:id/update',   [$gallery, 'update']);
$router->add('POST', '/gallery/:id/delete',   [$gallery, 'destroy']);

// ── Upload & Unsplash ─────────────────────────────────────────────────────────

$upload   = new UploadController($db);
$router->add('POST', '/upload', [$upload, 'upload']);

$unsplash = new UnsplashController($db);
$router->add('GET',  '/unsplash', [$unsplash, 'search']);
$router->add('POST', '/unsplash', [$unsplash, 'trackDownload']);

// ── Public (no auth) ─────────────────────────────────────────────────────────

$pub = new PublicController($db);
$router->add('GET',  '/public/settings',        [$pub, 'settings']);
$router->add('GET',  '/public/hero-slides',     [$pub, 'heroSlides']);
$router->add('GET',  '/public/menu',            [$pub, 'menu']);
$router->add('GET',  '/public/menu-categories', [$pub, 'menuCategories']);
$router->add('GET',  '/public/testimonials',    [$pub, 'testimonials']);
$router->add('GET',  '/public/gallery',         [$pub, 'gallery']);
$router->add('POST', '/public/contact',         [$pub, 'submitContact']);
$router->add('GET',  '/sitemap.xml',            [$pub, 'sitemap']);

return $router;
