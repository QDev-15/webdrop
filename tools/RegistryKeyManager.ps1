#Requires -Version 5.1
[CmdletBinding()]
param()

$ErrorActionPreference = 'Stop'
$hiveMap = @{
    '1' = @{ Label = 'HKEY_CURRENT_USER';  Drive = 'HKCU'; Root = 'HKEY_CURRENT_USER' }
    '2' = @{ Label = 'HKEY_LOCAL_MACHINE'; Drive = 'HKLM'; Root = 'HKEY_LOCAL_MACHINE' }
    '3' = @{ Label = 'HKEY_CLASSES_ROOT';  Drive = 'HKCR'; Root = 'HKEY_CLASSES_ROOT' }
    '4' = @{ Label = 'HKEY_USERS';         Drive = 'HKU';  Root = 'HKEY_USERS' }
    '5' = @{ Label = 'HKEY_CURRENT_CONFIG';Drive = 'HKCC'; Root = 'HKEY_CURRENT_CONFIG' }
}

function Test-IsAdmin {
    $id = [Security.Principal.WindowsIdentity]::GetCurrent()
    $p = New-Object Security.Principal.WindowsPrincipal($id)
    return $p.IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)
}

function Request-Elevation {
    Write-Host "`nPowerShell hien khong chay voi quyen Administrator." -ForegroundColor Yellow
    Write-Host "Neu khong co quyen nay, ban se khong the xoa key trong HKLM/HKU/HKCC." -ForegroundColor Yellow
    $ans = Read-Host "Chay lai script voi quyen Administrator ngay bay gio? (y/N)"
    if ($ans -ne 'y' -and $ans -ne 'Y') { return $false }

    # -Verb RunAs bat buoc mo cua so console moi (UAC khong the elevate console hien tai tai cho),
    # nen chi co the relaunch process moi roi thoat process khong-admin nay.
    try {
        $argLine = "-NoProfile -ExecutionPolicy Bypass -File `"$PSCommandPath`""
        Start-Process -FilePath 'powershell.exe' -ArgumentList $argLine -Verb RunAs -ErrorAction Stop
        return $true
    } catch {
        Write-Host "Khong the chay voi quyen Administrator: $($_.Exception.Message)" -ForegroundColor Red
        Write-Host "Tiep tuc chay voi quyen hien tai." -ForegroundColor DarkGray
        return $false
    }
}

function Ensure-Drive($drive, $root) {
    if (-not (Get-PSDrive -Name $drive -ErrorAction SilentlyContinue)) {
        try {
            New-PSDrive -Name $drive -PSProvider Registry -Root $root -Scope Global -ErrorAction Stop | Out-Null
        } catch {
            Write-Host "Khong the mo hive $root : $($_.Exception.Message)" -ForegroundColor Red
            return $false
        }
    }
    return $true
}

function ConvertTo-RegExePath($psPath) {
    # reg.exe export needs "HKEY_..." backslash paths, not PowerShell's "HKCU:\..." form.
    $body = $psPath -replace '^Microsoft\.PowerShell\.Core\\Registry::', ''
    foreach ($h in $hiveMap.Values) {
        $body = $body -replace "^$($h.Drive):", $h.Root
    }
    return $body
}

function Select-Hive {
    Write-Host ""
    Write-Host "Chon registry hive de tim kiem:" -ForegroundColor Cyan
    foreach ($k in ($hiveMap.Keys | Sort-Object)) {
        Write-Host "  [$k] $($hiveMap[$k].Label)"
    }
    Write-Host "  [0] Huy"
    $choice = Read-Host "Nhap so"
    if ($choice -eq '0' -or [string]::IsNullOrWhiteSpace($choice)) { return $null }
    if (-not $hiveMap.ContainsKey($choice)) {
        Write-Host "Lua chon khong hop le." -ForegroundColor Red
        return Select-Hive
    }
    return $hiveMap[$choice]
}

function Get-SearchableValueText($data) {
    if ($null -eq $data) { return '' }
    if ($data -is [byte[]]) {
        # REG_BINARY rong (Length 0): PowerShell "giai nen" mang rong thanh $null khi gan qua
        # bieu thuc if/else, nen phai chan rieng truoc khi dua vao BitConverter (khac se nem
        # ArgumentNullException). BitConverter.ToString + String.Replace (khong dung -replace/
        # regex) de tranh treo nhieu chuc giay tren gia tri REG_BINARY lon (MRU/icon cache co
        # the toi vai MB); chi can du lieu trong 4KB dau la du de tim kiem.
        if ($data.Length -eq 0) { return '' }
        $capped = if ($data.Length -gt 4096) { $data[0..4095] } else { $data }
        return [BitConverter]::ToString($capped).Replace('-', '')
    }
    if ($data -is [array]) { return ($data -join "`n") }
    return [string]$data
}

$script:TimeoutPS = $null

function Reset-TimeoutRunspace {
    if ($script:TimeoutPS) {
        try { $script:TimeoutPS.Runspace.Close() } catch {}
        try { $script:TimeoutPS.Dispose() } catch {}
    }
    $script:TimeoutPS = $null
}

function Get-ItemPropertyWithTimeout($path, $timeoutMs) {
    # Mot so key (gia tri qua lon, key ao/duoc dieu huong, hoac bi hook boi AV/EDR) co the
    # khien Get-ItemProperty treo that su nhieu chuc giay. Chay qua 1 runspace nen rieng va
    # gioi han thoi gian cho, neu qua han thi Stop() + bo runspace do (co the da "ket") va
    # tao runspace moi cho lan goi ke tiep, thay vi de ca vong quet bi treo vinh vien.
    if (-not $script:TimeoutPS) {
        $rs = [runspacefactory]::CreateRunspace()
        $rs.Open()
        $script:TimeoutPS = [PowerShell]::Create()
        $script:TimeoutPS.Runspace = $rs
    }
    $ps = $script:TimeoutPS
    $ps.Commands.Clear()
    [void]$ps.AddCommand('Get-ItemProperty').AddParameter('Path', $path).AddParameter('ErrorAction', 'SilentlyContinue')
    $async = $ps.BeginInvoke()
    if (-not $async.AsyncWaitHandle.WaitOne($timeoutMs)) {
        try { $ps.Stop() } catch {}
        Reset-TimeoutRunspace
        return @{ TimedOut = $true; Value = $null }
    }
    try {
        $out = $ps.EndInvoke($async)
        $value = if ($out -and $out.Count -gt 0) { $out[0] } else { $null }
        return @{ TimedOut = $false; Value = $value }
    } catch {
        return @{ TimedOut = $false; Value = $null }
    }
}

function Get-KeyMatchReason($key, $pattern, [ref]$timedOut) {
    if (($key.PSChildName -like "*$pattern*") -or ($key.Name -like "*$pattern*")) {
        return 'ten key'
    }

    $safe = Get-ItemPropertyWithTimeout -path $key.PSPath -timeoutMs 3000
    if ($safe.TimedOut) {
        $timedOut.Value = $true
        return $null
    }
    $props = $safe.Value
    if (-not $props) { return $null }

    foreach ($prop in $props.PSObject.Properties) {
        if ($prop.Name -like 'PS*') { continue }
        if ($prop.Name -like "*$pattern*") {
            return "ten gia tri '$($prop.Name)'"
        }
        $text = Get-SearchableValueText $prop.Value
        if ($text -like "*$pattern*") {
            $snippet = $text
            if ($snippet.Length -gt 60) { $snippet = $snippet.Substring(0, 60) + '...' }
            return "du lieu gia tri '$($prop.Name)' = $snippet"
        }
    }
    return $null
}

function Write-ScanStatus($scanned, $foundCount, $skippedCount, $currentName) {
    $shown = $currentName
    if ($shown.Length -gt 80) { $shown = $shown.Substring(0, 80) + '...' }
    $line = "  [{0} key da quet, {1} khop, {2} bo qua] {3}" -f $scanned, $foundCount, $skippedCount, $shown
    if ($line.Length -lt 115) { $line = $line.PadRight(115) }
    Write-Host "`r$line" -NoNewline
}

function Search-RegistryKeys($drive, $subPath, $pattern) {
    $root = if ([string]::IsNullOrWhiteSpace($subPath)) { "${drive}:\" } else { "${drive}:\$subPath" }
    if (-not (Test-Path $root)) {
        Write-Host "Duong dan khong ton tai: $root" -ForegroundColor Red
        return @()
    }

    Write-Host "`nDang tim kiem trong $root (ten key + ten/du lieu gia tri) ... (co the mat vai phut voi HKLM/HKCR)" -ForegroundColor DarkGray

    $results = New-Object System.Collections.Generic.List[object]
    $scanned = 0
    $skipped = 0
    $sw = [System.Diagnostics.Stopwatch]::StartNew()

    # Xu ly moi key ngay khi Get-ChildItem tim thay (thay vi doi gom het vao mang roi moi
    # xu ly) de status hien thi ngay trong luc quet, khong bi "dung im" o hive lon nhu HKLM.
    $rootItem = Get-Item -Path $root -ErrorAction SilentlyContinue
    if ($rootItem) {
        $scanned++
        Write-ScanStatus $scanned $results.Count $skipped $rootItem.Name
        $timedOut = $false
        $reason = Get-KeyMatchReason -key $rootItem -pattern $pattern -timedOut ([ref]$timedOut)
        if ($timedOut) { $skipped++ }
        if ($reason) { $results.Add([PSCustomObject]@{ Path = $rootItem.PSPath; Display = $rootItem.Name; Reason = $reason }) }
    }

    Get-ChildItem -Path $root -Recurse -ErrorAction SilentlyContinue | ForEach-Object {
        $key = $_
        $scanned++
        if ($sw.ElapsedMilliseconds -ge 80) {
            Write-ScanStatus $scanned $results.Count $skipped $key.Name
            $sw.Restart()
        }
        $timedOut = $false
        $reason = Get-KeyMatchReason -key $key -pattern $pattern -timedOut ([ref]$timedOut)
        if ($timedOut) {
            $skipped++
            Write-ScanStatus $scanned $results.Count $skipped $key.Name
        }
        if ($reason) {
            $results.Add([PSCustomObject]@{ Path = $key.PSPath; Display = $key.Name; Reason = $reason })
        }
    }

    Write-Host ("`r" + (' ' * 110) + "`r") -NoNewline
    Write-Host "Da quet xong $scanned key." -ForegroundColor DarkGray
    if ($skipped -gt 0) {
        Write-Host "Bo qua $skipped key vi doc du lieu qua 3 giay (gia tri qua lon / key bi khoa hoac cham bat thuong)." -ForegroundColor Yellow
    }
    return $results
}

function Parse-Selection($selectionText, $max) {
    if ($selectionText -match '^(?i)all$') { return 1..$max }
    $indices = New-Object System.Collections.Generic.List[int]
    foreach ($part in ($selectionText -split ',')) {
        $part = $part.Trim()
        if ($part -eq '') { continue }
        if ($part -match '^\d+-\d+$') {
            $bounds = $part -split '-'
            $lo = [int]$bounds[0]; $hi = [int]$bounds[1]
            if ($lo -gt $hi) { $tmp = $lo; $lo = $hi; $hi = $tmp }
            foreach ($i in $lo..$hi) { if ($i -ge 1 -and $i -le $max) { $indices.Add($i) } }
        } elseif ($part -match '^\d+$') {
            $i = [int]$part
            if ($i -ge 1 -and $i -le $max) { $indices.Add($i) }
        }
    }
    return $indices | Sort-Object -Unique
}

function Backup-Keys($selected, $backupDir) {
    if (-not (Test-Path $backupDir)) {
        try {
            New-Item -ItemType Directory -Path $backupDir -ErrorAction Stop | Out-Null
        } catch {
            Write-Host "Khong the tao thu muc backup $backupDir : $($_.Exception.Message)" -ForegroundColor Red
            return @{ Ok = @(); Fail = $selected }
        }
    }
    $ok = @()
    $fail = @()
    $i = 0
    foreach ($item in $selected) {
        $i++
        $regPath = ConvertTo-RegExePath $item.Path
        $safeName = ($regPath -replace '[\\\/:*?"<>|]', '_')
        if ($safeName.Length -gt 150) { $safeName = $safeName.Substring(0, 150) }
        $file = Join-Path $backupDir "$i`_$safeName.reg"
        & reg.exe export "$regPath" "$file" /y 2>$null | Out-Null
        if ($LASTEXITCODE -eq 0 -and (Test-Path $file)) {
            $ok += $item
        } else {
            $fail += $item
        }
    }
    return @{ Ok = $ok; Fail = $fail }
}

function Delete-Keys($selected) {
    $ok = @()
    $fail = @()
    foreach ($item in $selected) {
        try {
            Remove-Item -Path $item.Path -Recurse -Force -ErrorAction Stop
            $ok += $item
        } catch {
            $fail += @{ Item = $item; Error = $_.Exception.Message }
        }
    }
    return @{ Ok = $ok; Fail = $fail }
}

function Run-Search {
    $hive = Select-Hive
    if (-not $hive) { return }
    if (-not (Ensure-Drive $hive.Drive $hive.Root)) { return }

    if (($hive.Drive -in @('HKLM', 'HKU', 'HKCC')) -and -not (Test-IsAdmin)) {
        Write-Host "`nCANH BAO: PowerShell dang chay KHONG voi quyen Administrator." -ForegroundColor Yellow
        Write-Host "Ban van co the tim kiem, nhung xoa key trong $($hive.Label) co the that bai." -ForegroundColor Yellow
        if (Request-Elevation) { exit 0 }
    }

    $subPath = Read-Host "`nDuong dan con de gioi han tim kiem (Enter = toan bo hive, vd: SOFTWARE\MyApp)"

    if ([string]::IsNullOrWhiteSpace($subPath) -and $hive.Drive -in @('HKLM', 'HKCR', 'HKU')) {
        Write-Host "`nCANH BAO: quet toan bo $($hive.Label) tu goc co the co hang tram nghin key va mat rat lau." -ForegroundColor Yellow
        $confirmFull = Read-Host "Van tiep tuc quet toan bo? (y/N)"
        if ($confirmFull -ne 'y' -and $confirmFull -ne 'Y') {
            Write-Host "Da huy. Chay lai va nhap duong dan con de gioi han pham vi." -ForegroundColor DarkGray
            return
        }
    }

    $pattern = Read-Host "Tu khoa tim kiem - khop ten key, ten gia tri hoac du lieu gia tri (it nhat 2 ky tu)"
    while ([string]::IsNullOrWhiteSpace($pattern) -or $pattern.Trim().Length -lt 2) {
        Write-Host "Tu khoa qua ngan, vui long nhap lai." -ForegroundColor Red
        $pattern = Read-Host "Tu khoa tim kiem (it nhat 2 ky tu)"
    }

    $results = @(Search-RegistryKeys -drive $hive.Drive -subPath $subPath -pattern $pattern.Trim())
    if ($results.Count -eq 0) {
        Write-Host "`nKhong tim thay key nao khop '$pattern'." -ForegroundColor Yellow
        return
    }

    Write-Host "`nTim thay $($results.Count) key:" -ForegroundColor Green
    for ($i = 0; $i -lt $results.Count; $i++) {
        Write-Host ("  [{0}] {1}" -f ($i + 1), $results[$i].Display)
        if ($results[$i].Reason -ne 'ten key') {
            Write-Host ("        khop: {0}" -f $results[$i].Reason) -ForegroundColor DarkGray
        }
    }

    Write-Host "`nChon key de XOA:" -ForegroundColor Cyan
    Write-Host "  - Nhap 'all' de chon toan bo"
    Write-Host "  - Nhap so don le hoac danh sach, vd: 1,3,5-7"
    Write-Host "  - Enter / 0 de huy"
    $sel = Read-Host "Lua chon"
    if ([string]::IsNullOrWhiteSpace($sel) -or $sel.Trim() -eq '0') {
        Write-Host "Da huy." -ForegroundColor DarkGray
        return
    }

    $indices = Parse-Selection $sel.Trim() $results.Count
    if ($indices.Count -eq 0) {
        Write-Host "Khong co lua chon hop le." -ForegroundColor Red
        return
    }

    $selected = $indices | ForEach-Object { $results[$_ - 1] }

    Write-Host "`nBan sap XOA $($selected.Count) key sau:" -ForegroundColor Red
    $selected | ForEach-Object { Write-Host "  - $($_.Display)" }

    $confirm = Read-Host "`nGo chinh xac chu 'DELETE' de xac nhan xoa (mac dinh se tu dong backup .reg truoc)"
    if ($confirm -ne 'DELETE') {
        Write-Host "Da huy, khong co gi bi xoa." -ForegroundColor DarkGray
        return
    }

    $backupDir = Join-Path $PSScriptRoot ("Backups\{0}" -f (Get-Date -Format 'yyyyMMdd_HHmmss'))
    Write-Host "`nDang backup ra $backupDir ..." -ForegroundColor DarkGray
    $backupResult = Backup-Keys -selected $selected -backupDir $backupDir

    if ($backupResult.Fail.Count -gt 0) {
        Write-Host "`nKHONG backup duoc $($backupResult.Fail.Count) key (co the do khong du quyen):" -ForegroundColor Red
        $backupResult.Fail | ForEach-Object { Write-Host "  - $($_.Display)" }
        $proceed = Read-Host "Van tiep tuc xoa CAC KEY DA BACKUP THANH CONG? (y/N)"
        if ($proceed -ne 'y' -and $proceed -ne 'Y') {
            Write-Host "Da dung lai. Khong co gi bi xoa." -ForegroundColor DarkGray
            return
        }
    }

    if ($backupResult.Ok.Count -eq 0) {
        Write-Host "`nKhong co key nao backup thanh cong, huy xoa de an toan." -ForegroundColor Red
        return
    }

    $deleteResult = Delete-Keys -selected $backupResult.Ok

    Write-Host "`n== KET QUA ==" -ForegroundColor Cyan
    Write-Host "Backup thanh cong: $($backupResult.Ok.Count) | Backup that bai: $($backupResult.Fail.Count)"
    Write-Host "Xoa thanh cong: $($deleteResult.Ok.Count) | Xoa that bai: $($deleteResult.Fail.Count)"
    if ($deleteResult.Fail.Count -gt 0) {
        Write-Host "`nCac key xoa THAT BAI:" -ForegroundColor Red
        $deleteResult.Fail | ForEach-Object { Write-Host "  - $($_.Item.Display) => $($_.Error)" }
    }
    Write-Host "`nFile backup .reg nam trong: $backupDir" -ForegroundColor Green
    Write-Host "(De khoi phuc: double-click file .reg hoac chay 'reg import <file>')" -ForegroundColor DarkGray
}

# Bao ca vong doi script trong try/catch/finally: $ErrorActionPreference='Stop' o dau file
# nghia la BAT KY loi khong luong truoc nao (kho ghi HKLM, key la, mat mang khi export...)
# se thanh loi dung chuong trinh. Neu chay qua Start-Process -Verb RunAs (elevated window
# rieng), khi process thoat do loi thi cua so dong ngay lap tuc - nguoi dung khong kip doc
# loi gi. Finally { Read-Host } dam bao cua so LUON dung lai cho nguoi dung xem truoc khi dong.
try {
    Write-Host "=====================================" -ForegroundColor Cyan
    Write-Host "  Registry Key Search & Delete Tool" -ForegroundColor Cyan
    Write-Host "=====================================" -ForegroundColor Cyan
    if (-not (Test-IsAdmin)) {
        Write-Host "Luu y: can quyen Administrator de xoa key trong HKLM/HKU/HKCC." -ForegroundColor Yellow
        if (Request-Elevation) { exit 0 }
    }

    do {
        Run-Search
        Write-Host ""
        $again = Read-Host "Tim kiem lan nua? (Y/n)"
    } while ($again -ne 'n' -and $again -ne 'N')

    Write-Host "`nKet thuc." -ForegroundColor Cyan
} catch {
    Write-Host "`n=====================================" -ForegroundColor Red
    Write-Host "LOI KHONG MONG MUON - SCRIPT DA DUNG LAI" -ForegroundColor Red
    Write-Host "=====================================" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
    if ($_.InvocationInfo) {
        Write-Host ("Tai: {0} (dong {1})" -f $_.InvocationInfo.ScriptName, $_.InvocationInfo.ScriptLineNumber) -ForegroundColor DarkGray
    }
} finally {
    Reset-TimeoutRunspace
    Write-Host "`nNhan Enter de dong cua so..." -ForegroundColor DarkGray
    Read-Host | Out-Null
}


