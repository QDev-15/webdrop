import { useState, useEffect } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import { api } from '../../api/client'
import ImageField from '../../components/ImageField'

export default function ArticleForm() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const isEdit = !!id

  const [form, setForm] = useState({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    thumbnail: '',
    tag: '',
    read_time: '',
    status: 'published',
    sort_order: '0',
  })
  const [loading, setLoading] = useState(isEdit)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!isEdit) return
    api.get<Record<string, unknown>>(`/articles/${id}`)
      .then(data => {
        setForm({
          title: String(data.title ?? ''),
          slug: String(data.slug ?? ''),
          excerpt: String(data.excerpt ?? ''),
          content: String(data.content ?? ''),
          thumbnail: String(data.thumbnail ?? ''),
          tag: String(data.tag ?? ''),
          read_time: String(data.read_time ?? ''),
          status: String(data.status ?? 'published'),
          sort_order: String(data.sort_order ?? '0'),
        })
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [id, isEdit])

  function set(key: string, val: string) {
    setForm(f => ({ ...f, [key]: val }))
  }

  function autoSlug(title: string) {
    return title.toLowerCase()
      .normalize('NFD').replace(/[̀-ͯ]/g, '')
      .replace(/đ/g, 'd').replace(/[^a-z0-9\s-]/g, '')
      .trim().replace(/\s+/g, '-')
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.title) { setError('Tiêu đề bài viết là bắt buộc.'); return }
    setSaving(true); setError('')
    try {
      const payload = {
        ...form,
        slug: form.slug || autoSlug(form.title),
        sort_order: Number(form.sort_order),
      }
      if (isEdit) {
        await api.put(`/articles/${id}`, payload)
      } else {
        await api.post('/articles', payload)
      }
      navigate('/articles')
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Lưu thất bại.')
    } finally { setSaving(false) }
  }

  if (loading) return <div className="admin-loading">Đang tải...</div>

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-title">{isEdit ? 'Chỉnh sửa bài viết' : 'Thêm bài viết mới'}</div>
          <div className="page-sub">
            <Link to="/articles" style={{ color: 'var(--accent)' }}>← Cẩm nang cha mẹ</Link>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} style={{ maxWidth: 720 }}>
        {error && <div className="alert alert-error" style={{ marginBottom: 16 }}>{error}</div>}

        <div className="card" style={{ marginBottom: 24 }}>
          <div style={{ display: 'grid', gap: 16 }}>
            <div className="form-group" style={{ margin: 0 }}>
              <label htmlFor="ar-title" className="form-label">
                Tiêu đề <span style={{ color: 'var(--danger)' }}>*</span>
              </label>
              <input id="ar-title" type="text" className="form-control"
                placeholder="5 thói quen chăm sóc răng cho bé..."
                value={form.title}
                onChange={e => {
                  set('title', e.target.value)
                  if (!isEdit) set('slug', autoSlug(e.target.value))
                }}
                required />
            </div>
            <div className="form-group" style={{ margin: 0 }}>
              <label htmlFor="ar-slug" className="form-label">Slug URL</label>
              <input id="ar-slug" type="text" className="form-control"
                placeholder="5-thoi-quen-cham-soc-rang"
                value={form.slug} onChange={e => set('slug', e.target.value)} />
            </div>
            <div className="form-group" style={{ margin: 0 }}>
              <label htmlFor="ar-excerpt" className="form-label">Tóm tắt</label>
              <textarea id="ar-excerpt" className="form-control" rows={2}
                placeholder="Mô tả ngắn về bài viết..."
                value={form.excerpt} onChange={e => set('excerpt', e.target.value)} />
            </div>
            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label">Ảnh đại diện</label>
              <ImageField value={form.thumbnail} onChange={val => set('thumbnail', val)} placeholder="https://..." />
            </div>
            <div className="form-group" style={{ margin: 0 }}>
              <label htmlFor="ar-content" className="form-label">Nội dung</label>
              <textarea id="ar-content" className="form-control" rows={10}
                placeholder="Nội dung bài viết đầy đủ..."
                value={form.content} onChange={e => set('content', e.target.value)} />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
              <div className="form-group" style={{ margin: 0 }}>
                <label htmlFor="ar-tag" className="form-label">Tag</label>
                <input id="ar-tag" type="text" className="form-control" placeholder="Dinh dưỡng"
                  value={form.tag} onChange={e => set('tag', e.target.value)} />
              </div>
              <div className="form-group" style={{ margin: 0 }}>
                <label htmlFor="ar-readtime" className="form-label">Thời gian đọc</label>
                <input id="ar-readtime" type="text" className="form-control" placeholder="5 phút đọc"
                  value={form.read_time} onChange={e => set('read_time', e.target.value)} />
              </div>
              <div className="form-group" style={{ margin: 0 }}>
                <label htmlFor="ar-status" className="form-label">Trạng thái</label>
                <select id="ar-status" className="form-control"
                  value={form.status} onChange={e => set('status', e.target.value)}>
                  <option value="published">Đã xuất bản</option>
                  <option value="draft">Bản nháp</option>
                </select>
              </div>
            </div>
            <div className="form-group" style={{ margin: 0 }}>
              <label htmlFor="ar-order" className="form-label">Thứ tự</label>
              <input id="ar-order" type="number" className="form-control"
                value={form.sort_order} onChange={e => set('sort_order', e.target.value)} style={{ maxWidth: 120 }} />
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 12 }}>
          <button type="submit" className="btn-accent" disabled={saving}>
            {saving ? 'Đang lưu...' : isEdit ? '💾 Lưu thay đổi' : '+ Thêm bài viết'}
          </button>
          <Link to="/articles" className="btn-ghost">Hủy</Link>
        </div>
      </form>
    </div>
  )
}
