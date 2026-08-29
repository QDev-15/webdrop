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
require_once __DIR__ . '/controllers/PropertyController.php';
require_once __DIR__ . '/controllers/AgentController.php';
require_once __DIR__ . '/controllers/ProjectController.php';
require_once __DIR__ . '/controllers/TestimonialController.php';
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
$router->add('GET',  '/settings', [$settings, 'index']);
$router->add('POST', '/settings', [$settings, 'update']);

// ─── Hero Slides ──────────────────────────────────────────────────────────────
$slides = new HeroSlideController($db);
$router->add('GET',  '/hero-slides',             [$slides, 'index']);
$router->add('GET',  '/hero-slides/:id',         [$slides, 'show']);
$router->add('POST', '/hero-slides',             [$slides, 'store']);
$router->add('POST', '/hero-slides/:id/update',  [$slides, 'update']);
$router->add('POST', '/hero-slides/:id/delete',  [$slides, 'destroy']);
$router->add('POST', '/hero-slides/reorder',     [$slides, 'reorder']);

// ─── Contacts ─────────────────────────────────────────────────────────────────
$contacts = new ContactController($db);
$router->add('GET',  '/contacts',            [$contacts, 'index']);
$router->add('GET',  '/contacts/:id',        [$contacts, 'show']);
$router->add('POST', '/contacts/:id/update', [$contacts, 'update']);
$router->add('POST', '/contacts/:id/delete', [$contacts, 'destroy']);

// ─── Media ────────────────────────────────────────────────────────────────────
$media = new MediaController($db);
$router->add('GET',  '/media',            [$media, 'index']);
$router->add('POST', '/media/upload',     [$media, 'upload']);
$router->add('POST', '/media/:id/delete', [$media, 'destroy']);

// ─── Upload (ImageField) + Unsplash ───────────────────────────────────────────
$upload = new UploadController($db);
$router->add('POST', '/upload', [$upload, 'upload']);
$unsplash = new UnsplashController($db);
$router->add('GET',  '/unsplash',          [$unsplash, 'search']);
$router->add('POST', '/unsplash/download', [$unsplash, 'trackDownload']);

// ─── Bất động sản (tin đăng) ───────────────────────────────────────────────────
$property = new PropertyController($db);
$router->add('GET',  '/properties',            [$property, 'index']);
$router->add('GET',  '/properties/:id',        [$property, 'show']);
$router->add('POST', '/properties',            [$property, 'store']);
$router->add('POST', '/properties/:id/update', [$property, 'update']);
$router->add('POST', '/properties/:id/delete', [$property, 'destroy']);

// ─── Đội ngũ môi giới ─────────────────────────────────────────────────────────
$agent = new AgentController($db);
$router->add('GET',  '/agents',            [$agent, 'index']);
$router->add('GET',  '/agents/:id',        [$agent, 'show']);
$router->add('POST', '/agents',            [$agent, 'store']);
$router->add('POST', '/agents/:id/update', [$agent, 'update']);
$router->add('POST', '/agents/:id/delete', [$agent, 'destroy']);

// ─── Dự án đang phân phối ─────────────────────────────────────────────────────
$project = new ProjectController($db);
$router->add('GET',  '/projects',            [$project, 'index']);
$router->add('GET',  '/projects/:id',        [$project, 'show']);
$router->add('POST', '/projects',            [$project, 'store']);
$router->add('POST', '/projects/:id/update', [$project, 'update']);
$router->add('POST', '/projects/:id/delete', [$project, 'destroy']);

// ─── FAQ ──────────────────────────────────────────────────────────────────────
$faqs = new FaqController($db);
$router->add('GET',  '/faqs',            [$faqs, 'index']);
$router->add('GET',  '/faqs/:id',        [$faqs, 'show']);
$router->add('POST', '/faqs',            [$faqs, 'store']);
$router->add('POST', '/faqs/:id/update', [$faqs, 'update']);
$router->add('POST', '/faqs/:id/delete', [$faqs, 'destroy']);

// ─── Testimonials ─────────────────────────────────────────────────────────────
$testimonials = new TestimonialController($db);
$router->add('GET',  '/testimonials',            [$testimonials, 'index']);
$router->add('GET',  '/testimonials/:id',        [$testimonials, 'show']);
$router->add('POST', '/testimonials',            [$testimonials, 'store']);
$router->add('POST', '/testimonials/:id/update', [$testimonials, 'update']);
$router->add('POST', '/testimonials/:id/delete', [$testimonials, 'destroy']);

// ─── Stats (Dashboard) ────────────────────────────────────────────────────────
$stats = new StatsController($db);
$router->add('GET', '/stats', [$stats, 'index']);

// ─── Public (không cần auth — website gọi) ────────────────────────────────────
$pub = new PublicController($db);
$router->add('GET',  '/public/settings',           [$pub, 'settings']);
$router->add('GET',  '/public/hero-slides',        [$pub, 'heroSlides']);
$router->add('GET',  '/public/properties',         [$pub, 'properties']);
$router->add('GET',  '/public/properties/:slug',   [$pub, 'propertyBySlug']);
$router->add('GET',  '/public/agents',             [$pub, 'agents']);
$router->add('GET',  '/public/projects',           [$pub, 'projects']);
$router->add('GET',  '/public/testimonials',       [$pub, 'testimonials']);
$router->add('GET',  '/public/faqs',               [$pub, 'faqs']);
$router->add('POST', '/public/contact',            [$pub, 'submitContact']);
$router->add('GET',  '/sitemap.xml',               [$pub, 'sitemap']);
