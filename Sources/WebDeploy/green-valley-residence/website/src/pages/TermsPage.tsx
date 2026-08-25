import { useDocumentMeta } from '../hooks/useDocumentMeta'
import LegalPage from '../components/LegalPage'

export default function TermsPage() {
  useDocumentMeta({
    title: 'Điều khoản sử dụng | Green Valley Residence',
    description: 'Điều khoản sử dụng website dự án Green Valley Residence — Tập đoàn Lộc Việt Land.',
  })

  return (
    <LegalPage
      title="Điều khoản sử dụng"
      updatedAt="15/08/2026"
      sections={[
        { title: '1. Mục đích website', content: 'Website này cung cấp thông tin giới thiệu, mô tả, hình ảnh, giá bán tham khảo và tiến độ dự án Green Valley Residence nhằm mục đích tiếp thị và tư vấn khách hàng. Đây không phải là lời chào bán chính thức hay một phần của Hợp đồng mua bán căn hộ.' },
        { title: '2. Tính chính xác của thông tin', content: 'Mọi hình ảnh phối cảnh, mặt bằng minh họa, giá bán, tiến độ thanh toán và chính sách bán hàng trên website chỉ mang tính tham khảo tại thời điểm đăng tải và có thể thay đổi theo quyết định của Chủ đầu tư mà không cần báo trước. Thông tin chính xác và ràng buộc pháp lý sẽ được quy định cụ thể trong Hợp đồng mua bán căn hộ chính thức.' },
        { title: '3. Công cụ tính vay/trả góp', content: 'Công cụ tính vay trên website chỉ mang tính minh họa dựa trên mức lãi suất tham khảo tại thời điểm hiện tại, không phải cam kết chính thức từ ngân hàng. Lãi suất, hạn mức và điều kiện vay thực tế sẽ do ngân hàng liên kết (Vietcombank, Techcombank, BIDV) thẩm định và quyết định.' },
        { title: '4. Quyền sở hữu trí tuệ', content: 'Toàn bộ nội dung, hình ảnh, logo trên website thuộc quyền sở hữu của Tập đoàn Lộc Việt Land. Nghiêm cấm sao chép, sử dụng cho mục đích thương mại khi chưa có sự đồng ý bằng văn bản.' },
        { title: '5. Giới hạn trách nhiệm', content: 'Chủ đầu tư không chịu trách nhiệm về các quyết định giao dịch được đưa ra chỉ dựa trên thông tin tham khảo trên website mà chưa qua tư vấn trực tiếp từ Phòng Kinh doanh dự án và ký kết văn bản pháp lý chính thức.' },
        { title: '6. Liên hệ', content: 'Mọi thắc mắc về điều khoản sử dụng vui lòng liên hệ Phòng Kinh doanh dự án Green Valley Residence — Tập đoàn Lộc Việt Land.' },
      ]}
    />
  )
}
