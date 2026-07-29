import { useSite } from '../contexts/SiteContext'
import { useDocumentMeta } from '../hooks/useDocumentMeta'

export default function AboutPage() {
  const { settings } = useSite()

  useDocumentMeta({
    title: 'Giới thiệu — ' + settings.site_name,
    description: (settings.site_description as string) || 'Tìm hiểu thêm về chúng tôi',
  })

  return (
    <>
      {/* Hero */}
      <div className="dg-page-hero">
        <div className="dg-container">
          <h1 className="dg-page-hero__title">Giới thiệu</h1>
          <p className="dg-page-hero__sub">Chất lượng, uy tín, sự hài lòng của khách hàng</p>
        </div>
      </div>

      <main className="dg-container" style={{ paddingTop: '80px', paddingBottom: '80px' }}>

        {/* About Section */}
        <section style={{ marginBottom: '80px', maxWidth: '800px', margin: '0 auto 80px' }}>
          <h2 style={{ fontSize: '28px', fontWeight: '600', marginBottom: '24px', fontFamily: 'Fraunces' }}>Về Nhà Đẹp Store</h2>
          <div style={{ lineHeight: '1.8', color: 'var(--text-2)', fontSize: '16px' }}>
            <p style={{ marginBottom: '16px' }}>
              Nhà Đẹp Store là địa chỉ tin cậy cho những ai đang tìm kiếm đồ gia dụng chất lượng cao, đa dạng và phong cách.
              Chúng tôi cam kết mang đến những sản phẩm tốt nhất với giá cả hợp lý nhất.
            </p>
            <p style={{ marginBottom: '16px' }}>
              Mỗi sản phẩm trong cửa hàng đều được tuyển chọn kỹ lưỡng từ các nhà sản xuất uy tín,
              đảm bảo độ bền và giá trị sử dụng lâu dài cho gia đình bạn.
            </p>
            <p>
              Chúng tôi không chỉ bán sản phẩm, mà còn mang lại trải nghiệm mua sắm tuyệt vời,
              với dịch vụ giao hàng nhanh, chất lượng và hỗ trợ khách hàng tận tình.
            </p>
          </div>
        </section>

        {/* Values */}
        <section style={{ marginBottom: '80px' }}>
          <h2 style={{ fontSize: '28px', fontWeight: '600', marginBottom: '48px', fontFamily: 'Fraunces', textAlign: 'center' }}>Giá trị của chúng tôi</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '32px' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '36px', marginBottom: '16px' }}>✓</div>
              <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '12px' }}>Chất lượng</h3>
              <p style={{ color: 'var(--text-2)', lineHeight: '1.6' }}>Sản phẩm được kiểm duyệt kỹ lưỡng, chỉ những mặt hàng tốt nhất mới được bán.</p>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '36px', marginBottom: '16px' }}>★</div>
              <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '12px' }}>Uy tín</h3>
              <p style={{ color: 'var(--text-2)', lineHeight: '1.6' }}>Đã phục vụ hàng ngàn khách hàng hài lòng, luôn giữ cam kết với từng khách.</p>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '36px', marginBottom: '16px' }}>♥</div>
              <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '12px' }}>Chăm sóc</h3>
              <p style={{ color: 'var(--text-2)', lineHeight: '1.6' }}>Hỗ trợ khách hàng trước, trong và sau khi mua. Luôn lắng nghe ý kiến.</p>
            </div>
          </div>
        </section>

        {/* Services */}
        <section style={{ marginBottom: '80px', backgroundColor: 'var(--warm)', borderRadius: '12px', padding: '48px', textAlign: 'center' }}>
          <h2 style={{ fontSize: '28px', fontWeight: '600', marginBottom: '32px', fontFamily: 'Fraunces' }}>Dịch vụ của chúng tôi</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '32px' }}>
            <div>
              <p style={{ fontSize: '28px', marginBottom: '12px' }}>🚚</p>
              <h3 style={{ fontWeight: '600', marginBottom: '8px' }}>Miễn phí vận chuyển</h3>
              <p style={{ color: 'var(--text-2)', fontSize: '14px' }}>Từ 500K trở lên</p>
            </div>
            <div>
              <p style={{ fontSize: '28px', marginBottom: '12px' }}>↩</p>
              <h3 style={{ fontWeight: '600', marginBottom: '8px' }}>Đổi trả</h3>
              <p style={{ color: 'var(--text-2)', fontSize: '14px' }}>Trong 30 ngày</p>
            </div>
            <div>
              <p style={{ fontSize: '28px', marginBottom: '12px' }}>🛡</p>
              <h3 style={{ fontWeight: '600', marginBottom: '8px' }}>Bảo hành chính hãng</h3>
              <p style={{ color: 'var(--text-2)', fontSize: '14px' }}>Theo quy định nhà sản xuất</p>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section style={{ textAlign: 'center', marginBottom: '80px' }}>
          <h2 style={{ fontSize: '28px', fontWeight: '600', marginBottom: '16px', fontFamily: 'Fraunces' }}>Có câu hỏi?</h2>
          <p style={{ color: 'var(--text-2)', marginBottom: '32px' }}>Liên hệ với chúng tôi, chúng tôi sẽ sẵn lòng trợ giúp</p>
          <button onClick={() => window.location.href = '/lien-he'} style={{ padding: '12px 32px', backgroundColor: 'var(--accent)', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: '600', cursor: 'pointer' }}>
            Liên hệ ngay
          </button>
        </section>
      </main>
    </>
  )
}
