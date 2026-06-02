import { useEffect, useState, FormEvent } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import { api } from '../../api/client'

export default function PageForm() {
  const { id }   = useParams<{ id: string }>()
  const navigate = useNavigate()
  const isEdit   = !!id

  const [form, setForm] = useState({
    title: '', slug: '', content: '', template: '',
    meta_title: '', meta_description: '', status: 'draft',
  })
  const [busy, setBusy]   = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (isEdit) {
      api.get<typeof form & { id: number }>('/pages/' + id)
        .then(p => setForm({
          title: p.title, slug: p.slug, content: p.content || '',
          template: p.template || '', meta_title: p.meta_title || '',
          meta_description: p.meta_description || '', status: p.status,
        }))
        .catch(() => navigate('/pages'))
    }
  }, [id])

  function set(key: string, val: string) { setForm(f => ({ ...f, [key]: val })) }

  async function submit(e: FormEvent) {
    e.preventDefault(); setError(''); setBusy(true)
    try {
      if (isEdit) await api.put('/pages/' + id, form)
      else await api.post('/pages', form)
      navigate('/pages')
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Lưu thất bại')
    } finally { setBusy(false) }
  }

  return (
    <div style={{ maxWidth: 760 }}>
      <div className="page-hd">
        <h2>{isEdit ? 'Chỉnh sửa trang' : 'Tạo trang mới'}</h2>
        <Link to="/pages" className="btn-ghost">← Quay lại</Link>
      </div>
      <form onSubmit={submit}>
        {error && <div className="login-error" style={{ marginBottom: 16 }}>{error}</div>}
        <div className="admin-card" style={{ marginBottom: 16 }}>
          <div className="row g-3">
            <div className="col-12">
              <label className="form-label">Tiêu đề *</label>
              <input className="form-input" value={form.title} onChange={e => set('title', e.target.value)} required />
            </div>
            <div className="col-md-6">
              <label className="form-label">Slug</label>
              <input className="form-input" value={form.slug} onChange={e => set('slug', e.target.value)} placeholder="Tự tạo từ tiêu đề nếu để trống" />
            </div>
            <div className="col-md-6">
              <label className="form-label">Template</label>
              <input className="form-input" value={form.template} onChange={e => set('template', e.target.value)} placeholder="default" />
            </div>
            <div className="col-md-6">
              <label className="form-label">Trạng thái</label>
              <select className="form-select" value={form.status} onChange={e => set('status', e.target.value)}>
                <option value="draft">Nháp</option>
                <option value="published">Đã đăng</option>
              </select>
            </div>
            <div className="col-12">
              <label className="form-label">Nội dung</label>
              <textarea className="form-textarea" style={{ minHeight: 200 }} value={form.content} onChange={e => set('content', e.target.value)} />
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
            {busy ? 'Đang lưu...' : isEdit ? 'Lưu thay đổi' : 'Tạo trang'}
          </button>
          <Link to="/pages" className="btn-ghost">Hủy</Link>
        </div>
      </form>
    </div>
  )
}
