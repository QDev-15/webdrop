<?php
declare(strict_types=1);

// ─── Core classes ─────────────────────────────────────────────────────────────
require_once __DIR__ . '/Response.php';
require_once __DIR__ . '/Router.php';
require_once __DIR__ . '/Auth.php';
require_once __DIR__ . '/Database.php';

// ─── Boot ─────────────────────────────────────────────────────────────────────
Auth::start();
$db = Database::getInstance();
$router = new Router();

// ─── Controllers ──────────────────────────────────────────────────────────────
foreach (glob(__DIR__ . '/controllers/*.php') as $file) {
    require_once $file;
}

$auth        = new AuthController($db);
$user        = new UserController($db);
$settings    = new SettingsController($db);
$heroSlide   = new HeroSlideController($db);
$contact     = new ContactController($db);
$media       = new MediaController($db);
$upload      = new UploadController($db);
$unsplash    = new UnsplashController($db);
$category    = new CategoryController($db);
$product     = new ProductController($db);
$customer    = new CustomerController($db);
$shift       = new ShiftController($db);
$order       = new OrderController($db);
$return      = new ReturnController($db);
$stock       = new StockController($db);
$report      = new ReportController($db);
$stats       = new StatsController($db);
$public      = new PublicController($db);

// ─── Auth ─────────────────────────────────────────────────────────────────────
$router->add('POST', '/auth/login',  [$auth, 'login']);
$router->add('POST', '/auth/logout', [$auth, 'logout']);
$router->add('GET',  '/auth/me',     [$auth, 'me']);

// ─── Users (quản lý tài khoản — superadmin) ────────────────────────────────────
$router->add('GET',  '/users',                     [$user, 'index']);
$router->add('POST', '/users',                     [$user, 'store']);
$router->add('POST', '/users/:id/update',          [$user, 'update']);
$router->add('POST', '/users/:id/delete',          [$user, 'destroy']);
$router->add('POST', '/users/:id/change-password', [$user, 'changePassword']);

// ─── Settings ───────────────────────────────────────────────────────────────
$router->add('GET',  '/settings',        [$settings, 'index']);
$router->add('POST', '/settings/update', [$settings, 'update']);

// ─── Hero Slides ────────────────────────────────────────────────────────────
$router->add('GET',  '/hero-slides',            [$heroSlide, 'index']);
$router->add('GET',  '/hero-slides/:id',        [$heroSlide, 'show']);
$router->add('POST', '/hero-slides',            [$heroSlide, 'store']);
$router->add('POST', '/hero-slides/:id/update', [$heroSlide, 'update']);
$router->add('POST', '/hero-slides/:id/delete', [$heroSlide, 'destroy']);
$router->add('POST', '/hero-slides/reorder',    [$heroSlide, 'reorder']);

// ─── Contacts ───────────────────────────────────────────────────────────────
$router->add('GET',  '/contacts',            [$contact, 'index']);
$router->add('GET',  '/contacts/:id',        [$contact, 'show']);
$router->add('POST', '/contacts/:id/update', [$contact, 'update']);
$router->add('POST', '/contacts/:id/delete', [$contact, 'destroy']);

// ─── Media / Upload / Unsplash ────────────────────────────────────────────────
$router->add('GET',  '/media',            [$media, 'index']);
$router->add('POST', '/media/upload',     [$media, 'upload']);
$router->add('POST', '/media/:id/delete', [$media, 'destroy']);
$router->add('POST', '/upload', [$upload, 'upload']);
$router->add('GET',  '/unsplash',          [$unsplash, 'search']);
$router->add('POST', '/unsplash/download', [$unsplash, 'trackDownload']);

// ─── Danh mục ───────────────────────────────────────────────────────────────
$router->add('GET', '/categories', [$category, 'index']);

// ─── Sản phẩm (admin CRUD — superadmin) ────────────────────────────────────────
$router->add('GET',  '/products',            [$product, 'index']);
$router->add('GET',  '/products/:id',        [$product, 'show']);
$router->add('POST', '/products',            [$product, 'store']);
$router->add('POST', '/products/:id/update', [$product, 'update']);
$router->add('POST', '/products/:id/delete', [$product, 'destroy']);

// ─── Khách hàng (admin CRM — superadmin) ───────────────────────────────────────
$router->add('GET',  '/customers',            [$customer, 'index']);
$router->add('GET',  '/customers/:id',        [$customer, 'show']);
$router->add('POST', '/customers',            [$customer, 'store']);
$router->add('POST', '/customers/:id/update', [$customer, 'update']);
$router->add('POST', '/customers/:id/delete', [$customer, 'destroy']);

// ─── Kho hàng (admin — superadmin) ──────────────────────────────────────────
$router->add('GET',  '/suppliers',              [$stock, 'suppliers']);
$router->add('POST', '/suppliers',              [$stock, 'addSupplier']);
$router->add('POST', '/stock-imports',          [$stock, 'createImport']);
$router->add('GET',  '/stock-imports',          [$stock, 'importsHistory']);
$router->add('GET',  '/stocktake/rows',         [$stock, 'stocktakeRows']);
$router->add('POST', '/stocktake',              [$stock, 'applyStocktake']);
$router->add('GET',  '/stocktake/history',      [$stock, 'stocktakeHistory']);

// ─── Báo cáo (admin — superadmin) ───────────────────────────────────────────
$router->add('GET', '/reports/dashboard', [$report, 'dashboard']);
$router->add('GET', '/reports/period',    [$report, 'period']);
$router->add('GET', '/stats',             [$stats, 'index']);

// ─── Cashier (POS — mọi role đã đăng nhập) ──────────────────────────────────
$router->add('GET',  '/pos/products',           [$product, 'posIndex']);
$router->add('POST', '/pos/checkout',           [$order, 'store']);
$router->add('GET',  '/orders/find/:code',      [$order, 'findByCode']);
$router->add('GET',  '/pos/customers/search',   [$customer, 'search']);
$router->add('POST', '/pos/customers/quick-add',[$customer, 'quickAdd']);
$router->add('GET',  '/shifts/current',         [$shift, 'current']);
$router->add('POST', '/shifts/open',            [$shift, 'open']);
$router->add('POST', '/shifts/close',           [$shift, 'close']);
$router->add('GET',  '/returns/lookup/:code',   [$return, 'lookup']);
$router->add('POST', '/returns',                [$return, 'process']);

// ─── Public (không cần auth) ─────────────────────────────────────────────────
$router->add('GET',  '/public/settings',    [$public, 'settings']);
$router->add('GET',  '/public/hero-slides', [$public, 'heroSlides']);
$router->add('POST', '/public/contact',     [$public, 'submitContact']);
$router->add('GET',  '/sitemap.xml',        [$public, 'sitemap']);
