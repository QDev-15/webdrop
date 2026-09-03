import { Link } from 'react-router-dom'
import { useDocumentMeta } from '../hooks/useDocumentMeta'

export default function PrivacyPolicyPage() {
  useDocumentMeta({ title: 'Chính sách bảo mật — Mộc Vang', description: 'Chính sách bảo mật thông tin khách hàng tại Mộc Vang.' })

  return (
    <div className="wd-container rv-policy">
      <h1 className="rv-sec-title" style={{ fontSize: 32 }}>Chính sách bảo mật</h1>
      <p className="rv-updated">Cập nhật lần cuối: 01/01/2026</p>

      <h2>1. Mục đích thu thập thông tin</h2>
      <p>Mộc Vang thu thập thông tin cá nhân (họ tên, số điện thoại, email, địa chỉ giao hàng, năm sinh để xác minh độ tuổi) nhằm mục đích xử lý đơn hàng, giao nhận rượu vang, chăm sóc khách hàng và tuân thủ quy định pháp luật về kinh doanh rượu.</p>

      <h2>2. Phạm vi sử dụng thông tin</h2>
      <ul>
        <li>Xác nhận và xử lý đơn đặt hàng, giao hàng đến đúng địa chỉ khách hàng cung cấp.</li>
        <li>Xác minh khách hàng đủ 18 tuổi trở lên trước khi giao hàng theo quy định pháp luật.</li>
        <li>Gửi thông báo về đơn hàng, chương trình khuyến mãi (nếu khách hàng đồng ý nhận).</li>
        <li>Hỗ trợ giải quyết khiếu nại, đổi trả sản phẩm.</li>
      </ul>

      <h2>3. Thời gian lưu trữ thông tin</h2>
      <p>Thông tin cá nhân được lưu trữ cho đến khi khách hàng có yêu cầu hủy bỏ hoặc theo thời hạn lưu trữ chứng từ kế toán, thương mại theo quy định pháp luật hiện hành.</p>

      <h2>4. Đơn vị có thể tiếp cận thông tin</h2>
      <p>Mộc Vang cam kết không chia sẻ, bán hoặc trao đổi thông tin cá nhân của khách hàng cho bên thứ ba, ngoại trừ đơn vị vận chuyển (chỉ giới hạn thông tin cần thiết để giao hàng) và cơ quan nhà nước có thẩm quyền khi được yêu cầu theo quy định pháp luật.</p>

      <h2>5. Phương thức bảo mật thông tin</h2>
      <p>Dữ liệu khách hàng được lưu trữ trên hệ thống có kiểm soát truy cập, chỉ nhân sự được phân quyền mới có thể truy xuất phục vụ mục đích xử lý đơn hàng và chăm sóc khách hàng.</p>

      <h2>6. Quyền của khách hàng</h2>
      <p>Khách hàng có quyền yêu cầu truy cập, chỉnh sửa hoặc yêu cầu xóa thông tin cá nhân của mình bằng cách liên hệ qua email hello@mocvang.vn hoặc hotline 1900 6868.</p>

      <div className="rv-notice-box">
        <strong>Lưu ý về độ tuổi:</strong> Mộc Vang chỉ thu thập và xử lý thông tin của khách hàng từ đủ 18 tuổi trở lên, phù hợp với quy định về kinh doanh rượu tại Việt Nam.
      </div>

      <h2>7. Liên hệ</h2>
      <p>Nếu có bất kỳ thắc mắc nào về chính sách bảo mật, vui lòng liên hệ qua trang <Link to="/lien-he" style={{ color: 'var(--accent)', textDecoration: 'underline' }}>Liên hệ</Link>.</p>
    </div>
  )
}
