import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../../api/client'

interface Post { id: number; title: string; category: string; status: string; featured: number; created_at: string }

function fmtDate(d: string) { return new Date(d).toLocaleDateString('vi-VN') }

export default function PostList() {
  const [items, setItems] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const load = () => { setLoading(true); api.get<Post[]>('/posts').then(setItems).catch(() => {}).finally(() => setLoading(false)) }
  useEffect(load, [])
  const del = async (id: number) => { if (!confirm('Xóa bài viết?')) return; await api.delete(`/posts/${id}`); load() }

  return (
    <>
      <div className="page-hd">
        <div><h1 className="page-hd-title">Bài viết / Blog</h1></div>
        <Link to="/posts/new" className="btn btn-primary">+ Viết bài mới</Link>
      </div>
      <div className="card">
        {loading ? <p className="text-muted">Đang tải...</p> : (
          <div className="tbl-wrap">
            <table>
              <thead><tr><th>#</th><th>Tiêu đề</th><th>Danh mục</th><th>Nổi bật</th><th>Trạng thái</th><th>Ngày tạo</th><th></th></tr></thead>
              <tbody>
                {items.map(p => (
                  <tr key={p.id}>
                    <td>{p.id}</td>
                    <td className="td-name">{p.title}</td>
                    <td>{p.category}</td>
                    <td>{p.featured ? '⭐' : '—'}</td>
                    <td><span className={`badge badge-${p.status}`}>{p.status}</span></td>
                    <td>{fmtDate(p.created_at)}</td>
                    <td>
                      <div className="d-flex gap-2">
                        <Link to={`/posts/${p.id}/edit`} className="btn btn-ghost btn-sm">Sửa</Link>
                        <button onClick={() => del(p.id)} className="btn btn-danger btn-sm">Xóa</button>
                      </div>
                    </td>
                  </tr>
                ))}
                {!items.length && <tr><td colSpan={7} className="text-center text-muted" style={{ padding: '32px' }}>Chưa có bài viết.</td></tr>}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  )
}
