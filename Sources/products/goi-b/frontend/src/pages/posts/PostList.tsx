import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../../api/client'

interface Post {
  id: number; title: string; slug: string; status: string
  category_name: string | null; featured: number; created_at: string
}

export default function PostList() {
  const [posts, setPosts]   = useState<Post[]>([])
  const [loading, setLoad]  = useState(true)
  const [toast, setToast]   = useState('')

  useEffect(() => { load() }, [])

  async function load() {
    setLoad(true)
    try { setPosts(await api.get<Post[]>('/posts')) }
    finally { setLoad(false) }
  }

  async function remove(id: number, title: string) {
    if (!confirm(`Xóa bài viết "${title}"?`)) return
    try {
      await api.delete('/posts/' + id)
      setPosts(p => p.filter(x => x.id !== id))
      showToast('Đã xóa bài viết')
    } catch (e: unknown) {
      showToast(e instanceof Error ? e.message : 'Xóa thất bại', true)
    }
  }

  function showToast(msg: string, err = false) {
    setToast((err ? 'E:' : '') + msg)
    setTimeout(() => setToast(''), 3000)
  }

  return (
    <div>
      <div className="page-hd">
        <h2>Bài viết</h2>
        <Link to="/posts/new" className="btn-accent" style={{ textDecoration: 'none' }}>+ Tạo mới</Link>
      </div>

      <div className="admin-card" style={{ padding: 0 }}>
        {loading ? (
          <div style={{ padding: 32, textAlign: 'center', color: 'var(--text-3)' }}>Đang tải...</div>
        ) : posts.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">✏</div>
            <p>Chưa có bài viết nào. <Link to="/posts/new">Tạo bài viết đầu tiên</Link></p>
          </div>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Tiêu đề</th>
                <th>Danh mục</th>
                <th>Trạng thái</th>
                <th>Ngày tạo</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {posts.map(p => (
                <tr key={p.id}>
                  <td>
                    <div style={{ fontWeight: 500 }}>{p.title}</div>
                    <div className="text-muted">{p.slug}</div>
                  </td>
                  <td>{p.category_name || <span className="text-muted">—</span>}</td>
                  <td>
                    <span className={`badge-status badge-${p.status}`}>
                      {p.status === 'published' ? 'Đã đăng' : 'Nháp'}
                    </span>
                  </td>
                  <td className="text-muted">{p.created_at.slice(0, 10)}</td>
                  <td style={{ whiteSpace: 'nowrap' }}>
                    <Link to={`/posts/${p.id}/edit`} className="btn-icon" title="Sửa">✎</Link>
                    <button className="btn-icon" onClick={() => remove(p.id, p.title)} title="Xóa" style={{ color: 'var(--danger)' }}>✕</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {toast && (
        <div className="toast-container">
          <div className={`toast ${toast.startsWith('E:') ? 'toast-error' : 'toast-success'}`}>
            {toast.replace(/^E:/, '')}
          </div>
        </div>
      )}
    </div>
  )
}
