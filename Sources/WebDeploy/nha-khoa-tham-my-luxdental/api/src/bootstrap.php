<?php
declare(strict_types=1);

// ── Load core classes TRƯỚC Auth::start() ──
require_once __DIR__ . '/Response.php';
require_once __DIR__ . '/../src/Router.php';
require_once __DIR__ . '/Auth.php';
require_once __DIR__ . '/Database.php';

// ── Load controllers ──
require_once __DIR__ . '/controllers/AuthController.php';
require_once __DIR__ . '/controllers/UserController.php';
require_once __DIR__ . '/controllers/ProfileController.php';
require_once __DIR__ . '/controllers/SettingsController.php';
require_once __DIR__ . '/controllers/HeroSlideController.php';
require_once __DIR__ . '/controllers/ContactController.php';
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

// ── Start session & init DB ──
Auth::start();
$db = new Database();

// ── Helper: parse JSON body ──
if (!function_exists('bodyJson')) {
    function bodyJson(): array {
        $raw = file_get_contents('php://input');
        if (!$raw) return [];
        $data = json_decode($raw, true);
        return is_array($data) ? $data : [];
    }
}

// ── Instantiate controllers ──
$authCtrl        = new AuthController($db);
$userCtrl        = new UserController($db);
$profileCtrl     = new ProfileController($db);
$settingsCtrl    = new SettingsController($db);
$heroSlideCtrl   = new HeroSlideController($db);
$contactCtrl     = new ContactController($db);
$mediaCtrl       = new MediaController($db);
$uploadCtrl      = new UploadController($db);
$unsplashCtrl    = new UnsplashController($db);
$statsCtrl       = new StatsController($db);
$publicCtrl      = new PublicController($db);
$catCtrl         = new ServiceCategoryController($db);
$svcCtrl         = new ServiceController($db);
$bookingCtrl     = new BookingController($db);
$testimonialCtrl = new TestimonialController($db);
$teamCtrl        = new TeamController($db);

// ── Register routes ──
$router = new Router();

// Auth
$router->add('POST', '/auth/login',          [$authCtrl, 'login']);
$router->add('POST', '/auth/logout',         [$authCtrl, 'logout']);
$router->add('GET',  '/auth/me',             [$authCtrl, 'me']);

// Users (superadmin)
$router->add('GET',  '/users',               [$userCtrl, 'index']);
$router->add('POST', '/users',               [$userCtrl, 'store']);
$router->add('POST', '/users/:id/update',    [$userCtrl, 'update']);
$router->add('POST', '/users/:id/delete',    [$userCtrl, 'destroy']);
$router->add('POST', '/users/:id/change-password', [$userCtrl, 'changePassword']);

// Profile
$router->add('GET',  '/profile',             [$profileCtrl, 'index']);
$router->add('POST', '/profile/update',      [$profileCtrl, 'update']);
$router->add('POST', '/profile/password',    [$profileCtrl, 'changePassword']);

// Settings
$router->add('GET',  '/settings',            [$settingsCtrl, 'index']);
$router->add('POST', '/settings/update',     [$settingsCtrl, 'update']);

// Hero slides
$router->add('GET',  '/hero-slides',         [$heroSlideCtrl, 'index']);
$router->add('GET',  '/hero-slides/:id',     [$heroSlideCtrl, 'show']);
$router->add('POST', '/hero-slides',         [$heroSlideCtrl, 'store']);
$router->add('POST', '/hero-slides/:id/update', [$heroSlideCtrl, 'update']);
$router->add('POST', '/hero-slides/:id/delete', [$heroSlideCtrl, 'destroy']);

// Contacts
$router->add('GET',  '/contacts',            [$contactCtrl, 'index']);
$router->add('GET',  '/contacts/:id',        [$contactCtrl, 'show']);
$router->add('POST', '/contacts/:id/update', [$contactCtrl, 'update']);
$router->add('POST', '/contacts/:id/delete', [$contactCtrl, 'destroy']);

// Media
$router->add('GET',  '/media',               [$mediaCtrl, 'index']);
$router->add('POST', '/media/upload', [$mediaCtrl, 'upload']);
$router->add('GET',  '/media/:id',           [$mediaCtrl, 'show']);
$router->add('POST', '/media/:id/update',    [$mediaCtrl, 'update']);
$router->add('POST', '/media/:id/delete',    [$mediaCtrl, 'destroy']);

// Upload & Unsplash
$router->add('POST', '/upload',              [$uploadCtrl, 'upload']);
$router->add('GET',  '/unsplash',            [$unsplashCtrl, 'search']);

// Stats
$router->add('GET',  '/stats',               [$statsCtrl, 'index']);

// Service categories
$router->add('GET',  '/service-categories',             [$catCtrl, 'index']);
$router->add('GET',  '/service-categories/:id',         [$catCtrl, 'show']);
$router->add('POST', '/service-categories',             [$catCtrl, 'store']);
$router->add('POST', '/service-categories/:id/update',  [$catCtrl, 'update']);
$router->add('POST', '/service-categories/:id/delete',  [$catCtrl, 'destroy']);

// Services
$router->add('GET',  '/services',             [$svcCtrl, 'index']);
$router->add('GET',  '/services/:id',         [$svcCtrl, 'show']);
$router->add('POST', '/services',             [$svcCtrl, 'store']);
$router->add('POST', '/services/:id/update',  [$svcCtrl, 'update']);
$router->add('POST', '/services/:id/delete',  [$svcCtrl, 'destroy']);

// Bookings
$router->add('GET',  '/bookings',             [$bookingCtrl, 'index']);
$router->add('GET',  '/bookings/:id',         [$bookingCtrl, 'show']);
$router->add('POST', '/bookings/:id/update',  [$bookingCtrl, 'update']);
$router->add('POST', '/bookings/:id/delete',  [$bookingCtrl, 'destroy']);

// Testimonials
$router->add('GET',  '/testimonials',             [$testimonialCtrl, 'index']);
$router->add('GET',  '/testimonials/:id',         [$testimonialCtrl, 'show']);
$router->add('POST', '/testimonials',             [$testimonialCtrl, 'store']);
$router->add('POST', '/testimonials/:id/update',  [$testimonialCtrl, 'update']);
$router->add('POST', '/testimonials/:id/delete',  [$testimonialCtrl, 'destroy']);

// Team (doctors)
$router->add('GET',  '/team',             [$teamCtrl, 'index']);
$router->add('GET',  '/team/:id',         [$teamCtrl, 'show']);
$router->add('POST', '/team',             [$teamCtrl, 'store']);
$router->add('POST', '/team/:id/update',  [$teamCtrl, 'update']);
$router->add('POST', '/team/:id/delete',  [$teamCtrl, 'destroy']);

// Public routes
$router->add('GET',  '/public/settings',           [$publicCtrl, 'settings']);
$router->add('GET',  '/public/hero-slides',        [$publicCtrl, 'heroSlides']);
$router->add('GET',  '/public/service-categories', [$publicCtrl, 'serviceCategories']);
$router->add('GET',  '/public/services',           [$publicCtrl, 'services']);
$router->add('GET',  '/public/doctors',            [$publicCtrl, 'doctors']);
$router->add('GET',  '/public/testimonials',       [$publicCtrl, 'testimonials']);
$router->add('POST', '/public/bookings',           [$publicCtrl, 'createBooking']);
$router->add('POST', '/public/contact',            [$publicCtrl, 'createContact']);

return $router;
