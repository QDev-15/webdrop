<?php
declare(strict_types=1);

require_once __DIR__ . '/Database.php';
require_once __DIR__ . '/Router.php';
require_once __DIR__ . '/Auth.php';
require_once __DIR__ . '/Response.php';

// Load controllers
require_once __DIR__ . '/controllers/AuthController.php';
require_once __DIR__ . '/controllers/PublicController.php';
require_once __DIR__ . '/controllers/StatsController.php';
require_once __DIR__ . '/controllers/SettingsController.php';
require_once __DIR__ . '/controllers/ContactController.php';
require_once __DIR__ . '/controllers/MediaController.php';
require_once __DIR__ . '/controllers/PostCategoryController.php';
require_once __DIR__ . '/controllers/PostController.php';
require_once __DIR__ . '/controllers/TagController.php';
require_once __DIR__ . '/controllers/UserController.php';

// Helpers
function bodyJson(): array {
    $raw = file_get_contents('php://input');
    if (empty($raw)) return [];
    $data = json_decode($raw, true);
    return is_array($data) ? $data : [];
}

function slugify(string $text): string {
    $text = mb_strtolower($text, 'UTF-8');
    $map = [
        'Ã '=>'a','Ã¡'=>'a','áº£'=>'a','Ã£'=>'a','áº¡'=>'a',
        'Äƒ'=>'a','áº±'=>'a','áº¯'=>'a','áº³'=>'a','áºµ'=>'a','áº·'=>'a',
        'Ã¢'=>'a','áº§'=>'a','áº¥'=>'a','áº©'=>'a','áº«'=>'a','áº­'=>'a',
        'Ã¨'=>'e','Ã©'=>'e','áº»'=>'e','áº½'=>'e','áº¹'=>'e',
        'Ãª'=>'e','á»'=>'e','áº¿'=>'e','á»ƒ'=>'e','á»…'=>'e','á»‡'=>'e',
        'Ã¬'=>'i','Ã­'=>'i','á»‰'=>'i','Ä©'=>'i','á»‹'=>'i',
        'Ã²'=>'o','Ã³'=>'o','á»'=>'o','Ãµ'=>'o','á»'=>'o',
        'Ã´'=>'o','á»“'=>'o','á»‘'=>'o','á»•'=>'o','á»—'=>'o','á»™'=>'o',
        'Æ¡'=>'o','á»'=>'o','á»›'=>'o','á»Ÿ'=>'o','á»¡'=>'o','á»£'=>'o',
        'Ã¹'=>'u','Ãº'=>'u','á»§'=>'u','Å©'=>'u','á»¥'=>'u',
        'Æ°'=>'u','á»«'=>'u','á»©'=>'u','á»­'=>'u','á»¯'=>'u','á»±'=>'u',
        'á»³'=>'y','Ã½'=>'y','á»·'=>'y','á»¹'=>'y','á»µ'=>'y',
        'Ä‘'=>'d',
    ];
    $text = strtr($text, $map);
    $text = preg_replace('/[^a-z0-9\s-]/', '', $text);
    $text = preg_replace('/[\s-]+/', '-', trim($text));
    return $text;
}

// CORS
$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
$allowedOrigins = array_merge(
    defined('CORS_ORIGINS') && is_array(CORS_ORIGINS) ? CORS_ORIGINS : [],
    [defined('APP_URL') ? APP_URL : '']
);
if (in_array($origin, $allowedOrigins, true) || (APP_ENV ?? 'production') !== 'production') {
    header('Access-Control-Allow-Origin: ' . ($origin ?: '*'));
} else {
    header('Access-Control-Allow-Origin: ' . APP_URL);
}
header('Access-Control-Allow-Credentials: true');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, X-HTTP-Method-Override');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

$db = Database::getInstance();
$router = new Router();

// Auth
$auth = new AuthController($db);
$router->add('POST', '/auth/login',   [$auth, 'login']);
$router->add('POST', '/auth/logout',  [$auth, 'logout']);
$router->add('GET',  '/auth/me',      [$auth, 'me']);

// Stats
$stats = new StatsController($db);
$router->add('GET', '/stats', [$stats, 'index']);

// Settings
$settings = new SettingsController($db);
$router->add('GET',  '/settings',        [$settings, 'index']);
$router->add('POST', '/settings/update', [$settings, 'update']);

// Contacts
$contact = new ContactController($db);
$router->add('GET',  '/contacts',              [$contact, 'index']);
$router->add('GET',  '/contacts/:id',          [$contact, 'show']);
$router->add('POST', '/contacts/:id/update',   [$contact, 'update']);
$router->add('POST', '/contacts/:id/delete',   [$contact, 'destroy']);

// Post Categories
$cat = new PostCategoryController($db);
$router->add('GET',  '/post-categories',             [$cat, 'index']);
$router->add('POST', '/post-categories',             [$cat, 'store']);
$router->add('GET',  '/post-categories/:id',         [$cat, 'show']);
$router->add('POST', '/post-categories/:id/update',  [$cat, 'update']);
$router->add('POST', '/post-categories/:id/delete',  [$cat, 'destroy']);

// Posts
$post = new PostController($db);
$router->add('GET',  '/posts',             [$post, 'index']);
$router->add('POST', '/posts',             [$post, 'store']);
$router->add('GET',  '/posts/:id',         [$post, 'show']);
$router->add('POST', '/posts/:id/update',  [$post, 'update']);
$router->add('POST', '/posts/:id/delete',  [$post, 'destroy']);

// Tags
$tag = new TagController($db);
$router->add('GET',  '/tags',            [$tag, 'index']);
$router->add('POST', '/tags',            [$tag, 'store']);
$router->add('POST', '/tags/:id/update', [$tag, 'update']);
$router->add('POST', '/tags/:id/delete', [$tag, 'destroy']);

// Users
$user = new UserController($db);
$router->add('GET',  '/users',                      [$user, 'index']);
$router->add('POST', '/users',                      [$user, 'store']);
$router->add('POST', '/users/:id/update',           [$user, 'update']);
$router->add('POST', '/users/:id/delete',           [$user, 'destroy']);
$router->add('POST', '/users/:id/change-password',  [$user, 'changePassword']);

// Media
$media = new MediaController($db);
$router->add('GET',  '/media',             [$media, 'index']);
$router->add('POST', '/media/upload',      [$media, 'upload']);
$router->add('POST', '/media/:id/delete',  [$media, 'destroy']);

// Public (no auth)
$pub = new PublicController($db);
$router->add('GET',  '/public/settings',       [$pub, 'settings']);
$router->add('GET',  '/public/posts',           [$pub, 'posts']);
$router->add('GET',  '/public/posts/:slug',     [$pub, 'postBySlug']);
$router->add('GET',  '/public/categories',      [$pub, 'categories']);
$router->add('GET',  '/public/tags',            [$pub, 'tags']);
$router->add('GET',  '/public/featured-post',   [$pub, 'featuredPost']);
$router->add('GET',  '/public/popular-posts',   [$pub, 'popularPosts']);
$router->add('POST', '/public/contact',         [$pub, 'submitContact']);
$router->add('POST', '/public/newsletter',      [$pub, 'newsletter']);


// ── UPLOAD & UNSPLASH ─────────────────────────────────────────────────────────
$upload   = new UploadController($db);
$router->add('POST', '/upload',   [$upload,   'upload']);

$unsplash = new UnsplashController($db);
$router->add('GET',  '/unsplash', [$unsplash, 'search']);
$router->add('POST', '/unsplash', [$unsplash, 'trackDownload']);

return $router;


