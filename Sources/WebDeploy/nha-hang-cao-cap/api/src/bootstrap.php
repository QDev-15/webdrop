<?php
declare(strict_types=1);

require_once __DIR__ . '/Database.php';
require_once __DIR__ . '/Router.php';
require_once __DIR__ . '/Auth.php';
require_once __DIR__ . '/Response.php';

// ── Helper functions ──────────────────────────────────────────────────────────

function bodyJson(): array {
    $raw = file_get_contents('php://input');
    if (!$raw) return [];
    $data = json_decode($raw, true);
    return is_array($data) ? $data : [];
}

function slugify(string $text): string {
    $text = mb_strtolower($text, 'UTF-8');
    $trans = [
        'a' => ['à','á','â','ã','ä','å','ā','ă','ạ','ả','ắ','ặ','ằ','ẳ','ẵ','ấ','ầ','ẩ','ẫ','ậ'],
        'd' => ['đ'],
        'e' => ['è','é','ê','ë','ē','ĕ','ẹ','ẻ','ẽ','ế','ề','ể','ễ','ệ'],
        'i' => ['ì','í','î','ï','ĩ','ī','ỉ','ị'],
        'o' => ['ò','ó','ô','õ','ö','ō','ŏ','ọ','ỏ','ố','ồ','ổ','ỗ','ộ','ớ','ờ','ở','ỡ','ợ'],
        'u' => ['ù','ú','û','ü','ũ','ū','ŭ','ụ','ủ','ứ','ừ','ử','ữ','ự'],
        'y' => ['ỳ','ý','ỷ','ỹ','ỵ'],
        'c' => ['ç'],
        'n' => ['ñ'],
    ];
    foreach ($trans as $ascii => $chars) {
        $text = str_replace($chars, $ascii, $text);
    }
    $text = preg_replace('/[^a-z0-9\s-]/', '', $text);
    $text = preg_replace('/[\s-]+/', '-', trim($text));
    return $text;
}

// ── CORS ─────────────────────────────────────────────────────────────────────

$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
$allowedOrigins = defined('CORS_ORIGINS') ? CORS_ORIGINS : [];
if (defined('APP_URL')) $allowedOrigins[] = APP_URL;
if (empty($allowedOrigins) || in_array($origin, $allowedOrigins, true)) {
    if ($origin) {
        header('Access-Control-Allow-Origin: ' . $origin);
    } else {
        header('Access-Control-Allow-Origin: *');
    }
}
header('Access-Control-Allow-Credentials: true');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, X-HTTP-Method-Override');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

Auth::start();
$db     = Database::getInstance();
$router = new Router();

// ── Controllers ───────────────────────────────────────────────────────────────

require_once __DIR__ . '/controllers/AuthController.php';
require_once __DIR__ . '/controllers/ContactController.php';
require_once __DIR__ . '/controllers/HeroSlideController.php';
require_once __DIR__ . '/controllers/MediaController.php';
require_once __DIR__ . '/controllers/SettingsController.php';
require_once __DIR__ . '/controllers/StatsController.php';
require_once __DIR__ . '/controllers/UserController.php';
require_once __DIR__ . '/controllers/PublicController.php';
require_once __DIR__ . '/controllers/MenuCategoryController.php';
require_once __DIR__ . '/controllers/MenuItemController.php';
require_once __DIR__ . '/controllers/ReservationController.php';
require_once __DIR__ . '/controllers/GalleryController.php';
require_once __DIR__ . '/controllers/TestimonialController.php';
require_once __DIR__ . '/controllers/UploadController.php';
require_once __DIR__ . '/controllers/UnsplashController.php';

// ── Auth ──────────────────────────────────────────────────────────────────────

$auth = new AuthController($db);
$router->add('POST', '/auth/login',  [$auth, 'login']);
$router->add('POST', '/auth/logout', [$auth, 'logout']);
$router->add('GET',  '/auth/me',     [$auth, 'me']);

// ── Users ─────────────────────────────────────────────────────────────────────

$user = new UserController($db);
$router->add('GET',  '/users',                       [$user, 'index']);
$router->add('POST', '/users',                       [$user, 'store']);
$router->add('POST', '/users/:id/update',            [$user, 'update']);
$router->add('POST', '/users/:id/delete',            [$user, 'destroy']);
$router->add('POST', '/users/:id/change-password',   [$user, 'changePassword']);

// ── Stats ─────────────────────────────────────────────────────────────────────

$stats = new StatsController($db);
$router->add('GET', '/stats', [$stats, 'index']);

// ── Settings ──────────────────────────────────────────────────────────────────

$settings = new SettingsController($db);
$router->add('GET',  '/settings',        [$settings, 'index']);
$router->add('POST', '/settings/update', [$settings, 'update']);

// ── Hero Slides ───────────────────────────────────────────────────────────────

$slide = new HeroSlideController($db);
$router->add('GET',  '/hero-slides',            [$slide, 'index']);
$router->add('POST', '/hero-slides',            [$slide, 'store']);
$router->add('POST', '/hero-slides/reorder',    [$slide, 'reorder']);
$router->add('GET',  '/hero-slides/:id',        [$slide, 'show']);
$router->add('POST', '/hero-slides/:id/update', [$slide, 'update']);
$router->add('POST', '/hero-slides/:id/delete', [$slide, 'destroy']);

// ── Menu Categories ───────────────────────────────────────────────────────────

$menuCat = new MenuCategoryController($db);
$router->add('GET',  '/menu-categories',            [$menuCat, 'index']);
$router->add('POST', '/menu-categories',            [$menuCat, 'store']);
$router->add('GET',  '/menu-categories/:id',        [$menuCat, 'show']);
$router->add('POST', '/menu-categories/:id/update', [$menuCat, 'update']);
$router->add('POST', '/menu-categories/:id/delete', [$menuCat, 'destroy']);

// ── Menu Items ────────────────────────────────────────────────────────────────

$menuItem = new MenuItemController($db);
$router->add('GET',  '/menu-items',            [$menuItem, 'index']);
$router->add('POST', '/menu-items',            [$menuItem, 'store']);
$router->add('GET',  '/menu-items/:id',        [$menuItem, 'show']);
$router->add('POST', '/menu-items/:id/update', [$menuItem, 'update']);
$router->add('POST', '/menu-items/:id/delete', [$menuItem, 'destroy']);

// ── Reservations ──────────────────────────────────────────────────────────────

$reservation = new ReservationController($db);
$router->add('GET',  '/reservations',            [$reservation, 'index']);
$router->add('POST', '/reservations',            [$reservation, 'store']);
$router->add('GET',  '/reservations/:id',        [$reservation, 'show']);
$router->add('POST', '/reservations/:id/update', [$reservation, 'update']);
$router->add('POST', '/reservations/:id/delete', [$reservation, 'destroy']);

// ── Gallery ───────────────────────────────────────────────────────────────────

$gallery = new GalleryController($db);
$router->add('GET',  '/gallery',            [$gallery, 'index']);
$router->add('POST', '/gallery',            [$gallery, 'store']);
$router->add('GET',  '/gallery/:id',        [$gallery, 'show']);
$router->add('POST', '/gallery/:id/update', [$gallery, 'update']);
$router->add('POST', '/gallery/:id/delete', [$gallery, 'destroy']);

// ── Testimonials ──────────────────────────────────────────────────────────────

$testimonial = new TestimonialController($db);
$router->add('GET',  '/testimonials',            [$testimonial, 'index']);
$router->add('POST', '/testimonials',            [$testimonial, 'store']);
$router->add('GET',  '/testimonials/:id',        [$testimonial, 'show']);
$router->add('POST', '/testimonials/:id/update', [$testimonial, 'update']);
$router->add('POST', '/testimonials/:id/delete', [$testimonial, 'destroy']);

// ── Contacts ──────────────────────────────────────────────────────────────────

$contact = new ContactController($db);
$router->add('GET',  '/contacts',            [$contact, 'index']);
$router->add('GET',  '/contacts/:id',        [$contact, 'show']);
$router->add('POST', '/contacts/:id/update', [$contact, 'update']);
$router->add('POST', '/contacts/:id/delete', [$contact, 'destroy']);

// ── Media ─────────────────────────────────────────────────────────────────────

$media = new MediaController($db);
$router->add('GET',  '/media',            [$media, 'index']);
$router->add('POST', '/media/upload',     [$media, 'upload']);
$router->add('POST', '/media/:id/delete', [$media, 'destroy']);

// ── Upload & Unsplash ─────────────────────────────────────────────────────────

$upload   = new UploadController($db);
$router->add('POST', '/upload', [$upload, 'upload']);

$unsplash = new UnsplashController($db);
$router->add('GET',  '/unsplash', [$unsplash, 'search']);
$router->add('POST', '/unsplash', [$unsplash, 'trackDownload']);

// ── Public API (no auth) ─────────────────────────────────────────────────────

$pub = new PublicController($db);
$router->add('GET',  '/public/settings',      [$pub, 'settings']);
$router->add('GET',  '/public/hero-slides',   [$pub, 'heroSlides']);
$router->add('GET',  '/public/menu',          [$pub, 'menu']);
$router->add('GET',  '/public/gallery',       [$pub, 'gallery']);
$router->add('GET',  '/public/testimonials',  [$pub, 'testimonials']);
$router->add('POST', '/public/contact',       [$pub, 'submitContact']);
$router->add('POST', '/public/reservation',   [$pub, 'submitReservation']);
$router->add('GET',  '/sitemap.xml',          [$pub, 'sitemap']);

return $router;
