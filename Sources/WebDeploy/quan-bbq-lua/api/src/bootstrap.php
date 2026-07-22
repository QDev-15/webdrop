<?php
declare(strict_types=1);

// --- Autoload core classes ---
require_once __DIR__ . '/Database.php';
require_once __DIR__ . '/Router.php';
require_once __DIR__ . '/Auth.php';
require_once __DIR__ . '/Response.php';
require_once __DIR__ . '/controllers/AuthController.php';
require_once __DIR__ . '/controllers/UserController.php';
require_once __DIR__ . '/controllers/SettingsController.php';
require_once __DIR__ . '/controllers/HeroSlideController.php';
require_once __DIR__ . '/controllers/MenuCategoryController.php';
require_once __DIR__ . '/controllers/MenuItemController.php';
require_once __DIR__ . '/controllers/ReservationController.php';
require_once __DIR__ . '/controllers/GalleryController.php';
require_once __DIR__ . '/controllers/TestimonialController.php';
require_once __DIR__ . '/controllers/ContactController.php';
require_once __DIR__ . '/controllers/MediaController.php';
require_once __DIR__ . '/controllers/UploadController.php';
require_once __DIR__ . '/controllers/UnsplashController.php';
require_once __DIR__ . '/controllers/StatsController.php';
require_once __DIR__ . '/controllers/PublicController.php';

// --- Helpers ---
function bodyJson(): array {
    $raw = file_get_contents('php://input');
    if (!$raw) return [];
    $data = json_decode($raw, true);
    return is_array($data) ? $data : [];
}

function slugify(string $text): string {
    $text = mb_strtolower(trim($text), 'UTF-8');
    $map = [
        'a'=>['à','á','ả','ã','ạ','ă','ắ','ặ','ằ','ẳ','ẵ','â','ấ','ầ','ẩ','ẫ','ậ'],
        'd'=>['đ'],
        'e'=>['è','é','ẹ','ẻ','ẽ','ê','ế','ề','ệ','ể','ễ'],
        'i'=>['ì','í','ị','ỉ','ĩ'],
        'o'=>['ò','ó','ọ','ỏ','õ','ô','ố','ồ','ộ','ổ','ỗ','ơ','ớ','ờ','ợ','ở','ỡ'],
        'u'=>['ù','ú','ụ','ủ','ũ','ư','ứ','ừ','ự','ử','ữ'],
        'y'=>['ỳ','ý','ỵ','ỷ','ỹ'],
    ];
    foreach ($map as $latin => $accents) {
        $text = str_replace($accents, $latin, $text);
    }
    $text = preg_replace('/[^a-z0-9\s-]/', '', $text);
    $text = preg_replace('/[\s-]+/', '-', trim($text));
    return trim($text, '-');
}

// Auth must start before DB
Auth::start();

$db = Database::getInstance();
$router = new Router();

// Instantiate controllers
$auth       = new AuthController($db);
$user       = new UserController($db);
$settings   = new SettingsController($db);
$heroSlide  = new HeroSlideController($db);
$menuCat    = new MenuCategoryController($db);
$menuItem   = new MenuItemController($db);
$reservation = new ReservationController($db);
$gallery    = new GalleryController($db);
$testimonial = new TestimonialController($db);
$contact    = new ContactController($db);
$media      = new MediaController($db);
$upload     = new UploadController($db);
$unsplash   = new UnsplashController($db);
$stats      = new StatsController($db);
$pub        = new PublicController($db);

// --- Auth routes ---
$router->add('POST', '/auth/login',   [$auth, 'login']);
$router->add('POST', '/auth/logout',  [$auth, 'logout']);
$router->add('GET',  '/auth/me',      [$auth, 'me']);
$router->add('POST', '/auth/change-password', [$auth, 'changePassword']);

// --- User routes ---
$router->add('GET',  '/users',                [$user, 'index']);
$router->add('POST', '/users',                [$user, 'store']);
$router->add('POST', '/users/:id/update',     [$user, 'update']);
$router->add('POST', '/users/:id/delete',     [$user, 'destroy']);

// --- Settings routes ---
$router->add('GET',  '/settings',             [$settings, 'index']);
$router->add('POST', '/settings',             [$settings, 'update']);

// --- Hero Slides routes ---
$router->add('GET',  '/hero-slides',                [$heroSlide, 'index']);
$router->add('GET',  '/hero-slides/:id',            [$heroSlide, 'show']);
$router->add('POST', '/hero-slides',                [$heroSlide, 'store']);
$router->add('POST', '/hero-slides/:id/update',     [$heroSlide, 'update']);
$router->add('POST', '/hero-slides/:id/delete',     [$heroSlide, 'destroy']);

// --- Menu Categories routes ---
$router->add('GET',  '/menu-categories',              [$menuCat, 'index']);
$router->add('GET',  '/menu-categories/:id',          [$menuCat, 'show']);
$router->add('POST', '/menu-categories',              [$menuCat, 'store']);
$router->add('POST', '/menu-categories/:id/update',   [$menuCat, 'update']);
$router->add('POST', '/menu-categories/:id/delete',   [$menuCat, 'destroy']);

// --- Menu Items routes ---
$router->add('GET',  '/menu-items',                   [$menuItem, 'index']);
$router->add('GET',  '/menu-items/:id',               [$menuItem, 'show']);
$router->add('POST', '/menu-items',                   [$menuItem, 'store']);
$router->add('POST', '/menu-items/:id/update',        [$menuItem, 'update']);
$router->add('POST', '/menu-items/:id/delete',        [$menuItem, 'destroy']);

// --- Reservations routes ---
$router->add('GET',  '/reservations',                 [$reservation, 'index']);
$router->add('GET',  '/reservations/:id',             [$reservation, 'show']);
$router->add('POST', '/reservations',                 [$reservation, 'store']);
$router->add('POST', '/reservations/:id/update',      [$reservation, 'update']);
$router->add('POST', '/reservations/:id/delete',      [$reservation, 'destroy']);

// --- Gallery routes ---
$router->add('GET',  '/gallery',                      [$gallery, 'index']);
$router->add('GET',  '/gallery/:id',                  [$gallery, 'show']);
$router->add('POST', '/gallery',                      [$gallery, 'store']);
$router->add('POST', '/gallery/:id/update',           [$gallery, 'update']);
$router->add('POST', '/gallery/:id/delete',           [$gallery, 'destroy']);

// --- Testimonials routes ---
$router->add('GET',  '/testimonials',                 [$testimonial, 'index']);
$router->add('GET',  '/testimonials/:id',             [$testimonial, 'show']);
$router->add('POST', '/testimonials',                 [$testimonial, 'store']);
$router->add('POST', '/testimonials/:id/update',      [$testimonial, 'update']);
$router->add('POST', '/testimonials/:id/delete',      [$testimonial, 'destroy']);

// --- Contacts routes ---
$router->add('GET',  '/contacts',                     [$contact, 'index']);
$router->add('GET',  '/contacts/:id',                 [$contact, 'show']);
$router->add('POST', '/contacts/:id/update',          [$contact, 'update']);
$router->add('POST', '/contacts/:id/delete',          [$contact, 'destroy']);

// --- Media routes ---
$router->add('GET',  '/media',                        [$media, 'index']);
$router->add('POST', '/media/upload', [$media, 'upload']);
$router->add('POST', '/media/:id/delete',             [$media, 'destroy']);

// --- Upload & Unsplash ---
$router->add('POST', '/upload',                       [$upload, 'store']);
$router->add('GET',  '/unsplash',                     [$unsplash, 'search']);

// --- Stats ---
$router->add('GET',  '/stats',                        [$stats, 'index']);

// --- Public routes (no auth) ---
$router->add('GET',  '/public/settings',              [$pub, 'settings']);
$router->add('GET',  '/public/hero-slides',           [$pub, 'heroSlides']);
$router->add('GET',  '/public/menu-categories',       [$pub, 'menuCategories']);
$router->add('GET',  '/public/menu-items',            [$pub, 'menuItems']);
$router->add('GET',  '/public/gallery',               [$pub, 'gallery']);
$router->add('GET',  '/public/testimonials',          [$pub, 'testimonials']);
$router->add('POST', '/public/contact',               [$pub, 'submitContact']);
$router->add('POST', '/public/reservation',           [$pub, 'submitReservation']);
$router->add('GET',  '/sitemap.xml',                  [$pub, 'sitemap']);

return $router;
