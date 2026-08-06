# shop-the-thao Draft Build — Testing Guide

**Build Date**: 2026-08-06  
**Status**: Draft (CSS issues known, core functionality complete)  
**Location**: `Sources/WebDeploy/_output-deploy/`

---

## Quick Start — Local Testing

### Option 1: PHP Built-in Server (Recommended)

```bash
cd Sources/WebDeploy/_output-deploy

# Start PHP API server on port 8081
php -S localhost:8081

# In browser: http://localhost:8081
```

### Option 2: Docker

```bash
cd Sources/WebDeploy/_output-deploy
docker run -p 8081:80 -v $(pwd):/var/www/html php:8.3-apache
```

### Option 3: Manual Hosting Setup

1. Upload entire `_output-deploy/` contents to hosting `public_html/`
2. Edit `api/config.php`:
   - Change `APP_URL` from `http://localhost:8081` to your actual domain
   - Ensure `APP_KEY` stays as-is (already generated)
3. Verify: Visit `https://yourdomain.com/api/health` (should return `{"status":"ok"}`)

---

## Test Plan

### 🏠 **Homepage & Navigation**
- [ ] Load `/` → homepage displays
- [ ] Topbar shows 3 claims (free ship, size exchange, warranty)
- [ ] Nav shows 5 items (Trang chủ, Bộ sưu tập, Khuyến mãi, Dịch vụ, Liên hệ)
- [ ] Nav search icon works → opens search panel
- [ ] Mobile menu toggles on burger icon
- [ ] DARK-ENERGY theme visible (dark background, Signal Orange accents)

### 📦 **Product Catalog**
- [ ] Load `/` → 40 products display in grid (12 per page)
- [ ] Category filter pills work (Tất cả, Quần áo, Giày, Dụng cụ, Phụ kiện, Yoga)
- [ ] Price range slider responsive
- [ ] Size/Color dropdowns open
- [ ] Sort dropdown works (Price, Rating, Newest)
- [ ] Pagination navigate 1→4 pages correctly
- [ ] Product search from nav works → filters results

### 🔍 **Product Detail**
- [ ] Click product card → detail page loads
- [ ] Product image displays
- [ ] Price + sale price shown correctly
- [ ] Size/color selectors functional
- [ ] "Thêm vào giỏ" button clickable → adds to cart
- [ ] "Mua ngay" button → redirects to checkout
- [ ] Breadcrumb shows correct product name

### 🛒 **Shopping Cart**
- [ ] Add 2-3 items → cart page shows all items
- [ ] Item count badge updates in nav
- [ ] Quantity adjust works (±)
- [ ] Remove item button removes it
- [ ] Subtotal calculates correctly: Σ(price × qty)
- [ ] Shipping fee displays (25,000đ default)
- [ ] Total = subtotal + shipping

### 💳 **Checkout**
- [ ] "Tiến hành thanh toán" → checkout form displays
- [ ] Payment methods visible (COD + SePay QR)
- [ ] Customer info form (name, email, phone, address)
- [ ] Form validation (required fields)
- [ ] COD selection works
- [ ] Submit order → success page

### 🔗 **Other Pages**
- [ ] `/bo-suu-tap` → Collections page loads
- [ ] `/khuyen-mai` → Promotions page loads
- [ ] `/dich-vu` → Services page loads
- [ ] `/lien-he` → Contact form appears
- [ ] `/chinh-sach-bao-mat` → Privacy policy displays
- [ ] `/dieu-khoan` → Terms display

### 🎨 **Design & Theme**
- [ ] Dark background (#0a0a0c) applied
- [ ] Signal Orange accents (#ff4d29) on buttons, links
- [ ] Archivo Black font for headings
- [ ] Barlow font for body text
- [ ] All text readable (contrast OK)

### ⚠️ **Known Issues (Expected to Fail)**
- [ ] ❌ **Responsive layout**: Horizontal scroll on mobile/tablet (CSS overflow issue)
- [ ] ❌ **Admin panel CSS**: Missing styles for dashboard (incomplete admin.css)
- [ ] ❌ **Admin login**: Some form styling broken

### ✅ **Admin Testing** (if CSS fixed)
- [ ] Navigate to `/admin`
- [ ] Default credentials: `admin@example.com` / `admin123`
- [ ] Dashboard loads (stats, revenue, recent orders)
- [ ] Products CRUD works
- [ ] Orders list + detail page
- [ ] Settings tab saved

---

## Deployment Checklist

- [ ] All tests pass (except known CSS issues)
- [ ] No console errors
- [ ] API health check works (`/api/health`)
- [ ] Database seeds correctly (40 products visible)
- [ ] Cart persistence works (refresh page = cart saved)
- [ ] No hardcoded localhost URLs

---

## Issues Found During Testing

**Critical (Blocks MVP):**
- Horizontal scroll on all viewport widths (320px, 768px, 1200px)

**High (Admin functions):**
- Admin panel CSS incomplete
- Some form styling missing

**Medium (Polish):**
- Duplicate CSS selectors need consolidation
- Some TypeScript warnings

---

## Next Phase: CSS Fixes

After testing confirms core functionality works, fix:
1. `.tt-container` max-width + padding overflow
2. Admin CSS `.admin-page-*`, `.form-check`, `.status-badge-*` classes
3. Remove duplicate CSS definitions from template.css

See main CLAUDE.md section "shop-the-thao" for full issue log.

---

**Questions?** Check `api/config.php` for APP_KEY/APP_URL or see `README.md` in deploy folder.
