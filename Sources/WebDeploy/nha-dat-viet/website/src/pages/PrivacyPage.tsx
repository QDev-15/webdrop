import { useSite } from '../contexts/SiteContext'
import { useDocumentMeta } from '../hooks/useDocumentMeta'
import LegalPage from '../components/LegalPage'

export default function PrivacyPage() {
  useDocumentMeta({ title: 'Chính sách bảo mật | Nhà Đất Việt', description: 'Chính sách bảo mật thông tin khách hàng của Nhà Đất Việt.' })
  const { settings } = useSite()
  const siteName = settings.site_name || 'Nhà Đất Việt'

  return (
    <LegalPage title="Chính sách bảo mật" breadcrumb="Chính sách bảo mật" banner={settings.banner_privacy}>
      <h2>1. Mục đích thu thập thông tin</h2>
      <p>{siteName} thu thập thông tin cá nhân (họ tên, số điện thoại, email, nhu cầu bất động sản) khi bạn điền form liên hệ, đặt lịch xem nhà, đăng ký ký gửi tin đăng hoặc liên hệ qua hotline/Zalo. Thông tin này được sử dụng nhằm mục đích duy nhất là hỗ trợ tư vấn và kết nối giao dịch bất động sản giữa các bên.</p>

      <h2>2. Phạm vi sử dụng thông tin</h2>
      <ul>
        <li>Liên hệ tư vấn, xác nhận lịch hẹn xem bất động sản</li>
        <li>Gửi thông tin tin đăng phù hợp với nhu cầu bạn đã đăng ký</li>
        <li>Kết nối giữa bên mua/thuê và bên bán/cho thuê (chỉ khi có sự đồng ý của các bên)</li>
        <li>Cải thiện chất lượng dịch vụ tư vấn của {siteName}</li>
      </ul>
      <p>Chúng tôi cam kết không bán, trao đổi hoặc cho thuê thông tin cá nhân của khách hàng cho bên thứ ba vì mục đích thương mại không liên quan.</p>

      <h2>3. Thời gian lưu trữ thông tin</h2>
      <p>Thông tin khách hàng được lưu trữ trong suốt quá trình hợp tác và tối đa 24 tháng kể từ lần giao dịch/liên hệ gần nhất, trừ khi khách hàng có yêu cầu xóa sớm hơn theo quy định pháp luật.</p>

      <h2>4. Bảo mật thông tin</h2>
      <p>{siteName} áp dụng các biện pháp kỹ thuật và quản lý phù hợp để bảo vệ thông tin khách hàng khỏi truy cập trái phép, mất mát hoặc sử dụng sai mục đích. Chỉ những nhân viên được ủy quyền mới có quyền truy cập vào dữ liệu khách hàng phục vụ công việc tư vấn.</p>

      <h2>5. Quyền của khách hàng</h2>
      <ul>
        <li>Yêu cầu xem, chỉnh sửa hoặc xóa thông tin cá nhân đã cung cấp</li>
        <li>Từ chối nhận thông tin tư vấn/tin đăng qua điện thoại, email, Zalo bất kỳ lúc nào</li>
        <li>Khiếu nại về việc sử dụng thông tin không đúng mục đích đã cam kết</li>
      </ul>
      <p>Mọi yêu cầu liên quan đến quyền riêng tư vui lòng liên hệ qua email {settings.site_email || 'hotro@nhadatviet.vn'} hoặc hotline {settings.site_phone || '1900 6789'}.</p>

      <h2>6. Thay đổi chính sách</h2>
      <p>Chính sách bảo mật có thể được cập nhật theo thời gian để phù hợp với quy định pháp luật hoặc thay đổi trong hoạt động kinh doanh. Phiên bản mới nhất sẽ luôn được đăng tải tại trang này.</p>
    </LegalPage>
  )
}
