<?php
declare(strict_types=1);

require_once __DIR__ . '/Database.php';
require_once __DIR__ . '/Router.php';
require_once __DIR__ . '/Auth.php';
require_once __DIR__ . '/Response.php';
require_once __DIR__ . '/controllers/AuthController.php';
require_once __DIR__ . '/controllers/PublicController.php';
require_once __DIR__ . '/controllers/StatsController.php';
require_once __DIR__ . '/controllers/SettingsController.php';
require_once __DIR__ . '/controllers/ContactController.php';
require_once __DIR__ . '/controllers/HeroSlideController.php';
require_once __DIR__ . '/controllers/MediaController.php';
require_once __DIR__ . '/controllers/ServiceController.php';
require_once __DIR__ . '/controllers/ProjectController.php';
require_once __DIR__ . '/controllers/TeamMemberController.php';
require_once __DIR__ . '/controllers/TestimonialController.php';
require_once __DIR__ . '/controllers/FaqController.php';
require_once __DIR__ . '/controllers/PricingController.php';
require_once __DIR__ . '/controllers/UserController.php';
require_once __DIR__ . '/controllers/UploadController.php';
require_once __DIR__ . '/controllers/UnsplashController.php';

Auth::start();

function bodyJson(): array {
    static $body = null;
    if ($body === null) {
        $raw = file_get_contents('php://input');
        $body = $raw ? (json_decode($raw, true) ?? []) : [];
        if (!is_array($body)) $body = [];
    }
    return $body;
}

function slugify(string $text): string {
    $text = mb_strtolower($text, 'UTF-8');
    $map = [
        'à'=>'a','á'=>'a','ả'=>'a','ã'=>'a','ạ'=>'a','ă'=>'a','ắ'=>'a','ặ'=>'a','ằ'=>'a','ẳ'=>'a','ẵ'=>'a',
        'â'=>'a','ấ'=>'a','ầ'=>'a','ẩ'=>'a','ẫ'=>'a','ậ'=>'a','đ'=>'d',
        'è'=>'e','é'=>'e','ẻ'=>'e','ẽ'=>'e','ẹ'=>'e','ê'=>'e','ế'=>'e','ề'=>'e','ể'=>'e','ễ'=>'e','ệ'=>'e',
        'ì'=>'i','í'=>'i','ỉ'=>'i','ĩ'=>'i','ị'=>'i',
        'ò'=>'o','ó'=>'o','ỏ'=>'o','õ'=>'o','ọ'=>'o','ô'=>'o','ố'=>'o','ồ'=>'o','ổ'=>'o','ỗ'=>'o','ộ'=>'o',
        'ơ'=>'o','ớ'=>'o','ờ'=>'o','ở'=>'o','ỡ'=>'o','ợ'=>'o',
        'ù'=>'u','ú'=>'u','ủ'=>'u','ũ'=>'u','ụ'=>'u','ư'=>'u','ứ'=>'u','ừ'=>'u','ử'=>'u','ữ'=>'u','ự'=>'u',
        'ỳ'=>'y','ý'=>'y','ỷ'=>'y','ỹ'=>'y','ỵ'=>'y',
    ];
    $text = strtr($text, $map);
    $text = preg_replace('/[^a-z0-9\s-]/', '', $text);
    $text = preg_replace('/[\s-]+/', '-', trim($text));
    return $text ?: 'item-' . time();
}

$db     = Database::getInstance();
$router = new Router();

// ── AUTH ──────────────────────────────────────────────────────────────────────
$auth = new AuthController($db);
$router->add('POST', '/auth/login',  [$auth, 'login']);
$router->add('POST', '/auth/logout', [$auth, 'logout']);
$router->add('GET',  '/auth/me',     [$auth, 'me']);

// ── STATS ─────────────────────────────────────────────────────────────────────
$stats = new StatsController($db);
$router->add('GET', '/stats', [$stats, 'index']);

// ── SETTINGS ─────────────────────────────────────────────────────────────────
$settings = new SettingsController($db);
$router->add('GET',  '/settings',        [$settings, 'index']);
$router->add('POST', '/settings/update', [$settings, 'update']);

// ── HERO SLIDES ───────────────────────────────────────────────────────────────
$slide = new HeroSlideController($db);
$router->add('GET',  '/hero-slides',              [$slide, 'index']);
$router->add('POST', '/hero-slides',              [$slide, 'store']);
$router->add('POST', '/hero-slides/reorder',      [$slide, 'reorder']);
$router->add('GET',  '/hero-slides/:id',          [$slide, 'show']);
$router->add('POST', '/hero-slides/:id/update',   [$slide, 'update']);
$router->add('POST', '/hero-slides/:id/delete',   [$slide, 'destroy']);

// ── SERVICES ─────────────────────────────────────────────────────────────────
$service = new ServiceController($db);
$router->add('GET',  '/services',              [$service, 'index']);
$router->add('POST', '/services',              [$service, 'store']);
$router->add('GET',  '/services/:id',          [$service, 'show']);
$router->add('POST', '/services/:id/update',   [$service, 'update']);
$router->add('POST', '/services/:id/delete',   [$service, 'destroy']);

// ── PROJECTS ─────────────────────────────────────────────────────────────────
$project = new ProjectController($db);
$router->add('GET',  '/projects',              [$project, 'index']);
$router->add('POST', '/projects',              [$project, 'store']);
$router->add('GET',  '/projects/:id',          [$project, 'show']);
$router->add('POST', '/projects/:id/update',   [$project, 'update']);
$router->add('POST', '/projects/:id/delete',   [$project, 'destroy']);

// ── TEAM MEMBERS ─────────────────────────────────────────────────────────────
$team = new TeamMemberController($db);
$router->add('GET',  '/team-members',              [$team, 'index']);
$router->add('POST', '/team-members',              [$team, 'store']);
$router->add('GET',  '/team-members/:id',          [$team, 'show']);
$router->add('POST', '/team-members/:id/update',   [$team, 'update']);
$router->add('POST', '/team-members/:id/delete',   [$team, 'destroy']);

// ── TESTIMONIALS ─────────────────────────────────────────────────────────────
$testi = new TestimonialController($db);
$router->add('GET',  '/testimonials',              [$testi, 'index']);
$router->add('POST', '/testimonials',              [$testi, 'store']);
$router->add('GET',  '/testimonials/:id',          [$testi, 'show']);
$router->add('POST', '/testimonials/:id/update',   [$testi, 'update']);
$router->add('POST', '/testimonials/:id/delete',   [$testi, 'destroy']);

// ── FAQ ───────────────────────────────────────────────────────────────────────
$faq = new FaqController($db);
$router->add('GET',  '/faqs',              [$faq, 'index']);
$router->add('POST', '/faqs',              [$faq, 'store']);
$router->add('GET',  '/faqs/:id',          [$faq, 'show']);
$router->add('POST', '/faqs/:id/update',   [$faq, 'update']);
$router->add('POST', '/faqs/:id/delete',   [$faq, 'destroy']);

// ── PRICING PLANS ─────────────────────────────────────────────────────────────
$pricing = new PricingController($db);
$router->add('GET',  '/pricing-plans',              [$pricing, 'index']);
$router->add('POST', '/pricing-plans',              [$pricing, 'store']);
$router->add('GET',  '/pricing-plans/:id',          [$pricing, 'show']);
$router->add('POST', '/pricing-plans/:id/update',   [$pricing, 'update']);
$router->add('POST', '/pricing-plans/:id/delete',   [$pricing, 'destroy']);

// ── CONTACTS ─────────────────────────────────────────────────────────────────
$contact = new ContactController($db);
$router->add('GET',  '/contacts',              [$contact, 'index']);
$router->add('GET',  '/contacts/:id',          [$contact, 'show']);
$router->add('POST', '/contacts/:id/update',   [$contact, 'update']);
$router->add('POST', '/contacts/:id/delete',   [$contact, 'destroy']);

// ── MEDIA ─────────────────────────────────────────────────────────────────────
$media = new MediaController($db);
$router->add('GET',  '/media',              [$media, 'index']);
$router->add('POST', '/media/upload',       [$media, 'upload']);
$router->add('POST', '/media/:id/delete',   [$media, 'destroy']);

// ── USERS ─────────────────────────────────────────────────────────────────────
$user = new UserController($db);
$router->add('GET',  '/users',                         [$user, 'index']);
$router->add('POST', '/users',                         [$user, 'store']);
$router->add('POST', '/users/:id/update',              [$user, 'update']);
$router->add('POST', '/users/:id/delete',              [$user, 'destroy']);
$router->add('POST', '/users/:id/change-password',     [$user, 'changePassword']);

// ── PUBLIC (no auth) ─────────────────────────────────────────────────────────
$pub = new PublicController($db);
$router->add('GET',  '/public/settings',          [$pub, 'settings']);
$router->add('GET',  '/public/hero-slides',       [$pub, 'heroSlides']);
$router->add('GET',  '/public/services',          [$pub, 'services']);
$router->add('GET',  '/public/featured-services', [$pub, 'featuredServices']);
$router->add('GET',  '/public/projects',          [$pub, 'projects']);
$router->add('GET',  '/public/featured-projects', [$pub, 'featuredProjects']);
$router->add('GET',  '/public/projects/:slug',    [$pub, 'projectBySlug']);
$router->add('GET',  '/public/team',              [$pub, 'team']);
$router->add('GET',  '/public/testimonials',      [$pub, 'testimonials']);
$router->add('GET',  '/public/faqs',              [$pub, 'faqs']);
$router->add('GET',  '/public/pricing-plans',     [$pub, 'pricingPlans']);
$router->add('POST', '/public/contact',           [$pub, 'submitContact']);
$router->add('GET',  '/sitemap.xml',              [$pub, 'sitemap']);

// ── UPLOAD & UNSPLASH ────────────────────────────────────────────────────────
$upload = new UploadController($db);
$router->add('POST', '/upload', [$upload, 'upload']);

$unsplash = new UnsplashController($db);
$router->add('GET',  '/unsplash', [$unsplash, 'search']);
$router->add('POST', '/unsplash', [$unsplash, 'trackDownload']);

return $router;
