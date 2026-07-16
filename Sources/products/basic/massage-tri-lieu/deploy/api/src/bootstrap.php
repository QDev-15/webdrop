<?php
declare(strict_types=1);

// ─── Core classes ─────────────────────────────────────────────────────────────
require_once __DIR__ . '/Response.php';
require_once __DIR__ . '/Router.php';
require_once __DIR__ . '/Auth.php';
require_once __DIR__ . '/Database.php';

// ─── Boot ─────────────────────────────────────────────────────────────────────
Auth::start();
$db = Database::getInstance();

// ─── Helpers ──────────────────────────────────────────────────────────────────
if (!function_exists('bodyJson')) {
    function bodyJson(): array {
        $raw = file_get_contents('php://input');
        if (!$raw) return $_POST ?: [];
        $decoded = json_decode($raw, true);
        return is_array($decoded) ? $decoded : [];
    }
}

if (!function_exists('slugify')) {
    function slugify(string $text): string {
        $text = mb_strtolower($text, 'UTF-8');
        $map = ['a'=>'a','b'=>'b','c'=>'c','d'=>'d','e'=>'e','f'=>'f','g'=>'g','h'=>'h','i'=>'i',
            'j'=>'j','k'=>'k','l'=>'l','m'=>'m','n'=>'n','o'=>'o','p'=>'p','q'=>'q','r'=>'r',
            's'=>'s','t'=>'t','u'=>'u','v'=>'v','w'=>'w','x'=>'x','y'=>'y','z'=>'z',
            'a'=>'a','a'=>'a','a'=>'a','e'=>'e','e'=>'e','i'=>'i','o'=>'o','o'=>'o',
            'u'=>'u','u'=>'u','d'=>'d'];
        $vi = ['a','a','a','a','a','a','a','e','e','e','e','i','i','o','o','o','o','o','o','o','o','u','u','u','u','u','y','y','d'];
        $vk = ['a','a','a','a','a','a','a','e','e','e','e','i','i','o','o','o','o','o','o','o','o','u','u','u','u','u','y','y','d'];
        $text = preg_replace('/[^a-z0-9\s-]/', '', $text);
        $text = preg_replace('/\s+/', '-', trim($text));
        $text = preg_replace('/-+/', '-', $text);
        return $text ?: 'slug';
    }
}

// ─── Controllers ──────────────────────────────────────────────────────────────
require_once __DIR__ . '/controllers/AuthController.php';
require_once __DIR__ . '/controllers/SettingsController.php';
require_once __DIR__ . '/controllers/HeroSlideController.php';
require_once __DIR__ . '/controllers/ContactController.php';
require_once __DIR__ . '/controllers/MediaController.php';
require_once __DIR__ . '/controllers/UserController.php';
require_once __DIR__ . '/controllers/UploadController.php';
require_once __DIR__ . '/controllers/UnsplashController.php';
require_once __DIR__ . '/controllers/StatsController.php';
require_once __DIR__ . '/controllers/PublicController.php';
require_once __DIR__ . '/controllers/ServiceCategoryController.php';
require_once __DIR__ . '/controllers/ServiceController.php';
require_once __DIR__ . '/controllers/BookingController.php';
require_once __DIR__ . '/controllers/TestimonialController.php';
require_once __DIR__ . '/controllers/TeamController.php';

// ─── Router ───────────────────────────────────────────────────────────────────
$router = new Router();

// Auth
$auth = new AuthController($db);
$router->add('POST', '/auth/login',   [$auth, 'login']);
$router->add('POST', '/auth/logout',  [$auth, 'logout']);
$router->add('GET',  '/auth/me',      [$auth, 'me']);
$router->add('POST', '/auth/change-password', [$auth, 'changePassword']);
$router->add('POST', '/auth/update-profile',  [$auth, 'updateProfile']);

// Settings
$settings = new SettingsController($db);
$router->add('GET',  '/settings',        [$settings, 'index']);
$router->add('POST', '/settings/update', [$settings, 'update']);

// Hero slides
$slides = new HeroSlideController($db);
$router->add('GET',  '/hero-slides',            [$slides, 'index']);
$router->add('POST', '/hero-slides',            [$slides, 'store']);
$router->add('POST', '/hero-slides/:id/update', [$slides, 'update']);
$router->add('POST', '/hero-slides/:id/delete', [$slides, 'destroy']);

// Contacts
$contacts = new ContactController($db);
$router->add('GET',  '/contacts',            [$contacts, 'index']);
$router->add('POST', '/contacts/:id/update', [$contacts, 'update']);
$router->add('POST', '/contacts/:id/delete', [$contacts, 'destroy']);

// Media
$media = new MediaController($db);
$router->add('GET',  '/media',            [$media, 'index']);
$router->add('POST', '/media/upload', [$media, 'upload']);
$router->add('POST', '/media/:id/delete', [$media, 'destroy']);

// Users
$users = new UserController($db);
$router->add('GET',  '/users',            [$users, 'index']);
$router->add('POST', '/users',            [$users, 'store']);
$router->add('POST', '/users/:id/update', [$users, 'update']);
$router->add('POST', '/users/:id/delete', [$users, 'destroy']);

// Upload & Unsplash
$upload = new UploadController($db);
$router->add('POST', '/upload', [$upload, 'store']);
$unsplash = new UnsplashController($db);
$router->add('GET', '/unsplash', [$unsplash, 'search']);

// Stats
$stats = new StatsController($db);
$router->add('GET', '/stats', [$stats, 'index']);

// Service categories
$svcCat = new ServiceCategoryController($db);
$router->add('GET',  '/service-categories',            [$svcCat, 'index']);
$router->add('POST', '/service-categories',            [$svcCat, 'store']);
$router->add('POST', '/service-categories/:id/update', [$svcCat, 'update']);
$router->add('POST', '/service-categories/:id/delete', [$svcCat, 'destroy']);

// Services
$svc = new ServiceController($db);
$router->add('GET',  '/services',            [$svc, 'index']);
$router->add('POST', '/services',            [$svc, 'store']);
$router->add('POST', '/services/:id/update', [$svc, 'update']);
$router->add('POST', '/services/:id/delete', [$svc, 'destroy']);

// Service packages (reuse ServiceController)
$router->add('GET',  '/service-packages',            [$svc, 'indexPackages']);
$router->add('POST', '/service-packages',            [$svc, 'storePackage']);
$router->add('POST', '/service-packages/:id/update', [$svc, 'updatePackage']);
$router->add('POST', '/service-packages/:id/delete', [$svc, 'destroyPackage']);

// Bookings
$bookings = new BookingController($db);
$router->add('GET',  '/bookings',            [$bookings, 'index']);
$router->add('POST', '/bookings/:id/update', [$bookings, 'update']);
$router->add('POST', '/bookings/:id/delete', [$bookings, 'destroy']);

// Testimonials
$testimonials = new TestimonialController($db);
$router->add('GET',  '/testimonials',            [$testimonials, 'index']);
$router->add('POST', '/testimonials',            [$testimonials, 'store']);
$router->add('POST', '/testimonials/:id/update', [$testimonials, 'update']);
$router->add('POST', '/testimonials/:id/delete', [$testimonials, 'destroy']);

// Team (therapists)
$team = new TeamController($db);
$router->add('GET',  '/team',            [$team, 'index']);
$router->add('POST', '/team',            [$team, 'store']);
$router->add('POST', '/team/:id/update', [$team, 'update']);
$router->add('POST', '/team/:id/delete', [$team, 'destroy']);

// Public endpoints (no auth required)
$pub = new PublicController($db);
$router->add('GET',  '/public/settings',           [$pub, 'settings']);
$router->add('GET',  '/public/hero-slides',        [$pub, 'heroSlides']);
$router->add('GET',  '/public/services',           [$pub, 'services']);
$router->add('GET',  '/public/service-categories', [$pub, 'serviceCategories']);
$router->add('GET',  '/public/service-packages',   [$pub, 'servicePackages']);
$router->add('GET',  '/public/testimonials',       [$pub, 'testimonials']);
$router->add('GET',  '/public/team',               [$pub, 'team']);
$router->add('POST', '/public/contact',            [$pub, 'submitContact']);
$router->add('POST', '/public/booking',            [$pub, 'submitBooking']);

return $router;
