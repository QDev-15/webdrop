import { Link } from 'react-router-dom'
import { useSite } from '../contexts/SiteContext'

const SECTIONS = [
  {
    title: '1. Thông tin thu thập',
    body: [
      'Khi bạn đặt hàng, đăng ký nhận tin hoặc liên hệ với chúng tôi, chúng tôi có thể thu thập các thông tin sau: họ tên, số điện thoại, địa chỉ email, địa chỉ giao hàng, thông tin đơn hàng (sản phẩm, size, màu sắc) và lịch sử mua hàng.',
      'Chúng tôi cũng có thể thu thập một số dữ liệu kỹ thuật không định danh cá nhân (loại trình duyệt, thiết bị truy cập) nhằm cải thiện trải nghiệm sử dụng website.',
    ],
  },
  {
    title: '2. Mục đích sử dụng',
    body: [
      'Thông tin thu thập được sử dụng để: xử lý và giao đơn hàng, xác nhận thanh toán, chăm sóc khách hàng, tư vấn size/sản phẩm, gửi thông báo về đơn hàng và các chương trình khuyến mãi (nếu bạn đồng ý nhận).',
      'Chúng tôi không sử dụng thông tin cá nhân của khách hàng cho mục đích nào khác ngoài các mục đích nêu trên nếu không có sự đồng ý của khách hàng.',
    ],
  },
  {
    title: '3. Chia sẻ thông tin với bên thứ ba',
    body: [
      'Chúng tôi không bán, trao đổi hoặc cho thuê thông tin cá nhân của khách hàng cho bên thứ ba vì mục đích thương mại.',
      'Thông tin chỉ được chia sẻ với các đối tác cần thiết để hoàn tất giao dịch, bao gồm: đơn vị vận chuyển (để giao hàng), đơn vị trung gian thanh toán (để xác nhận thanh toán), hoặc khi có yêu cầu từ cơ quan nhà nước có thẩm quyền theo quy định của pháp luật.',
    ],
  },
  {
    title: '4. Bảo mật & lưu trữ dữ liệu',
    body: [
      'Dữ liệu khách hàng được lưu trữ trên hệ thống có áp dụng các biện pháp bảo mật kỹ thuật (mã hóa mật khẩu, kiểm soát truy cập) nhằm ngăn chặn truy cập, sử dụng hoặc tiết lộ trái phép.',
      'Thông tin thanh toán (nếu có) được xử lý qua cổng thanh toán/ngân hàng đối tác — chúng tôi không lưu trữ trực tiếp số thẻ hay thông tin tài khoản ngân hàng của khách hàng trên hệ thống.',
      'Dữ liệu được lưu trữ trong thời gian cần thiết để phục vụ mục đích thu thập hoặc theo yêu cầu của pháp luật hiện hành.',
    ],
  },
  {
    title: '5. Quyền của khách hàng',
    body: [
      'Khách hàng có quyền yêu cầu truy cập, chỉnh sửa, cập nhật hoặc xóa thông tin cá nhân của mình đã cung cấp cho chúng tôi.',
      'Khách hàng có quyền từ chối nhận email/tin nhắn quảng cáo bất kỳ lúc nào bằng cách liên hệ trực tiếp với chúng tôi theo thông tin bên dưới.',
    ],
  },
  {
    title: '6. Liên hệ về dữ liệu cá nhân',
    body: [
      'Nếu có bất kỳ thắc mắc nào liên quan đến chính sách bảo mật hoặc muốn thực hiện quyền của mình đối với dữ liệu cá nhân, vui lòng liên hệ với chúng tôi qua hotline, email hoặc trang Liên hệ của website.',
    ],
  },
]

export default function PrivacyPolicyPage() {
  const { settings } = useSite()

  return (
    <>
      <div className="gd-page-header" style={{ paddingBottom: 40 }}>
        <div className="gd-container-sm">
          <nav className="gd-breadcrumb" aria-label="Breadcrumb">
            <Link to="/">Trang chủ</Link><span><i className="bi bi-chevron-right" style={{ fontSize: 10 }} /></span><span>Chính sách bảo mật</span>
          </nav>
          <h1 className="gd-page-title">Chính sách bảo mật</h1>
          <p className="gd-page-count" style={{ fontSize: 15 }}>Cam kết bảo vệ thông tin cá nhân của khách hàng khi mua sắm tại {settings.site_name || 'cửa hàng'}.</p>
        </div>
      </div>

      <main>
        <section style={{ padding: 'clamp(24px,4vw,56px) 0 clamp(64px,8vw,100px)' }} aria-labelledby="privacy-heading">
          <div className="gd-container-sm">
            <h2 id="privacy-heading" style={{ position: 'absolute', width: 1, height: 1, overflow: 'hidden', clip: 'rect(0,0,0,0)' }}>Nội dung chính sách bảo mật</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 36 }} data-reveal>
              {SECTIONS.map((sec, i) => (
                <div key={i} style={{ paddingBottom: 32, borderBottom: i < SECTIONS.length - 1 ? '1px solid var(--border)' : 'none' }}>
                  <h3 style={{ fontFamily: 'var(--heading)', fontSize: 'clamp(18px,2vw,22px)', fontWeight: 700, color: 'var(--text)', marginBottom: 14, textTransform: 'uppercase', letterSpacing: '-.01em' }}>{sec.title}</h3>
                  {sec.body.map((p, j) => (
                    <p key={j} style={{ fontSize: 15, color: 'var(--text-2)', lineHeight: 1.8, marginBottom: j < sec.body.length - 1 ? 14 : 0 }}>{p}</p>
                  ))}
                </div>
              ))}
            </div>

            <div style={{ marginTop: 40, padding: '24px 28px', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 4 }} data-reveal data-delay="1">
              <p style={{ fontSize: 14, color: 'var(--text-3)', marginBottom: 4 }}>Mọi thắc mắc về dữ liệu cá nhân, vui lòng liên hệ</p>
              <p style={{ fontSize: 15, color: 'var(--text)', fontWeight: 600 }}>
                <i className="bi bi-telephone" style={{ color: 'var(--accent)', marginRight: 8 }} />{settings.site_phone}
                <span style={{ margin: '0 12px', color: 'var(--text-3)' }}>&middot;</span>
                <i className="bi bi-envelope" style={{ color: 'var(--accent)', marginRight: 8 }} />{settings.site_email}
              </p>
              <Link to="/lien-he" className="gd-btn gd-btn-ghost" style={{ marginTop: 16, display: 'inline-flex' }}>Đến trang liên hệ</Link>
            </div>
          </div>
        </section>
      </main>
    </>
  )
}
