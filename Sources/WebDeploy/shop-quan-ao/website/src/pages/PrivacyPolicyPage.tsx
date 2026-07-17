import { Link } from 'react-router-dom'
import { useSite } from '../contexts/SiteContext'

export default function PrivacyPolicyPage() {
  const { settings } = useSite()
  const siteName = settings.site_name || 'Lys Chic'

  return (
    <>
      <div className="qa-page-header" style={{ paddingBottom: 32 }}>
        <div className="qa-container">
          <nav className="qa-breadcrumb" aria-label="Breadcrumb">
            <Link to="/">Trang chủ</Link><span><i className="bi bi-chevron-right" style={{ fontSize: 10 }} /></span><span>Chính sách bảo mật</span>
          </nav>
          <h1 className="qa-page-title">Chính sách bảo mật</h1>
          <p className="qa-page-count" style={{ fontSize: 16 }}>Cam kết của {siteName} về việc bảo vệ thông tin cá nhân khách hàng</p>
        </div>
      </div>

      <main>
        <section style={{ background: 'var(--surface)', padding: 'clamp(48px,7vw,88px) 0' }}>
          <div className="qa-container-sm">
            <div data-reveal style={{ fontSize: 15.5, color: 'var(--text-2)', lineHeight: 1.8 }}>
              <p style={{ marginBottom: 28 }}>
                {siteName} tôn trọng và cam kết bảo vệ quyền riêng tư của khách hàng khi truy cập website và thực hiện giao dịch mua sắm.
                Chính sách này giải thích chúng tôi thu thập, sử dụng, chia sẻ và bảo vệ thông tin cá nhân của bạn như thế nào.
              </p>

              <h2 style={{ fontFamily: 'var(--heading)', fontStyle: 'italic', fontWeight: 400, fontSize: 24, color: 'var(--text)', marginBottom: 12, marginTop: 32 }}>1. Thông tin thu thập</h2>
              <p style={{ marginBottom: 16 }}>Khi bạn đặt hàng, đăng ký tài khoản hoặc liên hệ với chúng tôi, chúng tôi có thể thu thập:</p>
              <ul style={{ marginBottom: 20, paddingLeft: 22 }}>
                <li>Họ tên, số điện thoại, email, địa chỉ giao hàng</li>
                <li>Thông tin đơn hàng: sản phẩm, size, màu sắc, lịch sử mua hàng</li>
                <li>Thông tin thanh toán (chỉ số tài khoản/ngân hàng dùng để đối soát chuyển khoản qua SePay, chúng tôi không lưu trữ mật khẩu hay mã OTP ngân hàng)</li>
                <li>Dữ liệu truy cập website: loại thiết bị, trình duyệt, hành vi duyệt web (phục vụ cải thiện trải nghiệm)</li>
              </ul>

              <h2 style={{ fontFamily: 'var(--heading)', fontStyle: 'italic', fontWeight: 400, fontSize: 24, color: 'var(--text)', marginBottom: 12, marginTop: 32 }}>2. Mục đích sử dụng</h2>
              <p style={{ marginBottom: 16 }}>Thông tin thu thập được sử dụng nhằm:</p>
              <ul style={{ marginBottom: 20, paddingLeft: 22 }}>
                <li>Xử lý đơn hàng, giao hàng và chăm sóc khách hàng sau bán</li>
                <li>Xác nhận thanh toán và đối soát giao dịch chuyển khoản</li>
                <li>Gửi thông báo về đơn hàng, khuyến mãi, chương trình ưu đãi (khi khách hàng đồng ý nhận thông tin)</li>
                <li>Cải thiện chất lượng sản phẩm và trải nghiệm mua sắm trên website</li>
              </ul>

              <h2 style={{ fontFamily: 'var(--heading)', fontStyle: 'italic', fontWeight: 400, fontSize: 24, color: 'var(--text)', marginBottom: 12, marginTop: 32 }}>3. Chia sẻ thông tin với bên thứ ba</h2>
              <p style={{ marginBottom: 20 }}>
                Chúng tôi không bán hoặc trao đổi thông tin cá nhân của khách hàng cho bên thứ ba vì mục đích thương mại.
                Thông tin chỉ được chia sẻ với đơn vị vận chuyển (để giao hàng) và đơn vị trung gian thanh toán (SePay, ngân hàng đối tác)
                nhằm hoàn tất giao dịch, hoặc khi có yêu cầu từ cơ quan nhà nước có thẩm quyền theo quy định pháp luật.
              </p>

              <h2 style={{ fontFamily: 'var(--heading)', fontStyle: 'italic', fontWeight: 400, fontSize: 24, color: 'var(--text)', marginBottom: 12, marginTop: 32 }}>4. Bảo mật & lưu trữ</h2>
              <p style={{ marginBottom: 20 }}>
                Dữ liệu khách hàng được lưu trữ trên hệ thống có kiểm soát truy cập, chỉ nhân sự được phân quyền mới có thể truy xuất
                để xử lý đơn hàng. Chúng tôi áp dụng các biện pháp kỹ thuật hợp lý để ngăn chặn truy cập, sử dụng hoặc tiết lộ trái phép.
                Thông tin được lưu trữ trong thời gian cần thiết để phục vụ mục đích nêu trên hoặc theo quy định pháp luật.
              </p>

              <h2 style={{ fontFamily: 'var(--heading)', fontStyle: 'italic', fontWeight: 400, fontSize: 24, color: 'var(--text)', marginBottom: 12, marginTop: 32 }}>5. Quyền của khách hàng</h2>
              <p style={{ marginBottom: 16 }}>Khách hàng có quyền:</p>
              <ul style={{ marginBottom: 20, paddingLeft: 22 }}>
                <li>Yêu cầu xem, chỉnh sửa hoặc cập nhật thông tin cá nhân đã cung cấp</li>
                <li>Yêu cầu xóa thông tin cá nhân khỏi hệ thống (trừ dữ liệu bắt buộc lưu theo quy định pháp luật, ví dụ hóa đơn)</li>
                <li>Từ chối nhận thông tin quảng cáo, khuyến mãi bất kỳ lúc nào</li>
              </ul>

              <h2 style={{ fontFamily: 'var(--heading)', fontStyle: 'italic', fontWeight: 400, fontSize: 24, color: 'var(--text)', marginBottom: 12, marginTop: 32 }}>6. Liên hệ về dữ liệu cá nhân</h2>
              <p style={{ marginBottom: 8 }}>
                Nếu có bất kỳ thắc mắc hoặc yêu cầu nào liên quan đến dữ liệu cá nhân, vui lòng liên hệ:
              </p>
              <ul style={{ marginBottom: 8, paddingLeft: 22 }}>
                <li>Hotline: {settings.site_phone}</li>
                <li>Email: {settings.site_email}</li>
              </ul>
              <p>Xem thêm tại trang <Link to="/lien-he" style={{ color: 'var(--accent)' }}>Liên hệ</Link>.</p>
            </div>
          </div>
        </section>
      </main>
    </>
  )
}
