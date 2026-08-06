<?php
require_once __DIR__ . '/Database.php';
require_once __DIR__ . '/Router.php';
require_once __DIR__ . '/Response.php';
require_once __DIR__ . '/controllers/PublicController.php';
require_once __DIR__ . '/controllers/ShopPublicController.php';
require_once __DIR__ . '/controllers/StatsController.php';
require_once __DIR__ . '/controllers/ProductController.php';
require_once __DIR__ . '/controllers/ProductCategoryController.php';
require_once __DIR__ . '/controllers/OrderController.php';
require_once __DIR__ . '/controllers/ShopSettingsController.php';

$router = new Router();
$db = Database::getInstance();
$pub = new PublicController($db);
$shop = new ShopPublicController($db);
$stats = new StatsController($db);
$prod = new ProductController($db);
$cat = new ProductCategoryController($db);
$order = new OrderController($db);
$settingsCtrl = new ShopSettingsController($db);

// Public routes
$router->get('/health', fn() => Response::json(['status' => 'ok']));
$router->get('/public/settings', fn() => $pub->settings());
$router->get('/public/contacts', fn() => $shop->contactSubmissions());
$router->post('/public/contacts', fn() => $pub->submitContact());
$router->get('/public/payment-methods', fn() => $shop->paymentMethods());
$router->post('/public/orders', fn() => $shop->createOrder());
$router->get('/public/orders/:code/status', fn($p) => $shop->orderStatus($p['code']));
$router->post('/api/webhooks/sepay', fn() => $shop->sepayWebhook());
$router->get('/public/products', fn() => $shop->products());
$router->get('/public/products/:slug', fn($p) => $shop->productDetail($p['slug']));
$router->get('/public/categories', fn() => $shop->categories());
$router->get('/sitemap.xml', fn() => $shop->sitemap());

// Admin routes (protected)
$router->get('/stats', fn() => $stats->dashboard());
$router->get('/settings', fn() => $settingsCtrl->get());
$router->patch('/settings', fn() => $settingsCtrl->update());
$router->get('/products', fn() => $prod->list());
$router->post('/products', fn() => $prod->create());
$router->get('/products/:id', fn($p) => $prod->detail($p['id']));
$router->patch('/products/:id', fn($p) => $prod->update($p['id']));
$router->delete('/products/:id', fn($p) => $prod->delete($p['id']));
$router->get('/categories', fn() => $cat->list());
$router->post('/categories', fn() => $cat->create());
$router->patch('/categories/:id', fn($p) => $cat->update($p['id']));
$router->delete('/categories/:id', fn($p) => $cat->delete($p['id']));
$router->get('/orders', fn() => $order->list());
$router->get('/orders/:code', fn($p) => $order->detail($p['code']));
$router->patch('/orders/:code', fn($p) => $order->update($p['code']));
$router->post('/media/upload', fn() => $pub->uploadMedia());

return $router;
?>
