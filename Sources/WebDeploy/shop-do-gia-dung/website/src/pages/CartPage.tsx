import { Link, useNavigate } from 'react-router-dom'
import { useCart } from '../contexts/CartContext'
import { useSite } from '../contexts/SiteContext'
import { useDocumentMeta } from '../hooks/useDocumentMeta'

const FALLBACK = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Crect fill='%23f5ede0' width='160' height='160'/%3E%3C/svg%3E"

export default function CartPage() {
  const { items, removeItem, updateQty, count } = useCart()
  const { settings } = useSite()
  const navigate = useNavigate()

  useDocumentMeta({
    title: `Giỏ hàng (${count}) – Shop Đồ Gia Dụng`,
    description: 'Xem lại giỏ hàng của bạn trước khi thanh toán.',
  })

  // Đảm bảo dùng Number() — không dùng "as number" (chỉ là type-assertion, không convert)
  const shippingFee = Number(settings.shipping_fee || 50000)
  const freeThreshold = Number(settings.free_shipping_threshold || 500000)

  const subtotal = items.reduce((s, i) => s + i.price * i.qty, 0)
  const actualShipping = subtotal >= freeThreshold ? 0 : shippingFee
  const total = subtotal + actualShipping

  if (items.length === 0) {
    return (
      <>
        <div className="dg-page-hero">
          <div className="dg-container">
            <p className="dg-page-hero__label">Mua sắm</p>
            <h1 className="dg-page-hero__title">Giỏ hàng</h1>
          </div>
        </div>
        <div className="dg-container" style={{ padding: '0 clamp(16px,4vw,64px)' }}>
          <div className="dg-cart-empty">
            <div className="dg-cart-empty__icon">🛒</div>
            <p className="dg-cart-empty__text">Giỏ hàng của bạn đang trống</p>
            <Link to="/san-pham" className="dg-btn dg-btn--primary dg-btn--lg">Tiếp tục mua sắm</Link>
          </div>
        </div>
      </>
    )
  }

  return (
    <>
      <div className="dg-page-hero">
        <div className="dg-container">
          <p className="dg-page-hero__label">Mua sắm</p>
          <h1 className="dg-page-hero__title">Giỏ hàng ({count} sản phẩm)</h1>
        </div>
      </div>

      <div className="dg-container" style={{ padding: '32px clamp(16px,4vw,64px) 64px' }}>
        <div className="dg-cart-layout">
          {/* Items */}
          <div>
            <table className="dg-cart-table">
              <thead>
                <tr>
                  <th colSpan={2}>Sản phẩm</th>
                  <th>Đơn giá</th>
                  <th>Số lượng</th>
                  <th>Thành tiền</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {items.map(item => (
                  <tr key={`${item.product_id}-${item.color}-${item.size}`}>
                    <td style={{ padding: '16px 0' }}>
                      <div className="dg-cart-item__img">
                        <img
                          src={item.image || ''}
                          alt={item.name}
                          onError={e => { (e.target as HTMLImageElement).src = FALLBACK }}
                        />
                      </div>
                    </td>
                    <td style={{ padding: '16px 12px' }}>
                      <p className="dg-cart-item__name">{item.name}</p>
                      {item.color && <p className="dg-cart-item__cat">Màu: {item.color}</p>}
                      {item.size && <p className="dg-cart-item__cat">Kích cỡ: {item.size}</p>}
                    </td>
                    <td style={{ fontSize: 15, fontWeight: 600, color: 'var(--accent)', padding: '16px 0', whiteSpace: 'nowrap' }}>
                      {item.price.toLocaleString('vi-VN')}đ
                    </td>
                    <td style={{ padding: '16px 12px' }}>
                      <div className="dg-qty">
                        <button className="dg-qty__btn" onClick={() => updateQty(item.product_id, item.qty - 1, item.color, item.size)}>−</button>
                        <span className="dg-qty__val">{item.qty}</span>
                        <button className="dg-qty__btn" onClick={() => updateQty(item.product_id, item.qty + 1, item.color, item.size)}>+</button>
                      </div>
                    </td>
                    <td style={{ fontSize: 15, fontWeight: 700, color: 'var(--text)', padding: '16px 0', whiteSpace: 'nowrap' }}>
                      {(item.price * item.qty).toLocaleString('vi-VN')}đ
                    </td>
                    <td style={{ padding: '16px 0 16px 12px' }}>
                      <button
                        className="dg-cart-item__remove"
                        onClick={() => removeItem(item.product_id, item.color, item.size)}
                        title="Xóa sản phẩm"
                      >
                        ✕
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div style={{ marginTop: 20 }}>
              <Link to="/san-pham" className="dg-btn dg-btn--ghost">
                ← Tiếp tục mua sắm
              </Link>
            </div>
          </div>

          {/* Summary */}
          <div>
            <div className="dg-cart-summary">
              <h2 className="dg-cart-summary__title">Tóm tắt đơn hàng</h2>

              <div className="dg-cart-summary__row">
                <span>Tạm tính ({count} sản phẩm)</span>
                <span>{subtotal.toLocaleString('vi-VN')}đ</span>
              </div>

              <div className="dg-cart-summary__row">
                <span>Phí vận chuyển</span>
                <span>
                  {actualShipping === 0
                    ? <span style={{ color: 'var(--sage)', fontWeight: 600 }}>Miễn phí</span>
                    : `${actualShipping.toLocaleString('vi-VN')}đ`
                  }
                </span>
              </div>

              {subtotal < freeThreshold && (
                <p style={{ fontSize: 13, color: 'var(--text-3)', padding: '8px 0', borderBottom: '1px solid var(--border-light)' }}>
                  Mua thêm <strong>{(freeThreshold - subtotal).toLocaleString('vi-VN')}đ</strong> để được miễn phí giao hàng
                </p>
              )}

              <div className="dg-cart-summary__row dg-cart-summary__row--total" style={{ borderBottom: 'none', paddingTop: 14 }}>
                <span>Tổng cộng</span>
                <span style={{ color: 'var(--accent)' }}>{total.toLocaleString('vi-VN')}đ</span>
              </div>

              <button
                className="dg-btn dg-btn--primary dg-btn--lg"
                style={{ width: '100%', justifyContent: 'center', marginTop: 20 }}
                onClick={() => navigate('/thanh-toan')}
              >
                Thanh toán ngay →
              </button>

              <p style={{ fontSize: 12, color: 'var(--text-3)', textAlign: 'center', marginTop: 14 }}>
                🔒 Thanh toán an toàn & bảo mật
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
