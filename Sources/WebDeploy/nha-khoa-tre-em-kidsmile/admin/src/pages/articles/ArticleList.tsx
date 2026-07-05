import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../../api/client'

interface Article {
  id: number
  title: string
  slug: string
  tag: string
  read_time: string
  status: string
  sort_order: number
}

export default function ArticleList() {
  const [articles, setArticles] = useState<Article[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => { load() }, [])

  async function load() {
    try { setArticles(await api.get<Article[]>('/articles')) }
    finally { setLoading(false) }
  }

  async function handleDelete(id: number) {
    if (!confirm('Xóa bài viết này?')) return
    await api.delete(`/articles/${id}`)
    load()
  }

  if (loading) return <div className="admin-loading">Đang tải...</div>

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-title">Cẩm nang cha mẹ</div>
          <div className="page-sub">{articles.length} bài viết</div>
        </div>
        <Link to="/articles/new" className="btn-accent">+ Thêm bài viết</Link>
      </div>

      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Tiêu đề</th>
              <th>Tag</th>
              <th>Thời gian đọc</th>
              <th>Trạng thái</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {articles.map(a => (
              <tr key={a.id}>
                <td>
                  <div style={{ fontWeight: 500 }}>{a.title}</div>
                  <div style={{ fontSize: 12, color: 'var(--text-3)' }}>{a.slug}</div>
                </td>
                <td>
                  {a.tag
                    ? <span className="badge badge-published">{a.tag}</span>
                    : <span style={{ color: 'var(--text-3)', fontSize: 12 }}>—</span>
                  }
                </td>
                <td style={{ fontSize: 12, color: 'var(--text-2)' }}>{a.read_time || '—'}</td>
                <td>
                  {a.status === 'published'
                    ? <span className="badge badge-confirmed">Đã xuất bản</span>
                    : <span className="badge badge-draft">Bản nháp</span>
                  }
                </td>
                <td>
                  <div style={{ display: 'flex', gap: 6 }}>
                    <Link to={`/articles/${a.id}/edit`} className="btn-ghost btn-sm">Sửa</Link>
                    <button onClick={() => handleDelete(a.id)} className="btn-danger btn-sm">Xóa</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {articles.length === 0 && (
          <div className="empty-state">
            <div className="empty-state-icon">📚</div>
            <div className="empty-state-text">Chưa có bài viết nào trong cẩm nang.</div>
          </div>
        )}
      </div>
    </div>
  )
}
