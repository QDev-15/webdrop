$base = "d:\Data\Projects\AIProject\webdrop\Sources\WebDeploy\nha-hang-nhat-ban\api"
$fixed = 0
Get-ChildItem -Path $base -Filter "*.php" -Recurse | ForEach-Object {
    $b = [System.IO.File]::ReadAllBytes($_.FullName)
    if ($b.Length -ge 3 -and $b[0] -eq 0xEF -and $b[1] -eq 0xBB -and $b[2] -eq 0xBF) {
        [System.IO.File]::WriteAllBytes($_.FullName, $b[3..($b.Length-1)])
        Write-Host ("BOM stripped: " + $_.Name)
        $fixed++
    }
}
Write-Host ("Total BOM fixed: " + $fixed + " files")
