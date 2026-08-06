import { useDocumentMeta } from '../hooks/useDocumentMeta'

export default function PrivacyPolicyPage() {
  useDocumentMeta({ title: 'Chính sách bảo mật', description: 'Chính sách bảo mật thông tin của Shop Thể Thao' })

  return (
    <div className="tt-page-wrap">
      <div className="tt-container" style={{ padding: '60px 0', maxWidth: 800 }}>
        <h1 style={{ marginBottom: 24 }}>Chính sách bảo mật</h1>
        <div style={{ fontSize: 14, color: 'var(--text-2)', lineHeight: 1.8 }}>
          <h2 style={{ fontSize: 18, fontWeight: 600, marginTop: 32, marginBottom: 12 }}>1. Thông tin chúng tôi thu thập</h2>
          <p>Chúng tôi thu thập thông tin cá nhân của bạn khi bạn đặt hàng, gồm có:</p>
          <ul style={{ marginLeft: 20, marginTop: 8, marginBottom: 16 }}>
            <li>Họ tên, số điện thoại, email</li>
            <li>Địa chỉ giao hàng</li>
            <li>Thông tin thanh toán (khi cần)</li>
            <li>Lịch sử mua hàng</li>
          </ul>

          <h2 style={{ fontSize: 18, fontWeight: 600, marginTop: 32, marginBottom: 12 }}>2. Cách chúng tôi sử dụng thông tin</h2>
          <p>Thông tin của bạn được sử dụng để:</p>
          <ul style={{ marginLeft: 20, marginTop: 8, marginBottom: 16 }}>
            <li>Xử lý và vận chuyển đơn hàng</li>
            <li>Liên lạc với bạn về đơn hàng</li>
            <li>Gửi email khuyến mãi (nếu bạn đăng ký)</li>
            <li>Cải thiện dịch vụ của chúng tôi</li>
          </ul>

          <h2 style={{ fontSize: 18, fontWeight: 600, marginTop: 32, marginBottom: 12 }}>3. Bảo vệ dữ liệu</h2>
          <p>Chúng tôi sử dụng các biện pháp bảo mật hợp lý để bảo vệ thông tin cá nhân của bạn từ truy cập trái phép, thay đổi, tiết lộ hoặc hủy hỏng.</p>

          <h2 style={{ fontSize: 18, fontWeight: 600, marginTop: 32, marginBottom: 12 }}>4. Chia sẻ thông tin</h2>
          <p>Chúng tôi KHÔNG bán hoặc chia sẻ thông tin cá nhân của bạn cho bên thứ ba, ngoại trừ những nhà cung cấp dịch vụ vận chuyển và thanh toán cần thiết để hoàn thành đơn hàng của bạn.</p>

          <h2 style={{ fontSize: 18, fontWeight: 600, marginTop: 32, marginBottom: 12 }}>5. Liên hệ</h2>
          <p>Nếu bạn có câu hỏi về chính sách bảo mật này, vui lòng liên hệ với chúng tôi qua email hoặc số điện thoại trên trang liên hệ.</p>
        </div>
      </div>
    </div>
  )
}
