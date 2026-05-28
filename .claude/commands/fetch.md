# /fetch

Khi người dùng gõ `/fetch claude.md`, thực hiện các bước sau:

1. Fetch nội dung mới nhất từ GitHub:
   URL: https://raw.githubusercontent.com/QDev-15/webdrop/master/.claude/CLAUDE.md

2. Đọc toàn bộ nội dung file vừa fetch

3. Cập nhật context hiện tại với nội dung mới nhất từ GitHub

4. Xác nhận với người dùng: "✅ Đã đồng bộ CLAUDE.md từ GitHub — [tóm tắt ngắn những gì có trong file]"

> Lệnh này giúp sync context Claude với version mới nhất trên repo mà không cần upload thủ công.