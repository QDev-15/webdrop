# Step 3 — Infrastructure & Deploy
> Thời gian: 1 tuần | Deliverable: webdrop.vn live, demo templates online

## Stack VPS
```
AZDIGI VPS — Ubuntu 22.04 — 2vCPU / 2GB RAM / NVMe (~250k/tháng)
├── Nginx          reverse proxy + static files + SSL
├── Node.js 24 + PM2   Next.js webdrop.vn
├── PHP-FPM 8.2    demo templates + website khách Gói B
└── PostgreSQL 16  System DB
```

## Thư mục VPS
```
/var/www/
├── webdrop.vn/     ← git clone repo (Sources/system/)
├── demo/           ← static templates (agency-web, spa-beauty, restaurant)
└── clients/        ← website khách Gói B
```

---

## Tasks

### 3.1 Setup VPS
- [ ] Cài: nginx, php8.2-fpm, php8.2-sqlite3, postgresql-16, git, ufw, fail2ban
- [ ] Cài Node.js 24 qua nvm, cài pm2 global
- [ ] UFW: chỉ mở port 22, 80, 443
- [ ] Security: đổi SSH port, tắt root login, không expose PostgreSQL

### 3.2 Nginx
- [ ] `webdrop.vn` → proxy `localhost:3000` (Next.js)
- [ ] `demo.webdrop.vn` → `/var/www/demo` (static files)
- [ ] Wildcard SSL: `certbot` cho `*.webdrop.vn`
- [ ] Bật gzip, cache static files 30 ngày

### 3.3 PostgreSQL
- [ ] Tạo database `webdrop_system` + user riêng
- [ ] Cron backup hàng ngày 2AM → Google Drive (rclone)

### 3.4 Deploy webdrop.vn
- [ ] `git clone` repo, `cd Sources/system`
- [ ] Tạo `.env` production (DATABASE_URL, NEXTAUTH_SECRET, R2_*)
- [ ] `npm ci && npx prisma migrate deploy && npm run build`
- [ ] `pm2 start --name webdrop`, `pm2 startup && pm2 save`

### 3.5 Deploy Demo Templates
- [ ] Copy `Sources/templates/web/*` → `/var/www/demo/`
- [ ] `chown -R www-data:www-data /var/www/demo`

### 3.6 Cloudflare R2
- [ ] Tạo 2 buckets: `webdrop-system`, `webdrop-clients`
- [ ] Cấu hình custom domain: `assets.webdrop.vn`
- [ ] Điền R2_* vars vào `.env` production

---

## Done khi
- [ ] `https://webdrop.vn` → 200, SSL xanh
- [ ] `https://webdrop.vn/admin` → redirect login
- [ ] `https://demo.webdrop.vn/agency-web/` → 200
- [ ] `https://demo.webdrop.vn/spa-beauty/` → 200
- [ ] PM2 tự restart sau reboot
- [ ] Backup chạy được (test thủ công)
