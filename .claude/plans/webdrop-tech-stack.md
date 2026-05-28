# Tech Stack Plan — webdrop.vn

> Ngày tạo: 2026-05-28 | Status: Approved

## Context

Solo founder, quen cả C# lẫn TypeScript, ưu tiên ship nhanh. Dự án hiện tại là static HTML prototypes. Cần chuyển thành hệ thống thật với payment, order management, database, file storage.

Scale ban đầu: 10–50 đơn/tháng.

---

## Quyết Định Kiến Trúc

### Next.js Full-Stack vs Next.js + .NET Core API

| Tiêu chí | Next.js Full-Stack | Next.js + .NET Core |
|---|---|---|
| Thời gian setup MVP | ~1 tuần | ~2–3 tuần |
| Số hệ thống deploy | 1 (Vercel) | 2 (Vercel + Railway) |
| Chi phí hosting | $0 free tier | $5–15/tháng |
| Background jobs | Vercel Cron (giới hạn) | Hangfire mạnh |
| Phù hợp scale hiện tại | ✅ Đủ dùng | ⚠️ Overkill |

**Quyết định: Next.js Full-Stack cho Phase 1.** Tách .NET Core service khi thực sự cần background jobs hoặc >500 đơn/tháng.

---

## Stack Chính Thức

```
Storefront + Admin + API
  └─ Next.js 14 (TypeScript, App Router) → Vercel

Database + Auth + Storage
  └─ Supabase (PostgreSQL + Auth + Storage + Realtime)

ORM
  └─ Prisma

Payment
  └─ PayOS (MoMo, VNPay, ZaloPay, QR — 1 API)
  └─ Stripe (quốc tế, Phase 2)

Email
  └─ Resend + React Email

CDN + DNS
  └─ Cloudflare

Hosting website khách
  └─ Vercel/Netlify (HTML template đơn giản)
  └─ Hostinger Reseller (khách cần cPanel)
  └─ DigitalOcean VPS (forum/community, ASP.NET)

Internal Notifications
  └─ Telegram Bot

Analytics
  └─ Vercel Analytics + PostHog
```

---

## Database Schema Cốt Lõi

```
users       (id, email, role: customer|admin|reseller, created_at)
orders      (id, user_id, template_id, package, status, total, created_at)
templates   (id, name, category, preview_url, price_starter, price_standard)
deployments (id, order_id, domain, hosting_info, status, notes)
payments    (id, order_id, gateway, transaction_id, amount, status)
```

---

## Roadmap

### Tuần 1–2: Nền tảng
1. Next.js 14 project (TypeScript + App Router)
2. Supabase: DB schema + Auth
3. Prisma ORM
4. Vercel deploy + Cloudflare DNS

### Tuần 3–4: Core Features
5. PayOS sandbox integration
6. Checkout flow (từ `checkout_page.html`)
7. Admin dashboard cơ bản (từ `admin_dashboard.html`)
8. Resend email xác nhận đơn
9. Telegram bot thông báo đơn mới

### Tháng 2: Go Live
10. Customer portal
11. Template detail page
12. PostHog analytics
13. Go live

---

## Chi Phí Tháng Đầu

| Dịch vụ | Free tier | Khi scale |
|---|---|---|
| Vercel | ✅ Free | $20/tháng |
| Supabase | ✅ Free (500MB) | $25/tháng |
| Resend | ✅ 3k email/tháng | $20/tháng |
| Cloudflare | ✅ Free | — |
| PayOS | ~1.5% per transaction | — |
| **Tổng** | **~$0/tháng** | **~$65/tháng** |

---

## Không Cần Ở Phase 1

- ❌ Redis (Supabase đủ)
- ❌ Docker/Kubernetes (Vercel serverless)
- ❌ Elasticsearch (Postgres query đủ)
- ❌ .NET Core backend riêng
- ❌ Message queue
