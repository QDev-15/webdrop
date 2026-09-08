import { Link } from 'react-router-dom'
import { useDocumentMeta } from '../hooks/useDocumentMeta'

const FEATURES = [
  { icon: '📷', title: 'Quét mã vạch', desc: 'Nhập/quét mã vạch sản phẩm để thêm nhanh vào đơn hàng mà không cần tìm kiếm thủ công.' },
  { icon: '🗂️', title: 'Giữ đơn tạm', desc: 'Phục vụ nhiều khách cùng lúc bằng cách giữ đơn đang xử lý qua các tab, quay lại tiếp tục bất kỳ lúc nào.' },
  { icon: '💳', title: 'Đa phương thức thanh toán', desc: 'Tiền mặt (tự tính tiền thối), chuyển khoản, QR code hoặc quẹt thẻ — linh hoạt theo nhu cầu khách hàng.' },
  { icon: '↩️', title: 'Trả hàng / hoàn tiền', desc: 'Tìm hóa đơn gốc, chọn sản phẩm cần trả, hệ thống tự tính tiền hoàn và cộng lại tồn kho.' },
  { icon: '🕐', title: 'Quản lý ca làm việc', desc: 'Mở ca với tiền mặt đầu ca, đóng ca đối soát tiền mặt thực tế, tự động tính chênh lệch quỹ.' },
  { icon: '📦', title: 'Quản lý kho & biến thể', desc: 'Nhập kho, kiểm kê tồn kho định kỳ, cảnh báo hết hàng, hỗ trợ sản phẩm có biến thể size/màu.' },
  { icon: '👥', title: 'CRM khách hàng', desc: 'Tích điểm, phân hạng thành viên tự động (Đồng/Bạc/Vàng/Kim Cương) theo tổng chi tiêu.' },
  { icon: '📊', title: 'Báo cáo trực quan', desc: 'Biểu đồ doanh thu, lợi nhuận, top sản phẩm bán chạy và báo cáo hiệu suất theo nhân viên.' },
  { icon: '🖨️', title: 'In hóa đơn', desc: 'In hóa đơn trên giấy thermal 80mm, tối ưu cho máy in POS chuyên dụng.' },
]

const STEPS = [
  { title: '1. Đăng nhập & mở ca', desc: 'Thu ngân đăng nhập, nhập tiền mặt đầu ca tại trang "Ca làm việc" trước khi được phép bán hàng.' },
  { title: '2. Lập đơn', desc: 'Quét mã vạch hoặc chọn sản phẩm từ menu, chọn biến thể nếu có, tìm/thêm khách hàng, áp dụng chiết khấu, chọn phương thức thanh toán rồi hoàn tất.' },
  { title: '3. Trả hàng (nếu có)', desc: 'Tìm mã hóa đơn gốc, chọn sản phẩm và số lượng cần trả, hệ thống tự tính tiền hoàn.' },
  { title: '4. Đóng ca', desc: 'Cuối ca, đếm tiền mặt thực tế và xác nhận đóng ca để đối soát với doanh thu hệ thống.' },
  { title: '5. Quản lý (Admin)', desc: 'Xem báo cáo dashboard, quản lý sản phẩm/kho/khách hàng, xuất báo cáo doanh thu — lợi nhuận theo kỳ.' },
]

const FAQS = [
  { q: 'Hệ thống này có bảo mật không?', a: 'Dữ liệu được lưu trong cơ sở dữ liệu trên máy chủ, chỉ truy cập được sau khi đăng nhập đúng tài khoản, mật khẩu được mã hoá bcrypt và mọi thao tác quản trị đều yêu cầu đúng quyền hạn.' },
  { q: 'Vì sao tôi không vào được trang Lập đơn?', a: 'Hệ thống yêu cầu mở ca làm việc trước khi bán hàng. Vào trang "Ca làm việc", nhập tiền mặt đầu ca và bấm "Mở ca".' },
  { q: 'Sản phẩm có biến thể hoạt động như thế nào?', a: 'Với sản phẩm có biến thể (VD: cà phê có size S/M/L, đá/nóng), khi thêm vào đơn hệ thống sẽ mở cửa sổ để bạn chọn đúng tổ hợp trước khi thêm — mỗi biến thể có tồn kho và giá riêng.' },
  { q: 'Làm sao để trả lại sản phẩm cho khách?', a: 'Vào trang "Trả hàng", nhập mã hóa đơn gốc, chọn sản phẩm và số lượng cần trả (không vượt số lượng đã mua), chọn lý do rồi xác nhận — tồn kho sẽ tự động được cộng lại.' },
  { q: 'Điểm tích lũy và hạng thành viên tính như thế nào?', a: 'Mỗi 10.000đ chi tiêu khách được cộng 1 điểm. Hạng thành viên tự động nâng theo tổng chi tiêu: Đồng (dưới 2 triệu), Bạc (2-10 triệu), Vàng (10-30 triệu), Kim Cương (trên 30 triệu).' },
  { q: 'Tôi có thể in hóa đơn được không?', a: 'Có, sau khi thanh toán, hệ thống sẽ hiển thị hóa đơn định dạng thermal 80mm sẵn sàng in.' },
  { q: 'Dữ liệu được lưu ở đâu?', a: 'Dữ liệu được lưu trong cơ sở dữ liệu trên máy chủ (không phải localStorage trình duyệt) — nhiều nhân viên có thể dùng đồng thời, dữ liệu không mất khi xoá dữ liệu trình duyệt.' },
]

export default function IntroPage() {
  useDocumentMeta({ title: 'Giới thiệu — POS Bán hàng', description: 'Giới thiệu hệ thống POS quản lý bán hàng chuyên nghiệp.' })
  return (
    <div className="bp-page-content">
      <div className="bp-container">
        <h1>Giới thiệu hệ thống</h1>

        <section className="bp-section bg-light">
          <h2>Chào mừng</h2>
          <p>POS Bán Hàng là giải pháp quản lý bán hàng toàn diện cho nhà hàng, quán ăn, café và cửa hàng bán lẻ — tham khảo mô hình của KiotViet, Sapo POS và Square. Hệ thống hỗ trợ đầy đủ vòng đời một ca bán hàng: mở ca → bán hàng (barcode, giữ đơn, đa thanh toán) → trả hàng → đóng ca đối soát tiền mặt, cùng với quản lý kho, khách hàng thân thiết và báo cáo trực quan cho quản lý.</p>
        </section>

        <section className="bp-section">
          <h2>Tính năng chính</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem', margin: '2rem 0' }}>
            {FEATURES.map(f => (
              <div key={f.title} className="bp-card">
                <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>{f.icon}</div>
                <h3>{f.title}</h3>
                <p>{f.desc}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="bp-section bg-light">
          <h2>Quy trình sử dụng</h2>
          <div style={{ maxWidth: 640, margin: '2rem 0' }}>
            {STEPS.map(s => (
              <div key={s.title} style={{ marginBottom: '2rem' }}>
                <h4 style={{ color: 'var(--accent)' }}>{s.title}</h4>
                <p>{s.desc}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="bp-section">
          <h2>Câu hỏi thường gặp</h2>
          <div style={{ maxWidth: 640, margin: '2rem 0' }}>
            {FAQS.map(f => (
              <details key={f.q} style={{ marginBottom: '1rem' }}>
                <summary style={{ cursor: 'pointer', padding: '1rem', background: 'var(--bg)', borderRadius: 8, fontWeight: 500 }}>{f.q}</summary>
                <p style={{ padding: '1rem', background: 'var(--border-light)', borderRadius: '0 0 8px 8px', marginTop: -4 }}>{f.a}</p>
              </details>
            ))}
          </div>
        </section>

        <section className="bp-section bg-light">
          <h2>Hỗ trợ</h2>
          <p>Nếu bạn có câu hỏi hoặc cần hỗ trợ, vui lòng <Link to="/lien-he">liên hệ với chúng tôi</Link>.</p>
        </section>
      </div>
    </div>
  )
}
