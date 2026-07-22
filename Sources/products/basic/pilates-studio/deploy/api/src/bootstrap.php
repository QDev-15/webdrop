<?php
declare(strict_types=1);

// ── Helpers ────────────────────────────────────────────────────────────────
function bodyJson(): array {
    $raw = file_get_contents('php://input');
    if (!$raw) return [];
    $data = json_decode($raw, true);
    return is_array($data) ? $data : [];
}

function slugify(string $text): string {
    $text = mb_strtolower($text, 'UTF-8');
    $text = preg_replace('/\s+/', '-', trim($text));
    $text = preg_replace('/[^a-z0-9\-]/', '', $text);
    $text = preg_replace('/-+/', '-', $text);
    return trim($text, '-');
}

// ── Core classes (must load BEFORE Auth::start()) ──────────────────────────
require_once __DIR__ . '/Router.php';
require_once __DIR__ . '/Response.php';
require_once __DIR__ . '/Database.php';
require_once __DIR__ . '/Auth.php';

// ── Session ────────────────────────────────────────────────────────────────
Auth::start();

// ── DB init ────────────────────────────────────────────────────────────────
$db = Database::getInstance();

// ── Controllers ────────────────────────────────────────────────────────────
require_once __DIR__ . '/controllers/AuthController.php';
require_once __DIR__ . '/controllers/PublicController.php';
require_once __DIR__ . '/controllers/StatsController.php';
require_once __DIR__ . '/controllers/HeroSlideController.php';
require_once __DIR__ . '/controllers/ContactController.php';
require_once __DIR__ . '/controllers/SettingsController.php';
require_once __DIR__ . '/controllers/UserController.php';
require_once __DIR__ . '/controllers/MediaController.php';
require_once __DIR__ . '/controllers/UploadController.php';
require_once __DIR__ . '/controllers/UnsplashController.php';
require_once __DIR__ . '/controllers/ServiceCategoryController.php';
require_once __DIR__ . '/controllers/ServiceController.php';
require_once __DIR__ . '/controllers/BookingController.php';
require_once __DIR__ . '/controllers/TestimonialController.php';
require_once __DIR__ . '/controllers/TeamController.php';

$router = new Router();

// ── Controller instances ───────────────────────────────────────────────────
$auth    = new AuthController($db);
$pub     = new PublicController($db);
$stats   = new StatsController($db);
$slides  = new HeroSlideController($db);
$contact = new ContactController($db);
$settings = new SettingsController($db);
$users   = new UserController($db);
$media   = new MediaController($db);
$upload  = new UploadController($db);
$unsplash = new UnsplashController($db);
$svcCat  = new ServiceCategoryController($db);
$svc     = new ServiceController($db);
$booking = new BookingController($db);
$testi   = new TestimonialController($db);
$team    = new TeamController($db);

// ── Auth ───────────────────────────────────────────────────────────────────
$router->add('GET',  '/auth/me',              [$auth, 'me']);
$router->add('POST', '/auth/login',           [$auth, 'login']);
$router->add('POST', '/auth/logout',          [$auth, 'logout']);
$router->add('POST', '/auth/change-password', [$auth, 'changePassword']);

// ── Public endpoints (no auth) ─────────────────────────────────────────────
$router->add('GET', '/public/settings',     [$pub, 'settings']);
$router->add('GET', '/public/hero-slides',  [$pub, 'heroSlides']);
$router->add('GET', '/public/services',     [$pub, 'services']);
$router->add('GET', '/public/testimonials', [$pub, 'testimonials']);
$router->add('GET', '/public/team',         [$pub, 'team']);
$router->add('GET', '/sitemap.xml',         [$pub, 'sitemap']);

// ── Stats ───────────────────────────────────────────────────────────────────
$router->add('GET', '/stats', [$stats, 'index']);

// ── Hero Slides ────────────────────────────────────────────────────────────
$router->add('GET',  '/hero-slides',                   [$slides, 'index']);
$router->add('POST', '/hero-slides',                   [$slides, 'store']);
$router->add('GET',  '/hero-slides/:id',               [$slides, 'show']);
$router->add('POST', '/hero-slides/:id/update',        [$slides, 'update']);
$router->add('POST', '/hero-slides/:id/delete',        [$slides, 'destroy']);

// ── Contacts ───────────────────────────────────────────────────────────────
$router->add('GET',  '/contacts',                      [$contact, 'index']);
$router->add('POST', '/contacts',                      [$contact, 'store']);
$router->add('GET',  '/contacts/:id',                  [$contact, 'show']);
$router->add('POST', '/contacts/:id/update',           [$contact, 'update']);
$router->add('POST', '/contacts/:id/delete',           [$contact, 'destroy']);

// ── Settings ───────────────────────────────────────────────────────────────
$router->add('GET',  '/settings',                      [$settings, 'index']);
$router->add('POST', '/settings',                      [$settings, 'update']);

// ── Users ──────────────────────────────────────────────────────────────────
$router->add('GET',  '/users',                         [$users, 'index']);
$router->add('POST', '/users',                         [$users, 'store']);
$router->add('GET',  '/users/:id',                     [$users, 'show']);
$router->add('POST', '/users/:id/update',              [$users, 'update']);
$router->add('POST', '/users/:id/delete',              [$users, 'destroy']);

// ── Media ──────────────────────────────────────────────────────────────────
$router->add('GET',  '/media',                         [$media, 'index']);
$router->add('POST', '/media/upload', [$media, 'upload']);
$router->add('POST', '/media/:id/delete',              [$media, 'destroy']);

// ── Upload / Unsplash ──────────────────────────────────────────────────────
$router->add('POST', '/upload',                        [$upload, 'upload']);
$router->add('GET',  '/unsplash',                      [$unsplash, 'search']);

// ── Service Categories ─────────────────────────────────────────────────────
$router->add('GET',  '/service-categories',            [$svcCat, 'index']);
$router->add('POST', '/service-categories',            [$svcCat, 'store']);
$router->add('GET',  '/service-categories/:id',        [$svcCat, 'show']);
$router->add('POST', '/service-categories/:id/update', [$svcCat, 'update']);
$router->add('POST', '/service-categories/:id/delete', [$svcCat, 'destroy']);

// ── Services ───────────────────────────────────────────────────────────────
$router->add('GET',  '/services',                      [$svc, 'index']);
$router->add('POST', '/services',                      [$svc, 'store']);
$router->add('GET',  '/services/:id',                  [$svc, 'show']);
$router->add('POST', '/services/:id/update',           [$svc, 'update']);
$router->add('POST', '/services/:id/delete',           [$svc, 'destroy']);

// ── Bookings ───────────────────────────────────────────────────────────────
$router->add('GET',  '/bookings',                      [$booking, 'index']);
$router->add('POST', '/bookings',                      [$booking, 'store']);
$router->add('GET',  '/bookings/:id',                  [$booking, 'show']);
$router->add('POST', '/bookings/:id/update',           [$booking, 'update']);
$router->add('POST', '/bookings/:id/delete',           [$booking, 'destroy']);

// ── Testimonials ───────────────────────────────────────────────────────────
$router->add('GET',  '/testimonials',                  [$testi, 'index']);
$router->add('POST', '/testimonials',                  [$testi, 'store']);
$router->add('GET',  '/testimonials/:id',              [$testi, 'show']);
$router->add('POST', '/testimonials/:id/update',       [$testi, 'update']);
$router->add('POST', '/testimonials/:id/delete',       [$testi, 'destroy']);

// ── Team ───────────────────────────────────────────────────────────────────
$router->add('GET',  '/team',                          [$team, 'index']);
$router->add('POST', '/team',                          [$team, 'store']);
$router->add('GET',  '/team/:id',                      [$team, 'show']);
$router->add('POST', '/team/:id/update',               [$team, 'update']);
$router->add('POST', '/team/:id/delete',               [$team, 'destroy']);

return $router;
