# Tech Stack Rules

## Template (Gói A) — HTML/CSS/Bootstrap
- **Không có build system** — file HTML mở thẳng trên trình duyệt
- **Bootstrap 5.3.3** qua CDN — không cài npm, không webpack
- **Vanilla JS** — không jQuery, không framework
- **Responsive**: mobile-first, test từ 320px
- Bàn giao: file ZIP + link demo live

## Website khách (Gói B)
| Layer | Tech |
|---|---|
| Frontend | React SPA (không Next.js — không cần SSR) |
| Backend | PHP (thuần, không framework nặng) |
| DB mặc định | SQLite — file `.db` trong hosting dir |
| DB option | MySQL / PostgreSQL (chỉ đổi config, giữ schema) |

**Deploy flow**: Upload lên hosting PHP → seed data mặc định → React gọi API PHP → render động

## System / Trang bán hàng (webdrop.vn)
| Layer | Tech |
|---|---|
| Frontend + Admin | Next.js (React, full-stack) |
| DB | PostgreSQL |
| Web server | Nginx (reverse proxy) |
| Process manager | PM2 |
| Image/media storage | Cloudflare R2 |
| Source code | GitHub private repo |

## Hosting
- **Provider**: AZDIGI VPS Linux
- **Spec tối thiểu**: 2 vCPU, 2GB RAM, NVMe SSD
- **Datacenter**: Việt Nam (HCM/Bình Dương)
- 1 VPS chạy tất cả: System, demo sites, trang bán hàng

## JavaScript Rules (áp dụng toàn dự án)
- Dùng `const` / `let` — không `var`
- Không `console.log` trong production
- Scroll/touch event listener: thêm `{passive: true}`
- Không jQuery, không lodash, không thư viện nặng thêm vào template

## PHP Rules (Gói B backend)
- File `config.php`: comment tiếng Việt, khách chỉ điền thông tin
- `.htaccess`: chặn truy cập trực tiếp vào `.db` file
- Không expose config ra public directory
- SQLite: `PRAGMA foreign_keys = ON` bắt buộc

## CDN & External Resources
```
Bootstrap CSS: https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css
Bootstrap JS:  https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js
Google Fonts:  DM Sans — https://fonts.googleapis.com/css2?family=DM+Sans:...
```
Không tự ý upgrade Bootstrap version mà chưa test.
