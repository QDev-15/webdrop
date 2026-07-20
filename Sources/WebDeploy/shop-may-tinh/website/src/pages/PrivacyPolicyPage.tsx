import { Link } from 'react-router-dom'
import { useSite } from '../contexts/SiteContext'

export default function PrivacyPolicyPage() {
  const { settings } = useSite()
  const siteName = settings.site_name || 'NovaTech'
  const phone = settings.site_phone || '0900 123 456'
  const email = settings.site_email || 'cskh@novatech.vn'

  return (
    <>
      <div className="mt-page-header" style={{ paddingBottom: 52 }}>
        <div className="mt-container">
          <nav className="mt-breadcrumb" aria-label="Breadcrumb">
            <Link to="/">Trang chủ</Link><span><i className="bi bi-chevron-right" style={{ fontSize: 10 }} /></span><span>Chính sách bảo mật</span>
          </nav>
          <h1 className="mt-page-title">Chính Sách Bảo Mật</h1>
          <p className="mt-page-count" style={{ fontSize: 16 }}>Cách chúng tôi thu thập, sử dụng và bảo vệ thông tin cá nhân của khách hàng</p>
        </div>
      </div>

      <main>
        <section className="mt-sec" style={{ paddingTop: 0 }}>
          <div className="mt-container">
            <div className="mt-article-layout">
              <div className="mt-article-card" data-reveal>
                <div className="mt-article-updated">Cập nhật lần cuối: 17/07/2026</div>

                <p>{siteName} ("chúng tôi") tôn trọng và cam kết bảo vệ quyền riêng tư của khách hàng khi truy cập và mua sắm tại website. Chính sách này giải thích rõ chúng tôi thu thập, sử dụng, lưu trữ và bảo vệ thông tin cá nhân của bạn như thế nào khi bạn đặt mua laptop, PC gaming, linh kiện hoặc phụ kiện máy tính tại đây.</p>

                <h2 id="thong-tin-thu-thap">1. Thông tin chúng tôi thu thập</h2>
                <p>Để xử lý đơn hàng, tư vấn cấu hình và hỗ trợ bảo hành, chúng tôi có thể thu thập các thông tin sau:</p>
                <ul>
                  <li>Họ tên, số điện thoại, email và địa chỉ giao hàng khi bạn đặt hàng hoặc gửi yêu cầu tư vấn.</li>
                  <li>Thông tin đơn hàng: sản phẩm đã mua, cấu hình đã tư vấn, lịch sử giao dịch và phương thức thanh toán (không lưu trữ số thẻ đầy đủ).</li>
                  <li>Thông tin thiết bị khi gửi bảo hành/sửa chữa: model, số serial, tình trạng lỗi mô tả bởi khách hàng.</li>
                  <li>Dữ liệu truy cập website: địa chỉ IP, loại trình duyệt, trang đã xem — phục vụ cải thiện trải nghiệm mua sắm.</li>
                </ul>

                <h2 id="muc-dich-su-dung">2. Mục đích sử dụng thông tin</h2>
                <p>Thông tin thu thập được sử dụng nhằm các mục đích sau:</p>
                <ul>
                  <li>Xử lý đơn hàng, xuất hóa đơn, giao hàng và hỗ trợ trả góp 0% lãi suất.</li>
                  <li>Tư vấn cấu hình phù hợp nhu cầu sử dụng (văn phòng, gaming, đồ họa...).</li>
                  <li>Liên hệ xác nhận đơn hàng, thông báo tình trạng bảo hành/sửa chữa thiết bị.</li>
                  <li>Gửi thông tin khuyến mãi, ưu đãi mới nếu khách hàng đồng ý đăng ký nhận tin.</li>
                  <li>Phòng chống gian lận và đảm bảo an toàn giao dịch.</li>
                </ul>

                <h2 id="chia-se-ben-thu-ba">3. Chia sẻ thông tin với bên thứ ba</h2>
                <p>Chúng tôi không bán, trao đổi hay cho thuê thông tin cá nhân của khách hàng cho bên thứ ba nhằm mục đích thương mại. Thông tin chỉ được chia sẻ trong các trường hợp sau:</p>
                <ul>
                  <li>Đơn vị vận chuyển — để giao hàng đến đúng địa chỉ khách hàng cung cấp.</li>
                  <li>Đối tác tài chính/ngân hàng — khi khách hàng đăng ký trả góp 0% lãi suất, cần xác minh hồ sơ theo yêu cầu của đối tác.</li>
                  <li>Cổng thanh toán — để xử lý giao dịch chuyển khoản, ví điện tử hoặc thẻ tín dụng.</li>
                  <li>Cơ quan nhà nước có thẩm quyền — khi có yêu cầu hợp pháp theo quy định pháp luật.</li>
                </ul>

                <h2 id="bao-mat-luu-tru">4. Bảo mật &amp; lưu trữ dữ liệu</h2>
                <p>Chúng tôi áp dụng các biện pháp kỹ thuật và quản lý phù hợp để bảo vệ thông tin khách hàng khỏi truy cập, sử dụng hoặc tiết lộ trái phép, bao gồm:</p>
                <ul>
                  <li>Mã hóa kết nối truyền dữ liệu (HTTPS/SSL) trên toàn bộ website.</li>
                  <li>Giới hạn quyền truy cập dữ liệu khách hàng — chỉ nhân sự có trách nhiệm mới được truy cập.</li>
                  <li>Không lưu trữ thông tin thẻ ngân hàng đầy đủ trên hệ thống của chúng tôi.</li>
                  <li>Dữ liệu được lưu trữ trong thời gian cần thiết để phục vụ mục đích thu thập hoặc theo yêu cầu pháp luật (ví dụ: thời hạn bảo hành sản phẩm).</li>
                </ul>

                <h2 id="quyen-khach-hang">5. Quyền của khách hàng</h2>
                <p>Khách hàng có quyền:</p>
                <ul>
                  <li>Yêu cầu truy cập, chỉnh sửa hoặc cập nhật thông tin cá nhân đã cung cấp.</li>
                  <li>Yêu cầu xóa thông tin cá nhân khi không còn nhu cầu sử dụng dịch vụ (trừ trường hợp pháp luật yêu cầu lưu trữ, ví dụ hồ sơ bảo hành).</li>
                  <li>Từ chối nhận email/tin nhắn khuyến mãi bất kỳ lúc nào bằng cách liên hệ trực tiếp với chúng tôi.</li>
                  <li>Khiếu nại nếu phát hiện thông tin cá nhân bị sử dụng sai mục đích đã cam kết.</li>
                </ul>

                <h2 id="lien-he-du-lieu">6. Liên hệ về dữ liệu cá nhân</h2>
                <p>
                  Nếu có bất kỳ câu hỏi hoặc yêu cầu nào liên quan đến chính sách bảo mật này, vui lòng liên hệ với chúng tôi qua trang{' '}
                  <Link to="/lien-he">Liên hệ</Link>, hotline <a href={`tel:${phone.replace(/\s/g, '')}`}>{phone}</a> hoặc email{' '}
                  <a href={`mailto:${email}`}>{email}</a>. Chúng tôi sẽ phản hồi yêu cầu của bạn trong thời gian sớm nhất.
                </p>
              </div>

              <aside className="mt-article-toc" data-reveal data-delay="1" aria-label="Mục lục">
                <h4>Nội dung chính</h4>
                <ul>
                  <li><a href="#thong-tin-thu-thap">1. Thông tin thu thập</a></li>
                  <li><a href="#muc-dich-su-dung">2. Mục đích sử dụng</a></li>
                  <li><a href="#chia-se-ben-thu-ba">3. Chia sẻ bên thứ ba</a></li>
                  <li><a href="#bao-mat-luu-tru">4. Bảo mật &amp; lưu trữ</a></li>
                  <li><a href="#quyen-khach-hang">5. Quyền khách hàng</a></li>
                  <li><a href="#lien-he-du-lieu">6. Liên hệ dữ liệu</a></li>
                </ul>
              </aside>
            </div>
          </div>
        </section>
      </main>
    </>
  )
}
