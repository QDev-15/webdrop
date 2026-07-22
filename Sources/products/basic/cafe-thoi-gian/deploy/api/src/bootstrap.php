<?php
declare(strict_types=1);

require_once __DIR__ . '/Database.php';
require_once __DIR__ . '/Router.php';
require_once __DIR__ . '/Auth.php';
require_once __DIR__ . '/Response.php';
require_once __DIR__ . '/controllers/AuthController.php';
require_once __DIR__ . '/controllers/PublicController.php';
require_once __DIR__ . '/controllers/StatsController.php';
require_once __DIR__ . '/controllers/SettingsController.php';
require_once __DIR__ . '/controllers/ContactController.php';
require_once __DIR__ . '/controllers/HeroSlideController.php';
require_once __DIR__ . '/controllers/MediaController.php';
require_once __DIR__ . '/controllers/MenuCategoryController.php';
require_once __DIR__ . '/controllers/MenuItemController.php';
require_once __DIR__ . '/controllers/GalleryController.php';
require_once __DIR__ . '/controllers/TestimonialController.php';
require_once __DIR__ . '/controllers/ReservationController.php';
require_once __DIR__ . '/controllers/UserController.php';


require_once __DIR__ . '/controllers/UploadController.php';
require_once __DIR__ . '/controllers/UnsplashController.php';
Auth::start();

function bodyJson(): array {
    static $body = null;
    if ($body === null) {
        $raw = file_get_contents('php://input');
        $body = $raw ? (json_decode($raw, true) ?? []) : [];
        if (!is_array($body)) $body = [];
    }
    return $body;
}

function slugify(string $text): string {
    $text = mb_strtolower($text, 'UTF-8');
    $map = ['Ã '=>'a','Ã¡'=>'a','áº£'=>'a','Ã£'=>'a','áº¡'=>'a','Äƒ'=>'a','áº¯'=>'a','áº±'=>'a','áº³'=>'a','áºµ'=>'a','áº·'=>'a','Ã¢'=>'a','áº¥'=>'a','áº§'=>'a','áº©'=>'a','áº«'=>'a','áº­'=>'a','Ä‘'=>'d','Ã¨'=>'e','Ã©'=>'e','áº»'=>'e','áº½'=>'e','áº¹'=>'e','Ãª'=>'e','áº¿'=>'e','á»'=>'e','á»ƒ'=>'e','á»…'=>'e','á»‡'=>'e','Ã¬'=>'i','Ã­'=>'i','á»‰'=>'i','Ä©'=>'i','á»‹'=>'i','Ã²'=>'o','Ã³'=>'o','á»'=>'o','Ãµ'=>'o','á»'=>'o','Ã´'=>'o','á»‘'=>'o','á»“'=>'o','á»•'=>'o','á»—'=>'o','á»™'=>'o','Æ¡'=>'o','á»›'=>'o','á»'=>'o','á»Ÿ'=>'o','á»¡'=>'o','á»£'=>'o','Ã¹'=>'u','Ãº'=>'u','á»§'=>'u','Å©'=>'u','á»¥'=>'u','Æ°'=>'u','á»©'=>'u','á»«'=>'u','á»­'=>'u','á»¯'=>'u','á»±'=>'u','á»³'=>'y','Ã½'=>'y','á»·'=>'y','á»¹'=>'y','á»µ'=>'y'];
    $text = strtr($text, $map);
    $text = preg_replace('/[^a-z0-9\s-]/', '', $text);
    $text = preg_replace('/[\s-]+/', '-', trim($text));
    return $text ?: 'item-' . time();
}

$db = Database::getInstance();
$router = new Router();

// â”€â”€ AUTH â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
$auth = new AuthController($db);
$router->add('POST', '/auth/login',   [$auth, 'login']);
$router->add('POST', '/auth/logout',  [$auth, 'logout']);
$router->add('GET',  '/auth/me',      [$auth, 'me']);

// â”€â”€ STATS â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
$stats = new StatsController($db);
$router->add('GET', '/stats', [$stats, 'index']);

// â”€â”€ SETTINGS â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
$settings = new SettingsController($db);
$router->add('GET',  '/settings',       [$settings, 'index']);
$router->add('POST', '/settings/update',[$settings, 'update']);

// â”€â”€ HERO SLIDES â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
$slide = new HeroSlideController($db);
$router->add('GET',  '/hero-slides',              [$slide, 'index']);
$router->add('POST', '/hero-slides',              [$slide, 'store']);
$router->add('POST', '/hero-slides/reorder',      [$slide, 'reorder']);
$router->add('GET',  '/hero-slides/:id',          [$slide, 'show']);
$router->add('POST', '/hero-slides/:id/update',   [$slide, 'update']);
$router->add('POST', '/hero-slides/:id/delete',   [$slide, 'destroy']);

// â”€â”€ MENU CATEGORIES â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
$menuCat = new MenuCategoryController($db);
$router->add('GET',  '/menu-categories',             [$menuCat, 'index']);
$router->add('POST', '/menu-categories',             [$menuCat, 'store']);
$router->add('GET',  '/menu-categories/:id',         [$menuCat, 'show']);
$router->add('POST', '/menu-categories/:id/update',  [$menuCat, 'update']);
$router->add('POST', '/menu-categories/:id/delete',  [$menuCat, 'destroy']);

// â”€â”€ MENU ITEMS â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
$menuItem = new MenuItemController($db);
$router->add('GET',  '/menu-items',              [$menuItem, 'index']);
$router->add('POST', '/menu-items',              [$menuItem, 'store']);
$router->add('GET',  '/menu-items/:id',          [$menuItem, 'show']);
$router->add('POST', '/menu-items/:id/update',   [$menuItem, 'update']);
$router->add('POST', '/menu-items/:id/delete',   [$menuItem, 'destroy']);

// â”€â”€ GALLERY â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
$gallery = new GalleryController($db);
$router->add('GET',  '/gallery',              [$gallery, 'index']);
$router->add('POST', '/gallery',              [$gallery, 'store']);
$router->add('POST', '/gallery/reorder',      [$gallery, 'reorder']);
$router->add('GET',  '/gallery/:id',          [$gallery, 'show']);
$router->add('POST', '/gallery/:id/update',   [$gallery, 'update']);
$router->add('POST', '/gallery/:id/delete',   [$gallery, 'destroy']);

// â”€â”€ TESTIMONIALS â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
$testi = new TestimonialController($db);
$router->add('GET',  '/testimonials',              [$testi, 'index']);
$router->add('POST', '/testimonials',              [$testi, 'store']);
$router->add('GET',  '/testimonials/:id',          [$testi, 'show']);
$router->add('POST', '/testimonials/:id/update',   [$testi, 'update']);
$router->add('POST', '/testimonials/:id/delete',   [$testi, 'destroy']);

// â”€â”€ RESERVATIONS â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
$reservation = new ReservationController($db);
$router->add('GET',  '/reservations',              [$reservation, 'index']);
$router->add('POST', '/reservations',              [$reservation, 'store']);
$router->add('GET',  '/reservations/:id',          [$reservation, 'show']);
$router->add('POST', '/reservations/:id/update',   [$reservation, 'update']);
$router->add('POST', '/reservations/:id/delete',   [$reservation, 'destroy']);

// â”€â”€ CONTACTS â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
$contact = new ContactController($db);
$router->add('GET',  '/contacts',              [$contact, 'index']);
$router->add('GET',  '/contacts/:id',          [$contact, 'show']);
$router->add('POST', '/contacts/:id/update',   [$contact, 'update']);
$router->add('POST', '/contacts/:id/delete',   [$contact, 'destroy']);

// â”€â”€ MEDIA â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
$media = new MediaController($db);
$router->add('GET',  '/media',              [$media, 'index']);
$router->add('POST', '/media/upload',       [$media, 'upload']);
$router->add('POST', '/media/:id/delete',   [$media, 'destroy']);

// â”€â”€ USERS â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
$user = new UserController($db);
$router->add('GET',  '/users',                         [$user, 'index']);
$router->add('POST', '/users',                         [$user, 'store']);
$router->add('POST', '/users/:id/update',              [$user, 'update']);
$router->add('POST', '/users/:id/delete',              [$user, 'destroy']);
$router->add('POST', '/users/:id/change-password',     [$user, 'changePassword']);

// â”€â”€ PUBLIC (no auth) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
$pub = new PublicController($db);
$router->add('GET',  '/public/settings',        [$pub, 'settings']);
$router->add('GET',  '/public/hero-slides',     [$pub, 'heroSlides']);
$router->add('GET',  '/public/menu',            [$pub, 'menu']);
$router->add('GET',  '/public/menu-items',      [$pub, 'menuItems']);
$router->add('GET',  '/public/gallery',         [$pub, 'gallery']);
$router->add('GET',  '/public/testimonials',    [$pub, 'testimonials']);
$router->add('POST', '/public/contact',         [$pub, 'submitContact']);
$router->add('POST', '/public/reservation',     [$pub, 'submitReservation']);
$router->add('GET',  '/sitemap.xml',            [$pub, 'sitemap']);


// ── UPLOAD & UNSPLASH ─────────────────────────────────────────────────────────
$upload   = new UploadController($db);
$router->add('POST', '/upload',   [$upload,   'upload']);

$unsplash = new UnsplashController($db);
$router->add('GET',  '/unsplash', [$unsplash, 'search']);
$router->add('POST', '/unsplash', [$unsplash, 'trackDownload']);

return $router;


