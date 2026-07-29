<?php
$file = 'api/src/Database.php';
$content = file_get_contents($file);

// Remove the foreach loop's unset logic we added
$content = str_replace(
    '        foreach ($products as $p) {
            // Remove material field (index 9) if it exists
            if (count($p) > 14) { unset($p[9]); $p = array_values($p); }
            $stmt->execute($p);
        }',
    '        foreach ($products as $p) { $stmt->execute($p); }',
    $content
);

// Remove all material field strings - pattern: comma + string containing material keyword + comma
$lines = explode("\n", $content);
$fixed = [];
foreach ($lines as $line) {
    // Skip lines that are just material fields in product arrays
    if (preg_match("~^\\s*'[^']{15,}(?:Thép|Gỗ|Nhôm|Inox|Cotton|Silicone|Đồng|Sáp|Hoạt|Rattan|Canvas|Gốm|Vải|Nến)[^']{0,50}',\\s*\\$~", $line)) {
        continue;  // Skip this line entirely
    }
    $fixed[] = $line;
}

file_put_contents($file, implode("\n", $fixed));
echo "Fixed Database.php - removed material fields!\n";
