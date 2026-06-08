import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../../api/client'

interface Thread {
  id: number
  title: string
  author_name: string
  category_name: string
  reply_count: number
  is_pinned: number
  is_hot: number
  status: string
  created_at: string
}

export default function ThreadList() {
  const [threads, setThreads] = useState<Thread[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => { load() }, [])

  async function load() {
    try { setThreads(await api.get<Thread[]>('/forum-threads')) }
    finally { setLoading(false) }
  }

  async function handleDelete(id: number) {
    if (!confirm('Xóa chủ đề này?')) return
    await api.delete(`/forum-threads/${id}`)
    load()
  }

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-title">Chủ đề bài viết</div>
          <div className="page-sub">Quản lý tất cả chủ đề trong diễn đàn</div>
        </div>
        <Link to="/forum-threads/new" className="btn-accent">+ Tạo chủ đề</Link>
      </div>

      {loading ? (
        <div style={{ color: 'var(--text-3)' }}>Đang tải...</div>
      ) : threads.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">💬</div>
          <div className="empty-state-text">Chưa có chủ đề nào</div>
        </div>
      ) : (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Tiêu đề</th>
                <th>Danh mục</th>
                <th>Tác giả</th>
                <th>Trả lời</th>
                <th>Trạng thái</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {threads.map(t => (
                <tr key={t.id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      {t.is_pinned === 1 && <span title="Ghim" style={{ fontSize: 12 }}>📌</span>}
                      {t.is_hot === 1 && <span title="Hot" style={{ fontSize: 12 }}>🔥</span>}
                      <div>
                        <div style={{ fontWeight: 500, fontSize: 13 }}>{t.title}</div>
                        <div style={{ fontSize: 11, color: 'var(--text-3)' }}>{t.created_at?.slice(0, 10)}</div>
                      </div>
                    </div>
                  </td>
                  <td style={{ fontSize: 12 }}>{t.category_name}</td>
                  <td style={{ fontSize: 12 }}>{t.author_name}</td>
                  <td>{t.reply_count}</td>
                  <td><span className={`badge badge-${t.status}`}>{t.status === 'published' ? 'Đang hiện' : t.status === 'draft' ? 'Nháp' : 'Ẩn'}</span></td>
                  <td>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <Link to={`/forum-threads/${t.id}/edit`} className="btn-ghost btn-sm">Sửa</Link>
                      <button className="btn-danger btn-sm" onClick={() => handleDelete(t.id)}>Xóa</button>
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
