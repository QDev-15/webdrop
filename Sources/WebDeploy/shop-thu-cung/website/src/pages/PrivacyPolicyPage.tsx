import { Link } from 'react-router-dom'
import { useDocumentMeta } from '../hooks/useDocumentMeta'

export default function PrivacyPolicyPage() {
  useDocumentMeta({ title: 'Chính sách bảo mật — Pet Haus', description: 'Chính sách bảo mật thông tin khách hàng tại Pet Haus.' })

  return (
    <div className="tc-container" style={{ paddingTop: 140, paddingBottom: 80, maxWidth: 820 }}>
      <h1 className="tc-sec-title" style={{ fontSize: 32 }}>Chính sách bảo mật</h1>
      <p style={{ color: 'var(--text-3)', fontSize: 13.5, marginBottom: 28 }}>Cập nhật lần cuối: 01/01/2026</p>

      <h2 style={{ fontSize: 20, fontWeight: 700, margin: '28px 0 12px' }}>1. Mục đích thu thập thông tin</h2>
      <p style={{ color: 'var(--text-2)', lineHeight: 1.8 }}>Pet Haus thu thập thông tin cá nhân (họ tên, số điện thoại, email, địa chỉ giao hàng) nhằm mục đích xử lý đơn hàng, giao nhận sản phẩm thú cưng, chăm sóc khách hàng và cải thiện chất lượng dịch vụ.</p>

      <h2 style={{ fontSize: 20, fontWeight: 700, margin: '28px 0 12px' }}>2. Phạm vi sử dụng thông tin</h2>
      <ul style={{ color: 'var(--text-2)', lineHeight: 1.8, paddingLeft: 20 }}>
        <li>Xác nhận và xử lý đơn đặt hàng, giao hàng đến đúng địa chỉ khách hàng cung cấp.</li>
        <li>Gửi thông báo về đơn hàng, chương trình khuyến mãi (nếu khách hàng đồng ý nhận).</li>
        <li>Hỗ trợ giải quyết khiếu nại, đổi trả sản phẩm.</li>
        <li>Tư vấn sản phẩm phù hợp với nhu cầu chăm sóc thú cưng của khách hàng.</li>
      </ul>

      <h2 style={{ fontSize: 20, fontWeight: 700, margin: '28px 0 12px' }}>3. Thời gian lưu trữ thông tin</h2>
      <p style={{ color: 'var(--text-2)', lineHeight: 1.8 }}>Thông tin cá nhân được lưu trữ cho đến khi khách hàng có yêu cầu hủy bỏ hoặc theo thời hạn lưu trữ chứng từ kế toán, thương mại theo quy định pháp luật hiện hành.</p>

      <h2 style={{ fontSize: 20, fontWeight: 700, margin: '28px 0 12px' }}>4. Đơn vị có thể tiếp cận thông tin</h2>
      <p style={{ color: 'var(--text-2)', lineHeight: 1.8 }}>Pet Haus cam kết không chia sẻ, bán hoặc trao đổi thông tin cá nhân của khách hàng cho bên thứ ba, ngoại trừ đơn vị vận chuyển (chỉ giới hạn thông tin cần thiết để giao hàng) và cơ quan nhà nước có thẩm quyền khi được yêu cầu theo quy định pháp luật.</p>

      <h2 style={{ fontSize: 20, fontWeight: 700, margin: '28px 0 12px' }}>5. Phương thức bảo mật thông tin</h2>
      <p style={{ color: 'var(--text-2)', lineHeight: 1.8 }}>Dữ liệu khách hàng được lưu trữ trên hệ thống có kiểm soát truy cập, chỉ nhân sự được phân quyền mới có thể truy xuất phục vụ mục đích xử lý đơn hàng và chăm sóc khách hàng.</p>

      <h2 style={{ fontSize: 20, fontWeight: 700, margin: '28px 0 12px' }}>6. Quyền của khách hàng</h2>
      <p style={{ color: 'var(--text-2)', lineHeight: 1.8 }}>Khách hàng có quyền yêu cầu truy cập, chỉnh sửa hoặc yêu cầu xóa thông tin cá nhân của mình bằng cách liên hệ qua email hoặc hotline của Pet Haus.</p>

      <h2 style={{ fontSize: 20, fontWeight: 700, margin: '28px 0 12px' }}>7. Liên hệ</h2>
      <p style={{ color: 'var(--text-2)', lineHeight: 1.8 }}>Nếu có bất kỳ thắc mắc nào về chính sách bảo mật, vui lòng liên hệ qua trang <Link to="/lien-he" style={{ color: 'var(--accent)', textDecoration: 'underline' }}>Liên hệ</Link>.</p>
    </div>
  )
}
