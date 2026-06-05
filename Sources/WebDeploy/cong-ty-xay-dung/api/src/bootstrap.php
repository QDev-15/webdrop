<?php
declare(strict_types=1);

// â”€â”€ Helpers â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

function bodyJson(): array
{
    $raw  = file_get_contents('php://input');
    $data = json_decode($raw ?: '{}', true);
    return is_array($data) ? $data : [];
}

function slugify(string $text): string
{
    $map = [
        'Ã '=>'a','Ã¡'=>'a','áº£'=>'a','Ã£'=>'a','áº¡'=>'a',
        'Äƒ'=>'a','áº¯'=>'a','áº·'=>'a','áº±'=>'a','áº³'=>'a','áºµ'=>'a',
        'Ã¢'=>'a','áº¥'=>'a','áº§'=>'a','áº©'=>'a','áº«'=>'a','áº­'=>'a',
        'Ä‘'=>'d',
        'Ã¨'=>'e','Ã©'=>'e','áº»'=>'e','áº½'=>'e','áº¹'=>'e',
        'Ãª'=>'e','áº¿'=>'e','á»'=>'e','á»ƒ'=>'e','á»…'=>'e','á»‡'=>'e',
        'Ã¬'=>'i','Ã­'=>'i','á»‰'=>'i','Ä©'=>'i','á»‹'=>'i',
        'Ã²'=>'o','Ã³'=>'o','á»'=>'o','Ãµ'=>'o','á»'=>'o',
        'Ã´'=>'o','á»‘'=>'o','á»“'=>'o','á»•'=>'o','á»—'=>'o','á»™'=>'o',
        'Æ¡'=>'o','á»›'=>'o','á»'=>'o','á»Ÿ'=>'o','á»¡'=>'o','á»£'=>'o',
        'Ã¹'=>'u','Ãº'=>'u','á»§'=>'u','Å©'=>'u','á»¥'=>'u',
        'Æ°'=>'u','á»©'=>'u','á»«'=>'u','á»­'=>'u','á»¯'=>'u','á»±'=>'u',
        'á»³'=>'y','Ã½'=>'y','á»·'=>'y','á»¹'=>'y','á»µ'=>'y',
    ];
    $text = mb_strtolower($text, 'UTF-8');
    $text = strtr($text, $map);
    $text = preg_replace('/[^a-z0-9\s-]/', '', $text);
    $text = preg_replace('/[\s-]+/', '-', trim($text));
    return $text;
}

// â”€â”€ CORS â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

$allowedOrigins = [APP_URL, 'http://localhost:5173', 'http://localhost:5174', 'http://localhost:4173'];
$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
if (in_array($origin, $allowedOrigins, true)) {
    header('Access-Control-Allow-Origin: ' . $origin);
    header('Access-Control-Allow-Credentials: true');
}
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

// â”€â”€ Autoload â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

require_once __DIR__ . '/Response.php';
require_once __DIR__ . '/Auth.php';
require_once __DIR__ . '/Database.php';
require_once __DIR__ . '/Router.php';

require_once __DIR__ . '/controllers/AuthController.php';
require_once __DIR__ . '/controllers/PublicController.php';
require_once __DIR__ . '/controllers/StatsController.php';
require_once __DIR__ . '/controllers/SettingsController.php';
require_once __DIR__ . '/controllers/ContactController.php';
require_once __DIR__ . '/controllers/MediaController.php';
require_once __DIR__ . '/controllers/ServiceController.php';
require_once __DIR__ . '/controllers/ProjectController.php';
require_once __DIR__ . '/controllers/TestimonialController.php';

$db     = Database::getInstance();
$router = new Router();

// â”€â”€ AUTH â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

$auth = new AuthController($db);
$router->add('POST', '/auth/login',  [$auth, 'login']);
$router->add('POST', '/auth/logout', [$auth, 'logout']);
$router->add('GET',  '/auth/me',     [$auth, 'me']);

// â”€â”€ SERVICES (Dá»‹ch vá»¥) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

$service = new ServiceController($db);
$router->add('GET',    '/services',     [$service, 'index']);
$router->add('POST',   '/services',     [$service, 'store']);
$router->add('GET',    '/services/:id', [$service, 'show']);
$router->add('PUT',    '/services/:id', [$service, 'update']);
$router->add('DELETE', '/services/:id', [$service, 'destroy']);

// â”€â”€ PROJECTS (Dá»± Ã¡n / CÃ´ng trÃ¬nh) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

$project = new ProjectController($db);
$router->add('GET',    '/projects',               [$project, 'index']);
$router->add('POST',   '/projects',               [$project, 'store']);
$router->add('GET',    '/projects/:id',           [$project, 'show']);
$router->add('PUT',    '/projects/:id',           [$project, 'update']);
$router->add('DELETE', '/projects/:id',           [$project, 'destroy']);
$router->add('GET',    '/project-categories',     [$project, 'categories']);
$router->add('POST',   '/project-categories',     [$project, 'storeCategory']);
$router->add('PUT',    '/project-categories/:id', [$project, 'updateCategory']);
$router->add('DELETE', '/project-categories/:id', [$project, 'destroyCategory']);

// â”€â”€ TESTIMONIALS (ÄÃ¡nh giÃ¡) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

$testimonial = new TestimonialController($db);
$router->add('GET',    '/testimonials',     [$testimonial, 'index']);
$router->add('POST',   '/testimonials',     [$testimonial, 'store']);
$router->add('GET',    '/testimonials/:id', [$testimonial, 'show']);
$router->add('PUT',    '/testimonials/:id', [$testimonial, 'update']);
$router->add('DELETE', '/testimonials/:id', [$testimonial, 'destroy']);

// â”€â”€ CONTACTS (YÃªu cáº§u bÃ¡o giÃ¡) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

$contact = new ContactController($db);
$router->add('GET',    '/contacts',            [$contact, 'index']);
$router->add('GET',    '/contacts/:id',        [$contact, 'show']);
$router->add('PUT',    '/contacts/:id/status', [$contact, 'updateStatus']);
$router->add('DELETE', '/contacts/:id',        [$contact, 'destroy']);

// â”€â”€ SETTINGS â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

$settings = new SettingsController($db);
$router->add('GET',  '/settings',        [$settings, 'index']);
$router->add('POST', '/settings',        [$settings, 'save']);
$router->add('GET',  '/settings/:group', [$settings, 'group']);

// â”€â”€ MEDIA â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

$media = new MediaController($db);
$router->add('GET',    '/media',     [$media, 'index']);
$router->add('POST',   '/media',     [$media, 'upload']);
$router->add('DELETE', '/media/:id', [$media, 'destroy']);

// â”€â”€ STATS â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

$stats = new StatsController($db);
$router->add('GET', '/stats', [$stats, 'index']);

// â”€â”€ PUBLIC (khÃ´ng cáº§n auth â€” website public gá»i) â”€â”€â”€â”€â”€â”€â”€â”€â”€

$pub = new PublicController($db);
$router->add('GET',  '/public/settings',          [$pub, 'settings']);
$router->add('GET',  '/public/services',          [$pub, 'services']);
$router->add('GET',  '/public/projects',          [$pub, 'projects']);
$router->add('GET',  '/public/project-categories', [$pub, 'projectCategories']);
$router->add('GET',  '/public/testimonials',      [$pub, 'testimonials']);
$router->add('POST', '/public/contact',           [$pub, 'submitContact']);


// ── UPLOAD & UNSPLASH ─────────────────────────────────────────────────────────
$upload   = new UploadController($db);
$router->add('POST', '/upload',   [$upload,   'upload']);

$unsplash = new UnsplashController($db);
$router->add('GET',  '/unsplash', [$unsplash, 'search']);
$router->add('POST', '/unsplash', [$unsplash, 'trackDownload']);

return $router;


