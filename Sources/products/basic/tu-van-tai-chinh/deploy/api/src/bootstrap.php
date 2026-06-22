<?php
declare(strict_types=1);

require_once __DIR__ . '/Database.php';
require_once __DIR__ . '/Router.php';
require_once __DIR__ . '/Auth.php';
require_once __DIR__ . '/Response.php';

// Controllers
require_once __DIR__ . '/controllers/AuthController.php';
require_once __DIR__ . '/controllers/PublicController.php';
require_once __DIR__ . '/controllers/StatsController.php';
require_once __DIR__ . '/controllers/SettingsController.php';
require_once __DIR__ . '/controllers/ContactController.php';
require_once __DIR__ . '/controllers/HeroSlideController.php';
require_once __DIR__ . '/controllers/ServiceController.php';
require_once __DIR__ . '/controllers/TeamMemberController.php';
require_once __DIR__ . '/controllers/TestimonialController.php';
require_once __DIR__ . '/controllers/MediaController.php';
require_once __DIR__ . '/controllers/UserController.php';

function bodyJson(): array {
    $raw = file_get_contents('php://input');
    if (!$raw) return [];
    $data = json_decode($raw, true);
    return is_array($data) ? $data : [];
}

function slugify(string $text): string {
    $text = mb_strtolower($text, 'UTF-8');
    $map = ['Ã '=>'a','Ã¡'=>'a','áº£'=>'a','Ã£'=>'a','áº¡'=>'a','Ã¢'=>'a','áº§'=>'a','áº¥'=>'a','áº©'=>'a','áº«'=>'a','áº­'=>'a',
             'Äƒ'=>'a','áº±'=>'a','áº¯'=>'a','áº³'=>'a','áºµ'=>'a','áº·'=>'a','Ã¨'=>'e','Ã©'=>'e','áº»'=>'e','áº½'=>'e','áº¹'=>'e',
             'Ãª'=>'e','á»'=>'e','áº¿'=>'e','á»ƒ'=>'e','á»…'=>'e','á»‡'=>'e','Ã¬'=>'i','Ã­'=>'i','á»‰'=>'i','Ä©'=>'i','á»‹'=>'i',
             'Ã²'=>'o','Ã³'=>'o','á»'=>'o','Ãµ'=>'o','á»'=>'o','Ã´'=>'o','á»“'=>'o','á»‘'=>'o','á»•'=>'o','á»—'=>'o','á»™'=>'o',
             'Æ¡'=>'o','á»'=>'o','á»›'=>'o','á»Ÿ'=>'o','á»¡'=>'o','á»£'=>'o','Ã¹'=>'u','Ãº'=>'u','á»§'=>'u','Å©'=>'u','á»¥'=>'u',
             'Æ°'=>'u','á»«'=>'u','á»©'=>'u','á»­'=>'u','á»¯'=>'u','á»±'=>'u','á»³'=>'y','Ã½'=>'y','á»·'=>'y','á»¹'=>'y','á»µ'=>'y',
             'Ä‘'=>'d'];
    $text = strtr($text, $map);
    $text = preg_replace('/[^a-z0-9\s-]/', '', $text);
    $text = preg_replace('/[\s-]+/', '-', trim($text));
    return $text;
}


require_once __DIR__ . '/controllers/UploadController.php';
require_once __DIR__ . '/controllers/UnsplashController.php';
Auth::start();

$db     = Database::getInstance();
$router = new Router();

// Auth routes
$auth = new AuthController($db);
$router->add('POST', '/auth/login',  [$auth, 'login']);
$router->add('POST', '/auth/logout', [$auth, 'logout']);
$router->add('GET',  '/auth/me',     [$auth, 'me']);

// Stats
$stats = new StatsController($db);
$router->add('GET', '/stats', [$stats, 'index']);

// Settings
$set = new SettingsController($db);
$router->add('GET',  '/settings',        [$set, 'index']);
$router->add('POST', '/settings/update', [$set, 'update']);

// Hero Slides
$slide = new HeroSlideController($db);
$router->add('GET',  '/hero-slides',            [$slide, 'index']);
$router->add('POST', '/hero-slides',            [$slide, 'store']);
$router->add('POST', '/hero-slides/reorder',    [$slide, 'reorder']);
$router->add('GET',  '/hero-slides/:id',        [$slide, 'show']);
$router->add('POST', '/hero-slides/:id/update', [$slide, 'update']);
$router->add('POST', '/hero-slides/:id/delete', [$slide, 'destroy']);

// Services
$svc = new ServiceController($db);
$router->add('GET',  '/services',            [$svc, 'index']);
$router->add('POST', '/services',            [$svc, 'store']);
$router->add('GET',  '/services/:id',        [$svc, 'show']);
$router->add('POST', '/services/:id/update', [$svc, 'update']);
$router->add('POST', '/services/:id/delete', [$svc, 'destroy']);

// Team Members
$team = new TeamMemberController($db);
$router->add('GET',  '/team-members',            [$team, 'index']);
$router->add('POST', '/team-members',            [$team, 'store']);
$router->add('GET',  '/team-members/:id',        [$team, 'show']);
$router->add('POST', '/team-members/:id/update', [$team, 'update']);
$router->add('POST', '/team-members/:id/delete', [$team, 'destroy']);

// Testimonials
$testi = new TestimonialController($db);
$router->add('GET',  '/testimonials',            [$testi, 'index']);
$router->add('POST', '/testimonials',            [$testi, 'store']);
$router->add('GET',  '/testimonials/:id',        [$testi, 'show']);
$router->add('POST', '/testimonials/:id/update', [$testi, 'update']);
$router->add('POST', '/testimonials/:id/delete', [$testi, 'destroy']);

// Contacts
$contact = new ContactController($db);
$router->add('GET',  '/contacts',            [$contact, 'index']);
$router->add('GET',  '/contacts/:id',        [$contact, 'show']);
$router->add('POST', '/contacts/:id/update', [$contact, 'update']);
$router->add('POST', '/contacts/:id/delete', [$contact, 'destroy']);

// Media
$media = new MediaController($db);
$router->add('GET',  '/media',            [$media, 'index']);
$router->add('POST', '/media/upload',     [$media, 'upload']);
$router->add('POST', '/media/:id/delete', [$media, 'destroy']);

// Users
$user = new UserController($db);
$router->add('GET',  '/users',                      [$user, 'index']);
$router->add('POST', '/users',                      [$user, 'store']);
$router->add('POST', '/users/:id/update',           [$user, 'update']);
$router->add('POST', '/users/:id/delete',           [$user, 'destroy']);
$router->add('POST', '/users/:id/change-password',  [$user, 'changePassword']);

// PUBLIC endpoints (no auth)
$pub = new PublicController($db);
$router->add('GET',  '/public/settings',     [$pub, 'settings']);
$router->add('GET',  '/public/hero-slides',  [$pub, 'heroSlides']);
$router->add('GET',  '/public/services',     [$pub, 'services']);
$router->add('GET',  '/public/team',         [$pub, 'team']);
$router->add('GET',  '/public/testimonials', [$pub, 'testimonials']);
$router->add('POST', '/public/contact',      [$pub, 'submitContact']);


// ── UPLOAD & UNSPLASH ─────────────────────────────────────────────────────────
$upload   = new UploadController($db);
$router->add('POST', '/upload',   [$upload,   'upload']);

$unsplash = new UnsplashController($db);
$router->add('GET',  '/unsplash', [$unsplash, 'search']);
$router->add('POST', '/unsplash', [$unsplash, 'trackDownload']);

return $router;


