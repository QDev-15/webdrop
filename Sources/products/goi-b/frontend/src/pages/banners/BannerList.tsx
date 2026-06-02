import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../../api/client'

interface Banner {
  id: number; title: string; image: string; link: string
  position: string; sort_order: number; status: string
}

export default function BannerList() {
  const [banners, setBanners] = useState<Banner[]>([])
  const [loading, setLoad]    = useState(true)
  const [toast, setToast]     = useState('')

  useEffect(() => { load() }, [])

  async function load() {
    setLoad(true)
    try { setBanners(await api.get<Banner[]>('/banners')) }
    finally { setLoad(false) }
  }

  async function remove(id: number, title: string) {
    if (!confirm(`Xóa banner "${title}"?`)) return
    try {
      await api.delete('/banners/' + id)
      setBanners(b => b.filter(x => x.id !== id))
      show('Đã xóa banner')
    } catch (e: unknown) { show(e instanceof Error ? e.message : 'Lỗi', true) }
  }

  function show(msg: string, err = false) {
    setToast((err ? 'E:' : '') + msg); setTimeout(() => setToast(''), 3000)
  }

  return (
    <div>
      <div className="page-hd">
        <h2>Banners</h2>
        <Link to="/banners/new" className="btn-accent" style={{ textDecoration: 'none' }}>+ Tạo mới</Link>
      </div>
      <div className="admin-card" style={{ padding: 0 }}>
        {loading ? (
          <div style={{ padding: 32, textAlign: 'center', color: 'var(--text-3)' }}>Đang tải...</div>
        ) : banners.length === 0 ? (
          <div className="empty-state"><div className="empty-icon">🖼</div><p>Chưa có banner nào.</p></div>
        ) : (
          <table className="admin-table">
            <thead><tr><th>Ảnh</th><th>Tiêu đề</th><th>Vị trí</th><th>Thứ tự</th><th>Trạng thái</th><th></th></tr></thead>
            <tbody>
              {banners.map(b => (
                <tr key={b.id}>
                  <td>
                    <img src={b.image} alt={b.title} style={{ width: 60, height: 38, objectFit: 'cover', borderRadius: 5 }} />
                  </td>
                  <td>
                    <div style={{ fontWeight: 500 }}>{b.title}</div>
                    {b.link && <div className="text-muted truncate">{b.link}</div>}
                  </td>
                  <td className="text-muted">{b.position}</td>
                  <td>{b.sort_order}</td>
                  <td><span className={`badge-status badge-${b.status}`}>{b.status === 'published' ? 'Hiện' : 'Ẩn'}</span></td>
                  <td>
                    <Link to={`/banners/${b.id}/edit`} className="btn-icon" title="Sửa">✎</Link>
                    <button className="btn-icon" onClick={() => remove(b.id, b.title)} style={{ color: 'var(--danger)' }}>✕</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      {toast && (
        <div className="toast-container">
          <div className={`toast ${toast.startsWith('E:') ? 'toast-error' : 'toast-success'}`}>{toast.replace(/^E:/, '')}</div>
        </div>
      )}
    </div>
  )
}
