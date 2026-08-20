<?php
function bodyJson() {
  return json_decode(file_get_contents('php://input'), true) ?? [];
}

function slugify($text) {
  $text = preg_replace('~[^\pL\d]+~u', '-', $text);
  $text = iconv('utf-8', 'ascii//TRANSLIT', $text);
  $text = preg_replace('~[^-\w]+~', '', $text);
  $text = trim(preg_replace('~-+~', '-', $text), '-');
  return strtolower($text);
}

require_once __DIR__ . '/Response.php';
require_once __DIR__ . '/Router.php';
require_once __DIR__ . '/Auth.php';
require_once __DIR__ . '/Database.php';

// Controllers
require_once __DIR__ . '/controllers/SettingsController.php';
require_once __DIR__ . '/controllers/HeroSlideController.php';
require_once __DIR__ . '/controllers/ContactController.php';
require_once __DIR__ . '/controllers/MediaController.php';
require_once __DIR__ . '/controllers/UploadController.php';
require_once __DIR__ . '/controllers/UnsplashController.php';
require_once __DIR__ . '/controllers/ServiceController.php';
require_once __DIR__ . '/controllers/ServiceCategoryController.php';
require_once __DIR__ . '/controllers/BookingController.php';
require_once __DIR__ . '/controllers/TestimonialController.php';
require_once __DIR__ . '/controllers/TeamController.php';
require_once __DIR__ . '/controllers/StatsController.php';
require_once __DIR__ . '/controllers/PublicController.php';
require_once __DIR__ . '/controllers/UserController.php';
require_once __DIR__ . '/controllers/AuthController.php';

Auth::start();
$db = Database::getInstance();
$router = new Router();

// ─── Health Check ─────────────────────────────────────
$router->add('GET', '/health', function() {
  Response::json(['status' => 'ok', 'pdo_sqlite' => extension_loaded('pdo_sqlite')]);
});

// ─── Core Entities ────────────────────────────────────

// Settings
$settings = new SettingsController($db);
$router->add('GET',  '/settings',       [$settings, 'index']);
$router->add('POST', '/settings/update', [$settings, 'update']);

// Hero Slides
$slides = new HeroSlideController($db);
$router->add('GET',  '/hero-slides',            [$slides, 'index']);
$router->add('POST', '/hero-slides',            [$slides, 'store']);
$router->add('POST', '/hero-slides/:id/update', [$slides, 'update']);
$router->add('POST', '/hero-slides/:id/delete', [$slides, 'destroy']);

// Contacts
$contact = new ContactController($db);
$router->add('GET',  '/contacts',            [$contact, 'index']);
$router->add('GET',  '/contacts/:id',        [$contact, 'show']);
$router->add('POST', '/contacts/:id/update', [$contact, 'update']);
$router->add('POST', '/contacts/:id/delete', [$contact, 'destroy']);

// Media
$media = new MediaController($db);
$router->add('GET',  '/media',            [$media, 'index']);
$router->add('POST', '/media/upload',     [$media, 'upload']);
$router->add('POST', '/media/:id/delete', [$media, 'destroy']);

// Upload & Unsplash
$upload = new UploadController($db);
$router->add('POST', '/upload', [$upload, 'upload']);
$unsplash = new UnsplashController($db);
$router->add('GET',  '/unsplash',          [$unsplash, 'search']);
$router->add('POST', '/unsplash/download', [$unsplash, 'trackDownload']);

// ─── Extension: Services ──────────────────────────────

$service = new ServiceController($db);
$router->add('GET',  '/services',            [$service, 'index']);
$router->add('POST', '/services',            [$service, 'store']);
$router->add('POST', '/services/:id/update', [$service, 'update']);
$router->add('POST', '/services/:id/delete', [$service, 'destroy']);

// Bookings
$booking = new BookingController($db);
$router->add('GET',  '/bookings',            [$booking, 'index']);
$router->add('POST', '/bookings/:id/update', [$booking, 'update']);
$router->add('POST', '/bookings/:id/delete', [$booking, 'destroy']);

// Testimonials
$testimonial = new TestimonialController($db);
$router->add('GET',  '/testimonials',            [$testimonial, 'index']);
$router->add('POST', '/testimonials',            [$testimonial, 'store']);
$router->add('POST', '/testimonials/:id/update', [$testimonial, 'update']);
$router->add('POST', '/testimonials/:id/delete', [$testimonial, 'destroy']);

// Team Members
$team = new TeamController($db);
$router->add('GET',  '/team',            [$team, 'index']);
$router->add('POST', '/team',            [$team, 'store']);
$router->add('POST', '/team/:id/update', [$team, 'update']);
$router->add('POST', '/team/:id/delete', [$team, 'destroy']);

// ─── Auth ─────────────────────────────────────────────
$auth = new AuthController($db);
$router->add('POST', '/auth/login', [$auth, 'login']);
$router->add('POST', '/auth/logout', [$auth, 'logout']);
$router->add('GET', '/auth/me', [$auth, 'me']);

// Users
$user = new UserController($db);
$router->add('GET', '/users', [$user, 'index']);
$router->add('POST', '/users', [$user, 'store']);
$router->add('POST', '/users/:id/update', [$user, 'update']);
$router->add('POST', '/users/:id/delete', [$user, 'destroy']);
$router->add('POST', '/users/:id/change-password', [$user, 'changePassword']);

// ─── Admin ────────────────────────────────────────────
$stats = new StatsController($db);
$router->add('GET', '/stats', [$stats, 'index']);

// ─── Public ───────────────────────────────────────────
$pub = new PublicController($db);
$router->add('GET',  '/public/settings',    [$pub, 'settings']);
$router->add('GET',  '/public/hero-slides', [$pub, 'heroSlides']);
$router->add('GET',  '/public/services',    [$pub, 'services']);
$router->add('GET',  '/public/services/:slug', [$pub, 'serviceBySlug']);
$router->add('GET',  '/public/team',        [$pub, 'team']);
$router->add('GET',  '/public/testimonials',[$pub, 'testimonials']);
$router->add('POST', '/public/bookings',    [$pub, 'submitBooking']);
$router->add('POST', '/public/contact',     [$pub, 'submitContact']);
$router->add('GET',  '/sitemap.xml',        [$pub, 'sitemap']);
?>
