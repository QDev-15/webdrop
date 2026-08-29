import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../../api/client'

interface Agent {
  id: number
  name: string
  title: string
  phone: string
  zalo: string
  avatar: string
  sort_order: number
}

export default function AgentList() {
  const [items, setItems] = useState<Agent[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => { load() }, [])

  async function load() {
    try { setItems(await api.get<Agent[]>('/agents')) }
    finally { setLoading(false) }
  }

  async function handleDelete(id: number) {
    if (!confirm('Xóa môi giới này? Các tin đăng đang gắn môi giới này sẽ chuyển về "chưa gán".')) return
    await api.delete(`/agents/${id}`)
    load()
  }

  if (loading) return <div className="admin-loading">Đang tải...</div>

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-title">Đội ngũ môi giới</div>
          <div className="page-sub">{items.length} môi giới</div>
        </div>
        <Link to="/agents/new" className="btn-accent">+ Thêm môi giới</Link>
      </div>

      {items.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">🧑‍💼</div>
          <div className="empty-state-text">Chưa có môi giới nào. Thêm môi giới đầu tiên!</div>
        </div>
      ) : (
        <div className="table-wrap">
          <table>
            <thead>
              <tr><th></th><th>Tên</th><th>Chức danh</th><th>SĐT</th><th>Zalo</th><th></th></tr>
            </thead>
            <tbody>
              {items.map(a => (
                <tr key={a.id}>
                  <td><img src={a.avatar || 'https://via.placeholder.com/40'} alt={a.name} style={{ width: 40, height: 40, borderRadius: '50%', objectFit: 'cover' }} /></td>
                  <td style={{ fontWeight: 600 }}>{a.name}</td>
                  <td>{a.title}</td>
                  <td>{a.phone}</td>
                  <td>{a.zalo}</td>
                  <td>
                    <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
                      <Link to={`/agents/${a.id}/edit`} className="btn-ghost btn-sm">Sửa</Link>
                      <button onClick={() => handleDelete(a.id)} className="btn-danger btn-sm">Xóa</button>
                    </div>
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
