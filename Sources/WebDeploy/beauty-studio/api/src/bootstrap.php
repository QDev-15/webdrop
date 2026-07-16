<?php
declare(strict_types=1);

// ─── Helpers ─────────────────────────────────────────────────────────────────

function bodyJson(): array {
    $raw = file_get_contents('php://input');
    if (!$raw) return [];
    $data = json_decode($raw, true);
    return is_array($data) ? $data : [];
}

function slugify(string $text): string {
    $text = mb_strtolower(trim($text), 'UTF-8');
    $text = preg_replace('/[àáạảãâầấậẩẫăằắặẳẵ]/u', 'a', $text);
    $text = preg_replace('/[èéẹẻẽêềếệểễ]/u', 'e', $text);
    $text = preg_replace('/[ìíịỉĩ]/u', 'i', $text);
    $text = preg_replace('/[òóọỏõôồốộổỗơờớợởỡ]/u', 'o', $text);
    $text = preg_replace('/[ùúụủũưừứựửữ]/u', 'u', $text);
    $text = preg_replace('/[ỳýỵỷỹ]/u', 'y', $text);
    $text = preg_replace('/[đ]/u', 'd', $text);
    $text = preg_replace('/[^a-z0-9\s-]/u', '', $text);
    $text = preg_replace('/[\s-]+/', '-', $text);
    return trim($text, '-') ?: 'slug';
}

// ─── Core classes ─────────────────────────────────────────────────────────────

require_once __DIR__ . '/Response.php';
require_once __DIR__ . '/Router.php';
require_once __DIR__ . '/Auth.php';
require_once __DIR__ . '/Database.php';

// ─── Boot ─────────────────────────────────────────────────────────────────────

Auth::start();
$db     = Database::getInstance();
$router = new Router();

// ─── Autoload controllers ─────────────────────────────────────────────────────

require_once __DIR__ . '/controllers/PublicController.php';
require_once __DIR__ . '/controllers/StatsController.php';
require_once __DIR__ . '/controllers/ServiceCategoryController.php';
require_once __DIR__ . '/controllers/ServiceController.php';
require_once __DIR__ . '/controllers/BookingController.php';
require_once __DIR__ . '/controllers/TestimonialController.php';
require_once __DIR__ . '/controllers/TeamController.php';
require_once __DIR__ . '/controllers/UploadController.php';
require_once __DIR__ . '/controllers/UnsplashController.php';
require_once __DIR__ . '/controllers/HeroSlideController.php';
require_once __DIR__ . '/controllers/ContactController.php';
require_once __DIR__ . '/controllers/SettingsController.php';
require_once __DIR__ . '/controllers/AuthController.php';
require_once __DIR__ . '/controllers/MediaController.php';
require_once __DIR__ . '/controllers/ProfileController.php';

// ─── Instantiate ─────────────────────────────────────────────────────────────

$pub         = new PublicController($db);
$stats       = new StatsController($db);
$svcCat      = new ServiceCategoryController($db);
$svc         = new ServiceController($db);
$booking     = new BookingController($db);
$testimonial = new TestimonialController($db);
$team        = new TeamController($db);
$upload      = new UploadController($db);
$unsplash    = new UnsplashController($db);
$slide       = new HeroSlideController($db);
$contact     = new ContactController($db);
$settings    = new SettingsController($db);
$auth        = new AuthController($db);
$media       = new MediaController($db);
$profile     = new ProfileController($db);

// ─── Public routes (no auth) ──────────────────────────────────────────────────

$router->add('GET',  '/public/settings',           [$pub, 'settings']);
$router->add('GET',  '/public/hero-slides',        [$pub, 'heroSlides']);
$router->add('GET',  '/public/service-categories', [$pub, 'serviceCategories']);
$router->add('GET',  '/public/services',           [$pub, 'services']);
$router->add('GET',  '/public/team',               [$pub, 'team']);
$router->add('GET',  '/public/testimonials',       [$pub, 'testimonials']);
$router->add('GET',  '/public/gallery',            [$pub, 'gallery']);
$router->add('GET',  '/public/promo-combos',       [$pub, 'promoCombos']);
$router->add('POST', '/public/contact',            [$pub, 'submitContact']);
$router->add('POST', '/public/booking',            [$pub, 'submitBooking']);

// ─── Auth routes ──────────────────────────────────────────────────────────────

$router->add('POST', '/auth/login',   [$auth, 'login']);
$router->add('POST', '/auth/logout',  [$auth, 'logout']);
$router->add('GET',  '/auth/me',      [$auth, 'me']);

// ─── Profile ─────────────────────────────────────────────────────────────────

$router->add('POST', '/profile/update',          [$profile, 'update']);
$router->add('POST', '/profile/change-password', [$profile, 'changePassword']);

// ─── Stats ───────────────────────────────────────────────────────────────────

$router->add('GET', '/stats', [$stats, 'index']);

// ─── Hero Slides ─────────────────────────────────────────────────────────────

$router->add('GET',  '/hero-slides',              [$slide, 'index']);
$router->add('POST', '/hero-slides',              [$slide, 'store']);
$router->add('GET',  '/hero-slides/:id',          [$slide, 'show']);
$router->add('POST', '/hero-slides/:id/update',   [$slide, 'update']);
$router->add('POST', '/hero-slides/:id/delete',   [$slide, 'destroy']);

// ─── Service Categories ───────────────────────────────────────────────────────

$router->add('GET',  '/service-categories',            [$svcCat, 'index']);
$router->add('POST', '/service-categories',            [$svcCat, 'store']);
$router->add('GET',  '/service-categories/:id',        [$svcCat, 'show']);
$router->add('POST', '/service-categories/:id/update', [$svcCat, 'update']);
$router->add('POST', '/service-categories/:id/delete', [$svcCat, 'destroy']);

// ─── Services ─────────────────────────────────────────────────────────────────

$router->add('GET',  '/services',            [$svc, 'index']);
$router->add('POST', '/services',            [$svc, 'store']);
$router->add('GET',  '/services/:id',        [$svc, 'show']);
$router->add('POST', '/services/:id/update', [$svc, 'update']);
$router->add('POST', '/services/:id/delete', [$svc, 'destroy']);

// ─── Bookings ────────────────────────────────────────────────────────────────

$router->add('GET',  '/bookings',            [$booking, 'index']);
$router->add('GET',  '/bookings/:id',        [$booking, 'show']);
$router->add('POST', '/bookings/:id/update', [$booking, 'update']);
$router->add('POST', '/bookings/:id/delete', [$booking, 'destroy']);

// ─── Testimonials ─────────────────────────────────────────────────────────────

$router->add('GET',  '/testimonials',            [$testimonial, 'index']);
$router->add('POST', '/testimonials',            [$testimonial, 'store']);
$router->add('GET',  '/testimonials/:id',        [$testimonial, 'show']);
$router->add('POST', '/testimonials/:id/update', [$testimonial, 'update']);
$router->add('POST', '/testimonials/:id/delete', [$testimonial, 'destroy']);

// ─── Team Members ────────────────────────────────────────────────────────────

$router->add('GET',  '/team',            [$team, 'index']);
$router->add('POST', '/team',            [$team, 'store']);
$router->add('GET',  '/team/:id',        [$team, 'show']);
$router->add('POST', '/team/:id/update', [$team, 'update']);
$router->add('POST', '/team/:id/delete', [$team, 'destroy']);

// ─── Contacts ────────────────────────────────────────────────────────────────

$router->add('GET',  '/contacts',            [$contact, 'index']);
$router->add('GET',  '/contacts/:id',        [$contact, 'show']);
$router->add('POST', '/contacts/:id/update', [$contact, 'update']);
$router->add('POST', '/contacts/:id/delete', [$contact, 'destroy']);

// ─── Settings ────────────────────────────────────────────────────────────────

$router->add('GET',  '/settings',        [$settings, 'index']);
$router->add('POST', '/settings/update', [$settings, 'update']);

// ─── Upload & Unsplash ───────────────────────────────────────────────────────

$router->add('POST', '/upload',   [$upload, 'upload']);
$router->add('GET',  '/unsplash', [$unsplash, 'search']);

// ─── Media ───────────────────────────────────────────────────────────────────

$router->add('GET',  '/media',          [$media, 'index']);
$router->add('POST', '/media/upload', [$media, 'upload']);
$router->add('POST', '/media/:id/delete', [$media, 'destroy']);

return $router;
