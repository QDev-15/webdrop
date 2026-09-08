import { useState } from 'react'
import { api } from '../api/client'
import { useDocumentMeta } from '../hooks/useDocumentMeta'

interface ReturnableItem {
  product_id: number; variant_sku: string | null; product_name: string; unit: string;
  size: string; color: string; price: number; quantity: number; already_returned: number; max_returnable: number
}
interface OrderDetail {
  id: number; code: string; customer_name: string; total: number; created_at: string; items: ReturnableItem[]
}

const REASONS = [
  { value: '', label: '-- Chọn lý do --' },
  { value: 'loi-san-pham', label: 'Lỗi sản phẩm' },
  { value: 'doi-y', label: 'Đổi ý' },
  { value: 'giao-nham', label: 'Giao nhầm' },
  { value: 'khac', label: 'Khác' },
]

function fmtVND(n: number): string { return Math.round(n).toLocaleString('vi-VN') + 'đ' }
function fmtDateTime(iso: string): string {
  const d = new Date(iso.replace(' ', 'T'))
  return isNaN(d.getTime()) ? iso : d.toLocaleString('vi-VN')
}

export default function ReturnsPage() {
  useDocumentMeta({ title: 'Trả hàng — POS Bán hàng', description: 'Trả hàng và hoàn tiền cho khách.' })
  const [orderCode, setOrderCode] = useState('')
  const [order, setOrder] = useState<OrderDetail | null>(null)
  const [findError, setFindError] = useState('')
  const [selections, setSelections] = useState<Record<string, number>>({})
  const [reason, setReason] = useState('')
  const [returnError, setReturnError] = useState('')
  const [returnSuccess, setReturnSuccess] = useState('')

  function itemKey(it: ReturnableItem): string { return `${it.product_id}::${it.variant_sku ?? ''}` }

  async function handleFindOrder() {
    setFindError(''); setReturnSuccess(''); setReturnError('')
    const code = orderCode.trim()
    try {
      const res = await api.get<OrderDetail>(`/returns/lookup/${encodeURIComponent(code)}`)
      setOrder(res)
      setSelections({})
      setReason('')
    } catch (err: unknown) {
      setOrder(null)
      setFindError(err instanceof Error ? err.message : 'Không tìm thấy hóa đơn với mã: ' + code)
    }
  }

  function toggleSelect(it: ReturnableItem, checked: boolean) {
    setSelections(s => ({ ...s, [itemKey(it)]: checked ? (it.max_returnable > 0 ? 1 : 0) : 0 }))
  }
  function setQty(it: ReturnableItem, qty: number) {
    setSelections(s => ({ ...s, [itemKey(it)]: qty }))
  }

  const refundTotal = order
    ? order.items.reduce((sum, it) => sum + (selections[itemKey(it)] || 0) * it.price, 0)
    : 0

  async function handleConfirmReturn() {
    setReturnError(''); setReturnSuccess('')
    if (!order) return
    const items = order.items
      .filter(it => (selections[itemKey(it)] || 0) > 0)
      .map(it => ({ product_id: it.product_id, variant_sku: it.variant_sku, quantity: selections[itemKey(it)] }))
    try {
      const res = await api.post<{ refund_amount: number }>('/returns', { order_code: order.code, reason, items })
      setReturnSuccess(`Hoàn tiền thành công: ${fmtVND(res.refund_amount)}. Tồn kho đã được cộng lại.`)
      const refreshed = await api.get<OrderDetail>(`/returns/lookup/${encodeURIComponent(order.code)}`)
      setOrder(refreshed)
      setSelections({})
    } catch (err: unknown) {
      setReturnError(err instanceof Error ? err.message : 'Trả hàng thất bại.')
    }
  }

  function resetForm() {
    setOrder(null); setOrderCode(''); setFindError(''); setSelections({}); setReason('')
  }

  return (
    <div className="bp-page-content">
      <div className="bp-container">
        <h1>Trả hàng / Hoàn tiền</h1>

        <div className="bp-card" style={{ marginBottom: '1.5rem' }}>
          <h3>Tìm hóa đơn gốc</h3>
          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-end', flexWrap: 'wrap' }}>
            <div className="bp-input-group" style={{ flex: 1, minWidth: 220, marginBottom: 0 }}>
              <label htmlFor="orderIdInput">Mã hóa đơn</label>
              <input type="text" id="orderIdInput" value={orderCode} onChange={e => setOrderCode(e.target.value)} placeholder="VD: HD20260908123456780001" />
            </div>
            <button className="bp-btn bp-btn-primary" onClick={handleFindOrder}>Tìm hóa đơn</button>
          </div>
          {findError && <div className="bp-alert error show" style={{ marginTop: '1rem' }}>{findError}</div>}
        </div>

        {order && (
          <div className="bp-card">
            <h3>Chi tiết hóa đơn <span>{order.code}</span></h3>
            <p style={{ color: 'var(--text-2)' }}>
              Khách: {order.customer_name} · Thời gian: {fmtDateTime(order.created_at)} · Tổng tiền: {fmtVND(order.total)}
            </p>

            <table className="bp-table">
              <thead>
                <tr>
                  <th style={{ width: 36 }}></th>
                  <th>Sản phẩm</th><th>Đã mua</th><th>Đã trả trước</th><th>Số lượng trả</th><th>Thành tiền</th>
                </tr>
              </thead>
              <tbody>
                {order.items.map(it => {
                  const key = itemKey(it)
                  const qty = selections[key] || 0
                  const variantLabel = it.size ? ` (${it.size}/${it.color})` : ''
                  return (
                    <tr key={key}>
                      <td><input type="checkbox" checked={qty > 0} disabled={it.max_returnable === 0} onChange={e => toggleSelect(it, e.target.checked)} /></td>
                      <td>{it.product_name}{variantLabel}</td>
                      <td>{it.quantity}</td>
                      <td>{it.already_returned}</td>
                      <td style={{ maxWidth: 110 }}>
                        <input type="number" min={0} max={it.max_returnable} value={qty} disabled={it.max_returnable === 0}
                          onChange={e => setQty(it, Math.max(0, Math.min(it.max_returnable, Number(e.target.value) || 0)))}
                          style={{ width: 80, padding: '0.4rem', border: '1px solid var(--border)', borderRadius: 6 }} />
                      </td>
                      <td>{fmtVND(it.price)}/{it.unit}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>

            <div className="bp-input-group" style={{ maxWidth: 320, marginTop: '1rem' }}>
              <label htmlFor="returnReason">Lý do trả hàng</label>
              <select id="returnReason" value={reason} onChange={e => setReason(e.target.value)}>
                {REASONS.map(r => <option key={r.value} value={r.value}>{r.label}</option>)}
              </select>
            </div>

            <div className="bp-summary-row total" style={{ marginTop: '1rem' }}>
              <span>Tổng tiền hoàn:</span><span>{fmtVND(refundTotal)}</span>
            </div>

            {returnError && <div className="bp-alert error show" style={{ marginTop: '1rem' }}>{returnError}</div>}
            {returnSuccess && <div className="bp-alert success show" style={{ marginTop: '1rem' }}>{returnSuccess}</div>}

            <button className="bp-btn bp-btn-primary" onClick={handleConfirmReturn} style={{ marginTop: '1rem' }}>Xác nhận hoàn tiền</button>
            <button className="bp-btn bp-btn-secondary" onClick={resetForm} style={{ marginTop: '1rem' }}>Huỷ</button>
          </div>
        )}
      </div>
    </div>
  )
}
