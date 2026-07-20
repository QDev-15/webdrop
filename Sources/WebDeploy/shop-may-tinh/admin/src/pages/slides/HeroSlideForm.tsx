import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { api } from '../../api/client'
import ImageField from '../../components/ImageField'

interface SlideForm {
  title: string
  subtitle: string
  button_text: string
  button_link: string
  image: string
  sort_order: number
  status: string
}

const empty: SlideForm = {
  title: '', subtitle: '', button_text: '', button_link: '',
  image: '', sort_order: 0, status: 'published',
}

export default function HeroSlideForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [form, setForm] = useState<SlideForm>(empty)
  const [loading, setLoading] = useState(!!id)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const isEdit = !!id

  useEffect(() => {
    if (!id) return
    api.get<SlideForm & { id: number }>(`/hero-slides/${id}`)
      .then(d => setForm({ title: d.title, subtitle: d.subtitle ?? '', button_text: d.button_text ?? '', button_link: d.button_link ?? '', image: d.image ?? '', sort_order: d.sort_order ?? 0, status: d.status ?? 'published' }))
      .catch(() => setError('Khong tim thay slide.'))
      .finally(() => setLoading(false))
  }, [id])

  function set<K extends keyof SlideForm>(k: K, v: SlideForm[K]) {
    setForm(f => ({ ...f, [k]: v }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    if (!form.title.trim()) { setError('Tieu de la bat buoc.'); return }
    setSaving(true)
    try {
      if (isEdit) {
        await api.put(`/hero-slides/${id}`, form)
      } else {
        await api.post('/hero-slides', form)
      }
      navigate('/slides')
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Luu that bai.')
    } finally { setSaving(false) }
  }

  if (loading) return <div className="admin-loading">Dang tai...</div>

  return (
    <div style={{ maxWidth: 640 }}>
      <div className="page-header">
        <div>
          <div className="page-title">{isEdit ? 'Chinh sua Slide' : 'Them Slide moi'}</div>
        </div>
        <button onClick={() => navigate('/slides')} className="btn-ghost">Quay lai</button>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      <form onSubmit={handleSubmit} className="card">
        <div className="form-group">
          <label className="form-label">Tieu de *</label>
          <input type="text" className="form-control" value={form.title} onChange={e => set('title', e.target.value)} placeholder="Tieu de chinh cua slide" required />
        </div>
        <div className="form-group">
          <label className="form-label">Mo ta</label>
          <textarea className="form-control" value={form.subtitle} onChange={e => set('subtitle', e.target.value)} placeholder="Noi dung mo ta slide" />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <div className="form-group">
            <label className="form-label">Chu nut</label>
            <input type="text" className="form-control" value={form.button_text} onChange={e => set('button_text', e.target.value)} placeholder="Vd: Dat ban ngay" />
          </div>
          <div className="form-group">
            <label className="form-label">Lien ket nut</label>
            <input type="text" className="form-control" value={form.button_link} onChange={e => set('button_link', e.target.value)} placeholder="/dat-ban" />
          </div>
        </div>
        <div className="form-group">
          <ImageField label="Anh slide" value={form.image} onChange={v => set('image', v)} />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <div className="form-group">
            <label className="form-label">Thu tu hien thi</label>
            <input type="number" className="form-control" value={form.sort_order} onChange={e => set('sort_order', parseInt(e.target.value) || 0)} min={0} />
          </div>
          <div className="form-group">
            <label className="form-label">Trang thai</label>
            <select className="form-control" value={form.status} onChange={e => set('status', e.target.value)}>
              <option value="published">Dang hien</option>
              <option value="draft">An</option>
            </select>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end', paddingTop: 16, borderTop: '1px solid var(--border-light)' }}>
          <button type="button" onClick={() => navigate('/slides')} className="btn-ghost">Huy</button>
          <button type="submit" className="btn-accent" disabled={saving}>{saving ? 'Dang luu...' : (isEdit ? 'Cap nhat' : 'Them moi')}</button>
        </div>
      </form>
    </div>
  )
}
