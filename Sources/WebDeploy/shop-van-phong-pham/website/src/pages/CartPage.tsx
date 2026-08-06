import { Link, useNavigate } from 'react-router-dom'
import { useCart } from '../contexts/CartContext'
import { useSite } from '../contexts/SiteContext'
import { useDocumentMeta } from '../hooks/useDocumentMeta'
import { fmt } from '../lib/format'

export default function CartPage() {
  const { items, subtotal, updateQty, removeItem } = useCart()
  const { settings } = useSite()
  const navigate = useNavigate()

  useDocumentMeta({
    title: `Giỏ hàng — ${settings.site_name || 'OFFICEHUB'}`,
    description: `Xem và thanh toán giỏ hàng văn phòng phẩm tại ${settings.site_name || 'OFFICEHUB'}.`,
  })

  const shippingFee = Number(settings.shipping_fee || 0)
  const freeShipThreshold = Number(settings.free_shipping_threshold || 0)
  const effectiveShipping = freeShipThreshold > 0 && subtotal >= freeShipThreshold ? 0 : shippingFee
  const total = subtotal + effectiveShipping

  if (items.length === 0) {
    return (
      <div className="vp-cart-wrap">
        <div className="vp-container">
          <h1 className="vp-cart-title">Giỏ hàng của bạn</h1>
          <div className="vp-cart-empty">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" /><line x1="3" y1="6" x2="21" y2="6" /><path d="M16 10a4 4 0 01-8 0" /></svg>
            <h3>Giỏ hàng trống</h3>
            <p>Bạn chưa có sản phẩm nào trong giỏ hàng.</p>
            <Link to="/" className="vp-btn vp-btn-primary" style={{ marginTop: 16 }}>Tiếp tục mua sắm</Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="vp-cart-wrap">
      <div className="vp-container">
        <h1 className="vp-cart-title">Giỏ hàng của bạn</h1>

        <div className="vp-cart-grid">
          <div>
            <div className="vp-cart-items">
              {items.map(item => (
                <div className="vp-cart-item" key={item.product_id}>
                  <div className="vp-cart-item-img">
                    <img src={item.image} alt={item.name} loading="lazy" />
                  </div>
                  <div>
                    <div className="vp-cart-item-name">{item.name}</div>
                    <div className="vp-cart-qty" style={{ marginTop: 8 }}>
                      <button aria-label="Giảm" onClick={() => updateQty(item.product_id, item.qty - 1)}>−</button>
                      <span>{item.qty}</span>
                      <button aria-label="Tăng" onClick={() => updateQty(item.product_id, item.qty + 1)}>+</button>
                    </div>
                  </div>
                  <div className="vp-cart-item-price">{fmt(item.price * item.qty)}</div>
                  <button className="vp-cart-item-remove" aria-label="Xóa sản phẩm" onClick={() => removeItem(item.product_id)}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M18 6L6 18M6 6l12 12" /></svg>
                  </button>
                </div>
              ))}
            </div>
            <div style={{ marginTop: 12 }}>
              <Link to="/" className="vp-btn vp-btn-ghost vp-btn-sm">← Tiếp tục mua sắm</Link>
            </div>
          </div>

          <div className="vp-cart-summary">
            <div className="vp-cart-summary-title">Tóm tắt đơn hàng</div>
            <div className="vp-summary-row">
              <span>Tạm tính</span>
              <span>{fmt(subtotal)}</span>
            </div>
            <div className="vp-summary-row">
              <span>Phí vận chuyển</span>
              <span>{effectiveShipping === 0 ? 'Miễn phí' : fmt(effectiveShipping)}</span>
            </div>
            {subtotal >= freeShipThreshold && freeShipThreshold > 0 && (
              <div className="vp-summary-row" style={{ color: '#10b981', fontSize: 12, fontWeight: 600 }}>
                <span>✓ Bạn được miễn phí vận chuyển!</span>
              </div>
            )}

            <div className="vp-summary-row vp-summary-row-total">
              <span>Tổng cộng</span>
              <span>{fmt(total)}</span>
            </div>
            <button className="vp-btn vp-btn-primary vp-btn-full vp-btn-lg" style={{ marginTop: 16 }} onClick={() => navigate('/thanh-toan')}>
              Đặt hàng ngay
            </button>
            <div style={{ textAlign: 'center', marginTop: 10, fontSize: 12, color: 'var(--text-3)' }}>
              🔒 Thanh toán an toàn & bảo mật
            </div>
            <div style={{ marginTop: 14, paddingTop: 14, borderTop: '1px solid var(--border-light)' }}>
              <div className="vp-trust-strip" style={{ flexDirection: 'column', alignItems: 'flex-start', gap: 6 }}>
                <span>Hàng chính hãng 100%</span>
                <span>Đổi trả trong 30 ngày</span>
                <span>Giao hàng nhanh toàn quốc</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
