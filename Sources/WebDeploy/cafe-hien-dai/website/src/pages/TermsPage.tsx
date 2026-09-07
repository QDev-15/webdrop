import { Link } from 'react-router-dom'
import { useSite } from '../contexts/SiteContext'
import { useDocumentMeta } from '../hooks/useDocumentMeta'

export default function TermsPage() {
  const { settings } = useSite()
  const siteName = settings.site_name || 'MONO Coffee'
  useDocumentMeta({
    title: `Điều khoản sử dụng — ${siteName}`,
    description: `Điều khoản sử dụng dịch vụ tại ${siteName} — quy định về đặt chỗ, hủy đặt chỗ, đặt tiệc công ty và sử dụng không gian quán.`,
  })

  return (
    <>
      <header className="chd-page-hero">
        <div className="chd-container">
          <div className="chd-breadcrumb"><Link to="/">Trang chủ</Link><span>/</span><span>Điều khoản sử dụng</span></div>
          <h1 className="chd-page-title">Điều khoản sử dụng</h1>
        </div>
      </header>

      <section className="chd-sec">
        <div className="chd-container">
          <div className="chd-article">
            <p className="chd-article-meta">Cập nhật lần cuối: 01/01/2026</p>

            <p>Khi sử dụng website hoặc dịch vụ tại {siteName}, bạn đồng ý với các điều khoản sử dụng dưới đây. Vui lòng đọc kỹ trước khi đặt chỗ hoặc sử dụng bất kỳ dịch vụ nào của chúng tôi.</p>

            <h2>1. Đặt chỗ và giữ chỗ</h2>
            <ul>
              <li>Đặt chỗ được xác nhận qua điện thoại, Zalo hoặc form liên hệ trên website</li>
              <li>Bàn/phòng họp được giữ tối đa 20 phút sau giờ hẹn, quá thời gian này quán có quyền sắp xếp cho khách khác</li>
              <li>Với nhóm trên 15 người (đặt tiệc công ty), vui lòng đặt trước ít nhất 24 giờ</li>
            </ul>

            <h2>2. Hủy và thay đổi đặt chỗ</h2>
            <p>Khách hàng có thể hủy hoặc thay đổi đặt chỗ miễn phí trước 2 giờ so với giờ hẹn. Việc hủy trễ hoặc không đến mà không báo trước có thể ảnh hưởng đến quyền ưu tiên đặt chỗ trong các lần sau.</p>

            <h2>3. Sử dụng không gian làm việc</h2>
            <ul>
              <li>Khu làm việc và phòng họp dành cho mục đích cá nhân/công việc, vui lòng giữ âm lượng vừa phải</li>
              <li>Quán khuyến khích gọi thêm đồ uống nếu ngồi làm việc trong thời gian dài, đặc biệt vào giờ cao điểm</li>
              <li>Phòng họp nhỏ áp dụng phí thuê theo giờ đối với nhóm không kèm đơn gọi đồ uống tối thiểu — chi tiết liên hệ trực tiếp quán</li>
            </ul>

            <h2>4. Thanh toán</h2>
            <p>Giá niêm yết trên thực đơn đã bao gồm thuế VAT (nếu có). Quán chấp nhận thanh toán tiền mặt, chuyển khoản và các ví điện tử phổ biến.</p>

            <h2>5. Giao hàng văn phòng</h2>
            <p>Dịch vụ giao cà phê văn phòng áp dụng cho đơn từ 5 ly trở lên trong bán kính 3km. Thời gian giao dự kiến 20–30 phút, có thể thay đổi tùy điều kiện giao thông. Quán không chịu trách nhiệm về chất lượng đồ uống nếu nhận hàng trễ hơn 45 phút kể từ giờ pha chế mà không phải lỗi từ phía quán.</p>

            <h2>6. Thay đổi điều khoản</h2>
            <p>{siteName} có quyền cập nhật điều khoản sử dụng này bất kỳ lúc nào. Phiên bản mới nhất sẽ luôn được đăng tải trên trang này.</p>

            <h2>7. Liên hệ</h2>
            <p>Mọi thắc mắc về điều khoản sử dụng, vui lòng liên hệ qua trang <Link to="/lien-he">Liên hệ</Link> hoặc email <a href={`mailto:${settings.site_email}`}>{settings.site_email}</a>.</p>
          </div>
        </div>
      </section>
    </>
  )
}
