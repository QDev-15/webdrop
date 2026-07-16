<?php
declare(strict_types=1);

// ── Core classes ──────────────────────────────────────────────────────────────
require_once __DIR__ . '/Response.php';
require_once __DIR__ . '/Router.php';
require_once __DIR__ . '/Auth.php';
require_once __DIR__ . '/Database.php';

// ── Boot ──────────────────────────────────────────────────────────────────────
Auth::start();
$db     = Database::getInstance();
$router = new Router();

// ── Helpers ───────────────────────────────────────────────────────────────────
function bodyJson(): array {
    $raw = file_get_contents('php://input');
    if (!$raw) return $_POST;
    $data = json_decode($raw, true);
    return is_array($data) ? $data : $_POST;
}

function slugify(string $text): string {
    $text = mb_strtolower(trim($text));
    $text = preg_replace('/[^\w\s-]/u', '', $text);
    $text = preg_replace('/[\s_-]+/', '-', $text);
    return trim($text, '-') ?: 'item';
}

// ── Controllers ───────────────────────────────────────────────────────────────
require_once __DIR__ . '/controllers/PublicController.php';
require_once __DIR__ . '/controllers/StatsController.php';
require_once __DIR__ . '/controllers/ServiceCategoryController.php';
require_once __DIR__ . '/controllers/ServiceController.php';
require_once __DIR__ . '/controllers/BookingController.php';
require_once __DIR__ . '/controllers/TeamController.php';
require_once __DIR__ . '/controllers/TestimonialController.php';
require_once __DIR__ . '/controllers/HeroSlideController.php';
require_once __DIR__ . '/controllers/ContactController.php';
require_once __DIR__ . '/controllers/MediaController.php';
require_once __DIR__ . '/controllers/SettingsController.php';
require_once __DIR__ . '/controllers/AuthController.php';
require_once __DIR__ . '/controllers/UploadController.php';
require_once __DIR__ . '/controllers/UnsplashController.php';
require_once __DIR__ . '/controllers/UserController.php';

// ── Instantiate ───────────────────────────────────────────────────────────────
$pub         = new PublicController($db);
$stats       = new StatsController($db);
$serviceCat  = new ServiceCategoryController($db);
$service     = new ServiceController($db);
$booking     = new BookingController($db);
$team        = new TeamController($db);
$testimonial = new TestimonialController($db);
$heroSlide   = new HeroSlideController($db);
$contact     = new ContactController($db);
$media       = new MediaController($db);
$settings    = new SettingsController($db);
$auth        = new AuthController($db);
$upload      = new UploadController($db);
$unsplash    = new UnsplashController($db);
$userCtrl    = new UserController($db);

// ── Auth routes ───────────────────────────────────────────────────────────────
$router->add('POST', '/auth/login',   [$auth, 'login']);
$router->add('POST', '/auth/logout',  [$auth, 'logout']);
$router->add('GET',  '/auth/me',      [$auth, 'me']);
$router->add('POST', '/auth/profile', [$auth, 'updateProfile']);

// ── Public routes (no auth) ───────────────────────────────────────────────────
$router->add('GET',  '/public/settings',           [$pub, 'settings']);
$router->add('GET',  '/public/hero-slides',        [$pub, 'heroSlides']);
$router->add('GET',  '/public/services',           [$pub, 'services']);
$router->add('GET',  '/public/service-categories', [$pub, 'serviceCategories']);
$router->add('GET',  '/public/team',               [$pub, 'team']);
$router->add('GET',  '/public/testimonials',       [$pub, 'testimonials']);
$router->add('POST', '/public/contact',            [$pub, 'submitContact']);
$router->add('POST', '/public/booking',            [$pub, 'submitBooking']);

// ── Admin — Service Categories ────────────────────────────────────────────────
$router->add('GET',  '/service-categories',            [$serviceCat, 'index']);
$router->add('POST', '/service-categories',            [$serviceCat, 'store']);
$router->add('POST', '/service-categories/:id/update', [$serviceCat, 'update']);
$router->add('POST', '/service-categories/:id/delete', [$serviceCat, 'destroy']);

// ── Admin — Services ──────────────────────────────────────────────────────────
$router->add('GET',  '/services',            [$service, 'index']);
$router->add('POST', '/services',            [$service, 'store']);
$router->add('GET',  '/services/:id',        [$service, 'show']);
$router->add('POST', '/services/:id/update', [$service, 'update']);
$router->add('POST', '/services/:id/delete', [$service, 'destroy']);

// ── Admin — Bookings ──────────────────────────────────────────────────────────
$router->add('GET',  '/bookings',            [$booking, 'index']);
$router->add('GET',  '/bookings/:id',        [$booking, 'show']);
$router->add('POST', '/bookings/:id/update', [$booking, 'update']);
$router->add('POST', '/bookings/:id/delete', [$booking, 'destroy']);

// ── Admin — Team Members ──────────────────────────────────────────────────────
$router->add('GET',  '/team',            [$team, 'index']);
$router->add('POST', '/team',            [$team, 'store']);
$router->add('GET',  '/team/:id',        [$team, 'show']);
$router->add('POST', '/team/:id/update', [$team, 'update']);
$router->add('POST', '/team/:id/delete', [$team, 'destroy']);

// ── Admin — Testimonials ──────────────────────────────────────────────────────
$router->add('GET',  '/testimonials',            [$testimonial, 'index']);
$router->add('POST', '/testimonials',            [$testimonial, 'store']);
$router->add('GET',  '/testimonials/:id',        [$testimonial, 'show']);
$router->add('POST', '/testimonials/:id/update', [$testimonial, 'update']);
$router->add('POST', '/testimonials/:id/delete', [$testimonial, 'destroy']);

// ── Admin — Hero Slides ───────────────────────────────────────────────────────
$router->add('GET',  '/hero-slides',            [$heroSlide, 'index']);
$router->add('POST', '/hero-slides',            [$heroSlide, 'store']);
$router->add('GET',  '/hero-slides/:id',        [$heroSlide, 'show']);
$router->add('POST', '/hero-slides/:id/update', [$heroSlide, 'update']);
$router->add('POST', '/hero-slides/:id/delete', [$heroSlide, 'destroy']);

// ── Admin — Contacts ──────────────────────────────────────────────────────────
$router->add('GET',  '/contacts',            [$contact, 'index']);
$router->add('GET',  '/contacts/:id',        [$contact, 'show']);
$router->add('POST', '/contacts/:id/update', [$contact, 'update']);
$router->add('POST', '/contacts/:id/delete', [$contact, 'destroy']);

// ── Admin — Settings ──────────────────────────────────────────────────────────
$router->add('GET',  '/settings',  [$settings, 'index']);
$router->add('POST', '/settings',  [$settings, 'update']);

// ── Admin — Media ─────────────────────────────────────────────────────────────
$router->add('GET',  '/media',            [$media, 'index']);
$router->add('POST', '/media/upload', [$media, 'upload']);
$router->add('POST', '/media/:id/delete', [$media, 'destroy']);

// ── Admin — Stats ─────────────────────────────────────────────────────────────
$router->add('GET',  '/stats', [$stats, 'index']);

// ── Admin — Users ─────────────────────────────────────────────────────────────
$router->add('GET',  '/users',                      [$userCtrl, 'index']);
$router->add('POST', '/users',                      [$userCtrl, 'store']);
$router->add('POST', '/users/:id/update',           [$userCtrl, 'update']);
$router->add('POST', '/users/:id/delete',           [$userCtrl, 'destroy']);
$router->add('POST', '/users/:id/change-password',  [$userCtrl, 'changePassword']);

// ── Upload & Unsplash ─────────────────────────────────────────────────────────
$router->add('POST', '/upload',   [$upload, 'handle']);
$router->add('GET',  '/unsplash', [$unsplash, 'search']);

return $router;
