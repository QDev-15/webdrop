# Deploy Templates Demo — Cloudflare Pages

## Tổng quan

- **Platform:** Cloudflare Pages
- **Project name:** `webdrop-eol`
- **GitHub repo:** `QDev-15/webdrop` (branch `master`)
- **Demo URL:** `https://webdrop-eol.pages.dev`
- **Output dir:** `dist/demo/`

---

## Cấu hình (wrangler.toml)

```toml
name = "webdrop"
pages_build_output_dir = "dist/demo"
```

Cloudflare Pages đọc file này để biết tên project và thư mục output.

---

## Cấu hình trên Cloudflare Pages

Vào **dash.cloudflare.com → Workers & Pages → `webdrop` → Settings → Build & deployments**:

| Setting | Giá trị |
|---|---|
| Build command | `node Sources/templates/_demo-guard/build-demo.js` |
| Deploy command | `npx wrangler deploy` |
| Output directory | _(đọc từ wrangler.toml)_ `dist/demo` |

> **Quan trọng:** Cloudflare tự phát hiện Next.js trong `Sources/system/` và override build command thành `npx @cloudflare/next-on-pages@1` — phải override thủ công về đúng command trên.

---

## Auto-deploy (mỗi khi push lên GitHub)

```
git push origin master
```

Cloudflare Pages tự động:
1. Clone repo
2. Chạy: `node Sources/templates/_demo-guard/build-demo.js`
3. Output vào: `dist/demo/`
4. Deploy lên: `https://webdrop-eol.pages.dev`

---

## Build thủ công (local)

```bash
# Build tất cả templates
npm run build:demo

# Build theo category
npm run build:demo:spa
npm run build:demo:restaurants
npm run build:demo:companies
npm run build:demo:cafes

# Xóa và build lại
npm run rebuild:demo
```

Output: `dist/demo/`

---

## Cấu trúc URL sau khi deploy

```
https://webdrop-eol.pages.dev/
├── Blogs/blog-ca-nhan/
├── Cafes/cafe-thoi-gian/
├── Companies/agency-sang-tao/
├── Companies/agency-web/
├── Companies/cong-ty-xay-dung/
├── Companies/luat-van-phong/
├── Companies/startup-cong-nghe/
├── Companies/tu-van-tai-chinh/
├── Forums/forum-cong-dong/
├── Portfolios/portfolio-toi/
├── Restaurants/am-thuc/
├── Restaurants/nha-hang-cao-cap/
├── Restaurants/nha-hang-chay-organic/
├── Restaurants/nha-hang-hai-san/
├── Restaurants/nha-hang-nhat-ban/
├── Restaurants/nha-hang-phap/
├── Restaurants/nha-hang-truyen-thong/
├── Restaurants/quan-an-pho-bien/
├── Restaurants/quan-bbq-lua/
├── Restaurants/tiem-banh-ngot/
└── Spa-Services/
    ├── spa-beauty/
    ├── nail-salon/
    ├── yoga-wellness/
    ├── tiem-toc-barber/
    ├── massage-tri-lieu/
    ├── tham-my-vien/
    ├── spa-luxury/
    ├── pilates-studio/
    ├── cham-soc-da/
    └── beauty-studio/
```

---

## Thêm template mới

1. Tạo template trong `Sources/templates/web/[Category]/[slug]/`
2. Chạy `npm run build:demo` để test local
3. Commit + push → Cloudflare tự deploy

```bash
git add Sources/templates/web/[Category]/[slug]/
git commit -m "feat: add template [slug]"
git push
```

---

## Xử lý sự cố

### Lỗi: Cloudflare dùng sai build command

Cloudflare tự detect Next.js → dùng `@cloudflare/next-on-pages`. Fix:

1. Cloudflare Dashboard → project `webdrop` → Settings → Build & deployments
2. Edit → Build command: `node Sources/templates/_demo-guard/build-demo.js`
3. Save → Retry deployment

### Lỗi: Authentication (code 10000)

API token thiếu quyền. Vào [dash.cloudflare.com/profile/api-tokens](https://dash.cloudflare.com/profile/api-tokens):
- Thêm permission: **Account → Cloudflare Pages → Edit**

### Lỗi: Project not found (code 8000007)

Project chưa tồn tại trên Cloudflare Pages. Tạo thủ công qua dashboard trước rồi deploy lại.
