# nha-hang-hai-san

Website nhà hàng hải sản **Vị Biển** — React SPA + PHP API + SQLite.

## Cấu trúc

```
nha-hang-hai-san/
├── website/          React SPA (trang khách)
├── admin/            React SPA (quản trị)
├── api/              PHP backend + SQLite
├── build.bat         Build Windows
├── build.sh          Build Linux/Mac
└── deploy/           Output sau build
```

## Build & Deploy

```bash
# Windows
build.bat

# Linux/Mac
bash build.sh
```

Output: `deploy/` — upload toàn bộ lên hosting PHP.

## Yêu cầu hosting

- PHP 7.4+ với `pdo_sqlite`
- Apache với mod_rewrite hoặc Nginx

## Admin

Truy cập `/admin` — đăng nhập mặc định xem `api/config.php`.
