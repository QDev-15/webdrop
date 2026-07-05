import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../../api/client'

interface Service {
  id: number
  name: string
  tag: string
  price: string
  price_unit: string
  is_featured: number
  category_name: string
  sort_order: number
}

export default function ServiceList() {
  const [items, setItems] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)
  const [msg, setMsg] = useState('')

  const load = () => {
    api.get<Service[]>('/services').then(setItems).finally(() => setLoading(false))
  }
  useEffect(load, [])

  const del = async (id: number) => {
    if (!confirm('Xóa dịch vụ này?')) return
    try { await api.delete(`/services/${id}`); setMsg('Đã xóa.'); load() }
    catch { setMsg('Lỗi xóa.') }
  }

  if (loading) return <div className="admin-loading">Đang tải...</div>

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <h1 style={{ fontSize: 22, fontWeight: 700 }}>Dịch vụ</h1>
        <Link to="/services/new" style={{ padding: '9px 20px', background: 'var(--accent)', color: '#fff', borderRadius: 8, fontWeight: 600, fontSize: 13, textDecoration: 'none' }}>
          + Thêm dịch vụ
        </Link>
      </div>
      {msg && <div style={{ marginBottom: 12, color: 'var(--accent)', fontSize: 13 }}>{msg}</div>}

      <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 10, overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border)', background: 'var(--bg)' }}>
              <th style={{ padding: '10px 16px', textAlign: 'left', fontSize: 12, color: 'var(--text-2)' }}>Tên dịch vụ</th>
              <th style={{ padding: '10px 16px', textAlign: 'left', fontSize: 12, color: 'var(--text-2)' }}>Nhóm</th>
              <th style={{ padding: '10px 16px', textAlign: 'left', fontSize: 12, color: 'var(--text-2)' }}>Giá</th>
              <th style={{ padding: '10px 16px', textAlign: 'left', fontSize: 12, color: 'var(--text-2)' }}>Nổi bật</th>
              <th style={{ padding: '10px 16px', textAlign: 'right', fontSize: 12, color: 'var(--text-2)' }}>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {items.map(s => (
              <tr key={s.id} style={{ borderBottom: '1px solid var(--border-light)' }}>
                <td style={{ padding: '10px 16px' }}>
                  <div style={{ fontWeight: 600, fontSize: 13 }}>{s.name}</div>
                  {s.tag && <div style={{ fontSize: 11, color: 'var(--accent)', marginTop: 2 }}>{s.tag}</div>}
                </td>
                <td style={{ padding: '10px 16px', fontSize: 13, color: 'var(--text-2)' }}>{s.category_name || '—'}</td>
                <td style={{ padding: '10px 16px', fontSize: 13 }}>{s.price} <span style={{ color: 'var(--text-3)' }}>{s.price_unit}</span></td>
                <td style={{ padding: '10px 16px' }}>
                  <span style={{ fontSize: 11, padding: '3px 8px', borderRadius: 5, background: s.is_featured ? '#dcfce7' : '#f1f5f9', color: s.is_featured ? '#15803d' : '#64748b' }}>
                    {s.is_featured ? 'Nổi bật' : 'Thường'}
                  </span>
                </td>
                <td style={{ padding: '10px 16px', textAlign: 'right' }}>
                  <Link to={`/services/${s.id}/edit`} style={{ padding: '5px 12px', background: 'var(--warm)', border: 'none', borderRadius: 6, cursor: 'pointer', fontSize: 12, textDecoration: 'none', color: 'var(--text)', marginRight: 6 }}>Sửa</Link>
                  <button onClick={() => del(s.id)} style={{ padding: '5px 12px', background: '#fee2e2', color: 'var(--danger)', border: 'none', borderRadius: 6, cursor: 'pointer', fontSize: 12 }}>Xóa</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {items.length === 0 && <div style={{ padding: 24, textAlign: 'center', color: 'var(--text-3)', fontSize: 13 }}>Chưa có dịch vụ nào.</div>}
      </div>
    </div>
  )
}
