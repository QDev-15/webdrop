<?php
declare(strict_types=1);

// -- Core classes -------------------------------------------------------
require_once __DIR__ . '/Response.php';
require_once __DIR__ . '/Router.php';
require_once __DIR__ . '/Auth.php';
require_once __DIR__ . '/Database.php';

// -- Controllers --------------------------------------------------------
require_once __DIR__ . '/controllers/AuthController.php';
require_once __DIR__ . '/controllers/PublicController.php';
require_once __DIR__ . '/controllers/StatsController.php';
require_once __DIR__ . '/controllers/SettingsController.php';
require_once __DIR__ . '/controllers/HeroSlideController.php';
require_once __DIR__ . '/controllers/ContactController.php';
require_once __DIR__ . '/controllers/MediaController.php';
require_once __DIR__ . '/controllers/ProfileController.php';
require_once __DIR__ . '/controllers/UserController.php';
require_once __DIR__ . '/controllers/UploadController.php';
require_once __DIR__ . '/controllers/UnsplashController.php';
require_once __DIR__ . '/controllers/ServiceController.php';
require_once __DIR__ . '/controllers/BookingController.php';
require_once __DIR__ . '/controllers/TestimonialController.php';
require_once __DIR__ . '/controllers/TeamController.php';

// -- Helpers ------------------------------------------------------------
function bodyJson(): array {
    $raw = file_get_contents('php://input');
    if (!$raw) return [];
    $data = json_decode($raw, true);
    return is_array($data) ? $data : [];
}

function slugify(string $str): string {
    $str = mb_strtolower(trim($str));
    $str = preg_replace('/\s+/', '-', $str);
    $str = preg_replace('/[^a-z0-9\-]/', '', $str);
    $str = preg_replace('/-+/', '-', $str);
    return trim($str, '-');
}

// -- Boot ---------------------------------------------------------------
Auth::start();
$db     = Database::getInstance();
$router = new Router();

// -- Auth routes --------------------------------------------------------
$auth = new AuthController($db);
$router->add('POST', '/auth/login',   [$auth, 'login']);
$router->add('POST', '/auth/logout',  [$auth, 'logout']);
$router->add('GET',  '/auth/me',      [$auth, 'me']);

// -- Stats --------------------------------------------------------------
$stats = new StatsController($db);
$router->add('GET', '/stats', [$stats, 'index']);

// -- Settings -----------------------------------------------------------
$settings = new SettingsController($db);
$router->add('GET',  '/settings',        [$settings, 'index']);
$router->add('POST', '/settings/update', [$settings, 'update']);

// -- Hero slides --------------------------------------------------------
$slide = new HeroSlideController($db);
$router->add('GET',  '/hero-slides',              [$slide, 'index']);
$router->add('POST', '/hero-slides',              [$slide, 'store']);
$router->add('POST', '/hero-slides/:id/update',   [$slide, 'update']);
$router->add('POST', '/hero-slides/:id/delete',   [$slide, 'destroy']);

// -- Contacts -----------------------------------------------------------
$contact = new ContactController($db);
$router->add('GET',  '/contacts',            [$contact, 'index']);
$router->add('POST', '/contacts/:id/update', [$contact, 'update']);
$router->add('POST', '/contacts/:id/delete', [$contact, 'destroy']);

// -- Media --------------------------------------------------------------
$media = new MediaController($db);
$router->add('GET',  '/media',            [$media, 'index']);
$router->add('POST', '/media/upload', [$media, 'upload']);
$router->add('POST', '/media/:id/delete', [$media, 'destroy']);

// -- Upload / Unsplash --------------------------------------------------
$upload   = new UploadController($db);
$unsplash = new UnsplashController($db);
$router->add('POST', '/upload',    [$upload,   'store']);
$router->add('GET',  '/unsplash',  [$unsplash, 'search']);

// -- Profile ------------------------------------------------------------
$profile = new ProfileController($db);
$router->add('GET',  '/profile',        [$profile, 'show']);
$router->add('POST', '/profile/update', [$profile, 'update']);

// -- Users --------------------------------------------------------------
$user = new UserController($db);
$router->add('GET',  '/users',                    [$user, 'index']);
$router->add('POST', '/users',                    [$user, 'store']);
$router->add('POST', '/users/:id/update',         [$user, 'update']);
$router->add('POST', '/users/:id/delete',         [$user, 'destroy']);
$router->add('POST', '/users/:id/change-password', [$user, 'changePassword']);

// -- Services -----------------------------------------------------------
$service = new ServiceController($db);
$router->add('GET',  '/services',              [$service, 'index']);
$router->add('POST', '/services',              [$service, 'store']);
$router->add('POST', '/services/:id/update',   [$service, 'update']);
$router->add('POST', '/services/:id/delete',   [$service, 'destroy']);

// -- Bookings -----------------------------------------------------------
$booking = new BookingController($db);
$router->add('GET',  '/bookings',              [$booking, 'index']);
$router->add('POST', '/bookings/:id/update',   [$booking, 'update']);
$router->add('POST', '/bookings/:id/delete',   [$booking, 'destroy']);

// -- Testimonials -------------------------------------------------------
$testimonial = new TestimonialController($db);
$router->add('GET',  '/testimonials',              [$testimonial, 'index']);
$router->add('POST', '/testimonials',              [$testimonial, 'store']);
$router->add('POST', '/testimonials/:id/update',   [$testimonial, 'update']);
$router->add('POST', '/testimonials/:id/delete',   [$testimonial, 'destroy']);

// -- Team (Doctors) -----------------------------------------------------
$team = new TeamController($db);
$router->add('GET',  '/team',              [$team, 'index']);
$router->add('POST', '/team',              [$team, 'store']);
$router->add('POST', '/team/:id/update',   [$team, 'update']);
$router->add('POST', '/team/:id/delete',   [$team, 'destroy']);

// -- Public (no auth) ---------------------------------------------------
$pub = new PublicController($db);
$router->add('GET',  '/public/settings',     [$pub, 'settings']);
$router->add('GET',  '/public/hero-slides',  [$pub, 'heroSlides']);
$router->add('GET',  '/public/services',     [$pub, 'services']);
$router->add('GET',  '/public/doctors',      [$pub, 'doctors']);
$router->add('GET',  '/public/testimonials', [$pub, 'testimonials']);
$router->add('POST', '/public/bookings',     [$pub, 'submitBooking']);
$router->add('POST', '/public/contact',      [$pub, 'submitContact']);
$router->add('GET',  '/sitemap.xml',         [$pub, 'sitemap']);

return $router;
