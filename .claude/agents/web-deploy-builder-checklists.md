---
name: web-deploy-builder-checklists
description: Bước 8 & 9 checklists — Verify trước khi báo xong
model: claude-sonnet-5
---

# Bước 8 — Checklist Cuối (Pre-Ship)

Chạy tuần tự các checks bên dưới. Nếu bất kỳ check fail → fix → chạy lại cho đến hết.

## Files Essentials

- [ ] `api/config.php` có CORS_ORIGINS + comment hướng dẫn APP_URL
- [ ] `api/index.php` có health endpoint `/health`
- [ ] `api/schema.sql` có `PRAGMA foreign_keys = ON` + seed data thật từ template
- [ ] `api/src/Database.php` — `migrate()` check `file_get_contents` false; `seedData()` chỉ chạy khi table rỗng
- [ ] `api/src/bootstrap.php` có helpers + `Auth::start()` trước `Database::getInstance()` + đủ routes
  - **Grep riêng `/media/upload`** (rule 15 — route hay bị bỏ sót nhất)
- [ ] `admin/src/components/layout/Sidebar.tsx` — menu khớp nav; outer div `.admin-sidebar`; section `.sidebar-section`; footer NavLink → `/profile`
- [ ] `admin/src/main.tsx` có dynamic basename + `AuthProvider` (scaffold — không ghi đè)
- [ ] `admin/src/pages/settings/Settings.tsx` đủ tabs (gồm Cloudinary + Tích hợp)
- [ ] `website/index.html` có Bootstrap 5.3.3 CDN + Bunny Fonts
- [ ] `website/index.html` có title/description thật (không placeholder) + OG/Twitter tags (rule 30)
- [ ] `website/public/robots.txt` còn tồn tại sau build (scaffold sẵn, không tự xóa)
- [ ] Mọi page trong `website/src/pages/` đều gọi `useDocumentMeta` (rule 30)
  - Grep: `useDocumentMeta` count ≥ số page files
- [ ] Route `GET /sitemap.xml` đã đăng ký trong `bootstrap.php`, trả `Content-Type: application/xml` (rule 30)
- [ ] `website/src/styles/template.css` là bản copy từ template
- [ ] `README.md` có hướng dẫn deploy

## Logic & Security

- [ ] `Auth::require()` có trong mọi admin controller method
- [ ] Public endpoints (GET `/public/*`) không cần auth
- [ ] `.htaccess` và `web.config` chặn truy cập `.db`
- [ ] Mọi INPUT dùng prepared statement (không nối string)
- [ ] `SettingsController::index()` trả flat `{key: value}` (không nested)
- [ ] Public endpoints trả array (không bọc `{items: [...]}`), xem `ShopPublicController::products()` pattern
- [ ] `unsplash_access_key` seed với key mặc định

---

# Bước 7a — Strip BOM (chạy trước Build)

**BOM trong PHP source = 500 im lặng trên MỌI endpoint.**

```powershell
Get-ChildItem -Path "Sources/WebDeploy/[slug]/api" -Filter "*.php" -Recurse | ForEach-Object {
    $b = [System.IO.File]::ReadAllBytes($_.FullName)
    if ($b.Length -ge 3 -and $b[0] -eq 0xEF -and $b[1] -eq 0xBB -and $b[2] -eq 0xBF) {
        [System.IO.File]::WriteAllBytes($_.FullName, $b[3..($b.Length-1)])
        Write-Host "BOM stripped: $($_.Name)"
    }
}
```

---

# Bước 7b — PHP Syntax Check

```bash
find Sources/WebDeploy/[slug]/api -name "*.php" -exec php -l {} \;
```

Fix lỗi → chạy lại ngay.

---

# Bước 7c — TypeScript Build

```bash
cd Sources/WebDeploy/[slug]/website && npm install && npm run build
cd Sources/WebDeploy/[slug]/admin  && npm install && npm run build
```

**Không được dừng khi còn lỗi.** Fix → chạy lại ngay.

---

# Bước 9 — README.md Template

Hướng dẫn: upload `_output-deploy/` → sửa `APP_URL` trong `api/config.php` → kiểm tra `https://domain.vn/api/health` → chmod `api/database/` + `api/uploads/` → đăng nhập `sysadmin@admin.com` / `123456` → đổi mật khẩu ngay.

**Nhắc khách**: Xóa `api/check-hash.php` khỏi server sau deploy.

---

## Nhanh & Hiệu quả

**Khi chạy checklist**:
1. Đọc từng item → chạy lệnh/grep cụ thể
2. Ghi kết quả ✅ hoặc ❌ ngay lập tức
3. Nếu fail → fix → chạy lại item đó
4. Không bỏ qua item nào — xem như ship gate

**Công cụ hỗ trợ**:
- `php -l` cho PHP syntax (chạy từ PowerShell: `C:\xampp\php\php.exe -l [file]`)
- `grep` cho pattern search: `/media/upload`, `useDocumentMeta`, `PRAGMA foreign_keys`
- `npx tsc --noEmit` cho TypeScript (gọi từ thư mục website/ hoặc admin/)
