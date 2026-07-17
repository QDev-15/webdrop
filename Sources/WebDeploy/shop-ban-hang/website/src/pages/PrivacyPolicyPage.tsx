import { Link } from 'react-router-dom'
import { useSite } from '../contexts/SiteContext'

export default function PrivacyPolicyPage() {
  const { settings } = useSite()
  const siteName = settings['site_name'] || 'Shop Hữu Cơ'
  const phone = settings['site_phone'] || '0900 000 000'
  const email = settings['site_email'] || 'lienhe@shop.vn'
  const address = settings['site_address'] || ''

  return (
    <>
      <div className="sb-page-header">
        <div className="sb-container">
          <div className="sb-breadcrumb">
            <Link to="/">Trang chủ</Link>
            <span>›</span>
            <span>Chính sách bảo mật</span>
          </div>
          <h1 className="sb-page-title">Chính Sách Bảo Mật</h1>
          <p className="sb-page-count">Cam kết bảo vệ thông tin cá nhân của khách hàng khi mua sắm tại {siteName}</p>
        </div>
      </div>

      <section className="sb-sec">
        <div className="sb-container-sm">
          <article className="sb-legal" data-reveal>
            <p className="sb-legal-updated">Cập nhật lần cuối: 17/07/2026</p>
            <p className="sb-legal-intro">
              {siteName} tôn trọng và cam kết bảo vệ quyền riêng tư của khách hàng. Chính sách này giải thích rõ chúng tôi thu thập, sử dụng, lưu trữ và bảo vệ thông tin cá nhân của bạn như thế nào khi bạn truy cập website, đặt hàng hoặc liên hệ với chúng tôi qua các kênh hỗ trợ.
            </p>

            <h2>1. Thông tin chúng tôi thu thập</h2>
            <p>Khi bạn mua sắm hoặc liên hệ với {siteName}, chúng tôi có thể thu thập các thông tin sau:</p>
            <ul>
              <li><strong>Thông tin định danh:</strong> họ tên, số điện thoại, địa chỉ email, địa chỉ giao hàng.</li>
              <li><strong>Thông tin đơn hàng:</strong> sản phẩm đã đặt, giá trị đơn hàng, phương thức thanh toán, lịch sử mua hàng.</li>
              <li><strong>Thông tin thanh toán:</strong> chi tiết chuyển khoản khi đặt hàng — {siteName} không lưu trữ số thẻ ngân hàng/thẻ tín dụng của khách hàng.</li>
              <li><strong>Dữ liệu truy cập:</strong> địa chỉ IP, loại trình duyệt, thiết bị truy cập nhằm cải thiện trải nghiệm sử dụng website.</li>
            </ul>

            <h2>2. Mục đích sử dụng thông tin</h2>
            <p>Thông tin cá nhân được thu thập nhằm phục vụ các mục đích sau:</p>
            <ul>
              <li>Xử lý và giao đơn hàng, xác nhận thanh toán, hỗ trợ đổi trả/bảo hành.</li>
              <li>Liên hệ chăm sóc khách hàng, giải đáp thắc mắc và xử lý khiếu nại.</li>
              <li>Gửi thông báo về chương trình khuyến mãi, sản phẩm mới (chỉ khi khách hàng đồng ý nhận thông tin).</li>
              <li>Cải thiện chất lượng sản phẩm, dịch vụ và trải nghiệm mua sắm trên website.</li>
              <li>Tuân thủ nghĩa vụ pháp lý theo quy định pháp luật hiện hành.</li>
            </ul>

            <h2>3. Chia sẻ thông tin với bên thứ ba</h2>
            <p>
              {siteName} cam kết <strong>không bán, trao đổi hoặc cho thuê</strong> thông tin cá nhân của khách hàng cho bất kỳ tổ chức nào vì mục đích thương mại. Thông tin chỉ được chia sẻ với bên thứ ba trong các trường hợp sau:
            </p>
            <ul>
              <li>Đơn vị vận chuyển — để giao hàng đến đúng địa chỉ khách hàng cung cấp.</li>
              <li>Đơn vị trung gian thanh toán/ngân hàng — để xác nhận và xử lý giao dịch.</li>
              <li>Cơ quan nhà nước có thẩm quyền — khi có yêu cầu hợp pháp theo quy định pháp luật.</li>
            </ul>

            <h2>4. Bảo mật và lưu trữ dữ liệu</h2>
            <p>
              Chúng tôi áp dụng các biện pháp kỹ thuật và quản lý phù hợp để bảo vệ thông tin cá nhân khỏi truy cập trái phép, mất mát hoặc rò rỉ dữ liệu, bao gồm mã hóa dữ liệu truyền tải (HTTPS), giới hạn quyền truy cập nội bộ và sao lưu định kỳ. Thông tin khách hàng được lưu trữ trong thời gian cần thiết để phục vụ mục đích thu thập hoặc theo yêu cầu của pháp luật, sau đó sẽ được xóa hoặc ẩn danh hóa.
            </p>

            <h2>5. Quyền của khách hàng</h2>
            <p>Khách hàng có quyền:</p>
            <ul>
              <li>Yêu cầu truy cập, chỉnh sửa hoặc cập nhật thông tin cá nhân đã cung cấp.</li>
              <li>Yêu cầu xóa thông tin cá nhân khỏi hệ thống của {siteName} (trừ trường hợp pháp luật yêu cầu lưu trữ).</li>
              <li>Từ chối nhận email/tin nhắn quảng cáo bất kỳ lúc nào bằng cách liên hệ trực tiếp với chúng tôi.</li>
              <li>Khiếu nại nếu phát hiện thông tin cá nhân bị sử dụng sai mục đích.</li>
            </ul>

            <h2>6. Liên hệ về dữ liệu cá nhân</h2>
            <p>Nếu bạn có bất kỳ câu hỏi nào về chính sách bảo mật này hoặc muốn thực hiện các quyền nêu trên, vui lòng liên hệ với chúng tôi:</p>
            <div className="sb-legal-contact-box">
              <p><strong>{siteName}</strong></p>
              <p>Email: <a href={`mailto:${email}`}>{email}</a></p>
              <p>Điện thoại/Zalo: <a href={`tel:${phone}`}>{phone}</a></p>
              {address && <p>Địa chỉ: {address}</p>}
            </div>
          </article>
        </div>
      </section>
    </>
  )
}
