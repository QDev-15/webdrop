import { useDocumentMeta } from '../hooks/useDocumentMeta'

export default function PrivacyPolicyPage() {
  useDocumentMeta({ title: 'Chính sách bảo mật — KidZone' })

  return (
    <div className="dc-page-wrap">
      <div className="dc-page-hero">
        <div className="dc-container">
          <h1>Chính sách bảo mật</h1>
          <p>Cập nhật lần cuối: Tháng 7 năm 2024</p>
        </div>
      </div>

      <div className="dc-container" style={{ padding: '48px 0', maxWidth: 800 }}>
        <section style={{ marginBottom: 32 }}>
          <h2>1. Giới thiệu</h2>
          <p>KidZone ("chúng tôi" hoặc "công ty") cam kết bảo vệ quyền riêng tư của bạn. Chính sách bảo mật này giải thích cách chúng tôi thu thập, sử dụng, công bố và bảo vệ thông tin của bạn.</p>
        </section>

        <section style={{ marginBottom: 32 }}>
          <h2>2. Thông tin chúng tôi thu thập</h2>
          <p>Chúng tôi có thể thu thập các loại thông tin sau:</p>
          <ul style={{ marginLeft: 20 }}>
            <li>Thông tin cá nhân (tên, email, số điện thoại, địa chỉ)</li>
            <li>Thông tin thanh toán (nhưng không lưu trữ chi tiết thẻ)</li>
            <li>Thông tin về sản phẩm bạn xem và mua</li>
            <li>Thông tin kỹ thuật (địa chỉ IP, loại trình duyệt)</li>
            <li>Cookies và dữ liệu tương tự</li>
          </ul>
        </section>

        <section style={{ marginBottom: 32 }}>
          <h2>3. Cách chúng tôi sử dụng thông tin</h2>
          <p>Chúng tôi sử dụng thông tin để:</p>
          <ul style={{ marginLeft: 20 }}>
            <li>Xử lý đơn hàng và giao hàng</li>
            <li>Cải thiện dịch vụ</li>
            <li>Gửi thông báo và cập nhật</li>
            <li>Phân tích xu hướng</li>
            <li>Tuân thủ luật pháp</li>
          </ul>
        </section>

        <section style={{ marginBottom: 32 }}>
          <h2>4. Bảo mật dữ liệu</h2>
          <p>Chúng tôi áp dụng các biện pháp bảo mật tiêu chuẩn để bảo vệ thông tin cá nhân của bạn. Tuy nhiên, không có phương pháp truyền tải Internet nào hoàn toàn an toàn.</p>
        </section>

        <section style={{ marginBottom: 32 }}>
          <h2>5. Chia sẻ thông tin</h2>
          <p>Chúng tôi không bán thông tin cá nhân của bạn cho bên thứ ba. Chúng tôi chỉ chia sẻ thông tin khi cần thiết để:</p>
          <ul style={{ marginLeft: 20 }}>
            <li>Xử lý thanh toán</li>
            <li>Giao hàng</li>
            <li>Tuân thủ luật pháp</li>
          </ul>
        </section>

        <section style={{ marginBottom: 32 }}>
          <h2>6. Quyền của bạn</h2>
          <p>Bạn có quyền:</p>
          <ul style={{ marginLeft: 20 }}>
            <li>Truy cập dữ liệu cá nhân của bạn</li>
            <li>Yêu cầu sửa thông tin không chính xác</li>
            <li>Yêu cầu xóa dữ liệu</li>
            <li>Hủy đăng ký khỏi danh sách email</li>
          </ul>
        </section>

        <section style={{ marginBottom: 32 }}>
          <h2>7. Cookies</h2>
          <p>Chúng tôi sử dụng cookies để cải thiện trải nghiệm của bạn. Bạn có thể điều chỉnh cài đặt cookie trong trình duyệt của mình.</p>
        </section>

        <section style={{ marginBottom: 32 }}>
          <h2>8. Liên hệ chúng tôi</h2>
          <p>Nếu bạn có câu hỏi về chính sách này, vui lòng liên hệ:</p>
          <p>Email: privacy@kidzone.vn</p>
          <p>Địa chỉ: [Địa chỉ công ty]</p>
        </section>

        <section>
          <p style={{ fontSize: 13, color: 'var(--text-3)' }}>Chính sách bảo mật này có thể thay đổi mà không có thông báo. Vui lòng kiểm tra thường xuyên để cập nhật.</p>
        </section>
      </div>
    </div>
  )
}
