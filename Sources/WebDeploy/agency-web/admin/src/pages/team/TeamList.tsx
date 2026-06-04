import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../../api/client'

interface TeamMember { id: number; name: string; position: string; avatar: string; sort_order: number; status: string }

export default function TeamList() {
  const [items, setItems] = useState<TeamMember[]>([])
  const [loading, setLoading] = useState(true)
  const load = () => { api.get<TeamMember[]>('/team').then(setItems).catch(console.error).finally(() => setLoading(false)) }
  useEffect(() => { load() }, [])

  return (
    <>
      <div className="page-header">
        <div><div className="page-title">Đội ngũ</div><div className="page-subtitle">Quản lý thành viên</div></div>
        <Link to="/team/new" className="btn-accent">+ Thêm thành viên</Link>
      </div>
      {loading ? <div style={{ padding: '48px', textAlign: 'center', color: 'var(--text-3)' }}>Đang tải...</div> :
        items.length === 0 ? <div className="empty-state"><div className="empty-state-icon">👥</div><div className="empty-state-text">Chưa có thành viên nào.</div></div> : (
          <div className="table-wrap">
            <table>
              <thead><tr><th>Avatar</th><th>Họ tên</th><th>Chức vụ</th><th>Thứ tự</th><th>Trạng thái</th><th>Hành động</th></tr></thead>
              <tbody>
                {items.map(m => (
                  <tr key={m.id}>
                    <td>{m.avatar && <img src={m.avatar} alt={m.name} style={{ width: '36px', height: '36px', borderRadius: '50%', objectFit: 'cover' }} />}</td>
                    <td style={{ fontWeight: 500 }}>{m.name}</td>
                    <td style={{ color: 'var(--text-2)' }}>{m.position}</td>
                    <td>{m.sort_order}</td>
                    <td><span className={`badge badge-${m.status}`}><span className="badge-dot" />{m.status === 'published' ? 'Hiển thị' : 'Ẩn'}</span></td>
                    <td><div className="td-actions">
                      <Link to={`/team/${m.id}/edit`} className="btn-ghost btn-sm">Sửa</Link>
                      <button onClick={async () => { if (confirm('Xóa?')) { await api.delete(`/team/${m.id}`); load() } }} className="btn-danger btn-sm">Xóa</button>
                    </div></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
    </>
  )
}
