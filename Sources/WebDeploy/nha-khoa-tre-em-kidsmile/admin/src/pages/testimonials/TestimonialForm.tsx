import { useState, useEffect } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import { api } from '../../api/client'

export default function TestimonialForm() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const isEdit = !!id

  const [form, setForm] = useState({
    author_name: '',
    author_meta: '',
    author_avatar: '',
    content: '',
    rating: '5',
    is_featured: true,
    sort_order: '0',
  })
  const [loading, setLoading] = useState(isEdit)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!isEdit) return
    api.get<Record<string, unknown>>(`/testimonials/${id}`)
      .then(data => {
        setForm({
          author_name: String(data.author_name ?? ''),
          author_meta: String(data.author_meta ?? ''),
          author_avatar: String(data.author_avatar ?? ''),
          content: String(data.content ?? ''),
          rating: String(data.rating ?? '5'),
          is_featured: Boolean(data.is_featured),
          sort_order: String(data.sort_order ?? '0'),
        })
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [id, isEdit])

  function set(key: string, val: string | boolean) {
    setForm(f => ({ ...f, [key]: val }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.author_name || !form.content) {
      setError('Tên phụ huynh và nội dung là bắt buộc.')
      return
    }
    setSaving(true); setError('')
    try {
      const payload = {
        ...form,
        rating: Number(form.rating),
        sort_order: Number(form.sort_order),
        is_featured: form.is_featured ? 1 : 0,
      }
      if (isEdit) {
        await api.put(`/testimonials/${id}`, payload)
      } else {
        await api.post('/testimonials', payload)
      }
      navigate('/testimonials')
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Lưu thất bại.')
    } finally { setSaving(false) }
  }

  if (loading) return <div className="admin-loading">Đang tải...</div>

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-title">{isEdit ? 'Chỉnh sửa đánh giá' : 'Thêm đánh giá mới'}</div>
          <div className="page-sub">
            <Link to="/testimonials" style={{ color: 'var(--accent)' }}>← Danh sách đánh giá</Link>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} style={{ maxWidth: 640 }}>
        {error && <div className="alert alert-error" style={{ marginBottom: 16 }}>{error}</div>}

        <div className="card" style={{ marginBottom: 24 }}>
          <div style={{ display: 'grid', gap: 16 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div className="form-group" style={{ margin: 0 }}>
                <label htmlFor="rv-name" className="form-label">
                  Tên phụ huynh <span style={{ color: 'var(--danger)' }}>*</span>
                </label>
                <input id="rv-name" type="text" className="form-control"
                  placeholder="Lê Thị Hồng Nhung"
                  value={form.author_name} onChange={e => set('author_name', e.target.value)} required />
              </div>
              <div className="form-group" style={{ margin: 0 }}>
                <label htmlFor="rv-meta" className="form-label">Thông tin bé</label>
                <input id="rv-meta" type="text" className="form-control"
                  placeholder="Mẹ bé Bảo An, 5 tuổi"
                  value={form.author_meta} onChange={e => set('author_meta', e.target.value)} />
              </div>
            </div>
            <div className="form-group" style={{ margin: 0 }}>
              <label htmlFor="rv-avatar" className="form-label">URL ảnh đại diện</label>
              <input id="rv-avatar" type="text" className="form-control"
                placeholder="https://images.unsplash.com/..."
                value={form.author_avatar} onChange={e => set('author_avatar', e.target.value)} />
            </div>
            <div className="form-group" style={{ margin: 0 }}>
              <label htmlFor="rv-content" className="form-label">
                Nội dung đánh giá <span style={{ color: 'var(--danger)' }}>*</span>
              </label>
              <textarea id="rv-content" className="form-control" rows={4}
                value={form.content} onChange={e => set('content', e.target.value)} required />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div className="form-group" style={{ margin: 0 }}>
                <label htmlFor="rv-rating" className="form-label">Số sao</label>
                <select id="rv-rating" className="form-control"
                  value={form.rating} onChange={e => set('rating', e.target.value)}>
                  {[5, 4, 3, 2, 1].map(n => <option key={n} value={n}>{n} ★</option>)}
                </select>
              </div>
              <div className="form-group" style={{ margin: 0 }}>
                <label htmlFor="rv-order" className="form-label">Thứ tự</label>
                <input id="rv-order" type="number" className="form-control"
                  value={form.sort_order} onChange={e => set('sort_order', e.target.value)} />
              </div>
            </div>
            <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }}>
              <input type="checkbox" checked={form.is_featured}
                onChange={e => set('is_featured', e.target.checked)} />
              <span className="form-label" style={{ margin: 0 }}>Hiển thị trên trang chủ</span>
            </label>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 12 }}>
          <button type="submit" className="btn-accent" disabled={saving}>
            {saving ? 'Đang lưu...' : isEdit ? '💾 Lưu thay đổi' : '+ Thêm đánh giá'}
          </button>
          <Link to="/testimonials" className="btn-ghost">Hủy</Link>
        </div>
      </form>
    </div>
  )
}
