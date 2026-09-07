import { useSite } from '../contexts/SiteContext'
import { useDocumentMeta } from '../hooks/useDocumentMeta'

export default function PrivacyPage() {
  const { settings } = useSite()
  useDocumentMeta({
    title: 'Chính Sách Bảo Mật — Rosette Bakery & Cafe',
    description: 'Chính sách bảo mật thông tin khách hàng của Rosette Bakery & Cafe.',
  })

  return (
    <>
      <section className="cbn-page-hero">
        <div className="cbn-container">
          <div className="cbn-ph-eyebrow">Pháp lý</div>
          <h1 className="cbn-ph-title">Chính Sách <em>Bảo Mật</em></h1>
          <p className="cbn-ph-sub">Cập nhật lần cuối: 01/01/2026</p>
        </div>
      </section>

      <section className="cbn-sec-pad" style={{ paddingTop: 'clamp(48px,7vw,80px)' }}>
        <div className="cbn-container">
          <div className="cbn-legal-content" style={{ maxWidth: 760, margin: '0 auto' }}>
            <h2>1. Thông tin chúng tôi thu thập</h2>
            <p>Khi bạn đặt bánh, đặt chỗ hoặc liên hệ qua website, Rosette Bakery &amp; Cafe có thể thu thập các thông tin sau: họ tên, số điện thoại, email, địa chỉ giao hàng và nội dung yêu cầu (mẫu bánh, ghi chú đặc biệt).</p>
            <h2>2. Mục đích sử dụng thông tin</h2>
            <ul>
              <li>Xác nhận và xử lý đơn đặt bánh, đặt chỗ của bạn</li>
              <li>Liên hệ tư vấn về mẫu bánh, thời gian giao hàng</li>
              <li>Gửi thông báo khuyến mãi hoặc sản phẩm mới (chỉ khi bạn đồng ý)</li>
              <li>Cải thiện chất lượng dịch vụ và trải nghiệm khách hàng</li>
            </ul>
            <h2>3. Bảo mật thông tin</h2>
            <p>Chúng tôi cam kết không chia sẻ, bán hoặc trao đổi thông tin cá nhân của khách hàng cho bên thứ ba vì mục đích thương mại, trừ khi có yêu cầu từ cơ quan pháp luật có thẩm quyền. Thông tin được lưu trữ với các biện pháp bảo mật hợp lý để tránh truy cập trái phép.</p>
            <h2>4. Thời gian lưu trữ</h2>
            <p>Thông tin khách hàng được lưu trữ trong thời gian cần thiết để phục vụ mục đích đã nêu ở trên, hoặc theo yêu cầu của pháp luật hiện hành.</p>
            <h2>5. Quyền của khách hàng</h2>
            <p>Bạn có quyền yêu cầu Rosette Bakery &amp; Cafe cung cấp, chỉnh sửa hoặc xóa thông tin cá nhân của mình. Vui lòng liên hệ qua email {settings.site_email} hoặc số điện thoại {settings.site_phone} để được hỗ trợ.</p>
            <h2>6. Thay đổi chính sách</h2>
            <p>Chính sách bảo mật này có thể được cập nhật theo thời gian. Mọi thay đổi sẽ được đăng tải trên trang này kèm ngày cập nhật mới nhất.</p>
            <h2>7. Liên hệ</h2>
            <p>Nếu có bất kỳ thắc mắc nào về chính sách bảo mật, vui lòng liên hệ Rosette Bakery &amp; Cafe tại {settings.site_address} hoặc qua email {settings.site_email}.</p>
          </div>
        </div>
      </section>
    </>
  )
}
