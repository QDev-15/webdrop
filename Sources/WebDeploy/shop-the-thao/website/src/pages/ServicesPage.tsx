import { useDocumentMeta } from '../hooks/useDocumentMeta'

export default function ServicesPage() {
  useDocumentMeta({ title: 'Dịch vụ', description: 'Các dịch vụ hỗ trợ khách hàng của Shop Thể Thao' })

  return (
    <div className="tt-page-wrap">
      <div className="tt-container" style={{ padding: '60px 0' }}>
        <h1 style={{ marginBottom: 12 }}>Dịch vụ</h1>
        <p style={{ marginBottom: 40, color: 'var(--text-2)' }}>Chúng tôi cam kết mang lại trải nghiệm mua sắm tốt nhất</p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 24 }}>
          {[
            {
              icon: '🚚',
              name: 'Giao hàng nhanh',
              desc: 'Vận chuyển an toàn, nhanh chóng đến tay bạn trong 2-3 ngày',
            },
            {
              icon: '🔄',
              name: 'Đổi hàng dễ dàng',
              desc: 'Không vừa size? Đổi miễn phí trong 30 ngày, không cần hỏi lý do',
            },
            {
              icon: '💯',
              name: 'Hàng chính hãng 100%',
              desc: 'Toàn bộ sản phẩm từ nhà sản xuất, đảm bảo chất lượng',
            },
            {
              icon: '✓',
              name: 'Bảo hành toàn diện',
              desc: 'Bảo hành 12 tháng cho lỗi từ nhà sản xuất',
            },
            {
              icon: '💬',
              name: 'Hỗ trợ 24/7',
              desc: 'Liên hệ Zalo, phone hoặc email, chúng tôi sẵn sàng giúp',
            },
            {
              icon: '💳',
              name: 'Thanh toán linh hoạt',
              desc: 'Cod hoặc chuyển khoản, bạn chọn cách nào cũng được',
            },
          ].map((svc, i) => (
            <div
              key={i}
              style={{
                padding: 24,
                background: 'white',
                border: '1px solid var(--border)',
                borderRadius: 8,
              }}
            >
              <div style={{ fontSize: 40, marginBottom: 12 }}>{svc.icon}</div>
              <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 8 }}>{svc.name}</h3>
              <p style={{ fontSize: 14, color: 'var(--text-2)' }}>{svc.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
