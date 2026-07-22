<?php
declare(strict_types=1);

require_once __DIR__ . '/Database.php';
require_once __DIR__ . '/Router.php';
require_once __DIR__ . '/Auth.php';
require_once __DIR__ . '/Response.php';

// Controllers
require_once __DIR__ . '/controllers/AuthController.php';
require_once __DIR__ . '/controllers/PublicController.php';
require_once __DIR__ . '/controllers/StatsController.php';
require_once __DIR__ . '/controllers/SettingsController.php';
require_once __DIR__ . '/controllers/ContactController.php';
require_once __DIR__ . '/controllers/HeroSlideController.php';
require_once __DIR__ . '/controllers/MediaController.php';
require_once __DIR__ . '/controllers/UserController.php';
require_once __DIR__ . '/controllers/MenuCategoryController.php';
require_once __DIR__ . '/controllers/MenuItemController.php';
require_once __DIR__ . '/controllers/ReservationController.php';
require_once __DIR__ . '/controllers/GalleryController.php';
require_once __DIR__ . '/controllers/TestimonialController.php';
require_once __DIR__ . '/controllers/UploadController.php';
require_once __DIR__ . '/controllers/UnsplashController.php';

Auth::start();
$db = Database::getInstance();
$router = new Router();

// ── AUTH ─────────────────────────────────────────────────────────────────────
$auth = new AuthController($db);
$router->add('POST', '/auth/login',  [$auth, 'login']);
$router->add('POST', '/auth/logout', [$auth, 'logout']);
$router->add('GET',  '/auth/me',     [$auth, 'me']);

// ── STATS ────────────────────────────────────────────────────────────────────
$stats = new StatsController($db);
$router->add('GET', '/stats', [$stats, 'index']);

// ── SETTINGS ─────────────────────────────────────────────────────────────────
$settings = new SettingsController($db);
$router->add('GET',  '/settings',        [$settings, 'index']);
$router->add('POST', '/settings/update', [$settings, 'update']);

// ── HERO SLIDES ──────────────────────────────────────────────────────────────
$slide = new HeroSlideController($db);
$router->add('GET',  '/hero-slides',            [$slide, 'index']);
$router->add('POST', '/hero-slides',            [$slide, 'store']);
$router->add('POST', '/hero-slides/reorder',    [$slide, 'reorder']);
$router->add('POST', '/hero-slides/:id/update', [$slide, 'update']);
$router->add('POST', '/hero-slides/:id/delete', [$slide, 'destroy']);

// ── MENU CATEGORIES ──────────────────────────────────────────────────────────
$menuCat = new MenuCategoryController($db);
$router->add('GET',  '/menu-categories',            [$menuCat, 'index']);
$router->add('POST', '/menu-categories',            [$menuCat, 'store']);
$router->add('POST', '/menu-categories/:id/update', [$menuCat, 'update']);
$router->add('POST', '/menu-categories/:id/delete', [$menuCat, 'destroy']);

// ── MENU ITEMS ───────────────────────────────────────────────────────────────
$menuItem = new MenuItemController($db);
$router->add('GET',  '/menu-items',            [$menuItem, 'index']);
$router->add('POST', '/menu-items',            [$menuItem, 'store']);
$router->add('GET',  '/menu-items/:id',        [$menuItem, 'show']);
$router->add('POST', '/menu-items/:id/update', [$menuItem, 'update']);
$router->add('POST', '/menu-items/:id/delete', [$menuItem, 'destroy']);

// ── RESERVATIONS ─────────────────────────────────────────────────────────────
$res = new ReservationController($db);
$router->add('GET',  '/reservations',            [$res, 'index']);
$router->add('POST', '/reservations',            [$res, 'store']);
$router->add('POST', '/reservations/:id/update', [$res, 'update']);
$router->add('POST', '/reservations/:id/delete', [$res, 'destroy']);

// ── GALLERY ──────────────────────────────────────────────────────────────────
$gallery = new GalleryController($db);
$router->add('GET',  '/gallery',            [$gallery, 'index']);
$router->add('POST', '/gallery',            [$gallery, 'store']);
$router->add('POST', '/gallery/reorder',    [$gallery, 'reorder']);
$router->add('POST', '/gallery/:id/update', [$gallery, 'update']);
$router->add('POST', '/gallery/:id/delete', [$gallery, 'destroy']);

// ── TESTIMONIALS ─────────────────────────────────────────────────────────────
$testi = new TestimonialController($db);
$router->add('GET',  '/testimonials',            [$testi, 'index']);
$router->add('POST', '/testimonials',            [$testi, 'store']);
$router->add('POST', '/testimonials/:id/update', [$testi, 'update']);
$router->add('POST', '/testimonials/:id/delete', [$testi, 'destroy']);

// ── CONTACTS ─────────────────────────────────────────────────────────────────
$contact = new ContactController($db);
$router->add('GET',  '/contacts',            [$contact, 'index']);
$router->add('POST', '/contacts/:id/update', [$contact, 'update']);
$router->add('POST', '/contacts/:id/delete', [$contact, 'destroy']);

// ── MEDIA ────────────────────────────────────────────────────────────────────
$media = new MediaController($db);
$router->add('GET',  '/media',            [$media, 'index']);
$router->add('POST', '/media/upload',     [$media, 'upload']);
$router->add('POST', '/media/:id/delete', [$media, 'destroy']);

// ── USERS ────────────────────────────────────────────────────────────────────
$user = new UserController($db);
$router->add('GET',  '/users',                    [$user, 'index']);
$router->add('POST', '/users',                    [$user, 'store']);
$router->add('POST', '/users/:id/update',         [$user, 'update']);
$router->add('POST', '/users/:id/delete',         [$user, 'destroy']);
$router->add('POST', '/users/:id/change-password', [$user, 'changePassword']);

// ── UPLOAD & UNSPLASH ────────────────────────────────────────────────────────
$upload = new UploadController($db);
$router->add('POST', '/upload', [$upload, 'upload']);

$unsplash = new UnsplashController($db);
$router->add('GET',  '/unsplash', [$unsplash, 'search']);
$router->add('POST', '/unsplash', [$unsplash, 'trackDownload']);

// ── PUBLIC ENDPOINTS ─────────────────────────────────────────────────────────
$pub = new PublicController($db);
$router->add('GET',  '/public/settings',      [$pub, 'settings']);
$router->add('GET',  '/public/hero-slides',   [$pub, 'heroSlides']);
$router->add('GET',  '/public/menu',          [$pub, 'menu']);
$router->add('GET',  '/public/featured-menu', [$pub, 'featuredMenu']);
$router->add('GET',  '/public/testimonials',  [$pub, 'testimonials']);
$router->add('GET',  '/public/gallery',       [$pub, 'gallery']);
$router->add('POST', '/public/contact',       [$pub, 'submitContact']);
$router->add('POST', '/public/reservation',   [$pub, 'submitReservation']);
$router->add('GET',  '/sitemap.xml',          [$pub, 'sitemap']);

return $router;
