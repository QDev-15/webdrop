import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../../api/client'

interface PaymentPhase {
  id: number
  phase: string
  percent: number
  milestone: string
  sort_order: number
}

export default function PaymentPhaseList() {
  const [items, setItems] = useState<PaymentPhase[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => { load() }, [])

  async function load() {
    try { setItems(await api.get<PaymentPhase[]>('/payment-phases')) }
    finally { setLoading(false) }
  }

  async function handleDelete(id: number) {
    if (!confirm('Xóa đợt thanh toán này?')) return
    await api.delete(`/payment-phases/${id}`)
    load()
  }

  const totalPercent = items.reduce((sum, p) => sum + p.percent, 0)

  if (loading) return <div className="admin-loading">Đang tải...</div>

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-title">Tiến độ thanh toán</div>
          <div className="page-sub">{items.length} đợt thanh toán · Tổng {totalPercent}%</div>
        </div>
        <Link to="/payment-phases/new" className="btn-accent">+ Thêm đợt thanh toán</Link>
      </div>

      {items.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">💳</div>
          <div className="empty-state-text">Chưa có đợt thanh toán nào. Thêm đợt đầu tiên!</div>
        </div>
      ) : (
        <div className="table-wrap">
          <table>
            <thead><tr><th>Đợt</th><th>Tỷ lệ</th><th>Mốc thanh toán</th><th>Thứ tự</th><th>Thao tác</th></tr></thead>
            <tbody>
              {items.map(p => (
                <tr key={p.id}>
                  <td style={{ fontWeight: 500 }}>{p.phase}</td>
                  <td>{p.percent}%</td>
                  <td style={{ fontSize: 13, color: 'var(--text-2)' }}>{p.milestone || '—'}</td>
                  <td>{p.sort_order}</td>
                  <td style={{ display: 'flex', gap: 8 }}>
                    <Link to={`/payment-phases/${p.id}/edit`} className="btn-ghost btn-sm">Sửa</Link>
                    <button onClick={() => handleDelete(p.id)} className="btn-danger btn-sm">Xóa</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {totalPercent !== 100 && items.length > 0 && (
        <div className="alert alert-info" style={{ marginTop: 16 }}>⚠ Tổng tỷ lệ hiện tại là {totalPercent}%, nên điều chỉnh để đạt đúng 100%.</div>
      )}
    </div>
  )
}
