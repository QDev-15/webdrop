<?php
declare(strict_types=1);

require_once __DIR__ . '/Auth.php';
require_once __DIR__ . '/Database.php';
require_once __DIR__ . '/Router.php';
require_once __DIR__ . '/Response.php';
require_once __DIR__ . '/controllers/AuthController.php';
require_once __DIR__ . '/controllers/PublicController.php';
require_once __DIR__ . '/controllers/SettingsController.php';
require_once __DIR__ . '/controllers/HeroSlideController.php';
require_once __DIR__ . '/controllers/ContactController.php';
require_once __DIR__ . '/controllers/MediaController.php';
require_once __DIR__ . '/controllers/StatsController.php';
require_once __DIR__ . '/controllers/MenuCategoryController.php';
require_once __DIR__ . '/controllers/MenuItemController.php';
require_once __DIR__ . '/controllers/ReservationController.php';
require_once __DIR__ . '/controllers/GalleryController.php';
require_once __DIR__ . '/controllers/TestimonialController.php';
require_once __DIR__ . '/controllers/UnsplashController.php';
require_once __DIR__ . '/controllers/UploadController.php';

// ─── Helpers ─────────────────────────────────────────────────────────────────

function bodyJson(): array {
    $raw = file_get_contents('php://input');
    if (!$raw) return [];
    $data = json_decode($raw, true);
    return is_array($data) ? $data : [];
}

function slugify(string $text): string {
    $text = mb_strtolower(trim($text), 'UTF-8');
    $map = [
        'á'=>'a','à'=>'a','ả'=>'a','ã'=>'a','ạ'=>'a',
        'ă'=>'a','ắ'=>'a','ằ'=>'a','ẳ'=>'a','ẵ'=>'a','ặ'=>'a',
        'â'=>'a','ấ'=>'a','ầ'=>'a','ẩ'=>'a','ẫ'=>'a','ậ'=>'a',
        'é'=>'e','è'=>'e','ẻ'=>'e','ẽ'=>'e','ẹ'=>'e',
        'ê'=>'e','ế'=>'e','ề'=>'e','ể'=>'e','ễ'=>'e','ệ'=>'e',
        'í'=>'i','ì'=>'i','ỉ'=>'i','ĩ'=>'i','ị'=>'i',
        'ó'=>'o','ò'=>'o','ỏ'=>'o','õ'=>'o','ọ'=>'o',
        'ô'=>'o','ố'=>'o','ồ'=>'o','ổ'=>'o','ỗ'=>'o','ộ'=>'o',
        'ơ'=>'o','ớ'=>'o','ờ'=>'o','ở'=>'o','ỡ'=>'o','ợ'=>'o',
        'ú'=>'u','ù'=>'u','ủ'=>'u','ũ'=>'u','ụ'=>'u',
        'ư'=>'u','ứ'=>'u','ừ'=>'u','ử'=>'u','ữ'=>'u','ự'=>'u',
        'ý'=>'y','ỳ'=>'y','ỷ'=>'y','ỹ'=>'y','ỵ'=>'y',
        'đ'=>'d',
    ];
    $text = strtr($text, $map);
    $text = preg_replace('/[^a-z0-9\s-]/', '', $text) ?? $text;
    $text = preg_replace('/[\s-]+/', '-', $text) ?? $text;
    return trim($text, '-');
}

// ─── Boot ────────────────────────────────────────────────────────────────────

// Auth::start() MUST come before Database::getInstance()
Auth::start();
$db = Database::getInstance();

$router = new Router();

// ─── Auth routes ─────────────────────────────────────────────────────────────
$auth = new AuthController($db);
$router->add('POST', '/auth/login',   [$auth, 'login']);
$router->add('POST', '/auth/logout',  [$auth, 'logout']);
$router->add('GET',  '/auth/me',      [$auth, 'me']);
$router->add('POST', '/auth/profile', [$auth, 'updateProfile']);

// ─── Stats ───────────────────────────────────────────────────────────────────
$stats = new StatsController($db);
$router->add('GET', '/stats', [$stats, 'index']);

// ─── Settings ────────────────────────────────────────────────────────────────
$settings = new SettingsController($db);
$router->add('GET',  '/settings',        [$settings, 'index']);
$router->add('POST', '/settings',        [$settings, 'upsert']);

// ─── Hero slides ─────────────────────────────────────────────────────────────
$slides = new HeroSlideController($db);
$router->add('GET',  '/hero-slides',              [$slides, 'index']);
$router->add('POST', '/hero-slides',              [$slides, 'store']);
$router->add('GET',  '/hero-slides/:id',          [$slides, 'show']);
$router->add('POST', '/hero-slides/:id/update',   [$slides, 'update']);
$router->add('POST', '/hero-slides/:id/delete',   [$slides, 'destroy']);

// ─── Contacts ────────────────────────────────────────────────────────────────
$contacts = new ContactController($db);
$router->add('GET',  '/contacts',              [$contacts, 'index']);
$router->add('POST', '/contacts/:id/update',   [$contacts, 'update']);
$router->add('POST', '/contacts/:id/delete',   [$contacts, 'destroy']);

// ─── Media ───────────────────────────────────────────────────────────────────
$media = new MediaController($db);
$router->add('GET',  '/media',           [$media, 'index']);
$router->add('POST', '/media/upload', [$media, 'upload']);
$router->add('POST', '/media/:id/delete',[$media, 'destroy']);

// ─── Upload ──────────────────────────────────────────────────────────────────
$upload = new UploadController($db);
$router->add('POST', '/upload', [$upload, 'handle']);

// ─── Unsplash ────────────────────────────────────────────────────────────────
$unsplash = new UnsplashController($db);
$router->add('GET', '/unsplash', [$unsplash, 'search']);

// ─── Menu Categories ─────────────────────────────────────────────────────────
$menuCat = new MenuCategoryController($db);
$router->add('GET',  '/menu-categories',              [$menuCat, 'index']);
$router->add('POST', '/menu-categories',              [$menuCat, 'store']);
$router->add('GET',  '/menu-categories/:id',          [$menuCat, 'show']);
$router->add('POST', '/menu-categories/:id/update',   [$menuCat, 'update']);
$router->add('POST', '/menu-categories/:id/delete',   [$menuCat, 'destroy']);

// ─── Menu Items ──────────────────────────────────────────────────────────────
$menuItem = new MenuItemController($db);
$router->add('GET',  '/menu-items',              [$menuItem, 'index']);
$router->add('POST', '/menu-items',              [$menuItem, 'store']);
$router->add('GET',  '/menu-items/:id',          [$menuItem, 'show']);
$router->add('POST', '/menu-items/:id/update',   [$menuItem, 'update']);
$router->add('POST', '/menu-items/:id/delete',   [$menuItem, 'destroy']);

// ─── Reservations ────────────────────────────────────────────────────────────
$reservation = new ReservationController($db);
$router->add('GET',  '/reservations',              [$reservation, 'index']);
$router->add('POST', '/reservations/:id/update',   [$reservation, 'update']);
$router->add('POST', '/reservations/:id/delete',   [$reservation, 'destroy']);

// ─── Gallery ─────────────────────────────────────────────────────────────────
$gallery = new GalleryController($db);
$router->add('GET',  '/gallery',              [$gallery, 'index']);
$router->add('POST', '/gallery',              [$gallery, 'store']);
$router->add('POST', '/gallery/:id/update',   [$gallery, 'update']);
$router->add('POST', '/gallery/:id/delete',   [$gallery, 'destroy']);

// ─── Testimonials ────────────────────────────────────────────────────────────
$testimonial = new TestimonialController($db);
$router->add('GET',  '/testimonials',              [$testimonial, 'index']);
$router->add('POST', '/testimonials',              [$testimonial, 'store']);
$router->add('GET',  '/testimonials/:id',          [$testimonial, 'show']);
$router->add('POST', '/testimonials/:id/update',   [$testimonial, 'update']);
$router->add('POST', '/testimonials/:id/delete',   [$testimonial, 'destroy']);

// ─── Public endpoints (no auth) ──────────────────────────────────────────────
$pub = new PublicController($db);
$router->add('GET',  '/public/settings',      [$pub, 'settings']);
$router->add('GET',  '/public/hero-slides',   [$pub, 'heroSlides']);
$router->add('GET',  '/public/menu-categories', [$pub, 'menuCategories']);
$router->add('GET',  '/public/menu-items',    [$pub, 'menuItems']);
$router->add('GET',  '/public/gallery',       [$pub, 'gallery']);
$router->add('GET',  '/public/testimonials',  [$pub, 'testimonials']);
$router->add('POST', '/public/contact',       [$pub, 'submitContact']);
$router->add('POST', '/public/reservation',   [$pub, 'submitReservation']);

return $router;
