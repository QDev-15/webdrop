# Douyin Downloader — Kế hoạch triển khai

## 1. Mục tiêu

Xây dựng web app:

> **Dán link Douyin → phân tích video → hiển thị thông tin → tải video**

Mục tiêu triển khai:

- 100% chạy trên Vercel
- Không cần VPS
- Không cần Python
- Một repository
- Một ngôn ngữ chính: TypeScript
- Frontend và backend cùng nằm trong Next.js
- Có thể mở rộng sau này

---

# 2. Phương án công nghệ đã chốt

| Thành phần | Công nghệ |
|---|---|
| Framework | **Next.js** |
| Ngôn ngữ | **TypeScript** |
| Runtime | **Node.js** |
| UI | Tailwind CSS |
| API | Next.js Route Handlers |
| Deploy | **Vercel** |
| Repository | GitHub |
| Database MVP | Chưa cần |
| Cache | Chưa cần ở MVP |
| Rate limit | Thêm sau |
| Authentication | Chưa cần |

Kiến trúc:

```text
TypeScript
    ↓
Next.js
    ↓
Node.js
    ↓
Vercel
```

Không sử dụng Python trong phiên bản đầu.

---

# 3. Tại sao chọn 100% Node.js + Next.js + Vercel?

## 3.1. Đơn giản

Chỉ cần quản lý một hệ sinh thái:

```text
TypeScript
npm
package.json
Next.js
Node.js
```

Không phải đồng thời quản lý:

```text
npm
pip
requirements.txt
Node.js
Python
```

## 3.2. Phù hợp với Vercel

Next.js và Node.js được Vercel hỗ trợ rất tốt.

Frontend và backend có thể deploy cùng một project:

```text
GitHub
   ↓
Vercel
   ↓
Next.js
   ├── Frontend
   └── API Routes
```

## 3.3. Phù hợp với workload của downloader

Phần lớn công việc của Douyin downloader là:

```text
HTTP request
     ↓
Chờ Douyin
     ↓
Nhận response
     ↓
Parse metadata
     ↓
Trả kết quả
```

Đây chủ yếu là workload I/O-bound, không phải CPU-bound.

Node.js phù hợp với kiểu xử lý này.

---

# 4. So sánh Python + Next.js với 100% Node.js

| Tiêu chí | Python + Next.js | 100% Node.js + Next.js |
|---|---|---|
| Deploy Vercel | Có | Có |
| Một project Vercel | Có | Có |
| Frontend | Next.js | Next.js |
| Backend | FastAPI/Python | Route Handler/Node.js |
| Độ đơn giản | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| Dependency | Phức tạp hơn | Đơn giản |
| Local development | Phức tạp hơn | Đơn giản |
| Debug | 2 hệ sinh thái | 1 hệ sinh thái |
| TypeScript end-to-end | Không | Có |
| Chia sẻ type giữa frontend/backend | Thấp | Cao |
| Phù hợp Vercel | Tốt | Rất tốt |
| Mở rộng | Tốt | Rất tốt |

Python vẫn là phương án dự phòng nếu sau này phát hiện parser Douyin tốt hơn đáng kể ở Python.

---

# 5. Vấn đề tốc độ

Điểm quan trọng:

> Node.js không nhanh hơn Python một cách đáng kể trong bài toán này.

Thời gian thực tế thường bị chi phối bởi Douyin:

```text
User
   ↓
Vercel Function
   ↓
Douyin
   ↓
Response
   ↓
Parse
   ↓
User
```

Ví dụ:

| Công đoạn | Node.js | Python |
|---|---:|---:|
| Khởi động Function | ~ | ~ |
| HTTP request tới Douyin | 300–1500 ms* | 300–1500 ms* |
| Parse response | vài ms | vài ms |
| Tổng | phụ thuộc Douyin | phụ thuộc Douyin |

`*` Chỉ là khoảng minh họa, thời gian thực tế thay đổi theo mạng, khu vực, trạng thái Douyin và request.

Vì vậy:

```text
Node.js ≈ Python
```

về tốc độ cho workload này.

Điểm quan trọng hơn là:

1. Parser có ổn định không.
2. Request tới Douyin mất bao lâu.
3. Có phải dùng browser automation hay không.
4. Video có được tải trực tiếp từ CDN hay phải proxy qua Vercel.

---

# 6. Kiến trúc download tối ưu

## Phương án A — Ưu tiên

Vercel chỉ parse và trả URL video:

```text
User
 ↓
Vercel
 ↓
Douyin
 ↓
Video URL
 ↓
User ───────────────► Douyin CDN
```

Vercel không truyền toàn bộ file video.

Ưu điểm:

- Nhanh
- Giảm bandwidth Vercel
- Giảm thời gian Function
- Không phải xử lý file lớn trên server
- Phù hợp serverless

## Phương án B — Proxy

Chỉ dùng khi browser không thể tải trực tiếp:

```text
User
 ↓
Vercel
 ↓
Douyin CDN
 ↓
Vercel
 ↓
User
```

Ví dụ video 50 MB:

```text
Douyin ──50 MB──► Vercel ──50 MB──► User
```

Không nên dùng đây làm kiến trúc mặc định.

---

# 7. Kiến trúc tổng thể

```text
                         USER
                           │
                           │ Dán link Douyin
                           ▼
                 ┌─────────────────────┐
                 │      Next.js        │
                 │      Frontend       │
                 │                     │
                 │  Input URL          │
                 │  Preview video      │
                 │  Download button    │
                 └──────────┬──────────┘
                            │
                     POST /api/parse
                            │
                            ▼
                 ┌─────────────────────┐
                 │  Next.js Route      │
                 │  Node.js Runtime    │
                 │                     │
                 │  Validate URL       │
                 │  Resolve URL        │
                 │  Parse Douyin       │
                 │  Extract metadata   │
                 └──────────┬──────────┘
                            │
                            ▼
                         DOUYIN
                            │
                            ▼
                    Video / Metadata
                            │
                            ▼
                 ┌─────────────────────┐
                 │  JSON response      │
                 │                     │
                 │ title               │
                 │ author              │
                 │ cover               │
                 │ videoUrl            │
                 │ duration            │
                 └──────────┬──────────┘
                            │
                            ▼
                         USER
                            │
                            │ Download
                            ▼
                       Douyin CDN
```

---

# 8. Cấu trúc project

Đề xuất:

```text
douyin-downloader/
│
├── app/
│   │
│   ├── page.tsx
│   │
│   ├── layout.tsx
│   │
│   ├── globals.css
│   │
│   └── api/
│       │
│       ├── parse/
│       │   └── route.ts
│       │
│       └── download/
│           └── route.ts
│
├── components/
│   │
│   ├── downloader/
│   │   ├── UrlInput.tsx
│   │   ├── VideoPreview.tsx
│   │   ├── DownloadButton.tsx
│   │   └── LoadingState.tsx
│   │
│   └── ui/
│
├── lib/
│   │
│   ├── douyin/
│   │   ├── parser.ts
│   │   ├── resolver.ts
│   │   └── types.ts
│   │
│   ├── http/
│   │   └── client.ts
│   │
│   └── utils/
│       └── url.ts
│
├── types/
│   └── video.ts
│
├── public/
│
├── .env.local
├── .gitignore
├── package.json
├── tsconfig.json
├── next.config.ts
├── postcss.config.mjs
└── README.md
```

---

# 9. Nguyên tắc tách code

Không viết toàn bộ logic Douyin vào:

```text
app/api/parse/route.ts
```

Nên tách:

```text
route.ts
   ↓
resolver.ts
   ↓
parser.ts
```

Mục đích:

- Dễ test
- Dễ debug
- Dễ thay parser
- Khi Douyin thay đổi chỉ cần sửa module `lib/douyin`
- API route giữ vai trò điều phối

---

# 10. API `/api/parse`

Endpoint:

```text
POST /api/parse
```

Request:

```json
{
  "url": "https://v.douyin.com/xxxxx/"
}
```

Response thành công:

```json
{
  "success": true,
  "data": {
    "id": "123456789",
    "title": "Tên video",
    "author": {
      "name": "Tên người dùng",
      "avatar": "https://..."
    },
    "cover": "https://...",
    "duration": 25,
    "videoUrl": "https://..."
  }
}
```

Frontend nhận JSON và hiển thị preview.

---

# 11. API `/api/download`

Ban đầu chưa nhất thiết phải có.

Nếu video URL có thể tải trực tiếp:

```text
Browser
   │
   └──────────────► Douyin CDN
```

Nếu Douyin không cho browser tải trực tiếp, mới triển khai:

```text
GET /api/download?id=xxx
```

Backend sẽ stream/proxy video.

Đây là phương án dự phòng.

---

# 12. Frontend MVP

Trang chính nên đơn giản:

```text
┌─────────────────────────────────────────┐
│                                         │
│          Douyin Downloader              │
│                                         │
│     Download Douyin videos easily       │
│                                         │
│ ┌─────────────────────────────────────┐ │
│ │ Paste Douyin video URL...           │ │
│ └─────────────────────────────────────┘ │
│                                         │
│          [ Analyze Video ]              │
│                                         │
└─────────────────────────────────────────┘
```

Sau khi phân tích:

```text
┌─────────────────────────────────────────┐
│                                         │
│       ┌─────────────────────┐           │
│       │                     │           │
│       │     THUMBNAIL       │           │
│       │                     │           │
│       └─────────────────────┘           │
│                                         │
│       Tên video                         │
│       Author                            │
│       00:25                             │
│                                         │
│       [ Download Video ]                │
│                                         │
└─────────────────────────────────────────┘
```

---

# 13. Luồng frontend

```text
User nhập URL
       ↓
Validate URL
       ↓
POST /api/parse
       ↓
Loading
       ↓
API trả kết quả
       ↓
Hiện thumbnail
       ↓
Hiện thông tin
       ↓
Download
```

Các lỗi cần xử lý:

```text
Không thể phân tích video.

Có thể do:
- Link không hợp lệ
- Video đã bị xóa
- Video không public
- Douyin yêu cầu xác thực
- Douyin đang chặn request
- Parser không thể lấy metadata
```

---

# 14. Module Douyin

## `resolver.ts`

Nhiệm vụ:

```text
https://v.douyin.com/xxxx/
            ↓
follow redirect
            ↓
URL đầy đủ
            ↓
extract video ID
```

## `parser.ts`

Nhiệm vụ:

```text
video ID
   ↓
request Douyin
   ↓
parse response
   ↓
metadata
   ↓
video URL
```

## `types.ts`

Ví dụ:

```ts
export interface DouyinVideo {
  id: string;
  title: string;
  cover: string;
  duration: number;
  videoUrl: string;
  author: {
    name: string;
    avatar?: string;
  };
}
```

Interface parser:

```ts
export interface DouyinParser {
  parse(url: string): Promise<DouyinVideo>;
}
```

---

# 15. Điểm rủi ro lớn nhất: parser Douyin

Đây là phần quan trọng nhất của project.

Không nên quyết định parser chỉ dựa vào việc:

> "Có một thư viện Node.js trên GitHub."

Cần kiểm tra thực tế:

- Có resolve `v.douyin.com` không?
- Có lấy được video ID không?
- Có lấy metadata không?
- Có lấy thumbnail không?
- Có lấy video URL không?
- Có hoạt động với link Douyin public không?
- Có cần cookie không?
- Có cần signature không?
- Có cần Chromium/Puppeteer/Playwright không?
- Có chạy được trong Vercel Serverless không?
- Có bị timeout không?
- Có hoạt động khi deploy production không?

## Ưu tiên

Parser lý tưởng:

```text
Node.js
+
HTTP request
+
Không Chromium
+
Không browser automation
+
Vercel compatible
```

Nếu parser Node.js không đủ tốt, mới cân nhắc Python.

---

# 16. Không nên dùng Puppeteer/Playwright ngay

Không nên bắt đầu bằng:

```text
Vercel
 ↓
Puppeteer
 ↓
Mở Douyin
 ↓
Lấy video
```

Browser automation khiến hệ thống:

- Nặng hơn
- Tốn tài nguyên hơn
- Phức tạp hơn
- Dễ timeout hơn
- Khó tối ưu serverless hơn

Ưu tiên:

```text
HTTP request
      ↓
Douyin
      ↓
HTML / API response
      ↓
Parse
      ↓
Video URL
```

Chỉ dùng browser automation nếu cơ chế của Douyin bắt buộc.

---

# 17. Phase 1 — Khởi tạo project

Cài:

```text
Node.js
Git
VS Code
```

Tạo project:

```bash
npx create-next-app@latest douyin-downloader
```

Có thể chọn:

```text
TypeScript       Yes
ESLint           Yes
Tailwind CSS     Yes
src/ directory   No
App Router       Yes
Turbopack        Yes
Import alias     Yes
```

---

# 18. Phase 2 — Làm UI

Tạo:

```text
app/page.tsx
```

Components:

```text
components/downloader/
├── UrlInput.tsx
├── VideoPreview.tsx
├── DownloadButton.tsx
└── LoadingState.tsx
```

Giai đoạn này chưa cần Douyin thật.

Dùng mock data:

```json
{
  "title": "Test video",
  "author": "Test User",
  "cover": "/test.jpg",
  "duration": 25,
  "videoUrl": "#"
}
```

Mục tiêu:

> Hoàn thiện UI và UX trước.

---

# 19. Phase 3 — API

Tạo:

```text
app/api/parse/route.ts
```

Ban đầu:

```text
URL
 ↓
Validate
 ↓
Mock response
```

Kiểm tra frontend gọi API thành công.

---

# 20. Phase 4 — Nghiên cứu parser

Đây là phase quan trọng nhất.

Tìm giải pháp Node.js có thể:

```text
short URL
     ↓
video ID
     ↓
metadata
     ↓
video URL
```

Ưu tiên giải pháp:

```text
Node.js
+
Vercel Serverless
+
Không Chromium
```

Nếu tìm được package phù hợp:

```bash
npm install <package>
```

Sau đó tích hợp vào:

```text
lib/douyin/parser.ts
```

---

# 21. Phase 5 — Test local

Chạy:

```bash
npm run dev
```

Mở:

```text
http://localhost:3000
```

Test:

```text
Link Douyin
    ↓
Analyze
    ↓
Thumbnail
    ↓
Title
    ↓
Author
    ↓
Download
```

Cần test:

- Link `v.douyin.com`
- Link Douyin đầy đủ
- Link sai
- Video đã xóa
- Video private
- Nhiều video liên tiếp
- Link có query string nếu có

---

# 22. Phase 6 — GitHub

Khởi tạo:

```bash
git init
git add .
git commit -m "Initial Douyin downloader"
git branch -M main
git remote add origin <repository-url>
git push -u origin main
```

Repository:

```text
github.com/username/douyin-downloader
```

---

# 23. Phase 7 — Deploy Vercel

Quy trình:

```text
GitHub
   ↓
Vercel
   ↓
Import Repository
   ↓
douyin-downloader
   ↓
Deploy
```

Vercel sẽ:

```text
npm install
      ↓
next build
      ↓
Deploy
```

Sau đó nhận domain dạng:

```text
https://your-project.vercel.app
```

---

# 24. Environment Variables

Nếu parser cần cookie, key hoặc secret:

Không viết trực tiếp:

```ts
const cookie = "....";
```

Dùng:

```text
.env.local
```

Ví dụ:

```env
DOUYIN_COOKIE=...
```

Trên Vercel:

```text
Project
 → Settings
 → Environment Variables
```

Thêm các biến tương ứng.

Không commit `.env.local` vào GitHub.

---

# 25. Phase 8 — Tối ưu tốc độ

Sau khi MVP hoạt động ổn định:

```text
Request
   ↓
Cache
   ↓
Parser
   ↓
Douyin
```

Có thể cache metadata theo:

```text
video_id
```

Ví dụ:

```text
Video A
 ↓
parse
 ↓
cache 5 phút
```

Người dùng thứ hai:

```text
Video A
 ↓
cache
 ↓
trả kết quả
```

Không phải request Douyin lại.

MVP chưa cần Redis.

---

# 26. Phase 9 — Rate Limit

Khi public website, có thể xuất hiện bot spam:

```text
bot ──┐
bot ──┤
bot ──┤
bot ──┤──► /api/parse
bot ──┤
bot ──┘
```

Sau đó thêm:

```text
IP
 ↓
Rate limit
 ↓
/api/parse
```

Có thể sử dụng Redis/Upstash.

Không cần triển khai ngay ở MVP.

---

# 27. Roadmap hoàn chỉnh

```text
PHASE 1
│
├── Tạo Next.js
├── UI
└── GitHub
        ↓
PHASE 2
│
├── /api/parse
├── Validation
└── Mock data
        ↓
PHASE 3
│
├── Nghiên cứu Douyin parser
├── Resolve URL
├── Extract video ID
└── Extract metadata/video URL
        ↓
PHASE 4
│
├── Kết nối parser thật
├── Error handling
└── Download
        ↓
PHASE 5
│
├── Deploy Vercel
├── Test production
└── Fix serverless issues
        ↓
PHASE 6
│
├── Cache
├── Rate limit
└── Monitoring
        ↓
PHASE 7
│
├── TikTok
├── Bilibili
├── Batch download
└── Các tính năng khác
```

---

# 28. Kiến trúc cuối cùng

```text
                    GitHub
                       │
                       ▼
                    Vercel
                       │
             ┌─────────┴─────────┐
             │                   │
             ▼                   ▼
          Next.js             Node.js
          Frontend          Route Handlers
             │                   │
             │              /api/parse
             │                   │
             └─────────┬─────────┘
                       │
                       ▼
                  Douyin Parser
                       │
                       ▼
                    Douyin
                       │
                       ▼
                  Video CDN
                       │
                       ▼
                     User
```

Mục tiêu kiến trúc:

> **Một repo — một project Vercel — một ngôn ngữ TypeScript — không VPS — không Python.**

---

# 29. Thứ tự công việc khuyến nghị

Không nên code tất cả cùng lúc.

Thứ tự chính xác:

```text
1. Tạo Next.js project
        ↓
2. Làm giao diện
        ↓
3. Tạo /api/parse
        ↓
4. Mock dữ liệu
        ↓
5. Test UI + API
        ↓
6. Nghiên cứu parser Douyin Node.js
        ↓
7. Tích hợp parser
        ↓
8. Test link Douyin thật
        ↓
9. Xử lý lỗi
        ↓
10. Deploy Vercel
        ↓
11. Test production
        ↓
12. Tối ưu tốc độ
        ↓
13. Cache
        ↓
14. Rate limit
```

---

# 30. Tiêu chí hoàn thành MVP

MVP được xem là hoàn thành khi:

- [ ] Người dùng mở được website
- [ ] Dán được link Douyin
- [ ] API nhận được URL
- [ ] Resolve được short link
- [ ] Lấy được video ID
- [ ] Lấy được title
- [ ] Lấy được author
- [ ] Lấy được thumbnail
- [ ] Lấy được duration
- [ ] Lấy được video URL
- [ ] Hiển thị preview
- [ ] Download được video
- [ ] Xử lý link lỗi
- [ ] Deploy thành công trên Vercel
- [ ] Không cần VPS
- [ ] Không cần Python

---

# 31. Kết luận

Phương án được chốt:

```text
Next.js
+
TypeScript
+
Node.js
+
Tailwind CSS
+
Vercel
+
GitHub
```

Không sử dụng trong MVP:

```text
Python
FastAPI
VPS
Docker
Database
Redis
```

**Rủi ro kỹ thuật lớn nhất không phải Next.js, Node.js hay Vercel mà là parser Douyin.**

Vì vậy bước nghiên cứu quan trọng nhất trước khi viết parser là:

> **Xác định parser/API Douyin bằng Node.js có thể chạy ổn định trong Vercel Serverless, không cần browser automation nặng và có thể lấy được URL video.**

Sau khi xác định được parser phù hợp, phần còn lại của project tương đối thẳng:

```text
Next.js frontend
       ↓
/api/parse
       ↓
Douyin parser
       ↓
Metadata + video URL
       ↓
Browser download
```

---

# 32. Bước tiếp theo

Sau khi hoàn thành tài liệu này, **không nên bắt đầu viết toàn bộ project ngay**.

Bước tiếp theo nên là:

1. Tìm các project/parser Douyin hiện có.
2. Ưu tiên project Node.js/TypeScript.
3. Kiểm tra khả năng chạy trên Vercel Serverless.
4. Kiểm tra khả năng resolve `v.douyin.com`.
5. Kiểm tra khả năng lấy metadata.
6. Kiểm tra khả năng lấy video URL.
7. Kiểm tra yêu cầu cookie/signature.
8. Kiểm tra có cần Puppeteer/Playwright hay không.
9. Chọn parser phù hợp nhất.
10. Sau đó mới bắt đầu viết `lib/douyin/parser.ts`.

**Parser là nền móng của toàn bộ ứng dụng. Chọn đúng parser trước sẽ giảm đáng kể việc phải viết lại kiến trúc sau này.**