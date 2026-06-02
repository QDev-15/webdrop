import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../../api/client'

interface Page { id: number; title: string; slug: string; status: string; updated_at: string }

export default function PageList() {
  const [pages, setPages] = useState<Page[]>([])
  const [loading, setLoad] = useState(true)
  const [toast, setToast]  = useState('')

  useEffect(() => { load() }, [])

  async function load() {
    setLoad(true)
    try { setPages(await api.get<Page[]>('/pages')) }
    finally { setLoad(false) }
  }

  async function remove(id: number, title: string) {
    if (!confirm(`Xóa trang "${title}"?`)) return
    try {
      await api.delete('/pages/' + id)
      setPages(p => p.filter(x => x.id !== id))
      setToast('Đã xóa trang'); setTimeout(() => setToast(''), 3000)
    } catch (e: unknown) {
      alert(e instanceof Error ? e.message : 'Xóa thất bại')
    }
  }

  return (
    <div>
      <div className="page-hd">
        <h2>Trang</h2>
        <Link to="/pages/new" className="btn-accent" style={{ textDecoration: 'none' }}>+ Tạo mới</Link>
      </div>
      <div className="admin-card" style={{ padding: 0 }}>
        {loading ? (
          <div style={{ padding: 32, textAlign: 'center', color: 'var(--text-3)' }}>Đang tải...</div>
        ) : pages.length === 0 ? (
          <div className="empty-state"><div className="empty-icon">📄</div><p>Chưa có trang nào.</p></div>
        ) : (
          <table className="admin-table">
            <thead><tr><th>Tiêu đề</th><th>Trạng thái</th><th>Cập nhật</th><th></th></tr></thead>
            <tbody>
              {pages.map(p => (
                <tr key={p.id}>
                  <td>
                    <div style={{ fontWeight: 500 }}>{p.title}</div>
                    <div className="text-muted">/{p.slug}</div>
                  </td>
                  <td><span className={`badge-status badge-${p.status}`}>{p.status === 'published' ? 'Đã đăng' : 'Nháp'}</span></td>
                  <td className="text-muted">{p.updated_at?.slice(0, 10)}</td>
                  <td>
                    <Link to={`/pages/${p.id}/edit`} className="btn-icon" title="Sửa">✎</Link>
                    <button className="btn-icon" onClick={() => remove(p.id, p.title)} style={{ color: 'var(--danger)' }}>✕</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      {toast && <div className="toast-container"><div className="toast toast-success">{toast}</div></div>}
    </div>
  )
}
