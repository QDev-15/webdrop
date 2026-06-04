import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../../api/client'

interface Member { id: number; name: string; position: string; experience: string; certificates: string; is_leader: number; sort_order: number; status: string }

export default function TeamList() {
  const [items, setItems] = useState<Member[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => { load() }, [])

  async function load() {
    try { setItems(await api.get<Member[]>('/team-members')) }
    finally { setLoading(false) }
  }

  async function handleDelete(id: number) {
    if (!confirm('Xóa chuyên gia này?')) return
    await api.delete(`/team-members/${id}`); load()
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h1 style={{ fontSize: '18px', fontWeight: '700', color: 'var(--text)' }}>Đội ngũ chuyên gia</h1>
        <Link to="/team/new" className="btn btn-primary">+ Thêm chuyên gia</Link>
      </div>
      <div className="card">
        <div className="table-wrap">
          <table>
            <thead>
              <tr><th>Tên</th><th>Chức vụ</th><th>Chứng chỉ</th><th>Lãnh đạo</th><th>Trạng thái</th><th>Hành động</th></tr>
            </thead>
            <tbody>
              {loading ? <tr><td colSpan={6} style={{ textAlign: 'center', padding: '20px', color: 'var(--text-3)' }}>Đang tải...</td></tr>
              : items.map(m => (
                <tr key={m.id}>
                  <td style={{ fontWeight: '500' }}>{m.name}</td>
                  <td style={{ fontSize: '13px' }}>{m.position}</td>
                  <td style={{ fontSize: '12px', color: 'var(--text-3)' }}>{m.certificates}</td>
                  <td>{m.is_leader ? <span className="badge badge-info">Lãnh đạo</span> : '—'}</td>
                  <td><span className={`badge ${m.status === 'published' ? 'badge-success' : 'badge-muted'}`}>{m.status === 'published' ? 'Hiển thị' : 'Ẩn'}</span></td>
                  <td>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <Link to={`/team/${m.id}/edit`} className="btn btn-ghost btn-sm">Sửa</Link>
                      <button className="btn btn-danger btn-sm" onClick={() => handleDelete(m.id)}>Xóa</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
