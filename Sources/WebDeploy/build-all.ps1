param([switch]$FailOnly)

$base = Split-Path -Parent $MyInvocation.MyCommand.Path
$timestamp = Get-Date -Format "yyyyMMdd-HHmm"
$logFile = "$base\build-all-$timestamp.log"

function Log($msg) {
    $line = "[$(Get-Date -Format 'HH:mm:ss')] $msg"
    Write-Host $line
    Add-Content $logFile $line
}

$dirs = Get-ChildItem $base -Directory | Where-Object { Test-Path "$($_.FullName)\build.mjs" } | Sort-Object Name
$dirs = $dirs | Where-Object { $_.Name -ne "_scaffold" }
$dirs = $dirs | Where-Object { $_.Name -ne "_output-deploy" }
$total = $dirs.Count
$pass = 0; $fail = 0; $failList = @()

Log "=== BUILD ALL WEBDEPLOY ==="
Log "Tổng: $total site | Log: $logFile"
Log ""

$i = 0
foreach ($d in $dirs) {
    $i++
    $slug = $d.Name
    Log "[$i/$total] $slug ..."

    try {
        $result = & node "$($d.FullName)\build.mjs" 2>&1
        if ($LASTEXITCODE -eq 0) {
            $pass++
            Log "  ✅ PASS"
        } else {
            $fail++
            $failList += $slug
            Log "  ❌ FAIL (exit $LASTEXITCODE)"
            $result | ForEach-Object { Add-Content $logFile "    $_" }
        }
    } catch {
        $fail++
        $failList += $slug
        Log "  ❌ ERROR: $_"
    }
    Log ""
}

Log "=== KẾT QUẢ ==="
Log "✅ Pass: $pass / $total"
Log "❌ Fail: $fail / $total"
if ($failList.Count -gt 0) {
    Log ""
    Log "Danh sách FAIL:"
    $failList | ForEach-Object { Log "  - $_" }
}
Log ""
Log "Hoàn thành lúc $(Get-Date -Format 'HH:mm:ss dd/MM/yyyy')"
