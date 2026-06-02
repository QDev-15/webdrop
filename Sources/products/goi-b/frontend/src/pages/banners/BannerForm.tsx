import { useEffect, useState, FormEvent } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import { api } from '../../api/client'

const POSITIONS = ['homepage_hero', 'homepage_popup', 'sidebar', 'footer']

export default function BannerForm() {
  const { id }   = useParams<{ id: string }>()
  const navigate = useNavigate()
  const isEdit   = !!id

  const [form, setForm] = useState({
    title: '', image: '', link: '', target: '_self',
    position: 'homepage_hero', sort_order: '0', status: 'published',
  })
  const [busy, setBusy]   = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (isEdit) {
      api.get<typeof form & { id: number }>('/banners/' + id)
        .then(b => setForm({
          title: b.title, image: b.image, link: b.link || '',
          target: b.target, position: b.position,
          sort_order: String(b.sort_order), status: b.status,
        }))
        .catch(() => navigate('/banners'))
    }
  }, [id])

  function set(k: string, v: string) { setForm(f => ({ ...f, [k]: v })) }

  async function submit(e: FormEvent) {
    e.preventDefault(); setError(''); setBusy(true)
    try {
      const body = { ...form, sort_order: parseInt(form.sort_order) || 0 }
      if (isEdit) await api.put('/banners/' + id, body)
      else await api.post('/banners', body)
      navigate('/banners')
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Lưu thất bại')
    } finally { setBusy(false) }
  }

  return (
    <div style={{ maxWidth: 560 }}>
      <div className="page-hd">
        <h2>{isEdit ? 'Chỉnh sửa banner' : 'Tạo banner mới'}</h2>
        <Link to="/banners" className="btn-ghost">← Quay lại</Link>
      </div>
      <form onSubmit={submit}>
        {error && <div className="login-error" style={{ marginBottom: 16 }}>{error}</div>}
        <div className="admin-card">
          <div className="row g-3">
            <div className="col-12">
              <label className="form-label">Tiêu đề *</label>
              <input className="form-input" value={form.title} onChange={e => set('title', e.target.value)} required />
            </div>
            <div className="col-12">
              <label className="form-label">URL ảnh *</label>
              <input className="form-input" value={form.image} onChange={e => set('image', e.target.value)} placeholder="https://..." required />
              {form.image && (
                <img src={form.image} alt="preview" style={{ marginTop: 8, maxHeight: 100, borderRadius: 6, objectFit: 'cover' }} />
              )}
            </div>
            <div className="col-12">
              <label className="form-label">Link khi nhấn</label>
              <input className="form-input" value={form.link} onChange={e => set('link', e.target.value)} placeholder="https://..." />
            </div>
            <div className="col-md-6">
              <label className="form-label">Mở link</label>
              <select className="form-select" value={form.target} onChange={e => set('target', e.target.value)}>
                <option value="_self">Cùng tab</option>
                <option value="_blank">Tab mới</option>
              </select>
            </div>
            <div className="col-md-6">
              <label className="form-label">Vị trí</label>
              <select className="form-select" value={form.position} onChange={e => set('position', e.target.value)}>
                {POSITIONS.map(p => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>
            <div className="col-md-6">
              <label className="form-label">Thứ tự hiển thị</label>
              <input className="form-input" type="number" min={0} value={form.sort_order} onChange={e => set('sort_order', e.target.value)} />
            </div>
            <div className="col-md-6">
              <label className="form-label">Trạng thái</label>
              <select className="form-select" value={form.status} onChange={e => set('status', e.target.value)}>
                <option value="published">Hiện</option>
                <option value="draft">Ẩn</option>
              </select>
            </div>
          </div>
        </div>
        <div className="d-flex gap-2 mt-3">
          <button className="btn-accent" type="submit" disabled={busy}>
            {busy ? 'Đang lưu...' : isEdit ? 'Lưu thay đổi' : 'Tạo banner'}
          </button>
          <Link to="/banners" className="btn-ghost">Hủy</Link>
        </div>
      </form>
    </div>
  )
}
