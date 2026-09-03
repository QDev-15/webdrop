import { Link } from 'react-router-dom'
import { useSite } from '../contexts/SiteContext'
import { useDocumentMeta } from '../hooks/useDocumentMeta'

export default function PrivacyPolicyPage() {
  const { settings } = useSite()
  const phone = settings.site_phone || '[SỐ_ĐIỆN_THOẠI]'
  const email = settings.site_email || '[EMAIL]'

  useDocumentMeta({
    title: 'Chính sách bảo mật — MERIDIAN',
    description: 'Chính sách bảo mật thông tin khách hàng của MERIDIAN.',
  })

  return (
    <>
      <section className="dh-legal-header">
        <div className="dh-container">
          <h1>Chính sách bảo mật</h1>
          <p>Cập nhật lần cuối: 01/01/2026</p>
        </div>
      </section>

      <section className="dh-sec">
        <div className="dh-container dh-legal-content">
          <h2>1. Mục đích thu thập thông tin</h2>
          <p>MERIDIAN thu thập thông tin cá nhân (họ tên, số điện thoại, email, địa chỉ giao hàng) nhằm mục đích xử lý đơn hàng, giao hàng, chăm sóc khách hàng và kích hoạt phiếu bảo hành điện tử cho sản phẩm đã mua.</p>

          <h2>2. Phạm vi sử dụng thông tin</h2>
          <p>Thông tin khách hàng chỉ được sử dụng nội bộ nhằm phục vụ hoạt động kinh doanh của MERIDIAN, bao gồm:</p>
          <ul>
            <li>Xác nhận và xử lý đơn hàng</li>
            <li>Liên hệ giao hàng và hỗ trợ sau bán</li>
            <li>Gửi thông báo về tình trạng bảo hành sản phẩm</li>
            <li>Gửi thông tin khuyến mãi nếu khách hàng đồng ý đăng ký nhận tin</li>
          </ul>

          <h2>3. Thời gian lưu trữ thông tin</h2>
          <p>Thông tin cá nhân được lưu trữ trong suốt thời gian khách hàng có nhu cầu sử dụng dịch vụ tại MERIDIAN và tối thiểu trong thời hạn bảo hành sản phẩm đã mua, nhằm phục vụ tra cứu và hỗ trợ bảo hành.</p>

          <h2>4. Cam kết bảo mật thông tin</h2>
          <p>MERIDIAN cam kết không chia sẻ, bán hoặc trao đổi thông tin cá nhân của khách hàng cho bên thứ ba vì mục đích thương mại khi chưa có sự đồng ý, trừ trường hợp pháp luật yêu cầu.</p>

          <h2>5. Quyền của khách hàng</h2>
          <p>Khách hàng có quyền yêu cầu truy cập, chỉnh sửa hoặc yêu cầu xóa thông tin cá nhân của mình bằng cách liên hệ trực tiếp qua hotline {phone} hoặc email {email}.</p>

          <h2>6. Liên hệ</h2>
          <p>Mọi thắc mắc liên quan đến chính sách bảo mật vui lòng liên hệ MERIDIAN qua trang <Link to="/lien-he" style={{ color: 'var(--accent)', fontWeight: 600 }}>Liên hệ</Link>.</p>
        </div>
      </section>
    </>
  )
}
