import { useSite } from '../contexts/SiteContext'
import { useDocumentMeta } from '../hooks/useDocumentMeta'

export default function PrivacyPolicyPage() {
  const { settings } = useSite()
  const siteName = settings.site_name || 'AMI Fashion'
  const email = settings.site_email || 'hello@amifashion.vn'
  const phone = settings.site_phone || '0909 345 678'
  const address = settings.site_address || '12 Lê Văn Sỹ, Quận 3, TP.HCM'

  useDocumentMeta({
    title: `Chính sách bảo mật — ${siteName}`,
    description: `Chính sách bảo mật của ${siteName} — cách chúng tôi thu thập, sử dụng và bảo vệ thông tin cá nhân của bạn.`,
  })

  return (
    <main className="am-page-body">
      <div className="am-container">
        <div className="am-legal-wrap">
          <h1>Chính sách bảo mật</h1>
          <span className="am-last-updated">Cập nhật lần cuối: Tháng 1, 2025</span>

          <p>{siteName} cam kết bảo vệ quyền riêng tư và thông tin cá nhân của khách hàng. Chính sách bảo mật này giải thích cách chúng tôi thu thập, sử dụng và bảo vệ thông tin của bạn khi bạn sử dụng website và dịch vụ của chúng tôi.</p>

          <h2>1. Thông tin chúng tôi thu thập</h2>
          <p>Chúng tôi có thể thu thập các loại thông tin sau:</p>
          <ul>
            <li><strong>Thông tin cá nhân:</strong> Họ tên, địa chỉ email, số điện thoại, địa chỉ giao hàng khi bạn đặt hàng hoặc liên hệ với chúng tôi.</li>
            <li><strong>Thông tin giao dịch:</strong> Chi tiết đơn hàng, lịch sử mua hàng.</li>
            <li><strong>Thông tin kỹ thuật:</strong> Địa chỉ IP, loại trình duyệt, thiết bị sử dụng (thu thập tự động khi bạn truy cập website).</li>
          </ul>

          <h2>2. Mục đích sử dụng thông tin</h2>
          <p>Thông tin thu thập được sử dụng để:</p>
          <ul>
            <li>Xử lý và giao các đơn hàng của bạn.</li>
            <li>Liên hệ xác nhận đơn hàng và hỗ trợ sau bán hàng.</li>
            <li>Tư vấn sản phẩm và giải đáp thắc mắc.</li>
            <li>Cải thiện chất lượng sản phẩm và dịch vụ.</li>
            <li>Gửi thông tin về khuyến mãi (chỉ khi bạn đồng ý nhận).</li>
          </ul>

          <h2>3. Chia sẻ thông tin</h2>
          <p>{siteName} <strong>không bán, cho thuê hay chia sẻ</strong> thông tin cá nhân của bạn với bên thứ ba, ngoại trừ:</p>
          <ul>
            <li>Đơn vị vận chuyển để thực hiện giao hàng (chỉ cung cấp thông tin cần thiết).</li>
            <li>Khi có yêu cầu pháp lý từ cơ quan nhà nước có thẩm quyền.</li>
          </ul>

          <h2>4. Bảo mật thông tin</h2>
          <p>Chúng tôi áp dụng các biện pháp bảo mật phù hợp để bảo vệ thông tin của bạn khỏi truy cập trái phép, thay đổi, tiết lộ hoặc phá hủy. Tuy nhiên, không có phương thức truyền dữ liệu qua Internet nào hoàn toàn an toàn tuyệt đối.</p>

          <h2>5. Cookie</h2>
          <p>Website có thể sử dụng cookie để cải thiện trải nghiệm người dùng. Cookie là các tệp nhỏ được lưu trên thiết bị của bạn. Bạn có thể tắt cookie trong cài đặt trình duyệt, tuy nhiên điều này có thể ảnh hưởng đến một số tính năng của website.</p>

          <h2>6. Quyền của bạn</h2>
          <p>Bạn có quyền:</p>
          <ul>
            <li>Yêu cầu xem, chỉnh sửa hoặc xóa thông tin cá nhân của mình.</li>
            <li>Từ chối nhận email marketing bất kỳ lúc nào.</li>
            <li>Liên hệ chúng tôi nếu có thắc mắc về cách xử lý dữ liệu của bạn.</li>
          </ul>

          <h2>7. Thay đổi chính sách</h2>
          <p>Chúng tôi có thể cập nhật chính sách bảo mật này theo thời gian. Mọi thay đổi sẽ được đăng tải trên trang này với ngày cập nhật mới nhất. Việc tiếp tục sử dụng dịch vụ sau khi thay đổi có hiệu lực nghĩa là bạn chấp nhận chính sách mới.</p>

          <h2>8. Liên hệ</h2>
          <p>Nếu bạn có câu hỏi về chính sách bảo mật này, vui lòng liên hệ với chúng tôi qua:</p>
          <ul>
            <li>Email: {email}</li>
            <li>Điện thoại: {phone}</li>
            <li>Địa chỉ: {address}</li>
          </ul>
        </div>
      </div>
    </main>
  )
}
