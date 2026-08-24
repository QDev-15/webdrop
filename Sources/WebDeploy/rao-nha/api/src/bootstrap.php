<?php
declare(strict_types=1);

// ─── Core classes ─────────────────────────────────────────────────────────────
require_once __DIR__ . '/Response.php';
require_once __DIR__ . '/Router.php';
require_once __DIR__ . '/Auth.php';
require_once __DIR__ . '/AccountAuth.php';
require_once __DIR__ . '/Database.php';

// ─── Controllers ───────────────────────────────────────────────────────────────
require_once __DIR__ . '/controllers/AuthController.php';
require_once __DIR__ . '/controllers/UserController.php';
require_once __DIR__ . '/controllers/SettingsController.php';
require_once __DIR__ . '/controllers/HeroSlideController.php';
require_once __DIR__ . '/controllers/ContactController.php';
require_once __DIR__ . '/controllers/MediaController.php';
require_once __DIR__ . '/controllers/UploadController.php';
require_once __DIR__ . '/controllers/UnsplashController.php';
require_once __DIR__ . '/controllers/StatsController.php';
require_once __DIR__ . '/controllers/AccountController.php';
require_once __DIR__ . '/controllers/MyListingController.php';
require_once __DIR__ . '/controllers/WalletController.php';
require_once __DIR__ . '/controllers/ListingController.php';
require_once __DIR__ . '/controllers/AccountAdminController.php';
require_once __DIR__ . '/controllers/FaqController.php';
require_once __DIR__ . '/controllers/ArticleController.php';
require_once __DIR__ . '/controllers/TestimonialController.php';
require_once __DIR__ . '/controllers/ListingPackageController.php';
require_once __DIR__ . '/controllers/PublicController.php';

// ─── Boot ─────────────────────────────────────────────────────────────────────
// ⚠️ KHÔNG gọi Auth::start() eager ở đây (khác với mọi site WebDeploy khác) — site này có
// 2 session riêng biệt (Auth admin session_name 'RaoNha' vs AccountAuth session_name
// 'RaoNhaAcc'). PHP chỉ cho phép 1 session active/request; nếu Auth::start() chạy trước,
// nó sẽ chiếm session_start() và khiến AccountAuth::start() (gọi sau, trong route /public/accounts/*)
// bị bỏ qua (vì session đã active), gộp luôn 2 session làm một — lộ dữ liệu tài khoản chéo nhau.
// Auth::user()/Auth::require() và AccountAuth::account()/AccountAuth::require() đều tự lazy-start
// đúng session riêng của mình khi được gọi, nên không cần (và KHÔNG ĐƯỢC) start ở đây.
$db = Database::getInstance();
$router = new Router();

// ─── Auth (admin — sysadmin) ────────────────────────────────────────────────
$auth = new AuthController($db);
$router->add('POST', '/auth/login',  [$auth, 'login']);
$router->add('POST', '/auth/logout', [$auth, 'logout']);
$router->add('GET',  '/auth/me',     [$auth, 'me']);

// ─── Users (admin quản trị viên) ────────────────────────────────────────────
$users = new UserController($db);
$router->add('GET',  '/users',                    [$users, 'index']);
$router->add('POST', '/users',                    [$users, 'store']);
$router->add('POST', '/users/:id/update',         [$users, 'update']);
$router->add('POST', '/users/:id/delete',         [$users, 'destroy']);
$router->add('POST', '/users/:id/change-password',[$users, 'changePassword']);

// ─── Settings ────────────────────────────────────────────────────────────────
$settings = new SettingsController($db);
$router->add('GET',  '/settings', [$settings, 'index']);
$router->add('POST', '/settings', [$settings, 'update']);

// ─── Hero slides ─────────────────────────────────────────────────────────────
$slides = new HeroSlideController($db);
$router->add('GET',  '/hero-slides',            [$slides, 'index']);
$router->add('GET',  '/hero-slides/:id',        [$slides, 'show']);
$router->add('POST', '/hero-slides',            [$slides, 'store']);
$router->add('POST', '/hero-slides/:id/update', [$slides, 'update']);
$router->add('POST', '/hero-slides/:id/delete', [$slides, 'destroy']);
$router->add('POST', '/hero-slides/reorder',    [$slides, 'reorder']);

// ─── Contacts ────────────────────────────────────────────────────────────────
$contacts = new ContactController($db);
$router->add('GET',  '/contacts',            [$contacts, 'index']);
$router->add('GET',  '/contacts/:id',        [$contacts, 'show']);
$router->add('POST', '/contacts/:id/update', [$contacts, 'update']);
$router->add('POST', '/contacts/:id/delete', [$contacts, 'destroy']);

// ─── Media (thư viện ảnh) ────────────────────────────────────────────────────
$media = new MediaController($db);
$router->add('GET',  '/media',            [$media, 'index']);
$router->add('POST', '/media/upload',     [$media, 'upload']);
$router->add('POST', '/media/:id/delete', [$media, 'destroy']);

// ─── Upload chung (ImageField admin) + Unsplash ─────────────────────────────
$upload = new UploadController($db);
$router->add('POST', '/upload', [$upload, 'upload']);
$unsplash = new UnsplashController($db);
$router->add('GET',  '/unsplash',          [$unsplash, 'search']);
$router->add('POST', '/unsplash/download', [$unsplash, 'trackDownload']);
// ⚠️ Bug đã biết trong scaffold (xem CLAUDE.md 2026-08-22): UnsplashPicker.tsx gọi POST /unsplash
// (không phải /unsplash/download) để track download — đăng ký thêm route này để không bị 404 âm thầm.
$router->add('POST', '/unsplash',          [$unsplash, 'trackDownload']);

// ─── Stats (dashboard) ───────────────────────────────────────────────────────
$stats = new StatsController($db);
$router->add('GET', '/stats', [$stats, 'index']);

// ─── Listings — Admin kiểm duyệt ─────────────────────────────────────────────
$listingAdmin = new ListingController($db);
$router->add('GET',  '/listings',            [$listingAdmin, 'index']);
$router->add('GET',  '/listings/:id',        [$listingAdmin, 'show']);
$router->add('POST', '/listings/:id/approve',[$listingAdmin, 'approve']);
$router->add('POST', '/listings/:id/reject', [$listingAdmin, 'reject']);
$router->add('POST', '/listings/:id/delete', [$listingAdmin, 'destroy']);

// ─── Ví — Admin duyệt giao dịch chuyển khoản thủ công ────────────────────────
$walletAdmin = new WalletController($db);
$router->add('GET',  '/wallet-transactions',            [$walletAdmin, 'index']);
$router->add('POST', '/wallet-transactions/:id/approve',[$walletAdmin, 'approve']);
$router->add('POST', '/wallet-transactions/:id/reject', [$walletAdmin, 'reject']);

// ─── Accounts (admin — chỉ xem + khoá/mở, KHÔNG sửa mật khẩu) ────────────────
$accountAdmin = new AccountAdminController($db);
$router->add('GET',  '/accounts',                    [$accountAdmin, 'index']);
$router->add('POST', '/accounts/:id/update-status',  [$accountAdmin, 'updateStatus']);

// ─── FAQ / Bài viết / Testimonial / Gói tin — CRUD chuẩn ────────────────────
$faqs = new FaqController($db);
$router->add('GET',  '/faqs',            [$faqs, 'index']);
$router->add('GET',  '/faqs/:id',        [$faqs, 'show']);
$router->add('POST', '/faqs',            [$faqs, 'store']);
$router->add('POST', '/faqs/:id/update', [$faqs, 'update']);
$router->add('POST', '/faqs/:id/delete', [$faqs, 'destroy']);

$articles = new ArticleController($db);
$router->add('GET',  '/articles',            [$articles, 'index']);
$router->add('GET',  '/articles/:id',        [$articles, 'show']);
$router->add('POST', '/articles',            [$articles, 'store']);
$router->add('POST', '/articles/:id/update', [$articles, 'update']);
$router->add('POST', '/articles/:id/delete', [$articles, 'destroy']);

$testimonials = new TestimonialController($db);
$router->add('GET',  '/testimonials',            [$testimonials, 'index']);
$router->add('GET',  '/testimonials/:id',        [$testimonials, 'show']);
$router->add('POST', '/testimonials',            [$testimonials, 'store']);
$router->add('POST', '/testimonials/:id/update', [$testimonials, 'update']);
$router->add('POST', '/testimonials/:id/delete', [$testimonials, 'destroy']);

$listingPackages = new ListingPackageController($db);
$router->add('GET',  '/listing-packages',            [$listingPackages, 'index']);
$router->add('GET',  '/listing-packages/:id',        [$listingPackages, 'show']);
$router->add('POST', '/listing-packages/:id/update', [$listingPackages, 'update']);

// ─── PUBLIC — website gọi, không cần đăng nhập admin ─────────────────────────
$public = new PublicController($db);
$router->add('GET',  '/public/settings',        [$public, 'settings']);
$router->add('GET',  '/public/hero-slides',     [$public, 'heroSlides']);
$router->add('POST', '/public/contact',         [$public, 'submitContact']);
$router->add('GET',  '/public/payment-methods', [$public, 'paymentMethods']);
$router->add('GET',  '/public/listings',            [$public, 'listings']);
$router->add('GET',  '/public/listings/:slug',      [$public, 'listingBySlug']);
$router->add('GET',  '/public/listing-packages',    [$public, 'listingPackages']);
$router->add('GET',  '/public/faqs',            [$public, 'faqs']);
$router->add('GET',  '/public/testimonials',    [$public, 'testimonials']);
$router->add('GET',  '/public/articles',            [$public, 'articles']);
$router->add('GET',  '/public/articles/:slug',      [$public, 'articleBySlug']);
$router->add('GET',  '/sitemap.xml',            [$public, 'sitemap']);

// ─── PUBLIC — tài khoản người đăng tin (AccountAuth, tách biệt admin) ────────
$account = new AccountController($db);
$router->add('POST', '/public/accounts/register', [$account, 'register']);
$router->add('POST', '/public/accounts/login',    [$account, 'login']);
$router->add('POST', '/public/accounts/logout',   [$account, 'logout']);
$router->add('GET',  '/public/accounts/me',       [$account, 'me']);
$router->add('POST', '/public/accounts/me/update',[$account, 'updateMe']);

// ─── PUBLIC — tin đăng của tôi (yêu cầu AccountAuth) ─────────────────────────
$myListing = new MyListingController($db);
$router->add('GET',  '/public/my-listings',           [$myListing, 'index']);
$router->add('POST', '/public/my-listings',           [$myListing, 'store']);
$router->add('POST', '/public/my-listings/:id/renew', [$myListing, 'renew']);
$router->add('POST', '/public/my-listings/:id/upgrade',[$myListing, 'upgrade']);
$router->add('POST', '/public/my-listings/:id/delete',[$myListing, 'destroy']);

// ─── PUBLIC — upload ảnh tin đăng (AccountAuth) ──────────────────────────────
$router->add('POST', '/public/upload', [$upload, 'uploadPublic']);

// ─── PUBLIC — ví credit (nạp tiền + webhook SePay) ────────────────────────────
$walletPublic = new WalletController($db);
$router->add('GET',  '/public/my-wallet-transactions', [$walletPublic, 'myTransactions']);
$router->add('POST', '/public/wallet/topup',   [$walletPublic, 'topup']);
$router->add('POST', '/public/sepay-webhook',  [$walletPublic, 'sepayWebhook']);
