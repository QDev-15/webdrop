import { Link } from 'react-router-dom'
import { useSite } from '../contexts/SiteContext'

export default function PrivacyPolicyPage() {
  const { settings } = useSite()
  const siteName = settings.site_name || 'Nova Store'

  return (
    <>
      <section className="st-page-hero" aria-label="Tiêu đề trang">
        <div className="st-container">
          <nav className="st-breadcrumb mb-3" aria-label="Điều hướng">
            <Link to="/">Trang chủ</Link>
            <span className="st-breadcrumb-sep">/</span>
            <span>Chính sách bảo mật</span>
          </nav>
          <h1 className="st-page-title">Chính Sách<br />Bảo Mật</h1>
          <p style={{ color: 'rgba(255,255,255,.45)', fontSize: 14, fontWeight: 600, maxWidth: 460, marginTop: 8 }}>
            {siteName} cam kết bảo vệ thông tin cá nhân của khách hàng theo đúng quy định pháp luật hiện hành.
          </p>
        </div>
      </section>

      <section className="st-sec" aria-labelledby="privacy-heading">
        <div className="st-container">
          <div className="st-article" data-reveal>
            <p className="st-article-meta">Cập nhật lần cuối: 17/07/2026</p>

            <p>
              Chính sách bảo mật này áp dụng cho toàn bộ website <strong>{siteName}</strong> và mô tả cách chúng tôi
              thu thập, sử dụng, lưu trữ và bảo vệ thông tin cá nhân của khách hàng khi truy cập, đăng ký tài khoản
              hoặc đặt hàng trên website.
            </p>

            <h2 id="privacy-heading">1. Thông tin thu thập</h2>
            <p>Khi khách hàng sử dụng dịch vụ, chúng tôi có thể thu thập các thông tin sau:</p>
            <ul>
              <li>Họ tên, số điện thoại, email và địa chỉ giao hàng khi đặt hàng</li>
              <li>Thông tin tài khoản đăng nhập (nếu khách hàng đăng ký thành viên)</li>
              <li>Lịch sử đơn hàng, sản phẩm quan tâm và thói quen mua sắm</li>
              <li>Thông tin thiết bị, trình duyệt và địa chỉ IP truy cập website</li>
            </ul>
            <p>Chúng tôi <strong>không</strong> thu thập thông tin thẻ thanh toán — mọi giao dịch được xử lý qua cổng thanh toán trung gian đạt chuẩn bảo mật.</p>

            <h2>2. Mục đích sử dụng</h2>
            <p>Thông tin thu thập được sử dụng nhằm:</p>
            <ul>
              <li>Xử lý đơn hàng, giao hàng và hỗ trợ đổi trả</li>
              <li>Liên hệ xác nhận đơn hàng, thông báo trạng thái vận chuyển</li>
              <li>Gửi thông tin khuyến mãi, bộ sưu tập mới nếu khách hàng đồng ý nhận tin</li>
              <li>Cải thiện chất lượng sản phẩm, dịch vụ và trải nghiệm mua sắm</li>
              <li>Giải quyết khiếu nại, tranh chấp phát sinh (nếu có)</li>
            </ul>

            <h2>3. Chia sẻ với bên thứ ba</h2>
            <p>
              Chúng tôi cam kết <strong>không bán, trao đổi hoặc cho thuê</strong> thông tin cá nhân của khách hàng
              cho bất kỳ bên thứ ba nào vì mục đích thương mại. Thông tin chỉ được chia sẻ trong các trường hợp:
            </p>
            <ul>
              <li>Đơn vị vận chuyển — để giao hàng đến đúng địa chỉ khách hàng cung cấp</li>
              <li>Đối tác thanh toán trung gian — để xử lý giao dịch an toàn</li>
              <li>Cơ quan nhà nước có thẩm quyền — khi có yêu cầu theo quy định pháp luật</li>
            </ul>

            <h2>4. Bảo mật &amp; lưu trữ dữ liệu</h2>
            <p>
              Dữ liệu khách hàng được lưu trữ trên hệ thống máy chủ có áp dụng các biện pháp bảo mật kỹ thuật
              (mã hóa kết nối, phân quyền truy cập) nhằm ngăn chặn truy cập, chỉnh sửa hoặc tiết lộ trái phép.
              Thông tin được lưu trữ trong thời gian cần thiết để phục vụ mục đích đã nêu hoặc theo quy định pháp luật,
              sau đó sẽ được xóa hoặc ẩn danh hóa.
            </p>

            <h2>5. Quyền của khách hàng</h2>
            <p>Khách hàng có quyền:</p>
            <ul>
              <li>Yêu cầu xem, chỉnh sửa hoặc cập nhật thông tin cá nhân đã cung cấp</li>
              <li>Yêu cầu xóa tài khoản và dữ liệu cá nhân liên quan</li>
              <li>Từ chối nhận email/tin nhắn khuyến mãi bất kỳ lúc nào</li>
              <li>Khiếu nại nếu phát hiện thông tin cá nhân bị sử dụng sai mục đích</li>
            </ul>

            <h2>6. Liên hệ về dữ liệu cá nhân</h2>
            <p>
              Nếu có thắc mắc hoặc yêu cầu liên quan đến dữ liệu cá nhân, khách hàng vui lòng liên hệ qua trang{' '}
              <Link to="/lien-he">Liên hệ</Link> hoặc gửi email tới <strong>{settings.site_email || 'email@tenshop.vn'}</strong> —
              {' '}{siteName} sẽ phản hồi trong thời gian sớm nhất.
            </p>
          </div>
        </div>
      </section>
    </>
  )
}
