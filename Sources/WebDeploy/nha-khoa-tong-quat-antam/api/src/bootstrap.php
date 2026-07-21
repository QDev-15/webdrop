<?php
declare(strict_types=1);

require_once __DIR__ . '/Response.php';
require_once __DIR__ . '/Router.php';
require_once __DIR__ . '/Auth.php';
require_once __DIR__ . '/Database.php';

Auth::start();

$db     = new Database();
$router = new Router();

// ── Controllers ────────────────────────────────────────────────────────────
require_once __DIR__ . '/controllers/PublicController.php';
require_once __DIR__ . '/controllers/StatsController.php';
require_once __DIR__ . '/controllers/AuthController.php';
require_once __DIR__ . '/controllers/UserController.php';
require_once __DIR__ . '/controllers/SettingsController.php';
require_once __DIR__ . '/controllers/ContactController.php';
require_once __DIR__ . '/controllers/HeroSlideController.php';
require_once __DIR__ . '/controllers/MediaController.php';
require_once __DIR__ . '/controllers/UnsplashController.php';
require_once __DIR__ . '/controllers/UploadController.php';
require_once __DIR__ . '/controllers/ServiceCategoryController.php';
require_once __DIR__ . '/controllers/ServiceController.php';
require_once __DIR__ . '/controllers/BookingController.php';
require_once __DIR__ . '/controllers/TestimonialController.php';
require_once __DIR__ . '/controllers/TeamController.php';

$pub        = new PublicController($db);
$stats      = new StatsController($db);
$auth       = new AuthController($db);
$user       = new UserController($db);
$settings   = new SettingsController($db);
$contact    = new ContactController($db);
$slide      = new HeroSlideController($db);
$media      = new MediaController($db);
$unsplash   = new UnsplashController($db);
$upload     = new UploadController($db);
$svcCat     = new ServiceCategoryController($db);
$svc        = new ServiceController($db);
$booking    = new BookingController($db);
$testimonial= new TestimonialController($db);
$team       = new TeamController($db);

// ── Public routes (no auth) ────────────────────────────────────────────────
$router->add('GET',  '/public/settings',           [$pub, 'settings']);
$router->add('GET',  '/public/hero-slides',         [$pub, 'heroSlides']);
$router->add('GET',  '/public/service-categories',  [$pub, 'serviceCategories']);
$router->add('GET',  '/public/services',            [$pub, 'services']);
$router->add('GET',  '/public/doctors',             [$pub, 'doctors']);
$router->add('GET',  '/public/testimonials',        [$pub, 'testimonials']);
$router->add('POST', '/public/bookings',            [$pub, 'createBooking']);
$router->add('POST', '/public/contact',             [$pub, 'createContact']);
$router->add('GET',  '/sitemap.xml',                [$pub, 'sitemap']);

// ── Auth ───────────────────────────────────────────────────────────────────
$router->add('POST', '/auth/login',    [$auth, 'login']);
$router->add('POST', '/auth/logout',   [$auth, 'logout']);
$router->add('GET',  '/auth/me',       [$auth, 'me']);

// ── Users ─────────────────────────────────────────────────────────────────
$router->add('GET',  '/users',                        [$user, 'index']);
$router->add('POST', '/users',                        [$user, 'store']);
$router->add('GET',  '/users/:id',                    [$user, 'show']);
$router->add('POST', '/users/:id/update',             [$user, 'update']);
$router->add('POST', '/users/:id/delete',             [$user, 'destroy']);
$router->add('POST', '/users/:id/change-password',    [$user, 'changePassword']);

// ── Settings ──────────────────────────────────────────────────────────────
$router->add('GET',  '/settings',        [$settings, 'index']);
$router->add('POST', '/settings/update', [$settings, 'update']);

// ── Contacts ──────────────────────────────────────────────────────────────
$router->add('GET',  '/contacts',              [$contact, 'index']);
$router->add('GET',  '/contacts/:id',          [$contact, 'show']);
$router->add('POST', '/contacts/:id/update',   [$contact, 'update']);
$router->add('POST', '/contacts/:id/delete',   [$contact, 'destroy']);

// ── Hero Slides ───────────────────────────────────────────────────────────
$router->add('GET',  '/hero-slides',              [$slide, 'index']);
$router->add('POST', '/hero-slides',              [$slide, 'store']);
$router->add('GET',  '/hero-slides/:id',          [$slide, 'show']);
$router->add('POST', '/hero-slides/:id/update',   [$slide, 'update']);
$router->add('POST', '/hero-slides/:id/delete',   [$slide, 'destroy']);

// ── Media ─────────────────────────────────────────────────────────────────
$router->add('GET',  '/media',          [$media, 'index']);
$router->add('POST', '/media/upload', [$media, 'upload']);
$router->add('POST', '/media/:id/delete', [$media, 'destroy']);

// ── Upload ────────────────────────────────────────────────────────────────
$router->add('POST', '/upload',         [$upload, 'store']);

// ── Unsplash ──────────────────────────────────────────────────────────────
$router->add('GET',  '/unsplash',       [$unsplash, 'search']);

// ── Stats ─────────────────────────────────────────────────────────────────
$router->add('GET',  '/stats',          [$stats, 'index']);

// ── Service Categories ────────────────────────────────────────────────────
$router->add('GET',  '/service-categories',              [$svcCat, 'index']);
$router->add('POST', '/service-categories',              [$svcCat, 'store']);
$router->add('GET',  '/service-categories/:id',          [$svcCat, 'show']);
$router->add('POST', '/service-categories/:id/update',   [$svcCat, 'update']);
$router->add('POST', '/service-categories/:id/delete',   [$svcCat, 'destroy']);

// ── Services ──────────────────────────────────────────────────────────────
$router->add('GET',  '/services',              [$svc, 'index']);
$router->add('POST', '/services',              [$svc, 'store']);
$router->add('GET',  '/services/:id',          [$svc, 'show']);
$router->add('POST', '/services/:id/update',   [$svc, 'update']);
$router->add('POST', '/services/:id/delete',   [$svc, 'destroy']);

// ── Bookings ──────────────────────────────────────────────────────────────
$router->add('GET',  '/bookings',              [$booking, 'index']);
$router->add('GET',  '/bookings/:id',          [$booking, 'show']);
$router->add('POST', '/bookings/:id/update',   [$booking, 'update']);
$router->add('POST', '/bookings/:id/delete',   [$booking, 'destroy']);

// ── Testimonials ──────────────────────────────────────────────────────────
$router->add('GET',  '/testimonials',              [$testimonial, 'index']);
$router->add('POST', '/testimonials',              [$testimonial, 'store']);
$router->add('GET',  '/testimonials/:id',          [$testimonial, 'show']);
$router->add('POST', '/testimonials/:id/update',   [$testimonial, 'update']);
$router->add('POST', '/testimonials/:id/delete',   [$testimonial, 'destroy']);

// ── Team (Doctors) ────────────────────────────────────────────────────────
$router->add('GET',  '/team',              [$team, 'index']);
$router->add('POST', '/team',              [$team, 'store']);
$router->add('GET',  '/team/:id',          [$team, 'show']);
$router->add('POST', '/team/:id/update',   [$team, 'update']);
$router->add('POST', '/team/:id/delete',   [$team, 'destroy']);

return $router;
