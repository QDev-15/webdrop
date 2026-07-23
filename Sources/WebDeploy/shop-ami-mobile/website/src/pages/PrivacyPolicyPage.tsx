import { Link } from 'react-router-dom'
import { useSite } from '../contexts/SiteContext'
import { useDocumentMeta } from '../hooks/useDocumentMeta'

export default function PrivacyPolicyPage() {
  const { settings } = useSite()
  const siteName = settings.site_name || 'AMI Mobile'
  useDocumentMeta({
    title: `Chính sách bảo mật — ${siteName}`,
    description: `Chính sách bảo mật của ${siteName} — cách chúng tôi thu thập, sử dụng và bảo vệ thông tin cá nhân của bạn.`,
  })

  return (
    <>
      <div className="mb-page-hero">
        <div className="mb-container">
          <div className="mb-breadcrumb">
            <Link to="/">Trang chủ</Link><span>/</span><span>Chính sách bảo mật</span>
          </div>
          <div className="mb-label mb-page-hero-label">Pháp lý</div>
          <h1>Chính sách <em>bảo mật</em></h1>
        </div>
      </div>

      <section className="mb-sec mb-legal-sec">
        <div className="mb-container">
          <div className="mb-legal-content">
            <p className="mb-legal-updated">Cập nhật lần cuối: 2026</p>

            <h2>1. Thông tin chúng tôi thu thập</h2>
            <p>Khi bạn sử dụng dịch vụ của {siteName}, chúng tôi có thể thu thập các thông tin sau:</p>
            <ul>
              <li>Họ tên, số điện thoại, địa chỉ email khi bạn đặt hàng hoặc liên hệ.</li>
              <li>Địa chỉ giao hàng để xử lý đơn đặt hàng.</li>
              <li>Thông tin thanh toán (qua các cổng thanh toán bảo mật — chúng tôi không lưu trữ thông tin thẻ).</li>
              <li>Dữ liệu truy cập trang web (qua cookie và công cụ phân tích ẩn danh).</li>
            </ul>

            <h2>2. Mục đích sử dụng thông tin</h2>
            <p>Thông tin thu thập được sử dụng để:</p>
            <ul>
              <li>Xử lý đơn hàng và giao hàng đến đúng địa chỉ.</li>
              <li>Hỗ trợ khách hàng sau bán hàng và bảo hành.</li>
              <li>Thông báo về trạng thái đơn hàng và khuyến mãi (nếu bạn đồng ý nhận).</li>
              <li>Cải thiện trải nghiệm mua sắm trên website.</li>
            </ul>

            <h2>3. Bảo vệ thông tin</h2>
            <p>Chúng tôi cam kết bảo vệ thông tin cá nhân của bạn bằng các biện pháp kỹ thuật và quản lý phù hợp, bao gồm mã hóa dữ liệu và kiểm soát quyền truy cập nội bộ.</p>

            <h2>4. Chia sẻ thông tin với bên thứ ba</h2>
            <p>Chúng tôi không bán, trao đổi hay chuyển giao thông tin cá nhân của bạn cho bên thứ ba, ngoại trừ:</p>
            <ul>
              <li>Đơn vị vận chuyển (chỉ cung cấp thông tin cần thiết để giao hàng).</li>
              <li>Cổng thanh toán được ủy quyền.</li>
              <li>Khi có yêu cầu từ cơ quan pháp luật có thẩm quyền.</li>
            </ul>

            <h2>5. Cookie</h2>
            <p>Website sử dụng cookie để cải thiện trải nghiệm duyệt web. Bạn có thể tắt cookie trong cài đặt trình duyệt, tuy nhiên điều này có thể ảnh hưởng đến một số tính năng của website.</p>

            <h2>6. Quyền của bạn</h2>
            <p>
              Bạn có quyền yêu cầu xem, sửa đổi hoặc xóa thông tin cá nhân mà chúng tôi lưu trữ. Vui lòng liên hệ theo địa chỉ email:{' '}
              {settings.site_email && <a href={`mailto:${settings.site_email}`} style={{ color: 'var(--accent)' }}>{settings.site_email}</a>}
            </p>

            <h2>7. Thay đổi chính sách</h2>
            <p>Chúng tôi có thể cập nhật chính sách bảo mật này theo thời gian. Thay đổi có hiệu lực ngay khi đăng tải trên website. Vui lòng kiểm tra thường xuyên để cập nhật thông tin mới nhất.</p>

            <h2>8. Liên hệ</h2>
            <p>Nếu có thắc mắc về chính sách bảo mật, vui lòng liên hệ:</p>
            <ul>
              {settings.site_email && <li>Email: <a href={`mailto:${settings.site_email}`} style={{ color: 'var(--accent)' }}>{settings.site_email}</a></li>}
              {settings.site_phone && <li>Hotline: <a href={`tel:${settings.site_phone.replace(/\D/g, '')}`} style={{ color: 'var(--accent)' }}>{settings.site_phone}</a></li>}
              {settings.site_address && <li>Địa chỉ: {settings.site_address}</li>}
            </ul>
          </div>
        </div>
      </section>
    </>
  )
}
