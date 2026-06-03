import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../../api/client'

interface Service { id: number; name: string; icon: string; price_text: string; featured: number; sort_order: number; status: string }

export default function ServiceList() {
  const [items, setItems]   = useState<Service[]>([])
  const [loading, setLoading] = useState(true)

  const load = () => {
    setLoading(true)
    api.get<Service[]>('/services').then(setItems).catch(() => {}).finally(() => setLoading(false))
  }
  useEffect(load, [])

  const del = async (id: number) => {
    if (!confirm('Xóa dịch vụ này?')) return
    await api.delete(`/services/${id}`)
    load()
  }

  return (
    <>
      <div className="page-hd">
        <div><h1 className="page-hd-title">Dịch vụ</h1></div>
        <Link to="/services/new" className="btn btn-primary">+ Thêm dịch vụ</Link>
      </div>
      <div className="card">
        {loading ? <p className="text-muted">Đang tải...</p> : (
          <div className="tbl-wrap">
            <table>
              <thead><tr><th>#</th><th>Icon</th><th>Tên dịch vụ</th><th>Giá</th><th>Nổi bật</th><th>Thứ tự</th><th>Trạng thái</th><th></th></tr></thead>
              <tbody>
                {items.map(s => (
                  <tr key={s.id}>
                    <td>{s.id}</td>
                    <td style={{ fontSize: '20px' }}>{s.icon}</td>
                    <td className="td-name">{s.name}</td>
                    <td>{s.price_text}</td>
                    <td>{s.featured ? '⭐' : '—'}</td>
                    <td>{s.sort_order}</td>
                    <td><span className={`badge badge-${s.status}`}>{s.status}</span></td>
                    <td>
                      <div className="d-flex gap-2">
                        <Link to={`/services/${s.id}/edit`} className="btn btn-ghost btn-sm">Sửa</Link>
                        <button onClick={() => del(s.id)} className="btn btn-danger btn-sm">Xóa</button>
                      </div>
                    </td>
                  </tr>
                ))}
                {!items.length && <tr><td colSpan={8} className="text-center text-muted" style={{ padding: '32px' }}>Chưa có dịch vụ nào.</td></tr>}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  )
}
