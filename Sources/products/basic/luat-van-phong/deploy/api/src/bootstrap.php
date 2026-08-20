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
require_once __DIR__ . '/controllers/ServiceController.php';
require_once __DIR__ . '/controllers/LawyerController.php';
require_once __DIR__ . '/controllers/CaseController.php';
require_once __DIR__ . '/controllers/FaqController.php';
require_once __DIR__ . '/controllers/PricingController.php';
require_once __DIR__ . '/controllers/TestimonialController.php';
require_once __DIR__ . '/controllers/ConsultationController.php';
require_once __DIR__ . '/controllers/UploadController.php';
require_once __DIR__ . '/controllers/UnsplashController.php';

// ── Helpers ─────────────────────────────────────────────────────────────────
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
$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
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
Auth::start();
$db     = Database::getInstance();
$router = new Router();

// ── Auth routes ───────────────────────────────────────────────────────────────
$auth = new AuthController($db);
$router->add('POST', '/auth/login',   [$auth, 'login']);
$router->add('POST', '/auth/logout',  [$auth, 'logout']);
$router->add('GET',  '/auth/me',      [$auth, 'me']);
$router->add('POST', '/auth/profile', [$auth, 'updateProfile']);

// ── Stats ─────────────────────────────────────────────────────────────────────
$stats = new StatsController($db);
$router->add('GET', '/stats', [$stats, 'index']);

// ── Settings ──────────────────────────────────────────────────────────────────
$settings = new SettingsController($db);
$router->add('GET',  '/settings',     [$settings, 'index']);
$router->add('POST', '/settings',     [$settings, 'save']);

// ── Hero Slides ───────────────────────────────────────────────────────────────
$slide = new HeroSlideController($db);
$router->add('GET',    '/hero-slides',          [$slide, 'index']);
$router->add('POST',   '/hero-slides',          [$slide, 'store']);
$router->add('PUT',    '/hero-slides/:id',      [$slide, 'update']);
$router->add('DELETE', '/hero-slides/:id',      [$slide, 'destroy']);
$router->add('POST',   '/hero-slides/reorder',  [$slide, 'reorder']);

// ── Services (Lĩnh vực hành nghề) ────────────────────────────────────────────
$service = new ServiceController($db);
$router->add('GET',    '/services',         [$service, 'index']);
$router->add('POST',   '/services',         [$service, 'store']);
$router->add('GET',    '/services/:id',     [$service, 'show']);
$router->add('PUT',    '/services/:id',     [$service, 'update']);
$router->add('DELETE', '/services/:id',     [$service, 'destroy']);

// ── Lawyers (Luật sư) ─────────────────────────────────────────────────────────
$lawyer = new LawyerController($db);
$router->add('GET',    '/lawyers',          [$lawyer, 'index']);
$router->add('POST',   '/lawyers',          [$lawyer, 'store']);
$router->add('GET',    '/lawyers/:id',      [$lawyer, 'show']);
$router->add('PUT',    '/lawyers/:id',      [$lawyer, 'update']);
$router->add('DELETE', '/lawyers/:id',      [$lawyer, 'destroy']);
$router->add('POST',   '/lawyers/reorder',  [$lawyer, 'reorder']);

// ── Cases (Vụ việc) ───────────────────────────────────────────────────────────
$case = new CaseController($db);
$router->add('GET',    '/cases',            [$case, 'index']);
$router->add('POST',   '/cases',            [$case, 'store']);
$router->add('GET',    '/cases/:id',        [$case, 'show']);
$router->add('PUT',    '/cases/:id',        [$case, 'update']);
$router->add('DELETE', '/cases/:id',        [$case, 'destroy']);

// ── FAQ (Câu hỏi thường gặp) ──────────────────────────────────────────────────
$faq = new FaqController($db);
$router->add('GET',    '/faqs',         [$faq, 'index']);
$router->add('POST',   '/faqs',         [$faq, 'store']);
$router->add('PUT',    '/faqs/:id',     [$faq, 'update']);
$router->add('DELETE', '/faqs/:id',     [$faq, 'destroy']);

// ── Pricing Plans (Bảng giá) ──────────────────────────────────────────────────
$pricing = new PricingController($db);
$router->add('GET',    '/pricing-plans',         [$pricing, 'index']);
$router->add('POST',   '/pricing-plans',         [$pricing, 'store']);
$router->add('PUT',    '/pricing-plans/:id',     [$pricing, 'update']);
$router->add('DELETE', '/pricing-plans/:id',     [$pricing, 'destroy']);

// ── Testimonials (Đánh giá) ───────────────────────────────────────────────────
$testi = new TestimonialController($db);
$router->add('GET',    '/testimonials',         [$testi, 'index']);
$router->add('POST',   '/testimonials',         [$testi, 'store']);
$router->add('PUT',    '/testimonials/:id',     [$testi, 'update']);
$router->add('DELETE', '/testimonials/:id',     [$testi, 'destroy']);

// ── Contacts (Liên hệ) ────────────────────────────────────────────────────────
$contact = new ContactController($db);
$router->add('GET',  '/contacts',          [$contact, 'index']);
$router->add('GET',  '/contacts/:id',      [$contact, 'show']);
$router->add('PUT',  '/contacts/:id',      [$contact, 'update']);
$router->add('DELETE','/contacts/:id',     [$contact, 'destroy']);

// ── Consultations (Đăng ký tư vấn) ───────────────────────────────────────────
$consult = new ConsultationController($db);
$router->add('GET',  '/consultations',         [$consult, 'index']);
$router->add('GET',  '/consultations/:id',     [$consult, 'show']);
$router->add('PUT',  '/consultations/:id',     [$consult, 'update']);
$router->add('DELETE','/consultations/:id',    [$consult, 'destroy']);

// ── Media ─────────────────────────────────────────────────────────────────────
$media = new MediaController($db);
$router->add('GET',    '/media',        [$media, 'index']);
$router->add('POST',   '/media/upload', [$media, 'upload']);
$router->add('DELETE', '/media/:id',    [$media, 'destroy']);

// ── PUBLIC endpoints (no auth) ────────────────────────────────────────────────
$pub = new PublicController($db);
$router->add('GET',  '/public/settings',      [$pub, 'settings']);
$router->add('GET',  '/public/hero-slides',   [$pub, 'heroSlides']);
$router->add('GET',  '/public/services',      [$pub, 'services']);
$router->add('GET',  '/public/lawyers',       [$pub, 'lawyers']);
$router->add('GET',  '/public/cases',         [$pub, 'cases']);
$router->add('GET',  '/public/cases/:slug',   [$pub, 'caseBySlug']);
$router->add('GET',  '/public/testimonials',  [$pub, 'testimonials']);
$router->add('GET',  '/public/faqs',          [$pub, 'faqs']);
$router->add('GET',  '/public/pricing-plans', [$pub, 'pricingPlans']);
$router->add('POST', '/public/contact',       [$pub, 'submitContact']);
$router->add('POST', '/public/consultation',  [$pub, 'submitConsultation']);
$router->add('GET',  '/sitemap.xml',          [$pub, 'sitemap']);


// ?? UPLOAD & UNSPLASH ?????????????????????????????????????????????????????????
$upload   = new UploadController($db);
$router->add('POST', '/upload',   [$upload,   'upload']);

$unsplash = new UnsplashController($db);
$router->add('GET',  '/unsplash', [$unsplash, 'search']);
$router->add('POST', '/unsplash', [$unsplash, 'trackDownload']);

return $router;


