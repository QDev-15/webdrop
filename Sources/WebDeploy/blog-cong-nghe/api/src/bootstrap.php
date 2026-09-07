<?php
declare(strict_types=1);

// Ghi chú: bodyJson()/slugify() đã khai báo sẵn trong Database.php — không khai báo lại ở đây.

// ─── Core classes ─────────────────────────────────────────────────────────────
require_once __DIR__ . '/Response.php';
require_once __DIR__ . '/Router.php';
require_once __DIR__ . '/Auth.php';
require_once __DIR__ . '/Database.php';

// ─── Controllers ────────────────────────────────────────────────────────────
require_once __DIR__ . '/controllers/AuthController.php';
require_once __DIR__ . '/controllers/UserController.php';
require_once __DIR__ . '/controllers/SettingsController.php';
require_once __DIR__ . '/controllers/HeroSlideController.php';
require_once __DIR__ . '/controllers/ContactController.php';
require_once __DIR__ . '/controllers/MediaController.php';
require_once __DIR__ . '/controllers/UploadController.php';
require_once __DIR__ . '/controllers/UnsplashController.php';
require_once __DIR__ . '/controllers/CategoryController.php';
require_once __DIR__ . '/controllers/PostController.php';
require_once __DIR__ . '/controllers/FaqController.php';
require_once __DIR__ . '/controllers/StatsController.php';
require_once __DIR__ . '/controllers/PublicController.php';

// ─── Boot ─────────────────────────────────────────────────────────────────────
Auth::start();
$db = Database::getInstance();
$router = new Router();

// ─── Auth ─────────────────────────────────────────────────────────────────────
$auth = new AuthController($db);
$router->add('POST', '/auth/login',  [$auth, 'login']);
$router->add('POST', '/auth/logout', [$auth, 'logout']);
$router->add('GET',  '/auth/me',     [$auth, 'me']);

// ─── Users ────────────────────────────────────────────────────────────────────
$user = new UserController($db);
$router->add('GET',  '/users',                     [$user, 'index']);
$router->add('POST', '/users',                     [$user, 'store']);
$router->add('POST', '/users/:id/update',          [$user, 'update']);
$router->add('POST', '/users/:id/delete',          [$user, 'destroy']);
$router->add('POST', '/users/:id/change-password', [$user, 'changePassword']);

// ─── Settings ─────────────────────────────────────────────────────────────────
$settings = new SettingsController($db);
$router->add('GET',  '/settings',        [$settings, 'index']);
$router->add('POST', '/settings/update', [$settings, 'update']);

// ─── Hero Slides ────────────────────────────────────────────────────────────
$slides = new HeroSlideController($db);
$router->add('GET',  '/hero-slides',            [$slides, 'index']);
$router->add('GET',  '/hero-slides/:id',        [$slides, 'show']);
$router->add('POST', '/hero-slides',            [$slides, 'store']);
$router->add('POST', '/hero-slides/:id/update', [$slides, 'update']);
$router->add('POST', '/hero-slides/:id/delete', [$slides, 'destroy']);
$router->add('POST', '/hero-slides/reorder',    [$slides, 'reorder']);

// ─── Contacts ─────────────────────────────────────────────────────────────────
$contact = new ContactController($db);
$router->add('GET',  '/contacts',            [$contact, 'index']);
$router->add('GET',  '/contacts/:id',        [$contact, 'show']);
$router->add('POST', '/contacts/:id/update', [$contact, 'update']);
$router->add('POST', '/contacts/:id/delete', [$contact, 'destroy']);

// ─── Media ────────────────────────────────────────────────────────────────────
$media = new MediaController($db);
$router->add('GET',  '/media',            [$media, 'index']);
$router->add('POST', '/media/upload',     [$media, 'upload']);
$router->add('POST', '/media/:id/delete', [$media, 'destroy']);

// ─── Upload & Unsplash ──────────────────────────────────────────────────────
$upload = new UploadController($db);
$router->add('POST', '/upload', [$upload, 'upload']);
$unsplash = new UnsplashController($db);
$router->add('GET',  '/unsplash',          [$unsplash, 'search']);
$router->add('POST', '/unsplash/download', [$unsplash, 'trackDownload']);

// ─── Extension: Chuyên mục bài viết ─────────────────────────────────────────
$category = new CategoryController($db);
$router->add('GET',  '/categories',            [$category, 'index']);
$router->add('GET',  '/categories/:id',        [$category, 'show']);
$router->add('POST', '/categories',            [$category, 'store']);
$router->add('POST', '/categories/:id/update', [$category, 'update']);
$router->add('POST', '/categories/:id/delete', [$category, 'destroy']);

// ─── Extension: Bài viết (bao gồm Đánh giá sản phẩm) ───────────────────────
$post = new PostController($db);
$router->add('GET',  '/posts',            [$post, 'index']);
$router->add('GET',  '/posts/:id',        [$post, 'show']);
$router->add('POST', '/posts',            [$post, 'store']);
$router->add('POST', '/posts/:id/update', [$post, 'update']);
$router->add('POST', '/posts/:id/delete', [$post, 'destroy']);

// ─── Extension: FAQ ─────────────────────────────────────────────────────────
$faq = new FaqController($db);
$router->add('GET',  '/faqs',            [$faq, 'index']);
$router->add('GET',  '/faqs/:id',        [$faq, 'show']);
$router->add('POST', '/faqs',            [$faq, 'store']);
$router->add('POST', '/faqs/:id/update', [$faq, 'update']);
$router->add('POST', '/faqs/:id/delete', [$faq, 'destroy']);

// ─── Admin Stats ────────────────────────────────────────────────────────────
$stats = new StatsController($db);
$router->add('GET', '/stats', [$stats, 'index']);

// ─── Public (không cần đăng nhập) ─────────────────────────────────────────────
$pub = new PublicController($db);
$router->add('GET',  '/public/settings',            [$pub, 'settings']);
$router->add('GET',  '/public/hero-slides',         [$pub, 'heroSlides']);
$router->add('GET',  '/public/post-categories',     [$pub, 'postCategories']);
$router->add('GET',  '/public/posts',               [$pub, 'posts']);
$router->add('GET',  '/public/posts/:slug',         [$pub, 'postBySlug']);
$router->add('GET',  '/public/posts/:slug/related', [$pub, 'relatedPosts']);
$router->add('GET',  '/public/faqs',                [$pub, 'faqs']);
$router->add('POST', '/public/contact',             [$pub, 'submitContact']);
$router->add('GET',  '/sitemap.xml',                [$pub, 'sitemap']);

return $router;
