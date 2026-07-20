<?php

require_once __DIR__ . '/../config.php';
require_once __DIR__ . '/Database.php';
require_once __DIR__ . '/Response.php';
require_once __DIR__ . '/Auth.php';
require_once __DIR__ . '/Router.php';
require_once __DIR__ . '/controllers/AuthController.php';
require_once __DIR__ . '/controllers/PublicController.php';
require_once __DIR__ . '/controllers/StatsController.php';
require_once __DIR__ . '/controllers/SettingsController.php';
require_once __DIR__ . '/controllers/ContactController.php';
require_once __DIR__ . '/controllers/HeroSlideController.php';
require_once __DIR__ . '/controllers/MediaController.php';
require_once __DIR__ . '/controllers/FeatureController.php';
require_once __DIR__ . '/controllers/PricingController.php';
require_once __DIR__ . '/controllers/TestimonialController.php';
require_once __DIR__ . '/controllers/DemoController.php';
require_once __DIR__ . '/controllers/FaqController.php';
require_once __DIR__ . '/controllers/UploadController.php';
require_once __DIR__ . '/controllers/UnsplashController.php';

// -- Helpers --
function bodyJson(): array {
    $raw = file_get_contents('php://input');
    return json_decode($raw, true) ?? [];
}

function slugify(string $text): string {
    $map = ['Ã '=>'a','Ã¡'=>'a','áº£'=>'a','Ã£'=>'a','áº¡'=>'a',
            'Äƒ'=>'a','áº¯'=>'a','áº·'=>'a','áº±'=>'a','áº³'=>'a','áºµ'=>'a',
            'Ã¢'=>'a','áº¥'=>'a','áº§'=>'a','áº©'=>'a','áº«'=>'a','áº­'=>'a',
            'Ä‘'=>'d','Ã¨'=>'e','Ã©'=>'e','áº»'=>'e','áº½'=>'e','áº¹'=>'e',
            'Ãª'=>'e','áº¿'=>'e','á»'=>'e','á»ƒ'=>'e','á»…'=>'e','á»‡'=>'e',
            'Ã¬'=>'i','Ã­'=>'i','á»‰'=>'i','Ä©'=>'i','á»‹'=>'i',
            'Ã²'=>'o','Ã³'=>'o','á»'=>'o','Ãµ'=>'o','á»'=>'o',
            'Ã´'=>'o','á»‘'=>'o','á»“'=>'o','á»•'=>'o','á»—'=>'o','á»™'=>'o',
            'Æ¡'=>'o','á»›'=>'o','á»'=>'o','á»Ÿ'=>'o','á»¡'=>'o','á»£'=>'o',
            'Ã¹'=>'u','Ãº'=>'u','á»§'=>'u','Å©'=>'u','á»¥'=>'u',
            'Æ°'=>'u','á»©'=>'u','á»«'=>'u','á»­'=>'u','á»¯'=>'u','á»±'=>'u',
            'á»³'=>'y','Ã½'=>'y','á»·'=>'y','á»¹'=>'y','á»µ'=>'y'];
    $text = mb_strtolower($text, 'UTF-8');
    $text = strtr($text, $map);
    $text = preg_replace('/[^a-z0-9\s-]/', '', $text);
    $text = preg_replace('/[\s-]+/', '-', trim($text));
    return $text;
}

// â”€â”€ CORS â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
$origin  = $_SERVER['HTTP_ORIGIN'] ?? '';
$allowed = defined('CORS_ORIGINS') ? CORS_ORIGINS : [];
if (in_array($origin, $allowed, true) || APP_ENV === 'development') {
    header('Access-Control-Allow-Origin: ' . ($origin ?: '*'));
} else {
    header('Access-Control-Allow-Origin: ' . APP_URL);
}
header('Access-Control-Allow-Credentials: true');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { http_response_code(204); exit; }

// -- Init -- Auth::start() MUST be before Database::getInstance()
Auth::start();
$db     = Database::getInstance();
$router = new Router();

// â”€â”€ Auth routes â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
$auth = new AuthController($db);
$router->add('POST', '/auth/login',  [$auth, 'login']);
$router->add('POST', '/auth/logout', [$auth, 'logout']);
$router->add('GET',  '/auth/me',     [$auth, 'me']);

// â”€â”€ Stats â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
$stats = new StatsController($db);
$router->add('GET', '/stats', [$stats, 'index']);

// â”€â”€ Settings â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
$settings = new SettingsController($db);
$router->add('GET',  '/settings', [$settings, 'index']);
$router->add('POST', '/settings', [$settings, 'save']);

// â”€â”€ Hero Slides â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
$slide = new HeroSlideController($db);
$router->add('GET',  '/hero-slides',                [$slide, 'index']);
$router->add('POST', '/hero-slides',                [$slide, 'store']);
$router->add('POST', '/hero-slides/reorder',        [$slide, 'reorder']);
$router->add('POST', '/hero-slides/:id/update',     [$slide, 'update']);
$router->add('POST', '/hero-slides/:id/delete',     [$slide, 'destroy']);

// â”€â”€ Features (TÃ­nh nÄƒng sáº£n pháº©m) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
$feature = new FeatureController($db);
$router->add('GET',  '/features',              [$feature, 'index']);
$router->add('POST', '/features',              [$feature, 'store']);
$router->add('GET',  '/features/:id',          [$feature, 'show']);
$router->add('POST', '/features/:id/update',   [$feature, 'update']);
$router->add('POST', '/features/:id/delete',   [$feature, 'destroy']);

// â”€â”€ Pricing Plans (Báº£ng giÃ¡) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
$pricing = new PricingController($db);
$router->add('GET',  '/pricing',              [$pricing, 'index']);
$router->add('POST', '/pricing',              [$pricing, 'store']);
$router->add('GET',  '/pricing/:id',          [$pricing, 'show']);
$router->add('POST', '/pricing/:id/update',   [$pricing, 'update']);
$router->add('POST', '/pricing/:id/delete',   [$pricing, 'destroy']);

// â”€â”€ Testimonials (ÄÃ¡nh giÃ¡ khÃ¡ch hÃ ng) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
$testi = new TestimonialController($db);
$router->add('GET',  '/testimonials',              [$testi, 'index']);
$router->add('POST', '/testimonials',              [$testi, 'store']);
$router->add('POST', '/testimonials/:id/update',   [$testi, 'update']);
$router->add('POST', '/testimonials/:id/delete',   [$testi, 'destroy']);

// â”€â”€ Contacts (LiÃªn há»‡) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
$contact = new ContactController($db);
$router->add('GET',  '/contacts',              [$contact, 'index']);
$router->add('GET',  '/contacts/:id',          [$contact, 'show']);
$router->add('POST', '/contacts/:id/update',   [$contact, 'update']);
$router->add('POST', '/contacts/:id/delete',   [$contact, 'destroy']);

// â”€â”€ Demo Requests (Äáº·t lá»‹ch demo) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
$demo = new DemoController($db);
$router->add('GET',  '/demos',              [$demo, 'index']);
$router->add('GET',  '/demos/:id',          [$demo, 'show']);
$router->add('POST', '/demos/:id/update',   [$demo, 'update']);
$router->add('POST', '/demos/:id/delete',   [$demo, 'destroy']);

// â”€â”€ FAQs â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
$faq = new FaqController($db);
$router->add('GET',  '/faqs',              [$faq, 'index']);
$router->add('POST', '/faqs',              [$faq, 'store']);
$router->add('POST', '/faqs/:id/update',   [$faq, 'update']);
$router->add('POST', '/faqs/:id/delete',   [$faq, 'destroy']);

// â”€â”€ Media â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
$media = new MediaController($db);
$router->add('GET',  '/media',              [$media, 'index']);
$router->add('POST', '/media/upload',       [$media, 'upload']);
$router->add('POST', '/media/:id/delete',   [$media, 'destroy']);

// â”€â”€ PUBLIC endpoints (no auth) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
$pub = new PublicController($db);
$router->add('GET',  '/public/settings',     [$pub, 'settings']);
$router->add('GET',  '/public/hero-slides',  [$pub, 'heroSlides']);
$router->add('GET',  '/public/features',     [$pub, 'features']);
$router->add('GET',  '/public/pricing',      [$pub, 'pricing']);
$router->add('GET',  '/public/testimonials', [$pub, 'testimonials']);
$router->add('GET',  '/public/faqs',         [$pub, 'faqs']);
$router->add('POST', '/public/contact',      [$pub, 'submitContact']);
$router->add('POST', '/public/demo',         [$pub, 'submitDemo']);
$router->add('GET',  '/sitemap.xml',         [$pub, 'sitemap']);


// ── UPLOAD & UNSPLASH ─────────────────────────────────────────────────────────
$upload   = new UploadController($db);
$router->add('POST', '/upload',   [$upload,   'upload']);

$unsplash = new UnsplashController($db);
$router->add('GET',  '/unsplash', [$unsplash, 'search']);
$router->add('POST', '/unsplash', [$unsplash, 'trackDownload']);

return $router;


