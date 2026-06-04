<?php
declare(strict_types=1);

// ── Helpers ───────────────────────────────────────────────

function bodyJson(): array
{
    $raw  = file_get_contents('php://input');
    $data = json_decode($raw ?: '{}', true);
    return is_array($data) ? $data : [];
}

function slugify(string $text): string
{
    $map = [
        'à'=>'a','á'=>'a','ả'=>'a','ã'=>'a','ạ'=>'a',
        'ă'=>'a','ắ'=>'a','ặ'=>'a','ằ'=>'a','ẳ'=>'a','ẵ'=>'a',
        'â'=>'a','ấ'=>'a','ầ'=>'a','ẩ'=>'a','ẫ'=>'a','ậ'=>'a',
        'đ'=>'d',
        'è'=>'e','é'=>'e','ẻ'=>'e','ẽ'=>'e','ẹ'=>'e',
        'ê'=>'e','ế'=>'e','ề'=>'e','ể'=>'e','ễ'=>'e','ệ'=>'e',
        'ì'=>'i','í'=>'i','ỉ'=>'i','ĩ'=>'i','ị'=>'i',
        'ò'=>'o','ó'=>'o','ỏ'=>'o','õ'=>'o','ọ'=>'o',
        'ô'=>'o','ố'=>'o','ồ'=>'o','ổ'=>'o','ỗ'=>'o','ộ'=>'o',
        'ơ'=>'o','ớ'=>'o','ờ'=>'o','ở'=>'o','ỡ'=>'o','ợ'=>'o',
        'ù'=>'u','ú'=>'u','ủ'=>'u','ũ'=>'u','ụ'=>'u',
        'ư'=>'u','ứ'=>'u','ừ'=>'u','ử'=>'u','ữ'=>'u','ự'=>'u',
        'ỳ'=>'y','ý'=>'y','ỷ'=>'y','ỹ'=>'y','ỵ'=>'y',
    ];
    $text = mb_strtolower($text, 'UTF-8');
    $text = strtr($text, $map);
    $text = preg_replace('/[^a-z0-9\s-]/', '', $text);
    $text = preg_replace('/[\s-]+/', '-', trim($text));
    return $text;
}

// ── CORS ─────────────────────────────────────────────────

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

// ── Autoload ──────────────────────────────────────────────

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

// ── AUTH ─────────────────────────────────────────────────

$auth = new AuthController($db);
$router->add('POST', '/auth/login',  [$auth, 'login']);
$router->add('POST', '/auth/logout', [$auth, 'logout']);
$router->add('GET',  '/auth/me',     [$auth, 'me']);

// ── SERVICES (Dịch vụ) ───────────────────────────────────

$service = new ServiceController($db);
$router->add('GET',    '/services',     [$service, 'index']);
$router->add('POST',   '/services',     [$service, 'store']);
$router->add('GET',    '/services/:id', [$service, 'show']);
$router->add('PUT',    '/services/:id', [$service, 'update']);
$router->add('DELETE', '/services/:id', [$service, 'destroy']);

// ── PROJECTS (Dự án / Công trình) ───────────────────────

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

// ── TESTIMONIALS (Đánh giá) ──────────────────────────────

$testimonial = new TestimonialController($db);
$router->add('GET',    '/testimonials',     [$testimonial, 'index']);
$router->add('POST',   '/testimonials',     [$testimonial, 'store']);
$router->add('GET',    '/testimonials/:id', [$testimonial, 'show']);
$router->add('PUT',    '/testimonials/:id', [$testimonial, 'update']);
$router->add('DELETE', '/testimonials/:id', [$testimonial, 'destroy']);

// ── CONTACTS (Yêu cầu báo giá) ──────────────────────────

$contact = new ContactController($db);
$router->add('GET',    '/contacts',            [$contact, 'index']);
$router->add('GET',    '/contacts/:id',        [$contact, 'show']);
$router->add('PUT',    '/contacts/:id/status', [$contact, 'updateStatus']);
$router->add('DELETE', '/contacts/:id',        [$contact, 'destroy']);

// ── SETTINGS ─────────────────────────────────────────────

$settings = new SettingsController($db);
$router->add('GET',  '/settings',        [$settings, 'index']);
$router->add('POST', '/settings',        [$settings, 'save']);
$router->add('GET',  '/settings/:group', [$settings, 'group']);

// ── MEDIA ────────────────────────────────────────────────

$media = new MediaController($db);
$router->add('GET',    '/media',     [$media, 'index']);
$router->add('POST',   '/media',     [$media, 'upload']);
$router->add('DELETE', '/media/:id', [$media, 'destroy']);

// ── STATS ────────────────────────────────────────────────

$stats = new StatsController($db);
$router->add('GET', '/stats', [$stats, 'index']);

// ── PUBLIC (không cần auth — website public gọi) ─────────

$pub = new PublicController($db);
$router->add('GET',  '/public/settings',          [$pub, 'settings']);
$router->add('GET',  '/public/services',          [$pub, 'services']);
$router->add('GET',  '/public/projects',          [$pub, 'projects']);
$router->add('GET',  '/public/project-categories', [$pub, 'projectCategories']);
$router->add('GET',  '/public/testimonials',      [$pub, 'testimonials']);
$router->add('POST', '/public/contact',           [$pub, 'submitContact']);

return $router;
