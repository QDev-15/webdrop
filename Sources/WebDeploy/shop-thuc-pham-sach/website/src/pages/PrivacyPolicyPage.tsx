import { Link } from 'react-router-dom'
import { useSite } from '../contexts/SiteContext'
import { useDocumentMeta } from '../hooks/useDocumentMeta'

export default function PrivacyPolicyPage() {
  useDocumentMeta({
    title: 'Chính Sách Bảo Mật — Tươi Mỗi Ngày',
    description: 'Cam kết bảo vệ thông tin cá nhân của khách hàng khi mua sắm thực phẩm sạch tại Tươi Mỗi Ngày.',
  })
  const { settings } = useSite()
  const siteName = settings.site_name || 'Tươi Mỗi Ngày'

  return (
    <>
      <div className="tp-container tp-contact-wrap" style={{ paddingBottom: 40, paddingTop: 128 }}>
        <div className="tp-breadcrumb" style={{ marginBottom: 24 }}>
          <Link to="/">Trang chủ</Link>
          <i className="bi bi-chevron-right" style={{ fontSize: 10 }} />
          <span>Chính sách bảo mật</span>
        </div>
        <h1 style={{ fontSize: 'clamp(28px,3.6vw,42px)', fontWeight: 700, marginBottom: 12 }}>
          Chính Sách <em style={{ color: 'var(--accent)', fontStyle: 'normal' }}>Bảo Mật</em>
        </h1>
        <p style={{ color: 'var(--text-2)', maxWidth: 560 }}>
          Cam kết bảo vệ thông tin cá nhân của khách hàng khi mua sắm thực phẩm sạch tại {siteName}.
        </p>
      </div>

      <main>
        <section className="tp-sec" style={{ paddingTop: 24 }}>
          <div className="tp-container-sm">
            <article className="tp-legal" data-reveal>
              <p className="tp-legal-updated">Cập nhật lần cuối: 17/07/2026</p>
              <p className="tp-legal-intro">
                {siteName} tôn trọng và cam kết bảo vệ quyền riêng tư của khách hàng. Chính sách này giải thích rõ
                chúng tôi thu thập, sử dụng, lưu trữ và bảo vệ thông tin cá nhân của bạn như thế nào khi bạn truy
                cập website, đặt mua thực phẩm sạch hoặc liên hệ với chúng tôi qua các kênh hỗ trợ.
              </p>

              <h2>1. Thông tin chúng tôi thu thập</h2>
              <p>Khi bạn mua sắm hoặc liên hệ với {siteName}, chúng tôi có thể thu thập các thông tin sau:</p>
              <ul>
                <li><strong>Thông tin định danh:</strong> họ tên, số điện thoại, địa chỉ email, địa chỉ giao hàng.</li>
                <li><strong>Thông tin đơn hàng:</strong> sản phẩm đã đặt (rau củ, trái cây, thịt cá, gạo &amp; ngũ cốc), giá trị đơn hàng, phương thức thanh toán, lịch sử mua hàng.</li>
                <li><strong>Thông tin thanh toán:</strong> chi tiết chuyển khoản khi đặt hàng — {siteName} không lưu trữ số thẻ ngân hàng/thẻ tín dụng của khách hàng.</li>
                <li><strong>Dữ liệu truy cập:</strong> địa chỉ IP, loại trình duyệt, thiết bị truy cập nhằm cải thiện trải nghiệm sử dụng website.</li>
              </ul>

              <h2>2. Mục đích sử dụng thông tin</h2>
              <p>Thông tin cá nhân được thu thập nhằm phục vụ các mục đích sau:</p>
              <ul>
                <li>Xử lý và giao đơn hàng đúng khung giờ, xác nhận thanh toán, hỗ trợ đổi trả khi sản phẩm không đạt chất lượng cam kết.</li>
                <li>Liên hệ chăm sóc khách hàng, giải đáp thắc mắc về nguồn gốc sản phẩm và xử lý khiếu nại.</li>
                <li>Gửi thông báo về chương trình khuyến mãi, sản phẩm theo mùa mới về (chỉ khi khách hàng đồng ý nhận thông tin).</li>
                <li>Cải thiện chất lượng sản phẩm, dịch vụ giao hàng lạnh và trải nghiệm mua sắm trên website.</li>
                <li>Tuân thủ nghĩa vụ pháp lý theo quy định pháp luật hiện hành.</li>
              </ul>

              <h2>3. Chia sẻ thông tin với bên thứ ba</h2>
              <p>
                {siteName} cam kết <strong>không bán, trao đổi hoặc cho thuê</strong> thông tin cá nhân của khách hàng
                cho bất kỳ tổ chức nào vì mục đích thương mại. Thông tin chỉ được chia sẻ với bên thứ ba trong các
                trường hợp sau:
              </p>
              <ul>
                <li>Đơn vị vận chuyển giao hàng lạnh — để giao hàng đến đúng địa chỉ khách hàng cung cấp, đúng khung giờ đã hẹn.</li>
                <li>Đơn vị trung gian thanh toán/ngân hàng — để xác nhận và xử lý giao dịch.</li>
                <li>Nông trại/đơn vị cung ứng đối tác — chỉ trong phạm vi cần thiết để xác minh nguồn gốc sản phẩm khi khách hàng yêu cầu.</li>
                <li>Cơ quan nhà nước có thẩm quyền — khi có yêu cầu hợp pháp theo quy định pháp luật.</li>
              </ul>

              <h2>4. Bảo mật và lưu trữ dữ liệu</h2>
              <p>
                Chúng tôi áp dụng các biện pháp kỹ thuật và quản lý phù hợp để bảo vệ thông tin cá nhân khỏi truy cập
                trái phép, mất mát hoặc rò rỉ dữ liệu, bao gồm mã hóa dữ liệu truyền tải (HTTPS), giới hạn quyền truy
                cập nội bộ và sao lưu định kỳ. Thông tin khách hàng được lưu trữ trong thời gian cần thiết để phục vụ
                mục đích thu thập hoặc theo yêu cầu của pháp luật, sau đó sẽ được xóa hoặc ẩn danh hóa.
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
              <div className="tp-legal-contact-box">
                <p><strong>{siteName}</strong></p>
                {settings.site_email && <p>Email: <a href={`mailto:${settings.site_email}`}>{settings.site_email}</a></p>}
                {settings.site_phone && <p>Điện thoại/Zalo: <a href={`tel:${settings.site_phone}`}>{settings.site_phone}</a></p>}
                {settings.site_address && <p>Địa chỉ: {settings.site_address}</p>}
              </div>
            </article>
          </div>
        </section>
      </main>
    </>
  )
}
