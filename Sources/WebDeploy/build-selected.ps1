$base = Split-Path -Parent $MyInvocation.MyCommand.Path
$sites = @('shop-ban-hang','shop-thoi-trang','shop-giay-dep','shop-quan-ao','shop-thuc-pham-sach','shop-rau-xanh','shop-tui-sach','shop-may-anh','shop-may-tinh','shop-quan-ao-ami','shop-my-pham','shop-do-gia-dung','shop-do-choi')
$pass = 0; $fail = 0; $failList = @()
foreach ($slug in $sites) {
    Write-Host "[$slug] building..." -NoNewline
    $out = & node "$base\$slug\build.mjs" 2>&1
    if ($LASTEXITCODE -eq 0) { Write-Host " OK"; $pass++ }
    else { Write-Host " FAIL"; $out | ForEach-Object { Write-Host "  $_" }; $fail++; $failList += $slug }
}
Write-Host ""
Write-Host "Done: $pass pass / $fail fail"
if ($failList.Count -gt 0) { Write-Host "FAIL: $($failList -join ', ')" }
