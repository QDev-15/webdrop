import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../../api/client'

interface TeamMember {
  id: number
  name: string
  position: string
  experience: string
  avatar: string
  sort_order: number
  status: string
}

export default function TeamList() {
  const [items, setItems] = useState<TeamMember[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => { load() }, [])

  async function load() {
    try { setItems(await api.get<TeamMember[]>('/team-members')) }
    finally { setLoading(false) }
  }

  async function handleDelete(id: number) {
    if (!confirm('Xóa thành viên này?')) return
    await api.delete(`/team-members/${id}`)
    load()
  }

  if (loading) return <div style={{ color: 'var(--text-3)', fontSize: '14px' }}>Đang tải...</div>

  return (
    <>
      <div className="page-hd">
        <div>
          <h1 className="page-hd-title">Đội ngũ</h1>
          <div className="page-hd-sub">{items.length} thành viên</div>
        </div>
        <Link to="/team/new" className="btn btn-primary btn-sm">+ Thêm thành viên</Link>
      </div>

      <div className="card">
        <div className="tbl-wrap">
          <table>
            <thead>
              <tr>
                <th>Ảnh</th>
                <th>Tên</th>
                <th>Chức vụ</th>
                <th>Kinh nghiệm</th>
                <th>Thứ tự</th>
                <th>Trạng thái</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {items.length === 0 ? (
                <tr><td colSpan={7} style={{ textAlign: 'center', color: 'var(--text-3)' }}>Chưa có thành viên</td></tr>
              ) : items.map(item => (
                <tr key={item.id}>
                  <td>
                    {item.avatar && <img src={item.avatar} alt={item.name} style={{ width: '36px', height: '36px', borderRadius: '50%', objectFit: 'cover' }} />}
                  </td>
                  <td className="td-name">{item.name}</td>
                  <td>{item.position || '—'}</td>
                  <td>{item.experience || '—'}</td>
                  <td>{item.sort_order}</td>
                  <td><span className={`badge ${item.status === 'published' ? 'badge-published' : 'badge-draft'}`}>{item.status === 'published' ? 'Hiện' : 'Ẩn'}</span></td>
                  <td>
                    <div className="d-flex gap-2">
                      <Link to={`/team/${item.id}/edit`} className="btn btn-ghost btn-sm">Sửa</Link>
                      <button className="btn btn-danger btn-sm" onClick={() => handleDelete(item.id)}>Xóa</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  )
}
