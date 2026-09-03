import { useDocumentMeta } from '../hooks/useDocumentMeta'

export default function PrivacyPolicyPage() {
  useDocumentMeta({
    title: 'Chính sách bảo mật — MỘC AN',
    description: 'Chính sách bảo mật thông tin khách hàng của MỘC AN — cách thu thập, sử dụng và bảo vệ dữ liệu cá nhân.',
  })

  return (
    <div className="nt-legal">
      <h1>Chính sách bảo mật</h1>
      <p className="updated">Cập nhật lần cuối: 01/01/2026</p>

      <p>MỘC AN cam kết bảo vệ thông tin cá nhân của khách hàng khi truy cập và mua sắm tại website. Chính sách này giải thích cách chúng tôi thu thập, sử dụng và bảo vệ dữ liệu của bạn.</p>

      <h2>1. Thông tin chúng tôi thu thập</h2>
      <ul>
        <li>Họ tên, số điện thoại, email, địa chỉ giao hàng khi bạn đặt hàng hoặc liên hệ tư vấn.</li>
        <li>Lịch sử đơn hàng và sản phẩm đã xem để cải thiện trải nghiệm mua sắm.</li>
        <li>Dữ liệu truy cập ẩn danh (loại thiết bị, trình duyệt) phục vụ mục đích thống kê.</li>
      </ul>

      <h2>2. Mục đích sử dụng thông tin</h2>
      <p>Thông tin được sử dụng để xử lý đơn hàng, giao hàng, chăm sóc khách hàng, gửi thông báo khuyến mãi (nếu bạn đồng ý), và cải thiện chất lượng dịch vụ. MỘC AN không bán hoặc cho thuê thông tin cá nhân của khách hàng cho bên thứ ba vì mục đích thương mại.</p>

      <h2>3. Bảo mật thông tin</h2>
      <p>Dữ liệu khách hàng được lưu trữ trên hệ thống có kiểm soát truy cập. Chỉ nhân viên được ủy quyền mới có thể truy cập thông tin phục vụ xử lý đơn hàng và chăm sóc khách hàng.</p>

      <h2>4. Chia sẻ thông tin với bên thứ ba</h2>
      <p>Thông tin giao hàng (họ tên, số điện thoại, địa chỉ) có thể được chia sẻ với đơn vị vận chuyển để thực hiện giao hàng. MỘC AN yêu cầu các đối tác này tuân thủ nguyên tắc bảo mật tương đương.</p>

      <h2>5. Quyền của khách hàng</h2>
      <p>Bạn có quyền yêu cầu xem, chỉnh sửa hoặc xóa thông tin cá nhân đã cung cấp bằng cách liên hệ qua email hoặc hotline được cung cấp tại trang Liên hệ.</p>

      <h2>6. Thay đổi chính sách</h2>
      <p>MỘC AN có thể cập nhật chính sách này theo thời gian. Phiên bản mới nhất sẽ luôn được đăng tải tại trang này.</p>
    </div>
  )
}
