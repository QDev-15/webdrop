<?php
declare(strict_types=1);

// ─── Core classes ─────────────────────────────────────────────────────────────
require_once __DIR__ . '/Router.php';
require_once __DIR__ . '/Database.php';
require_once __DIR__ . '/Auth.php';
require_once __DIR__ . '/Response.php';

// ─── Controllers ──────────────────────────────────────────────────────────────
require_once __DIR__ . '/controllers/AuthController.php';
require_once __DIR__ . '/controllers/SettingsController.php';
require_once __DIR__ . '/controllers/ContactController.php';
require_once __DIR__ . '/controllers/HeroSlideController.php';
require_once __DIR__ . '/controllers/MediaController.php';
require_once __DIR__ . '/controllers/UserController.php';
require_once __DIR__ . '/controllers/UploadController.php';
require_once __DIR__ . '/controllers/UnsplashController.php';
require_once __DIR__ . '/controllers/PublicController.php';
require_once __DIR__ . '/controllers/StatsController.php';
require_once __DIR__ . '/controllers/ServiceCategoryController.php';
require_once __DIR__ . '/controllers/ServiceController.php';
require_once __DIR__ . '/controllers/BookingController.php';
require_once __DIR__ . '/controllers/TestimonialController.php';
require_once __DIR__ . '/controllers/TeamController.php';
require_once __DIR__ . '/controllers/GalleryController.php';

// ─── Session ──────────────────────────────────────────────────────────────────
Auth::start();

// ─── Database ─────────────────────────────────────────────────────────────────
$db = new Database();

// ─── Migration / Seed ─────────────────────────────────────────────────────────
function migrate(Database $db): void {
    $schemaFile = dirname(__DIR__) . '/schema.sql';
    $sql = file_get_contents($schemaFile);
    if ($sql === false) {
        error_log('[bootstrap] Cannot read schema.sql: ' . $schemaFile);
        return;
    }
    // Split on statement boundaries — handle multi-statement SQL safely
    $db->pdo()->exec($sql);
}

migrate($db);

// ─── Helper ───────────────────────────────────────────────────────────────────
function bodyJson(): array {
    $raw = file_get_contents('php://input');
    $d   = json_decode($raw ?: '', true);
    return is_array($d) ? $d : [];
}

// ─── Controller instances ─────────────────────────────────────────────────────
$auth             = new AuthController($db);
$settings         = new SettingsController($db);
$contact          = new ContactController($db);
$heroSlide        = new HeroSlideController($db);
$media            = new MediaController($db);
$user             = new UserController($db);
$upload           = new UploadController($db);
$unsplash         = new UnsplashController($db);
$public           = new PublicController($db);
$stats            = new StatsController($db);
$serviceCategory  = new ServiceCategoryController($db);
$service          = new ServiceController($db);
$booking          = new BookingController($db);
$testimonial      = new TestimonialController($db);
$team             = new TeamController($db);
$gallery          = new GalleryController($db);

// ─── Router ───────────────────────────────────────────────────────────────────
$router = new Router();

// Auth
$router->add('GET',  '/auth/me',      fn($p) => $auth->me($p));
$router->add('POST', '/auth/login',   fn($p) => $auth->login($p));
$router->add('POST', '/auth/logout',  fn($p) => $auth->logout($p));

// Settings (admin)
$router->add('GET',  '/settings',        fn($p) => $settings->index($p));
$router->add('POST', '/settings/update', fn($p) => $settings->update($p));

// Contacts (admin)
$router->add('GET',  '/contacts',              fn($p) => $contact->index($p));
$router->add('POST', '/contacts/:id/update',   fn($p) => $contact->update($p));
$router->add('POST', '/contacts/:id/delete',   fn($p) => $contact->destroy($p));
// Public: submit contact form
$router->add('POST', '/contacts',              fn($p) => $contact->store($p));

// Hero Slides (admin)
$router->add('GET',  '/hero-slides',                 fn($p) => $heroSlide->index($p));
$router->add('POST', '/hero-slides',                 fn($p) => $heroSlide->store($p));
$router->add('POST', '/hero-slides/reorder',         fn($p) => $heroSlide->reorder($p));
$router->add('POST', '/hero-slides/:id/update',      fn($p) => $heroSlide->update($p));
$router->add('POST', '/hero-slides/:id/delete',      fn($p) => $heroSlide->destroy($p));

// Media (admin)
$router->add('GET',  '/media',              fn($p) => $media->index($p));
$router->add('POST', '/media/:id/delete',   fn($p) => $media->destroy($p));

// Users (admin)
$router->add('GET',  '/users',                  fn($p) => $user->index($p));
$router->add('POST', '/users/:id/update',        fn($p) => $user->update($p));
$router->add('POST', '/users/:id/delete',        fn($p) => $user->destroy($p));
$router->add('POST', '/users/:id/password',      fn($p) => $user->changePassword($p));

// Upload & Unsplash (admin)
$router->add('POST', '/upload',     fn($p) => $upload->upload($p));
$router->add('GET',  '/unsplash',   fn($p) => $unsplash->search($p));

// Stats (admin)
$router->add('GET', '/stats', fn($p) => $stats->index($p));

// Service Categories (admin)
$router->add('GET',  '/service-categories',              fn($p) => $serviceCategory->index($p));
$router->add('POST', '/service-categories',              fn($p) => $serviceCategory->store($p));
$router->add('POST', '/service-categories/:id/update',   fn($p) => $serviceCategory->update($p));
$router->add('POST', '/service-categories/:id/delete',   fn($p) => $serviceCategory->destroy($p));

// Services (admin)
$router->add('GET',  '/services',              fn($p) => $service->index($p));
$router->add('POST', '/services',              fn($p) => $service->store($p));
$router->add('POST', '/services/:id/update',   fn($p) => $service->update($p));
$router->add('POST', '/services/:id/delete',   fn($p) => $service->destroy($p));

// Bookings (admin + public submit)
$router->add('GET',  '/bookings',              fn($p) => $booking->index($p));
$router->add('POST', '/bookings',              fn($p) => $booking->store($p));
$router->add('POST', '/bookings/:id/update',   fn($p) => $booking->update($p));
$router->add('POST', '/bookings/:id/delete',   fn($p) => $booking->destroy($p));

// Testimonials (admin)
$router->add('GET',  '/testimonials',              fn($p) => $testimonial->index($p));
$router->add('POST', '/testimonials',              fn($p) => $testimonial->store($p));
$router->add('POST', '/testimonials/:id/update',   fn($p) => $testimonial->update($p));
$router->add('POST', '/testimonials/:id/delete',   fn($p) => $testimonial->destroy($p));

// Team (admin)
$router->add('GET',  '/team',              fn($p) => $team->index($p));
$router->add('POST', '/team',              fn($p) => $team->store($p));
$router->add('POST', '/team/:id/update',   fn($p) => $team->update($p));
$router->add('POST', '/team/:id/delete',   fn($p) => $team->destroy($p));

// Gallery (admin)
$router->add('GET',  '/gallery',              fn($p) => $gallery->index($p));
$router->add('POST', '/gallery',              fn($p) => $gallery->store($p));
$router->add('POST', '/gallery/:id/update',   fn($p) => $gallery->update($p));
$router->add('POST', '/gallery/:id/delete',   fn($p) => $gallery->destroy($p));

// Public endpoints (no auth)
$router->add('GET',  '/public/settings',           fn($p) => $public->settings($p));
$router->add('GET',  '/public/services',           fn($p) => $public->services($p));
$router->add('GET',  '/public/services/featured',  fn($p) => $public->servicesFeatured($p));
$router->add('GET',  '/public/service-categories', fn($p) => $public->serviceCategories($p));
$router->add('GET',  '/public/testimonials',       fn($p) => $public->testimonials($p));
$router->add('GET',  '/public/team',               fn($p) => $public->team($p));
$router->add('GET',  '/public/gallery',            fn($p) => $public->gallery($p));
$router->add('GET',  '/public/hero-slides',        fn($p) => $public->heroSlides($p));

return $router;
