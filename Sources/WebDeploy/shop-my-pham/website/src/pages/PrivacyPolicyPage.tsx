import { Link } from 'react-router-dom'
import { useSite } from '../contexts/SiteContext'
import { useDocumentMeta } from '../hooks/useDocumentMeta'

export default function PrivacyPolicyPage() {
  const { settings } = useSite()

  useDocumentMeta({
    title: `Chính Sách Bảo Mật — ${settings.site_name || 'LUMIÈRE Beauty'}`,
    description: `Chính sách bảo mật thông tin khách hàng của ${settings.site_name || 'LUMIÈRE Beauty'}.`,
  })

  return (
    <main id="mp-main">
      <section className="mp-page-hero">
        <div className="wd-container">
          <nav aria-label="Breadcrumb">
            <ol className="mp-breadcrumb">
              <li><Link to="/">Trang chủ</Link></li>
              <li><span>Chính sách bảo mật</span></li>
            </ol>
          </nav>
          <h1 className="mp-page-hero-title">Chính Sách Bảo Mật</h1>
        </div>
      </section>

      <div className="wd-container">
        <div className="mp-legal-wrap">
          <article className="mp-legal-prose">
            <p>{settings.site_name || 'LUMIÈRE Beauty'} ("chúng tôi", "của chúng tôi") cam kết bảo vệ quyền riêng tư và thông tin cá nhân của khách hàng ("bạn"). Chính sách bảo mật này mô tả cách chúng tôi thu thập, sử dụng, lưu trữ và bảo vệ thông tin của bạn khi bạn sử dụng website và dịch vụ của chúng tôi.</p>

            <h2>1. Thông tin chúng tôi thu thập</h2>
            <p>Chúng tôi có thể thu thập các loại thông tin sau:</p>
            <ul>
              <li><strong>Thông tin nhận dạng:</strong> Họ tên, địa chỉ email, số điện thoại, địa chỉ giao hàng khi bạn đặt hàng hoặc đăng ký tài khoản.</li>
              <li><strong>Thông tin giao dịch:</strong> Chi tiết đơn hàng, lịch sử mua hàng, phương thức thanh toán (chúng tôi không lưu trữ thông tin thẻ ngân hàng đầy đủ).</li>
              <li><strong>Thông tin kỹ thuật:</strong> Địa chỉ IP, loại trình duyệt, thiết bị truy cập, trang bạn xem trên website.</li>
              <li><strong>Thông tin bạn tự cung cấp:</strong> Nội dung tin nhắn liên hệ, đánh giá sản phẩm, phản hồi dịch vụ.</li>
            </ul>

            <h2>2. Mục đích sử dụng thông tin</h2>
            <p>Thông tin của bạn được sử dụng để:</p>
            <ul>
              <li>Xử lý và thực hiện đơn hàng, thông báo trạng thái vận chuyển</li>
              <li>Cung cấp hỗ trợ khách hàng và giải quyết khiếu nại</li>
              <li>Gửi thông tin sản phẩm mới, khuyến mãi (chỉ khi bạn đồng ý đăng ký)</li>
              <li>Cải thiện chất lượng dịch vụ và trải nghiệm mua sắm</li>
              <li>Tuân thủ nghĩa vụ pháp lý theo quy định pháp luật Việt Nam</li>
            </ul>

            <h2>3. Bảo mật thông tin</h2>
            <p>Chúng tôi áp dụng các biện pháp kỹ thuật và tổ chức phù hợp để bảo vệ thông tin của bạn:</p>
            <ul>
              <li>Mã hóa SSL/TLS cho mọi giao dịch trực tuyến</li>
              <li>Kiểm soát truy cập nghiêm ngặt vào hệ thống lưu trữ dữ liệu</li>
              <li>Đào tạo nhân viên về quy trình xử lý dữ liệu cá nhân</li>
              <li>Không bán, trao đổi hoặc chia sẻ thông tin của bạn cho bên thứ ba vì mục đích thương mại</li>
            </ul>

            <h2>4. Chia sẻ thông tin với bên thứ ba</h2>
            <p>Chúng tôi chỉ chia sẻ thông tin của bạn với:</p>
            <ul>
              <li><strong>Đơn vị vận chuyển:</strong> Thông tin giao hàng cần thiết để thực hiện đơn hàng</li>
              <li><strong>Cổng thanh toán:</strong> Thông tin giao dịch để xử lý thanh toán an toàn</li>
              <li><strong>Cơ quan nhà nước:</strong> Khi có yêu cầu hợp pháp từ cơ quan có thẩm quyền</li>
            </ul>

            <h2>5. Cookie và công nghệ theo dõi</h2>
            <p>Website {settings.site_name || 'LUMIÈRE Beauty'} sử dụng cookie và công nghệ tương tự để cải thiện trải nghiệm duyệt web, ghi nhớ sở thích của bạn và phân tích lưu lượng truy cập. Bạn có thể tắt cookie trong cài đặt trình duyệt, tuy nhiên một số tính năng của website có thể bị ảnh hưởng.</p>

            <h2>6. Quyền của bạn</h2>
            <p>Theo quy định pháp luật Việt Nam, bạn có quyền:</p>
            <ul>
              <li>Truy cập và nhận bản sao thông tin cá nhân mà chúng tôi lưu trữ</li>
              <li>Yêu cầu chỉnh sửa thông tin không chính xác</li>
              <li>Yêu cầu xóa thông tin cá nhân (trong giới hạn pháp lý cho phép)</li>
              <li>Phản đối hoặc hạn chế xử lý thông tin của bạn</li>
              <li>Rút lại sự đồng ý bất kỳ lúc nào đối với các hoạt động xử lý dựa trên sự đồng ý</li>
            </ul>
            <p>Để thực hiện các quyền trên, vui lòng liên hệ: <a href={`mailto:${settings.site_email || 'hello@lumiere-beauty.vn'}`}>{settings.site_email || 'hello@lumiere-beauty.vn'}</a></p>

            <h2>7. Thời gian lưu trữ dữ liệu</h2>
            <p>Chúng tôi lưu trữ thông tin cá nhân của bạn trong thời gian cần thiết để thực hiện các mục đích nêu trong chính sách này, hoặc theo quy định của pháp luật hiện hành (thông thường là 5 năm kể từ giao dịch cuối cùng).</p>

            <h2>8. Thay đổi chính sách</h2>
            <p>Chúng tôi có thể cập nhật Chính sách Bảo mật này theo thời gian. Mọi thay đổi quan trọng sẽ được thông báo qua email hoặc thông báo nổi bật trên website. Việc tiếp tục sử dụng dịch vụ sau khi thay đổi có hiệu lực đồng nghĩa với việc bạn chấp nhận chính sách mới.</p>

            <h2>9. Liên hệ về bảo mật</h2>
            <p>Mọi thắc mắc, khiếu nại hoặc yêu cầu liên quan đến chính sách bảo mật, vui lòng liên hệ:</p>
            <ul>
              <li><strong>Email:</strong> <a href={`mailto:${settings.site_email || 'hello@lumiere-beauty.vn'}`}>{settings.site_email || 'hello@lumiere-beauty.vn'}</a></li>
              <li><strong>Điện thoại:</strong> <a href={`tel:+84${(settings.site_phone || '').replace(/\D/g, '').replace(/^0/, '')}`}>{settings.site_phone || '0901 234 567'}</a></li>
              <li><strong>Địa chỉ:</strong> {settings.site_address || '123 Đường Nguyễn Huệ, Quận 1, TP. Hồ Chí Minh'}</li>
            </ul>

            <div className="mp-legal-cta">
              <p>Có câu hỏi về cách chúng tôi bảo vệ dữ liệu của bạn?</p>
              <Link to="/lien-he" className="mp-btn mp-btn-accent">Liên hệ với chúng tôi</Link>
            </div>
          </article>

          <aside className="mp-legal-sidebar">
            <nav aria-label="Điều hướng tài liệu pháp lý">
              <h3>Văn bản pháp lý</h3>
              <ul>
                <li><Link to="/chinh-sach-bao-mat" aria-current="page">Chính sách bảo mật</Link></li>
                <li><Link to="/dieu-khoan">Điều khoản sử dụng</Link></li>
              </ul>
            </nav>
            <div className="mp-legal-sidebar-box">
              <h4>Cần hỗ trợ?</h4>
              <p>Đội ngũ LUMIÈRE sẵn sàng giải đáp mọi thắc mắc của bạn.</p>
              <Link to="/lien-he" className="mp-btn mp-btn-ghost mp-btn-sm">Liên hệ ngay</Link>
            </div>
          </aside>
        </div>
      </div>
    </main>
  )
}
