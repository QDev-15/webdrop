import { useNavigate, Link } from 'react-router-dom'
import { useCart } from '../contexts/CartContext'
import { useSite } from '../contexts/SiteContext'
import { useDocumentMeta } from '../hooks/useDocumentMeta'

export default function CartPage() {
  const { items, removeItem, subtotal } = useCart()
  const { settings } = useSite()
  const navigate = useNavigate()

  useDocumentMeta({
    title: 'Giỏ hàng — ' + String(settings.site_name || ''),
    description: 'Giỏ hàng của bạn',
  })

  // settings.* đến từ API luôn là string (cột TEXT) — "as number" chỉ là ép kiểu compile-time,
  // KHÔNG chuyển đổi runtime. Thiếu Number() ở đây khiến `subtotal + shippingFee` là phép nối
  // chuỗi (number + string) thay vì cộng số, hiển thị tổng tiền sai hoàn toàn khi có phí ship.
  const shippingFee = subtotal >= Number(settings.free_shipping_threshold || 500000) ? 0 : Number(settings.shipping_fee || 30000)
  const total = subtotal + shippingFee

  if (items.length === 0) {
    return (
      <main className="dg-container" style={{ paddingTop: '80px', paddingBottom: '120px', textAlign: 'center' }}>
        <h1 style={{ marginBottom: '16px' }}>Giỏ hàng trống</h1>
        <p style={{ marginBottom: '32px', color: 'var(--text-2)' }}>Hãy thêm sản phẩm để bắt đầu mua sắm</p>
        <Link to="/" className="dg-btn dg-btn-primary">Quay lại trang chủ</Link>
      </main>
    )
  }

  return (
    <>
      <div className="dg-page-hero">
        <div className="dg-container">
          <h1 className="dg-page-hero__title">Giỏ hàng</h1>
        </div>
      </div>

      <main className="dg-container" style={{ paddingTop: '60px', paddingBottom: '80px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: '40px' }}>
          {/* Cart Items */}
          <div>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid var(--border)' }}>
                  <th style={{ textAlign: 'left', paddingBottom: '16px', fontWeight: '600' }}>Sản phẩm</th>
                  <th style={{ textAlign: 'center', paddingBottom: '16px', fontWeight: '600', width: '80px' }}>Giá</th>
                  <th style={{ textAlign: 'center', paddingBottom: '16px', fontWeight: '600', width: '80px' }}></th>
                </tr>
              </thead>
              <tbody>
                {items.map(item => (
                  <tr key={`${item.slug}`} style={{ borderBottom: '1px solid var(--border-light)' }}>
                    <td style={{ paddingTop: '20px', paddingBottom: '20px' }}>
                      <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                        {item.image && <img src={item.image} alt={item.name} style={{ width: '80px', height: '80px', borderRadius: '8px', objectFit: 'cover', backgroundColor: 'var(--warm)' }} />}
                        <div>
                          <p style={{ fontWeight: '600', marginBottom: '4px' }}>{item.name}</p>
                          {item.color && <p style={{ fontSize: '14px', color: 'var(--text-2)' }}>Màu: {item.color}</p>}
                        </div>
                      </div>
                    </td>
                    <td style={{ paddingTop: '20px', paddingBottom: '20px', textAlign: 'center' }}>
                      <p style={{ fontWeight: '600' }}>{(item.price * (item.qty || 1)).toLocaleString('vi-VN')}đ</p>
                    </td>
                    <td style={{ paddingTop: '20px', paddingBottom: '20px', textAlign: 'right' }}>
                      <button onClick={() => removeItem(item.product_id, item.color, item.size)} style={{ background: 'none', border: 'none', color: 'var(--danger)', cursor: 'pointer', fontSize: '14px' }}>Xóa</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Summary */}
          <div style={{ backgroundColor: 'var(--warm)', borderRadius: '12px', padding: '24px', height: 'fit-content', position: 'sticky', top: '80px' }}>
            <h2 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '20px' }}>Tóm tắt</h2>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', paddingBottom: '12px', borderBottom: '1px solid var(--border-light)' }}>
              <span>Tạm tính</span>
              <span style={{ fontWeight: '600' }}>{subtotal.toLocaleString('vi-VN')}đ</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px', paddingBottom: '12px', borderBottom: '1px solid var(--border-light)' }}>
              <span>Vận chuyển {shippingFee === 0 ? '(Miễn phí)' : ''}</span>
              <span style={{ fontWeight: '600', color: shippingFee === 0 ? 'var(--accent)' : 'var(--text)' }}>{shippingFee.toLocaleString('vi-VN')}đ</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px', fontSize: '18px', fontWeight: '600' }}>
              <span>Tổng cộng</span>
              <span style={{ color: 'var(--accent)' }}>{total.toLocaleString('vi-VN')}đ</span>
            </div>

            <button onClick={() => navigate('/thanh-toan')} style={{ width: '100%', padding: '12px', backgroundColor: 'var(--accent)', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: '600', cursor: 'pointer' }}>
              Tiến hành thanh toán
            </button>

            <Link to="/" style={{ display: 'block', textAlign: 'center', marginTop: '12px', color: 'var(--text-2)', textDecoration: 'none', fontSize: '14px' }}>
              Tiếp tục mua sắm
            </Link>
          </div>
        </div>
      </main>
    </>
  )
}
