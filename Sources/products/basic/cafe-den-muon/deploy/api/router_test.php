<?php
// Router mô phỏng .htaccess rewrite cho php -S — mọi request không phải file tĩnh -> index.php
$uri = urldecode(parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH));
if ($uri !== '/' && file_exists(__DIR__ . $uri) && !is_dir(__DIR__ . $uri)) {
    return false;
}
$_SERVER['REDIRECT_URL'] = $uri;
require __DIR__ . '/index.php';
