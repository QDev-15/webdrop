<?php
declare(strict_types=1);

// ─── Core classes ─────────────────────────────────────────────────────────────
require_once __DIR__ . '/Response.php';
require_once __DIR__ . '/Router.php';
require_once __DIR__ . '/Auth.php';
require_once __DIR__ . '/Database.php';

// ─── Controllers ────────────────────────────────────────────────────────────────
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
require_once __DIR__ . '/controllers/TestimonialController.php';
require_once __DIR__ . '/controllers/FaqController.php';
require_once __DIR__ . '/controllers/TimelineController.php';
require_once __DIR__ . '/controllers/StatsController.php';
require_once __DIR__ . '/controllers/PublicController.php';

// ─── Boot ─────────────────────────────────────────────────────────────────────
Auth::start();
$db     = Database::getInstance();
$router = new Router();

// Auth
$auth = new AuthController($db);
$router->add('POST', '/auth/login',  [$auth, 'login']);
$router->add('POST', '/auth/logout', [$auth, 'logout']);
$router->add('GET',  '/auth/me',     [$auth, 'me']);

// Users
$user = new UserController($db);
$router->add('GET',  '/users',                     [$user, 'index']);
$router->add('POST', '/users',                     [$user, 'store']);
$router->add('POST', '/users/:id/update',          [$user, 'update']);
$router->add('POST', '/users/:id/delete',          [$user, 'destroy']);
$router->add('POST', '/users/:id/change-password', [$user, 'changePassword']);

// Settings
$settings = new SettingsController($db);
$router->add('GET',  '/settings',        [$settings, 'index']);
$router->add('POST', '/settings/update', [$settings, 'update']);

// Hero Slides
$hero = new HeroSlideController($db);
$router->add('GET',  '/hero-slides',            [$hero, 'index']);
$router->add('GET',  '/hero-slides/:id',        [$hero, 'show']);
$router->add('POST', '/hero-slides',            [$hero, 'store']);
$router->add('POST', '/hero-slides/:id/update', [$hero, 'update']);
$router->add('POST', '/hero-slides/:id/delete', [$hero, 'destroy']);
$router->add('POST', '/hero-slides/reorder',    [$hero, 'reorder']);

// Contacts
$contact = new ContactController($db);
$router->add('GET',  '/contacts',            [$contact, 'index']);
$router->add('GET',  '/contacts/:id',        [$contact, 'show']);
$router->add('POST', '/contacts/:id/update', [$contact, 'update']);
$router->add('POST', '/contacts/:id/delete', [$contact, 'destroy']);

// Danh mục bài viết
$category = new CategoryController($db);
$router->add('GET',  '/post-categories',            [$category, 'index']);
$router->add('GET',  '/post-categories/:id',        [$category, 'show']);
$router->add('POST', '/post-categories',            [$category, 'store']);
$router->add('POST', '/post-categories/:id/update', [$category, 'update']);
$router->add('POST', '/post-categories/:id/delete', [$category, 'destroy']);

// Bài viết / công thức
$post = new PostController($db);
$router->add('GET',  '/posts',            [$post, 'index']);
$router->add('GET',  '/posts/:id',        [$post, 'show']);
$router->add('POST', '/posts',            [$post, 'store']);
$router->add('POST', '/posts/:id/update', [$post, 'update']);
$router->add('POST', '/posts/:id/delete', [$post, 'destroy']);

// Đánh giá độc giả (testimonials)
$testimonial = new TestimonialController($db);
$router->add('GET',  '/testimonials',            [$testimonial, 'index']);
$router->add('GET',  '/testimonials/:id',        [$testimonial, 'show']);
$router->add('POST', '/testimonials',            [$testimonial, 'store']);
$router->add('POST', '/testimonials/:id/update', [$testimonial, 'update']);
$router->add('POST', '/testimonials/:id/delete', [$testimonial, 'destroy']);

// FAQ
$faq = new FaqController($db);
$router->add('GET',  '/faqs',            [$faq, 'index']);
$router->add('GET',  '/faqs/:id',        [$faq, 'show']);
$router->add('POST', '/faqs',            [$faq, 'store']);
$router->add('POST', '/faqs/:id/update', [$faq, 'update']);
$router->add('POST', '/faqs/:id/delete', [$faq, 'destroy']);

// Hành trình (timeline — trang Về tôi)
$timeline = new TimelineController($db);
$router->add('GET',  '/timeline',            [$timeline, 'index']);
$router->add('GET',  '/timeline/:id',        [$timeline, 'show']);
$router->add('POST', '/timeline',            [$timeline, 'store']);
$router->add('POST', '/timeline/:id/update', [$timeline, 'update']);
$router->add('POST', '/timeline/:id/delete', [$timeline, 'destroy']);

// Thống kê Dashboard
$stats = new StatsController($db);
$router->add('GET', '/stats', [$stats, 'index']);

// Media (thư viện ảnh)
$media = new MediaController($db);
$router->add('GET',  '/media',            [$media, 'index']);
$router->add('POST', '/media/upload',     [$media, 'upload']);
$router->add('POST', '/media/:id/delete', [$media, 'destroy']);

// Upload chung (dùng bởi ImageField) + Unsplash
$upload = new UploadController($db);
$router->add('POST', '/upload', [$upload, 'upload']);

$unsplash = new UnsplashController($db);
$router->add('GET',  '/unsplash',          [$unsplash, 'search']);
$router->add('POST', '/unsplash/download', [$unsplash, 'trackDownload']);

// Public — không cần đăng nhập, website gọi
$pub = new PublicController($db);
$router->add('GET',  '/public/settings',       [$pub, 'settings']);
$router->add('GET',  '/public/hero-slides',    [$pub, 'heroSlides']);
$router->add('GET',  '/public/categories',     [$pub, 'categories']);
$router->add('GET',  '/public/posts',          [$pub, 'posts']);
$router->add('GET',  '/public/posts/:slug',    [$pub, 'postBySlug']);
$router->add('GET',  '/public/latest-recipe',  [$pub, 'latestRecipe']);
$router->add('GET',  '/public/popular-posts',  [$pub, 'popularPosts']);
$router->add('GET',  '/public/testimonials',   [$pub, 'testimonials']);
$router->add('GET',  '/public/faqs',           [$pub, 'faqs']);
$router->add('GET',  '/public/timeline',       [$pub, 'timeline']);
$router->add('POST', '/public/contact',        [$pub, 'submitContact']);

// SEO
$router->add('GET', '/sitemap.xml', [$pub, 'sitemap']);

return $router;
