<?php
declare(strict_types=1);

// ─── Core classes ────────────────────────────────────────────────────────────
require_once __DIR__ . '/Response.php';
require_once __DIR__ . '/Router.php';
require_once __DIR__ . '/Auth.php';
require_once __DIR__ . '/Database.php';

// ─── Boot ────────────────────────────────────────────────────────────────────
Auth::start();
$db     = Database::getInstance();
$router = new Router();

// ─── Helpers ─────────────────────────────────────────────────────────────────
function bodyJson(): array
{
    $raw = file_get_contents('php://input');
    if (!$raw) return $_POST;
    $data = json_decode($raw, true);
    return is_array($data) ? $data : $_POST;
}

function slugify(string $text): string
{
    $text = mb_strtolower($text, 'UTF-8');
    $map  = ['à'=>'a','á'=>'a','ả'=>'a','ã'=>'a','ạ'=>'a','ă'=>'a','ắ'=>'a','ặ'=>'a','ằ'=>'a','ẳ'=>'a','ẵ'=>'a','â'=>'a','ấ'=>'a','ậ'=>'a','ầ'=>'a','ẩ'=>'a','ẫ'=>'a','đ'=>'d','è'=>'e','é'=>'e','ẻ'=>'e','ẽ'=>'e','ẹ'=>'e','ê'=>'e','ế'=>'e','ệ'=>'e','ề'=>'e','ể'=>'e','ễ'=>'e','ì'=>'i','í'=>'i','ỉ'=>'i','ĩ'=>'i','ị'=>'i','ò'=>'o','ó'=>'o','ỏ'=>'o','õ'=>'o','ọ'=>'o','ô'=>'o','ố'=>'o','ộ'=>'o','ồ'=>'o','ổ'=>'o','ỗ'=>'o','ơ'=>'o','ớ'=>'o','ợ'=>'o','ờ'=>'o','ở'=>'o','ỡ'=>'o','ù'=>'u','ú'=>'u','ủ'=>'u','ũ'=>'u','ụ'=>'u','ư'=>'u','ứ'=>'u','ự'=>'u','ừ'=>'u','ử'=>'u','ữ'=>'u','ỳ'=>'y','ý'=>'y','ỷ'=>'y','ỹ'=>'y','ỵ'=>'y'];
    $text = strtr($text, $map);
    $text = preg_replace('/[^a-z0-9\s-]/', '', $text) ?? '';
    $text = preg_replace('/[\s-]+/', '-', trim($text)) ?? '';
    return trim($text, '-');
}

// ─── Require controllers ─────────────────────────────────────────────────────
require_once __DIR__ . '/controllers/AuthController.php';
require_once __DIR__ . '/controllers/SettingsController.php';
require_once __DIR__ . '/controllers/HeroSlideController.php';
require_once __DIR__ . '/controllers/ContactController.php';
require_once __DIR__ . '/controllers/UserController.php';
require_once __DIR__ . '/controllers/MediaController.php';
require_once __DIR__ . '/controllers/UploadController.php';
require_once __DIR__ . '/controllers/UnsplashController.php';
require_once __DIR__ . '/controllers/StatsController.php';
require_once __DIR__ . '/controllers/PublicController.php';
require_once __DIR__ . '/controllers/ServiceCategoryController.php';
require_once __DIR__ . '/controllers/ServiceController.php';
require_once __DIR__ . '/controllers/BookingController.php';
require_once __DIR__ . '/controllers/TestimonialController.php';
require_once __DIR__ . '/controllers/TeamController.php';

// ─── Controllers ─────────────────────────────────────────────────────────────
$auth        = new AuthController($db);
$settings    = new SettingsController($db);
$slides      = new HeroSlideController($db);
$contacts    = new ContactController($db);
$users       = new UserController($db);
$media       = new MediaController($db);
$upload      = new UploadController($db);
$unsplash    = new UnsplashController($db);
$stats       = new StatsController($db);
$pub         = new PublicController($db);
$svcCat      = new ServiceCategoryController($db);
$svc         = new ServiceController($db);
$booking     = new BookingController($db);
$testimonial = new TestimonialController($db);
$team        = new TeamController($db);

// ─── Auth ────────────────────────────────────────────────────────────────────
$router->add('POST', '/auth/login',   [$auth, 'login']);
$router->add('POST', '/auth/logout',  [$auth, 'logout']);
$router->add('GET',  '/auth/me',      [$auth, 'me']);
$router->add('POST', '/auth/profile', [$auth, 'updateProfile']);

// ─── Public endpoints (no auth) ──────────────────────────────────────────────
$router->add('GET',  '/public/settings',         [$pub, 'settings']);
$router->add('GET',  '/public/hero-slides',      [$pub, 'heroSlides']);
$router->add('GET',  '/public/services',         [$pub, 'services']);
$router->add('GET',  '/public/service-categories', [$pub, 'serviceCategories']);
$router->add('GET',  '/public/testimonials',     [$pub, 'testimonials']);
$router->add('GET',  '/public/team',             [$pub, 'team']);
$router->add('POST', '/public/contacts',         [$pub, 'submitContact']);
$router->add('POST', '/public/bookings',         [$pub, 'submitBooking']);
$router->add('GET',  '/sitemap.xml',             [$pub, 'sitemap']);

// ─── Settings ────────────────────────────────────────────────────────────────
$router->add('GET',  '/settings',        [$settings, 'index']);
$router->add('POST', '/settings',        [$settings, 'update']);

// ─── Hero Slides ─────────────────────────────────────────────────────────────
$router->add('GET',  '/slides',              [$slides, 'index']);
$router->add('POST', '/slides',              [$slides, 'store']);
$router->add('POST', '/slides/:id/update',   [$slides, 'update']);
$router->add('POST', '/slides/:id/delete',   [$slides, 'destroy']);

// ─── Contacts ────────────────────────────────────────────────────────────────
$router->add('GET',  '/contacts',             [$contacts, 'index']);
$router->add('POST', '/contacts/:id/update',  [$contacts, 'update']);
$router->add('POST', '/contacts/:id/delete',  [$contacts, 'destroy']);

// ─── Users ───────────────────────────────────────────────────────────────────
$router->add('GET',  '/users',             [$users, 'index']);
$router->add('POST', '/users',             [$users, 'store']);
$router->add('POST', '/users/:id/update',  [$users, 'update']);
$router->add('POST', '/users/:id/delete',  [$users, 'destroy']);

// ─── Media ───────────────────────────────────────────────────────────────────
$router->add('GET',  '/media',             [$media, 'index']);
$router->add('POST', '/media/upload', [$media, 'upload']);
$router->add('POST', '/media/:id/delete',  [$media, 'destroy']);

// ─── Upload / Unsplash ───────────────────────────────────────────────────────
$router->add('POST', '/upload',            [$upload, 'store']);
$router->add('GET',  '/unsplash',          [$unsplash, 'search']);

// ─── Stats ───────────────────────────────────────────────────────────────────
$router->add('GET',  '/stats',             [$stats, 'index']);

// ─── Service Categories ──────────────────────────────────────────────────────
$router->add('GET',  '/service-categories',             [$svcCat, 'index']);
$router->add('POST', '/service-categories',             [$svcCat, 'store']);
$router->add('POST', '/service-categories/:id/update',  [$svcCat, 'update']);
$router->add('POST', '/service-categories/:id/delete',  [$svcCat, 'destroy']);

// ─── Services ────────────────────────────────────────────────────────────────
$router->add('GET',  '/services',             [$svc, 'index']);
$router->add('POST', '/services',             [$svc, 'store']);
$router->add('POST', '/services/:id/update',  [$svc, 'update']);
$router->add('POST', '/services/:id/delete',  [$svc, 'destroy']);

// ─── Bookings ────────────────────────────────────────────────────────────────
$router->add('GET',  '/bookings',             [$booking, 'index']);
$router->add('POST', '/bookings/:id/update',  [$booking, 'update']);
$router->add('POST', '/bookings/:id/delete',  [$booking, 'destroy']);

// ─── Testimonials ────────────────────────────────────────────────────────────
$router->add('GET',  '/testimonials',             [$testimonial, 'index']);
$router->add('POST', '/testimonials',             [$testimonial, 'store']);
$router->add('POST', '/testimonials/:id/update',  [$testimonial, 'update']);
$router->add('POST', '/testimonials/:id/delete',  [$testimonial, 'destroy']);

// ─── Team Members ────────────────────────────────────────────────────────────
$router->add('GET',  '/team',             [$team, 'index']);
$router->add('POST', '/team',             [$team, 'store']);
$router->add('POST', '/team/:id/update',  [$team, 'update']);
$router->add('POST', '/team/:id/delete',  [$team, 'destroy']);

return $router;
