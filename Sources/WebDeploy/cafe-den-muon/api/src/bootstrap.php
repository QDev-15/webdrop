<?php
declare(strict_types=1);

// ─── Core classes ─────────────────────────────────────────────────────────────
require_once __DIR__ . '/Response.php';
require_once __DIR__ . '/Router.php';
require_once __DIR__ . '/Auth.php';
require_once __DIR__ . '/Database.php';
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
require_once __DIR__ . '/controllers/GalleryController.php';
require_once __DIR__ . '/controllers/TestimonialController.php';
require_once __DIR__ . '/controllers/FaqController.php';
require_once __DIR__ . '/controllers/UploadController.php';
require_once __DIR__ . '/controllers/UnsplashController.php';

// ─── Boot ─────────────────────────────────────────────────────────────────────
Auth::start();
$db = Database::getInstance();
$router = new Router();

// ── AUTH ───────────────────────────────────────────────────────────────────────
$auth = new AuthController($db);
$router->add('POST', '/auth/login',   [$auth, 'login']);
$router->add('POST', '/auth/logout',  [$auth, 'logout']);
$router->add('GET',  '/auth/me',      [$auth, 'me']);

// ── STATS ──────────────────────────────────────────────────────────────────────
$stats = new StatsController($db);
$router->add('GET', '/stats', [$stats, 'index']);

// ── SETTINGS ──────────────────────────────────────────────────────────────────
$settings = new SettingsController($db);
$router->add('GET',  '/settings',        [$settings, 'index']);
$router->add('POST', '/settings',        [$settings, 'update']);
$router->add('POST', '/settings/update', [$settings, 'update']);

// ── HERO SLIDES ───────────────────────────────────────────────────────────────
$slide = new HeroSlideController($db);
$router->add('GET',  '/hero-slides',            [$slide, 'index']);
$router->add('POST', '/hero-slides',            [$slide, 'store']);
$router->add('POST', '/hero-slides/reorder',    [$slide, 'reorder']);
$router->add('GET',  '/hero-slides/:id',        [$slide, 'show']);
$router->add('POST', '/hero-slides/:id/update', [$slide, 'update']);
$router->add('POST', '/hero-slides/:id/delete', [$slide, 'destroy']);

// ── USERS ─────────────────────────────────────────────────────────────────────
$user = new UserController($db);
$router->add('GET',  '/users',                     [$user, 'index']);
$router->add('POST', '/users',                     [$user, 'store']);
$router->add('GET',  '/users/:id',                 [$user, 'show']);
$router->add('POST', '/users/:id/update',          [$user, 'update']);
$router->add('POST', '/users/:id/delete',          [$user, 'destroy']);
$router->add('POST', '/users/:id/change-password', [$user, 'changePassword']);

// ── MENU CATEGORIES ───────────────────────────────────────────────────────────
$menuCat = new MenuCategoryController($db);
$router->add('GET',  '/menu-categories',            [$menuCat, 'index']);
$router->add('POST', '/menu-categories',            [$menuCat, 'store']);
$router->add('GET',  '/menu-categories/:id',        [$menuCat, 'show']);
$router->add('POST', '/menu-categories/:id/update', [$menuCat, 'update']);
$router->add('POST', '/menu-categories/:id/delete', [$menuCat, 'destroy']);

// ── MENU ITEMS ────────────────────────────────────────────────────────────────
$menuItem = new MenuItemController($db);
$router->add('GET',  '/menu-items',            [$menuItem, 'index']);
$router->add('POST', '/menu-items',            [$menuItem, 'store']);
$router->add('GET',  '/menu-items/:id',        [$menuItem, 'show']);
$router->add('POST', '/menu-items/:id/update', [$menuItem, 'update']);
$router->add('POST', '/menu-items/:id/delete', [$menuItem, 'destroy']);

// ── GALLERY ───────────────────────────────────────────────────────────────────
$gallery = new GalleryController($db);
$router->add('GET',  '/gallery',            [$gallery, 'index']);
$router->add('POST', '/gallery',            [$gallery, 'store']);
$router->add('GET',  '/gallery/:id',        [$gallery, 'show']);
$router->add('POST', '/gallery/:id/update', [$gallery, 'update']);
$router->add('POST', '/gallery/:id/delete', [$gallery, 'destroy']);

// ── TESTIMONIALS ──────────────────────────────────────────────────────────────
$testimonial = new TestimonialController($db);
$router->add('GET',  '/testimonials',            [$testimonial, 'index']);
$router->add('POST', '/testimonials',            [$testimonial, 'store']);
$router->add('GET',  '/testimonials/:id',        [$testimonial, 'show']);
$router->add('POST', '/testimonials/:id/update', [$testimonial, 'update']);
$router->add('POST', '/testimonials/:id/delete', [$testimonial, 'destroy']);

// ── FAQ ───────────────────────────────────────────────────────────────────────
$faq = new FaqController($db);
$router->add('GET',  '/faqs',            [$faq, 'index']);
$router->add('POST', '/faqs',            [$faq, 'store']);
$router->add('GET',  '/faqs/:id',        [$faq, 'show']);
$router->add('POST', '/faqs/:id/update', [$faq, 'update']);
$router->add('POST', '/faqs/:id/delete', [$faq, 'destroy']);

// ── CONTACTS ──────────────────────────────────────────────────────────────────
$contact = new ContactController($db);
$router->add('GET',  '/contacts',            [$contact, 'index']);
$router->add('GET',  '/contacts/:id',        [$contact, 'show']);
$router->add('POST', '/contacts/:id/update', [$contact, 'update']);
$router->add('POST', '/contacts/:id/delete', [$contact, 'destroy']);

// ── MEDIA ─────────────────────────────────────────────────────────────────────
$media = new MediaController($db);
$router->add('GET',  '/media',            [$media, 'index']);
$router->add('POST', '/media/upload',     [$media, 'upload']);
$router->add('POST', '/media/:id/delete', [$media, 'destroy']);

// ── UPLOAD & UNSPLASH ─────────────────────────────────────────────────────────
$upload = new UploadController($db);
$router->add('POST', '/upload', [$upload, 'upload']);

$unsplash = new UnsplashController($db);
$router->add('GET',  '/unsplash',          [$unsplash, 'search']);
$router->add('POST', '/unsplash/download', [$unsplash, 'trackDownload']);

// ── PUBLIC (no auth) ──────────────────────────────────────────────────────────
$pub = new PublicController($db);
$router->add('GET',  '/public/settings',      [$pub, 'settings']);
$router->add('GET',  '/public/hero-slides',   [$pub, 'heroSlides']);
$router->add('GET',  '/public/menu',          [$pub, 'menu']);
$router->add('GET',  '/public/menu-items',    [$pub, 'menuItems']);
$router->add('GET',  '/public/gallery',       [$pub, 'gallery']);
$router->add('GET',  '/public/testimonials',  [$pub, 'testimonials']);
$router->add('GET',  '/public/faqs',          [$pub, 'faqs']);
$router->add('POST', '/public/contact',       [$pub, 'submitContact']);
$router->add('GET',  '/sitemap.xml',          [$pub, 'sitemap']);

return $router;
