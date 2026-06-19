$phpExe = "C:\xampp\php\php.exe"
$base = "d:\Data\Projects\AIProject\webdrop\Sources\WebDeploy\cafe-thoi-gian\api"
$errors = 0
Get-ChildItem -Path $base -Filter "*.php" -Recurse | ForEach-Object {
    $result = & $phpExe -l $_.FullName 2>&1
    if ($result -notmatch "No syntax errors") {
        Write-Host ("ERROR in: " + $_.FullName)
        Write-Host $result
        $errors++
    }
}
Write-Host ("Total PHP errors: " + $errors)
