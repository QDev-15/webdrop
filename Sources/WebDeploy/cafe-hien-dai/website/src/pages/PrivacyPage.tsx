import { Link } from 'react-router-dom'
import { useSite } from '../contexts/SiteContext'
import { useDocumentMeta } from '../hooks/useDocumentMeta'

export default function PrivacyPage() {
  const { settings } = useSite()
  const siteName = settings.site_name || 'MONO Coffee'
  useDocumentMeta({
    title: `Chính sách bảo mật — ${siteName}`,
    description: `Chính sách bảo mật thông tin khách hàng của ${siteName} — cách chúng tôi thu thập, sử dụng và bảo vệ dữ liệu cá nhân.`,
  })

  return (
    <>
      <header className="chd-page-hero">
        <div className="chd-container">
          <div className="chd-breadcrumb"><Link to="/">Trang chủ</Link><span>/</span><span>Chính sách bảo mật</span></div>
          <h1 className="chd-page-title">Chính sách bảo mật</h1>
        </div>
      </header>

      <section className="chd-sec">
        <div className="chd-container">
          <div className="chd-article">
            <p className="chd-article-meta">Cập nhật lần cuối: 01/01/2026</p>

            <p>{siteName} tôn trọng quyền riêng tư của khách hàng. Chính sách này giải thích cách chúng tôi thu thập, sử dụng và bảo vệ thông tin cá nhân khi bạn sử dụng website, đặt chỗ hoặc liên hệ với quán.</p>

            <h2>1. Thông tin chúng tôi thu thập</h2>
            <p>Khi bạn đặt chỗ, đặt tiệc công ty hoặc gửi form liên hệ, chúng tôi có thể thu thập các thông tin sau:</p>
            <ul>
              <li>Họ tên, số điện thoại, email</li>
              <li>Nội dung yêu cầu (loại đặt chỗ, số người, ngày giờ mong muốn)</li>
              <li>Địa chỉ giao hàng (đối với đơn giao cà phê văn phòng)</li>
            </ul>

            <h2>2. Mục đích sử dụng thông tin</h2>
            <p>Thông tin thu thập được sử dụng nhằm:</p>
            <ul>
              <li>Xác nhận và xử lý yêu cầu đặt chỗ, đặt tiệc, đặt hàng của bạn</li>
              <li>Liên hệ lại khi cần xác minh thông tin đặt chỗ</li>
              <li>Gửi thông báo về chương trình ưu đãi nếu bạn đồng ý nhận</li>
              <li>Cải thiện chất lượng dịch vụ và trải nghiệm khách hàng</li>
            </ul>

            <h2>3. Bảo mật thông tin</h2>
            <p>Chúng tôi áp dụng các biện pháp kỹ thuật và quản lý phù hợp để bảo vệ thông tin cá nhân khỏi truy cập trái phép, mất mát hoặc sử dụng sai mục đích. Dữ liệu chỉ được lưu trữ trong hệ thống nội bộ và không chia sẻ cho bên thứ ba vì mục đích thương mại.</p>

            <h2>4. Chia sẻ thông tin với bên thứ ba</h2>
            <p>{siteName} không bán, cho thuê hoặc trao đổi thông tin cá nhân của khách hàng cho bất kỳ bên thứ ba nào, ngoại trừ trường hợp pháp luật yêu cầu.</p>

            <h2>5. Quyền của khách hàng</h2>
            <p>Bạn có quyền yêu cầu xem, chỉnh sửa hoặc xóa thông tin cá nhân đã cung cấp cho chúng tôi bất kỳ lúc nào bằng cách liên hệ qua trang <Link to="/lien-he">Liên hệ</Link>.</p>

            <h2>6. Liên hệ</h2>
            <p>Nếu có câu hỏi về chính sách bảo mật này, vui lòng liên hệ chúng tôi qua email <a href={`mailto:${settings.site_email}`}>{settings.site_email}</a> hoặc số điện thoại <a href={`tel:${(settings.site_phone || '').replace(/\s/g, '')}`}>{settings.site_phone}</a>.</p>
          </div>
        </div>
      </section>
    </>
  )
}
