<?php
// diag.php
ini_set('display_errors', 1);
error_reporting(E_ALL);

echo '<pre>';
echo 'PHP: ' . PHP_VERSION . "\n";
echo 'PDO drivers: ' . implode(', ', PDO::getAvailableDrivers()) . "\n";
echo 'pdo_sqlite: ' . (in_array('sqlite', PDO::getAvailableDrivers()) ? 'YES' : 'NO') . "\n";
echo 'pdo_sqlsrv: ' . (in_array('sqlsrv', PDO::getAvailableDrivers()) ? 'YES' : 'NO') . "\n";
echo '</pre>';