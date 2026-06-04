import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../../api/client'

interface Post {
  id: number
  title: string
  slug: string
  status: string
  featured: number
  views: number
  read_time: number
  created_at: string
  category_name?: string
  thumbnail?: string
}

interface PostsResponse {
  data: Post[]
  total: number
  totalPages: number
  page: number
}

export default function PostList() {
  const [posts, setPosts] = useState<Post[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [filterStatus, setFilterStatus] = useState('')

  useEffect(() => {
    load()
  }, [page, filterStatus])

  async function load() {
    setLoading(true)
    try {
      const params = new URLSearchParams({ page: String(page), limit: '20' })
      if (filterStatus) params.set('status', filterStatus)
      if (search) params.set('search', search)
      const res = await api.get<PostsResponse>(`/posts?${params}`)
      setPosts(res.data)
      setTotal(res.total)
      setTotalPages(res.totalPages)
    } finally {
      setLoading(false)
    }
  }

  async function handleDelete(id: number, title: string) {
    if (!confirm(`Xoa bai viet: "${title}"?`)) return
    try {
      await api.delete(`/posts/${id}`)
      load()
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Xoa that bai')
    }
  }

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-title">Bai viet</div>
          <div className="page-sub">{total} bai viet</div>
        </div>
        <Link to="/posts/new" className="btn btn-accent">+ Tao bai moi</Link>
      </div>

      <div className="table-wrap">
        <div className="table-header">
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
            <select
              className="form-control"
              style={{ width: 'auto' }}
              value={filterStatus}
              onChange={e => { setFilterStatus(e.target.value); setPage(1) }}
            >
              <option value="">Tat ca trang thai</option>
              <option value="published">Da xuat ban</option>
              <option value="draft">Ban nhap</option>
            </select>
          </div>
          <form onSubmit={e => { e.preventDefault(); setPage(1); load() }} style={{ display: 'flex', gap: '8px' }}>
            <input
              type="search"
              className="search-input"
              placeholder="Tim bai viet..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
            <button type="submit" className="btn btn-ghost btn-sm">Tim</button>
          </form>
        </div>

        {loading ? (
          <div style={{ padding: '24px' }}>
            {[1,2,3,4,5].map(i => <div key={i} className="skeleton" style={{ height: '44px', marginBottom: '8px' }} />)}
          </div>
        ) : posts.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">✍</div>
            <p>Chua co bai viet nao</p>
          </div>
        ) : (
          <table>
            <thead>
              <tr>
                <th style={{ width: '60px' }}>Anh</th>
                <th>Tieu de</th>
                <th>Danh muc</th>
                <th>Luot xem</th>
                <th>Trang thai</th>
                <th>Ngay tao</th>
                <th style={{ width: '100px' }}></th>
              </tr>
            </thead>
            <tbody>
              {posts.map(p => (
                <tr key={p.id}>
                  <td>
                    {p.thumbnail ? (
                      <img src={p.thumbnail} className="thumb-preview" alt="" />
                    ) : (
                      <div style={{ width: '60px', height: '40px', background: 'var(--warm)', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px' }}>
                        ✍
                      </div>
                    )}
                  </td>
                  <td style={{ maxWidth: '280px' }}>
                    <div className="text-truncate" style={{ fontWeight: '500', color: 'var(--text)' }}>
                      {p.featured ? '⭐ ' : ''}{p.title}
                    </div>
                    <div style={{ fontSize: '11px', color: 'var(--text-3)', marginTop: '2px' }}>{p.read_time} phut doc</div>
                  </td>
                  <td>{p.category_name ?? '—'}</td>
                  <td>{(p.views ?? 0).toLocaleString()}</td>
                  <td>
                    <span className={`badge badge-${p.status}`}>
                      {p.status === 'published' ? 'Da xuat ban' : 'Ban nhap'}
                    </span>
                  </td>
                  <td>{new Date(p.created_at).toLocaleDateString('vi-VN')}</td>
                  <td>
                    <div style={{ display: 'flex', gap: '6px' }}>
                      <Link to={`/posts/${p.id}/edit`} className="btn btn-ghost btn-sm">Sua</Link>
                      <button
                        onClick={() => handleDelete(p.id, p.title)}
                        className="btn btn-sm"
                        style={{ background: '#fff0f0', color: 'var(--danger)', border: '1px solid #fdd' }}
                      >
                        Xoa
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {totalPages > 1 && (
          <div style={{ padding: '16px 20px', borderTop: '1px solid var(--border)', display: 'flex', gap: '8px', justifyContent: 'center' }}>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
              <button
                key={p}
                onClick={() => setPage(p)}
                className="btn btn-sm"
                style={{
                  background: p === page ? 'var(--accent)' : 'var(--surface)',
                  color: p === page ? '#fff' : 'var(--text-2)',
                  border: '1px solid var(--border)',
                  minWidth: '32px',
                }}
              >
                {p}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
