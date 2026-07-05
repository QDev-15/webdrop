import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../../api/client'

interface Service {
  id: number
  number: string
  name: string
  price: string
  is_featured: number
  sort_order: number
}

export default function ServiceList() {
  const [items, setItems] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)

  const load = () => {
    api.get<Service[]>('/services').then(setItems).catch(console.error).finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [])

  const handleDelete = async (id: number) => {
    if (!confirm('Xóa dịch vụ này?')) return
    await api.post(`/services/${id}/delete`, {})
    load()
  }

  if (loading) return <div style={{ padding: '48px', textAlign: 'center' }}>Đang tải...</div>

  return (
    <>
      <div className="page-header">
        <div>
          <div className="page-title">Dịch vụ nha khoa</div>
          <div className="page-sub">{items.length} dịch vụ</div>
        </div>
        <Link to="/services/new" className="btn-accent">+ Thêm dịch vụ</Link>
      </div>

      <div className="table-wrap">
        <table className="data-table">
          <thead>
            <tr>
              <th>STT</th>
              <th>Tên dịch vụ</th>
              <th>Giá</th>
              <th>Nổi bật</th>
              <th>Thứ tự</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {items.map(item => (
              <tr key={item.id}>
                <td>{item.number || item.id}</td>
                <td style={{ fontWeight: 500 }}>{item.name}</td>
                <td style={{ color: 'var(--text-2)', fontSize: '13px' }}>{item.price || '—'}</td>
                <td>
                  {item.is_featured ? (
                    <span style={{ color: '#059669', fontWeight: 600, fontSize: '12px' }}>✓ Có</span>
                  ) : (
                    <span style={{ color: 'var(--text-3)', fontSize: '12px' }}>—</span>
                  )}
                </td>
                <td>{item.sort_order}</td>
                <td>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <Link to={`/services/${item.id}/edit`} className="btn-ghost" style={{ padding: '6px 12px', fontSize: '12px' }}>Sửa</Link>
                    <button onClick={() => handleDelete(item.id)} className="btn-danger" style={{ padding: '6px 12px', fontSize: '12px' }}>Xóa</button>
                  </div>
                </td>
              </tr>
            ))}
            {items.length === 0 && (
              <tr><td colSpan={6} style={{ textAlign: 'center', color: 'var(--text-3)', padding: '40px' }}>Chưa có dịch vụ nào</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  )
}
