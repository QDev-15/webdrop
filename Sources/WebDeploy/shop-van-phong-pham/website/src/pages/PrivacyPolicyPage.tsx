import { Link } from 'react-router-dom'
import { useSite } from '../contexts/SiteContext'
import { useDocumentMeta } from '../hooks/useDocumentMeta'

export default function PrivacyPolicyPage() {
  const { settings } = useSite()
  const siteName = settings.site_name || 'OFFICEHUB'

  useDocumentMeta({
    title: `Chính sách bảo mật — ${siteName}`,
    description: `Chính sách bảo mật của ${siteName} — cách chúng tôi thu thập, sử dụng và bảo vệ thông tin cá nhân của khách hàng.`,
  })

  return (
    <>
      <div className="vp-page-header">
        <div className="vp-container">
          <nav aria-label="Breadcrumb" className="vp-breadcrumb">
            <Link to="/">Trang chủ</Link>
            <span>›</span>
            <span aria-current="page">Chính sách bảo mật</span>
          </nav>
          <h1>Chính sách bảo mật</h1>
          <p>Cập nhật lần cuối: 01/01/2026</p>
        </div>
      </div>

      <div className="vp-legal-wrap">
        <div className="vp-container">
          <div className="vp-legal-content">
            <section className="vp-legal-section">
              <h2>1. Giới thiệu</h2>
              <p>{siteName} ("chúng tôi", "của chúng tôi") cam kết bảo vệ quyền riêng tư và thông tin cá nhân của khách hàng ("bạn"). Chính sách bảo mật này mô tả cách chúng tôi thu thập, sử dụng, lưu trữ và bảo vệ thông tin của bạn khi bạn sử dụng website và dịch vụ của chúng tôi.</p>
              <p>Bằng cách sử dụng website của {siteName}, bạn đồng ý với các điều khoản trong Chính sách bảo mật này.</p>
            </section>

            <section className="vp-legal-section">
              <h2>2. Thông tin chúng tôi thu thập</h2>
              <h3>2.1. Thông tin bạn cung cấp trực tiếp</h3>
              <ul>
                <li>Họ tên, số điện thoại, địa chỉ email khi đăng ký tài khoản hoặc đặt hàng</li>
                <li>Địa chỉ giao hàng và thông tin thanh toán</li>
                <li>Nội dung tin nhắn, yêu cầu hỗ trợ hoặc khiếu nại</li>
                <li>Thông tin doanh nghiệp khi đăng ký dịch vụ B2B</li>
              </ul>
              <h3>2.2. Thông tin thu thập tự động</h3>
              <ul>
                <li>Địa chỉ IP, loại trình duyệt, thiết bị truy cập</li>
                <li>Trang bạn truy cập, thời gian truy cập, nguồn giới thiệu</li>
                <li>Cookie và dữ liệu phiên truy cập (session data)</li>
              </ul>
            </section>

            <section className="vp-legal-section">
              <h2>3. Mục đích sử dụng thông tin</h2>
              <p>Chúng tôi sử dụng thông tin thu thập để:</p>
              <ul>
                <li>Xử lý và giao đơn hàng của bạn</li>
                <li>Gửi xác nhận đơn hàng, cập nhật trạng thái giao hàng</li>
                <li>Hỗ trợ khách hàng, giải quyết khiếu nại</li>
                <li>Cải thiện trải nghiệm mua sắm trên website</li>
                <li>Gửi thông báo khuyến mãi (nếu bạn đồng ý nhận)</li>
                <li>Phân tích dữ liệu để tối ưu hoá dịch vụ</li>
                <li>Tuân thủ các nghĩa vụ pháp lý theo quy định Việt Nam</li>
              </ul>
            </section>

            <section className="vp-legal-section">
              <h2>4. Chia sẻ thông tin</h2>
              <p>Chúng tôi không bán hoặc cho thuê thông tin cá nhân của bạn cho bên thứ ba vì mục đích thương mại. Chúng tôi chỉ chia sẻ thông tin trong các trường hợp sau:</p>
              <ul>
                <li><strong>Đối tác giao hàng:</strong> Tên, địa chỉ, số điện thoại để giao đơn hàng</li>
                <li><strong>Đối tác thanh toán:</strong> Thông tin cần thiết để xử lý giao dịch</li>
                <li><strong>Yêu cầu pháp lý:</strong> Khi có lệnh của cơ quan nhà nước có thẩm quyền</li>
                <li><strong>Bảo vệ quyền lợi:</strong> Khi cần thiết để phòng chống gian lận, bảo vệ an toàn</li>
              </ul>
            </section>

            <section className="vp-legal-section">
              <h2>5. Bảo mật thông tin</h2>
              <p>Chúng tôi áp dụng các biện pháp kỹ thuật và tổ chức phù hợp để bảo vệ thông tin của bạn, bao gồm:</p>
              <ul>
                <li>Mã hóa SSL/TLS cho toàn bộ giao dịch trên website</li>
                <li>Lưu trữ mật khẩu dưới dạng băm (hash) — không lưu mật khẩu gốc</li>
                <li>Kiểm soát truy cập nội bộ theo nguyên tắc tối thiểu đặc quyền</li>
                <li>Kiểm tra bảo mật định kỳ</li>
              </ul>
              <p>Tuy nhiên, không có phương pháp truyền dữ liệu nào qua Internet là hoàn toàn an toàn tuyệt đối. Chúng tôi không thể đảm bảo bảo mật 100% nhưng cam kết nỗ lực hết mức để bảo vệ thông tin của bạn.</p>
            </section>

            <section className="vp-legal-section">
              <h2>6. Cookie</h2>
              <p>Website sử dụng cookie để cải thiện trải nghiệm người dùng. Cookie là các tệp nhỏ được lưu trữ trên thiết bị của bạn. Bạn có thể tắt cookie trong cài đặt trình duyệt, tuy nhiên một số tính năng của website có thể hoạt động không đầy đủ.</p>
              <p>Các loại cookie chúng tôi sử dụng: cookie phiên truy cập (xóa khi đóng trình duyệt), cookie lưu giỏ hàng, cookie phân tích website (ẩn danh, không gắn với cá nhân).</p>
            </section>

            <section className="vp-legal-section">
              <h2>7. Quyền của bạn</h2>
              <p>Theo quy định pháp luật Việt Nam, bạn có các quyền sau đối với dữ liệu cá nhân của mình:</p>
              <ul>
                <li><strong>Quyền truy cập:</strong> Yêu cầu xem thông tin chúng tôi lưu về bạn</li>
                <li><strong>Quyền sửa đổi:</strong> Yêu cầu cập nhật thông tin không chính xác</li>
                <li><strong>Quyền xóa:</strong> Yêu cầu xóa tài khoản và dữ liệu cá nhân (trừ dữ liệu cần giữ theo quy định pháp luật)</li>
                <li><strong>Quyền phản đối:</strong> Từ chối nhận email marketing bất kỳ lúc nào</li>
              </ul>
              {settings.site_email && <p>Để thực hiện các quyền này, vui lòng liên hệ qua email: <a href={`mailto:${settings.site_email}`}>{settings.site_email}</a></p>}
            </section>

            <section className="vp-legal-section">
              <h2>8. Thay đổi chính sách</h2>
              <p>Chúng tôi có thể cập nhật Chính sách bảo mật này theo thời gian. Mọi thay đổi sẽ được thông báo trên trang này với ngày cập nhật mới nhất. Việc tiếp tục sử dụng dịch vụ sau khi thay đổi đồng nghĩa với việc bạn chấp nhận chính sách mới.</p>
            </section>

            <section className="vp-legal-section">
              <h2>9. Liên hệ</h2>
              <p>Nếu có câu hỏi về Chính sách bảo mật, vui lòng liên hệ:</p>
              <ul>
                {settings.site_email && <li>Email: <a href={`mailto:${settings.site_email}`}>{settings.site_email}</a></li>}
                {settings.site_phone && <li>Điện thoại: <a href={`tel:${settings.site_phone.replace(/\s/g, '')}`}>{settings.site_phone}</a></li>}
                {settings.site_address && <li>Địa chỉ: {settings.site_address}</li>}
              </ul>
            </section>

            <div className="vp-legal-back">
              <Link to="/" className="vp-btn vp-btn-outline">← Quay lại trang chủ</Link>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
