import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../../api/client'

interface Post {
  id: number
  title: string
  slug: string
  thumbnail: string
  status: string
  featured: number
  review_score: number | null
  category_name: string | null
  views: number
  created_at: string
}

const PER_PAGE = 20

export default function PostList() {
  const [items, setItems] = useState<Post[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [q, setQ] = useState('')
  const [loading, setLoading] = useState(true)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => { load() }, [page])

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => {
      setPage(1)
      load(1)
    }, 400)
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current) }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q])

  async function load(forcePage?: number) {
    setLoading(true)
    try {
      const p = forcePage ?? page
      const { data, total } = await api.getPaged<Post[]>(`/posts?page=${p}&per_page=${PER_PAGE}&q=${encodeURIComponent(q)}`)
      setItems(data)
      setTotal(total)
    } finally { setLoading(false) }
  }

  async function handleDelete(id: number) {
    if (!confirm('Xóa bài viết này?')) return
    await api.delete(`/posts/${id}`)
    load()
  }

  const totalPages = Math.max(1, Math.ceil(total / PER_PAGE))
  const from = total === 0 ? 0 : (page - 1) * PER_PAGE + 1
  const to = Math.min(page * PER_PAGE, total)

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-title">Bài viết</div>
          <div className="page-sub">Bao gồm bài viết thường và đánh giá sản phẩm ({total} bài)</div>
        </div>
        <Link to="/posts/new" className="btn-accent">+ Thêm bài viết</Link>
      </div>

      <div style={{ marginBottom: 16 }}>
        <input
          type="search"
          className="form-control"
          style={{ maxWidth: 320 }}
          placeholder="Tìm theo tiêu đề, mô tả..."
          value={q}
          onChange={e => setQ(e.target.value)}
        />
      </div>

      {loading ? (
        <div className="admin-loading">Đang tải...</div>
      ) : items.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">✍</div>
          <div className="empty-state-text">
            {q ? `Không tìm thấy bài viết nào khớp "${q}"` : 'Chưa có bài viết nào. Thêm bài viết đầu tiên!'}
          </div>
        </div>
      ) : (
        <>
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Bài viết</th>
                  <th>Chuyên mục</th>
                  <th>Loại</th>
                  <th>Lượt xem</th>
                  <th>Trạng thái</th>
                  <th>Ngày đăng</th>
                  <th>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {items.map(p => (
                  <tr key={p.id}>
                    <td>
                      <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                        {p.thumbnail && <img src={p.thumbnail} alt={p.title} className="thumb" />}
                        <div>
                          <div style={{ fontWeight: 600 }}>{p.title}{!!p.featured && <span className="badge badge-published" style={{ marginLeft: 6 }}>Nổi bật</span>}</div>
                          <div style={{ fontSize: 12, color: 'var(--text-3)' }}>/{p.slug}</div>
                        </div>
                      </div>
                    </td>
                    <td>{p.category_name ?? '—'}</td>
                    <td>{p.review_score !== null ? `⭐ ${p.review_score}/10` : 'Bài viết'}</td>
                    <td>{p.views.toLocaleString('vi-VN')}</td>
                    <td><span className={`badge badge-${p.status}`}>{p.status === 'published' ? 'Đang hiện' : 'Ẩn'}</span></td>
                    <td style={{ fontSize: 12, color: 'var(--text-3)' }}>{new Date(p.created_at).toLocaleDateString('vi-VN')}</td>
                    <td>
                      <div style={{ display: 'flex', gap: 8 }}>
                        <Link to={`/posts/${p.id}/edit`} className="btn-ghost btn-sm">Sửa</Link>
                        <button onClick={() => handleDelete(p.id)} className="btn-danger btn-sm">Xóa</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 16, flexWrap: 'wrap', gap: 12 }}>
            <div style={{ fontSize: 13, color: 'var(--text-3)' }}>Hiển thị {from}–{to} trong số {total} bài viết</div>
            <div className="admin-pagination" style={{ display: 'flex', gap: 6 }}>
              <button className="admin-page-btn btn-ghost btn-sm" disabled={page <= 1} onClick={() => setPage(p => p - 1)}>← Trước</button>
              <span style={{ fontSize: 13, padding: '5px 10px', color: 'var(--text-2)' }}>Trang {page}/{totalPages}</span>
              <button className="admin-page-btn btn-ghost btn-sm" disabled={page >= totalPages} onClick={() => setPage(p => p + 1)}>Sau →</button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
