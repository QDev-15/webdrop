import { useSite } from '../contexts/SiteContext'
import { useDocumentMeta } from '../hooks/useDocumentMeta'
import LegalPage from '../components/LegalPage'

export default function TermsPage() {
  useDocumentMeta({ title: 'Điều khoản sử dụng | Nhà Đất Việt', description: 'Điều khoản sử dụng dịch vụ môi giới bất động sản của Nhà Đất Việt.' })
  const { settings } = useSite()
  const siteName = settings.site_name || 'Nhà Đất Việt'

  return (
    <LegalPage title="Điều khoản sử dụng" breadcrumb="Điều khoản sử dụng" banner={settings.banner_terms}>
      <h2>1. Phạm vi dịch vụ</h2>
      <p>{siteName} cung cấp dịch vụ môi giới, tư vấn mua bán và cho thuê bất động sản tại TP.HCM, bao gồm: đăng tin ký gửi, kết nối bên mua/bán và bên thuê/cho thuê, hỗ trợ đặt lịch xem nhà và tư vấn thủ tục pháp lý cơ bản. Việc sử dụng website này đồng nghĩa bạn đồng ý với các điều khoản dưới đây.</p>

      <h2>2. Trách nhiệm của {siteName}</h2>
      <ul>
        <li>Kiểm tra thông tin cơ bản về pháp lý (sổ đỏ/sổ hồng, tình trạng quy hoạch) trước khi đăng tin</li>
        <li>Cung cấp thông tin trung thực về giá, diện tích, tình trạng bất động sản theo mô tả của bên ký gửi</li>
        <li>Hỗ trợ kết nối các bên liên quan, không đại diện pháp lý toàn phần cho bất kỳ bên nào trừ khi có ủy quyền bằng văn bản</li>
      </ul>

      <h2>3. Trách nhiệm của khách hàng</h2>
      <ul>
        <li>Cung cấp thông tin chính xác khi đăng ký ký gửi hoặc yêu cầu tư vấn</li>
        <li>Tự kiểm tra, đối chiếu thông tin pháp lý trước khi đặt cọc hoặc ký kết hợp đồng chính thức</li>
        <li>Thanh toán đầy đủ phí môi giới (nếu có) theo thỏa thuận đã ký kết bằng văn bản</li>
      </ul>

      <h2>4. Chính sách phí môi giới</h2>
      <p>Phí môi giới được áp dụng cho bên bán/cho thuê, không thu phí từ bên mua/thuê. Mức phí cụ thể (thường 1-2% giá trị giao dịch với mua bán, tương đương nửa tháng đến 1 tháng tiền thuê với cho thuê) được thống nhất bằng văn bản ký gửi trước khi {siteName} bắt đầu quảng bá tin đăng.</p>

      <h2>5. Giới hạn trách nhiệm</h2>
      <p>{siteName} không chịu trách nhiệm đối với các tranh chấp phát sinh do thông tin sai lệch từ bên ký gửi cung cấp, hoặc do khách hàng không thực hiện đầy đủ việc kiểm tra pháp lý độc lập trước khi giao dịch. Chúng tôi khuyến nghị khách hàng luôn tham khảo ý kiến luật sư/công chứng viên đối với các giao dịch giá trị lớn.</p>

      <h2>6. Quy định về đặt cọc và hủy giao dịch</h2>
      <p>Việc đặt cọc, hủy cọc thực hiện theo điều khoản ghi trong hợp đồng đặt cọc riêng giữa các bên, có sự chứng kiến hoặc hỗ trợ soạn thảo từ {siteName}. {siteName} không giữ tiền cọc trừ khi có thỏa thuận riêng bằng văn bản về việc làm bên trung gian giữ cọc.</p>

      <h2>7. Thay đổi điều khoản</h2>
      <p>{siteName} có quyền cập nhật điều khoản sử dụng theo thời gian để phù hợp với quy định pháp luật hiện hành. Phiên bản điều khoản mới nhất luôn được đăng tải công khai tại trang này.</p>
    </LegalPage>
  )
}
