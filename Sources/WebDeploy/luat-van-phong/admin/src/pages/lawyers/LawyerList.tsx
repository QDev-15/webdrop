import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../../api/client'

interface Lawyer { id: number; name: string; role: string; is_partner: number; status: string; sort_order: number; avatar: string }

export default function LawyerList() {
  const [items, setItems] = useState<Lawyer[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => { load() }, [])

  async function load() {
    try { setItems(await api.get<Lawyer[]>('/lawyers')) }
    finally { setLoading(false) }
  }

  async function handleDelete(id: number) {
    if (!confirm('Xóa luật sư này?')) return
    await api.delete(`/lawyers/${id}`)
    load()
  }

  if (loading) return <div className="loading">Đang tải...</div>

  return (
    <>
      <div className="page-hdr">
        <h1>Đội ngũ luật sư</h1>
        <Link to="/lawyers/new" className="btn btn-primary">+ Thêm luật sư</Link>
      </div>
      <div className="table-wrap">
        <table className="admin-table">
          <thead>
            <tr><th>Ảnh</th><th>Họ tên</th><th>Chức vụ</th><th>Loại</th><th>Thứ tự</th><th>Trạng thái</th><th>Thao tác</th></tr>
          </thead>
          <tbody>
            {items.map(item => (
              <tr key={item.id}>
                <td>{item.avatar && <img src={item.avatar} alt="" className="img-preview" style={{ width: '48px', height: '48px', borderRadius: '50%' }} />}</td>
                <td style={{ fontWeight: 500 }}>{item.name}</td>
                <td style={{ color: 'var(--text-2)', fontSize: '12px' }}>{item.role}</td>
                <td><span className={`badge ${item.is_partner ? 'badge-published' : 'badge-draft'}`}>{item.is_partner ? 'Sáng lập' : 'Thành viên'}</span></td>
                <td>{item.sort_order}</td>
                <td><span className={`badge badge-${item.status}`}>{item.status}</span></td>
                <td>
                  <div style={{ display: 'flex', gap: '6px' }}>
                    <Link to={`/lawyers/${item.id}/edit`} className="btn btn-ghost btn-sm">Sửa</Link>
                    <button className="btn btn-danger btn-sm" onClick={() => handleDelete(item.id)}>Xóa</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  )
}
