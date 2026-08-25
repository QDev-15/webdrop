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
require_once __DIR__ . '/controllers/UnitTypeController.php';
require_once __DIR__ . '/controllers/AmenityController.php';
require_once __DIR__ . '/controllers/NearbyAmenityController.php';
require_once __DIR__ . '/controllers/PaymentPhaseController.php';
require_once __DIR__ . '/controllers/SalesPolicyController.php';
require_once __DIR__ . '/controllers/FaqController.php';
require_once __DIR__ . '/controllers/TestimonialController.php';
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
$router->add('GET',  '/users',                    [$user, 'index']);
$router->add('POST', '/users',                    [$user, 'store']);
$router->add('POST', '/users/:id/update',         [$user, 'update']);
$router->add('POST', '/users/:id/delete',         [$user, 'destroy']);
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

// ─── Loại căn hộ ──────────────────────────────────────────────────────────────
$unitTypes = new UnitTypeController($db);
$router->add('GET',  '/unit-types',            [$unitTypes, 'index']);
$router->add('GET',  '/unit-types/:id',        [$unitTypes, 'show']);
$router->add('POST', '/unit-types',            [$unitTypes, 'store']);
$router->add('POST', '/unit-types/:id/update', [$unitTypes, 'update']);
$router->add('POST', '/unit-types/:id/delete', [$unitTypes, 'destroy']);

// ─── Tiện ích nội khu ─────────────────────────────────────────────────────────
$amenities = new AmenityController($db);
$router->add('GET',  '/amenities',            [$amenities, 'index']);
$router->add('GET',  '/amenities/:id',        [$amenities, 'show']);
$router->add('POST', '/amenities',            [$amenities, 'store']);
$router->add('POST', '/amenities/:id/update', [$amenities, 'update']);
$router->add('POST', '/amenities/:id/delete', [$amenities, 'destroy']);

// ─── Tiện ích xung quanh ──────────────────────────────────────────────────────
$nearby = new NearbyAmenityController($db);
$router->add('GET',  '/nearby-amenities',            [$nearby, 'index']);
$router->add('GET',  '/nearby-amenities/:id',        [$nearby, 'show']);
$router->add('POST', '/nearby-amenities',            [$nearby, 'store']);
$router->add('POST', '/nearby-amenities/:id/update', [$nearby, 'update']);
$router->add('POST', '/nearby-amenities/:id/delete', [$nearby, 'destroy']);

// ─── Tiến độ thanh toán ───────────────────────────────────────────────────────
$paymentPhases = new PaymentPhaseController($db);
$router->add('GET',  '/payment-phases',            [$paymentPhases, 'index']);
$router->add('GET',  '/payment-phases/:id',        [$paymentPhases, 'show']);
$router->add('POST', '/payment-phases',            [$paymentPhases, 'store']);
$router->add('POST', '/payment-phases/:id/update', [$paymentPhases, 'update']);
$router->add('POST', '/payment-phases/:id/delete', [$paymentPhases, 'destroy']);

// ─── Chính sách bán hàng ──────────────────────────────────────────────────────
$salesPolicies = new SalesPolicyController($db);
$router->add('GET',  '/sales-policies',            [$salesPolicies, 'index']);
$router->add('GET',  '/sales-policies/:id',        [$salesPolicies, 'show']);
$router->add('POST', '/sales-policies',            [$salesPolicies, 'store']);
$router->add('POST', '/sales-policies/:id/update', [$salesPolicies, 'update']);
$router->add('POST', '/sales-policies/:id/delete', [$salesPolicies, 'destroy']);

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
$router->add('GET',  '/public/settings',          [$pub, 'settings']);
$router->add('GET',  '/public/hero-slides',       [$pub, 'heroSlides']);
$router->add('GET',  '/public/unit-types',        [$pub, 'unitTypes']);
$router->add('GET',  '/public/unit-types/:slug',  [$pub, 'unitTypeBySlug']);
$router->add('GET',  '/public/amenities',         [$pub, 'amenities']);
$router->add('GET',  '/public/nearby-amenities',  [$pub, 'nearbyAmenities']);
$router->add('GET',  '/public/payment-phases',    [$pub, 'paymentPhases']);
$router->add('GET',  '/public/sales-policies',    [$pub, 'salesPolicies']);
$router->add('GET',  '/public/faqs',              [$pub, 'faqs']);
$router->add('GET',  '/public/testimonials',      [$pub, 'testimonials']);
$router->add('POST', '/public/contact',           [$pub, 'submitContact']);
$router->add('GET',  '/sitemap.xml',              [$pub, 'sitemap']);
