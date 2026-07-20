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
require_once __DIR__ . '/controllers/TestimonialController.php';
require_once __DIR__ . '/controllers/ConsultationController.php';
require_once __DIR__ . '/controllers/UploadController.php';
require_once __DIR__ . '/controllers/UnsplashController.php';

// â”€â”€ Helpers â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
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

// â”€â”€ Init â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
Auth::start();
$db     = Database::getInstance();
$router = new Router();

// â”€â”€ Auth routes â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
$auth = new AuthController($db);
$router->add('POST', '/auth/login',   [$auth, 'login']);
$router->add('POST', '/auth/logout',  [$auth, 'logout']);
$router->add('GET',  '/auth/me',      [$auth, 'me']);
$router->add('POST', '/auth/profile', [$auth, 'updateProfile']);

// â”€â”€ Stats â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
$stats = new StatsController($db);
$router->add('GET', '/stats', [$stats, 'index']);

// â”€â”€ Settings â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
$settings = new SettingsController($db);
$router->add('GET',  '/settings',     [$settings, 'index']);
$router->add('POST', '/settings',     [$settings, 'save']);

// â”€â”€ Hero Slides â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
$slide = new HeroSlideController($db);
$router->add('GET',    '/hero-slides',          [$slide, 'index']);
$router->add('POST',   '/hero-slides',          [$slide, 'store']);
$router->add('PUT',    '/hero-slides/:id',      [$slide, 'update']);
$router->add('DELETE', '/hero-slides/:id',      [$slide, 'destroy']);
$router->add('POST',   '/hero-slides/reorder',  [$slide, 'reorder']);

// â”€â”€ Services (LÄ©nh vá»±c hÃ nh nghá») â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
$service = new ServiceController($db);
$router->add('GET',    '/services',         [$service, 'index']);
$router->add('POST',   '/services',         [$service, 'store']);
$router->add('GET',    '/services/:id',     [$service, 'show']);
$router->add('PUT',    '/services/:id',     [$service, 'update']);
$router->add('DELETE', '/services/:id',     [$service, 'destroy']);

// â”€â”€ Lawyers (Luáº­t sÆ°) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
$lawyer = new LawyerController($db);
$router->add('GET',    '/lawyers',          [$lawyer, 'index']);
$router->add('POST',   '/lawyers',          [$lawyer, 'store']);
$router->add('GET',    '/lawyers/:id',      [$lawyer, 'show']);
$router->add('PUT',    '/lawyers/:id',      [$lawyer, 'update']);
$router->add('DELETE', '/lawyers/:id',      [$lawyer, 'destroy']);
$router->add('POST',   '/lawyers/reorder',  [$lawyer, 'reorder']);

// â”€â”€ Cases (Vá»¥ viá»‡c) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
$case = new CaseController($db);
$router->add('GET',    '/cases',            [$case, 'index']);
$router->add('POST',   '/cases',            [$case, 'store']);
$router->add('GET',    '/cases/:id',        [$case, 'show']);
$router->add('PUT',    '/cases/:id',        [$case, 'update']);
$router->add('DELETE', '/cases/:id',        [$case, 'destroy']);

// â”€â”€ Testimonials (ÄÃ¡nh giÃ¡) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
$testi = new TestimonialController($db);
$router->add('GET',    '/testimonials',         [$testi, 'index']);
$router->add('POST',   '/testimonials',         [$testi, 'store']);
$router->add('PUT',    '/testimonials/:id',     [$testi, 'update']);
$router->add('DELETE', '/testimonials/:id',     [$testi, 'destroy']);

// â”€â”€ Contacts (LiÃªn há»‡) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
$contact = new ContactController($db);
$router->add('GET',  '/contacts',          [$contact, 'index']);
$router->add('GET',  '/contacts/:id',      [$contact, 'show']);
$router->add('PUT',  '/contacts/:id',      [$contact, 'update']);
$router->add('DELETE','/contacts/:id',     [$contact, 'destroy']);

// â”€â”€ Consultations (ÄÄƒng kÃ½ tÆ° váº¥n) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
$consult = new ConsultationController($db);
$router->add('GET',  '/consultations',         [$consult, 'index']);
$router->add('GET',  '/consultations/:id',     [$consult, 'show']);
$router->add('PUT',  '/consultations/:id',     [$consult, 'update']);
$router->add('DELETE','/consultations/:id',    [$consult, 'destroy']);

// â”€â”€ Media â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
$media = new MediaController($db);
$router->add('GET',    '/media',        [$media, 'index']);
$router->add('POST',   '/media/upload', [$media, 'upload']);
$router->add('DELETE', '/media/:id',    [$media, 'destroy']);

// â”€â”€ PUBLIC endpoints (no auth) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
$pub = new PublicController($db);
$router->add('GET',  '/public/settings',      [$pub, 'settings']);
$router->add('GET',  '/public/hero-slides',   [$pub, 'heroSlides']);
$router->add('GET',  '/public/services',      [$pub, 'services']);
$router->add('GET',  '/public/lawyers',       [$pub, 'lawyers']);
$router->add('GET',  '/public/cases',         [$pub, 'cases']);
$router->add('GET',  '/public/testimonials',  [$pub, 'testimonials']);
$router->add('POST', '/public/contact',       [$pub, 'submitContact']);
$router->add('POST', '/public/consultation',  [$pub, 'submitConsultation']);
$router->add('GET',  '/sitemap.xml',          [$pub, 'sitemap']);


// ── UPLOAD & UNSPLASH ─────────────────────────────────────────────────────────
$upload   = new UploadController($db);
$router->add('POST', '/upload',   [$upload,   'upload']);

$unsplash = new UnsplashController($db);
$router->add('GET',  '/unsplash', [$unsplash, 'search']);
$router->add('POST', '/unsplash', [$unsplash, 'trackDownload']);

return $router;


