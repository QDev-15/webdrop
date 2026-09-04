import { Link } from 'react-router-dom'
import { useCart } from '../contexts/CartContext'
import { useSite } from '../contexts/SiteContext'
import { useDocumentMeta } from '../hooks/useDocumentMeta'

function formatVND(n: number) { return n.toLocaleString('vi-VN') + '₫' }

export default function CartPage() {
  const { items, subtotal, updateQty, removeItem } = useCart()
  const { settings } = useSite()

  useDocumentMeta({
    title: 'Giỏ hàng — Pet Haus',
    description: 'Giỏ hàng — Pet Haus, cửa hàng thú cưng chính hãng.',
  })

  const freeShipThreshold = Number(settings.free_shipping_threshold || 400000)
  const shipFee = Number(settings.shipping_fee || 25000)
  const shipping = items.length === 0 ? 0 : (subtotal >= freeShipThreshold ? 0 : shipFee)
  const total = subtotal + shipping

  return (
    <>
      <div className="tc-breadcrumb">
        <div className="tc-container"><Link to="/">Trang chủ</Link><span className="tc-bc-sep">/</span><span>Giỏ hàng</span></div>
      </div>

      <main className="tc-sec-sm">
        <div className="tc-container">
          <h1 style={{ fontFamily: 'var(--head)', fontSize: 28, fontWeight: 800, marginBottom: 32 }}>Giỏ hàng của bạn</h1>

          {items.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '80px 0' }}>
              <div style={{ fontSize: 56, marginBottom: 20 }}>🛒</div>
              <p style={{ color: 'var(--text-2)', fontSize: 16, marginBottom: 24 }}>Giỏ hàng đang trống — hãy chọn vài món cho bé cưng nhé!</p>
              <Link to="/" className="tc-btn tc-btn-primary">Tiếp tục mua sắm</Link>
            </div>
          ) : (
            <div className="tc-cart-layout">
              <div>
                <div>
                  {items.map((item, idx) => (
                    <div className="tc-cart-item" key={`${item.product_id}-${item.size ?? ''}-${idx}`}>
                      <img src={item.image} alt={item.name} className="tc-cart-item-img" />
                      <div>
                        <div className="tc-cart-item-name">{item.name}</div>
                        {item.size && <div className="tc-cart-item-meta"><span>Size: {item.size}</span></div>}
                        <div className="tc-cart-item-price">{formatVND(item.price)}</div>
                      </div>
                      <div className="tc-cart-item-qty">
                        <button className="tc-qty-sm" aria-label="Giảm" onClick={() => updateQty(item.product_id, item.qty - 1, item.color, item.size)}>−</button>
                        <span className="tc-qty-num">{item.qty}</span>
                        <button className="tc-qty-sm" aria-label="Tăng" onClick={() => updateQty(item.product_id, item.qty + 1, item.color, item.size)}>+</button>
                      </div>
                      <div className="tc-cart-item-total">{formatVND(item.price * item.qty)}</div>
                      <button className="tc-cart-item-remove" aria-label="Xóa sản phẩm" onClick={() => removeItem(item.product_id, item.color, item.size)}>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} width="18"><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>
                      </button>
                    </div>
                  ))}
                </div>
                <Link to="/" className="tc-btn tc-btn-ghost" style={{ marginTop: 20, display: 'inline-flex' }}>← Tiếp tục mua sắm</Link>
              </div>
              <div>
                <div className="tc-cart-summary">
                  <h3>Tóm tắt đơn hàng</h3>
                  <div className="tc-summary-row"><span>Tạm tính</span><span>{formatVND(subtotal)}</span></div>
                  <div className="tc-summary-row"><span>Phí vận chuyển</span><span>{shipping === 0 ? 'Miễn phí' : formatVND(shipping)}</span></div>
                  <div className="tc-summary-row tc-summary-total"><span>Tổng cộng</span><span>{formatVND(total)}</span></div>
                  <div className="tc-shipping-note">
                    {subtotal >= freeShipThreshold
                      ? <span style={{ color: '#1e8a5c' }}>✓ Bạn được miễn phí vận chuyển!</span>
                      : <>Mua thêm <strong style={{ color: 'var(--accent)' }}>{formatVND(freeShipThreshold - subtotal)}</strong> để được miễn phí ship</>}
                  </div>
                  <Link to="/thanh-toan" className="tc-btn tc-btn-primary tc-btn-block tc-btn-lg">Tiến hành thanh toán →</Link>
                  <div className="tc-cart-trust">
                    <span>🔒 Thanh toán bảo mật</span>
                    <span>🩺 Đổi trả trong 7 ngày</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </>
  )
}
