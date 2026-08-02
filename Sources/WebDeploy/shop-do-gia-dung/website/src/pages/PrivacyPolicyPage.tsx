import { useSite } from '../contexts/SiteContext'
import { useDocumentMeta } from '../hooks/useDocumentMeta'

export default function PrivacyPolicyPage() {
  const { settings } = useSite()

  useDocumentMeta({
    title: `Chính sách bảo mật – ${String(settings.site_name || 'Shop Đồ Gia Dụng')}`,
    description: 'Chính sách bảo mật của chúng tôi về việc thu thập, sử dụng và bảo vệ thông tin cá nhân của khách hàng.',
  })

  const siteName = String(settings.site_name || 'Shop Đồ Gia Dụng')
  const siteEmail = String(settings.site_email || '')

  return (
    <>
      <div className="dg-page-hero">
        <div className="dg-container">
          <p className="dg-page-hero__label">Pháp lý</p>
          <h1 className="dg-page-hero__title">Chính sách bảo mật</h1>
          <p className="dg-page-hero__sub">Cập nhật lần cuối: tháng 1/2025</p>
        </div>
      </div>

      <section className="dg-section">
        <div className="dg-container">
          <div className="dg-legal">
            <p className="dg-legal__date">Ngày cập nhật: 01/01/2025</p>

            <p>{siteName} cam kết bảo vệ quyền riêng tư và thông tin cá nhân của khách hàng. Chính sách này mô tả cách chúng tôi thu thập, sử dụng và bảo vệ thông tin của bạn.</p>

            <h2>1. Thông tin chúng tôi thu thập</h2>
            <p>Chúng tôi có thể thu thập các thông tin sau khi bạn sử dụng dịch vụ của chúng tôi:</p>
            <ul>
              <li>Thông tin cá nhân: họ tên, địa chỉ email, số điện thoại, địa chỉ giao hàng</li>
              <li>Thông tin giao dịch: lịch sử mua hàng, phương thức thanh toán</li>
              <li>Thông tin kỹ thuật: địa chỉ IP, loại trình duyệt, thời gian truy cập</li>
              <li>Thông tin tương tác: sản phẩm bạn xem, tìm kiếm và yêu thích</li>
            </ul>

            <h2>2. Mục đích sử dụng thông tin</h2>
            <p>Thông tin thu thập được sử dụng để:</p>
            <ul>
              <li>Xử lý đơn hàng và giao hàng đến địa chỉ của bạn</li>
              <li>Liên hệ xác nhận đơn hàng, cập nhật tình trạng giao hàng</li>
              <li>Hỗ trợ khách hàng và giải quyết khiếu nại</li>
              <li>Cải thiện chất lượng dịch vụ và trải nghiệm người dùng</li>
              <li>Gửi thông tin khuyến mại (nếu bạn đồng ý nhận)</li>
            </ul>

            <h2>3. Bảo mật thông tin</h2>
            <p>Chúng tôi áp dụng các biện pháp bảo mật kỹ thuật và tổ chức phù hợp để bảo vệ thông tin cá nhân của bạn khỏi truy cập, sử dụng, tiết lộ, thay đổi hoặc hủy hoại trái phép.</p>
            <ul>
              <li>Mã hóa dữ liệu truyền tải bằng giao thức HTTPS/SSL</li>
              <li>Kiểm soát quyền truy cập nội bộ theo nguyên tắc tối thiểu đặc quyền</li>
              <li>Thường xuyên đánh giá và cập nhật biện pháp bảo mật</li>
            </ul>

            <h2>4. Chia sẻ thông tin với bên thứ ba</h2>
            <p>Chúng tôi không bán, trao đổi hoặc chuyển nhượng thông tin cá nhân của bạn cho bên thứ ba mà không có sự đồng ý của bạn, ngoại trừ các trường hợp:</p>
            <ul>
              <li>Đơn vị vận chuyển để thực hiện giao hàng</li>
              <li>Cổng thanh toán để xử lý giao dịch tài chính</li>
              <li>Yêu cầu của cơ quan pháp lý theo quy định pháp luật</li>
            </ul>

            <h2>5. Cookie và theo dõi</h2>
            <p>Website sử dụng cookie để cải thiện trải nghiệm duyệt web của bạn. Bạn có thể kiểm soát cookie thông qua cài đặt trình duyệt. Tuy nhiên, một số tính năng của website có thể không hoạt động đúng nếu cookie bị vô hiệu hóa.</p>

            <h2>6. Quyền của bạn</h2>
            <p>Bạn có quyền:</p>
            <ul>
              <li>Yêu cầu xem thông tin cá nhân chúng tôi đang lưu trữ về bạn</li>
              <li>Yêu cầu chỉnh sửa thông tin không chính xác</li>
              <li>Yêu cầu xóa thông tin cá nhân của bạn</li>
              <li>Phản đối hoặc hạn chế việc xử lý thông tin của bạn</li>
              <li>Rút lại sự đồng ý nhận email marketing bất cứ lúc nào</li>
            </ul>

            <h2>7. Liên hệ</h2>
            <p>
              Nếu bạn có câu hỏi về chính sách bảo mật, vui lòng liên hệ:{' '}
              {siteEmail && <a href={`mailto:${siteEmail}`}>{siteEmail}</a>}
            </p>

            <h2>8. Thay đổi chính sách</h2>
            <p>Chúng tôi có thể cập nhật chính sách này định kỳ. Mọi thay đổi sẽ được thông báo trên trang này với ngày cập nhật mới. Việc tiếp tục sử dụng dịch vụ sau khi thay đổi đồng nghĩa với việc bạn chấp nhận chính sách mới.</p>
          </div>
        </div>
      </section>
    </>
  )
}
