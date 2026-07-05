<?php
declare(strict_types=1);

require_once __DIR__ . '/Database.php';
require_once __DIR__ . '/Auth.php';
require_once __DIR__ . '/Response.php';
require_once __DIR__ . '/Router.php';

require_once __DIR__ . '/controllers/AuthController.php';
require_once __DIR__ . '/controllers/ProfileController.php';
require_once __DIR__ . '/controllers/UserController.php';
require_once __DIR__ . '/controllers/SettingsController.php';
require_once __DIR__ . '/controllers/HeroSlideController.php';
require_once __DIR__ . '/controllers/ContactController.php';
require_once __DIR__ . '/controllers/ServiceCategoryController.php';
require_once __DIR__ . '/controllers/ServiceController.php';
require_once __DIR__ . '/controllers/BookingController.php';
require_once __DIR__ . '/controllers/TestimonialController.php';
require_once __DIR__ . '/controllers/TeamController.php';
require_once __DIR__ . '/controllers/StatsController.php';
require_once __DIR__ . '/controllers/MediaController.php';
require_once __DIR__ . '/controllers/UnsplashController.php';
require_once __DIR__ . '/controllers/UploadController.php';
require_once __DIR__ . '/controllers/PublicController.php';

// Helper: doc JSON body
function bodyJson(): array {
    $raw = file_get_contents('php://input');
    if (!$raw) return [];
    $data = json_decode($raw, true);
    return is_array($data) ? $data : [];
}

// Khoi tao DB + migrate + seed
$db = Database::getInstance();
$db->migrate();
$db->seed();

// Khoi dong session
Auth::start();

// Router
$router = new Router();

// ---- Public routes (khong can auth) ----
$pub = new PublicController($db);
$router->add('GET',  '/public/settings',          [$pub, 'settings']);
$router->add('GET',  '/public/hero-slides',        [$pub, 'heroSlides']);
$router->add('GET',  '/public/service-categories', [$pub, 'serviceCategories']);
$router->add('GET',  '/public/services',           [$pub, 'services']);
$router->add('GET',  '/public/doctors',            [$pub, 'doctors']);
$router->add('GET',  '/public/testimonials',       [$pub, 'testimonials']);
$router->add('POST', '/public/bookings',           [$pub, 'submitBooking']);
$router->add('POST', '/public/contact',            [$pub, 'submitContact']);

// ---- Auth routes ----
$auth = new AuthController($db);
$router->add('POST', '/auth/login',  [$auth, 'login']);
$router->add('POST', '/auth/logout', [$auth, 'logout']);
$router->add('GET',  '/auth/me',     [$auth, 'me']);

// ---- Profile ----
$profile = new ProfileController($db);
$router->add('GET',  '/profile',                  [$profile, 'show']);
$router->add('POST', '/profile/update',           [$profile, 'update']);
$router->add('POST', '/profile/change-password',  [$profile, 'changePassword']);

// ---- Users ----
$user = new UserController($db);
$router->add('GET',  '/users',               [$user, 'index']);
$router->add('GET',  '/users/(\d+)',         [$user, 'show']);
$router->add('POST', '/users',               [$user, 'store']);
$router->add('POST', '/users/(\d+)/update',  [$user, 'update']);
$router->add('POST', '/users/(\d+)/delete',  [$user, 'destroy']);
$router->add('POST', '/users/(\d+)/change-password', [$user, 'changePassword']);

// ---- Settings ----
$settings = new SettingsController($db);
$router->add('GET',  '/settings',        [$settings, 'index']);
$router->add('POST', '/settings/update', [$settings, 'update']);

// ---- Hero Slides ----
$hero = new HeroSlideController($db);
$router->add('GET',  '/hero-slides',              [$hero, 'index']);
$router->add('GET',  '/hero-slides/(\d+)',        [$hero, 'show']);
$router->add('POST', '/hero-slides',              [$hero, 'store']);
$router->add('POST', '/hero-slides/(\d+)/update', [$hero, 'update']);
$router->add('POST', '/hero-slides/(\d+)/delete', [$hero, 'destroy']);

// ---- Contacts ----
$contact = new ContactController($db);
$router->add('GET',  '/contacts',              [$contact, 'index']);
$router->add('GET',  '/contacts/(\d+)',        [$contact, 'show']);
$router->add('POST', '/contacts/(\d+)/update', [$contact, 'update']);
$router->add('POST', '/contacts/(\d+)/delete', [$contact, 'destroy']);

// ---- Service Categories ----
$svcCat = new ServiceCategoryController($db);
$router->add('GET',  '/service-categories',              [$svcCat, 'index']);
$router->add('GET',  '/service-categories/(\d+)',        [$svcCat, 'show']);
$router->add('POST', '/service-categories',              [$svcCat, 'store']);
$router->add('POST', '/service-categories/(\d+)/update', [$svcCat, 'update']);
$router->add('POST', '/service-categories/(\d+)/delete', [$svcCat, 'destroy']);

// ---- Services ----
$svc = new ServiceController($db);
$router->add('GET',  '/services',              [$svc, 'index']);
$router->add('GET',  '/services/(\d+)',        [$svc, 'show']);
$router->add('POST', '/services',              [$svc, 'store']);
$router->add('POST', '/services/(\d+)/update', [$svc, 'update']);
$router->add('POST', '/services/(\d+)/delete', [$svc, 'destroy']);

// ---- Bookings ----
$booking = new BookingController($db);
$router->add('GET',  '/bookings',              [$booking, 'index']);
$router->add('GET',  '/bookings/(\d+)',        [$booking, 'show']);
$router->add('POST', '/bookings/(\d+)/update', [$booking, 'update']);
$router->add('POST', '/bookings/(\d+)/delete', [$booking, 'destroy']);

// ---- Testimonials ----
$testimonial = new TestimonialController($db);
$router->add('GET',  '/testimonials',              [$testimonial, 'index']);
$router->add('GET',  '/testimonials/(\d+)',        [$testimonial, 'show']);
$router->add('POST', '/testimonials',              [$testimonial, 'store']);
$router->add('POST', '/testimonials/(\d+)/update', [$testimonial, 'update']);
$router->add('POST', '/testimonials/(\d+)/delete', [$testimonial, 'destroy']);

// ---- Team (Doctors) ----
$team = new TeamController($db);
$router->add('GET',  '/team',              [$team, 'index']);
$router->add('GET',  '/team/(\d+)',        [$team, 'show']);
$router->add('POST', '/team',              [$team, 'store']);
$router->add('POST', '/team/(\d+)/update', [$team, 'update']);
$router->add('POST', '/team/(\d+)/delete', [$team, 'destroy']);

// ---- Stats ----
$stats = new StatsController($db);
$router->add('GET', '/stats', [$stats, 'index']);

// ---- Media ----
$media = new MediaController($db);
$router->add('GET',  '/media',              [$media, 'index']);
$router->add('POST', '/media/upload',        [$media, 'upload']);
$router->add('POST', '/media/(\d+)/delete',  [$media, 'destroy']);

// ---- Upload ----
$upload = new UploadController($db);
$router->add('POST', '/upload', [$upload, 'upload']);

// ---- Unsplash ----
$unsplash = new UnsplashController($db);
$router->add('GET',  '/unsplash/search',        [$unsplash, 'search']);
$router->add('POST', '/unsplash/track-download', [$unsplash, 'trackDownload']);

return $router;
