<?php
declare(strict_types=1);

// ─── Core classes ─────────────────────────────────────────────────────────────
require_once __DIR__ . '/Response.php';
require_once __DIR__ . '/Router.php';
require_once __DIR__ . '/Auth.php';
require_once __DIR__ . '/Database.php';

require_once __DIR__ . '/controllers/AuthController.php';
require_once __DIR__ . '/controllers/UserController.php';
require_once __DIR__ . '/controllers/PublicController.php';
require_once __DIR__ . '/controllers/SettingsController.php';
require_once __DIR__ . '/controllers/HeroSlideController.php';
require_once __DIR__ . '/controllers/ContactController.php';
require_once __DIR__ . '/controllers/MediaController.php';
require_once __DIR__ . '/controllers/StatsController.php';
require_once __DIR__ . '/controllers/MenuCategoryController.php';
require_once __DIR__ . '/controllers/MenuItemController.php';
require_once __DIR__ . '/controllers/GalleryController.php';
require_once __DIR__ . '/controllers/TestimonialController.php';
require_once __DIR__ . '/controllers/FaqController.php';
require_once __DIR__ . '/controllers/UnsplashController.php';
require_once __DIR__ . '/controllers/UploadController.php';

// ─── Helpers (bodyJson/slugify đã có sẵn trong Database.php) ──────────────────

// ─── Boot ───────────────────────────────────────────────────────────────────────
// Auth::start() PHẢI gọi TRƯỚC Database::getInstance()
Auth::start();
$db = Database::getInstance();

$router = new Router();

// ─── Auth ────────────────────────────────────────────────────────────────────
$auth = new AuthController($db);
$router->add('POST', '/auth/login',  [$auth, 'login']);
$router->add('POST', '/auth/logout', [$auth, 'logout']);
$router->add('GET',  '/auth/me',     [$auth, 'me']);

// ─── Users ───────────────────────────────────────────────────────────────────
$users = new UserController($db);
$router->add('GET',  '/users',                       [$users, 'index']);
$router->add('POST', '/users',                       [$users, 'store']);
$router->add('POST', '/users/:id/update',            [$users, 'update']);
$router->add('POST', '/users/:id/delete',            [$users, 'destroy']);
$router->add('POST', '/users/:id/change-password',   [$users, 'changePassword']);

// ─── Stats ───────────────────────────────────────────────────────────────────
$stats = new StatsController($db);
$router->add('GET', '/stats', [$stats, 'index']);

// ─── Settings ────────────────────────────────────────────────────────────────
$settings = new SettingsController($db);
$router->add('GET',  '/settings', [$settings, 'index']);
$router->add('POST', '/settings', [$settings, 'update']);

// ─── Hero slides ─────────────────────────────────────────────────────────────
$slides = new HeroSlideController($db);
$router->add('GET',  '/hero-slides',            [$slides, 'index']);
$router->add('POST', '/hero-slides',            [$slides, 'store']);
$router->add('GET',  '/hero-slides/:id',        [$slides, 'show']);
$router->add('POST', '/hero-slides/:id/update', [$slides, 'update']);
$router->add('POST', '/hero-slides/:id/delete', [$slides, 'destroy']);

// ─── Contacts ────────────────────────────────────────────────────────────────
$contacts = new ContactController($db);
$router->add('GET',  '/contacts',            [$contacts, 'index']);
$router->add('GET',  '/contacts/:id',        [$contacts, 'show']);
$router->add('POST', '/contacts/:id/update', [$contacts, 'update']);
$router->add('POST', '/contacts/:id/delete', [$contacts, 'destroy']);

// ─── Media ───────────────────────────────────────────────────────────────────
$media = new MediaController($db);
$router->add('GET',  '/media',            [$media, 'index']);
$router->add('POST', '/media/upload',     [$media, 'upload']);
$router->add('POST', '/media/:id/delete', [$media, 'destroy']);

// ─── Upload (dùng bởi ImageField) ─────────────────────────────────────────────
$upload = new UploadController($db);
$router->add('POST', '/upload', [$upload, 'upload']);

// ─── Unsplash ────────────────────────────────────────────────────────────────
$unsplash = new UnsplashController($db);
$router->add('GET',  '/unsplash',          [$unsplash, 'search']);
$router->add('POST', '/unsplash/download', [$unsplash, 'trackDownload']);

// ─── Menu Categories ─────────────────────────────────────────────────────────
$menuCat = new MenuCategoryController($db);
$router->add('GET',  '/menu-categories',            [$menuCat, 'index']);
$router->add('POST', '/menu-categories',            [$menuCat, 'store']);
$router->add('GET',  '/menu-categories/:id',        [$menuCat, 'show']);
$router->add('POST', '/menu-categories/:id/update', [$menuCat, 'update']);
$router->add('POST', '/menu-categories/:id/delete', [$menuCat, 'destroy']);

// ─── Menu Items ──────────────────────────────────────────────────────────────
$menuItem = new MenuItemController($db);
$router->add('GET',  '/menu-items',            [$menuItem, 'index']);
$router->add('POST', '/menu-items',            [$menuItem, 'store']);
$router->add('GET',  '/menu-items/:id',        [$menuItem, 'show']);
$router->add('POST', '/menu-items/:id/update', [$menuItem, 'update']);
$router->add('POST', '/menu-items/:id/delete', [$menuItem, 'destroy']);

// ─── Gallery ─────────────────────────────────────────────────────────────────
$gallery = new GalleryController($db);
$router->add('GET',  '/gallery',            [$gallery, 'index']);
$router->add('POST', '/gallery',            [$gallery, 'store']);
$router->add('POST', '/gallery/:id/update', [$gallery, 'update']);
$router->add('POST', '/gallery/:id/delete', [$gallery, 'destroy']);

// ─── Testimonials ────────────────────────────────────────────────────────────
$testimonial = new TestimonialController($db);
$router->add('GET',  '/testimonials',            [$testimonial, 'index']);
$router->add('POST', '/testimonials',            [$testimonial, 'store']);
$router->add('GET',  '/testimonials/:id',        [$testimonial, 'show']);
$router->add('POST', '/testimonials/:id/update', [$testimonial, 'update']);
$router->add('POST', '/testimonials/:id/delete', [$testimonial, 'destroy']);

// ─── FAQs ────────────────────────────────────────────────────────────────────
$faq = new FaqController($db);
$router->add('GET',  '/faqs',            [$faq, 'index']);
$router->add('POST', '/faqs',            [$faq, 'store']);
$router->add('GET',  '/faqs/:id',        [$faq, 'show']);
$router->add('POST', '/faqs/:id/update', [$faq, 'update']);
$router->add('POST', '/faqs/:id/delete', [$faq, 'destroy']);

// ─── Public endpoints (không cần auth) ────────────────────────────────────────
$pub = new PublicController($db);
$router->add('GET',  '/public/settings',        [$pub, 'settings']);
$router->add('GET',  '/public/hero-slides',     [$pub, 'heroSlides']);
$router->add('GET',  '/public/menu-categories', [$pub, 'menuCategories']);
$router->add('GET',  '/public/menu-items',      [$pub, 'menuItems']);
$router->add('GET',  '/public/gallery',         [$pub, 'gallery']);
$router->add('GET',  '/public/testimonials',    [$pub, 'testimonials']);
$router->add('GET',  '/public/faqs',            [$pub, 'faqs']);
$router->add('POST', '/public/contact',         [$pub, 'submitContact']);
$router->add('GET',  '/sitemap.xml',            [$pub, 'sitemap']);

return $router;
