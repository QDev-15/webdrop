# KidSmile — Nha Khoa Trẻ Em

Website hoàn chỉnh cho phòng khám nha khoa chuyên biệt trẻ em. Identity: **SOFT-PASTEL**.

## Thông tin kỹ thuật

| Mục | Chi tiết |
|---|---|
| Identity | SOFT-PASTEL — DM Sans italic 300, Lilac `#9b7ef0`, Mint `#34c98e` |
| CSS Prefix | `ks-` (kidsmile) |
| Nav | NAV-5: Centered Logo + Links Below (always solid) |
| Hero | H6: Asymmetric Offset (text left, image absolute right) |
| DB | SQLite (auto-seed lần đầu) |
| Frontend | React SPA (Vite + TypeScript) |
| Backend | PHP thuần |

## Trang website

- `/` — Trang chủ (Hero, USP, Dịch vụ, Stat Bar, Gallery, Đội ngũ, Đánh giá, CTA)
- `/dich-vu` — Dịch vụ (filter theo nhóm)
- `/cam-nang-cha-me` — Cẩm nang cho phụ huynh (bài viết grid)
- `/bac-si` — Đội ngũ bác sĩ (grid 3 cột)
- `/dat-lich` — Đặt lịch khám (form phụ huynh + thông tin bé)
- `/lien-he` — Liên hệ (form + info + map)

## Deploy

### Yêu cầu hosting
- PHP 8.0+ với extension: `pdo_sqlite`, `json`
- Hỗ trợ `.htaccess` (Apache) hoặc `web.config` (IIS)
- Không cần MySQL hoặc cài database thủ công

### Bước deploy

1. **Build:**
   ```
   # Windows
   build.bat

   # Linux/Mac
   bash build.sh
   ```

2. **Upload** toàn bộ `_output-deploy/` lên `public_html` của hosting.

3. **Truy cập** website — DB tự seed lần đầu.

4. **Đăng nhập admin** tại `/admin`:
   - Email: `sysadmin@admin.com`
   - Mật khẩu: `123456`
   - **Đổi mật khẩu ngay sau khi đăng nhập!**

5. **⚠️ Xóa `check-hash.php`** trong thư mục `api/` sau khi deploy xong.

## Bảo mật

- File `.db` được bảo vệ bởi `.htaccess` — không thể download HTTP
- `config.php` nằm trong `api/` không phải public root
- Password admin hash `bcrypt` — không lưu plaintext
- Xóa `check-hash.php` sau deploy

---
*KidSmile WebDeploy · SOFT-PASTEL · webdrop.store*
