import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useCart } from '../contexts/CartContext'
import { useSite } from '../contexts/SiteContext'
import { useDocumentMeta } from '../hooks/useDocumentMeta'

function fmt(n: number) {
  return n.toLocaleString('vi-VN') + 'đ'
}

export default function CartPage() {
  useDocumentMeta({
    title: 'Giỏ Hàng — PhotoPro Máy Ảnh & Thiết Bị Nhiếp Ảnh',
    description: 'Giỏ hàng của bạn tại PhotoPro — kiểm tra thiết bị, số lượng và thanh toán an toàn.',
  })

  const { items, subtotal, updateQty, removeItem } = useCart()
  const { products } = useSite()
  const [couponInput, setCouponInput] = useState('')
  const [couponMsg, setCouponMsg] = useState('')

  const total = subtotal

  const applyCoupon = () => {
    const code = couponInput.trim().toUpperCase()
    if (!code) return
    setCouponMsg(`Mã "${code}" sẽ được áp dụng ở bước thanh toán — vui lòng liên hệ shop nếu cần hỗ trợ mã giảm giá.`)
  }

  const suggestions = products.filter(p => !items.some(i => i.product_id === p.id)).slice(0, 4)

  if (items.length === 0) {
    return (
      <div className="ma-container ma-cart-wrap">
        <div className="ma-breadcrumb ma-on-light" style={{ marginBottom: 24 }}>
          <Link to="/">Trang chủ</Link><i className="bi bi-chevron-right" style={{ fontSize: 10 }} /><span>Giỏ hàng</span>
        </div>
        <div style={{ textAlign: 'center', padding: '60px 0 90px' }}>
          <div style={{ fontSize: 56, marginBottom: 20 }}><i className="bi bi-bag-x" /></div>
          <h1 className="ma-page-title" style={{ color: 'var(--dark)' }}>Giỏ hàng của bạn đang trống</h1>
          <Link to="/san-pham" className="ma-btn ma-btn-primary" style={{ marginTop: 20 }}>
            <i className="bi bi-camera" /> Khám phá sản phẩm
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="ma-container ma-cart-wrap">
      <div className="ma-breadcrumb ma-on-light" style={{ marginBottom: 24 }}>
        <Link to="/">Trang chủ</Link><i className="bi bi-chevron-right" style={{ fontSize: 10 }} /><span>Giỏ hàng</span>
      </div>
      <h1 className="ma-page-title" style={{ color: 'var(--dark)', marginBottom: 32 }}>Giỏ hàng của bạn</h1>

      <div className="ma-cart-layout">
        <div className="ma-cart-table-wrap">
          <table className="ma-cart-table">
            <thead>
              <tr>
                <th>Sản phẩm</th>
                <th>Đơn giá</th>
                <th>Số lượng</th>
                <th>Tạm tính</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {items.map(item => (
                <tr key={`${item.product_id}-${item.color ?? ''}-${item.size ?? ''}`}>
                  <td>
                    <div className="ma-cart-item-wrap">
                      <img className="ma-cart-img" src={item.image} alt={item.name} loading="lazy" />
                      <div>
                        <div className="ma-cart-name">{item.name}</div>
                        {(item.color || item.size) && (
                          <div className="ma-cart-meta">
                            {item.color ? `Màu: ${item.color}` : ''}{item.color && item.size ? ' · ' : ''}{item.size ? `Gói: ${item.size}` : ''}
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="ma-cart-price">{fmt(item.price)}</td>
                  <td>
                    <div className="ma-cart-qty">
                      <button type="button" aria-label="Giảm số lượng" onClick={() => updateQty(item.product_id, item.qty - 1, item.color, item.size)}>−</button>
                      <input type="number" value={item.qty} min={1} max={10} readOnly aria-label={`Số lượng ${item.name}`} />
                      <button type="button" aria-label="Tăng số lượng" onClick={() => updateQty(item.product_id, item.qty + 1, item.color, item.size)}>+</button>
                    </div>
                  </td>
                  <td className="ma-cart-price ma-cart-subtotal">{fmt(item.price * item.qty)}</td>
                  <td><button type="button" className="ma-cart-del" aria-label="Xóa sản phẩm" onClick={() => removeItem(item.product_id, item.color, item.size)}><i className="bi bi-trash" /></button></td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="ma-trust-badges-strip">
            <div className="ma-trust-badge-item"><i className="bi bi-shield-check" /> Hàng chính hãng, bảo hành 24 tháng</div>
            <div className="ma-trust-badge-item"><i className="bi bi-truck" /> Giao hàng toàn quốc</div>
            <div className="ma-trust-badge-item"><i className="bi bi-arrow-counterclockwise" /> Đổi trả trong 7 ngày</div>
            <div className="ma-trust-badge-item"><i className="bi bi-lock" /> Thanh toán an toàn</div>
          </div>

          <div style={{ display: 'flex', gap: 12, marginTop: 24, flexWrap: 'wrap' }}>
            <Link to="/san-pham" className="ma-btn ma-btn-ghost"><i className="bi bi-arrow-left" /> Tiếp tục mua sắm</Link>
          </div>
        </div>

        <aside className="ma-order-summary">
          <div className="ma-summary-title">Tóm tắt đơn hàng</div>
          <div className="ma-summary-row"><span>Tạm tính</span><span>{fmt(subtotal)}</span></div>
          <div className="ma-summary-row"><span>Phí giao hàng bảo hiểm</span><span>Tính ở bước thanh toán</span></div>

          <div className="ma-coupon-row">
            <input type="text" value={couponInput} onChange={e => setCouponInput(e.target.value)} placeholder="Mã giảm giá" aria-label="Mã giảm giá" />
            <button type="button" onClick={applyCoupon}>Áp dụng</button>
          </div>
          {couponMsg && <p style={{ fontSize: 12, color: 'var(--text-3)', marginTop: -8, marginBottom: 8 }}>{couponMsg}</p>}

          <div className="ma-summary-total">
            <span className="ma-summary-total-label">Tổng cộng</span>
            <span className="ma-summary-total-val">{fmt(total)}</span>
          </div>

          <Link to="/thanh-toan" className="ma-btn ma-btn-primary ma-btn-full" style={{ marginTop: 20 }}>
            Tiến hành thanh toán <i className="bi bi-arrow-right" />
          </Link>
          <p className="ma-secure-note"><i className="bi bi-shield-check" /> Thanh toán an toàn · Kiểm tra máy khi nhận hàng</p>
        </aside>
      </div>

      {suggestions.length > 0 && (
        <section style={{ paddingBottom: 90 }}>
          <div className="ma-sec-header" data-reveal>
            <div className="ma-eyebrow"><i className="bi bi-bag-plus" /> Gợi ý thêm</div>
            <h2 className="ma-sec-title">Có thể bạn <em>cũng cần</em></h2>
          </div>
          <div className="ma-suggest-grid">
            {suggestions.map(p => (
              <Link to={`/san-pham/${p.slug}`} className="ma-prod-card" key={p.id}>
                <div className="ma-prod-thumb">
                  {p.badge && <span className={'ma-prod-badge ' + (p.price_sale ? 'ma-prod-badge-sale' : p.is_new ? 'ma-prod-badge-new' : 'ma-prod-badge-hot')}>{p.badge}</span>}
                  <img src={p.image} alt={p.name} loading="lazy" />
                </div>
                <div className="ma-prod-info">
                  <div className="ma-prod-cat">{p.category_name}</div>
                  <div className="ma-prod-name">{p.name}</div>
                  <div className="ma-prod-footer"><div className="ma-prod-price"><span className="ma-price-now">{fmt(p.price_sale || p.price)}</span></div></div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
