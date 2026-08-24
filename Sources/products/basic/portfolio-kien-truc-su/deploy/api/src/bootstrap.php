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
require_once __DIR__ . '/controllers/ProjectController.php';
require_once __DIR__ . '/controllers/TestimonialController.php';
require_once __DIR__ . '/controllers/FaqController.php';
require_once __DIR__ . '/controllers/PricingController.php';
require_once __DIR__ . '/controllers/TimelineController.php';
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
$router->add('GET',  '/users',                       [$user, 'index']);
$router->add('POST', '/users',                       [$user, 'store']);
$router->add('POST', '/users/:id/update',            [$user, 'update']);
$router->add('POST', '/users/:id/delete',            [$user, 'destroy']);
$router->add('POST', '/users/:id/change-password',   [$user, 'changePassword']);

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
$router->add('POST', '/unsplash',          [$unsplash, 'trackDownload']);
$router->add('POST', '/unsplash/download', [$unsplash, 'trackDownload']);

// ─── Extension: Dự án (case study kiến trúc) ────────────────────────────────
$project = new ProjectController($db);
$router->add('GET',  '/projects',            [$project, 'index']);
$router->add('GET',  '/projects/:id',        [$project, 'show']);
$router->add('POST', '/projects',            [$project, 'store']);
$router->add('POST', '/projects/:id/update', [$project, 'update']);
$router->add('POST', '/projects/:id/delete', [$project, 'destroy']);

// ─── Extension: Đánh giá khách hàng ─────────────────────────────────────────
$testimonial = new TestimonialController($db);
$router->add('GET',  '/testimonials',            [$testimonial, 'index']);
$router->add('GET',  '/testimonials/:id',        [$testimonial, 'show']);
$router->add('POST', '/testimonials',            [$testimonial, 'store']);
$router->add('POST', '/testimonials/:id/update', [$testimonial, 'update']);
$router->add('POST', '/testimonials/:id/delete', [$testimonial, 'destroy']);

// ─── Extension: FAQ (Câu hỏi thường gặp) ───────────────────────────────────
$faq = new FaqController($db);
$router->add('GET',  '/faqs',            [$faq, 'index']);
$router->add('GET',  '/faqs/:id',        [$faq, 'show']);
$router->add('POST', '/faqs',            [$faq, 'store']);
$router->add('POST', '/faqs/:id/update', [$faq, 'update']);
$router->add('POST', '/faqs/:id/delete', [$faq, 'destroy']);

// ─── Extension: Pricing Plans (Bảng giá dịch vụ) ───────────────────────────────
$pricing = new PricingController($db);
$router->add('GET',  '/pricing-plans',            [$pricing, 'index']);
$router->add('GET',  '/pricing-plans/:id',        [$pricing, 'show']);
$router->add('POST', '/pricing-plans',            [$pricing, 'store']);
$router->add('POST', '/pricing-plans/:id/update', [$pricing, 'update']);
$router->add('POST', '/pricing-plans/:id/delete', [$pricing, 'destroy']);

// ─── Extension: Timeline (Hành trình) ──────────────────────────────────────
$timeline = new TimelineController($db);
$router->add('GET',  '/timeline',            [$timeline, 'index']);
$router->add('GET',  '/timeline/:id',        [$timeline, 'show']);
$router->add('POST', '/timeline',            [$timeline, 'store']);
$router->add('POST', '/timeline/:id/update', [$timeline, 'update']);
$router->add('POST', '/timeline/:id/delete', [$timeline, 'destroy']);

// ─── Admin Stats ────────────────────────────────────────────────────────────
$stats = new StatsController($db);
$router->add('GET', '/stats', [$stats, 'index']);

// ─── Public (không cần đăng nhập) ─────────────────────────────────────────────
$pub = new PublicController($db);
$router->add('GET',  '/public/settings',          [$pub, 'settings']);
$router->add('GET',  '/public/hero-slides',       [$pub, 'heroSlides']);
$router->add('GET',  '/public/projects',          [$pub, 'projects']);
$router->add('GET',  '/public/featured-projects', [$pub, 'featuredProjects']);
$router->add('GET',  '/public/projects/:slug',    [$pub, 'projectBySlug']);
$router->add('GET',  '/public/testimonials',      [$pub, 'testimonials']);
$router->add('GET',  '/public/faqs',              [$pub, 'faqs']);
$router->add('GET',  '/public/pricing-plans',     [$pub, 'pricingPlans']);
$router->add('GET',  '/public/timeline',          [$pub, 'timelineItems']);
$router->add('POST', '/public/contact',           [$pub, 'submitContact']);
$router->add('GET',  '/sitemap.xml',              [$pub, 'sitemap']);

return $router;
