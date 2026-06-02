import { useEffect, useState, FormEvent } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import { api } from '../../api/client'

interface Category { id: number; name: string }

export default function PostForm() {
  const { id }     = useParams<{ id: string }>()
  const navigate   = useNavigate()
  const isEdit     = !!id

  const [form, setForm] = useState({
    title: '', slug: '', content: '', excerpt: '',
    thumbnail: '', category_id: '', status: 'draft',
    featured: false, meta_title: '', meta_description: '',
  })
  const [categories, setCats] = useState<Category[]>([])
  const [busy, setBusy]       = useState(false)
  const [error, setError]     = useState('')

  useEffect(() => {
    api.get<Category[]>('/categories').then(setCats).catch(() => {})
    if (isEdit) {
      api.get<typeof form & { id: number }>('/posts/' + id)
        .then(p => setForm({
          title: p.title, slug: p.slug, content: p.content || '',
          excerpt: p.excerpt || '', thumbnail: p.thumbnail || '',
          category_id: p.category_id ? String(p.category_id) : '',
          status: p.status, featured: !!p.featured,
          meta_title: p.meta_title || '', meta_description: p.meta_description || '',
        }))
        .catch(() => navigate('/posts'))
    }
  }, [id])

  function set(key: string, val: string | boolean) {
    setForm(f => ({ ...f, [key]: val }))
  }

  async function submit(e: FormEvent) {
    e.preventDefault()
    setError('')
    setBusy(true)
    try {
      const body = { ...form, category_id: form.category_id ? parseInt(form.category_id) : null }
      if (isEdit) await api.put('/posts/' + id, body)
      else await api.post('/posts', body)
      navigate('/posts')
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Lưu thất bại')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div style={{ maxWidth: 760 }}>
      <div className="page-hd">
        <h2>{isEdit ? 'Chỉnh sửa bài viết' : 'Tạo bài viết mới'}</h2>
        <Link to="/posts" className="btn-ghost">← Quay lại</Link>
      </div>

      <form onSubmit={submit}>
        {error && <div className="login-error" style={{ marginBottom: 16 }}>{error}</div>}

        <div className="admin-card" style={{ marginBottom: 16 }}>
          <div className="row g-3">
            <div className="col-12">
              <label className="form-label">Tiêu đề *</label>
              <input className="form-input" value={form.title} onChange={e => set('title', e.target.value)} required />
            </div>
            <div className="col-12">
              <label className="form-label">Slug</label>
              <input className="form-input" value={form.slug} onChange={e => set('slug', e.target.value)} placeholder="Tự tạo từ tiêu đề nếu để trống" />
            </div>
            <div className="col-12">
              <label className="form-label">Nội dung</label>
              <textarea className="form-textarea" style={{ minHeight: 220 }} value={form.content} onChange={e => set('content', e.target.value)} />
            </div>
            <div className="col-12">
              <label className="form-label">Tóm tắt</label>
              <textarea className="form-textarea" style={{ minHeight: 80 }} value={form.excerpt} onChange={e => set('excerpt', e.target.value)} />
            </div>
          </div>
        </div>

        <div className="admin-card" style={{ marginBottom: 16 }}>
          <div className="row g-3">
            <div className="col-md-6">
              <label className="form-label">Danh mục</label>
              <select className="form-select" value={form.category_id} onChange={e => set('category_id', e.target.value)}>
                <option value="">— Không có —</option>
                {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div className="col-md-6">
              <label className="form-label">Trạng thái</label>
              <select className="form-select" value={form.status} onChange={e => set('status', e.target.value)}>
                <option value="draft">Nháp</option>
                <option value="published">Đã đăng</option>
              </select>
            </div>
            <div className="col-12">
              <label className="form-label">URL ảnh đại diện</label>
              <input className="form-input" value={form.thumbnail} onChange={e => set('thumbnail', e.target.value)} placeholder="https://..." />
            </div>
            <div className="col-12">
              <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: 13.5 }}>
                <input type="checkbox" checked={form.featured} onChange={e => set('featured', e.target.checked)} />
                Bài viết nổi bật
              </label>
            </div>
          </div>
        </div>

        <div className="admin-card" style={{ marginBottom: 20 }}>
          <div style={{ fontWeight: 500, fontSize: 13, marginBottom: 12 }}>SEO</div>
          <div className="row g-3">
            <div className="col-12">
              <label className="form-label">Meta Title</label>
              <input className="form-input" value={form.meta_title} onChange={e => set('meta_title', e.target.value)} />
            </div>
            <div className="col-12">
              <label className="form-label">Meta Description</label>
              <textarea className="form-textarea" style={{ minHeight: 70 }} value={form.meta_description} onChange={e => set('meta_description', e.target.value)} />
            </div>
          </div>
        </div>

        <div className="d-flex gap-2">
          <button className="btn-accent" type="submit" disabled={busy}>
            {busy ? 'Đang lưu...' : isEdit ? 'Lưu thay đổi' : 'Tạo bài viết'}
          </button>
          <Link to="/posts" className="btn-ghost">Hủy</Link>
        </div>
      </form>
    </div>
  )
}
