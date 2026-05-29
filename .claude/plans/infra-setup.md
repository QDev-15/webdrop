# Plan: Step 3 — Infrastructure & Deploy

> **Vị trí trong Master Roadmap:** Step 3 (sau Step 1 webdrop.vn + Step 2 templates)
> **Thời gian:** ~1 tuần
> **Deliverable:** webdrop.vn live, demo templates accessible

## VPS AZDIGI — Thông số

- 2 vCPU, 2GB RAM, NVMe SSD
- ~200k–300k/tháng
- Datacenter: HCM hoặc Bình Dương
- OS: Ubuntu 22.04 LTS

## Stack

```
VPS AZDIGI Linux
├── Nginx              → reverse proxy, serve static files, SSL
├── Node.js 24 + PM2   → Next.js (webdrop.vn + system admin)
├── PHP-FPM 8.2        → serve website khách Gói B + demo templates
├── PostgreSQL 16      → System DB (webdrop.vn)
└── SQLite             → Website khách (trong dir của từng client)
```

## Cấu trúc thư mục VPS

```
/var/www/
├── webdrop.vn/           ← Next.js clone từ GitHub (Sources/system/)
│   ├── .env              ← Production env vars
│   └── ...
├── demo/                 ← Static HTML templates (serve bởi Nginx)
│   ├── agency-web/       ← Sources/templates/web/agency-web/
│   ├── spa-beauty/       ← Sources/templates/web/spa-beauty/
│   └── restaurant/       ← Sources/templates/web/restaurant/
└── clients/              ← Website khách Gói B (PHP + SQLite)
    ├── client-abc/
    └── client-xyz/
```

---

## 3.1 — Setup VPS Base

### Base system
```bash
apt update && apt upgrade -y
apt install -y nginx php8.2-fpm php8.2-sqlite3 php8.2-mbstring php8.2-curl php8.2-zip
apt install -y postgresql-16 certbot python3-certbot-nginx
apt install -y git ufw fail2ban
```

### Node.js 24 + PM2
```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.0/install.sh | bash
nvm install 24
npm i -g pm2
```

### UFW Firewall
```bash
ufw allow 22/tcp   # SSH (đổi port sau)
ufw allow 80/tcp
ufw allow 443/tcp
ufw enable
```

### Security hardening
- [ ] Đổi SSH port (không dùng 22)
- [ ] Disable root SSH login (`PermitRootLogin no`)
- [ ] Cài fail2ban (chống brute force SSH)
- [ ] Không expose PostgreSQL port (chỉ listen localhost)

---

## 3.2 — Nginx Config

### webdrop.vn → Next.js
```nginx
server {
    listen 443 ssl;
    server_name webdrop.vn www.webdrop.vn;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### demo.webdrop.vn → Static templates
```nginx
server {
    listen 443 ssl;
    server_name demo.webdrop.vn;
    root /var/www/demo;
    index index.html;

    location / {
        try_files $uri $uri/ =404;
    }
}
```

### Wildcard SSL
```bash
certbot certonly --nginx -d webdrop.vn -d www.webdrop.vn -d demo.webdrop.vn
```

### Tối ưu Nginx
- [ ] Gzip compression bật (`gzip on; gzip_types text/css application/javascript`)
- [ ] Static file caching (`expires 30d` cho ảnh, CSS, JS)
- [ ] Rate limiting: `limit_req_zone` cho `/api/`

---

## 3.3 — PostgreSQL Setup

```bash
sudo -u postgres psql
CREATE DATABASE webdrop_system;
CREATE USER webdrop_user WITH ENCRYPTED PASSWORD 'strong_password';
GRANT ALL PRIVILEGES ON DATABASE webdrop_system TO webdrop_user;
```

**Backup tự động (cron):**
```bash
# /etc/cron.d/webdrop-backup
0 2 * * * postgres pg_dump webdrop_system | gzip > /backup/webdrop_$(date +%Y%m%d).sql.gz
```
Upload backup lên Google Drive qua `rclone`.

---

## 3.4 — Deploy webdrop.vn

```bash
# Clone repo
git clone https://github.com/quynhvp90/webdrop.git /var/www/webdrop.vn
cd /var/www/webdrop.vn/Sources/system

# Tạo .env production
cp .env.example .env
# Điền DATABASE_URL, NEXTAUTH_SECRET, R2_* vars

# Install + build
npm ci
npx prisma migrate deploy
npx prisma db seed
npm run build

# PM2
pm2 start npm --name "webdrop" -- start
pm2 startup
pm2 save
```

**Deploy update về sau:**
```bash
cd /var/www/webdrop.vn && git pull
cd Sources/system && npm ci && npx prisma migrate deploy && npm run build
pm2 restart webdrop
```

---

## 3.5 — Deploy Demo Templates

```bash
# Copy template files
cp -r /var/www/webdrop.vn/Sources/templates/web/agency-web /var/www/demo/
cp -r /var/www/webdrop.vn/Sources/templates/web/spa-beauty /var/www/demo/
cp -r /var/www/webdrop.vn/Sources/templates/web/restaurant /var/www/demo/

# Set permissions
chown -R www-data:www-data /var/www/demo
```

Demo URLs:
- `https://demo.webdrop.vn/agency-web/`
- `https://demo.webdrop.vn/spa-beauty/`
- `https://demo.webdrop.vn/restaurant/`

---

## 3.6 — Cloudflare R2 Setup

### Buckets
- `webdrop-system` — ảnh sản phẩm webdrop.vn (demo, marketing)
- `webdrop-clients` — ảnh upload của website khách Gói B

### Config
- Public URL qua Cloudflare R2 custom domain (không expose R2 URL trực tiếp)
- Nén ảnh trước upload: WebP, max 1920px
- Env vars trong `Sources/system/.env` production:
  ```
  R2_ACCOUNT_ID=...
  R2_ACCESS_KEY_ID=...
  R2_SECRET_ACCESS_KEY=...
  R2_BUCKET_NAME=webdrop-system
  R2_PUBLIC_URL=https://assets.webdrop.vn
  ```

---

## Backup Strategy

| Dữ liệu | Tần suất | Nơi lưu |
|---|---|---|
| PostgreSQL dump | Hàng ngày 2AM | Google Drive (rclone) |
| SQLite khách | Hàng tuần | GitHub private repo |
| Source code | Mỗi commit | GitHub |
| Nginx config | Khi thay đổi | GitHub (trong repo, folder `infra/`) |

---

## Monitoring

- PM2 monitor: `pm2 monit`
- Nginx logs: `/var/log/nginx/`
- Uptime: UptimeRobot (free) — alert email khi site down
- PostgreSQL: check `pg_stat_activity` khi cần

---

## Checklist hoàn thành Step 3

- [ ] `curl https://webdrop.vn` → 200
- [ ] `curl https://webdrop.vn/admin` → redirect login hoặc 200
- [ ] `curl https://demo.webdrop.vn/agency-web/` → 200
- [ ] `curl https://demo.webdrop.vn/spa-beauty/` → 200
- [ ] SSL cert hợp lệ (không warning trên browser)
- [ ] PM2 tự restart sau reboot (test: `reboot` → check `pm2 list`)
- [ ] Backup PostgreSQL chạy được (test thủ công)
- [ ] R2 upload/serve ảnh hoạt động
