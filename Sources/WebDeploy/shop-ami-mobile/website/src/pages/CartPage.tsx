import { Link } from 'react-router-dom'
import { useCart } from '../contexts/CartContext'
import { useSite } from '../contexts/SiteContext'
import { useDocumentMeta } from '../hooks/useDocumentMeta'
import { fmt } from '../lib/format'

export default function CartPage() {
  const { items, subtotal, updateQty, removeItem } = useCart()
  const { settings } = useSite()
  useDocumentMeta({
    title: `Giỏ hàng — ${settings.site_name || 'AMI Mobile'}`,
    description: `Xem và quản lý giỏ hàng của bạn tại ${settings.site_name || 'AMI Mobile'}.`,
  })

  const shippingFee = Number(settings.shipping_fee || 0)
  const freeShipThreshold = Number(settings.free_shipping_threshold || 0)
  const effectiveShipping = freeShipThreshold > 0 && subtotal >= freeShipThreshold ? 0 : shippingFee
  const total = subtotal + effectiveShipping

  return (
    <>
      <div className="mb-page-hero">
        <div className="mb-container">
          <div className="mb-breadcrumb">
            <Link to="/">Trang chủ</Link><span>/</span><span>Giỏ hàng</span>
          </div>
          <div className="mb-label">Mua sắm</div>
          <h1>Giỏ hàng</h1>
        </div>
      </div>

      <section className="mb-sec" style={{ padding: '40px 0 72px' }}>
        <div className="mb-container">
          {items.length === 0 ? (
            <div className="row g-4 g-lg-5">
              <div className="col-12 text-center" style={{ padding: '80px 0' }}>
                <div style={{ fontSize: 48, marginBottom: 16 }}>🛒</div>
                <h3 style={{ fontSize: 22, marginBottom: 8 }}>Giỏ hàng trống</h3>
                <p style={{ color: 'var(--text-2)', marginBottom: 24 }}>Thêm sản phẩm vào giỏ để tiến hành đặt mua.</p>
                <Link to="/san-pham" className="mb-btn">Tiếp tục mua sắm</Link>
              </div>
            </div>
          ) : (
            <div className="row g-4 g-lg-5">
              <div className="col-lg-8">
                <div className="mb-cart-table">
                  <div className="mb-cart-header">
                    <span>Sản phẩm</span><span></span><span>Số lượng</span><span>Thành tiền</span><span></span>
                  </div>
                  {items.map(item => (
                    <div className="mb-cart-row" key={`${item.product_id}-${item.color ?? ''}-${item.size ?? ''}`}>
                      <div className="mb-cart-img">
                        <img src={item.image} alt={item.name} />
                      </div>
                      <div className="mb-cart-info">
                        <div className="mb-cart-name">{item.name}</div>
                        <div className="mb-cart-unit">{fmt(item.price)}</div>
                      </div>
                      <div className="mb-cart-qty-wrap">
                        <button className="mb-qty-btn" onClick={() => updateQty(item.product_id, item.qty - 1, item.color, item.size)}>−</button>
                        <span className="mb-qty-val">{item.qty}</span>
                        <button className="mb-qty-btn" onClick={() => updateQty(item.product_id, item.qty + 1, item.color, item.size)}>+</button>
                      </div>
                      <div className="mb-cart-sub">{fmt(item.price * item.qty)}</div>
                      <button className="mb-cart-remove" aria-label="Xóa" onClick={() => removeItem(item.product_id, item.color, item.size)}>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
                      </button>
                    </div>
                  ))}
                </div>
                <div className="mb-cart-continue">
                  <Link to="/san-pham" className="mb-btn mb-btn-outline">← Tiếp tục mua sắm</Link>
                </div>
              </div>
              <div className="col-lg-4">
                <div className="mb-cart-summary">
                  <h3 className="mb-cart-summary-title">Tóm tắt đơn hàng</h3>
                  <div className="mb-cart-summary-row"><span>Tạm tính</span><span>{fmt(subtotal)}</span></div>
                  <div className="mb-cart-summary-row">
                    <span>Phí vận chuyển</span>
                    <span>{effectiveShipping === 0 ? 'Miễn phí' : fmt(effectiveShipping)}</span>
                  </div>
                  <div className="mb-cart-summary-total"><span>Tổng cộng</span><span>{fmt(total)}</span></div>
                  <Link to="/thanh-toan" className="mb-btn" style={{ width: '100%', display: 'block', textAlign: 'center', marginTop: 20 }}>Đặt hàng</Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  )
}
