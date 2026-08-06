import { Link } from 'react-router-dom'
import { useDocumentMeta } from '../hooks/useDocumentMeta'

export default function PromotionsPage() {
  useDocumentMeta({ title: 'Khuyến mãi', description: 'Các chương trình khuyến mãi hot từ Shop Thể Thao' })

  return (
    <div className="tt-page-wrap">
      <div className="tt-container" style={{ padding: '60px 0' }}>
        <h1 style={{ marginBottom: 12 }}>Khuyến mãi</h1>
        <p style={{ marginBottom: 40, color: 'var(--text-2)' }}>Các chương trình khuyến mãi độc quyền dành cho bạn</p>

        <div style={{ background: 'var(--warm)', padding: 40, borderRadius: 12, textAlign: 'center' }}>
          <div style={{ fontSize: 48, marginBottom: 20 }}>🎉</div>
          <h2 style={{ fontSize: 28, fontWeight: 600, marginBottom: 12 }}>Giảm 20% tất cả sản phẩm</h2>
          <p style={{ fontSize: 16, color: 'var(--text-2)', marginBottom: 24 }}>Với đơn hàng từ 1.000.000đ</p>
          <Link
            to="/"
            style={{
              display: 'inline-block',
              padding: '14px 28px',
              background: 'var(--accent)',
              color: 'white',
              textDecoration: 'none',
              borderRadius: 8,
              fontWeight: 600,
            }}
          >
            Mua ngay
          </Link>
        </div>

        <div style={{ marginTop: 40 }}>
          <h3 style={{ fontSize: 20, fontWeight: 600, marginBottom: 20 }}>Các chương trình khác</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 20 }}>
            {[
              { name: 'Miễn phí ship', desc: 'Với đơn từ 500K' },
              { name: 'Đổi size miễn phí', desc: 'Trong 30 ngày' },
              { name: 'Bảo hành 12 tháng', desc: 'Lỗi từ nhà sản xuất' },
            ].map((promo, i) => (
              <div key={i} style={{ padding: 20, background: 'white', border: '1px solid var(--border)', borderRadius: 8 }}>
                <h4 style={{ fontWeight: 600, marginBottom: 6 }}>{promo.name}</h4>
                <p style={{ color: 'var(--text-2)', fontSize: 14 }}>{promo.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
