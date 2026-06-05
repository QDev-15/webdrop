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
    if (!confirm(`Xóa bài viết: "${title}"?`)) return
    try {
      await api.delete(`/posts/${id}`)
      load()
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Xóa thất bại')
    }
  }

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-title">Bài viết</div>
          <div className="page-sub">{total} bài viết</div>
        </div>
        <Link to="/posts/new" className="btn btn-accent">+ Tạo bài mới</Link>
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
              <option value="">Tất cả trạng thái</option>
              <option value="published">Đã xuất bản</option>
              <option value="draft">Bản nháp</option>
            </select>
          </div>
          <form onSubmit={e => { e.preventDefault(); setPage(1); load() }} style={{ display: 'flex', gap: '8px' }}>
            <input
              type="search"
              className="search-input"
              placeholder="Tìm bài viết..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
            <button type="submit" className="btn btn-ghost btn-sm">Tìm</button>
          </form>
        </div>

        {loading ? (
          <div style={{ padding: '24px' }}>
            {[1,2,3,4,5].map(i => <div key={i} className="skeleton" style={{ height: '44px', marginBottom: '8px' }} />)}
          </div>
        ) : posts.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">✍</div>
            <p>Chưa có bài viết nào</p>
          </div>
        ) : (
          <table>
            <thead>
              <tr>
                <th style={{ width: '60px' }}>Ảnh</th>
                <th>Tiêu đề</th>
                <th>Danh mục</th>
                <th>Lượt xem</th>
                <th>Trạng thái</th>
                <th>Ngày tạo</th>
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
                    <div style={{ fontSize: '11px', color: 'var(--text-3)', marginTop: '2px' }}>{p.read_time} phút đọc</div>
                  </td>
                  <td>{p.category_name ?? '—'}</td>
                  <td>{(p.views ?? 0).toLocaleString()}</td>
                  <td>
                    <span className={`badge badge-${p.status}`}>
                      {p.status === 'published' ? 'Đã xuất bản' : 'Bản nháp'}
                    </span>
                  </td>
                  <td>{new Date(p.created_at).toLocaleDateString('vi-VN')}</td>
                  <td>
                    <div style={{ display: 'flex', gap: '6px' }}>
                      <Link to={`/posts/${p.id}/edit`} className="btn btn-ghost btn-sm">Sửa</Link>
                      <button
                        onClick={() => handleDelete(p.id, p.title)}
                        className="btn btn-sm"
                        style={{ background: '#fff0f0', color: 'var(--danger)', border: '1px solid #fdd' }}
                      >
                        Xóa
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
