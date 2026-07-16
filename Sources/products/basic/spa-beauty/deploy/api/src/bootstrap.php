<?php
declare(strict_types=1);

// ── Core classes ────────────────────────────────────────────────────────────
require_once __DIR__ . '/Response.php';
require_once __DIR__ . '/Router.php';
require_once __DIR__ . '/Auth.php';
require_once __DIR__ . '/Database.php';

// ── Boot ────────────────────────────────────────────────────────────────────
Auth::start();
$db = Database::getInstance();

// ── Helpers ─────────────────────────────────────────────────────────────────
function bodyJson(): array {
    $raw = file_get_contents('php://input');
    if (!$raw) return $_POST;
    $data = json_decode($raw, true);
    return is_array($data) ? $data : $_POST;
}

function slugify(string $text): string {
    $text = mb_strtolower(trim($text));
    $text = preg_replace('/[àáạảãâầấậẩẫăằắặẳẵ]/u', 'a', $text);
    $text = preg_replace('/[èéẹẻẽêềếệểễ]/u',        'e', $text);
    $text = preg_replace('/[ìíịỉĩ]/u',               'i', $text);
    $text = preg_replace('/[òóọỏõôồốộổỗơờớợởỡ]/u',  'o', $text);
    $text = preg_replace('/[ùúụủũưừứựửữ]/u',         'u', $text);
    $text = preg_replace('/[ỳýỵỷỹ]/u',               'y', $text);
    $text = preg_replace('/[đ]/u',                   'd', $text);
    $text = preg_replace('/[^a-z0-9\s-]/u',          '',  $text);
    $text = preg_replace('/[\s-]+/',                 '-',  $text);
    return trim($text, '-');
}

// ── Controllers ─────────────────────────────────────────────────────────────
require_once __DIR__ . '/controllers/PublicController.php';
require_once __DIR__ . '/controllers/AuthController.php';
require_once __DIR__ . '/controllers/SettingsController.php';
require_once __DIR__ . '/controllers/HeroSlideController.php';
require_once __DIR__ . '/controllers/ContactController.php';
require_once __DIR__ . '/controllers/MediaController.php';
require_once __DIR__ . '/controllers/UploadController.php';
require_once __DIR__ . '/controllers/UnsplashController.php';
require_once __DIR__ . '/controllers/UserController.php';
require_once __DIR__ . '/controllers/StatsController.php';
require_once __DIR__ . '/controllers/ServiceCategoryController.php';
require_once __DIR__ . '/controllers/ServiceController.php';
require_once __DIR__ . '/controllers/BookingController.php';
require_once __DIR__ . '/controllers/TestimonialController.php';
require_once __DIR__ . '/controllers/TeamController.php';
require_once __DIR__ . '/controllers/GalleryController.php';

// ── Router ──────────────────────────────────────────────────────────────────
$router = new Router();

// Auth
$auth = new AuthController($db);
$router->add('POST', '/auth/login',    [$auth, 'login']);
$router->add('POST', '/auth/logout',   [$auth, 'logout']);
$router->add('GET',  '/auth/me',       [$auth, 'me']);
$router->add('POST', '/auth/profile',  [$auth, 'updateProfile']);
$router->add('POST', '/auth/password', [$auth, 'changePassword']);

// Public (no auth required)
$pub = new PublicController($db);
$router->add('GET',  '/public/settings',          [$pub, 'settings']);
$router->add('GET',  '/public/hero-slides',        [$pub, 'heroSlides']);
$router->add('GET',  '/public/services',           [$pub, 'services']);
$router->add('GET',  '/public/gallery',            [$pub, 'gallery']);
$router->add('GET',  '/public/testimonials',       [$pub, 'testimonials']);
$router->add('GET',  '/public/team',               [$pub, 'team']);
$router->add('GET',  '/public/service-categories', [$pub, 'serviceCategories']);
$router->add('POST', '/public/contact',            [$pub, 'submitContact']);
$router->add('POST', '/public/booking',            [$pub, 'submitBooking']);

// Health check
$router->add('GET', '/health', function() {
    Response::json(['status' => 'ok', 'time' => date('c')]);
});

// Settings
$settings = new SettingsController($db);
$router->add('GET',  '/settings', [$settings, 'index']);
$router->add('POST', '/settings', [$settings, 'update']);

// Hero Slides
$slides = new HeroSlideController($db);
$router->add('GET',  '/slides',            [$slides, 'index']);
$router->add('POST', '/slides',            [$slides, 'store']);
$router->add('POST', '/slides/:id/update', [$slides, 'update']);
$router->add('POST', '/slides/:id/delete', [$slides, 'destroy']);

// Contacts
$contacts = new ContactController($db);
$router->add('GET',  '/contacts',              [$contacts, 'index']);
$router->add('POST', '/contacts/:id/update',   [$contacts, 'update']);
$router->add('POST', '/contacts/:id/delete',   [$contacts, 'destroy']);

// Media
$media = new MediaController($db);
$router->add('GET',  '/media',            [$media, 'index']);
$router->add('POST', '/media/upload', [$media, 'upload']);
$router->add('POST', '/media/:id/delete', [$media, 'destroy']);

// Upload
$upload = new UploadController($db);
$router->add('POST', '/upload', [$upload, 'store']);

// Unsplash
$unsplash = new UnsplashController($db);
$router->add('GET', '/unsplash', [$unsplash, 'search']);

// Users
$users = new UserController($db);
$router->add('GET',  '/users',            [$users, 'index']);
$router->add('POST', '/users',            [$users, 'store']);
$router->add('POST', '/users/:id/update', [$users, 'update']);
$router->add('POST', '/users/:id/delete', [$users, 'destroy']);

// Stats
$stats = new StatsController($db);
$router->add('GET', '/stats', [$stats, 'index']);

// Service Categories
$svcCat = new ServiceCategoryController($db);
$router->add('GET',  '/service-categories',            [$svcCat, 'index']);
$router->add('POST', '/service-categories',            [$svcCat, 'store']);
$router->add('POST', '/service-categories/:id/update', [$svcCat, 'update']);
$router->add('POST', '/service-categories/:id/delete', [$svcCat, 'destroy']);

// Services
$services = new ServiceController($db);
$router->add('GET',  '/services',            [$services, 'index']);
$router->add('POST', '/services',            [$services, 'store']);
$router->add('POST', '/services/:id/update', [$services, 'update']);
$router->add('POST', '/services/:id/delete', [$services, 'destroy']);

// Bookings
$bookings = new BookingController($db);
$router->add('GET',  '/bookings',            [$bookings, 'index']);
$router->add('POST', '/bookings/:id/update', [$bookings, 'update']);
$router->add('POST', '/bookings/:id/delete', [$bookings, 'destroy']);

// Testimonials
$testi = new TestimonialController($db);
$router->add('GET',  '/testimonials',            [$testi, 'index']);
$router->add('POST', '/testimonials',            [$testi, 'store']);
$router->add('POST', '/testimonials/:id/update', [$testi, 'update']);
$router->add('POST', '/testimonials/:id/delete', [$testi, 'destroy']);

// Gallery
$gallery = new GalleryController($db);
$router->add('GET',  '/gallery',            [$gallery, 'index']);
$router->add('POST', '/gallery',            [$gallery, 'store']);
$router->add('POST', '/gallery/:id/update', [$gallery, 'update']);
$router->add('POST', '/gallery/:id/delete', [$gallery, 'destroy']);

// Team Members
$team = new TeamController($db);
$router->add('GET',  '/team',            [$team, 'index']);
$router->add('POST', '/team',            [$team, 'store']);
$router->add('POST', '/team/:id/update', [$team, 'update']);
$router->add('POST', '/team/:id/delete', [$team, 'destroy']);

return $router;
