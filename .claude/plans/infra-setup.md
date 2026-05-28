# Plan: Infrastructure Setup

## VPS AZDIGI — Setup chuẩn

### Thông số
- 2 vCPU, 2GB RAM, NVMe SSD
- ~200k–300k/tháng
- Datacenter: HCM hoặc Bình Dương
- OS: Ubuntu 22.04 LTS

### Stack
```
Nginx          → reverse proxy, serve static
Node.js + PM2  → Next.js (webdrop.vn + System Admin)
PHP-FPM        → serve website khách Gói B
PostgreSQL     → System DB (webdrop.vn)
SQLite         → Website khách (trong hosting dir)
```

### Cấu trúc thư mục VPS
```
/var/www/
├── webdrop.vn/         ← Next.js (trang bán hàng + system admin)
├── demo/
│   ├── spa-lavender/   ← Demo template Spa
│   ├── nha-hang-pro/   ← Demo template Nhà hàng
│   └── cong-ty-pro/    ← Demo template Công ty
└── clients/
    ├── client-abc/     ← Website khách (PHP + SQLite)
    └── client-xyz/
```

---

## Checklist Setup VPS

### 1. Base system
- [ ] Update packages: `apt update && apt upgrade`
- [ ] Cài Nginx, PHP 8.2+, PHP-FPM
- [ ] Cài Node.js 20 LTS (via nvm)
- [ ] Cài PM2: `npm i -g pm2`
- [ ] Cài PostgreSQL 16
- [ ] Cài Certbot (Let's Encrypt SSL)
- [ ] UFW firewall: chỉ open 22, 80, 443

### 2. Nginx config
- [ ] SSL termination tại Nginx
- [ ] Reverse proxy `/` → Next.js (port 3000)
- [ ] PHP-FPM cho demo + clients
- [ ] Gzip compression bật
- [ ] Rate limiting cơ bản

### 3. PostgreSQL
- [ ] Tạo user + database cho webdrop system
- [ ] Cấu hình backup tự động (cron → Google Drive)

### 4. Security
- [ ] Đổi SSH port
- [ ] Disable root login SSH
- [ ] Cài fail2ban
- [ ] Không expose PostgreSQL port ra ngoài

### 5. PM2
- [ ] `pm2 start` webdrop.vn
- [ ] `pm2 startup` (tự start sau reboot)
- [ ] `pm2 save`

---

## Cloudflare R2 Setup

### Buckets
- `webdrop-system` — ảnh của webdrop.vn (demo, marketing)
- `webdrop-clients` — ảnh upload của website khách

### Cấu hình
- Public bucket URL qua Cloudflare Workers (không expose R2 URL trực tiếp)
- Nén ảnh trước upload: WebP, max 1920px width
- Purge cache khi upload ảnh mới

---

## Domain & SSL

### Domains
- `webdrop.vn` → trang bán hàng + system admin
- `demo.webdrop.vn` → subdomain cho demo templates
- Wildcard SSL: `*.webdrop.vn`

### Email
- Dùng Zoho Mail / Google Workspace hoặc SMTP riêng
- SPF, DKIM, DMARC setup để email không vào spam

---

## Backup Strategy
| Dữ liệu | Tần suất | Nơi lưu |
|---|---|---|
| PostgreSQL dump | Hàng ngày | Google Drive (tự động) |
| SQLite khách | Hàng tuần | GitHub private repo |
| Source code | Mỗi commit | GitHub |
| Nginx config | Khi thay đổi | GitHub |
| Media/uploads | Hàng tuần | Cloudflare R2 → backup bucket |

---

## Monitoring cơ bản
- PM2 monitor: `pm2 monit`
- Nginx access log: `/var/log/nginx/`
- Uptime check: UptimeRobot (free) hoặc Better Uptime
- Alert: email khi site down
