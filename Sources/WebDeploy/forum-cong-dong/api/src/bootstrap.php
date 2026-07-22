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
require_once __DIR__ . '/controllers/ForumCategoryController.php';
require_once __DIR__ . '/controllers/ForumThreadController.php';
require_once __DIR__ . '/controllers/ForumTagController.php';
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

// ── SETTINGS ──────────────────────────────────────────────────────────────────
$settings = new SettingsController($db);
$router->add('GET',  '/settings',        [$settings, 'index']);
$router->add('POST', '/settings/update', [$settings, 'update']);

// ── HERO SLIDES ───────────────────────────────────────────────────────────────
$slide = new HeroSlideController($db);
$router->add('GET',  '/hero-slides',            [$slide, 'index']);
$router->add('POST', '/hero-slides',            [$slide, 'store']);
$router->add('POST', '/hero-slides/reorder',    [$slide, 'reorder']);
$router->add('GET',  '/hero-slides/:id',        [$slide, 'show']);
$router->add('POST', '/hero-slides/:id/update', [$slide, 'update']);
$router->add('POST', '/hero-slides/:id/delete', [$slide, 'destroy']);

// ── FORUM CATEGORIES ──────────────────────────────────────────────────────────
$forumCat = new ForumCategoryController($db);
$router->add('GET',  '/forum-categories',            [$forumCat, 'index']);
$router->add('POST', '/forum-categories',            [$forumCat, 'store']);
$router->add('GET',  '/forum-categories/:id',        [$forumCat, 'show']);
$router->add('POST', '/forum-categories/:id/update', [$forumCat, 'update']);
$router->add('POST', '/forum-categories/:id/delete', [$forumCat, 'destroy']);

// ── FORUM THREADS ─────────────────────────────────────────────────────────────
$thread = new ForumThreadController($db);
$router->add('GET',  '/forum-threads',            [$thread, 'index']);
$router->add('POST', '/forum-threads',            [$thread, 'store']);
$router->add('GET',  '/forum-threads/:id',        [$thread, 'show']);
$router->add('POST', '/forum-threads/:id/update', [$thread, 'update']);
$router->add('POST', '/forum-threads/:id/delete', [$thread, 'destroy']);

// ── FORUM TAGS ────────────────────────────────────────────────────────────────
$tag = new ForumTagController($db);
$router->add('GET',  '/forum-tags',            [$tag, 'index']);
$router->add('POST', '/forum-tags',            [$tag, 'store']);
$router->add('POST', '/forum-tags/:id/update', [$tag, 'update']);
$router->add('POST', '/forum-tags/:id/delete', [$tag, 'destroy']);

// ── CONTACTS ──────────────────────────────────────────────────────────────────
$contact = new ContactController($db);
$router->add('GET',  '/contacts',            [$contact, 'index']);
$router->add('GET',  '/contacts/:id',        [$contact, 'show']);
$router->add('POST', '/contacts/:id/update', [$contact, 'update']);
$router->add('POST', '/contacts/:id/delete', [$contact, 'destroy']);

// ── MEDIA ─────────────────────────────────────────────────────────────────────
$media = new MediaController($db);
$router->add('GET',  '/media',            [$media, 'index']);
$router->add('POST', '/media/upload',     [$media, 'upload']);
$router->add('POST', '/media/:id/delete', [$media, 'destroy']);

// ── USERS ─────────────────────────────────────────────────────────────────────
$user = new UserController($db);
$router->add('GET',  '/users',                     [$user, 'index']);
$router->add('POST', '/users',                     [$user, 'store']);
$router->add('POST', '/users/:id/update',          [$user, 'update']);
$router->add('POST', '/users/:id/delete',          [$user, 'destroy']);
$router->add('POST', '/users/:id/change-password', [$user, 'changePassword']);

// ── PUBLIC (no auth) ──────────────────────────────────────────────────────────
$pub = new PublicController($db);
$router->add('GET',  '/public/settings',          [$pub, 'settings']);
$router->add('GET',  '/public/hero-slides',       [$pub, 'heroSlides']);
$router->add('GET',  '/public/forum-categories',  [$pub, 'forumCategories']);
$router->add('GET',  '/public/forum-threads',     [$pub, 'forumThreads']);
$router->add('GET',  '/public/forum-tags',        [$pub, 'forumTags']);
$router->add('POST', '/public/contact',           [$pub, 'submitContact']);
$router->add('GET',  '/sitemap.xml',              [$pub, 'sitemap']);

// ── UPLOAD & UNSPLASH ─────────────────────────────────────────────────────────
$upload = new UploadController($db);
$router->add('POST', '/upload', [$upload, 'upload']);

$unsplash = new UnsplashController($db);
$router->add('GET',  '/unsplash', [$unsplash, 'search']);
$router->add('POST', '/unsplash', [$unsplash, 'trackDownload']);

return $router;
