<?php
declare(strict_types=1);

// ─── Core classes ─────────────────────────────────────────────────────────────
require_once __DIR__ . '/Response.php';
require_once __DIR__ . '/Router.php';
require_once __DIR__ . '/Auth.php';
require_once __DIR__ . '/Database.php';

// ─── Boot ─────────────────────────────────────────────────────────────────────
Auth::start();
$db     = Database::getInstance();
$router = new Router();

// ─── Helpers ──────────────────────────────────────────────────────────────────
function bodyJson(): array {
    $raw = file_get_contents('php://input');
    if (!$raw) return [];
    $data = json_decode($raw, true);
    return is_array($data) ? $data : [];
}

function slugify(string $text): string {
    $text = mb_strtolower(trim($text));
    $map  = ['à'=>'a','á'=>'a','ả'=>'a','ã'=>'a','ạ'=>'a','ă'=>'a','ắ'=>'a','ằ'=>'a','ẳ'=>'a','ẵ'=>'a','ặ'=>'a','â'=>'a','ấ'=>'a','ầ'=>'a','ẩ'=>'a','ẫ'=>'a','ậ'=>'a','đ'=>'d','è'=>'e','é'=>'e','ẻ'=>'e','ẽ'=>'e','ẹ'=>'e','ê'=>'e','ế'=>'e','ề'=>'e','ể'=>'e','ễ'=>'e','ệ'=>'e','ì'=>'i','í'=>'i','ỉ'=>'i','ĩ'=>'i','ị'=>'i','ò'=>'o','ó'=>'o','ỏ'=>'o','õ'=>'o','ọ'=>'o','ô'=>'o','ố'=>'o','ồ'=>'o','ổ'=>'o','ỗ'=>'o','ộ'=>'o','ơ'=>'o','ớ'=>'o','ờ'=>'o','ở'=>'o','ỡ'=>'o','ợ'=>'o','ù'=>'u','ú'=>'u','ủ'=>'u','ũ'=>'u','ụ'=>'u','ư'=>'u','ứ'=>'u','ừ'=>'u','ử'=>'u','ữ'=>'u','ự'=>'u','ỳ'=>'y','ý'=>'y','ỷ'=>'y','ỹ'=>'y','ỵ'=>'y'];
    $text = strtr($text, $map);
    $text = preg_replace('/[^a-z0-9\s-]/', '', $text);
    $text = preg_replace('/[\s-]+/', '-', trim($text));
    return $text;
}

// ─── Controllers ──────────────────────────────────────────────────────────────
require_once __DIR__ . '/controllers/AuthController.php';
require_once __DIR__ . '/controllers/UserController.php';
require_once __DIR__ . '/controllers/SettingsController.php';
require_once __DIR__ . '/controllers/HeroSlideController.php';
require_once __DIR__ . '/controllers/ContactController.php';
require_once __DIR__ . '/controllers/MediaController.php';
require_once __DIR__ . '/controllers/UnsplashController.php';
require_once __DIR__ . '/controllers/UploadController.php';
require_once __DIR__ . '/controllers/PublicController.php';
require_once __DIR__ . '/controllers/ProductCategoryController.php';
require_once __DIR__ . '/controllers/ProductController.php';
require_once __DIR__ . '/controllers/OrderController.php';
require_once __DIR__ . '/controllers/ShopPublicController.php';
require_once __DIR__ . '/controllers/ShopSettingsController.php';

// ─── Routes ───────────────────────────────────────────────────────────────────

// Auth
$auth = new AuthController($db);
$router->add('POST', '/auth/login',  [$auth, 'login']);
$router->add('POST', '/auth/logout', [$auth, 'logout']);
$router->add('GET',  '/auth/me',     [$auth, 'me']);

// Health
$router->add('GET', '/health', function() use ($db) {
    Response::json([
        'status'      => 'ok',
        'pdo_sqlite'  => extension_loaded('pdo_sqlite'),
        'db_dir'      => is_writable(dirname(DB_FILE)) ? 'writable' : 'not-writable',
        'php_version' => PHP_VERSION,
    ]);
});

// Profile
$router->add('GET',  '/profile',                    [$auth, 'show']);
$router->add('POST', '/profile/update',             [$auth, 'update']);
$router->add('POST', '/profile/change-password',    [$auth, 'changePassword']);

// Users
$users = new UserController($db);
$router->add('GET',  '/users',                  [$users, 'index']);
$router->add('POST', '/users',                  [$users, 'store']);
$router->add('POST', '/users/:id/update',       [$users, 'update']);
$router->add('POST', '/users/:id/delete',       [$users, 'destroy']);
$router->add('POST', '/users/:id/change-password', [$users, 'changePassword']);

// Settings
$settings = new SettingsController($db);
$router->add('GET',  '/settings',        [$settings, 'index']);
$router->add('POST', '/settings/update', [$settings, 'update']);

// Hero Slides
$slides = new HeroSlideController($db);
$router->add('GET',  '/hero-slides',            [$slides, 'index']);
$router->add('GET',  '/hero-slides/:id',        [$slides, 'show']);
$router->add('POST', '/hero-slides',            [$slides, 'store']);
$router->add('POST', '/hero-slides/:id/update', [$slides, 'update']);
$router->add('POST', '/hero-slides/:id/delete', [$slides, 'destroy']);

// Contacts
$contacts = new ContactController($db);
$router->add('GET',  '/contacts',            [$contacts, 'index']);
$router->add('GET',  '/contacts/:id',        [$contacts, 'show']);
$router->add('POST', '/contacts/:id/update', [$contacts, 'update']);
$router->add('POST', '/contacts/:id/delete', [$contacts, 'destroy']);

// Media
$media = new MediaController($db);
$router->add('GET',  '/media',            [$media, 'index']);
$router->add('POST', '/media/upload', [$media, 'upload']);
$router->add('POST', '/media/:id/delete', [$media, 'destroy']);

// Upload
$upload = new UploadController($db);
$router->add('POST', '/upload', [$upload, 'store']);

// Unsplash
$unsplash = new UnsplashController($db);
$router->add('GET', '/unsplash', [$unsplash, 'search']);

// Product Categories (admin)
$prodCat = new ProductCategoryController($db);
$router->add('GET',  '/product-categories',            [$prodCat, 'index']);
$router->add('GET',  '/product-categories/:id',        [$prodCat, 'show']);
$router->add('POST', '/product-categories',            [$prodCat, 'store']);
$router->add('POST', '/product-categories/:id/update', [$prodCat, 'update']);
$router->add('POST', '/product-categories/:id/delete', [$prodCat, 'destroy']);

// Products (admin)
$products = new ProductController($db);
$router->add('GET',  '/products',            [$products, 'index']);
$router->add('GET',  '/products/:id',        [$products, 'show']);
$router->add('POST', '/products',            [$products, 'store']);
$router->add('POST', '/products/:id/update', [$products, 'update']);
$router->add('POST', '/products/:id/delete', [$products, 'destroy']);

// Orders (admin)
$orders = new OrderController($db);
$router->add('GET',  '/orders',                   [$orders, 'index']);
$router->add('GET',  '/orders/:id',                [$orders, 'show']);
$router->add('POST', '/orders/:id/update-status',  [$orders, 'updateStatus']);
$router->add('POST', '/orders/:id/confirm-payment', [$orders, 'confirmPayment']);

// Shop Settings (admin)
$shopSettings = new ShopSettingsController($db);
$router->add('GET',  '/shop-settings',        [$shopSettings, 'show']);
$router->add('POST', '/shop-settings/update', [$shopSettings, 'update']);

// Public (no auth — website calls)
$pub = new PublicController($db);
$router->add('GET',  '/public/settings',            [$pub, 'settings']);
$router->add('GET',  '/public/hero-slides',         [$pub, 'heroSlides']);
$router->add('POST', '/public/contact',             [$pub, 'submitContact']);

// Shop Public (no auth — website calls)
$shopPub = new ShopPublicController($db);
$router->add('GET',  '/public/product-categories',  [$shopPub, 'categories']);
$router->add('GET',  '/public/products',            [$shopPub, 'products']);
$router->add('GET',  '/public/products/:slug',      [$shopPub, 'productBySlug']);
$router->add('GET',  '/public/payment-methods',     [$shopPub, 'paymentMethods']);
$router->add('POST', '/public/orders',              [$shopPub, 'createOrder']);
$router->add('GET',  '/public/orders/:code/status', [$shopPub, 'orderStatus']);
$router->add('POST', '/public/sepay-webhook',       [$shopPub, 'sepayWebhook']);
$router->add('GET',  '/sitemap.xml',                [$shopPub, 'sitemap']);
