import { useSite } from '../contexts/SiteContext'
import { useDocumentMeta } from '../hooks/useDocumentMeta'

export default function TermsPage() {
  const { settings } = useSite()

  useDocumentMeta({
    title: 'Điều khoản sử dụng — ' + settings.site_name,
    description: 'Điều khoản sử dụng dịch vụ',
  })

  return (
    <>
      <div className="dg-page-hero">
        <div className="dg-container">
          <h1 className="dg-page-hero__title">Điều khoản sử dụng</h1>
        </div>
      </div>

      <main className="dg-container" style={{ paddingTop: '60px', paddingBottom: '80px', maxWidth: '800px' }}>
        <div style={{ lineHeight: '1.8', color: 'var(--text-2)', fontSize: '16px' }}>
          <h2 style={{ fontSize: '20px', fontWeight: '600', color: 'var(--text)', marginTop: '40px', marginBottom: '16px' }}>1. Điều khoản chung</h2>
          <p>Bằng cách truy cập và sử dụng trang web này, bạn đồng ý bị ràng buộc bởi các điều khoản và điều kiện này.</p>

          <h2 style={{ fontSize: '20px', fontWeight: '600', color: 'var(--text)', marginTop: '40px', marginBottom: '16px' }}>2. Giấy phép sử dụng</h2>
          <p>{settings.site_name || 'Nhà Đẹp Store'} cấp cho bạn một giấy phép hạn chế, không độc quyền để truy cập và sử dụng trang web này.</p>

          <h2 style={{ fontSize: '20px', fontWeight: '600', color: 'var(--text)', marginTop: '40px', marginBottom: '16px' }}>3. Hạn chế sử dụng</h2>
          <ul style={{ marginLeft: '20px', marginBottom: '20px' }}>
            <li>Không sao chép hoặc phân phối nội dung từ trang web</li>
            <li>Không tham gia vào bất kỳ hoạt động làm hại trang web</li>
            <li>Không sử dụng trang web cho bất kỳ mục đích bất hợp pháp</li>
          </ul>

          <h2 style={{ fontSize: '20px', fontWeight: '600', color: 'var(--text)', marginTop: '40px', marginBottom: '16px' }}>4. Đơn hàng và thanh toán</h2>
          <p>Tất cả đơn hàng phải được thanh toán đầy đủ trước khi chúng tôi xử lý. Giá cả có thể thay đổi mà không cần thông báo trước.</p>

          <h2 style={{ fontSize: '20px', fontWeight: '600', color: 'var(--text)', marginTop: '40px', marginBottom: '16px' }}>5. Giao hàng</h2>
          <p>Chúng tôi nỗ lực giao hàng trong thời gian dự kiến. Một khi sản phẩm được gửi, bạn chịu trách nhiệm vận chuyển.</p>

          <h2 style={{ fontSize: '20px', fontWeight: '600', color: 'var(--text)', marginTop: '40px', marginBottom: '16px' }}>6. Chính sách hoàn trả</h2>
          <p>Bạn có thể hoàn trả hoặc đổi sản phẩm trong 30 ngày từ khi nhận hàng, miễn là sản phẩm ở tình trạng ban đầu.</p>

          <h2 style={{ fontSize: '20px', fontWeight: '600', color: 'var(--text)', marginTop: '40px', marginBottom: '16px' }}>7. Liên hệ</h2>
          <p>Email: {settings.site_email || '[EMAIL]'}<br />Điện thoại: {settings.site_phone || '[SỐ_ĐIỆN_THOẠI]'}</p>

          <p style={{ marginTop: '40px', fontSize: '14px', color: 'var(--text-3)' }}>Cập nhật lần cuối: {new Date().toLocaleDateString('vi-VN')}</p>
        </div>
      </main>
    </>
  )
}
