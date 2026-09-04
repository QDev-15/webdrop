import { Link } from 'react-router-dom'
import { useDocumentMeta } from '../hooks/useDocumentMeta'

export default function PrivacyPolicyPage() {
  useDocumentMeta({
    title: 'Chính sách bảo mật — VIOLETTE Fine Jewelry',
    description: 'Chính sách bảo mật thông tin khách hàng của VIOLETTE Fine Jewelry.',
  })

  return (
    <main className="tr-legal-wrap">
      <div className="tr-container">
        <div className="tr-breadcrumb" style={{ marginBottom: 26 }}><Link to="/">Trang chủ</Link> / <span>Chính sách bảo mật</span></div>
        <h1 style={{ fontSize: 'clamp(28px,3.4vw,38px)', marginBottom: 34 }}>Chính sách bảo mật</h1>
        <div className="tr-legal-grid">
          <div className="tr-legal-body">
            <p><em>Cập nhật lần cuối: 01/01/2026</em></p>
            <h2>1. Thông tin chúng tôi thu thập</h2>
            <p>Khi bạn mua hàng, đăng ký nhận tin hoặc liên hệ tư vấn tại VIOLETTE, chúng tôi có thể thu thập: họ tên, số điện thoại, email, địa chỉ giao hàng và lịch sử đơn hàng. Chúng tôi không thu thập thông tin thẻ ngân hàng — mọi giao dịch thanh toán online được xử lý qua cổng thanh toán bên thứ ba đạt chuẩn bảo mật.</p>
            <h2>2. Mục đích sử dụng thông tin</h2>
            <ul>
              <li>Xử lý đơn hàng, giao hàng và hỗ trợ bảo hành, đổi trả sản phẩm.</li>
              <li>Liên hệ tư vấn khi khách hàng có yêu cầu.</li>
              <li>Gửi thông tin khuyến mãi, bộ sưu tập mới (chỉ khi khách hàng đồng ý nhận tin).</li>
              <li>Cải thiện chất lượng dịch vụ và trải nghiệm mua sắm.</li>
            </ul>
            <h2>3. Chia sẻ thông tin với bên thứ ba</h2>
            <p>VIOLETTE cam kết không bán hoặc trao đổi thông tin cá nhân của khách hàng cho bất kỳ bên thứ ba nào ngoài mục đích: đơn vị vận chuyển (chỉ họ tên, số điện thoại, địa chỉ giao hàng) và cổng thanh toán (khi khách hàng chọn thanh toán online).</p>
            <h2>4. Bảo mật thông tin</h2>
            <p>Thông tin khách hàng được lưu trữ trên hệ thống có mã hóa và phân quyền truy cập nghiêm ngặt. Chỉ nhân viên được ủy quyền mới có thể truy cập thông tin đơn hàng để phục vụ xử lý và hỗ trợ khách hàng.</p>
            <h2>5. Quyền của khách hàng</h2>
            <p>Khách hàng có quyền yêu cầu VIOLETTE cung cấp, chỉnh sửa hoặc xóa thông tin cá nhân của mình bất kỳ lúc nào bằng cách liên hệ qua email hoặc hotline được cung cấp tại trang Liên hệ.</p>
            <h2>6. Liên hệ</h2>
            <p>Mọi thắc mắc về chính sách bảo mật, vui lòng liên hệ qua trang <Link to="/lien-he">Liên hệ</Link>.</p>
          </div>
          <aside className="tr-legal-sidebar">
            <div className="tr-legal-sidebar-box">
              <h4>Xem thêm</h4>
              <Link to="/dieu-khoan">Điều khoản sử dụng</Link>
              <Link to="/lien-he">Liên hệ hỗ trợ</Link>
              <Link to="/ve-chung-toi">Giới thiệu VIOLETTE</Link>
            </div>
          </aside>
        </div>
      </div>
    </main>
  )
}
