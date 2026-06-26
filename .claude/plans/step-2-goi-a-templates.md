# Step 2 — Gói A: HTML Templates
> Status: ✅ Code + README hoàn thành | Còn lại: ZIP + Demo URL (sau khi có hosting)

## Templates đã xây

| # | Folder | Trang | Màu accent | Giá | Status |
|---|---|---|---|---|---|
| 2.1 | `templates/web/agency-web/` | index, dich-vu, ve-chung-toi, du-an, lien-he | `#1a6b52` green | 2.500.000đ | ✅ Code + README xong |
| 2.2 | `templates/web/spa-beauty/` | index, dich-vu, dat-lich, lien-he | `#c17a6b` rose | 2.800.000đ | ✅ Code + README xong |
| 2.3 | `templates/web/restaurant/` | index, thuc-don, dat-ban, lien-he | `#b45309` amber | 3.000.000đ | ✅ Code + README xong |
| 2.4 | `templates/admin/basic-admin/` | login, dashboard, posts, users, settings | `#1a6b52` green | 1.200.000đ | ✅ Code + README xong |

## Tính năng đặc biệt mỗi template

- **agency-web**: Hero transparent nav, portfolio filter, timeline, team
- **spa-beauty**: Booking time slots, success modal, team cards, rose theme
- **restaurant**: Menu category filter, table reservation + area select, amber theme
- **basic-admin**: Sidebar 214px, stats cards, tables, modals, settings tabs, toggle switches

## Còn lại trước khi bán

- [ ] Đóng gói ZIP: `[tên]-v1.0.zip` — mỗi template 1 file
- [ ] Demo URL sau khi có hosting: `demo.webdrop.store/[tên]/`
  - Option A: VPS AZDIGI (Step 3)
  - Option B: Netlify free static hosting (không cần VPS)
- [ ] Đăng Gumroad ngay khi có demo URL

## Phương án deploy demo không cần VPS (Netlify)

```
Netlify → New site → Deploy manually
Upload thư mục Sources/templates/web/agency-web/ → Done
URL: https://[random].netlify.app hoặc custom subdomain
```

Cũng có thể dùng GitHub Pages:
```
GitHub repo → Settings → Pages → Source: branch main, folder /Sources/templates/web/agency-web
URL: https://[username].github.io/webdrop/Sources/templates/web/agency-web/
```
