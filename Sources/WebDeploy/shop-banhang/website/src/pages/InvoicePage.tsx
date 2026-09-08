import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { api } from '../api/client'
import { useSite } from '../contexts/SiteContext'
import { useDocumentMeta } from '../hooks/useDocumentMeta'

interface OrderItem { product_name: string; unit: string; size: string; color: string; price: number; quantity: number }
interface OrderDetail {
  code: string; table_no: string; customer_name: string; items: OrderItem[];
  subtotal: number; discount: number; total: number; payment_method: string;
  cash_received: number | null; change_given: number | null; points_earned: number; customer_id: number | null; created_at: string
}

const PAYMENT_LABELS: Record<string, string> = { cash: 'Tiền mặt', transfer: 'Chuyển khoản', qr: 'QR Code', card: 'Thẻ' }

function fmt(n: number): string { return Math.round(n).toLocaleString('vi-VN') + 'đ' }
function fmtDateTime(iso: string): string {
  const d = new Date(iso.replace(' ', 'T'))
  return isNaN(d.getTime()) ? iso : d.toLocaleString('vi-VN')
}

export default function InvoicePage() {
  useDocumentMeta({ title: 'In hóa đơn — POS Bán hàng', description: 'In hóa đơn bán hàng.' })
  const { code } = useParams()
  const navigate = useNavigate()
  const { settings } = useSite()
  const [order, setOrder] = useState<OrderDetail | null>(null)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    const cached = sessionStorage.getItem('bp_current_order')
    if (cached) {
      try {
        const parsed = JSON.parse(cached) as OrderDetail
        if (parsed.code === code) { setOrder(parsed); return }
      } catch { /* ignore parse lỗi, rơi về fetch API */ }
    }
    if (!code) { setNotFound(true); return }
    api.get<OrderDetail>(`/orders/find/${encodeURIComponent(code)}`)
      .then(setOrder)
      .catch(() => setNotFound(true))
  }, [code])

  useEffect(() => {
    function onAfterPrint() { handleBack() }
    window.addEventListener('afterprint', onAfterPrint)
    return () => window.removeEventListener('afterprint', onAfterPrint)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function handleBack() {
    sessionStorage.removeItem('bp_current_order')
    navigate('/pos')
  }

  if (notFound) {
    return (
      <div className="bp-page-content">
        <p>Không tìm thấy đơn hàng. Vui lòng lập đơn mới.</p>
        <button className="bp-btn bp-btn-primary" onClick={() => navigate('/pos')}>Quay lại</button>
      </div>
    )
  }
  if (!order) return <div className="bp-page-content"><p>Đang tải...</p></div>

  return (
    <>
      <h1 className="visually-hidden">In hóa đơn bán hàng</h1>
      <div className="bp-invoice" id="invoiceContainer">
        <div className="bp-invoice-wrapper">
          <div className="bp-invoice-content">
            <div className="bp-invoice-line" style={{ fontWeight: 'bold', fontSize: 12 }}>🍴 {settings.site_name || 'POS BÁN HÀNG'}</div>
            <div className="bp-invoice-line">{settings.site_address || 'Cửa hàng demo'}</div>
            <div className="bp-invoice-line">SĐT: {settings.site_phone || '0000 0000 000'}</div>
          </div>

          <div className="bp-invoice-separator"></div>

          <div className="bp-invoice-content">
            <div className="bp-invoice-line">Mã hóa đơn: <strong>{order.code}</strong></div>
            {order.table_no && <div className="bp-invoice-line">Số bàn: <strong>{order.table_no}</strong></div>}
            <div className="bp-invoice-line">Khách: {order.customer_name || 'Khách lẻ'}</div>
            <div className="bp-invoice-line">Thanh toán: {PAYMENT_LABELS[order.payment_method] ?? order.payment_method}</div>
          </div>

          <div className="bp-invoice-separator"></div>

          <div className="bp-invoice-items">
            {order.items.map((item, idx) => {
              const variantLabel = item.size ? ` (${item.size}/${item.color})` : ''
              return (
                <div key={idx} className="bp-invoice-items-line">
                  <div className="bp-invoice-items-name">
                    {item.product_name}{variantLabel}<br />
                    <span style={{ color: '#666' }}>x{item.quantity} {item.unit}</span>
                  </div>
                  <div className="bp-invoice-items-price">{fmt(item.price * item.quantity)}</div>
                </div>
              )
            })}
          </div>

          <div className="bp-invoice-separator"></div>

          <div className="bp-invoice-summary">
            <div className="bp-invoice-summary-row"><span>Tạm tính:</span><span>{fmt(order.subtotal)}</span></div>
            {order.discount > 0 && (
              <div className="bp-invoice-summary-row" style={{ color: 'red' }}><span>Chiết khấu:</span><span>-{fmt(order.discount)}</span></div>
            )}
            <div className="bp-invoice-total" style={{ textAlign: 'center' }}>THÀNH TIỀN: {fmt(order.total)}</div>
            {order.payment_method === 'cash' && order.cash_received != null && (
              <>
                <div className="bp-invoice-summary-row"><span>Tiền khách đưa:</span><span>{fmt(order.cash_received)}</span></div>
                <div className="bp-invoice-summary-row"><span>Tiền thối lại:</span><span>{fmt(order.change_given ?? 0)}</span></div>
              </>
            )}
            {order.customer_id && order.points_earned > 0 && (
              <div className="bp-invoice-summary-row" style={{ color: 'green' }}><span>Điểm tích lũy:</span><span>+{order.points_earned} điểm</span></div>
            )}
          </div>

          <div className="bp-invoice-separator"></div>

          <div className="bp-invoice-content" style={{ fontSize: 10, marginTop: 20 }}>
            <div className="bp-invoice-line">Cảm ơn quý khách!</div>
            <div className="bp-invoice-line">Mong được phục vụ quý khách lần sau</div>
            <div className="bp-invoice-line" style={{ marginTop: 12 }}>{fmtDateTime(order.created_at)}</div>
          </div>
        </div>
      </div>

      <nav className="bp-navbar no-print">
        <div className="bp-navbar-brand">🍴 POS Bán Hàng</div>
        <div className="bp-navbar-user">
          <button className="bp-btn bp-btn-primary bp-btn-sm" onClick={() => window.print()}>🖨️ In</button>
          <button className="bp-btn bp-btn-secondary bp-btn-sm" onClick={handleBack}>Quay lại</button>
        </div>
      </nav>
    </>
  )
}
