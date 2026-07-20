import { Link } from 'react-router-dom'
import { useSite } from '../contexts/SiteContext'
import { useDocumentMeta } from '../hooks/useDocumentMeta'

export default function PrivacyPolicyPage() {
  const { settings } = useSite()
  const siteName = settings.site_name || 'Vườn Xanh'

  useDocumentMeta({
    title: `Chính sách bảo mật — ${siteName}`,
    description: `${siteName} cam kết bảo vệ thông tin cá nhân của khách hàng khi mua sắm rau củ quả tại đây.`,
  })

  return (
    <main>
      <div className="rx-page-header">
        <div className="rx-container">
          <nav className="rx-breadcrumb" aria-label="Breadcrumb">
            <Link to="/">Trang chủ</Link><span><i className="bi bi-chevron-right" style={{ fontSize: 10 }} /></span><span>Chính sách bảo mật</span>
          </nav>
          <h1 className="rx-page-title">Chính sách bảo mật</h1>
          <p className="rx-page-count">{siteName} cam kết bảo vệ thông tin cá nhân của khách hàng khi mua sắm rau củ quả tại đây.</p>
        </div>
      </div>

      <div className="rx-container-sm rx-policy-section">
        <div className="rx-policy-block" data-reveal>
          <h2>1. Thông tin chúng tôi thu thập</h2>
          <p>Khi bạn đặt hàng, đăng ký nhận tin hoặc liên hệ với {siteName}, chúng tôi có thể thu thập các thông tin sau: họ tên, số điện thoại, địa chỉ giao hàng, email, và nội dung trao đổi khi bạn liên hệ hỗ trợ. Chúng tôi không thu thập thông tin thanh toán nhạy cảm (số thẻ ngân hàng) — mọi giao dịch chuyển khoản/thanh toán được thực hiện qua cổng của ngân hàng hoặc ví điện tử liên kết.</p>
        </div>

        <div className="rx-policy-block" data-reveal data-delay="1">
          <h2>2. Mục đích sử dụng thông tin</h2>
          <p>Thông tin thu thập được sử dụng nhằm:</p>
          <ul>
            <li>Xử lý và giao đơn hàng rau củ quả đúng địa chỉ, đúng thời gian bạn yêu cầu.</li>
            <li>Liên hệ xác nhận đơn hàng, thông báo tình trạng giao hàng hoặc xử lý đổi trả.</li>
            <li>Gửi thông tin khuyến mãi, combo rau theo mùa nếu bạn đồng ý đăng ký nhận tin.</li>
            <li>Cải thiện chất lượng sản phẩm và dịch vụ dựa trên phản hồi của khách hàng.</li>
          </ul>
        </div>

        <div className="rx-policy-block" data-reveal>
          <h2>3. Chia sẻ thông tin với bên thứ ba</h2>
          <p>{siteName} không bán hoặc cho thuê thông tin cá nhân của khách hàng. Thông tin chỉ được chia sẻ trong các trường hợp cần thiết để hoàn tất đơn hàng, cụ thể:</p>
          <ul>
            <li>Đơn vị vận chuyển/giao hàng — chỉ nhận họ tên, số điện thoại và địa chỉ giao hàng.</li>
            <li>Đối tác thanh toán (ngân hàng, ví điện tử) — khi bạn chọn thanh toán online.</li>
            <li>Cơ quan nhà nước có thẩm quyền, khi có yêu cầu hợp pháp theo quy định pháp luật.</li>
          </ul>
        </div>

        <div className="rx-policy-block" data-reveal data-delay="1">
          <h2>4. Bảo mật & lưu trữ dữ liệu</h2>
          <p>Dữ liệu khách hàng được lưu trữ trên hệ thống có kiểm soát truy cập, chỉ nhân sự phụ trách đơn hàng và chăm sóc khách hàng mới được phép truy xuất. Chúng tôi áp dụng các biện pháp kỹ thuật hợp lý để ngăn chặn truy cập trái phép, mất mát hoặc sử dụng sai mục đích. Thông tin được lưu trữ trong thời gian cần thiết để phục vụ mục đích đã nêu hoặc theo yêu cầu của pháp luật.</p>
        </div>

        <div className="rx-policy-block" data-reveal>
          <h2>5. Quyền của khách hàng</h2>
          <p>Bạn có quyền yêu cầu {siteName} cung cấp, chỉnh sửa hoặc xóa thông tin cá nhân đang được lưu trữ; đồng thời có quyền từ chối nhận email/tin nhắn khuyến mãi bất kỳ lúc nào bằng cách liên hệ trực tiếp với chúng tôi.</p>
        </div>

        <div className="rx-policy-block" data-reveal data-delay="1">
          <h2>6. Liên hệ về dữ liệu cá nhân</h2>
          <p>Nếu có bất kỳ thắc mắc nào về chính sách bảo mật hoặc muốn thực hiện quyền của mình đối với dữ liệu cá nhân, vui lòng liên hệ {siteName} qua trang <Link to="/lien-he" style={{ color: 'var(--accent)', textDecoration: 'underline' }}>Liên hệ</Link>{settings.site_email ? <> hoặc email <strong>{settings.site_email}</strong></> : null}{settings.site_phone ? <>, hotline <strong>{settings.site_phone}</strong></> : null}.</p>
        </div>
      </div>
    </main>
  )
}
