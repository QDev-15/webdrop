import { useDocumentMeta } from '../hooks/useDocumentMeta'
import LegalPage from '../components/LegalPage'

export default function PrivacyPage() {
  useDocumentMeta({
    title: 'Chính sách bảo mật | Green Valley Residence',
    description: 'Chính sách bảo mật thông tin khách hàng của dự án Green Valley Residence — Tập đoàn Lộc Việt Land.',
  })

  return (
    <LegalPage
      title="Chính sách bảo mật"
      updatedAt="15/08/2026"
      sections={[
        { title: '1. Thông tin thu thập', content: 'Khi Quý khách đăng ký nhận bảng giá, đặt lịch tham quan nhà mẫu hoặc liên hệ qua form trên website, chúng tôi thu thập: họ tên, số điện thoại, email, loại căn quan tâm và các thông tin Quý khách chủ động cung cấp trong phần ghi chú.' },
        { title: '2. Mục đích sử dụng thông tin', content: 'Thông tin được sử dụng để: liên hệ tư vấn bảng giá và chính sách bán hàng, sắp xếp lịch tham quan nhà mẫu, gửi thông tin cập nhật tiến độ dự án (nếu Quý khách đồng ý), và hỗ trợ các thủ tục liên quan đến giao dịch mua bán căn hộ.' },
        { title: '3. Bảo mật & lưu trữ', content: 'Thông tin khách hàng được lưu trữ bảo mật, chỉ nhân viên Phòng Kinh doanh dự án được ủy quyền mới có quyền truy cập nhằm mục đích tư vấn và chăm sóc khách hàng.' },
        { title: '4. Chia sẻ thông tin với bên thứ ba', content: 'Chúng tôi không bán hoặc cho thuê thông tin cá nhân của khách hàng. Thông tin chỉ được chia sẻ với ngân hàng liên kết (Vietcombank, Techcombank, BIDV) khi Quý khách chủ động yêu cầu hỗ trợ vay mua căn hộ.' },
        { title: '5. Quyền của khách hàng', content: 'Quý khách có quyền yêu cầu chỉnh sửa, cập nhật hoặc xóa thông tin cá nhân đã cung cấp bằng cách liên hệ trực tiếp Phòng Kinh doanh dự án qua hotline 1900 6868 hoặc email kinhdoanh@greenvalleyresidence.vn.' },
        { title: '6. Liên hệ', content: 'Mọi thắc mắc về chính sách bảo mật vui lòng liên hệ Phòng Kinh doanh dự án Green Valley Residence — Tập đoàn Lộc Việt Land.' },
      ]}
    />
  )
}
