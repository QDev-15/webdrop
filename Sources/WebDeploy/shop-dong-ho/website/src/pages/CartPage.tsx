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
    title: 'Giỏ hàng — MERIDIAN',
    description: 'Giỏ hàng của bạn tại MERIDIAN — đồng hồ chính hãng đa thương hiệu.',
  })

  const freeShipThreshold = Number(settings.free_shipping_threshold || 2000000)
  const shippingFee = Number(settings.shipping_fee || 30000)
  const shipping = subtotal === 0 || subtotal >= freeShipThreshold ? 0 : shippingFee
  const total = subtotal + shipping

  return (
    <>
      <section className="dh-catalog-header">
        <div className="dh-container">
          <div className="dh-breadcrumb"><Link to="/">Trang chủ</Link> / <span>Giỏ hàng</span></div>
          <h1>Giỏ hàng của bạn</h1>
          <p>Kiểm tra lại sản phẩm trước khi tiến hành thanh toán</p>
        </div>
      </section>

      <section className="dh-sec">
        <div className="dh-container">
          {items.length === 0 ? (
            <div className="dh-cart-empty">
              <div className="ico">🛒</div>
              <h3>Giỏ hàng của bạn đang trống</h3>
              <p style={{ color: 'var(--text-2)', marginBottom: 20 }}>Khám phá bộ sưu tập đồng hồ chính hãng của MERIDIAN ngay.</p>
              <Link to="/san-pham" className="dh-btn dh-btn-solid">Khám phá sản phẩm</Link>
            </div>
          ) : (
            <div className="dh-cart-wrap">
              <div>
                <div>
                  {items.map(item => (
                    <div className="dh-cart-item" key={item.product_id}>
                      <img src={item.image} alt={item.name} />
                      <div>
                        <h4><Link to={`/san-pham/${item.slug}`}>{item.name}</Link></h4>
                        <div style={{ fontWeight: 800, color: 'var(--accent)', marginTop: 6 }}>{fmtVND(item.price)}</div>
                      </div>
                      <div className="dh-qty-box">
                        <button type="button" onClick={() => updateQty(item.product_id, item.qty - 1)}>−</button>
                        <input type="text" value={item.qty} readOnly />
                        <button type="button" onClick={() => updateQty(item.product_id, item.qty + 1)}>+</button>
                      </div>
                      <button className="dh-cart-remove" aria-label="Xóa sản phẩm" onClick={() => removeItem(item.product_id)}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M3 6h18M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2m3 0v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6h14z" /></svg>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
              <div className="dh-cart-summary">
                <h3 style={{ fontSize: 18, marginBottom: 20 }}>Tóm tắt đơn hàng</h3>
                <div className="dh-cart-summary-row"><span>Tạm tính</span><span>{fmtVND(subtotal)}</span></div>
                <div className="dh-cart-summary-row"><span>Phí vận chuyển</span><span>{shipping === 0 ? 'Miễn phí' : fmtVND(shipping)}</span></div>
                <div className="dh-cart-summary-row total"><span>Tổng cộng</span><span>{fmtVND(total)}</span></div>
                <p style={{ fontSize: 12.5, color: 'var(--text-3)', margin: '10px 0 20px' }}>Miễn phí vận chuyển cho đơn hàng từ {fmtVND(freeShipThreshold)}</p>
                <button className="dh-btn dh-btn-solid" style={{ width: '100%' }} onClick={() => navigate('/thanh-toan')}>Tiến hành thanh toán</button>
                <Link to="/san-pham" className="dh-btn dh-btn-outline" style={{ width: '100%', marginTop: 10 }}>Tiếp tục mua sắm</Link>
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  )
}
