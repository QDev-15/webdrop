import { useSite } from '../contexts/SiteContext'
import { useDocumentMeta } from '../hooks/useDocumentMeta'

export default function PrivacyPolicyPage() {
  const { settings } = useSite()

  useDocumentMeta({
    title: 'Chính sách bảo mật — ' + settings.site_name,
    description: 'Chính sách bảo mật dữ liệu khách hàng',
  })

  return (
    <>
      <div className="dg-page-hero">
        <div className="dg-container">
          <h1 className="dg-page-hero__title">Chính sách bảo mật</h1>
        </div>
      </div>

      <main className="dg-container" style={{ paddingTop: '60px', paddingBottom: '80px', maxWidth: '800px' }}>
        <div style={{ lineHeight: '1.8', color: 'var(--text-2)', fontSize: '16px' }}>
          <h2 style={{ fontSize: '20px', fontWeight: '600', color: 'var(--text)', marginTop: '40px', marginBottom: '16px' }}>1. Thông tin chúng tôi thu thập</h2>
          <ul style={{ marginLeft: '20px', marginBottom: '20px' }}>
            <li>Đặt hàng hoặc mua sản phẩm</li>
            <li>Tạo tài khoản trên trang web</li>
            <li>Gửi yêu cầu hoặc liên hệ với chúng tôi</li>
          </ul>

          <h2 style={{ fontSize: '20px', fontWeight: '600', color: 'var(--text)', marginTop: '40px', marginBottom: '16px' }}>2. Cách sử dụng thông tin</h2>
          <ul style={{ marginLeft: '20px', marginBottom: '20px' }}>
            <li>Xử lý đơn hàng và giao hàng</li>
            <li>Cung cấp dịch vụ khách hàng</li>
            <li>Cải thiện dịch vụ của chúng tôi</li>
          </ul>

          <h2 style={{ fontSize: '20px', fontWeight: '600', color: 'var(--text)', marginTop: '40px', marginBottom: '16px' }}>3. Bảo vệ thông tin</h2>
          <p>Chúng tôi sử dụng các biện pháp bảo vệ an toàn để bảo vệ thông tin cá nhân của bạn.</p>

          <h2 style={{ fontSize: '20px', fontWeight: '600', color: 'var(--text)', marginTop: '40px', marginBottom: '16px' }}>4. Chia sẻ thông tin</h2>
          <p>Chúng tôi không bán, cho thuê hay chia sẻ thông tin cá nhân của bạn với bên thứ ba.</p>

          <h2 style={{ fontSize: '20px', fontWeight: '600', color: 'var(--text)', marginTop: '40px', marginBottom: '16px' }}>5. Quyền của bạn</h2>
          <p>Bạn có quyền truy cập, sửa đổi hoặc xóa thông tin cá nhân của mình. Vui lòng liên hệ với chúng tôi.</p>

          <h2 style={{ fontSize: '20px', fontWeight: '600', color: 'var(--text)', marginTop: '40px', marginBottom: '16px' }}>6. Liên hệ</h2>
          <p>Email: {settings.site_email || '[EMAIL]'}<br />Điện thoại: {settings.site_phone || '[SỐ_ĐIỆN_THOẠI]'}</p>

          <p style={{ marginTop: '40px', fontSize: '14px', color: 'var(--text-3)' }}>Cập nhật lần cuối: {new Date().toLocaleDateString('vi-VN')}</p>
        </div>
      </main>
    </>
  )
}
