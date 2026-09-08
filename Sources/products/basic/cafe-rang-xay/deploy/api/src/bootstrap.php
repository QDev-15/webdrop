<?php
declare(strict_types=1);

// Ghi chú: bodyJson()/slugify() đã khai báo sẵn trong Database.php — không khai báo lại ở đây.

// ─── Core classes ─────────────────────────────────────────────────────────────
require_once __DIR__ . '/Response.php';
require_once __DIR__ . '/Router.php';
require_once __DIR__ . '/Auth.php';
require_once __DIR__ . '/Database.php';

// ─── Controllers ────────────────────────────────────────────────────────────
require_once __DIR__ . '/controllers/AuthController.php';
require_once __DIR__ . '/controllers/UserController.php';
require_once __DIR__ . '/controllers/SettingsController.php';
require_once __DIR__ . '/controllers/HeroSlideController.php';
require_once __DIR__ . '/controllers/ContactController.php';
require_once __DIR__ . '/controllers/MediaController.php';
require_once __DIR__ . '/controllers/UploadController.php';
require_once __DIR__ . '/controllers/UnsplashController.php';
require_once __DIR__ . '/controllers/MenuCategoryController.php';
require_once __DIR__ . '/controllers/MenuItemController.php';
require_once __DIR__ . '/controllers/FeaturedDrinkController.php';
require_once __DIR__ . '/controllers/RetailBeanController.php';
require_once __DIR__ . '/controllers/BrewMethodController.php';
require_once __DIR__ . '/controllers/RoastStepController.php';
require_once __DIR__ . '/controllers/WorkAreaController.php';
require_once __DIR__ . '/controllers/GalleryController.php';
require_once __DIR__ . '/controllers/TimelineController.php';
require_once __DIR__ . '/controllers/TestimonialController.php';
require_once __DIR__ . '/controllers/FaqController.php';
require_once __DIR__ . '/controllers/StatsController.php';
require_once __DIR__ . '/controllers/PublicController.php';

// ─── Boot ─────────────────────────────────────────────────────────────────────
Auth::start();
$db = Database::getInstance();
$router = new Router();

// ─── Auth ─────────────────────────────────────────────────────────────────────
$auth = new AuthController($db);
$router->add('POST', '/auth/login',  [$auth, 'login']);
$router->add('POST', '/auth/logout', [$auth, 'logout']);
$router->add('GET',  '/auth/me',     [$auth, 'me']);

// ─── Users ────────────────────────────────────────────────────────────────────
$user = new UserController($db);
$router->add('GET',  '/users',                     [$user, 'index']);
$router->add('POST', '/users',                     [$user, 'store']);
$router->add('POST', '/users/:id/update',          [$user, 'update']);
$router->add('POST', '/users/:id/delete',          [$user, 'destroy']);
$router->add('POST', '/users/:id/change-password', [$user, 'changePassword']);

// ─── Settings ─────────────────────────────────────────────────────────────────
$settings = new SettingsController($db);
$router->add('GET',  '/settings',        [$settings, 'index']);
$router->add('POST', '/settings/update', [$settings, 'update']);

// ─── Hero Slides ────────────────────────────────────────────────────────────
$slides = new HeroSlideController($db);
$router->add('GET',  '/hero-slides',            [$slides, 'index']);
$router->add('GET',  '/hero-slides/:id',        [$slides, 'show']);
$router->add('POST', '/hero-slides',            [$slides, 'store']);
$router->add('POST', '/hero-slides/:id/update', [$slides, 'update']);
$router->add('POST', '/hero-slides/:id/delete', [$slides, 'destroy']);
$router->add('POST', '/hero-slides/reorder',    [$slides, 'reorder']);

// ─── Contacts ─────────────────────────────────────────────────────────────────
$contact = new ContactController($db);
$router->add('GET',  '/contacts',            [$contact, 'index']);
$router->add('GET',  '/contacts/:id',        [$contact, 'show']);
$router->add('POST', '/contacts/:id/update', [$contact, 'update']);
$router->add('POST', '/contacts/:id/delete', [$contact, 'destroy']);

// ─── Media ────────────────────────────────────────────────────────────────────
$media = new MediaController($db);
$router->add('GET',  '/media',            [$media, 'index']);
$router->add('POST', '/media/upload',     [$media, 'upload']);
$router->add('POST', '/media/:id/delete', [$media, 'destroy']);

// ─── Upload & Unsplash ──────────────────────────────────────────────────────
$upload = new UploadController($db);
$router->add('POST', '/upload', [$upload, 'upload']);
$unsplash = new UnsplashController($db);
$router->add('GET',  '/unsplash',          [$unsplash, 'search']);
// UnsplashPicker.tsx (scaffold) gọi POST /unsplash để track download — giữ cả 2 route để tương thích.
$router->add('POST', '/unsplash',          [$unsplash, 'trackDownload']);
$router->add('POST', '/unsplash/download', [$unsplash, 'trackDownload']);

// ─── Extension: Thực đơn ────────────────────────────────────────────────────
$menuCat = new MenuCategoryController($db);
$router->add('GET',  '/menu-categories',            [$menuCat, 'index']);
$router->add('GET',  '/menu-categories/:id',        [$menuCat, 'show']);
$router->add('POST', '/menu-categories',            [$menuCat, 'store']);
$router->add('POST', '/menu-categories/:id/update', [$menuCat, 'update']);
$router->add('POST', '/menu-categories/:id/delete', [$menuCat, 'destroy']);

$menuItem = new MenuItemController($db);
$router->add('GET',  '/menu-items',            [$menuItem, 'index']);
$router->add('GET',  '/menu-items/:id',        [$menuItem, 'show']);
$router->add('POST', '/menu-items',            [$menuItem, 'store']);
$router->add('POST', '/menu-items/:id/update', [$menuItem, 'update']);
$router->add('POST', '/menu-items/:id/delete', [$menuItem, 'destroy']);

// ─── Extension: Thức uống nổi bật (trang chủ) ──────────────────────────────
$featDrink = new FeaturedDrinkController($db);
$router->add('GET',  '/featured-drinks',            [$featDrink, 'index']);
$router->add('GET',  '/featured-drinks/:id',        [$featDrink, 'show']);
$router->add('POST', '/featured-drinks',            [$featDrink, 'store']);
$router->add('POST', '/featured-drinks/:id/update', [$featDrink, 'update']);
$router->add('POST', '/featured-drinks/:id/delete', [$featDrink, 'destroy']);

// ─── Extension: Hạt rang mang về (trang thực đơn) ──────────────────────────
$retailBean = new RetailBeanController($db);
$router->add('GET',  '/retail-beans',            [$retailBean, 'index']);
$router->add('GET',  '/retail-beans/:id',        [$retailBean, 'show']);
$router->add('POST', '/retail-beans',            [$retailBean, 'store']);
$router->add('POST', '/retail-beans/:id/update', [$retailBean, 'update']);
$router->add('POST', '/retail-beans/:id/delete', [$retailBean, 'destroy']);

// ─── Extension: Phương pháp pha chế (trang chủ) ────────────────────────────
$brewMethod = new BrewMethodController($db);
$router->add('GET',  '/brew-methods',            [$brewMethod, 'index']);
$router->add('GET',  '/brew-methods/:id',        [$brewMethod, 'show']);
$router->add('POST', '/brew-methods',            [$brewMethod, 'store']);
$router->add('POST', '/brew-methods/:id/update', [$brewMethod, 'update']);
$router->add('POST', '/brew-methods/:id/delete', [$brewMethod, 'destroy']);

// ─── Extension: Quy trình chọn hạt (trang giới thiệu) ──────────────────────
$roastStep = new RoastStepController($db);
$router->add('GET',  '/roast-steps',            [$roastStep, 'index']);
$router->add('GET',  '/roast-steps/:id',        [$roastStep, 'show']);
$router->add('POST', '/roast-steps',            [$roastStep, 'store']);
$router->add('POST', '/roast-steps/:id/update', [$roastStep, 'update']);
$router->add('POST', '/roast-steps/:id/delete', [$roastStep, 'destroy']);

// ─── Extension: Khu vực xưởng (trang chủ + không gian) ─────────────────────
$workArea = new WorkAreaController($db);
$router->add('GET',  '/work-areas',            [$workArea, 'index']);
$router->add('GET',  '/work-areas/:id',        [$workArea, 'show']);
$router->add('POST', '/work-areas',            [$workArea, 'store']);
$router->add('POST', '/work-areas/:id/update', [$workArea, 'update']);
$router->add('POST', '/work-areas/:id/delete', [$workArea, 'destroy']);

// ─── Extension: Thư viện ảnh (khong-gian.html) ─────────────────────────────
$gallery = new GalleryController($db);
$router->add('GET',  '/gallery',            [$gallery, 'index']);
$router->add('GET',  '/gallery/:id',        [$gallery, 'show']);
$router->add('POST', '/gallery',            [$gallery, 'store']);
$router->add('POST', '/gallery/:id/update', [$gallery, 'update']);
$router->add('POST', '/gallery/:id/delete', [$gallery, 'destroy']);

// ─── Extension: Hành trình thương hiệu (gioi-thieu.html) ───────────────────
$timeline = new TimelineController($db);
$router->add('GET',  '/timeline',            [$timeline, 'index']);
$router->add('GET',  '/timeline/:id',        [$timeline, 'show']);
$router->add('POST', '/timeline',            [$timeline, 'store']);
$router->add('POST', '/timeline/:id/update', [$timeline, 'update']);
$router->add('POST', '/timeline/:id/delete', [$timeline, 'destroy']);

// ─── Extension: Đánh giá khách hàng ─────────────────────────────────────────
$testimonial = new TestimonialController($db);
$router->add('GET',  '/testimonials',            [$testimonial, 'index']);
$router->add('GET',  '/testimonials/:id',        [$testimonial, 'show']);
$router->add('POST', '/testimonials',            [$testimonial, 'store']);
$router->add('POST', '/testimonials/:id/update', [$testimonial, 'update']);
$router->add('POST', '/testimonials/:id/delete', [$testimonial, 'destroy']);

// ─── Extension: Câu hỏi thường gặp ──────────────────────────────────────────
$faq = new FaqController($db);
$router->add('GET',  '/faqs',            [$faq, 'index']);
$router->add('GET',  '/faqs/:id',        [$faq, 'show']);
$router->add('POST', '/faqs',            [$faq, 'store']);
$router->add('POST', '/faqs/:id/update', [$faq, 'update']);
$router->add('POST', '/faqs/:id/delete', [$faq, 'destroy']);

// ─── Admin Stats ────────────────────────────────────────────────────────────
$stats = new StatsController($db);
$router->add('GET', '/stats', [$stats, 'index']);

// ─── Public (không cần đăng nhập) ─────────────────────────────────────────────
$pub = new PublicController($db);
$router->add('GET',  '/public/settings',         [$pub, 'settings']);
$router->add('GET',  '/public/hero-slides',      [$pub, 'heroSlides']);
$router->add('GET',  '/public/menu-categories',  [$pub, 'menuCategories']);
$router->add('GET',  '/public/menu-items',       [$pub, 'menuItems']);
$router->add('GET',  '/public/featured-drinks',  [$pub, 'featuredDrinks']);
$router->add('GET',  '/public/retail-beans',     [$pub, 'retailBeans']);
$router->add('GET',  '/public/brew-methods',     [$pub, 'brewMethods']);
$router->add('GET',  '/public/roast-steps',      [$pub, 'roastSteps']);
$router->add('GET',  '/public/work-areas',       [$pub, 'workAreas']);
$router->add('GET',  '/public/gallery',          [$pub, 'galleryItems']);
$router->add('GET',  '/public/timeline',         [$pub, 'timelineItems']);
$router->add('GET',  '/public/testimonials',     [$pub, 'testimonials']);
$router->add('GET',  '/public/faqs',             [$pub, 'faqs']);
$router->add('POST', '/public/contact',          [$pub, 'submitContact']);
$router->add('GET',  '/sitemap.xml',             [$pub, 'sitemap']);

return $router;
