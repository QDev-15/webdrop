# POS Bán Hàng — Gói B (React + PHP + SQLite)

Hệ thống quản lý bán hàng POS cho nhà hàng, quán ăn, café và cửa hàng bán lẻ — chuyển đổi từ template tĩnh Gói A `shop-banhang`. Website nội bộ (yêu cầu đăng nhập ở mọi trang nghiệp vụ) + Admin panel quản lý sản phẩm/kho/khách hàng/báo cáo.

## Kiến trúc

- **`website/`** — React SPA cho nhân viên: đăng nhập → mở ca → lập đơn (POS) → trả hàng → đóng ca. Có 4 trang public không cần đăng nhập: Giới thiệu, Liên hệ, Chính sách bảo mật, Điều khoản.
- **`admin/`** — React SPA quản trị (chỉ role `superadmin`): Dashboard, Quản lý menu (sản phẩm + biến thể), Nhập kho, Kiểm kho, Khách hàng, Thống kê, Cài đặt, Tài khoản.
- **`api/`** — PHP thuần + SQLite, RESTful qua `index.php` router.

## Deploy lên hosting

1. Upload **toàn bộ nội dung** trong thư mục `_output-deploy/` (nằm cạnh thư mục `shop-banhang/`, được tạo bởi `node build.mjs` hoặc `build.bat`) lên `public_html/` của hosting (yêu cầu PHP ≥ 8.0 + extension `pdo_sqlite`).
2. Mở `api/config.php` trên server, sửa `APP_URL` thành URL thực của website (không có dấu `/` cuối). `APP_KEY` đã được tự sinh ngẫu nhiên lúc build — không cần sửa.
3. Kiểm tra `https://tenweb.vn/api/health` — phải thấy `"pdo_sqlite": true` và `"db_dir": "writable"`. Nếu `db_dir` báo "not writable", `chmod 755` (hoặc 775 tuỳ hosting) cho thư mục `api/database/` và `api/uploads/`.
4. Truy cập `https://tenweb.vn/` để vào trang đăng nhập (dành cho nhân viên/thu ngân), hoặc `https://tenweb.vn/admin` để vào trang quản trị.
5. **Xoá file `api/check-hash.php` khỏi server ngay sau khi deploy xong** — đây là file debug hỗ trợ kiểm tra hash mật khẩu, không nên để lại trên môi trường thật.

## Tài khoản mặc định

| Vai trò | Email đăng nhập | Mật khẩu |
|---|---|---|
| Quản lý (superadmin — vào được `/admin`) | `sysadmin@admin.com` | `123456` |
| Thu ngân (chỉ vào được POS bán hàng) | `nv01@pos-banhang.local` | `123456` |

**Đổi mật khẩu ngay sau khi deploy** — vào `/admin/profile` (quản lý) hoặc trang cá nhân tương ứng.

Có thể tạo thêm tài khoản thu ngân mới tại `/admin` → **Tài khoản** → "+ Thêm tài khoản".

## Luồng nghiệp vụ

```
Đăng nhập → (Thu ngân, chưa mở ca) → Ca làm việc → nhập tiền đầu ca → Mở ca
  ↓
Lập đơn (POS): quét/nhập mã vạch hoặc chọn từ lưới sản phẩm → chọn biến thể nếu có
  → tìm/thêm khách hàng (tuỳ chọn) → áp dụng chiết khấu → chọn phương thức thanh toán
  → Thanh toán → tự động trừ tồn kho + cộng điểm khách hàng
  ↓
In hóa đơn (thermal 80mm) → Quay lại Lập đơn
  ↓
[Có trả hàng] → Trả hàng → nhập mã hóa đơn gốc → chọn SP + số lượng + lý do → hoàn tiền
  ↓
[Cuối ca] → Ca làm việc → đếm tiền mặt thực tế → Đóng ca → xem chênh lệch quỹ
```

**Quản lý (Admin)**: Dashboard (doanh thu 7 ngày, cảnh báo tồn kho thấp) → Quản lý menu (CRUD sản phẩm + biến thể size/màu) → Nhập kho khi hàng về → Kiểm kê định kỳ → CRM khách hàng theo hạng thành viên → Thống kê doanh thu/lợi nhuận lọc theo kỳ/nhân viên.

## Phân quyền

- `role = 'user'` (Thu ngân): chỉ vào được các trang nghiệp vụ bán hàng (Lập đơn, Trả hàng, Ca làm việc của chính mình) — không vào được `/admin`.
- `role = 'superadmin'` (Quản lý): toàn quyền `/admin` — quản lý sản phẩm/kho/khách hàng/báo cáo/cài đặt/tài khoản.
- Mọi endpoint quản trị đều tự kiểm tra quyền ở phía backend (không chỉ ẩn UI) — cashier gọi thẳng API quản trị cũng sẽ bị từ chối (403).

## Ghi chú kỹ thuật

- Toàn bộ phép tính tiền (tiền thối, chiết khấu, điểm tích lũy, chênh lệch quỹ, lợi nhuận) được tính lại ở backend từ dữ liệu gốc trong CSDL — không tin dữ liệu client gửi lên (chống gian lận giá/tồn kho).
- Trừ/cộng tồn kho dùng UPDATE có điều kiện (atomic) — chống race-condition khi nhiều thu ngân bán hàng đồng thời.
- Thanh toán tạo đơn thất bại (không đủ hàng) sẽ **rollback toàn bộ** — không trừ tồn kho một phần.
- Hạng thành viên (Đồng/Bạc/Vàng/Kim Cương) tính tự động theo tổng chi tiêu, không lưu cột riêng — luôn khớp thực tế.
- "Giữ đơn" (hold order) chỉ lưu trong bộ nhớ trình duyệt của phiên làm việc hiện tại — không đồng bộ giữa các máy tính thu ngân khác nhau, và sẽ mất nếu tải lại trang.
