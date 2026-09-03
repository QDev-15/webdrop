import { Link, useNavigate } from 'react-router-dom'
import { useCart } from '../contexts/CartContext'
import { useSite } from '../contexts/SiteContext'
import { useDocumentMeta } from '../hooks/useDocumentMeta'
import { fmtVND } from '../data/filters'

export default function CartPage() {
  const { items, subtotal, updateQty, removeItem } = useCart()
  const { settings } = useSite()
  const navigate = useNavigate()

  useDocumentMeta({
    title: 'Giỏ hàng — MỘC AN',
    description: 'Giỏ hàng của bạn tại MỘC AN — kiểm tra sản phẩm, số lượng và tổng thanh toán trước khi đặt hàng.',
  })

  const shippingFee = Number(settings.shipping_fee || 200000)
  const freeShipThreshold = Number(settings.free_shipping_threshold || 5000000)
  const shipping = subtotal === 0 || subtotal >= freeShipThreshold ? 0 : shippingFee
  const total = subtotal + shipping

  return (
    <section className="nt-container" style={{ paddingTop: 'calc(var(--topbar-h) + var(--nav-h) + 48px)', paddingBottom: 80 }}>
      <div className="nt-sec-head" style={{ marginBottom: 36 }}>
        <div className="nt-eyebrow">Giỏ hàng</div>
        <h1 className="nt-sec-title">Giỏ hàng <em>của bạn</em></h1>
      </div>

      {items.length === 0 ? (
        <div className="nt-cart-empty">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.4}><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" /><line x1="3" y1="6" x2="21" y2="6" /><path d="M16 10a4 4 0 01-8 0" /></svg>
          <h3>Giỏ hàng của bạn đang trống</h3>
          <p style={{ color: 'var(--text-2)', marginBottom: 24 }}>Hãy khám phá các sản phẩm nội thất tối giản của MỘC AN.</p>
          <Link to="/" className="nt-btn">Khám phá sản phẩm</Link>
        </div>
      ) : (
        <div className="nt-cart-grid">
          <div>
            {items.map(item => (
              <div className="nt-cart-row" key={`${item.product_id}-${item.color ?? ''}-${item.size ?? ''}`}>
                <img src={item.image} alt={item.name} />
                <div>
                  <div className="nt-cart-name">{item.name}</div>
                  <div className="nt-cart-meta">{fmtVND(item.price)} / sản phẩm</div>
                </div>
                <div className="nt-qty-box">
                  <button onClick={() => updateQty(item.product_id, item.qty - 1, item.color, item.size)}>−</button>
                  <input type="text" value={item.qty} readOnly />
                  <button onClick={() => updateQty(item.product_id, item.qty + 1, item.color, item.size)}>+</button>
                </div>
                <div>
                  <div style={{ fontWeight: 500 }}>{fmtVND(item.price * item.qty)}</div>
                  <button className="nt-cart-remove" onClick={() => removeItem(item.product_id, item.color, item.size)}>Xóa</button>
                </div>
              </div>
            ))}
          </div>
          <div className="nt-cart-summary">
            <h3>Tóm tắt đơn hàng</h3>
            <div className="nt-cart-sum-row"><span>Tạm tính</span><span>{fmtVND(subtotal)}</span></div>
            <div className="nt-cart-sum-row"><span>Phí vận chuyển</span><span>{shipping === 0 ? 'Miễn phí' : fmtVND(shipping)}</span></div>
            <div className="nt-cart-sum-row total"><span>Tổng cộng</span><span>{fmtVND(total)}</span></div>
            <button className="nt-btn" style={{ width: '100%', marginTop: 20 }} onClick={() => navigate('/thanh-toan')}>Tiến hành đặt hàng</button>
            <Link to="/" className="nt-link" style={{ marginTop: 16, justifyContent: 'center', width: '100%' }}>Tiếp tục mua sắm</Link>
          </div>
        </div>
      )}
    </section>
  )
}
