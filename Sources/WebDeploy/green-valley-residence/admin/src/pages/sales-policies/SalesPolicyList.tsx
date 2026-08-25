import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../../api/client'

interface SalesPolicy {
  id: number
  icon: string
  title: string
  description: string
  sort_order: number
}

export default function SalesPolicyList() {
  const [items, setItems] = useState<SalesPolicy[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => { load() }, [])

  async function load() {
    try { setItems(await api.get<SalesPolicy[]>('/sales-policies')) }
    finally { setLoading(false) }
  }

  async function handleDelete(id: number) {
    if (!confirm('Xóa chính sách này?')) return
    await api.delete(`/sales-policies/${id}`)
    load()
  }

  if (loading) return <div className="admin-loading">Đang tải...</div>

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-title">Chính sách bán hàng</div>
          <div className="page-sub">Chiết khấu, hỗ trợ vay... ({items.length} chính sách)</div>
        </div>
        <Link to="/sales-policies/new" className="btn-accent">+ Thêm chính sách</Link>
      </div>

      {items.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">💸</div>
          <div className="empty-state-text">Chưa có chính sách nào. Thêm chính sách đầu tiên!</div>
        </div>
      ) : (
        <div className="table-wrap">
          <table>
            <thead><tr><th>Icon</th><th>Tiêu đề</th><th>Mô tả</th><th>Thứ tự</th><th>Thao tác</th></tr></thead>
            <tbody>
              {items.map(sp => (
                <tr key={sp.id}>
                  <td style={{ fontSize: 20 }}>{sp.icon}</td>
                  <td style={{ fontWeight: 500 }}>{sp.title}</td>
                  <td style={{ fontSize: 13, color: 'var(--text-2)' }}>{sp.description || '—'}</td>
                  <td>{sp.sort_order}</td>
                  <td style={{ display: 'flex', gap: 8 }}>
                    <Link to={`/sales-policies/${sp.id}/edit`} className="btn-ghost btn-sm">Sửa</Link>
                    <button onClick={() => handleDelete(sp.id)} className="btn-danger btn-sm">Xóa</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
