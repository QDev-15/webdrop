import { Link } from 'react-router-dom'
import { useSite } from '../contexts/SiteContext'
import { useDocumentMeta } from '../hooks/useDocumentMeta'

export default function PrivacyPolicyPage() {
  useDocumentMeta({
    title: 'Chính Sách Bảo Mật — PhotoPro Máy Ảnh & Thiết Bị Nhiếp Ảnh',
    description: 'Chính sách bảo mật thông tin khách hàng tại PhotoPro — dữ liệu thu thập, mục đích sử dụng, chia sẻ với bên thứ ba và quyền của khách hàng.',
  })

  const { settings } = useSite()
  const siteName = settings.site_name || 'PhotoPro'
  const email = settings.site_email || 'lienhe@photopro.vn'

  return (
    <>
      <section className="ma-page-hero">
        <div className="ma-container">
          <div className="ma-breadcrumb">
            <Link to="/">Trang chủ</Link><i className="bi bi-chevron-right" style={{ fontSize: 10 }} /><span>Chính sách bảo mật</span>
          </div>
          <h1 className="ma-page-title">Chính Sách Bảo Mật</h1>
          <p className="ma-page-count">{siteName} cam kết bảo vệ thông tin cá nhân của khách hàng theo đúng quy định pháp luật hiện hành.</p>
        </div>
      </section>

      <main>
        <section className="ma-sec">
          <div className="ma-container">
            <div className="ma-article" data-reveal>
              <p className="ma-article-meta">Cập nhật lần cuối: 22/07/2026</p>

              <p>
                Chính sách bảo mật này áp dụng cho toàn bộ website <strong>{siteName}</strong> và mô tả cách chúng tôi
                thu thập, sử dụng, lưu trữ và bảo vệ thông tin cá nhân của khách hàng khi truy cập website, đăng ký
                tài khoản, đặt mua thân máy/ống kính/phụ kiện hoặc đặt lịch dịch vụ sửa chữa, vệ sinh cảm biến.
              </p>

              <h2>1. Thông tin thu thập</h2>
              <p>Khi khách hàng sử dụng website và dịch vụ, chúng tôi có thể thu thập các thông tin sau:</p>
              <ul>
                <li>Họ tên, số điện thoại, email và địa chỉ giao hàng khi đặt mua thiết bị</li>
                <li>Thông tin tài khoản đăng nhập (nếu khách hàng đăng ký thành viên)</li>
                <li>Thông tin thiết bị cần sửa chữa/bảo trì khi đặt lịch dịch vụ kỹ thuật</li>
                <li>Lịch sử đơn hàng, sản phẩm quan tâm và nhu cầu chụp ảnh (chân dung, phong cảnh, sự kiện...) để tư vấn phù hợp</li>
                <li>Thông tin thiết bị truy cập, trình duyệt và địa chỉ IP khi truy cập website</li>
              </ul>
              <p>Chúng tôi <strong>không</strong> thu thập hoặc lưu trữ thông tin thẻ thanh toán — mọi giao dịch trả góp/thanh toán online được xử lý qua cổng thanh toán trung gian đạt chuẩn bảo mật.</p>

              <h2>2. Mục đích sử dụng</h2>
              <p>Thông tin thu thập được sử dụng nhằm:</p>
              <ul>
                <li>Xử lý đơn hàng, giao thiết bị và kích hoạt bảo hành điện tử</li>
                <li>Liên hệ xác nhận đơn hàng, lịch hẹn sửa chữa/vệ sinh cảm biến, thông báo trạng thái vận chuyển</li>
                <li>Tư vấn kỹ thuật, gợi ý combo thân máy + ống kính phù hợp với nhu cầu chụp thực tế</li>
                <li>Gửi thông tin khuyến mãi, hàng mới về nếu khách hàng đồng ý nhận tin</li>
                <li>Giải quyết khiếu nại, bảo hành và tranh chấp phát sinh (nếu có)</li>
              </ul>

              <h2>3. Chia sẻ với bên thứ ba</h2>
              <p>
                Chúng tôi cam kết <strong>không bán, trao đổi hoặc cho thuê</strong> thông tin cá nhân của khách hàng
                cho bất kỳ bên thứ ba nào vì mục đích thương mại. Thông tin chỉ được chia sẻ trong các trường hợp:
              </p>
              <ul>
                <li>Đơn vị vận chuyển — để giao thiết bị đến đúng địa chỉ khách hàng cung cấp</li>
                <li>Đối tác thanh toán, công ty tài chính hỗ trợ trả góp — để xử lý giao dịch an toàn</li>
                <li>Trung tâm bảo hành ủy quyền của hãng — để kích hoạt và xử lý yêu cầu bảo hành chính hãng</li>
                <li>Cơ quan nhà nước có thẩm quyền — khi có yêu cầu theo quy định pháp luật</li>
              </ul>

              <h2>4. Bảo mật &amp; lưu trữ dữ liệu</h2>
              <p>
                Dữ liệu khách hàng được lưu trữ trên hệ thống máy chủ có áp dụng các biện pháp bảo mật kỹ thuật
                (mã hóa kết nối, phân quyền truy cập) nhằm ngăn chặn truy cập, chỉnh sửa hoặc tiết lộ trái phép.
                Thông tin được lưu trữ trong thời gian cần thiết để phục vụ mục đích đã nêu (bao gồm tra cứu bảo hành
                trong suốt thời hạn 24 tháng) hoặc theo quy định pháp luật, sau đó sẽ được xóa hoặc ẩn danh hóa.
              </p>

              <h2>5. Quyền của khách hàng</h2>
              <p>Khách hàng có quyền:</p>
              <ul>
                <li>Yêu cầu xem, chỉnh sửa hoặc cập nhật thông tin cá nhân đã cung cấp</li>
                <li>Yêu cầu xóa tài khoản và dữ liệu cá nhân liên quan</li>
                <li>Từ chối nhận email/tin nhắn khuyến mãi bất kỳ lúc nào</li>
                <li>Khiếu nại nếu phát hiện thông tin cá nhân bị sử dụng sai mục đích</li>
              </ul>

              <h2>6. Liên hệ về dữ liệu cá nhân</h2>
              <p>
                Nếu có thắc mắc hoặc yêu cầu liên quan đến dữ liệu cá nhân, khách hàng vui lòng liên hệ qua trang{' '}
                <Link to="/lien-he">Liên hệ</Link> hoặc gửi email tới <strong>{email}</strong> —
                {' '}{siteName} sẽ phản hồi trong thời gian sớm nhất.
              </p>
            </div>
          </div>
        </section>
      </main>
    </>
  )
}
