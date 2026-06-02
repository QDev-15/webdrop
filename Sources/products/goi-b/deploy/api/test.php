<?php
// test.php
echo 'pdo_sqlsrv: ' . (extension_loaded('pdo_sqlsrv') ? '✅' : '❌') . '<br>';
echo 'sqlsrv: '     . (extension_loaded('sqlsrv')     ? '✅' : '❌') . '<br>';