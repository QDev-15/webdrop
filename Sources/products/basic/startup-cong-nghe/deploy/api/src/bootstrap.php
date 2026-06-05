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

// ── Helpers ──────────────────────────────────────────────────────────────────
function bodyJson(): array {
    $raw = file_get_contents('php://input');
    return json_decode($raw, true) ?? [];
}

function slugify(string $text): string {
    $map = ['à'=>'a','á'=>'a','ả'=>'a','ã'=>'a','ạ'=>'a',
            'ă'=>'a','ắ'=>'a','ặ'=>'a','ằ'=>'a','ẳ'=>'a','ẵ'=>'a',
            'â'=>'a','ấ'=>'a','ầ'=>'a','ẩ'=>'a','ẫ'=>'a','ậ'=>'a',
            'đ'=>'d','è'=>'e','é'=>'e','ẻ'=>'e','ẽ'=>'e','ẹ'=>'e',
            'ê'=>'e','ế'=>'e','ề'=>'e','ể'=>'e','ễ'=>'e','ệ'=>'e',
            'ì'=>'i','í'=>'i','ỉ'=>'i','ĩ'=>'i','ị'=>'i',
            'ò'=>'o','ó'=>'o','ỏ'=>'o','õ'=>'o','ọ'=>'o',
            'ô'=>'o','ố'=>'o','ồ'=>'o','ổ'=>'o','ỗ'=>'o','ộ'=>'o',
            'ơ'=>'o','ớ'=>'o','ờ'=>'o','ở'=>'o','ỡ'=>'o','ợ'=>'o',
            'ù'=>'u','ú'=>'u','ủ'=>'u','ũ'=>'u','ụ'=>'u',
            'ư'=>'u','ứ'=>'u','ừ'=>'u','ử'=>'u','ữ'=>'u','ự'=>'u',
            'ỳ'=>'y','ý'=>'y','ỷ'=>'y','ỹ'=>'y','ỵ'=>'y'];
    $text = mb_strtolower($text, 'UTF-8');
    $text = strtr($text, $map);
    $text = preg_replace('/[^a-z0-9\s-]/', '', $text);
    $text = preg_replace('/[\s-]+/', '-', trim($text));
    return $text;
}

// ── CORS ─────────────────────────────────────────────────────────────────────
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

// ── Init ─────────────────────────────────────────────────────────────────────
$db     = Database::getInstance();
$router = new Router();

// ── Auth routes ───────────────────────────────────────────────────────────────
$auth = new AuthController($db);
$router->add('POST', '/auth/login',  [$auth, 'login']);
$router->add('POST', '/auth/logout', [$auth, 'logout']);
$router->add('GET',  '/auth/me',     [$auth, 'me']);

// ── Stats ─────────────────────────────────────────────────────────────────────
$stats = new StatsController($db);
$router->add('GET', '/stats', [$stats, 'index']);

// ── Settings ──────────────────────────────────────────────────────────────────
$settings = new SettingsController($db);
$router->add('GET',  '/settings', [$settings, 'index']);
$router->add('POST', '/settings', [$settings, 'save']);

// ── Hero Slides ───────────────────────────────────────────────────────────────
$slide = new HeroSlideController($db);
$router->add('GET',  '/hero-slides',                [$slide, 'index']);
$router->add('POST', '/hero-slides',                [$slide, 'store']);
$router->add('POST', '/hero-slides/reorder',        [$slide, 'reorder']);
$router->add('POST', '/hero-slides/:id/update',     [$slide, 'update']);
$router->add('POST', '/hero-slides/:id/delete',     [$slide, 'destroy']);

// ── Features (Tính năng sản phẩm) ────────────────────────────────────────────
$feature = new FeatureController($db);
$router->add('GET',  '/features',              [$feature, 'index']);
$router->add('POST', '/features',              [$feature, 'store']);
$router->add('GET',  '/features/:id',          [$feature, 'show']);
$router->add('POST', '/features/:id/update',   [$feature, 'update']);
$router->add('POST', '/features/:id/delete',   [$feature, 'destroy']);

// ── Pricing Plans (Bảng giá) ─────────────────────────────────────────────────
$pricing = new PricingController($db);
$router->add('GET',  '/pricing',              [$pricing, 'index']);
$router->add('POST', '/pricing',              [$pricing, 'store']);
$router->add('GET',  '/pricing/:id',          [$pricing, 'show']);
$router->add('POST', '/pricing/:id/update',   [$pricing, 'update']);
$router->add('POST', '/pricing/:id/delete',   [$pricing, 'destroy']);

// ── Testimonials (Đánh giá khách hàng) ───────────────────────────────────────
$testi = new TestimonialController($db);
$router->add('GET',  '/testimonials',              [$testi, 'index']);
$router->add('POST', '/testimonials',              [$testi, 'store']);
$router->add('POST', '/testimonials/:id/update',   [$testi, 'update']);
$router->add('POST', '/testimonials/:id/delete',   [$testi, 'destroy']);

// ── Contacts (Liên hệ) ────────────────────────────────────────────────────────
$contact = new ContactController($db);
$router->add('GET',  '/contacts',              [$contact, 'index']);
$router->add('GET',  '/contacts/:id',          [$contact, 'show']);
$router->add('POST', '/contacts/:id/update',   [$contact, 'update']);
$router->add('POST', '/contacts/:id/delete',   [$contact, 'destroy']);

// ── Demo Requests (Đặt lịch demo) ────────────────────────────────────────────
$demo = new DemoController($db);
$router->add('GET',  '/demos',              [$demo, 'index']);
$router->add('GET',  '/demos/:id',          [$demo, 'show']);
$router->add('POST', '/demos/:id/update',   [$demo, 'update']);
$router->add('POST', '/demos/:id/delete',   [$demo, 'destroy']);

// ── FAQs ─────────────────────────────────────────────────────────────────────
$faq = new FaqController($db);
$router->add('GET',  '/faqs',              [$faq, 'index']);
$router->add('POST', '/faqs',              [$faq, 'store']);
$router->add('POST', '/faqs/:id/update',   [$faq, 'update']);
$router->add('POST', '/faqs/:id/delete',   [$faq, 'destroy']);

// ── Media ─────────────────────────────────────────────────────────────────────
$media = new MediaController($db);
$router->add('GET',  '/media',              [$media, 'index']);
$router->add('POST', '/media/upload',       [$media, 'upload']);
$router->add('POST', '/media/:id/delete',   [$media, 'destroy']);

// ── PUBLIC endpoints (no auth) ────────────────────────────────────────────────
$pub = new PublicController($db);
$router->add('GET',  '/public/settings',     [$pub, 'settings']);
$router->add('GET',  '/public/hero-slides',  [$pub, 'heroSlides']);
$router->add('GET',  '/public/features',     [$pub, 'features']);
$router->add('GET',  '/public/pricing',      [$pub, 'pricing']);
$router->add('GET',  '/public/testimonials', [$pub, 'testimonials']);
$router->add('GET',  '/public/faqs',         [$pub, 'faqs']);
$router->add('POST', '/public/contact',      [$pub, 'submitContact']);
$router->add('POST', '/public/demo',         [$pub, 'submitDemo']);

return $router;
