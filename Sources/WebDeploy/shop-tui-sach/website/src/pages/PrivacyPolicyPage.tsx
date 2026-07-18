import { Link } from 'react-router-dom'
import { useSite } from '../contexts/SiteContext'

export default function PrivacyPolicyPage() {
  const { settings } = useSite()
  const siteName = settings.site_name || 'Maison Cuir'

  return (
    <>
      <section className="ts-page-header">
        <div className="ts-container">
          <h1>Chính sách bảo mật</h1>
          <div className="ts-breadcrumb">
            <Link to="/">Trang chủ</Link>
            <span>/</span>
            <span className="current">Chính sách bảo mật</span>
          </div>
        </div>
      </section>

      <section className="sec-pad">
        <div className="ts-container">
          <div className="ts-legal-content" data-reveal>
            <p className="ts-legal-updated">Cập nhật lần cuối: 18/07/2026</p>

            <p>{siteName} cam kết tôn trọng và bảo vệ quyền riêng tư của khách hàng. Chính sách bảo mật này giải thích cách chúng tôi thu thập, sử dụng, lưu trữ và bảo vệ thông tin cá nhân khi bạn truy cập website, đặt hàng hoặc liên hệ với chúng tôi qua các kênh của {siteName}.</p>

            <h2>1. Thông tin chúng tôi thu thập</h2>
            <p>Chúng tôi có thể thu thập các loại thông tin sau khi bạn sử dụng website hoặc thực hiện giao dịch:</p>
            <ul>
              <li>Họ tên, số điện thoại, địa chỉ email, địa chỉ giao hàng khi bạn đặt mua sản phẩm hoặc gửi yêu cầu tư vấn.</li>
              <li>Thông tin thanh toán cần thiết để xử lý đơn hàng (không lưu trữ số thẻ ngân hàng đầy đủ trên hệ thống của chúng tôi).</li>
              <li>Lịch sử đơn hàng, sản phẩm quan tâm và tương tác với website nhằm cải thiện trải nghiệm mua sắm.</li>
              <li>Thông tin kỹ thuật cơ bản như địa chỉ IP, loại trình duyệt, thời gian truy cập thông qua cookie và công cụ phân tích website.</li>
            </ul>

            <h2>2. Mục đích sử dụng thông tin</h2>
            <p>Thông tin thu thập được sử dụng nhằm phục vụ các mục đích sau:</p>
            <ul>
              <li>Xử lý đơn hàng, giao hàng, xuất hóa đơn và chăm sóc khách hàng sau bán hàng.</li>
              <li>Tư vấn sản phẩm, phản hồi yêu cầu và giải quyết khiếu nại, bảo hành khi cần thiết.</li>
              <li>Gửi thông tin về bộ sưu tập mới, chương trình ưu đãi nếu khách hàng đồng ý nhận thông báo.</li>
              <li>Phân tích, cải thiện chất lượng dịch vụ và trải nghiệm sử dụng website.</li>
            </ul>

            <h2>3. Chia sẻ thông tin với bên thứ ba</h2>
            <p>{siteName} <strong>không bán, trao đổi hoặc cho thuê</strong> thông tin cá nhân của khách hàng cho bên thứ ba vì mục đích thương mại. Thông tin chỉ được chia sẻ trong các trường hợp sau:</p>
            <ul>
              <li>Đơn vị vận chuyển, đối tác giao nhận — chỉ chia sẻ thông tin cần thiết để hoàn tất việc giao hàng.</li>
              <li>Đơn vị cung cấp cổng thanh toán trong quá trình xử lý giao dịch trực tuyến.</li>
              <li>Cơ quan nhà nước có thẩm quyền khi có yêu cầu hợp pháp theo quy định của pháp luật Việt Nam.</li>
            </ul>

            <h2>4. Bảo mật &amp; lưu trữ dữ liệu</h2>
            <p>Chúng tôi áp dụng các biện pháp kỹ thuật và quản lý phù hợp để bảo vệ thông tin cá nhân khỏi truy cập, sử dụng hoặc tiết lộ trái phép, bao gồm mã hóa dữ liệu truyền tải, giới hạn quyền truy cập nội bộ và giám sát hệ thống định kỳ. Dữ liệu được lưu trữ trong thời gian cần thiết để phục vụ mục đích thu thập hoặc theo yêu cầu của pháp luật, sau đó sẽ được xóa hoặc ẩn danh hóa.</p>

            <h2>5. Quyền của khách hàng</h2>
            <p>Khách hàng có quyền:</p>
            <ul>
              <li>Yêu cầu truy cập, chỉnh sửa hoặc cập nhật thông tin cá nhân đã cung cấp.</li>
              <li>Yêu cầu xóa thông tin cá nhân khỏi hệ thống, trừ trường hợp pháp luật yêu cầu lưu trữ.</li>
              <li>Từ chối nhận email/tin nhắn quảng cáo bất kỳ lúc nào thông qua liên kết hủy đăng ký hoặc liên hệ trực tiếp.</li>
              <li>Khiếu nại về việc sử dụng thông tin cá nhân nếu phát hiện dấu hiệu vi phạm.</li>
            </ul>

            <h2>6. Liên hệ về dữ liệu cá nhân</h2>
            <p>Nếu có bất kỳ câu hỏi hoặc yêu cầu nào liên quan đến chính sách bảo mật hoặc dữ liệu cá nhân, vui lòng liên hệ với chúng tôi qua:</p>
            <ul>
              <li>Hotline: <a href={`tel:${(settings.site_phone || '').replace(/\s/g, '')}`} className="ts-inline-link">{settings.site_phone}</a></li>
              <li>Email: <a href={`mailto:${settings.site_email}`} className="ts-inline-link">{settings.site_email}</a></li>
              <li>Địa chỉ: {settings.site_address} — xem thêm tại trang <Link to="/lien-he" className="ts-inline-link">Liên hệ</Link>.</li>
            </ul>
          </div>
        </div>
      </section>
    </>
  )
}
